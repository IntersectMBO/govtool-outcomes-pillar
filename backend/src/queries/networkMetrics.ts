export const getNetworkMetrics = `
WITH CurrentEpoch AS (
    SELECT 
        COALESCE($1::integer, (SELECT MAX(no) FROM epoch)) AS no
),
DRepActivity AS (
    SELECT drep_activity
    FROM epoch_param ep, CurrentEpoch ce
    WHERE ep.epoch_no <= ce.no
    ORDER BY ep.epoch_no DESC
    LIMIT 1
),
ActiveCommittees AS (
    SELECT DISTINCT cr.cold_key_id
    FROM committee_registration cr
    JOIN tx cr_tx ON cr_tx.id = cr.tx_id
    JOIN block cr_block ON cr_block.id = cr_tx.block_id
    LEFT JOIN committee_de_registration cdr 
           ON cdr.cold_key_id = cr.cold_key_id
    LEFT JOIN tx cdr_tx ON cdr_tx.id = cdr.tx_id
    LEFT JOIN block cdr_block ON cdr_block.id = cdr_tx.block_id
    CROSS JOIN CurrentEpoch ce
    WHERE cr_block.epoch_no <= ce.no
      AND (cdr.id IS NULL OR cdr_block.epoch_no > ce.no)
),
NoOfCommittees AS (
    SELECT COUNT(*) AS total FROM ActiveCommittees
),
LatestVotingProcedure AS (
    SELECT DISTINCT ON (vp.drep_voter) 
        vp.drep_voter, tx.id as tx_id, block.epoch_no
    FROM voting_procedure vp
    JOIN tx ON tx.id = vp.tx_id
    JOIN block ON block.id = tx.block_id
    CROSS JOIN CurrentEpoch ce
    WHERE block.epoch_no <= ce.no
    ORDER BY vp.drep_voter, tx.id DESC
),
RankedDRepRegistration AS (
    SELECT DISTINCT ON (dr.drep_hash_id)
        dr.id,
        dr.drep_hash_id,
        dr.deposit,
        dr.voting_anchor_id,
        encode(tx.hash, 'hex') AS tx_hash,
        block.epoch_no
    FROM drep_registration dr
    JOIN tx ON tx.id = dr.tx_id
    JOIN block ON block.id = tx.block_id
    CROSS JOIN CurrentEpoch ce
    WHERE block.epoch_no <= ce.no
    ORDER BY dr.drep_hash_id, dr.tx_id DESC
),
DRepDistr AS (
    SELECT DISTINCT ON (dd.hash_id)
        dd.hash_id,
        dd.amount,
        dd.epoch_no
    FROM drep_distr dd
    CROSS JOIN CurrentEpoch ce
    WHERE dd.epoch_no <= ce.no
    ORDER BY dd.hash_id, dd.epoch_no DESC
),
PoolStats AS (
    SELECT DISTINCT ON (ps.pool_hash_id)
        ps.pool_hash_id,
        ps.voting_power
    FROM pool_stat ps
    CROSS JOIN CurrentEpoch ce
    WHERE ps.epoch_no <= ce.no
    ORDER BY ps.pool_hash_id, ps.epoch_no DESC
),
TotalStakeControlledByActiveDReps AS (
    SELECT COALESCE(SUM(dd.amount),0)::bigint AS total
    FROM drep_hash dh
    LEFT JOIN DRepDistr dd ON dd.hash_id = dh.id
    LEFT JOIN RankedDRepRegistration rd ON rd.drep_hash_id = dh.id
    CROSS JOIN CurrentEpoch ce
    WHERE dd.epoch_no <= ce.no
      AND COALESCE(rd.deposit,0) >= 0
      AND dh.view NOT IN ('drep_always_abstain', 'drep_always_no_confidence')
),
TotalStakeControlledByStakePools AS (
    SELECT COALESCE(SUM(ps.voting_power),0)::bigint AS total
    FROM PoolStats ps
),
AlwaysAbstainVotingPower AS (
    SELECT COALESCE((
        SELECT dd.amount
        FROM drep_hash
        JOIN drep_distr dd ON drep_hash.id = dd.hash_id
        CROSS JOIN CurrentEpoch ce
        WHERE drep_hash.view = 'drep_always_abstain'
          AND dd.epoch_no <= ce.no
        ORDER BY dd.epoch_no DESC 
        LIMIT 1
    ),0) AS amount
),
AlwaysNoConfidenceVotingPower AS (
    SELECT COALESCE((
        SELECT dd.amount
        FROM drep_hash
        JOIN drep_distr dd ON drep_hash.id = dd.hash_id
        CROSS JOIN CurrentEpoch ce
        WHERE drep_hash.view = 'drep_always_no_confidence'
          AND dd.epoch_no <= ce.no
        ORDER BY dd.epoch_no DESC 
        LIMIT 1
    ),0) AS amount
),
LatestPoolDelegations AS (
    SELECT DISTINCT ON (ph.id)
        ph.id AS pool_hash_id,
        dh.view AS drep_view
    FROM delegation_vote dv
    JOIN tx dv_tx ON dv.tx_id = dv_tx.id
    JOIN block dv_block ON dv_tx.block_id = dv_block.id
    JOIN stake_address sa ON dv.addr_id = sa.id
    JOIN pool_owner po ON po.addr_id = sa.id
    JOIN pool_update pu ON pu.id = po.pool_update_id
    JOIN pool_hash ph ON pu.hash_id = ph.id
    JOIN drep_hash dh ON dv.drep_hash_id = dh.id
    CROSS JOIN CurrentEpoch ce
    WHERE dv_block.epoch_no <= ce.no
    ORDER BY ph.id, dv_block.epoch_no DESC, dv_tx.id DESC
),
SPOsAbstainVotingPower AS (
    SELECT COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM LatestPoolDelegations lpd
    JOIN PoolStats ps ON ps.pool_hash_id = lpd.pool_hash_id
    WHERE lpd.drep_view = 'drep_always_abstain'
),
SPOsNoConfidenceVotingPower AS (
    SELECT COALESCE(SUM(ps.voting_power), 0)::bigint AS total
    FROM LatestPoolDelegations lpd
    JOIN PoolStats ps ON ps.pool_hash_id = lpd.pool_hash_id
    WHERE lpd.drep_view = 'drep_always_no_confidence'
),
LatestGovAction AS (
    SELECT gap.id, gap.enacted_epoch
    FROM gov_action_proposal gap, CurrentEpoch ce
    WHERE gap.enacted_epoch <= ce.no
    ORDER BY gap.id DESC
    LIMIT 1
),
CommitteeThreshold AS (
    SELECT c.*
    FROM committee c
    LEFT JOIN LatestGovAction lga ON c.gov_action_proposal_id = lga.id
    WHERE (c.gov_action_proposal_id IS NULL OR lga.id IS NOT NULL)
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
