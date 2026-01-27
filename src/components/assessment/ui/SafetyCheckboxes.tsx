"use client";

import type { SafetyConfirmations } from "@/types/assessment";

interface SafetyCheckboxesProps {
  isMinor: boolean;
  confirmations: Partial<SafetyConfirmations>;
  onUpdate: (data: Partial<SafetyConfirmations>) => void;
}

const BASE_CONFIRMATIONS = [
  {
    id: "educational",
    label: "I understand this is educational information, not medical advice",
    description: "CalisAI provides fitness guidance for educational purposes only.",
  },
  {
    id: "consultProfessional",
    label: "I will consult a healthcare professional if I have pain or medical conditions",
    description: "Always seek professional advice for injuries or health concerns.",
  },
  {
    id: "stopOnPain",
    label: "I will stop immediately if I experience sharp pain during any exercise",
    description: "Pain is a signal to stop. Never push through sharp or unusual pain.",
  },
];

const MINOR_CONFIRMATION = {
  id: "parentalGuidance",
  label: "I have parental/guardian guidance for this training program",
  description: "Users under 18 should train with adult supervision.",
};

export function SafetyCheckboxes({ isMinor, confirmations, onUpdate }: SafetyCheckboxesProps) {
  const allItems = isMinor 
    ? [...BASE_CONFIRMATIONS, MINOR_CONFIRMATION]
    : BASE_CONFIRMATIONS;

  return (
    <div className="space-y-4">
      {allItems.map((item) => {
        const key = item.id as keyof SafetyConfirmations;
        const isChecked = confirmations[key] === true;

        return (
          <label
            key={item.id}
            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
              isChecked
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="pt-0.5">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                isChecked
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-white/20"
              }`}>
                {isChecked && (
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => onUpdate({ ...confirmations, [key]: e.target.checked })}
                className="sr-only"
                aria-describedby={`${item.id}-description`}
              />
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isChecked ? "text-emerald-400" : "text-white"}`}>
                {item.label}
              </p>
              <p id={`${item.id}-description`} className="text-xs text-slate-500 mt-1">
                {item.description}
              </p>
            </div>
          </label>
        );
      })}

      {/* Legal note */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-slate-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-xs text-slate-500">
            By continuing, you agree to our{" "}
            <a href="/terms" className="text-emerald-400 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/disclaimer" className="text-emerald-400 hover:underline">Fitness Disclaimer</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

