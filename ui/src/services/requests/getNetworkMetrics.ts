import { NetworkMetrics } from "../../types/api";
import axiosInstance from "../axiosInstance";

export const getNetworkMetrics = async (epoch?: number) => {
  const response = await axiosInstance.get<NetworkMetrics>(
    "/misc/network/metrics",
    {
      params: { epoch },
    }
  );
  return response.data;
};
