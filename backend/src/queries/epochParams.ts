export const getEpochParams = `
WITH CurrentEpoch AS (
    SELECT 
        CASE 
            WHEN $1::integer IS NULL THEN (SELECT MAX(epoch_no) FROM epoch_param)
            ELSE $1::integer
        END AS no
)
SELECT
    jsonb_set(
        ROW_TO_JSON(epoch_param)::jsonb,
        '{cost_model}', 
        CASE
            WHEN cost_model.id IS NOT NULL THEN
                ROW_TO_JSON(cost_model)::jsonb
            ELSE
                'null'::jsonb
        END
    ) AS epoch_param
FROM
    epoch_param
LEFT JOIN
    cost_model ON epoch_param.cost_model_id = cost_model.id
CROSS JOIN CurrentEpoch
WHERE 
    epoch_param.epoch_no = CurrentEpoch.no
LIMIT 1;`;
