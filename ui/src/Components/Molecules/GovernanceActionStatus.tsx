import { Box } from "@mui/material";
import { Status } from "../../types/api";
import StatusChip from "./StatusChip";
import { Typography } from "../Atoms/Typography";
import { useScreenDimension } from "../../hooks/useDimensions";

interface GovernanceActionStatusProps {
  status: Status;
  actionId: string;
  isCard?: boolean;
}

export default function GovernanceActionStatus({
  status,
  actionId,
  isCard = true,
}: GovernanceActionStatusProps) {
  const { isMobile } = useScreenDimension();
  const getStatusChips = () => {
    const { ratified_epoch, enacted_epoch, dropped_epoch, expired_epoch } =
      status;

    if (!ratified_epoch && !enacted_epoch && !dropped_epoch && !expired_epoch) {
      return <StatusChip status="Live" />;
    }

    if (ratified_epoch && enacted_epoch) {
      return (
        <Box display="flex" flexDirection="row" gap={2}>
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
        <Box display="flex" flexDirection="row" gap={2}>
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
    <Box
      data-testid={`${actionId}-status`}
      display="flex"
      justifyContent={isCard ? "space-between" : ""}
      gap={isCard ? 0 : isMobile ? 3 : 8.65}
      width="100%"
      alignItems="center"
    >
      <Typography
        sx={{
          fontSize: isCard ? 12 : 14,
          color: "textGray",
          fontWeight: isCard ? 500 : 600,
        }}
      >
        Status
      </Typography>
      {getStatusChips()}
    </Box>
  );
}
