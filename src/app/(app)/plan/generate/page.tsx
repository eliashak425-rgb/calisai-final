"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

const GENERATION_STEPS = [
  { label: "Analyzing your profile", icon: "🔍", detail: "Understanding your fitness level and goals" },
  { label: "Designing workout structure", icon: "📐", detail: "Creating optimal weekly split" },
  { label: "Selecting exercises", icon: "💪", detail: "Choosing movements that match your equipment" },
  { label: "Building progressions", icon: "📈", detail: "Adding skill-based advancement paths" },
  { label: "Optimizing recovery", icon: "🧘", detail: "Balancing intensity and rest" },
  { label: "Finalizing your plan", icon: "✨", detail: "Putting it all together" },
];

export default function GeneratePlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const generatePlan = async () => {
      try {
        // Start the generation and animate through steps
        const generationPromise = fetch("/api/plan/generate", {
          method: "POST",
        });

        // Animate through steps while waiting
        for (let i = 0; i < GENERATION_STEPS.length; i++) {
          setCurrentStep(i);
          
          if (i === GENERATION_STEPS.length - 1) {
            // Wait for actual generation on last step
            const response = await generationPromise;

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to generate plan");
            }

            setIsComplete(true);
            await new Promise((r) => setTimeout(r, 1000));
            
            // Redirect to plan view
            router.push(`/plan`);
            return;
          } else {
            await new Promise((r) => setTimeout(r, 1200));
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(false);
      }
    };

    generatePlan();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.1),transparent_60%)] pointer-events-none -z-10" />
        
        <div className="card-interactive p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 border border-red-500/20">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6m0-6l6 6" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-medium text-white mb-4">Generation Failed</h1>
          <p className="text-slate-400 mb-8">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-secondary w-full"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_60%)] pointer-events-none -z-10" />
      
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Main Card */}
        <div className="card-interactive p-8 relative overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" />
          
          <div className="relative z-10">
            {/* Animated Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 animate-pulse" />
              <div className="absolute inset-2 rounded-xl bg-[#121317] border border-emerald-500/20 flex items-center justify-center">
                <div className={`text-4xl transition-transform duration-500 ${isComplete ? "scale-125" : "animate-bounce-subtle"}`}>
                  {isComplete ? "🎉" : GENERATION_STEPS[currentStep]?.icon || "💪"}
                </div>
              </div>
              {/* Spinning ring */}
              {!isComplete && (
                <svg
                  className="absolute inset-0 w-full h-full animate-spin"
                  style={{ animationDuration: "3s" }}
                  viewBox="0 0 96 96"
                >
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    stroke="url(#spinnerGradient)"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="80 200"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>

            <h1 className="text-2xl font-display font-medium text-white mb-2 text-center">
              {isComplete ? "Your Plan is Ready!" : "Creating Your Plan"}
            </h1>
            <p className="text-slate-400 mb-8 text-center">
              {isComplete 
                ? "Redirecting you to your personalized workout program..." 
                : GENERATION_STEPS[currentStep]?.detail || "Please wait..."}
            </p>

            {/* Steps Progress */}
            <div className="space-y-3 mb-6">
              {GENERATION_STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                    i < currentStep || isComplete
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : i === currentStep
                      ? "bg-white/5 border border-white/10"
                      : "bg-transparent border border-transparent opacity-40"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                    i < currentStep || isComplete
                      ? "bg-emerald-500 text-black"
                      : i === currentStep
                      ? "bg-white/10 text-white"
                      : "bg-white/5 text-slate-500"
                  }`}>
                    {i < currentStep || isComplete ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    i <= currentStep || isComplete ? "text-white" : "text-slate-500"
                  }`}>
                    {step.label}
                  </span>
                  {i === currentStep && !isComplete && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Overall Progress Bar */}
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out rounded-full"
                style={{ width: isComplete ? "100%" : `${((currentStep + 1) / GENERATION_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fun facts while waiting */}
        {!isComplete && (
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              💡 Did you know? CalisAI considers over 200 factors when creating your personalized plan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
