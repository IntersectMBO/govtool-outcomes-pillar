import { Box, Typography } from "@mui/material";
import { Status } from "../../types/api";
import StatusChip from "../SingleAction/StatusChip";

interface GovernanceActionStatusProps {
  status: Status;
  actionId: string;
}

export default function GovernanceActionStatus({
  status,
  actionId,
}: GovernanceActionStatusProps) {
  const getStatusChips = () => {
    const { ratified_epoch, enacted_epoch, dropped_epoch, expired_epoch } =
      status;

    if (!ratified_epoch && !enacted_epoch && !dropped_epoch && !expired_epoch) {
      return <StatusChip status="Live" />;
    }

    if (ratified_epoch && enacted_epoch) {
      return (
        <Box display="flex" flexDirection="row" gap="4px">
          <StatusChip status="Ratified" />
          <StatusChip status="Enacted" />
        </Box>
      );
    }

    if (ratified_epoch && !enacted_epoch) {
      return <StatusChip status="Ratified" />;
    }

    if (!ratified_epoch && enacted_epoch) {
      return <StatusChip status="Enacted" />;
    }

    if (expired_epoch && dropped_epoch) {
      return (
        <Box display="flex" flexDirection="row" gap="4px">
          <StatusChip status="Expired" />
          <StatusChip status="Not Ratified" />
        </Box>
      );
    }

    if (dropped_epoch) {
      return <StatusChip status="Not Ratified" />;
    }

    if (expired_epoch) {
      return <StatusChip status="Expired" />;
    }

    return null;
  };
  return (
    <Box data-testid={`${actionId}-status`}>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: "neutralGray",
            fontWeight: 500,
          }}
        >
          Status
        </Typography>
        {getStatusChips()}
      </Box>
    </Box>
  );
}
