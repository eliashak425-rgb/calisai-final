import type { TrainingProfile } from "@/types/assessment";
import type { GuestProfileData } from "@/services/openai/planGenerator";

const PROMPT_VERSION = "v2.0";

export function getPromptVersion(): string {
  return PROMPT_VERSION;
}

export function buildPlanSystemPrompt(): string {
  return `You are an elite calisthenics coach with 20+ years of experience designing progressive bodyweight training programs for athletes at all levels. You specialize in creating challenging but achievable plans that produce real results.

Your expertise includes:
- Calisthenics skill progressions (muscle-ups, handstands, levers, planche)
- Bodyweight strength training with proper periodization
- Movement pattern balancing (push/pull ratios)
- Injury prevention and working around limitations
- Programming for all levels from complete beginner to elite

## CRITICAL DIFFICULTY SCALING RULES

### BEGINNER (0-6 months training)
- Weekly volume: 20-30 total working sets
- Exercise selection: Focus on foundational movements and progressions
- Rest periods: 60-90 seconds between sets
- RPE range: 6-7 (2-3 reps in reserve)
- Progression: Add reps before adding sets
- Example exercises: Wall push-ups, incline push-ups, knee push-ups, dead hangs, Australian pull-ups, bodyweight squats
- DO NOT include: Pull-ups, dips, pistol squats, or advanced variations

### INTERMEDIATE (6 months - 2 years training)
- Weekly volume: 35-50 total working sets
- Exercise selection: Standard and moderate progressions
- Rest periods: 75-120 seconds between sets
- RPE range: 7-8 (1-2 reps in reserve)
- Progression: Add sets, then add weight/difficulty
- Example exercises: Full push-ups, diamond push-ups, pull-ups, chin-ups, dips, Bulgarian split squats, pike push-ups
- Should be able to do: 10+ push-ups, 3+ pull-ups, 20+ bodyweight squats

### ADVANCED (2+ years training)
- Weekly volume: 50-70 total working sets
- Exercise selection: Advanced progressions and skill work
- Rest periods: 90-180 seconds between sets (skill work may need longer)
- RPE range: 8-9 (0-1 reps in reserve)
- Progression: Increase difficulty, add weighted variations, extend holds
- Example exercises: Archer push-ups, muscle-ups, handstand push-ups, front lever progressions, pistol squats, ring dips
- Should be able to do: 20+ push-ups, 10+ pull-ups, 10+ dips, 60+ second plank

## MINIMUM INTENSITY REQUIREMENTS

DO NOT create "easy" workouts. Every workout should be challenging and effective:

1. BEGINNER workouts should leave users moderately fatigued but not destroyed
2. INTERMEDIATE workouts should be genuinely challenging, pushing limits
3. ADVANCED workouts should be demanding, requiring full focus and effort

If a user specifies baseline performance, use those EXACT numbers to calibrate difficulty:
- If they can do 5 push-ups, start them at 4-5 reps per set (not 10)
- If they can do 0 pull-ups, use progressions (not full pull-ups)
- If they can hold a 30s plank, program 25-30s holds (not 60s)

## MUST INCLUDE IN EVERY PLAN
1. Proper warm-up (5-8 minutes): Dynamic stretches, mobility work, activation
2. Main workout: 3-5 exercises per session with proper rest
3. Cool-down (5-7 minutes): Static stretches, breathing
4. Progressive overload: Clear rules for when to advance
5. Regression options: For exercises that may be too hard

## AVOID THESE COMMON MISTAKES
- Programming pull-ups for true beginners (use progressions)
- Programming muscle-ups for intermediate athletes
- Too many exercises per session (quality over quantity)
- Inadequate rest between sets for strength work
- Same difficulty regardless of fitness level
- Generic exercises that don't match user's goals

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

  // Extract baseline performance
  const maxPushups = p.maxPushups || p.baseline?.maxPushups;
  const maxPullups = p.maxPullups || p.baseline?.maxPullups;
  const maxDips = p.maxDips || p.baseline?.maxDips;
  const plankHoldSec = p.plankHoldSec || p.baseline?.plankHoldSec;
  const hollowHoldSec = p.hollowHoldSec || p.baseline?.hollowHoldSec;
  const wallHandstandHoldSec = p.wallHandstandHoldSec || p.baseline?.wallHandstandHoldSec;

  // Determine specific exercise recommendations based on baseline
  const pushupRecommendation = getPushupRecommendation(maxPushups);
  const pullupRecommendation = getPullupRecommendation(maxPullups);

  return `Create a CHALLENGING and EFFECTIVE ${daysPerWeek}-day per week calisthenics workout plan for this user:

## User Profile
- Fitness Level: ${fitnessLevel.toUpperCase()}
- Age: ${age} years old
- Training Experience: ${trainingAge}
- Session Duration: ${sessionDurationMin} minutes per session
- Training Location: ${trainingLocation}

## Available Equipment
${equipmentList}

## Goals (PRIORITIZE THESE)
- PRIMARY GOAL: ${goalPrimary.replace(/_/g, " ").toUpperCase()}
${goalSecondary ? `- Secondary: ${goalSecondary.replace(/_/g, " ")}` : ""}
${goalTertiary ? `- Tertiary: ${goalTertiary.replace(/_/g, " ")}` : ""}

## CRITICAL - Baseline Performance (USE THESE TO CALIBRATE DIFFICULTY)
${maxPushups !== undefined ? `- Max Push-ups: ${maxPushups} → ${pushupRecommendation}` : "- Push-ups: Not tested"}
${maxPullups !== undefined ? `- Max Pull-ups: ${maxPullups} → ${pullupRecommendation}` : "- Pull-ups: Not tested"}
${maxDips !== undefined ? `- Max Dips: ${maxDips}` : ""}
${plankHoldSec !== undefined ? `- Plank Hold: ${plankHoldSec} seconds` : ""}
${hollowHoldSec !== undefined ? `- Hollow Hold: ${hollowHoldSec} seconds` : ""}
${wallHandstandHoldSec !== undefined ? `- Wall Handstand: ${wallHandstandHoldSec} seconds` : ""}

## INJURY RESTRICTIONS (ABSOLUTE - DO NOT VIOLATE)
${avoidTags.length > 0 
  ? `AVOID exercises with these tags: ${avoidTags.join(", ")}`
  : "No restrictions"}

## Requirements for this plan:

1. Create ${daysPerWeek} training days with smart muscle group splits
2. Each session ~${sessionDurationMin} minutes total
3. ALWAYS include: Warmup (5-8 min) → Main Work → Cooldown (5-7 min)
4. Match exercise difficulty to ${fitnessLevel} level EXACTLY
5. Use baseline numbers to set appropriate rep ranges
6. Include REST PERIODS between sets (not just exercise duration)
7. Provide progression rules (when to make exercise harder)
8. Provide regressions (easier version if too hard)
9. RPE/RIR guidance for each exercise
10. Focus heavily on "${goalPrimary.replace(/_/g, " ")}"

THIS PLAN MUST BE CHALLENGING. Do not create an easy workout. The user should feel like they worked hard after each session.`;
}

function getPushupRecommendation(maxPushups: number | undefined): string {
  if (maxPushups === undefined) return "Use wall/incline progressions to assess";
  if (maxPushups === 0) return "Start with wall push-ups, progress to incline";
  if (maxPushups <= 5) return "Use knee push-ups or incline, 4-5 reps per set";
  if (maxPushups <= 10) return "Standard push-ups, 6-8 reps per set";
  if (maxPushups <= 20) return "Push-ups + diamond variations, 8-12 reps";
  if (maxPushups <= 30) return "Advanced variations (archer, clap), 10-15 reps";
  return "Elite variations (one-arm progressions, planche), high reps";
}

function getPullupRecommendation(maxPullups: number | undefined): string {
  if (maxPullups === undefined) return "Start with dead hangs and negatives";
  if (maxPullups === 0) return "Dead hangs, scapular pulls, band-assisted or negatives only";
  if (maxPullups <= 3) return "Negatives + assisted pull-ups, work up to 3 per set";
  if (maxPullups <= 8) return "Standard pull-ups 4-6 reps, chin-ups for volume";
  if (maxPullups <= 15) return "Weighted pull-ups, L-sit pull-ups, 6-10 reps";
  return "Advanced (muscle-up progressions, one-arm negatives)";
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
    ? "User prefers moderate intensity - use RPE 6-7, longer rest (90-120s)"
    : profile.goals.intensityPreference === "intense"
    ? "User wants HIGH intensity - use RPE 8-9, shorter rest (45-60s), supersets OK"
    : "Balance intensity with proper rest periods";

  const recoveryNote = profile.recoveryPrefs
    ? `Sleep: ${profile.recoveryPrefs.sleepQuality}, Soreness tolerance: ${profile.recoveryPrefs.sorenessTolerance}`
    : "";

  // Fitness score interpretation
  const fitnessInterpretation = profile.fitnessScore < 30 
    ? "TRUE BEGINNER - focus on fundamentals, form over intensity"
    : profile.fitnessScore < 50
    ? "BEGINNER - can handle basic compound movements"
    : profile.fitnessScore < 70
    ? "INTERMEDIATE - ready for challenging progressions"
    : "ADVANCED - can handle complex movements and high volume";

  return `Create a CHALLENGING ${profile.availability.daysPerWeek}-day per week calisthenics workout plan:

## User Assessment Results
- Fitness Level: ${profile.fitnessLevel.toUpperCase()} (Score: ${profile.fitnessScore}/100)
- Assessment: ${fitnessInterpretation}
- Age: ${profile.basicInfo.age} years
- Training Experience: ${profile.trainingBackground.trainingAge}
- Session Duration: ${profile.availability.sessionDurationMin} minutes
- Preferred Time: ${profile.availability.preferredTime}
- Location: ${profile.location.trainingLocation}
${recoveryNote ? `- Recovery Profile: ${recoveryNote}` : ""}

## Equipment Available
${equipmentList}

## Goals (IN PRIORITY ORDER - EMPHASIZE PRIMARY)
1. PRIMARY: ${primaryGoal.toUpperCase()}
${secondaryGoal ? `2. Secondary: ${secondaryGoal}` : ""}
${tertiaryGoal ? `3. Tertiary: ${tertiaryGoal}` : ""}

## Intensity Preference
${intensityMod}

## INJURY RESTRICTIONS (DO NOT VIOLATE)
${profile.avoidTags.length > 0 
  ? `ABSOLUTELY AVOID: ${profile.avoidTags.join(", ")}`
  : "No restrictions"}

## Plan Requirements

1. ${profile.availability.daysPerWeek} training days with smart splits
2. ~${profile.availability.sessionDurationMin} minute sessions
3. Structure: Warmup (5-8 min) → Main Work → Cooldown (5-7 min)
4. Exercise difficulty MUST match ${profile.fitnessLevel} level
5. Include specific REST PERIODS (45-120s based on intensity)
6. Clear progression rules for EVERY exercise
7. Regression options for challenging movements
8. RPE/RIR for each exercise

REMEMBER: Fitness score ${profile.fitnessScore}/100 = ${profile.fitnessLevel}
- Don't give pull-ups to someone who can't do one
- Don't give wall push-ups to someone who can do 20 regular ones
- The plan should be CHALLENGING for THIS specific user's level

Primary focus: ${primaryGoal.toUpperCase()}`;
}
