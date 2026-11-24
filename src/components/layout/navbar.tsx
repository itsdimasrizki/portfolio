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
  const [time, setTime] = useState("");
  const pathname = usePathname();
  const messages = getMessages(locale);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Jakarta",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " WIB"
      );
    };

    handleScroll();
    updateTime();
    const timer = setInterval(updateTime, 1000);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
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
        <div className="flex items-center gap-3">
          <Link
            href={localeHref(locale, "/")}
            className="group flex items-center gap-2 font-display text-sm font-bold tracking-tight text-foreground transition-colors hover:text-primary"
          >
            <span className="flex h-2 w-2 relative">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Dimas Rizki</span>
          </Link>

          {time && (
            <span className="hidden lg:inline-flex items-center border border-border/80 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {time}
            </span>
          )}
        </div>
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
                  "relative px-3 py-1.5 font-mono text-xs tracking-wider transition-colors duration-150",
                  isActive
                    ? "font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 -z-10 border border-border bg-card shadow-xs"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                <span className="text-[10px] text-primary/70 mr-1.5">0{idx + 1} //</span>
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
