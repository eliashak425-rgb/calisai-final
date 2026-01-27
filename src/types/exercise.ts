// Exercise Library Types

export type MovementPattern = "push" | "pull" | "squat" | "hinge" | "carry" | "rotation" | "core";
export type Plane = "horizontal" | "vertical" | "sagittal" | "transverse";
export type Difficulty = "beginner" | "intermediate" | "advanced" | "elite";

export type Muscle =
  | "chest"
  | "back"
  | "lats"
  | "shoulders"
  | "anterior_deltoid"
  | "lateral_deltoid"
  | "posterior_deltoid"
  | "biceps"
  | "triceps"
  | "forearms"
  | "core"
  | "obliques"
  | "lower_back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves"
  | "hip_flexors";

export type EquipmentType =
  | "pull_up_bar"
  | "dip_station"
  | "parallel_bars"
  | "rings"
  | "resistance_bands"
  | "weighted_vest"
  | "parallettes"
  | "none";

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  
  // Taxonomy
  movementPattern: MovementPattern;
  plane: Plane;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  
  // Classification
  difficulty: Difficulty;
  difficultyScore: number; // 1-10
  equipmentNeeded: EquipmentType[];
  
  // Safety
  prerequisites: string[];
  contraindications: string[];
  tags: string[];
  
  // Progressions
  progressionOf?: string;
  regressionOf?: string;
  
  // Content
  formCues: string[];
  commonMistakes: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface ExerciseFilter {
  movementPattern?: MovementPattern;
  difficulty?: Difficulty;
  equipment?: EquipmentType[];
  muscle?: Muscle;
  searchQuery?: string;
}

