import { Box, Typography } from "@mui/material";
import { theme } from "../../theme";

interface GovernanceActionStatusChipProps {
  status: string;
}

export default function GovernanceActionStatusChip({ status }: GovernanceActionStatusChipProps) {
   const {
      palette: { errorRed, positiveGreen, accentYellow },
    } = theme;
  return (
      <Box>
        <Typography
          sx={{
            fontSize: "12px",
            color:
              status === "Ratified"
                ? positiveGreen
                : status === "Expired"
                ? errorRed
                : accentYellow,
          }}
        >
          {status}
        </Typography>
      </Box>
  );
}
