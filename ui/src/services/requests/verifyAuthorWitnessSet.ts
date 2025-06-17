import { SignatureVerificationDto } from "../../types/api";
import axiosInstance from "../axiosInstance";

export const verifyAuthorWitnessSet = async (
  data: SignatureVerificationDto
) => {
  const response = await axiosInstance.post("/misc/verify-signature", data);
  return response.data;
};
