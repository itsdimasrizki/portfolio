import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { Experience } from "@/types/experience";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

const S = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 18,
  },
  // Timeline spine
  spine: {
    width: 14,
    alignItems: "center",
    paddingTop: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
  line: {
    width: 1.5,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  // Content
  body: {
    flex: 1,
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  position: {
    fontSize: typography.h4,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    flex: 1,
    paddingRight: 8,
  },
  dateRange: {
    fontSize: typography.tiny,
    color: colors.muted,
    marginTop: 1,
    flexShrink: 0,
  },
  company: {
    fontSize: typography.body,
    color: colors.primary,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 1,
  },
  location: {
    fontSize: typography.tiny,
    color: colors.muted,
    marginBottom: 5,
  },
  description: {
    fontSize: typography.small,
    color: colors.body,
    lineHeight: 1.6,
    marginBottom: 7,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: typography.micro,
    color: colors.secondary,
  },
});

function formatDate(s: string) {
  if (!s || s.toLowerCase() === "present") return "Present";
  try {
    return new Date(s).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch { return s; }
}

type ExperiencePageProps = { experiences: Experience[]; settings: SanitySettings };

export function ExperiencePage({ experiences, settings }: ExperiencePageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  return (
    <Page size="A4" style={shell.page}>
      <PageHeader section="Experience" name={fullName} />
      <SectionHeading label="Work History" title="Experience" />

      {experiences.map((exp, idx) => (
        <View key={exp.id} style={S.item} wrap={false}>
          <View style={S.spine}>
            <View style={S.dot} />
            {idx < experiences.length - 1 && <View style={S.line} />}
          </View>
          <View style={S.body}>
            <View style={S.topRow}>
              <Text style={S.position}>{exp.position}</Text>
              <Text style={S.dateRange}>
                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
              </Text>
            </View>
            <Text style={S.company}>{exp.company}</Text>
            {exp.location ? <Text style={S.location}>{exp.location}</Text> : null}
            {exp.description ? (
              <Text style={S.description}>{exp.description}</Text>
            ) : null}
            {(exp.technologies ?? []).length > 0 && (
              <View style={S.tagRow}>
                {(exp.technologies ?? []).map((t) => (
                  <View key={t} style={S.tag}>
                    <Text style={S.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      ))}

      <PageFooter name={fullName} />
    </Page>
  );
}
