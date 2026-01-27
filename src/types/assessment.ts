/**
 * Assessment and Training Profile Types
 * 
 * IMPORTANT: avoidTags is NOT stored directly. It is computed server-side
 * from painAreas using the centralized injury mapping.
 */

// ==================== ENUMS & BASIC TYPES ====================

export type BiologicalSex = "male" | "female" | "prefer_not_to_say";
export type TrainingAge = "none" | "0-6mo" | "6mo-2yr" | "2-5yr" | "5yr+";
export type PreferredTime = "morning" | "afternoon" | "evening" | "flexible";
export type TrainingLocation = "home" | "park" | "gym" | "mixed";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type IntensityPreference = "chill" | "normal" | "intense";
export type SleepQuality = "poor" | "ok" | "good";
export type SorenessTolerance = "low" | "medium" | "high";

export type GoalType =
  | "build_muscle"
  | "lose_fat"
  | "first_pullup"
  | "muscle_up"
  | "handstand"
  | "front_lever"
  | "planche"
  | "general_fitness"
  | "mobility"
  | "endurance"
  | "flexibility";

export type PainArea =
  | "shoulder"
  | "elbow"
  | "wrist"
  | "lower_back"
  | "knee"
  | "ankle"
  | "neck";

// ==================== STEP DATA INTERFACES ====================

export interface BasicInfo {
  name?: string; // Optional for guest
  age: number;
  biologicalSex: BiologicalSex;
  heightCm: number;
  weightKg: number;
}

export interface TrainingBackground {
  trainingAge: TrainingAge;
  selfRating?: FitnessLevel; // Optional hint, not used for computation
}

export interface Availability {
  daysPerWeek: 2 | 3 | 4 | 5 | 6;
  sessionDurationMin: 20 | 30 | 45 | 60 | 90;
  preferredTime: PreferredTime;
}

export interface Location {
  trainingLocation: TrainingLocation;
}

export interface Equipment {
  pullUpBar: boolean;
  dipStation: boolean;
  parallelBars: boolean;
  rings: boolean;
  resistanceBands: boolean;
  weightedVest: boolean;
  parallettes: boolean;
  none: boolean;
}

/**
 * Goals with ranking - user selects up to 3 goals in priority order
 */
export interface Goals {
  rankedGoals: GoalType[]; // Ordered array, max 3. First = primary
  intensityPreference: IntensityPreference;
}

/**
 * Injury screening - stores painAreas, NOT avoidTags
 * avoidTags is computed server-side from painAreas
 */
export interface InjuryScreen {
  hasCurrentPain: boolean;
  painAreas: PainArea[]; // STORE THIS - avoidTags computed from this
  painSeverity?: number; // 1-10 scale
  diagnosed?: boolean;
  diagnosisDetails?: string;
}

export interface Baseline {
  maxPushups: number | "cannot_do";
  maxPullups: number | "cannot_do" | "no_bar";
  maxDips: number | "cannot_do" | "no_station";
  plankHoldSec: number;
  hollowHoldSec: number | "unfamiliar";
  wallHandstandHoldSec: number | "cannot_do" | "never_tried";
}

/**
 * Recovery preferences for plan optimization
 */
export interface RecoveryPrefs {
  sleepQuality: SleepQuality;
  sorenessTolerance: SorenessTolerance;
}

/**
 * Safety confirmations - must be checked before plan generation
 */
export interface SafetyConfirmations {
  educational: boolean; // Understands this is educational, not medical advice
  consultProfessional: boolean; // Will consult professional if needed
  stopOnPain: boolean; // Will stop if sharp pain
  parentalGuidance?: boolean; // For minors under 18
}

// ==================== COMPUTED TYPES ====================

export interface FitnessComputation {
  level: FitnessLevel;
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

// ==================== ASSESSMENT FORM STATE ====================

/**
 * Guest Assessment Form State
 * Used for the multi-step wizard, stored in client state
 * Does NOT include avoidTags - that's computed server-side
 */
export interface GuestAssessmentState {
  // Step data
  basicInfo: Partial<BasicInfo>;
  trainingBackground: Partial<TrainingBackground>;
  availability: Partial<Availability>;
  location: Partial<Location>;
  equipment: Partial<Equipment>;
  goals: Partial<Goals>;
  injuryScreen: Partial<InjuryScreen>;
  baseline: Partial<Baseline>;
  recoveryPrefs: Partial<RecoveryPrefs>;
  safetyConfirmations: Partial<SafetyConfirmations>;
}

/**
 * Complete assessment data ready for API submission
 */
export interface AssessmentSubmission {
  basicInfo: BasicInfo;
  trainingBackground: TrainingBackground;
  availability: Availability;
  location: Location;
  equipment: Equipment;
  goals: Goals;
  injuryScreen: InjuryScreen;
  baseline: Baseline;
  recoveryPrefs: RecoveryPrefs;
}

// ==================== LEGACY SUPPORT ====================

/**
 * @deprecated Use GuestAssessmentState instead
 * Kept for backwards compatibility with existing components
 */
export interface AssessmentFormState {
  currentStep?: number;
  basicInfo: Partial<BasicInfo & { trainingAge?: TrainingAge }>;
  availability: Partial<Availability & { trainingLocation?: TrainingLocation }>;
  equipment: Partial<Equipment>;
  goals: Partial<Goals & { primary?: GoalType; secondary?: GoalType; tertiary?: GoalType }>;
  injuryScreen: Partial<InjuryScreen>;
  baseline: Partial<Baseline>;
}

/**
 * Full Training Profile (for authenticated users, stored in DB)
 * Note: avoidTags is computed, not directly stored from user input
 */
export interface TrainingProfile {
  id: string;
  userId: string;
  version: number;
  createdAt: Date;
  isActive: boolean;
  
