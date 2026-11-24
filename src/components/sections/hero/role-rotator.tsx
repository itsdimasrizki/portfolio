"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const INTERVAL_MS = 3000;

export function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || roles.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % roles.length),
      INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [reduceMotion, roles.length]);

  const role = roles[index] ?? roles[0] ?? "";

  return (
    <span
      className="relative inline-block align-bottom text-primary font-display"
      aria-label={`${roles.join(", ")}.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={role}
          aria-hidden
          className="inline-block underline decoration-primary/40 underline-offset-4"
          initial={reduceMotion ? false : { opacity: 0, y: "0.25em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: "-0.25em" }}
          transition={{ duration: 0.35 }}
        >
          {role}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
