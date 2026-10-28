// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, sha256Hash } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (rawToken) {
    const tokenHash = sha256Hash(rawToken);
    await prisma.user_sessions.updateMany({
      where: { token_hash: tokenHash, revoked_at: null },
      data: { revoked_at: new Date() },
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true, redirectTo: "/sign-in" });
}