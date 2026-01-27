/**
 * Plan Validation Layer
 * 
 * Validates generated workout plans against safety rules, volume caps,
 * and user constraints before they are shown or saved.
 */

import type { GeneratedPlan, DayPlan, ExerciseBlock, PlannedExercise, FitnessLevel } from "@/types/assessment";
import { shouldAvoidExercise } from "@/domain/injury/injuryMapping";

// ==================== TYPES ====================

export interface ValidationOptions {
  fitnessLevel: FitnessLevel;
  avoidTags: string[]; // Computed from painAreas, never user-provided
  daysPerWeek: number;
  sessionDurationMin: number;
}

export interface Violation {
  id: string;
  type: string;
  message: string;
  severity: "info" | "warning" | "critical";
  location?: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  violations: Violation[];
  criticalCount: number;
  warningCount: number;
  canRepair: boolean;
}

// ==================== VOLUME CAPS ====================

/**
 * Volume caps by fitness level
 * Per-session AND weekly caps to prevent overtraining
 */
export const VOLUME_CAPS = {
  beginner: {
    maxSetsPerSession: 15,
    maxSetsPerWeek: 60,
    maxExercisesPerSession: 8,
  },
  intermediate: {
    maxSetsPerSession: 22,
    maxSetsPerWeek: 100,
    maxExercisesPerSession: 12,
  },
  advanced: {
    maxSetsPerSession: 30,
    maxSetsPerWeek: 150,
    maxExercisesPerSession: 15,
  },
};

/**
 * Push/pull ratio acceptable range
 */
const PUSH_PULL_RATIO_MIN = 0.8;
const PUSH_PULL_RATIO_MAX = 1.2;

/**
 * Duration tolerance (±15%)
 */
const DURATION_TOLERANCE = 0.15;

/**
 * High-stress tags that shouldn't be stacked too much in one session
 */
const HIGH_STRESS_TAGS = [
  "overhead_pressing",
  "deep_dips",
  "planche_work",
  "handstand_pushups",
  "muscle_up_attempts",
  "straight_arm_strength",
];

const MAX_HIGH_STRESS_PER_SESSION = 4;

// ==================== MAIN VALIDATION ====================

/**
 * Validates a generated plan against all rules
 */
export function validatePlan(
  plan: GeneratedPlan,
  options: ValidationOptions
): ValidationResult {
  const violations: Violation[] = [];

  // 1. Required blocks check (warmup + cooldown)
  violations.push(...validateRequiredBlocks(plan));

  // 2. Day count check
  violations.push(...validateDayCount(plan, options.daysPerWeek));

  // 3. Duration tolerance check (±15%)
  violations.push(...validateDurations(plan, options.sessionDurationMin));

  // 4. Push/pull balance check
  violations.push(...validatePushPullBalance(plan));

  // 5. Per-session volume caps
  violations.push(...validateSessionVolume(plan, options.fitnessLevel));

  // 6. Weekly volume caps
  violations.push(...validateWeeklyVolume(plan, options.fitnessLevel));

  // 7. Injury avoidance (CRITICAL)
  violations.push(...validateInjuryAvoidance(plan, options.avoidTags));

  // 8. Impossible prescriptions check
  violations.push(...validatePrescriptions(plan));

  // 9. High-stress stacking check
  violations.push(...validateStressStacking(plan));

  const criticalCount = violations.filter(v => v.severity === "critical").length;
  const warningCount = violations.filter(v => v.severity === "warning").length;

  return {
    isValid: criticalCount === 0,
    violations,
    criticalCount,
    warningCount,
    canRepair: criticalCount === 0 && warningCount <= 3,
  };
}

// ==================== VALIDATION RULES ====================

/**
 * Rule 1: Each training day must have warmup and cooldown blocks
 */
function validateRequiredBlocks(plan: GeneratedPlan): Violation[] {
  const violations: Violation[] = [];

  for (const day of plan.weeklyStructure) {
    if (day.dayType === "rest") continue;

    const hasWarmup = day.blocks.some(b => b.blockType === "warmup");
    const hasCooldown = day.blocks.some(b => b.blockType === "cooldown");

    if (!hasWarmup) {
      violations.push({
        id: `missing_warmup_day_${day.dayNumber}`,
        type: "missing_warmup",
        message: `Day ${day.dayNumber} is missing a warmup block`,
        severity: "warning",
        location: `day_${day.dayNumber}`,
        suggestion: "Add 5-10 minute dynamic warmup",
      });
    }

    if (!hasCooldown) {
      violations.push({
        id: `missing_cooldown_day_${day.dayNumber}`,
        type: "missing_cooldown",
        message: `Day ${day.dayNumber} is missing a cooldown block`,
        severity: "info",
        location: `day_${day.dayNumber}`,
        suggestion: "Add 5 minute stretching/mobility cooldown",
      });
    }
  }

  return violations;
}

