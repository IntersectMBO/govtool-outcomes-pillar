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
      <Typography sx={{ fontSize: "12px", color: "neutralGray", marginBottom: 1 }}>
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
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Typography sx={{ fontSize: "14px", color: "primaryBlue"}}>
            {id}
          </Typography>
        </Box>
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
