import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  IconArrowDown,
  IconArrowUp,
} from "@intersect.mbo/intersectmbo.org-icons-set";
import CopyButton from "../Atoms/CopyButton";
import { useGetGovActionVotesQuery } from "../../hooks/useGetGovActionVotesQuery";
import { ActionsEmptyState } from "./ActionsEmptyState";
import {
  correctAdaFormatWithSuffix,
  formatTimeStamp,
  truncateString,
} from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "react-router-dom";

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "white",
  boxShadow: "0px 4px 15px 0px #DDE3F5",
  borderRadius: "16px",
  border: "none",
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "white",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "white",
  borderBottom: "1px solid #e0e0e0",
  padding: "16px",
  fontWeight: 500,
  fontSize: "15px",
  color: "textBlack",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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

interface GovernanceActionVotesListProps {
  actionId: string;
}

export default function GovernanceActionVotesList({
  actionId,
}: GovernanceActionVotesListProps) {
  const [searchParams] = useSearchParams();

  const votesType = searchParams.get("votes") || "AllVotes";
  const roleType = searchParams.get("role") || "AllVoters";
  const { votes, isVotesLoading } = useGetGovActionVotesQuery(
    actionId,
    votesType,
    roleType
  );

  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHead>
          <TableRow>
            <StyledHeaderCell>
              <Box display="flex" alignItems="center">
                Voter
              </Box>
            </StyledHeaderCell>
            <StyledHeaderCell>
              <Box display="flex" alignItems="center">
                <IconArrowDown />
                <IconArrowUp />
                Role
              </Box>
            </StyledHeaderCell>
            <StyledHeaderCell>
              <Box display="flex" alignItems="center">
                <IconArrowDown />
                <IconArrowUp />
                Vote
              </Box>
            </StyledHeaderCell>
            <StyledHeaderCell>
              <Box display="flex" alignItems="center">
                <IconArrowDown />
                <IconArrowUp />
                Voting Power
              </Box>
            </StyledHeaderCell>
            <StyledHeaderCell>
              <Box display="flex" alignItems="center">
                <IconArrowDown />
                <IconArrowUp />
                Submission Epoch
              </Box>
            </StyledHeaderCell>
            <StyledHeaderCell>
              <Box display="flex" alignItems="center">
                <IconArrowDown />
                <IconArrowUp />
                Transaction
              </Box>
            </StyledHeaderCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {!isVotesLoading &&
            votes &&
            votes?.length > 0 &&
            votes?.map((vote) => (
              <StyledTableRow key={vote.id}>
                <TableCell>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={400}
                      color="textBlack"
                    >
                      Lido Nation
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
                    {vote.voter_role === "ConstitutionalCommittee"
                      ? "CC"
                      : vote.voter_role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <VoteChip label={vote.vote} size="small" vote={vote.vote} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={400}>
                    ₳{correctAdaFormatWithSuffix(Number(vote.voting_power))}
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
            ))}
        </TableBody>
      </Table>
      {!isVotesLoading && !votes?.length && (
        <Box sx={{ paddingY: 3, paddingX: 2, width: "auto" }}>
          <ActionsEmptyState
            title="outcome.votes.notFoundTitle"
            description="outcome.votes.notFoundDescription"
          />
        </Box>
      )}
    </StyledTableContainer>
  );
}
