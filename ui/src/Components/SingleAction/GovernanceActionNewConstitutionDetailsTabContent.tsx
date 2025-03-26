import { Box } from "@mui/material";
import { GovernanceAction, NewConstitutionAnchor } from "../../types/api";
import GovernanceActionElement from "./GovernanceActionElement";
import { useTranslation } from "../../contexts/I18nContext";

export const GovernanceActionNewConstitutionDetailsTabContent = ({
  description,
}: Pick<GovernanceAction, "description">) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2.5 }}
    >
      <GovernanceActionElement
        title={t("outcome.newConstitutionLink")}
        type="link"
        content={(description?.anchor as NewConstitutionAnchor)?.url as string}
        dataTestId="new-constitution-url"
      />
      <GovernanceActionElement
        title={t("outcome.newConstitutionHash")}
        type="text"
        content={
          (description?.anchor as NewConstitutionAnchor)?.dataHash as string
        }
        dataTestId="new-constitution-data-hash"
        isCopyable
      />
      <GovernanceActionElement
        title={t("outcome.newConstitutionScriptHash")}
        type="text"
        content={description?.script as string}
        dataTestId="new-constitution-script-hash"
        isCopyable
      />
    </Box>
  );
};
