"use client";

import { useState } from "react";

interface TooltipInfoProps {
  text: string;
}

export function TooltipInfo({ text }: TooltipInfoProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/20 transition-colors"
        aria-label="More information"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
        </svg>
      </button>
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 rounded-lg bg-[#1a1b20] border border-white/10 shadow-xl animate-fade-in">
          <p className="text-xs text-slate-300">{text}</p>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a1b20] border-r border-b border-white/10 transform rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}

