import { Experience } from "@/types/experience";

type TimelineItemProps = {
  experience: Experience;
  isLast?: boolean;
};

export function TimelineItem({ experience, isLast = false }: TimelineItemProps) {
  return (
    <div className="relative flex gap-6 pb-12 last:pb-0">
      <div className="flex flex-col items-center">
        <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-teal-700 bg-background" />

        {!isLast && (
          <span className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />
        )}
      </div>

      <div className="flex-1 pb-2">
        <span className="text-sm text-muted-foreground">
          {experience.startDate} - {experience.endDate}
        </span>

        <h3 className="mt-1 text-xl font-semibold tracking-tight">
          {experience.position}
        </h3>

        <p className="mt-1 font-medium">
          {experience.company}
        </p>

        <p className="text-sm text-muted-foreground">
          {experience.location}
        </p>

        <p className="mt-4 leading-7 text-muted-foreground">
          {experience.description}
        </p>
      </div>
    </div>
  );
}
