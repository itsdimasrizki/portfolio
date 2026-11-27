import { defineArrayMember, defineField, defineType } from "sanity";

export const pageContentSchema = defineType({
  name: "pageContent",
  title: "Page Content",
  type: "document",
  description:
    "Teks halaman depan dan halaman Tentang yang sebelumnya tertanam di kode.",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "story", title: "Cerita (About)" },
    { name: "deck", title: "Deck & Statistik" },
  ],
  fields: [
    defineField({
      name: "heroBadge",
      title: "Hero — Badge",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero — Judul",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroHighlight",
      title: "Hero — Judul (bagian berwarna)",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero — Deskripsi",
      type: "localizedText",
      group: "hero",
    }),
    defineField({
      name: "storyEyebrow",
      title: "Cerita — Eyebrow",
      type: "localizedString",
      group: "story",
    }),
    defineField({
      name: "storyTitle",
      title: "Cerita — Judul",
      type: "localizedString",
      group: "story",
    }),
    defineField({
      name: "storyParagraphs",
      title: "Cerita — Paragraf",
      type: "array",
      group: "story",
      of: [defineArrayMember({ type: "localizedText" })],
    }),
    defineField({
      name: "deckIntro",
      title: "Deck — Perkenalan Cover",
      description:
        "Kalimat pembuka di cover deck. Satu baris per Enter, maksimal 4 baris. " +
        "Baris pendek lebih bagus: sekitar 13 karakter muat pada ukuran terbesar, " +
        "lebih dari itu hurufnya otomatis mengecil.",
      type: "localizedText",
      group: "deck",
    }),
    defineField({
      name: "statLabels",
      title: "Statistik — Label",
      description:
        "Tiga label di bawah angka statistik beranda. Angkanya sendiri belum diambil dari data.",
      type: "array",
      group: "deck",
      of: [defineArrayMember({ type: "localizedString" })],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Page Content",
        subtitle: "Teks Hero, Cerita About, & Deck Cover",
      };
    },
  },
});
