"use client";

import { TooltipInfo } from "../ui/TooltipInfo";
import type { Baseline } from "@/types/assessment";

interface BaselineStepProps {
  data: Partial<Baseline>;
  onUpdate: (data: Partial<Baseline>) => void;
}

export function BaselineStep({ data, onUpdate }: BaselineStepProps) {
  return (
    <div className="space-y-8">
      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-emerald-400 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
          </svg>
          <div>
            <p className="text-sm text-emerald-400 font-medium">Quick baseline tests</p>
            <p className="text-xs text-slate-400 mt-1">
              These help us calibrate your starting point. Do each test fresh, not after a workout. 
              It's okay to estimate if you haven't tested recently.
            </p>
          </div>
        </div>
      </div>

      {/* Push-ups */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Max push-ups in one set <span className="text-red-400">*</span>
          <TooltipInfo text="Do as many strict push-ups as you can with good form. Stop when form breaks down." />
        </label>
        <div className="flex flex-wrap gap-2">
          {[0, 5, 10, 15, 20, 25, 30, 40, 50].map((num) => (
            <button
              key={num}
              onClick={() => onUpdate({ ...data, maxPushups: num === 0 ? "cannot_do" : num })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                (num === 0 && data.maxPushups === "cannot_do") || data.maxPushups === num
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {num === 0 ? "Can't do" : num === 50 ? "50+" : num}
            </button>
          ))}
          <input
            type="number"
            placeholder="Other"
            value={typeof data.maxPushups === "number" && ![5, 10, 15, 20, 25, 30, 40, 50].includes(data.maxPushups) ? data.maxPushups : ""}
            onChange={(e) => onUpdate({ ...data, maxPushups: parseInt(e.target.value) || undefined })}
            className="w-20 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-white placeholder-slate-600 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Pull-ups */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Max pull-ups in one set
          <TooltipInfo text="Strict pull-ups from dead hang. Chin over bar counts as a rep." />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onUpdate({ ...data, maxPullups: "no_bar" })}
            className={`px-4 py-2 rounded-lg border transition-all ${
              data.maxPullups === "no_bar"
                ? "bg-slate-500/20 border-slate-500/40 text-slate-400"
                : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
            }`}
          >
            No access
          </button>
          {[0, 1, 3, 5, 8, 10, 12, 15, 20].map((num) => (
            <button
              key={num}
              onClick={() => onUpdate({ ...data, maxPullups: num === 0 ? "cannot_do" : num })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                (num === 0 && data.maxPullups === "cannot_do") || data.maxPullups === num
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {num === 0 ? "Can't yet" : num === 20 ? "20+" : num}
            </button>
          ))}
        </div>
      </div>

      {/* Dips */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Max dips in one set
          <TooltipInfo text="Full range of motion dips on parallel bars or dip station." />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onUpdate({ ...data, maxDips: "no_station" })}
            className={`px-4 py-2 rounded-lg border transition-all ${
              data.maxDips === "no_station"
                ? "bg-slate-500/20 border-slate-500/40 text-slate-400"
                : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
            }`}
          >
            No access
          </button>
          {[0, 3, 5, 8, 10, 15, 20, 25].map((num) => (
            <button
              key={num}
              onClick={() => onUpdate({ ...data, maxDips: num === 0 ? "cannot_do" : num })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                (num === 0 && data.maxDips === "cannot_do") || data.maxDips === num
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {num === 0 ? "Can't yet" : num === 25 ? "25+" : num}
            </button>
          ))}
        </div>
      </div>

      {/* Plank hold */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Plank hold time (seconds) <span className="text-red-400">*</span>
          <TooltipInfo text="High plank position with good form. Stop when form breaks." />
        </label>
        <div className="flex flex-wrap gap-2">
          {[15, 30, 45, 60, 90, 120, 180].map((sec) => (
            <button
              key={sec}
              onClick={() => onUpdate({ ...data, plankHoldSec: sec })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                data.plankHoldSec === sec
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {sec < 60 ? `${sec}s` : sec === 60 ? "1 min" : sec === 90 ? "1.5 min" : sec === 120 ? "2 min" : "3+ min"}
            </button>
          ))}
        </div>
      </div>

      {/* Hollow hold */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Hollow body hold (seconds)
          <TooltipInfo text="Lying on back, lower back pressed to floor, legs and shoulders off ground." />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onUpdate({ ...data, hollowHoldSec: "unfamiliar" })}
            className={`px-4 py-2 rounded-lg border transition-all ${
              data.hollowHoldSec === "unfamiliar"
                ? "bg-slate-500/20 border-slate-500/40 text-slate-400"
                : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
            }`}
          >
            Not familiar
          </button>
          {[10, 20, 30, 45, 60].map((sec) => (
            <button
              key={sec}
              onClick={() => onUpdate({ ...data, hollowHoldSec: sec })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                data.hollowHoldSec === sec
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Wall handstand */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
          Wall handstand hold (seconds)
          <TooltipInfo text="Belly-to-wall handstand. Just test your best hold time." />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onUpdate({ ...data, wallHandstandHoldSec: "never_tried" })}
            className={`px-4 py-2 rounded-lg border transition-all ${
              data.wallHandstandHoldSec === "never_tried"
                ? "bg-slate-500/20 border-slate-500/40 text-slate-400"
                : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
            }`}
          >
            Never tried
          </button>
          <button
            onClick={() => onUpdate({ ...data, wallHandstandHoldSec: "cannot_do" })}
            className={`px-4 py-2 rounded-lg border transition-all ${
              data.wallHandstandHoldSec === "cannot_do"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
            }`}
          >
            Can't hold it
          </button>
          {[10, 20, 30, 45, 60, 90].map((sec) => (
            <button
              key={sec}
              onClick={() => onUpdate({ ...data, wallHandstandHoldSec: sec })}
              className={`px-4 py-2 rounded-lg border transition-all ${
                data.wallHandstandHoldSec === sec
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : "bg-white/[0.02] border-white/10 text-white hover:border-white/20"
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

