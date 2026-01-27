import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { completeAssessmentSchema } from "@/domain/assessment/profileSchema";
import { computeFitnessLevel, getAgeAdjustments } from "@/domain/assessment/computeFitnessLevel";
import { computeAvoidTags } from "@/domain/assessment/injuryMapping";
import type { Baseline } from "@/types/assessment";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate the assessment data
    const validationResult = completeAssessmentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid assessment data", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { basicInfo, availability, equipment, goals, injuryScreen, baseline } = validationResult.data;

    // Compute fitness level
    const fitnessResult = computeFitnessLevel(baseline as Baseline);
    
    // Compute avoid tags from pain areas
    const avoidTags = computeAvoidTags(injuryScreen.painAreas);
    
    // Get age adjustments
    const ageAdjustments = getAgeAdjustments(basicInfo.age);
    
    // Combine flags
    const flags = [...ageAdjustments.flags];

    // Deactivate any existing active profiles
    await prisma.trainingProfile.updateMany({
      where: { userId: session.user.id, isActive: true },
      data: { isActive: false },
    });

    // Get the next version number
    const lastProfile = await prisma.trainingProfile.findFirst({
      where: { userId: session.user.id },
      orderBy: { version: "desc" },
    });
    const nextVersion = (lastProfile?.version || 0) + 1;

    // Create the training profile
    const profile = await prisma.trainingProfile.create({
      data: {
        userId: session.user.id,
        version: nextVersion,
        isActive: true,
        
        // Basic Info
        age: basicInfo.age,
        biologicalSex: basicInfo.biologicalSex,
        heightCm: basicInfo.heightCm,
        weightKg: basicInfo.weightKg,
        trainingAge: basicInfo.trainingAge,
        
        // Availability
        daysPerWeek: availability.daysPerWeek,
        sessionDurationMin: availability.sessionDurationMin,
        preferredTime: availability.preferredTime,
        trainingLocation: availability.trainingLocation,
        
        // Equipment
        equipment: JSON.stringify(equipment),
        
        // Goals
        goalPrimary: goals.primary,
        goalSecondary: goals.secondary,
        goalTertiary: goals.tertiary,
        
        // Injury Screen
        hasCurrentPain: injuryScreen.hasCurrentPain,
        painAreas: JSON.stringify(injuryScreen.painAreas),
        painSeverity: injuryScreen.painSeverity,
        avoidTags: JSON.stringify(avoidTags),
        
        // Baseline
        maxPushups: String(baseline.maxPushups),
        maxPullups: String(baseline.maxPullups),
        maxDips: String(baseline.maxDips),
        plankHoldSec: typeof baseline.plankHoldSec === "number" ? baseline.plankHoldSec : null,
        hollowHoldSec: String(baseline.hollowHoldSec),
        wallHandstandHoldSec: String(baseline.wallHandstandHoldSec),
        
        // Computed
        fitnessLevel: fitnessResult.level,
        flags: JSON.stringify(flags),
      },
    });

    // Create equipment entries for normalized table
    const equipmentEntries = Object.entries(equipment)
      .filter(([, value]) => value === true)
      .map(([key]) => key);

    for (const equip of equipmentEntries) {
      await prisma.userEquipment.create({
        data: {
          profileId: profile.id,
          equipment: equip,
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        fitnessLevel: fitnessResult.level,
        reasoning: fitnessResult.reasoning,
        avoidTags,
        flags,
      },
    });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.trainingProfile.findFirst({
      where: { userId: session.user.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (!profile) {
      return NextResponse.json({ hasProfile: false });
    }

    return NextResponse.json({
      hasProfile: true,
      profile: {
        id: profile.id,
        version: profile.version,
        fitnessLevel: profile.fitnessLevel,
        goalPrimary: profile.goalPrimary,
        daysPerWeek: profile.daysPerWeek,
        sessionDurationMin: profile.sessionDurationMin,
        createdAt: profile.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}

