"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, Download, FileText, Loader2 } from "lucide-react";

import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { LanguageSwitcher } from "./language-switcher";
import { CoinLogo } from "./coin-logo";
import { AccentPicker } from "./accent-picker";
import { navLinks } from "@/constants/navigation";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

// 4 primary center routes: About, Projects, Experience, Certificates
const navItems = navLinks.filter(
  (item) => item.href !== "/" && item.href !== "/contact"
);

type NavbarProps = {
  cvUrl?: string | null;
  locale: Locale;
};

export function Navbar({ cvUrl, locale }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "error">("idle");
  const dossierRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const messages = getMessages(locale);
  const { scrollYProgress } = useScroll();
  const readProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dossierRef.current && !dossierRef.current.contains(e.target as Node)) {
        setDossierOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handlePortfolioPdf() {
    if (pdfState === "loading") return;
    setPdfState("loading");
    try {
      const response = await fetch(`/api/portfolio/pdf?locale=${locale}`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dimas-rizki-portfolio-${locale}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setPdfState("idle");
      setDossierOpen(false);
    } catch (err) {
      console.error("PDF download failed:", err);
      setPdfState("error");
    }
  }

  return (
    <header
      id="navbar"
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-md shadow-xs"
          : "border-b border-border/40 bg-background/60 backdrop-blur-xs"
      )}
    >
      {/* Reading progress: a hairline in the user's accent color. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: readProgress }}
        className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left bg-primary"
      />
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Left: Coin Logo with subtle availability indicator */}
        <div className="shrink-0">
          <CoinLogo locale={locale} />
        </div>

        {/* Center: 4 Primary Desktop Nav Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navItems.map((item) => {
            const href = localeHref(locale, item.href);
            const isActive =
              pathname === href || (pathname.startsWith(`${href}/`) && item.href !== "/");

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 -z-10 rounded-lg border border-border bg-card/80"
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

        {/* Right: Consolidated CV/PDF Dropdown, AccentPicker, LanguageSwitcher & Primary CTA */}
        <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
          {/* Consolidated CV / Portfolio PDF Dropdown */}
          <div className="relative hidden lg:block" ref={dossierRef}>
            <button
              type="button"
              onClick={() => setDossierOpen((prev) => !prev)}
              aria-expanded={dossierOpen}
              aria-haspopup="menu"
              className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg border border-border bg-card/80 px-3 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span>CV / PDF</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform duration-200",
                  dossierOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {dossierOpen && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-card/95 p-1 shadow-xl backdrop-blur-md"
                >
                  <a
                    role="menuitem"
                    href={cvUrl ?? "/resume.pdf"}
                    download
                    target={cvUrl ? "_blank" : undefined}
                    rel={cvUrl ? "noopener noreferrer" : undefined}
                    onClick={() => setDossierOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-mono text-xs text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    <Download className="h-3.5 w-3.5 shrink-0" />
                    <span>{messages["cta.downloadCv"]}</span>
                  </a>

                  <button
                    role="menuitem"
                    type="button"
                    onClick={handlePortfolioPdf}
                    disabled={pdfState === "loading"}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-mono text-xs transition-colors hover:bg-muted",
                      pdfState === "error"
                        ? "text-destructive"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {pdfState === "loading" ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                    )}
                    <span>
                      {pdfState === "loading"
                        ? messages["cta.generating"]
                        : pdfState === "error"
                          ? messages["cta.retry"]
                          : `${messages["cta.portfolio"]} PDF`}
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AccentPicker />

          <LanguageSwitcher locale={locale} className="hidden lg:flex" />

          {/* Single Primary CTA */}
          <Button
            variant="default"
            size="sm"
            className="hidden h-8 shrink-0 whitespace-nowrap rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
            asChild
          >
            <Link href={localeHref(locale, "/contact")}>
              {messages["cta.letsConnect"]}
            </Link>
          </Button>
          <MobileNav cvUrl={cvUrl} locale={locale} />
        </div>
      </Container>
    </header>
  );
}
