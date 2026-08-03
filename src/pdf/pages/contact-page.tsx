import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";
import { PageHeader, PageFooter, SectionHeading, pageShellStyles as shell } from "../page-shell";

function truncateUrl(url: string, max = 42) {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > max ? clean.slice(0, max) + "…" : clean;
}

const S = StyleSheet.create({
  twoCol: {
    flexDirection: "row",
    gap: 28,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    width: 160,
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
    gap: 10,
    marginBottom: 10,
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 4,
    flexShrink: 0,
  },
  contactTextCol: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.micro,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: typography.small,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
  },
  contactLink: {
    fontSize: typography.small,
    color: colors.primary,
    fontFamily: typography.fontFamilyBold,
    textDecoration: "underline",
  },

  // QR Code Box
  qrCard: {
    backgroundColor: colors.primaryBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
    width: "100%",
  },
  qrBox: {
    width: 126,
    height: 126,
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  qrImg: {
    width: "100%",
    height: "100%",
  },
  qrTitle: {
    fontSize: typography.small,
    color: colors.heading,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 2,
    textAlign: "center",
  },
  qrLabel: {
    fontSize: typography.micro,
    color: colors.muted,
    textAlign: "center",
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
    <Page size="A4" orientation="portrait" style={shell.page}>
      <PageHeader section="Contact" name={fullName} />
      <SectionHeading label="Get in Touch" title="Contact & Connect" />

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
              <Text style={S.groupTitle}>Online Profiles</Text>
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

        {/* Right: QR code card */}
        {qrCodeDataUrl && (
          <View style={S.rightCol}>
            <View style={S.qrCard}>
              <View style={S.qrBox}>
                <Image src={qrCodeDataUrl} style={S.qrImg} />
              </View>
              <Text style={S.qrTitle}>Portfolio Website</Text>
              <Text style={S.qrLabel}>Scan QR code to visit interactive website</Text>
            </View>
          </View>
        )}
      </View>

      <PageFooter name={fullName} />
    </Page>
  );
}
