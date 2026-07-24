import type { Metadata } from "next";

import { ProjectsList } from "@/components/sections/projects/projects-list";

export const metadata: Metadata = {
  title: "Projects | Dimas Rizki",
  description:
    "A selection of web apps, dashboards, APIs, and interfaces built by Dimas Rizki.",
};

export default function ProjectsPage() {
  return (
    <main>
      <ProjectsList />
    </main>
  );
}
