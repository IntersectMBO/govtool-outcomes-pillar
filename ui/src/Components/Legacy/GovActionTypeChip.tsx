import { Chip, ChipProps } from "@mui/material";
import { GOVERNANCE_ACTION_FILTERS_ENUM } from "../../consts/filters";

interface GovActionTypeChipProps {
  type: string;
}

const GovActionTypeChip = ({ type }: GovActionTypeChipProps) => {
  let chipProps = {
    label: type,
    style: {},
  } as {
    label: string;
    style: ChipProps["style"];
  };

  switch (type) {
    case GOVERNANCE_ACTION_FILTERS_ENUM.InfoAction:
      chipProps.label = "Info Action";
      break;
    case GOVERNANCE_ACTION_FILTERS_ENUM.TreasuryWithdrawals:
      chipProps.label = "Treasury Withdrawals";
      break;
    case GOVERNANCE_ACTION_FILTERS_ENUM.HardForkInitiation:
      chipProps.label = "Hard-Fork Initiation";
      break;
    case GOVERNANCE_ACTION_FILTERS_ENUM.NewCommittee:
      chipProps.label = "Update Committee";
      break;
    case GOVERNANCE_ACTION_FILTERS_ENUM.NoConfidence:
      chipProps.label = "Motion of no Confidence";
      break;
    case GOVERNANCE_ACTION_FILTERS_ENUM.NewConstitution:
      chipProps.label = "New Constitution";
      break;
    case GOVERNANCE_ACTION_FILTERS_ENUM.ParameterChange:
      chipProps.label = "Protocol Parameter Change";
      break;
    default:
      
  }
  return (
    <Chip
      label={chipProps.label}
      sx={{
        fontSize: "12px",
        fontWeight: 400,
        backgroundColor: "#D6E2FF",
        color: "#000",
      }}
    />
  );
};

export default GovActionTypeChip;
