import { test } from "node:test";
import assert from "node:assert/strict";
import {
  stagger, heightFor, accentFor, paginate, truncate, scaleTitle,
  formatDate, yearRange, splitParagraphs, yearsSince, pad2,
  joinRoles, introLines,
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

test("formatDate keeps a bare year bare instead of inventing a month", () => {
  // `new Date("2026")` lands on 1 January, so "Jan 2026" would print a month
  // that is not in the data.
  assert.equal(formatDate("2026"), "2026");
  assert.equal(formatDate("2025"), "2025");
});

test("yearRange marks an open-ended range as now", () => {
  assert.equal(yearRange("2025-01-15", undefined), "2025—now");
  assert.equal(yearRange("2022-01-01", "2024-01-01"), "2022—2024");
});

test("yearRange returns undefined when the start is unusable", () => {
  assert.equal(yearRange("nope", "also nope"), undefined);
});

test("yearRange still reads a bare year on either end", () => {
  assert.equal(yearRange("2022", "2024"), "2022—2024");
  assert.equal(yearRange("2022", undefined), "2022—now");
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

test("joinRoles returns nothing when there are no roles", () => {
  assert.equal(joinRoles([], 46), "");
});

test("joinRoles separates roles with a middot", () => {
  assert.equal(
    joinRoles(["Full Stack Web Developer", "Data Scientist"], 46),
    "Full Stack Web Developer · Data Scientist",
  );
});

test("joinRoles stops before it runs past the budget", () => {
  const roles = ["Full Stack Web Developer", "Data Scientist", "Data Analyst", "ML Engineer"];
  const joined = joinRoles(roles, 46);
  assert.ok(joined.length <= 46, `"${joined}" is ${joined.length} chars`);
  assert.equal(joined, "Full Stack Web Developer · Data Scientist");
});

test("joinRoles keeps the first role even when it alone overflows", () => {
  const joined = joinRoles(["Machine Learning Infrastructure Engineer", "Data Analyst"], 20);
  assert.ok(joined.startsWith("Machine"), joined);
  assert.ok(joined.endsWith("…"), joined);
  assert.ok(!joined.includes("·"), joined);
});

test("introLines reports no lines for empty text so the caller can fall back", () => {
  assert.deepEqual(introLines("").lines, []);
  assert.deepEqual(introLines("   \n  \n ").lines, []);
});

test("introLines splits on newlines and trims each line", () => {
  assert.deepEqual(
    introLines("hi, i'm dimas \n  i build apps\n\nand turn data").lines,
    ["hi, i'm dimas", "i build apps", "and turn data"],
  );
});

test("introLines drops everything past the fourth line", () => {
  assert.deepEqual(introLines("a\nb\nc\nd\ne").lines, ["a", "b", "c", "d"]);
});

test("introLines keeps display size while every line stays short", () => {
  assert.equal(introLines("hi, i'm dimas\ni build apps").size, "display");
  assert.equal(introLines("thirteen char").size, "display");
});

test("introLines steps down a size once a line runs long", () => {
  assert.equal(introLines("halo, saya dimas,\nsaya bangun web").size, "h1Big");
});
