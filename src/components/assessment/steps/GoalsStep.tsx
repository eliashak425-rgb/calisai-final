"use client";

import { useState } from "react";
import { TooltipInfo } from "../ui/TooltipInfo";
import type { Goals, GoalType, IntensityPreference } from "@/types/assessment";
import { GOAL_INFO } from "@/types/assessment";

interface GoalsStepProps {
  data: Partial<Goals>;
  onUpdate: (data: Partial<Goals>) => void;
}

const INTENSITY_OPTIONS: { value: IntensityPreference; label: string; icon: string; description: string }[] = [
  { value: "chill", label: "Chill", icon: "🧘", description: "Sustainable pace, longer rest" },
  { value: "normal", label: "Normal", icon: "⚡", description: "Balanced intensity" },
  { value: "intense", label: "Intense", icon: "🔥", description: "Push hard, shorter rest" },
];

const GOAL_OPTIONS: GoalType[] = [
  "build_muscle",
  "lose_fat",
  "first_pullup",
  "muscle_up",
  "handstand",
  "front_lever",
  "planche",
  "general_fitness",
  "mobility",
];

export function GoalsStep({ data, onUpdate }: GoalsStepProps) {
  const rankedGoals = data.rankedGoals || [];

  const toggleGoal = (goal: GoalType) => {
    const current = [...rankedGoals];
    const index = current.indexOf(goal);
    
    if (index > -1) {
      // Remove goal
      current.splice(index, 1);
    } else if (current.length < 3) {
      // Add goal (max 3)
      current.push(goal);
    }
    
    onUpdate({ ...data, rankedGoals: current });
  };

  const getGoalRank = (goal: GoalType): number | null => {
    const index = rankedGoals.indexOf(goal);
    return index > -1 ? index + 1 : null;
  };

  const moveGoal = (goal: GoalType, direction: "up" | "down") => {
    const current = [...rankedGoals];
    const index = current.indexOf(goal);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= current.length) return;

    [current[index], current[newIndex]] = [current[newIndex], current[index]];
    onUpdate({ ...data, rankedGoals: current });
  };

  return (
    <div className="space-y-8">
      {/* Goal Selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          What are your top goals? <span className="text-red-400">*</span>
          <TooltipInfo text="Select up to 3 goals in priority order. Your plan will focus on #1 while supporting #2 and #3." />
        </label>
        <p className="text-xs text-slate-500 mb-4">
          Click to select up to 3 goals (the order matters!)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {GOAL_OPTIONS.map((goal) => {
            const info = GOAL_INFO[goal];
            const rank = getGoalRank(goal);
            const isSelected = rank !== null;

            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                disabled={!isSelected && rankedGoals.length >= 3}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? rank === 1
                      ? "bg-emerald-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                      : "bg-emerald-500/10 border-emerald-500/30"
                    : rankedGoals.length >= 3
                    ? "bg-white/[0.01] border-white/5 opacity-40 cursor-not-allowed"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Rank badge */}
                {rank && (
                  <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    rank === 1
                      ? "bg-emerald-500 text-black"
                      : rank === 2
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-700 text-white"
                  }`}>
                    {rank}
                  </div>
                )}

                <div className="text-2xl mb-2">{info.icon}</div>
                <div className={`font-medium ${isSelected ? "text-emerald-400" : "text-white"}`}>
                  {info.label}
                </div>
                <div className="text-xs text-slate-500 mt-1">{info.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected goals summary with reordering */}
      {rankedGoals.length > 0 && (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">Your goals (drag to reorder)</h4>
          <div className="space-y-2">
            {rankedGoals.map((goal, index) => {
              const info = GOAL_INFO[goal];
              return (
                <div
                  key={goal}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0 ? "bg-emerald-500/10" : "bg-white/[0.02]"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? "bg-emerald-500 text-black" : "bg-white/10 text-slate-400"
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-lg">{info.icon}</span>
                  <span className={`flex-1 ${index === 0 ? "text-emerald-400" : "text-slate-300"}`}>
                    {info.label}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveGoal(goal, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveGoal(goal, "down")}
                      disabled={index === rankedGoals.length - 1}
                      className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleGoal(goal)}
                      className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Intensity Preference */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          Training intensity preference <span className="text-red-400">*</span>
          <TooltipInfo text="This affects rest times, volume, and overall session difficulty" />
        </label>
        <div className="grid grid-cols-3 gap-3">
          {INTENSITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ ...data, intensityPreference: option.value })}
              className={`p-4 rounded-xl border transition-all ${
                data.intensityPreference === option.value
                  ? option.value === "intense"
                    ? "bg-orange-500/10 border-orange-500/30"
                    : option.value === "chill"
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className={`font-medium ${
                data.intensityPreference === option.value
                  ? option.value === "intense"
                    ? "text-orange-400"
                    : option.value === "chill"
                    ? "text-blue-400"
                    : "text-emerald-400"
                  : "text-white"
              }`}>
                {option.label}
              </div>
              <div className="text-xs text-slate-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

