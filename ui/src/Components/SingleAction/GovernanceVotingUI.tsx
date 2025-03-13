import { Box, Divider } from "@mui/material";
import { OutcomeIndicator } from "./OutcomeIndicator";
import { Typography } from "../Atoms/Typography";
import { VoteSection } from "./VoteSection";
import {
  EpochParams,
  GovernanceAction,
  GovernanceActionType,
  NetworkMetrics,
} from "../../types/api";
import { getGovActionVotingThresholdKey } from "../../lib/utils";
import { useEffect, useState } from "react";
import { getNetworkMetrics } from "../../services/requests/getNetworkMetrics";
import { getEpochParams } from "../../services/requests/getEpochParams";

type GovernanceVotingUIProps = {
  action: GovernanceAction;
};
const GovernanceVotingUI = ({ action }: GovernanceVotingUIProps) => {
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
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(
    null
  );
  const [epochParams, setEpochParams] = useState<EpochParams | null>(null);

  const getEpochForMetrics = () => {
    if (status.ratified_epoch) return status.ratified_epoch;
    if (status.enacted_epoch) return status.enacted_epoch;
    if (status.expired_epoch) return status.expired_epoch;
    if (status.dropped_epoch) return status.dropped_epoch;
    return null;
  };

  const metricsEpoch = getEpochForMetrics();

  useEffect(() => {
    const fetchNetworkMetrics = async () => {
      try {
        const metrics =
          metricsEpoch !== null
            ? await getNetworkMetrics(metricsEpoch)
            : await getNetworkMetrics();

        const params =
          metricsEpoch !== null
            ? await getEpochParams(metricsEpoch)
            : await getEpochParams();

        setNetworkMetrics(metrics);
        setEpochParams(params);
      } catch (error) {
        console.error("Failed to fetch network metrics:", error);
        setNetworkMetrics(null);
      }
    };

    if (action) {
      fetchNetworkMetrics();
    }
  }, [action, metricsEpoch]);

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
    Number(networkMetrics?.total_stake_controlled_by_stake_pools) ?? 0;
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

  const dRepYesVotesPercentage = totalStakeControlledByDReps
    ? (dRepYesVotes / totalStakeControlledByDReps) * 100
    : undefined;
  const dRepNoVotesPercentage =
    dRepYesVotesPercentage !== undefined
      ? Number(100 - dRepYesVotesPercentage)
      : undefined;

  const poolYesVotesPercentage = totalStakeControlledBySPOs
    ? (poolYesVotes / totalStakeControlledBySPOs) * 100
    : undefined;
  const poolNoVotesPercentage =
    poolYesVotesPercentage !== undefined
      ? Number(100 - poolYesVotesPercentage)
      : undefined;

  const ccYesVotesPercentage =
    noOfCommitteeMembers - ccAbstainVotes
      ? (ccYesVotes / (noOfCommitteeMembers - ccAbstainVotes)) * 100
      : undefined;
  const ccNoVotesPercentage =
    ccYesVotesPercentage !== undefined
      ? Number(100 - ccYesVotesPercentage)
      : undefined;

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
        noConfidence={totalStakeControlledByNoConfidence}
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
      />

      <Divider sx={{ my: 2 }} />

      <VoteSection
        title="SPOs"
        yesVotes={poolYesVotes}
        noVotes={poolNoVotes}
        totalControlled={totalStakeControlledBySPOs}
        abstainVotes={poolAbstainVotes}
        notVotedVotes={poolNotVotedVotes}
        noConfidence={totalStakeControlledByNoConfidenceForSPOs}
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
      />

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography
          sx={{
            mb: 1,
          }}
        >
          Outcome
        </Typography>
        <Box display="flex" justifyContent="flex-start" gap={1}>
          <OutcomeIndicator title="DReps" passed={false} />
          <OutcomeIndicator title="SPOs" passed={true} />
          <OutcomeIndicator title="CC Committee" passed={true} />
        </Box>
      </Box>
    </Box>
  );
};

export default GovernanceVotingUI;
