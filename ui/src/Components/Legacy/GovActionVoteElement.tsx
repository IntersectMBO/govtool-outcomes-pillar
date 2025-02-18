import { Box, Typography } from "@mui/material";
import { GovActionVotePill } from "./GovActionVotePill";
import { correctAdaFormatWithSuffix } from "../../lib/utils";
import { VoteType } from "../../types/api";

export type VoterType = "ccCommittee" | "dReps" | "sPos";

type VotesGroupProps = {
  type: VoterType;
  yesVotes: number;
  yesVotesPercentage?: number;
  noVotes: number;
  noVotesPercentage?: number;
  notVotedVotes?: number;
  notVotedPercentage?: number;
  abstainVotes: number;
  threshold?: number | null;
};


const GovActionVoteElement = ({
  type,
  yesVotes,
  yesVotesPercentage,
  noVotes,
  noVotesPercentage,
  notVotedVotes,
  notVotedPercentage,
  abstainVotes,
  threshold,
}: VotesGroupProps) => {

  const getGovActionVoteGroupLabel = (type: VoterType) => {
    switch (type) {
      case "ccCommittee":
        return "Constitutional Committee";
      case "dReps":
        return "DReps";
      case "sPos":
        return "SPOs";
      default:
        return type
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      data-testid={`submitted-votes-${type}`}
    >
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "600",
          lineHeight: "24px",
        }}
      >
        {getGovActionVoteGroupLabel(type)}
      </Typography>
      {threshold !== undefined && threshold !== null && (
        <Box display="flex" flexDirection="row" flex={1} alignItems="center">
          <Typography
            sx={{
              marginRight: 1,
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: "400",
              color: "rgba(36, 34, 50, 1)",
            }}
          >
            Ratification Threshold:
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              lineHeight: "16px",
              color: "neutralGray",
            }}
          >
            {threshold * 100}%
          </Typography>
        </Box>
      )}
      <Vote
        type={type}
        vote="yes"
        percentage={yesVotesPercentage}
        value={yesVotes}
      />
      <Vote type={type} vote="abstain" value={abstainVotes} />
      <Vote
        type={type}
        vote="no"
        percentage={noVotesPercentage}
        value={noVotes}
      />
      {typeof notVotedVotes === "number" && (
        <Vote
          type={type}
          vote="notVoted"
          percentage={notVotedPercentage}
          value={notVotedVotes}
        />
      )}
    </Box>
  );
};

type VoteProps = {
  type: VoterType;
  vote: VoteType;
  value: number;
  percentage?: number;
};
const Vote = ({ type, vote, value, percentage }: VoteProps) => (
  <Box
    sx={{
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      columnGap: 1.5,
    }}
  >
    <GovActionVotePill vote={vote} width={115} isCC={type === "ccCommittee"} />
    <Box
      display="flex"
      flexDirection="row"
      flex={1}
      justifyContent="space-between"
    >
      <Typography
        data-testid={`submitted-votes-${type}-${vote}`}
        sx={{
          fontSize: 16,
          wordBreak: "break-all",
          lineHeight: "24px",
          fontWeight: "500",
        }}
      >
        {type !== "ccCommittee"
          ? `₳ ${correctAdaFormatWithSuffix(value)}`
          : value}
      </Typography>
      {vote !== "abstain" && typeof percentage === "number" && (
        <Typography
          data-testid={`submitted-votes-${type}-${vote}-percentage`}
          sx={{
            ml: 1,
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: "500",
            color: "neutralGray",
          }}
        >
          {typeof percentage === "number" ? `${percentage.toFixed(2)}%` : ""}
        </Typography>
      )}
    </Box>
  </Box>
);

export default GovActionVoteElement;