
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const cookieName = "portfolio_admin";

function sign(value: string): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return createHmac("sha256", secret)
    .update(value)
    .digest("hex");
}

export function makeToken(email: string): string {
  const payload = `${email.trim().toLowerCase()}:${Date.now() + 12 * 60 * 60 * 1000}`;
  const encoded = Buffer.from(payload, "utf8").toString("base64url");

  return `${encoded}.${sign(payload)}`;
}

export function verifyToken(token?: string): boolean {
  const secret = process.env.AUTH_SECRET;

  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [encoded, signature] = parts;

  try {
    const payload = Buffer.from(encoded, "base64url").toString("utf8");
    const expected = sign(payload);

    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expected, "utf8");

    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return false;
    }

    const separator = payload.lastIndexOf(":");
    if (separator < 1) return false;

    const email = payload.slice(0, separator);
    const expires = Number(payload.slice(separator + 1));

    return (
      Boolean(email) &&
      Number.isFinite(expires) &&
      expires > Date.now()
    );
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(cookieName)?.value);
}
