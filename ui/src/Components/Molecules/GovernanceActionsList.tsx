import { Box, Grid } from "@mui/material";
import GovernanceActionCard from "./GovernanceActionCard";

interface GovernanceActionsListProps {
  governanceActions: Array<any>;
}
export default function GovernanceActionsList({
  governanceActions,
}: GovernanceActionsListProps) {
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Grid container width="100%" spacing={3}>
        {governanceActions &&
          governanceActions?.map((governanceAction, index) => (
            <Grid item xs={12} sm={12} lg={4} key={index}>
              <GovernanceActionCard
                dateSubmitted={governanceAction?.dateSubmitted}
                epoch={governanceAction?.epoch}
                status={governanceAction?.status}
                title={governanceAction?.title}
                abstract={governanceAction?.abstract}
                governanceActionType={governanceAction?.governanceActionType}
                governanceActionID={governanceAction?.governanceActionID}
                cipGovernanceActionID={governanceAction?.cipGovernanceActionID}
                statusDate={governanceAction?.statusDate}
                statusEpoch={governanceAction?.statusEpoch}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
