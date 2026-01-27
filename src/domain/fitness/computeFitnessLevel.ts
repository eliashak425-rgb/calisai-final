/**
 * Score-Based Fitness Level Computation
 * 
 * Replaces simple threshold-based logic with a comprehensive scoring system
 * that considers push/pull/core strength, skill readiness, and training history.
 */

import type { Baseline, TrainingAge } from "@/types/assessment";

export interface FitnessComputation {
  level: "beginner" | "intermediate" | "advanced";
  score: number; // 0-100
  breakdown: {
    pushScore: number;
    pullScore: number;
    coreScore: number;
    skillScore: number;
    experienceBonus: number;
  };
  readinessGates: {
    muscleUp: boolean;
    handstand: boolean;
    frontLever: boolean;
    planche: boolean;
    pistolSquat: boolean;
    lSit: boolean;
  };
  recommendations: string[];
}

/**
 * Training age bonus points (0-25 scale)
 */
const TRAINING_AGE_BONUS: Record<TrainingAge, number> = {
  "none": 0,
  "0-6mo": 5,
  "6mo-2yr": 12,
  "2-5yr": 20,
  "5yr+": 25,
};

/**
 * Computes a comprehensive fitness level with score and readiness gates.
 * 
 * Scoring breakdown (0-100):
 * - Push strength: 0-20 points
 * - Pull strength: 0-25 points (weighted higher due to calisthenics importance)
 * - Core strength: 0-20 points
 * - Skill indicators: 0-10 points
 * - Training experience: 0-25 points
 * 
 * @param baseline - User's baseline test results
 * @param trainingAge - How long user has been training
 * @returns Comprehensive fitness computation
 */
export function computeFitnessLevel(
  baseline: Baseline,
  trainingAge: TrainingAge
): FitnessComputation {
  // Parse numeric values, treating special strings as 0
  const pushups = parseBaselineValue(baseline.maxPushups);
  const pullups = parseBaselineValue(baseline.maxPullups);
  const dips = parseBaselineValue(baseline.maxDips);
  const plankSec = baseline.plankHoldSec || 0;
  const hollowSec = parseBaselineValue(baseline.hollowHoldSec);
  const handstandSec = parseBaselineValue(baseline.wallHandstandHoldSec);

  // Calculate component scores
  const pushScore = calculatePushScore(pushups, dips);
  const pullScore = calculatePullScore(pullups);
  const coreScore = calculateCoreScore(plankSec, hollowSec);
  const skillScore = calculateSkillScore(handstandSec);
  const experienceBonus = TRAINING_AGE_BONUS[trainingAge] || 0;

  // Total score
  const totalScore = Math.min(100, Math.round(
    pushScore + pullScore + coreScore + skillScore + experienceBonus
  ));

  // Determine level from score
  const level = determineLevel(totalScore);

  // Calculate readiness gates for advanced skills
  const readinessGates = calculateReadinessGates(
    pushups, pullups, dips, plankSec, hollowSec, handstandSec, totalScore
  );

  // Generate recommendations based on weaknesses
  const recommendations = generateRecommendations(
    pushScore, pullScore, coreScore, skillScore, experienceBonus, readinessGates
  );

  return {
    level,
    score: totalScore,
    breakdown: {
      pushScore,
      pullScore,
      coreScore,
      skillScore,
      experienceBonus,
    },
    readinessGates,
    recommendations,
  };
}

/**
 * Parses baseline values that can be numbers or special strings
 */
function parseBaselineValue(value: number | string | undefined | null): number {
  if (typeof value === "number") {
    return value;
  }
  // Strings like "cannot_do", "no_bar", "never_tried", "unfamiliar" all become 0
  return 0;
}

/**
 * Calculate push score (0-20 points)
 * Based on pushups and dips
 */
function calculatePushScore(pushups: number, dips: number): number {
  // Pushups: ~0.5 points per rep, max 15 from pushups
  const pushupPoints = Math.min(15, pushups * 0.5);
  
  // Dips: ~0.5 points per rep, max 5 from dips
  const dipPoints = Math.min(5, dips * 0.5);
  
  return Math.round(pushupPoints + dipPoints);
}

/**
 * Calculate pull score (0-25 points)
 * Pull-ups are heavily weighted for calisthenics
 */
function calculatePullScore(pullups: number): number {
  // Non-linear scaling: first reps worth more
  // 0 pullups = 0, 1 = 3, 5 = 12, 10 = 20, 15+ = 25
  if (pullups === 0) return 0;
  if (pullups < 5) return Math.round(pullups * 2.5);
  if (pullups < 10) return Math.round(10 + (pullups - 5) * 2);
  if (pullups < 15) return Math.round(20 + (pullups - 10) * 1);
  return 25;
}

/**
 * Calculate core score (0-20 points)
 * Based on plank and hollow hold
 */
function calculateCoreScore(plankSec: number, hollowSec: number): number {
  // Plank: max 10 points (60+ sec = full points)
  const plankPoints = Math.min(10, plankSec / 6);
  
  // Hollow hold: max 10 points (30+ sec = full points)
  const hollowPoints = Math.min(10, hollowSec / 3);
  
  return Math.round(plankPoints + hollowPoints);
}

