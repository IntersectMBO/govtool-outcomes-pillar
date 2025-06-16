import { useInfiniteQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { decodeCIP129Identifier, getFullGovActionId } from "../lib/utils";
import { getGovActionVotes } from "../services/requests/getGovActionVotes";

export const useGetGovActionVotesQuery = (
  id: string,
  votesType: string,
  roleType: string,
  sortBy: string,
  sortOrder: string,
  limit: number = 20
) => {
  const actionId = (() => {
    if (id.startsWith("gov_action")) {
      try {
        const { txID } = decodeCIP129Identifier(id);
        return getFullGovActionId(txID, 0);
      } catch (error) {
        console.log("Failed to decode gov_action identifier:", error);
        return id;
      }
    }
    return id;
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
      queryKeys.getGovActionVotes,
      actionId,
      votesType,
      roleType,
      sortBy,
      sortOrder,
      limit,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getGovActionVotes(
        actionId,
        votesType,
        roleType,
        sortBy,
        sortOrder,
        pageParam,
        limit
      );
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === limit ? allPages.length + 1 : undefined;
    },
    enabled: !!actionId,
    refetchOnWindowFocus: false,
  });

  return {
    votes: data,
    isVotesLoading: isLoading,
    votesError: error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
