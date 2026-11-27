"use client";

import { motion } from "framer-motion";

import { easeOutSoft } from "@/lib/motion";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Whole-section entrance that only plays when the section actually enters
 * the viewport: it rises out of a soft blur into focus.
 * MotionConfig reducedMotion="user" strips the transform for reduced motion,
 * leaving a plain fade.
 */
export function SectionReveal({ children, className }: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 64, scale: 0.97, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: easeOutSoft }}
      style={{ transformOrigin: "50% 0%" }}
    >
      {children}
    </motion.div>
  );
}