  // User-provided data
  basicInfo: BasicInfo;
  trainingBackground: TrainingBackground;
  availability: Availability;
  location: Location;
  equipment: Equipment;
  goals: Goals;
  injuryScreen: InjuryScreen; // Contains painAreas
  baseline: Baseline;
  recoveryPrefs: RecoveryPrefs;
  
  // Computed values (server-side)
  fitness: FitnessComputation;
  avoidTags: string[]; // COMPUTED from painAreas, never user-provided
  flags: string[];
}

// ==================== API TYPES ====================

/**
 * Request body for guest plan generation
 * Does NOT include avoidTags - computed server-side
 */
export interface GuestPlanGenerationRequest {
  assessment: AssessmentSubmission;
}

/**
 * Response from guest plan generation
 */
export interface GuestPlanGenerationResponse {
  plan: GeneratedPlan;
  fitness: FitnessComputation;
  source: "ai" | "template" | "ai_enhanced_template";
  savedToAccount: false;
}

/**
 * Simplified plan structure for type reference
 * Full plan type is in types/plan.ts
 */
export interface GeneratedPlan {
  id?: string; // Only present if saved
  weeklyStructure: DayPlan[];
  metadata: PlanMetadata;
}

export interface DayPlan {
  dayNumber: number;
  dayType: "push" | "pull" | "full_body" | "skill" | "legs" | "upper" | "rest";
  totalDurationMin: number;
  blocks: ExerciseBlock[];
}

export interface ExerciseBlock {
  blockType: "warmup" | "skill" | "strength" | "conditioning" | "cooldown";
  durationMin: number;
  exercises: PlannedExercise[];
}

export interface PlannedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  restSec: number;
  tempo?: string;
  intensity: { type: "rir" | "rpe"; value: number };
  notes?: string;
  tags?: string[];
  progression?: { rule: string; nextExercise: string };
  regression?: { exerciseId: string; reason: string };
}

export interface PlanMetadata {
  totalWeeklyVolume: number;
  pushPullRatio: number;
  skillFocus: string[];
  avoidedMovements: string[];
  estimatedSessionDuration: number;
  generatedAt?: string;
  planVersion?: string;
}

// ==================== GOAL DISPLAY INFO ====================

export const GOAL_INFO: Record<GoalType, { label: string; icon: string; description: string }> = {
  build_muscle: {
    label: "Build Muscle",
    icon: "💪",
    description: "Hypertrophy-focused training for muscle growth",
  },
  lose_fat: {
    label: "Lose Fat",
    icon: "🔥",
    description: "Higher volume, conditioning-focused for fat loss",
  },
  first_pullup: {
    label: "First Pull-up",
    icon: "🎯",
    description: "Progressive training to achieve your first pull-up",
  },
  muscle_up: {
    label: "Muscle-up",
    icon: "⬆️",
    description: "Advanced pulling and transition strength",
  },
  handstand: {
    label: "Handstand",
    icon: "🤸",
    description: "Balance, core, and overhead pressing strength",
  },
  front_lever: {
    label: "Front Lever",
    icon: "➡️",
    description: "Straight-arm pulling strength and core",
  },
  planche: {
    label: "Planche",
    icon: "🏋️",
    description: "Extreme pushing strength and body control",
  },
  general_fitness: {
    label: "General Fitness",
    icon: "⚡",
    description: "Balanced strength and conditioning",
  },
  mobility: {
    label: "Mobility",
    icon: "🧘",
    description: "Flexibility and joint health focus",
  },
  endurance: {
    label: "Endurance",
    icon: "🏃",
    description: "Muscular endurance and work capacity",
  },
  flexibility: {
    label: "Flexibility",
    icon: "🌀",
    description: "Stretching and range of motion",
  },
};

// ==================== EQUIPMENT DISPLAY INFO ====================

export const EQUIPMENT_INFO: Record<keyof Equipment, { label: string; icon: string }> = {
  pullUpBar: { label: "Pull-up Bar", icon: "🏗️" },
  dipStation: { label: "Dip Station", icon: "⬇️" },
  parallelBars: { label: "Parallel Bars", icon: "║" },
  rings: { label: "Gymnastic Rings", icon: "⭕" },
  resistanceBands: { label: "Resistance Bands", icon: "〰️" },
  weightedVest: { label: "Weighted Vest", icon: "🦺" },
  parallettes: { label: "Parallettes", icon: "═" },
  none: { label: "No Equipment", icon: "🚫" },
};
