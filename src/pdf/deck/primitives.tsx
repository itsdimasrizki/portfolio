import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { colors, SLIDE, type } from "./theme";
import { pad2 } from "./layout";

export type Tone = "bone" | "paper" | "blue" | "ink" | "orange";

const BG: Record<Tone, string> = {
  bone: colors.bone, paper: colors.paper, blue: colors.blue,
  ink: colors.ink, orange: colors.orange,
};
const FG: Record<Tone, string> = {
  bone: colors.ink, paper: colors.ink, blue: colors.bone,
  ink: colors.bone, orange: colors.ink,
};
const MUTED: Record<Tone, string> = {
  bone: colors.muted, paper: colors.muted, blue: colors.mutedOn,
  ink: "#7A786F", orange: "#8A3E22",
};

export function fgOn(tone: Tone): string { return FG[tone]; }
export function mutedOn(tone: Tone): string { return MUTED[tone]; }
export function bgOn(tone: Tone): string { return BG[tone]; }

/**
 * Satu slide = satu Page. Dekorasi (mis. BleedCircle) dilewatkan lewat prop
 * `decoration`, dirender di lapisan absolute page-sized yang overflow:hidden,
 * terpisah dari children ber-padding — supaya offset negatifnya tidak pernah
 * ikut dihitung ke content box yang dipakai react-pdf untuk pagination.
 */
export function Slide({
  tone = "bone", padded = true, decoration, children,
}: {
  tone?: Tone; padded?: boolean;
  decoration?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <Page size={[SLIDE.w, SLIDE.h]} style={{ backgroundColor: BG[tone] }}>
      {decoration && (
        <View style={{
          position: "absolute", top: 0, left: 0,
          width: SLIDE.w, height: SLIDE.h, overflow: "hidden",
        }}>
          {decoration}
        </View>
      )}
      <View style={{
        height: SLIDE.h,
        paddingHorizontal: padded ? SLIDE.mx : 0,
        paddingVertical: padded ? SLIDE.my : 0,
      }}>
        {children}
      </View>
    </Page>
  );
}

export function SlideNumber({ tone = "bone" }: { tone?: Tone }) {
  return (
    <Text
      fixed
      style={{ ...type.micro, color: mutedOn(tone) }}
      render={({ pageNumber, totalPages }) => `${pad2(pageNumber)} / ${totalPages}`}
    />
  );
}

export function SlideHeader({
  eyebrow, tone = "bone", rule = true,
}: { eyebrow: string; tone?: Tone; rule?: boolean }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Text style={{ ...type.micro, color: fgOn(tone) }}>{eyebrow}</Text>
        <SlideNumber tone={tone} />
      </View>
      {rule && <View style={{ height: 1.5, backgroundColor: fgOn(tone), marginTop: 8 }} />}
    </View>
  );
}

type BigSize = "hero" | "display" | "h1Big" | "h1";

export function BigType({
  lines, size = "hero", color, accentColor, accentLast = false, style,
}: {
  lines: string[]; size?: BigSize; color: string;
  accentColor?: string; accentLast?: boolean; style?: React.ComponentProps<typeof View>["style"];
}) {
  const containerStyle = [
    { paddingBottom: size === "hero" ? 22 : 0 },
    style,
  ] as React.ComponentProps<typeof View>["style"];
  return (
    <View style={containerStyle}>
      {lines.map((line, i) => (
        <Text
          key={`${line}-${i}`}
          style={{ ...type[size], color: accentLast && i === lines.length - 1 ? (accentColor ?? color) : color }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

export type ChipVariant = "outline" | "blue" | "orange" | "ink";

export function Chip({
  label, variant = "outline", tone = "bone",
}: { label: string; variant?: ChipVariant; tone?: Tone }) {
  const skin = {
    outline: { bg: "transparent", fg: fgOn(tone), border: fgOn(tone) },
    blue: { bg: colors.blue, fg: colors.bone, border: colors.blue },
    orange: { bg: colors.orange, fg: colors.ink, border: colors.orange },
    ink: { bg: colors.ink, fg: colors.bone, border: colors.ink },
  }[variant];
  return (
    <View style={{
      borderWidth: 1, borderColor: skin.border, backgroundColor: skin.bg,
      paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6,
    }}>
      <Text style={{ ...type.small, fontWeight: 500, color: skin.fg }}>{label}</Text>
    </View>
  );
}

function chipVariant(i: number): ChipVariant {
  if (i !== 0 && i % 5 === 0) return "blue";
  if (i !== 0 && i % 7 === 0) return "orange";
  return "outline";
}

export function ChipRow({
  labels, max, tone = "bone", pattern = true,
}: { labels: string[]; max: number; tone?: Tone; pattern?: boolean }) {
  const shown = labels.slice(0, max);
  const rest = labels.length - shown.length;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {shown.map((label, i) => (
        <Chip key={`${label}-${i}`} label={label} tone={tone}
              variant={pattern ? chipVariant(i) : "outline"} />
      ))}
      {rest > 0 && <Chip label={`+${rest}`} tone={tone} variant="ink" />}
    </View>
  );
}

/** Progress bar dari kotak diskrit — bukan bar mulus. */
export function PixelBar({
  value, fill = colors.blue, empty = "#D9D7D0", cells = 20, width = 380, cellH = 8,
}: { value: number; fill?: string; empty?: string; cells?: number; width?: number; cellH?: number }) {
  const gap = 2;
  const cw = (width - gap * (cells - 1)) / cells;
  const filled = Math.max(1, Math.min(cells, Math.round(value * cells)));
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: cells }, (_, i) => (
        <View key={i} style={{
          width: cw, height: cellH, marginRight: i < cells - 1 ? gap : 0,
          backgroundColor: i < filled ? fill : empty,
        }} />
      ))}
    </View>
  );
}

export function PixelRule({
  width, color = colors.ink, size = 3, gap = 3,
}: { width: number; color?: string; size?: number; gap?: number }) {
  const n = Math.floor(width / (size + gap));
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={{ width: size, height: size, marginRight: gap, backgroundColor: color }} />
      ))}
    </View>
  );
}

