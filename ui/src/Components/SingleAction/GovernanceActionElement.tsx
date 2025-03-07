import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import CopyIcon from "../../Assets/Icons/CopyIcon";
import { useSnackbar } from "../../contexts/Snackbar";
import { IconExternalLink } from "@intersect.mbo/intersectmbo.org-icons-set";
import { openInNewTab } from "../../lib/openInNewTab";
import { useAppContext } from "../../contexts/AppContext";

interface GovernanceActionElementProps {
  title: string;
  type: string;
  content: string;
  isCopyable?: boolean;
}

export default function GovernanceActionElement({
  title,
  type,
  content,
  isCopyable = false,
}: GovernanceActionElementProps) {
  const { addSuccessAlert } = useSnackbar();
  const { ipfsGateway } = useAppContext();

  const handleCopyClick = () => {
    navigator.clipboard.writeText(content);
    addSuccessAlert("Copied to clipboard!");
  };

  const contentTypographyStyles = {
    fontSize: "1rem",
    color: "primaryBlue",
    wordBreak: "break-word",
    overflow: "hidden",
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  };

  const contentContainerStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 1,
    minWidth: 0,
  };

  const renderContent = () => {
    if (type === "text") {
      return (
        <Box sx={contentContainerStyles}>
          <Typography sx={contentTypographyStyles}>{content}</Typography>
          {isCopyable && (
            <Tooltip title="Copy to clipboard">
              <IconButton onClick={handleCopyClick} size="small">
                <CopyIcon width={16} height={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      );
    }

    if (type === "link") {
      return (
        <Box sx={contentContainerStyles}>
          <a href={content} style={{ textDecoration: "none" }}>
            <Typography sx={contentTypographyStyles}>{content}</Typography>
          </a>
          <IconButton onClick={() => openInNewTab(content, ipfsGateway)}>
            <IconExternalLink fill="#0033AD" />
          </IconButton>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.5 }}
    >
      <Typography
        sx={{
          color: "textGray",
          fontWeight: 600,
          fontSize: 14,
        }}
      >
        {title}
      </Typography>
      {renderContent()}
    </Box>
  );
}
