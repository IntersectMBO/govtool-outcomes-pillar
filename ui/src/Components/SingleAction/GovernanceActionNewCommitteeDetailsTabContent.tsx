import { Box } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import { encodeCIP129CcIdentifier } from "../../lib/utils";
import { Typography } from "../Atoms/Typography";
import CopyButton from "../Atoms/CopyButton";
import { useTranslation } from "../../contexts/I18nContext";
import { EpochDiffView } from "../Molecules/EpochDiffView";

type CCMember = {
  expirationEpoch: number | null;
  hasScript: boolean;
  hash: string;
  type: string;
  newExpirationEpoch?: number | null;
};

type CCMemberToBeRemoved = {
  hash: string;
  type: string;
  hasScript: boolean;
};

export const GovernanceActionNewCommitteeDetailsTabContent = ({
  description,
}: Pick<GovernanceAction, "description">) => {
  const { t } = useTranslation();

  const members = (description?.members as CCMember[]) || [];
  const membersToBeRemoved =
    (description?.membersToBeRemoved as CCMemberToBeRemoved[]) || [];

  const membersToBeAdded = members
    .filter(
      (member) =>
        member?.expirationEpoch === undefined ||
        member?.expirationEpoch === null
    )
    .filter((member) => member?.hash)
    .map((member) => ({
      cip129Identifier: encodeCIP129CcIdentifier({
        keyHash: member.hash,
        typePrefix: member.hasScript ? "13" : "12",
        bech32Prefix: "cc_cold",
      }),
      expirationEpoch: member.expirationEpoch,
      newExpirationEpoch: member.newExpirationEpoch,
      hash: member.hash,
    }));

  const membersToBeUpdated = members
    .filter(
      (member) => !!member?.expirationEpoch && !!member?.newExpirationEpoch
    )
    .filter((member) => member?.hash)
    .map((member) => ({
      cip129Identifier: encodeCIP129CcIdentifier({
        keyHash: member.hash,
        typePrefix: member.hasScript ? "13" : "12",
        bech32Prefix: "cc_cold",
      }),
      expirationEpoch: member.expirationEpoch,
      newExpirationEpoch: member.newExpirationEpoch,
      hash: member.hash,
    }));

  const removedMembers = membersToBeRemoved
    .filter((member) => member?.hash && member.hash.trim() !== "")
    .map((member) => ({
      hash: member.hash,
      cip129Identifier: encodeCIP129CcIdentifier({
        keyHash: member.hash,
        typePrefix: member.hasScript ? "13" : "12",
        bech32Prefix: "cc_cold",
      }),
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
              wordBreak: "break-word",
            }}
          >
            {t("outcome.membersToBeAddedToCommittee")}
          </Typography>
          <Box display="flex" flexDirection="column">
            {membersToBeAdded.map(
              ({ cip129Identifier, hash, newExpirationEpoch }) => (
                <Box key={hash} display="flex" flexDirection="column">
                  <Box
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
                        width: "auto",
                        lineHeight: "24px",
                        color: "primaryBlue",
                        wordBreak: "break-word",
                      }}
                    >
                      {cip129Identifier}
                    </Typography>
                    <Box>
                      <CopyButton text={cip129Identifier} />
                    </Box>
                  </Box>
                  <Typography
                    data-testid="member-expiration-date"
                    sx={{
                      fontSize: 14,
                      fontWeight: 400,
                      lineHeight: "24px",
                      color: "textGray",
                      wordBreak: "break-word",
                    }}
                  >
                    {`${t("outcome.expirationEpoch")} ${
                      newExpirationEpoch ?? "-"
                    }`}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Box>
      )}

      {removedMembers?.length > 0 && (
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
              wordBreak: "break-word",
            }}
          >
            {t("outcome.membersToBeRemovedToCommittee")}
          </Typography>
          <Box display="flex" flexDirection="column">
            {removedMembers.map(({ hash, cip129Identifier }) => (
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
                    wordBreak: "break-word",
                  }}
                >
                  {cip129Identifier}
                </Typography>
                <Box>
                  <CopyButton text={cip129Identifier} />
                </Box>
              </Box>
            ))}
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
              wordBreak: "break-word",
            }}
          >
            {t("outcome.changeToTermsOfExistingMembers")}
          </Typography>
          {membersToBeUpdated.map(
            ({
              cip129Identifier,
              newExpirationEpoch,
              expirationEpoch,
              hash,
            }) => (
              <Box key={hash} display="flex" flexDirection="column">
                <Box
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
                      wordBreak: "break-word",
                    }}
                  >
                    {cip129Identifier}
                  </Typography>
                  <Box>
                    <CopyButton text={cip129Identifier} />
                  </Box>
                </Box>
                <EpochDiffView
                  expirationEpoch={expirationEpoch}
                  newExpirationEpoch={newExpirationEpoch}
                />
              </Box>
            )
          )}
        </Box>
      )}

      {description?.threshold != null && (
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
              wordBreak: "break-word",
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
              wordBreak: "break-word",
            }}
          >
            {typeof description.threshold === "number"
              ? description.threshold.toString()
              : String(description.threshold)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
