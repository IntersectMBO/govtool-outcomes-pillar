import { Box, Typography } from "@mui/material";

interface GovernanceActionStatusChipProps {
  status: string;
}

export default function GovernanceActionStatusChip({ status }: GovernanceActionStatusChipProps) {
  return (
      <Box>
        <Typography
          sx={{
            fontSize: "12px",
            color:
              status === "Ratified"
                ? "positiveGreen"
                : status === "Expired"
                ? "errorRed"
                : "accentYellow",
          }}
        >
          {status}
        </Typography>
      </Box>
  );
}
