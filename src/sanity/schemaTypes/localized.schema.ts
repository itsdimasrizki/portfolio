import { defineField, defineType } from "sanity";

export const localizedStringSchema = defineType({
  name: "localizedString",
  title: "Teks dwibahasa",
  type: "object",
  options: {
    columns: 2,
  },
  fields: [
    defineField({
      name: "id",
      title: "Indonesia",
      description: "Kosongkan bila belum ada — otomatis pakai English.",
      type: "string",
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
  ],
});

export const localizedTextSchema = defineType({
  name: "localizedText",
  title: "Paragraf dwibahasa",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Indonesia",
      description:
        "Kosongkan bila belum diterjemahkan — situs akan memakai versi English.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
    }),
  ],
});
