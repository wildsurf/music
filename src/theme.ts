// src/theme.ts
"use client";
import { Roboto } from "next/font/google";
import { alpha, createTheme, getContrastRatio } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
const infoBase = "#747574";
const theme = createTheme({
  palette: {
    background: {
      paper: "aliceblue",
    },
    info: {
      main: infoBase,
      light: alpha(infoBase, 0.5),
      dark: alpha(infoBase, 0.9),
      contrastText: getContrastRatio(infoBase, "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;
