import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getGovernanceAction } from "../services/requests/getGovernanceAction";
import { GovernanceAction } from "../types/api";

export const useGetGovernanceActionQuery = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.getGovernanceAction, id],
    queryFn: async () => await getGovernanceAction(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return {
    governanceAction: data as GovernanceAction,
    isGovernanceActionLoading: isLoading,
    governanceActionError: error,
  };
};
