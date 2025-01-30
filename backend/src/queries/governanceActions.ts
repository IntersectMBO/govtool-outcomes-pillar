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
        CommitteeData cm ON cm.hash = encode(decode(member->>'hash', 'hex'), 'hex')
    GROUP BY
        pcm.id
)
SELECT
    gov_action_proposal.id,
    encode(creator_tx.hash, 'hex') AS tx_hash,
    gov_action_proposal.index,
    gov_action_proposal.type::text,
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
                            'threshold', pd.threshold::float
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
    creator_block.time,
    creator_block.epoch_no,
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
    gov_action_proposal.ratified_epoch,
    gov_action_proposal.enacted_epoch,
    gov_action_proposal.dropped_epoch,
    gov_action_proposal.expired_epoch
FROM
    gov_action_proposal
    CROSS JOIN LatestEpoch AS latest_epoch
    CROSS JOIN meta
    LEFT JOIN tx AS creator_tx ON creator_tx.id = gov_action_proposal.tx_id
    LEFT JOIN block AS creator_block ON creator_block.id = creator_tx.block_id
    LEFT JOIN voting_anchor ON voting_anchor.id = gov_action_proposal.voting_anchor_id
    LEFT JOIN off_chain_vote_data ON off_chain_vote_data.voting_anchor_id = voting_anchor.id
    LEFT JOIN off_chain_vote_gov_action_data ON off_chain_vote_gov_action_data.off_chain_vote_data_id = off_chain_vote_data.id
    LEFT JOIN param_proposal AS proposal_params ON gov_action_proposal.param_proposal = proposal_params.id
    LEFT JOIN cost_model ON proposal_params.cost_model_id = cost_model.id`;