/**
 * Calculate skill score (0-10 points)
 * Based on handstand hold time
 */
function calculateSkillScore(handstandSec: number): number {
  // Wall handstand: max 10 points (60+ sec = full points)
  return Math.min(10, Math.round(handstandSec / 6));
}

/**
 * Determine fitness level from total score
 */
function determineLevel(score: number): "beginner" | "intermediate" | "advanced" {
  if (score < 35) return "beginner";
  if (score < 65) return "intermediate";
  return "advanced";
}

/**
 * Calculate readiness gates for advanced skills
 */
function calculateReadinessGates(
  pushups: number,
  pullups: number,
  dips: number,
  plankSec: number,
  hollowSec: number,
  handstandSec: number,
  totalScore: number
): FitnessComputation["readinessGates"] {
  return {
    // Muscle-up: Need strong pull-ups and dips, good overall score
    muscleUp: pullups >= 10 && dips >= 15 && totalScore >= 50,
    
    // Handstand: Need good wall hold and core strength
    handstand: handstandSec >= 30 && hollowSec >= 20 && totalScore >= 40,
    
    // Front lever: Need very strong pull-ups and core
    frontLever: pullups >= 12 && hollowSec >= 25 && totalScore >= 55,
    
    // Planche: Need very strong push and core, high overall score
    planche: pushups >= 40 && dips >= 20 && hollowSec >= 30 && totalScore >= 60,
    
    // Pistol squat: Core and overall conditioning
    pistolSquat: totalScore >= 35 && plankSec >= 45,
    
    // L-sit: Core strength primarily
    lSit: hollowSec >= 20 && plankSec >= 60 && totalScore >= 30,
  };
}

/**
 * Generate training recommendations based on weaknesses
 */
function generateRecommendations(
  pushScore: number,
  pullScore: number,
  coreScore: number,
  skillScore: number,
  experienceBonus: number,
  readinessGates: FitnessComputation["readinessGates"]
): string[] {
  const recommendations: string[] = [];
  
  // Identify weakest areas
  const scores = [
    { area: "push", score: pushScore, max: 20 },
    { area: "pull", score: pullScore, max: 25 },
    { area: "core", score: coreScore, max: 20 },
    { area: "skill", score: skillScore, max: 10 },
  ];
  
  // Sort by percentage of max (weakest first)
  scores.sort((a, b) => (a.score / a.max) - (b.score / b.max));
  
  // Recommend focusing on weakest areas
  if (scores[0].score / scores[0].max < 0.4) {
    const areaMessages: Record<string, string> = {
      push: "Focus on push-up progressions and dip work",
      pull: "Prioritize pull-up training and rows",
      core: "Add dedicated core work (planks, hollow holds)",
      skill: "Practice wall handstands regularly",
    };
    recommendations.push(areaMessages[scores[0].area]);
  }
  
  // Add skill-specific recommendations
  if (!readinessGates.muscleUp && pullScore >= 15) {
    recommendations.push("Work on explosive pull-ups and dip transitions for muscle-up");
  }
  
  if (!readinessGates.handstand && skillScore >= 5) {
    recommendations.push("Increase wall handstand hold time before freestanding attempts");
  }
  
  // Experience-based recommendations
  if (experienceBonus < 10) {
    recommendations.push("Focus on building consistent training habits");
  }
  
  return recommendations.slice(0, 3); // Max 3 recommendations
}

/**
 * Validates if a user meets prerequisites for a specific skill
 */
export function meetsSkillPrerequisites(
  skill: keyof FitnessComputation["readinessGates"],
  fitness: FitnessComputation
): { ready: boolean; missing: string[] } {
  const ready = fitness.readinessGates[skill];
  const missing: string[] = [];
  
  if (!ready) {
    // Provide specific missing prerequisites
    const prerequisites: Record<string, { check: () => boolean; message: string }[]> = {
      muscleUp: [
        { check: () => fitness.breakdown.pullScore >= 20, message: "10+ strict pull-ups" },
        { check: () => fitness.score >= 50, message: "Overall fitness score 50+" },
      ],
      handstand: [
        { check: () => fitness.breakdown.skillScore >= 5, message: "30+ second wall handstand" },
        { check: () => fitness.breakdown.coreScore >= 10, message: "Strong hollow hold" },
      ],
      frontLever: [
        { check: () => fitness.breakdown.pullScore >= 22, message: "12+ pull-ups" },
        { check: () => fitness.breakdown.coreScore >= 15, message: "25+ second hollow hold" },
      ],
      planche: [
        { check: () => fitness.breakdown.pushScore >= 18, message: "40+ push-ups, 20+ dips" },
        { check: () => fitness.breakdown.coreScore >= 18, message: "30+ second hollow hold" },
        { check: () => fitness.score >= 60, message: "Overall fitness score 60+" },
      ],
      pistolSquat: [
        { check: () => fitness.score >= 35, message: "Overall fitness score 35+" },
      ],
      lSit: [
        { check: () => fitness.breakdown.coreScore >= 12, message: "Strong core foundation" },
      ],
    };
    
    const checks = prerequisites[skill] || [];
    for (const prereq of checks) {
      if (!prereq.check()) {
        missing.push(prereq.message);
      }
    }
  }
  
  return { ready, missing };
}

