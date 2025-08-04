import { Box, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Button } from "../Atoms/Button";
import GovernanceActionCard from "./GovernanceActionCard";
import { ActionsEmptyState } from "./ActionsEmptyState";
import { useGetGovernanceActionsQuery } from "../../hooks/useGetGovernanceActionsQuery";
import { useTranslation } from "../../contexts/I18nContext";

const ITEMS_PER_PAGE = 12;

const GovernanceActionsList = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const search = searchParams.get("q") || "";
  const typeFilters = searchParams.get("type")?.split(",") || [];
  const statusFilters = searchParams.get("status")?.split(",") || [];
  const filters = [...typeFilters, ...statusFilters].filter(Boolean);
  const sort = searchParams.get("sort") || "";

  const {
    govActions,
    isGovActionsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetGovernanceActionsQuery(search, filters, sort, ITEMS_PER_PAGE);

  const displayedActions = govActions?.pages?.flat() || [];

  return (
    <Box
      id="governance-actions-list-wrapper"
      data-testid="governance-actions-list-wrapper"
      component="section"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      gap={2}
      sx={{ width: "100%" }}
    >
      {isGovActionsLoading && !displayedActions.length ? (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            minHeight: "75vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}

      {!isGovActionsLoading && !displayedActions.length ? (
        <Box sx={{ paddingY: 3 }}>
          <ActionsEmptyState
            title={t("outcomesList.noResults.title")}
            description={t("outcomesList.noResults.description")}
          />
        </Box>
      ) : null}

      {displayedActions.length > 0 && (
        <Box
          className="actions-grid"
          sx={{
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {displayedActions.map((action) => (
            <Box
              className="action-card-wrapper"
              key={`${action.id}-${action.tx_hash}`}
              sx={{ width: "100%" }}
            >
              <GovernanceActionCard action={action} />
            </Box>
          ))}
        </Box>
      )}

      {hasNextPage && (
        <Box sx={{ justifyContent: "center", display: "flex" }}>
          <Button
            data-testid="show-more-button"
            variant="outlined"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {isFetchingNextPage
              ? t("loaders.loading")
              : t("outcomesList.showMore")}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GovernanceActionsList;
