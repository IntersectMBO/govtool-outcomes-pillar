import { useQuery } from "react-query";
import { getNetworkMetrics } from "../services/requests/getNetworkMetrics";


export const useGetNetworkMetrics = () => {
  const { data: networkMetrics, refetch: fetchNetworkMetrics } = useQuery({
    queryKey: ["networkMetrics"],
    queryFn: () => getNetworkMetrics(),
    enabled: false,
  });

  return { networkMetrics, fetchNetworkMetrics };
};
