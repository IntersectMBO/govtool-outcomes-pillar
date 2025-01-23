import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { IconClipboardCopy } from "@intersect.mbo/intersectmbo.org-icons-set";

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
    <Card sx={{ width: "100%", backgroundColor: "transparent", padding: 2, borderRadius: "20px" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography sx={{ fontSize: "12px" }}>
              Submitted:{" "}
              <Typography
                sx={{ fontSize: "12px", fontWeight: "bold" }}
                component="span"
              >
                {dateSubmitted}
              </Typography>{" "}
              {`(Epoch ${epoch})`}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "12px",
                color:
                  status === "Ratified"
                    ? "#00B83D"
                    : status === "Expired"
                    ? "#FF2616"
                    : "#FFC916",
              }}
            >
              {status}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ marginTop: 3 }}>
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography
            sx={{ fontSize: "12px", color: "#8E908E", marginBottom: 1 }}
          >
            Abstract
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>{abstract}</Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography
            sx={{ fontSize: "12px", color: "#8E908E", marginBottom: 1 }}
          >
            Governance Action Type
          </Typography>
          <Typography sx={{ fontSize: "14px" }}>
            {governanceActionType}
          </Typography>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography
            sx={{ fontSize: "12px", color: "#8E908E", marginBottom: 1 }}
          >
            Governance Action ID
          </Typography>
          <Box>
            <Typography sx={{ fontSize: "14px", color: "#0033AD" }}>
              {governanceActionID}
            </Typography>
            <Box>
              <IconClipboardCopy width={18} height={18} fill="#0033AD"/>
            </Box>
          </Box>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Typography
            sx={{ fontSize: "12px", color: "#8E908E", marginBottom: 1 }}
          >
            (CIP-129)Governance Action ID
          </Typography>
          <Box>
            <Typography sx={{ fontSize: "14px", color: "#0033AD" }}>
              {cipGovernanceActionID}
            </Typography>
            <Box>
              <IconClipboardCopy width={18} height={18} fill="#0033AD"/>
            </Box>
          </Box>
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
              width: "100%"
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
