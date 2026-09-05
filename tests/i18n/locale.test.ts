import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isLocale, resolveLocale, localeHref, pickLocalized, DEFAULT_LOCALE,
} from "../../src/i18n/locale.ts";

test("isLocale hanya menerima locale yang dikenal", () => {
  assert.equal(isLocale("id"), true);
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("jv"), false);
  assert.equal(isLocale(undefined), false);
});

test("cookie yang sah selalu menang atas header", () => {
  assert.equal(resolveLocale("en", "id-ID,id;q=0.9"), "en");
  assert.equal(resolveLocale("id", "en-US,en;q=0.9"), "id");
});

test("cookie tak sah diabaikan, bukan dipakai", () => {
  assert.equal(resolveLocale("jv", "en-US,en;q=0.9"), "en");
});

test("header dibaca dari tag berbobot-q tertinggi, bukan sekadar mengandung en", () => {
  assert.equal(resolveLocale(undefined, "en-US,en;q=0.9"), "en");
  // Mengandung "en" tapi pembacanya jelas memilih Indonesia.
  assert.equal(resolveLocale(undefined, "id-ID,id;q=0.9,en;q=0.8"), "id");
  assert.equal(resolveLocale(undefined, "en;q=0.6,id;q=0.9"), "id");
});

test("tanpa cookie dan tanpa header jatuh ke Indonesia", () => {
  assert.equal(resolveLocale(undefined, undefined), "id");
  assert.equal(resolveLocale(undefined, ""), "id");
  assert.equal(DEFAULT_LOCALE, "id");
});

test("localeHref memberi prefix pada path internal", () => {
  assert.equal(localeHref("id", "/projects"), "/id/projects");
  assert.equal(localeHref("en", "/projects"), "/en/projects");
  assert.equal(localeHref("id", "/"), "/id");
});

test("localeHref tidak memberi prefix dua kali", () => {
  assert.equal(localeHref("id", "/id/projects"), "/id/projects");
  assert.equal(localeHref("id", "/en/projects"), "/en/projects");
});

test("localeHref membiarkan yang bukan path internal", () => {
  assert.equal(localeHref("id", "https://github.com/x"), "https://github.com/x");
  assert.equal(localeHref("id", "mailto:a@b.com"), "mailto:a@b.com");
  assert.equal(localeHref("id", "#kontak"), "#kontak");
});

test("localeHref membiarkan berkas statis", () => {
  // /id/resume.pdf akan 404 — berkas ini tidak punya versi bahasa.
  assert.equal(localeHref("id", "/resume.pdf"), "/resume.pdf");
});

test("pickLocalized memilih bahasa yang diminta", () => {
  assert.equal(pickLocalized({ id: "Halo", en: "Hello" }, "id"), "Halo");
  assert.equal(pickLocalized({ id: "Halo", en: "Hello" }, "en"), "Hello");
});

test("pickLocalized jatuh ke Inggris saat versi Indonesia belum diisi", () => {
  assert.equal(pickLocalized({ en: "Hello" }, "id"), "Hello");
  assert.equal(pickLocalized({ id: "", en: "Hello" }, "id"), "Hello");
  // Spasi saja tetap dihitung belum diisi.
  assert.equal(pickLocalized({ id: "   ", en: "Hello" }, "id"), "Hello");
});

test("pickLocalized mengembalikan string kosong bila keduanya kosong", () => {
  assert.equal(pickLocalized(undefined, "id"), "");
  assert.equal(pickLocalized({}, "id"), "");
});

test("pickLocalized menerima string mentah dari data yang belum dimigrasi", () => {
  assert.equal(pickLocalized("teks lama", "id"), "teks lama");
});
