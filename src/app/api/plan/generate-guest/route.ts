/**
 * Guest Plan Generation API
 * 
 * This endpoint generates a workout plan for guests (no auth required).
 * The plan is NOT saved to the database - it's returned in the response
 * for the user to preview before signing up.
 * 
 * CRITICAL: avoidTags is COMPUTED server-side from painAreas, never user-provided.
 */

import { NextResponse } from "next/server";
import { computeAvoidTags } from "@/domain/injury/injuryMapping";
import { computeFitnessLevel } from "@/domain/fitness/computeFitnessLevel";
import { validatePlan, repairPlan, VOLUME_CAPS } from "@/domain/plan/validatePlan";
import { generateWorkoutPlanFromProfile } from "@/services/openai/planGenerator";
import { getTemplatePlan } from "@/services/openai/templateFallback";
import type { 
  AssessmentSubmission, 
  GuestPlanGenerationResponse,
  GeneratedPlan,
  FitnessComputation,
  Baseline,
  TrainingAge
} from "@/types/assessment";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60s for AI generation

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assessment } = body as { assessment: AssessmentSubmission };

    // Validate required fields
    if (!assessment) {
      return NextResponse.json(
        { error: "Missing assessment data" },
        { status: 400 }
      );
    }

    // 1. COMPUTE avoidTags from painAreas (NEVER trust user-provided avoidTags)
    const avoidTags = computeAvoidTags(
      assessment.injuryScreen?.painAreas || []
    );

    // 2. Compute fitness level with score-based system
    const fitness = computeFitnessLevel(
      assessment.baseline as Baseline,
      assessment.trainingBackground?.trainingAge as TrainingAge
    );

    // 3. Generate plan (AI or template fallback)
    let plan: GeneratedPlan;
    let source: "ai" | "template" | "ai_enhanced_template";

    try {
      const result = await generatePlanWithValidation({
        assessment,
        avoidTags,
        fitness,
      });
      plan = result.plan;
      source = result.source;
    } catch (generationError) {
      console.error("Plan generation failed, using template:", generationError);
      
      // Fallback to template
      const templateResult = await getTemplatePlanSafe(fitness.level, assessment);
      plan = templateResult.plan;
      source = "template";
    }

    // 4. Return plan (NOT saved - guest)
    const response: GuestPlanGenerationResponse = {
      plan,
      fitness,
      source,
      savedToAccount: false,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Guest plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate plan. Please try again." },
      { status: 500 }
    );
  }
}

// ==================== HELPERS ====================

interface GenerationParams {
  assessment: AssessmentSubmission;
  avoidTags: string[];
  fitness: FitnessComputation;
}

async function generatePlanWithValidation(
  params: GenerationParams
): Promise<{ plan: GeneratedPlan; source: "ai" | "template" | "ai_enhanced_template" }> {
  const { assessment, avoidTags, fitness } = params;

  // Check if OpenAI is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not configured, using template");
    const template = await getTemplatePlanSafe(fitness.level, assessment);
    return { plan: template.plan, source: "template" };
  }

  // Generate with AI
  const aiPlan = await generateWorkoutPlanFromProfile({
    basicInfo: assessment.basicInfo,
    trainingBackground: assessment.trainingBackground,
    availability: assessment.availability,
    location: assessment.location,
    equipment: assessment.equipment,
    goals: assessment.goals,
    recoveryPrefs: assessment.recoveryPrefs,
    fitnessLevel: fitness.level,
    fitnessScore: fitness.score,
    avoidTags,
  });

  // Validate the generated plan
  const validationResult = validatePlan(aiPlan, {
    fitnessLevel: fitness.level,
    avoidTags,
    daysPerWeek: assessment.availability.daysPerWeek,
    sessionDurationMin: assessment.availability.sessionDurationMin,
  });

  // If no critical violations, use the plan (maybe with repairs)
  if (validationResult.isValid) {
    if (validationResult.canRepair && validationResult.warningCount > 0) {
      const repairedPlan = repairPlan(aiPlan, validationResult.violations);
      return { plan: repairedPlan, source: "ai" };
    }
    return { plan: aiPlan, source: "ai" };
  }

  // Critical violations - log and fall back to template
  console.error("AI plan failed validation:", {
    criticalCount: validationResult.criticalCount,
    violations: validationResult.violations.filter(v => v.severity === "critical"),
  });

  const template = await getTemplatePlanSafe(fitness.level, assessment);
  return { plan: template.plan, source: "template" };
}

async function getTemplatePlanSafe(
  fitnessLevel: string,
  assessment: AssessmentSubmission
): Promise<{ plan: GeneratedPlan }> {
  try {
    const template = await getTemplatePlan(
      fitnessLevel,
      assessment.goals.rankedGoals?.[0] || "general_fitness",
      assessment.availability.daysPerWeek
    );

    if (template) {
      return { plan: template.structure as unknown as GeneratedPlan };
    }
  } catch (error) {
    console.error("Template lookup failed:", error);
  }

  // Ultimate fallback - minimal safe plan
  return { plan: createMinimalSafePlan(assessment) };
}

