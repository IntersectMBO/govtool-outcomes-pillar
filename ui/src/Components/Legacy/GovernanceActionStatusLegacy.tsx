import { Box, Typography } from "@mui/material";
import { Status } from "../../types/api";
import StatusChip from "../Molecules/StatusChip";

interface GovernanceActionStatusLegacyProps {
  status: Status;
  actionId: string;
}

export default function GovernanceActionStatusLegacy({
  status,
  actionId,
}: GovernanceActionStatusLegacyProps) {
  const getStatusChips = () => {
    const { ratified_epoch, enacted_epoch, dropped_epoch, expired_epoch } =
      status;

    if (!ratified_epoch && !enacted_epoch && !dropped_epoch && !expired_epoch) {
      return <StatusChip isUppercase status="Live" />;
    }

    if (ratified_epoch && enacted_epoch) {
      return (
        <Box display="flex" flexDirection="row" gap="4px">
          <StatusChip isUppercase status="Ratified" />
          <StatusChip isUppercase status="Enacted" />
        </Box>
      );
    }

    if (ratified_epoch && !enacted_epoch) {
      return <StatusChip isUppercase status="Ratified" />;
    }

    if (!ratified_epoch && enacted_epoch) {
      return <StatusChip isUppercase status="Enacted" />;
    }

    if (expired_epoch && dropped_epoch) {
      return (
        <Box display="flex" flexDirection="row" gap="4px">
          <StatusChip isUppercase status="Expired" />
          <StatusChip isUppercase status="Not Ratified" />
        </Box>
      );
    }

    if (dropped_epoch) {
      return <StatusChip isUppercase status="Not Ratified" />;
    }

    if (expired_epoch) {
      return <StatusChip isUppercase status="Expired" />;
    }

    return null;
  };
  return (
    <Box
      data-testid={`${actionId}-status`}
      sx={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Status
      </Typography>
      {getStatusChips()}
    </Box>
  );
}
