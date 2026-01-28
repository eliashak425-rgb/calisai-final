import { prisma } from "@/lib/prisma";
import type { GeneratedPlanResponse, DayStructure, WorkoutBlock, ExerciseBlock } from "@/types/plan";

export async function getTemplatePlan(
  fitnessLevel: string,
  goalPrimary: string,
  daysPerWeek: number
): Promise<{ id: string; structure: GeneratedPlanResponse } | null> {
  // Try to find an exact match from DB
  let template = await prisma.templatePlan.findFirst({
    where: {
      fitnessLevel,
      goalFocus: goalPrimary,
      daysPerWeek,
      isActive: true,
    },
  });

  // If no exact match, try just level + days
  if (!template) {
    template = await prisma.templatePlan.findFirst({
      where: {
        fitnessLevel,
        daysPerWeek,
        isActive: true,
      },
    });
  }

  // If still no match, get any template for that level
  if (!template) {
    template = await prisma.templatePlan.findFirst({
      where: {
        fitnessLevel,
        isActive: true,
      },
    });
  }

  // Last resort: get any beginner template
  if (!template) {
    template = await prisma.templatePlan.findFirst({
      where: {
        fitnessLevel: "beginner",
        isActive: true,
      },
    });
  }

  // If no templates in DB, use hardcoded template based on fitness level
  if (!template) {
    console.log(`No templates in DB, using hardcoded ${fitnessLevel} template`);
    return {
      id: `hardcoded-${fitnessLevel}-${daysPerWeek}day`,
      structure: getHardcodedPlan(fitnessLevel, daysPerWeek),
    };
  }

  const structure = typeof template.structure === "string"
    ? JSON.parse(template.structure)
    : template.structure;

  return {
    id: template.id,
    structure: structure as GeneratedPlanResponse,
  };
}

// ==================== EXERCISE PROGRESSIONS BY LEVEL ====================

const EXERCISES_BY_LEVEL = {
  beginner: {
    push: [
      { slug: "wall-push-up", name: "Wall Push-Up", sets: 3, reps: "10-15", rest: 45 },
      { slug: "incline-push-up", name: "Incline Push-Up", sets: 3, reps: "8-12", rest: 60 },
      { slug: "knee-push-up", name: "Knee Push-Up", sets: 3, reps: "8-10", rest: 60 },
    ],
    pull: [
      { slug: "dead-hang", name: "Dead Hang", sets: 3, reps: "15-30s", rest: 45 },
      { slug: "scapular-pull", name: "Scapular Pull", sets: 3, reps: "8-10", rest: 45 },
      { slug: "australian-pull-up", name: "Australian Pull-Up", sets: 3, reps: "6-10", rest: 60 },
    ],
    legs: [
      { slug: "bodyweight-squat", name: "Bodyweight Squat", sets: 3, reps: "12-15", rest: 45 },
      { slug: "glute-bridge", name: "Glute Bridge", sets: 3, reps: "12-15", rest: 45 },
      { slug: "calf-raise", name: "Calf Raise", sets: 3, reps: "15-20", rest: 30 },
    ],
    core: [
      { slug: "dead-bug", name: "Dead Bug", sets: 3, reps: "8 each side", rest: 30 },
      { slug: "bird-dog", name: "Bird Dog", sets: 3, reps: "8 each side", rest: 30 },
      { slug: "plank", name: "Plank", sets: 3, reps: "20-30s", rest: 45 },
    ],
  },
  intermediate: {
    push: [
      { slug: "push-up", name: "Push-Up", sets: 4, reps: "10-15", rest: 60 },
      { slug: "diamond-push-up", name: "Diamond Push-Up", sets: 3, reps: "8-12", rest: 60 },
      { slug: "pike-push-up", name: "Pike Push-Up", sets: 3, reps: "8-10", rest: 75 },
      { slug: "dip", name: "Dip", sets: 3, reps: "6-10", rest: 90 },
    ],
    pull: [
      { slug: "pull-up", name: "Pull-Up", sets: 4, reps: "5-8", rest: 90 },
      { slug: "chin-up", name: "Chin-Up", sets: 3, reps: "6-10", rest: 90 },
      { slug: "australian-pull-up", name: "Australian Pull-Up", sets: 3, reps: "10-15", rest: 60 },
      { slug: "hanging-leg-raise", name: "Hanging Leg Raise", sets: 3, reps: "8-12", rest: 60 },
    ],
    legs: [
      { slug: "bulgarian-split-squat", name: "Bulgarian Split Squat", sets: 3, reps: "8-10 each", rest: 60 },
      { slug: "pistol-squat-assisted", name: "Assisted Pistol Squat", sets: 3, reps: "5-8 each", rest: 75 },
      { slug: "nordic-curl-negative", name: "Nordic Curl Negative", sets: 3, reps: "5-8", rest: 90 },
      { slug: "calf-raise-single", name: "Single Leg Calf Raise", sets: 3, reps: "12-15 each", rest: 45 },
    ],
    core: [
      { slug: "hollow-body-hold", name: "Hollow Body Hold", sets: 3, reps: "20-30s", rest: 45 },
      { slug: "l-sit-progression", name: "L-Sit Progression", sets: 3, reps: "10-20s", rest: 60 },
      { slug: "dragon-flag-negative", name: "Dragon Flag Negative", sets: 3, reps: "5-8", rest: 75 },
    ],
  },
  advanced: {
    push: [
      { slug: "archer-push-up", name: "Archer Push-Up", sets: 4, reps: "6-8 each", rest: 90 },
      { slug: "pseudo-planche-push-up", name: "Pseudo Planche Push-Up", sets: 4, reps: "6-10", rest: 90 },
      { slug: "handstand-push-up", name: "Handstand Push-Up", sets: 4, reps: "5-8", rest: 120 },
      { slug: "ring-dip", name: "Ring Dip", sets: 4, reps: "8-12", rest: 90 },
    ],
    pull: [
      { slug: "muscle-up", name: "Muscle-Up", sets: 4, reps: "3-5", rest: 150 },
      { slug: "weighted-pull-up", name: "Weighted Pull-Up", sets: 4, reps: "5-8", rest: 120 },
      { slug: "front-lever-progression", name: "Front Lever Progression", sets: 4, reps: "10-20s", rest: 120 },
      { slug: "one-arm-pull-up-negative", name: "One Arm Pull-Up Negative", sets: 3, reps: "3-5 each", rest: 150 },
    ],
    legs: [
      { slug: "pistol-squat", name: "Pistol Squat", sets: 4, reps: "6-8 each", rest: 90 },
      { slug: "shrimp-squat", name: "Shrimp Squat", sets: 3, reps: "5-8 each", rest: 90 },
      { slug: "nordic-curl", name: "Nordic Curl", sets: 4, reps: "6-10", rest: 120 },
      { slug: "natural-leg-extension", name: "Natural Leg Extension", sets: 3, reps: "8-12", rest: 90 },
    ],
    core: [
      { slug: "dragon-flag", name: "Dragon Flag", sets: 4, reps: "6-10", rest: 90 },
      { slug: "l-sit", name: "L-Sit", sets: 4, reps: "20-30s", rest: 75 },
      { slug: "front-lever-hold", name: "Front Lever Hold", sets: 4, reps: "10-15s", rest: 120 },
      { slug: "ab-wheel-rollout", name: "Ab Wheel Rollout", sets: 3, reps: "10-15", rest: 60 },
    ],
  },
};

