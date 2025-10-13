import { Box, Grid, LinearProgress, styled } from "@mui/material";
import { formatValue } from "../../lib/utils";
import { successGreen } from "../../consts/colors";
import { Typography } from "../Atoms/Typography";
import { VoteSectionLoader } from "../Loaders/VoteSectionLoader";
import { theme } from "../../theme";
import { useTranslation } from "../../contexts/I18nContext";
import VoteMetricsTable from "./VoteMetricsTable";

const {
  palette: { badgeColors, midRed },
} = theme;

export type VoteMetric = {
  label: string;
  value: number | string;
  testId?: string;
  isHighlighted?: boolean;
  isIndented?: boolean;
  indentDepth?: number;
};

type VoteSectionProps = {
  title: string;
  yesVotes?: number;
  noVotes?: number;
  noTotalVotes?: number;
  noConfidenceVotes?: number;
  totalControlled?: number;
  totalAbstainVotes?: number;
  autoAbstainVotes?: number;
  explicitAbstainVotes?: number;
  notVotedVotes?: number;
  threshold?: number | null;
  thresholdBarValue?: number;
  ratificationThreshold?: number;
  yesPercentage?: number;
  noPercentage?: number;
  isCC?: boolean;
  isDisplayed: boolean;
  isLoading?: boolean;
  isDataReady?: boolean;
  dataTestId?: string;
  defaultExpanded?: boolean;
};

const ProgressWrapper = styled(Box)({
  position: "relative",
  width: "100%",
});

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
  backgroundColor: midRed,
  ".MuiLinearProgress-bar": {
    backgroundColor: successGreen.c500,
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
  fontSize: 13,
  fontWeight: 600,
  color: "textBlack",
  padding: "0 10px",
  zIndex: 10,
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: {
    padding: "0 4px",
  },
});

const ThresholdLine = styled(Box)({
  position: "absolute",
  width: "2px",
  height: "100%",
  backgroundColor: badgeColors.darkPurple,
  zIndex: 4,
});

const ThresholdIndicator = styled(Box)<{ left: number }>(({ left }) => ({
  position: "absolute",
  left: `${left}%`,
  top: "-24px",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 5,
}));

const ThresholdBubble = styled(Box)({
  backgroundColor: badgeColors.darkPurple,
  borderRadius: "12px",
  padding: "2px 8px",
  border: `1px solid ${badgeColors.darkPurple}`,
  boxShadow: "0px 1px 2px rgba(0,0,0,0.08)",
});

const ThresholdText = styled(Typography)({
  fontSize: 12,
  fontWeight: 600,
  color: "white",
  lineHeight: 1.2,
  textWrap: 'nowrap'
});

const ThresholdArrow = styled(Box)({
  width: 0,
  height: 0,
  borderLeft: "6px solid transparent",
  borderRight: "6px solid transparent",
  borderTop: `6px solid ${badgeColors.darkPurple}`,
  marginTop: "-1px",
});

