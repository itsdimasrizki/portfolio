import { defineField, defineType } from "sanity";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Project Images",
      description:
        "Upload satu atau lebih gambar. Gambar pertama = thumbnail utama. Saat di-hover, gambar akan berganti-ganti otomatis.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categories",
      description:
        "Pilih satu atau lebih kategori. Jika dokumen lama bermasalah, hapus/re-select kategori lalu publish.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Web App", value: "Web App" },
          { title: "Dashboard", value: "Dashboard" },
          { title: "Backend", value: "Backend" },
          { title: "Marketing", value: "Marketing" },
          { title: "Personal", value: "Personal" },
          { title: "AI / ML", value: "AI / ML" },
          { title: "Mobile App", value: "Mobile App" },
          { title: "CLI / Tool", value: "CLI / Tool" },
          { title: "Open Source", value: "Open Source" },
        ],
      },
      validation: (Rule) => Rule.required().min(1),
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
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Completed", value: "completed" },
          { title: "Ongoing", value: "ongoing" },
        ],
      },
      initialValue: "completed",
    }),
    defineField({
      name: "github",
      title: "GitHub URL",
      type: "string",
      description: "URL repository GitHub (e.g. https://github.com/... atau #)",
    }),
    defineField({
      name: "liveDemo",
      title: "Live Demo URL",
      type: "string",
      description: "URL live demo website (e.g. https://... atau #)",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order (Terbaru Dulu)",
      name: "orderDesc",
      by: [{ field: "order", direction: "desc" }],
    },
  ],
});
