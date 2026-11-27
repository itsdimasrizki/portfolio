import { defineField, defineType } from "sanity";

export const skillSchema = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "iconName",
      title: "Icon Name",
      type: "string",
      description:
        "Key untuk mapping icon di frontend, e.g. Code2, Server, Database, FaFigma, Globe, Settings",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleId: "title.id",
      iconName: "iconName",
    },
    prepare({ titleEn, titleId, iconName }) {
      return {
        title: titleEn || titleId || "Untitled Skill",
        subtitle: iconName ? `Icon: ${iconName}` : undefined,
      };
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
