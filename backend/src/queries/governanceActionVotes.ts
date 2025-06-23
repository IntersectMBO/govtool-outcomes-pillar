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
LatestVotes AS (
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
),
LatestExistingVotingAnchor AS (
    SELECT
        subquery.drep_registration_id,
        subquery.drep_hash_id,
        subquery.voting_anchor_id,
        subquery.url,
        subquery.metadata_hash,
        subquery.ocvd_id
    FROM (
        SELECT
            dr.id AS drep_registration_id,
            dr.drep_hash_id,
            va.id AS voting_anchor_id,
            va.url,
            encode(va.data_hash, 'hex') AS metadata_hash,
            ocvd.id AS ocvd_id,
            ROW_NUMBER() OVER (PARTITION BY dr.drep_hash_id ORDER BY dr.tx_id DESC) AS rn
        FROM
            drep_registration dr
        JOIN voting_anchor va ON dr.voting_anchor_id = va.id
        JOIN off_chain_vote_data ocvd ON va.id = ocvd.voting_anchor_id
        WHERE
            ocvd.voting_anchor_id IS NOT NULL
    ) subquery
    WHERE
        subquery.rn = 1
),
LatestPoolMetadata AS (
    SELECT
        subquery.pool_id,
        subquery.pmr_id,
        subquery.url,
        subquery.metadata_hash,
        subquery.ocpd_id
    FROM (
        SELECT
            pmr.pool_id,
            pmr.id AS pmr_id,
            pmr.url,
            encode(pmr.hash, 'hex') AS metadata_hash,
            ocpd.id AS ocpd_id,
            ROW_NUMBER() OVER (PARTITION BY pmr.pool_id ORDER BY pmr.registered_tx_id DESC) AS rn
        FROM
            pool_metadata_ref pmr
        LEFT JOIN off_chain_pool_data ocpd ON pmr.id = ocpd.pmr_id
    ) subquery
    WHERE
        subquery.rn = 1
),
VotesWithPower AS (
    SELECT
        lv.voter_role,
        lv.vote,
        lv.tx_id,
        lv.id,
        CASE
            WHEN lv.voter_role = 'ConstitutionalCommittee' THEN
                encode(ch.raw, 'hex')
            WHEN lv.voter_role = 'DRep' THEN
                COALESCE(dh.view, encode(dh.raw, 'hex'))
            WHEN lv.voter_role = 'SPO' THEN
                COALESCE(ph.view, encode(ph.hash_raw, 'hex'))
        END AS voter_identity,
        CASE
            WHEN lv.voter_role = 'DRep' THEN dd.amount
            WHEN lv.voter_role = 'SPO' THEN ps.voting_power
            ELSE NULL  -- Committee members have null voting power
        END AS voting_power,
        b.epoch_no as vote_epoch,
        b.time as vote_time,
        CASE WHEN lv.voter_role = 'DRep' THEN leva.url END AS drep_metadata_url,
        CASE WHEN lv.voter_role = 'DRep' THEN leva.metadata_hash END AS drep_metadata_hash,
        CASE WHEN lv.voter_role = 'DRep' THEN ocvdd.given_name END AS drep_given_name,
        CASE WHEN lv.voter_role = 'DRep' THEN ocvdd.image_url END AS drep_image_url,
        CASE WHEN lv.voter_role = 'SPO' THEN lpm.url END AS pool_metadata_url,
        CASE WHEN lv.voter_role = 'SPO' THEN lpm.metadata_hash END AS pool_metadata_hash,
        CASE WHEN lv.voter_role = 'SPO' THEN ocpd.ticker_name END AS pool_ticker_name,
        CASE WHEN lv.voter_role = 'SPO' THEN ocpd.json END AS pool_metadata_json,
        va_vote.url AS vote_anchor_url,
        encode(va_vote.data_hash, 'hex') AS vote_anchor_hash,
        ocvd_vote.json AS vote_anchor_json
    FROM LatestVotes lv
    JOIN tx vote_tx ON vote_tx.id = lv.tx_id
    JOIN block b ON b.id = vote_tx.block_id
    LEFT JOIN committee_hash ch ON ch.id = lv.committee_voter
    LEFT JOIN drep_hash dh ON dh.id = lv.drep_voter
    LEFT JOIN pool_hash ph ON ph.id = lv.pool_voter
    LEFT JOIN drep_distr dd ON dd.hash_id = lv.drep_voter
        AND dd.epoch_no = b.epoch_no
        AND lv.voter_role = 'DRep'
    LEFT JOIN pool_stat ps ON ps.pool_hash_id = lv.pool_voter
        AND ps.epoch_no = b.epoch_no
        AND lv.voter_role = 'SPO'
    LEFT JOIN LatestExistingVotingAnchor leva ON leva.drep_hash_id = lv.drep_voter
        AND lv.voter_role = 'DRep'
    LEFT JOIN off_chain_vote_data ocvd ON ocvd.voting_anchor_id = leva.voting_anchor_id
        AND lv.voter_role = 'DRep'
    LEFT JOIN off_chain_vote_drep_data ocvdd ON ocvdd.off_chain_vote_data_id = ocvd.id
        AND lv.voter_role = 'DRep'
    LEFT JOIN LatestPoolMetadata lpm ON lpm.pool_id = lv.pool_voter
        AND lv.voter_role = 'SPO'
    LEFT JOIN off_chain_pool_data ocpd ON ocpd.id = lpm.ocpd_id
        AND lv.voter_role = 'SPO'
    LEFT JOIN voting_anchor va_vote ON va_vote.id = lv.voting_anchor_id
    LEFT JOIN off_chain_vote_data ocvd_vote ON ocvd_vote.voting_anchor_id = lv.voting_anchor_id
    WHERE lv.rn = 1
),
FilteredVotes AS (
    SELECT *
    FROM VotesWithPower
    WHERE 1=1
        AND ($2 = 'AllVotes' OR vote::text = $2)
        AND ($3 = 'AllVoters' OR
             ($3 = 'DReps' AND voter_role = 'DRep') OR
             ($3 = 'SPOs' AND voter_role = 'SPO') OR
             ($3 = 'CCMembers' AND voter_role = 'ConstitutionalCommittee')
            )
),
UniqueVotes AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (
            PARTITION BY voter_identity
            ORDER BY tx_id DESC, id DESC
        ) as final_rn
    FROM FilteredVotes
)
SELECT
    id,
    voter_role,
    voter_identity,
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
FROM UniqueVotes
WHERE final_rn = 1
ORDER BY
    CASE
        WHEN $4 = 'vote' AND $5 = 'asc' THEN vote::text
    END ASC NULLS LAST,
    CASE
        WHEN $4 = 'vote' AND $5 = 'desc' THEN vote::text
    END DESC NULLS LAST,
    CASE
        WHEN $4 = 'voting_power' AND $5 = 'asc' THEN voting_power
    END ASC NULLS LAST,
    CASE
        WHEN $4 = 'voting_power' AND $5 = 'desc' THEN voting_power
    END DESC NULLS LAST,
    CASE
        WHEN $4 = 'vote_time' AND $5 = 'asc' THEN vote_time
    END ASC NULLS LAST,
    CASE
        WHEN $4 = 'vote_time' AND $5 = 'desc' THEN vote_time
    END DESC NULLS LAST,
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
