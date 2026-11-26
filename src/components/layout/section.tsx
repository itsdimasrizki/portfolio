import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  "data-snap"?: "auto" | "free";
};

export function Section({
  className,
  "data-snap": dataSnap,
  ...props
}: SectionProps) {
  return (
    <section
      data-snap={dataSnap}
      data-snap-target={dataSnap === "free" ? undefined : "true"}
      className={cn(
        "py-8 sm:py-10 lg:py-12",
        className
      )}
      {...props}
    />
  );
}