export const GOVERNANCE_ACTION_FILTERS = [
  {
    value: "InfoAction",
    label: "Info Action",
    dataTestId: "info",
  },
  {
    value: "TreasuryWithdrawals",
    label: "Treasury Withdrawals",
    dataTestId: "treasury-withdrawals",
  },
  {
    value: "HardForkInitiation",
    label: "Hard-Fork Initiation",
    dataTestId: "hard-fork-initiation",
  },
  {
    value: "NewCommittee",
    label: "Update Committee",
    dataTestId: "update-committee",
  },
  {
    value: "NoConfidence",
    label: "Motion of no Confidence",
    dataTestId: "motion-of-no-confidence",
  },
  {
    value: "NewConstitution",
    label: "New Constitution",
    dataTestId: "new-constitution",
  },
  {
    value: "ParameterChange",
    label: "Protocol Parameter Change",
    dataTestId: "protocol-parameter-change",
  },
];

export enum GOVERNANCE_ACTION_FILTERS_ENUM {
  InfoAction = "InfoAction",
  TreasuryWithdrawals = "TreasuryWithdrawals",
  HardForkInitiation = "HardForkInitiation",
  NewCommittee = "NewCommittee",
  NoConfidence = "NoConfidence",
  NewConstitution = "NewConstitution",
  ParameterChange = "ParameterChange",
}

export const GOVERNANCE_ACTION_VOTES_FILTERS = [
  {
    value: "all_votes",
    label: "All Votes",
    displayLabel: "All votes",
    dataTestId: "all-votes",
  },
  {
    value: "yes",
    label: "Yes",
    displayLabel: "Yes",
    dataTestId: "yes-votes",
  },
  {
    value: "no",
    label: "No",
    displayLabel: "No",
    dataTestId: "no-votes",
  },
  {
    value: "abstain",
    label: "Abstain",
    displayLabel: "Abstain",
    dataTestId: "abstain-votes",
  },
];

export const GOVERNANCE_ACTION_ROLES_FILTERS = [
  {
    value: "all_voters",
    label: "All Voters",
    displayLabel: "All voters",
    dataTestId: "role-all-voters",
  },
  {
    value: "dReps",
    label: "DReps",
    displayLabel: "DReps",
    dataTestId: "role-DReps",
  },
  {
    value: "spos",
    label: "SPOs",
    displayLabel: "SPOs",
    dataTestId: "role-SPOs",
  },
  {
    value: "cc_embers",
    label: "CC Members",
    displayLabel: "CC members",
    dataTestId: "role-CCMembers",
  },
];
