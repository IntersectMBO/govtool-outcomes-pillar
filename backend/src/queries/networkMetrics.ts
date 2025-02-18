export const getNetworkMetrics = `
WITH DRepActivity AS (
    SELECT
        drep_activity AS drep_activity,
        epoch_no AS epoch_no
    FROM
        epoch_param
    WHERE
        epoch_no IS NOT NULL
    ORDER BY
        epoch_no DESC
    LIMIT 1
),
DRepDistr AS (
    SELECT
        drep_distr.*,
        ROW_NUMBER() OVER (PARTITION BY drep_hash.id ORDER BY drep_distr.epoch_no DESC) AS rn
    FROM
        drep_distr
        JOIN drep_hash ON drep_hash.id = drep_distr.hash_id
),
CurrentEpoch AS (
    SELECT MAX(no) AS no FROM epoch
),
CommitteeMembers AS (
    SELECT DISTINCT ON (cm.committee_hash_id)
        cr.id,
        block.time,
        encode(cold_key_hash.raw, 'hex') cold_key,
        encode(hot_key_hash.raw, 'hex') hot_key
    FROM committee_registration cr
    JOIN tx ON tx.id = cr.tx_id
    JOIN block ON block.id = tx.block_id
    JOIN committee_hash cold_key_hash ON cr.cold_key_id = cold_key_hash.id
    JOIN committee_hash hot_key_hash ON cr.hot_key_id = hot_key_hash.id
    JOIN committee_member cm ON cm.committee_hash_id = cold_key_hash.id OR cm.committee_hash_id = hot_key_hash.id
    LEFT JOIN committee_de_registration cdr ON cdr.cold_key_id = cold_key_hash.id
    CROSS JOIN CurrentEpoch
    WHERE
        cdr.id IS NULL AND cm.expiration_epoch > CurrentEpoch.no 
),
NoOfCommitteeMembers AS (
    SELECT COUNT(*) total FROM CommitteeMembers
),
ActiveDRepBoundaryEpoch AS (
    SELECT epoch_no - drep_activity AS epoch_no FROM DRepActivity
),
LatestVotingProcedure AS (
    SELECT
        vp.*,
        ROW_NUMBER() OVER (PARTITION BY drep_voter ORDER BY tx_id DESC) AS rn
    FROM
        voting_procedure vp
),
LatestVoteEpoch AS (
    SELECT
        block.epoch_no,
        lvp.drep_voter AS drep_id
    FROM
        LatestVotingProcedure lvp
        JOIN tx ON tx.id = lvp.tx_id
        JOIN block ON block.id = tx.block_id
    WHERE
        lvp.rn = 1
),
RankedDRepRegistration AS (
    SELECT
        dr.id,
        dr.drep_hash_id,
        dr.deposit,
        dr.voting_anchor_id,
        ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS rn,
        encode(tx.hash, 'hex') AS tx_hash,
        block.epoch_no
    FROM
        drep_registration dr
    JOIN tx ON tx.id = dr.tx_id
    JOIN block ON block.id = tx.block_id
),
TotalStakeControlledByActiveDReps AS (
    SELECT
        COALESCE(SUM(dd.amount), 0)::bigint AS total
    FROM
        drep_hash dh
    LEFT JOIN DRepDistr dd ON dd.hash_id = dh.id AND dd.rn = 1
    LEFT JOIN RankedDRepRegistration rd ON dd.hash_id = rd.drep_hash_id AND rd.rn = 1
    LEFT JOIN LatestVoteEpoch lve ON lve.drep_id = dh.id
    CROSS JOIN DRepActivity
    WHERE
        dd.epoch_no = (SELECT no FROM CurrentEpoch)
        AND COALESCE(rd.deposit, 0) >= 0
        AND ((DRepActivity.epoch_no - GREATEST(COALESCE(lve.epoch_no, 0), COALESCE(rd.epoch_no, 0))) <= DRepActivity.drep_activity)
),
AlwaysAbstainVotingPower AS (
    SELECT COALESCE((SELECT amount FROM drep_hash
        LEFT JOIN drep_distr ON drep_hash.id = drep_distr.hash_id
        WHERE drep_hash.view = 'drep_always_abstain'
        ORDER BY epoch_no DESC LIMIT 1), 0) AS amount
),
AlwaysNoConfidenceVotingPower AS (
    SELECT COALESCE((SELECT amount FROM drep_hash
        LEFT JOIN drep_distr ON drep_hash.id = drep_distr.hash_id
        WHERE drep_hash.view = 'drep_always_no_confidence'
        ORDER BY epoch_no DESC LIMIT 1), 0) AS amount
),
LatestGovAction AS (
    SELECT gap.id, gap.enacted_epoch
    FROM gov_action_proposal gap
    JOIN CurrentEpoch ce ON gap.enacted_epoch < ce.no
    ORDER BY gap.id DESC
    LIMIT 1
),
CommitteeThreshold AS (
    SELECT
        c.*
    FROM committee c
    LEFT JOIN LatestGovAction lga ON c.gov_action_proposal_id = lga.id
    WHERE (c.gov_action_proposal_id IS NOT NULL AND lga.id IS NOT NULL)
        OR (c.gov_action_proposal_id IS NULL)
)
SELECT
    CurrentEpoch.no AS epoch_no,
    COALESCE(TotalStakeControlledByActiveDReps.total, 0) + COALESCE(AlwaysNoConfidenceVotingPower.amount, 0) AS total_stake_controlled_by_active_dreps,
    AlwaysAbstainVotingPower.amount AS always_abstain_voting_power,
    AlwaysNoConfidenceVotingPower.amount AS always_no_confidence_voting_power,
    NoOfCommitteeMembers.total AS no_of_committee_members,
    CommitteeThreshold.quorum_numerator,
    CommitteeThreshold.quorum_denominator
FROM CurrentEpoch
CROSS JOIN TotalStakeControlledByActiveDReps
CROSS JOIN AlwaysAbstainVotingPower
CROSS JOIN AlwaysNoConfidenceVotingPower
CROSS JOIN NoOfCommitteeMembers
CROSS JOIN CommitteeThreshold;
`