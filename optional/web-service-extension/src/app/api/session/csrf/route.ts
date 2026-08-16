import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const token = randomBytes(32).toString("hex");
  const response = NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set("handbook_csrf", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60,
  });
  return response;
}