/**
 * Creates a minimal safe plan when all else fails
 * This ensures users always get SOMETHING to preview
 */
function createMinimalSafePlan(assessment: AssessmentSubmission): GeneratedPlan {
  const daysPerWeek = assessment.availability?.daysPerWeek || 3;
  const sessionDuration = assessment.availability?.sessionDurationMin || 45;

  const restDays = 7 - daysPerWeek;
  const trainingDayNumbers = getTrainingDayNumbers(daysPerWeek);

  const weeklyStructure = [];

  for (let day = 1; day <= 7; day++) {
    if (trainingDayNumbers.includes(day)) {
      weeklyStructure.push(createBasicTrainingDay(day, sessionDuration));
    } else {
      weeklyStructure.push({
        dayNumber: day,
        dayType: "rest" as const,
        totalDurationMin: 0,
        blocks: [],
      });
    }
  }

  return {
    weeklyStructure,
    metadata: {
      totalWeeklyVolume: daysPerWeek * 12,
      pushPullRatio: 1.0,
      skillFocus: [],
      avoidedMovements: [],
      estimatedSessionDuration: sessionDuration,
      generatedAt: new Date().toISOString(),
      planVersion: "fallback-1.0",
    },
  };
}

function getTrainingDayNumbers(daysPerWeek: number): number[] {
  // Spread training days evenly through the week
  const patterns: Record<number, number[]> = {
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
  };
  return patterns[daysPerWeek] || [1, 3, 5];
}

function createBasicTrainingDay(dayNumber: number, duration: number) {
  return {
    dayNumber,
    dayType: dayNumber % 2 === 1 ? "push" as const : "pull" as const,
    totalDurationMin: duration,
    blocks: [
      {
        blockType: "warmup" as const,
        durationMin: 5,
        exercises: [
          {
            exerciseId: "arm_circles",
            exerciseName: "Arm Circles",
            sets: 2,
            reps: "10 each direction",
            restSec: 0,
            intensity: { type: "rpe" as const, value: 3 },
          },
          {
            exerciseId: "jumping_jacks",
            exerciseName: "Jumping Jacks",
            sets: 2,
            reps: "20",
            restSec: 0,
            intensity: { type: "rpe" as const, value: 4 },
          },
        ],
      },
      {
        blockType: "strength" as const,
        durationMin: duration - 10,
        exercises: dayNumber % 2 === 1 
          ? [
              {
                exerciseId: "pushups",
                exerciseName: "Push-ups",
                sets: 3,
                reps: "8-12",
                restSec: 90,
                intensity: { type: "rir" as const, value: 2 },
                progression: { rule: "add_reps", nextExercise: "diamond_pushups" },
              },
              {
                exerciseId: "pike_pushups",
                exerciseName: "Pike Push-ups",
                sets: 3,
                reps: "6-10",
                restSec: 90,
                intensity: { type: "rir" as const, value: 2 },
              },
              {
                exerciseId: "dips",
                exerciseName: "Dips (or bench dips)",
                sets: 3,
                reps: "6-10",
                restSec: 90,
                intensity: { type: "rir" as const, value: 2 },
              },
            ]
          : [
              {
                exerciseId: "pullups",
                exerciseName: "Pull-ups (or rows)",
                sets: 3,
                reps: "5-10",
                restSec: 120,
                intensity: { type: "rir" as const, value: 2 },
                regression: { exerciseId: "inverted_rows", reason: "If cannot do pull-ups" },
              },
              {
                exerciseId: "inverted_rows",
                exerciseName: "Inverted Rows",
                sets: 3,
                reps: "8-12",
                restSec: 90,
                intensity: { type: "rir" as const, value: 2 },
              },
              {
                exerciseId: "face_pulls",
                exerciseName: "Face Pulls (band)",
                sets: 3,
                reps: "12-15",
                restSec: 60,
                intensity: { type: "rir" as const, value: 3 },
              },
            ],
      },
      {
        blockType: "cooldown" as const,
        durationMin: 5,
        exercises: [
          {
            exerciseId: "chest_stretch",
            exerciseName: "Chest Doorway Stretch",
            sets: 1,
            reps: "30s each side",
            restSec: 0,
            intensity: { type: "rpe" as const, value: 2 },
          },
          {
            exerciseId: "lat_stretch",
            exerciseName: "Lat Stretch",
            sets: 1,
            reps: "30s each side",
            restSec: 0,
            intensity: { type: "rpe" as const, value: 2 },
          },
        ],
      },
    ],
  };
}

