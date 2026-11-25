import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";

type Props = {
  locale: Locale;
};

const FALLBACK = {
  en: {
    text: "The best software is built at the intersection of deep technical curiosity and genuine care for the humans who use it.",
    author: "Dimas Rizki, Fullstack Software Engineer",
  },
  id: {
    text: "Perangkat lunak terbaik lahir di perpotongan antara rasa ingin tahu teknis yang mendalam dan kepedulian nyata terhadap manusia yang menggunakannya.",
    author: "Dimas Rizki, Fullstack Software Engineer",
  },
};

export function QuoteBlock({ locale }: Props) {
  const messages = getMessages(locale);

  const quoteText =
    (messages["contact.quote.text"] as string | undefined) ??
    (FALLBACK[locale]?.text ?? FALLBACK.en.text);

  const quoteAuthor =
    (messages["contact.quote.author"] as string | undefined) ??
    (FALLBACK[locale]?.author ?? FALLBACK.en.author);

  return (
    <blockquote className="border-l-2 border-primary/60 pl-6">
      <div className="relative">
        <span className="absolute -top-4 -left-2 font-serif text-7xl leading-none text-primary opacity-20 select-none">
          &ldquo;
        </span>
        <p className="font-serif italic text-xl leading-relaxed text-foreground/90 pt-4">
          {quoteText}
        </p>
      </div>
      <footer className="mt-4">
        <span className="font-mono text-sm text-muted-foreground">
          — {quoteAuthor}
        </span>
      </footer>
    </blockquote>
  );
}
