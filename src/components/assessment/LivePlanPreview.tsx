"use client";

import type { GuestAssessmentState, GoalType } from "@/types/assessment";

interface LivePlanPreviewProps {
  formData: GuestAssessmentState;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function LivePlanPreview({ formData, isCollapsed, onToggle }: LivePlanPreviewProps) {
  const {
    basicInfo,
    trainingBackground,
    availability,
    location,
    equipment,
    goals,
    injuryScreen,
    baseline,
  } = formData;

  // Estimate fitness level from baseline
  const estimatedLevel = estimateFitnessLevel(baseline, trainingBackground.trainingAge);
  
  // Get equipment list
  const equipmentList = Object.entries(equipment || {})
    .filter(([key, val]) => val && key !== "none")
    .map(([key]) => formatEquipmentName(key));

  // Get goals
  const goalLabels = (goals.rankedGoals || []).map(formatGoalName);

  // Get pain areas
  const painAreas = injuryScreen.painAreas || [];

  return (
    <div className={`bg-gradient-to-b from-[#0D0E12] to-[#0A0B0E] border border-white/10 rounded-2xl overflow-hidden transition-all ${
      isCollapsed ? "h-14" : ""
    }`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors lg:cursor-default"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">Plan Preview</span>
        </div>
        <span className="text-xs text-emerald-400">Live</span>
      </button>

      {!isCollapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Estimated Level */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-500 mb-1">Estimated Level</div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                estimatedLevel === "advanced" 
                  ? "bg-purple-500/20 text-purple-400"
                  : estimatedLevel === "intermediate"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-emerald-500/20 text-emerald-400"
              }`}>
                {estimatedLevel.charAt(0).toUpperCase() + estimatedLevel.slice(1)}
              </span>
              <span className="text-xs text-slate-600">
                {trainingBackground.trainingAge ? `• ${formatTrainingAge(trainingBackground.trainingAge)}` : ""}
              </span>
            </div>
          </div>

          {/* Schedule Preview */}
          {availability.daysPerWeek && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs text-slate-500 mb-2">Your Schedule</div>
              <div className="flex items-center gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => {
                  const isActive = i < (availability.daysPerWeek || 0);
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                        isActive
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-white/[0.02] text-slate-600 border border-white/5"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {availability.sessionDurationMin} min sessions
                {availability.preferredTime && ` • ${availability.preferredTime}`}
              </div>
            </div>
          )}

          {/* Goals */}
          {goalLabels.length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs text-slate-500 mb-2">Your Goals</div>
              <div className="space-y-1.5">
                {goalLabels.map((goal, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-400"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-slate-300">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {equipmentList.length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs text-slate-500 mb-2">Equipment</div>
              <div className="flex flex-wrap gap-1.5">
                {equipmentList.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 rounded-lg bg-white/5 text-xs text-slate-400 border border-white/5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pain/Limitations */}
          {painAreas.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="text-xs text-amber-400 mb-2">Limitations Applied</div>
              <div className="flex flex-wrap gap-1.5">
                {painAreas.map((area) => (
                  <span
                    key={area}
                    className="px-2 py-1 rounded-lg bg-amber-500/10 text-xs text-amber-300"
                  >
                    {area.replace("_", " ")}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-amber-400/60 mt-2">
                Exercises targeting these areas will be avoided
              </p>
            </div>
          )}

          {/* Tip */}
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
              </svg>
              <p className="text-xs text-emerald-400/80">
                Your plan will update as you complete each step
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== HELPERS ====================

function estimateFitnessLevel(
  baseline: GuestAssessmentState["baseline"],
  trainingAge?: string
): "beginner" | "intermediate" | "advanced" {
  if (!baseline) return "beginner";

  let score = 0;
  
  const pushups = typeof baseline.maxPushups === "number" ? baseline.maxPushups : 0;
  const pullups = typeof baseline.maxPullups === "number" ? baseline.maxPullups : 0;
  
  score += Math.min(25, pushups * 0.8);
  score += Math.min(25, pullups * 2.5);
  
  if (trainingAge === "2-5yr") score += 15;
  else if (trainingAge === "5yr+") score += 25;
  else if (trainingAge === "6mo-2yr") score += 10;

  if (score < 35) return "beginner";
  if (score < 65) return "intermediate";
  return "advanced";
}

function formatEquipmentName(key: string): string {
  const names: Record<string, string> = {
    pullUpBar: "Pull-up Bar",
    dipStation: "Dip Station",
    parallelBars: "Parallel Bars",
    rings: "Rings",
    resistanceBands: "Bands",
    weightedVest: "Weighted Vest",
    parallettes: "Parallettes",
  };
  return names[key] || key;
}

function formatGoalName(goal: string): string {
  return goal.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function formatTrainingAge(age: string): string {
  const labels: Record<string, string> = {
    "none": "Beginner",
    "0-6mo": "< 6 months",
    "6mo-2yr": "6mo - 2yr",
    "2-5yr": "2-5 years",
    "5yr+": "5+ years",
  };
  return labels[age] || age;
}

