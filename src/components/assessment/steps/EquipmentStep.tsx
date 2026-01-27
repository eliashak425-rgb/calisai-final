"use client";

import { TooltipInfo } from "../ui/TooltipInfo";
import type { Equipment } from "@/types/assessment";

interface EquipmentStepProps {
  data: Partial<Equipment>;
  onUpdate: (data: Partial<Equipment>) => void;
}

const EQUIPMENT_OPTIONS: { key: keyof Equipment; label: string; icon: string; description: string }[] = [
  { key: "pullUpBar", label: "Pull-up Bar", icon: "🏗️", description: "Doorway or wall-mounted" },
  { key: "dipStation", label: "Dip Station", icon: "⬇️", description: "Parallel dip bars" },
  { key: "rings", label: "Gymnastic Rings", icon: "⭕", description: "Wooden or plastic rings" },
  { key: "parallelBars", label: "Parallel Bars", icon: "║", description: "P-bars or park bars" },
  { key: "parallettes", label: "Parallettes", icon: "═", description: "Small parallel handles" },
  { key: "resistanceBands", label: "Resistance Bands", icon: "〰️", description: "For assistance & resistance" },
  { key: "weightedVest", label: "Weighted Vest", icon: "🦺", description: "For progressive overload" },
];

export function EquipmentStep({ data, onUpdate }: EquipmentStepProps) {
  const hasNone = data.none === true;
  const hasAny = Object.entries(data).some(([k, v]) => k !== "none" && v === true);

  const toggleEquipment = (key: keyof Equipment) => {
    if (key === "none") {
      // If selecting "none", deselect everything else
      onUpdate({ none: true });
    } else {
      // If selecting equipment, deselect "none"
      onUpdate({
        ...data,
        [key]: !data[key],
        none: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
          What equipment do you have access to? <span className="text-red-400">*</span>
          <TooltipInfo text="Select all that apply. We'll design exercises around what you have." />
        </label>
        <p className="text-xs text-slate-500 mb-4">
          Select all equipment you can use regularly
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EQUIPMENT_OPTIONS.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleEquipment(item.key)}
              className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                data[item.key]
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : hasNone
                  ? "bg-white/[0.01] border-white/5 opacity-50"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Checkbox */}
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                data[item.key]
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-white/20"
              }`}>
                {data[item.key] && (
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className={`font-medium ${data[item.key] ? "text-emerald-400" : "text-white"}`}>
                    {item.label}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* No equipment option */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={() => toggleEquipment("none")}
          className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
            hasNone
              ? "bg-amber-500/10 border-amber-500/30"
              : "bg-white/[0.02] border-white/10 hover:border-white/20"
          }`}
        >
          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
            hasNone
              ? "bg-amber-500 border-amber-500"
              : "border-white/20"
          }`}>
            {hasNone && (
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚫</span>
              <span className={`font-medium ${hasNone ? "text-amber-400" : "text-white"}`}>
                No Equipment
              </span>
            </div>
            <div className="text-xs text-slate-500">Floor exercises only (push-ups, squats, etc.)</div>
          </div>
        </button>
      </div>

      {/* Recommendations based on selection */}
      {(hasAny || hasNone) && (
        <div className={`p-4 rounded-xl ${
          hasNone
            ? "bg-amber-500/5 border border-amber-500/10"
            : "bg-emerald-500/5 border border-emerald-500/10"
        } animate-fade-slide-in`}>
          <div className="flex items-start gap-3">
            <svg className={`w-5 h-5 mt-0.5 ${hasNone ? "text-amber-400" : "text-emerald-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
            </svg>
            <div>
              {hasNone ? (
                <>
                  <p className="text-sm text-amber-400 font-medium">No equipment? No problem!</p>
                  <p className="text-xs text-slate-400 mt-1">
                    We can create an effective calisthenics program using just your bodyweight. 
                    Consider getting a doorway pull-up bar when you're ready to progress.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-emerald-400 font-medium">Great setup!</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {getEquipmentMessage(data)}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getEquipmentMessage(equipment: Partial<Equipment>): string {
  const hasRings = equipment.rings;
  const hasPullup = equipment.pullUpBar;
  const hasDips = equipment.dipStation || equipment.parallelBars;

  if (hasRings && hasPullup && hasDips) {
    return "You have everything needed for advanced calisthenics training. Let's make the most of it!";
  } else if (hasPullup && hasDips) {
    return "Pull-up bar and dip station is the classic combo. You can do most calisthenics exercises with this setup.";
  } else if (hasPullup) {
    return "A pull-up bar opens up tons of exercises. We'll include creative dip alternatives.";
  } else if (equipment.resistanceBands) {
    return "Resistance bands are versatile! Great for assistance work and building towards harder progressions.";
  }
  return "We'll design your plan around your available equipment.";
}

