import { Box, Grid } from "@mui/material";
import GovernanceActionCard from "./Components/GovernanceActionCard";
import { IconArrowCircleRight } from "@intersect.mbo/intersectmbo.org-icons-set";
import "./index.scss";

export type AppProps = {
  description: string;
};
function App({ description }: AppProps) {
  return (
    <div
      className="App"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Box 
      sx={{
        padding: 2,
        maxWidth: '1200px',
        margin: '0 auto', // Center the content
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <GovernanceActionCard
            dateSubmitted="18 Jan 2024"
            epoch={430}
            status="Ratified"
            title="Plutus V3 Cost Model Parameter Changes Prior to Chang#2"
            abstract="In light of recent network congestion and scalability concerns I propose implementing a dynamic fee adjustment mechanism that autonomously regulates transaction fees based on network demand and resource availability."
            governanceActionType="Protocol Parameter Changes"
            governanceActionID="cnewjfbe82rg39udbjwbksomething"
            cipGovernanceActionID="cnewjfbe82rg39udbjwbksomething"
            statusDate="22nd Jan 2024"
            statusEpoch={440}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <GovernanceActionCard
            dateSubmitted="18 Jan 2024"
            epoch={430}
            status="Expired"
            title="Plutus V3 Cost Model Parameter Changes Prior to Chang#2"
            abstract="In light of recent network congestion and scalability concerns I propose implementing a dynamic fee adjustment mechanism that autonomously regulates transaction fees based on network demand and resource availability."
            governanceActionType="Protocol Parameter Changes"
            governanceActionID="cnewjfbe82rg39udbjwbksomething"
            cipGovernanceActionID="cnewjfbe82rg39udbjwbksomething"
            statusDate="22nd Jan 2024"
            statusEpoch={440}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <GovernanceActionCard
            dateSubmitted="18 Jan 2024"
            epoch={430}
            status="Enacted"
            title="Plutus V3 Cost Model Parameter Changes Prior to Chang#2"
            abstract="In light of recent network congestion and scalability concerns I propose implementing a dynamic fee adjustment mechanism that autonomously regulates transaction fees based on network demand and resource availability."
            governanceActionType="Protocol Parameter Changes"
            governanceActionID="cnewjfbe82rg39udbjwbksomething"
            cipGovernanceActionID="cnewjfbe82rg39udbjwbksomething"
            statusDate="22nd Jan 2024"
            statusEpoch={440}
          />
        </Grid>
      </Grid>
    </Box>
    </div>
  );
}

export default App;
