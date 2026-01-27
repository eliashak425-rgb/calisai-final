import { z } from "zod";

// Step 1: Basic Info Schema
export const basicInfoSchema = z.object({
  age: z.number().min(13, "Must be at least 13 years old").max(100, "Invalid age"),
  biologicalSex: z.enum(["male", "female", "prefer_not_to_say"]),
  heightCm: z.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  weightKg: z.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be less than 300kg"),
  trainingAge: z.enum(["none", "0-6mo", "6mo-2yr", "2-5yr", "5yr+"]),
});

// Step 2: Availability Schema
export const availabilitySchema = z.object({
  daysPerWeek: z.union([z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
  sessionDurationMin: z.union([z.literal(20), z.literal(30), z.literal(45), z.literal(60), z.literal(90)]),
  preferredTime: z.enum(["morning", "afternoon", "evening", "flexible"]),
  trainingLocation: z.enum(["home", "park", "gym", "mixed"]),
});

// Step 3: Equipment Schema
export const equipmentSchema = z.object({
  pullUpBar: z.boolean(),
  dipStation: z.boolean(),
  parallelBars: z.boolean(),
  rings: z.boolean(),
  resistanceBands: z.boolean(),
  weightedVest: z.boolean(),
  parallettes: z.boolean(),
  none: z.boolean(),
});

// Step 4: Goals Schema
export const goalsSchema = z.object({
  primary: z.enum([
    "build_muscle",
    "lose_fat",
    "first_pullup",
    "muscle_up",
    "handstand",
    "front_lever",
    "planche",
    "general_fitness",
    "mobility",
  ]),
  secondary: z
    .enum([
      "build_muscle",
      "lose_fat",
      "first_pullup",
      "muscle_up",
      "handstand",
      "front_lever",
      "planche",
      "general_fitness",
      "mobility",
    ])
    .optional(),
  tertiary: z
    .enum([
      "build_muscle",
      "lose_fat",
      "first_pullup",
      "muscle_up",
      "handstand",
      "front_lever",
      "planche",
      "general_fitness",
      "mobility",
    ])
    .optional(),
});

// Step 5: Injury Screen Schema
export const injuryScreenSchema = z.object({
  hasCurrentPain: z.boolean(),
  painAreas: z.array(z.enum(["shoulder", "elbow", "wrist", "lower_back", "knee", "ankle", "neck"])),
  painSeverity: z.number().min(1).max(10).optional(),
  diagnosed: z.boolean().optional(),
  diagnosisDetails: z.string().optional(),
  pastInjuries: z.array(z.string()).optional(),
});

// Step 6: Baseline Schema
export const baselineSchema = z.object({
  maxPushups: z.union([z.number().min(0), z.literal("cannot_do")]),
  maxPullups: z.union([z.number().min(0), z.literal("cannot_do"), z.literal("no_bar")]),
  maxDips: z.union([z.number().min(0), z.literal("cannot_do"), z.literal("no_station")]),
  plankHoldSec: z.number().min(0).max(600),
  hollowHoldSec: z.union([z.number().min(0).max(300), z.literal("unfamiliar")]),
  wallHandstandHoldSec: z.union([z.number().min(0).max(300), z.literal("cannot_do"), z.literal("never_tried")]),
});

// Complete Assessment Schema
export const completeAssessmentSchema = z.object({
  basicInfo: basicInfoSchema,
  availability: availabilitySchema,
  equipment: equipmentSchema,
  goals: goalsSchema,
  injuryScreen: injuryScreenSchema,
  baseline: baselineSchema,
});

export type BasicInfoInput = z.infer<typeof basicInfoSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type EquipmentInput = z.infer<typeof equipmentSchema>;
export type GoalsInput = z.infer<typeof goalsSchema>;
export type InjuryScreenInput = z.infer<typeof injuryScreenSchema>;
export type BaselineInput = z.infer<typeof baselineSchema>;
export type CompleteAssessmentInput = z.infer<typeof completeAssessmentSchema>;

