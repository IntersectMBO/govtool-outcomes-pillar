import { Box, Typography } from "@mui/material";
import GovernanceActionStatusChip from "../Atoms/GovernanceActionStatusChip";
import { formatTimeStamp } from "../../lib/utils";
import { Status } from "../../types/api";

interface GovernanceActionCardHeaderProps {
  dateSubmitted: string;
  epochSubmitted: number;
  status: Status;
}

export default function GovernanceActionCardHeader({
  dateSubmitted,
  epochSubmitted,
  status,
}: GovernanceActionCardHeaderProps) {
  const getStatusChips = () => {
    const { ratified_epoch, enacted_epoch, dropped_epoch, expired_epoch } =
      status;

    if (!ratified_epoch && !enacted_epoch && !dropped_epoch && !expired_epoch) {
      return <GovernanceActionStatusChip status="Live" />;
    }

    if (ratified_epoch && enacted_epoch) {
      return (
        <Box>
          <GovernanceActionStatusChip status="Ratified" />
          <GovernanceActionStatusChip status="Enacted" />
        </Box>
      );
    }

    if (ratified_epoch && !enacted_epoch) {
      return <GovernanceActionStatusChip status="Ratified" />;
    }

    if (!ratified_epoch && enacted_epoch) {
      return <GovernanceActionStatusChip status="Enacted" />;
    }

    if (expired_epoch && dropped_epoch) {
      return (
        <Box>
          <GovernanceActionStatusChip status="Expired" />
          <GovernanceActionStatusChip status="Dropped" />
        </Box>
      );
    }

    if (dropped_epoch) {
      return <GovernanceActionStatusChip status="Dropped" />;
    }

    if (expired_epoch) {
      return <GovernanceActionStatusChip status="Expired" />;
    }

    return null;
  };
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" width="100%">
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
