import { Box, Typography } from "@mui/material";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { useSnackbar } from "../../contexts/Snackbar";
interface GovernanceActionCardIdElementProps {
  title: string;
  id: string;
}

export default function GovernanceActionCardIdElement({
  title,
  id,
}: GovernanceActionCardIdElementProps) {
  const { addSuccessAlert } = useSnackbar();

  const handleCopyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    addSuccessAlert("Copied to clipboard!");
  };
  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: "neutralGray",
          marginBottom: 1,
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
            fontSize: "1rem",
            color: "primaryBlue",
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
          >
            <CopyIcon width={24} height={24} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
