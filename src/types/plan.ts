export interface ExerciseBlock {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  tempo: string | null;
  intensity: {
    type: "rpe" | "rir" | "percentage";
    value: number;
  };
  notes: string | null;
  progression: {
    rule: string;
    nextExercise?: string | null;
  };
  regression: {
    exerciseId: string;
    reason: string;
  };
  tags: string[];
}

export interface WorkoutBlock {
  blockType: "warmup" | "skill" | "strength" | "conditioning" | "cooldown";
  durationMin: number;
  exercises: ExerciseBlock[];
}

export interface DayStructure {
  dayNumber: number;
  dayType: "push" | "pull" | "legs" | "full" | "skill" | "rest" | "active_recovery";
  totalDurationMin: number;
  blocks: WorkoutBlock[];
}

export interface GeneratedPlanResponse {
  weeklyStructure: DayStructure[];
  metadata: {
    totalWeeklyVolume: number;
    pushPullRatio: number;
    skillFocus: string[];
    avoidedMovements: string[];
  };
}

// Database model types
export interface WorkoutPlan {
  id: string;
  userId: string;
  profileId: string;
  profileVersion: number;
  promptVersion: string;
  validUntil: Date;
  isActive: boolean;
  totalWeeklyVolume: number;
  pushPullRatio: number;
  skillFocus: string | string[];
  avoidedMovements: string | string[];
  generationType: string;
  templateId?: string | null;
  days: WorkoutDay[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutDay {
  id: string;
  planId: string;
  dayNumber: number;
  dayType: string;
  totalDurationMin: number;
  blocks: WorkoutDayBlock[];
}

export interface WorkoutDayBlock {
  id: string;
  dayId: string;
  blockType: string;
  durationMin: number;
  orderIndex: number;
  exercises: BlockExercise[];
}

export interface BlockExercise {
  id: string;
  blockId: string;
  exerciseId: string;
  orderIndex: number;
  sets: number;
  reps: string;
  restSec: number;
  tempo?: string | null;
  intensity: string;
  notes?: string | null;
  progressionRule?: string | null;
  progressionExercise?: string | null;
  regressionExercise?: string | null;
  regressionReason?: string | null;
}
