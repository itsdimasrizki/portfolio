"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const navItems = navLinks.filter((item) => item.href !== "/");

type NavbarProps = {
  cvUrl?: string | null;
};

export function Navbar({ cvUrl }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
        "sticky top-0 z-50 transition-all duration-300 ease-out",
        isScrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-md shadow-xs"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight transition-colors hover:text-foreground/80"
        >
          Dimas Rizki Ardiansyah
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm transition-colors duration-200",
                  isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 -z-10 rounded-md bg-muted/80"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {cvUrl ? (
          <Button variant="outline" size="sm" asChild>
            <a href={cvUrl} download target="_blank" rel="noopener noreferrer">
              Download CV
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <a href="/resume.pdf" download>
              Download CV
            </a>
          </Button>
        )}
      </Container>
    </header>
  );
}
