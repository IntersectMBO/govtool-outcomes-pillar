import { Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import { GovernanceAction } from "../../types/api";
import { useAppContext } from "../../contexts/AppContext";
import CopyButton from "../Atoms/CopyButton";

export const HardforkDetailsTabContent = ({
  description,
  prevGovActionId,
}: Pick<GovernanceAction, "description"> & {
  prevGovActionId: string | null;
}) => {
  const { epochParams } = useAppContext();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pb: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="body2">Current version</Typography>
        <Typography variant="body2">
          {epochParams
            ? `${epochParams.protocol_major}.${epochParams.protocol_minor}`
            : "-"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="body2">Proposed version</Typography>
        <Typography variant="body2">
          {description ? `${description.major}.${description.minor}` : "-"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Typography variant="body2">Previous Governance Action ID</Typography>
        {prevGovActionId ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 400,
                maxWidth: 283,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "primaryBlue",
              }}
            >
              {prevGovActionId}
            </Typography>
            <CopyButton text={prevGovActionId} />
          </Box>
        ) : (
          <Typography variant="body2">-</Typography>
        )}
      </Box>
    </Box>
  );
};
