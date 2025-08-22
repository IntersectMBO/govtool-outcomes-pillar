import { createContext, PropsWithChildren, useContext, useMemo } from "react";

import { WalletAPIData } from "../types/walletAPI";

// Default IPFS gateway
const DEFAULT_IPFS_GATEWAY = "https://dweb.link/ipfs";

type AppContextType = {
  ipfsGateway: string;
  walletAPI: WalletAPIData;
};

type AppContextProviderProps = PropsWithChildren<{
  ipfsGateway?: string;
  walletAPI: WalletAPIData;
}>;

const AppContext = createContext<AppContextType | null>(null);

const AppContextProvider = ({
  children,
  ipfsGateway = DEFAULT_IPFS_GATEWAY,
  walletAPI,
}: AppContextProviderProps) => {
  const value = useMemo(
    () => ({
      ipfsGateway,
      walletAPI,
    }),
    [ipfsGateway, walletAPI]
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
