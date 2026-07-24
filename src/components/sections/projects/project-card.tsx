import Image from "next/image";
import Link from "next/link";

import { Project } from "@/types/project";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 ring-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover/card:scale-105"
        />

        {project.status === "ongoing" && (
          <Badge className="absolute left-4 top-4 bg-teal-700 text-white">
            Ongoing
          </Badge>
        )}
      </div>

      <CardContent className="space-y-5 p-6">
        {/* Category */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {project.category}
          </Badge>

          <span className="text-sm text-muted-foreground">
            {project.year}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-semibold">
            {project.title}
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