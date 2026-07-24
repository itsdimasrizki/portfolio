import Link from "next/link";
import { Container } from "./container";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants/navigation";

const navItems = navLinks.filter((item) => item.href !== "/");

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Dimas Rizki
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button variant="outline" size="sm">
          Download CV
        </Button>
      </Container>
    </header>
  );
}