/**
 * Rule 2: Training day count should match requested days per week
 */
function validateDayCount(plan: GeneratedPlan, daysPerWeek: number): Violation[] {
  const violations: Violation[] = [];
  const trainingDays = plan.weeklyStructure.filter(d => d.dayType !== "rest");

  if (trainingDays.length !== daysPerWeek) {
    violations.push({
      id: "day_count_mismatch",
      type: "day_count_mismatch",
      message: `Plan has ${trainingDays.length} training days, requested ${daysPerWeek}`,
      severity: trainingDays.length < daysPerWeek ? "warning" : "info",
    });
  }

  return violations;
}

/**
 * Rule 3: Session duration within ±15% of target
 */
function validateDurations(plan: GeneratedPlan, targetDuration: number): Violation[] {
  const violations: Violation[] = [];
  const minDuration = targetDuration * (1 - DURATION_TOLERANCE);
  const maxDuration = targetDuration * (1 + DURATION_TOLERANCE);

  for (const day of plan.weeklyStructure) {
    if (day.dayType === "rest") continue;

    if (day.totalDurationMin < minDuration || day.totalDurationMin > maxDuration) {
      violations.push({
        id: `duration_day_${day.dayNumber}`,
        type: "duration_mismatch",
        message: `Day ${day.dayNumber} is ${day.totalDurationMin}min (target: ${targetDuration}min ±15%)`,
        severity: "warning",
        location: `day_${day.dayNumber}`,
        suggestion: day.totalDurationMin > maxDuration 
          ? "Reduce rest times or exercise count" 
          : "Add exercises or increase rest times",
      });
    }
  }

  return violations;
}

/**
 * Rule 4: Push/pull ratio between 0.8 and 1.2
 */
function validatePushPullBalance(plan: GeneratedPlan): Violation[] {
  const violations: Violation[] = [];
  const ratio = plan.metadata.pushPullRatio;

  if (ratio < PUSH_PULL_RATIO_MIN || ratio > PUSH_PULL_RATIO_MAX) {
    const direction = ratio < PUSH_PULL_RATIO_MIN ? "pull-dominant" : "push-dominant";
    violations.push({
      id: "push_pull_imbalance",
      type: "push_pull_imbalance",
      message: `Push/pull ratio is ${ratio.toFixed(2)} (should be ${PUSH_PULL_RATIO_MIN}-${PUSH_PULL_RATIO_MAX})`,
      severity: "warning",
      suggestion: `Plan is ${direction}, consider balancing`,
    });
  }

  return violations;
}

/**
 * Rule 5: Per-session volume caps
 */
function validateSessionVolume(plan: GeneratedPlan, level: FitnessLevel): Violation[] {
  const violations: Violation[] = [];
  const caps = VOLUME_CAPS[level];

  for (const day of plan.weeklyStructure) {
    if (day.dayType === "rest") continue;

    const sessionSets = countSessionSets(day);
    const sessionExercises = countSessionExercises(day);

    if (sessionSets > caps.maxSetsPerSession) {
      violations.push({
        id: `session_volume_day_${day.dayNumber}`,
        type: "excessive_session_volume",
        message: `Day ${day.dayNumber} has ${sessionSets} sets (max ${caps.maxSetsPerSession} for ${level})`,
        severity: "warning",
        location: `day_${day.dayNumber}`,
        suggestion: `Reduce sets or split into two sessions`,
      });
    }

    if (sessionExercises > caps.maxExercisesPerSession) {
      violations.push({
        id: `session_exercises_day_${day.dayNumber}`,
        type: "too_many_exercises",
        message: `Day ${day.dayNumber} has ${sessionExercises} exercises (max ${caps.maxExercisesPerSession} for ${level})`,
        severity: "info",
        location: `day_${day.dayNumber}`,
      });
    }
  }

  return violations;
}

/**
 * Rule 6: Weekly volume caps
 */
function validateWeeklyVolume(plan: GeneratedPlan, level: FitnessLevel): Violation[] {
  const violations: Violation[] = [];
  const caps = VOLUME_CAPS[level];

  if (plan.metadata.totalWeeklyVolume > caps.maxSetsPerWeek) {
    violations.push({
      id: "weekly_volume_exceeded",
      type: "excessive_weekly_volume",
      message: `Weekly volume is ${plan.metadata.totalWeeklyVolume} sets (max ${caps.maxSetsPerWeek} for ${level})`,
      severity: "warning",
      suggestion: "Reduce sets per exercise or training days",
    });
  }

  return violations;
}

/**
 * Rule 7: Injury avoidance (CRITICAL)
 * Uses centralized injury mapping - avoidTags computed from painAreas
 */
