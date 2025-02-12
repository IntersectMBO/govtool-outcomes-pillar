import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "./contexts/Snackbar";
import "./index.scss";
import { theme } from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { setAxiosBaseURL } from "./services/axiosInstance";
import GlobalWrapper from "./Components/GlobalWrapper";

export type AppProps = {
  apiUrl?: string;
};

const queryClient = new QueryClient();

function App({ apiUrl }: AppProps) {
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
          <SnackbarProvider>
            <GlobalWrapper/>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
