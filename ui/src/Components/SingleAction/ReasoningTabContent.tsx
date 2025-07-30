import { Box } from "@mui/material";
import { GovernanceAction } from "../../types/api";
import ReasoningElement from "./ReasoningElement";
import { useTranslation } from "../../contexts/I18nContext";

export const ReasoningTabContent = ({
  abstract,
  motivation,
  rationale,
}: Pick<GovernanceAction, "abstract" | "motivation" | "rationale">) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" gap={3} width="auto">
      <ReasoningElement
        label={t("outcome.abstract")}
        text={abstract as string}
        dataTestId="governance-action-abstract"
      />
      <ReasoningElement
        label={t("outcome.motivation")}
        text={motivation as string}
        dataTestId="governance-action-motivation"
      />
      <ReasoningElement
        label={t("outcome.rationale")}
        text={rationale as string}
        dataTestId="governance-action-rationale"
      />
    </Box>
  );
};
