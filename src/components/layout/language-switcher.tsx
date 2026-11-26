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
    // eslint-disable-next-line react-hooks/immutability
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
    <div
      className={cn(
        "flex shrink-0 items-center overflow-hidden rounded-full border border-border bg-card/70 p-0.5",
        className
      )}
    >
      {LOCALES.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => switchTo(item)}
          aria-current={item === locale ? "true" : undefined}
          className={cn(
            "rounded-full px-2 py-0.5 font-mono text-[11px] font-medium uppercase transition-colors",
            item === locale
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
