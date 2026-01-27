import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TemplateExercise {
  exerciseSlug: string;
  sets: number;
  reps: string;
  restSec: number;
  notes?: string;
}

interface TemplateBlock {
  blockType: "warmup" | "skill" | "strength" | "conditioning" | "cooldown";
  durationMin: number;
  exercises: TemplateExercise[];
}

interface TemplateDay {
  dayNumber: number;
  dayType: string;
  totalDurationMin: number;
  blocks: TemplateBlock[];
}

interface TemplateStructure {
  weeklyStructure: TemplateDay[];
  metadata: {
    totalWeeklyVolume: number;
    pushPullRatio: number;
    skillFocus: string[];
    avoidedMovements: string[];
  };
}

interface PlanTemplateData {
  name: string;
  description: string;
  fitnessLevel: string;
  goalType: string;
  daysPerWeek: number;
  structure: TemplateStructure;
}

const templates: PlanTemplateData[] = [
  // ==================== BEGINNER TEMPLATES ====================
  {
    name: "Beginner Full Body - General Fitness",
    description: "A 3-day full body program for complete beginners focusing on fundamental movements and building base strength.",
    fitnessLevel: "beginner",
    goalType: "general_fitness",
    daysPerWeek: 3,
    structure: {
      weeklyStructure: [
        {
          dayNumber: 1,
          dayType: "full",
          totalDurationMin: 30,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "10 each direction", restSec: 0 },
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
                { exerciseSlug: "bodyweight-squat", sets: 1, reps: "10", restSec: 0, notes: "Slow tempo warm-up" },
              ],
            },
            {
              blockType: "strength",
              durationMin: 20,
              exercises: [
                { exerciseSlug: "incline-push-up", sets: 3, reps: "8-12", restSec: 60, notes: "Lower incline as you progress" },
                { exerciseSlug: "bodyweight-squat", sets: 3, reps: "10-15", restSec: 60 },
                { exerciseSlug: "australian-pull-up", sets: 3, reps: "8-12", restSec: 60, notes: "Use higher bar if needed" },
                { exerciseSlug: "glute-bridge", sets: 3, reps: "12-15", restSec: 45 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 3,
          dayType: "full",
          totalDurationMin: 30,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "10 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "10", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 20,
              exercises: [
                { exerciseSlug: "push-up", sets: 3, reps: "5-10", restSec: 60, notes: "Do incline if needed" },
                { exerciseSlug: "bodyweight-squat", sets: 3, reps: "12-15", restSec: 60 },
                { exerciseSlug: "dead-hang", sets: 3, reps: "15-30s", restSec: 60 },
                { exerciseSlug: "plank", sets: 3, reps: "20-30s", restSec: 45 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 5,
          dayType: "full",
          totalDurationMin: 30,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "10 each direction", restSec: 0 },
                { exerciseSlug: "bodyweight-squat", sets: 1, reps: "10", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 20,
              exercises: [
                { exerciseSlug: "incline-push-up", sets: 3, reps: "10-15", restSec: 60 },
                { exerciseSlug: "australian-pull-up", sets: 3, reps: "8-12", restSec: 60 },
                { exerciseSlug: "squat-hold", sets: 3, reps: "20-30s", restSec: 45 },
                { exerciseSlug: "hollow-body-hold", sets: 3, reps: "15-20s", restSec: 45 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
      ],
      metadata: {
        totalWeeklyVolume: 36,
        pushPullRatio: 1.0,
        skillFocus: [],
        avoidedMovements: [],
      },
    },
  },
  {
    name: "Beginner Pull-Up Focus",
    description: "A program designed to help beginners achieve their first pull-up through progressive pulling exercises.",
    fitnessLevel: "beginner",
    goalType: "first_pullup",
    daysPerWeek: 3,
    structure: {
      weeklyStructure: [
        {
          dayNumber: 1,
          dayType: "pull",
          totalDurationMin: 30,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "10 each direction", restSec: 0 },
                { exerciseSlug: "band-pull-apart", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 20,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 3, reps: "20-30s", restSec: 60, notes: "Build grip strength" },
                { exerciseSlug: "active-hang", sets: 3, reps: "10-15s", restSec: 60, notes: "Engage shoulders" },
                { exerciseSlug: "scapular-pull-up", sets: 3, reps: "8-10", restSec: 60 },
                { exerciseSlug: "australian-pull-up", sets: 3, reps: "8-12", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "30s", restSec: 0, notes: "Relaxed stretch" },
              ],
            },
          ],
        },
        {
          dayNumber: 3,
          dayType: "full",
          totalDurationMin: 30,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "10 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "10", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 20,
              exercises: [
                { exerciseSlug: "push-up", sets: 3, reps: "8-12", restSec: 60, notes: "Incline if needed" },
                { exerciseSlug: "negative-pull-up", sets: 3, reps: "3-5", restSec: 90, notes: "5 second lowering" },
                { exerciseSlug: "bodyweight-squat", sets: 3, reps: "12-15", restSec: 60 },
                { exerciseSlug: "plank", sets: 3, reps: "20-30s", restSec: 45 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 5,
          dayType: "pull",
          totalDurationMin: 30,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "10 each direction", restSec: 0 },
                { exerciseSlug: "band-pull-apart", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 20,
              exercises: [
                { exerciseSlug: "australian-pull-up", sets: 4, reps: "8-12", restSec: 60, notes: "Feet elevated if possible" },
                { exerciseSlug: "negative-pull-up", sets: 4, reps: "3-5", restSec: 90, notes: "Control the descent" },
                { exerciseSlug: "active-hang", sets: 3, reps: "15-20s", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "30-45s", restSec: 0 },
              ],
            },
          ],
        },
      ],
      metadata: {
        totalWeeklyVolume: 32,
        pushPullRatio: 0.3,
        skillFocus: ["first_pullup"],
        avoidedMovements: [],
      },
    },
  },

  // ==================== INTERMEDIATE TEMPLATES ====================
  {
    name: "Intermediate Push-Pull-Legs",
    description: "A balanced 4-day program for intermediate trainees using a push-pull-legs split with skill work.",
    fitnessLevel: "intermediate",
    goalType: "build_muscle",
    daysPerWeek: 4,
    structure: {
      weeklyStructure: [
        {
          dayNumber: 1,
          dayType: "push",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "12", restSec: 0 },
                { exerciseSlug: "band-pull-apart", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "dips", sets: 4, reps: "8-12", restSec: 90, notes: "Lean forward for chest emphasis" },
                { exerciseSlug: "push-up", sets: 4, reps: "12-15", restSec: 60 },
                { exerciseSlug: "pike-push-up", sets: 3, reps: "8-10", restSec: 90 },
                { exerciseSlug: "diamond-push-up", sets: 3, reps: "8-12", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 2,
          dayType: "pull",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-pull-up", sets: 2, reps: "10", restSec: 0 },
                { exerciseSlug: "band-pull-apart", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "pull-up", sets: 4, reps: "6-10", restSec: 90 },
                { exerciseSlug: "chin-up", sets: 3, reps: "8-10", restSec: 90 },
                { exerciseSlug: "australian-pull-up", sets: 3, reps: "12-15", restSec: 60, notes: "Feet elevated" },
                { exerciseSlug: "hanging-knee-raise", sets: 3, reps: "12-15", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "45-60s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 4,
          dayType: "legs",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "bodyweight-squat", sets: 2, reps: "15", restSec: 0 },
                { exerciseSlug: "glute-bridge", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "bulgarian-split-squat", sets: 3, reps: "10-12 each", restSec: 60 },
                { exerciseSlug: "bodyweight-squat", sets: 4, reps: "15-20", restSec: 60, notes: "Pause at bottom" },
                { exerciseSlug: "single-leg-glute-bridge", sets: 3, reps: "12-15 each", restSec: 45 },
                { exerciseSlug: "single-leg-calf-raise", sets: 3, reps: "15-20 each", restSec: 30 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "squat-hold", sets: 1, reps: "60s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 5,
          dayType: "full",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "archer-push-up", sets: 3, reps: "6-8 each", restSec: 90 },
                { exerciseSlug: "wide-grip-pull-up", sets: 3, reps: "6-8", restSec: 90 },
                { exerciseSlug: "pistol-squat", sets: 3, reps: "3-5 each", restSec: 90, notes: "Assisted if needed" },
                { exerciseSlug: "hollow-body-hold", sets: 3, reps: "30-45s", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
      ],
      metadata: {
        totalWeeklyVolume: 52,
        pushPullRatio: 1.0,
        skillFocus: [],
        avoidedMovements: [],
      },
    },
  },
  {
    name: "Intermediate Handstand Focus",
    description: "A program for intermediate trainees wanting to develop handstand skills alongside general strength.",
    fitnessLevel: "intermediate",
    goalType: "handstand",
    daysPerWeek: 4,
    structure: {
      weeklyStructure: [
        {
          dayNumber: 1,
          dayType: "skill",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "12", restSec: 0 },
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
              ],
            },
            {
              blockType: "skill",
              durationMin: 15,
              exercises: [
                { exerciseSlug: "wall-handstand", sets: 5, reps: "20-30s", restSec: 90, notes: "Chest to wall" },
                { exerciseSlug: "crow-pose", sets: 3, reps: "15-20s", restSec: 60 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 18,
              exercises: [
                { exerciseSlug: "pike-push-up", sets: 4, reps: "8-10", restSec: 90, notes: "Feet elevated for more difficulty" },
                { exerciseSlug: "plank", sets: 3, reps: "45-60s", restSec: 45 },
                { exerciseSlug: "hollow-body-hold", sets: 3, reps: "30-45s", restSec: 45 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 2,
          dayType: "pull",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-pull-up", sets: 2, reps: "10", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "pull-up", sets: 4, reps: "8-10", restSec: 90 },
                { exerciseSlug: "australian-pull-up", sets: 3, reps: "12-15", restSec: 60 },
                { exerciseSlug: "hanging-leg-raise", sets: 3, reps: "8-12", restSec: 60 },
                { exerciseSlug: "l-sit", sets: 3, reps: "10-20s", restSec: 60, notes: "Tucked if needed" },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "45-60s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 4,
          dayType: "skill",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "skill",
              durationMin: 15,
              exercises: [
                { exerciseSlug: "wall-handstand", sets: 5, reps: "30-45s", restSec: 90, notes: "Work on toe pulls" },
              ],
            },
            {
              blockType: "strength",
              durationMin: 18,
              exercises: [
                { exerciseSlug: "decline-push-up", sets: 4, reps: "10-12", restSec: 60 },
                { exerciseSlug: "support-hold", sets: 3, reps: "30-45s", restSec: 60 },
                { exerciseSlug: "side-plank", sets: 3, reps: "30s each side", restSec: 45 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 6,
          dayType: "legs",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "bodyweight-squat", sets: 2, reps: "15", restSec: 0 },
                { exerciseSlug: "glute-bridge", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "bulgarian-split-squat", sets: 4, reps: "10-12 each", restSec: 60 },
                { exerciseSlug: "shrimp-squat-progression", sets: 3, reps: "5-8 each", restSec: 90 },
                { exerciseSlug: "single-leg-glute-bridge", sets: 3, reps: "12-15 each", restSec: 45 },
                { exerciseSlug: "calf-raise", sets: 3, reps: "20", restSec: 30 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "squat-hold", sets: 1, reps: "60s", restSec: 0 },
              ],
            },
          ],
        },
      ],
      metadata: {
        totalWeeklyVolume: 56,
        pushPullRatio: 1.2,
        skillFocus: ["handstand"],
        avoidedMovements: [],
      },
    },
  },

  // ==================== ADVANCED TEMPLATES ====================
  {
    name: "Advanced Muscle-Up Program",
    description: "An intensive program for advanced trainees working toward the muscle-up skill.",
    fitnessLevel: "advanced",
    goalType: "muscle_up",
    daysPerWeek: 4,
    structure: {
      weeklyStructure: [
        {
          dayNumber: 1,
          dayType: "pull",
          totalDurationMin: 60,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 8,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-pull-up", sets: 2, reps: "12", restSec: 0 },
                { exerciseSlug: "band-pull-apart", sets: 2, reps: "15", restSec: 0 },
                { exerciseSlug: "skin-the-cat", sets: 2, reps: "5", restSec: 60 },
              ],
            },
            {
              blockType: "skill",
              durationMin: 15,
              exercises: [
                { exerciseSlug: "muscle-up", sets: 5, reps: "1-3", restSec: 180, notes: "Explosive pull, focus on transition" },
              ],
            },
            {
              blockType: "strength",
              durationMin: 32,
              exercises: [
                { exerciseSlug: "archer-pull-up", sets: 4, reps: "5-6 each", restSec: 120 },
                { exerciseSlug: "l-sit-pull-up", sets: 3, reps: "6-8", restSec: 90 },
                { exerciseSlug: "australian-pull-up", sets: 3, reps: "15", restSec: 60, notes: "Explosive" },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "60s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 2,
          dayType: "push",
          totalDurationMin: 60,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 8,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 47,
              exercises: [
                { exerciseSlug: "ring-dips", sets: 4, reps: "8-10", restSec: 120 },
                { exerciseSlug: "ring-push-up", sets: 4, reps: "10-12", restSec: 90 },
                { exerciseSlug: "pseudo-planche-push-up", sets: 3, reps: "8-10", restSec: 90 },
                { exerciseSlug: "pike-push-up", sets: 3, reps: "10-12", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 4,
          dayType: "pull",
          totalDurationMin: 60,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 8,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-pull-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "skill",
              durationMin: 10,
              exercises: [
                { exerciseSlug: "muscle-up", sets: 4, reps: "1-2", restSec: 180, notes: "Quality over quantity" },
              ],
            },
            {
              blockType: "strength",
              durationMin: 37,
              exercises: [
                { exerciseSlug: "wide-grip-pull-up", sets: 4, reps: "8-10", restSec: 90 },
                { exerciseSlug: "chin-up", sets: 4, reps: "10-12", restSec: 90 },
                { exerciseSlug: "front-lever-progression", sets: 3, reps: "10-15s", restSec: 90 },
                { exerciseSlug: "hanging-leg-raise", sets: 3, reps: "12-15", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "60s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 5,
          dayType: "legs",
          totalDurationMin: 45,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "bodyweight-squat", sets: 2, reps: "15", restSec: 0 },
                { exerciseSlug: "glute-bridge", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 33,
              exercises: [
                { exerciseSlug: "pistol-squat", sets: 4, reps: "6-8 each", restSec: 90 },
                { exerciseSlug: "nordic-curl", sets: 3, reps: "5-8", restSec: 120, notes: "Assisted if needed" },
                { exerciseSlug: "single-leg-glute-bridge", sets: 3, reps: "15 each", restSec: 45 },
                { exerciseSlug: "single-leg-calf-raise", sets: 3, reps: "15-20 each", restSec: 30 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "squat-hold", sets: 1, reps: "90s", restSec: 0 },
              ],
            },
          ],
        },
      ],
      metadata: {
        totalWeeklyVolume: 64,
        pushPullRatio: 0.8,
        skillFocus: ["muscle_up"],
        avoidedMovements: [],
      },
    },
  },
  {
    name: "Advanced Full Body Strength",
    description: "A comprehensive advanced program for building overall strength and mastering bodyweight movements.",
    fitnessLevel: "advanced",
    goalType: "build_muscle",
    daysPerWeek: 5,
    structure: {
      weeklyStructure: [
        {
          dayNumber: 1,
          dayType: "push",
          totalDurationMin: 60,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 8,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "skill",
              durationMin: 10,
              exercises: [
                { exerciseSlug: "wall-handstand", sets: 4, reps: "30-45s", restSec: 90 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 37,
              exercises: [
                { exerciseSlug: "ring-dips", sets: 4, reps: "10-12", restSec: 90 },
                { exerciseSlug: "archer-push-up", sets: 4, reps: "8-10 each", restSec: 90 },
                { exerciseSlug: "pike-push-up", sets: 3, reps: "12-15", restSec: 60 },
                { exerciseSlug: "pseudo-planche-push-up", sets: 3, reps: "8-10", restSec: 90 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "cat-cow", sets: 1, reps: "10", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 2,
          dayType: "pull",
          totalDurationMin: 60,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 8,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-pull-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 47,
              exercises: [
                { exerciseSlug: "archer-pull-up", sets: 4, reps: "6-8 each", restSec: 120 },
                { exerciseSlug: "l-sit-pull-up", sets: 4, reps: "8-10", restSec: 90 },
                { exerciseSlug: "front-lever-progression", sets: 3, reps: "15-20s", restSec: 90 },
                { exerciseSlug: "ring-row", sets: 3, reps: "15", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "60-90s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 3,
          dayType: "legs",
          totalDurationMin: 50,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "bodyweight-squat", sets: 2, reps: "15", restSec: 0 },
                { exerciseSlug: "glute-bridge", sets: 2, reps: "15", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 38,
              exercises: [
                { exerciseSlug: "pistol-squat", sets: 4, reps: "8-10 each", restSec: 90 },
                { exerciseSlug: "nordic-curl", sets: 4, reps: "6-8", restSec: 120 },
                { exerciseSlug: "bulgarian-split-squat", sets: 3, reps: "12 each", restSec: 60 },
                { exerciseSlug: "single-leg-calf-raise", sets: 3, reps: "20 each", restSec: 30 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "squat-hold", sets: 1, reps: "90s", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 5,
          dayType: "push",
          totalDurationMin: 50,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-push-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 38,
              exercises: [
                { exerciseSlug: "handstand-push-up", sets: 4, reps: "5-8", restSec: 120, notes: "Against wall" },
                { exerciseSlug: "ring-push-up", sets: 4, reps: "12-15", restSec: 90 },
                { exerciseSlug: "decline-push-up", sets: 3, reps: "15-20", restSec: 60 },
                { exerciseSlug: "diamond-push-up", sets: 3, reps: "12-15", restSec: 60 },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "worlds-greatest-stretch", sets: 1, reps: "5 each side", restSec: 0 },
              ],
            },
          ],
        },
        {
          dayNumber: 6,
          dayType: "pull",
          totalDurationMin: 50,
          blocks: [
            {
              blockType: "warmup",
              durationMin: 7,
              exercises: [
                { exerciseSlug: "arm-circles", sets: 2, reps: "15 each direction", restSec: 0 },
                { exerciseSlug: "scapular-pull-up", sets: 2, reps: "12", restSec: 0 },
              ],
            },
            {
              blockType: "strength",
              durationMin: 38,
              exercises: [
                { exerciseSlug: "wide-grip-pull-up", sets: 4, reps: "10-12", restSec: 90 },
                { exerciseSlug: "chin-up", sets: 4, reps: "10-12", restSec: 90 },
                { exerciseSlug: "hanging-leg-raise", sets: 3, reps: "15", restSec: 60 },
                { exerciseSlug: "dragon-flag", sets: 3, reps: "5-8", restSec: 90, notes: "Negatives if needed" },
              ],
            },
            {
              blockType: "cooldown",
              durationMin: 5,
              exercises: [
                { exerciseSlug: "dead-hang", sets: 1, reps: "60s", restSec: 0 },
              ],
            },
          ],
        },
      ],
      metadata: {
        totalWeeklyVolume: 72,
        pushPullRatio: 1.0,
        skillFocus: ["handstand"],
        avoidedMovements: [],
      },
    },
  },
];

async function main() {
  console.log("Starting template seed...");

  // Clear existing templates
  await prisma.templatePlan.deleteMany();
  console.log("Cleared existing templates");

  // Seed templates
  for (const template of templates) {
    await prisma.templatePlan.create({
      data: {
        name: template.name,
        description: template.description,
        fitnessLevel: template.fitnessLevel,
        goalFocus: template.goalType,
        daysPerWeek: template.daysPerWeek,
        structure: JSON.stringify(template.structure),
        isActive: true,
      },
    });

    console.log(`Created template: ${template.name}`);
  }

  console.log(`Seeded ${templates.length} templates`);
  console.log("Template seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


