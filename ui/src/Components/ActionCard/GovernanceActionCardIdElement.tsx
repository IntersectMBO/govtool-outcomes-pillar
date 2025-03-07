import { Box } from "@mui/material";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { useSnackbar } from "../../contexts/Snackbar";
import { Typography } from "../Atoms/Typography";
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
  const { addSuccessAlert } = useSnackbar();

  const handleCopyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    addSuccessAlert("Copied to clipboard!");
  };
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              display: "flex",
            }}
            onClick={handleCopyClick}
            aria-label="Copy to clipboard"
            data-testid="copy-button"
          >
            <CopyIcon width={24} height={24} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
