"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion, useScroll } from "framer-motion";

type ImageSequenceCanvasProps = {
  /** Optional ordered list of image URLs (e.g., /sequence/frame_000.webp) */
  frames?: string[];
  /** Number of virtual frames when rendering the built-in procedural canvas sequence */
  totalProceduralFrames?: number;
  /** Scroll container height class */
  heightClassName?: string;
};

const MAX_CONCURRENCY = 4;

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

function drawProceduralFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
  frameIndex: number,
  totalFrames: number,
  accentColor: string
) {
  ctx.clearRect(0, 0, width, height);

  // Obsidian canvas base
  ctx.fillStyle = "#090b0e";
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);

  // Perspective grid scrubbed by scroll progress
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  const gridSize = Math.max(36, Math.round(minDim / 14));
  const offsetY = (progress * gridSize * 3) % gridSize;

  for (let x = cx % gridSize; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = offsetY; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Concentric technical rings expanding & rotating with scroll
  const ringCount = 5;
  for (let i = 0; i < ringCount; i++) {
    const t = i / ringCount;
    const radius = minDim * (0.12 + t * 0.32 + progress * 0.08);
    const startAngle = progress * Math.PI * (i % 2 === 0 ? 1.5 : -1.2) + i * 0.9;
    const sweep = Math.PI * (0.65 + 0.25 * Math.sin(progress * Math.PI * 2 + i));

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sweep);
    ctx.strokeStyle =
      i === 1
        ? accentColor
        : `rgba(248, 250, 252, ${0.08 + (1 - t) * 0.12})`;
    ctx.lineWidth = i === 1 ? 2 : 1;
    ctx.stroke();
    ctx.restore();
  }

  // Orbiting node markers
  const nodeCount = 6;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i / nodeCount) * Math.PI * 2 + progress * Math.PI * 1.6;
    const orbitR = minDim * (0.2 + (i % 3) * 0.085);
    const nx = cx + Math.cos(angle) * orbitR;
    const ny = cy + Math.sin(angle) * orbitR * 0.65;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nx, ny, i % 2 === 0 ? 3.5 : 2.5, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? accentColor : "rgba(248, 250, 252, 0.5)";
    ctx.fill();
    ctx.restore();
  }

  // Center crosshair & frame progress bar
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 1;
  const cross = 14;
  ctx.beginPath();
  ctx.moveTo(cx - cross, cy);
  ctx.lineTo(cx + cross, cy);
  ctx.moveTo(cx, cy - cross);
  ctx.lineTo(cx, cy + cross);
  ctx.stroke();

  // Scrub progress bar near bottom
  const barW = Math.min(320, width * 0.5);
  const barX = cx - barW / 2;
  const barY = height - 48;
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(barX, barY, barW, 2);
  ctx.fillStyle = accentColor;
  ctx.fillRect(barX, barY, barW * progress, 2);

  // Frame telemetry text
  ctx.font = "11px monospace";
  ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
  ctx.textAlign = "center";
  const paddedFrame = String(frameIndex + 1).padStart(3, "0");
  const paddedTotal = String(totalFrames).padStart(3, "0");
  ctx.fillText(
    `SEQUENCE // FRAME ${paddedFrame} / ${paddedTotal}`,
    cx,
    barY - 12
  );
  ctx.restore();
}

export function ImageSequenceCanvas({
  frames = [],
  totalProceduralFrames = 60,
  heightClassName = "h-[220vh]",
}: ImageSequenceCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapsRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const reducedMotion = Boolean(useReducedMotion());

  const hasImageFrames = frames.length > 0;
  const totalFrames = hasImageFrames ? frames.length : totalProceduralFrames;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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

      const clamped = Math.max(0, Math.min(1, progress));
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(clamped * (totalFrames - 1))
      );

      if (hasImageFrames) {
        const bitmap = bitmapsRef.current[frameIndex] ?? bitmapsRef.current[0];
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
      drawProceduralFrame(
        ctx,
        displayW,
        displayH,
        clamped,
        frameIndex,
        totalFrames,
        accent
      );
    },
    [hasImageFrames, totalFrames]
  );

  // Async preloader with frame-0 priority and concurrency pool (4)
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
          if (!cancelled) {
            bitmapsRef.current[index] = bmp;
            if (index === 0) renderFrame(progressRef.current);
          }
        }
      } catch {
        // Fallback to procedural render on missing/failed frames
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
        if (bmp && "close" in bmp) {
          bmp.close();
        }
      }
      bitmapsRef.current = [];
    };
  }, [frames, hasImageFrames, renderFrame]);

  // Subscribe to scroll progress & resize
  useEffect(() => {
    renderFrame(progressRef.current);

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      progressRef.current = latest;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderFrame(latest);
        rafRef.current = null;
      });
    });

    const handleResize = () => renderFrame(progressRef.current);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, renderFrame]);

  return (
    <section
      ref={containerRef}
      data-snap="free"
      aria-label="Interactive engineering sequence"
      className={`relative w-full border-y border-border/60 bg-background ${
        reducedMotion ? "h-[60vh]" : heightClassName
      }`}
    >
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden">
        <canvas
          id="sequence-canvas"
          ref={canvasRef}
          className="h-full w-full block"
        />
        <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center px-4">
          <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-xs">
            SCROLL TO SCRUB // SYSTEM ARCHITECTURE
          </span>
        </div>
      </div>
    </section>
  );
}
