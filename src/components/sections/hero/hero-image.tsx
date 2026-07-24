"use client";

import { motion } from "framer-motion";

import { HeroStats } from "./hero-stats";
import { heroItem, easeOutSoft } from "@/lib/motion";
import { BlurImage } from "@/components/motion/blur-image";

export function HeroImage() {
  return (
    <motion.div
      custom={4}
      variants={heroItem}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.3, ease: easeOutSoft }}
        className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm hover:border-foreground/20 hover:shadow-md"
      >
        <BlurImage
          src="/images/profile/profile.jpeg"
          alt="Dimas Rizki"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      <HeroStats />
    </motion.div>
  );
}

