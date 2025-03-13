import { Box, Chip } from "@mui/material";
import { encodeCIP129Identifier, getFullGovActionId } from "../../lib/utils";
import GovActionDatesInfo from "../Molecules/GovActionDatesInfo";
import GovernanceActionStatus from "../Molecules/GovernanceActionStatus";
import { GOVERNANCE_ACTION_FILTERS } from "../../consts/filters";
import GovernanceActionElement from "./GovernanceActionElement";
import { Typography } from "../Atoms/Typography";
import { primaryBlue } from "../../consts/colors";
type governanceActionProps = {
  governanceAction: any;
};
function ActionIdentity({ governanceAction }: governanceActionProps) {
  const idCIP129 = encodeCIP129Identifier({
    txID: governanceAction?.tx_hash,
    index: governanceAction?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  const fullGovActionId = getFullGovActionId(
    governanceAction?.tx_hash,
    governanceAction?.index
  );

  const typeInWords =
    GOVERNANCE_ACTION_FILTERS.find(
      (filter) => filter.value === governanceAction?.type
    )?.label || governanceAction?.type;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        data-testid={`single-action-${idCIP129}-type`}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            color: "textGray",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Governance Action Type
        </Typography>
        <Box sx={{ display: "inline-flex" }}>
          <Chip
            label={typeInWords}
            sx={{
              backgroundColor: primaryBlue.c100,
              borderRadius: 100,
              height: "auto",
              py: 0.75,
              px: 2.25,
              "& .MuiChip-label": {
                fontSize: 12,
                fontWeight: 400,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                color: "textBlack",
                px: 0,
                py: 0,
              },
            }}
          />
        </Box>
      </Box>
      <GovActionDatesInfo action={governanceAction} />
      <GovernanceActionStatus
        status={governanceAction?.status}
        actionId={idCIP129}
        isCard={false}
      />
      <GovernanceActionElement
        title="Governance Action ID"
        type="text"
        content={fullGovActionId}
        isCopyable
        dataTestId={`single-action-${fullGovActionId}-CIP-105-id`}
      />
      <GovernanceActionElement
        title="(CIP-129) Governance Action ID"
        type="text"
        content={idCIP129}
        isCopyable
        dataTestId={`single-action-${idCIP129}-CIP-129-id`}
      />
    </Box>
  );
}

export default ActionIdentity;
