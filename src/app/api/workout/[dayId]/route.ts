import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getActiveSubscription } from "@/lib/session";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dayId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check for active subscription
    const subscription = await getActiveSubscription(session.user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription required", code: "SUBSCRIPTION_REQUIRED" },
        { status: 403 }
      );
    }

    const { dayId } = await params;

    const workoutDay = await prisma.workoutDay.findFirst({
      where: {
        id: dayId,
        plan: {
          userId: session.user.id,
        },
      },
      include: {
        blocks: {
          orderBy: { orderIndex: "asc" },
          include: {
            exercises: {
              orderBy: { orderIndex: "asc" },
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    difficulty: true,
                    movementPattern: true,
                    primaryMuscles: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!workoutDay) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    return NextResponse.json(workoutDay);
  } catch (error) {
    console.error("Get workout error:", error);
    return NextResponse.json(
      { error: "Failed to get workout" },
      { status: 500 }
    );
  }
}

