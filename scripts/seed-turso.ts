import { createClient } from "@libsql/client";
import { v4 as uuidv4 } from "uuid";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || !DATABASE_URL.startsWith("libsql://")) {
  console.error("❌ DATABASE_URL must be set and start with libsql://");
  process.exit(1);
}

const client = createClient({ url: DATABASE_URL });

interface ExerciseData {
  name: string;
  slug: string;
  description: string;
  movementPattern: string;
  plane: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  difficulty: string;
  difficultyScore: number;
  equipmentNeeded: string[];
  prerequisites: string[];
  contraindications: string[];
  tags: string[];
  progressionOf?: string;
  regressionOf?: string;
  formCues: string[];
  commonMistakes: string[];
}

const exercises: ExerciseData[] = [
  // PUSH EXERCISES
  {
    name: "Wall Push-Up",
    slug: "wall-push-up",
    description: "A beginner-friendly push-up variation performed against a wall, great for building initial pushing strength.",
    movementPattern: "push",
    plane: "horizontal",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["anterior_deltoid", "core"],
    difficulty: "beginner",
    difficultyScore: 1,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["push", "horizontal", "beginner_friendly"],
    regressionOf: "incline-push-up",
    formCues: ["Keep body straight", "Elbows at 45 degrees", "Full range of motion"],
    commonMistakes: ["Flaring elbows too wide", "Not going deep enough"],
  },
  {
    name: "Incline Push-Up",
    slug: "incline-push-up",
    description: "Push-up performed with hands elevated on a surface, reducing the load compared to floor push-ups.",
    movementPattern: "push",
    plane: "horizontal",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["anterior_deltoid", "core"],
    difficulty: "beginner",
    difficultyScore: 2,
    equipmentNeeded: [],
    prerequisites: ["10 wall push-ups"],
    contraindications: [],
    tags: ["push", "horizontal"],
    progressionOf: "wall-push-up",
    regressionOf: "push-up",
    formCues: ["Body forms straight line", "Lower chest to surface", "Push through palms"],
    commonMistakes: ["Sagging hips", "Looking up instead of neutral neck"],
  },
  {
    name: "Push-Up",
    slug: "push-up",
    description: "The fundamental pushing exercise. Builds chest, triceps, and core strength.",
    movementPattern: "push",
    plane: "horizontal",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["anterior_deltoid", "core"],
    difficulty: "beginner",
    difficultyScore: 3,
    equipmentNeeded: [],
    prerequisites: ["10 incline push-ups"],
    contraindications: [],
    tags: ["push", "horizontal"],
    progressionOf: "incline-push-up",
    regressionOf: "diamond-push-up",
    formCues: ["Hands shoulder-width apart", "Core tight throughout", "Chest touches floor"],
    commonMistakes: ["Flaring elbows 90 degrees", "Incomplete range of motion", "Sagging lower back"],
  },
  {
    name: "Diamond Push-Up",
    slug: "diamond-push-up",
    description: "Push-up with hands close together forming a diamond shape, emphasizing triceps.",
    movementPattern: "push",
    plane: "horizontal",
    primaryMuscles: ["triceps", "chest"],
    secondaryMuscles: ["anterior_deltoid", "core"],
    difficulty: "intermediate",
    difficultyScore: 4,
    equipmentNeeded: [],
    prerequisites: ["20 push-ups"],
    contraindications: ["elbow"],
    tags: ["push", "horizontal", "close_grip_pushup"],
    progressionOf: "push-up",
    formCues: ["Thumbs and index fingers touch", "Elbows track close to body", "Lower chest to hands"],
    commonMistakes: ["Hands too far forward", "Elbows flaring out"],
  },
  {
    name: "Pike Push-Up",
    slug: "pike-push-up",
    description: "Push-up in pike position targeting shoulders, a progression toward handstand push-up.",
    movementPattern: "push",
    plane: "vertical",
    primaryMuscles: ["shoulders", "triceps"],
    secondaryMuscles: ["chest", "core"],
    difficulty: "intermediate",
    difficultyScore: 5,
    equipmentNeeded: [],
    prerequisites: ["20 push-ups"],
    contraindications: ["shoulder"],
    tags: ["push", "vertical", "overhead_pressing"],
    regressionOf: "handstand-push-up",
    formCues: ["Hips high, forming inverted V", "Head moves forward past hands", "Lock out at top"],
    commonMistakes: ["Not enough hip elevation", "Rushing the movement"],
  },
  {
    name: "Dips",
    slug: "dips",
    description: "Classic compound pushing exercise targeting chest and triceps.",
    movementPattern: "push",
    plane: "vertical",
    primaryMuscles: ["chest", "triceps"],
    secondaryMuscles: ["anterior_deltoid"],
    difficulty: "intermediate",
    difficultyScore: 5,
    equipmentNeeded: ["dip_station"],
    prerequisites: ["20 push-ups"],
    contraindications: ["shoulder", "elbow"],
    tags: ["push", "vertical", "dips"],
    formCues: ["Lean forward slightly for chest", "Lower until upper arms parallel", "Lock out at top"],
    commonMistakes: ["Going too deep too soon", "Flaring elbows", "Shrugging shoulders"],
  },
  // PULL EXERCISES
  {
    name: "Dead Hang",
    slug: "dead-hang",
    description: "Hanging from a bar with straight arms. Builds grip and shoulder mobility.",
    movementPattern: "pull",
    plane: "vertical",
    primaryMuscles: ["forearms", "lats"],
    secondaryMuscles: ["shoulders"],
    difficulty: "beginner",
    difficultyScore: 1,
    equipmentNeeded: ["pull_up_bar"],
    prerequisites: [],
    contraindications: [],
    tags: ["pull", "grip", "mobility"],
    formCues: ["Relax shoulders initially", "Grip firmly", "Breathe steadily"],
    commonMistakes: ["Gripping too loosely", "Holding breath"],
  },
  {
    name: "Australian Pull-Up",
    slug: "australian-pull-up",
    description: "Horizontal pulling exercise with feet on ground. Also known as inverted row.",
    movementPattern: "pull",
    plane: "horizontal",
    primaryMuscles: ["back", "biceps"],
    secondaryMuscles: ["rear_deltoid", "core"],
    difficulty: "beginner",
    difficultyScore: 3,
    equipmentNeeded: ["pull_up_bar"],
    prerequisites: [],
    contraindications: [],
    tags: ["pull", "horizontal", "rows"],
    regressionOf: "pull-up",
    formCues: ["Body straight from head to heels", "Pull chest to bar", "Squeeze shoulder blades"],
    commonMistakes: ["Hips sagging", "Not full range of motion"],
  },
  {
    name: "Pull-Up",
    slug: "pull-up",
    description: "The fundamental vertical pulling exercise. Pronated grip (palms facing away).",
    movementPattern: "pull",
    plane: "vertical",
    primaryMuscles: ["lats", "biceps"],
    secondaryMuscles: ["back", "forearms", "core"],
    difficulty: "intermediate",
    difficultyScore: 5,
    equipmentNeeded: ["pull_up_bar"],
    prerequisites: ["5 negative pull-ups"],
    contraindications: [],
    tags: ["pull", "vertical"],
    formCues: ["Pull elbows to hips", "Chin over bar", "Full lockout at bottom"],
    commonMistakes: ["Kipping", "Half reps", "Excessive swinging"],
  },
  {
    name: "Chin-Up",
    slug: "chin-up",
    description: "Pull-up with supinated grip (palms facing you). More bicep emphasis.",
    movementPattern: "pull",
    plane: "vertical",
    primaryMuscles: ["biceps", "lats"],
    secondaryMuscles: ["back", "forearms"],
    difficulty: "intermediate",
    difficultyScore: 4,
    equipmentNeeded: ["pull_up_bar"],
    prerequisites: ["3 pull-ups"],
    contraindications: [],
    tags: ["pull", "vertical"],
    formCues: ["Supinated grip shoulder-width", "Pull chest to bar", "Control the negative"],
    commonMistakes: ["Partial range of motion", "Using momentum"],
  },
  // CORE EXERCISES
  {
    name: "Plank",
    slug: "plank",
    description: "Fundamental isometric core exercise. Foundation for all calisthenics.",
    movementPattern: "core",
    plane: "sagittal",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "glutes"],
    difficulty: "beginner",
    difficultyScore: 2,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["core", "isometric"],
    formCues: ["Body straight from head to heels", "Squeeze glutes", "Don't let hips sag or pike"],
    commonMistakes: ["Hips too high", "Hips sagging", "Looking up"],
  },
  {
    name: "Hollow Body Hold",
    slug: "hollow-body-hold",
    description: "Gymnastic foundation position. Critical for many advanced skills.",
    movementPattern: "core",
    plane: "sagittal",
    primaryMuscles: ["core", "hip_flexors"],
    secondaryMuscles: ["quads"],
    difficulty: "beginner",
    difficultyScore: 3,
    equipmentNeeded: [],
    prerequisites: ["30s plank"],
    contraindications: ["lower_back"],
    tags: ["core", "isometric", "gymnastic"],
    formCues: ["Lower back pressed to floor", "Arms and legs extended", "Chin tucked"],
    commonMistakes: ["Lower back arching off floor", "Holding breath"],
  },
  {
    name: "L-Sit",
    slug: "l-sit",
    description: "Isometric hold with legs extended parallel to ground. Impressive core strength.",
    movementPattern: "core",
    plane: "sagittal",
    primaryMuscles: ["core", "hip_flexors"],
    secondaryMuscles: ["triceps", "quads"],
    difficulty: "intermediate",
    difficultyScore: 6,
    equipmentNeeded: [],
    prerequisites: ["30s hollow body hold"],
    contraindications: ["lower_back"],
    tags: ["core", "isometric", "l_sit_progression"],
    formCues: ["Press shoulders down", "Keep legs straight and together", "Point toes"],
    commonMistakes: ["Bending knees", "Rounding lower back"],
  },
  {
    name: "Hanging Leg Raise",
    slug: "hanging-leg-raise",
    description: "Advanced hanging core exercise with straight legs.",
    movementPattern: "core",
    plane: "sagittal",
    primaryMuscles: ["core", "hip_flexors"],
    secondaryMuscles: ["forearms", "lats"],
    difficulty: "intermediate",
    difficultyScore: 5,
    equipmentNeeded: ["pull_up_bar"],
    prerequisites: ["15 hanging knee raises"],
    contraindications: ["lower_back"],
    tags: ["core", "dynamic", "hanging", "hanging_leg_raises"],
    formCues: ["Keep legs straight", "Lift legs to bar if possible", "Control the descent"],
    commonMistakes: ["Bending knees", "Swinging"],
  },
  // LEG EXERCISES
  {
    name: "Bodyweight Squat",
    slug: "bodyweight-squat",
    description: "Fundamental lower body exercise. Foundation for all leg training.",
    movementPattern: "squat",
    plane: "sagittal",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    difficulty: "beginner",
    difficultyScore: 2,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["legs", "squat"],
    formCues: ["Feet shoulder-width apart", "Knees track over toes", "Break parallel"],
    commonMistakes: ["Knees caving in", "Heels rising", "Not going deep enough"],
  },
  {
    name: "Bulgarian Split Squat",
    slug: "bulgarian-split-squat",
    description: "Single-leg squat with rear foot elevated. Great for leg strength and balance.",
    movementPattern: "squat",
    plane: "sagittal",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    difficulty: "intermediate",
    difficultyScore: 4,
    equipmentNeeded: [],
    prerequisites: ["20 bodyweight squats"],
    contraindications: ["knee"],
    tags: ["legs", "squat", "unilateral", "lunges"],
    formCues: ["Front shin vertical", "Back knee drops straight down", "Torso upright"],
    commonMistakes: ["Front knee tracking too far forward", "Leaning forward excessively"],
  },
  {
    name: "Pistol Squat",
    slug: "pistol-squat",
    description: "Single-leg squat with non-working leg extended forward. Advanced leg exercise.",
    movementPattern: "squat",
    plane: "sagittal",
    primaryMuscles: ["quads", "glutes"],
    secondaryMuscles: ["hamstrings", "core", "hip_flexors"],
    difficulty: "advanced",
    difficultyScore: 7,
    equipmentNeeded: [],
    prerequisites: ["30 bodyweight squats"],
    contraindications: ["knee", "ankle"],
    tags: ["legs", "squat", "unilateral", "pistol_squat", "single_leg_squat"],
    formCues: ["Keep free leg straight and forward", "Arms for counterbalance", "Full depth"],
    commonMistakes: ["Falling backward", "Knee caving in", "Not reaching full depth"],
  },
  {
    name: "Glute Bridge",
    slug: "glute-bridge",
    description: "Hip extension exercise targeting glutes. Foundation for hip hinge patterns.",
    movementPattern: "hinge",
    plane: "sagittal",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    difficulty: "beginner",
    difficultyScore: 1,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["legs", "hinge", "glutes"],
    formCues: ["Drive through heels", "Squeeze glutes at top", "Don't hyperextend lower back"],
    commonMistakes: ["Overarching lower back", "Not squeezing glutes"],
  },
  {
    name: "Calf Raise",
    slug: "calf-raise",
    description: "Standing calf exercise for lower leg development.",
    movementPattern: "squat",
    plane: "sagittal",
    primaryMuscles: ["calves"],
    secondaryMuscles: [],
    difficulty: "beginner",
    difficultyScore: 1,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["legs", "calves"],
    formCues: ["Full range of motion", "Pause at top", "Control the negative"],
    commonMistakes: ["Bouncing", "Partial range of motion"],
  },
  // WARMUP/MOBILITY
  {
    name: "Arm Circles",
    slug: "arm-circles",
    description: "Dynamic shoulder warm-up moving arms in circles.",
    movementPattern: "rotation",
    plane: "transverse",
    primaryMuscles: ["shoulders"],
    secondaryMuscles: [],
    difficulty: "beginner",
    difficultyScore: 1,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["warmup", "mobility", "shoulders"],
    formCues: ["Start small, gradually increase", "Keep arms straight", "Both directions"],
    commonMistakes: ["Moving too fast", "Not full range"],
  },
  {
    name: "Cat-Cow Stretch",
    slug: "cat-cow",
    description: "Spinal mobility exercise alternating between flexion and extension.",
    movementPattern: "core",
    plane: "sagittal",
    primaryMuscles: ["core", "back"],
    secondaryMuscles: [],
    difficulty: "beginner",
    difficultyScore: 1,
    equipmentNeeded: [],
    prerequisites: [],
    contraindications: [],
    tags: ["warmup", "mobility", "spine"],
    formCues: ["Move slowly and controlled", "Breathe with movement", "Full range of motion"],
    commonMistakes: ["Moving too fast", "Not coordinating breath"],
  },
];

