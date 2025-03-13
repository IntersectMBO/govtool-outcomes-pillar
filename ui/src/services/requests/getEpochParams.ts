import { EpochParams } from "../../types/api";
import axiosInstance from "../axiosInstance";

export const getEpochParams = async (epoch?: number) => {
  const response = await axiosInstance.get<EpochParams>("/misc/epoch/params", {
    params: { epoch },
  });
  return response.data;
};
