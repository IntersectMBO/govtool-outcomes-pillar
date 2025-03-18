import axiosInstance from "../axiosInstance";

export const getProposal = async (hash: string) => {
  const response = await axiosInstance.get(
    `/governance-actions/proposal/${hash}`
  );
  return response.data;
};
