import React from "react";
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

const S = StyleSheet.create({
  bioCard: {
    backgroundColor: colors.primaryBg,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: 16,
    marginBottom: 18,
  },
  bioText: {
    fontSize: typography.body,
    color: colors.body,
    lineHeight: 1.75,
  },
  highlightRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    flexWrap: "wrap",
  },
  highlight: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderDark,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  highlightText: {
    fontSize: typography.tiny,
    color: colors.primary,
    fontFamily: typography.fontFamilyBold,
  },
});

const FALLBACK_BIO =
  "I don't believe software should exist simply because it can be built. Every project I take on starts with one question: What problem does this actually solve?\n\nThat mindset has shaped the way I learn and build. From web development and backend systems to IoT and machine learning, I enjoy turning ideas into practical solutions that people can actually use.\n\nOutside the classroom, I've had the opportunity to mentor students as a Laboratory Assistant and Teaching Assistant while also serving in student organizations. Those experiences taught me that writing code is only one part of engineering — communicating ideas, collaborating with others, and leading a team are equally important.\n\nI aim to become a software engineer who builds technology that is reliable, scalable, and designed with purpose.";

type AboutPageProps = { settings: SanitySettings };

export function AboutPage({ settings }: AboutPageProps) {
  const fullName = settings.fullName ?? "Portfolio";
  const bio = settings.bio ?? FALLBACK_BIO;

  return (
    <Page size="A4" orientation="portrait" style={shell.page}>
      <PageHeader section="About" name={fullName} />

      <SectionHeading label="Professional Summary" title="About Me" />

      <View style={S.bioCard}>
        <Text style={S.bioText}>{bio}</Text>
      </View>

      <View style={S.highlightRow}>
        {["Open to Work", "Fullstack Engineer", "Indonesia"].map((tag) => (
          <View key={tag} style={S.highlight}>
            <Text style={S.highlightText}>{tag}</Text>
          </View>
        ))}
      </View>

      <PageFooter name={fullName} />
    </Page>
  );
}
