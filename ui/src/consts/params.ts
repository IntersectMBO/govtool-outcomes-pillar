export const SECURITY_RELEVANT_PARAMS_MAP: Record<string, string> = {
  maxBlockBodySize: "max_block_size",
  maxTxSize: "max_tx_size",
  maxBlockHeaderSize: "max_bh_size",
  maxValueSize: "max_val_size",
  maxBlockExecutionUnits: "max_block_ex_mem",
  txFeePerByte: "min_fee_a",
  txFeeFixed: "min_fee_b",
  utxoCostPerByte: "coins_per_utxo_size",
  govActionDeposit: "gov_action_deposit",
  minFeeRefScriptCostPerByte: "min_fee_ref_script_cost_per_byte",
};

export const PPU_NETWORK_GROUP_PARAMS_KEYS = [
  "max_block_size",
  "max_tx_size",
  "max_bh_size",
  "max_val_size",
  "max_tx_ex_mem",
  "max_tx_ex_steps",
  "max_block_ex_mem",
  "max_block_ex_steps",
  "max_collateral_inputs",
];

export const PPU_ECONOMIC_GROUP_PARAMS_KEYS = [
  "min_fee_a",
  "min_fee_b",
  "min_fee_ref_script_cost_per_byte",
  "pool_deposit",
  "drep_deposit",
  "key_deposit",
  "monetary_expand_rate",
  "min_pool_cost",
  "treasury_growth_rate",
];

export const PPU_TECHNICAL_GROUP_PARAMS_KEYS = [
  "influence",
  "max_epoch",
  "optimal_pool_count",
  "cost_model_id",
];

export const PPU_GOVERNANCE_GROUP_PARAMS_KEYS = [
  "dvt_committee_no_confidence",
  "dvt_committee_normal",
  "dvt_hard_fork_initiation",
  "dvt_motion_no_confidence",
  "dvt_p_p_economic_group",
  "dvt_p_p_gov_group",
  "dvt_p_p_network_group",
  "dvt_p_p_technical_group",
  "dvt_treasury_withdrawal",
  "dvt_update_to_constitution",
  "dvt_motion_no_confidence",
  "gov_action_lifetime",
  "gov_action_deposit",
  "drep_activity",
  "committeeMinSize",
  "committeeMaxTermLength",
];
