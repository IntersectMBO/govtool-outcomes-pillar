import { Box, Typography, Snackbar, Alert } from "@mui/material";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { useState } from "react";

interface GovernanceActionCardIDElementProps {
  title: string;
  id: string;
}

export default function GovernanceActionCardIDElement({
  title,
  id,
}: GovernanceActionCardIDElementProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  return (
    <>
      <Typography sx={{ fontSize: "12px", color: "#8E908E", marginBottom: 1 }}>
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          gap: 1
        }}

      >
        <Box sx={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
          <Typography sx={{ fontSize: "14px", color: "#0033AD" }}>
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
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              navigator.clipboard.writeText(id).then(() => {
                setSnackbarOpen(true);
              });
              e.stopPropagation();
            }}
          >
            <CopyIcon width={24} height={24} />
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              Copied to clipboard!
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}
