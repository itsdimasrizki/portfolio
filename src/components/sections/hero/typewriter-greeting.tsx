"use client";

import { useEffect, useState } from "react";

const GREETINGS = [
  "Halo",
  "Hello",
  "Sugeng Rawuh",
  "Bonjour",
  "Konnichiwa",
];

export function TypewriterGreeting() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = GREETINGS[greetingIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === current) {
      // Pause before backspacing
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && text === "") {
      // Switch greeting
      setIsDeleting(false);
      setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
    } else {
      const speed = isDeleting ? 45 : 90;
      timeout = setTimeout(() => {
        setText(current.slice(0, text.length + (isDeleting ? -1 : 1)));
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, greetingIndex]);

  return (
    <span className="font-mono text-primary font-medium">
      {text}
      <span className="animate-pulse text-amber-400">_</span>
    </span>
  );
}
