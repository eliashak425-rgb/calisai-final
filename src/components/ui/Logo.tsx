"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-sm" },
    md: { icon: "w-8 h-8", text: "text-base" },
    lg: { icon: "w-12 h-12", text: "text-xl" },
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* CalisAI Logo - Stylized figure in motion */}
      <div className={`${sizes[size].icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circle with gradient */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="figureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
          </defs>
          
          {/* Main circle background */}
          <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" />
          
          {/* Stylized figure doing a muscle-up/pull-up */}
          <g fill="url(#figureGradient)">
            {/* Head */}
            <circle cx="20" cy="11" r="4" />
            {/* Body - dynamic pose */}
            <path d="M20 15 L20 24 Q20 26 18 28 L14 32" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M20 24 Q20 26 22 28 L26 32" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Arms - reaching up */}
            <path d="M20 17 Q16 14 12 10" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M20 17 Q24 14 28 10" stroke="#000" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          
          {/* Motion lines */}
          <path d="M8 18 L5 18" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M8 22 L4 22" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <path d="M32 18 L35 18" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          <path d="M32 22 L36 22" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
        </svg>
      </div>
      
      {showText && (
        <span className={`font-semibold tracking-tight text-white ${sizes[size].text}`}>
          Calis<span className="text-emerald-400">AI</span>
        </span>
      )}
    </div>
  );
}

