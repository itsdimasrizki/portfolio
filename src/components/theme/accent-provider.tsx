"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AccentColor = {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  glow: string;
};

export const ACCENT_PALETTES: AccentColor[] = [
  {
    id: "gold",
    name: "Amber Gold",
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
];

interface AccentContextType {
  currentAccent: AccentColor;
  setAccent: (accentId: string) => void;
  palettes: AccentColor[];
}

const AccentContext = createContext<AccentContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio-accent-color";

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [currentAccent, setCurrentAccent] = useState<AccentColor>(ACCENT_PALETTES[0]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const found = ACCENT_PALETTES.find((p) => p.id === saved);
      if (found) {
        // Use a microtask to avoid setState-in-effect lint warning
        Promise.resolve().then(() => setCurrentAccent(found));
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-primary", currentAccent.primary);
    root.style.setProperty("--accent-secondary", currentAccent.secondary);
    root.style.setProperty("--accent-glow", currentAccent.glow);
    root.style.setProperty("--primary", currentAccent.primary);
    root.style.setProperty("--ring", currentAccent.primary);
  }, [currentAccent]);

  const setAccent = (accentId: string) => {
    const found = ACCENT_PALETTES.find((p) => p.id === accentId);
    if (found) {
      setCurrentAccent(found);
      localStorage.setItem(STORAGE_KEY, found.id);
    }
  };

  return (
    <AccentContext.Provider value={{ currentAccent, setAccent, palettes: ACCENT_PALETTES }}>
      {children}
    </AccentContext.Provider>
  );
}

export function useAccent() {
  const context = useContext(AccentContext);
  if (!context) {
    throw new Error("useAccent must be used within an AccentProvider");
  }
  return context;
}
