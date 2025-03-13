export const getGovernanceAction = `
WITH ActionEpoch AS (
    SELECT
        gov_action_proposal.id,
        CASE
            WHEN gov_action_proposal.ratified_epoch IS NOT NULL THEN gov_action_proposal.ratified_epoch
            WHEN gov_action_proposal.enacted_epoch IS NOT NULL THEN gov_action_proposal.enacted_epoch
            WHEN gov_action_proposal.expired_epoch IS NOT NULL THEN gov_action_proposal.expired_epoch
            WHEN gov_action_proposal.dropped_epoch IS NOT NULL THEN gov_action_proposal.dropped_epoch
            ELSE (SELECT MAX(no) FROM epoch)
        END AS relevant_epoch_no
    FROM
        gov_action_proposal
    WHERE
        concat(encode((SELECT hash FROM tx WHERE tx.id = gov_action_proposal.tx_id), 'hex'), '#', gov_action_proposal.index) ILIKE $1
),
LatestDrepDistr AS (
    SELECT
        dd.*,
        ROW_NUMBER() OVER (PARTITION BY dd.hash_id ORDER BY dd.epoch_no DESC) AS rn
    FROM
        drep_distr dd
    JOIN
        ActionEpoch ae ON dd.epoch_no <= ae.relevant_epoch_no
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
RelevantEpoch AS (
    SELECT 
        e.start_time AS start_time,
        ae.relevant_epoch_no AS no
    FROM 
        ActionEpoch ae
    JOIN 
        epoch e ON e.no = ae.relevant_epoch_no
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
DRepVotingPower AS (
    SELECT
        SUM(CASE WHEN drep_hash.view = 'drep_always_no_confidence' THEN amount ELSE 0 END) AS no_confidence,
        SUM(CASE WHEN drep_hash.view = 'drep_always_abstain' THEN amount ELSE 0 END) AS abstain
    FROM
        drep_hash
    LEFT JOIN drep_distr ON drep_hash.id = drep_distr.hash_id 
    JOIN ActionEpoch ae ON drep_distr.epoch_no = ae.relevant_epoch_no
    WHERE drep_hash.view IN ('drep_always_no_confidence', 'drep_always_abstain')
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
    LEFT JOIN
     json_array_elements(pcm.current_members) AS member ON true
    LEFT JOIN CommitteeData cm 
        ON (CASE 
            WHEN (member->>'hash') ~ '^[0-9a-fA-F]+$' 
            THEN encode(decode(member->>'hash', 'hex'), 'hex') 
            ELSE NULL 
        END) = cm.hash
    GROUP BY
        pcm.id
),
RankedPoolVotes AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY vp.pool_voter, vp.gov_action_proposal_id ORDER BY vp.tx_id DESC) AS rn
    FROM
        voting_procedure vp
    WHERE 
        vp.pool_voter IS NOT NULL
),
PoolVotes AS (
    SELECT
        rpv.gov_action_proposal_id,
        ps.epoch_no,
        SUM(CASE WHEN rpv.vote = 'Yes' THEN ps.voting_power ELSE 0 END) AS poolYesVotes,
        SUM(CASE WHEN rpv.vote = 'No' THEN ps.voting_power ELSE 0 END) AS poolNoVotes,
        SUM(CASE WHEN rpv.vote = 'Abstain' THEN ps.voting_power ELSE 0 END) AS poolAbstainVotes
    FROM 
        RankedPoolVotes rpv
    JOIN 
        pool_stat ps
        ON rpv.pool_voter = ps.pool_hash_id
    JOIN
        ActionEpoch ae ON ps.epoch_no = ae.relevant_epoch_no
    WHERE
        rpv.rn = 1
    GROUP BY
        rpv.gov_action_proposal_id, ps.epoch_no
),
RankedDRepVotes AS (
    SELECT DISTINCT ON (vp.drep_voter, vp.gov_action_proposal_id)
        *
    FROM 
        voting_procedure vp
    ORDER BY 
        vp.drep_voter,
        vp.gov_action_proposal_id,
        vp.tx_id DESC
),
RankedDRepRegistration AS (
    SELECT DISTINCT ON (dr.drep_hash_id)
        *
    FROM 
        drep_registration dr
    ORDER BY 
        dr.drep_hash_id,
        dr.tx_id DESC
),
CommitteeVotes AS (
    SELECT
        gov_action_proposal_id,
        SUM(CASE WHEN vote = 'Yes' THEN 1 ELSE 0 END) AS ccYesVotes,
        SUM(CASE WHEN vote = 'No' THEN 1 ELSE 0 END) AS ccNoVotes,
        SUM(CASE WHEN vote = 'Abstain' THEN 1 ELSE 0 END) AS ccAbstainVotes
    FROM
        voting_procedure AS vp
    WHERE
        vp.committee_voter IS NOT NULL
        AND (vp.tx_id, vp.committee_voter, vp.gov_action_proposal_id) IN (
            SELECT MAX(tx_id), committee_voter, gov_action_proposal_id
            FROM voting_procedure
            WHERE committee_voter IS NOT NULL
            GROUP BY committee_voter, gov_action_proposal_id
        )
    GROUP BY
        gov_action_proposal_id
)
SELECT
    gov_action_proposal.id,
    encode(creator_tx.hash, 'hex') tx_hash,
    gov_action_proposal.index,
    gov_action_proposal.type::text,
    COALESCE(
        CASE WHEN gov_action_proposal.type = 'TreasuryWithdrawals' THEN
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

            WHEN gov_action_proposal.type::text = 'NoConfidence' THEN
            json_build_object('data', gov_action_proposal.description->'contents')

            WHEN gov_action_proposal.type::text = 'ParameterChange' THEN
            json_build_object('data', gov_action_proposal.description->'contents')

            WHEN gov_action_proposal.type::text = 'NewConstitution' THEN
            json_build_object(
                'anchor', gov_action_proposal.description->'contents'->1->'anchor',
                'script', gov_action_proposal.description->'contents'->1->'script'
            )
            WHEN gov_action_proposal.type::text = 'NewCommittee' THEN
            (
                SELECT
                    json_build_object(
                        'tag', pd.tag,
                        'members', em.enriched_members,
                        'membersToBeRemoved', mtr.members_to_be_removed,
                        'threshold', 
                            CASE 
                                WHEN (pd.threshold->>'numerator') IS NOT NULL 
                                AND (pd.threshold->>'denominator') IS NOT NULL 
                                THEN (pd.threshold->>'numerator')::float / (pd.threshold->>'denominator')::float
                                ELSE NULL 
                            END
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
        ELSE
            NULL
        END
    , '{}'::JSON) AS description,
    CASE
        WHEN meta.network_name::text = 'mainnet' OR meta.network_name::text = 'preprod' THEN
            latest_epoch.start_time + (gov_action_proposal.expiration - latest_epoch.no)::bigint * INTERVAL '5 days'
        ELSE
            latest_epoch.start_time + (gov_action_proposal.expiration - latest_epoch.no)::bigint * INTERVAL '1 day'
    END AS expiry_date,
    gov_action_proposal.expiration,
    creator_block.time,
    creator_block.epoch_no,
    voting_anchor.url,
    encode(voting_anchor.data_hash, 'hex') data_hash,
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
    off_chain_vote_gov_action_data.motivation,
    off_chain_vote_gov_action_data.rationale,
    COALESCE(SUM(ldd_drep.amount) FILTER (WHERE rdv.vote::text = 'Yes'), 0) + (
        CASE WHEN gov_action_proposal.type = 'NoConfidence' THEN
            drep_voting_power.no_confidence
        ELSE
            0
        END) yes_votes,
    COALESCE(SUM(ldd_drep.amount) FILTER (WHERE rdv.vote::text = 'No'), 0) + (
        CASE WHEN gov_action_proposal.type = 'NoConfidence' THEN
            0
        ELSE
            drep_voting_power.no_confidence
        END) no_votes,
    COALESCE(SUM(ldd_drep.amount) FILTER (WHERE rdv.vote::text = 'Abstain'), 0) abstain_votes,
    COALESCE(ps.poolYesVotes, 0) pool_yes_votes,
    COALESCE(ps.poolNoVotes, 0) pool_no_votes,
    COALESCE(ps.poolAbstainVotes, 0) pool_abstain_votes,
    COALESCE(cv.ccYesVotes, 0) cc_yes_votes,
    COALESCE(cv.ccNoVotes, 0) cc_no_votes,
    COALESCE(cv.ccAbstainVotes, 0) cc_abstain_votes,
    prev_gov_action.index as prev_gov_action_index,
    encode(prev_gov_action_tx.hash, 'hex') as prev_gov_action_tx_hash,
    ae.relevant_epoch_no AS used_epoch_no,
    JSON_BUILD_OBJECT(
        'ratified_epoch', gov_action_proposal.ratified_epoch,
        'enacted_epoch', gov_action_proposal.enacted_epoch,
        'dropped_epoch', gov_action_proposal.dropped_epoch,
        'expired_epoch', gov_action_proposal.expired_epoch
    ) AS status,
    JSON_BUILD_OBJECT(
        'ratified_time', MAX(ratified_block.block_time),
        'enacted_time', MAX(enacted_block.block_time),
        'dropped_time', MAX(dropped_block.block_time),
        'expired_time', MAX(expired_block.block_time)
    ) AS status_times
FROM
    gov_action_proposal
    JOIN ActionEpoch ae ON gov_action_proposal.id = ae.id
    CROSS JOIN LatestEpoch AS latest_epoch
    CROSS JOIN DRepVotingPower AS drep_voting_power
    CROSS JOIN meta
    LEFT JOIN tx AS creator_tx ON creator_tx.id = gov_action_proposal.tx_id
    LEFT JOIN block AS creator_block ON creator_block.id = creator_tx.block_id
    LEFT JOIN voting_anchor ON voting_anchor.id = gov_action_proposal.voting_anchor_id
    LEFT JOIN off_chain_vote_data ON off_chain_vote_data.voting_anchor_id = voting_anchor.id
    LEFT JOIN off_chain_vote_gov_action_data ON off_chain_vote_gov_action_data.off_chain_vote_data_id = off_chain_vote_data.id
    LEFT JOIN param_proposal AS proposal_params ON gov_action_proposal.param_proposal = proposal_params.id
    LEFT JOIN cost_model AS cost_model ON proposal_params.cost_model_id = cost_model.id
    LEFT JOIN PoolVotes ps ON gov_action_proposal.id = ps.gov_action_proposal_id
    LEFT JOIN CommitteeVotes cv ON gov_action_proposal.id = cv.gov_action_proposal_id
    LEFT JOIN RankedDRepVotes rdv ON rdv.gov_action_proposal_id = gov_action_proposal.id
    LEFT JOIN RankedDRepRegistration rdr ON rdr.drep_hash_id = rdv.drep_voter AND COALESCE(rdr.deposit, 0) >= 0
    LEFT JOIN LatestDrepDistr ldd_drep ON ldd_drep.hash_id = rdr.drep_hash_id AND ldd_drep.rn = 1
    LEFT JOIN gov_action_proposal AS prev_gov_action ON gov_action_proposal.prev_gov_action_proposal = prev_gov_action.id
    LEFT JOIN tx AS prev_gov_action_tx ON prev_gov_action.tx_id = prev_gov_action_tx.id
    LEFT JOIN EpochBlocks ratified_block ON ratified_block.epoch_no = gov_action_proposal.ratified_epoch
    LEFT JOIN EpochBlocks enacted_block ON enacted_block.epoch_no = gov_action_proposal.enacted_epoch
    LEFT JOIN EpochBlocks dropped_block ON dropped_block.epoch_no = gov_action_proposal.dropped_epoch
    LEFT JOIN EpochBlocks expired_block ON expired_block.epoch_no = gov_action_proposal.expired_epoch
WHERE
    concat(encode(creator_tx.hash, 'hex'), '#', gov_action_proposal.index) ILIKE $1
GROUP BY
    gov_action_proposal.id,
    creator_tx.hash,
    creator_block.id,
    latest_epoch.start_time,
    latest_epoch.no,
    drep_voting_power.no_confidence,
    drep_voting_power.abstain,
    cv.ccYesVotes,
    cv.ccNoVotes,
    cv.ccAbstainVotes,
    proposal_params,
    ps.poolYesVotes,
    ps.poolNoVotes,
    ps.poolAbstainVotes,
    meta.network_name,
    voting_anchor.url,
    voting_anchor.data_hash,
    prev_gov_action.index,
    prev_gov_action_tx.hash,
    off_chain_vote_gov_action_data.title,
    off_chain_vote_gov_action_data.abstract,
    off_chain_vote_gov_action_data.motivation,
    off_chain_vote_gov_action_data.rationale,
    ae.relevant_epoch_no;
`;
