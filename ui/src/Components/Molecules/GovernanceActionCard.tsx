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
import { NavLink } from "react-router-dom";
import { Button } from "../Atoms/Button";

interface GovernanceActionCardProps {
  action: GovernanceAction;
}

function GovernanceActionCard({ action }: GovernanceActionCardProps) {
  const { metadata, metadataValid } = useMetadata(action);

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

  return (
    <Card
      id={`${idCIP129}-outcome-card`}
      data-testid={`${idCIP129}-outcome-card`}
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        display: "flex",
        padding: { xs: 1, sm: 2 },
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
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
        sx={{ flexGrow: 1 }}
      >
        <GovernanceActionCardHeader
          title={action.title || metadata?.data?.title}
          isDataMissing={metadata?.metadataStatus || null}
          dataTestId={`${idCIP129}-card-title`}
        />
        <Box sx={{ marginTop: 2.5 }}>
          <GovActionDatesInfo action={action} />
        </Box>
        {metadataValid && (
          <Box sx={{ marginTop: 2.5 }}>
            <GovernanceActionCardElement
              title="Abstract"
              description={
                action.abstract || (metadata?.data?.abstract as string)
              }
              dataTestId={`${idCIP129}-abstract`}
            />
          </Box>
        )}
        <Box
          display="flex"
          flexDirection="column"
          gap={2.5}
          sx={{ marginTop: 2.5 }}
        >
          <GovernanceActionCardElement
            title="Governance Action Type"
            description={typeInWords}
            dataTestId={`${idCIP129}-type`}
          />

          <GovernanceActionStatus status={action?.status} actionId={idCIP129} />

          <GovernanceActionCardIdElement
            title="Governance Action ID"
            id={fullGovActionId}
            dataTestId={`${fullGovActionId}-CIP-105-id`}
          />

          <GovernanceActionCardIdElement
            title="(CIP-129) Governance Action ID"
            id={idCIP129}
            dataTestId={`${idCIP129}-CIP-129-id`}
          />
        </Box>
      </CardContent>
      <CardActions
        id={`${idCIP129}-outcome-card-actions`}
        data-testid={`${idCIP129}-outcome-card-actions`}
      >
        <NavLink
          data-testid={`${idCIP129}-view-details`}
          to={`/outcomes/governance_actions/${fullGovActionId}`}
          color="inherit"
          style={{
            display: "block",
            width: "100%",
            textDecoration: "none",
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: "50px",
              color: "neutralWhite",
              backgroundColor: "primaryBlue",
              width: "100%",
            }}
            aria-label={`${idCIP129}-view-details`}
          >
            View Details
          </Button>
        </NavLink>
      </CardActions>
    </Card>
  );
}

export default GovernanceActionCard;
