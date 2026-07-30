import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "./contexts/Snackbar";
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAxiosBaseURL } from "./services/axiosInstance";
import GlobalWrapper from "./Components/GlobalWrapper";
import { AppContextProvider } from "./contexts/AppContext";
import { I18nProvider } from "./contexts/I18nContext";
import { ModalProvider } from "./contexts/modal";

export type AppProps = {
  apiUrl?: string;
  ipfsGateway?: string;
  walletAPI?: any;
  i18n?: any;
};

const queryClient = new QueryClient();

function App({ apiUrl, ipfsGateway, walletAPI, i18n }: AppProps) {
  setAxiosBaseURL(apiUrl);

  return (
    <div
      className="App"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <AppContextProvider ipfsGateway={ipfsGateway} walletAPI={walletAPI}>
            <SnackbarProvider>
              <I18nProvider i18n={i18n}>
                <ModalProvider>
                  <GlobalWrapper />
                </ModalProvider>
              </I18nProvider>
            </SnackbarProvider>
          </AppContextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
