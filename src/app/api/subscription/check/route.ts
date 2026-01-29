import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ hasSubscription: false }, { status: 401 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        currentPeriodEnd: { gt: new Date() },
      },
      select: { 
        id: true, 
        tier: true,
        currentPeriodEnd: true,
      },
    });

    if (subscription) {
      return NextResponse.json({ 
        hasSubscription: true, 
        tier: subscription.tier,
        expiresAt: subscription.currentPeriodEnd,
      });
    }

    return NextResponse.json({ hasSubscription: false });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ hasSubscription: false }, { status: 500 });
  }
}

