"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";

import { easeOutSoft } from "@/lib/motion";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const word: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.75, ease: easeOutSoft } },
};

/**
 * Heading text that rises word by word out of an invisible baseline mask the
 * first time it scrolls into view. Words wrap naturally, so multi-line titles
 * read as lines rising in sequence. Reduced motion (MotionConfig "user")
 * skips the transform and shows the text at rest.
 */
export function MaskedText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          {/* Padding/negative margin keeps descenders (g, y, p) unclipped. */}
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
