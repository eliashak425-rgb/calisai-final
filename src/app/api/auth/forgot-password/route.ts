import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists (but don't reveal this to the client for security)
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // In a real app, you would:
      // 1. Generate a secure reset token
      // 2. Save it to the database with an expiry
      // 3. Send an email with the reset link
      
      // For now, we'll just log it (replace with actual email sending)
      console.log(`Password reset requested for: ${email}`);
      
      // TODO: Implement email sending
      // await sendPasswordResetEmail(user.email, resetToken);
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      message: "If an account exists, reset instructions have been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

