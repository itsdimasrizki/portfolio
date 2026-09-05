"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DownloadPortfolioButton } from "@/components/common/download-portfolio-button";
import { navLinks } from "@/constants/navigation";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  cvUrl?: string | null;
};

export function MobileNav({ cvUrl }: MobileNavProps) {
  const pathname = usePathname();

  // Panel dibiarkan uncontrolled: tiap link dibungkus SheetClose, jadi Radix
  // sendiri yang menutupnya saat rute berpindah.
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent title="Navigation">
        <nav className="mt-6 flex flex-col gap-1">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base transition-colors",
                    isActive
                      ? "bg-muted/80 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <Button variant="outline" size="sm" asChild>
            {cvUrl ? (
              <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
                Download CV
              </a>
            ) : (
              <a href="/resume.pdf" download>
                Download CV
              </a>
            )}
          </Button>
          <DownloadPortfolioButton className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
