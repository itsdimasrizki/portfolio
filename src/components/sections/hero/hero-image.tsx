"use client";

import { motion } from "framer-motion";

import { heroItem, easeOutSoft } from "@/lib/motion";
import { BlurImage } from "@/components/motion/blur-image";

export function HeroImage() {
  return (
    <motion.div
      custom={4}
      variants={heroItem}
      initial="hidden"
      animate="visible"
      className="flex justify-center lg:justify-end"
    >
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3, ease: easeOutSoft }}
        className="relative aspect-[4/5] w-full max-w-md border border-border bg-card p-2 shadow-xs"
      >
        <div className="relative h-full w-full overflow-hidden bg-muted">
          <BlurImage
            src="/images/profile/profile.jpeg"
            alt="Dimas Rizki"
            fill
            priority
            className="object-cover object-top grayscale contrast-105 transition-all duration-500 hover:grayscale-0"
          />
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-muted-foreground uppercase tracking-wider px-1">
          <span>FIG 01. PROFILE</span>
          <span>LOCATION: ID-YOG</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
