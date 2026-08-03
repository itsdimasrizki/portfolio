import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      description: "Nama lengkap yang ditampilkan di PDF cover dan seluruh dokumen.",
      type: "string",
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      description: "Role / jabatan profesional, misalnya: Fullstack Software Engineer.",
      type: "string",
    }),
    defineField({
      name: "bio",
      title: "Professional Bio",
      description: "Ringkasan profesional yang ditampilkan di halaman About pada PDF.",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "portfolioUrl",
      title: "Portfolio Website URL",
      description: "URL website portfolio kamu. Digunakan untuk QR Code di PDF.",
      type: "url",
    }),
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
