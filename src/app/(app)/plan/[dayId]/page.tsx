import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ dayId: string }>;
}

export default async function DayPreviewPage({ params }: PageProps) {
  const user = await requireAuth();
  const { dayId } = await params;

  // Check subscription
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

  // Get the workout day
  const workoutDay = await prisma.workoutDay.findFirst({
    where: {
      id: dayId,
      plan: {
        userId: user.id,
        isActive: true,
      },
    },
    include: {
      plan: {
        select: {
          id: true,
          days: {
            select: { id: true },
            orderBy: { dayNumber: "asc" },
          },
        },
      },
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
    notFound();
  }

  // Check if day is locked (previous day not completed)
  const dayIndex = workoutDay.plan.days.findIndex(d => d.id === dayId);
  const previousDayId = dayIndex > 0 ? workoutDay.plan.days[dayIndex - 1].id : null;

  if (previousDayId) {
    const previousCompleted = await prisma.workoutLog.findFirst({
      where: { userId: user.id, dayId: previousDayId },
    });

    if (!previousCompleted) {
      // Day is locked - redirect back to plan
      redirect("/plan");
    }
  }

  // Check if already completed
  const alreadyCompleted = await prisma.workoutLog.findFirst({
    where: { userId: user.id, dayId },
  });

  const totalExercises = workoutDay.blocks.reduce((acc, b) => acc + b.exercises.length, 0);
  const totalSets = workoutDay.blocks.reduce(
    (acc, b) => acc + b.exercises.reduce((eAcc, e) => eAcc + e.sets, 0), 0
  );

  // Get primary muscles worked
  const musclesWorked = new Set<string>();
  workoutDay.blocks.forEach(block => {
    block.exercises.forEach(ex => {
      if (ex.exercise?.primaryMuscles) {
        try {
          const muscles = JSON.parse(ex.exercise.primaryMuscles);
          muscles.forEach((m: string) => musclesWorked.add(m));
        } catch {}
      }
    });
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px]" />
      </div>

      <main className="max-w-lg lg:max-w-2xl mx-auto p-4 lg:p-8 relative z-10">
        {/* Back button */}
        <Link 
          href="/plan"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Plan
        </Link>

        {/* Day Header */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 p-6 lg:p-8 shadow-2xl shadow-emerald-500/20 relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider">
                Day {dayIndex + 1}
              </span>
              {alreadyCompleted && (
                <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-semibold">
                  ✓ Completed
                </span>
              )}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 capitalize">
              {workoutDay.dayType.replace("_", " ")} Day
            </h1>
            
            <p className="text-white/80 mb-4">
              {Array.from(musclesWorked).slice(0, 4).join(", ")}
              {musclesWorked.size > 4 && ` +${musclesWorked.size - 4} more`}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{workoutDay.totalDurationMin} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6.5 6.5h11M6.5 17.5h11"/>
                </svg>
                <span>{totalExercises} exercises</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>{totalSets} total sets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Blocks */}
        <div className="space-y-6 mb-8">
          {workoutDay.blocks.map((block) => (
            <div key={block.id} className="rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 overflow-hidden">
              {/* Block Header */}
              <div className={`px-5 py-3 border-b border-neutral-800 flex items-center justify-between ${
                block.blockType === "warmup"
                  ? "bg-amber-500/10"
                  : block.blockType === "strength"
                  ? "bg-red-500/10"
                  : block.blockType === "skill"
                  ? "bg-violet-500/10"
                  : block.blockType === "conditioning"
                  ? "bg-blue-500/10"
                  : "bg-emerald-500/10"
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                    block.blockType === "warmup"
                      ? "bg-amber-500/20 text-amber-400"
                      : block.blockType === "strength"
                      ? "bg-red-500/20 text-red-400"
                      : block.blockType === "skill"
                      ? "bg-violet-500/20 text-violet-400"
                      : block.blockType === "conditioning"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {block.blockType}
                  </span>
                  <span className="text-xs text-neutral-500">{block.exercises.length} exercises</span>
                </div>
                <span className="text-xs text-neutral-400">{block.durationMin} min</span>
              </div>

              {/* Exercises */}
              <div className="divide-y divide-neutral-800">
                {block.exercises.map((exercise, exIndex) => {
                  const intensity = JSON.parse(exercise.intensity);
                  return (
                    <div key={exercise.id} className="p-4 hover:bg-neutral-800/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-sm font-medium text-neutral-400 flex-shrink-0">
                          {exIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-white capitalize">
                                {exercise.exercise?.name || exercise.exerciseId}
                              </h3>
                              {exercise.exercise?.description && (
                                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                                  {exercise.exercise.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-medium text-emerald-400">
                                {exercise.sets} × {exercise.reps}
                              </div>
                              <div className="text-xs text-neutral-500">
                                Rest {exercise.restSec}s
                              </div>
                            </div>
                          </div>
                          
                          {exercise.notes && (
                            <div className="mt-2 px-3 py-2 rounded-lg bg-neutral-800/50 text-xs text-neutral-400">
                              💡 {exercise.notes}
                            </div>
                          )}

                          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                            {exercise.exercise?.difficulty && (
                              <span className={`px-2 py-0.5 rounded ${
                                exercise.exercise.difficulty === "beginner"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : exercise.exercise.difficulty === "intermediate"
                                  ? "bg-amber-500/10 text-amber-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}>
                                {exercise.exercise.difficulty}
                              </span>
                            )}
                            <span>{intensity.type.toUpperCase()} {intensity.value}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="sticky bottom-4 z-20">
          <Link
            href={`/workout/${dayId}`}
            className="block w-full py-4 text-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all"
          >
            {alreadyCompleted ? "Redo Workout" : "Start Workout"}
          </Link>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 rounded-xl bg-neutral-900/50 ring-1 ring-neutral-800">
          <h3 className="text-sm font-semibold text-neutral-300 mb-2">Quick Tips</h3>
          <ul className="space-y-2 text-xs text-neutral-500">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Warm up thoroughly before starting strength exercises</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Focus on proper form over speed or reps</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Take full rest periods between sets for optimal recovery</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

