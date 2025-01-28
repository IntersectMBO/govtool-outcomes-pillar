import { Box, Typography } from "@mui/material";

interface GovernanceActionCardElementProps {
  title: string;
  description: string;
}

export default function GovernanceActionCardElement({
  title,
  description,
}: GovernanceActionCardElementProps) {
  return (
      <Box>
        <Typography
          sx={{ fontSize: "12px", color: "neutralGray", marginBottom: 1 }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            WebkitLineClamp: 2,
            width: "100%"
          }}
        >
          {description}
        </Typography>
      </Box>
  );
}
