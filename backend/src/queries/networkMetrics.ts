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
CurrentEpoch AS (
    SELECT 
        CASE 
            WHEN $1::integer IS NULL THEN (SELECT MAX(no) FROM epoch)
            ELSE $1::integer
        END AS no
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
DRepDistr AS (
    SELECT
        drep_distr.*,
        ROW_NUMBER() OVER (PARTITION BY drep_distr.hash_id ORDER BY 
            CASE 
                WHEN drep_distr.epoch_no <= CurrentEpoch.no THEN drep_distr.epoch_no 
                ELSE 0 
            END DESC
        ) AS rn
    FROM
        drep_distr
    CROSS JOIN CurrentEpoch
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
    CROSS JOIN CurrentEpoch
    WHERE
        dd.epoch_no <= CurrentEpoch.no
        AND COALESCE(rd.deposit, 0) >= 0
        AND ((DRepActivity.epoch_no - GREATEST(COALESCE(lve.epoch_no, 0), COALESCE(rd.epoch_no, 0))) <= DRepActivity.drep_activity)
),
TotalStakeControlledByStakePools AS (
    SELECT
        COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM
        pool_stat ps
    CROSS JOIN CurrentEpoch
    WHERE
        ps.epoch_no = CurrentEpoch.no
),
AlwaysAbstainVotingPower AS (
    SELECT COALESCE((
        SELECT amount FROM drep_hash
        LEFT JOIN drep_distr ON drep_hash.id = drep_distr.hash_id
        CROSS JOIN CurrentEpoch
        WHERE drep_hash.view = 'drep_always_abstain'
        AND drep_distr.epoch_no <= CurrentEpoch.no
        ORDER BY drep_distr.epoch_no DESC 
        LIMIT 1
    ), 0) AS amount
),
AlwaysNoConfidenceVotingPower AS (
    SELECT COALESCE((
        SELECT amount FROM drep_hash
        LEFT JOIN drep_distr ON drep_hash.id = drep_distr.hash_id
        CROSS JOIN CurrentEpoch
        WHERE drep_hash.view = 'drep_always_no_confidence'
        AND drep_distr.epoch_no <= CurrentEpoch.no
        ORDER BY drep_distr.epoch_no DESC 
        LIMIT 1
    ), 0) AS amount
),
SPOsAbstainVotingPower AS (
    SELECT 
        COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM (
        SELECT DISTINCT ph.id AS pool_hash_id
        FROM delegation_vote dv
        JOIN stake_address sa ON dv.addr_id = sa.id
        JOIN pool_owner po ON po.addr_id = sa.id
        JOIN pool_update pu ON pu.id = po.pool_update_id
        JOIN pool_hash ph ON pu.hash_id = ph.id
        JOIN drep_hash dh ON dv.drep_hash_id = dh.id
        WHERE dh.view = 'drep_always_abstain'
    ) unique_pools
    JOIN pool_stat ps ON ps.pool_hash_id = unique_pools.pool_hash_id
    CROSS JOIN CurrentEpoch
    WHERE ps.epoch_no = CurrentEpoch.no
),
SPOsNoConfidenceVotingPower AS (
    SELECT 
        COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM (
        SELECT DISTINCT ph.id AS pool_hash_id
        FROM delegation_vote dv
        JOIN stake_address sa ON dv.addr_id = sa.id
        JOIN pool_owner po ON po.addr_id = sa.id
        JOIN pool_update pu ON pu.id = po.pool_update_id
        JOIN pool_hash ph ON pu.hash_id = ph.id
        JOIN drep_hash dh ON dv.drep_hash_id = dh.id
        WHERE dh.view = 'drep_always_no_confidence'
    ) unique_pools
    JOIN pool_stat ps ON ps.pool_hash_id = unique_pools.pool_hash_id
    CROSS JOIN CurrentEpoch
    WHERE ps.epoch_no = CurrentEpoch.no
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
    COALESCE(TotalStakeControlledByStakePools.total, 0) AS total_stake_controlled_by_stake_pools,
    AlwaysAbstainVotingPower.amount AS always_abstain_voting_power,
    AlwaysNoConfidenceVotingPower.amount AS always_no_confidence_voting_power,
    SPOsAbstainVotingPower.total AS spos_abstain_voting_power,
    SPOsNoConfidenceVotingPower.total AS spos_no_confidence_voting_power,
    NoOfCommitteeMembers.total AS no_of_committee_members,
    CommitteeThreshold.quorum_numerator,
    CommitteeThreshold.quorum_denominator
FROM CurrentEpoch
CROSS JOIN TotalStakeControlledByActiveDReps
CROSS JOIN TotalStakeControlledByStakePools
CROSS JOIN AlwaysAbstainVotingPower
CROSS JOIN AlwaysNoConfidenceVotingPower
CROSS JOIN SPOsAbstainVotingPower
CROSS JOIN SPOsNoConfidenceVotingPower
CROSS JOIN NoOfCommitteeMembers
CROSS JOIN CommitteeThreshold`;
