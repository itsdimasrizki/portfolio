"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion, useScroll, useTransform } from "framer-motion";

type ImageSequenceCanvasProps = {
  /** Optional ordered list of image URLs (e.g., Sanity CDN or /sequence/frame_000.webp) */
  frames?: string[];
  /** Number of virtual frames when rendering the built-in procedural ring sequence */
  totalProceduralFrames?: number;
  /**
   * "backdrop": transparent ring sequence aligned directly behind the Hero portrait photo.
   * "section": standalone scroll-scrubbed section container.
   */
  variant?: "backdrop" | "section";
  /** Optional wrapper className (used in backdrop mode or custom section height) */
  className?: string;
};

const MAX_CONCURRENCY = 4;
/** Backdrop ring pose at the very top of the page. */
const BACKDROP_BASE_PROGRESS = 0.35;
/** Viewport heights of page scroll that sweep the rings from base to the end. */
const BACKDROP_SCROLL_SPAN = 1.6;

function findNearestLoadedFrame(
  cache: (ImageBitmap | HTMLImageElement | null)[],
  targetIndex: number
): ImageBitmap | HTMLImageElement | null {
  if (cache[targetIndex]) return cache[targetIndex];
  for (let i = targetIndex - 1; i >= 0; i--) {
    if (cache[i]) return cache[i];
  }
  for (let i = targetIndex + 1; i < cache.length; i++) {
    if (cache[i]) return cache[i];
  }
  return null;
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: ImageBitmap | HTMLImageElement,
  canvasW: number,
  canvasH: number
) {
  const imgW = "naturalWidth" in img ? img.naturalWidth : img.width;
  const imgH = "naturalHeight" in img ? img.naturalHeight : img.height;
  if (!imgW || !imgH) return;

  const hRatio = canvasW / imgW;
  const vRatio = canvasH / imgH;
  const ratio = Math.max(hRatio, vRatio);
  const centerShiftX = (canvasW - imgW * ratio) / 2;
  const centerShiftY = (canvasH - imgH * ratio) / 2;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(
    img,
    0,
    0,
    imgW,
    imgH,
    centerShiftX,
    centerShiftY,
    imgW * ratio,
    imgH * ratio
  );
}

function drawProceduralRings(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  accentColor: string,
  transparentBg: boolean
) {
  ctx.clearRect(0, 0, width, height);

  if (!transparentBg) {
    ctx.fillStyle = "#090b0e";
    ctx.fillRect(0, 0, width, height);
  }

  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);

  // Atmospheric depth illumination behind subject
  const ambientGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.48);
  ambientGrad.addColorStop(0, accentColor);
  ambientGrad.addColorStop(0.35, "rgba(248, 250, 252, 0.04)");
  ambientGrad.addColorStop(0.7, "rgba(248, 250, 252, 0.01)");
  ambientGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = ambientGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, minDim * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3D perspective ellipse rings (tilted orbital plane)
  const tiltRings = [
    { r: 0.38, tilt: 0.42, rot: progress * 0.8 },
    { r: 0.32, tilt: 0.55, rot: -progress * 1.1 + 0.6 },
    { r: 0.26, tilt: 0.38, rot: progress * 1.4 + 1.2 },
  ];

  tiltRings.forEach((ring, idx) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ring.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, minDim * ring.r, minDim * ring.r * ring.tilt, 0, 0, Math.PI * 2);
    ctx.strokeStyle = idx === 0 ? accentColor : "rgba(248, 250, 252, 0.14)";
    ctx.lineWidth = idx === 0 ? 1.5 : 1;
    if (idx === 1) {
      ctx.setLineDash([4, 8]);
    }
    ctx.stroke();
    ctx.restore();
  });

  // Concentric technical arcs expanding & rotating with scroll
  const ringCount = 5;
  for (let i = 0; i < ringCount; i++) {
    const t = i / ringCount;
    const radius = minDim * (0.16 + t * 0.28 + progress * 0.04);
    const startAngle = progress * Math.PI * (i % 2 === 0 ? 1.3 : -1.0) + i * 0.85;
    const sweep = Math.PI * (0.65 + 0.25 * Math.sin(progress * Math.PI * 2 + i));

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sweep);
    ctx.strokeStyle =
      i === 2
        ? accentColor
        : `rgba(248, 250, 252, ${0.12 + (1 - t) * 0.16})`;
    ctx.lineWidth = i === 2 ? 1.5 : 1;
    ctx.stroke();
    ctx.restore();
  }

  // Outer calibration compass ring with degree ticks
  const outerR = minDim * 0.44;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Tick marks
  const tickCount = 36;
  for (let j = 0; j < tickCount; j++) {
    const angle = (j / tickCount) * Math.PI * 2;
    const isCardinal = j % 9 === 0;
    const tickLen = isCardinal ? 8 : 4;
    const r1 = outerR - tickLen;
    const r2 = outerR;

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
    ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
    ctx.strokeStyle = isCardinal ? accentColor : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = isCardinal ? 1.5 : 1;
    ctx.stroke();
  }
  ctx.restore();

  // Orbiting telemetry nodes synced to scroll progress
  const nodeCount = 6;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + progress * Math.PI * 1.5;
    const orbitR = minDim * (0.24 + (i % 3) * 0.08);
    const nx = cx + Math.cos(angle) * orbitR;
    const ny = cy + Math.sin(angle) * orbitR * 0.85;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nx, ny, i % 2 === 0 ? 3 : 2, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? accentColor : "rgba(248, 250, 252, 0.55)";
    ctx.fill();
    ctx.restore();
  }

  // Subtle calibration crosshair behind subject center
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  const cross = 16;
  ctx.beginPath();
  ctx.moveTo(cx - cross, cy);
  ctx.lineTo(cx + cross, cy);
  ctx.moveTo(cx, cy - cross);
  ctx.lineTo(cx, cy + cross);
  ctx.stroke();
  ctx.restore();
}

