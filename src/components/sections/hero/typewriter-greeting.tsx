"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Locale } from "@/i18n/locale";

const GREETINGS_MAP: Record<Locale, string[]> = {
  en: ["Hello", "Welcome", "Bonjour", "Greetings", "Hi there"],
  id: ["Halo", "Selamat datang", "Sugeng rawuh", "Salam kenal", "Hai"],
};

export function TypewriterGreeting({ locale = "en" }: { locale?: Locale }) {
  const reduceMotion = useReducedMotion();
  const greetings = GREETINGS_MAP[locale] ?? GREETINGS_MAP.en;
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [text, setText] = useState(() => (reduceMotion ? greetings[0] : ""));
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const current = greetings[greetingIndex] ?? greetings[0];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === current) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && text === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
      }, 50);
    } else {
      const speed = isDeleting ? 45 : 90;
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length + (isDeleting ? -1 : 1)));
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, greetingIndex, reduceMotion, greetings]);

  return (
    <span className="font-mono text-primary font-medium">
      {reduceMotion ? greetings[0] : text}
      {!reduceMotion && <span className="animate-pulse text-primary">_</span>}
    </span>
  );
}
