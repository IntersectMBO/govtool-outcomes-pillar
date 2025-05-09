import { Box, IconButton, Link } from "@mui/material";
import { IconExternalLink } from "@intersect.mbo/intersectmbo.org-icons-set";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";
import { useModal } from "../../contexts/modal";

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
  const { openModal } = useModal();
  if (!content) return;

  const contentTypographyStyles = {
    fontSize: 16,
    fontWeight: 400,
    color: "primaryBlue",
    wordBreak: "break-word",
    overflow: "hidden",
    padding: 0,
  };

  const contentContainerStyles = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
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
          onClick={() => {
            openModal({
              type: "externalLink",
              state: {
                externalLink: content,
              },
            });
          }}
          sx={{ ...contentContainerStyles, cursor: "pointer" }}
          style={{ textDecoration: "none" }}
        >
          <Typography sx={contentTypographyStyles}>{content}</Typography>
          <IconButton size="small">
            <IconExternalLink fill="#0033AD" height="21" width="21" />
          </IconButton>
        </Link>
      );
    }

    return null;
  };

  return (
    <Box
      data-testid={dataTestId}
      sx={{ width: "100%", display: "flex", flexDirection: "column" }}
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
