// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  LoginSchema,
  verifyPassword,
  createUserSession,
  createEmailVerificationToken,
  sendVerificationEmail,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid credentials." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // Tolak jika email terdaftar sebagai akun GOOGLE (SRS-FR-AUTH-04 / TC-02-03)
    if (user.auth_method === "GOOGLE" || !user.password_hash) {
      return NextResponse.json(
        {
          code: "AUTH_METHOD_CONFLICT",
          error:
            "An account with this email already exists via Google Sign-In. Please sign in with Google.",
        },
        { status: 409 }
      );
    }

    const isPasswordValid = verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    // Blokir login jika email akun lokal belum diverifikasi (SRS-FR-AUTH-02 / TC-01-02)
    if (!user.email_verified) {
      const rawToken = await createEmailVerificationToken(user.id);
      const mailResult = await sendVerificationEmail(user.email, user.username, rawToken);

      return NextResponse.json(
        {
          code: "EMAIL_NOT_VERIFIED",
          error: mailResult.sent
            ? "Please verify your email address before signing in."
            : mailResult.errorReason ||
              "Your email is not verified and the verification email could not be sent. Please try again later.",
          devVerifyUrl:
            !mailResult.sent && process.env.NODE_ENV !== "production"
              ? mailResult.verifyUrl
              : undefined,
        },
        { status: 403 }
      );
    }

    await createUserSession(user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("[POST /api/auth/login] Error:", error);
    return NextResponse.json(
      { error: "Internal server error while signing in." },
      { status: 500 }
    );
  }
}