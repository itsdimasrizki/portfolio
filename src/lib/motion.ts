import type { Variants } from "framer-motion";

// Smooth, non-bouncy easing (Apple/Linear-like)
export const easeOutSoft = [0.22, 1, 0.36, 1] as const;

// Shared viewport config: play once, trigger slightly before fully in view.
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" };

// Section scroll reveal: fade + slide up.
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutSoft },
  },
};

// Container that staggers its children (e.g. hero, card grids).
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

// Item used inside a stagger container: fade + slide up, no bounce.
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOutSoft },
  },
};

// Hero sequence item: deterministic order via a `custom` index (0,1,2...).
export const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutSoft, delay: i * 0.1 },
  }),
};
