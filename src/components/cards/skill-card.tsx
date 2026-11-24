import { ReactNode } from "react";

type SkillCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function SkillCard({
  icon,
  title,
  description,
}: SkillCardProps) {
  return (
    <div className="rounded-none border border-border bg-card p-6 transition-colors duration-200 hover:border-foreground/40 shadow-xs">
      <div className="mb-4 flex h-10 w-10 items-center justify-center border border-border bg-muted/20 text-primary">
        {icon}
      </div>

      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
