import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ExerciseDetailPage({ params }: Props) {
  const { slug } = await params;
  
  const exercise = await prisma.exerciseLibrary.findUnique({
    where: { slug },
    include: {
      tags: true,
      muscles: true,
    },
  });

  if (!exercise) {
    notFound();
  }

  const formCues = JSON.parse(exercise.formCues);
  const commonMistakes = JSON.parse(exercise.commonMistakes);
  const equipmentNeeded = JSON.parse(exercise.equipmentNeeded);
  const prerequisites = JSON.parse(exercise.prerequisites);

  // Get related exercises (progressions/regressions)
  const [progression, regression] = await Promise.all([
    exercise.progressionOf
      ? prisma.exerciseLibrary.findFirst({ where: { slug: exercise.progressionOf } })
      : null,
    exercise.regressionOf
      ? prisma.exerciseLibrary.findFirst({ where: { slug: exercise.regressionOf } })
      : null,
  ]);

  const difficultyColors: Record<string, string> = {
    beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    advanced: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none -z-10" />

        {/* Back Link */}
        <Link
          href="/exercises"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m7-7l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Library
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-light text-white">{exercise.name}</h1>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${difficultyColors[exercise.difficulty]}`}>
              {exercise.difficulty}
            </span>
          </div>
          <p className="text-lg text-slate-400">{exercise.description}</p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Video Placeholder */}
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 border border-white/10">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <p className="text-slate-500">Video demo coming soon</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Muscles */}
            <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Muscles Worked</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-slate-500 mb-2">PRIMARY</div>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscles
                      .filter((m) => m.isPrimary)
                      .map((m) => (
                        <span
                          key={m.id}
                          className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400"
                        >
                          {m.muscle}
                        </span>
                      ))}
                  </div>
                </div>
                {exercise.muscles.filter((m) => !m.isPrimary).length > 0 && (
                  <div>
                    <div className="text-xs text-slate-500 mb-2">SECONDARY</div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles
                        .filter((m) => !m.isPrimary)
                        .map((m) => (
                          <span
                            key={m.id}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400"
                          >
                            {m.muscle}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Equipment Needed</h2>
              {equipmentNeeded.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {equipmentNeeded.map((eq: string) => (
                    <span
                      key={eq}
                      className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No equipment required</p>
              )}
            </div>
          </div>

          {/* Form Cues */}
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-medium text-white mb-4">Form Cues</h2>
            <ul className="space-y-3">
              {formCues.map((cue: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="w-6 h-6 flex-shrink-0 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-xs text-emerald-400">
                    {i + 1}
                  </span>
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-medium text-white mb-4">Common Mistakes</h2>
            <ul className="space-y-3">
              {commonMistakes.map((mistake: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="w-6 h-6 flex-shrink-0 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-xs text-red-400">
                    ✕
                  </span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>

          {/* Progressions */}
          {(progression || regression || prerequisites.length > 0) && (
            <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Progression Path</h2>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {regression && (
                  <>
                    <Link
                      href={`/exercises/${regression.slug}`}
                      className="flex-shrink-0 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all"
                    >
                      <div className="text-xs text-slate-500 mb-1">EASIER</div>
                      <div className="text-white">{regression.name}</div>
                    </Link>
                    <svg className="w-6 h-6 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
                <div className="flex-shrink-0 px-4 py-3 bg-emerald-500/10 border-2 border-emerald-500 rounded-xl">
                  <div className="text-xs text-emerald-400 mb-1">CURRENT</div>
                  <div className="text-white font-medium">{exercise.name}</div>
                </div>
                {progression && (
                  <>
                    <svg className="w-6 h-6 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14m-7-7l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <Link
                      href={`/exercises/${progression.slug}`}
                      className="flex-shrink-0 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all"
                    >
                      <div className="text-xs text-slate-500 mb-1">HARDER</div>
                      <div className="text-white">{progression.name}</div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

