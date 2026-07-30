"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { BlurImage } from "@/components/motion/blur-image";
import { heroItem } from "@/lib/motion";

type AboutHeroProps = {
  cvUrl?: string | null;
};

export function AboutHero({ cvUrl }: AboutHeroProps) {
  return (
    <Section>
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Eyebrow */}
          <motion.p
            custom={0}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="text-sm font-semibold uppercase tracking-widest text-teal-700"
          >
            About Me
          </motion.p>

          {/* Avatar */}
          <motion.div
            custom={1}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="mt-8 relative w-48 sm:w-56 aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-card shadow-md ring-1 ring-border/50 transition-all duration-300 hover:shadow-lg"
          >
            <BlurImage
              src="/images/profile/profile.jpeg"
              alt="Dimas Rizki"
              fill
              priority
              className="object-cover object-top"
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            custom={2}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="mt-10 text-4xl font-bold leading-tight tracking-tight md:text-5xl"
          >
            Dimas Rizki Ardiansyah
          </motion.h1>

          {/* Description */}
          <motion.p
            custom={3}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            Informatics Engineering Student at UPN "Veteran" Yogyakarta, passionate about Software Engineering and Artificial Intelligence.
          </motion.p>

          {/* CTA */}
          <motion.div
            custom={4}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" asChild>
              <a
                href={cvUrl ?? "/resume.pdf"}
                download
                target={cvUrl ? "_blank" : undefined}
                rel={cvUrl ? "noopener noreferrer" : undefined}
              >
                Download CV
              </a>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Let&apos;s Connect</Link>
            </Button>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            custom={5}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-foreground/20 hover:shadow-xs">
              📍 Indonesia
            </div>

            <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-foreground/20 hover:shadow-xs">
              💼 Open to Work
            </div>

            <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-foreground/20 hover:shadow-xs">
              🚀 Fullstack Engineer
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}