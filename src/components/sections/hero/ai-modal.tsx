"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquare, ExternalLink, Code2, Briefcase, Mail } from "lucide-react";
import { type Locale, localeHref } from "@/i18n/locale";
import Link from "next/link";

interface AiModalProps {
  locale: Locale;
}

export function AiModal({ locale }: AiModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; text: string }[]>([]);

  const sampleQuestions = [
    {
      q: "What are your core technical skills?",
      a: "I specialize in TypeScript, Next.js, React, Node.js/NestJS, Go, PostgreSQL, AWS, and AI Engineering (Claude API, OpenAI, RAG pipelines).",
    },
    {
      q: "Tell me about your featured projects.",
      a: "I build production-grade web systems, IoT telemetry hubs, and AI workflow tools. Check out the Projects section below for live demos!",
    },
    {
      q: "How can I collaborate or hire you?",
      a: "You can reach out through the Contact form below or email me directly. I'm open to full-time roles and high-impact engineering projects.",
    },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    setChatLog((prev) => [...prev, { role: "user", text: userText }]);
    setQuery("");

    setTimeout(() => {
      const match = sampleQuestions.find(
        (sq) => sq.q.toLowerCase() === userText.toLowerCase()
      );
      const reply = match
        ? match.a
        : "Thanks for asking! I'm built with Next.js, Framer Motion, and Tailwind CSS. Feel free to explore my full portfolio or drop a direct message!";
      setChatLog((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 400);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-mono text-muted-foreground backdrop-blur-xs transition-colors hover:border-primary/60 hover:text-foreground active:scale-95"
        aria-label="Ask me anything dialog"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
        <span>Ask me anything</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Ask Me Anything</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Log & Sample Prompts */}
              <div className="my-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-xs font-mono">
                {chatLog.length === 0 ? (
                  <div className="space-y-3 py-2">
                    <p className="text-muted-foreground">
                      Hey! An interactive overview of my background, tech stack, and projects. Pick a question below or write your own:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {sampleQuestions.map((sq, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sq.q)}
                          className="rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-left text-foreground transition-colors hover:border-primary/50 hover:bg-muted/40"
                        >
                          → {sq.q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatLog.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground font-semibold"
                            : "bg-muted text-foreground border border-border"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(query)}
                  placeholder="Ask a question..."
                  className="flex-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => handleSend(query)}
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-mono text-primary-foreground hover:opacity-90"
                >
                  Send
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>Direct Links:</span>
                <div className="flex gap-2">
                  <Link href={localeHref(locale, "/projects")} className="hover:text-primary">
                    Projects ↗
                  </Link>
                  <Link href={localeHref(locale, "/contact")} className="hover:text-primary">
                    Contact ↗
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
