import { IconInformationCircle } from "@intersect.mbo/intersectmbo.org-icons-set";
import { Box, Icon, Tooltip, Typography } from "@mui/material";

interface DatesData {
  date: string;
  epoch?: number;
}

interface GovActionDatesInfoProps {
  submitted: DatesData;
  expires: DatesData;
}

const GovActionDatesInfo = ({
  submitted,
  expires,
}: GovActionDatesInfoProps) => {
  const renderSubmissionInfoTooltip = () => {
    return (
      <Tooltip
        title={
          <Box sx={{ bgcolor: "black", p: 1 }}>
            <Typography variant="body1" color={"white"}>
              Submission Date
            </Typography>
            <Typography variant="body2" color={"gray"}>
              The date when the governance action was submitted on-chain.{" "}
            </Typography>
          </Box>
        }
        arrow
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "transparent",
              p: 0,
              m: 0,
            },
          },
        }}
      >
        <Icon>
          <IconInformationCircle />
        </Icon>
      </Tooltip>
    );
  };

  const renderExpirationInfoTooltip = () => {
    return (
      <Tooltip
        title={
          <Box sx={{ bgcolor: "black", p: 1 }}>
            <Typography variant="body1" color={"white"}>
              Expiry Date
            </Typography>
            <Typography variant="body2" color={"gray"}>
              The date when the governance action will expiry if it doesn&apos;t
              reach ratification thresholds.
              <br /> IMPORTANT: If the governance action is ratified before the
              expiry date it will be considered ratified and it will not be
              available to vote on afterwards.
            </Typography>
          </Box>
        }
        arrow
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: "transparent",
              p: 0,
              m: 0,
            },
          },
        }}
      >
        <Icon>
          <IconInformationCircle />
        </Icon>
      </Tooltip>
    );
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: "12px",
        border: "1px solid #D6E2FF",
        textAlign: "center",
      }}
    >
      <Box
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
        <Typography variant="caption">
          Submitted:{" "}
          <Typography component="span" fontWeight={500} variant="caption">
            {new Date(submitted.date).toDateString()}
          </Typography>
        </Typography>
        {submitted.epoch && (
          <Typography variant="caption">
            (Epoch{" "}
            <Typography component="span" variant="caption">
              {submitted.epoch}
            </Typography>
            )
          </Typography>
        )}
        {renderSubmissionInfoTooltip()}
      </Box>
      <Box
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
          Expires:{" "}
          <Typography component="span" fontWeight={500} variant="caption">
            {new Date(expires.date).toDateString()}
          </Typography>
        </Typography>
        {expires.epoch && (
          <Typography variant="caption">
            (Epoch{" "}
            <Typography component="span" variant="caption">
              {expires.epoch}
            </Typography>
            )
          </Typography>
        )}
        {renderExpirationInfoTooltip()}
      </Box>
    </Box>
  );
};

export default GovActionDatesInfo;
