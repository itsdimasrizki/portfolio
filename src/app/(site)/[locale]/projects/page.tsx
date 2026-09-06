import type { Metadata } from "next";

import { ProjectsList } from "@/components/sections/projects/projects-list";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";
import { getAllProjects } from "@/services/project.service";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);
  return {
    title: messages["meta.projects.title"],
    description: messages["meta.projects.description"],
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projects = await getAllProjects(locale as Locale);

  return (
    <main>
      <ProjectsList projects={projects} locale={locale as Locale} />
    </main>
  );
}
