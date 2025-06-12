export const governanceActionVotesQuery = `
WITH TargetAction AS (
    -- Find the specific governance action proposal
    SELECT 
        gap.id,
        gap.tx_id,
        gap.index
    FROM gov_action_proposal gap
    JOIN tx ON tx.id = gap.tx_id
    WHERE concat(encode(tx.hash, 'hex'), '#', gap.index) ILIKE $1
),
LatestVotes AS (
    -- Get the latest vote for each voter (in case they voted multiple times)
    SELECT 
        vp.*,
        ROW_NUMBER() OVER (
            PARTITION BY vp.voter_role, 
                        COALESCE(vp.committee_voter, vp.drep_voter, vp.pool_voter)
            ORDER BY vp.tx_id DESC, vp.index DESC
        ) as rn
    FROM voting_procedure vp
    JOIN TargetAction ta ON vp.gov_action_proposal_id = ta.id
),
VotesWithPower AS (
    -- Join votes with voting power and voter identity
    SELECT 
        lv.voter_role,
        lv.vote,
        lv.tx_id,
        lv.id,
        
        -- Voter identity based on role
        CASE 
            WHEN lv.voter_role = 'ConstitutionalCommittee' THEN 
                encode(ch.raw, 'hex')
            WHEN lv.voter_role = 'DRep' THEN 
                COALESCE(dh.view, encode(dh.raw, 'hex'))
            WHEN lv.voter_role = 'SPO' THEN 
                COALESCE(ph.view, encode(ph.hash_raw, 'hex'))
        END AS voter_identity,
        
        -- Voting power based on role and vote epoch
        CASE 
            WHEN lv.voter_role = 'DRep' THEN dd.amount
            WHEN lv.voter_role = 'SPO' THEN ps.voting_power
            ELSE NULL  -- Committee members have null voting power
        END AS voting_power,
        
        -- Transaction and block info
        b.epoch_no as vote_epoch,
        b.time as vote_time
        
    FROM LatestVotes lv
    JOIN tx vote_tx ON vote_tx.id = lv.tx_id
    JOIN block b ON b.id = vote_tx.block_id
    
    -- Left joins for voter identity tables
    LEFT JOIN committee_hash ch ON ch.id = lv.committee_voter
    LEFT JOIN drep_hash dh ON dh.id = lv.drep_voter  
    LEFT JOIN pool_hash ph ON ph.id = lv.pool_voter
    
    -- Left join for DRep voting power at the epoch the vote was cast
    LEFT JOIN drep_distr dd ON dd.hash_id = lv.drep_voter 
        AND dd.epoch_no = b.epoch_no
        AND lv.voter_role = 'DRep'
    
    -- Left join for SPO voting power at the epoch the vote was cast
    LEFT JOIN pool_stat ps ON ps.pool_hash_id = lv.pool_voter
        AND ps.epoch_no = b.epoch_no
        AND lv.voter_role = 'SPO'
    
    WHERE lv.rn = 1  -- Only latest vote per voter
)

-- Final result
SELECT
    id, 
    voter_role,
    voter_identity,
    vote,
    voting_power,
    vote_epoch,
    vote_time
FROM VotesWithPower
ORDER BY 
    vote_time DESC,
    CASE voter_role 
        WHEN 'ConstitutionalCommittee' THEN 1
        WHEN 'DRep' THEN 2
        WHEN 'SPO' THEN 3
    END,
    voter_identity`;
