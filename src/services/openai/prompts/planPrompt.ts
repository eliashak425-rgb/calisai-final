import type { TrainingProfile } from "@/types/assessment";
import type { GuestProfileData } from "@/services/openai/planGenerator";

const PROMPT_VERSION = "v1.1";

export function getPromptVersion(): string {
  return PROMPT_VERSION;
}

export function buildPlanSystemPrompt(): string {
  return `You are an expert calisthenics coach and personal trainer with 15+ years of experience designing bodyweight training programs. You create safe, effective, and progressive workout plans tailored to individual needs.

Your expertise includes:
- Calisthenics skill progressions (muscle-ups, handstands, levers, planche)
- Bodyweight strength training
- Movement pattern balancing (push/pull ratios)
- Injury prevention and working around limitations
- Programming for all levels from complete beginner to advanced

CRITICAL RULES:
1. NEVER include exercises that match the user's avoidTags - these are injury restrictions
2. Match the session duration to what the user specified (±15%)
3. Match the number of training days to what the user requested
4. Include warm-up and cooldown in every training day
5. Use real exercise IDs from the calisthenics exercise library
6. Provide clear progression and regression paths for each exercise
7. Balance push and pull volume (ratio should be 0.8-1.2)
8. For beginners, keep weekly volume under 30 sets
9. For intermediate, keep weekly volume under 50 sets
10. For advanced, keep weekly volume under 70 sets

You must respond with ONLY valid JSON matching the required schema. No explanations or additional text.`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildPlanUserPrompt(profile: TrainingProfile | any): string {
  // Handle both old and new profile structures
  const p = profile as any;
  const equipment = typeof p.equipment === "string" 
    ? JSON.parse(p.equipment) 
    : p.equipment;
  
  const avoidTags = typeof p.avoidTags === "string"
    ? JSON.parse(p.avoidTags)
    : (p.avoidTags || []);

  const equipmentList = Object.entries(equipment || {})
    .filter(([key, value]) => value === true && key !== "none")
    .map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
    .join(", ") || "No equipment (floor exercises only)";

  // Support both old (flat) and new (nested) profile structures
  const daysPerWeek = p.daysPerWeek || p.availability?.daysPerWeek || 3;
  const fitnessLevel = p.fitnessLevel || p.fitness?.level || "beginner";
  const age = p.age || p.basicInfo?.age || 25;
  const trainingAge = p.trainingAge || p.trainingBackground?.trainingAge || "0-6mo";
  const sessionDurationMin = p.sessionDurationMin || p.availability?.sessionDurationMin || 45;
  const trainingLocation = p.trainingLocation || p.location?.trainingLocation || "home";
  const goalPrimary = p.goalPrimary || p.goals?.rankedGoals?.[0] || "general_fitness";
  const goalSecondary = p.goalSecondary || p.goals?.rankedGoals?.[1];
  const goalTertiary = p.goalTertiary || p.goals?.rankedGoals?.[2];

  return `Create a personalized ${daysPerWeek}-day per week calisthenics workout plan for the following user:

## User Profile
- Fitness Level: ${fitnessLevel}
- Age: ${age} years old
- Training Experience: ${trainingAge}
- Session Duration: ${sessionDurationMin} minutes per session
- Training Location: ${trainingLocation}

## Available Equipment
${equipmentList}

## Goals
- Primary: ${goalPrimary.replace(/_/g, " ")}
${goalSecondary ? `- Secondary: ${goalSecondary.replace(/_/g, " ")}` : ""}
${goalTertiary ? `- Tertiary: ${goalTertiary.replace(/_/g, " ")}` : ""}

## Baseline Performance
- Push-ups: ${p.maxPushups || p.baseline?.maxPushups || "N/A"}
- Pull-ups: ${p.maxPullups || p.baseline?.maxPullups || "N/A"}
- Dips: ${p.maxDips || p.baseline?.maxDips || "N/A"}
- Plank Hold: ${p.plankHoldSec || p.baseline?.plankHoldSec || "N/A"} seconds
- Hollow Hold: ${p.hollowHoldSec || p.baseline?.hollowHoldSec || "N/A"}
- Wall Handstand: ${p.wallHandstandHoldSec || p.baseline?.wallHandstandHoldSec || "N/A"}

## IMPORTANT - Injury Restrictions
${avoidTags.length > 0 
  ? `DO NOT include exercises with these tags: ${avoidTags.join(", ")}`
  : "No injury restrictions"}

Generate a complete weekly workout plan with:
1. ${daysPerWeek} training days spread across the week
2. Each session approximately ${sessionDurationMin} minutes
3. Warm-up block (5-8 min) and cooldown block (5 min) for each day
4. Appropriate exercises for ${fitnessLevel} level
5. Clear progression rules for each exercise
6. Regressions for exercises that might be too challenging

Focus on the user's primary goal of "${goalPrimary.replace(/_/g, " ")}" while maintaining balanced training.`;
}

/**
 * Build prompt for guest assessment flow (new format)
 */
export function buildGuestPlanPrompt(profile: GuestProfileData): string {
  const equipmentList = Object.entries(profile.equipment)
    .filter(([key, value]) => value === true && key !== "none")
    .map(([key]) => key.replace(/([A-Z])/g, " $1").trim())
    .join(", ") || "No equipment (floor exercises only)";

  const goals = profile.goals.rankedGoals || [];
  const primaryGoal = goals[0]?.replace(/_/g, " ") || "general fitness";
  const secondaryGoal = goals[1]?.replace(/_/g, " ");
  const tertiaryGoal = goals[2]?.replace(/_/g, " ");

  // Recovery-based adjustments
  const intensityMod = profile.goals.intensityPreference === "chill" 
    ? "Keep intensity moderate with longer rest periods."
    : profile.goals.intensityPreference === "intense"
    ? "Can push intensity higher with shorter rest periods."
    : "";

  const recoveryNote = profile.recoveryPrefs
    ? `Sleep Quality: ${profile.recoveryPrefs.sleepQuality}, Soreness Tolerance: ${profile.recoveryPrefs.sorenessTolerance}`
    : "";

  return `Create a personalized ${profile.availability.daysPerWeek}-day per week calisthenics workout plan for the following user:

## User Profile
- Fitness Level: ${profile.fitnessLevel} (score: ${profile.fitnessScore}/100)
- Age: ${profile.basicInfo.age} years old
- Training Experience: ${profile.trainingBackground.trainingAge}
- Session Duration: ${profile.availability.sessionDurationMin} minutes per session
- Preferred Time: ${profile.availability.preferredTime}
- Training Location: ${profile.location.trainingLocation}
${recoveryNote ? `- Recovery: ${recoveryNote}` : ""}

## Available Equipment
${equipmentList}

## Goals (in priority order)
1. Primary: ${primaryGoal}
${secondaryGoal ? `2. Secondary: ${secondaryGoal}` : ""}
${tertiaryGoal ? `3. Tertiary: ${tertiaryGoal}` : ""}

## Training Preferences
- Intensity: ${profile.goals.intensityPreference}
${intensityMod}

## IMPORTANT - Injury Restrictions
${profile.avoidTags.length > 0 
  ? `DO NOT include exercises with these tags: ${profile.avoidTags.join(", ")}`
  : "No injury restrictions"}

Generate a complete weekly workout plan with:
1. ${profile.availability.daysPerWeek} training days spread optimally across the week
2. Each session approximately ${profile.availability.sessionDurationMin} minutes
3. Warm-up block (5-8 min) and cooldown block (5 min) for each training day
4. Appropriate exercises for ${profile.fitnessLevel} level
5. Clear progression rules for each exercise
6. Regressions for exercises that might be too challenging
7. RIR (Reps In Reserve) or RPE intensity guidance for each exercise

Focus on the user's primary goal of "${primaryGoal}" while maintaining balanced push/pull training.`;
}

