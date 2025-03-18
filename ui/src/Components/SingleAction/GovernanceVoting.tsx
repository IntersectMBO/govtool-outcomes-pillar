import { Box, Divider } from "@mui/material";
import { OutcomeIndicator } from "./OutcomeIndicator";
import { Typography } from "../Atoms/Typography";
import { VoteSection } from "./VoteSection";
import { GovernanceAction, GovernanceActionType } from "../../types/api";
import { getGovActionVotingThresholdKey } from "../../lib/utils";
import { useCallback } from "react";
import { useNetworkMetrics } from "../../hooks/useNetworkMetrics";
import { SECURITY_RELEVANT_PARAMS_MAP } from "../../consts/params";

type GovernanceVotingProps = {
  action: GovernanceAction;
};
const GovernanceVoting = ({ action }: GovernanceVotingProps) => {
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
  } = action;
  const {
    networkMetrics,
    epochParams,
    isLoading,
    areDRepVoteTotalsDisplayed,
    areSPOVoteTotalsDisplayed,
    areCCVoteTotalsDisplayed,
  } = useNetworkMetrics(action);

  const isSecurityGroup = useCallback(
    () =>
      Object.values(SECURITY_RELEVANT_PARAMS_MAP).some(
        (paramKey) =>
          proposal_params?.[paramKey as keyof typeof proposal_params] !== null
      ),
    [proposal_params]
  );

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
  const totalStakeControlledBySPOs =
    Number(networkMetrics?.total_stake_controlled_by_stake_pools) -
    totalStakeControlledByAlwaysAbstainForSPOs;
  const noOfCommitteeMembers =
    Number(networkMetrics?.no_of_committee_members) ?? 0;
  const ccThreshold = (
    networkMetrics?.quorum_denominator
      ? Number(networkMetrics.quorum_numerator) /
        Number(networkMetrics.quorum_denominator)
      : 0
  ).toPrecision(2);

  // DRep votes collection
  const dRepYesVotes = Number(yes_votes);
  const dRepNoVotes = Number(no_votes);
  const dRepAbstainVotes =
    Number(abstain_votes) + totalStakeControlledByAlwaysAbstain;
  const dRepNotVotedVotes = Number(
    totalStakeControlledByDReps - (dRepYesVotes + dRepNoVotes)
  );

  // SPO votes collection
  const poolYesVotes =
    action.type === "NoConfidence"
      ? Number(pool_yes_votes) + totalStakeControlledByNoConfidenceForSPOs
      : Number(pool_yes_votes);
  const poolNoVotes =
    action.type !== "NoConfidence"
      ? Number(pool_no_votes) + totalStakeControlledByNoConfidenceForSPOs
      : Number(pool_no_votes);
  const poolAbstainVotes =
    Number(pool_abstain_votes) + totalStakeControlledByAlwaysAbstainForSPOs;
  const poolNotVotedVotes = Number(
    totalStakeControlledBySPOs - (poolYesVotes + poolNoVotes)
  );

  // CC votes  collection
  const ccYesVotes = Number(cc_yes_votes) ?? 0;
  const ccNoVotes = Number(cc_no_votes) ?? 0;
  const ccAbstainVotes = Number(cc_abstain_votes) ?? 0;
  const ccNotVotedVotes = Number(
    noOfCommitteeMembers - (ccYesVotes + ccNoVotes + ccAbstainVotes)
  );

  // DReps vote percentages
  const dRepYesVotesPercentage = totalStakeControlledByDReps
    ? (dRepYesVotes / totalStakeControlledByDReps) * 100
    : undefined;
  const dRepNoVotesPercentage =
    dRepYesVotesPercentage !== undefined
      ? Number(100 - dRepYesVotesPercentage)
      : undefined;

  // SPOs vote percentages
  const poolYesVotesPercentage = totalStakeControlledBySPOs
    ? (poolYesVotes / totalStakeControlledBySPOs) * 100
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
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 600,
          lineHeight: "24px",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          py: "6px",
          wordBreak: "break-word",
          mb: 3,
        }}
      >
        Votes submitted for this Governance Action:
      </Typography>

      <VoteSection
        title="DReps"
        yesVotes={dRepYesVotes}
        noVotes={dRepNoVotes}
        totalControlled={totalStakeControlledByDReps}
        abstainVotes={dRepAbstainVotes}
        notVotedVotes={dRepNotVotedVotes}
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
        isLoading={isLoading}
        dataTestId="DReps-voting-results-data"
      />

      <Divider sx={{ my: 2 }} />

      <VoteSection
        title="SPOs"
        yesVotes={poolYesVotes}
        noVotes={poolNoVotes}
        totalControlled={totalStakeControlledBySPOs}
        abstainVotes={poolAbstainVotes}
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
        dataTestId="SPOs-voting-results-data"
      />

      <Divider sx={{ my: 2 }} />

      <VoteSection
        title="CC Committee"
        yesVotes={ccYesVotes}
        noVotes={ccNoVotes}
        totalControlled={noOfCommitteeMembers}
        abstainVotes={ccAbstainVotes}
        notVotedVotes={ccNotVotedVotes}
        threshold={Number(ccThreshold)}
        yesPercentage={ccYesVotesPercentage}
        noPercentage={ccNoVotesPercentage}
        isCC
        isDisplayed={areCCVoteTotalsDisplayed(type as GovernanceActionType)}
        isLoading={isLoading}
        dataTestId="CC-voting-results-data"
      />

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography sx={{ mb: 1 }}>Outcome</Typography>
        <Box display="flex" justifyContent="flex-start" gap={1}>
          <OutcomeIndicator
            title="DReps"
            passed={isDRepPassed}
            isDisplayed={areDRepVoteTotalsDisplayed(
              type as GovernanceActionType,
              isSecurityGroup()
            )}
            isLoading={isLoading}
            dataTestId="DReps-voting-results-outcome"
          />

          <OutcomeIndicator
            title="SPOs"
            passed={isSPOPassed}
            isDisplayed={areSPOVoteTotalsDisplayed(
              type as GovernanceActionType,
              isSecurityGroup()
            )}
            isLoading={isLoading}
            dataTestId="SPOs-voting-results-outcome"
          />

          <OutcomeIndicator
            title="CC Committee"
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
