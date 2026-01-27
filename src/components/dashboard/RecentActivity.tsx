"use client";

interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  exercises: number;
}

interface Props {
  workouts: Workout[];
}

export function RecentActivity({ workouts }: Props) {
  if (workouts.length === 0) {
    return (
      <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="text-center py-8 text-slate-500">
          <p>No workouts yet. Start training to see your activity!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
      
      <div className="space-y-3">
        {workouts.map((workout) => (
          <div
            key={workout.id}
            className="flex items-center justify-between p-3 bg-[#121317] rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                💪
              </div>
              <div>
                <div className="text-white font-medium capitalize">
                  {workout.type.replace("_", " ")} Day
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(workout.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white">{workout.exercises} exercises</div>
              <div className="text-xs text-slate-500">{workout.duration} min</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