const WARMUP_EXERCISES = [
  { slug: "arm-circles", name: "Arm Circles", sets: 2, reps: "10 each direction", rest: 15 },
  { slug: "cat-cow", name: "Cat-Cow", sets: 2, reps: "10", rest: 15 },
  { slug: "world-greatest-stretch", name: "World's Greatest Stretch", sets: 2, reps: "5 each side", rest: 15 },
  { slug: "jumping-jacks", name: "Jumping Jacks", sets: 1, reps: "30", rest: 30 },
];

const COOLDOWN_EXERCISES = [
  { slug: "child-pose", name: "Child's Pose", sets: 1, reps: "60s", rest: 0 },
  { slug: "seated-forward-fold", name: "Seated Forward Fold", sets: 1, reps: "45s", rest: 0 },
  { slug: "pigeon-stretch", name: "Pigeon Stretch", sets: 1, reps: "30s each side", rest: 0 },
  { slug: "supine-twist", name: "Supine Twist", sets: 1, reps: "30s each side", rest: 0 },
];

// ==================== PLAN GENERATION ====================

function getHardcodedPlan(fitnessLevel: string, daysPerWeek: number): GeneratedPlanResponse {
  const level = (fitnessLevel as keyof typeof EXERCISES_BY_LEVEL) || "beginner";
  const exercises = EXERCISES_BY_LEVEL[level] || EXERCISES_BY_LEVEL.beginner;
  
  const days: DayStructure[] = [];
  
  // Calculate rest day frequency based on days per week
  const trainingDays = Math.min(daysPerWeek, 6);
  const restEveryNDays = Math.ceil(7 / (7 - trainingDays + 1));
  
  // Weekly volume scaling by level
  const volumeMultiplier = level === "beginner" ? 1 : level === "intermediate" ? 1.3 : 1.5;
  
  for (let dayNum = 1; dayNum <= 30; dayNum++) {
    const isRestDay = dayNum % restEveryNDays === 0;
    
    if (isRestDay) {
      days.push({
        dayNumber: dayNum,
        dayType: "rest",
        totalDurationMin: 0,
        blocks: [],
      });
    } else {
      // Create progressive workout - weeks 1-4 increase in difficulty
      const weekNumber = Math.ceil(dayNum / 7);
      const progressionBonus = Math.min(weekNumber - 1, 3); // Max 3 extra reps/sets
      
      // Rotate through push, pull, legs, full
      const dayInCycle = (dayNum - 1) % 4;
      let dayType: DayStructure["dayType"];
      let primaryExercises: typeof exercises.push;
      let secondaryExercises: typeof exercises.core;
      
      switch (dayInCycle) {
        case 0:
          dayType = "push";
          primaryExercises = exercises.push;
          secondaryExercises = exercises.core.slice(0, 2);
          break;
        case 1:
          dayType = "pull";
          primaryExercises = exercises.pull;
          secondaryExercises = exercises.core.slice(0, 2);
          break;
        case 2:
          dayType = "legs";
          primaryExercises = exercises.legs;
          secondaryExercises = exercises.core.slice(0, 2);
          break;
        default:
          dayType = "full";
          primaryExercises = [
            exercises.push[0],
            exercises.pull[0],
            exercises.legs[0],
          ];
          secondaryExercises = exercises.core.slice(0, 2);
      }
      
      days.push(createWorkoutDay(
        dayNum,
        dayType,
        primaryExercises,
        secondaryExercises,
        level,
        progressionBonus
      ));
    }
  }

  return {
    weeklyStructure: days,
    metadata: {
      totalWeeklyVolume: Math.round(45 * volumeMultiplier),
      pushPullRatio: 1.0,
      skillFocus: getSkillFocus(level),
      avoidedMovements: [],
    },
  };
}

