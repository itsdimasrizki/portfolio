"use client";

import { useState, useRef, useEffect } from "react";
import { useAccentColor, ACCENT_PALETTES } from "@/context/accent-color-context";
import { motion, AnimatePresence } from "framer-motion";

export function AccentPicker() {
  const { accent, setAccentById } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card/80 transition-colors hover:border-primary/50"
        aria-label="Choose accent color"
        title="Choose accent color"
      >
        <span
          className="h-3.5 w-3.5 rounded-full transition-transform"
          style={{
            backgroundColor: accent.primary,
            boxShadow: `0 0 8px ${accent.glow}`,
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 flex items-center gap-1.5 rounded-full border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur-md"
          >
            {ACCENT_PALETTES.map((palette) => {
              const isSelected = palette.id === accent.id;
              return (
                <button
                  key={palette.id}
                  onClick={() => {
                    setAccentById(palette.id);
                    setIsOpen(false);
                  }}
                  className={`relative h-5 w-5 rounded-full transition-transform hover:scale-125 ${
                    isSelected ? "ring-2 ring-foreground/40 scale-110" : ""
                  }`}
                  style={{ backgroundColor: palette.primary }}
                  aria-label={`Select ${palette.name} accent`}
                  title={palette.name}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
