import { Box } from "@mui/material";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";
interface GovernanceActionCardIdElementProps {
  title: string;
  id: string;
  dataTestId: string;
}

export default function GovernanceActionCardIdElement({
  title,
  id,
  dataTestId,
}: GovernanceActionCardIdElementProps) {
  return (
    <Box data-testid={dataTestId}>
      <Typography
        sx={{
          fontSize: 12,
          color: "textGray",
          marginBottom: "4px",
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            maxWidth: "85%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 14,
            color: "primaryBlue",
            lineHeight: "20px",
            fontWeight: 400,
          }}
        >
          {id}
        </Typography>
        <CopyButton text={id} />
      </Box>
    </Box>
  );
}
