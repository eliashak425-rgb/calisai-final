/**
 * Centralized Injury Mapping
 * 
 * CRITICAL SAFETY FIX: Do NOT store avoidTags directly from user input.
 * Instead, store painAreas and compute avoidTags centrally from this mapping.
 * This prevents bugs where avoidTags could be manipulated or inconsistent.
 */

import type { PainArea } from "@/types/assessment";

/**
 * Maps pain areas to forbidden exercise tags.
 * When a user reports pain in an area, all exercises with these tags
 * will be excluded from their plan.
 */
export const PAIN_AREA_TO_FORBIDDEN_TAGS: Record<PainArea, string[]> = {
  shoulder: [
    "overhead_pressing",
    "deep_dips",
    "muscle_up_attempts",
    "handstand_pushups",
    "pike_pushups",
    "shoulder_intensive",
    "internal_rotation_load",
  ],
  wrist: [
    "wrist_extension",
    "planche_leans",
    "handstand_pushups",
    "front_lever",
    "planche",
    "wrist_flexion_load",
    "handstand",
  ],
  elbow: [
    "deep_dips",
    "elbow_intensive",
    "tricep_heavy",
    "straight_arm_strength",
    "planche",
    "iron_cross",
  ],
  lower_back: [
    "spinal_flexion_under_load",
    "high_spinal_load",
    "compression",
    "deadlift_pattern",
    "good_morning",
    "back_lever",
  ],
  knee: [
    "deep_squat",
    "jumping",
    "pistol_squat",
    "high_impact",
    "lunges",
    "box_jumps",
    "plyometrics",
  ],
  ankle: [
    "jumping",
    "high_impact",
    "plyometrics",
    "box_jumps",
    "calf_intensive",
    "single_leg_balance",
  ],
  neck: [
    "neck_bridges",
    "headstand",
    "excessive_neck_load",
    "wrestler_bridge",
    "neck_flexion",
  ],
};

/**
 * Computes the list of exercise tags to avoid based on reported pain areas.
 * This is the ONLY place where avoidTags should be computed from painAreas.
 * 
 * @param painAreas - Array of body areas where user has reported pain
 * @returns Array of unique exercise tags that should be avoided
 */
export function computeAvoidTags(painAreas: PainArea[]): string[] {
  if (!painAreas || painAreas.length === 0) {
    return [];
  }

  const tags = new Set<string>();
  
  for (const area of painAreas) {
    const forbidden = PAIN_AREA_TO_FORBIDDEN_TAGS[area];
    if (forbidden) {
      forbidden.forEach(tag => tags.add(tag));
    }
  }
  
  return Array.from(tags);
}

/**
 * Checks if an exercise should be avoided based on its tags and computed avoidTags.
 * 
 * @param exerciseTags - Tags associated with the exercise
 * @param avoidTags - Computed tags to avoid (from computeAvoidTags)
 * @returns true if the exercise should be avoided
 */
export function shouldAvoidExercise(
  exerciseTags: string[],
  avoidTags: string[]
): boolean {
  if (!exerciseTags || !avoidTags || avoidTags.length === 0) {
    return false;
  }
  
  return exerciseTags.some(tag => avoidTags.includes(tag));
}

/**
 * Gets a human-readable description of why certain movements are avoided.
 * Useful for displaying to users in the plan preview.
 * 
 * @param painAreas - Array of reported pain areas
 * @returns Object mapping pain areas to descriptions
 */
export function getAvoidanceReasons(painAreas: PainArea[]): Record<PainArea, string> {
  const reasons: Partial<Record<PainArea, string>> = {};
  
  const descriptions: Record<PainArea, string> = {
    shoulder: "Avoiding overhead and deep pressing movements to protect shoulder joint",
    wrist: "Avoiding wrist extension and load-bearing positions to protect wrists",
    elbow: "Avoiding deep dips and straight-arm strength to protect elbows",
    lower_back: "Avoiding spinal loading and compression movements to protect lower back",
    knee: "Avoiding deep squats, jumping, and high-impact movements to protect knees",
    ankle: "Avoiding jumping and high-impact movements to protect ankles",
    neck: "Avoiding neck bridges and excessive neck loading to protect cervical spine",
  };
  
  for (const area of painAreas) {
    reasons[area] = descriptions[area];
  }
  
  return reasons as Record<PainArea, string>;
}

