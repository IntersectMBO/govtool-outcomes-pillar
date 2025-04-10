import { createTheme } from "@mui/material/styles";
import {
  cyan,
  errorRed,
  orange,
  primaryBlue,
  progressYellow,
  successGreen,
} from "./consts/colors";

export type Theme = typeof theme;

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          fontFamily: "Poppins, Arial",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: `12px !important`,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          bgcolor: "white",
          borderColor: "#6F99FF",
          border: 1,
          borderRadius: 50,
          padding: "8px 16px",
          width: "100%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: "none",
        },
        outlined: (props) => ({
          borderColor: props.theme.palette.lightBlue,
        }),
      },
    },
    MuiChip: {
      variants: [
        {
          props: { color: "default", variant: "filled" },
          style: {
            backgroundColor: primaryBlue.c50,
          },
        },
        {
          props: { color: "success", variant: "filled" },
          style: {
            backgroundColor: successGreen.c200,
            color: successGreen.c700,
          },
        },
        {
          props: { color: "error", variant: "filled" },
          style: {
            backgroundColor: errorRed.c100,
            color: errorRed.c500,
          },
        },
        {
          props: { color: "warning", variant: "filled" },
          style: {
            backgroundColor: progressYellow.c200,
            color: orange.c700,
          },
        },
        {
          props: { color: "info", variant: "filled" },
          style: {
            backgroundColor: cyan.c100,
            color: cyan.c500,
          },
        },
      ],
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          fontWeight: 500,
          height: 28,
        },
        filledPrimary: {
          backgroundColor: primaryBlue.c100,
          color: primaryBlue.c500,
        },
        filledSecondary: {
          backgroundColor: orange.c100,
          color: orange.c600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPopover: {
      defaultProps: {
        elevation: 2,
      },
    },
  },
  typography: {
    fontFamily: "Poppins, Arial",
    allVariants: {
      color: "#242232",
    },
  },
  palette: {
    accentOrange: "#F29339",
    accentYellow: "#FFC916",
    arcticWhite: "#FBFBFF",
    boxShadow1: "rgba(0, 18, 61, 0.37)",
    boxShadow2: "rgba(47, 98, 220, 0.2)",
    darkPurple: "rgba(36, 34, 50, 1)",
    errorRed: "#9E2323",
    fadedPurple: "#716E88",
    highlightBlue: "#C2EFF299",
    inputRed: "#FAEAEB",
    lightBlue: "#D6E2FF",
    lightOrange: "#FFCBAD",
    negativeRed: "#E58282",
    neutralGray: "#8E908E",
    neutralWhite: "#FFFFFF",
    orangeDark: "#803205",
    positiveGreen: "#5CC165",
    primary: { main: "#0033AD" },
    primaryBlue: "#0033AD",
    secondary: { main: "rgb(255, 100, 10)" },
    secondaryBlue: "#6F99FF",
    specialCyan: "#1C94B2",
    specialCyanBorder: "#77BFD1",
    textBlack: "#242232",
    textGray: "#525252",
    borderGrey: "#BFC8D961",
    badgeColors: {
      primary: "#0034AE",
      error: "#CC0000",
      errorLight: "#FF9999",
      secondary: "#39B6D5",
      lightPurple: "#D6D8FF",
      success_text: "#315E29",
      success: "#C0E4BA",
      grey: "#506288",
    },
    customDivider: {
      primary: "#B8CDFF",
    },
  },
});

theme.shadows[1] =
  "0px 1px 2px 0px rgba(0, 51, 173, 0.08), 0px 1px 6px 1px rgba(0, 51, 173, 0.15)";
theme.shadows[2] =
  "0px 1px 2px 0px rgba(0, 51, 173, 0.08), 0px 2px 10px 2px rgba(0, 51, 173, 0.15)";
theme.shadows[3] =
  "0px 1px 3px 0px rgba(0, 51, 173, 0.08), 0px 4px 12px 3px rgba(0, 51, 173, 0.15)";
theme.shadows[4] =
  "0px 2px 3px 0px rgba(0, 51, 173, 0.08), 0px 6px 14px 4px rgba(0, 51, 173, 0.15)";
theme.shadows[5] =
  "0px 4px 4px 0px rgba(0, 51, 173, 0.08), 0px 8px 20px 6px rgba(0, 51, 173, 0.15)";
theme.shadows[6] = "rgba(47, 98, 220, 0.2) 2px 2px 20px 0px";
theme.shadows[7] = 
  "0px 10px 10px -5px rgba(33, 42, 61, 0.08)";
