import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayType: string;
  totalDurationMin: number;
  blocks: {
    id: string;
    blockType: string;
    durationMin: number;
    exercises: {
      id: string;
      exerciseId: string;
      sets: number;
      reps: string;
      notes: string | null;
      exercise: {
        name: string;
        slug: string;
      } | null;
    }[];
  }[];
}

export default async function PlanPage() {
  const user = await requireAuth();

  // Check subscription status
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
      status: "ACTIVE",
      currentPeriodEnd: { gt: new Date() },
    },
  });

  if (!subscription) {
    redirect("/subscribe");
  }

  const plan = await prisma.workoutPlan.findFirst({
    where: { userId: user.id, isActive: true },
    include: {
      days: {
        orderBy: { dayNumber: "asc" },
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
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // Get completed workouts
  const completedWorkouts = await prisma.workoutLog.findMany({
    where: { userId: user.id },
    select: { dayId: true, completedAt: true },
  });

  const completedDayIds = new Set(completedWorkouts.map(w => w.dayId));

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-3">No Active Plan</h1>
          <p className="text-neutral-400 mb-8">Complete your assessment to get a personalized workout plan.</p>
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all"
          >
            Start Assessment
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalDays = plan.days.length;
  const completedDays = plan.days.filter(d => completedDayIds.has(d.id)).length;
  const progressPercent = Math.round((completedDays / totalDays) * 100);
  const trainingDays = plan.days.filter(d => d.dayType !== "rest");
  const totalExercises = plan.days.reduce((acc, day) => 
    acc + day.blocks.reduce((blockAcc, block) => blockAcc + block.exercises.length, 0), 0
  );

  // Find next uncompleted day (first unlocked but not completed)
  const nextDay = plan.days.find(d => !completedDayIds.has(d.id) && d.dayType !== "rest");
  const currentDayNumber = nextDay?.dayNumber || 1;

  // Week calculation for calendar
  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <main className="max-w-lg lg:max-w-2xl mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </div>
            <div>
              <span className="text-lg lg:text-xl font-semibold tracking-tight">
                Hey, {user.name?.split(" ")[0] || "Athlete"}!
              </span>
              <p className="text-xs text-neutral-400 hidden lg:block">Ready to crush today&apos;s workout?</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/settings"
              className="w-10 h-10 lg:w-11 lg:h-11 flex items-center justify-center rounded-full ring-1 ring-neutral-800 bg-neutral-900/80 hover:bg-neutral-800/80 transition-colors"
            >
              <svg className="w-5 h-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </Link>
          </div>
        </header>

        {/* Week Calendar */}
        <section className="overflow-x-auto pb-2">
          <div className="flex gap-3 text-center min-w-max px-1">
            {weekDays.map((day, i) => {
              const date = new Date(today);
              date.setDate(today.getDate() - dayOfWeek + i);
              const dateNum = date.getDate();
              const isToday = i === dayOfWeek;
              const isPast = i < dayOfWeek;
              
              return (
                <div key={day} className="flex flex-col gap-2 w-12 lg:w-14">
                  <span className={`text-xs font-medium ${isToday ? "text-emerald-400" : "text-neutral-500"}`}>
                    {day}
                  </span>
                  <div className={`flex items-center justify-center w-full aspect-square rounded-xl text-sm transition-colors ${
                    isToday
                      ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 font-semibold shadow-lg shadow-emerald-500/25"
                      : isPast
                      ? "bg-emerald-500/10 ring-1 ring-emerald-500/50"
                      : "ring-1 ring-neutral-800 hover:ring-neutral-700"
                  }`}>
                    {isPast && !isToday ? (
                      <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      dateNum
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Today's Workout Card */}
        {nextDay && (
          <TodayWorkoutCard 
            day={nextDay as WorkoutDay} 
            dayNumber={currentDayNumber}
            totalDays={totalDays}
            completedDays={completedDays}
          />
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4 lg:gap-5">
          <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 lg:p-6 shadow-xl ring-1 ring-neutral-800 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
              </svg>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold leading-none tracking-tight">
                {completedDays}<span className="text-base font-medium text-neutral-400">/{totalDays}</span>
              </p>
              <p className="text-xs text-neutral-400 mt-2">Workouts completed</p>
              <div className="flex items-center gap-1 mt-1">
                <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 7h6v6M22 7l-8.5 8.5-5-5L2 17" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs text-emerald-400 font-medium">{progressPercent}% complete</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-5 lg:p-6 shadow-xl ring-1 ring-neutral-800 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <svg className="w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <p className="text-3xl lg:text-4xl font-bold leading-none tracking-tight">
                {plan.totalWeeklyVolume}<span className="text-base font-medium text-neutral-400"> sets</span>
              </p>
              <p className="text-xs text-neutral-400 mt-2">Weekly volume</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-violet-400 font-medium">{trainingDays.length} training days</span>
              </div>
            </div>
          </div>
        </section>

        {/* Program Progress */}
        <section className="rounded-2xl ring-1 ring-neutral-800 bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 p-5 lg:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978M18 9h1.5a1 1 0 0 0 0-5H18M4 22h16M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zM6 9H4.5a1 1 0 0 1 0-5H6"/>
              </svg>
              <p className="text-sm font-semibold">Your Training Program</p>
            </div>
            <p className="text-lg lg:text-xl font-bold tracking-tight">
              Day <span className="text-emerald-400">{currentDayNumber}</span>
              <span className="text-neutral-400 font-medium">/{totalDays}</span>
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{completedDays} workouts completed</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-neutral-700/80 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>Valid until {new Date(plan.validUntil).toLocaleDateString()}</span>
              <Link href="/plan/generate" className="text-emerald-400 hover:text-emerald-300">
                Regenerate →
              </Link>
            </div>
          </div>
        </section>

        {/* All Days List */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">All Training Days</h2>
          <div className="space-y-2">
            {plan.days.map((day, index) => {
              const isCompleted = completedDayIds.has(day.id);
              const isLocked = index > 0 && !completedDayIds.has(plan.days[index - 1].id) && !isCompleted;
              const isRest = day.dayType === "rest";
              const exerciseCount = day.blocks.reduce((acc, b) => acc + b.exercises.length, 0);
              
              return (
                <DayCard 
                  key={day.id}
                  day={day as WorkoutDay}
                  dayIndex={index}
                  isCompleted={isCompleted}
                  isLocked={isLocked}
                  isRest={isRest}
                  exerciseCount={exerciseCount}
                />
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

function TodayWorkoutCard({ day, dayNumber, totalDays, completedDays }: { 
  day: WorkoutDay;
  dayNumber: number;
  totalDays: number;
  completedDays: number;
}) {
  const exerciseCount = day.blocks.reduce((acc, b) => acc + b.exercises.length, 0);
  const firstExercises = day.blocks.flatMap(b => b.exercises).slice(0, 3);
  
  return (
    <section className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-6 lg:p-7 space-y-5 shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      
      <div className="relative flex items-start gap-4 lg:gap-5">
        <div className="w-20 h-24 lg:w-24 lg:h-28 rounded-xl bg-white/10 flex items-center justify-center">
          <svg className="w-10 h-10 lg:w-12 lg:h-12 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M7 3v3M17 3v3M7 18v3M17 18v3" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-white/90 tracking-wider">
              Day {dayNumber} • Week {Math.ceil(dayNumber / 7)}
            </span>
            <svg className="w-3 h-3 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>
            </svg>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight capitalize">
            {day.dayType.replace("_", " ")} Day
          </h2>
          <p className="text-sm text-white/80 mt-1 lg:mt-2">
            {firstExercises.map(e => e.exercise?.name || "Exercise").join(", ")}
            {exerciseCount > 3 && ` +${exerciseCount - 3} more`}
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-between pt-2 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-white/90">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{day.totalDurationMin} min</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/90">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
          <span>{exerciseCount} exercises</span>
        </div>
      </div>

      <Link
        href={`/plan/${day.id}`}
        className="relative block w-full py-3 text-center bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl font-semibold transition-all"
      >
        Start Workout
      </Link>
    </section>
  );
}

function DayCard({ day, dayIndex, isCompleted, isLocked, isRest, exerciseCount }: {
  day: WorkoutDay;
  dayIndex: number;
  isCompleted: boolean;
  isLocked: boolean;
  isRest: boolean;
  exerciseCount: number;
}) {
  const content = (
    <div className={`rounded-xl p-4 transition-all ${
      isCompleted
        ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
        : isLocked
        ? "bg-neutral-900/50 ring-1 ring-neutral-800 opacity-50"
        : isRest
        ? "bg-neutral-900/50 ring-1 ring-neutral-800"
        : "bg-neutral-900 ring-1 ring-neutral-800 hover:ring-neutral-700"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isCompleted
              ? "bg-emerald-500 text-white"
              : isLocked
              ? "bg-neutral-800 text-neutral-600"
              : isRest
              ? "bg-violet-500/20 text-violet-400"
              : "bg-neutral-800 text-neutral-300"
          }`}>
            {isCompleted ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : isLocked ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            ) : isRest ? (
              <span className="text-lg">🧘</span>
            ) : (
              <span className="font-semibold text-sm">{dayIndex + 1}</span>
            )}
          </div>
          <div>
            <h3 className={`font-medium ${isCompleted ? "text-emerald-400" : isLocked ? "text-neutral-500" : "text-white"}`}>
              Day {dayIndex + 1} {isRest ? "• Rest" : `• ${day.dayType.replace("_", " ")}`}
            </h3>
            <p className="text-xs text-neutral-500">
              {isRest ? "Recovery day" : `${exerciseCount} exercises • ${day.totalDurationMin} min`}
            </p>
          </div>
        </div>
        {!isRest && !isLocked && (
          <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  );

  if (isLocked || isRest) {
    return content;
  }

  return (
    <Link href={`/plan/${day.id}`}>
      {content}
    </Link>
  );
}