async function main() {
  console.log("🌱 Starting seed to Turso...\n");

  // First, check what exercises exist
  const existingCount = await client.execute("SELECT COUNT(*) as count FROM ExerciseLibrary");
  console.log(`📊 Existing exercises: ${existingCount.rows[0]?.count || 0}`);

  // Clear existing data
  console.log("🧹 Clearing existing exercise data...");
  await client.batch([
    "DELETE FROM ExerciseTag",
    "DELETE FROM ExerciseMuscle", 
    "DELETE FROM ExerciseLibrary"
  ], "write");

  console.log(`\n📝 Seeding ${exercises.length} exercises...\n`);

  for (const exercise of exercises) {
    const id = uuidv4().replace(/-/g, "").slice(0, 25);
    
    // Insert exercise
    await client.execute({
      sql: `INSERT INTO ExerciseLibrary (
        id, name, slug, description, movementPattern, plane,
        primaryMuscles, secondaryMuscles, difficulty, difficultyScore,
        equipmentNeeded, prerequisites, contraindications, progressionOf,
        regressionOf, formCues, commonMistakes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        exercise.name,
        exercise.slug,
        exercise.description,
        exercise.movementPattern,
        exercise.plane,
        JSON.stringify(exercise.primaryMuscles),
        JSON.stringify(exercise.secondaryMuscles),
        exercise.difficulty,
        exercise.difficultyScore,
        JSON.stringify(exercise.equipmentNeeded),
        JSON.stringify(exercise.prerequisites),
        JSON.stringify(exercise.contraindications),
        exercise.progressionOf || null,
        exercise.regressionOf || null,
        JSON.stringify(exercise.formCues),
        JSON.stringify(exercise.commonMistakes),
      ],
    });

    // Insert tags
    for (const tag of exercise.tags) {
      const tagId = uuidv4().replace(/-/g, "").slice(0, 25);
      await client.execute({
        sql: "INSERT INTO ExerciseTag (id, exerciseId, tag) VALUES (?, ?, ?)",
        args: [tagId, id, tag],
      });
    }

    // Insert primary muscles
    for (const muscle of exercise.primaryMuscles) {
      const muscleId = uuidv4().replace(/-/g, "").slice(0, 25);
      await client.execute({
        sql: "INSERT INTO ExerciseMuscle (id, exerciseId, muscle, isPrimary) VALUES (?, ?, ?, ?)",
        args: [muscleId, id, muscle, true],
      });
    }

    // Insert secondary muscles
    for (const muscle of exercise.secondaryMuscles) {
      const muscleId = uuidv4().replace(/-/g, "").slice(0, 25);
      await client.execute({
        sql: "INSERT INTO ExerciseMuscle (id, exerciseId, muscle, isPrimary) VALUES (?, ?, ?, ?)",
        args: [muscleId, id, muscle, false],
      });
    }

    console.log(`  ✅ ${exercise.name}`);
  }

  // Verify
  const finalCount = await client.execute("SELECT COUNT(*) as count FROM ExerciseLibrary");
  console.log(`\n🎉 Seed complete! Total exercises: ${finalCount.rows[0]?.count}`);
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});

