import { Box, Typography } from "@mui/material";
import { GovActionWithMetadata, GovernanceActionType } from "../../types/api";
import GovActionVoteElement from "./GovActionVoteElement";
import { useAppContext } from "../../contexts/AppContext";
import {
  encodeCIP129Identifier,
  getGovActionVotingThresholdKey,
} from "../../lib/utils";
import GovActionListImage from "../../Assets/img/GovActionList.png";
import GovernanceActionStatusLegacy from "./GovernanceActionStatusLegacy";

const GovActionVotesLegacy = ({
  abstain_votes: dRepAbstainVotes,
  no_votes: dRepNoVotes,
  yes_votes: dRepYesVotes,
  cc_abstain_votes: ccAbstainVotes,
  cc_no_votes: ccNoVotes,
  cc_yes_votes: ccYesVotes,
  pool_abstain_votes: poolAbstainVotes,
  pool_no_votes: poolNoVotes,
  pool_yes_votes: poolYesVotes,
  proposal_params: protocolParams,
  type,
  status,
  tx_hash,
  index,
}: GovActionWithMetadata) => {
  const govActionType = type as GovernanceActionType;
  const { epochParams, networkMetrics } = useAppContext();
  dRepAbstainVotes = Number(dRepAbstainVotes) ?? 0;
  dRepNoVotes = Number(dRepNoVotes) ?? 0;
  dRepYesVotes = Number(dRepYesVotes) ?? 0;
  ccAbstainVotes = Number(ccAbstainVotes) ?? 0;
  ccNoVotes = Number(ccNoVotes) ?? 0;
  ccYesVotes = Number(ccYesVotes) ?? 0;
  poolAbstainVotes = Number(poolAbstainVotes) ?? 0;
  poolNoVotes = Number(poolNoVotes) ?? 0;
  poolYesVotes = Number(poolYesVotes) ?? 0;
  const noOfCommitteeMembers =
    Number(networkMetrics?.no_of_committee_members) ?? 0;
  const ccThreshold = (
    networkMetrics?.quorum_denominator
      ? Number(networkMetrics.quorum_numerator) /
        Number(networkMetrics.quorum_denominator)
      : 0
  ).toPrecision(2);

  const totalStakeControlledByDReps =
    (Number(networkMetrics?.total_stake_controlled_by_active_dreps) ?? 0) -
    dRepAbstainVotes;

  const totalAbstainVotes =
    dRepAbstainVotes +
    (Number(networkMetrics?.always_abstain_voting_power) ?? 0);

  const dRepYesVotesPercentage = totalStakeControlledByDReps
    ? (dRepYesVotes / totalStakeControlledByDReps) * 100
    : undefined;

  const dRepNoVotesPercentage = totalStakeControlledByDReps
    ? (dRepNoVotes / totalStakeControlledByDReps) * 100
    : undefined;

  const dRepNotVotedVotes = totalStakeControlledByDReps
    ? totalStakeControlledByDReps -
      (dRepYesVotes -
        (govActionType === GovernanceActionType.NoConfidence
          ? Number(networkMetrics?.always_no_confidence_voting_power) ?? 0
          : 0)) -
      (dRepNoVotes -
        (govActionType === GovernanceActionType.NoConfidence
          ? 0
          : Number(networkMetrics?.always_no_confidence_voting_power) ?? 0))
    : undefined;

  const dRepNotVotedVotesPercentage =
    100 - (dRepYesVotesPercentage ?? 0) - (dRepNoVotesPercentage ?? 0);

  const poolYesVotesPercentage =
    poolYesVotes + poolNoVotes
      ? (poolYesVotes / (poolYesVotes + poolNoVotes)) * 100
      : undefined;
  const poolNoVotesPercentage = poolYesVotesPercentage
    ? 100 - poolYesVotesPercentage
    : poolNoVotes
    ? 100
    : undefined;

  const ccYesVotesPercentage = noOfCommitteeMembers
    ? (ccYesVotes / noOfCommitteeMembers) * 100
    : undefined;
  const ccNoVotesPercentage = noOfCommitteeMembers
    ? (ccNoVotes / noOfCommitteeMembers) * 100
    : undefined;
  const ccNotVotedVotes =
    noOfCommitteeMembers - ccYesVotes - ccNoVotes - ccAbstainVotes;
  const ccNotVotedVotesPercentage =
    100 - (ccYesVotesPercentage ?? 0) - (ccNoVotesPercentage ?? 0);

  const idCIP129 = encodeCIP129Identifier({
    txID: tx_hash,
    index: index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <img
        alt="ga icon"
        src={GovActionListImage}
        width="64px"
        height="64px"
        style={{ marginBottom: "24px" }}
      />
      <Typography
        sx={{
          fontSize: "22px",
          fontWeight: "600",
          lineHeight: "28px",
        }}
      >
        Votes Submitted
      </Typography>
      <Typography
        sx={{
          fontSize: "22px",
          fontWeight: "500",
          lineHeight: "28px",
          mb: 3,
        }}
      >
        for this Governance Action
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4.5,
        }}
      >
        <GovernanceActionStatusLegacy status={status} actionId={idCIP129} />
        <GovActionVoteElement
          type="dReps"
          yesVotes={dRepYesVotes}
          yesVotesPercentage={dRepYesVotesPercentage}
          noVotes={dRepNoVotes}
          noVotesPercentage={dRepNoVotesPercentage}
          abstainVotes={totalAbstainVotes}
          notVotedVotes={dRepNotVotedVotes}
          notVotedPercentage={dRepNotVotedVotesPercentage}
          threshold={(() => {
            const votingThresholdKey = getGovActionVotingThresholdKey({
              govActionType: type as GovernanceActionType,
              protocolParams,
              voterType: "dReps",
            });
            return votingThresholdKey && epochParams?.[votingThresholdKey];
          })()}
        />

        <GovActionVoteElement
          type="sPos"
          yesVotes={poolYesVotes}
          yesVotesPercentage={poolYesVotesPercentage}
          noVotes={poolNoVotes}
          noVotesPercentage={poolNoVotesPercentage}
          abstainVotes={poolAbstainVotes}
          threshold={(() => {
            const votingThresholdKey = getGovActionVotingThresholdKey({
              govActionType: type as GovernanceActionType,
              protocolParams,
              voterType: "sPos",
            });
            return votingThresholdKey && epochParams?.[votingThresholdKey];
          })()}
        />
        <GovActionVoteElement
          type="ccCommittee"
          yesVotes={ccYesVotes}
          noVotes={ccNoVotes}
          abstainVotes={ccAbstainVotes}
          yesVotesPercentage={ccYesVotesPercentage}
          noVotesPercentage={ccNoVotesPercentage}
          notVotedVotes={ccNotVotedVotes}
          notVotedPercentage={ccNotVotedVotesPercentage}
          threshold={Number(ccThreshold)}
        />
      </Box>
    </Box>
  );
};

export default GovActionVotesLegacy;
