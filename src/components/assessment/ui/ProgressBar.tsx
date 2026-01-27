"use client";

interface Step {
  id: string;
  title: string;
  icon: string;
}

interface ProgressBarProps {
  steps: readonly Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function ProgressBar({ steps, currentStep, onStepClick }: ProgressBarProps) {
  return (
    <div className="space-y-3">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepClick(index)}
            disabled={index > currentStep}
            className={`flex flex-col items-center transition-all group ${
              index > currentStep ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all ${
                index < currentStep
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                  : index === currentStep
                  ? "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400"
                  : "bg-white/[0.02] border border-white/10 text-slate-500"
              }`}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            <span className={`text-[10px] mt-1.5 hidden md:block font-medium transition-colors ${
              index <= currentStep ? "text-white" : "text-slate-600"
            }`}>
              {step.title}
            </span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Progress text */}
      <div className="flex justify-between text-xs text-slate-500">
        <span>{steps[currentStep].title}</span>
        <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
      </div>
    </div>
  );
}

