"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { heroItem } from "@/lib/motion";

type HeroContentProps = {
  cvUrl?: string | null;
};

export function HeroContent({ cvUrl }: HeroContentProps) {
  return (
    <div className="max-w-xl">
      <motion.span
        custom={0}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700"
      >
        Available for work
      </motion.span>

      <motion.h1
        custom={1}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl"
      >
        Fullstack Software Engineer building{" "}
        <span className="text-teal-700">
          scalable digital products.
        </span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-6 text-base leading-relaxed text-muted-foreground"
      >
        I design and build reliable web applications with modern
        technologies, focusing on performance, maintainability,
        and user experience.
      </motion.p>

      <motion.div
        custom={3}
        variants={heroItem}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap gap-4"
      >
        <Button size="lg" asChild>
          <Link href="/projects">View Projects</Link>
        </Button>

        <Button size="lg" variant="outline" asChild>
          <a
            href={cvUrl ?? "/resume.pdf"}
            download
            target={cvUrl ? "_blank" : undefined}
            rel={cvUrl ? "noopener noreferrer" : undefined}
          >
            Download CV
          </a>
        </Button>
      </motion.div>
    </div>
  );
}
