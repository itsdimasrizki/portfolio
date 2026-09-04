import { DISPLAY, PIXEL } from "./fonts";

export const colors = {
  bone: "#EAE8E3",
  paper: "#F5F4F1",
  ink: "#141414",
  blue: "#2B44FF",
  orange: "#FF6B3D",
  peach: "#F2D9CD",
  mauve: "#9A5F97",
  lilac: "#CFCFE6",
  white: "#FFFFFF",
  muted: "#8A8880",
  mutedOn: "#A9B4FF",
} as const;

export const SLIDE = {
  w: 960,
  h: 540,
  mx: 48,
  my: 40,
  cw: 864, // 960 - 2*48
} as const;

/** Skala tipografi. lineHeight adalah pengali tanpa satuan (react-pdf). */
export const type = {
  hero:    { fontFamily: DISPLAY, fontWeight: 700, fontSize: 108, lineHeight: 0.92 },
  display: { fontFamily: DISPLAY, fontWeight: 700, fontSize: 72,  lineHeight: 0.95 },
  stat:    { fontFamily: DISPLAY, fontWeight: 700, fontSize: 96,  lineHeight: 0.9 },
  stat2:   { fontFamily: DISPLAY, fontWeight: 700, fontSize: 64,  lineHeight: 0.9 },
  h1Big:   { fontFamily: DISPLAY, fontWeight: 700, fontSize: 52,  lineHeight: 1.0 },
  h1:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 44,  lineHeight: 1.02 },
  num:     { fontFamily: DISPLAY, fontWeight: 700, fontSize: 56,  lineHeight: 0.95 },
  h2:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 26,  lineHeight: 1.1 },
  h3:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 17,  lineHeight: 1.2 },
  body:    { fontFamily: DISPLAY, fontWeight: 400, fontSize: 12,  lineHeight: 1.45 },
  small:   { fontFamily: DISPLAY, fontWeight: 400, fontSize: 10,  lineHeight: 1.4 },
  micro:   { fontFamily: PIXEL,   fontWeight: 400, fontSize: 8,   letterSpacing: 0.6 },
  nano:    { fontFamily: PIXEL,   fontWeight: 400, fontSize: 6.5, letterSpacing: 0.4 },
} as const;
