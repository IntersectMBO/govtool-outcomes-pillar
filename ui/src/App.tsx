import { ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "./contexts/Snackbar";
import "./index.scss";
import { theme } from "./theme";
import OutcomesPage from "./Pages/Outcomes";
import { SearchFiltersSortBarProvider } from "./contexts/SearchFiltersContext";

export type AppProps = {
  description: string;
};
function App({ description }: AppProps) {
  return (
    <div
      className="App"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <SearchFiltersSortBarProvider>
            <OutcomesPage />
          </SearchFiltersSortBarProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
