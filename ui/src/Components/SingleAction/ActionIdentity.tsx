import { Box } from "@mui/material";
import { encodeCIP129Identifier, getFullGovActionId } from "../../lib/utils";
import GovActionDatesInfo from "../Molecules/GovActionDatesInfo";
import GovernanceActionStatus from "../Molecules/GovernanceActionStatus";
import { GOVERNANCE_ACTION_FILTERS } from "../../consts/filters";
import GovernanceActionElement from "./GovernanceActionElement";
import { Typography } from "../Atoms/Typography";
import { primaryBlue } from "../../consts/colors";
import StatusChip from "../Molecules/StatusChip";
import { GovernanceAction } from "../../types/api";
import { useTranslation } from "../../contexts/I18nContext";

type ActionIdentityProps = {
  governanceAction: GovernanceAction;
};

function ActionIdentity({ governanceAction }: ActionIdentityProps) {
  const { t } = useTranslation();

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
        gap: 3,
      }}
    >
      <Box
        data-testid={`single-action-type`}
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
          {t("outcome.governanceActionType")}
        </Typography>
        <Box sx={{ display: "inline-flex" }}>
          <StatusChip status={typeInWords} bgColor={primaryBlue.c100} />
        </Box>
      </Box>
      <GovActionDatesInfo action={governanceAction} />
      <GovernanceActionStatus
        status={governanceAction?.status}
        actionId={idCIP129}
        isCard={false}
      />
      <GovernanceActionElement
        title={t("outcome.governanceActionId105")}
        type="text"
        content={fullGovActionId}
        isCopyable
        dataTestId={`single-action-CIP-105-id`}
      />
      <GovernanceActionElement
        title={t("outcome.governanceActionId129")}
        type="text"
        content={idCIP129}
        isCopyable
        dataTestId={`single-action-CIP-129-id`}
      />
    </Box>
  );
}

export default ActionIdentity;
