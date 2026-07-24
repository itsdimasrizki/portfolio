import Link from "next/link";

import { contactInfo, socialLinks } from "@/constants/contact";

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {contactInfo.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-md"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <Icon size={18} />
              </span>

              <span>
                <span className="block text-sm text-muted-foreground">
                  {item.label}
                </span>

                <span className="block font-medium">
                  {item.value}
                </span>
              </span>
            </Link>
          );
        })}
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Find me online
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          {socialLinks.map((social) => {
            const Icon = social.icon;

            return (
              <Link
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-teal-700 hover:text-teal-700 hover:shadow-md"
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
