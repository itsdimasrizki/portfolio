import { NextResponse } from "next/server";
import { getSiteSettings } from "@/services/settings.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not set in environment variables.");
      return NextResponse.json(
        { error: "Server email service configuration missing." },
        { status: 500 }
      );
    }

    // Get recipient email from Sanity settings or use default
    const { contactInfo } = await getSiteSettings();
    const targetEmailObj = contactInfo.find((item) => item.id === "email");
    const toEmail = targetEmailObj?.value || "itsdimasrizki@gmail.com";

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
      console.error("Resend API error:", data);
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
