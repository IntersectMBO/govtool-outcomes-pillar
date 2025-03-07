import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { EpochParams, NetworkMetrics } from "../types/api";
import { useGetEpochParams } from "../hooks/useGetEpochParams";
import { useGetNetworkMetrics } from "../hooks/useGetNetworkMetrics";
import { setItemToLocalStorage } from "../lib/utils";

// Default IPFS gateway
const DEFAULT_IPFS_GATEWAY = "https://dweb.link/ipfs";

type AppContextType = {
  epochParams?: EpochParams;
  networkMetrics?: NetworkMetrics;
  ipfsGateway: string;
};

type AppContextProviderProps = PropsWithChildren<{
  ipfsGateway?: string;
}>;

const AppContext = createContext<AppContextType | null>(null);

const AppContextProvider = ({ children, ipfsGateway = DEFAULT_IPFS_GATEWAY }: AppContextProviderProps) => {
  const { fetchEpochParams, epochParams } = useGetEpochParams();
  const { fetchNetworkMetrics, networkMetrics } = useGetNetworkMetrics();

  useEffect(() => {
    const init = async () => {
      try {
        const { data: epochParamsData } = await fetchEpochParams();
        if (epochParamsData) {
          setItemToLocalStorage("PROTOCOL_PARAMS_KEY", epochParamsData);
        }

        const { data: networkMetricsData } = await fetchNetworkMetrics();
        if (networkMetricsData) {
          setItemToLocalStorage("NETWORK_METRICS_KEY", networkMetricsData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

  const value = useMemo(
    () => ({
      epochParams,
      networkMetrics,
      ipfsGateway,
    }),
    [epochParams, networkMetrics, ipfsGateway]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook that provides access to the app context.
 * Throws an error if used outside of an AppContextProvider.
 * @returns The app context.
 */
const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
};

export { AppContextProvider, useAppContext };