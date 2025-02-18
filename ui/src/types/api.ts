export interface GovernanceAction {
  id: string;
  tx_hash: string;
  index: number;
  type: string;
  description: GovActionDescription | null;
  expiry_date: string;
  expiration: number;
  time: string;
  epoch_no: number;
  url: string;
  data_hash: string;
  proposal_params: {} | null;
  title: string | null;
  abstract: string | null;
  status: Status;
  status_times: StatusTimes;
  motivation: string | null;
  rationale: string | null;
  yes_votes: number;
  no_votes: number;
  abstain_votes: number;
  pool_yes_votes: number;
  pool_no_votes: number;
  pool_abstain_votes: number;
  cc_yes_votes: number;
  cc_no_votes: number;
  cc_abstain_votes: number;
  prev_gov_action_index: number | null;
  prev_gov_action_tx_hash: string | null;
}

export type Status = {
  ratified_epoch: number | null;
  enacted_epoch: number | null;
  dropped_epoch: number | null;
  expired_epoch: number | null;
};

export type StatusTimes = {
  ratified_time: string | null;
  enacted_time: string | null;
  dropped_time: string | null;
  expired_time: string | null;
};

export type GovActionDescription = {
  major: number;
  minor: number;
};
export type VoteType = "yes" | "no" | "abstain" | "notVoted";

export type GovActionMetadata = {
  authors: any;
  body: {
    abstract: string;
    comment: string;
    externalUpdates: any[];
    motivation: string;
    rationale: string;
    references: Array<{
      "@type": string;
      label: string;
      uri: string;
    }>;
    title: string;
  };
  hashAlgorithm: string;
};

export interface GovActionWithMetadata extends GovernanceAction, GovActionMetadata {}

export type EpochParams = {
  block_id: number | null;
  coins_per_utxo_size: number | null;
  collateral_percent: number | null;
  committee_max_term_length: number | null;
  committee_min_size: number | null;
  cost_model_id: number | null;
  decentralisation: number | null;
  drep_activity: number | null;
  drep_deposit: number | null;
  dvt_committee_no_confidence: number | null;
  dvt_committee_normal: number | null;
  dvt_hard_fork_initiation: number | null;
  dvt_motion_no_confidence: number | null;
  dvt_p_p_economic_group: number | null;
  dvt_p_p_gov_group: number | null;
  dvt_p_p_network_group: number | null;
  dvt_p_p_technical_group: number | null;
  dvt_treasury_withdrawal: number | null;
  dvt_update_to_constitution: number | null;
  epoch_no: number | null;
  extra_entropy: null;
  gov_action_deposit: number | null;
  gov_action_lifetime: number | null;
  id: number;
  influence: number | null;
  key_deposit: number | null;
  max_bh_size: number | null;
  max_block_ex_mem: number | null;
  max_block_ex_steps: number | null;
  max_block_size: number | null;
  max_collateral_inputs: number | null;
  max_epoch: number | null;
  max_tx_ex_mem: number | null;
  max_tx_ex_steps: number | null;
  max_tx_size: number | null;
  max_val_size: number | null;
  min_fee_a: number | null;
  min_fee_b: number | null;
  min_fee_ref_script_cost_per_byte: number | null;
  min_pool_cost: number | null;
  min_utxo_value: number | null;
  monetary_expand_rate: number | null;
  nonce: string | null;
  optimal_pool_count: number | null;
  pool_deposit: number | null;
  price_mem: number | null;
  price_step: number | null;
  protocol_major: number | null;
  protocol_minor: number | null;
  pvt_committee_no_confidence: number | null;
  pvt_committee_normal: number | null;
  pvt_hard_fork_initiation: number | null;
  pvt_motion_no_confidence: number | null;
  pvtpp_security_group: number | null;
  treasury_growth_rate: number | null;
};

export type NetworkMetrics = {
  /** Current epoch number */
  epoch_no: number;
  
  /** Total stake controlled by active DReps (in lovelace) */
  total_stake_controlled_by_active_dreps: string;
  
  /** Voting power for always abstain (in lovelace) */
  always_abstain_voting_power: string;
  
  /** Voting power for always no confidence (in lovelace) */
  always_no_confidence_voting_power: string;
  
  /** Number of active committee members */
  no_of_committee_members: number;
  
  /** Committee quorum numerator */
  quorum_numerator: number;
  
  /** Committee quorum denominator */
  quorum_denominator: number;
};
export enum GovernanceActionType {
  ParameterChange = "ParameterChange",
  HardForkInitiation = "HardForkInitiation",
  TreasuryWithdrawals = "TreasuryWithdrawals",
  NoConfidence = "NoConfidence",
  NewCommittee = "NewCommittee",
  NewConstitution = "NewConstitution",
  InfoAction = "InfoAction",
}