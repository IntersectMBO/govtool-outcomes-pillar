import { Box, Link, SxProps, Typography } from "@mui/material";
import { MetadataValidationStatus } from "../../types/api";
import { URLS } from "../../consts/urls";
import { useTranslation } from "../../contexts/I18nContext";
import { useModal } from "../../contexts/modal";

export const DataMissingInfoBox = ({
  isDataMissing,
  sx,
}: {
  isDataMissing: MetadataValidationStatus | null;
  sx?: SxProps;
}) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  if (!isDataMissing) return null;

  // Governance Action metadata error messages
  const gaMetadataErrorMessages = {
    [MetadataValidationStatus.URL_NOT_FOUND]: t(
      "errors.gAMetadata.message.dataMissing"
    ),
    [MetadataValidationStatus.INVALID_JSONLD]: t(
      "errors.gAMetadata.message.incorrectFormat"
    ),
    [MetadataValidationStatus.INVALID_HASH]: t(
      "errors.gAMetadata.message.notVerifiable"
    ),
    [MetadataValidationStatus.INCORRECT_FORMAT]: t(
      "errors.gAMetadata.message.incorrectFormat"
    ),
  };

  // Governance Action metadata error descriptions
  const gaMetadataErrorDescriptions = {
    [MetadataValidationStatus.URL_NOT_FOUND]: t(
      "errors.gAMetadata.description.dataMissing"
    ),
    [MetadataValidationStatus.INVALID_JSONLD]: t(
      "errors.gAMetadata.description.incorrectFormat"
    ),
    [MetadataValidationStatus.INVALID_HASH]: t(
      "errors.gAMetadata.description.notVerifiable"
    ),
    [MetadataValidationStatus.INCORRECT_FORMAT]: t(
      "errors.gAMetadata.description.incorrectFormat"
    ),
  };
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
        onClick={() => {
          openModal({
            type: "externalLink",
            state: {
              externalLink: URLS.DREP_ERROR_CONDITIONS,
            },
          });
        }}
        sx={{
          fontFamily: "Poppins",
          fontSize: "16px",
          lineHeight: "24px",
          cursor: "pointer",
        }}
      >
        {t("learnMore")}
      </Link>
    </Box>
  );
};
