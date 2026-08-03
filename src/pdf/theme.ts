/**
 * PDF Design Tokens
 * Color palette aligned with the website's teal/slate identity.
 */

export const colors = {
  // Brand
  primary: "#0d9488",       // teal-600  (maps to --primary oklch(0.47 0.11 184))
  primaryLight: "#99f6e4",  // teal-200
  primaryDark: "#0f766e",   // teal-700

  // Grays
  white: "#ffffff",
  background: "#f8fafc",    // slate-50
  surface: "#f1f5f9",       // slate-100
  border: "#e2e8f0",        // slate-200
  muted: "#94a3b8",         // slate-400
  secondary: "#64748b",     // slate-500
  foreground: "#334155",    // slate-700
  heading: "#0f172a",       // slate-900

  // Accent
  accent: "#f0fdfa",        // teal-50

  // Cover specific
  coverBg: "#0f172a",       // slate-900
  coverAccent: "#0d9488",   // teal-600
  coverText: "#f8fafc",     // slate-50
  coverMuted: "#94a3b8",    // slate-400
};

export const typography = {
  fontFamily: "Helvetica",
  fontFamilyBold: "Helvetica-Bold",

  // Scale
  display: 32,
  h1: 22,
  h2: 16,
  h3: 13,
  h4: 11,
  body: 10,
  small: 9,
  tiny: 8,
};

export const spacing = {
  pageMarginH: 48,
  pageMarginV: 48,
  sectionGap: 20,
  itemGap: 12,
  cardPad: 14,
  cardPadSm: 10,
};

export const pageSize = { format: "A4" as const };
