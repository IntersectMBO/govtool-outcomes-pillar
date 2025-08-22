export const getNetworkMetrics = `
WITH CurrentEpoch AS (
    SELECT 
        CASE 
            WHEN $1::integer IS NULL THEN (SELECT MAX(no) FROM epoch)
            ELSE $1::integer
        END AS no
),
DRepActivity AS (
    SELECT
        drep_activity AS drep_activity,
        epoch_no AS epoch_no
    FROM
        epoch_param
    CROSS JOIN CurrentEpoch
    WHERE
        epoch_no <= CurrentEpoch.no
        AND epoch_no IS NOT NULL
    ORDER BY
        epoch_no DESC
    LIMIT 1
),
ActiveCommittees AS (
    SELECT DISTINCT 
        cr.cold_key_id
    FROM committee_registration cr
    JOIN tx cr_tx ON cr_tx.id = cr.tx_id
    JOIN block cr_block ON cr_block.id = cr_tx.block_id
    LEFT JOIN committee_de_registration cdr ON cdr.cold_key_id = cr.cold_key_id
    LEFT JOIN tx cdr_tx ON cdr_tx.id = cdr.tx_id
    LEFT JOIN block cdr_block ON cdr_block.id = cdr_tx.block_id
    CROSS JOIN CurrentEpoch
    WHERE 
        cr_block.epoch_no <= CurrentEpoch.no
        AND (
            cdr.id IS NULL 
            OR 
            cdr_block.epoch_no > CurrentEpoch.no
        )
),
NoOfCommittees AS (
    SELECT COUNT(*) AS total FROM ActiveCommittees
),
LatestVotingProcedure AS (
    SELECT
        vp.*,
        ROW_NUMBER() OVER (PARTITION BY drep_voter ORDER BY tx_id DESC) AS rn
    FROM
        voting_procedure vp
    JOIN tx ON tx.id = vp.tx_id
    JOIN block ON block.id = tx.block_id
    CROSS JOIN CurrentEpoch
    WHERE
        block.epoch_no <= CurrentEpoch.no
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
    CROSS JOIN CurrentEpoch
    WHERE
        block.epoch_no <= CurrentEpoch.no
),
DRepDistr AS (
    SELECT
        drep_distr.*,
        ROW_NUMBER() OVER (
            PARTITION BY drep_distr.hash_id 
            ORDER BY drep_distr.epoch_no DESC
        ) AS rn
    FROM drep_distr
    CROSS JOIN CurrentEpoch
    WHERE drep_distr.epoch_no <= CurrentEpoch.no
),
PoolStats AS (
    SELECT
        ps.*,
        ROW_NUMBER() OVER (
            PARTITION BY ps.pool_hash_id 
            ORDER BY ps.epoch_no DESC
        ) AS rn
    FROM pool_stat ps
    CROSS JOIN CurrentEpoch
    WHERE ps.epoch_no <= CurrentEpoch.no
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
        AND ((CurrentEpoch.no - GREATEST(COALESCE(lve.epoch_no, 0), COALESCE(rd.epoch_no, 0))) <= DRepActivity.drep_activity)
        AND dh.view NOT IN ('drep_always_abstain', 'drep_always_no_confidence')
),
TotalStakeControlledByStakePools AS (
    SELECT
        COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM
        PoolStats ps
    WHERE
        ps.rn = 1
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
LatestPoolDelegations AS (
    SELECT
        ph.id AS pool_hash_id,
        dh.view AS drep_view,
        ROW_NUMBER() OVER (
            PARTITION BY ph.id 
            ORDER BY dv_block.epoch_no DESC, dv_tx.id DESC
        ) AS rn
    FROM delegation_vote dv
    JOIN tx dv_tx ON dv.tx_id = dv_tx.id
    JOIN block dv_block ON dv_tx.block_id = dv_block.id
    JOIN stake_address sa ON dv.addr_id = sa.id
    JOIN pool_owner po ON po.addr_id = sa.id
    JOIN pool_update pu ON pu.id = po.pool_update_id
    JOIN pool_hash ph ON pu.hash_id = ph.id
    JOIN drep_hash dh ON dv.drep_hash_id = dh.id
    CROSS JOIN CurrentEpoch
    WHERE dv_block.epoch_no <= CurrentEpoch.no
),
SPOsAbstainVotingPower AS (
    SELECT 
        COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM LatestPoolDelegations lpd
    JOIN PoolStats ps ON ps.pool_hash_id = lpd.pool_hash_id
    WHERE lpd.rn = 1
    AND lpd.drep_view = 'drep_always_abstain'
    AND ps.rn = 1
),
SPOsNoConfidenceVotingPower AS (
    SELECT 
        COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM LatestPoolDelegations lpd
    JOIN PoolStats ps ON ps.pool_hash_id = lpd.pool_hash_id
    WHERE lpd.rn = 1
    AND lpd.drep_view = 'drep_always_no_confidence'
    AND ps.rn = 1
),
LatestGovAction AS (
    SELECT gap.id, gap.enacted_epoch
    FROM gov_action_proposal gap
    JOIN CurrentEpoch ce ON gap.enacted_epoch <= ce.no
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
    COALESCE(TotalStakeControlledByActiveDReps.total, 0) + COALESCE(AlwaysNoConfidenceVotingPower.amount, 0) + COALESCE(AlwaysAbstainVotingPower.amount, 0) AS total_stake_controlled_by_active_dreps,
    COALESCE(TotalStakeControlledByStakePools.total, 0) AS total_stake_controlled_by_stake_pools,
    AlwaysAbstainVotingPower.amount AS always_abstain_voting_power,
    AlwaysNoConfidenceVotingPower.amount AS always_no_confidence_voting_power,
    SPOsAbstainVotingPower.total AS spos_abstain_voting_power,
    SPOsNoConfidenceVotingPower.total AS spos_no_confidence_voting_power,
    NoOfCommittees.total AS no_of_committee_members,
    CommitteeThreshold.quorum_numerator,
    CommitteeThreshold.quorum_denominator
FROM CurrentEpoch
CROSS JOIN TotalStakeControlledByActiveDReps
CROSS JOIN TotalStakeControlledByStakePools
CROSS JOIN AlwaysAbstainVotingPower
CROSS JOIN AlwaysNoConfidenceVotingPower
CROSS JOIN SPOsAbstainVotingPower
CROSS JOIN SPOsNoConfidenceVotingPower
CROSS JOIN NoOfCommittees
CROSS JOIN CommitteeThreshold`;
