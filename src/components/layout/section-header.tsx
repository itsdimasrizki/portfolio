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
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
            {eyebrow}
          </p>
        )}

        <Heading
          className={cn(
            "mt-3 font-bold tracking-tight",
            as === "h1"
              ? "text-4xl md:text-5xl"
              : "text-3xl md:text-4xl"
          )}
        >
          {title}
        </Heading>

        {description && (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
