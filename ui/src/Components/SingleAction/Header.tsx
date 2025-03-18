import { Box, IconButton, Skeleton, Tooltip } from "@mui/material";
import { MetadataValidationStatus } from "../../types/api";
import { useSnackbar } from "../../contexts/Snackbar";
import { Typography } from "../Atoms/Typography";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";
import { IconShare } from "@intersect.mbo/intersectmbo.org-icons-set";

interface HeaderProps {
  title: string | null;
  isGovernanceActionLoading: boolean;
  isMetadataLoading: boolean;
  isDataMissing: MetadataValidationStatus | null;
}

export default function Header({
  title,
  isGovernanceActionLoading,
  isMetadataLoading,
  isDataMissing,
}: HeaderProps) {
  const { addSuccessAlert } = useSnackbar();

  const onCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    addSuccessAlert("Copied to clipboard!");
  };

  return (
    <Box
      data-testid="single-action-header"
      display="flex"
      justifyContent="space-between"
    >
      {isGovernanceActionLoading || isMetadataLoading ? (
        <Skeleton variant="rounded" width="75%" height={32} />
      ) : (
        <Typography
          data-testid={`single-action-title`}
          sx={{
            fontSize: 22,
            py: "6px",
            fontWeight: 600,
            lineHeight: "24px",
            lineClamp: 2,
            wordBreak: "break-word",
            ...(isDataMissing && { color: "errorRed" }),
          }}
        >
          {(isDataMissing &&
            getMetadataDataMissingStatusTranslation(
              isDataMissing as MetadataValidationStatus
            )) ||
            title}
        </Typography>
      )}
      <Tooltip title="Share Governance Action">
        <IconButton
          id="share-button-card"
          sx={{
            width: 40,
            height: 40,
          }}
          onClick={onCopy}
          data-testid="single-action-share-link"
        >
          <IconShare width="24" height="24" fill="textBlack" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
