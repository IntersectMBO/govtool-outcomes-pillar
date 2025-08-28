import { Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import { GovernanceAction } from "../../types/api";
import CopyButton from "../Atoms/CopyButton";
import { useTranslation } from "../../contexts/I18nContext";
import { useNetworkMetrics } from "../../hooks/useNetworkMetrics";

export const HardForkDetailsTabContent = ({
  action,
  prevGovActionId,
}: {
  action: GovernanceAction;
  prevGovActionId: string | null;
}) => {
  const { epochParams } = useNetworkMetrics(action);
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        data-testid="hard-fork-current-version"
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "textGray",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {t("outcome.currentVersion")}
        </Typography>
        <Typography variant="body1">
          {epochParams
            ? `${epochParams.protocol_major}.${epochParams.protocol_minor}`
            : "-"}
        </Typography>
      </Box>
      <Box
        data-testid="hard-fork-proposed-version"
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "textGray",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {t("outcome.proposedVersion")}
        </Typography>
        <Typography variant="body1">
          {action?.description
            ? `${action.description.major}.${action.description.minor}`
            : "-"}
        </Typography>
      </Box>
      <Box
        data-testid="previous-governance-action-id"
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "textGray",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {t("outcome.prevGovernanceActionId")}
        </Typography>
        {prevGovActionId ? (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 400,
                wordBreak: "break-word",
                overflow: "hidden",
                color: "primaryBlue",
              }}
            >
              {prevGovActionId}
            </Typography>
            <CopyButton text={prevGovActionId} />
          </Box>
        ) : (
          <Typography variant="body1">-</Typography>
        )}
      </Box>
    </Box>
  );
};
