import { Box, Divider } from "@mui/material";
import { OutcomeIndicator } from "./OutcomeIndicator";
import { Typography } from "../Atoms/Typography";
import { VoteSection } from "./VoteSection";
import {
  GovernanceAction,
  GovernanceActionType,
  NetworkMetrics,
} from "../../types/api";
import { useAppContext } from "../../contexts/AppContext";
import { getGovActionVotingThresholdKey } from "../../lib/utils";
import { useGetNetworkMetrics } from "../../hooks/useGetNetworkMetrics";
import { useEffect, useState } from "react";
import { getNetworkMetrics } from "../../services/requests/getNetworkMetrics";

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
  const { epochParams } = useAppContext();
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics | null>(
    null
  );

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

        setNetworkMetrics(metrics);
      } catch (error) {
        console.error("Failed to fetch network metrics:", error);
        setNetworkMetrics(null);
      }
    };

    fetchNetworkMetrics();
  }, [action, metricsEpoch]);

  const totalStakeControlledByDReps =
    (Number(networkMetrics?.total_stake_controlled_by_active_dreps) ?? 0) -
    abstain_votes;
  const noOfCommitteeMembers =
    Number(networkMetrics?.no_of_committee_members) ?? 0;
  const ccThreshold = (
    networkMetrics?.quorum_denominator
      ? Number(networkMetrics.quorum_numerator) /
        Number(networkMetrics.quorum_denominator)
      : 0
  ).toPrecision(2);

  const dRepYesVotes = Number(yes_votes) ?? 0;
  const dRepNoVotes = Number(no_votes) ?? 0;
  const dRepAbstainVotes = Number(abstain_votes) ?? 0;

  const poolYesVotes = Number(pool_yes_votes) ?? 0;
  const poolNoVotes = Number(pool_no_votes) ?? 0;
  const poolAbstainVotes = Number(pool_abstain_votes) ?? 0;

  const ccYesVotes = Number(cc_yes_votes) ?? 0;
  const ccNoVotes = Number(cc_no_votes) ?? 0;
  const ccAbstainVotes = Number(cc_abstain_votes) ?? 0;

  const dRepYesVotesPercentage = totalStakeControlledByDReps
    ? (dRepYesVotes / totalStakeControlledByDReps) * 100
    : undefined;
  const dRepNoVotesPercentage = dRepYesVotesPercentage
    ? 100 - dRepYesVotesPercentage
    : undefined;

  const poolYesVotesPercentage =
    poolYesVotes + poolNoVotes
      ? (poolYesVotes / (poolYesVotes + poolNoVotes)) * 100
      : undefined;
  const poolNoVotesPercentage = poolYesVotesPercentage
    ? 100 - poolYesVotesPercentage
    : undefined;

  const ccYesVotesPercentage = noOfCommitteeMembers
    ? (ccYesVotes / noOfCommitteeMembers) * 100
    : undefined;
  const ccNoVotesPercentage = ccYesVotesPercentage
    ? 100 - ccYesVotesPercentage
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
        abstainVotes={dRepAbstainVotes}
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
        abstainVotes={poolAbstainVotes}
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
        abstainVotes={ccAbstainVotes}
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