export const VoteSection = ({
  title,
  yesVotes = 0,
  noVotes = 0,
  noTotalVotes = 0,
  totalControlled = 0,
  totalAbstainVotes = 0,
  autoAbstainVotes = 0,
  explicitAbstainVotes = 0,
  noConfidenceVotes = 0,
  notVotedVotes = 0,
  threshold = null,
  yesPercentage = 0,
  noPercentage = 0,
  ratificationThreshold = 0,
  isCC = false,
  isDisplayed,
  isLoading = true,
  isDataReady = false,
  dataTestId,
  defaultExpanded = false,
}: VoteSectionProps) => {
  const { t } = useTranslation();

  const collapsedMetrics: VoteMetric[] = [
    {
      label: isCC
        ? t("outcome.votes.numberOfCCs")
        : t("outcome.votes.totalActiveStake"),
      value: totalControlled,
      testId: `${title}-total-controlled-amount`,
    },
    {
      label: isCC
        ? t("outcome.votes.abstainVotes")
        : t("outcome.votes.totalAbstain"),
      value: totalAbstainVotes,
      testId: `${title}-abstain-votes`,
    },
    {
      label: isCC
        ? t("outcome.votes.notVoted")
        : t("outcome.votes.ratificationThreshold"),
      value: isCC ? notVotedVotes : ratificationThreshold,
      testId: `${title}-ratification-threshold`,
    },
  ];

  const expandedMetrics: VoteMetric[] = [
    {
      label: t("outcome.votes.totalActiveStake"),
      value: totalControlled,
      testId: `${title}-total-controlled-amount`,
    },
    {
      label: t("outcome.votes.ratificationThreshold"),
      value: ratificationThreshold,
      testId: `${title}-ratification-threshold`,
      isHighlighted: true,
      isIndented: true,
      indentDepth: 1,
    },
    {
      label: t("outcome.votes.yes"),
      value: yesVotes,
      testId: `${title}-yes-votes`,
      isIndented: true,
      indentDepth: 2,
    },
    {
      label: t("outcome.votes.no"),
      value: noVotes,
      testId: `${title}-no-votes`,
      isIndented: true,
      indentDepth: 2,
    },
    {
      label: t("outcome.votes.noConfidence"),
      value: noConfidenceVotes,
      testId: `${title}-no-confidence-votes`,
      isIndented: true,
      indentDepth: 2,
    },
    {
      label: t("outcome.votes.notVoted"),
      value: notVotedVotes,
      testId: `${title}-not-voted-votes`,
      isIndented: true,
      indentDepth: 2,
    },
    {
      label: t("outcome.votes.totalAbstain"),
      value: totalAbstainVotes,
      testId: `${title}-abstain-votes`,
      isHighlighted: true,
      isIndented: true,
      indentDepth: 1,
    },
    {
      label: t("outcome.votes.autoAbstain"),
      value: autoAbstainVotes,
      testId: `${title}-abstain-votes`,
      isIndented: true,
      indentDepth: 2,
    },
    {
      label: t("outcome.votes.explicit"),
      value: explicitAbstainVotes,
      testId: `${title}-abstain-votes`,
      isIndented: true,
      indentDepth: 2,
    },
  ];

  if (!isDataReady || isLoading) {
    return <VoteSectionLoader title={title} />;
  }

  const thresholdValue = threshold
    ? isCC
      ? Number(Math.round((totalControlled - totalAbstainVotes) * threshold))
      : threshold * ratificationThreshold
    : 0;

  const noVotesValue = isCC ? noVotes : noTotalVotes;

  return (
    <Box data-testid={dataTestId} mb={3}>
      <Typography
        data-testid={`${title}-outcome-voter-label`}
        color="textBlack"
        sx={{
          fontWeight: 600,
          fontSize: 16,
          mb: 1.875,
        }}
      >
        {title}
      </Typography>
      {!isDisplayed && (
        <Typography
          data-testid="voting-not-available-label"
          sx={{
            fontWeight: 400,
            fontSize: 13,
          }}
          color="textBlack"
        >
          {t(title)}{" "}
          <span>
            <strong>{t("outcome.votes.votingNotAvailable")}</strong>{" "}
            {t("outcome.votes.onThisTypeOfAction")}
          </span>
        </Typography>
      )}
      {isDisplayed && (
        <Grid container spacing={1.875}>
          <Grid item xs={12}>
            <ProgressWrapper>
              {threshold !== null && (
                <>
                  <ThresholdIndicator left={threshold * 100}>
                    <ThresholdBubble>
                      <ThresholdText data-testid={`${title}-outcome-threshold`}>
                        {formatValue(thresholdValue, isCC)} -{" "}
                        {(threshold * 100).toFixed(0)}
                        %
                      </ThresholdText>
                    </ThresholdBubble>
                    <ThresholdArrow />
                  </ThresholdIndicator>
                  <ThresholdLine
                    sx={{
                      left: `${threshold * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </>
              )}
              <ProgressContainer>
                <StyledLinearProgress
                  data-testid={`${title}-percentages-progress-bar`}
                  variant="determinate"
                  value={yesPercentage}
                />
                <PercentageOverlay>
                  <PercentageText>{t("outcome.votes.yes")}</PercentageText>
                  <PercentageText>{t("outcome.votes.no")}</PercentageText>
                </PercentageOverlay>
              </ProgressContainer>
            </ProgressWrapper>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: 14,
                lineHeight: 1.75,
              }}
            >
              <Box
                data-testid={`${title}-yes-votes-submitted`}
                component="span"
              >
                {`${formatValue(yesVotes, isCC)} - ${yesPercentage?.toFixed(
                  2
                )}%`}
              </Box>
              <Box data-testid={`${title}-no-votes-submitted`} component="span">
                {`${formatValue(noVotesValue, isCC)} - ${noPercentage?.toFixed(
                  2
                )}%`}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <VoteMetricsTable
              collapsedMetrics={collapsedMetrics}
              expandedMetrics={expandedMetrics}
              title={title}
              isCC={isCC}
              defaultExpanded={defaultExpanded}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
