"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useAnimationFrame,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { Award, Briefcase, Layers, User, ArrowUpRight } from "lucide-react";

import { useHeroRecede } from "@/components/motion/hero-stack";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";

type MessageKey = keyof ReturnType<typeof getMessages>;

type OrbitalNavProps = {
  locale: Locale;
  /** The portrait element rendered at z-10 so upper-arc planets pass behind the head and lower-arc planets pass in front. */
  children?: React.ReactNode;
};

type PlanetConfig = {
  id: string;
  href: string;
  labelKey: MessageKey;
  index: string;
  icon: typeof User;
  rxRatio: number;
  ryRatio: number;
  phase: number;
  speedRatio: number;
  tilt: number;
  dotClass: string;
};

const PLANETS: PlanetConfig[] = [
  {
    id: "about",
    href: "/about",
    labelKey: "nav.about",
    index: "01",
    icon: User,
    rxRatio: 0.48,
    ryRatio: 0.34,
    phase: -Math.PI * 0.72,
    speedRatio: 1.0,
    tilt: -0.18,
    dotClass: "bg-primary",
  },
  {
    id: "projects",
    href: "/projects",
    labelKey: "nav.projects",
    index: "02",
    icon: Layers,
    rxRatio: 0.45,
    ryRatio: 0.3,
    phase: -Math.PI * 0.18,
    speedRatio: 0.85,
    tilt: 0.16,
    dotClass: "bg-emerald-400",
  },
  {
    id: "experience",
    href: "/experience",
    labelKey: "nav.experience",
    index: "03",
    icon: Briefcase,
    rxRatio: 0.49,
    ryRatio: 0.35,
    phase: Math.PI * 0.28,
    speedRatio: 1.0,
    tilt: -0.18,
    dotClass: "bg-sky-400",
  },
  {
    id: "certificates",
    href: "/certificates",
    labelKey: "nav.certificates",
    index: "04",
    icon: Award,
    rxRatio: 0.46,
    ryRatio: 0.31,
    phase: Math.PI * 0.78,
    speedRatio: 0.85,
    tilt: 0.16,
    dotClass: "bg-amber-400",
  },
];

const BASE_ANGULAR_SPEED = 0.2;
const SCROLL_SPEED_BOOST = 14;

export function OrbitalNav({ locale, children }: OrbitalNavProps) {
  const messages = getMessages(locale);
  const recede = useHeroRecede();
  const reduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef = useRef(0);
  const pausedRef = useRef(false);
  const [interactive, setInteractive] = useState(true);

  const groupOpacity = useTransform(recede, [0, 0.45], [1, 0]);
  const groupScale = useTransform(recede, [0, 0.45], [1, reduceMotion ? 1 : 1.16]);

  useEffect(() => {
    const unsubscribe = recede.on("change", (latest) => {
      setInteractive(latest < 0.35);
    });
    return () => unsubscribe();
  }, [recede]);

  const positionPlanets = (baseAngle: number) => {
    const container = containerRef.current;
    if (!container) return;

    const w = container.offsetWidth;
    const h = container.offsetHeight;
    if (!w || !h) return;

    PLANETS.forEach((planet, idx) => {
      const el = planetRefs.current[idx];
      if (!el) return;

      const theta = planet.phase + baseAngle * planet.speedRatio;
      const rx = w * planet.rxRatio;
      const ry = h * planet.ryRatio;

      const rawX = Math.cos(theta) * rx;
      const rawY = Math.sin(theta) * ry;

      const cosT = Math.cos(planet.tilt);
      const sinT = Math.sin(planet.tilt);
      const x = rawX * cosT - rawY * sinT;
      const y = rawX * sinT + rawY * cosT;

      const depth = Math.sin(theta);
      const depthScale = 0.92 + (depth + 1) * 0.06;

      const isInFront = y >= -h * 0.02;
      el.style.zIndex = isInFront ? "25" : "5";
      el.style.transform = `translate3d(calc(-50% + ${x.toFixed(1)}px), calc(-50% + ${y.toFixed(1)}px), 0) scale(${depthScale.toFixed(3)})`;
    });
  };

  useEffect(() => {
    positionPlanets(0);
    const handleResize = () => positionPlanets(angleRef.current);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    const r = recede.get();
    const dt = Math.min(delta, 50) / 1000;
    const speedFactor =
      pausedRef.current && r < 0.05 ? 0.15 : 1 + r * SCROLL_SPEED_BOOST;
    angleRef.current += dt * BASE_ANGULAR_SPEED * speedFactor;
    positionPlanets(angleRef.current);
  });

  return (
    <div
      ref={containerRef}
      aria-label="Orbital section navigation"
      className="relative w-full"
    >
      {/* Subtle planetary track rings behind portrait (z-0) */}
      <motion.svg
        aria-hidden="true"
        style={{ opacity: groupOpacity, scale: groupScale }}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible opacity-35"
        viewBox="0 0 400 400"
        preserveAspectRatio="none"
      >
        <ellipse
          cx="200"
          cy="200"
          rx="192"
          ry="136"
          fill="none"
          stroke="var(--accent-primary)"
          strokeWidth="0.75"
          strokeDasharray="3 6"
          transform="rotate(-10 200 200)"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="180"
          ry="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeDasharray="2 8"
          className="text-border"
          transform="rotate(9 200 200)"
        />
      </motion.svg>

      {/* Portrait sits at z-10 between back-arc (z-5) and front-arc (z-25) planets */}
      <div className="pointer-events-none relative z-10 w-full">{children}</div>

      {PLANETS.map((planet, idx) => {
        const Icon = planet.icon;
        const label = messages[planet.labelKey];

        return (
          <motion.div
            key={planet.id}
            ref={(el) => {
              planetRefs.current[idx] = el;
            }}
            style={{ opacity: groupOpacity }}
            className="absolute left-1/2 top-1/2 will-change-transform"
          >
            <Link
              href={localeHref(locale, planet.href)}
              tabIndex={interactive ? 0 : -1}
              onMouseEnter={() => {
                pausedRef.current = true;
              }}
              onMouseLeave={() => {
                pausedRef.current = false;
              }}
              className={`group relative flex flex-col items-center gap-1 focus-visible:outline-none ${
                interactive ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              {/* Planet Core + Orbital Halo */}
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-card/90 shadow-[0_0_20px_var(--accent-glow)] backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:border-primary group-hover:shadow-[0_0_28px_var(--accent-glow)] sm:h-11 sm:w-11">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-1.5 rounded-full border border-dashed border-primary/30 transition-transform duration-700 group-hover:rotate-90 group-hover:border-primary/70"
                />
                <span
                  aria-hidden="true"
                  className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-background ${planet.dotClass}`}
                />
                <Icon className="h-4 w-4 text-primary transition-transform duration-300 group-hover:scale-110 sm:h-[18px] sm:w-[18px]" />
              </span>

              {/* Floating Planet Label Pill */}
              <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-border/80 bg-background/90 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-foreground shadow-md backdrop-blur-md transition-all duration-200 group-hover:border-primary/60 group-hover:text-primary sm:px-2.5 sm:text-[11px]">
                <span className="text-[9px] text-muted-foreground/80">
                  {planet.index}
                </span>
                <span>{label}</span>
                <ArrowUpRight className="h-2.5 w-2.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
