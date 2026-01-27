export interface Entitlements {
  tier: "FREE" | "BASIC" | "PREMIUM";
  status: "active" | "pending" | "cancelled" | "expired";
  
  // Feature access
  canAccessWorkouts: boolean;
  canAccessChat: boolean;
  canAccessDietPlans: boolean;
  canGeneratePlans: boolean;
  
  // Limits
  dailyChatLimit: number | null; // null = unlimited
  monthlyPlanGenerations: number;
  
  // Usage tracking
  dailyChatUsed: number;
  monthlyGenerationsUsed: number;
  
  // Status info
  periodEnd?: Date;
  isInGracePeriod: boolean;
}

export const TIER_LIMITS = {
  FREE: {
    dailyChatLimit: 5,
    monthlyPlanGenerations: 1,
    canAccessDietPlans: false,
  },
  BASIC: {
    dailyChatLimit: 50,
    monthlyPlanGenerations: 4,
    canAccessDietPlans: false,
  },
  PREMIUM: {
    dailyChatLimit: null, // Unlimited
    monthlyPlanGenerations: 999, // Effectively unlimited
    canAccessDietPlans: true,
  },
} as const;

export function hasUnlimitedChat(entitlements: Entitlements): boolean {
  return entitlements.dailyChatLimit === null;
}

export function isWithinChatLimit(entitlements: Entitlements): boolean {
  if (hasUnlimitedChat(entitlements)) return true;
  return entitlements.dailyChatUsed < (entitlements.dailyChatLimit ?? 0);
}

export function getRemainingChats(entitlements: Entitlements): number | null {
  if (hasUnlimitedChat(entitlements)) return null;
  return Math.max(0, (entitlements.dailyChatLimit ?? 0) - entitlements.dailyChatUsed);
}
