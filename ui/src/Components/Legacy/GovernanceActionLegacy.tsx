import { Box } from "@mui/material";
import { GovActionWithMetadata } from "../../types/api";
import GovActionDataLegacy from "./GovActionDataLegacy";
import GovActionVotesLegacy from "./GovActionVotesLegacy";
import { useScreenDimension } from "../../hooks/useDimensions";

const GovernanceActionLegacy = (props: GovActionWithMetadata) => {
  const { isMobile } = useScreenDimension();
  const { metadataValid } = props;

  return (
    <Box
      data-testid="governance-action-details-card"
      sx={{
        borderRadius: "20px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "0.55fr 0.45fr",
        mt: "12px",
        width: "100%",
        position: "relative",
        boxShadow: "2px 2px 20px 0px rgba(47, 98, 220, 0.20)",
        overflow: "hidden",
        minHeight: 0,
        minWidth: 0,
        ...(!metadataValid && {
          border: "1px solid #F6D5D5",
        }),
      }}
    >
      <Box
        sx={{
          padding: "40px 24px",
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <GovActionDataLegacy {...props} />
      </Box>

      <Box
        sx={{
          borderRadius: isMobile ? "0 0 20px 20px" : "0 20px 20px 0",
          bgcolor: "rgba(255, 255, 255, 0.60)",
          p: `40px ${isMobile ? "24px" : "80px"}`,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <GovActionVotesLegacy {...props} />
      </Box>
    </Box>
  );
};

export default GovernanceActionLegacy;
