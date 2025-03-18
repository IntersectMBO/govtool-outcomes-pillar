import { Box, IconButton, Link } from "@mui/material";
import { IconExternalLink } from "@intersect.mbo/intersectmbo.org-icons-set";
import { openInNewTab } from "../../lib/openInNewTab";
import { useAppContext } from "../../contexts/AppContext";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";

interface GovernanceActionElementProps {
  title: string;
  type: string;
  content: string;
  isCopyable?: boolean;
  dataTestId?: string;
}

export default function GovernanceActionElement({
  title,
  type,
  content,
  isCopyable = false,
  dataTestId,
}: GovernanceActionElementProps) {
  const { ipfsGateway } = useAppContext();
  if (!content) return;

  const contentTypographyStyles = {
    fontSize: 16,
    fontWeight: 400,
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
  };

  const renderContent = () => {
    if (type === "text") {
      return (
        <Box sx={contentContainerStyles}>
          <Typography sx={contentTypographyStyles}>{content}</Typography>
          {isCopyable && <CopyButton text={content} />}
        </Box>
      );
    }

    if (type === "link") {
      return (
        <Link
          onClick={() => openInNewTab(content, ipfsGateway)}
          sx={{ ...contentContainerStyles, cursor: "pointer" }}
          style={{ textDecoration: "none" }}
        >
          <Typography sx={contentTypographyStyles}>{content}</Typography>
          <IconButton>
            <IconExternalLink fill="#0033AD" />
          </IconButton>
        </Link>
      );
    }

    return null;
  };

  return (
    <Box
      data-testid={dataTestId}
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
