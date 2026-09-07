#!/usr/bin/env node
/**
 * Mengubah siteSettings.role (satu objek dwibahasa) menjadi roles (daftar peran),
 * dan menyemai pageContent.deckIntro dengan draft perkenalan cover.
 *
 * Dry-run adalah default. Menulis butuh --commit.
 * Idempoten: apa pun yang sudah ada dilewati, bukan ditimpa — teks yang sudah
 * disunting di Studio tidak boleh hilang karena skrip ini dijalankan dua kali.
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

const key = () => randomUUID().slice(0, 8);

/**
 * Peran tambahan. Yang lama tetap jadi entri pertama, bukan dibuang: itu
 * satu-satunya isi yang benar-benar ditulis pemiliknya.
 */
const EXTRA_ROLES = [
  { en: "Data Scientist", id: "Data Scientist" },
  { en: "Data Analyst", id: "Analis Data" },
  { en: "ML Engineer", id: "ML Engineer" },
];

const FIRST_ROLE_ID = "Pengembang Web Full Stack";

const DECK_INTRO = {
  _type: "localizedText",
  en: ["hi, i'm dimas", "i build apps", "and turn data", "into answers."].join("\n"),
  id: ["halo, saya dimas,", "saya bangun web", "dan mengolah data", "jadi jawaban."].join("\n"),
};

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

/** Nilai `role` lama bisa berupa objek dwibahasa atau string mentah. */
function firstRoleFrom(role) {
  const base = isObject(role) ? role : { en: typeof role === "string" ? role : "" };
  return {
    _type: "localizedString",
    _key: key(),
    en: base.en ?? "",
    id: base.id?.trim() ? base.id : FIRST_ROLE_ID,
  };
}

async function main() {
  const settings = await client.fetch(
    `*[_type == "siteSettings"][0]{_id, role, roles}`,
  );
  const page = await client.fetch(`*[_id == "pageContent"][0]{_id, deckIntro}`);

  console.log(`Mode: ${COMMIT ? "COMMIT (menulis)" : "DRY RUN (tidak menulis apa pun)"}`);
  console.log(`Dataset: ${dataset}\n`);

  if (!settings) {
    console.error("Dokumen siteSettings tidak ditemukan. Berhenti.");
    process.exit(1);
  }

  const needsRoles = !Array.isArray(settings.roles) || settings.roles.length === 0;
  const needsUnset = settings.role !== undefined;
  const needsIntro = page && !isObject(page.deckIntro);

  const roles = needsRoles
    ? [
        firstRoleFrom(settings.role),
        ...EXTRA_ROLES.map((role) => ({ _type: "localizedString", _key: key(), ...role })),
      ]
    : null;

  if (roles) {
    console.log(`${settings._id}  .roles akan diisi ${roles.length} peran:`);
    for (const role of roles) console.log(`    ${role.en}  /  ${role.id}`);
  } else {
    console.log("roles sudah ada — dilewati.");
  }

  console.log(
    needsUnset
      ? `\n${settings._id}  .role (tunggal) akan dihapus.`
      : "\nrole tunggal sudah tidak ada — dilewati.",
  );

  if (!page) {
    console.log("\npageContent tidak ada — deckIntro dilewati.");
  } else if (needsIntro) {
    console.log("\npageContent.deckIntro akan diisi draft:");
    for (const lang of ["en", "id"]) {
      console.log(`  [${lang}] ${DECK_INTRO[lang].replace(/\n/g, " / ")}`);
    }
  } else {
    console.log("\ndeckIntro sudah ada — dilewati.");
  }

  if (!needsRoles && !needsUnset && !needsIntro) {
    console.log("\nTidak ada yang perlu dimigrasi.");
    return;
  }

  if (!COMMIT) {
    console.log("\nJalankan ulang dengan --commit untuk benar-benar menulis.");
    return;
  }

  const tx = client.transaction();
  if (roles) tx.patch(settings._id, { set: { roles } });
  if (needsUnset) tx.patch(settings._id, { unset: ["role"] });
  if (needsIntro) tx.patch(page._id, { set: { deckIntro: DECK_INTRO } });
  await tx.commit();

  console.log("\nSelesai ditulis.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
