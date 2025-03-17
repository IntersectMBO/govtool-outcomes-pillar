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
    <Box>
      {membersToBeAdded.length > 0 && (
        <Box mb="32px">
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "neutralGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Members to be added to the Committee
          </Typography>
          {membersToBeAdded.map(({ cip129Identifier }) => (
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
          ))}
        </Box>
      )}
      {(description?.membersToBeRemoved as string[]).length > 0 && (
        <Box mb="32px">
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "neutralGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Members to be removed from the Committee
          </Typography>
          {(description?.membersToBeRemoved as string[]).map((hash) => (
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
        <Box mb="32px">
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "neutralGray",
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
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
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
        <Box>
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              lineHeight: "20px",
              color: "neutralGray",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            New threshold value
          </Typography>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 400,
              maxWidth: "auto",
              lineHeight: "24px",
            }}
          >
            {(description?.threshold as number).toString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
