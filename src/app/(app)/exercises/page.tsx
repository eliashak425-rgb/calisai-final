import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ExercisesPage() {
  const exercises = await prisma.exerciseLibrary.findMany({
    include: {
      tags: true,
      muscles: true,
    },
    orderBy: [
      { difficultyScore: "asc" },
      { name: "asc" },
    ],
  });

  // Group by movement pattern
  const grouped = exercises.reduce((acc, ex) => {
    const pattern = ex.movementPattern;
    if (!acc[pattern]) acc[pattern] = [];
    acc[pattern].push(ex);
    return acc;
  }, {} as Record<string, typeof exercises>);

  const patternLabels: Record<string, string> = {
    horizontal_push: "Horizontal Push",
    horizontal_pull: "Horizontal Pull",
    vertical_push: "Vertical Push",
    vertical_pull: "Vertical Pull",
    core: "Core",
    legs: "Legs",
    skill: "Skills",
    mobility: "Mobility",
  };

  const difficultyColors: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none -z-10" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">Exercise Library</h1>
          <p className="text-slate-400">
            {exercises.length} exercises across all movement patterns
          </p>
        </div>

        {/* Exercise Groups */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([pattern, exs]) => (
            <div key={pattern}>
              <h2 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {patternLabels[pattern] || pattern}
                <span className="text-slate-500 text-sm font-normal">({exs.length})</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exs.map((exercise) => (
                  <Link
                    key={exercise.id}
                    href={`/exercises/${exercise.slug}`}
                    className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                        {exercise.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${difficultyColors[exercise.difficulty]}`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {exercise.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {exercise.muscles
                        .filter((m) => m.isPrimary)
                        .slice(0, 3)
                        .map((m) => (
                          <span
                            key={m.id}
                            className="px-2 py-0.5 bg-white/5 rounded text-xs text-slate-400"
                          >
                            {m.muscle}
                          </span>
                        ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

