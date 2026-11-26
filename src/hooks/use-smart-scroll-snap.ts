"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const OVERFLOW_RATIO = 1.08;

/**
 * Hybrid CSS/JS smart scroll-snapping controller.
 * - Enables `scroll-snap-type: y proximity` on the root scroll container.
 * - Uses ResizeObserver to automatically disable snapping on sections taller
 *   than 100vh * 1.08 (or marked with `data-snap="free"`) to prevent scroll trapping.
 * - Automatically disables snapping when `prefers-reduced-motion: reduce` is active.
 */
export function useSmartScrollSnap() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const clearAllSnap = () => {
      root.classList.remove("snap-proximity-y");
      document
        .querySelectorAll<HTMLElement>("section[data-snap-target], section[data-snap]")
        .forEach((el) => {
          el.classList.remove("snap-start");
          el.classList.add("snap-none");
        });
    };

    const evaluateSection = (target: HTMLElement) => {
      if (target.dataset.snap === "free") {
        target.classList.remove("snap-start");
        target.classList.add("snap-none");
        return;
      }

      const vh = window.innerHeight;
      const isOverflowing = target.offsetHeight > vh * OVERFLOW_RATIO;
      if (isOverflowing) {
        target.classList.remove("snap-start");
        target.classList.add("snap-none");
      } else {
        target.classList.add("snap-start");
        target.classList.remove("snap-none");
      }
    };

    if (reducedMotionQuery.matches) {
      clearAllSnap();
      return;
    }

    root.classList.add("snap-proximity-y");

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "section[data-snap-target], section[data-snap='free']"
      )
    );

    sections.forEach(evaluateSection);

    const observer = new ResizeObserver((entries) => {
      if (reducedMotionQuery.matches) return;
      for (const entry of entries) {
        evaluateSection(entry.target as HTMLElement);
      }
    });

    sections.forEach((section) => observer.observe(section));

    const handleResize = () => {
      if (reducedMotionQuery.matches) return;
      sections.forEach(evaluateSection);
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        clearAllSnap();
      } else {
        root.classList.add("snap-proximity-y");
        sections.forEach(evaluateSection);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    reducedMotionQuery.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      reducedMotionQuery.removeEventListener("change", handleMotionChange);
      root.classList.remove("snap-proximity-y");
    };
  }, [pathname]);
}
