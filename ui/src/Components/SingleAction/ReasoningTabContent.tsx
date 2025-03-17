import { Box } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import ReasoningElement from "./ReasoningElement";

export const ReasoningTabContent = ({
  abstract,
  motivation,
  rationale,
}: Pick<GovernanceAction, "abstract" | "motivation" | "rationale">) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <ReasoningElement
        label="Abstract"
        text={abstract as string}
        dataTestId="governance-action-abstract"
      />
      <ReasoningElement
        label="Motivation"
        text={motivation as string}
        dataTestId="governance-action-motivation"
      />
      <ReasoningElement
        label="Rationale"
        text={rationale as string}
        dataTestId="governance-action-rationale"
      />
    </Box>
  );
};
