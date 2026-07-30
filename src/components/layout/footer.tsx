import Link from "next/link";
import { Mail } from "lucide-react";

import { Container } from "./container";
import { navLinks } from "@/constants/navigation";
import { socialLinks, contactInfo } from "@/constants/contact";

const footerSocials = [
  ...socialLinks.filter((social) => ["github", "linkedin"].includes(social.id)),
  ...contactInfo
    .filter((item) => item.id === "email")
    .map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: Mail,
    })),
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight"
            >
              Dimas Rizki Ardiansyah
            </Link>

            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Fullstack Software Engineer.
            </p>
          </div>

          <nav className="space-y-3">
            <p className="text-sm font-medium">Navigation</p>

            <ul className="space-y-2">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-3">
            <p className="text-sm font-medium">Social</p>

            <ul className="space-y-2">
              {footerSocials.map((social) => {
                const Icon = social.icon;

                return (
                  <li key={social.id}>
                    <Link
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        social.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon size={16} />
                      {social.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
