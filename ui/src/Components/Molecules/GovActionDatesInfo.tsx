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

// provide correct status
  const getDateDisplayInfo = () => {
    switch (proposalStatus) {
      case "Expired":
        return {
          label: t("outcome.dates.expired.label"),
          date: action.status_times.expired_time as string,
          epoch: action.status.expired_epoch as number,
          tooltipType: "expired",
        };
      case "Not Ratified":
        return {
          label: t("outcome.dates.notRatified.label"),
          date: action.status_times.dropped_time as string,
          epoch: action.status.dropped_epoch as number,
          tooltipType: "notRatified",
        };
      case "Enacted":
        return {
          label: t("outcome.dates.enacted.label"),
          date: action.status_times.enacted_time as string,
          epoch: action.status.enacted_epoch as number,
          tooltipType: "enacted",
        };
      default:
        return {
          label: t("outcome.dates.expires"),
          date: action.expiry_date,
          epoch: action.expiration,
          tooltipType: "expiry",
        };
    }
  };

  const dateDisplayInfo = getDateDisplayInfo();

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

  const renderDateInfoTooltip = () => {
    const tooltipTranslationKey = `outcome.dates.${dateDisplayInfo.tooltipType}`;

    return (
      <Tooltip
        heading={t(`${tooltipTranslationKey}.title`)}
        paragraphOne={t(`${tooltipTranslationKey}.paragraphOne`)}
        paragraphTwo={
          dateDisplayInfo.tooltipType === "expiry"
            ? t(`${tooltipTranslationKey}.paragraphTwo`)
            : undefined
        }
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
        data-testid={`${idCIP129}-${dateDisplayInfo.label.replace(":", "")}-date`}
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
          {dateDisplayInfo.label}{" "}
          <Typography component="span" fontWeight={600} variant="caption">
            {formatTimeStamp(
              dateDisplayInfo.date,
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
            ({t("outcome.epoch")} {dateDisplayInfo.epoch})
          </Typography>
          {renderDateInfoTooltip()}
        </Box>
      </Box>
    </Box>
  );
};

export default GovActionDatesInfo;
