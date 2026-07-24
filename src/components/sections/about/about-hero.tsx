"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { BlurImage } from "@/components/motion/blur-image";
import { heroItem } from "@/lib/motion";

export function AboutHero() {
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
            className="mt-8 relative size-40 overflow-hidden rounded-full border border-border bg-card shadow-sm"
          >
            <BlurImage
              src="/images/profile/profile.jpeg"
              alt="Dimas Rizki"
              fill
              priority
              className="object-cover"
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
            Building scalable digital products with clean architecture and
            meaningful user experiences.
          </motion.h1>

          {/* Description */}
          <motion.p
            custom={3}
            variants={heroItem}
            initial="hidden"
            animate="visible"
            className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground"
          >
            I&apos;m Dimas Rizki, a Fullstack Software Engineer based in Indonesia
            who enjoys building modern web applications with a strong focus on
            performance, scalability, and user experience.
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
              <a href="/resume.pdf" download>
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