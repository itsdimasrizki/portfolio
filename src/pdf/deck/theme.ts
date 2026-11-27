import { DISPLAY, PIXEL } from "./fonts";

/**
 * Web palette — mirrors src/app/globals.css & docs/redesign/DESIGN.md
 * Dark Obsidian Lab tokens exactly.
 */
export const colors = {
  /* ── Canvas & Surface Elevation ── */
  bg:              "#090b0e", // --background (primary page canvas)
  surfaceSubtle:   "#0e121b", // --bg-surface-subtle (certificates band)
  surfaceElevated: "#111622", // --bg-surface-elevated (experience band)
  card:            "#11151c", // --card
  secondary:       "#171d26", // --secondary / --muted
  border:          "#1e2634", // --border (1px hairline)
  borderContrast:  "#2b364a", // subtle contrast border

  /* ── Accents (default Gold/Amber from globals.css) ── */
  accent:          "#ffd460", // --accent-primary
  accentSecondary: "#f6ad55", // --accent-secondary
  accentSoft:      "#261f0d", // ~10% amber over dark surface
  accentBorder:    "#665526", // ~30-35% amber hairline border
  emerald:         "#10b981", // availability dot

  /* ── Typography ── */
  fg:              "#f1f5f9", // --foreground
  fgSecondary:     "#94a3b8", // --muted-foreground
  fgMuted:         "#64748b", // --text-muted
  white:           "#ffffff", // QR frame
} as const;

export const SLIDE = {
  w: 960,
  h: 540,
  mx: 48,
  my: 38,
  cw: 864, // 960 - 2*48
} as const;

/** Skala tipografi. lineHeight adalah pengali tanpa satuan (react-pdf). */
export const type = {
  hero:    { fontFamily: DISPLAY, fontWeight: 700, fontSize: 92,  lineHeight: 0.96 },
  display: { fontFamily: DISPLAY, fontWeight: 700, fontSize: 64,  lineHeight: 0.98 },
  stat:    { fontFamily: DISPLAY, fontWeight: 700, fontSize: 88,  lineHeight: 0.92 },
  stat2:   { fontFamily: DISPLAY, fontWeight: 700, fontSize: 56,  lineHeight: 0.94 },
  h1Big:   { fontFamily: DISPLAY, fontWeight: 700, fontSize: 48,  lineHeight: 1.04 },
  h1:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 40,  lineHeight: 1.06 },
  num:     { fontFamily: DISPLAY, fontWeight: 700, fontSize: 48,  lineHeight: 0.98 },
  h2:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 24,  lineHeight: 1.15 },
  h3:      { fontFamily: DISPLAY, fontWeight: 700, fontSize: 16,  lineHeight: 1.25 },
  body:    { fontFamily: DISPLAY, fontWeight: 400, fontSize: 12,  lineHeight: 1.5  },
  small:   { fontFamily: DISPLAY, fontWeight: 400, fontSize: 10,  lineHeight: 1.45 },
  micro:   { fontFamily: DISPLAY, fontWeight: 500, fontSize: 8.5, letterSpacing: 0.7 },
  nano:    { fontFamily: PIXEL,   fontWeight: 400, fontSize: 6.5, letterSpacing: 0.4 },
} as const;
