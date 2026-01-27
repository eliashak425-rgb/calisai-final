import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { validatePlan, repairPlan } from "@/domain/plan/validatePlan";
import { getTemplatePlan } from "./templateFallback";
import { PLAN_JSON_SCHEMA } from "./schemas/planOutputSchema";
import { buildPlanSystemPrompt, buildPlanUserPrompt, buildGuestPlanPrompt, getPromptVersion } from "./prompts/planPrompt";
import type { TrainingProfile, GeneratedPlan, FitnessLevel, Equipment } from "@/types/assessment";
import type { GeneratedPlanResponse, WorkoutPlan } from "@/types/plan";

// ==================== GUEST PLAN GENERATION ====================

/**
 * Profile data for guest plan generation (no DB save)
 */
export interface GuestProfileData {
  basicInfo: {
    name?: string;
    age: number;
    biologicalSex: string;
    heightCm: number;
    weightKg: number;
  };
  trainingBackground: {
    trainingAge: string;
    selfRating?: string;
  };
  availability: {
    daysPerWeek: number;
    sessionDurationMin: number;
    preferredTime: string;
  };
  location: {
    trainingLocation: string;
  };
  equipment: Equipment | Record<string, boolean>;
  goals: {
    rankedGoals: string[];
    intensityPreference: string;
  };
  recoveryPrefs?: {
    sleepQuality: string;
    sorenessTolerance: string;
  };
  fitnessLevel: FitnessLevel;
  fitnessScore: number;
  avoidTags: string[]; // Computed from painAreas
}

/**
 * Generates a workout plan for guests (no auth, no DB save)
 * Returns the plan directly without persisting it
 */
export async function generateWorkoutPlanFromProfile(
  profile: GuestProfileData
): Promise<GeneratedPlan> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("AI generation not available");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "workout_plan",
          strict: true,
          schema: PLAN_JSON_SCHEMA,
        },
      },
      messages: [
        {
          role: "system",
          content: buildPlanSystemPrompt(),
        },
        {
          role: "user",
          content: buildGuestPlanPrompt(profile),
        },
      ],
      max_tokens: 4000,
    });

    const outputText = response.choices[0]?.message?.content;

    if (!outputText) {
      throw new Error("Empty response from OpenAI");
    }

    const generatedPlan = JSON.parse(outputText) as GeneratedPlan;
    
    // Add generation metadata
    generatedPlan.metadata.generatedAt = new Date().toISOString();
    generatedPlan.metadata.planVersion = getPromptVersion();

    return generatedPlan;
  } catch (error) {
    console.error("Guest plan generation error:", error);
    throw error;
  }
}

// ==================== AUTHENTICATED PLAN GENERATION ====================

export async function generateWorkoutPlan(
  profile: TrainingProfile
): Promise<{ plan: WorkoutPlan; source: "ai" | "template" | "ai_enhanced_template" }> {
  const promptVersion = getPromptVersion();

  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not configured, falling back to template");
    return await fallbackToTemplate(profile);
  }

  try {
    // Step 1: Generate with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "workout_plan",
          strict: true,
          schema: PLAN_JSON_SCHEMA,
        },
      },
      messages: [
        {
          role: "system",
          content: buildPlanSystemPrompt(),
        },
        {
          role: "user",
          content: buildPlanUserPrompt(profile),
        },
      ],
      max_tokens: 4000,
    });

    const outputText = response.choices[0]?.message?.content;

    if (!outputText) {
      throw new Error("Empty response from OpenAI");
    }

    let generatedPlan: GeneratedPlanResponse;
    try {
      generatedPlan = JSON.parse(outputText);
    } catch (parseError) {
      console.error("Failed to parse AI response", {
        outputText: outputText.substring(0, 500),
        error: parseError,
      });
      throw new Error("Invalid JSON from AI");
    }

    // Step 2: Validate against business rules
    const avoidTags = typeof profile.avoidTags === "string"
      ? JSON.parse(profile.avoidTags)
      : profile.avoidTags;
    
    // Cast profile to any to handle legacy type structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileAny = profile as any;
    const violations = validatePlan(generatedPlan as unknown as GeneratedPlan, {
      fitnessLevel: (profileAny.fitnessLevel || profileAny.fitness?.level || "beginner") as "beginner" | "intermediate" | "advanced",
      avoidTags,
      daysPerWeek: (profileAny.daysPerWeek || profileAny.availability?.daysPerWeek || 3) as number,
      sessionDurationMin: (profileAny.sessionDurationMin || profileAny.availability?.sessionDurationMin || 45) as number,
    });

    if (violations.isValid) {
      const plan = await savePlan(generatedPlan, profile, "ai", promptVersion);
      return { plan, source: "ai" };
    }

    // Step 3: Attempt repair for minor issues (no critical violations)
    if (violations.canRepair && violations.criticalCount === 0) {
      console.warn("Plan has minor violations, attempting repair", { violations: violations.violations });
      const repairedPlan = repairPlan(generatedPlan as unknown as GeneratedPlan, violations.violations);
      const plan = await savePlan(repairedPlan as unknown as GeneratedPlanResponse, profile, "ai", promptVersion);
      return { plan, source: "ai" };
    }

    // Step 4: Critical violations - fall back to template
    console.error("Plan validation failed with critical violations", {
      violations: violations.violations.filter(v => v.severity === "critical"),
      profileId: profileAny.id,
    });

    return await fallbackToTemplate(profile);
  } catch (error) {
    console.error("AI plan generation failed", {
      error,
      profileId: profile.id,
    });

    return await fallbackToTemplate(profile);
  }
}

