import { useQuery } from "@tanstack/react-query";
import { getEpochParams } from "../services/requests/getEpochParams";

export const useGetEpochParams = () => {
  const { data: epochParams, refetch: fetchEpochParams } = useQuery({
    queryKey: ["epochParams"],
    queryFn: () => getEpochParams(),
    enabled: false,
  });

  return { epochParams, fetchEpochParams };
};
