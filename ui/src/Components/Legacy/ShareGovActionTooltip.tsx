import { IconLink } from "@intersect.mbo/intersectmbo.org-icons-set";
import {
  Box,
  ClickAwayListener,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { theme } from "../../theme";

interface ShareGovActionTooltipProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactElement;
  govActionLink: string;
}
const ShareGovActionTooltip = ({
  children,
  govActionLink,
  open,
  setOpen,
}: ShareGovActionTooltipProps) => {
  const [copyStatus, setCopyStatus] = useState<string>("Copy Link");

  const handleTooltipClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyStatus("Copy Link");
    }, 2000);
    return () => clearTimeout(timer);
  }, [copyStatus]);

  const copyLink = () => {
    navigator.clipboard.writeText(govActionLink);
    setCopyStatus("Link Copied!");
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <div>
        <Tooltip
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="bottom-end"
          slotProps={{
            popper: {
              disablePortal: true,
            },
            tooltip: {
              sx: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "0",
                backgroundColor: "transparent",
                boxShadow: "none",
                border: "none",
              },
            },
          }}
          title={
            <Box
              sx={{
                padding: "12px 24px",
                bgcolor: "white",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                width: "100px",
                gap: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
              >
                Share
              </Typography>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  gap: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  onClick={copyLink}
                  sx={{
                    boxShadow: theme.shadows[1],
                    width: 48,
                    height: 48,
                  }}
                >
                  <IconLink fill="#0033AD" />
                </IconButton>
                <Typography variant="caption">{copyStatus}</Typography>
              </Box>
            </Box>
          }
        >
          {children}
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default ShareGovActionTooltip;
