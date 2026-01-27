"use client";

interface StickyBottomBarProps {
  currentStep: number;
  totalSteps: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function StickyBottomBar({
  currentStep,
  totalSteps,
  canGoBack,
  canGoNext,
  isLastStep,
  onBack,
  onNext,
}: StickyBottomBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Back button */}
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              canGoBack
                ? "text-white hover:bg-white/5 border border-white/10"
                : "text-slate-600 cursor-not-allowed"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m0 0l7 7m-7-7l7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Step indicator (mobile) */}
          <div className="flex items-center gap-1.5 sm:hidden">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentStep ? "bg-emerald-500" : "bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Keyboard hint (desktop) */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
            <span>Press</span>
            <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-400">Enter</kbd>
            <span>to continue</span>
          </div>

          {/* Next/Generate button */}
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
              canGoNext
                ? isLastStep
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  : "bg-white text-black hover:bg-slate-100"
                : "bg-white/10 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span>{isLastStep ? "Generate My Plan" : "Continue"}</span>
            {isLastStep ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m0 0l-7-7m7 7l-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

