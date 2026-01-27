"use client";

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function OptionCard({
  selected,
  onClick,
  icon,
  label,
  description,
  disabled = false,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative p-4 rounded-xl border text-left transition-all ${
        disabled
          ? "opacity-50 cursor-not-allowed bg-white/[0.01] border-white/5"
          : selected
          ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5"
          : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      {icon && (
        <div className={`text-2xl mb-2 ${selected ? "" : "grayscale-[50%]"}`}>
          {icon}
        </div>
      )}
      <div className={`font-medium ${selected ? "text-emerald-400" : "text-white"}`}>
        {label}
      </div>
      {description && (
        <div className="text-xs text-slate-500 mt-1">{description}</div>
      )}
      {selected && (
        <div className="absolute top-2 right-2">
          <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

