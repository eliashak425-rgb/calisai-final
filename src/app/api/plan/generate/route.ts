import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWorkoutPlan } from "@/services/openai/planGenerator";
import type { TrainingProfile } from "@/types/assessment";
import { getActiveSubscription } from "@/lib/session";

export async function POST() {
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

    // Get the user's active training profile
    let profile = await prisma.trainingProfile.findFirst({
      where: { userId: session.user.id, isActive: true },
    });

    // If no profile exists, create a default beginner profile
    if (!profile) {
      profile = await prisma.trainingProfile.create({
        data: {
          userId: session.user.id,
          version: 1,
          isActive: true,
          age: 25,
          biologicalSex: "male",
          heightCm: 175,
          weightKg: 70,
          trainingAge: "beginner",
          daysPerWeek: 3,
          sessionDurationMin: 45,
          preferredTime: "morning",
          trainingLocation: "home",
          equipment: JSON.stringify({ pull_up_bar: false, dip_station: false, rings: false, parallettes: false, resistance_bands: false }),
          goalPrimary: "general_fitness",
          hasCurrentPain: false,
          painAreas: "[]",
          avoidTags: "[]",
          maxPushups: "5",
          maxPullups: "0",
          maxDips: "0",
          plankHoldSec: 30,
          hollowHoldSec: "10",
          wallHandstandHoldSec: "0",
          fitnessLevel: "beginner",
          flags: "[]",
        },
      });
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