function getSkillFocus(level: string): string[] {
  switch (level) {
    case "beginner":
      return ["push-up", "bodyweight-squat", "plank"];
    case "intermediate":
      return ["pull-up", "dip", "pistol-squat"];
    case "advanced":
      return ["muscle-up", "handstand-push-up", "front-lever"];
    default:
      return ["push-up", "pull-up", "squat"];
  }
}

function createExercise(
  id: string,
  name: string,
  sets: number,
  reps: string,
  restSec: number,
  rpeValue: number
): ExerciseBlock {
  return {
    exerciseId: id,
    name,
    sets,
    reps,
    restSec,
    tempo: null,
    intensity: { type: "rpe", value: rpeValue },
    notes: null,
    progression: { rule: "add 1-2 reps when completing all sets" },
    regression: { exerciseId: id, reason: "if form breaks down" },
    tags: [],
  };
}

function createWorkoutDay(
  dayNumber: number,
  dayType: DayStructure["dayType"],
  primaryExercises: Array<{ slug: string; name: string; sets: number; reps: string; rest: number }>,
  secondaryExercises: Array<{ slug: string; name: string; sets: number; reps: string; rest: number }>,
  level: string,
  progressionBonus: number
): DayStructure {
  const rpeBase = level === "beginner" ? 6 : level === "intermediate" ? 7 : 8;
  
  // Warmup block
  const warmupBlock: WorkoutBlock = {
    blockType: "warmup",
    durationMin: 8,
    exercises: WARMUP_EXERCISES.slice(0, 3).map((ex) =>
      createExercise(ex.slug, ex.name, ex.sets, ex.reps, ex.rest, 4)
    ),
  };
  
  // Main strength block with progression
  const strengthBlock: WorkoutBlock = {
    blockType: "strength",
    durationMin: 30,
    exercises: primaryExercises.map((ex) => {
      const adjustedSets = Math.min(ex.sets + Math.floor(progressionBonus / 2), 5);
      return createExercise(
        ex.slug,
        ex.name,
        adjustedSets,
        ex.reps,
        ex.rest,
        rpeBase + Math.floor(progressionBonus / 2)
      );
    }),
  };
  
  // Conditioning/skill block
  const conditioningBlock: WorkoutBlock = {
    blockType: "conditioning",
    durationMin: 10,
    exercises: secondaryExercises.map((ex) =>
      createExercise(ex.slug, ex.name, ex.sets, ex.reps, ex.rest, rpeBase - 1)
    ),
  };
  
  // Cooldown block
  const cooldownBlock: WorkoutBlock = {
    blockType: "cooldown",
    durationMin: 7,
    exercises: COOLDOWN_EXERCISES.slice(0, 3).map((ex) =>
      createExercise(ex.slug, ex.name, ex.sets, ex.reps, ex.rest, 3)
    ),
  };

  return {
    dayNumber,
    dayType,
    totalDurationMin: 55,
    blocks: [warmupBlock, strengthBlock, conditioningBlock, cooldownBlock],
  };
}
