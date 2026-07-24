import { Experience } from "@/types/experience";

type ExperienceCardProps = {
  experience: Experience;
};

export function ExperienceCard({
  experience,
}: ExperienceCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight">
          {experience.position}
        </h3>

        <span className="shrink-0 text-sm text-muted-foreground">
          {experience.startDate} - {experience.endDate}
        </span>
      </div>

      <p className="mt-1 font-medium">
        {experience.company}
      </p>

      <p className="text-sm text-muted-foreground">
        {experience.location}
      </p>

      <p className="mt-4 leading-relaxed text-muted-foreground">
        {experience.description}
      </p>
    </article>
  );
}