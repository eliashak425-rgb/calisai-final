/**
 * Maps pain areas to exercise tags that should be avoided.
 * This is the SINGLE source of truth for injury -> exercise restrictions.
 */
export const PAIN_AREA_TO_AVOID_TAGS: Record<string, string[]> = {
  shoulder: [
    "overhead_pressing",
    "dips",
    "muscle_up_training",
    "behind_neck",
    "wide_grip_pullup",
    "skin_the_cat",
  ],
  elbow: [
    "dips",
    "close_grip_pushup",
    "skull_crushers",
    "straight_bar_curl",
    "planche_leans",
  ],
  wrist: [
    "wrist_extension_load",
    "front_lever_rows",
    "handstand_pushups",
    "planche_training",
  ],
  lower_back: [
    "spinal_flexion_loaded",
    "good_mornings",
    "sit_ups",
    "hanging_leg_raises",
    "l_sit_progression",
  ],
  knee: [
    "deep_squat",
    "jumping",
    "pistol_squat",
    "lunges",
    "box_jumps",
  ],
  ankle: [
    "jumping",
    "box_jumps",
    "single_leg_squat",
    "calf_raises_heavy",
  ],
  neck: [
    "behind_neck_press",
    "wrestler_bridges",
    "headstand",
  ],
};

/**
 * Converts user-selected pain areas into forbidden exercise tags.
 * Called during profile save, NOT during validation.
 */
export function computeAvoidTags(painAreas: string[]): string[] {
  const tags = new Set<string>();

  for (const area of painAreas) {
    const forbidden = PAIN_AREA_TO_AVOID_TAGS[area];
    if (forbidden) {
      forbidden.forEach((tag) => tags.add(tag));
    }
  }

  return Array.from(tags);
}

/**
 * Get all avoid tags for display with their source pain area
 */
export function getAvoidTagsWithSource(
  painAreas: string[]
): { tag: string; source: string }[] {
  const result: { tag: string; source: string }[] = [];

  for (const area of painAreas) {
    const forbidden = PAIN_AREA_TO_AVOID_TAGS[area];
    if (forbidden) {
      forbidden.forEach((tag) => {
        if (!result.find((r) => r.tag === tag)) {
          result.push({ tag, source: area });
        }
      });
    }
  }

  return result;
}

