import { Experience } from "@/types/experience";

type ExperienceCardProps = {
  experience: Experience;
};

export function ExperienceCard({
  experience,
}: ExperienceCardProps) {
  return (
    <article className="rounded-2xl border p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {experience.position}
        </h3>

        <span className="text-sm text-muted-foreground">
          {experience.startDate} - {experience.endDate}
        </span>
      </div>

      <p className="mt-1 font-medium">
        {experience.company}
      </p>

      <p className="text-sm text-muted-foreground">
        {experience.location}
      </p>

      <p className="mt-4 text-muted-foreground">
        {experience.description}
      </p>
    </article>
  );
}