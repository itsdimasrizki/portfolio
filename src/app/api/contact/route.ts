import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getSiteSettings } from "@/services/settings.service";

// Simple In-Memory Rate Limiter (Max 3 messages per 5 minutes per IP)
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown-client-ip";

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait 5 minutes before trying again." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, hp_company } = body;

    // 2. Honeypot Bot Trap: If hidden bot field is filled, silently ignore and pretend success
    if (hp_company) {
      console.warn("Spam bot detected via Honeypot field from IP:", clientIp);
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER || "dimasrizkia477@gmail.com";
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    const { contactInfo } = await getSiteSettings();
    const targetEmailObj = contactInfo.find((item) => item.id === "email");
    const toEmail = targetEmailObj?.value || "dimasrizkia477@gmail.com";

    if (gmailPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass.replace(/\s+/g, ""),
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${gmailUser}>`,
        to: toEmail,
        replyTo: email,
        subject: `[Portfolio Contact] ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #0d9488; margin-top: 0;">New Contact Form Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6;">${message}</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server email service configuration missing." },
        { status: 500 }
      );
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `[Portfolio Contact] ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #0d9488; margin-top: 0;">New Contact Form Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6;">${message}</p>
          </div>
        `,
      }),
    });

    const data = await resendResponse.json();
    if (!resendResponse.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to send email." },
        { status: resendResponse.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
