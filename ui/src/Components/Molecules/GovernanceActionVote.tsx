import { TableCell, TableRow, Typography, Chip, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CopyButton from "../Atoms/CopyButton";
import {
  correctAdaFormatWithSuffix,
  formatTimeStamp,
  truncateString,
} from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { GovernanceActionVoteData } from "../../types/api";

const StyledTableRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "#f8f9fa",
  },
  "& td": {
    borderBottom: "1px solid #f0f0f0",
    padding: "16px",
  },
}));

const VoteChip = styled(Chip)(({ vote }: { vote: string }) => ({
  fontWeight: 400,
  fontSize: "12px",
  height: "28px",
  width: "auto",
  ...(vote === "Yes" && {
    backgroundColor: "#4caf50",
    color: "white",
  }),
  ...(vote === "No" && {
    backgroundColor: "#f44336",
    color: "white",
  }),
  ...(vote === "Abstain" && {
    backgroundColor: "#ff9800",
    color: "white",
  }),
}));

interface GovernanceActionVoteProps {
  vote: GovernanceActionVoteData;
}

const getVoterDisplayName = (vote: GovernanceActionVoteData): string => {
  if (vote.voter_role === "DRep" && vote.drep_given_name) {
    return vote.drep_given_name;
  }
  if (vote.voter_role === "SPO") {
    if (vote.pool_metadata_json?.name) {
      return vote.pool_metadata_json.name;
    }
    if (vote.pool_ticker_name) {
      return vote.pool_ticker_name;
    }
    if (vote.pool_metadata_json?.ticker) {
      return vote.pool_metadata_json.ticker;
    }
  }
  return "Unknown";
};

const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "ConstitutionalCommittee":
      return "CC";
    default:
      return role;
  }
};

export function GovernanceActionVote({ vote }: GovernanceActionVoteProps) {
  const displayName = getVoterDisplayName(vote);
  const roleDisplay = getRoleDisplayName(vote.voter_role);

  return (
    <StyledTableRow>
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight={400} color="textBlack">
            {displayName}
          </Typography>
          <Box display="flex" alignItems="center" gap={1.25}>
            <Typography variant="caption" color="textLightGray">
              {truncateString(vote.voter_identity)}
            </Typography>
            <CopyButton
              text={vote.voter_identity}
              width={15}
              height={15}
              color="black"
            />
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={400}>
          {roleDisplay}
        </Typography>
      </TableCell>
      <TableCell>
        <VoteChip label={vote.vote} size="small" vote={vote.vote} />
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={400}>
          {!!vote.voting_power
            ? `₳${correctAdaFormatWithSuffix(Number(vote.voting_power))}`
            : "--"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" fontWeight={400}>
          {vote.vote_epoch}
        </Typography>
      </TableCell>
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight={400}>
            {formatDistanceToNow(new Date(vote.vote_time), {
              addSuffix: true,
            })}
          </Typography>
          <Typography variant="caption" color="textLightGray">
            {formatTimeStamp(vote.vote_time)}
          </Typography>
        </Box>
      </TableCell>
    </StyledTableRow>
  );
}
