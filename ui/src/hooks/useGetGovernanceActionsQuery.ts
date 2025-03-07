import { useInfiniteQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getGovernanceActions } from "../services/requests/getGovernanceActions";
import { decodeCIP129Identifier, getFullGovActionId } from "../lib/utils";

export const useGetGovernanceActionsQuery = (
  search: string,
  filters: string[],
  sort: string,
  limit: number
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

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      queryKeys.getGovernanceActions,
      searchPhrase,
      filters,
      sort,
      limit,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getGovernanceActions(
        searchPhrase,
        filters,
        sort,
        pageParam,
        limit
      );
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length + 1 : undefined;
    },
    enabled: true,
    refetchOnWindowFocus: false,
  });

  return {
    govActions: data,
    isGovActionsLoading: isLoading,
    govActionsError: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
