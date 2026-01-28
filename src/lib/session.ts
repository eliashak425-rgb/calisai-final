import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

/**
 * Get the current session on the server side
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use this in server components that require authentication
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session.user;
}

/**
 * Get user ID from session
 * Throws if not authenticated
 */
export async function requireUserId(): Promise<string> {
  const user = await requireAuth();
  return user.id;
}

/**
 * Require active subscription - redirects to paywall if not subscribed
 * Use this in server components that require a paid subscription
 */
export async function requireSubscription() {
  const user = await requireAuth();
  
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      currentPeriodEnd: { gt: new Date() },
    },
  });

  if (!subscription) {
    // Check if user ever had a subscription (expired)
    const expiredSub = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ["ACTIVE", "CANCELLED", "EXPIRED"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (expiredSub) {
      redirect("/paywall?expired=true");
    }
    
    redirect("/paywall");
  }

  return { user, subscription };
}

/**
 * Check if user has an active subscription (non-throwing version)
 * Returns subscription or null
 */
export async function getActiveSubscription(userId: string) {
  return await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      currentPeriodEnd: { gt: new Date() },
    },
  });
}

