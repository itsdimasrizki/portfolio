import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    fontFamily: typography.fontFamily,
    paddingHorizontal: spacing.pageMarginH,
    paddingVertical: spacing.pageMarginV,
  },
  // Section label
  eyebrow: {
    fontSize: typography.tiny,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
  // Divider
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginBottom: 20,
  },
  heading: {
    fontSize: typography.h1,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 6,
    lineHeight: 1.2,
  },
  subheading: {
    fontSize: typography.body,
    color: colors.secondary,
    marginBottom: 24,
  },
  // Bio text
  bioBox: {
    backgroundColor: colors.accent,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.cardPad,
    borderRadius: 4,
  },
  bioText: {
    fontSize: typography.body,
    color: colors.foreground,
    lineHeight: 1.7,
  },
  // Fallback bio paragraphs
  paragraph: {
    fontSize: typography.body,
    color: colors.foreground,
    lineHeight: 1.7,
    marginBottom: 10,
  },
  // Page footer
  pageFooter: {
    position: "absolute",
    bottom: 28,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  footerText: {
    fontSize: typography.tiny,
    color: colors.muted,
  },
});

const FALLBACK_BIO = `I don't believe software should exist simply because it can be built. Every project I take on starts with one question: What problem does this actually solve?

That mindset has shaped the way I learn and build. From web development and backend systems to IoT and machine learning, I enjoy turning ideas into practical solutions that people can actually use.

Outside the classroom, I've had the opportunity to mentor students while also serving in student organizations. Those experiences taught me that writing code is only one part of engineering — communicating ideas, collaborating with others, and leading a team are equally important.

I aim to become a software engineer who builds technology that is reliable, scalable, and designed with purpose.`;

type AboutPageProps = {
  settings: SanitySettings;
};

export function AboutPage({ settings }: AboutPageProps) {
  const fullName = settings.fullName ?? "Portfolio";
  const bio = settings.bio ?? FALLBACK_BIO;

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>About</Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Professional Summary</Text>
      <Text style={styles.subheading}>{fullName}</Text>

      <View style={styles.bioBox}>
        <Text style={styles.bioText}>{bio}</Text>
      </View>

      {/* Page footer */}
      <View style={styles.pageFooter} fixed>
        <Text style={styles.footerText}>{fullName}</Text>
        <Text style={styles.footerText} render={({ pageNumber, totalPages }) =>
          `${pageNumber} / ${totalPages}`
        } />
      </View>
    </Page>
  );
}
