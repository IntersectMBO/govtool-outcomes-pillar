import { NetworkMetrics } from "../../types/api";
import axiosInstance from "../axiosInstance";

export const getNetworkMetrics = async () => {
  const response = await axiosInstance.get<NetworkMetrics>("/misc/network/metrics");
  return response.data
};
