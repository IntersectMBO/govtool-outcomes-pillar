import { TableCell, TableRow, Typography, Chip, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import CopyButton from "../Atoms/CopyButton";
import {
  correctAdaFormatWithSuffix,
  encodeCIP129Identifier,
  formatTimeStamp,
  truncateString,
} from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { GovernanceActionVoteData } from "../../types/api";
import { useGetUnvalidatedMetadataQuery } from "../../hooks/useGetUnvalidatedMetadataQuery";

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

const extractValue = (data: any): string | null => {
  if (!data) return null;
  if (typeof data === "string") return data;
  if (data["@value"]) return data["@value"];
  return null;
};

const extractCCName = (metadata: any): string | null => {
  if (!metadata) return null;

  if (
    metadata.authors &&
    Array.isArray(metadata.authors) &&
    metadata.authors.length > 0
  ) {
    const firstAuthor = metadata.authors[0];
    if (firstAuthor.name) {
      return extractValue(firstAuthor.name);
    }
  }

  return null;
};

const extractDRepName = (metadata: any): string | null => {
  if (!metadata) return null;

  if (metadata.body?.givenName) {
    return extractValue(metadata.body.givenName);
  }

  if (metadata.givenName) {
    return extractValue(metadata.givenName);
  }

  return null;
};

const extractPoolName = (metadata: any): string | null => {
  if (!metadata) return null;

  const name = metadata.name ? extractValue(metadata.name) : null;
  const ticker = metadata.ticker ? extractValue(metadata.ticker) : null;

  if (name && ticker) {
    return `${name} - ${ticker}`;
  }

  if (name) {
    return name;
  }

  if (ticker) {
    return ticker;
  }

  return null;
};

const getVoterDisplayName = (
  vote: GovernanceActionVoteData,
  drepMetadata?: any,
  poolMetadata?: any,
  ccMetadata?: any
): string => {
  if (vote.voter_role === "DRep") {
    if (vote.drep_given_name) {
      return vote.drep_given_name;
    }

    const nameFromMetadata = extractDRepName(drepMetadata);
    if (nameFromMetadata) {
      return nameFromMetadata;
    }
  }

  if (vote.voter_role === "SPO") {
    const existingName = vote.pool_metadata_json?.name;
    const existingTicker =
      vote.pool_ticker_name || vote.pool_metadata_json?.ticker;

    if (existingName && existingTicker) {
      return `${existingName} - ${existingTicker}`;
    }

    if (existingName) {
      return existingName;
    }
    if (existingTicker) {
      return existingTicker;
    }

    const nameFromMetadata = extractPoolName(poolMetadata);
    if (nameFromMetadata) {
      return nameFromMetadata;
    }
  }

  if (vote.voter_role === "ConstitutionalCommittee") {
    const nameFromMetadata = extractCCName(ccMetadata);
    if (nameFromMetadata) {
      return nameFromMetadata;
    }
  }

  return "--";
};

const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case "ConstitutionalCommittee":
      return "CC";
    default:
      return role;
  }
};

const getVoterIdentity = (vote: GovernanceActionVoteData): string => {
  if (vote.voter_role === "DRep") {
    return encodeCIP129Identifier({
      txID: (vote.has_script ? "23" : "22") + vote.voter_identity,
      bech32Prefix: vote.has_script ? "drep_script" : "drep",
    });
  } else if (vote.voter_role === "ConstitutionalCommittee") {
    return encodeCIP129Identifier({
      txID: (vote.has_script ? "02" : "13") + vote.voter_identity,
      bech32Prefix: vote.has_script ? "cc_hot" : "cc_cold",
    });
  } else if (vote.voter_role === "SPO") {
    return vote.voter_identity;
  }

  return vote.voter_identity;
};

export function GovernanceActionVote({ vote }: GovernanceActionVoteProps) {
  const shouldFetchDRepMetadata =
    vote.voter_role === "DRep" &&
    !vote.drep_given_name &&
    vote.drep_metadata_url;

  const shouldFetchPoolMetadata =
    vote.voter_role === "SPO" &&
    !vote.pool_metadata_json?.name &&
    !vote.pool_ticker_name &&
    !vote.pool_metadata_json?.ticker &&
    vote.pool_metadata_url;

  const shouldFetchCCMetadata =
    vote.voter_role === "ConstitutionalCommittee" && vote.vote_anchor_url;

  const { metadata: drepMetadata } = useGetUnvalidatedMetadataQuery(
    shouldFetchDRepMetadata ? vote.drep_metadata_url! : ""
  );

  const { metadata: poolMetadata } = useGetUnvalidatedMetadataQuery(
    shouldFetchPoolMetadata ? vote.pool_metadata_url! : ""
  );

  const { metadata: ccMetadata } = useGetUnvalidatedMetadataQuery(
    shouldFetchCCMetadata ? vote.vote_anchor_url! : ""
  );

  const displayName = getVoterDisplayName(
    vote,
    drepMetadata,
    poolMetadata,
    ccMetadata
  );
  const roleDisplay = getRoleDisplayName(vote.voter_role);

  return (
    <StyledTableRow>
      <TableCell>
        <Box>
          <Typography variant="body2" fontWeight={400} color="textBlack">
            {truncateString(displayName)}
          </Typography>
          <Box display="flex" alignItems="center" gap={1.25}>
            <Typography variant="caption" color="textLightGray">
              {truncateString(getVoterIdentity(vote))}
            </Typography>
            <CopyButton
              text={getVoterIdentity(vote)}
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
            ? `₳${correctAdaFormatWithSuffix(Number(vote.voting_power), 3)}`
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
