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
                ? "#00B83D"
                : status === "Expired"
                ? "#FF2616"
                : "#FFC916",
          }}
        >
          {status}
        </Typography>
      </Box>
  );
}
