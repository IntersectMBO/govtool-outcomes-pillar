import { IconInformationCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { Box, Icon, Typography } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import {
  encodeCIP129Identifier,
  formatTimeStamp,
  getProposalStatus,
} from "../../lib/utils";
import { Tooltip } from "./Tooltip";

interface GovActionDatesInfoProps {
  action: GovernanceAction;
}

const GovActionDatesInfo = ({ action }: GovActionDatesInfoProps) => {
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
        heading="Submission Date"
        paragraphOne="The date when the governance action was submitted on-chain."
        placement="bottom-end"
        arrow
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
        heading={isExpired ? "Expired Date" : "Expiry Date"}
        paragraphOne="The date when the governance action will expiry if it doesn't
              reach ratification thresholds."
        paragraphTwo="IMPORTANT: If the governance action is ratified before the
               expiry date it will be considered ratified and it will not be
               available to vote on afterwards."
        placement="bottom-end"
        arrow
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
        width: "100%",
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
          gap: 1,
          padding: "6px 0",
          borderTopLeftRadius: "inherit",
          borderTopRightRadius: "inherit",
        }}
      >
        <Typography variant="caption" sx={{ fontSize: 12 }}>
          Submitted:{" "}
          <Typography component="span" fontWeight={600} variant="caption">
            {formatTimeStamp(action.time)}
          </Typography>
        </Typography>
        {action.epoch_no && (
          <Typography variant="caption">
            (Epoch{" "}
            <Typography component="span" variant="caption">
              {action.epoch_no}
            </Typography>
            )
          </Typography>
        )}
        {renderSubmissionInfoTooltip()}
      </Box>
      <Box
        data-testid={`${idCIP129}-${isExpired ? "Expired" : "Expires"}-date`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          padding: "6px 0",
          borderBottomLeftRadius: "inherit",
          borderBottomRightRadius: "inherit",
        }}
      >
        <Typography variant="caption">
          {isExpired ? "Expired: " : "Expires: "}
          <Typography component="span" fontWeight={600} variant="caption">
            {action.status.expired_epoch !== null
              ? formatTimeStamp(action.status_times.expired_time as string)
              : formatTimeStamp(action.expiry_date)}
          </Typography>
        </Typography>
        <Typography variant="caption">
          (Epoch{" "}
          <Typography component="span" variant="caption">
            {action.status.expired_epoch !== null
              ? action.status.expired_epoch
              : action.expiration}
          </Typography>
          )
        </Typography>
        {renderExpirationInfoTooltip()}
      </Box>
    </Box>
  );
};

export default GovActionDatesInfo;
