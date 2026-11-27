"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type TypeTextProps = {
  text: string;
  /** Seconds to wait after entering the viewport. */
  delay?: number;
  /** Milliseconds per character. */
  speed?: number;
  className?: string;
};

/**
 * Types its text once, the first time it is seen, with a blinking caret.
 * The full string is laid out invisibly underneath so the line never
 * changes width while typing (no layout shift in right-aligned rows).
 */
export function TypeText({
  text,
  delay = 0,
  speed = 42,
  className,
}: TypeTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let i = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) window.clearInterval(interval);
      }, speed);
    }, delay * 1000);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [inView, reduceMotion, text, delay, speed]);

  const shown = reduceMotion ? text.length : count;
  const typing = shown > 0 && shown < text.length;

  return (
    <span ref={ref} className={cn("relative inline-grid", className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {text.slice(0, shown)}
        {typing && (
          <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] animate-pulse bg-current" />
        )}
      </span>
    </span>
  );
}
