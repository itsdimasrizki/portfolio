"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

type DownloadState = "idle" | "loading" | "error";

type DownloadPortfolioButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  locale: Locale;
};

export function DownloadPortfolioButton({
  className,
  variant = "default",
  size = "sm",
  locale,
}: DownloadPortfolioButtonProps) {
  const messages = getMessages(locale);
  const [state, setState] = useState<DownloadState>("idle");

  async function handleDownload() {
    if (state === "loading") return;

    setState("loading");
    try {
      const response = await fetch(`/api/portfolio/pdf?locale=${locale}`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dimas-rizki-portfolio-${locale}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setState("idle");
    } catch (err) {
      console.error("PDF download failed:", err);
      setState("error");
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
        "rounded-none font-mono text-xs uppercase tracking-wider transition-all duration-200",
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
          {messages["cta.generating"]}
        </>
      ) : isError ? (
        <>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {messages["cta.retry"]}
        </>
      ) : (
        <>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {messages["cta.portfolio"]}
        </>
      )}
    </Button>
  );
}
