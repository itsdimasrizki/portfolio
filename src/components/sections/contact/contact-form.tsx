"use client";

import { FormEvent, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMessages } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/locale";

type Props = {
  locale: Locale;
};

export function ContactForm({ locale }: Props) {
  const messages = getMessages(locale);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const hpCompany = (formData.get("hp_company") as string) || "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          hp_company: hpCompany,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setStatus({
        type: "success",
        message: "Thank you! Your message has been sent successfully.",
      });
      form.reset();
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border bg-card p-6 md:p-8"
    >
      {/* Hidden honeypot field to trap spam bots */}
      <div className="hidden" aria-hidden="true">
        <Input
          id="hp_company"
          name="hp_company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status.type === "success" && (
        <div className="flex items-center gap-3 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4 text-sm text-teal-700 dark:text-teal-400">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === "error" && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{messages["form.name.label"]}</Label>
          <Input
            id="name"
            name="name"
            placeholder={messages["form.name.placeholder"]}
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{messages["form.email.label"]}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={messages["form.email.placeholder"]}
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{messages["form.subject.label"]}</Label>
        <Input
          id="subject"
          name="subject"
          placeholder={messages["form.subject.placeholder"]}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{messages["form.message.label"]}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={messages["form.message.placeholder"]}
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
