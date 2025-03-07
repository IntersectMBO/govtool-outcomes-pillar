import axiosInstance from "../axiosInstance";

export const getGovernanceAction = async (id: string) => {
  const [hash, indexStr] = id.split("#");
  const index = indexStr || "0";
  const response = await axiosInstance.get(`/governance-actions/${hash}`, {
    params: { index },
  });
  return response.data[0];
};
