import axiosInstance from "../axiosInstance";

export const getUnvalidatedMetadata = async (url: string): Promise<any> => {
  try {
    const response = await axiosInstance.get("/misc/external/metadata", {
      params: { url },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
