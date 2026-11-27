import { defineField, defineType } from "sanity";

export const experienceSchema = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fieldsets: [
    {
      name: "period",
      title: "Periode Kerja",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "string",
      fieldset: "period",
      description: "e.g. Jan 2024",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "string",
      fieldset: "period",
      description: "e.g. Present or Dec 2024",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "technology" }],
        },
      ],
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Angka lebih besar tampil lebih dulu.",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      company: "company",
      posEn: "position.en",
      posId: "position.id",
      startDate: "startDate",
      endDate: "endDate",
    },
    prepare({ company, posEn, posId, startDate, endDate }) {
      const pos = posEn || posId;
      const period = [startDate, endDate].filter(Boolean).join(" - ");
      return {
        title: company || "Untitled Experience",
        subtitle: [pos, period].filter(Boolean).join(" • "),
      };
    },
  },
  orderings: [
    {
      title: "Order",
      name: "orderDesc",
      by: [{ field: "order", direction: "desc" }],
    },
  ],
});
