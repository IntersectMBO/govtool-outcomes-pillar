import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { decodeCIP129Identifier, getFullGovActionId } from "../lib/utils";
import { getGovActionVotes } from "../services/requests/getGovActionVotes";
import { GovernanceActionVoteData } from "../types/api";

export const useGetGovActionVotesQuery = (
  id: string,
  votesType: string,
  roleType: string
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

  const { data, isLoading, error } = useQuery<GovernanceActionVoteData[]>({
    queryKey: [queryKeys.getGovActionVotes, actionId, votesType, roleType],
    queryFn: async () => await getGovActionVotes(actionId, votesType, roleType),
    enabled: !!actionId,
    refetchOnWindowFocus: false,
  });

  return {
    votes: data,
    isVotesLoading: isLoading,
    votesError: error,
  };
};
