import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";

import { Container } from "./container";
import { navLinks } from "@/constants/navigation";
import {
  socialLinks as defaultSocialLinks,
  contactInfo as defaultContactInfo,
} from "@/constants/contact";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import type { SocialLink, ContactInfo } from "@/types/contact";

type FooterProps = {
  locale: Locale;
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo[];
};

export function Footer({
  locale,
  socialLinks = defaultSocialLinks,
  contactInfo = defaultContactInfo,
}: FooterProps) {
  const messages = getMessages(locale);

  const footerSocials = [
    ...socialLinks.filter((social) =>
      ["github", "linkedin", "instagram"].includes(social.id)
    ),
    ...contactInfo
      .filter((item) => item.id === "email")
      .map((item) => ({
        id: item.id,
        label: item.label,
        href: item.href,
        icon: Mail,
      })),
  ];

  return (
    <footer className="border-t border-border bg-card">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <Link
              href={localeHref(locale, "/")}
              className="font-display text-xl font-bold tracking-tight text-foreground"
            >
              Dimas Rizki Ardiansyah
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {messages["footer.tagline"]}
            </p>

            <div className="pt-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
              [SYSTEM_STATUS: ONLINE / ACTIVE]
            </div>
          </div>

          <nav className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {messages["footer.navigation"]}
            </p>

            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localeHref(locale, item.href)}
                    className="font-mono text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {messages[item.labelKey]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {messages["footer.social"]}
            </p>

            <ul className="space-y-2">
              {footerSocials.map((social) => {
                const Icon = social.icon;

                return (
                  <li key={social.id}>
                    <Link
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        social.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group inline-flex items-center gap-2 font-mono text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-3.5 text-primary" />
                      <span>{social.label}</span>
                      {social.href.startsWith("http") && (
                        <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
