import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stagger, heightFor, accentFor, paginate, truncate, scaleTitle,
  formatDate, yearRange, splitParagraphs, yearsSince, pad2,
} from "../../src/pdf/deck/layout.ts";

test("stagger cycles through the offset pattern", () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(stagger), [0, 28, -14, 34, 8, 0]);
});

test("heightFor varies card height around a base", () => {
  assert.equal(heightFor(0, 400), 400);
  assert.equal(heightFor(1, 400), 360);
  assert.equal(heightFor(5, 400), 400);
});

test("accentFor never repeats on adjacent slides", () => {
  const seq = [0, 1, 2, 3, 4, 5].map(accentFor);
  assert.deepEqual(seq, ["blue", "orange", "ink", "blue", "orange", "ink"]);
  for (let i = 1; i < seq.length; i++) assert.notEqual(seq[i], seq[i - 1]);
});

test("paginate splits, caps pages, and drops the overflow", () => {
  const items = Array.from({ length: 14 }, (_, i) => i);
  const pages = paginate(items, 6, 2);
  assert.equal(pages.length, 2);
  assert.deepEqual(pages[0], [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(pages[1], [6, 7, 8, 9, 10, 11]);
});

test("paginate returns no pages for an empty list", () => {
  assert.deepEqual(paginate([], 6, 2), []);
});

test("truncate cuts on a word boundary and marks the cut", () => {
  assert.equal(truncate("alpha beta gamma delta", 14), "alpha beta…");
});

test("truncate leaves short values untouched", () => {
  assert.equal(truncate("Toko Azizah", 40), "Toko Azizah");
});

test("truncate hard-cuts a single long word", () => {
  assert.equal(truncate("supercalifragilistic", 10), "supercalif…");
});

test("scaleTitle steps down for longer titles", () => {
  assert.equal(scaleTitle("Toko Azizah"), 52);
  assert.equal(scaleTitle("Agro Technology Melon"), 40);
  assert.equal(scaleTitle("Matcha - AI Career Assistance"), 32);
});

test("formatDate returns undefined instead of Invalid Date", () => {
  assert.equal(formatDate(undefined), undefined);
  assert.equal(formatDate(""), undefined);
  assert.equal(formatDate("not a date"), undefined);
});

test("formatDate renders a parseable date as MMM yyyy", () => {
  assert.equal(formatDate("2025-01-15"), "Jan 2025");
});

test("yearRange marks an open-ended range as now", () => {
  assert.equal(yearRange("2025-01-15", undefined), "2025—now");
  assert.equal(yearRange("2022-01-01", "2024-01-01"), "2022—2024");
});

test("yearRange returns undefined when the start is unusable", () => {
  assert.equal(yearRange("nope", "also nope"), undefined);
});

test("splitParagraphs splits on sentence boundaries", () => {
  const out = splitParagraphs("One thing. Two thing. Three thing. Four thing.", 2);
  assert.equal(out.length, 2);
  assert.ok(out[0].startsWith("One thing."));
  assert.ok(out[1].endsWith("Four thing."));
});

test("yearsSince counts from the earliest date and never returns zero", () => {
  const now = new Date("2026-09-05");
  assert.equal(yearsSince(["2024-01-01", "2022-01-01", undefined], now), 4);
  assert.equal(yearsSince([], now), 1);
  assert.equal(yearsSince(["2026-01-01"], now), 1);
});

test("pad2 pads slide numbers", () => {
  assert.equal(pad2(3), "03");
  assert.equal(pad2(23), "23");
});
