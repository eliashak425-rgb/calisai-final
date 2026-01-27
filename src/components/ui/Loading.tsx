"use client";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

export function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
  const sizes = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className={`${sizes[size]} border-emerald-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-slate-400 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}

export function LoadingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

export function LoadingPulse({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
      <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
    </div>
  );
}

// Workout generation loading with animated steps
export function WorkoutGenerationLoader({ step = 0 }: { step?: number }) {
  const steps = [
    { label: "Analyzing your profile", icon: "🔍" },
    { label: "Designing workout structure", icon: "📐" },
    { label: "Selecting exercises", icon: "💪" },
    { label: "Optimizing progressions", icon: "📈" },
    { label: "Finalizing your plan", icon: "✨" },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
              i < step
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : i === step
                ? "bg-white/5 border border-white/10"
                : "bg-white/[0.02] border border-white/5 opacity-50"
            }`}
          >
            <div className={`text-2xl transition-transform duration-300 ${i === step ? "animate-bounce-subtle" : ""}`}>
              {i < step ? "✓" : s.icon}
            </div>
            <div className="flex-1">
              <div className={`font-medium ${i <= step ? "text-white" : "text-slate-500"}`}>
                {s.label}
              </div>
              {i === step && (
                <div className="h-1 mt-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-[shimmer_1s_ease-in-out_infinite]" style={{ width: "60%" }} />
                </div>
              )}
            </div>
            {i < step && (
              <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

