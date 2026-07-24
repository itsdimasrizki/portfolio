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
    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
        {icon}
      </div>

      <h3 className="text-lg font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}