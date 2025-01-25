import { Box, Typography } from "@mui/material";
import GovernanceActionStatusChip from "./GovernanceActionStatusChip";

interface GovernanceActionCardHeaderProps {
  dateSubmitted: string;
  epochSubmitted: number;
  status: string;
  title: string;
}

export default function GovernanceActionCardHeader({
  dateSubmitted,
  epochSubmitted,
  status,
  title,
}: GovernanceActionCardHeaderProps) {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" width="100%">
        <Typography sx={{ fontSize: "12px" }}>
          Submitted:{" "}
          <Typography
            sx={{ fontSize: "12px", fontWeight: "bold" }}
            component="span"
          >
            {dateSubmitted}
          </Typography>{" "}
          {`(Epoch ${epochSubmitted})`}
        </Typography>
        <GovernanceActionStatusChip status={status} />
      </Box>
      <Box sx={{ marginTop: 3 }}>
        <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
      </Box>
    </Box>
  );
}
