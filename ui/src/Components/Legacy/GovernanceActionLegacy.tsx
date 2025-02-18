import { Box } from "@mui/material";
import { GovActionWithMetadata } from "../../types/api";
import GovActionDataLegacy from "./GovActionDataLegacy";
import GovActionVotesLegacy from "./GovActionVotesLegacy";
import { useScreenDimension } from "../../hooks/useDimensions";

const GovernanceActionLegacy = ({
  ...govActionData
}: GovActionWithMetadata) => {
  const { isMobile } = useScreenDimension();
  return (
    <Box
      sx={{
        borderRadius: "20px",
        display: "grid",
        gridTemplateColumns: isMobile ? undefined : "0.55fr 0.45fr",
        mt: "12px",
        width: "100%",
        position: "relative",
        boxShadow: "2px 2px 20px 0px rgba(47, 98, 220, 0.20)",
      }}
      data-testid="governance-action-details-card"
    >
      <Box
        sx={{
          padding: "40px 24px 0",
        }}
      >
        <GovActionDataLegacy {...govActionData} />
      </Box>

      <Box
        sx={{
          borderRadius: isMobile ? "0 0 20px 20px" : "0 20px 20px 0",
          bgcolor: "rgba(255, 255, 255, 0.60)",
          p: `40px ${isMobile ? "24px" : "80px"}`,
        }}
      >
        <GovActionVotesLegacy {...govActionData} />
      </Box>
    </Box>
  );
};

export default GovernanceActionLegacy;
