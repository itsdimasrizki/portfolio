/**
 * PDF Design Tokens — Clean Light Theme
 * All pages: white background, teal accent, slate typography.
 */

export const colors = {
  // Brand
  primary:      "#0d9488",   // teal-600
  primaryDark:  "#0f766e",   // teal-700
  primaryLight: "#ccfbf1",   // teal-100
  primaryBg:    "#f0fdfa",   // teal-50

  // Backgrounds
  white:        "#ffffff",
  pageBg:       "#ffffff",
  surface:      "#f8fafc",   // slate-50
  surface2:     "#f1f5f9",   // slate-100
  border:       "#e2e8f0",   // slate-200
  borderDark:   "#cbd5e1",   // slate-300

  // Typography
  heading:      "#0f172a",   // slate-900
  body:         "#475569",   // slate-600
  muted:        "#94a3b8",   // slate-400
  secondary:    "#64748b",   // slate-500
  foreground:   "#334155",   // slate-700

  // Cover banner (teal top section)
  bannerBg:     "#0f766e",   // teal-700 — top banner background
  bannerText:   "#f0fdfa",   // teal-50  — text on banner
  bannerMuted:  "#99f6e4",   // teal-200 — subtle text on banner
  bannerBorder: "#0d9488",   // teal-600
};

export const typography = {
  fontFamily:     "Helvetica",
  fontFamilyBold: "Helvetica-Bold",

  // Scale (pt)
  display: 30,
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
  pageMarginH: 44,
  pageMarginV: 36,
  headerH:     38,   // top header bar height
  sectionGap:  16,
  itemGap:     10,
  cardPad:     12,
};
