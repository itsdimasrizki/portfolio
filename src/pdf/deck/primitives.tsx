/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { colors, SLIDE, type } from "./theme";
import { pad2 } from "./layout";

export type Tone = "obsidian" | "subtle" | "elevated" | "card" | "accent";

const BG: Record<Tone, string> = {
  obsidian: colors.bg,
  subtle:   colors.surfaceSubtle,
  elevated: colors.surfaceElevated,
  card:     colors.card,
  accent:   colors.accent,
};
const FG: Record<Tone, string> = {
  obsidian: colors.fg,
  subtle:   colors.fg,
  elevated: colors.fg,
  card:     colors.fg,
  accent:   colors.bg,
};
const MUTED: Record<Tone, string> = {
  obsidian: colors.fgMuted,
  subtle:   colors.fgSecondary,
  elevated: colors.fgSecondary,
  card:     colors.fgSecondary,
  accent:   "#4a3c16",
};

export function fgOn(tone: Tone): string { return FG[tone]; }
export function mutedOn(tone: Tone): string { return MUTED[tone]; }
export function bgOn(tone: Tone): string { return BG[tone]; }

/**
 * Satu slide = satu Page. Dekorasi diletakkan di lapisan absolute
 * overflow:hidden terpisah dari children agar tidak mengganggu layout.
 */
export function Slide({
  tone = "obsidian", padded = true, decoration, children,
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

export function SlideNumber({ tone = "obsidian" }: { tone?: Tone }) {
  return (
    <Text
      fixed
      style={{ ...type.micro, color: mutedOn(tone) }}
      render={({ pageNumber, totalPages }) => `${pad2(pageNumber)} / ${totalPages}`}
    />
  );
}

/**
 * Header slide mengikuti komponen SectionHeader di web:
 * kotak aksen amber 6x6 + eyebrow + nomor slide + 1px hairline border.
 */
export function SlideHeader({
  eyebrow, tone = "obsidian", rule = true,
}: { eyebrow: string; tone?: Tone; rule?: boolean }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{
            width: 6, height: 6,
            backgroundColor: tone === "accent" ? colors.bg : colors.accent,
            marginRight: 8,
          }} />
          <Text style={{
            ...type.micro,
            color: tone === "accent" ? colors.bg : colors.fgSecondary,
            textTransform: "uppercase",
          }}>
            {eyebrow}
          </Text>
        </View>
        <SlideNumber tone={tone} />
      </View>
      {rule && (
        <View style={{
          height: 1,
          backgroundColor: tone === "accent" ? colors.bg : colors.border,
          marginTop: 10,
        }} />
      )}
    </View>
  );
}

type BigSize = "hero" | "display" | "h1Big" | "h1";

