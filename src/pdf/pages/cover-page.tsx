import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.coverBg,
    fontFamily: typography.fontFamily,
  },
  // Left accent bar
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: colors.coverAccent,
  },
  // Top decorative strip
  topStrip: {
    width: "100%",
    height: 3,
    backgroundColor: colors.coverAccent,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.pageMarginH,
    paddingVertical: 72,
    justifyContent: "space-between",
  },
  // Header area
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coverAccent,
  },
  headerLabel: {
    fontSize: typography.small,
    color: colors.coverAccent,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  // Hero area
  heroSection: {
    marginTop: 60,
  },
  name: {
    fontSize: 38,
    color: colors.coverText,
    fontFamily: typography.fontFamilyBold,
    letterSpacing: 0.5,
    lineHeight: 1.15,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: colors.coverAccent,
    marginTop: 18,
    marginBottom: 18,
  },
  role: {
    fontSize: typography.h2,
    color: colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // Contact grid
  contactSection: {
    marginTop: 48,
  },
  contactGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  contactItem: {
    width: "45%",
  },
  contactLabel: {
    fontSize: typography.tiny,
    color: colors.coverAccent,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 3,
  },
  contactValue: {
    fontSize: typography.small,
    color: colors.coverText,
  },
  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: typography.tiny,
    color: colors.muted,
  },
  footerRight: {
    fontSize: typography.tiny,
    color: colors.coverAccent,
  },
});

type CoverPageProps = {
  settings: SanitySettings;
};

export function CoverPage({ settings }: CoverPageProps) {
  const fullName = settings.fullName ?? "Portfolio";
  const role = settings.role ?? "Software Engineer";

  const contacts = [
    { label: "Email", value: settings.email },
    { label: "Phone", value: settings.phone },
    { label: "Location", value: settings.location },
    { label: "LinkedIn", value: settings.linkedinUrl?.replace("https://linkedin.com/in/", "@") },
    { label: "GitHub", value: settings.githubUrl?.replace("https://github.com/", "@") },
    { label: "Website", value: settings.portfolioUrl?.replace("https://", "") },
  ].filter((c) => c.value);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.accentBar} />
      <View style={styles.topStrip} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.dot} />
          <Text style={styles.headerLabel}>Portfolio</Text>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.name}>{fullName}</Text>
          <View style={styles.divider} />
          <Text style={styles.role}>{role}</Text>

          {/* Contact Info */}
          <View style={styles.contactSection}>
            <View style={styles.contactGrid}>
              {contacts.map((item) => (
                <View key={item.label} style={styles.contactItem}>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Generated automatically from Sanity CMS</Text>
          <Text style={styles.footerRight}>{new Date().getFullYear()}</Text>
        </View>
      </View>
    </Page>
  );
}
