import { projectSchema } from "./project.schema";
import { experienceSchema } from "./experience.schema";
import { certificateSchema } from "./certificate.schema";
import { technologySchema } from "./technology.schema";
import { skillSchema } from "./skill.schema";
import { siteSettingsSchema } from "./siteSettings.schema";

export const schemaTypes = [
  projectSchema,
  experienceSchema,
  certificateSchema,
  technologySchema,
  skillSchema,
  siteSettingsSchema,
];
