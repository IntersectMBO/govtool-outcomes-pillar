export const getGovernanceActions = `
WITH LatestDrepDistr AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY hash_id ORDER BY epoch_no DESC) AS rn
    FROM
        drep_distr
),
LatestEpoch AS (
    SELECT
        start_time,
        no
    FROM
        epoch
    ORDER BY
        no DESC
    LIMIT 1
),
EpochBlocks AS (
    SELECT DISTINCT ON (epoch_no)
        epoch_no,
        time as block_time
    FROM
        block
    ORDER BY
        epoch_no, time DESC
),
CommitteeData AS (
    SELECT DISTINCT ON (ch.raw)
        encode(ch.raw, 'hex') AS hash,
        cm.expiration_epoch,
        ch.has_script
    FROM
        committee_member cm
    JOIN committee_hash ch ON cm.committee_hash_id = ch.id
    ORDER BY
        ch.raw, cm.expiration_epoch DESC
),
ParsedDescription AS (
    SELECT
        gov_action_proposal.id,
        description->'tag' AS tag,
        description->'contents'->1 AS members_to_be_removed,
        description->'contents'->2 AS members,
        description->'contents'->3 AS threshold
    FROM
        gov_action_proposal
    WHERE
        gov_action_proposal.type = 'NewCommittee'
),
MembersToBeRemoved AS (
    SELECT
        id,
        json_agg(VALUE->>'keyHash') AS members_to_be_removed
    FROM
        ParsedDescription pd,
        json_array_elements(members_to_be_removed::json) AS value
    GROUP BY
        id
),
ProcessedCurrentMembers AS (
    SELECT
        pd.id,
        json_agg(
            json_build_object(
                'hash', regexp_replace(kv.key, '^keyHash-', ''),
                'newExpirationEpoch', kv.value::int
            )
        ) AS current_members
    FROM
        ParsedDescription pd,
        jsonb_each_text(pd.members) AS kv(key, value)
    GROUP BY
        pd.id
),
EnrichedCurrentMembers AS (
    SELECT
        pcm.id,
        json_agg(
            json_build_object(
                'hash', cm.hash,
                'expirationEpoch', cm.expiration_epoch,
                'hasScript', cm.has_script,
                'newExpirationEpoch', (member->>'newExpirationEpoch')::int
            )
        ) AS enriched_members
    FROM
        ProcessedCurrentMembers pcm
    LEFT JOIN LATERAL
        json_array_elements(pcm.current_members) AS member ON true
    LEFT JOIN
        CommitteeData cm ON cm.hash = member->>'hash'
    GROUP BY
        pcm.id
),
VoteCounts AS (
    SELECT 
        gov_action_proposal_id,
        COUNT(CASE WHEN vote = 'Yes' THEN 1 END) as yes_votes,
        COUNT(CASE WHEN vote = 'No' THEN 1 END) as no_votes,
        COUNT(CASE WHEN vote = 'Abstain' THEN 1 END) as abstain_votes
    FROM voting_procedure
    WHERE invalid IS NULL
    GROUP BY gov_action_proposal_id
),
RankedProposals AS (
    SELECT
        gov_action_proposal.id,
        encode(creator_tx.hash, 'hex') AS tx_hash,
        gov_action_proposal.index,
        gov_action_proposal.type::text,
        COALESCE(vc.yes_votes, 0) as yes_votes,
        COALESCE(vc.no_votes, 0) as no_votes,
        COALESCE(vc.abstain_votes, 0) as abstain_votes,
        creator_block.time,
        creator_block.epoch_no,
        ROW_NUMBER() OVER (
            PARTITION BY gov_action_proposal.id
            ORDER BY creator_block.epoch_no DESC, creator_block.time DESC
        ) as rn
    FROM
        gov_action_proposal
        LEFT JOIN tx AS creator_tx ON creator_tx.id = gov_action_proposal.tx_id
        LEFT JOIN block AS creator_block ON creator_block.id = creator_tx.block_id
        LEFT JOIN VoteCounts vc ON vc.gov_action_proposal_id = gov_action_proposal.id
)
SELECT 
    rp.id,
    rp.tx_hash,
    rp.index,
    rp.type,
    rp.yes_votes,
    rp.no_votes,
    rp.abstain_votes,
    COALESCE(
        CASE
            WHEN gov_action_proposal.type = 'TreasuryWithdrawals' THEN
                (
                    SELECT json_agg(
                        jsonb_build_object(
                            'receivingAddress', stake_address.view,
                            'amount', treasury_withdrawal.amount
                        )
                    )
                    FROM treasury_withdrawal
                    LEFT JOIN stake_address
                        ON stake_address.id = treasury_withdrawal.stake_address_id
                    WHERE treasury_withdrawal.gov_action_proposal_id = gov_action_proposal.id
                )
            WHEN gov_action_proposal.type::text = 'InfoAction' THEN
                json_build_object('data', gov_action_proposal.description)
            WHEN gov_action_proposal.type::text = 'HardForkInitiation' THEN
                json_build_object(
                    'major', (gov_action_proposal.description->'contents'->1->>'major')::int,
                    'minor', (gov_action_proposal.description->'contents'->1->>'minor')::int
                )
            WHEN gov_action_proposal.type::text = 'ParameterChange' THEN
                json_build_object('data', gov_action_proposal.description->'contents')
            WHEN gov_action_proposal.type::text = 'NewConstitution' THEN
                json_build_object(
                    'anchor', gov_action_proposal.description->'contents'->1->'anchor'
                )
            WHEN gov_action_proposal.type::text = 'NewCommittee' THEN
                (
                    SELECT
                        json_build_object(
                            'tag', pd.tag,
                            'members', em.enriched_members,
                            'membersToBeRemoved', mtr.members_to_be_removed,
                            'threshold', (pd.threshold->'contents'->3)::float
                        )
                    FROM
                        ParsedDescription pd
                    JOIN
                        MembersToBeRemoved mtr ON pd.id = mtr.id
                    JOIN
                        EnrichedCurrentMembers em ON pd.id = em.id
                    WHERE
                        pd.id = gov_action_proposal.id
                )
            ELSE NULL
        END, '{}'::JSON
    ) AS description,
    CASE
        WHEN meta.network_name::text IN ('mainnet', 'preprod') THEN
            latest_epoch.start_time + (gov_action_proposal.expiration - latest_epoch.no)::bigint * INTERVAL '5 days'
        ELSE
            latest_epoch.start_time + (gov_action_proposal.expiration - latest_epoch.no)::bigint * INTERVAL '1 day'
    END AS expiry_date,
    gov_action_proposal.expiration,
    rp.time,
    rp.epoch_no,
    voting_anchor.url,
    encode(voting_anchor.data_hash, 'hex') AS data_hash,
    jsonb_set(
        ROW_TO_JSON(proposal_params)::jsonb,
        '{cost_model}',
        CASE
            WHEN cost_model.id IS NOT NULL THEN
                ROW_TO_JSON(cost_model)::jsonb
            ELSE
                'null'::jsonb
        END
    ) AS proposal_params,
    off_chain_vote_gov_action_data.title,
    off_chain_vote_gov_action_data.abstract,
    JSON_BUILD_OBJECT(
        'ratified_epoch', gov_action_proposal.ratified_epoch,
        'enacted_epoch', gov_action_proposal.enacted_epoch,
        'dropped_epoch', gov_action_proposal.dropped_epoch,
        'expired_epoch', gov_action_proposal.expired_epoch
    ) AS status,
    JSON_BUILD_OBJECT(
        'ratified_time', ratified_block.block_time,
        'enacted_time', enacted_block.block_time,
        'dropped_time', dropped_block.block_time,
        'expired_time', expired_block.block_time
    ) AS status_times
FROM
    RankedProposals rp
    JOIN gov_action_proposal ON gov_action_proposal.id = rp.id
    CROSS JOIN LatestEpoch AS latest_epoch
    CROSS JOIN meta
    LEFT JOIN voting_anchor ON voting_anchor.id = gov_action_proposal.voting_anchor_id
    LEFT JOIN off_chain_vote_data ON off_chain_vote_data.voting_anchor_id = voting_anchor.id
    LEFT JOIN off_chain_vote_gov_action_data ON off_chain_vote_gov_action_data.off_chain_vote_data_id = off_chain_vote_data.id
    LEFT JOIN param_proposal AS proposal_params ON gov_action_proposal.param_proposal = proposal_params.id
    LEFT JOIN cost_model ON proposal_params.cost_model_id = cost_model.id
    LEFT JOIN EpochBlocks ratified_block ON ratified_block.epoch_no = gov_action_proposal.ratified_epoch
    LEFT JOIN EpochBlocks enacted_block ON enacted_block.epoch_no = gov_action_proposal.enacted_epoch
    LEFT JOIN EpochBlocks dropped_block ON dropped_block.epoch_no = gov_action_proposal.dropped_epoch
    LEFT JOIN EpochBlocks expired_block ON expired_block.epoch_no = gov_action_proposal.expired_epoch
WHERE
    rp.rn = 1
    AND (COALESCE($1, '') = '' OR
    off_chain_vote_gov_action_data.title ILIKE '%' || $1 || '%' OR
    off_chain_vote_gov_action_data.abstract ILIKE '%' || $1 || '%' OR
    concat(rp.tx_hash, '#', rp.index) ILIKE '%' || $1 || '%')
AND (
    WITH 
    status_conditions AS (
        SELECT
            (
                gov_action_proposal.ratified_epoch IS NULL AND
                gov_action_proposal.enacted_epoch IS NULL AND
                gov_action_proposal.dropped_epoch IS NULL AND
                gov_action_proposal.expired_epoch IS NULL
            ) AS is_live,
            gov_action_proposal.expired_epoch IS NOT NULL AS is_expired,
            gov_action_proposal.ratified_epoch IS NOT NULL AS is_ratified,
            gov_action_proposal.enacted_epoch IS NOT NULL AS is_enacted,
            EXISTS (
                SELECT 1
                FROM unnest($2::text[]) AS filter
                WHERE filter NOT IN ('expired', 'ratified', 'enacted', 'live')
            ) AS has_type_filters,
            
            'expired' = ANY($2::text[]) AS filter_expired,
            'ratified' = ANY($2::text[]) AS filter_ratified,
            'enacted' = ANY($2::text[]) AS filter_enacted,
            'live' = ANY($2::text[]) AS filter_live,
            EXISTS (
                SELECT 1
                FROM unnest($2::text[]) AS filter
                WHERE filter IN ('expired', 'ratified', 'enacted', 'live')
            ) AS has_status_filters,
            CASE 
                WHEN EXISTS (
                    SELECT 1
                    FROM unnest($2::text[]) AS filter
                    WHERE filter NOT IN ('expired', 'ratified', 'enacted', 'live')
                ) THEN
                    gov_action_proposal.type::text = ANY($2::text[])
                ELSE
                    TRUE
            END AS type_filter_matches
    )
    SELECT
        CASE
            WHEN ARRAY_LENGTH($2::text[], 1) IS NULL OR ARRAY_LENGTH($2::text[], 1) = 0 THEN
                NOT is_live
            ELSE
                (
                    type_filter_matches
                    AND
                    (
                        (NOT has_status_filters AND (filter_live OR NOT is_live))  
                        OR
                        (
                            has_status_filters
                            AND
                            (
                                (filter_expired AND is_expired) OR
                                (filter_ratified AND is_ratified) OR
                                (filter_enacted AND is_enacted) OR
                                (filter_live AND is_live)
                            )
                        )
                    )
                )
        END
    FROM status_conditions
)
ORDER BY
    CASE WHEN $3 = 'oldestFirst' THEN
        rp.epoch_no
    END ASC,
    
    CASE WHEN $3 = 'highestYesVotes' THEN
        rp.yes_votes
    END DESC,

    CASE WHEN $3 = 'newestFirst' OR $3 IS NULL THEN
        rp.epoch_no
    END DESC,
    rp.time DESC,
    rp.id DESC
OFFSET $4 LIMIT $5`;
