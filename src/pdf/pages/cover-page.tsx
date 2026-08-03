import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

function truncateUrl(url: string, max = 38): string {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

const S = StyleSheet.create({
  page: {
    backgroundColor: colors.coverBg,
    fontFamily: typography.fontFamily,
    position: "relative",
  },

  // ── Left sidebar ──────────────────────────────────────────────
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.primary,
  },

  // ── Top tag strip ─────────────────────────────────────────────
  topTag: {
    position: "absolute",
    top: 44,
    left: spacing.pageMarginH,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  tagText: {
    fontSize: typography.tiny,
    color: colors.primary,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },

  // ── Hero block (vertically centered ~40% from top) ─────────────
  hero: {
    position: "absolute",
    top: 190,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
  },
  name: {
    fontSize: 34,
    color: colors.coverText,
    fontFamily: typography.fontFamilyBold,
    letterSpacing: 0.3,
    lineHeight: 1.15,
  },
  ruleLine: {
    width: 48,
    height: 3,
    backgroundColor: colors.primary,
    marginTop: 16,
    marginBottom: 16,
  },
  role: {
    fontSize: typography.body,
    color: colors.muted,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },

  // ── Contact card block ────────────────────────────────────────
  contactCard: {
    position: "absolute",
    bottom: 80,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    backgroundColor: "#131f2e",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: 18,
  },
  contactCardTitle: {
    fontSize: typography.tiny,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  contactItem: {
    width: "47%",
    marginBottom: 4,
  },
  contactLabel: {
    fontSize: typography.tiny - 1,
    color: colors.muted,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactValue: {
    fontSize: typography.small,
    color: "#e2e8f0",
  },

  // ── Footer ────────────────────────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: typography.tiny - 1,
    color: "#334155",
  },
});

type CoverPageProps = {
  settings: SanitySettings;
};

export function CoverPage({ settings }: CoverPageProps) {
  const fullName = settings.fullName ?? "Portfolio";
  const role = settings.role ?? "Software Engineer";

  const contacts = [
    { label: "Email",    value: settings.email },
    { label: "Phone",    value: settings.phone },
    { label: "Location", value: settings.location },
    { label: "LinkedIn", value: settings.linkedinUrl ? truncateUrl(settings.linkedinUrl) : undefined },
    { label: "GitHub",   value: settings.githubUrl ? truncateUrl(settings.githubUrl) : undefined },
    { label: "Website",  value: settings.portfolioUrl ? truncateUrl(settings.portfolioUrl) : undefined },
  ].filter((c): c is { label: string; value: string } => Boolean(c.value));

  return (
    <Page size="A4" style={S.page}>
      {/* Left sidebar stripe */}
      <View style={S.sidebar} />

      {/* Top tag */}
      <View style={S.topTag}>
        <View style={S.tagDot} />
        <Text style={S.tagText}>Portfolio</Text>
      </View>

      {/* Hero: name + rule + role */}
      <View style={S.hero}>
        <Text style={S.name}>{fullName}</Text>
        <View style={S.ruleLine} />
        <Text style={S.role}>{role}</Text>
      </View>

      {/* Contact card */}
      {contacts.length > 0 && (
        <View style={S.contactCard}>
          <Text style={S.contactCardTitle}>Contact</Text>
          <View style={S.contactRow}>
            {contacts.map((item) => (
              <View key={item.label} style={S.contactItem}>
                <Text style={S.contactLabel}>{item.label}</Text>
                <Text style={S.contactValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer */}
      <View style={S.pageFooter}>
        <Text style={S.footerText}>Auto-generated · Sanity CMS</Text>
        <Text style={S.footerText}>{new Date().getFullYear()}</Text>
      </View>
    </Page>
  );
}
