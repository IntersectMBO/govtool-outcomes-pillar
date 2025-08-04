import { Box, Divider } from "@mui/material";
import { OutcomeIndicator } from "./OutcomeIndicator";
import { Typography } from "../Atoms/Typography";
import { VoteSection } from "./VoteSection";
import { GovernanceAction, GovernanceActionType } from "../../types/api";
import { getGovActionVotingThresholdKey } from "../../lib/utils";
import { useCallback } from "react";
import { useNetworkMetrics } from "../../hooks/useNetworkMetrics";
import { SECURITY_RELEVANT_PARAMS_MAP } from "../../consts/params";
import { theme } from "../../theme";
import { useTranslation } from "../../contexts/I18nContext";
import StatusChip from "../Molecules/StatusChip";

type GovernanceVotingProps = {
  action: GovernanceAction;
};
const GovernanceVoting = ({ action }: GovernanceVotingProps) => {
  if (!action) return null;

  const {
    yes_votes,
    no_votes,
    abstain_votes,
    pool_yes_votes,
    pool_no_votes,
    pool_abstain_votes,
    cc_yes_votes,
    cc_no_votes,
    cc_abstain_votes,
    proposal_params,
    type,
    status,
  } = action;

  const {
    networkMetrics,
    epochParams,
    isLoading,
    areDRepVoteTotalsDisplayed,
    areSPOVoteTotalsDisplayed,
    areCCVoteTotalsDisplayed,
  } = useNetworkMetrics(action);

  const { t } = useTranslation();

  const {
    palette: {
      textBlack,
      badgeColors: { grey },
    },
  } = theme;

  const isSecurityGroup = useCallback(
    () =>
      Object.values(SECURITY_RELEVANT_PARAMS_MAP).some(
        (paramKey) =>
          proposal_params?.[paramKey as keyof typeof proposal_params] !== null
      ),
    [proposal_params]
  );

  const getStatus = () => {
    const { ratified_epoch, enacted_epoch, dropped_epoch, expired_epoch } =
      status;

    if (!ratified_epoch && !enacted_epoch && !dropped_epoch && !expired_epoch) {
      return t("outcome.status.inProgress");
    }

    if (ratified_epoch && enacted_epoch) {
      return t("outcome.status.enacted");
    }

    if (ratified_epoch && !enacted_epoch) {
      return t("outcome.status.ratified");
    }

    if (!ratified_epoch && enacted_epoch) {
      return t("outcome.status.enacted");
    }

    if (expired_epoch && dropped_epoch) {
      return t("outcome.status.expired");
    }

    if (dropped_epoch) {
      return t("outcome.status.dropped");
    }

    if (expired_epoch) {
      return t("outcome.status.expired");
    }

    return t("outcome.status.inProgress");
  };

  // Metrics collection
  const totalStakeControlledByAlwaysAbstain =
    Number(networkMetrics?.always_abstain_voting_power) ?? 0;
  const totalStakeControlledByAlwaysAbstainForSPOs =
    Number(networkMetrics?.spos_abstain_voting_power) ?? 0;
  const totalStakeControlledByNoConfidence =
    Number(networkMetrics?.always_no_confidence_voting_power) ?? 0;
  const totalStakeControlledByNoConfidenceForSPOs =
    Number(networkMetrics?.spos_no_confidence_voting_power) ?? 0;
  const totalStakeControlledByDReps =
    Number(networkMetrics?.total_stake_controlled_by_active_dreps) ?? 0;
  const totalStakeControlledBySPOs = Number(
    networkMetrics?.total_stake_controlled_by_stake_pools
  );
  const noOfCommitteeMembers =
    Number(networkMetrics?.no_of_committee_members) ?? 0;
  const ccThreshold = (
    networkMetrics?.quorum_denominator
      ? Number(networkMetrics.quorum_numerator) /
        Number(networkMetrics.quorum_denominator)
      : 0
  ).toPrecision(2);

  // DRep votes collection
  const dRepAbstainVotes =
    Number(abstain_votes) + totalStakeControlledByAlwaysAbstain;
  const dRepRatificationThresholdStake =
    totalStakeControlledByDReps - dRepAbstainVotes;
  const dRepYesVotes = Number(yes_votes);
  const dRepNoVotes = Number(no_votes);
  const dRepNoTotalVotes = dRepRatificationThresholdStake - dRepYesVotes;
  const dRepNotVotedVotes = Number(
    dRepRatificationThresholdStake - (dRepYesVotes + dRepNoVotes)
  );

  // SPO votes collection
  const poolAbstainVotes =
    Number(pool_abstain_votes) + totalStakeControlledByAlwaysAbstainForSPOs;
  const poolRatificationThresholdStake =
    totalStakeControlledBySPOs - poolAbstainVotes;
  const poolYesVotes =
    action.type === "NoConfidence"
      ? Number(pool_yes_votes) + totalStakeControlledByNoConfidenceForSPOs
      : Number(pool_yes_votes);
  const poolNoVotes =
    action.type !== "NoConfidence"
      ? Number(pool_no_votes) + totalStakeControlledByNoConfidenceForSPOs
      : Number(pool_no_votes);
  const poolNoTotalVotes = poolRatificationThresholdStake - poolYesVotes;
  const poolNotVotedVotes = Number(
    poolRatificationThresholdStake - (poolYesVotes + poolNoVotes)
  );

  // CC votes  collection
  const ccYesVotes = Number(cc_yes_votes) ?? 0;
  const ccNoVotes = Number(cc_no_votes) ?? 0;
  const ccAbstainVotes = Number(cc_abstain_votes) ?? 0;
  const ccNotVotedVotes = Number(
    noOfCommitteeMembers - (ccYesVotes + ccNoVotes + ccAbstainVotes)
  );

  // DReps vote percentages
  const dRepYesVotesPercentage = dRepRatificationThresholdStake
    ? (dRepYesVotes / dRepRatificationThresholdStake) * 100
    : undefined;
  const dRepNoVotesPercentage =
    dRepYesVotesPercentage !== undefined
      ? Number(100 - dRepYesVotesPercentage)
      : undefined;

  // SPOs vote percentages
  const poolYesVotesPercentage = poolRatificationThresholdStake
    ? (poolYesVotes / poolRatificationThresholdStake) * 100
    : undefined;
  const poolNoVotesPercentage =
    poolYesVotesPercentage !== undefined
      ? Number(100 - poolYesVotesPercentage)
      : undefined;

  // CC vote percentages
  const ccYesVotesPercentage =
    noOfCommitteeMembers - ccAbstainVotes
      ? (ccYesVotes / (noOfCommitteeMembers - ccAbstainVotes)) * 100
      : undefined;
  const ccNoVotesPercentage =
    ccYesVotesPercentage !== undefined
      ? Number(100 - ccYesVotesPercentage)
      : undefined;

  // Calculate if each entity reached their threshold
  const isDRepPassed =
    dRepYesVotesPercentage !== undefined &&
    (() => {
      const votingThresholdKey = getGovActionVotingThresholdKey({
        govActionType: type as GovernanceActionType,
        protocolParams: proposal_params,
        voterType: "dReps",
      });
      const thresholdValue =
        votingThresholdKey && epochParams?.[votingThresholdKey];
      if (thresholdValue) {
        return dRepYesVotesPercentage >= thresholdValue * 100;
      }
      return dRepYesVotesPercentage > 50;
    })();

  const isSPOPassed =
    poolYesVotesPercentage !== undefined &&
    (() => {
      const votingThresholdKey = getGovActionVotingThresholdKey({
        govActionType: type as GovernanceActionType,
        protocolParams: proposal_params,
        voterType: "sPos",
      });
      const thresholdValue =
        votingThresholdKey && epochParams?.[votingThresholdKey];

      if (thresholdValue) {
        return poolYesVotesPercentage >= thresholdValue * 100;
      }
      return poolYesVotesPercentage > 50;
    })();

  const isCCPassed =
    ccYesVotesPercentage !== undefined &&
    (() => {
      return ccYesVotesPercentage >= Number(ccThreshold) * 100;
    })();

  return (
    <Box>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{
          width: "100%",
        }}
        mb={3}
      >
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: 14,
            color: grey,
          }}
        >
          {t("outcome.ratifiedStatus.title")}
        </Typography>
        <StatusChip status={getStatus()} />
      </Box>
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 600,
          lineHeight: "24px",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          wordBreak: "break-word",
          mb: 3,
        }}
      >
        {t("outcome.votes.title")}
      </Typography>

      <VoteSection
        title={t("outcome.votes.dReps")}
        yesVotes={dRepYesVotes}
        noVotes={dRepNoVotes}
        noTotalVotes={dRepNoTotalVotes}
        totalControlled={totalStakeControlledByDReps}
        totalAbstainVotes={dRepAbstainVotes}
        autoAbstainVotes={totalStakeControlledByAlwaysAbstain}
        explicitAbstainVotes={abstain_votes}
        notVotedVotes={dRepNotVotedVotes}
        noConfidenceVotes={totalStakeControlledByNoConfidence}
        threshold={(() => {
          const votingThresholdKey = getGovActionVotingThresholdKey({
            govActionType: type as GovernanceActionType,
            protocolParams: proposal_params,
            voterType: "dReps",
          });
          return votingThresholdKey && epochParams?.[votingThresholdKey];
        })()}
        yesPercentage={dRepYesVotesPercentage}
        noPercentage={dRepNoVotesPercentage}
        isDisplayed={areDRepVoteTotalsDisplayed(
          type as GovernanceActionType,
          isSecurityGroup()
        )}
        ratificationThreshold={dRepRatificationThresholdStake}
        isLoading={isLoading}
        isDataReady={!isLoading && Boolean(networkMetrics)}
        dataTestId="DReps-voting-results-data"
      />

      <Divider sx={{ my: 2, bgcolor: `${textBlack}10` }} />

      <VoteSection
        title={t("outcome.votes.sPos")}
        yesVotes={poolYesVotes}
        noVotes={poolNoVotes}
        noTotalVotes={poolNoTotalVotes}
        totalControlled={totalStakeControlledBySPOs}
        ratificationThreshold={poolRatificationThresholdStake}
        totalAbstainVotes={poolAbstainVotes}
        autoAbstainVotes={totalStakeControlledByAlwaysAbstainForSPOs}
        noConfidenceVotes={totalStakeControlledByNoConfidenceForSPOs}
        explicitAbstainVotes={pool_abstain_votes}
        notVotedVotes={poolNotVotedVotes}
        threshold={(() => {
          const votingThresholdKey = getGovActionVotingThresholdKey({
            govActionType: type as GovernanceActionType,
            protocolParams: proposal_params,
            voterType: "sPos",
          });
          return votingThresholdKey && epochParams?.[votingThresholdKey];
        })()}
        yesPercentage={poolYesVotesPercentage}
        noPercentage={poolNoVotesPercentage}
        isDisplayed={areSPOVoteTotalsDisplayed(
          type as GovernanceActionType,
          isSecurityGroup()
        )}
        isLoading={isLoading}
        isDataReady={!isLoading && Boolean(networkMetrics)}
        dataTestId="SPOs-voting-results-data"
      />

      <Divider sx={{ my: 2 }} />

      <VoteSection
        title={t("outcome.votes.cCommitteeFull")}
        yesVotes={ccYesVotes}
        noVotes={ccNoVotes}
        totalControlled={noOfCommitteeMembers}
        totalAbstainVotes={ccAbstainVotes}
        notVotedVotes={ccNotVotedVotes}
        threshold={Number(ccThreshold)}
        yesPercentage={ccYesVotesPercentage}
        noPercentage={ccNoVotesPercentage}
        isCC
        isDisplayed={areCCVoteTotalsDisplayed(type as GovernanceActionType)}
        isLoading={isLoading}
        isDataReady={!isLoading && Boolean(networkMetrics)}
        dataTestId="CC-voting-results-data"
      />

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          mb: 1,
        }}
      >
        <Typography
          color="textBlack"
          sx={{
            fontWeight: 600,
            fontSize: 18,
            mb: 1.875,
          }}
        >
          {t("outcome.label")}
        </Typography>
        <Box display="flex" justifyContent="space-between" width="100%" gap={1}>
          <OutcomeIndicator
            title={t("outcome.votes.dReps")}
            passed={isDRepPassed}
            isDisplayed={areDRepVoteTotalsDisplayed(
              type as GovernanceActionType,
              isSecurityGroup()
            )}
            isLoading={isLoading}
            dataTestId="DReps-voting-results-outcome"
          />

          <OutcomeIndicator
            title={t("outcome.votes.sPos")}
            passed={isSPOPassed}
            isDisplayed={areSPOVoteTotalsDisplayed(
              type as GovernanceActionType,
              isSecurityGroup()
            )}
            isLoading={isLoading}
            dataTestId="SPOs-voting-results-outcome"
          />

          <OutcomeIndicator
            title={t("outcome.votes.cCommitteeShort")}
            passed={isCCPassed}
            isDisplayed={areCCVoteTotalsDisplayed(type as GovernanceActionType)}
            isLoading={isLoading}
            dataTestId="CC-voting-results-outcome"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default GovernanceVoting;
