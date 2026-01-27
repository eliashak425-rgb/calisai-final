import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DashboardClient } from "./DashboardClient";
import { Logo } from "@/components/ui/Logo";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await requireAuth();

  // Get user's active profile
  const profile = await prisma.trainingProfile.findFirst({
    where: { userId: user.id, isActive: true },
  });

  // Get user's active plan
  const plan = await prisma.workoutPlan.findFirst({
    where: { userId: user.id, isActive: true },
    include: {
      days: {
        orderBy: { dayNumber: "asc" },
      },
    },
  });

  // If no profile, redirect to assessment
  if (!profile) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none -z-10" />
          
          <div className="text-center py-20">
            <Logo size="lg" className="justify-center mb-8" />
            <h1 className="text-4xl font-display font-medium text-white mb-4">Welcome to CalisAI</h1>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
              Let&apos;s get started by learning about your fitness level, goals, and available equipment.
            </p>
            <Link
              href="/assessment"
              className="btn-primary inline-flex items-center gap-2 text-base"
            >
              Start Assessment
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayWorkout = plan?.days.find((d) => d.dayNumber === (dayOfWeek === 0 ? 7 : dayOfWeek));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_60%)] pointer-events-none -z-10" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-400 text-sm mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Training Active
          </div>
          <h1 className="text-4xl font-display font-medium text-white mb-2">
            Welcome back, <span className="gradient-text">{user.name || "Athlete"}</span>
          </h1>
          <p className="text-slate-400 text-lg">
            {plan ? "Ready to crush today's workout?" : "Your personalized plan is waiting to be created."}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-interactive p-5">
            <div className="text-sm text-slate-500 mb-1">Fitness Level</div>
            <div className="text-xl font-display font-semibold capitalize text-emerald-400">
              {profile.fitnessLevel}
            </div>
          </div>
          <div className="card-interactive p-5">
            <div className="text-sm text-slate-500 mb-1">Training Days</div>
            <div className="text-xl font-display font-semibold text-white">
              {profile.daysPerWeek}<span className="text-slate-500 text-base font-normal">/week</span>
            </div>
          </div>
          <div className="card-interactive p-5">
            <div className="text-sm text-slate-500 mb-1">Session Length</div>
            <div className="text-xl font-display font-semibold text-white">
              {profile.sessionDurationMin}<span className="text-slate-500 text-base font-normal"> min</span>
            </div>
          </div>
          <div className="card-interactive p-5">
            <div className="text-sm text-slate-500 mb-1">Primary Goal</div>
            <div className="text-xl font-display font-semibold capitalize text-white">
              {profile.goalPrimary.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Today's Workout or Generate Plan */}
        {!plan ? (
          <div className="card-interactive p-8 text-center mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707" strokeLinecap="round"/>
                  <path d="M12 8a4 4 0 104 4" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-display font-medium text-white mb-3">Ready to Generate Your Plan?</h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                CalisAI will create a personalized calisthenics program based on your assessment.
              </p>
              <Link href="/plan/generate" className="btn-primary inline-flex items-center gap-2">
                Generate My Plan
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Today's Workout Card */}
            <div className="card-interactive card-glow p-6 mb-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4 relative">
                <h2 className="text-xl font-display font-medium text-white">Today&apos;s Workout</h2>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
                  todayWorkout?.dayType === "rest"
                    ? "bg-slate-800 text-slate-400"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {todayWorkout ? todayWorkout.dayType.replace("_", " ") : "REST DAY"}
                </span>
              </div>
              
              {todayWorkout && todayWorkout.dayType !== "rest" ? (
                <div className="space-y-4 relative">
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      {todayWorkout.totalDurationMin} min
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="capitalize">{todayWorkout.dayType.replace("_", " ")} Focus</span>
                  </div>
                  <Link
                    href={`/workout/${todayWorkout.id}`}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Start Workout
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 relative">
                  <div className="text-5xl mb-4">🧘</div>
                  <p className="text-slate-400 text-lg">
                    It&apos;s a rest day! Focus on recovery, mobility, or light activity.
                  </p>
                </div>
              )}
            </div>

            {/* Week Overview */}
            <div className="card-interactive p-6 mb-8">
              <h2 className="text-xl font-display font-medium text-white mb-4">This Week</h2>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                  const dayNum = index + 1;
                  const workout = plan.days.find((d) => d.dayNumber === dayNum);
                  const isToday = dayOfWeek === (dayNum === 7 ? 0 : dayNum);
                  
                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-xl text-center transition-all cursor-pointer hover:scale-105 ${
                        isToday
                          ? "bg-emerald-500/20 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20"
                          : "bg-white/[0.02] border border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div className={`text-xs font-medium ${isToday ? "text-emerald-400" : "text-slate-500"}`}>
                        {day}
                      </div>
                      <div className={`text-xl mt-1 ${isToday ? "text-white" : "text-slate-400"}`}>
                        {workout ? (
                          workout.dayType === "rest" ? "🧘" : "💪"
                        ) : (
                          "🧘"
                        )}
                      </div>
                      {workout && workout.dayType !== "rest" && (
                        <div className="text-[10px] text-slate-500 mt-1 capitalize truncate">
                          {workout.dayType.replace("_", " ")}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { href: "/exercises", icon: "📖", title: "Exercise Library", desc: "Browse all exercises" },
            { href: "/chat", icon: "💬", title: "AI Coach", desc: "Ask questions" },
            { href: "/plan", icon: "📋", title: "My Plan", desc: "View full program" },
            { href: "/settings", icon: "⚙️", title: "Settings", desc: "Manage account" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card-interactive p-5 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
              <div className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                {item.title}
              </div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div>
          <h2 className="text-xl font-display font-medium text-white mb-6">Your Progress</h2>
          <DashboardClient />
        </div>
      </div>
    </div>
  );
}
