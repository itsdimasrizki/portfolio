"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

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

  // Subtle concentric technical rings expanding & rotating with scroll
  const ringCount = 5;
  for (let i = 0; i < ringCount; i++) {
    const t = i / ringCount;
    const radius = minDim * (0.17 + t * 0.27 + progress * 0.045);
    const startAngle = progress * Math.PI * (i % 2 === 0 ? 1.4 : -1.1) + i * 0.9;
    const sweep = Math.PI * (0.68 + 0.22 * Math.sin(progress * Math.PI * 2 + i));

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sweep);
    ctx.strokeStyle =
      i === 1
        ? accentColor
        : `rgba(248, 250, 252, ${0.09 + (1 - t) * 0.13})`;
    ctx.lineWidth = i === 1 ? 1.75 : 1;
    ctx.stroke();
    ctx.restore();
  }

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
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nx, ny, i % 2 === 0 ? 3 : 2, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? accentColor : "rgba(248, 250, 252, 0.45)";
    ctx.fill();
    ctx.restore();
  }

  // Subtle calibration crosshair behind subject center
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;
  const cross = 12;
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

  const { scrollYProgress } = useScroll(
    variant === "backdrop"
      ? {
          target: containerRef,
          offset: ["start end", "end start"],
        }
      : {
          target: containerRef,
          offset: ["start start", "end end"],
        }
  );

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
          "pointer-events-none absolute left-1/2 top-[48%] z-0 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 sm:h-[480px] sm:w-[480px] lg:h-[580px] lg:w-[580px]"
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
