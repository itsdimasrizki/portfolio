import { defineField, defineType } from "sanity";

export const certificateSchema = defineType({
  name: "certificate",
  title: "Certificate",
  type: "document",
  fieldsets: [
    {
      name: "files",
      title: "Upload Thumbnail & PDF",
      options: { columns: 2 },
    },
  ],
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
      fieldset: "files",
      options: { hotspot: true },
      description: "Gambar preview sertifikat untuk website",
    }),
    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      fieldset: "files",
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
      description: "Angka lebih besar tampil lebih dulu.",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      titleEn: "title.en",
      titleId: "title.id",
      issuer: "issuer",
      issuedAt: "issuedAt",
      media: "thumbnail",
    },
    prepare({ titleEn, titleId, issuer, issuedAt, media }) {
      return {
        title: titleEn || titleId || "Untitled Certificate",
        subtitle: [issuer, issuedAt].filter(Boolean).join(" • "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Order (High to Low)",
      name: "orderDesc",
      by: [{ field: "order", direction: "desc" }],
    },
  ],
});
