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
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled
          ? "border-b border-border bg-background/90 backdrop-blur-md shadow-xs"
          : "border-b border-border/40 bg-background/70 backdrop-blur-xs"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href={localeHref(locale, "/")}
          className="font-display text-sm font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          Dimas Rizki Ardiansyah
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const href = localeHref(locale, item.href);
            const isActive =
              pathname === href || (pathname.startsWith(href) && item.href !== "/");

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "relative px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors duration-150",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 -z-10 border border-border bg-muted/60 rounded-none"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {messages[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {cvUrl ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-none border-border font-mono text-xs uppercase tracking-wider"
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
                className="rounded-none border-border font-mono text-xs uppercase tracking-wider"
                asChild
              >
                <a href="/resume.pdf" download>
                  {messages["cta.downloadCv"]}
                </a>
              </Button>
            )}

            <DownloadPortfolioButton locale={locale} />

            <LanguageSwitcher locale={locale} className="hidden md:flex rounded-none" />
          </div>

          <MobileNav cvUrl={cvUrl} locale={locale} />
        </div>
      </Container>
    </header>
  );
}
