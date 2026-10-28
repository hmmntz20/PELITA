// src/app/api/auth/register/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  RegisterSchema,
  hashPassword,
  createEmailVerificationToken,
  sendVerificationEmail,
  initializeDefaultUserResources,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid registration data.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { username, email, password } = parsed.data;

    // Cek apakah email sudah terdaftar (SRS-FR-AUTH-04: No Automatic Account Linking)
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.auth_method === "GOOGLE") {
        return NextResponse.json(
          {
            error:
              "An account with this email already exists via Google Sign-In. Automatic account linking is disabled; please sign in with Google.",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        {
          error:
            "An account with this email address is already registered. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    // Simpan akun lokal dengan email_verified = false & allow_external_ai = false (TC-01-01)
    await prisma.users.create({
      data: {
        id: userId,
        email,
        username,
        password_hash: passwordHash,
        auth_method: "LOCAL",
        email_verified: false,
        timezone: "Asia/Jakarta",
        theme: "LIGHT",
        allow_external_ai: false,
        nutrition_reminder: "19:00",
      },
    });

    await initializeDefaultUserResources(userId);

    const rawToken = await createEmailVerificationToken(userId);
    const mailResult = await sendVerificationEmail(email, username, rawToken);

    return NextResponse.json(
      {
        success: true,
        emailVerified: false,
        smtpSent: mailResult.sent,
        message: mailResult.sent
          ? "Account created! Please check your email inbox to verify your address before signing in."
          : mailResult.errorReason,
        // Disertakan hanya pada mode development lokal agar Anda dapat menguji klik verifikasi tanpa SMTP
        devVerifyUrl: process.env.NODE_ENV !== "production" ? mailResult.verifyUrl : undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating account." },
      { status: 500 }
    );
  }
}