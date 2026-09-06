#!/usr/bin/env node
/**
 * Memindahkan field teks satu bahasa menjadi objek dwibahasa { en: <nilai> },
 * dan menyemai dokumen pageContent dari teks yang sekarang tertanam di kode.
 *
 * Dry-run adalah default. Menulis butuh --commit.
 * Idempoten: field yang sudah berbentuk objek dilewati.
 */
import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

const COMMIT = process.argv.includes("--commit");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID dan NEXT_PUBLIC_SANITY_DATASET wajib diisi.");
  process.exit(1);
}
if (COMMIT && !token) {
  console.error("SANITY_API_WRITE_TOKEN wajib diisi untuk --commit.");
  process.exit(1);
}

const client = createClient({
  projectId, dataset, token, apiVersion: "2024-01-01", useCdn: false,
});

/** [tipe dokumen, field, tipe objek tujuan] */
const TEXT_FIELDS = [
  ["siteSettings", "role", "localizedString"],
  ["siteSettings", "bio", "localizedText"],
  ["project", "description", "localizedText"],
  ["experience", "position", "localizedString"],
  ["experience", "description", "localizedText"],
  ["skill", "title", "localizedString"],
  ["skill", "description", "localizedText"],
  ["certificate", "title", "localizedString"],
];

/** [tipe dokumen, field array, tipe objek tiap elemen] */
const ARRAY_FIELDS = [["project", "category", "localizedString"]];

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

async function collectPatches() {
  const patches = [];

  for (const [type, field, objectType] of TEXT_FIELDS) {
    const docs = await client.fetch(
      `*[_type == $type && defined(${field})]{_id, ${field}}`,
      { type },
    );
    for (const doc of docs) {
      const value = doc[field];
      if (isObject(value)) continue;                       // sudah dimigrasi
      if (typeof value !== "string" || value.trim() === "") continue;
      patches.push({
        id: doc._id,
        field,
        preview: value.slice(0, 60),
        next: { _type: objectType, en: value },
      });
    }
  }

  for (const [type, field, objectType] of ARRAY_FIELDS) {
    const docs = await client.fetch(
      `*[_type == $type && defined(${field})]{_id, ${field}}`,
      { type },
    );
    for (const doc of docs) {
      const value = doc[field];
      if (!Array.isArray(value) || value.length === 0) continue;
      if (value.every(isObject)) continue;                 // sudah dimigrasi
      patches.push({
        id: doc._id,
        field,
        preview: value.join(", ").slice(0, 60),
        // Elemen array di Sanity wajib punya _key yang unik.
        next: value.map((item) =>
          isObject(item)
            ? item
            : { _type: objectType, _key: randomUUID().slice(0, 8), en: String(item) },
        ),
      });
    }
  }

  return patches;
}

const PAGE_CONTENT = {
  _id: "pageContent",
  _type: "pageContent",
  heroBadge: { _type: "localizedString", en: "Available for work" },
  heroHeadline: { _type: "localizedString", en: "Dimas Rizki Ardiansyah" },
  heroHighlight: { _type: "localizedString", en: "Fullstack Web Developer." },
  heroDescription: {
    _type: "localizedText",
    en: "I design and build reliable web applications with modern technologies, focusing on performance, maintainability, and user experience.",
  },
  storyEyebrow: { _type: "localizedString", en: "My Story" },
  storyTitle: {
    _type: "localizedString",
    en: "Building software with purpose, not just features.",
  },
  storyParagraphs: [
    "I don't believe software should exist simply because it can be built. Every project I take on starts with one question: What problem does this actually solve?",
    "That mindset has shaped the way I learn and build. From web development and backend systems to IoT and machine learning, I enjoy turning ideas into practical solutions that people can actually use. One of the projects I'm most proud of is a smart agriculture system that combines embedded hardware, real-time communication, and software engineering to automate fertigation processes.",
    "Outside the classroom, I've had the opportunity to mentor students as a Laboratory Assistant and Teaching Assistant while also serving in student organizations. Those experiences taught me that writing code is only one part of engineering. Communicating ideas, collaborating with others, and leading a team are equally important.",
    "I'm still early in my journey, and there's a lot left to learn. But every project, every challenge, and every bug I solve reinforces why I chose this path. I aim to become a software engineer who builds technology that is reliable, scalable, and designed with purpose.",
  ].map((en) => ({ _type: "localizedText", _key: randomUUID().slice(0, 8), en })),
  statLabels: ["Years Experience", "Projects", "Certificates"].map((en) => ({
    _type: "localizedString",
    _key: randomUUID().slice(0, 8),
    en,
  })),
};

async function main() {
  const patches = await collectPatches();
  const existingPageContent = await client.fetch(`*[_id == "pageContent"][0]._id`);

  console.log(`Mode: ${COMMIT ? "COMMIT (menulis)" : "DRY RUN (tidak menulis apa pun)"}`);
  console.log(`Dataset: ${dataset}\n`);

  if (patches.length === 0) {
    console.log("Tidak ada field yang perlu dimigrasi.");
  } else {
    console.log(`${patches.length} field akan dipindah ke { en: ... }:\n`);
    for (const patch of patches) {
      console.log(`  ${patch.id}  .${patch.field}  "${patch.preview}"`);
    }
  }

  console.log(
    existingPageContent
      ? "\npageContent sudah ada — dilewati."
      : "\npageContent belum ada — akan dibuat.",
  );

  if (!COMMIT) {
    console.log("\nJalankan ulang dengan --commit untuk benar-benar menulis.");
    return;
  }

  if (patches.length > 0) {
    const tx = client.transaction();
    for (const patch of patches) {
      tx.patch(patch.id, { set: { [patch.field]: patch.next } });
    }
    await tx.commit();
    console.log(`\n${patches.length} field ditulis.`);
  }

  if (!existingPageContent) {
    await client.create(PAGE_CONTENT);
    console.log("pageContent dibuat.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
