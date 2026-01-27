"use client";

import { TooltipInfo } from "../ui/TooltipInfo";
import type { Location, TrainingLocation } from "@/types/assessment";

interface LocationStepProps {
  data: Partial<Location>;
  onUpdate: (data: Partial<Location>) => void;
}

const LOCATION_OPTIONS: { value: TrainingLocation; label: string; icon: string; description: string }[] = [
  { 
    value: "home", 
    label: "Home", 
    icon: "🏠", 
    description: "Living room, garage, or home gym setup" 
  },
  { 
    value: "park", 
    label: "Park / Outdoors", 
    icon: "🌳", 
    description: "Pull-up bars, benches, outdoor equipment" 
  },
  { 
    value: "gym", 
    label: "Gym", 
    icon: "🏋️", 
    description: "Commercial gym with full equipment" 
  },
  { 
    value: "mixed", 
    label: "Mixed", 
    icon: "🔄", 
    description: "Combination of locations" 
  },
];

export function LocationStep({ data, onUpdate }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-4">
          Where will you primarily train? <span className="text-red-400">*</span>
          <TooltipInfo text="This helps us recommend exercises that work with your environment" />
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LOCATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate({ trainingLocation: option.value })}
              className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden ${
                data.trainingLocation === option.value
                  ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              {/* Selected indicator */}
              {data.trainingLocation === option.value && (
                <div className="absolute top-3 right-3">
                  <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
                  </svg>
                </div>
              )}
              
              <div className="text-4xl mb-3">{option.icon}</div>
              <div className={`text-lg font-medium mb-1 ${
                data.trainingLocation === option.value ? "text-emerald-400" : "text-white"
              }`}>
                {option.label}
              </div>
              <div className="text-sm text-slate-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location tips */}
      {data.trainingLocation && (
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 animate-fade-slide-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div>
              <p className="text-sm text-emerald-400 font-medium mb-1">
                {getLocationTip(data.trainingLocation).title}
              </p>
              <p className="text-xs text-slate-400">
                {getLocationTip(data.trainingLocation).tip}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getLocationTip(location: TrainingLocation): { title: string; tip: string } {
  const tips: Record<TrainingLocation, { title: string; tip: string }> = {
    home: {
      title: "Home Training Tips",
      tip: "A pull-up bar in a doorway and some floor space is all you need to start. Consider investing in rings for more exercise variety.",
    },
    park: {
      title: "Outdoor Training Tips",
      tip: "Look for parks with pull-up bars and parallel bars. Early morning or evening sessions avoid crowds and heat.",
    },
    gym: {
      title: "Gym Training Tips",
      tip: "Take advantage of cable machines for assisted movements and dip stations. Ring attachments can be added to most setups.",
    },
    mixed: {
      title: "Flexible Training Tips",
      tip: "Having multiple training locations gives you variety. We'll design your plan to work anywhere.",
    },
  };
  return tips[location];
}

