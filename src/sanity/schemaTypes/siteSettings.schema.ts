import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "cvFile",
      title: "CV / Resume File",
      description: "Upload file PDF CV kamu di sini. Tombol 'Download CV' akan otomatis menggunakan file ini.",
      type: "file",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "locationMapUrl",
      title: "Location Map URL",
      type: "url",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "twitterUrl",
      title: "X (Twitter) URL",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured Projects (Home Page)",
      description: "Pilih hingga 3 project yang ingin ditampilkan di halaman utama.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "featuredCertificates",
      title: "Featured Certificates (Home Page)",
      description: "Pilih hingga 3 sertifikat yang ingin ditampilkan di halaman utama.",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "certificate" }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
  ],
});
