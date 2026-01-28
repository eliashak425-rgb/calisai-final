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

  // If no templates in DB, use hardcoded beginner template
  if (!template) {
    console.log("No templates in DB, using hardcoded beginner template");
    return {
      id: "hardcoded-beginner-3day",
      structure: getHardcodedBeginnerPlan(daysPerWeek),
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

/**
 * Hardcoded beginner plan for when no templates exist in DB
 */
function getHardcodedBeginnerPlan(daysPerWeek: number): GeneratedPlanResponse {
  const days: DayStructure[] = [];
  
  // Create workout days based on daysPerWeek
  for (let i = 1; i <= 30; i++) {
    const isRestDay = i % Math.ceil(7 / Math.min(daysPerWeek, 6)) === 0;
    
    if (isRestDay) {
      days.push({
        dayNumber: i,
        dayType: "rest",
        totalDurationMin: 0,
        blocks: [],
      });
    } else {
      // Rotate between push, pull, and full focus
      const focusIndex = (i - 1) % 3;
      const dayType: DayStructure["dayType"] = focusIndex === 0 ? "push" : focusIndex === 1 ? "pull" : "full";
      days.push(createWorkoutDay(i, dayType));
    }
  }

  return {
    weeklyStructure: days,
    metadata: {
      totalWeeklyVolume: 45,
      pushPullRatio: 1.0,
      skillFocus: ["push-up", "pull-up", "squat"],
      avoidedMovements: [],
    },
  };
}

function createExercise(id: string, name: string, sets: number, reps: string, restSec: number, rpeValue: number): ExerciseBlock {
  return {
    exerciseId: id,
    name,
    sets,
    reps,
    restSec,
    tempo: null,
    intensity: { type: "rpe", value: rpeValue },
    notes: null,
    progression: { rule: "increase reps" },
    regression: { exerciseId: id, reason: "form breakdown" },
    tags: [],
  };
}

function createWorkoutDay(dayNumber: number, dayType: DayStructure["dayType"]): DayStructure {
  const exercises = {
    push: [
      { slug: "push-up", name: "Push-Up" },
      { slug: "pike-push-up", name: "Pike Push-Up" },
      { slug: "diamond-push-up", name: "Diamond Push-Up" },
    ],
    pull: [
      { slug: "australian-pull-up", name: "Australian Pull-Up" },
      { slug: "dead-hang", name: "Dead Hang" },
      { slug: "pull-up", name: "Pull-Up" },
    ],
    full: [
      { slug: "bodyweight-squat", name: "Bodyweight Squat" },
      { slug: "push-up", name: "Push-Up" },
      { slug: "plank", name: "Plank" },
      { slug: "glute-bridge", name: "Glute Bridge" },
    ],
  };

  const focusExercises = exercises[dayType as "push" | "pull" | "full"] || exercises.full;

  const blocks: WorkoutBlock[] = [
    {
      blockType: "warmup",
      durationMin: 5,
      exercises: [
        createExercise("arm-circles", "Arm Circles", 2, "10", 30, 3),
        createExercise("cat-cow", "Cat-Cow", 2, "10", 30, 3),
      ],
    },
    {
      blockType: "strength",
      durationMin: 35,
      exercises: focusExercises.map((ex) => createExercise(ex.slug, ex.name, 3, "8-12", 60, 7)),
    },
    {
      blockType: "cooldown",
      durationMin: 5,
      exercises: [
        createExercise("plank", "Plank", 2, "30s", 30, 5),
      ],
    },
  ];

  return {
    dayNumber,
    dayType,
    totalDurationMin: 45,
    blocks,
  };
}

