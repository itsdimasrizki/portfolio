import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  action?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  action,
  as = "h2",
  className,
}: SectionHeaderProps) {
  const Heading = as;
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        isCenter
          ? "items-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div
        className={cn(
          "max-w-2xl",
          isCenter ? "mx-auto text-center" : "text-left"
        )}
      >
        {eyebrow && (
          <div
            className={cn(
              "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2",
              isCenter ? "justify-center" : "justify-start"
            )}
          >
            <span className="inline-block h-1.5 w-1.5 bg-primary" />
            <span>{eyebrow}</span>
          </div>
        )}

        <Heading
          className={cn(
            "font-display font-bold tracking-tight text-foreground",
            as === "h1"
              ? "text-4xl md:text-5xl lg:text-6xl"
              : "text-3xl md:text-4xl"
          )}
        >
          {title}
        </Heading>

        {description && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