export function BigType({
  lines, size = "hero", color, accentColor, accentLast = false, style,
}: {
  lines: string[]; size?: BigSize; color?: string;
  accentColor?: string; accentLast?: boolean; style?: React.ComponentProps<typeof View>["style"];
}) {
  const baseColor = color ?? colors.fg;
  const containerStyle = [
    { paddingBottom: size === "hero" ? 16 : 0 },
    style,
  ] as React.ComponentProps<typeof View>["style"];
  return (
    <View style={containerStyle}>
      {lines.map((line, i) => (
        <Text
          key={`${line}-${i}`}
          style={{
            ...type[size],
            color: accentLast && i === lines.length - 1 ? (accentColor ?? colors.accent) : baseColor,
          }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}

export type ChipVariant = "outline" | "accent" | "solid" | "dark";

export function Chip({
  label, variant = "outline",
}: { label: string; variant?: ChipVariant }) {
  const skin = {
    outline: { bg: colors.secondary, fg: colors.fgSecondary, border: colors.borderContrast },
    accent:  { bg: colors.accentSoft, fg: colors.accent, border: colors.accentBorder },
    solid:   { bg: colors.accent, fg: colors.bg, border: colors.accent },
    dark:    { bg: colors.card, fg: colors.fg, border: colors.borderContrast },
  }[variant];
  return (
    <View style={{
      borderWidth: 1, borderColor: skin.border, backgroundColor: skin.bg,
      borderRadius: 4,
      paddingHorizontal: 8, paddingVertical: 4, marginRight: 6, marginBottom: 6,
    }}>
      <Text style={{ ...type.small, fontWeight: 500, color: skin.fg }}>{label}</Text>
    </View>
  );
}

export function ChipRow({
  labels, max, accentFirst = false,
}: { labels: string[]; max: number; accentFirst?: boolean }) {
  const shown = labels.slice(0, max);
  const rest = labels.length - shown.length;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {shown.map((label, i) => (
        <Chip
          key={`${label}-${i}`}
          label={label}
          variant={accentFirst && i === 0 ? "accent" : "outline"}
        />
      ))}
      {rest > 0 && <Chip label={`+${rest}`} variant="accent" />}
    </View>
  );
}

/** Progress bar diskrit bergaya hardware terminal web. */
export function PixelBar({
  value, fill = colors.accent, empty = colors.border, cells = 20, width = 380, cellH = 7,
}: { value: number; fill?: string; empty?: string; cells?: number; width?: number; cellH?: number }) {
  const gap = 2;
  const cw = (width - gap * (cells - 1)) / cells;
  const filled = Math.max(1, Math.min(cells, Math.round(value * cells)));
  return (
    <View style={{ flexDirection: "row" }}>
      {Array.from({ length: cells }, (_, i) => (
        <View key={i} style={{
          width: cw, height: cellH, marginRight: i < cells - 1 ? gap : 0,
          borderRadius: 1,
          backgroundColor: i < filled ? fill : empty,
        }} />
      ))}
    </View>
  );
}

export function HairlineRule({
  width, color = colors.border,
}: { width?: number | string; color?: string }) {
  return (
    <View style={{ width: width ?? "100%", height: 1, backgroundColor: color }} />
  );
}

export type Corner = "tl" | "tr" | "bl" | "br";

/**
 * Cincin orbital halus terinspirasi dari backdrop orbital hero di web.
 * Menggunakan border 1px gelap agar tidak pernah mencuri fokus teks.
 */
export function OrbitalRing({
  size, corner, dx = 0, dy = 0, color = colors.border,
}: { size: number; corner: Corner; dx?: number; dy?: number; color?: string }) {
  const off = -Math.round(size * 0.36);
  const pos: Record<string, number> = {};
  if (corner === "tl") { pos.left = off + dx; pos.top = off + dy; }
  if (corner === "tr") { pos.right = off - dx; pos.top = off + dy; }
  if (corner === "bl") { pos.left = off + dx; pos.bottom = off - dy; }
  if (corner === "br") { pos.right = off - dx; pos.bottom = off - dy; }
  return (
    <View style={{
      position: "absolute", width: size, height: size,
      borderRadius: size / 2,
      borderWidth: 1, borderColor: color,
      backgroundColor: colors.surfaceSubtle,
      opacity: 0.7,
      ...pos,
    }} />
  );
}

export function StatusPill({
  label, dotColor = colors.emerald,
}: { label: string; dotColor?: string }) {
  return (
    <View style={{
      flexDirection: "row", alignItems: "center", alignSelf: "flex-start",
      borderWidth: 1, borderColor: colors.borderContrast,
      backgroundColor: colors.card, borderRadius: 6,
      paddingHorizontal: 10, paddingVertical: 5,
    }}>
      <View style={{
        width: 6, height: 6, borderRadius: 3,
        backgroundColor: dotColor, marginRight: 7,
      }} />
      <Text style={{ ...type.small, fontWeight: 500, color: colors.fgSecondary }}>
        {label}
      </Text>
    </View>
  );
}

export function PhotoFrame({
  src, width, height, caption, borderless = false,
}: {
  src?: string; width: number; height: number;
  caption?: string; borderless?: boolean;
}) {
  return (
    <View style={{ width }}>
      <View style={{
        width, height, overflow: "hidden",
        borderRadius: 10,
        backgroundColor: borderless ? "transparent" : colors.card,
        borderWidth: borderless ? 0 : 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
      }}>
        {src ? (
          <Image
            src={src}
            style={{ width, height, objectFit: borderless ? "contain" : "cover" }}
          />
        ) : (
          <Text style={{ ...type.micro, color: colors.fgMuted }}>[PORTRAIT]</Text>
        )}
      </View>
      {caption && (
        <View style={{
          marginTop: 8,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 6,
          alignSelf: "flex-start",
          paddingHorizontal: 10,
          paddingVertical: 5,
          flexDirection: "row",
          alignItems: "center",
        }}>
          <View style={{
            width: 5, height: 5, borderRadius: 2.5,
            backgroundColor: colors.accent, marginRight: 6,
          }} />
          <Text style={{ ...type.micro, color: colors.fgSecondary }}>{caption}</Text>
        </View>
      )}
    </View>
  );
}

export function StatCard({
  value, label, tone = "card", width, height, size = "stat2",
  valueColor, accentBorder = false,
}: {
  value: string; label: string; tone?: Tone; width: number;
  height: number; size?: "stat" | "stat2"; valueColor?: string; accentBorder?: boolean;
}) {
  return (
    <View style={{
      width, height,
      backgroundColor: BG[tone],
      borderWidth: 1,
      borderColor: accentBorder ? colors.accentBorder : colors.border,
      borderRadius: 10,
      padding: 20,
      justifyContent: "flex-end",
    }}>
      <Text style={{ ...type[size], color: valueColor ?? fgOn(tone) }}>{value}</Text>
      <Text style={{ ...type.small, color: mutedOn(tone), marginTop: 8 }}>{label}</Text>
    </View>
  );
}
