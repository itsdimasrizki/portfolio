"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";

export function DogBuddy({ locale = "en" }: { locale?: Locale }) {
  const messages = getMessages(locale);
  const [barks, setBarks] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const handlePet = () => {
    setBarks((prev) => prev + 1);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  };

  const getBarkText = () => {
    if (barks === 0) return messages["hero.dog.pet"];
    if (barks % 5 === 0) return messages["hero.dog.woof"];
    if (barks % 2 === 0) return messages["hero.dog.arf"];
    return messages["hero.dog.wag"];
  };

  return (
    <div className="relative inline-block">
      <motion.button
        type="button"
        onClick={handlePet}
        animate={isBouncing ? { y: [-6, 2, -3, 0], scale: [1, 1.1, 0.95, 1] } : {}}
        transition={{ duration: 0.5 }}
        className="group flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-mono text-muted-foreground backdrop-blur-xs transition-colors hover:border-primary/60 hover:text-foreground active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={messages["hero.dog.label"]}
      >
        <span className="text-base select-none">🐶</span>
        <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">
          {getBarkText()}
        </span>
      </motion.button>
    </div>
  );
}
