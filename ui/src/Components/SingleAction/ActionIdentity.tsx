import { Box } from "@mui/material";
import GovernanceActionCardElement from "../Molecules/GovernanceActionCardElement";
import GovernanceActionCardIdElement from "../Molecules/GovernanceActionCardIdElement";
import { encodeCIP129Identifier, getFullGovActionId } from "../../lib/utils";
type governanceActionProps = {
  governanceAction: any;
};
function ActionIdentity({ governanceAction }: governanceActionProps) {
  const idCIP129 = encodeCIP129Identifier({
    txID: governanceAction?.tx_hash,
    index: governanceAction?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });
  return (
    <Box display="flex" flexDirection="column" gap="1.5rem">
      <GovernanceActionCardElement
        title="Governance Action Type"
        description={governanceAction?.type}
      />
      <GovernanceActionCardIdElement
        title="(CIP-129) Governance Action ID"
        id={idCIP129}
      />
      <GovernanceActionCardIdElement
        title="Governance Action ID"
        id={getFullGovActionId(
          governanceAction?.tx_hash,
          governanceAction?.index
        )}
      />
    </Box>
  );
}

export default ActionIdentity;
