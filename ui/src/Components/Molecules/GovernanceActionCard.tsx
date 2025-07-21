import { Box, Card, CardContent, CardActions } from "@mui/material";
import GovernanceActionCardElement from "../ActionCard/GovernanceActionCardElement";
import GovernanceActionCardIdElement from "../ActionCard/GovernanceActionCardIdElement";
import {
  encodeCIP129Identifier,
  getFullGovActionId,
  getProposalStatus,
} from "../../lib/utils";
import { useMetadata } from "../../hooks/useMetadata";
import { GovernanceAction } from "../../types/api";
import GovActionDatesInfo from "./GovActionDatesInfo";
import GovernanceActionStatus from "./GovernanceActionStatus";
import { GOVERNANCE_ACTION_FILTERS } from "../../consts/filters";
import { GovernanceActionCardHeader } from "../ActionCard/GovernanceActionCardHeader";
import AbstractLoader from "../Loaders/GovernanceActionAbstractLoader";
import ViewDetailsLink from "../ActionCard/ViewDetailsLink";
import { useTranslation } from "../../contexts/I18nContext";

interface GovernanceActionCardProps {
  action: GovernanceAction;
}

function GovernanceActionCard({ action }: GovernanceActionCardProps) {
  const { metadata, metadataValid, isMetadataLoading } = useMetadata(action);
  const { t } = useTranslation();

  const idCIP129 = encodeCIP129Identifier({
    txID: action?.tx_hash,
    index: action?.index.toString(16).padStart(2, "0"),
    bech32Prefix: "gov_action",
  });
  const fullGovActionId = getFullGovActionId(action?.tx_hash, action?.index);

  const status = getProposalStatus(action?.status);

  const typeInWords =
    GOVERNANCE_ACTION_FILTERS.find((filter) => filter.value === action?.type)
      ?.label || action?.type;

  const abstract = action.abstract || metadata?.data?.abstract;

  return (
    <Card
      id={`${idCIP129}-outcome-card`}
      data-testid={`${idCIP129}-outcome-card`}
      sx={{
        width: "100%",
        height: "auto",
        borderRadius: "20px",
        display: "flex",
        paddingX: 3,
        paddingTop: 3,
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0px 4px 15px 0px #DDE3F5",
        backgroundColor: !metadataValid
          ? "rgba(251, 235, 235, 0.50)"
          : "rgba(255, 255, 255, 0.3)",
        ...(!metadataValid && {
          border:
            status === "Live"
              ? "1px solid #FFCBAD"
              : !metadataValid
              ? "1px solid #F6D5D5"
              : "1px solid #C0E4BA",
        }),
      }}
    >
      <CardContent
        id={`${idCIP129}-outcome-card-content`}
        data-testid={`${idCIP129}-outcome-card-content`}
        sx={{ padding: 0 }}
      >
        <GovernanceActionCardHeader
          title={action.title || metadata?.data?.title}
          isDataMissing={metadata?.metadataStatus || null}
          isMetadataLoading={isMetadataLoading}
          dataTestId={`${idCIP129}-card-title`}
        />
        <Box sx={{ marginTop: 2.5 }}>
          <GovActionDatesInfo action={action} isCard />
        </Box>
        {metadataValid && (
          <Box sx={{ marginTop: 2.5 }}>
            {!abstract || isMetadataLoading ? (
              <AbstractLoader />
            ) : (
              <GovernanceActionCardElement
                title={t("outcome.abstract")}
                description={abstract}
                type="markdown"
                dataTestId={`${idCIP129}-abstract`}
              />
            )}
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          gap={2.5}
          sx={{ marginTop: 2.5 }}
        >
          <GovernanceActionCardElement
            title={t("outcome.governanceActionType")}
            description={typeInWords}
            type="text"
            dataTestId={`${idCIP129}-type`}
          />

          <GovernanceActionStatus status={action?.status} actionId={idCIP129} />

          <GovernanceActionCardIdElement
            title={t("outcome.governanceActionId105")}
            id={fullGovActionId}
            dataTestId={`${fullGovActionId}-CIP-105-id`}
          />

          <GovernanceActionCardIdElement
            title={t("outcome.governanceActionId129")}
            id={idCIP129}
            dataTestId={`${idCIP129}-CIP-129-id`}
          />
        </Box>
      </CardContent>
      <CardActions
        id={`${idCIP129}-outcome-card-actions`}
        data-testid={`${idCIP129}-outcome-card-actions`}
        sx={{ paddingX: 0, paddingY: 3 }}
      >
        <ViewDetailsLink id={idCIP129} />
      </CardActions>
    </Card>
  );
}

export default GovernanceActionCard;
