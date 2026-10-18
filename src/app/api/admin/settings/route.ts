
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const allowedFields = [
  "siteTitle",
  "tagline",
  "logoUrl",
  "profileUrl",
  "seoTitle",
  "seoDescription",
  "primaryColor",
  "backgroundColor",
  "navText",
  "footerText",
  "contactEmail",
  "contactLocation",
] as const;

export async function GET() {
  try {
    const settings = await db.siteSettings.upsert({
      where: { id: "main" },
      create: { id: "main" },
      update: {},
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json(
      { error: "Unable to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const input = body?.settings ?? body;

    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    const data = Object.fromEntries(
      allowedFields
        .filter((key) => key in input)
        .map((key) => [key, input[key]])
    );

    const settings = await db.siteSettings.upsert({
      where: { id: "main" },
      create: { id: "main", ...data },
      update: data,
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("PUT settings error:", error);

    return NextResponse.json(
      { error: "Unable to save settings. Check the server terminal." },
      { status: 500 }
    );
  }
}
