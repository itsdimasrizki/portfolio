"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, ArrowUpRight } from "lucide-react";
import { getMessages } from "@/i18n/dictionary";
import { type Locale, localeHref } from "@/i18n/locale";
import { heroItem } from "@/lib/motion";
import Link from "next/link";

interface TestimonialSliderProps {
  locale: Locale;
}

export function TestimonialSlider({ locale }: TestimonialSliderProps) {
  const messages = getMessages(locale);
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  const testimonials = [
    {
      quote: messages["hero.testimonials.item1.quote"],
      author: messages["hero.testimonials.item1.author"],
      role: messages["hero.testimonials.item1.role"],
      initials: "AW",
      category: "ACADEMIA // LAB",
    },
    {
      quote: messages["hero.testimonials.item2.quote"],
      author: messages["hero.testimonials.item2.author"],
      role: messages["hero.testimonials.item2.role"],
      initials: "FR",
      category: "INDUSTRY // LEAD",
    },
    {
      quote: messages["hero.testimonials.item3.quote"],
      author: messages["hero.testimonials.item3.author"],
      role: messages["hero.testimonials.item3.role"],
      initials: "NP",
      category: "PEER // HIMATIF",
    },
  ];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[index];

  return (
    <motion.section
      custom={3}
      variants={heroItem}
      initial="hidden"
      animate="visible"
      className="relative w-full rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40"
      aria-label={messages["hero.testimonials.eyebrow"]}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Quote className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-primary">
            {messages["hero.testimonials.eyebrow"]}
          </span>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-background/50 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
            aria-label={messages["hero.testimonials.prev"]}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-background/50 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary active:scale-95"
            aria-label={messages["hero.testimonials.next"]}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quote Display Area */}
      <div className="relative min-h-[110px] py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <blockquote className="text-xs sm:text-sm font-normal italic leading-relaxed text-foreground/90">
              &ldquo;{current.quote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/50 bg-primary/10 font-mono text-[11px] font-bold text-primary">
                  {current.initials}
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-foreground">
                    {current.author}
                  </div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {current.role}
                  </div>
                </div>
              </div>

              <span className="font-mono text-[9px] uppercase tracking-wider text-primary/80 border border-primary/20 bg-primary/5 px-1.5 py-0.5 rounded">
                {current.category}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Dots & Link */}
      <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index
                  ? "w-4 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <Link
          href={localeHref(locale, "/experience")}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>{messages["hero.testimonials.viewAll"]}</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.section>
  );
}
