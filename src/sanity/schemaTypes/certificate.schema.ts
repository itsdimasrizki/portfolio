import { defineField, defineType } from "sanity";

export const certificateSchema = defineType({
  name: "certificate",
  title: "Certificate",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
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
      name: "image",
      title: "Certificate Image",
      type: "image",
      options: { hotspot: true },
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
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
