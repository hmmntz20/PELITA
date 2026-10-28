// src/app/api/auth/google/callback/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createUserSession,
  initializeDefaultUserResources,
} from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=Google+Sign-In+was+cancelled", request.url)
    );
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${appUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(
        new URL("/sign-in?error=Failed+to+exchange+Google+OAuth+token", request.url)
      );
    }

    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const profile = await profileRes.json();
    const email = (profile.email as string | undefined)?.toLowerCase();
    const displayName = (profile.name as string | undefined) || "Google User";

    if (!email) {
      return NextResponse.redirect(
        new URL("/sign-in?error=Could+not+retrieve+email+from+Google", request.url)
      );
    }

    if (profile.verified_email !== true) {
      return NextResponse.redirect(
        new URL(
          "/sign-in?error=Google+did+not+confirm+a+verified+email+address",
          request.url
        )
      );
    }

    let user = await prisma.users.findUnique({ where: { email } });

    // Penegakan SRS-FR-AUTH-04 & TC-02-03: Tolak penggabungan akun otomatis jika email sudah terdaftar sebagai akun LOCAL
    if (user && user.auth_method === "LOCAL") {
      return NextResponse.redirect(
        new URL(
          "/sign-in?error=An+account+with+this+email+already+exists+as+a+Local+Account.+Automatic+account+linking+is+disabled;+please+sign+in+with+your+email+and+password.",
          request.url
        )
      );
    }

    // Jika akun Google belum ada di database, buat akun baru dengan auth_method = GOOGLE
    if (!user) {
      const newUserId = crypto.randomUUID();
      user = await prisma.users.create({
        data: {
          id: newUserId,
          email,
          username: displayName.slice(0, 50),
          password_hash: null,
          auth_method: "GOOGLE",
          email_verified: true,
          timezone: "Asia/Jakarta",
          theme: "LIGHT",
          allow_external_ai: false,
          nutrition_reminder: "19:00",
        },
      });

      await initializeDefaultUserResources(newUserId);
    }

    await createUserSession(user.id);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("[GET /api/auth/google/callback] Error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=Google+Sign-In+failed+due+to+server+error", request.url)
    );
  }
}