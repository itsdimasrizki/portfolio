import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Project } from "@/types/project";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlurImage } from "@/components/motion/blur-image";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group/card gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <BlurImage
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03]"
        />

        {project.status === "ongoing" && (
          <Badge className="absolute left-4 top-4 bg-teal-700 text-white">
            Ongoing
          </Badge>
        )}
      </div>

      <CardContent className="space-y-5 p-6">
        {/* Categories */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <Badge key={cat} variant="secondary">
                {cat}
              </Badge>
            ))}
          </div>

          <span className="shrink-0 text-sm text-muted-foreground">
            {project.year}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="flex items-center gap-1 text-xl font-semibold transition-transform duration-300 ease-out group-hover/card:-translate-y-0.5">
            {project.title}
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 ease-out group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>

        {/* Tech */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>

        {/* Action */}
        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link href={project.github ?? "#"}>
              GitHub
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
          >
            <Link href={project.liveDemo ?? "#"}>
              Live Demo
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
