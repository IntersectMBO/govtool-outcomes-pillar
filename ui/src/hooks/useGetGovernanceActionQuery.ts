import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getGovernanceAction } from "../services/requests/getGovernanceAction";
import { GovernanceAction } from "../types/api";
import { decodeCIP129Identifier, getFullGovActionId } from "../lib/utils";

export const useGetGovernanceActionQuery = (id: string) => {
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
  
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.getGovernanceAction, actionId],
    queryFn: async () => await getGovernanceAction(actionId),
    enabled: !!actionId,
    refetchOnWindowFocus: false,
  });

  return {
    governanceAction: data as GovernanceAction,
    isGovernanceActionLoading: isLoading,
    governanceActionError: error,
  };
};
