import type { Metadata } from "next";

import { ProjectsList } from "@/components/sections/projects/projects-list";
import { getAllProjects } from "@/services/project.service";

export const metadata: Metadata = {
  title: "Projects | Dimas Rizki",
  description:
    "A selection of web apps, dashboards, APIs, and interfaces built by Dimas Rizki.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main>
      <ProjectsList projects={projects} />
    </main>
  );
}
