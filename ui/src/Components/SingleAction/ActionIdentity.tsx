import { Box } from "@mui/material";
import GovernanceActionCardElement from "../ActionCard/GovernanceActionCardElement";
import GovernanceActionCardIdElement from "../ActionCard/GovernanceActionCardIdElement";
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

  const fullGovActionId = getFullGovActionId(
    governanceAction?.tx_hash,
    governanceAction?.index
  );

  return (
    <Box display="flex" flexDirection="column" gap="1.5rem">
      <GovernanceActionCardElement
        title="Governance Action Type"
        description={governanceAction?.type}
        dataTestId={`${idCIP129}-type`}
      />
      <GovernanceActionCardIdElement
        title="(CIP-129) Governance Action ID"
        id={idCIP129}
        dataTestId={`${idCIP129}-CIP-129-id`}
      />
      <GovernanceActionCardIdElement
        title="Governance Action ID"
        id={fullGovActionId}
        dataTestId={`${fullGovActionId}-CIP-105-id`}
      />
    </Box>
  );
}

export default ActionIdentity;
