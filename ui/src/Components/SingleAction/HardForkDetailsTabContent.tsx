import { Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import { GovernanceAction } from "../../types/api";
import { useAppContext } from "../../contexts/AppContext";
import CopyButton from "../Atoms/CopyButton";

export const HardForkDetailsTabContent = ({
  description,
  prevGovActionId,
}: Pick<GovernanceAction, "description"> & {
  prevGovActionId: string | null;
}) => {
  const { epochParams } = useAppContext();

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
          Current version
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
          Proposed version
        </Typography>
        <Typography variant="body1">
          {description ? `${description.major}.${description.minor}` : "-"}
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
          Previous Governance Action ID
        </Typography>
        {prevGovActionId ? (
          <Box sx={{ display: "flex", gap: 1 }}>
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
