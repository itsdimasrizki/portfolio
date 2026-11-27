import { defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "main", title: "Utama & Upload", default: true },
    { name: "details", title: "Kategori & Tech" },
    { name: "links", title: "Links" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "main",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Project Images",
      description:
        "Drag & drop beberapa gambar sekaligus. Gambar pertama = thumbnail utama.",
      type: "array",
      group: "main",
      options: {
        layout: "grid",
      },
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
      group: "main",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categories",
      description:
        "Satu atau lebih kategori, masing-masing dalam dua bahasa. Tulis persis sama antar proyek agar tombol filter konsisten.",
      type: "array",
      group: "details",
      of: [{ type: "localizedString" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      group: "details",
      of: [
        {
          type: "reference",
          to: [{ type: "technology" }],
        },
      ],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "details",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "details",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Ongoing", value: "ongoing" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "completed",
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Angka lebih besar tampil lebih dulu.",
      type: "number",
      group: "details",
      initialValue: 0,
    }),
    defineField({
      name: "github",
      title: "GitHub URL",
      type: "string",
      group: "links",
      description: "URL repository GitHub (e.g. https://github.com/... atau #)",
    }),
    defineField({
      name: "liveDemo",
      title: "Live Demo URL",
      type: "string",
      group: "links",
      description: "URL live demo website (e.g. https://... atau #)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      year: "year",
      status: "status",
      media: "images.0",
    },
    prepare({ title, year, status, media }) {
      const statusLabel = status === "ongoing" ? "Ongoing" : "Completed";
      return {
        title: title || "Untitled Project",
        subtitle: [year, statusLabel].filter(Boolean).join(" • "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Order (Terbaru Dulu)",
      name: "orderDesc",
      by: [{ field: "order", direction: "desc" }],
    },
  ],
});
