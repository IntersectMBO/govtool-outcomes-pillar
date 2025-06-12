import axiosInstance from "../axiosInstance";

export const getGovActionVotes = async (
  id: string,
  votesType: string,
  roleType: string
) => {
  const [hash, indexStr] = id.split("#");
  const index = indexStr || "0";
  const response = await axiosInstance.get(
    `/governance-actions/${hash}/votes`,
    {
      params: { index, votesType, roleType },
    }
  );
  return response.data;
};
