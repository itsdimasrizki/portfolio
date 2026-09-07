import { defineField, defineType } from "sanity";

export const localizedStringSchema = defineType({
  name: "localizedString",
  title: "Teks dwibahasa",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Indonesia",
      description:
        "Kosongkan bila belum diterjemahkan — situs akan memakai versi English.",
      type: "string",
    }),
    defineField({ name: "en", title: "English", type: "string" }),
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
      rows: 4,
    }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  ],
});
