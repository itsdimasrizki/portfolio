import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Skill } from "@/types/skill";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

const S = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  card: {
    width: "47.5%",
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: typography.h4,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
  },
  cardDesc: {
    fontSize: typography.small,
    color: colors.body,
    lineHeight: 1.55,
  },
});

type SkillsPageProps = { skills: Skill[]; settings: SanitySettings };

export function SkillsPage({ skills, settings }: SkillsPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" orientation="portrait" style={shell.page}>
      <PageHeader section="Skills" name={fullName} />
      <SectionHeading label="Core Competencies" title="Skills" />

      <View style={S.grid}>
        {skills.map((skill) => (
          <View key={skill.title} style={S.card} wrap={false}>
            <View style={S.cardHeader}>
              <View style={S.dot} />
              <Text style={S.cardTitle}>{skill.title}</Text>
            </View>
            {skill.description ? (
              <Text style={S.cardDesc}>{skill.description}</Text>
            ) : null}
          </View>
        ))}
      </View>

      <PageFooter name={fullName} />
    </Page>
  );
}
