import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";

function validateToken(token?: string): string {
  const secret = process.env.AUTH_SECRET;

  if (!token) return "COOKIE_MISSING";
  if (!secret) return "AUTH_SECRET_MISSING";

  const parts = token.split(".");
  if (parts.length !== 2) return "INVALID_TOKEN_FORMAT";

  const [encoded, signature] = parts;

  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");

    const expected = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expected, "utf8");

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return "SIGNATURE_MISMATCH";
    }

    const separator = payload.lastIndexOf(":");
    if (separator < 1) return "INVALID_PAYLOAD";

    const email = payload.slice(0, separator);
    const expires = Number(payload.slice(separator + 1));

    if (!email || !Number.isFinite(expires)) {
      return "INVALID_PAYLOAD";
    }

    if (expires <= Date.now()) return "TOKEN_EXPIRED";

    return "VALID";
  } catch (error) {
    console.error("[Admin Auth] Token validation exception:", error);
    return "TOKEN_VALIDATION_ERROR";
  }
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/api/admin/login" || path === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("portfolio_admin")?.value;
  const result = validateToken(token);

  if (path.startsWith("/api/admin/") && result !== "VALID") {
    console.warn(`[Admin Auth] ${result} | ${path}`);

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (path.startsWith("/admin/") && result !== "VALID") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};