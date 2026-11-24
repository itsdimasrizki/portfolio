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
  const intervalRef = useRef<number | undefined>(undefined);
  const images = project.images.length > 0 ? project.images : [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (isHovered && hasMultiple) {
      intervalRef.current = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }, 1400);
    } else {
      window.clearInterval(intervalRef.current);
    }

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [isHovered, hasMultiple, images.length]);

  const hasLiveDemo = Boolean(
    project.liveDemo && project.liveDemo.trim() !== "" && project.liveDemo !== "#"
  );
  const hasGitHub = Boolean(
    project.github && project.github.trim() !== "" && project.github !== "#"
  );

  return (
    <Card
      className="group/card flex flex-col justify-between overflow-hidden rounded-none border border-border bg-card p-0 transition-colors duration-200 hover:border-foreground/40 shadow-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Image area */}
        <div className="relative aspect-video overflow-hidden border-b border-border bg-muted/40">
          {images.length > 0 ? (
            <>
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt={`${project.title} preview ${i + 1}`}
                  fill
                  className={`object-cover transition-all duration-700 ease-in-out ${
                    i === activeIndex
                      ? "opacity-100 scale-[1.02]"
                      : "opacity-0 scale-100"
                  }`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ))}

              {hasMultiple && (
                <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show slide ${i + 1}`}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1 transition-all duration-200 ${
                        i === activeIndex
                          ? "w-6 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                [NO VISUAL ARCHIVE]
              </span>
            </div>
          )}

          {project.status === "ongoing" && (
            <Badge className="absolute left-3 top-3 z-10 rounded-none bg-primary px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary-foreground">
              WIP
            </Badge>
          )}
        </div>

        <CardContent className="space-y-4 p-5">
          {/* Header Meta: Category & Year */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex flex-wrap gap-1.5">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="border border-border/80 bg-muted/30 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>

            <span className="font-mono text-xs text-muted-foreground">
              {project.year}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
              {project.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Tech list */}
          <div className="flex flex-wrap gap-1 pt-1">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] text-muted-foreground before:content-['#'] before:text-primary/70 mr-2"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 border-t border-border bg-muted/10 p-4">
        {hasGitHub && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-none border-border font-mono text-xs uppercase tracking-wider"
          >
            <Link
              href={project.github!}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </Button>
        )}

        {hasLiveDemo ? (
          <Button
            asChild
            size="sm"
            className="rounded-none font-mono text-xs uppercase tracking-wider"
          >
            <Link
              href={project.liveDemo!}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/60 px-2 py-1">
            [INTERNAL / CLI]
          </span>
        )}
      </div>
    </Card>
  );
}
