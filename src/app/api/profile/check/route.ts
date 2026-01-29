import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ hasProfile: false }, { status: 401 });
    }

    const profile = await prisma.trainingProfile.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      select: { id: true },
    });

    return NextResponse.json({ hasProfile: !!profile });
  } catch (error) {
    console.error("Profile check error:", error);
    return NextResponse.json({ hasProfile: false }, { status: 500 });
  }
}

