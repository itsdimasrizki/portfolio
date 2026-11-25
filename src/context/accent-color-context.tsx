"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export interface AccentColor {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
}

export const ACCENT_PALETTES: readonly AccentColor[] = [
  {
    id: "gold",
    name: "Gold / Amber",
    primary: "#ffd460",
    secondary: "#f6ad55",
    glow: "rgba(255, 212, 96, 0.25)",
  },
  {
    id: "violet",
    name: "Cyber Violet",
    primary: "#8b5cf6",
    secondary: "#a78bfa",
    glow: "rgba(139, 92, 246, 0.25)",
  },
  {
    id: "cyan",
    name: "Neon Cyan",
    primary: "#06b6d4",
    secondary: "#22d3ee",
    glow: "rgba(6, 182, 212, 0.25)",
  },
  {
    id: "emerald",
    name: "Emerald Matrix",
    primary: "#10b981",
    secondary: "#34d399",
    glow: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: "orange",
    name: "Solar Orange",
    primary: "#f97316",
    secondary: "#fb923c",
    glow: "rgba(249, 115, 22, 0.25)",
  },
  {
    id: "rose",
    name: "Electric Rose",
    primary: "#f43f5e",
    secondary: "#fb7185",
    glow: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: "red",
    name: "Crimson Red",
    primary: "#ef4444",
    secondary: "#f87171",
    glow: "rgba(239, 68, 68, 0.25)",
  },
] as const;

export const DEFAULT_ACCENT: AccentColor = ACCENT_PALETTES[0];
export const ACCENT_STORAGE_KEY = "portfolio_accent";

interface AccentColorContextType {
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  setAccentById: (id: string) => void;
  palettes: readonly AccentColor[];
}

const AccentColorContext = createContext<AccentColorContextType | undefined>(
  undefined
);

function applyAccentToDOM(accent: AccentColor) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--accent-primary", accent.primary);
  root.style.setProperty("--accent-secondary", accent.secondary);
  root.style.setProperty("--accent-glow", accent.glow);
  root.setAttribute("data-accent", accent.id);
}

function getInitialAccent(): AccentColor {
  if (typeof window === "undefined") return DEFAULT_ACCENT;
  try {
    const savedId = localStorage.getItem(ACCENT_STORAGE_KEY);
    if (savedId) {
      const found = ACCENT_PALETTES.find((p) => p.id === savedId);
      if (found) return found;
    }
  } catch {
    // localStorage not accessible
  }
  return DEFAULT_ACCENT;
}

export function AccentColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accent, setAccentState] = useState<AccentColor>(getInitialAccent);

  useEffect(() => {
    applyAccentToDOM(accent);
  }, [accent]);

  const setAccent = useCallback((newAccent: AccentColor) => {
    setAccentState(newAccent);
    applyAccentToDOM(newAccent);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, newAccent.id);
    } catch {
      // ignore storage failure
    }
  }, []);

  const setAccentById = useCallback(
    (id: string) => {
      const found = ACCENT_PALETTES.find((p) => p.id === id);
      if (found) {
        setAccent(found);
      }
    },
    [setAccent]
  );

  const value = useMemo(
    () => ({
      accent,
      setAccent,
      setAccentById,
      palettes: ACCENT_PALETTES,
    }),
    [accent, setAccent, setAccentById]
  );

  return (
    <AccentColorContext.Provider value={value}>
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor(): AccentColorContextType {
  const context = useContext(AccentColorContext);
  if (!context) {
    throw new Error(
      "useAccentColor must be used within an AccentColorProvider"
    );
  }
  return context;
}
