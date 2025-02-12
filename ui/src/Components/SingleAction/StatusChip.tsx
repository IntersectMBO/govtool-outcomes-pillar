import { Box, Typography } from "@mui/material";

type StatusChip = {
  status: "Live" | "Ratified" | "Enacted" | "Expired" | "Dropped";
};

function StatusChip({ status }: StatusChip) {
  return (
    <Box
      sx={{
        backgroundColor:
          status === "Ratified" || status === "Enacted" || status === "Live"
            ? "positiveGreen"
            : status === "Expired"
            ? "errorRed"
            : "accentYellow",
        padding: "4px 18px",
        borderRadius: 10,
        display: "inline-block",
      }}
    >
      <Typography fontSize="12px" lineHeight="16px">
        {status}
      </Typography>
    </Box>
  );
}

export default StatusChip;
