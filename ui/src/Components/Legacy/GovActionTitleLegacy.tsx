import { Box, IconButton, Typography } from "@mui/material";
import ShareGovActionTooltip from "./ShareGovActionTooltip";
import { useState } from "react";
import { theme } from "../../theme";
import { getMetadataDataMissingStatusTranslation } from "../../lib/getMetadataDataMissingStatusTranslation";
import { MetadataValidationStatus } from "../../types/api";

interface ExtraProps {
  externalMetadataLink: string;
}

interface GovActionTitleLegacyProps {
  title: string | null;
  isDataMissing: MetadataValidationStatus | null;
  extra?: ExtraProps;
}

const GovActionTitleLegacy = ({
  title,
  isDataMissing,
  extra,
}: GovActionTitleLegacyProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: 22,
          fontWeight: 600,
          lineHeight: "24px",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
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
      {extra && extra.externalMetadataLink && (
        <ShareGovActionTooltip
          govActionLink={(extra?.externalMetadataLink as string) || ""}
          open={tooltipOpen}
          setOpen={setTooltipOpen}
        >
          <IconButton
            onClick={() => setTooltipOpen(!tooltipOpen)}
            size="large"
            sx={{
              "&:hover": {
                boxShadow: theme.shadows[1],
              },
            }}
          >
            <img
              alt="Share icon."
              height={24}
              width={24}
              src="/icons/Share.svg"
            />
          </IconButton>
        </ShareGovActionTooltip>
      )}
    </Box>
  );
};

export default GovActionTitleLegacy;
