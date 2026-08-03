import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Skill } from "@/types/skill";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    fontFamily: typography.fontFamily,
    paddingHorizontal: spacing.pageMarginH,
    paddingVertical: spacing.pageMarginV,
  },
  eyebrow: {
    fontSize: typography.tiny,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },
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
    marginBottom: 20,
  },
  // 2-column grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.cardPad,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  cardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  cardTitle: {
    fontSize: typography.h4,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
  },
  cardDescription: {
    fontSize: typography.small,
    color: colors.secondary,
    lineHeight: 1.55,
  },
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

type SkillsPageProps = {
  skills: Skill[];
  settings: SanitySettings;
};

export function SkillsPage({ skills, settings }: SkillsPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.eyebrow}>Skills</Text>
      <View style={styles.divider} />
      <Text style={styles.heading}>Core Skills</Text>

      <View style={styles.grid}>
        {skills.map((skill) => (
          <View key={skill.title} style={styles.card} wrap={false}>
            <View style={styles.cardHeader}>
              <View style={styles.cardDot} />
              <Text style={styles.cardTitle}>{skill.title}</Text>
            </View>
            {skill.description && (
              <Text style={styles.cardDescription}>{skill.description}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.pageFooter} fixed>
        <Text style={styles.footerText}>{fullName}</Text>
        <Text
          style={styles.footerText}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </View>
    </Page>
  );
}
