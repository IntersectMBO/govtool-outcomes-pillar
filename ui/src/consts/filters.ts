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
