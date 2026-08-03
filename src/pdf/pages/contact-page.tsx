import React from "react";
import { Page, View, Text, Image, StyleSheet, Link } from "@react-pdf/renderer";
import type { SanitySettings } from "@/types/siteSettings";
import { colors, typography, spacing } from "../theme";

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.coverBg,
    fontFamily: typography.fontFamily,
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: colors.coverAccent,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.pageMarginH,
    paddingVertical: 72,
    justifyContent: "space-between",
  },
  // Header
  eyebrow: {
    fontSize: typography.tiny,
    color: colors.coverAccent,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 4,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: colors.coverAccent,
    marginBottom: 24,
  },
  heading: {
    fontSize: typography.h1,
    color: colors.coverText,
    fontFamily: typography.fontFamilyBold,
    marginBottom: 6,
  },
  subHeading: {
    fontSize: typography.body,
    color: colors.muted,
    marginBottom: 32,
  },
  // Main layout: 2 columns
  mainRow: {
    flexDirection: "row",
    gap: 40,
    alignItems: "flex-start",
  },
  // Left: contact info
  leftCol: {
    flex: 1,
  },
  contactGroup: {
    marginBottom: 20,
  },
  contactGroupTitle: {
    fontSize: typography.tiny,
    color: colors.coverAccent,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: typography.fontFamilyBold,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 6,
    alignItems: "flex-start",
  },
  contactBullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.coverAccent,
    marginTop: 4,
  },
  contactCol: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.tiny,
    color: colors.muted,
    marginBottom: 1,
  },
  contactValue: {
    fontSize: typography.small,
    color: colors.coverText,
  },
  contactLink: {
    fontSize: typography.small,
    color: colors.primaryLight,
    textDecoration: "underline",
  },
  // Right: QR Code
  rightCol: {
    width: 160,
    alignItems: "center",
  },
  qrBox: {
    width: 140,
    height: 140,
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  qrImage: {
    width: "100%",
    height: "100%",
  },
  qrLabel: {
    fontSize: typography.tiny,
    color: colors.muted,
    textAlign: "center",
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

type ContactPageProps = {
  settings: SanitySettings;
  qrCodeDataUrl: string;
};

export function ContactPage({ settings, qrCodeDataUrl }: ContactPageProps) {
  const fullName = settings.fullName ?? "Portfolio";
  const portfolioUrl = settings.portfolioUrl ?? "";

  const direct = [
    { label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    { label: "Phone", value: settings.phone, href: `tel:${settings.phone?.replace(/\s/g, "")}` },
    { label: "Location", value: settings.location },
  ].filter((c) => c.value);

  const social = [
    { label: "LinkedIn", value: settings.linkedinUrl, href: settings.linkedinUrl },
    { label: "GitHub", value: settings.githubUrl, href: settings.githubUrl },
    { label: "Website", value: portfolioUrl, href: portfolioUrl },
  ].filter((c) => c.value);

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.accentBar} />

      <View style={styles.content}>
        {/* Header */}
        <View>
          <Text style={styles.eyebrow}>Contact</Text>
          <View style={styles.divider} />
          <Text style={styles.heading}>Let's Connect</Text>
          <Text style={styles.subHeading}>{fullName}</Text>

          {/* Two-column layout */}
          <View style={styles.mainRow}>
            {/* Left: contact details */}
            <View style={styles.leftCol}>
              {direct.length > 0 && (
                <View style={styles.contactGroup}>
                  <Text style={styles.contactGroupTitle}>Direct Contact</Text>
                  {direct.map((item) => (
                    <View key={item.label} style={styles.contactItem}>
                      <View style={styles.contactBullet} />
                      <View style={styles.contactCol}>
                        <Text style={styles.contactLabel}>{item.label}</Text>
                        {item.href ? (
                          <Link src={item.href} style={styles.contactLink}>
                            {item.value}
                          </Link>
                        ) : (
                          <Text style={styles.contactValue}>{item.value}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {social.length > 0 && (
                <View style={styles.contactGroup}>
                  <Text style={styles.contactGroupTitle}>Online</Text>
                  {social.map((item) => (
                    <View key={item.label} style={styles.contactItem}>
                      <View style={styles.contactBullet} />
                      <View style={styles.contactCol}>
                        <Text style={styles.contactLabel}>{item.label}</Text>
                        {item.href ? (
                          <Link src={item.href} style={styles.contactLink}>
                            {item.value}
                          </Link>
                        ) : (
                          <Text style={styles.contactValue}>{item.value}</Text>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Right: QR Code */}
            {qrCodeDataUrl && (
              <View style={styles.rightCol}>
                <View style={styles.qrBox}>
                  <Image src={qrCodeDataUrl} style={styles.qrImage} />
                </View>
                <Text style={styles.qrLabel}>Scan to visit portfolio</Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Thank you for reviewing my portfolio.</Text>
          <Text style={styles.footerRight}>{fullName}</Text>
        </View>
      </View>
    </Page>
  );
}
