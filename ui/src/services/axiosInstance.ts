import axios from "axios";

let axiosInstance = axios.create();

const getDefaultBaseURL = (): string => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:3000";
    }

    if (hostname.includes("preview.")) {
      return "https://outcomes-preview.1694.io/api";
    }
  }
  return "https://outcomes.1694.io/api";
};

export const setAxiosBaseURL = (baseURL?: string) => {
  if (baseURL) {
    const trimmedURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
    axiosInstance.defaults.baseURL = trimmedURL;
  } else {
    axiosInstance.defaults.baseURL = getDefaultBaseURL();
  }
};

export default axiosInstance;
