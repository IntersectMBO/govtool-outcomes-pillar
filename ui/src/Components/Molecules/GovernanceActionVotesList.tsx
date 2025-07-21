import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  IconArrowDown,
  IconArrowUp,
} from "@intersect.mbo/intersectmbo.org-icons-set";
import { Button } from "../Atoms/Button";
import { useGetGovActionVotesQuery } from "../../hooks/useGetGovActionVotesQuery";
import { ActionsEmptyState } from "./ActionsEmptyState";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "../../contexts/I18nContext";
import { VoteLoader } from "../Loaders/VoteLoader";
import { GovernanceActionVoteData } from "../../types/api";
import { GovernanceActionVote } from "./GovernanceActionVote";

const StyledTableContainer = styled(TableContainer)(() => ({
  backgroundColor: "white",
  boxShadow: "0px 4px 15px 0px #DDE3F5",
  borderRadius: "16px",
  border: "none",
}));

const StyledTableHead = styled(TableHead)(() => ({
  backgroundColor: "white",
}));

const StyledHeaderCell = styled(TableCell)<{ sortable?: boolean }>(
  ({ sortable }) => ({
    backgroundColor: "white",
    borderBottom: "1px solid #e0e0e0",
    padding: "16px",
    fontWeight: 500,
    fontSize: "15px",
    whiteSpace: "nowrap",
    ...(sortable && {
      cursor: "pointer",
      userSelect: "none",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    }),
  })
);

interface GovernanceActionVotesListProps {
  actionId: string;
}

type SortField = "vote" | "voting_power" | "vote_time";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 20;

export default function GovernanceActionVotesList({
  actionId,
}: GovernanceActionVotesListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const votesType = searchParams.get("votes") || "all_votes";
  const roleType = searchParams.get("role") || "all_voters";

  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder");

  if (!currentSortBy || !currentSortOrder) {
    const newParams = new URLSearchParams(searchParams);
    if (!currentSortBy) newParams.set("sortBy", "vote_time");
    if (!currentSortOrder) newParams.set("sortOrder", "desc");
    setSearchParams(newParams);
  }

  const sortBy = (searchParams.get("sortBy") || "vote_time") as SortField;
  const sortOrder = (searchParams.get("sortOrder") || "desc") as SortOrder;

  const {
    votes,
    isVotesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetGovActionVotesQuery(
    actionId,
    votesType,
    roleType,
    sortBy,
    sortOrder,
    ITEMS_PER_PAGE
  );

  const displayedVotes: GovernanceActionVoteData[] = votes?.pages?.flat() || [];

  const handleSort = (field: SortField) => {
    const newParams = new URLSearchParams(searchParams);

    if (sortBy === field) {
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      newParams.set("sortOrder", newOrder);
    } else {
      newParams.set("sortBy", field);
      newParams.set("sortOrder", "asc");
    }

    setSearchParams(newParams);
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) {
      return (
        <Box display="flex" alignItems="center" sx={{ opacity: 0.3 }}>
          <IconArrowUp fontSize={15} />
          <IconArrowDown fontSize={15} />
        </Box>
      );
    }

    return sortOrder === "asc" ? (
      <IconArrowUp fontSize={20} />
    ) : (
      <IconArrowDown fontSize={20} />
    );
  };

  return (
    <Box>
      <StyledTableContainer>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledHeaderCell sx={{ minWidth: "260px", color: "textGray" }}>
                Voter
              </StyledHeaderCell>
              <StyledHeaderCell sx={{ color: "textGray" }}>
                Role
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{ color: "textGray" }}
                sortable
                onClick={() => handleSort("vote")}
              >
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getSortIcon("vote")}
                  Vote
                </Box>
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{ color: "textGray" }}
                sortable
                onClick={() => handleSort("voting_power")}
              >
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getSortIcon("voting_power")}
                  Voting Power
                </Box>
              </StyledHeaderCell>
              <StyledHeaderCell sx={{ color: "textGray" }}>
                Submission Epoch
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{ color: "textGray" }}
                sortable
                onClick={() => handleSort("vote_time")}
              >
                <Box display="flex" alignItems="center" gap={0.5}>
                  {getSortIcon("vote_time")}
                  Transaction
                </Box>
              </StyledHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {displayedVotes.map((vote) => (
              <GovernanceActionVote key={vote.id} vote={vote} />
            ))}
          </TableBody>
        </Table>

        {isVotesLoading &&
          !displayedVotes.length &&
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <VoteLoader key={index} />
          ))}

        {!isVotesLoading && !displayedVotes.length && (
          <Box sx={{ paddingY: 3, paddingX: 2, width: "auto" }}>
            <ActionsEmptyState
              title="outcome.votes.notFoundTitle"
              description="outcome.votes.notFoundDescription"
              dataTestId="votes-empty-state-placeholder"
            />
          </Box>
        )}
      </StyledTableContainer>

      {hasNextPage && (
        <Box sx={{ justifyContent: "center", display: "flex", mt: 2 }}>
          <Button
            data-testid="load-more-votes-button"
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {isFetchingNextPage
              ? t("loaders.loading")
              : t("outcome.votes.showMore")}
          </Button>
        </Box>
      )}
    </Box>
  );
}
