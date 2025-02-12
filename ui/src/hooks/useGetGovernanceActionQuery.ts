import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getGovernanceAction } from "../services/requests/getGovernanceAction";

export const useGetGovernanceActionQuery = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.getGovernanceAction, id],
    queryFn: async () => await getGovernanceAction(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  return {
    governanceAction: data,
    isGovernanceActionLoading: isLoading,
    governanceActionError: error,
  };
};
