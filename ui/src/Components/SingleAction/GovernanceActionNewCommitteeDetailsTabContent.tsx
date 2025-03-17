import { Box } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import { encodeCIP129Identifier } from "../../lib/utils";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";

type CCMember = {
  expirationEpoch: number;
  hasScript: boolean;
  hash: string;
  newExpirationEpoch?: number;
};

export const GovernanceActionNewCommitteeDetailsTabContent = ({
  description,
}: Pick<GovernanceAction, "description">) => {
  const membersToBeAdded = ((description?.members as CCMember[]) || [])
    .filter((member) => member.newExpirationEpoch === undefined)
    .map((member) => ({
      cip129Identifier: encodeCIP129Identifier({
        txID: (member.hasScript ? "02" : "13") + member.hash,
        bech32Prefix: member.hasScript ? "cc_hot" : "cc_cold",
      }),
      expirationEpoch: member.expirationEpoch,
    }));

  const membersToBeUpdated = ((description?.members as CCMember[]) || [])
    .filter((member) => member.newExpirationEpoch !== undefined)
    .map((member) => ({
      cip129Identifier: encodeCIP129Identifier({
        txID: (member.hasScript ? "02" : "13") + member.hash,
        bech32Prefix: member.hasScript ? "cc_hot" : "cc_cold",
      }),
      expirationEpoch: member.expirationEpoch,
      newExpirationEpoch: member.newExpirationEpoch,
    }));

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {membersToBeAdded.length > 0 && (
        <Box
          data-testid="members-to-be-added-to-the-committee"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "textGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Members to be added to the Committee
          </Typography>
          {membersToBeAdded.map(({ cip129Identifier }) => (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography
                data-testid={`member-to-be-added-to-the-committee-id-${cip129Identifier}`}
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  width: "100%",
                  lineHeight: "24px",
                  color: "primaryBlue",
                }}
              >
                {cip129Identifier}
              </Typography>
              <Box ml={1}>
                <CopyButton text={cip129Identifier.toString()} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
      {(description?.membersToBeRemoved as string[]).length > 0 && (
        <Box
          data-testid="members-to-be-removed-from-the-committee"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "textGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Members to be removed from the Committee
          </Typography>
          {(description?.membersToBeRemoved as string[]).map((hash) => (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              <Typography
                data-testid="members-to-be-removed-from-the-committee-id"
                sx={{
                  fontSize: 16,
                  fontWeight: 400,
                  maxWidth: "auto",
                  lineHeight: "24px",
                  color: "primaryBlue",
                }}
              >
                {encodeCIP129Identifier({
                  txID: hash,
                  bech32Prefix: "cc_cold",
                })}
              </Typography>
              <Box ml={1}>
                <CopyButton
                  text={encodeCIP129Identifier({
                    txID: hash,
                    bech32Prefix: "cc_cold",
                  })}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {membersToBeUpdated.length > 0 && (
        <Box
          data-testid="change-to-terms-of-existing-members"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "textGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Change to terms of existing members
          </Typography>
          {membersToBeUpdated.map(
            ({ cip129Identifier, newExpirationEpoch, expirationEpoch }) => (
              <>
                <Box display="flex" flexDirection="row">
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 400,
                      maxWidth: "auto",
                      lineHeight: "24px",
                      color: "primaryBlue",
                    }}
                  >
                    {cip129Identifier}
                  </Typography>
                  <Box ml={1}>
                    <CopyButton text={cip129Identifier.toString()} />
                  </Box>
                </Box>
                <Typography
                  data-testid="member-expiration-update"
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: "24px",
                    color: "neutralGray",
                  }}
                >
                  {`To ${newExpirationEpoch} epoch ${expirationEpoch} epoch`}
                </Typography>
              </>
            )
          )}
        </Box>
      )}
      {description?.threshold && (
        <Box
          data-testid="new-threshold-container"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "textGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            New threshold value
          </Typography>
          <Typography
            data-testid="new-threshold-value"
            sx={{
              fontSize: 16,
              fontWeight: 500,
              maxWidth: "auto",
              lineHeight: "24px",
              color: "neutralGray",
            }}
          >
            {(description?.threshold as number).toString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
