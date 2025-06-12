// theme.d.ts - Put this in a separate declaration file
import {
  Theme as MuiTheme,
  ThemeOptions as MuiThemeOptions,
  Palette as MuiPalette,
  PaletteOptions as MuiPaletteOptions,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette extends MuiPalette {
    accentOrange: string;
    accentYellow: string;
    arcticWhite: string;
    boxShadow1: string;
    boxShadow2: string;
    darkPurple: string;
    errorRed: string;
    highlightBlue: string;
    inputRed: string;
    negativeRed: string;
    neutralGray: string;
    orangeDark: string;
    neutralWhite: string;
    midRed:string;
    positiveGreen: string;
    primaryBlue: string;
    secondaryBlue: string;
    specialCyan: string;
    specialCyanBorder: string;
    lightBlue: string;
    textBlack: string;
    textGray: string;
    textLightGray: string;
    lightOrange: string;
    fadedPurple: string;
    badgeColors: {
      primary: string;
      error: string;
      errorLight: string;
      secondary: string;
      lightPurple: string;
      darkPurple: string
      success_text: string;
      success: string;
      grey: string;
    };
    customDivider: {
      primary: string;
    };
  }

  interface PaletteOptions extends MuiPaletteOptions {
    accentOrange?: string;
    accentYellow?: string;
    arcticWhite?: string;
    boxShadow1?: string;
    boxShadow2?: string;
    darkPurple?: string;
    errorRed?: string;
    highlightBlue?: string;
    inputRed?: string;
    negativeRed?: string;
    neutralGray?: string;
    orangeDark?: string;
    neutralWhite?: string;
    midRed: string;
    positiveGreen?: string;
    primaryBlue?: string;
    secondaryBlue?: string;
    specialCyan?: string;
    specialCyanBorder?: string;
    lightBlue?: string;
    textBlack?: string;
    textGray?: string;
    textLightGray?: string;
    lightOrange?: string;
    fadedPurple?: string;
    borderGrey?: string;
    badgeColors?: {
      primary: string;
      error: string;
      errorLight: string;
      secondary: string;
      lightPurple: string;
      darkPurple: string;
      success_text: string;
      success: string;
      grey: string;
    };
    customDivider?: {
      primary: string;
    };
  }

  interface Theme extends MuiTheme {
    palette: Palette;
  }

  interface ThemeOptions extends MuiThemeOptions {
    palette?: PaletteOptions;
  }
}
