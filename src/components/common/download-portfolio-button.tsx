"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DownloadState = "idle" | "loading" | "error";

type DownloadPortfolioButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
};

export function DownloadPortfolioButton({
  className,
  variant = "default",
  size = "sm",
}: DownloadPortfolioButtonProps) {
  const [state, setState] = useState<DownloadState>("idle");

  async function handleDownload() {
    if (state === "loading") return;

    setState("loading");
    try {
      const response = await fetch("/api/portfolio/pdf");

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Trigger browser download
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Dimas-Rizki-Portfolio.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Release object URL after short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setState("idle");
    } catch (err) {
      console.error("PDF download failed:", err);
      setState("error");

      // Auto-reset error state after 3s
      setTimeout(() => setState("idle"), 3000);
    }
  }

  const isLoading = state === "loading";
  const isError = state === "error";

  return (
    <Button
      id="download-portfolio-btn"
      variant={isError ? "outline" : variant}
      size={size}
      onClick={handleDownload}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        isError && "border-destructive text-destructive hover:bg-destructive/10",
        className
      )}
      aria-label={
        isLoading
          ? "Generating portfolio PDF..."
          : isError
          ? "PDF generation failed, click to retry"
          : "Download portfolio as PDF"
      }
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          Generating...
        </>
      ) : isError ? (
        <>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Retry
        </>
      ) : (
        <>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Portfolio
        </>
      )}
    </Button>
  );
}
