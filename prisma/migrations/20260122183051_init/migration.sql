-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TrainingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "age" INTEGER NOT NULL,
    "biologicalSex" TEXT NOT NULL,
    "heightCm" REAL NOT NULL,
    "weightKg" REAL NOT NULL,
    "trainingAge" TEXT NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "sessionDurationMin" INTEGER NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "trainingLocation" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "goalPrimary" TEXT NOT NULL,
    "goalSecondary" TEXT,
    "goalTertiary" TEXT,
    "hasCurrentPain" BOOLEAN NOT NULL DEFAULT false,
    "painAreas" TEXT NOT NULL DEFAULT '[]',
    "painSeverity" INTEGER,
    "avoidTags" TEXT NOT NULL DEFAULT '[]',
    "maxPushups" TEXT,
    "maxPullups" TEXT,
    "maxDips" TEXT,
    "plankHoldSec" INTEGER,
    "hollowHoldSec" TEXT,
    "wallHandstandHoldSec" TEXT,
    "fitnessLevel" TEXT NOT NULL,
    "flags" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "TrainingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserEquipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    CONSTRAINT "UserEquipment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TrainingProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "profileVersion" INTEGER NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalWeeklyVolume" INTEGER NOT NULL,
    "pushPullRatio" REAL NOT NULL,
    "skillFocus" TEXT NOT NULL DEFAULT '[]',
    "avoidedMovements" TEXT NOT NULL DEFAULT '[]',
    "generationType" TEXT NOT NULL,
    "templateId" TEXT,
    CONSTRAINT "WorkoutPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutPlan_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "TrainingProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkoutDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "dayType" TEXT NOT NULL,
    "totalDurationMin" INTEGER NOT NULL,
    CONSTRAINT "WorkoutDay_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayId" TEXT NOT NULL,
    "blockType" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    CONSTRAINT "ExerciseBlock_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "WorkoutDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlannedExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blockId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" TEXT NOT NULL,
    "restSec" INTEGER NOT NULL,
    "tempo" TEXT,
    "intensity" TEXT NOT NULL,
    "notes" TEXT,
    "progressionRule" TEXT,
    "progressionExercise" TEXT,
    "regressionExercise" TEXT,
    "regressionReason" TEXT,
    CONSTRAINT "PlannedExercise_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "ExerciseBlock" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlannedExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseLibrary" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseLibrary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "movementPattern" TEXT NOT NULL,
    "plane" TEXT NOT NULL,
    "primaryMuscles" TEXT NOT NULL,
    "secondaryMuscles" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "difficultyScore" INTEGER NOT NULL,
    "equipmentNeeded" TEXT NOT NULL,
    "prerequisites" TEXT NOT NULL,
    "contraindications" TEXT NOT NULL,
    "progressionOf" TEXT,
    "regressionOf" TEXT,
    "formCues" TEXT NOT NULL,
    "commonMistakes" TEXT NOT NULL,
    "videoUrl" TEXT,
    "imageUrl" TEXT
);

-- CreateTable
CREATE TABLE "ExerciseTag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exerciseId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    CONSTRAINT "ExerciseTag_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseLibrary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExerciseMuscle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exerciseId" TEXT NOT NULL,
    "muscle" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL,
    CONSTRAINT "ExerciseMuscle_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "ExerciseLibrary" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgressLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dayNumber" INTEGER,
    "exerciseId" TEXT,
    "exerciseName" TEXT NOT NULL,
    "setsCompleted" INTEGER NOT NULL,
    "repsAchieved" TEXT NOT NULL,
    "holdTime" INTEGER,
    "rpe" INTEGER,
    "notes" TEXT,
    "bodyweightKg" REAL,
    CONSTRAINT "ProgressLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProgressLog_planId_fkey" FOREIGN KEY ("planId") REFERENCES "WorkoutPlan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paypalSubscriptionId" TEXT NOT NULL,
    "paypalPlanId" TEXT NOT NULL,
    "paypalPayerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "tier" TEXT NOT NULL,
    "currentPeriodStart" DATETIME,
    "currentPeriodEnd" DATETIME,
    "cancelledAt" DATETIME,
    "gracePeriodEnd" DATETIME,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SubscriptionEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paypalEventId" TEXT NOT NULL,
    "paypalEventType" TEXT NOT NULL,
    "eventData" TEXT NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "SubscriptionEvent_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_usage_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "promptTokens" INTEGER NOT NULL,
    "completionTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "estimatedCostUsd" REAL NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "ai_usage_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "contextPlanId" TEXT,
    "contextProfileId" TEXT,
    "tokensUsed" INTEGER,
    "wasFiltered" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanTemplate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fitnessLevel" TEXT NOT NULL,
    "goalType" TEXT NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "structure" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "TrainingProfile_userId_isActive_idx" ON "TrainingProfile"("userId", "isActive");

