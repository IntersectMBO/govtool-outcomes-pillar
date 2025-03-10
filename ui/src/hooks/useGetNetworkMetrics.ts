import { useQuery } from "react-query";
import { getNetworkMetrics } from "../services/requests/getNetworkMetrics";

export const useGetNetworkMetrics = (epoch?: number) => {
  const { data: networkMetrics, refetch: fetchNetworkMetrics } = useQuery({
    queryKey: ["networkMetrics"],
    queryFn: () => getNetworkMetrics(epoch),
    enabled: false,
  });

  return { networkMetrics, fetchNetworkMetrics };
};
