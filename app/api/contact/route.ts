import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELD_LIMITS = {
  name: 100,
  businessName: 120,
  email: 254,
  phone: 40,
  city: 100,
  projectType: 40,
  budget: 100,
  message: 3_000,
  website: 200,
} as const;

const PROJECT_TYPES = new Set(["", "Cafe", "Office", "Designer", "Store", "Other"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTROL_CHARACTER_PATTERN = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

type ContactData = Record<keyof typeof FIELD_LIMITS, string>;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(payload: unknown):
  | { data: ContactData; spam: boolean; error?: never }
  | { error: string; data?: never; spam?: never } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "Please submit a valid enquiry." };
  }

  const input = payload as Record<string, unknown>;
  const data: ContactData = {
    name: text(input.name),
    businessName: text(input.businessName),
    email: text(input.email).toLowerCase(),
    phone: text(input.phone),
    city: text(input.city),
    projectType: text(input.projectType),
    budget: text(input.budget),
    message: text(input.message),
    website: text(input.website),
  };

  if (data.website) return { data, spam: true };
  if (data.name.length < 2 || data.message.length < 20) {
    return {
      error: "Please provide your name and at least 20 characters of project details.",
    };
  }
  if (!EMAIL_PATTERN.test(data.email)) {
    return { error: "Please provide a valid email address." };
  }
  for (const [field, limit] of Object.entries(FIELD_LIMITS) as Array<
    [keyof ContactData, number]
  >) {
    const value = data[field];
    if (value.length > limit || CONTROL_CHARACTER_PATTERN.test(value)) {
      return { error: "One or more fields contain invalid or excessive text." };
    }
  }
  if (!PROJECT_TYPES.has(data.projectType)) {
    return { error: "Please select a valid project type." };
  }
  return { data, spam: false };
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const requestUrl = new URL(request.url);
    const forwardedHost = request.headers.get("x-forwarded-host");
    const expectedHost = forwardedHost || request.headers.get("host") || requestUrl.host;
    return new URL(origin).host.toLowerCase() === expectedHost.toLowerCase();
  } catch {
    return false;
  }
}

function isRateLimited(request: Request): boolean {
  const address =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const now = Date.now();
  const current = rateLimits.get(address);
  if (!current || current.resetAt <= now) {
    rateLimits.set(address, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[
        character
      ] || character,
  );
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json(
      { success: false, error: "Cross-site requests are not allowed." },
      { status: 403 },
    );
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Please submit the enquiry as JSON." },
      { status: 415 },
    );
  }
  if (Number(request.headers.get("content-length") || 0) > 16_384) {
    return NextResponse.json(
      { success: false, error: "The enquiry is too large." },
      { status: 413 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Please submit a valid enquiry." },
      { status: 400 },
    );
  }

  const result = validatePayload(payload);
  if ("error" in result) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }
  if (result.spam) return NextResponse.json({ success: true });
  if (isRateLimited(request)) {
    return NextResponse.json(
      { success: false, error: "Too many enquiries. Please wait and try again." },
      { status: 429 },
    );
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM?.trim();
  const smtpTo = process.env.SMTP_TO?.trim();
  if (
    !smtpHost ||
    !smtpUser ||
    !smtpPass ||
    !smtpFrom ||
    !smtpTo ||
    !Number.isInteger(smtpPort) ||
    smtpPort < 1 ||
    smtpPort > 65_535
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Email delivery is temporarily unavailable. Please contact us directly.",
      },
      { status: 503 },
    );
  }

  const data = result.data;
  const rows: Array<[string, string]> = [
    ["Name", data.name],
    ["Business / brand", data.businessName || "-"],
    ["Email", data.email],
    ["Phone", data.phone || "-"],
    ["City", data.city || "-"],
    ["Project type", data.projectType || "-"],
    ["Budget", data.budget || "-"],
  ];
  const plainText = [
    "New enquiry received.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
  ].join("\n");
  const htmlRows = rows
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`)
    .join("");

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: smtpFrom,
      to: smtpTo,
      replyTo: data.email,
      subject: `New vrikshcrafts enquiry from ${data.name.replace(/[\r\n]+/g, " ").slice(0, 100)}`,
      text: plainText,
      html: `<h2>New vrikshcrafts enquiry</h2>${htmlRows}<p><strong>Message:</strong></p><p>${escapeHtml(
        data.message,
      ).replace(/\n/g, "<br/>")}</p>`,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email delivery failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        success: false,
        error: "We could not send your enquiry. Please contact us directly.",
      },
      { status: 503 },
    );
  }
}
