import { Box, Link, SxProps, Typography } from "@mui/material";
import { MetadataValidationStatus } from "../../types/api";
import {
  gaMetadataErrorDescriptions,
  gaMetadataErrorMessages,
} from "../../consts/dataMissingErrors";
import { openInNewTab } from "../../lib/openInNewTab";
import { URLS } from "../../consts/urls";
import { useAppContext } from "../../contexts/AppContext";

export const DataMissingInfoBox = ({
  isDataMissing,
  sx,
}: {
  isDataMissing: MetadataValidationStatus | null;
  sx?: SxProps;
}) => {
  const { ipfsGateway } = useAppContext();
  if (!isDataMissing) return null;

  const errorMessage = gaMetadataErrorMessages[isDataMissing];
  const errorDescription = gaMetadataErrorDescriptions[isDataMissing];

  return (
    <Box
      sx={{
        maxWidth: "100%",
        ...sx,
      }}
    >
      <Typography
        data-testid="metadata-error-message"
        sx={{
          fontSize: "18px",
          fontWeight: 500,
          color: "errorRed",
          mb: 0.5,
        }}
      >
        {errorMessage}
      </Typography>
      <Typography
        data-testid="metadata-error-description"
        sx={{
          fontWeight: 400,
          color: "errorRed",
          mb: 0.5,
        }}
      >
        {errorDescription}
      </Typography>
      <Link
        data-testid="metadata-error-learn-more"
        onClick={() => openInNewTab(URLS.DREP_ERROR_CONDITIONS, ipfsGateway)}
        sx={{
          fontFamily: "Poppins",
          fontSize: "16px",
          lineHeight: "24px",
          cursor: "pointer",
        }}
      >
        Learn more
      </Link>
    </Box>
  );
};
