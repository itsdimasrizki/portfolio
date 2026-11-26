import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_ABOUT_PORTRAIT,
  DEFAULT_HERO_PORTRAIT,
  resolvePortrait,
} from "../../src/lib/portraits.ts";

test("resolvePortrait falls back to local cutouts with true intrinsic dimensions", () => {
  assert.deepEqual(resolvePortrait(null, DEFAULT_HERO_PORTRAIT), {
    url: "/assets/dimas-pointing.png",
    width: 666,
    height: 375,
  });
  assert.deepEqual(resolvePortrait(undefined, DEFAULT_ABOUT_PORTRAIT), {
    url: "/assets/dimas-about.png",
    width: 375,
    height: 666,
  });
});

test("resolvePortrait returns Sanity CDN metadata when valid image is provided", () => {
  const remote = {
    url: "https://cdn.sanity.io/images/demo/production/hero.png",
    width: 800,
    height: 900,
  };
  assert.deepEqual(resolvePortrait(remote, DEFAULT_HERO_PORTRAIT), remote);
});

test("resolvePortrait preserves fallback dimensions when Sanity metadata omits them", () => {
  assert.deepEqual(
    resolvePortrait({ url: "https://cdn.sanity.io/images/demo/hero.png" }, DEFAULT_HERO_PORTRAIT),
    {
      url: "https://cdn.sanity.io/images/demo/hero.png",
      width: 666,
      height: 375,
    }
  );
});
