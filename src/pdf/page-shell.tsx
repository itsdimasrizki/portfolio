/**
 * Shared layout primitives for inner PDF pages.
 * Every page uses a consistent top header bar and absolute footer.
 */
import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { colors, typography, spacing } from "./theme";

export const pageShellStyles = StyleSheet.create({
  page: {
    backgroundColor: colors.white,
    fontFamily: typography.fontFamily,
    paddingTop: spacing.headerH + 24,
    paddingBottom: 52,
    paddingHorizontal: spacing.pageMarginH,
  },

  // ── Top header strip ──────────────────────────────────────────
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: spacing.headerH,
    backgroundColor: colors.heading,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pageMarginH,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  headerDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  headerName: {
    fontSize: typography.micro,
    color: "#94a3b8",
    letterSpacing: 0.5,
  },
  headerSection: {
    fontSize: typography.micro,
    color: colors.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },

  // ── Section heading block ─────────────────────────────────────
  sectionLabel: {
    fontSize: typography.micro,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: typography.h1,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 16,
    lineHeight: 1.15,
  },
  sectionRule: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 16,
  },

  // ── Page footer (page number) ─────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerName: {
    fontSize: typography.micro,
    color: colors.muted,
  },
  footerPage: {
    fontSize: typography.micro,
    color: colors.muted,
  },
});

// ── Reusable header + footer components ───────────────────────────

type PageHeaderProps = {
  section: string;
  name: string;
};

export function PageHeader({ section, name }: PageHeaderProps) {
  return (
    <View style={pageShellStyles.header} fixed>
      <View style={pageShellStyles.headerLeft}>
        <View style={pageShellStyles.headerDot} />
        <Text style={pageShellStyles.headerName}>{name}</Text>
      </View>
      <Text style={pageShellStyles.headerSection}>{section}</Text>
    </View>
  );
}

export function PageFooter({ name }: { name: string }) {
  return (
    <View style={pageShellStyles.pageFooter} fixed>
      <Text style={pageShellStyles.footerName}>{name}</Text>
      <Text
        style={pageShellStyles.footerPage}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

// ── Section heading ────────────────────────────────────────────────

type SectionHeadingProps = {
  label: string;
  title: string;
  withRule?: boolean;
};

export function SectionHeading({ label, title, withRule = true }: SectionHeadingProps) {
  return (
    <View>
      <Text style={pageShellStyles.sectionLabel}>{label}</Text>
      <Text style={pageShellStyles.sectionTitle}>{title}</Text>
      {withRule && <View style={pageShellStyles.sectionRule} />}
    </View>
  );
}
