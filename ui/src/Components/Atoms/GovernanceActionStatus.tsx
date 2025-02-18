import { Box, Typography } from "@mui/material";
import {
  formatTimeStamp,
  getProposalStatus,
  getStatusDetails,
} from "../../lib/utils";
import { GovernanceAction } from "../../types/api";

type GovernanceActionStatusProps = {
  action: GovernanceAction;
};

function GovernanceActionStatus({ action }: GovernanceActionStatusProps) {
  const status = getProposalStatus(action?.status);
  const { statusEpoch, statusDate } = getStatusDetails(
    action?.status,
    action?.status_times
  );

  if (status === "Live") {
    return (
      <Box display="flex" justifyContent="center" marginTop={3}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "errorRed",
          }}
        >
          Expires:{" "}
          {action?.expiry_date && (
            <>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  color: "errorRed",
                }}
                component="span"
              >
                {formatTimeStamp(action?.expiry_date)}
              </Typography>{" "}
            </>
          )}
          {action?.expiration && `(Epoch ${action?.expiration})`}
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="center" marginTop={3}>
      <Typography
        sx={{
          fontSize: "14px",
          color: status === "Expired" ? "errorRed" : "positiveGreen",
        }}
      >
        {status}:{" "}
        {statusDate && (
          <>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: status === "Expired" ? "errorRed" : "positiveGreen",
              }}
              component="span"
            >
              {statusDate}
            </Typography>{" "}
          </>
        )}
        {statusEpoch && `(Epoch ${statusEpoch})`}
      </Typography>
    </Box>
  );
}

export default GovernanceActionStatus;
