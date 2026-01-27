"use client";

interface Props {
  data: { day: string; count: number }[];
}

export function WeeklyChart({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-6">Weekly Activity</h3>
      
      <div className="flex items-end justify-between gap-2 h-32">
        {data.map((item, i) => {
          const height = (item.count / maxCount) * 100;
          const isToday = i === data.length - 1;
          
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-24">
                <div
                  className={`w-full max-w-8 rounded-t transition-all ${
                    item.count > 0
                      ? isToday
                        ? "bg-emerald-500"
                        : "bg-emerald-500/50"
                      : "bg-white/5"
                  }`}
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
              </div>
              <span className={`text-xs ${isToday ? "text-emerald-400" : "text-slate-500"}`}>
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

