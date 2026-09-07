"use client";

import { usePathname, useRouter } from "next/navigation";

import { LOCALES, isLocale, type Locale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  className?: string;
};

export function LanguageSwitcher({ locale, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;

    // Cookie diingat setahun supaya kunjungan berikutnya langsung benar.
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;

    // Pindah ke path kembarannya, bukan kembali ke beranda: pembaca yang
    // sedang di /en/projects harus mendarat di /id/projects.
    const segments = pathname.split("/");
    if (isLocale(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
  }

  return (
    <div className={cn("flex items-center rounded-md border border-border", className)}>
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchTo(item)}
          aria-current={item === locale ? "true" : undefined}
          className={cn(
            "px-2 py-1 text-xs font-medium uppercase transition-colors",
            item === locale
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
