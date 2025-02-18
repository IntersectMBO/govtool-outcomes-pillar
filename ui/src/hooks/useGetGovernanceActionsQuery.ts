import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getGovernanceActions } from "../services/requests/getGovernanceActions";
import { decodeCIP129Identifier, getFullGovActionId } from "../lib/utils";
import { GovernanceAction } from "../types/api";

export const useGetGovernanceActions = (
  search: string,
  filters: string[],
  sort: string
) => {
  const searchPhrase = (() => {
    if (search.startsWith("gov_action")) {
      try {
        const { txID } = decodeCIP129Identifier(search);
        return getFullGovActionId(txID, 0);
      } catch (error) {
        console.log("Failed to decode gov_action identifier:", error);
        return search;
      }
    }
    return search;
  })();

  const { data, isLoading, error } = useQuery<GovernanceAction[]>({
    queryKey: [queryKeys.getGovernanceActions, searchPhrase, filters, sort],
    queryFn: async () => await getGovernanceActions(searchPhrase, filters, sort),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  return {
    govActions: data,
    isGovActionsLoading: isLoading,
    govActionsError: error,
  };
};
