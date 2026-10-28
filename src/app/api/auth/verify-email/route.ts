// src/app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sha256Hash } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawToken = searchParams.get("token");

  if (!rawToken) {
    return NextResponse.redirect(
      new URL("/sign-in?error=Missing+verification+token", request.url)
    );
  }

  const tokenHash = sha256Hash(rawToken);
  const tokenRecord = await prisma.verification_tokens.findUnique({
    where: { token_hash: tokenHash },
  });

  if (!tokenRecord || tokenRecord.purpose !== "EMAIL_VERIFY") {
    return NextResponse.redirect(
      new URL("/sign-in?error=Invalid+verification+token", request.url)
    );
  }

  if (tokenRecord.consumed_at) {
    return NextResponse.redirect(
      new URL(
        "/sign-in?error=This+verification+link+has+already+been+used",
        request.url
      )
    );
  }

  if (tokenRecord.expires_at < new Date()) {
    return NextResponse.redirect(
      new URL(
        "/sign-in?error=Verification+link+has+expired.+Please+request+a+new+one",
        request.url
      )
    );
  }

  await prisma.$transaction([
    prisma.users.update({
      where: { id: tokenRecord.user_id },
      data: { email_verified: true },
    }),
    prisma.verification_tokens.update({
      where: { id: tokenRecord.id },
      data: { consumed_at: new Date() },
    }),
  ]);

  return NextResponse.redirect(
    new URL(
      "/sign-in?verified=1&message=Email+verified+successfully.+You+can+now+sign+in.",
      request.url
    )
  );
}