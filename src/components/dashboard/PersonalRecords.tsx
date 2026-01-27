"use client";

interface PR {
  exercise: string;
  type: string;
  value: number | null;
  date: string;
}

interface Props {
  records: PR[];
}

export function PersonalRecords({ records }: Props) {
  if (records.length === 0) {
    return (
      <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Personal Records</h3>
        <div className="text-center py-8 text-slate-500">
          <p>No PRs yet. Keep training!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">Personal Records</h3>
      
      <div className="space-y-3">
        {records.map((pr, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-[#121317] rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400 border border-amber-500/20">
                🏆
              </div>
              <div>
                <div className="text-white font-medium capitalize">
                  {pr.exercise.replace(/_/g, " ")}
                </div>
                <div className="text-xs text-slate-500 capitalize">
                  {pr.type.replace("_", " ")}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium text-emerald-400">{pr.value}</div>
              <div className="text-xs text-slate-500">
                {new Date(pr.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

