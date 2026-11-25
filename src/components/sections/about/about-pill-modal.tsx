"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export type PillKey =
  | "Full-stack + AI"
  | "Production Systems"
  | "Mission Critical"
  | "Cloud Architecture";

const PILL_DETAILS: Record<PillKey, { title: string; description: string }> = {
  "Full-stack + AI": {
    title: "Full-stack + AI Engineering",
    description:
      "I build end-to-end applications that span from pixel-perfect frontends to resilient backend services, integrating AI/ML capabilities where they create real value. My work covers React/Next.js UIs, Node.js/Python APIs, and LLM-powered features that ship to real users. I treat AI as a first-class engineering concern — not a bolt-on.",
  },
  "Production Systems": {
    title: "Production-Grade Software",
    description:
      "Production means more than 'it works on my machine.' I design systems with observability, graceful degradation, and operational runbooks in mind from day one. Every service I ship has health checks, structured logging, and alerting so on-call is boring rather than stressful.",
  },
  "Mission Critical": {
    title: "Mission-Critical Systems",
    description:
      "Some systems cannot go down — financial transactions, healthcare data pipelines, identity infrastructure. I have worked on systems where downtime has real-world consequences and learned to build in redundancy, automated failover, and rigorous change management. Zero-downtime deploys and blue/green strategies are table stakes for me.",
  },
  "Cloud Architecture": {
    title: "Cloud & Infrastructure",
    description:
      "I architect cloud-native solutions on AWS and GCP, using managed services where they reduce operational burden and opting for Kubernetes when scale demands it. I write infrastructure as code with Terraform/Pulumi, establish least-privilege IAM policies, and automate everything from provisioning to cost anomaly alerts.",
  },
};

type Props = {
  pill: PillKey | null;
  onClose: () => void;
};

export function AboutPillModal({ pill, onClose }: Props) {
  const detail = pill ? PILL_DETAILS[pill] : null;

  return (
    <AnimatePresence>
      {pill && detail && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pill-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <h3
                  id="pill-modal-title"
                  className="font-display text-lg font-bold tracking-tight text-foreground"
                >
                  {detail.title}
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="mt-0.5 shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {detail.description}
              </p>

              {/* Pill echo */}
              <div className="mt-5">
                <span className="inline rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 font-mono text-xs text-primary">
                  {pill}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
