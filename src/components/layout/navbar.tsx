"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { DownloadPortfolioButton } from "@/components/common/download-portfolio-button";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { CoinLogo } from "./coin-logo";
import { AccentPicker } from "./accent-picker";
import { navLinks } from "@/constants/navigation";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

const navItems = navLinks.filter((item) => item.href !== "/");

type NavbarProps = {
  cvUrl?: string | null;
  locale: Locale;
};

export function Navbar({ cvUrl, locale }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const messages = getMessages(locale);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="navbar"
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-md shadow-xs"
          : "border-b border-border/40 bg-background/60 backdrop-blur-xs"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        {/* Left: 3D Coin-flip Logo & Say Hi */}
        <CoinLogo locale={locale} />

        {/* Center: Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item, idx) => {
            const href = localeHref(locale, item.href);
            const isActive =
              pathname === href || (pathname.startsWith(href) && item.href !== "/");

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 font-mono text-xs tracking-wider transition-colors duration-150 rounded-md",
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 -z-10 rounded-md border border-border bg-card/80 shadow-xs"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="text-[10px] text-primary/70 mr-1.5">{`0${idx + 1} //`}</span>
                {messages[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        {/* Right: Color Accent Switcher, CTA, Resume & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Accent Color Dropdown */}
          <AccentPicker />

          <div className="hidden items-center gap-2 md:flex">
            {/* Direct Contact CTA */}
            <Button
              variant="default"
              size="sm"
              className="rounded-full bg-primary font-mono text-xs text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
              asChild
            >
              <Link href={localeHref(locale, "/contact")}>
                {messages["nav.contact"]}
              </Link>
            </Button>

            {cvUrl ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border font-mono text-xs uppercase tracking-wider"
                asChild
              >
                <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
                  {messages["cta.downloadCv"]}
                </a>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-border font-mono text-xs uppercase tracking-wider"
                asChild
              >
                <a href="/resume.pdf" download>
                  {messages["cta.downloadCv"]}
                </a>
              </Button>
            )}

            <DownloadPortfolioButton locale={locale} />
            <LanguageSwitcher locale={locale} className="hidden md:flex rounded-full" />
          </div>

          <MobileNav cvUrl={cvUrl} locale={locale} />
        </div>
      </Container>
    </header>
  );
}