/**
 * Gradient palsu dari kisi kotak — react-pdf tidak punya gradient CSS.
 * Ukuran kotak dinaikkan otomatis agar total kotak tidak melebihi ~1200,
 * karena ribuan View membuat render melambat drastis.
 */
export function Dither({
  width, height, color = colors.ink, cell = 8, from = 0.3, to = 0.02, invert = false,
}: {
  width: number; height: number; color?: string;
  cell?: number; from?: number; to?: number; invert?: boolean;
}) {
  const size = Math.max(cell, Math.ceil(Math.sqrt((width * height) / 1200)));
  const cols = Math.max(1, Math.floor(width / size));
  const rows = Math.max(1, Math.floor(height / size));
  return (
    <View style={{ width, height, overflow: "hidden" }}>
      {Array.from({ length: rows }, (_, r) => {
        const t = rows === 1 ? 0 : r / (rows - 1);
        const p = invert ? 1 - t : t;
        const opacity = from + (to - from) * p;
        return (
          <View key={r} style={{ flexDirection: "row" }}>
            {Array.from({ length: cols }, (_, c) => (
              <View key={c} style={{
                width: size, height: size, backgroundColor: color,
                opacity: (r + c) % 2 === 0 ? opacity : opacity * 0.35,
              }} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

export type Corner = "tl" | "tr" | "bl" | "br";

export function BleedCircle({
  size, color, corner, dx = 0, dy = 0,
}: { size: number; color: string; corner: Corner; dx?: number; dy?: number }) {
  const off = -Math.round(size * 0.38);
  const pos: Record<string, number> = {};
  if (corner === "tl") { pos.left = off + dx; pos.top = off + dy; }
  if (corner === "tr") { pos.right = off - dx; pos.top = off + dy; }
  if (corner === "bl") { pos.left = off + dx; pos.bottom = off - dy; }
  if (corner === "br") { pos.right = off - dx; pos.bottom = off - dy; }
  return (
    <View style={{
      position: "absolute", width: size, height: size,
      borderRadius: size / 2, backgroundColor: color, ...pos,
    }} />
  );
}

export function PhotoFrame({
  src, width, height, caption, dashed = true, tone = "bone",
}: {
  src?: string; width: number; height: number;
  caption?: string; dashed?: boolean; tone?: Tone;
}) {
  return (
    <View style={{ width }}>
      <View style={{
        width, height, overflow: "hidden", backgroundColor: colors.paper,
        borderWidth: dashed ? 1 : 0, borderColor: mutedOn(tone), borderStyle: "dashed",
      }}>
        {src
          ? <Image src={src} style={{ width, height, objectFit: "cover" }} />
          : <Dither width={width} height={height} />}
      </View>
      {caption && (
        <View style={{
          backgroundColor: colors.ink, alignSelf: "flex-start",
          paddingHorizontal: 10, paddingVertical: 6,
        }}>
          <Text style={{ ...type.micro, color: colors.bone }}>{caption}</Text>
        </View>
      )}
    </View>
  );
}

export function StatCard({
  value, label, tone = "paper", width, height, size = "stat2",
  dither = false, valueColor,
}: {
  value: string; label: string; tone?: Tone; width: number;
  height: number; size?: "stat" | "stat2"; dither?: boolean; valueColor?: string;
}) {
  return (
    <View style={{
      width, height, backgroundColor: BG[tone], padding: 20, justifyContent: "flex-end",
    }}>
      {dither && (
        <View style={{ position: "absolute", right: 0, top: 0 }}>
          <Dither width={Math.round(width * 0.5)} height={Math.round(height * 0.4)}
                  color={fgOn(tone)} invert />
        </View>
      )}
      <Text style={{ ...type[size], color: valueColor ?? fgOn(tone) }}>{value}</Text>
      <Text style={{ ...type.small, color: mutedOn(tone), marginTop: 8 }}>{label}</Text>
    </View>
  );
}
