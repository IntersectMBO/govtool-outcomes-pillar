import { useLocation } from "react-router-dom";
import Outcomes from "../Pages/Outcomes";
import VotesAndFavorites from "../Pages/VotesAndFavorites";
import { Box } from "@mui/material";
import GovActionWrapper from "../Pages/GovActionLegacyWrapper";

function GlobalWrapper() {
  const location = useLocation();

  const getActionId = () => {
    return location.pathname.split("/").pop() + location.hash;
  };

  const renderComponentBasedOnPath = () => {
    if (location.pathname === "/outcomes") {
      return <Outcomes />;
    } else if (
      location.pathname.includes("outcomes/governance_actions/") &&
      getActionId()
    ) {
      return <GovActionWrapper id={getActionId()} />;
    } else if (location.pathname.includes("my/votes_and_favorites")) {
      return <VotesAndFavorites />;
    } else {
      return <Outcomes />;
    }
  };
  return (
    <Box
      component="section"
      display={"flex"}
      flexDirection={"column"}
      flexGrow={1}
    >
      {renderComponentBasedOnPath()}
    </Box>
  );
}

export default GlobalWrapper;
