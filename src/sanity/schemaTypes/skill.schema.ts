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
  // title kini objek, jadi daftar dokumen harus menunjuk salah satu bahasanya
  // supaya tidak berbunyi "Untitled".
  preview: {
    select: { title: "title.en", subtitle: "title.id" },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
