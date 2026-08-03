import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

function truncateUrl(url: string, max = 42) {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

const S = StyleSheet.create({
  page: {
    backgroundColor: colors.coverBg,
    fontFamily: typography.fontFamily,
    position: "relative",
  },
  // Header bar (dark, matching cover style)
  pageHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: "#090f1a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pageMarginH,
  },
  pageHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  pageHeaderDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
  pageHeaderName: {
    fontSize: typography.micro,
    color: "#475569",
  },
  pageHeaderSection: {
    fontSize: typography.micro,
    color: colors.primary,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
  },

  // Left sidebar accent
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: colors.primary,
  },

  // Main content area
  content: {
    paddingTop: 36 + 36,
    paddingHorizontal: spacing.pageMarginH,
    paddingBottom: 52,
  },
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
    color: colors.coverText,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: 24,
  },

  // Two-column main layout
  twoCol: {
    flexDirection: "row",
    gap: 32,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    width: 150,
    alignItems: "center",
  },

  // Contact groups
  group: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: typography.tiny,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 4,
    flexShrink: 0,
  },
  contactTextCol: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.micro,
    color: "#64748b",
    marginBottom: 1,
  },
  contactValue: {
    fontSize: typography.small,
    color: "#cbd5e1",
  },
  contactLink: {
    fontSize: typography.small,
    color: colors.primary,
    textDecoration: "underline",
  },

  // QR Code
  qrBox: {
    width: 126,
    height: 126,
    backgroundColor: colors.white,
    padding: 7,
    borderRadius: 5,
    marginBottom: 7,
  },
  qrImg: {
    width: "100%",
    height: "100%",
  },
  qrLabel: {
    fontSize: typography.micro,
    color: colors.muted,
    textAlign: "center",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: spacing.pageMarginH,
    right: spacing.pageMarginH,
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerLeft: {
    fontSize: typography.micro,
    color: "#334155",
  },
  footerRight: {
    fontSize: typography.micro,
    color: "#334155",
  },
});

type ContactPageProps = { settings: SanitySettings; qrCodeDataUrl: string };

export function ContactPage({ settings, qrCodeDataUrl }: ContactPageProps) {
  const fullName = settings.fullName ?? "Portfolio";

  const direct = [
    { label: "Email",    value: settings.email,    href: `mailto:${settings.email}` },
    { label: "Phone",    value: settings.phone,    href: `tel:${settings.phone?.replace(/\s/g, "")}` },
    { label: "Location", value: settings.location, href: null },
  ].filter((c): c is { label: string; value: string; href: string | null } => Boolean(c.value));

  const online = [
    { label: "LinkedIn", value: settings.linkedinUrl ? truncateUrl(settings.linkedinUrl) : undefined, href: settings.linkedinUrl },
    { label: "GitHub",   value: settings.githubUrl  ? truncateUrl(settings.githubUrl)   : undefined, href: settings.githubUrl },
    { label: "Website",  value: settings.portfolioUrl ? truncateUrl(settings.portfolioUrl) : undefined, href: settings.portfolioUrl },
  ].filter((c): c is { label: string; value: string; href: string } => Boolean(c.value));

  return (
    <Page size="A4" style={S.page}>
      <View style={S.sidebar} />

      {/* Page header (dark variant) */}
      <View style={S.pageHeader} fixed>
        <View style={S.pageHeaderLeft}>
          <View style={S.pageHeaderDot} />
          <Text style={S.pageHeaderName}>{fullName}</Text>
        </View>
        <Text style={S.pageHeaderSection}>Contact</Text>
      </View>

      <View style={S.content}>
        <Text style={S.sectionLabel}>Get in Touch</Text>
        <Text style={S.sectionTitle}>Let's Connect</Text>
        <Text style={S.sectionSub}>Feel free to reach out for opportunities or collaboration.</Text>

        <View style={S.twoCol}>
          {/* Left: contact details */}
          <View style={S.leftCol}>
            {direct.length > 0 && (
              <View style={S.group}>
                <Text style={S.groupTitle}>Direct Contact</Text>
                {direct.map((item) => (
                  <View key={item.label} style={S.contactItem}>
                    <View style={S.bullet} />
                    <View style={S.contactTextCol}>
                      <Text style={S.contactLabel}>{item.label}</Text>
                      {item.href ? (
                        <Link src={item.href} style={S.contactLink}>{item.value}</Link>
                      ) : (
                        <Text style={S.contactValue}>{item.value}</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {online.length > 0 && (
              <View style={S.group}>
                <Text style={S.groupTitle}>Online</Text>
                {online.map((item) => (
                  <View key={item.label} style={S.contactItem}>
                    <View style={S.bullet} />
                    <View style={S.contactTextCol}>
                      <Text style={S.contactLabel}>{item.label}</Text>
                      <Link src={item.href} style={S.contactLink}>{item.value}</Link>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right: QR code */}
          {qrCodeDataUrl && (
            <View style={S.rightCol}>
              <View style={S.qrBox}>
                <Image src={qrCodeDataUrl} style={S.qrImg} />
              </View>
              <Text style={S.qrLabel}>Scan to visit portfolio</Text>
            </View>
          )}
        </View>
      </View>

      {/* Footer */}
      <View style={S.footer}>
        <Text style={S.footerLeft}>Thank you for reviewing my portfolio.</Text>
        <Text style={S.footerRight}>{fullName} · {new Date().getFullYear()}</Text>
      </View>
    </Page>
  );
}
