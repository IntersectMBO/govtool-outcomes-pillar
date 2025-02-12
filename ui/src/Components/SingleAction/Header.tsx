import { Box, Typography } from "@mui/material";
import { formatTimeStamp } from "../../lib/utils";
import StatusChip from "./StatusChip";

interface HeaderProps {
  dateSubmitted: string;
  epochSubmitted: number;
  status: Status;
}

export default function Header({
  dateSubmitted,
  epochSubmitted,
  status,
}: HeaderProps) {
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
          <StatusChip status="Dropped" />
        </Box>
      );
    }

    if (dropped_epoch) {
      return <StatusChip status="Dropped" />;
    }

    if (expired_epoch) {
      return <StatusChip status="Expired" />;
    }

    return null;
  };
  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        alignItems="center"
      >
        <Typography sx={{ fontSize: "12px" }}>
          Submitted:{" "}
          <Typography
            sx={{ fontSize: "12px", fontWeight: "bold" }}
            component="span"
          >
            {formatTimeStamp(dateSubmitted)}
          </Typography>{" "}
          {`(Epoch ${epochSubmitted})`}
        </Typography>
        {getStatusChips()}
      </Box>
    </Box>
  );
}
