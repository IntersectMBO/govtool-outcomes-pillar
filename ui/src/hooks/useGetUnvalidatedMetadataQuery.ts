import { useQuery } from "react-query";
import { queryKeys } from "../consts/queryKeys";
import { getUnvalidatedMetadata } from "../services/requests/getUnvalidatedMetada";

export const useGetUnvalidatedMetadataQuery = (url: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKeys.getUnvalidatedMetadata, url],
    queryFn: async () => await getUnvalidatedMetadata(url),
    enabled: !!url,
    refetchOnWindowFocus: false,
  });

  return {
    metadata: data,
    isMetadataLoading: isLoading,
    metadataError: error,
  };
};
