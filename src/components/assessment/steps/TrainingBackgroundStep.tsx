"use client";

import { TooltipInfo } from "../ui/TooltipInfo";
import { OptionCard } from "../ui/OptionCard";
import type { TrainingBackground, TrainingAge, FitnessLevel } from "@/types/assessment";

interface TrainingBackgroundStepProps {
  data: Partial<TrainingBackground>;
  onUpdate: (data: Partial<TrainingBackground>) => void;
}

const TRAINING_AGE_OPTIONS: { value: TrainingAge; label: string; description: string; icon: string }[] = [
  { value: "none", label: "Complete Beginner", description: "Never trained before", icon: "🌱" },
  { value: "0-6mo", label: "0-6 Months", description: "Just getting started", icon: "🚀" },
  { value: "6mo-2yr", label: "6 Months - 2 Years", description: "Building foundations", icon: "📈" },
  { value: "2-5yr", label: "2-5 Years", description: "Solid experience", icon: "💪" },
  { value: "5yr+", label: "5+ Years", description: "Veteran lifter", icon: "🏆" },
];

const SELF_RATING_OPTIONS: { value: FitnessLevel; label: string; description: string }[] = [
  { value: "beginner", label: "Beginner", description: "Still learning basic movements" },
  { value: "intermediate", label: "Intermediate", description: "Comfortable with most exercises" },
  { value: "advanced", label: "Advanced", description: "Can do skills like muscle-ups" },
];

export function TrainingBackgroundStep({ data, onUpdate }: TrainingBackgroundStepProps) {
  return (
    <div className="space-y-8">
      {/* Training Age */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          How long have you been training? <span className="text-red-400">*</span>
          <TooltipInfo text="This helps us set appropriate starting points and progression rates" />
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRAINING_AGE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              selected={data.trainingAge === option.value}
              onClick={() => onUpdate({ ...data, trainingAge: option.value })}
              icon={option.icon}
              label={option.label}
              description={option.description}
            />
          ))}
        </div>
      </div>

      {/* Self Rating (Optional) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          How would you rate yourself?
          <span className="text-slate-600">(optional)</span>
        </label>
        <p className="text-xs text-slate-500 mb-4">
          This is just a hint - we'll calculate your actual level from the baseline tests later.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SELF_RATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ ...data, selfRating: option.value })}
              className={`p-4 rounded-xl border text-left transition-all ${
                data.selfRating === option.value
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              <div className={`font-medium mb-1 ${
                data.selfRating === option.value ? "text-emerald-400" : "text-white"
              }`}>
                {option.label}
              </div>
              <div className="text-xs text-slate-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Helpful context */}
      {data.trainingAge && (
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 animate-fade-slide-in">
          <div className="flex items-start gap-3">
            <span className="text-xl">{TRAINING_AGE_OPTIONS.find(o => o.value === data.trainingAge)?.icon}</span>
            <div>
              <p className="text-sm text-emerald-400 font-medium">
                {getContextMessage(data.trainingAge)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getContextMessage(trainingAge: TrainingAge): string {
  const messages: Record<TrainingAge, string> = {
    none: "Perfect! We'll start with the fundamentals and build a solid foundation.",
    "0-6mo": "Great start! We'll help you establish proper form and consistent habits.",
    "6mo-2yr": "Nice progress! We can start introducing more challenging progressions.",
    "2-5yr": "Solid experience! We'll focus on breaking plateaus and skill development.",
    "5yr+": "Impressive dedication! We'll optimize your training with advanced techniques.",
  };
  return messages[trainingAge];
}

