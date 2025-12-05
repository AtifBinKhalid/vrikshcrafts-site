import { NextResponse } from "next/server";

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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling contact form:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error while submitting enquiry.",
      },
      { status: 500 }
    );
  }
}
