"use client";

import { TooltipInfo } from "../ui/TooltipInfo";
import type { Availability, PreferredTime } from "@/types/assessment";

interface AvailabilityStepProps {
  data: Partial<Availability>;
  onUpdate: (data: Partial<Availability>) => void;
}

const DAYS_OPTIONS = [2, 3, 4, 5, 6] as const;
const DURATION_OPTIONS = [
  { value: 20, label: "20 min", description: "Quick session" },
  { value: 30, label: "30 min", description: "Short & focused" },
  { value: 45, label: "45 min", description: "Standard" },
  { value: 60, label: "60 min", description: "Full workout" },
  { value: 90, label: "90 min", description: "Extended" },
] as const;

const TIME_OPTIONS: { value: PreferredTime; label: string; icon: string }[] = [
  { value: "morning", label: "Morning", icon: "🌅" },
  { value: "afternoon", label: "Afternoon", icon: "☀️" },
  { value: "evening", label: "Evening", icon: "🌙" },
  { value: "flexible", label: "Flexible", icon: "🔄" },
];

export function AvailabilityStep({ data, onUpdate }: AvailabilityStepProps) {
  return (
    <div className="space-y-8">
      {/* Days per week */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          How many days per week can you train? <span className="text-red-400">*</span>
          <TooltipInfo text="We recommend 3-4 days for optimal recovery, but can adapt to your schedule" />
        </label>
        <div className="flex gap-2">
          {DAYS_OPTIONS.map((days) => (
            <button
              key={days}
              onClick={() => onUpdate({ ...data, daysPerWeek: days })}
              className={`flex-1 py-4 rounded-xl border font-medium transition-all ${
                data.daysPerWeek === days
                  ? "bg-emerald-500 text-black border-emerald-500 shadow-lg shadow-emerald-500/25"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {days}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-600 px-1">
          <span>Minimum</span>
          <span>days / week</span>
          <span>Maximum</span>
        </div>
        
        {/* Recommendation */}
        {data.daysPerWeek && (
          <div className={`mt-3 p-3 rounded-xl ${
            data.daysPerWeek >= 3 && data.daysPerWeek <= 4
              ? "bg-emerald-500/10 border border-emerald-500/20"
              : data.daysPerWeek >= 5
              ? "bg-amber-500/10 border border-amber-500/20"
              : "bg-blue-500/10 border border-blue-500/20"
          }`}>
            <p className={`text-xs ${
              data.daysPerWeek >= 3 && data.daysPerWeek <= 4
                ? "text-emerald-400"
                : data.daysPerWeek >= 5
                ? "text-amber-400"
                : "text-blue-400"
            }`}>
              {data.daysPerWeek === 2 && "2 days is a great start! Focus on full-body sessions."}
              {data.daysPerWeek === 3 && "3 days is ideal for most people. Great recovery time!"}
              {data.daysPerWeek === 4 && "4 days allows for excellent progress with good recovery."}
              {data.daysPerWeek === 5 && "5 days is intense. Make sure you're getting enough sleep!"}
              {data.daysPerWeek === 6 && "6 days requires careful programming. Recovery is key!"}
            </p>
          </div>
        )}
      </div>

      {/* Session duration */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          How long can each session be? <span className="text-red-400">*</span>
          <TooltipInfo text="Include warmup and cooldown time. Quality over quantity!" />
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ ...data, sessionDurationMin: option.value })}
              className={`p-4 rounded-xl border transition-all ${
                data.sessionDurationMin === option.value
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`text-lg font-medium ${
                data.sessionDurationMin === option.value ? "text-emerald-400" : "text-white"
              }`}>
                {option.label}
              </div>
              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preferred time */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          When do you prefer to train? <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ ...data, preferredTime: option.value })}
              className={`p-4 rounded-xl border transition-all ${
                data.preferredTime === option.value
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className={`font-medium ${
                data.preferredTime === option.value ? "text-emerald-400" : "text-white"
              }`}>
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly time budget */}
      {data.daysPerWeek && data.sessionDurationMin && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Weekly training time</span>
            <span className="text-lg font-medium text-white">
              {data.daysPerWeek * data.sessionDurationMin} minutes
            </span>
          </div>
          <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
              style={{ width: `${Math.min(100, (data.daysPerWeek * data.sessionDurationMin / 360) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-600">
            <span>Minimum (60 min)</span>
            <span>Optimal (180-270 min)</span>
            <span>Max (360 min)</span>
          </div>
        </div>
      )}
    </div>
  );
}

