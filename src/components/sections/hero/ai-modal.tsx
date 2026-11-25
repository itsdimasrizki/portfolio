"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { type Locale, localeHref } from "@/i18n/locale";
import { getMessages } from "@/i18n/dictionary";
import Link from "next/link";

interface AiModalProps {
  locale: Locale;
}

export function AiModal({ locale }: AiModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const messages = getMessages(locale);

  const sampleQuestions = locale === "id" ? [
    {
      q: "Apa saja keahlian teknis utamamu?",
      a: "Saya fokus pada TypeScript, Next.js, React, Node.js/NestJS, Go, Python, PostgreSQL, AWS, serta AI Engineering (Claude API, OpenAI, RAG pipelines).",
    },
    {
      q: "Ceritakan proyek unggulan yang pernah dibuat.",
      a: "Saya membangun sistem web produksi, telemetri IoT real-time, dan sistem automasi berbasis AI. Cek proyek Matcha di bagian hero dan Featured Projects di bawah!",
    },
    {
      q: "Apakah terbuka untuk kolaborasi atau peluang kerja?",
      a: "Ya! Saya terbuka untuk tawaran kerja full-time, magang teknis berbobot, atau proyek kolaboratif perangkat lunak.",
    },
  ] : [
    {
      q: "What are your core technical skills?",
      a: "I specialize in TypeScript, Next.js, React, Node.js/NestJS, Go, Python, PostgreSQL, AWS, and AI Engineering (Claude API, OpenAI, RAG pipelines).",
    },
    {
      q: "Tell me about your featured projects.",
      a: "I build production-grade web systems, real-time IoT telemetry, and AI automation tools. Check out Matcha in the hero section and featured projects below!",
    },
    {
      q: "Are you open to roles or collaborations?",
      a: "Yes! Available for full-time engineering roles, technical internships, and collaborative software projects.",
    },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    setChatLog((prev) => [...prev, { role: "user", text: userText }]);
    setQuery("");

    setTimeout(() => {
      const match = sampleQuestions.find((s) =>
        s.q.toLowerCase().includes(userText.toLowerCase()) ||
        userText.toLowerCase().includes(s.q.toLowerCase().slice(0, 10))
      );
      const reply = match
        ? match.a
        : (locale === "id"
            ? "Terima kasih atas pertanyaannya! Jangan ragu menghubungi saya via halaman Kontak atau LinkedIn untuk diskusi lebih lanjut."
            : "Thanks for asking! Feel free to reach out via the Contact page or LinkedIn for more in-depth discussions.");
      setChatLog((prev) => [...prev, { role: "assistant", text: reply }]);
    }, 300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-mono text-muted-foreground backdrop-blur-xs transition-colors hover:border-primary/60 hover:text-foreground active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={messages["hero.ai.trigger"]}
      >
        <Sparkles className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
        <span>{messages["hero.ai.trigger"]}</span>
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
                  <span>{messages["hero.ai.title"]}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={messages["hero.ai.close"]}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Log & Sample Prompts */}
              <div className="my-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-xs font-mono">
                {chatLog.length === 0 ? (
                  <div className="space-y-3 py-2">
                    <p className="text-muted-foreground">
                      {locale === "id"
                        ? "Pilih salah satu pertanyaan cepat berikut atau ketik pertanyaanmu sendiri:"
                        : "Pick a quick question below or type your own question:"}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {sampleQuestions.map((sq, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSend(sq.q)}
                          className="rounded-lg border border-border/80 bg-background/50 px-3 py-2 text-left text-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
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

              {/* Input Area */}
              <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend(query)}
                  placeholder={messages["hero.ai.placeholder"]}
                  className="flex-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => handleSend(query)}
                  className="rounded-full bg-primary px-3 py-1.5 text-xs font-mono text-primary-foreground hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {messages["hero.ai.send"]}
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>{locale === "id" ? "Tautan Cepat:" : "Direct Links:"}</span>
                <div className="flex gap-2">
                  <Link href={localeHref(locale, "/projects")} className="hover:text-primary">
                    {messages["nav.projects"]} ↗
                  </Link>
                  <Link href={localeHref(locale, "/contact")} className="hover:text-primary">
                    {messages["nav.contact"]} ↗
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