-- CreateIndex
CREATE INDEX "TrainingProfile_userId_version_idx" ON "TrainingProfile"("userId", "version");

-- CreateIndex
CREATE INDEX "UserEquipment_equipment_idx" ON "UserEquipment"("equipment");

-- CreateIndex
CREATE UNIQUE INDEX "UserEquipment_profileId_equipment_key" ON "UserEquipment"("profileId", "equipment");

-- CreateIndex
CREATE INDEX "WorkoutPlan_userId_isActive_idx" ON "WorkoutPlan"("userId", "isActive");

-- CreateIndex
CREATE INDEX "WorkoutPlan_profileId_idx" ON "WorkoutPlan"("profileId");

-- CreateIndex
CREATE INDEX "WorkoutDay_planId_idx" ON "WorkoutDay"("planId");

-- CreateIndex
CREATE INDEX "ExerciseBlock_dayId_idx" ON "ExerciseBlock"("dayId");

-- CreateIndex
CREATE INDEX "PlannedExercise_blockId_idx" ON "PlannedExercise"("blockId");

-- CreateIndex
CREATE INDEX "PlannedExercise_exerciseId_idx" ON "PlannedExercise"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLibrary_name_key" ON "ExerciseLibrary"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLibrary_slug_key" ON "ExerciseLibrary"("slug");

-- CreateIndex
CREATE INDEX "ExerciseLibrary_movementPattern_idx" ON "ExerciseLibrary"("movementPattern");

-- CreateIndex
CREATE INDEX "ExerciseLibrary_difficulty_idx" ON "ExerciseLibrary"("difficulty");

-- CreateIndex
CREATE INDEX "ExerciseLibrary_slug_idx" ON "ExerciseLibrary"("slug");

-- CreateIndex
CREATE INDEX "ExerciseTag_tag_idx" ON "ExerciseTag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseTag_exerciseId_tag_key" ON "ExerciseTag"("exerciseId", "tag");

-- CreateIndex
CREATE INDEX "ExerciseMuscle_muscle_isPrimary_idx" ON "ExerciseMuscle"("muscle", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseMuscle_exerciseId_muscle_key" ON "ExerciseMuscle"("exerciseId", "muscle");

-- CreateIndex
CREATE INDEX "ProgressLog_userId_createdAt_idx" ON "ProgressLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ProgressLog_userId_exerciseId_idx" ON "ProgressLog"("userId", "exerciseId");

-- CreateIndex
CREATE INDEX "ProgressLog_planId_idx" ON "ProgressLog"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_paypalSubscriptionId_key" ON "Subscription"("paypalSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_paypalSubscriptionId_idx" ON "Subscription"("paypalSubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SubscriptionEvent_paypalEventId_key" ON "SubscriptionEvent"("paypalEventId");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_subscriptionId_idx" ON "SubscriptionEvent"("subscriptionId");

-- CreateIndex
CREATE INDEX "SubscriptionEvent_paypalEventId_idx" ON "SubscriptionEvent"("paypalEventId");

-- CreateIndex
CREATE INDEX "ai_usage_log_userId_date_idx" ON "ai_usage_log"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ai_usage_log_userId_date_endpoint_key" ON "ai_usage_log"("userId", "date", "endpoint");

-- CreateIndex
CREATE INDEX "ChatMessage_userId_createdAt_idx" ON "ChatMessage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PlanTemplate_fitnessLevel_goalType_idx" ON "PlanTemplate"("fitnessLevel", "goalType");
