import { Box } from "@mui/material";
import SearchFiltersSortBar from "../Components/Molecules/SearchFiltersSortBar";
import GovernanceActionsList from "../Components/Molecules/GovernanceActionsList";

export default function Outcomes() {
  return (
    <Box
      component="section"
      display={"flex"}
      flexDirection={"column"}
      flexGrow={1}
    >
      <SearchFiltersSortBar />
      <Box marginTop={4}>
        <GovernanceActionsList />
      </Box>
    </Box>
  );
}
