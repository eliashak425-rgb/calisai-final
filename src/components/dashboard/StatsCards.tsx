"use client";

interface Props {
  totalWorkouts: number;
  currentStreak: number;
  totalSetsThisWeek: number;
  fitnessLevel: string;
}

export function StatsCards({ totalWorkouts, currentStreak, totalSetsThisWeek, fitnessLevel }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-medium text-white">{totalWorkouts}</div>
        <div className="text-sm text-slate-500">Total Workouts</div>
      </div>

      <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              <path d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-medium text-white">{currentStreak}</div>
        <div className="text-sm text-slate-500">Day Streak</div>
      </div>

      <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 14l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-medium text-white">{totalSetsThisWeek}</div>
        <div className="text-sm text-slate-500">Sets This Week</div>
      </div>

      <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center text-violet-400 border border-violet-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-medium text-white capitalize">{fitnessLevel}</div>
        <div className="text-sm text-slate-500">Fitness Level</div>
      </div>
    </div>
  );
}

