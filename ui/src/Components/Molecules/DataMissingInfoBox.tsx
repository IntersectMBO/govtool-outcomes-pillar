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
        maxWidth: {
          xs: "295px",
          md: "100%",
        },
        ...sx,
      }}
    >
      <Typography
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
        sx={{
          fontWeight: 400,
          color: "errorRed",
          mb: 0.5,
        }}
      >
        {errorDescription}
      </Typography>
      <Link
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
