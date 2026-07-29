"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { Project } from "@/types/project";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const images = project.images.length > 0 ? project.images : [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (isHovered && hasMultiple) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, 1200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (!isHovered) setActiveIndex(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, hasMultiple, images.length]);

  return (
    <Card
      className="group/card gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 ring-0 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {images.length > 0 ? (
          <>
            {images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                fill
                className={`object-cover transition-all duration-700 ease-in-out ${
                  i === activeIndex
                    ? "opacity-100 scale-[1.03]"
                    : "opacity-0 scale-100"
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ))}

            {/* Dot indicators — only show when multiple images */}
            {hasMultiple && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-4 bg-white"
                        : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Placeholder when no image
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}

        {project.status === "ongoing" && (
          <Badge className="absolute left-4 top-4 z-10 bg-teal-700 text-white">
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
          <Button asChild variant="outline" size="sm">
            <Link href={project.github ?? "#"}>
              GitHub
            </Link>
          </Button>

          <Button asChild size="sm">
            <Link href={project.liveDemo ?? "#"}>
              Live Demo
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
