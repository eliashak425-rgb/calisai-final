import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWorkoutPlan } from "@/services/openai/planGenerator";
import type { TrainingProfile } from "@/types/assessment";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's active training profile
    const profile = await prisma.trainingProfile.findFirst({
      where: { userId: session.user.id, isActive: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "No active profile. Please complete the assessment first." },
        { status: 400 }
      );
    }

    // Check if there's already an active plan
    const existingPlan = await prisma.workoutPlan.findFirst({
      where: { userId: session.user.id, isActive: true },
    });

    if (existingPlan) {
      // Return existing plan instead of generating new one
      return NextResponse.json({
        success: true,
        planId: existingPlan.id,
        source: "existing",
      });
    }

    // Convert Prisma model to TrainingProfile type
    // Note: This uses a legacy conversion until the data model is fully migrated
    const trainingProfile = profile as unknown as TrainingProfile;

    // Generate the plan
    const { plan, source } = await generateWorkoutPlan(trainingProfile);

    // Record AI usage if applicable
    if (source === "ai") {
      await prisma.aiUsageLog.upsert({
        where: {
          userId_date_endpoint: {
            userId: session.user.id,
            date: new Date().toISOString().split("T")[0],
            endpoint: "plan_generation",
          },
        },
        update: {
          requestCount: { increment: 1 },
          // Estimate tokens - actual tracking would need response metrics
          promptTokens: { increment: 1500 },
          completionTokens: { increment: 3000 },
          totalTokens: { increment: 4500 },
          estimatedCostUsd: { increment: 0.05 },
        },
        create: {
          userId: session.user.id,
          date: new Date().toISOString().split("T")[0],
          endpoint: "plan_generation",
          requestCount: 1,
          promptTokens: 1500,
          completionTokens: 3000,
          totalTokens: 4500,
          estimatedCostUsd: 0.05,
        },
      });
    }

    return NextResponse.json({
      success: true,
      planId: plan.id,
      source,
    });
  } catch (error) {
    console.error("Plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}

