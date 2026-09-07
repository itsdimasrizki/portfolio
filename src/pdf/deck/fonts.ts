/**
 * Registrasi font deck. Dijalankan sekali saat modul diimpor.
 * Bila file font tidak ada (mis. tidak ikut ter-bundle di serverless), deck
 * jatuh ke Helvetica supaya endpoint tetap mengembalikan PDF, bukan 500.
 */
import fs from "node:fs";
import path from "node:path";
import { Font } from "@react-pdf/renderer";

const DIR = path.join(process.cwd(), "public", "fonts");

function file(name: string): string {
  const full = path.join(DIR, name);
  fs.accessSync(full, fs.constants.R_OK);
  return full;
}

let ok = false;

try {
  Font.register({
    family: "SpaceGrotesk",
    fonts: [
      { src: file("SpaceGrotesk-Regular.ttf"), fontWeight: 400 },
      { src: file("SpaceGrotesk-Medium.ttf"), fontWeight: 500 },
      { src: file("SpaceGrotesk-Bold.ttf"), fontWeight: 700 },
    ],
  });
  Font.register({
    family: "Silkscreen",
    fonts: [{ src: file("Silkscreen-Regular.ttf"), fontWeight: 400 }],
  });
  // Tipografi brutalist tidak boleh dipenggal tanda hubung.
  Font.registerHyphenationCallback((word) => [word]);
  ok = true;
} catch (error) {
  console.error("[deck] font registration failed, falling back to Helvetica:", error);
}

export const FONTS_OK = ok;
export const DISPLAY = ok ? "SpaceGrotesk" : "Helvetica";
export const PIXEL = ok ? "Silkscreen" : "Courier";
