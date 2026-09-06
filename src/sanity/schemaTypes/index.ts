import { projectSchema } from "./project.schema";
import { experienceSchema } from "./experience.schema";
import { certificateSchema } from "./certificate.schema";
import { technologySchema } from "./technology.schema";
import { skillSchema } from "./skill.schema";
import { siteSettingsSchema } from "./siteSettings.schema";
import { pageContentSchema } from "./pageContent.schema";
import { localizedStringSchema, localizedTextSchema } from "./localized.schema";

export const schemaTypes = [
  projectSchema,
  experienceSchema,
  certificateSchema,
  technologySchema,
  skillSchema,
  siteSettingsSchema,
  pageContentSchema,
  localizedStringSchema,
  localizedTextSchema,
];
