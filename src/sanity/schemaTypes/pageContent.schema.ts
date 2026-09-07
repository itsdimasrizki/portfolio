import { defineArrayMember, defineField, defineType } from "sanity";

export const pageContentSchema = defineType({
  name: "pageContent",
  title: "Page Content",
  type: "document",
  description:
    "Teks halaman depan dan halaman Tentang yang sebelumnya tertanam di kode.",
  fields: [
    defineField({
      name: "heroBadge",
      title: "Hero — Badge",
      type: "localizedString",
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero — Judul",
      type: "localizedString",
    }),
    defineField({
      name: "heroHighlight",
      title: "Hero — Judul (bagian berwarna)",
      type: "localizedString",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero — Deskripsi",
      type: "localizedText",
    }),
    defineField({
      name: "storyEyebrow",
      title: "Cerita — Eyebrow",
      type: "localizedString",
    }),
    defineField({
      name: "storyTitle",
      title: "Cerita — Judul",
      type: "localizedString",
    }),
    defineField({
      name: "storyParagraphs",
      title: "Cerita — Paragraf",
      type: "array",
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
    }),
    defineField({
      name: "statLabels",
      title: "Statistik — Label",
      description:
        "Tiga label di bawah angka statistik beranda. Angkanya sendiri belum diambil dari data.",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
    }),
  ],
});
