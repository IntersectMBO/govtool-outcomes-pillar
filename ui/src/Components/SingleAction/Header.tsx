import { Box, ButtonBase, Skeleton } from "@mui/material";
import ShareIcon from "../../Assets/Icons/ShareIcon";
import { GovActionMetadata, GovernanceAction } from "../../types/api";
import { useSnackbar } from "../../contexts/Snackbar";
import { Typography } from "../Atoms/Typography";
import { encodeCIP129Identifier } from "../../lib/utils";

interface HeaderProps {
  isGovernanceActionLoading: boolean;
  isMetadataLoading: boolean;
  governanceAction: GovernanceAction;
  metadata: GovActionMetadata;
}

export default function Header({
  isGovernanceActionLoading,
  isMetadataLoading,
  governanceAction,
  metadata,
}: HeaderProps) {
  const { addSuccessAlert } = useSnackbar();

  const idCIP129 = encodeCIP129Identifier({
    txID: governanceAction?.tx_hash,
    index: governanceAction?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  const onCopy = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    addSuccessAlert("Copied to clipboard!");
  };

  return (
    <Box
      data-testid={`single-action-${idCIP129}-header`}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      {isGovernanceActionLoading || isMetadataLoading ? (
        <Skeleton variant="rounded" width="75%" height={32} />
      ) : (
        <Typography
          data-testid={`single-action-${idCIP129}-title`}
          sx={{
            fontSize: 22,
            fontWeight: 600,
            lineHeight: "24px",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            wordBreak: "break-word",
          }}
        >
          {governanceAction?.title || metadata?.data?.title}
        </Typography>
      )}
      <ButtonBase
        onClick={onCopy}
        sx={(theme) => ({
          alignItems: "center",
          padding: 1,
          borderRadius: 50,
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          transition: "all 0.3s",
          "&:hover": {
            boxShadow: theme.shadows[1],
          },
        })}
      >
        <ShareIcon />
      </ButtonBase>
    </Box>
  );
}
