import { useLocation } from "react-router";
import Outcomes from "../Pages/Outcomes";
import VotesAndFavorites from "../Pages/VotesAndFavorites";
import { Box } from "@mui/material";
import GovernanceAction from "../Pages/GovernanceAction";
import { useModal } from "../contexts/modal";
import { callAll } from "../lib/callAll";
import { Modal } from "./modal/Modal";

function GlobalWrapper() {
  const location = useLocation();
  const { modal, openModal, modals } = useModal();

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
      return <GovernanceAction id={getActionId()} />;
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
      {modals[modal.type]?.component && (
        <Modal
          open={Boolean(modals[modal.type].component)}
          handleClose={
            !modals[modal.type].preventDismiss
              ? callAll(modals[modal.type]?.onClose, () =>
                  openModal({ type: "none", state: null }),
                )
              : undefined
          }
        >
          {modals[modal.type].component!}
        </Modal>
      )}
    </Box>
  );
}

export default GlobalWrapper;