function validateInjuryAvoidance(plan: GeneratedPlan, avoidTags: string[]): Violation[] {
  const violations: Violation[] = [];

  if (!avoidTags || avoidTags.length === 0) {
    return violations;
  }

  for (const day of plan.weeklyStructure) {
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        const exerciseTags = exercise.tags || [];
        
        if (shouldAvoidExercise(exerciseTags, avoidTags)) {
          const matchingTags = exerciseTags.filter(tag => avoidTags.includes(tag));
          violations.push({
            id: `forbidden_exercise_${day.dayNumber}_${exercise.exerciseId}`,
            type: "forbidden_exercise",
            message: `"${exercise.exerciseName || exercise.exerciseId}" has forbidden tags: ${matchingTags.join(", ")}`,
            severity: "critical",
            location: `day_${day.dayNumber}_${block.blockType}_${exercise.exerciseId}`,
            suggestion: exercise.regression 
              ? `Use regression: ${exercise.regression.exerciseId}` 
              : "Remove or substitute this exercise",
          });
        }
      }
    }
  }

  return violations;
}

/**
 * Rule 8: No impossible prescriptions
 */
function validatePrescriptions(plan: GeneratedPlan): Violation[] {
  const violations: Violation[] = [];

  for (const day of plan.weeklyStructure) {
    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        // Check for zero or negative sets
        if (exercise.sets <= 0) {
          violations.push({
            id: `invalid_sets_${exercise.exerciseId}`,
            type: "invalid_prescription",
            message: `"${exercise.exerciseName}" has invalid sets: ${exercise.sets}`,
            severity: "critical",
            location: `day_${day.dayNumber}_${exercise.exerciseId}`,
          });
        }

        // Check for negative rest
        if (exercise.restSec < 0) {
          violations.push({
            id: `invalid_rest_${exercise.exerciseId}`,
            type: "invalid_prescription",
            message: `"${exercise.exerciseName}" has negative rest: ${exercise.restSec}s`,
            severity: "critical",
            location: `day_${day.dayNumber}_${exercise.exerciseId}`,
          });
        }

        // Check for unrealistic reps (over 100 for strength work)
        const repsMatch = exercise.reps.match(/^(\d+)/);
        if (repsMatch && parseInt(repsMatch[1]) > 100) {
          violations.push({
            id: `unrealistic_reps_${exercise.exerciseId}`,
            type: "unrealistic_prescription",
            message: `"${exercise.exerciseName}" has unrealistic reps: ${exercise.reps}`,
            severity: "warning",
            location: `day_${day.dayNumber}_${exercise.exerciseId}`,
          });
        }

        // Check intensity values
        if (exercise.intensity) {
          const { type, value } = exercise.intensity;
          if (type === "rir" && (value < 0 || value > 10)) {
            violations.push({
              id: `invalid_rir_${exercise.exerciseId}`,
              type: "invalid_intensity",
              message: `"${exercise.exerciseName}" has invalid RIR: ${value}`,
              severity: "warning",
            });
          }
          if (type === "rpe" && (value < 1 || value > 10)) {
            violations.push({
              id: `invalid_rpe_${exercise.exerciseId}`,
              type: "invalid_intensity",
              message: `"${exercise.exerciseName}" has invalid RPE: ${value}`,
              severity: "warning",
            });
          }
        }
      }
    }
  }

  return violations;
}

/**
 * Rule 9: High-stress stacking prevention
 */
function validateStressStacking(plan: GeneratedPlan): Violation[] {
  const violations: Violation[] = [];

  for (const day of plan.weeklyStructure) {
    if (day.dayType === "rest") continue;

    let highStressCount = 0;

    for (const block of day.blocks) {
      for (const exercise of block.exercises) {
        const exerciseTags = exercise.tags || [];
        if (exerciseTags.some(tag => HIGH_STRESS_TAGS.includes(tag))) {
          highStressCount++;
        }
      }
    }

    if (highStressCount > MAX_HIGH_STRESS_PER_SESSION) {
      violations.push({
        id: `stress_stacking_day_${day.dayNumber}`,
        type: "high_stress_stacking",
        message: `Day ${day.dayNumber} has ${highStressCount} high-stress exercises (max ${MAX_HIGH_STRESS_PER_SESSION})`,
        severity: "warning",
        location: `day_${day.dayNumber}`,
        suggestion: "Spread shoulder/elbow-intensive exercises across days",
      });
    }
  }

  return violations;
}

// ==================== HELPERS ====================

function countSessionSets(day: DayPlan): number {
  return day.blocks
    .filter(b => b.blockType === "strength" || b.blockType === "skill")
    .flatMap(b => b.exercises)
    .reduce((sum, ex) => sum + ex.sets, 0);
}

function countSessionExercises(day: DayPlan): number {
  return day.blocks
    .filter(b => b.blockType !== "warmup" && b.blockType !== "cooldown")
    .flatMap(b => b.exercises)
    .length;
}