export function ImageSequenceCanvas({
  frames = [],
  totalProceduralFrames = 60,
  variant = "backdrop",
  className,
}: ImageSequenceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapsRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const reducedMotion = Boolean(useReducedMotion());

  const hasImageFrames = frames.length > 0;
  const totalFrames = hasImageFrames ? frames.length : totalProceduralFrames;

  // "section" scrubs against its own tall container. "backdrop" lives inside the
  // pinned (sticky) hero, whose position no longer changes while the page
  // scrolls, so element-relative progress would freeze the rings. Drive it from
  // the page scroll instead so the rings keep turning the whole time.
  const { scrollYProgress: sectionProgress, scrollY } = useScroll(
    variant === "section"
      ? { target: containerRef, offset: ["start start", "end end"] }
      : undefined
  );
  const backdropProgress = useTransform(scrollY, (y) => {
    const vh = typeof window === "undefined" ? 900 : window.innerHeight;
    return BACKDROP_BASE_PROGRESS + y / (vh * BACKDROP_SCROLL_SPAN);
  });
  const scrollYProgress =
    variant === "section" ? sectionProgress : backdropProgress;

  const renderFrame = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;
      if (!displayW || !displayH) return;

      const targetW = Math.round(displayW * dpr);
      const targetH = Math.round(displayH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      const clamped = reducedMotion ? 0.15 : Math.max(0, Math.min(1, progress));
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(clamped * (totalFrames - 1))
      );

      if (hasImageFrames) {
        const bitmap = findNearestLoadedFrame(bitmapsRef.current, frameIndex);
        if (bitmap) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          drawImageCover(ctx, bitmap, canvas.width, canvas.height);
          return;
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const accent =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent-primary")
          .trim() || "#ffd460";
      drawProceduralRings(
        ctx,
        displayW,
        displayH,
        clamped,
        accent,
        variant === "backdrop"
      );
    },
    [hasImageFrames, reducedMotion, totalFrames, variant]
  );

  // Async preloader with frame-0 priority, concurrency pool (4), and GPU bitmap cleanup
  useEffect(() => {
    if (!hasImageFrames) return;
    let cancelled = false;
    bitmapsRef.current = new Array(frames.length).fill(null);

    async function loadFrame(index: number) {
      const url = frames[index];
      if (!url || cancelled) return;
      try {
        const res = await fetch(url, {
          priority: index === 0 ? "high" : "low",
        } as RequestInit);
        if (!res.ok) return;
        const blob = await res.blob();
        if (cancelled) return;
        if (typeof createImageBitmap === "function") {
          const bmp = await createImageBitmap(blob);
          if (cancelled) {
            bmp.close();
            return;
          }
          bitmapsRef.current[index] = bmp;
          if (index === 0) renderFrame(progressRef.current);
        }
      } catch {
        // Gracefully fall back to nearest frame or procedural rings
      }
    }

    async function preloadAll() {
      await loadFrame(0);
      let cursor = 1;
      const workers = Array.from({ length: MAX_CONCURRENCY }, async () => {
        while (cursor < frames.length && !cancelled) {
          const idx = cursor++;
          await loadFrame(idx);
        }
      });
      await Promise.all(workers);
    }

    preloadAll();

    return () => {
      cancelled = true;
      for (const bmp of bitmapsRef.current) {
        if (bmp && typeof ImageBitmap !== "undefined" && bmp instanceof ImageBitmap) {
          bmp.close();
        }
      }
      bitmapsRef.current = [];
    };
  }, [frames, hasImageFrames, renderFrame]);

  // Subscribe to scroll progress, resize, and accent theme changes
  useEffect(() => {
    progressRef.current = scrollYProgress.get();
    renderFrame(progressRef.current);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      progressRef.current = latest;
      if (reducedMotion) return;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderFrame(latest);
        rafRef.current = null;
      });
    });

    const handleResize = () => renderFrame(progressRef.current);
    window.addEventListener("resize", handleResize, { passive: true });

    const mutationObserver = new MutationObserver(() =>
      renderFrame(progressRef.current)
    );
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
      mutationObserver.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, renderFrame, reducedMotion]);

  if (variant === "backdrop") {
    return (
      <div
        ref={containerRef}
        aria-hidden="true"
        className={
          className ??
          "pointer-events-none absolute left-1/2 top-1/2 z-0 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 sm:h-[600px] sm:w-[600px] lg:h-[780px] lg:w-[780px] xl:h-[880px] xl:w-[880px]"
        }
      >
        <canvas
          id="sequence-canvas"
          ref={canvasRef}
          className="block h-full w-full"
        />
      </div>
    );
  }

  return (
    <section
      ref={containerRef}
      data-snap="free"
      aria-label="Interactive engineering sequence"
      className={`relative w-full border-y border-border/60 bg-background ${
        reducedMotion
          ? "h-[70svh]"
          : className ?? (hasImageFrames ? "h-[220vh]" : "h-[160vh]")
      }`}
    >
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden">
        <canvas
          id="sequence-canvas"
          ref={canvasRef}
          className="block h-full w-full"
        />
      </div>
    </section>
  );
}
