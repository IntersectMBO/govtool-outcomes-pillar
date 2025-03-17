import { Box } from "@mui/material";
import { GovernanceAction, NewConstitutionAnchor } from "../../types/api";
import GovernanceActionElement from "./GovernanceActionElement";

export const GovernanceActionNewConstitutionDetailsTabContent = ({
  description,
}: Pick<GovernanceAction, "description">) => {
  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}
    >
      <GovernanceActionElement
        title="New constitution link"
        type="link"
        content={(description?.anchor as NewConstitutionAnchor)?.url as string}
        dataTestId="new-constitution-url"
      />
      <GovernanceActionElement
        title="New constitution hash"
        type="text"
        content={
          (description?.anchor as NewConstitutionAnchor)?.dataHash as string
        }
        dataTestId="new-constitution-data-hash"
        isCopyable
      />
      <GovernanceActionElement
        title="New constitution script hash"
        type="text"
        content={description?.script as string}
        dataTestId="new-constitution-script-hash"
        isCopyable
      />
    </Box>
  );
};
