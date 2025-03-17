import { Box, Grid, LinearProgress, styled } from "@mui/material";
import { correctAdaFormatWithSuffix } from "../../lib/utils";
import { errorRed, successGreen } from "../../consts/colors";
import { Typography } from "../Atoms/Typography";
import { VoteSectionLoader } from "../Loaders/VoteSectionLoader";

type VoteSectionProps = {
  title: string;
  yesVotes?: number;
  noVotes?: number;
  totalControlled?: number;
  abstainVotes?: number;
  notVotedVotes?: number;
  noConfidence?: number;
  threshold?: number | null;
  yesPercentage?: number;
  noPercentage?: number;
  isCC?: boolean;
  isDisplayed: boolean;
  isLoading?: boolean;
  dataTestId?: string;
};

const ProgressContainer = styled(Box)({
  position: "relative",
  width: "100%",
  height: 32,
  borderRadius: 20,
  overflow: "hidden",
});

const StyledLinearProgress = styled(LinearProgress)({
  height: "100%",
  borderRadius: 10,
  backgroundColor: errorRed.c100,
  ".MuiLinearProgress-bar": {
    backgroundColor: successGreen.c100,
  },
});

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
  color: "textBlack",
  padding: "0 10px",
  zIndex: 2,
});

const ThresholdMarker = styled("div")<{ left: number }>(({ left }) => ({
  position: "absolute",
  left: `${left}%`,
  top: "0",
  height: "100%",
  width: "3px",
  backgroundColor: successGreen.c600,
  zIndex: 3,
}));

export const VoteSection = ({
  title,
  yesVotes = 0,
  noVotes = 0,
  totalControlled = 0,
  abstainVotes = 0,
  notVotedVotes = 0,
  noConfidence = 0,
  threshold = null,
  yesPercentage = 0,
  noPercentage = 0,
  isCC = false,
  isDisplayed,
  isLoading = true,
  dataTestId,
}: VoteSectionProps) => {
  const formatValue = (value: number) =>
    isCC ? value : `₳${correctAdaFormatWithSuffix(value)}`;
  if (isLoading) {
    return <VoteSectionLoader title={title} isCC={isCC} />;
  }

  return (
    <Box data-testid={dataTestId} mb={3}>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography
          data-testid="outcome-voter-label"
          color="textGray"
          sx={{
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {title}
        </Typography>
        <Typography
          data-testid="total-controlled-amount"
          variant="body2"
          color="textGray"
        >
          (
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {formatValue(totalControlled)}
          </Box>
          )
        </Typography>
      </Box>
      {!isDisplayed && (
        <Typography
          data-testid="voting-not-available-label"
          variant="body2"
          color="textGray"
        >
          {`Voting for this action is not available for ${title}`}
        </Typography>
      )}
      {isDisplayed && (
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box
              data-testid="votes-numbers-section"
              display="flex"
              justifyContent="space-between"
              mb={0.5}
            >
              <Typography
                data-testid="outcomes-yes-votes"
                variant="body2"
                sx={{ color: successGreen.c600 }}
              >
                {isCC ? "Constitutional" : "Yes"} (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatValue(yesVotes)}
                </Box>
                )
              </Typography>

              {threshold !== null && (
                <Typography
                  data-testid="outcome-threshold"
                  variant="body2"
                  color="textGray"
                >
                  {threshold}
                </Typography>
              )}

              <Typography
                data-testid="outcome-no-votes"
                variant="body2"
                sx={{ color: errorRed.c500 }}
              >
                {isCC ? "Unconstitutional" : "No"} (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatValue(noVotes)}
                </Box>
                )
              </Typography>
            </Box>

            <ProgressContainer>
              <StyledLinearProgress
                data-testid="percentages-progress-bar"
                variant="determinate"
                value={yesPercentage}
              />
              <PercentageOverlay>
                <PercentageText data-testid="yes-percentage-text">
                  {yesPercentage?.toFixed(2)}%
                </PercentageText>
                <PercentageText data-testid="no-percentage-text">
                  {noPercentage?.toFixed(2)}%
                </PercentageText>
              </PercentageOverlay>
              {threshold !== null && <ThresholdMarker left={threshold * 100} />}
            </ProgressContainer>
          </Grid>
          <Grid item xs={12}>
            <Box
              mb={0.5}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                data-testid="outcome-abstain-votes"
                variant="body2"
                color="textGray"
              >
                Abstain (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatValue(abstainVotes)}
                </Box>
                )
              </Typography>

              <Typography
                data-testid="outcome-not-voted-votes"
                variant="body2"
                color="textGray"
              >
                Not Voted (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatValue(notVotedVotes)}
                </Box>
                )
              </Typography>
            </Box>

            {!isCC && noConfidence !== undefined && (
              <Typography
                data-testid="outcome-no-confidence-votes"
                variant="body2"
                color="textGray"
              >
                No confidence (
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {formatValue(noConfidence)}
                </Box>
                )
              </Typography>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
