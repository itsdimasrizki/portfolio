"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function DogBuddy() {
  const [barks, setBarks] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const handlePet = () => {
    setBarks((prev) => prev + 1);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const getBarkText = () => {
    if (barks === 0) return "PET ME";
    if (barks % 5 === 0) return "WOOF WOOF! ❤️";
    if (barks % 2 === 0) return "ARF! 🐾";
    return "WAG WAG!";
  };

  return (
    <div className="relative inline-block">
      <motion.button
        type="button"
        onClick={handlePet}
        animate={isBouncing ? { y: [-6, 2, -3, 0], scale: [1, 1.1, 0.95, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="group flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-mono text-muted-foreground backdrop-blur-xs transition-colors hover:border-primary/60 hover:text-foreground active:scale-95"
        aria-label="Pet the virtual dog buddy"
      >
        <span className="text-base select-none">🐶</span>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">
          {getBarkText()}
        </span>
      </motion.button>
    </div>
  );
}
