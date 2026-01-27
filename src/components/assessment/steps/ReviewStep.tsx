"use client";

import type { GuestAssessmentState, SafetyConfirmations } from "@/types/assessment";
import { GOAL_INFO, EQUIPMENT_INFO } from "@/types/assessment";
import { SafetyCheckboxes } from "../ui/SafetyCheckboxes";

interface ReviewStepProps {
  formData: GuestAssessmentState;
  safetyConfirmations: Partial<SafetyConfirmations>;
  onUpdateSafety: (data: Partial<SafetyConfirmations>) => void;
  onEditStep: (step: number) => void;
}

export function ReviewStep({ formData, safetyConfirmations, onUpdateSafety, onEditStep }: ReviewStepProps) {
  const { basicInfo, trainingBackground, availability, location, equipment, goals, injuryScreen, baseline } = formData;
  
  const isMinor = basicInfo.age && basicInfo.age < 18;
  
  // Get equipment list
  const equipmentList = Object.entries(equipment || {})
    .filter(([key, val]) => val && key !== "none")
    .map(([key]) => EQUIPMENT_INFO[key as keyof typeof EQUIPMENT_INFO]?.label || key);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Basic Info</h3>
            <button
              onClick={() => onEditStep(0)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            {basicInfo.name && <p className="text-white">{basicInfo.name}</p>}
            <p className="text-slate-300">{basicInfo.age} years old</p>
            <p className="text-slate-400">{basicInfo.heightCm}cm • {basicInfo.weightKg}kg</p>
          </div>
        </div>

        {/* Training Background */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Experience</h3>
            <button
              onClick={() => onEditStep(1)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <p className="text-slate-300 text-sm capitalize">
            {trainingBackground.trainingAge?.replace(/-/g, " ").replace("mo", " months").replace("yr", " years")}
          </p>
        </div>

        {/* Schedule */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Schedule</h3>
            <button
              onClick={() => onEditStep(2)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-slate-300">{availability.daysPerWeek} days / week</p>
            <p className="text-slate-400">{availability.sessionDurationMin} min sessions • {availability.preferredTime}</p>
          </div>
        </div>

        {/* Location */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Location</h3>
            <button
              onClick={() => onEditStep(3)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <p className="text-slate-300 text-sm capitalize">{location.trainingLocation}</p>
        </div>

        {/* Equipment */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Equipment</h3>
            <button
              onClick={() => onEditStep(4)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {equipment?.none ? (
              <span className="text-slate-400 text-sm">No equipment</span>
            ) : (
              equipmentList.map((item) => (
                <span key={item} className="px-2 py-0.5 bg-white/5 rounded text-xs text-slate-300">
                  {item}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Goals</h3>
            <button
              onClick={() => onEditStep(5)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="space-y-1.5">
            {goals.rankedGoals?.map((goal, i) => (
              <div key={goal} className="flex items-center gap-2 text-sm">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                  i === 0 ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-400"
                }`}>
                  {i + 1}
                </span>
                <span className="text-slate-300">{GOAL_INFO[goal]?.label || goal}</span>
              </div>
            ))}
            <p className="text-xs text-slate-500 mt-2 capitalize">
              Intensity: {goals.intensityPreference}
            </p>
          </div>
        </div>

        {/* Injuries */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Limitations</h3>
            <button
              onClick={() => onEditStep(6)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          {injuryScreen.hasCurrentPain ? (
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {injuryScreen.painAreas?.map((area) => (
                  <span key={area} className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-xs">
                    {area.replace("_", " ")}
                  </span>
                ))}
              </div>
              {injuryScreen.painSeverity && (
                <p className="text-xs text-slate-500">Severity: {injuryScreen.painSeverity}/10</p>
              )}
            </div>
          ) : (
            <p className="text-emerald-400 text-sm">No limitations ✓</p>
          )}
        </div>

        {/* Baseline */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400">Baseline</h3>
            <button
              onClick={() => onEditStep(7)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-slate-500 text-xs">Push-ups</p>
              <p className="text-slate-300">{formatBaseline(baseline.maxPushups)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Pull-ups</p>
              <p className="text-slate-300">{formatBaseline(baseline.maxPullups)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Dips</p>
              <p className="text-slate-300">{formatBaseline(baseline.maxDips)}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs">Plank</p>
              <p className="text-slate-300">{baseline.plankHoldSec}s</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Confirmations */}
      <div className="pt-6 border-t border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Safety Confirmation</h3>
        <p className="text-sm text-slate-400 mb-6">
          Please read and acknowledge the following before we generate your plan:
        </p>
        
        <SafetyCheckboxes
          isMinor={isMinor || false}
          confirmations={safetyConfirmations}
          onUpdate={onUpdateSafety}
        />
      </div>
    </div>
  );
}

function formatBaseline(value: number | string | undefined): string {
  if (value === undefined) return "-";
  if (value === "cannot_do") return "Working on it";
  if (value === "no_bar" || value === "no_station") return "N/A";
  if (typeof value === "number") return String(value);
  return value;
}

