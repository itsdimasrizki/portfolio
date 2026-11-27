import type { StructureResolver } from "sanity/structure";
import {
  Award,
  Briefcase,
  Cpu,
  FileText,
  FolderKanban,
  Settings,
  Sparkles,
} from "lucide-react";

const SINGLETON_TYPES = new Set(["pageContent", "siteSettings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio CMS")
    .items([
      S.documentTypeListItem("project")
        .title("Projects")
        .icon(FolderKanban),
      S.documentTypeListItem("experience")
        .title("Experience")
        .icon(Briefcase),
      S.documentTypeListItem("certificate")
        .title("Certificates")
        .icon(Award),
      S.divider(),
      S.documentTypeListItem("skill")
        .title("Skills")
        .icon(Sparkles),
      S.documentTypeListItem("technology")
        .title("Technologies")
        .icon(Cpu),
      S.divider(),
      S.listItem()
        .title("Page Content")
        .id("pageContent")
        .icon(FileText)
        .child(
          S.document()
            .schemaType("pageContent")
            .documentId("pageContent")
        ),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(Settings)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
    ]);

export { SINGLETON_TYPES };
