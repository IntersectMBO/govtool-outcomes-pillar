import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import GovernanceActionCardHeader from "./GovernanceActionCardHeader";
import GovernanceActionCardElement from "./GovernanceActionCardElement";
import GovernanceActionCardIdElement from "./GovernanceActionCardIdElement";
interface GovernanceActionCardProps {
  dateSubmitted: string;
  epoch: number;
  status: string;
  title: string;
  abstract: string;
  governanceActionType: string;
  governanceActionID: string;
  cipGovernanceActionID: string;
  statusDate: string;
  statusEpoch: Number;
}

function GovernanceActionCard({
  dateSubmitted,
  epoch,
  status,
  title,
  abstract,
  governanceActionType,
  governanceActionID,
  cipGovernanceActionID,
  statusDate,
  statusEpoch,
}: GovernanceActionCardProps) {

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "transparent",
        padding: 2,
        borderRadius: "20px",
      }}
    >
      <CardContent>
        <GovernanceActionCardHeader
          dateSubmitted={dateSubmitted}
          epochSubmitted={epoch}
          status={status}
          title={title}
        />
        <Box sx={{ marginTop: 2 }}>
          <GovernanceActionCardElement
            title="Abstract"
            description={abstract}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <GovernanceActionCardElement
            title=" Governance Action Type"
            description={governanceActionType}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <GovernanceActionCardIdElement
            title="Governance Action ID"
            id={governanceActionID}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <GovernanceActionCardIdElement
            title="(CIP-129)Governance Action ID"
            id={cipGovernanceActionID}
          />
        </Box>
        <Box display="flex" justifyContent="center" marginTop={3}>
          <Typography
            sx={{
              fontSize: "14px",
              color: status === "Expired" ? "errorRed" : "positiveGreen",
            }}
          >
            {status}:{" "}
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
            {`(Epoch ${statusEpoch})`}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" marginTop={3}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              color: "neutralWhite",
              backgroundColor: "primaryBlue",
              width: "100%",
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GovernanceActionCard;
