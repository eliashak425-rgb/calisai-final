"use client";

import { useEffect, useState } from "react";
import type { GuestAssessmentState, GeneratedPlan, FitnessComputation, AssessmentSubmission } from "@/types/assessment";

interface LoadingStepProps {
  formData: GuestAssessmentState;
  onPlanGenerated: (plan: GeneratedPlan, fitness: FitnessComputation) => void;
  onError: (error: string) => void;
}

const LOADING_PHASES = [
  { id: 1, message: "Analyzing your profile...", duration: 1500 },
  { id: 2, message: "Calculating your fitness level...", duration: 1200 },
  { id: 3, message: "Balancing push and pull movements...", duration: 1500 },
  { id: 4, message: "Selecting appropriate progressions...", duration: 1800 },
  { id: 5, message: "Adjusting for recovery and limitations...", duration: 1500 },
  { id: 6, message: "Finalizing your Week 1 plan...", duration: 2000 },
];

export function LoadingStep({ formData, onPlanGenerated, onError }: LoadingStepProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animate through phases
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev < LOADING_PHASES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  // Generate plan
  useEffect(() => {
    if (isGenerating) return;
    setIsGenerating(true);

    const generatePlan = async () => {
      try {
        // Convert form data to submission format
        const assessment: AssessmentSubmission = {
          basicInfo: {
            name: formData.basicInfo.name,
            age: formData.basicInfo.age!,
            biologicalSex: formData.basicInfo.biologicalSex!,
            heightCm: formData.basicInfo.heightCm!,
            weightKg: formData.basicInfo.weightKg!,
          },
          trainingBackground: {
            trainingAge: formData.trainingBackground.trainingAge!,
            selfRating: formData.trainingBackground.selfRating,
          },
          availability: {
            daysPerWeek: formData.availability.daysPerWeek!,
            sessionDurationMin: formData.availability.sessionDurationMin!,
            preferredTime: formData.availability.preferredTime!,
          },
          location: {
            trainingLocation: formData.location.trainingLocation!,
          },
          equipment: {
            pullUpBar: formData.equipment.pullUpBar || false,
            dipStation: formData.equipment.dipStation || false,
            parallelBars: formData.equipment.parallelBars || false,
            rings: formData.equipment.rings || false,
            resistanceBands: formData.equipment.resistanceBands || false,
            weightedVest: formData.equipment.weightedVest || false,
            parallettes: formData.equipment.parallettes || false,
            none: formData.equipment.none || false,
          },
          goals: {
            rankedGoals: formData.goals.rankedGoals || [],
            intensityPreference: formData.goals.intensityPreference!,
          },
          injuryScreen: {
            hasCurrentPain: formData.injuryScreen.hasCurrentPain || false,
            painAreas: formData.injuryScreen.painAreas || [],
            painSeverity: formData.injuryScreen.painSeverity,
            diagnosed: formData.injuryScreen.diagnosed,
          },
          baseline: {
            maxPushups: formData.baseline.maxPushups!,
            maxPullups: formData.baseline.maxPullups || "no_bar",
            maxDips: formData.baseline.maxDips || "no_station",
            plankHoldSec: formData.baseline.plankHoldSec!,
            hollowHoldSec: formData.baseline.hollowHoldSec || "unfamiliar",
            wallHandstandHoldSec: formData.baseline.wallHandstandHoldSec || "never_tried",
          },
          recoveryPrefs: {
            sleepQuality: formData.recoveryPrefs?.sleepQuality || "ok",
            sorenessTolerance: formData.recoveryPrefs?.sorenessTolerance || "medium",
          },
        };

        const response = await fetch("/api/plan/generate-guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessment }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to generate plan");
        }

        const data = await response.json();
        
        // Wait for phases to complete visually before showing result
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        onPlanGenerated(data.plan, data.fitness);
      } catch (err) {
        console.error("Plan generation error:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
        onError(err instanceof Error ? err.message : "Something went wrong");
      }
    };

    generatePlan();
  }, [formData, isGenerating, onPlanGenerated, onError]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Animated loader */}
      <div className="relative w-32 h-32 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
        
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-emerald-500/10 animate-pulse" />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-display font-medium text-white mb-2">
        Building Your Plan
      </h2>
      <p className="text-slate-400 mb-8">
        Our AI is creating a personalized workout plan just for you
      </p>

      {/* Phase checklist */}
      <div className="w-full max-w-md space-y-3">
        {LOADING_PHASES.map((phase, index) => {
          const isComplete = index < currentPhase;
          const isCurrent = index === currentPhase;
          const isPending = index > currentPhase;

          return (
            <div
              key={phase.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isComplete
                  ? "bg-emerald-500/10"
                  : isCurrent
                  ? "bg-white/[0.05] border border-emerald-500/30"
                  : "bg-white/[0.02] opacity-50"
              }`}
            >
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isComplete
                  ? "bg-emerald-500"
                  : isCurrent
                  ? "bg-emerald-500/20"
                  : "bg-white/10"
              }`}>
                {isComplete ? (
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                ) : (
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                )}
              </div>

              {/* Message */}
              <span className={`text-sm ${
                isComplete
                  ? "text-emerald-400"
                  : isCurrent
                  ? "text-white"
                  : "text-slate-600"
              }`}>
                {phase.message}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tip */}
      <p className="text-xs text-slate-600 mt-8">
        This usually takes 10-20 seconds
      </p>
    </div>
  );
}

