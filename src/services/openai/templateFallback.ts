import { prisma } from "@/lib/prisma";
import type { GeneratedPlanResponse } from "@/types/plan";

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
  const days: Array<{
    dayNumber: number;
    dayType: "push" | "pull" | "skill" | "legs" | "full" | "rest" | "active_recovery";
    totalDurationMin: number;
    blocks: Array<{
      blockType: string;
      durationMin: number;
      exercises: Array<{
        exerciseSlug: string;
        exerciseId: string;
        sets: number;
        reps: string;
        restSec: number;
        intensity: { type: string; value: number };
      }>;
    }>;
  }> = [];
  
  // Create workout days based on daysPerWeek
  for (let i = 1; i <= 30; i++) {
    const isRestDay = i % Math.ceil(7 / Math.min(daysPerWeek, 6)) === 0;
    
    if (isRestDay) {
      days.push({
        dayNumber: i,
        dayType: "rest" as const,
        totalDurationMin: 0,
        blocks: [],
      });
    } else {
      // Rotate between push, pull, and full focus
      const focusOptions = ["push", "pull", "full"] as const;
      const focus = focusOptions[(i - 1) % 3];
      days.push(createWorkoutDay(i, focus));
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

function createWorkoutDay(dayNumber: number, focus: "push" | "pull" | "full") {
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

  const focusExercises = exercises[focus];

  return {
    dayNumber,
    dayType: focus as "push" | "pull" | "full",
    totalDurationMin: 45,
    blocks: [
      {
        blockType: "warmup",
        durationMin: 5,
        exercises: [
          {
            exerciseSlug: "arm-circles",
            exerciseId: "arm-circles",
            sets: 2,
            reps: "10",
            restSec: 30,
            intensity: { type: "rpe", value: 3 },
          },
          {
            exerciseSlug: "cat-cow",
            exerciseId: "cat-cow",
            sets: 2,
            reps: "10",
            restSec: 30,
            intensity: { type: "rpe", value: 3 },
          },
        ],
      },
      {
        blockType: "strength",
        durationMin: 35,
        exercises: focusExercises.map((ex) => ({
          exerciseSlug: ex.slug,
          exerciseId: ex.slug,
          sets: 3,
          reps: "8-12",
          restSec: 60,
          intensity: { type: "rpe", value: 7 },
        })),
      },
      {
        blockType: "cooldown",
        durationMin: 5,
        exercises: [
          {
            exerciseSlug: "plank",
            exerciseId: "plank",
            sets: 2,
            reps: "30s",
            restSec: 30,
            intensity: { type: "rpe", value: 5 },
          },
        ],
      },
    ],
  };
}

