import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path: string): Record<string, string> {
  return JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
}

const id = read("../../src/i18n/messages/id.json");
const en = read("../../src/i18n/messages/en.json");

test("kedua kamus punya kunci yang sama persis", () => {
  assert.deepEqual(Object.keys(id).sort(), Object.keys(en).sort());
});

test("tidak ada nilai kosong di kamus mana pun", () => {
  for (const [key, value] of Object.entries(id)) {
    assert.ok(value.trim().length > 0, `id.json: "${key}" kosong`);
  }
  for (const [key, value] of Object.entries(en)) {
    assert.ok(value.trim().length > 0, `en.json: "${key}" kosong`);
  }
});

test("kamus Indonesia tidak sekadar menyalin bahasa Inggris", () => {
  // Beberapa kunci memang identik (mis. nama produk), tapi kalau SEMUA sama
  // berarti file Indonesia belum benar-benar diterjemahkan.
  const identical = Object.keys(id).filter((key) => id[key] === en[key]);
  assert.ok(
    identical.length < Object.keys(id).length / 2,
    `terlalu banyak kunci identik: ${identical.length}`,
  );
});
