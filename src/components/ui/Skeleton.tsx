"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className = "", 
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = "skeleton animate-pulse";
  
  const variantClasses = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-2xl",
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === "circular" ? height : "100%"),
    height: height ?? (variant === "text" ? "1rem" : variant === "circular" ? width : "auto"),
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={`${baseClasses} ${variantClasses.text}`}
            style={{ 
              ...style, 
              width: i === lines - 1 ? "75%" : "100%" 
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton layouts
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`card-interactive p-6 space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="text" lines={2} />
    </div>
  );
}

export function SkeletonStats({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-interactive p-4 space-y-3">
          <Skeleton variant="text" width="50%" height={12} />
          <Skeleton variant="text" width="70%" height={24} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonWorkoutDay({ className = "" }: { className?: string }) {
  return (
    <div className={`card-interactive p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="text" width={80} height={14} />
        </div>
        <Skeleton variant="rectangular" width={80} height={32} className="rounded-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02]">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={12} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonExerciseCard({ className = "" }: { className?: string }) {
  return (
    <div className={`card-interactive p-4 ${className}`}>
      <Skeleton variant="rectangular" height={160} className="mb-4" />
      <Skeleton variant="text" width="70%" height={18} className="mb-2" />
      <Skeleton variant="text" width="50%" height={14} />
    </div>
  );
}

