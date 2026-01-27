"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const STORAGE_KEY = "calisai_guest_assessment";

// Simple step components inline for now
const STEPS = [
  { id: "basics", title: "Basic Info", icon: "👤" },
  { id: "training", title: "Experience", icon: "📊" },
  { id: "availability", title: "Schedule", icon: "📅" },
  { id: "equipment", title: "Equipment", icon: "🏋️" },
  { id: "goals", title: "Goals", icon: "🎯" },
  { id: "baseline", title: "Baseline", icon: "💪" },
  { id: "review", title: "Review", icon: "✅" },
];

interface FormData {
  name?: string;
  age?: number;
  sex?: string;
  heightCm?: number;
  weightKg?: number;
  trainingAge?: string;
  daysPerWeek?: number;
  sessionDuration?: number;
  preferredTime?: string;
  equipment?: Record<string, boolean>;
  goals?: string[];
  intensity?: string;
  maxPushups?: number | string;
  maxPullups?: number | string;
  maxDips?: number | string;
  plankSec?: number;
  hasPain?: boolean;
  painAreas?: string[];
}

export default function AssessmentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Submit assessment and save profile
  const handleSubmit = async () => {
    if (!session?.user) {
      // Not logged in - redirect to signup with return URL
      router.push("/signup?callbackUrl=/assessment");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map preferredTime from form values to schema values
      const timeMap: Record<string, "morning" | "afternoon" | "evening" | "flexible"> = {
        morning: "morning",
        afternoon: "afternoon", 
        evening: "evening",
        anytime: "flexible",
        flexible: "flexible",
      };

      // Map training age from form values to schema values
      const trainingAgeMap: Record<string, "none" | "0-6mo" | "6mo-2yr" | "2-5yr" | "5yr+"> = {
        "none": "none",
        "beginner": "0-6mo",
        "0-6mo": "0-6mo",
        "6mo-2yr": "6mo-2yr",
        "intermediate": "6mo-2yr",
        "2-5yr": "2-5yr",
        "advanced": "2-5yr",
        "5yr+": "5yr+",
        "expert": "5yr+",
      };

      // Ensure equipment has all required fields
      const equipmentData = {
        pullUpBar: formData.equipment?.pullUpBar || formData.equipment?.pull_up_bar || false,
        dipStation: formData.equipment?.dipStation || formData.equipment?.dip_station || false,
        parallelBars: formData.equipment?.parallelBars || formData.equipment?.parallel_bars || false,
        rings: formData.equipment?.rings || false,
        resistanceBands: formData.equipment?.resistanceBands || formData.equipment?.resistance_bands || false,
        weightedVest: formData.equipment?.weightedVest || formData.equipment?.weighted_vest || false,
        parallettes: formData.equipment?.parallettes || false,
        none: formData.equipment?.none || false,
      };

      // Transform form data to API format
      const apiData = {
        basicInfo: {
          age: formData.age || 25,
          biologicalSex: (formData.sex as "male" | "female" | "prefer_not_to_say") || "prefer_not_to_say",
          heightCm: formData.heightCm || 170,
          weightKg: formData.weightKg || 70,
          trainingAge: trainingAgeMap[formData.trainingAge || "none"] || "0-6mo",
        },
        availability: {
          daysPerWeek: ([2, 3, 4, 5, 6].includes(formData.daysPerWeek || 3) ? formData.daysPerWeek : 3) as 2 | 3 | 4 | 5 | 6,
          sessionDurationMin: ([20, 30, 45, 60, 90].includes(formData.sessionDuration || 45) ? formData.sessionDuration : 45) as 20 | 30 | 45 | 60 | 90,
          preferredTime: timeMap[formData.preferredTime || "flexible"] || "flexible",
          trainingLocation: "home" as const,
        },
        equipment: equipmentData,
        goals: {
          primary: (formData.goals?.[0] || "general_fitness") as "build_muscle" | "lose_fat" | "first_pullup" | "muscle_up" | "handstand" | "front_lever" | "planche" | "general_fitness" | "mobility",
          secondary: formData.goals?.[1] as "build_muscle" | "lose_fat" | "first_pullup" | "muscle_up" | "handstand" | "front_lever" | "planche" | "general_fitness" | "mobility" | undefined,
          tertiary: formData.goals?.[2] as "build_muscle" | "lose_fat" | "first_pullup" | "muscle_up" | "handstand" | "front_lever" | "planche" | "general_fitness" | "mobility" | undefined,
        },
        injuryScreen: {
          hasCurrentPain: formData.hasPain || false,
          painAreas: (formData.painAreas || []) as ("shoulder" | "elbow" | "wrist" | "lower_back" | "knee" | "ankle" | "neck")[],
          painSeverity: formData.hasPain ? 3 : undefined,
        },
        baseline: {
          maxPushups: formData.maxPushups === "cannot" ? "cannot_do" as const : (typeof formData.maxPushups === "number" ? formData.maxPushups : 10),
          maxPullups: formData.maxPullups === "cannot" ? "cannot_do" as const : (formData.maxPullups === "no_bar" ? "no_bar" as const : (typeof formData.maxPullups === "number" ? formData.maxPullups : 0)),
          maxDips: formData.maxDips === "cannot" ? "cannot_do" as const : (formData.maxDips === "no_station" ? "no_station" as const : (typeof formData.maxDips === "number" ? formData.maxDips : 0)),
          plankHoldSec: formData.plankSec || 30,
          hollowHoldSec: "unfamiliar" as const,
          wallHandstandHoldSec: "never_tried" as const,
        },
      };

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save assessment");
      }

      // Clear localStorage on success
      localStorage.removeItem(STORAGE_KEY);
      
      // Redirect to plan generation
      router.push("/plan/generate");
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitError(error instanceof Error ? error.message : "Failed to save. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Load saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Check if this is old wizard data (has keys like basicInfo, trainingBackground, etc.)
        const oldWizardKeys = ['basicInfo', 'trainingBackground', 'availability', 'injuryScreen', 'safetyConfirmations'];
        const hasOldData = parsed.formData && oldWizardKeys.some(key => key in parsed.formData);
        
        if (hasOldData) {
          // Clear old wizard data and start fresh
          console.log("Clearing old assessment data format");
          localStorage.removeItem(STORAGE_KEY);
          setFormData({});
          setCurrentStep(0);
        } else {
          setFormData(parsed.formData || {});
          // Make sure currentStep is within bounds
          const savedStep = parsed.currentStep || 0;
          setCurrentStep(Math.min(savedStep, STEPS.length - 1));
        }
      }
    } catch (e) {
      console.error("Failed to load saved data:", e);
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  // Save progress
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep }));
    }
  }, [formData, currentStep, isLoaded]);

  const updateForm = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Safety check for currentStep - MUST be before validation
  const safeStep = Math.min(Math.max(0, currentStep), STEPS.length - 1);
  const currentStepData = STEPS[safeStep];

  // Validation for each step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        return !!(
          formData.age &&
          formData.sex &&
          formData.heightCm &&
          formData.weightKg
        );
      case 1: // Training Experience
        return !!formData.trainingAge;
      case 2: // Schedule
        return !!(
          formData.daysPerWeek &&
          formData.sessionDuration &&
          formData.preferredTime
        );
      case 3: // Equipment
        return !!(formData.equipment && Object.values(formData.equipment).some(v => v === true));
      case 4: // Goals
        return !!(
          Array.isArray(formData.goals) &&
          formData.goals.length > 0 &&
          formData.intensity
        );
      case 5: // Baseline
        return !!(
          formData.maxPushups !== undefined &&
          formData.plankSec
        );
      case 6: // Review (always valid)
        return true;
      default:
        return true;
    }
  };

  const canProceed = isStepValid(safeStep);

  const nextStep = () => {
    if (canProceed && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFormData({});
    setCurrentStep(0);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              Step {safeStep + 1} of {STEPS.length}
            </span>
            <button
              onClick={clearProgress}
              className="text-xs text-slate-600 hover:text-slate-400"
            >
              Start over
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-black/50 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-3">
            {STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => i <= safeStep && setCurrentStep(i)}
                disabled={i > safeStep}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i <= safeStep ? "bg-emerald-500" : "bg-white/10"
                } ${i > safeStep ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentStepData.icon}</span>
            <span className="font-medium">{currentStepData.title}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-b from-[#0D0E12] to-[#0A0B0E] border border-white/10 rounded-2xl p-6">
          {/* Step Content */}
          {safeStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Let&apos;s get to know you</h2>
              
              <div>
                <label className="block text-sm text-slate-400 mb-2">Name (optional)</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  placeholder="What should we call you?"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Age *</label>
                <input
                  type="number"
                  min={13}
                  max={100}
                  value={formData.age || ""}
                  onChange={(e) => updateForm({ age: parseInt(e.target.value) || undefined })}
                  placeholder="Your age"
                  className="w-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Biological Sex *</label>
                <div className="flex gap-3">
                  {["male", "female", "prefer_not_to_say"].map((sex) => (
                    <button
                      key={sex}
                      onClick={() => updateForm({ sex })}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        formData.sex === sex
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {sex === "prefer_not_to_say" ? "Prefer not to say" : sex.charAt(0).toUpperCase() + sex.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Height (cm) *</label>
                  <input
                    type="number"
                    value={formData.heightCm || ""}
                    onChange={(e) => updateForm({ heightCm: parseInt(e.target.value) || undefined })}
                    placeholder="175"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Weight (kg) *</label>
                  <input
                    type="number"
                    value={formData.weightKg || ""}
                    onChange={(e) => updateForm({ weightKg: parseInt(e.target.value) || undefined })}
                    placeholder="70"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {safeStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Your training background</h2>
              
              <div>
                <label className="block text-sm text-slate-400 mb-3">How long have you been training?</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "none", label: "Just starting" },
                    { value: "0-6mo", label: "Less than 6 months" },
                    { value: "6mo-2yr", label: "6 months - 2 years" },
                    { value: "2-5yr", label: "2-5 years" },
                    { value: "5yr+", label: "5+ years" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateForm({ trainingAge: option.value })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.trainingAge === option.value
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {safeStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">When can you train?</h2>
              
              <div>
                <label className="block text-sm text-slate-400 mb-3">Days per week</label>
                <div className="flex gap-2">
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      onClick={() => updateForm({ daysPerWeek: days })}
                      className={`w-14 h-14 rounded-xl border transition-all font-semibold ${
                        formData.daysPerWeek === days
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Session duration</label>
                <div className="flex flex-wrap gap-2">
                  {[20, 30, 45, 60, 90].map((min) => (
                    <button
                      key={min}
                      onClick={() => updateForm({ sessionDuration: min })}
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        formData.sessionDuration === min
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Preferred time</label>
                <div className="flex flex-wrap gap-2">
                  {["morning", "afternoon", "evening", "flexible"].map((time) => (
                    <button
                      key={time}
                      onClick={() => updateForm({ preferredTime: time })}
                      className={`px-4 py-3 rounded-xl border transition-all capitalize ${
                        formData.preferredTime === time
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {safeStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">What equipment do you have?</h2>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "pullUpBar", label: "Pull-up Bar", icon: "🔩" },
                  { id: "dipStation", label: "Dip Station", icon: "⬜" },
                  { id: "rings", label: "Rings", icon: "⭕" },
                  { id: "parallettes", label: "Parallettes", icon: "➖" },
                  { id: "resistanceBands", label: "Resistance Bands", icon: "🔗" },
                  { id: "weightedVest", label: "Weighted Vest", icon: "🦺" },
                  { id: "none", label: "None / Bodyweight only", icon: "👐" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const current = formData.equipment || {};
                      if (item.id === "none") {
                        updateForm({ equipment: { none: true } });
                      } else {
                        const updated = { ...current, [item.id]: !current[item.id], none: false };
                        updateForm({ equipment: updated });
                      }
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.equipment?.[item.id]
                        ? "bg-emerald-500/20 border-emerald-500/40"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <span className={formData.equipment?.[item.id] ? "text-emerald-400" : "text-white"}>
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {safeStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">What are your goals?</h2>
              
              <p className="text-sm text-slate-400 mb-4">Select your top goals (in order of priority)</p>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "build_muscle", label: "Build Muscle" },
                  { id: "lose_fat", label: "Lose Fat" },
                  { id: "first_pullup", label: "First Pull-up" },
                  { id: "muscle_up", label: "Muscle-up" },
                  { id: "handstand", label: "Handstand" },
                  { id: "front_lever", label: "Front Lever" },
                  { id: "planche", label: "Planche" },
                  { id: "general_fitness", label: "General Fitness" },
                ].map((goal) => {
                  const goals = formData.goals || [];
                  const index = goals.indexOf(goal.id);
                  const isSelected = index !== -1;
                  
                  return (
                    <button
                      key={goal.id}
                      onClick={() => {
                        if (isSelected) {
                          updateForm({ goals: goals.filter(g => g !== goal.id) });
                        } else if (goals.length < 3) {
                          updateForm({ goals: [...goals, goal.id] });
                        }
                      }}
                      className={`p-4 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                      )}
                      <span className={isSelected ? "text-emerald-400" : "text-white"}>
                        {goal.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3 mt-6">Training intensity preference</label>
                <div className="flex gap-3">
                  {["chill", "normal", "intense"].map((level) => (
                    <button
                      key={level}
                      onClick={() => updateForm({ intensity: level })}
                      className={`flex-1 p-4 rounded-xl border transition-all capitalize ${
                        formData.intensity === level
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {safeStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Test your baseline</h2>
              
              <p className="text-sm text-slate-400 mb-4">
                These help us calibrate your starting point. Estimate if you haven&apos;t tested recently.
              </p>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Max push-ups in one set *</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 5, 10, 15, 20, 30, 40, 50].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateForm({ maxPushups: num === 0 ? "cannot" : num })}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        (num === 0 && formData.maxPushups === "cannot") || formData.maxPushups === num
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {num === 0 ? "Can't yet" : num === 50 ? "50+" : num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Max pull-ups in one set</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateForm({ maxPullups: "no_bar" })}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      formData.maxPullups === "no_bar"
                        ? "bg-slate-500/20 border-slate-500/40 text-slate-400"
                        : "bg-white/5 border-white/10 text-white hover:border-white/20"
                    }`}
                  >
                    No access
                  </button>
                  {[0, 1, 3, 5, 8, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => updateForm({ maxPullups: num === 0 ? "cannot" : num })}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        (num === 0 && formData.maxPullups === "cannot") || formData.maxPullups === num
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {num === 0 ? "Can't yet" : num === 20 ? "20+" : num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-3">Plank hold (seconds) *</label>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 45, 60, 90, 120, 180].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => updateForm({ plankSec: sec })}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        formData.plankSec === sec
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : "bg-white/5 border-white/10 text-white hover:border-white/20"
                      }`}
                    >
                      {sec < 60 ? `${sec}s` : `${sec / 60}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {safeStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Review your profile</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-slate-500 mb-1">Basic Info</div>
                  <div className="text-white">
                    {formData.name && `${formData.name}, `}
                    {formData.age} years old, {formData.heightCm}cm, {formData.weightKg}kg
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-slate-500 mb-1">Schedule</div>
                  <div className="text-white">
                    {formData.daysPerWeek} days/week, {formData.sessionDuration} min sessions
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-slate-500 mb-1">Goals</div>
                  <div className="text-white">
                    {Array.isArray(formData.goals) ? formData.goals.join(", ").replace(/_/g, " ") : "Not set"}
                  </div>
                </div>

                {/* Safety Confirmations */}
                <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h3 className="text-amber-400 font-medium mb-3">Safety Confirmation</h3>
                  <div className="space-y-3 text-sm">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 accent-emerald-500" />
                      <span className="text-slate-300">
                        I understand this plan is for educational purposes and I should consult a healthcare provider before starting.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 accent-emerald-500" />
                      <span className="text-slate-300">
                        I will stop exercising if I feel pain and consult a professional.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation message */}
        {!canProceed && safeStep < STEPS.length - 1 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
            </svg>
            Please complete all required fields to continue
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4m0 4h.01" strokeLinecap="round"/>
            </svg>
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prevStep}
            disabled={safeStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              safeStep === 0
                ? "text-slate-600 cursor-not-allowed"
                : "text-white border border-white/10 hover:bg-white/5"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m0 0l7 7m-7-7l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>

          {safeStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                canProceed
                  ? "bg-white text-black hover:bg-slate-100"
                  : "bg-white/20 text-slate-500 cursor-not-allowed"
              }`}
            >
              Continue
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-7-7m7 7l-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25"/>
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  Saving Profile...
                </>
              ) : (
                <>
                  {session ? "Generate My Plan" : "Sign Up to Continue"}
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
