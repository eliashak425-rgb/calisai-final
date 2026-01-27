import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/entitlements";
import Link from "next/link";
import { SettingsClient } from "./SettingsClient";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await requireAuth();
  const entitlements = await getUserEntitlements(user.id);

  // Check if user has a password (vs OAuth only)
  const userWithPassword = await prisma.user.findUnique({
    where: { id: user.id },
    select: { password: true },
  });
  const hasPassword = !!userWithPassword?.password;

  const profile = await prisma.trainingProfile.findFirst({
    where: { userId: user.id, isActive: true },
  });

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id, status: { in: ["ACTIVE", "PENDING"] } },
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none -z-10" />

        <h1 className="text-3xl font-display font-medium text-white mb-8">Settings</h1>

        <div className="space-y-6">
          {/* Profile Section - Now uses client component */}
          <SettingsClient 
            user={{ id: user.id, name: user.name, email: user.email }}
            hasPassword={hasPassword}
          />

          {/* Subscription Section */}
          <div className="card-interactive p-6">
            <h2 className="text-lg font-display font-medium text-white mb-4">Subscription</h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    entitlements.tier === "FREE"
                      ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      : entitlements.tier === "BASIC"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {entitlements.tier}
                  </span>
                  {entitlements.status === "active" && (
                    <span className="text-xs text-emerald-400">Active</span>
                  )}
                </div>
                {entitlements.periodEnd && (
                  <div className="text-sm text-slate-500 mt-1">
                    Renews {new Date(entitlements.periodEnd).toLocaleDateString()}
                  </div>
                )}
              </div>
              {entitlements.tier === "FREE" ? (
                <Link
                  href="/#pricing"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Upgrade
                </Link>
              ) : (
                <a 
                  href="mailto:support@calisai.com?subject=Cancel Subscription"
                  className="text-sm text-slate-400 hover:text-white"
                >
                  Manage Subscription
                </a>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-2xl font-display font-medium text-white">
                  {entitlements.dailyChatLimit === null ? "∞" : entitlements.dailyChatLimit - entitlements.dailyChatUsed}
                </div>
                <div className="text-xs text-slate-500">Chats remaining today</div>
              </div>
              <div>
                <div className="text-2xl font-display font-medium text-white">
                  {entitlements.monthlyPlanGenerations - entitlements.monthlyGenerationsUsed}
                </div>
                <div className="text-xs text-slate-500">Plan generations left</div>
              </div>
              <div>
                <div className="text-2xl font-display font-medium text-white">
                  {entitlements.canAccessDietPlans ? "✓" : "✕"}
                </div>
                <div className="text-xs text-slate-500">Diet plans access</div>
              </div>
            </div>
          </div>

          {/* Training Profile Section */}
          <div className="card-interactive p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-medium text-white">Training Profile</h2>
              <Link
                href="/assessment"
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                Update Assessment
              </Link>
            </div>
            {profile ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500">Fitness Level</div>
                  <div className="text-white capitalize">{profile.fitnessLevel}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Primary Goal</div>
                  <div className="text-white capitalize">{profile.goalPrimary.replace("_", " ")}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Training Days</div>
                  <div className="text-white">{profile.daysPerWeek} per week</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Session Duration</div>
                  <div className="text-white">{profile.sessionDurationMin} minutes</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 mb-4">No profile yet. Complete your assessment to get started.</p>
                <Link href="/assessment" className="btn-primary text-sm">
                  Start Assessment
                </Link>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card-interactive border-red-500/20 p-6">
            <h2 className="text-lg font-display font-medium text-red-400 mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white">Delete Account</div>
                <div className="text-sm text-slate-500">Permanently delete your account and all data</div>
              </div>
              <a 
                href="mailto:support@calisai.com?subject=Delete Account Request"
                className="px-4 py-2 border border-red-500/30 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Request Deletion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
