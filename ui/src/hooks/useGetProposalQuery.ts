import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getProposal } from "../services/requests/getProposal";

export const useGetProposalQuery = (hash: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.getProposal, hash],
    queryFn: async () => await getProposal(hash),
    enabled: !!hash,
    refetchOnWindowFocus: false,
  });

  return {
    proposal: data,
    isProposalLoading: isLoading,
    proposalError: error,
  };
};
