import { prisma } from "@/lib/prisma";

export type SubscriptionTier = "NONE" | "STARTER" | "PRO" | "ELITE";

export interface SubscriptionStatus {
  isActive: boolean;
  tier: SubscriptionTier;
  expiresAt: Date | null;
}

/**
 * Check if a user has an active subscription
 */
export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      currentPeriodEnd: {
        gt: new Date(),
      },
    },
    orderBy: {
      currentPeriodEnd: "desc",
    },
  });

  if (!subscription) {
    return {
      isActive: false,
      tier: "NONE",
      expiresAt: null,
    };
  }

  return {
    isActive: true,
    tier: subscription.tier as SubscriptionTier,
    expiresAt: subscription.currentPeriodEnd,
  };
}

/**
 * Check if user has any active subscription (for middleware)
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const status = await getSubscriptionStatus(userId);
  return status.isActive;
}

/**
 * Create a mock subscription for testing (remove in production)
 */
export async function createTestSubscription(userId: string, tier: SubscriptionTier = "PRO") {
  const existingSubscription = await prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (existingSubscription) {
    return existingSubscription;
  }

  return await prisma.subscription.create({
    data: {
      userId,
      tier,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });
}

