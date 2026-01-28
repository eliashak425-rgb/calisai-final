"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface ExerciseLibraryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  difficulty: string;
  movementPattern: string;
  primaryMuscles: string;
}

interface Exercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  sets: number;
  reps: string;
  restSec: number;
  tempo: string | null;
  intensity: string;
  notes: string | null;
  exercise?: ExerciseLibraryData;
}

interface Block {
  id: string;
  blockType: string;
  durationMin: number;
  exercises: Exercise[];
}

interface WorkoutDay {
  id: string;
  dayNumber: number;
  dayType: string;
  totalDurationMin: number;
  blocks: Block[];
}

interface SetLog {
  setNumber: number;
  reps: number | null;
  completed: boolean;
}

interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

type TimerState = "idle" | "running" | "paused";

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const dayId = params.dayId as string;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [workoutDay, setWorkoutDay] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [logs, setLogs] = useState<Record<string, ExerciseLog>>({});
  const [restTimer, setRestTimer] = useState<number>(0);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [showSummary, setShowSummary] = useState(false);
  const [saving, setSaving] = useState(false);
  const [startTime] = useState<Date>(new Date());
  const [customReps, setCustomReps] = useState<number>(10);
  const [activeSetIndex, setActiveSetIndex] = useState<number | null>(null);

  // Flatten exercises for navigation
  const allExercises = workoutDay?.blocks.flatMap((block) =>
    block.exercises.map((ex) => ({ ...ex, blockType: block.blockType }))
  ) || [];

  const currentExercise = allExercises[currentExerciseIndex];
  const currentLog = currentExercise ? logs[currentExercise.id] : null;

  // Check if all sets are completed for current exercise
  const allSetsCompleted = currentLog?.sets.every((s) => s.completed) ?? false;
  const completedSets = currentLog?.sets.filter((s) => s.completed).length || 0;

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workout/${dayId}`);
        if (response.ok) {
          const data = await response.json();
          setWorkoutDay(data);

          // Initialize logs
          const initialLogs: Record<string, ExerciseLog> = {};
          data.blocks.forEach((block: Block) => {
            block.exercises.forEach((ex: Exercise) => {
              initialLogs[ex.id] = {
                exerciseId: ex.exerciseId,
                sets: Array.from({ length: ex.sets }, (_, i) => ({
                  setNumber: i + 1,
                  reps: null,
                  completed: false,
                })),
              };
            });
          });
          setLogs(initialLogs);
        } else if (response.status === 403) {
          // Subscription required
          router.push("/paywall");
        }
      } catch (error) {
        console.error("Failed to fetch workout", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [dayId, router]);

  // Initialize custom reps when exercise changes
  useEffect(() => {
    if (currentExercise) {
      const baseReps = parseInt(currentExercise.reps) || 10;
      setCustomReps(baseReps);
      setActiveSetIndex(null);
    }
  }, [currentExercise]);

  // Rest timer countdown with audio
  useEffect(() => {
    if (timerState === "running" && restTimer > 0) {
      const timer = setTimeout(() => setRestTimer(restTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (restTimer === 0 && timerState === "running") {
      setTimerState("idle");
      // Play sound when timer ends
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [restTimer, timerState]);

  const startRest = useCallback((seconds: number) => {
    setRestTimer(seconds);
    setTimerState("running");
  }, []);

  const pauseTimer = () => setTimerState("paused");
  const resumeTimer = () => setTimerState("running");
  const skipRest = () => {
    setRestTimer(0);
    setTimerState("idle");
  };

  const logSet = (setIndex: number, reps: number) => {
    if (!currentExercise) return;

    setLogs((prev) => ({
      ...prev,
      [currentExercise.id]: {
        ...prev[currentExercise.id],
        sets: prev[currentExercise.id].sets.map((set, idx) =>
          idx === setIndex ? { ...set, reps, completed: true } : set
        ),
      },
    }));

    setActiveSetIndex(null);

    // Auto-start rest timer after logging (only if not the last set)
    const newCompletedSets = completedSets + 1;
    if (newCompletedSets < currentExercise.sets) {
      startRest(currentExercise.restSec);
    }
  };

  const nextExercise = () => {
    if (!allSetsCompleted) return; // Enforce completion

    if (currentExerciseIndex < allExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setTimerState("idle");
      setRestTimer(0);
    } else {
      setShowSummary(true);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      setTimerState("idle");
      setRestTimer(0);
    }
  };

  const finishWorkout = async () => {
    setSaving(true);
    try {
      const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000);
      await fetch("/api/workout/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayId,
          logs: Object.values(logs),
          completedAt: new Date().toISOString(),
          duration: duration || workoutDay?.totalDurationMin || 0,
        }),
      });
      router.push("/plan?completed=true");
    } catch (error) {
      console.error("Failed to save workout", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M7 3v3M17 3v3M7 18v3M17 18v3" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="text-neutral-400">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!workoutDay) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M15 9l-6 6m0-6l6 6" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Workout Not Found</h1>
          <p className="text-neutral-400 mb-6">We couldn&apos;t find this workout.</p>
          <Link
            href="/plan"
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium"
          >
            Back to Plan
          </Link>
        </div>
      </div>
    );
  }

  // Summary Screen
  if (showSummary) {
    const totalSetsCompleted = Object.values(logs).reduce(
      (acc, log) => acc + log.sets.filter((s) => s.completed).length, 0
    );
    const totalReps = Object.values(logs).reduce(
      (acc, log) => acc + log.sets.reduce((sum, s) => sum + (s.reps || 0), 0), 0
    );
    const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000);

    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 ring-1 ring-neutral-700 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Workout Complete!</h1>
            <p className="text-neutral-400 mb-8">Great job pushing yourself today!</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl bg-neutral-800/50 p-4">
                <div className="text-2xl font-bold text-emerald-400">{totalSetsCompleted}</div>
                <div className="text-xs text-neutral-500">Sets</div>
              </div>
              <div className="rounded-xl bg-neutral-800/50 p-4">
                <div className="text-2xl font-bold text-violet-400">{totalReps}</div>
                <div className="text-xs text-neutral-500">Total Reps</div>
              </div>
              <div className="rounded-xl bg-neutral-800/50 p-4">
                <div className="text-2xl font-bold text-amber-400">{duration}</div>
                <div className="text-xs text-neutral-500">Minutes</div>
              </div>
            </div>

            <button
              onClick={finishWorkout}
              disabled={saving}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save & Continue"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const intensity = currentExercise ? JSON.parse(currentExercise.intensity) : null;
  const progress = Math.round(
    ((currentExerciseIndex + completedSets / (currentExercise?.sets || 1)) / allExercises.length) * 100
  );
  const targetReps = parseInt(currentExercise?.reps || "10") || 10;

  return (
    <div className="min-h-screen bg-neutral-950 pb-32">
      {/* Audio for timer end */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2EhX19e3p7fH1+f4CCgoOEhYaHiImJiomJiIeGhYSDgX9+fXx7enp6enp7fH1+f4GCg4SFhoaHiImJiYmIh4aFhIOCgH9+fXx7enp5eXl5eXp7fH1+f4GCg4SFhoaHh4iIiIiHhoWEg4KBf35" type="audio/wav"/>
      </audio>

      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-neutral-950/90 backdrop-blur-lg border-b border-neutral-800">
        <div className="h-1 bg-neutral-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <button 
            onClick={() => router.push("/plan")} 
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
            <span className="text-sm">Exit</span>
          </button>
          <span className="text-sm text-neutral-400">
            {currentExerciseIndex + 1} / {allExercises.length}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentExercise?.blockType === "warmup"
              ? "bg-amber-500/20 text-amber-400"
              : currentExercise?.blockType === "strength"
              ? "bg-red-500/20 text-red-400"
              : currentExercise?.blockType === "skill"
              ? "bg-violet-500/20 text-violet-400"
              : "bg-emerald-500/20 text-emerald-400"
          }`}>
            {currentExercise?.blockType?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      {timerState !== "idle" && (
        <div className="fixed inset-0 z-40 bg-neutral-950/98 flex items-center justify-center">
          <div className="text-center max-w-sm w-full px-6">
            <div className="mb-8">
              <div className="text-8xl font-bold text-white mb-2">
                {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, "0")}
              </div>
              <p className="text-neutral-400">Rest Time - Next set coming up!</p>
            </div>

            {/* Timer circle visualization */}
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-neutral-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * (restTimer / (currentExercise?.restSec || 60)))}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm text-neutral-500">
                  {timerState === "paused" ? "PAUSED" : "REST"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {timerState === "running" ? (
                <button
                  onClick={pauseTimer}
                  className="flex-1 py-4 bg-neutral-800 text-white rounded-xl font-medium hover:bg-neutral-700 transition-colors"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeTimer}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-400 transition-colors"
                >
                  Resume
                </button>
              )}
              <button
                onClick={skipRest}
                className="flex-1 py-4 bg-neutral-800 text-neutral-300 rounded-xl font-medium hover:bg-neutral-700 transition-colors"
              >
                Skip Rest
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pt-24 px-4">
        <div className="max-w-lg mx-auto">
          {/* Exercise Info */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 capitalize">
              {currentExercise?.exercise?.name || currentExercise?.exerciseId.replace(/_/g, " ")}
            </h1>
            <div className="flex items-center justify-center gap-4 text-neutral-400">
              <span className="text-lg">{currentExercise?.sets} × {currentExercise?.reps}</span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span>{intensity?.type.toUpperCase()} {intensity?.value}</span>
            </div>
            {/* Completion status */}
            <div className="mt-3 text-sm">
              <span className={completedSets === currentExercise?.sets ? "text-emerald-400" : "text-neutral-500"}>
                {completedSets} / {currentExercise?.sets} sets completed
              </span>
            </div>
          </div>

          {/* Form Tips Card */}
          {(currentExercise?.notes || currentExercise?.exercise?.description) && (
            <div className="mb-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 ring-1 ring-neutral-700 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Form Tips</h3>
                  <p className="text-sm text-neutral-400">
                    {currentExercise.notes || currentExercise.exercise?.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Set Tracking */}
          <div className="space-y-3 mb-8">
            {currentLog?.sets.map((set, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-4 transition-all ${
                  set.completed
                    ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                    : activeSetIndex === idx
                    ? "bg-neutral-800 ring-2 ring-emerald-500"
                    : "bg-neutral-900 ring-1 ring-neutral-800"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                      set.completed 
                        ? "bg-emerald-500 text-white" 
                        : "bg-neutral-800 text-neutral-400"
                    }`}>
                      {set.completed ? (
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        set.setNumber
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">Set {set.setNumber}</div>
                      <div className="text-sm text-neutral-500">
                        {set.completed ? `${set.reps} reps completed` : `Target: ${currentExercise?.reps}`}
                      </div>
                    </div>
                  </div>

                  {!set.completed && activeSetIndex !== idx && (
                    <button
                      onClick={() => {
                        setActiveSetIndex(idx);
                        setCustomReps(targetReps);
                      }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-400 transition-colors"
                    >
                      Log Set
                    </button>
                  )}

                  {!set.completed && activeSetIndex === idx && (
                    <div className="flex items-center gap-3">
                      {/* Rep selector with +/- buttons */}
                      <div className="flex items-center bg-neutral-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setCustomReps(Math.max(1, customReps - 1))}
                          className="w-10 h-10 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" strokeLinecap="round"/>
                          </svg>
                        </button>
                        <input
                          type="number"
                          value={customReps}
                          onChange={(e) => setCustomReps(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 h-10 bg-transparent text-center text-white text-xl font-bold focus:outline-none"
                        />
                        <button
                          onClick={() => setCustomReps(customReps + 1)}
                          className="w-10 h-10 flex items-center justify-center text-white hover:bg-neutral-700 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => logSet(idx, customReps)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  )}

                  {set.completed && (
                    <div className="text-emerald-400 font-semibold text-lg">
                      {set.reps} reps
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Manual Rest Button */}
          {completedSets > 0 && completedSets < (currentExercise?.sets || 0) && timerState === "idle" && (
            <button
              onClick={() => startRest(currentExercise?.restSec || 60)}
              className="w-full mb-4 py-3 bg-neutral-900 ring-1 ring-neutral-800 text-neutral-400 rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Start Rest Timer ({currentExercise?.restSec}s)
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-800 p-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
            className="flex-1 py-4 bg-neutral-800 text-white rounded-xl font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={nextExercise}
            disabled={!allSetsCompleted}
            className={`flex-1 py-4 rounded-xl font-semibold transition-all shadow-lg ${
              allSetsCompleted
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-emerald-500/25"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed shadow-none"
            }`}
          >
            {!allSetsCompleted ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Complete all sets
              </span>
            ) : currentExerciseIndex === allExercises.length - 1 ? (
              "Finish Workout"
            ) : (
              "Next Exercise →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