async function fallbackToTemplate(
  profile: TrainingProfile
): Promise<{ plan: WorkoutPlan; source: "template" | "ai_enhanced_template" }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileAny = profile as any;
  const fitnessLevel = profileAny.fitnessLevel || profileAny.fitness?.level || "beginner";
  const goalPrimary = profileAny.goalPrimary || profileAny.goals?.rankedGoals?.[0] || "general_fitness";
  const daysPerWeek = profileAny.daysPerWeek || profileAny.availability?.daysPerWeek || 3;
  
  const template = await getTemplatePlan(
    fitnessLevel,
    goalPrimary,
    daysPerWeek
  );

  if (!template) {
    throw new Error(
      `No template found for level=${fitnessLevel}, goal=${goalPrimary}`
    );
  }

  const plan = await savePlan(
    template.structure,
    profile,
    "template",
    getPromptVersion(),
    template.id
  );
  
  return { plan, source: "template" };
}

async function savePlan(
  planData: GeneratedPlanResponse,
  profile: TrainingProfile,
  generationType: "ai" | "template" | "ai_enhanced_template",
  promptVersion: string,
  templateId?: string
): Promise<WorkoutPlan> {
  // Deactivate previous plans
  await prisma.workoutPlan.updateMany({
    where: { userId: profile.userId, isActive: true },
    data: { isActive: false },
  });

  // For templates, we need to look up exerciseId by slug
  // Build a map of slug -> id for exercises
  const allSlugs = new Set<string>();
  for (const day of planData.weeklyStructure) {
    for (const block of day.blocks) {
      for (const ex of block.exercises) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exAny = ex as any;
        if (exAny.exerciseSlug) {
          allSlugs.add(exAny.exerciseSlug);
        } else if (ex.exerciseId) {
          allSlugs.add(ex.exerciseId);
        }
      }
    }
  }

  // Fetch exercise IDs from database
  const exercises = await prisma.exerciseLibrary.findMany({
    where: {
      OR: [
        { slug: { in: Array.from(allSlugs) } },
        { id: { in: Array.from(allSlugs) } },
      ],
    },
    select: { id: true, slug: true },
  });

  const slugToId = new Map<string, string>();
  for (const ex of exercises) {
    slugToId.set(ex.slug, ex.id);
    slugToId.set(ex.id, ex.id);
  }

  // Create a default placeholder exercise ID if we can't find one
  let placeholderExerciseId = slugToId.get("bodyweight-squat");
  if (!placeholderExerciseId) {
    const anyExercise = await prisma.exerciseLibrary.findFirst();
    placeholderExerciseId = anyExercise?.id || "placeholder";
  }

  // Create new plan with nested structure
  const plan = await prisma.workoutPlan.create({
    data: {
      userId: profile.userId,
      profileId: profile.id,
      profileVersion: profile.version,
      promptVersion,
      validUntil: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 4 weeks
      isActive: true,
      totalWeeklyVolume: planData.metadata.totalWeeklyVolume || 0,
      pushPullRatio: planData.metadata.pushPullRatio || 1.0,
      skillFocus: JSON.stringify(planData.metadata.skillFocus || []),
      avoidedMovements: JSON.stringify(planData.metadata.avoidedMovements || []),
      generationType,
      templateId,
      days: {
        create: planData.weeklyStructure.map((day) => ({
          dayNumber: day.dayNumber,
          dayType: day.dayType,
          totalDurationMin: day.totalDurationMin,
          blocks: {
            create: day.blocks.map((block, blockIdx) => ({
              blockType: block.blockType,
              durationMin: block.durationMin,
              orderIndex: blockIdx,
              exercises: {
                create: block.exercises.map((ex, exIdx) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const exAny = ex as any;
                  const exSlug = exAny.exerciseSlug || ex.exerciseId;
                  const resolvedExerciseId = slugToId.get(exSlug) || placeholderExerciseId;
                  
                  // Default intensity if not provided
                  const intensityValue = ex.intensity 
                    ? JSON.stringify(ex.intensity)
                    : JSON.stringify({ type: "rpe", value: 7 });
                  
                  return {
                    exerciseId: resolvedExerciseId,
                    orderIndex: exIdx,
                    sets: ex.sets || 3,
                    reps: ex.reps || "8-12",
                    restSec: ex.restSec || 60,
                    tempo: ex.tempo || null,
                    intensity: intensityValue,
                    notes: ex.notes || null,
                    progressionRule: ex.progression?.rule || null,
                    progressionExercise: ex.progression?.nextExercise || null,
                    regressionExercise: ex.regression?.exerciseId || null,
                    regressionReason: ex.regression?.reason || null,
                  };
                }),
              },
            })),
          },
        })),
      },
    },
    include: {
      days: {
        include: {
          blocks: {
            include: {
              exercises: true,
            },
          },
        },
      },
    },
  });

  return plan as unknown as WorkoutPlan;
}

