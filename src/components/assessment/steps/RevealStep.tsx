"use client";

import { useState } from "react";
import type { GeneratedPlan, FitnessComputation, DayPlan, ExerciseBlock } from "@/types/assessment";
import { PricingModal } from "../PricingModal";

interface RevealStepProps {
  plan: GeneratedPlan | null;
  fitness: FitnessComputation | null;
  error: string | null;
  onRetry: () => void;
}

export function RevealStep({ plan, fitness, error, onRetry }: RevealStepProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showPricing, setShowPricing] = useState(false);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6m0-6l6 6" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-medium text-white mb-2">
          Generation Failed
        </h2>
        <p className="text-slate-400 mb-6 max-w-md">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-emerald-500 text-black font-medium rounded-xl hover:bg-emerald-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!plan || !fitness) {
    return null;
  }

  const trainingDays = plan.weeklyStructure.filter(d => d.dayType !== "rest");

  return (
    <div className="space-y-8 animate-fade-slide-in">
      {/* Success header */}
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-3xl font-display font-medium text-white mb-2">
          Your Plan is Ready! 🎉
        </h2>
        <p className="text-slate-400">
          Here's your personalized Week 1 preview
        </p>
      </div>

      {/* Fitness level badge */}
      <div className="flex items-center justify-center gap-4">
        <div className={`px-4 py-2 rounded-xl border ${
          fitness.level === "advanced"
            ? "bg-purple-500/10 border-purple-500/30"
            : fitness.level === "intermediate"
            ? "bg-blue-500/10 border-blue-500/30"
            : "bg-emerald-500/10 border-emerald-500/30"
        }`}>
          <span className={`text-sm font-medium ${
            fitness.level === "advanced"
              ? "text-purple-400"
              : fitness.level === "intermediate"
              ? "text-blue-400"
              : "text-emerald-400"
          }`}>
            {fitness.level.charAt(0).toUpperCase() + fitness.level.slice(1)} Level
          </span>
          <span className="text-slate-500 text-sm ml-2">
            Score: {fitness.score}/100
          </span>
        </div>
        <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/10">
          <span className="text-slate-400 text-sm">
            {trainingDays.length} days/week • ~{plan.metadata.estimatedSessionDuration} min
          </span>
        </div>
      </div>

      {/* Recommendations */}
      {fitness.recommendations.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
          <h4 className="text-sm font-medium text-emerald-400 mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {fitness.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-emerald-400">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Week overview */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Week 1 Preview</h3>
        
        <div className="grid grid-cols-7 gap-2">
          {plan.weeklyStructure.map((day) => {
            const isRest = day.dayType === "rest";
            const isExpanded = expandedDay === day.dayNumber;

            return (
              <button
                key={day.dayNumber}
                onClick={() => !isRest && setExpandedDay(isExpanded ? null : day.dayNumber)}
                disabled={isRest}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isRest
                    ? "bg-white/[0.01] border-white/5 cursor-default"
                    : isExpanded
                    ? "bg-emerald-500/20 border-emerald-500/40 ring-2 ring-emerald-500/20"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="text-xs text-slate-500 mb-1">Day {day.dayNumber}</div>
                <div className={`text-sm font-medium ${
                  isRest ? "text-slate-600" : isExpanded ? "text-emerald-400" : "text-white"
                }`}>
                  {isRest ? "Rest" : getDayTypeLabel(day.dayType)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded day view */}
      {expandedDay && (
        <div className="animate-fade-slide-in">
          {(() => {
            const day = plan.weeklyStructure.find(d => d.dayNumber === expandedDay);
            if (!day || day.dayType === "rest") return null;

            return (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0D0E12] to-[#0A0B0E] border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-xl font-medium text-white">
                      Day {day.dayNumber}: {getDayTypeLabel(day.dayType)}
                    </h4>
                    <p className="text-sm text-slate-500">{day.totalDurationMin} minutes</p>
                  </div>
                  <button
                    onClick={() => setExpandedDay(null)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {day.blocks.map((block, blockIdx) => (
                    <BlockCard key={blockIdx} block={block} />
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Safety note */}
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm text-amber-400 font-medium">Confidence & Safety</p>
            <p className="text-xs text-slate-400 mt-1">
              If you feel sharp pain during any exercise, stop immediately and substitute with an easier variation. 
              This plan is a starting point - adjust based on how your body responds.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={() => setShowPricing(true)}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all text-center"
        >
          Unlock Full Plan
        </button>
        <button
          onClick={() => setShowPricing(true)}
          className="py-4 px-6 border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all text-center"
        >
          Continue Free (Limited)
        </button>
      </div>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
      />
    </div>
  );
}

// ==================== HELPERS ====================

function getDayTypeLabel(dayType: string): string {
  const labels: Record<string, string> = {
    push: "Push",
    pull: "Pull",
    full_body: "Full Body",
    upper: "Upper Body",
    legs: "Legs",
    skill: "Skill Work",
  };
  return labels[dayType] || dayType;
}

function BlockCard({ block }: { block: ExerciseBlock }) {
  const [isExpanded, setIsExpanded] = useState(block.blockType === "strength");

  const getBlockColor = (type: string) => {
    switch (type) {
      case "warmup": return "emerald";
      case "skill": return "purple";
      case "strength": return "blue";
      case "conditioning": return "orange";
      case "cooldown": return "slate";
      default: return "slate";
    }
  };

  const color = getBlockColor(block.blockType);

  return (
    <div className={`rounded-xl border transition-all ${
      isExpanded
        ? `bg-${color}-500/5 border-${color}-500/20`
        : "bg-white/[0.02] border-white/10"
    }`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
            <span className="text-sm">{getBlockIcon(block.blockType)}</span>
          </div>
          <div className="text-left">
            <div className="font-medium text-white capitalize">{block.blockType}</div>
            <div className="text-xs text-slate-500">
              {block.exercises.length} exercises • {block.durationMin} min
            </div>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 animate-fade-slide-in">
          {block.exercises.map((exercise, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-white text-sm">
                  {exercise.exerciseName || exercise.exerciseId}
                </span>
                {exercise.intensity && (
                  <span className="text-xs text-slate-500">
                    {exercise.intensity.type.toUpperCase()} {exercise.intensity.value}
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                {exercise.sets} sets × {exercise.reps}
                {exercise.restSec > 0 && ` • ${exercise.restSec}s rest`}
              </div>
              {exercise.notes && (
                <p className="text-xs text-slate-500 mt-1">{exercise.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getBlockIcon(type: string): string {
  const icons: Record<string, string> = {
    warmup: "🔥",
    skill: "🎯",
    strength: "💪",
    conditioning: "⚡",
    cooldown: "🧊",
  };
  return icons[type] || "📋";
}

