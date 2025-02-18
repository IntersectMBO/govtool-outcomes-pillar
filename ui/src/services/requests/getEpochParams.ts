import { EpochParams } from "../../types/api";
import axiosInstance from "../axiosInstance";

export const getEpochParams = async () => {
  const response = await axiosInstance.get<EpochParams>("/misc/epoch/params");
  return response.data
};
