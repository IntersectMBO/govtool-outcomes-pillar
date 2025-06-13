import axiosInstance from "../axiosInstance";

export const getGovActionVotes = async (
  id: string,
  votesType: string,
  roleType: string,
  sortBy: string,
  sortOrder: string,
  page: number,
  limit: number
) => {
  const [hash, indexStr] = id.split("#");
  const index = indexStr || "0";
  const response = await axiosInstance.get(
    `/governance-actions/${hash}/votes`,
    {
      params: {
        index,
        votesType,
        roleType,
        sortBy,
        sortOrder,
        page,
        limit,
      },
    }
  );
  return response.data;
};
