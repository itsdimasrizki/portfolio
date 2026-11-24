import { Experience } from "@/types/experience";

type ExperienceCardProps = {
  experience: Experience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="border border-border bg-card p-6 rounded-none transition-colors duration-200 hover:border-foreground/40 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
          {experience.position}
        </h3>

        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {experience.startDate} — {experience.endDate}
        </span>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-xs text-primary">
        <span className="font-semibold">{experience.company}</span>
        {experience.location && (
          <>
            <span className="text-border">/</span>
            <span className="text-muted-foreground">{experience.location}</span>
          </>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {experience.description}
      </p>
    </article>
  );
}
