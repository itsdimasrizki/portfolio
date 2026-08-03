/**
 * PDF Design Tokens
 * Teal/slate palette — consistent with the website identity.
 */

export const colors = {
  primary:      "#0d9488",  // teal-600
  primaryLight: "#ccfbf1",  // teal-100
  primaryDark:  "#0f766e",  // teal-700

  white:        "#ffffff",
  background:   "#f8fafc",  // slate-50
  surface:      "#f1f5f9",  // slate-100
  surfaceDark:  "#e2e8f0",  // slate-200
  border:       "#e2e8f0",  // slate-200
  borderDark:   "#cbd5e1",  // slate-300
  muted:        "#94a3b8",  // slate-400
  secondary:    "#64748b",  // slate-500
  body:         "#475569",  // slate-600
  foreground:   "#334155",  // slate-700
  heading:      "#0f172a",  // slate-900

  accent:       "#f0fdfa",  // teal-50
  accentBorder: "#99f6e4",  // teal-200

  // Cover (dark theme)
  coverBg:      "#0f172a",  // slate-900
  coverSurface: "#1e293b",  // slate-800
  coverText:    "#f1f5f9",  // slate-100
};

export const typography = {
  fontFamily:     "Helvetica",
  fontFamilyBold: "Helvetica-Bold",

  // Scale (pt)
  display: 34,
  h1:      20,
  h2:      14,
  h3:      12,
  h4:      10.5,
  body:    9.5,
  small:   9,
  tiny:    8,
  micro:   7,
};

export const spacing = {
  pageMarginH:  44,
  pageMarginV:  36,
  sectionGap:   16,
  itemGap:      10,
  cardPad:      12,
  cardPadSm:    8,
  headerH:      36,  // height of the per-page top header bar
};

export const pageSize = { format: "A4" as const };
