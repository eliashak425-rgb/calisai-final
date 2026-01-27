"use client";

import { useState } from "react";
import { TooltipInfo } from "../ui/TooltipInfo";
import { OptionCard } from "../ui/OptionCard";
import type { BasicInfo, BiologicalSex } from "@/types/assessment";

interface BasicsStepProps {
  data: Partial<BasicInfo>;
  onUpdate: (data: Partial<BasicInfo>) => void;
}

export function BasicsStep({ data, onUpdate }: BasicsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = <K extends keyof BasicInfo>(field: K, value: BasicInfo[K] | undefined) => {
    onUpdate({ ...data, [field]: value } as Partial<BasicInfo>);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const isMinor = data.age && data.age < 18;

  return (
    <div className="space-y-8">
      {/* Name (Optional) */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Name
          <span className="text-slate-600">(optional)</span>
          <TooltipInfo text="Just so we can personalize your experience" />
        </label>
        <input
          type="text"
          value={data.name || ""}
          onChange={(e) => handleFieldChange("name", e.target.value)}
          placeholder="What should we call you?"
          className="input-dark"
        />
      </div>

      {/* Age */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Age <span className="text-red-400">*</span>
          <TooltipInfo text="Needed to customize intensity and recovery recommendations" />
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={13}
            max={100}
            value={data.age || ""}
            onChange={(e) => handleFieldChange("age", parseInt(e.target.value) || undefined)}
            placeholder="Enter your age"
            className="input-dark w-32"
          />
          <span className="text-slate-500">years old</span>
        </div>
        {isMinor && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-400">
                For users under 18, we recommend training with parental guidance and consulting with a healthcare provider.
              </p>
            </div>
          </div>
        )}
        {errors.age && <p className="text-red-400 text-sm mt-2">{errors.age}</p>}
      </div>

      {/* Biological Sex */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Biological Sex <span className="text-red-400">*</span>
          <TooltipInfo text="Used for more accurate strength standards (optional to share)" />
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "male", label: "Male", icon: "♂️" },
            { value: "female", label: "Female", icon: "♀️" },
            { value: "prefer_not_to_say", label: "Prefer not to say", icon: "⚪" },
          ].map((option) => (
            <OptionCard
              key={option.value}
              selected={data.biologicalSex === option.value}
              onClick={() => handleFieldChange("biologicalSex", option.value as BiologicalSex)}
              icon={option.icon}
              label={option.label}
            />
          ))}
        </div>
      </div>

      {/* Height & Weight */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            Height <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={100}
              max={250}
              value={data.heightCm || ""}
              onChange={(e) => handleFieldChange("heightCm", parseInt(e.target.value) || undefined)}
              placeholder="175"
              className="input-dark w-24"
            />
            <span className="text-slate-500">cm</span>
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
            Weight <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={30}
              max={200}
              value={data.weightKg || ""}
              onChange={(e) => handleFieldChange("weightKg", parseInt(e.target.value) || undefined)}
              placeholder="70"
              className="input-dark w-24"
            />
            <span className="text-slate-500">kg</span>
          </div>
        </div>
      </div>

      {/* Quick note about data */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm text-slate-400">Your data stays private</p>
            <p className="text-xs text-slate-600 mt-1">
              We don't sell or share your information. This data is only used to create your personalized plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

