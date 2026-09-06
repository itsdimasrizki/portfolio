import { defineField, defineType } from "sanity";

export const certificateSchema = defineType({
  name: "certificate",
  title: "Certificate",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuer",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "issuedAt",
      title: "Issued At",
      type: "string",
      description: "e.g. 2025",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      description: "Gambar preview sertifikat untuk ditampilkan di website",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      description: "File PDF sertifikat asli",
      options: {
        accept: "application/pdf",
      },
    }),
    defineField({
      name: "credentialUrl",
      title: "Credential URL",
      type: "url",
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
    select: { title: "title.en", subtitle: "issuer" },
  },
  orderings: [
    {
      title: "Order (High to Low)",
      name: "orderDesc",
      by: [{ field: "order", direction: "desc" }],
    },
  ],
});
