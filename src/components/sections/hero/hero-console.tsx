"use client";

import { useState } from "react";
import Image from "next/image";
import { Cpu, Bot, User, ArrowUpRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function HeroConsole() {
  const [activeTab, setActiveTab] = useState<"iot" | "ai" | "profile">("iot");
  const [pumpActive, setPumpActive] = useState(true);

  return (
    <div className="relative w-full overflow-hidden border border-border bg-card p-0 shadow-lg">
      {/* Console Titlebar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            DEV_LAB // CONSOLE_v2.6
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("iot")}
            className={`flex items-center gap-1.5 px-2 py-1 font-mono text-xs transition-colors ${
              activeTab === "iot"
                ? "bg-card text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Cpu className="h-3 w-3" />
            <span>ESP32_IOT</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-1.5 px-2 py-1 font-mono text-xs transition-colors ${
              activeTab === "ai"
                ? "bg-card text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="h-3 w-3" />
            <span>AI_AGENT</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-1.5 px-2 py-1 font-mono text-xs transition-colors ${
              activeTab === "profile"
                ? "bg-card text-primary font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="h-3 w-3" />
            <span>BIO</span>
          </button>
        </div>
      </div>

      {/* Console Body Area */}
      <div className="min-h-[290px] p-5">
        <AnimatePresence mode="wait">
          {activeTab === "iot" && (
            <motion.div
              key="iot"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    CURRENT_HARDWARE // TELEMETRY
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Smart Agro Melon — Fertigation FSM
                  </h3>
                </div>

                <span className="flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  MQTT_ONLINE
                </span>
              </div>

              {/* Sensor Metrics Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="border border-border bg-muted/20 p-2.5">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    pH Level
                  </span>
                  <div className="font-mono text-lg font-bold text-primary">6.42</div>
                  <span className="font-mono text-[9px] text-emerald-400">OPTIMAL</span>
                </div>

                <div className="border border-border bg-muted/20 p-2.5">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    TDS / EC
                  </span>
                  <div className="font-mono text-lg font-bold text-primary">860 ppm</div>
                  <span className="font-mono text-[9px] text-emerald-400">STABLE</span>
                </div>

                <div className="border border-border bg-muted/20 p-2.5">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">
                    Water Temp
                  </span>
                  <div className="font-mono text-lg font-bold text-primary">24.8°C</div>
                  <span className="font-mono text-[9px] text-muted-foreground">NOMINAL</span>
                </div>
              </div>

              {/* Hardware Control Widget */}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    PUMP_RELAY_1:
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      pumpActive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {pumpActive ? "ENGAGED (AUTO_DOSING)" : "OFFLINE"}
                  </span>
                </div>

                <button
                  onClick={() => setPumpActive(!pumpActive)}
                  className="border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  TOGGLE_RELAY
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    AI_SYSTEM // MULTI-AGENT ARCHITECTURE
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Matcha Career AI — LangGraph Orchestration
                  </h3>
                </div>

                <span className="border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-400">
                  FASTAPI_RUNNING
                </span>
              </div>

              {/* Agent Flow Nodes */}
              <div className="space-y-2 border border-border bg-muted/10 p-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-2 text-foreground">
                    <span className="text-primary">01 //</span> Input Parser (PDF/LinkedIn)
                  </span>
                  <span className="text-emerald-400">[PARSED]</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-2 text-foreground">
                    <span className="text-primary">02 //</span> ATS & Semantic Vector Match
                  </span>
                  <span className="text-amber-400 font-semibold">[SCORE: 92%]</span>
                </div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="flex items-center gap-2 text-foreground">
                    <span className="text-primary">03 //</span> Personalized Roadmap Agent
                  </span>
                  <span className="text-muted-foreground">[READY]</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-xs text-muted-foreground">
                <span>STACK: Python • LangGraph • FastAPI • React</span>
                <a
                  href="https://matcha-career-assistant.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  LIVE_DEMO <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-5"
            >
              <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-border bg-muted">
                <Image
                  src="/images/profile/profile.jpeg"
                  alt="Dimas Rizki"
                  fill
                  className="object-cover"
                />
                {/* Tech Reticle Corners */}
                <div className="absolute left-1 top-1 font-mono text-[9px] text-primary">+</div>
                <div className="absolute right-1 top-1 font-mono text-[9px] text-primary">+</div>
                <div className="absolute bottom-1 left-1 font-mono text-[9px] text-primary">+</div>
                <div className="absolute bottom-1 right-1 font-mono text-[9px] text-primary">+</div>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono text-[10px] uppercase text-primary">
                  ENGINEER_SPEC // #01
                </span>
                <h4 className="font-display text-lg font-bold text-foreground">
                  Dimas Rizki Ardiansyah
                </h4>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                  Informatics Eng student at UPN &quot;Veteran&quot; Yogyakarta. Lab Assistant, Assistant Lecturer, and VP of HIMATIF.
                </p>
                <div className="flex gap-2 pt-1 font-mono text-[11px] text-primary">
                  <span>[IoT/C++]</span>
                  <span>[Fullstack]</span>
                  <span>[AI/Python]</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer Status Bar */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3 w-3 text-emerald-400" />
          <span>STATUS: ALL_SYSTEMS_NOMINAL</span>
        </span>
        <span className="text-primary font-medium">UPN_VETERAN_YOGYAKARTA</span>
      </div>
    </div>
  );
}
