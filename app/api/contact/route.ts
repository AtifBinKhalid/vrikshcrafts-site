import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      businessName,
      email,
      phone,
      city,
      projectType,
      budget,
      message,
    } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and project details are required.",
        },
        { status: 400 }
      );
    }

    // 1) Log to server console
    console.log("New vrikshcrafts enquiry:", {
      name,
      businessName,
      email,
      phone,
      city,
      projectType,
      budget,
      message,
      receivedAt: new Date().toISOString(),
    });

    // 2) Read SMTP settings from environment (Mailtrap)
    const smtpHost = process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io";
    const smtpPort = Number(process.env.SMTP_PORT || 2525);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom =
      process.env.SMTP_FROM ||
      '"vrikshcrafts" <no-reply@vrikshcrafts.test>';
    const smtpTo =
      process.env.SMTP_TO || "your-email@example.com";

    // If SMTP is not configured, return success but skip email
    if (!smtpUser || !smtpPass) {
      console.warn(
        "[vrikshcrafts] SMTP_USER / SMTP_PASS missing, skipping email send."
      );
      return NextResponse.json(
        {
          success: true,
          info: "Enquiry logged, but email not sent (SMTP not configured).",
        },
        { status: 200 }
      );
    }

    // 3) Create Mailtrap transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = `New vrikshcrafts enquiry from ${name}`;
    const plainBody = `
New enquiry received.

Name: ${name}
Business / brand: ${businessName || "-"}
Email: ${email}
Phone: ${phone || "-"}
City: ${city || "-"}
Project type: ${projectType || "-"}

Budget: ${budget || "-"}

Message:
${message}
    `.trim();

    const htmlBody = `
      <h2>New vrikshcrafts enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Business / brand:</strong> ${businessName || "-"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "-"}</p>
      <p><strong>City:</strong> ${city || "-"}</p>
      <p><strong>Project type:</strong> ${projectType || "-"}</p>
      <p><strong>Budget:</strong> ${budget || "-"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    // 4) Send email through Mailtrap
    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      subject,
      text: plainBody,
      html: htmlBody,
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling contact form:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error while submitting enquiry.",
      },
      { status: 500 }
    );
  }
}
