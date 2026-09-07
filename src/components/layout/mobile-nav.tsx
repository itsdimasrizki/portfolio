"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DownloadPortfolioButton } from "@/components/common/download-portfolio-button";
import { LanguageSwitcher } from "./language-switcher";
import { navLinks } from "@/constants/navigation";
import { getMessages } from "@/i18n/dictionary";
import { localeHref, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  cvUrl?: string | null;
  locale: Locale;
};

export function MobileNav({ cvUrl, locale }: MobileNavProps) {
  const pathname = usePathname();
  const messages = getMessages(locale);

  // Panel dibiarkan uncontrolled: tiap link dibungkus SheetClose, jadi Radix
  // sendiri yang menutupnya saat rute berpindah.
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={messages["nav.openMenu"]}
          className="md:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent title={messages["footer.navigation"]}>
        <nav className="mt-6 flex flex-col gap-1">
          {navLinks.map((item) => {
            const href = localeHref(locale, item.href);
            const isActive =
              item.href === "/"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base transition-colors",
                    isActive
                      ? "bg-muted/80 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {messages[item.labelKey]}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <LanguageSwitcher locale={locale} className="self-start" />

        <div className="mt-auto flex flex-col gap-2">
          <Button variant="outline" size="sm" asChild>
            {cvUrl ? (
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
                {messages["cta.downloadCv"]}
              </a>
            ) : (
              <a href="/resume.pdf" download>
                {messages["cta.downloadCv"]}
              </a>
            )}
          </Button>
          <DownloadPortfolioButton className="w-full" locale={locale} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
