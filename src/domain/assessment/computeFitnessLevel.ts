import type { Baseline, FitnessLevel } from "@/types/assessment";

interface FitnessLevelResult {
  level: FitnessLevel;
  reasoning: string[];
}

/**
 * Compute fitness level based on baseline performance tests.
 * 
 * Beginner: <5 pushups OR 0 pullups OR <30s plank
 * Intermediate: 10-25 pushups AND 5-12 pullups AND 60s+ plank
 * Advanced: 25+ pushups AND 12+ pullups AND specific skill holds
 */
export function computeFitnessLevel(baseline: Baseline): FitnessLevelResult {
  const reasoning: string[] = [];

  // Extract numeric values, treating special values appropriately
  const pushups = typeof baseline.maxPushups === "number" ? baseline.maxPushups : 0;
  const pullups =
    baseline.maxPullups === "no_bar"
      ? null // Can't assess
      : typeof baseline.maxPullups === "number"
      ? baseline.maxPullups
      : 0;
  const dips =
    baseline.maxDips === "no_station"
      ? null
      : typeof baseline.maxDips === "number"
      ? baseline.maxDips
      : 0;
  const plank = baseline.plankHoldSec;
  const hollow =
    baseline.hollowHoldSec === "unfamiliar"
      ? null
      : baseline.hollowHoldSec;
  const handstand =
    baseline.wallHandstandHoldSec === "cannot_do" ||
    baseline.wallHandstandHoldSec === "never_tried"
      ? 0
      : baseline.wallHandstandHoldSec;

  // Check for beginner indicators
  const beginnerIndicators: boolean[] = [];

  if (pushups < 5) {
    beginnerIndicators.push(true);
    reasoning.push(`Pushups (${pushups}) below 5`);
  }

  if (pullups !== null && pullups === 0) {
    beginnerIndicators.push(true);
    reasoning.push("Cannot perform pullups");
  }

  if (plank < 30) {
    beginnerIndicators.push(true);
    reasoning.push(`Plank hold (${plank}s) below 30s`);
  }

  // If any beginner indicator is present, classify as beginner
  if (beginnerIndicators.length > 0) {
    return {
      level: "beginner",
      reasoning: ["Classified as beginner due to:", ...reasoning],
    };
  }

  // Check for advanced indicators
  const advancedIndicators: boolean[] = [];
  const advancedReasons: string[] = [];

  if (pushups >= 25) {
    advancedIndicators.push(true);
    advancedReasons.push(`Strong pushup performance (${pushups})`);
  }

  if (pullups !== null && pullups >= 12) {
    advancedIndicators.push(true);
    advancedReasons.push(`Strong pullup performance (${pullups})`);
  }

  if (dips !== null && dips >= 15) {
    advancedIndicators.push(true);
    advancedReasons.push(`Strong dip performance (${dips})`);
  }

  if (plank >= 120) {
    advancedIndicators.push(true);
    advancedReasons.push(`Strong core endurance (${plank}s plank)`);
  }

  if (hollow !== null && hollow >= 60) {
    advancedIndicators.push(true);
    advancedReasons.push(`Strong hollow hold (${hollow}s)`);
  }

  if (handstand >= 30) {
    advancedIndicators.push(true);
    advancedReasons.push(`Handstand hold capability (${handstand}s)`);
  }

  // Need at least 3 advanced indicators to be classified as advanced
  if (advancedIndicators.length >= 3) {
    return {
      level: "advanced",
      reasoning: ["Classified as advanced due to:", ...advancedReasons],
    };
  }

  // Default to intermediate
  const intermediateReasons: string[] = [];

  if (pushups >= 10) {
    intermediateReasons.push(`Solid pushup foundation (${pushups})`);
  }
  if (pullups !== null && pullups >= 5) {
    intermediateReasons.push(`Can perform pullups (${pullups})`);
  }
  if (plank >= 60) {
    intermediateReasons.push(`Good core endurance (${plank}s plank)`);
  }

  return {
    level: "intermediate",
    reasoning: [
      "Classified as intermediate:",
      ...intermediateReasons,
      advancedIndicators.length > 0
        ? `Has ${advancedIndicators.length} advanced indicator(s) but needs 3+ for advanced`
        : "Building toward advanced level",
    ],
  };
}

/**
 * Get age-based adjustments to apply to training
 */
export function getAgeAdjustments(age: number): {
  flags: string[];
  restrictions: string[];
  disclaimerAddendum: string | null;
} {
  if (age < 13) {
    throw new Error("Users must be 13 or older");
  }

  if (age < 18) {
    return {
      flags: ["requiresParentalGuidance"],
      restrictions: [
        "No advanced skills (muscle-up, planche)",
        "Lower volume recommendations",
        "Extra rest emphasis",
        "No diet section access",
      ],
      disclaimerAddendum: "Parental/guardian supervision recommended.",
    };
  }

  if (age >= 65) {
    return {
      flags: ["seniorConsiderations"],
      restrictions: [
        "Emphasize mobility and joint health",
        "Lower intensity defaults",
        "Extra warm-up time",
      ],
      disclaimerAddendum:
        "Consult your doctor before starting, especially if you have cardiovascular or joint concerns.",
    };
  }

  return { flags: [], restrictions: [], disclaimerAddendum: null };
}

