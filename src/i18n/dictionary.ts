import en from "./messages/en.json";
import id from "./messages/id.json";
import { DEFAULT_LOCALE, type Locale } from "./locale";

export type Messages = typeof en;
export type MessageKey = keyof Messages;

const MESSAGES: Record<Locale, Messages> = { id, en };

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
}
