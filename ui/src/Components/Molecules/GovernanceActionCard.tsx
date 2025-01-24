import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import GovernanceActionCardHeader from "./GovernanceActionCardHeader";
import GovernanceActionCardElement from "./GovernanceActionCardElement";
import GovernanceActionCardIDElement from "./GovernanceActionCardIDElement";

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
          <GovernanceActionCardIDElement
            title="Governance Action ID"
            id={governanceActionID}
          />
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <GovernanceActionCardIDElement title="(CIP-129)Governance Action ID" id={cipGovernanceActionID}/>
        </Box>
        <Box display="flex" justifyContent="center" marginTop={3}>
          <Typography
            sx={{
              fontSize: "14px",
              color: status === "Expired" ? "#900B09" : "#29984E",
            }}
          >
            {status}:{" "}
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                color: status === "Expired" ? "#900B09" : "#29984E",
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
              color: "#FFF",
              backgroundColor: "#0033AD",
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
