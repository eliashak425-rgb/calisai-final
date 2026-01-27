"use client";

import { TooltipInfo } from "../ui/TooltipInfo";
import type { InjuryScreen, PainArea } from "@/types/assessment";

interface InjuryStepProps {
  data: Partial<InjuryScreen>;
  onUpdate: (data: Partial<InjuryScreen>) => void;
}

const PAIN_AREA_OPTIONS: { value: PainArea; label: string; icon: string }[] = [
  { value: "shoulder", label: "Shoulder", icon: "🦴" },
  { value: "elbow", label: "Elbow", icon: "💪" },
  { value: "wrist", label: "Wrist", icon: "✋" },
  { value: "lower_back", label: "Lower Back", icon: "🔙" },
  { value: "knee", label: "Knee", icon: "🦵" },
  { value: "ankle", label: "Ankle", icon: "🦶" },
  { value: "neck", label: "Neck", icon: "👤" },
];

export function InjuryStep({ data, onUpdate }: InjuryStepProps) {
  const hasPain = data.hasCurrentPain === true;
  const painAreas = data.painAreas || [];

  const togglePainArea = (area: PainArea) => {
    const current = [...painAreas];
    const index = current.indexOf(area);
    
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(area);
    }
    
    onUpdate({ ...data, painAreas: current });
  };

  return (
    <div className="space-y-8">
      {/* Main question */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          Do you have any current pain or injuries? <span className="text-red-400">*</span>
          <TooltipInfo text="Be honest - we'll adapt your plan to keep you safe and avoid aggravating existing issues" />
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onUpdate({ ...data, hasCurrentPain: false, painAreas: [], painSeverity: undefined })}
            className={`p-6 rounded-2xl border transition-all ${
              data.hasCurrentPain === false
                ? "bg-emerald-500/10 border-emerald-500/30"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-4xl mb-3">✅</div>
            <div className={`text-lg font-medium ${data.hasCurrentPain === false ? "text-emerald-400" : "text-white"}`}>
              No Pain
            </div>
            <div className="text-sm text-slate-500 mt-1">I'm injury-free</div>
          </button>

          <button
            onClick={() => onUpdate({ ...data, hasCurrentPain: true })}
            className={`p-6 rounded-2xl border transition-all ${
              hasPain
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-white/[0.02] border-white/10 hover:border-white/20"
            }`}
          >
            <div className="text-4xl mb-3">⚠️</div>
            <div className={`text-lg font-medium ${hasPain ? "text-amber-400" : "text-white"}`}>
              Yes, Some Pain
            </div>
            <div className="text-sm text-slate-500 mt-1">I have limitations</div>
          </button>
        </div>
      </div>

      {/* Pain area selection */}
      {hasPain && (
        <div className="animate-fade-slide-in space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-4">
              Where do you feel pain or discomfort?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PAIN_AREA_OPTIONS.map((option) => {
                const isSelected = painAreas.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => togglePainArea(option.value)}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-white/[0.02] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className={`text-sm font-medium ${isSelected ? "text-amber-400" : "text-white"}`}>
                      {option.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pain severity */}
          {painAreas.length > 0 && (
            <div className="animate-fade-slide-in">
              <label className="block text-sm font-medium text-slate-300 mb-4">
                How severe is the pain? (1 = mild, 10 = severe)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={data.painSeverity || 5}
                  onChange={(e) => onUpdate({ ...data, painSeverity: parseInt(e.target.value) })}
                  className="flex-1 h-2 rounded-full appearance-none bg-white/10 accent-amber-500"
                />
                <span className={`text-2xl font-bold min-w-[3ch] text-right ${
                  (data.painSeverity || 5) <= 3
                    ? "text-emerald-400"
                    : (data.painSeverity || 5) <= 6
                    ? "text-amber-400"
                    : "text-red-400"
                }`}>
                  {data.painSeverity || 5}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>Mild discomfort</span>
                <span>Moderate</span>
                <span>Severe pain</span>
              </div>
            </div>
          )}

          {/* Diagnosed condition */}
          {painAreas.length > 0 && (
            <div className="animate-fade-slide-in">
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                  data.diagnosed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-white/20"
                }`}>
                  {data.diagnosed && (
                    <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="checkbox"
                    checked={data.diagnosed || false}
                    onChange={(e) => onUpdate({ ...data, diagnosed: e.target.checked })}
                    className="sr-only"
                  />
                  <span className="text-white">This has been diagnosed by a medical professional</span>
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Safety message */}
      {hasPain && painAreas.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 animate-fade-slide-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm text-amber-400 font-medium">We'll protect these areas</p>
              <p className="text-xs text-slate-400 mt-1">
                Your plan will avoid exercises that stress your {painAreas.map(a => a.replace("_", " ")).join(", ")}.
                If you experience sharp pain during any exercise, stop immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* No pain message */}
      {data.hasCurrentPain === false && (
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 animate-fade-slide-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
            </svg>
            <div>
              <p className="text-sm text-emerald-400 font-medium">Great news!</p>
              <p className="text-xs text-slate-400 mt-1">
                Since you're injury-free, you'll have access to the full exercise library. 
                Remember to always warm up properly and listen to your body.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

