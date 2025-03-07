import { GovActionMetadata } from "../../types/api";
import axiosInstance from "../axiosInstance";

export const getGovActionMetadata = async (
  url: string,
  hash: string
): Promise<GovActionMetadata> => {
  const response = await axiosInstance.get("/governance-actions/metadata", {
    params: { url, hash },
  });
  return response.data;
};
