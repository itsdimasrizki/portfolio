import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

function truncateUrl(url: string, max = 40): string {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

const S = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    fontFamily: typography.fontFamily,
    position: "relative",
  },

  // ── Top Teal Header Banner ──────────────────────────────────────
  banner: {
    height: 180,
    backgroundColor: colors.bannerBg,
    paddingHorizontal: spacing.pageMarginH,
    paddingTop: 40,
    paddingBottom: 30,
    justifyContent: "space-between",
  },
  bannerTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bannerTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.bannerMuted,
  },
  bannerTagText: {
    fontSize: typography.micro,
    color: colors.bannerMuted,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  name: {
    fontSize: 32,
    color: colors.bannerText,
    fontFamily: typography.fontFamilyBold,
    letterSpacing: 0.3,
    lineHeight: 1.15,
  },
  role: {
    fontSize: typography.body,
    color: colors.bannerMuted,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginTop: 4,
  },

  // ── Main Body (White) ──────────────────────────────────────────
  body: {
    paddingHorizontal: spacing.pageMarginH,
    paddingTop: 32,
    paddingBottom: 60,
  },

  // ── Summary / Introduction Box ────────────────────────────────
  introBox: {
    backgroundColor: colors.primaryBg,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: 16,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: typography.micro,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 6,
  },
  introText: {
    fontSize: typography.body,
    color: colors.body,
    lineHeight: 1.6,
  },

  // ── Highlights Row ────────────────────────────────────────────
  highlightsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  highlightLabel: {
    fontSize: typography.micro,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  highlightVal: {
    fontSize: typography.small,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
  },

  // ── Contact Section ───────────────────────────────────────────
  sectionLabel: {
    fontSize: typography.micro,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 12,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  contactCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  contactLabel: {
    fontSize: typography.micro,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: typography.small,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
  },

  // ── Page Footer ───────────────────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerText: {
    fontSize: typography.micro,
    color: colors.muted,
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
    <Page size="A4" orientation="portrait" style={S.page}>
      {/* Top Banner */}
      <View style={S.banner}>
        <View style={S.bannerTag}>
          <View style={S.bannerTagDot} />
          <Text style={S.bannerTagText}>Personal Portfolio</Text>
        </View>
        <View>
          <Text style={S.name}>{fullName}</Text>
          <Text style={S.role}>{role}</Text>
        </View>
      </View>

      {/* Main Body */}
      <View style={S.body}>
        {/* Intro */}
        <View style={S.introBox}>
          <Text style={S.introTitle}>Welcome</Text>
          <Text style={S.introText}>
            Comprehensive overview of professional experience, featured software engineering projects, technical stack, skills, and verified credentials.
          </Text>
        </View>

        {/* Quick Highlights */}
        <View style={S.highlightsRow}>
          <View style={S.highlightCard}>
            <Text style={S.highlightLabel}>Primary Focus</Text>
            <Text style={S.highlightVal}>Fullstack Engineering</Text>
          </View>
          <View style={S.highlightCard}>
            <Text style={S.highlightLabel}>Status</Text>
            <Text style={S.highlightVal}>Open to Work</Text>
          </View>
          <View style={S.highlightCard}>
            <Text style={S.highlightLabel}>Document</Text>
            <Text style={S.highlightVal}>Portfolio Book</Text>
          </View>
        </View>

        {/* Contact Info */}
        {contacts.length > 0 && (
          <View>
            <Text style={S.sectionLabel}>Contact Information</Text>
            <View style={S.contactGrid}>
              {contacts.map((item) => (
                <View key={item.label} style={S.contactCard}>
                  <Text style={S.contactLabel}>{item.label}</Text>
                  <Text style={S.contactValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={S.pageFooter}>
        <Text style={S.footerText}>Generated from Sanity CMS</Text>
        <Text style={S.footerText}>{new Date().getFullYear()} · Portfolio Document</Text>
      </View>
    </Page>
  );
}
