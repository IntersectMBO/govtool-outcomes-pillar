import { Box } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import { encodeCIP129Identifier } from "../../lib/utils";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";
import { useTranslation } from "../../contexts/I18nContext";

type CCMember = {
  expirationEpoch: number;
  hasScript: boolean;
  hash: string;
  newExpirationEpoch?: number;
};

export const GovernanceActionNewCommitteeDetailsTabContent = ({
  description,
}: Pick<GovernanceAction, "description">) => {
  const { t } = useTranslation();

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
      {membersToBeAdded?.length > 0 && (
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
            {t("outcome.membersToBeAddedToCommittee")}
          </Typography>
          <Box display="flex" flexDirection="column">
            {membersToBeAdded.map(({ cip129Identifier }) => (
              <Box
                key={cip129Identifier}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={1}
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
                <Box>
                  <CopyButton text={cip129Identifier.toString()} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {(description?.membersToBeRemoved as string[])?.filter(
        (hash) => hash != null && hash !== ""
      )?.length > 0 && (
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
            {t("outcome.membersToBeRemovedToCommittee")}
          </Typography>
          <Box display="flex" flexDirection="column">
            {(description?.membersToBeRemoved as string[]).map((hash) => {
              if (!hash) return null;
              return (
                <Box
                  key={hash}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  gap={1}
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
                  <Box>
                    <CopyButton
                      text={encodeCIP129Identifier({
                        txID: hash,
                        bech32Prefix: "cc_cold",
                      })}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {membersToBeUpdated?.length > 0 && (
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
            {t("outcome.changeToTermsOfExistingMembers")}
          </Typography>
          {membersToBeUpdated.map(
            ({ cip129Identifier, newExpirationEpoch, expirationEpoch }) => (
              <Box display="flex" flexDirection="column">
                <Box
                  key={cip129Identifier}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  data-testid={`${cip129Identifier}-member-id`}
                  gap={1}
                >
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
                  <Box>
                    <CopyButton text={cip129Identifier.toString()} />
                  </Box>
                </Box>
                <Typography
                  data-testid="member-expiration-update"
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: "24px",
                    color: "textGray",
                  }}
                >
                  {`${t("outcome.toEpoch")} ${newExpirationEpoch || "-"} ${t(
                    "outcome.fromEpoch"
                  )} ${expirationEpoch || "-"}`}
                </Typography>
              </Box>
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
            {t("outcome.newThreshold")}
          </Typography>
          <Typography
            data-testid="new-threshold-value"
            sx={{
              fontSize: 16,
              fontWeight: 400,
              maxWidth: "auto",
              lineHeight: "24px",
              color: "textGray",
            }}
          >
            {(description?.threshold as number).toString()}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
