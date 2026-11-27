import { defineField, defineType } from "sanity";

export const technologySchema = defineType({
  name: "technology",
  title: "Technology",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "iconName",
      title: "Icon Name",
      type: "string",
      description:
        "Key untuk mapping icon di frontend, e.g. SiNextdotjs, FaReact",
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
      title: "name",
      category: "category",
      iconName: "iconName",
    },
    prepare({ title, category, iconName }) {
      return {
        title: title || "Untitled Technology",
        subtitle: [category, iconName].filter(Boolean).join(" • "),
      };
    },
  },
  orderings: [
    {
      title: "Category & Order",
      name: "categoryOrder",
      by: [
        { field: "category", direction: "asc" },
        { field: "order", direction: "asc" },
      ],
    },
  ],
});
