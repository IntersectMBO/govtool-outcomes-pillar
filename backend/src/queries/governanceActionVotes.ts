export const governanceActionVotesQuery = `
WITH TargetAction AS (
    SELECT
        gap.id,
        gap.tx_id,
        gap.index
    FROM gov_action_proposal gap
    JOIN tx ON tx.id = gap.tx_id
    WHERE concat(encode(tx.hash, 'hex'), '#', gap.index) ILIKE $1
),
FilteredVotingProcedures AS (
    SELECT
        vp.*,
        ROW_NUMBER() OVER (
            PARTITION BY 
                vp.voter_role,
                vp.committee_voter,
                vp.drep_voter,
                vp.pool_voter
            ORDER BY vp.tx_id DESC, vp.index DESC
        ) as rn
    FROM voting_procedure vp
    JOIN TargetAction ta ON vp.gov_action_proposal_id = ta.id
    WHERE 
        ($2 = 'all_votes' OR LOWER(vp.vote::text) = $2)
        AND ($3 = 'all_voters' OR
            ($3 = 'dReps' AND vp.voter_role = 'DRep') OR
            ($3 = 'spos' AND vp.voter_role = 'SPO') OR
            ($3 = 'cc_embers' AND vp.voter_role = 'ConstitutionalCommittee')
        )
),
LatestDRepAnchor AS (
    SELECT
        dr.drep_hash_id,
        va.url,
        encode(va.data_hash, 'hex') AS metadata_hash,
        ocvdd.given_name,
        ocvdd.image_url,
        ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS rn
    FROM drep_registration dr
    JOIN voting_anchor va ON dr.voting_anchor_id = va.id
    JOIN off_chain_vote_data ocvd ON va.id = ocvd.voting_anchor_id
    JOIN off_chain_vote_drep_data ocvdd ON ocvdd.off_chain_vote_data_id = ocvd.id
    WHERE EXISTS (
        SELECT 1 FROM FilteredVotingProcedures fvp 
        WHERE fvp.voter_role = 'DRep' AND fvp.drep_voter = dr.drep_hash_id AND fvp.rn = 1
    )
),
LatestPoolMeta AS (
    SELECT
        pmr.pool_id,
        pmr.url,
        encode(pmr.hash, 'hex') AS metadata_hash,
        ocpd.ticker_name,
        ocpd.json AS metadata_json,
        ROW_NUMBER() OVER (PARTITION BY pmr.pool_id ORDER BY pmr.registered_tx_id DESC) AS rn
    FROM pool_metadata_ref pmr
    LEFT JOIN off_chain_pool_data ocpd ON pmr.id = ocpd.pmr_id
    WHERE EXISTS (
        SELECT 1 FROM FilteredVotingProcedures fvp 
        WHERE fvp.voter_role = 'SPO' AND fvp.pool_voter = pmr.pool_id AND fvp.rn = 1
    )
),
EnrichedVotes AS (
    SELECT
        fvp.id,
        fvp.voter_role,
        fvp.vote,
        fvp.tx_id,
        CASE
            WHEN fvp.voter_role = 'ConstitutionalCommittee' THEN encode(ch.raw, 'hex')
            WHEN fvp.voter_role = 'DRep' THEN COALESCE(encode(dh.raw, 'hex'), dh.view)
            WHEN fvp.voter_role = 'SPO' THEN COALESCE(ph.view, encode(ph.hash_raw, 'hex'))
        END AS voter_identity,
        CASE
            WHEN fvp.voter_role = 'ConstitutionalCommittee' THEN ch.has_script
            WHEN fvp.voter_role = 'DRep' THEN dh.has_script
            ELSE NULL
        END AS has_script,
        CASE
            WHEN fvp.voter_role = 'DRep' THEN dd.amount
            WHEN fvp.voter_role = 'SPO' THEN ps.voting_power
            ELSE NULL
        END AS voting_power,
        b.epoch_no as vote_epoch,
        b.time as vote_time,
        CASE WHEN fvp.voter_role = 'DRep' THEN lda.url END AS drep_metadata_url,
        CASE WHEN fvp.voter_role = 'DRep' THEN lda.metadata_hash END AS drep_metadata_hash,
        CASE WHEN fvp.voter_role = 'DRep' THEN lda.given_name END AS drep_given_name,
        CASE WHEN fvp.voter_role = 'DRep' THEN lda.image_url END AS drep_image_url,
        CASE WHEN fvp.voter_role = 'SPO' THEN lpm.url END AS pool_metadata_url,
        CASE WHEN fvp.voter_role = 'SPO' THEN lpm.metadata_hash END AS pool_metadata_hash,
        CASE WHEN fvp.voter_role = 'SPO' THEN lpm.ticker_name END AS pool_ticker_name,
        CASE WHEN fvp.voter_role = 'SPO' THEN lpm.metadata_json END AS pool_metadata_json,
        va_vote.url AS vote_anchor_url,
        encode(va_vote.data_hash, 'hex') AS vote_anchor_hash,
        ocvd_vote.json AS vote_anchor_json,
        ROW_NUMBER() OVER (
            PARTITION BY 
                CASE
                    WHEN fvp.voter_role = 'ConstitutionalCommittee' THEN encode(ch.raw, 'hex')
                    WHEN fvp.voter_role = 'DRep' THEN COALESCE(encode(dh.raw, 'hex'), dh.view)
                    WHEN fvp.voter_role = 'SPO' THEN COALESCE(ph.view, encode(ph.hash_raw, 'hex'))
                END
            ORDER BY fvp.tx_id DESC, fvp.id DESC
        ) as final_rn
    FROM FilteredVotingProcedures fvp
    JOIN tx vote_tx ON vote_tx.id = fvp.tx_id
    JOIN block b ON b.id = vote_tx.block_id
    LEFT JOIN committee_hash ch ON ch.id = fvp.committee_voter
    LEFT JOIN drep_hash dh ON dh.id = fvp.drep_voter
    LEFT JOIN pool_hash ph ON ph.id = fvp.pool_voter
    LEFT JOIN drep_distr dd ON dd.hash_id = fvp.drep_voter 
        AND dd.epoch_no = b.epoch_no 
        AND fvp.voter_role = 'DRep'
    LEFT JOIN pool_stat ps ON ps.pool_hash_id = fvp.pool_voter 
        AND ps.epoch_no = b.epoch_no 
        AND fvp.voter_role = 'SPO'
    LEFT JOIN LatestDRepAnchor lda ON lda.drep_hash_id = fvp.drep_voter 
        AND lda.rn = 1 
        AND fvp.voter_role = 'DRep'
    LEFT JOIN LatestPoolMeta lpm ON lpm.pool_id = fvp.pool_voter 
        AND lpm.rn = 1 
        AND fvp.voter_role = 'SPO'
    LEFT JOIN voting_anchor va_vote ON va_vote.id = fvp.voting_anchor_id
    LEFT JOIN off_chain_vote_data ocvd_vote ON ocvd_vote.voting_anchor_id = fvp.voting_anchor_id
    WHERE fvp.rn = 1
)
SELECT
    id,
    voter_role,
    voter_identity,
    has_script,
    vote,
    voting_power,
    vote_epoch,
    vote_time,
    drep_metadata_url,
    drep_metadata_hash,
    drep_given_name,
    drep_image_url,
    pool_metadata_url,
    pool_metadata_hash,
    pool_ticker_name,
    pool_metadata_json,
    vote_anchor_url,
    vote_anchor_hash,
    vote_anchor_json
FROM EnrichedVotes
WHERE final_rn = 1
ORDER BY
    CASE WHEN $4 = 'vote' AND $5 = 'asc' THEN vote::text END ASC NULLS LAST,
    CASE WHEN $4 = 'vote' AND $5 = 'desc' THEN vote::text END DESC NULLS LAST,
    CASE WHEN $4 = 'voting_power' AND $5 = 'asc' THEN voting_power END ASC NULLS LAST,
    CASE WHEN $4 = 'voting_power' AND $5 = 'desc' THEN voting_power END DESC NULLS LAST,
    CASE WHEN $4 = 'vote_time' AND $5 = 'asc' THEN vote_time END ASC NULLS LAST,
    CASE WHEN $4 = 'vote_time' AND $5 = 'desc' THEN vote_time END DESC NULLS LAST,
    CASE WHEN $4 NOT IN ('vote', 'voting_power', 'vote_time') THEN vote_time END DESC,
    CASE WHEN $4 NOT IN ('vote', 'voting_power', 'vote_time') THEN
        CASE voter_role
            WHEN 'ConstitutionalCommittee' THEN 1
            WHEN 'DRep' THEN 2
            WHEN 'SPO' THEN 3
        END
    END,
    CASE WHEN $4 NOT IN ('vote', 'voting_power', 'vote_time') THEN voter_identity END
LIMIT $6 OFFSET $7`;
