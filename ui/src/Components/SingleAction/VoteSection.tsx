import { Box, Grid, LinearProgress, styled, Typography } from "@mui/material";
import { correctAdaFormatWithSuffix } from "../../lib/utils";

type VoteSectionProps = {
  title: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  threshold?: number | null;
  yesPercentage?: number;
  noPercentage?: number;
  isCC?: boolean;
};

const ProgressContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: 32,
  borderRadius: 20,
  overflow: "hidden",
});

// Style the LinearProgress component
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "100%",
  borderRadius: 10,
  backgroundColor: "#f7d5d5", // Red background for "No" votes
  ".MuiLinearProgress-bar": {
    backgroundColor: "#cce8cc", // Green background for "Yes" votes
  },
}));

const PercentageOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  pointerEvents: "none",
});

const PercentageText = styled(Typography)({
  fontSize: "0.75rem",
  fontWeight: "bold",
  color: "#333",
  padding: "0 10px",
  zIndex: 2,
});

interface ThresholdMarkerProps {
  left: number | null;
}

const ThresholdMarker = styled("div")<ThresholdMarkerProps>(({ left }) => ({
  position: "absolute",
  left: `${left}%`,
  top: "0",
  height: "100%",
  width: "2px",
  backgroundColor: "#006400",
  zIndex: 3,
}));

export const VoteSection = ({
  title,
  yesVotes,
  noVotes,
  abstainVotes,
  threshold,
  yesPercentage,
  noPercentage,
  isCC = false,
}: VoteSectionProps) => {
  return (
    <Box mb={3}>
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        {title}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="body2" color="success.main">
              {isCC
                ? `Constitutional (${yesVotes})`
                : `Yes (₳${correctAdaFormatWithSuffix(yesVotes)})`}
            </Typography>
            <Typography variant="body2">{threshold}</Typography>
            <Typography variant="body2" color="error.main">
              {isCC
                ? `Unconstitutional (${noVotes})`
                : `No (₳${correctAdaFormatWithSuffix(noVotes)})`}
            </Typography>
          </Box>

          <ProgressContainer>
            <StyledLinearProgress variant="determinate" value={yesPercentage} />
            <PercentageOverlay>
              <PercentageText>{yesPercentage?.toFixed(2)}%</PercentageText>
              <PercentageText>{noPercentage?.toFixed(2)}%</PercentageText>
            </PercentageOverlay>
            {threshold && <ThresholdMarker left={threshold * 100} />}
          </ProgressContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary">
            Abstain (
            {isCC
              ? abstainVotes
              : `₳${correctAdaFormatWithSuffix(abstainVotes)}`}
            )
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
