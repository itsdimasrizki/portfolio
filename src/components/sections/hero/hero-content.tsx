import { Button } from "@/components/ui/button";

export function HeroContent() {
  return (
    <div className="max-w-xl">
      <span className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
        Available for work
      </span>

      <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-7xl">
        Fullstack Software Engineer building{" "}
        <span className="text-teal-700">
          scalable digital products.
        </span>
      </h1>

      <p className="mt-6 text-lg text-muted-foreground">
        I design and build reliable web applications with modern
        technologies, focusing on performance, maintainability,
        and user experience.
      </p>

      <div className="mt-8 flex gap-4">
        <Button>View Projects</Button>

        <Button variant="outline">
          Download CV
        </Button>
      </div>
    </div>
  );
}