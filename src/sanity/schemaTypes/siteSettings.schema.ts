import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "profile", title: "Profil & Bio", default: true },
    { name: "media", title: "Upload CV & Foto" },
    { name: "featured", title: "Tampil di Beranda" },
    { name: "contact", title: "Kontak & Sosmed" },
  ],
  fields: [
    defineField({
      name: "fullName",
      title: "Full Name",
      description: "Nama lengkap yang ditampilkan di PDF cover dan seluruh dokumen.",
      type: "string",
      group: "profile",
    }),
    defineField({
      name: "roles",
      title: "Roles / Titles",
      description:
        "Peran profesional, urutannya bermakna. Yang pertama dipakai di tempat sempit " +
        "(penutup deck, metadata PDF) dan jadi peran yang tampil lebih dulu di beranda.",
      type: "array",
      group: "profile",
      of: [defineArrayMember({ type: "localizedString" })],
    }),
    defineField({
      name: "bio",
      title: "Professional Bio",
      description: "Ringkasan profesional yang ditampilkan di halaman About pada PDF.",
      type: "localizedText",
      group: "profile",
    }),
    defineField({
      name: "portfolioUrl",
      title: "Portfolio Website URL",
      description: "URL website portfolio kamu. Digunakan untuk QR Code di PDF.",
      type: "url",
      group: "profile",
    }),
    defineField({
      name: "cvFile",
      title: "CV / Resume File",
      description: "Upload file PDF CV kamu di sini. Tombol 'Download CV' akan otomatis menggunakan file ini.",
      type: "file",
      group: "media",
      options: {
        accept: ".pdf",
      },
    }),
    defineField({
      name: "heroPortrait",
      title: "Hero Portrait Cutout (Home)",
      description: "Transparent PNG cutout for the Home split-center hero (foto 1.png).",
      type: "image",
      group: "media",
      options: { hotspot: false },
    }),
    defineField({
      name: "aboutPortrait",
      title: "About Portrait Cutout (/about)",
      description: "Transparent PNG cutout for the About borderless side-by-side hero (foto 2.png).",
      type: "image",
      group: "media",
      options: { hotspot: false },
    }),
    defineField({
      name: "scrollSequenceFrames",
      title: "Home Scroll Sequence Frames (Optional)",
      description: "Ordered WebP frames for Home scroll scrubbing animation.",
      type: "array",
      group: "media",
      options: { layout: "grid" },
      of: [defineArrayMember({ type: "image" })],
    }),
    defineField({
      name: "featuredProjects",
      title: "Featured Projects (Home Page)",
      description: "Pilih hingga 3 project yang ingin ditampilkan di halaman utama.",
      type: "array",
      group: "featured",
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
      group: "featured",
      of: [
        {
          type: "reference",
          to: [{ type: "certificate" }],
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "locationMapUrl",
      title: "Location Map URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "twitterUrl",
      title: "X (Twitter) URL",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      group: "contact",
    }),
  ],
  preview: {
    select: {
      title: "fullName",
    },
    prepare({ title }) {
      return {
        title: title || "Site Settings",
        subtitle: "Pengaturan Global Portfolio",
      };
    },
  },
});
