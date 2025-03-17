import { Box, Skeleton } from "@mui/material";
import ShareIcon from "../../Assets/Icons/ShareIcon";
import { MetadataValidationStatus } from "../../types/api";
import { useSnackbar } from "../../contexts/Snackbar";
import { Typography } from "../Atoms/Typography";

import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";
import { Button } from "../Atoms/Button";

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
      data-testid={`single-action-header`}
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
            WebkitLineClamp: 2,
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
      <Button
        size="small"
        variant="text"
        dataTestId={`single-action-share-link`}
        onClick={onCopy}
        sx={(theme) => ({
          padding: 0,
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: theme.shadows[1],
          },
        })}
      >
        <ShareIcon />
      </Button>
    </Box>
  );
}
