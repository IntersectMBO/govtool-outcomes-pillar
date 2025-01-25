import { Grid } from "@mui/material";
import GovernanceActionCard from "./Components/Molecules/GovernanceActionCard";
import { SnackbarProvider } from "./contexts/Snackbar";
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
      <SnackbarProvider>
      <Grid
        container
        spacing={{ xs: 4, sm: 4, lg: 8 }}
        justifyContent={"center"} 
      >
        <Grid item xs={12} sm={12} lg={4}>
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
        <Grid item xs={12} sm={12} lg={4}>
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
        <Grid item xs={12} sm={12} lg={4}>
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
      </SnackbarProvider>
    </div>
  );
}

export default App;