// ==================== REPAIR FUNCTIONS ====================

/**
 * Attempts to repair minor violations in the plan
 * Does NOT repair critical violations - those require fallback to template
 */
export function repairPlan(
  plan: GeneratedPlan,
  violations: Violation[]
): GeneratedPlan {
  // Don't attempt repair if there are critical violations
  const hasCritical = violations.some(v => v.severity === "critical");
  if (hasCritical) {
    console.warn("Cannot repair plan with critical violations");
    return plan;
  }

  const repairedPlan = JSON.parse(JSON.stringify(plan)) as GeneratedPlan;

  for (const violation of violations) {
    switch (violation.type) {
      case "excessive_session_volume":
      case "excessive_weekly_volume":
        repairedPlan.weeklyStructure = reduceVolume(repairedPlan.weeklyStructure);
        repairedPlan.metadata.totalWeeklyVolume = calculateTotalVolume(repairedPlan);
        break;

      case "duration_mismatch":
        // Adjust rest times to fit duration (simplified)
        const dayNumMatch = violation.location?.match(/day_(\d+)/);
        if (dayNumMatch) {
          const dayNum = parseInt(dayNumMatch[1]);
          adjustDayDuration(repairedPlan, dayNum);
        }
        break;

      case "missing_warmup":
        addMissingBlock(repairedPlan, violation.location, "warmup");
        break;

      case "missing_cooldown":
        addMissingBlock(repairedPlan, violation.location, "cooldown");
        break;

      default:
        // Log but don't attempt complex repairs
        console.warn(`Unhandled violation type for repair: ${violation.type}`);
    }
  }

  return repairedPlan;
}

function reduceVolume(days: DayPlan[]): DayPlan[] {
  return days.map(day => {
    if (day.dayType === "rest") return day;

    return {
      ...day,
      blocks: day.blocks.map(block => ({
        ...block,
        exercises: block.exercises.map(ex => ({
          ...ex,
          sets: ex.sets > 3 ? ex.sets - 1 : ex.sets,
        })),
      })),
    };
  });
}

function calculateTotalVolume(plan: GeneratedPlan): number {
  return plan.weeklyStructure
    .filter(d => d.dayType !== "rest")
    .flatMap(d => d.blocks)
    .filter(b => b.blockType === "strength" || b.blockType === "skill")
    .flatMap(b => b.exercises)
    .reduce((sum, ex) => sum + ex.sets, 0);
}

function adjustDayDuration(plan: GeneratedPlan, dayNum: number): void {
  const day = plan.weeklyStructure.find(d => d.dayNumber === dayNum);
  if (!day) return;

  // Simple adjustment: modify rest times
  for (const block of day.blocks) {
    for (const exercise of block.exercises) {
      if (exercise.restSec > 90) {
        exercise.restSec = Math.max(60, exercise.restSec - 15);
      }
    }
  }

  // Recalculate duration (simplified estimate)
  day.totalDurationMin = day.blocks.reduce((sum, b) => sum + b.durationMin, 0);
}

function addMissingBlock(
  plan: GeneratedPlan, 
  location: string | undefined, 
  blockType: "warmup" | "cooldown"
): void {
  const dayNumMatch = location?.match(/day_(\d+)/);
  if (!dayNumMatch) return;

  const dayNum = parseInt(dayNumMatch[1]);
  const day = plan.weeklyStructure.find(d => d.dayNumber === dayNum);
  if (!day) return;

  const defaultBlock: ExerciseBlock = blockType === "warmup" 
    ? {
        blockType: "warmup",
        durationMin: 5,
        exercises: [
          {
            exerciseId: "arm_circles",
            exerciseName: "Arm Circles",
            sets: 2,
            reps: "10 each direction",
            restSec: 0,
            intensity: { type: "rpe", value: 3 },
          },
          {
            exerciseId: "leg_swings",
            exerciseName: "Leg Swings",
            sets: 2,
            reps: "10 each leg",
            restSec: 0,
            intensity: { type: "rpe", value: 3 },
          },
        ],
      }
    : {
        blockType: "cooldown",
        durationMin: 5,
        exercises: [
          {
            exerciseId: "chest_stretch",
            exerciseName: "Chest Stretch",
            sets: 1,
            reps: "30s hold",
            restSec: 0,
            intensity: { type: "rpe", value: 2 },
          },
          {
            exerciseId: "shoulder_stretch",
            exerciseName: "Shoulder Stretch",
            sets: 1,
            reps: "30s each side",
            restSec: 0,
            intensity: { type: "rpe", value: 2 },
          },
        ],
      };

  if (blockType === "warmup") {
    day.blocks.unshift(defaultBlock);
  } else {
    day.blocks.push(defaultBlock);
  }

  day.totalDurationMin += defaultBlock.durationMin;
}
