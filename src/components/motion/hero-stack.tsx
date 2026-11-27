"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

type HeroStackProps = {
  /** The first-viewport section that recedes into the background. */
  hero: React.ReactNode;
  /** Everything after the hero; slides up as one sheet and covers it. */
  children: React.ReactNode;
};

const NAV_HEIGHT = 64;

/** 0 → hero fully visible, 1 → hero fully covered by the next sheet. */
const HeroRecedeContext = createContext<MotionValue<number> | null>(null);

/** Cover progress for layers inside the hero (parallax). 0 outside a stack. */
export function useHeroRecede(): MotionValue<number> {
  const fallback = useMotionValue(0);
  return useContext(HeroRecedeContext) ?? fallback;
}

/**
 * "Stacked cover" scroll scene:
 * - The hero pins (sticky) and zooms back into depth: it scales down, rounds
 *   its corners and dims, as if pushed away from the viewer.
 * - The following content is an opaque sheet that scrolls up over it.
 *
 * Progress is measured on the covering sheet (its top edge travelling from the
 * bottom of the viewport to the top), so it stays correct regardless of sticky
 * positioning. Tall heroes (mobile stacked layout) pin by their bottom edge so
 * no hero content is ever hidden before the user has scrolled past it.
 */
export function HeroStack({ hero, children }: HeroStackProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const measure = () => {
      // Pin under the navbar when the hero fits; otherwise pin by its bottom
      // edge (negative top) so the whole hero can be read first.
      setStickyTop(Math.min(NAV_HEIGHT, window.innerHeight - el.offsetHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: coverRef,
    offset: ["start end", "start start"],
  });
  // Light smoothing so wheel steps read as a continuous push, not a jitter.
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    mass: 0.4,
  });

  const scale = useTransform(progress, [0, 1], [1, reduceMotion ? 1 : 0.86]);
  const y = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : -24]);
  const radius = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : 28]);
  const shade = useTransform(progress, [0, 1], [0, 0.65]);

  return (
    <HeroRecedeContext.Provider value={progress}>
      <div className="relative">
        <div ref={heroRef} className="sticky z-0" style={{ top: stickyTop }}>
          <motion.div
            style={{ scale, y, borderRadius: radius }}
            className="relative origin-[50%_35%] overflow-hidden will-change-transform"
          >
            {hero}
            {/* Depth shade: the hero sinks into the dark as it recedes. */}
            <motion.div
              aria-hidden="true"
              style={{ opacity: shade }}
              className="pointer-events-none absolute inset-0 z-30 bg-background"
            />
          </motion.div>
        </div>

        <div
          ref={coverRef}
          className="relative z-10 rounded-t-[2rem] border-t border-[var(--border-contrast)] bg-background shadow-[0_-28px_60px_-12px_rgba(0,0,0,0.55)] sm:rounded-t-[2.5rem]"
        >
          {/* Grab-handle hint on the sheet's leading edge */}
          <div
            aria-hidden="true"
            className="mx-auto h-1 w-12 translate-y-3 rounded-full bg-border"
          />
          {children}
        </div>
      </div>
    </HeroRecedeContext.Provider>
  );
}
