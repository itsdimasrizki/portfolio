"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

function computeViews(): string {
  const saved = localStorage.getItem("portfolio_site_views");
  if (saved) {
    const count = parseInt(saved, 10) + 1;
    localStorage.setItem("portfolio_site_views", count.toString());
    return count.toLocaleString();
  }
  const base = 24810 + Math.floor(Math.random() * 50);
  localStorage.setItem("portfolio_site_views", base.toString());
  return base.toLocaleString();
}

export function VisitorCounter() {
  const [views, setViews] = useState<string | null>(null);

  useEffect(() => {
    const next = computeViews();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setViews(next);
  }, []);

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-2.5 py-1 text-[11px] font-mono text-muted-foreground backdrop-blur-xs">
      <Eye className="h-3 w-3 text-primary" />
      <span>Views:</span>
      <span className="font-semibold text-foreground">{views ?? "24,810"}</span>
    </div>
  );
}
