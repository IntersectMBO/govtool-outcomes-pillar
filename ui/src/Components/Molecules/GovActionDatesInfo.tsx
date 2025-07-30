import { IconInformationCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { Box, Icon } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import {
  encodeCIP129Identifier,
  formatTimeStamp,
  getProposalStatus,
} from "../../lib/utils";
import { Typography } from "../Atoms/Typography";
import { useScreenDimension } from "../../hooks/useDimensions";
import { useTranslation } from "../../contexts/I18nContext";
import { Tooltip } from "../Atoms/Tooltip";

interface GovActionDatesInfoProps {
  action: GovernanceAction;
  isCard?: boolean;
}

const GovActionDatesInfo = ({
  action,
  isCard = false,
}: GovActionDatesInfoProps) => {
  const { isMobile } = useScreenDimension();
  const { t } = useTranslation();

  const proposalStatus = getProposalStatus(action.status);

  const isExpired = ["Expired", "Not Ratified", "Enacted"].includes(
    proposalStatus
  );

  const idCIP129 = encodeCIP129Identifier({
    txID: action?.tx_hash,
    index: action?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });

  const renderSubmissionInfoTooltip = () => {
    return (
      <Tooltip
        heading={t("outcome.dates.submission.title")}
        paragraphOne={t("outcome.dates.submission.description")}
      >
        <Icon>
          <IconInformationCircle width={19} height={19} />
        </Icon>
      </Tooltip>
    );
  };

  const renderExpirationInfoTooltip = () => {
    return (
      <Tooltip
        heading={t("outcome.dates.expired.title")}
        paragraphOne={t("outcome.dates.expired.paragraphOne")}
        paragraphTwo={t("outcome.dates.expired.paragraphTwo")}
      >
        <Icon>
          <IconInformationCircle width={19} height={19} />
        </Icon>
      </Tooltip>
    );
  };

  return (
    <Box
      data-testid={`${idCIP129}-dates`}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "auto",
        borderRadius: "12px",
        textAlign: "center",
        border: 1,
        borderColor: "lightblue",
      }}
    >
      <Box
        data-testid={`${idCIP129}-submitted-date`}
        sx={{
          backgroundColor: "#D6E2FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          padding: "6px 0",
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 12 }}>
          {t("outcome.dates.submitted")}{" "}
          <Typography component="span" fontWeight={600} variant="caption">
            {formatTimeStamp(
              action.time,
              isCard || isMobile ? "short" : "full"
            )}
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 0.5,
          }}
        >
          <Typography variant="caption">
            ({t("outcome.epoch")} {action.epoch_no})
          </Typography>
          {renderSubmissionInfoTooltip()}
        </Box>
      </Box>
      <Box
        data-testid={`${idCIP129}-${isExpired ? "Expired" : "Expires"}-date`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          padding: "6px 0",
          borderBottomLeftRadius: "inherit",
          borderBottomRightRadius: "inherit",
          flexWrap: "wrap",
        }}
      >
        <Typography variant="caption">
          {isExpired
            ? t("outcome.dates.expired.label")
            : t("outcome.dates.expires")}{" "}
          <Typography component="span" fontWeight={600} variant="caption">
            {action.status.expired_epoch !== null
              ? formatTimeStamp(
                  action.status_times.expired_time as string,
                  isCard || isMobile ? "short" : "full"
                )
              : formatTimeStamp(
                  action.expiry_date,
                  isCard || isMobile ? "short" : "full"
                )}
          </Typography>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 0.5,
          }}
        >
          <Typography variant="caption">
            ({t("outcome.epoch")}{" "}
            {action.status.expired_epoch !== null
              ? action.status.expired_epoch
              : action.expiration}
            )
          </Typography>
          {renderExpirationInfoTooltip()}
        </Box>
      </Box>
    </Box>
  );
};

export default GovActionDatesInfo;
