import { prisma } from "@/lib/prisma";
import type { Entitlements } from "@/types/entitlements";
import { TIER_LIMITS } from "@/types/entitlements";

export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  // Get active subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "PENDING"] },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get today's AI usage
  const today = new Date().toISOString().split("T")[0];
  const chatUsage = await prisma.aiUsageLog.findFirst({
    where: {
      userId,
      date: today,
      endpoint: "chat",
    },
  });

  // Get this month's plan generations
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const planGenerations = await prisma.aiUsageLog.aggregate({
    where: {
      userId,
      endpoint: "plan_generation",
      createdAt: { gte: startOfMonth },
    },
    _sum: { requestCount: true },
  });

  // Determine tier
  let tier: "FREE" | "BASIC" | "PREMIUM" = "FREE";
  let status: "active" | "pending" | "cancelled" | "expired" = "active";
  let periodEnd: Date | undefined;
  let isInGracePeriod = false;

  if (subscription) {
    tier = subscription.tier as "BASIC" | "PREMIUM";
    status = subscription.status.toLowerCase() as "active" | "pending" | "cancelled" | "expired";
    periodEnd = subscription.currentPeriodEnd || undefined;

    // Check grace period
    if (subscription.gracePeriodEnd && new Date() < subscription.gracePeriodEnd) {
      isInGracePeriod = true;
    }
  }

  const limits = TIER_LIMITS[tier];

  return {
    tier,
    status,
    canAccessWorkouts: true, // All tiers
    canAccessChat: true, // All tiers (with limits)
    canAccessDietPlans: limits.canAccessDietPlans,
    canGeneratePlans: true, // All tiers (with limits)
    dailyChatLimit: limits.dailyChatLimit,
    monthlyPlanGenerations: limits.monthlyPlanGenerations,
    dailyChatUsed: chatUsage?.requestCount || 0,
    monthlyGenerationsUsed: planGenerations._sum.requestCount || 0,
    periodEnd,
    isInGracePeriod,
  };
}

export async function checkChatLimit(userId: string): Promise<{ allowed: boolean; remaining: number | null }> {
  const entitlements = await getUserEntitlements(userId);

  if (entitlements.dailyChatLimit === null) {
    return { allowed: true, remaining: null };
  }

  const remaining = entitlements.dailyChatLimit - entitlements.dailyChatUsed;
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

export async function checkPlanGenerationLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  const entitlements = await getUserEntitlements(userId);
  const remaining = entitlements.monthlyPlanGenerations - entitlements.monthlyGenerationsUsed;

  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining),
  };
}

export async function recordChatUsage(userId: string, tokens: number): Promise<void> {
  const today = new Date().toISOString().split("T")[0];

  await prisma.aiUsageLog.upsert({
    where: {
      userId_date_endpoint: {
        userId,
        date: today,
        endpoint: "chat",
      },
    },
    update: {
      requestCount: { increment: 1 },
      totalTokens: { increment: tokens },
      promptTokens: { increment: Math.floor(tokens * 0.3) },
      completionTokens: { increment: Math.floor(tokens * 0.7) },
      estimatedCostUsd: { increment: tokens * 0.00001 },
    },
    create: {
      userId,
      date: today,
      endpoint: "chat",
      requestCount: 1,
      totalTokens: tokens,
      promptTokens: Math.floor(tokens * 0.3),
      completionTokens: Math.floor(tokens * 0.7),
      estimatedCostUsd: tokens * 0.00001,
    },
  });
}

