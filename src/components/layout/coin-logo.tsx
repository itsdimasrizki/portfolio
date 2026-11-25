"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { localeHref, type Locale } from "@/i18n/locale";

interface CoinLogoProps {
  locale: Locale;
}

export function CoinLogo({ locale }: CoinLogoProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Link
        href={localeHref(locale, "/")}
        className="group relative block h-10 w-10 perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
        onClick={() => setIsFlipped((prev) => !prev)}
        aria-label="Toggle profile avatar coin"
      >
        <motion.div
          className="relative h-full w-full rounded-full border border-border shadow-md"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Front Face: Monogram / Logo */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full bg-card font-display text-sm font-bold text-primary"
            style={{ backfaceVisibility: "hidden" }}
          >
            DR
          </div>

          {/* Back Face: Profile Photo */}
          <div
            className="absolute inset-0 overflow-hidden rounded-full bg-card"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <Image
              src="/images/profile/profile.jpeg"
              alt="Dimas Rizki"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </Link>

      {/* Say Hi Pill */}
      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-xs font-mono text-muted-foreground backdrop-blur-xs">
        <span className="inline-block origin-bottom-right animate-sayhi-wave">👋</span>
        <span>Say hi</span>
      </span>
    </div>
  );
}
