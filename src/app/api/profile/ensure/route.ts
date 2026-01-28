import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has an active profile
    const existingProfile = await prisma.trainingProfile.findFirst({
      where: { userId: session.user.id, isActive: true },
    });

    if (existingProfile) {
      return NextResponse.json({ 
        success: true, 
        profileId: existingProfile.id,
        source: "existing" 
      });
    }

    // Create a default beginner profile
    const profile = await prisma.trainingProfile.create({
      data: {
        userId: session.user.id,
        version: 1,
        isActive: true,
        
        // Default beginner values
        age: 25,
        biologicalSex: "male",
        heightCm: 175,
        weightKg: 70,
        trainingAge: "beginner",
        
        // Default availability
        daysPerWeek: 3,
        sessionDurationMin: 45,
        preferredTime: "morning",
        trainingLocation: "home",
        
        // Minimal equipment (bodyweight only)
        equipment: JSON.stringify({
          pull_up_bar: false,
          dip_station: false,
          rings: false,
          parallettes: false,
          resistance_bands: false,
        }),
        
        // Default goals
        goalPrimary: "general_fitness",
        goalSecondary: null,
        goalTertiary: null,
        
        // No injuries
        hasCurrentPain: false,
        painAreas: "[]",
        painSeverity: null,
        avoidTags: "[]",
        
        // Beginner baseline
        maxPushups: "5",
        maxPullups: "0",
        maxDips: "0",
        plankHoldSec: 30,
        hollowHoldSec: "10",
        wallHandstandHoldSec: "0",
        
        // Computed
        fitnessLevel: "beginner",
        flags: "[]",
      },
    });

    return NextResponse.json({ 
      success: true, 
      profileId: profile.id,
      source: "created" 
    });
  } catch (error) {
    console.error("Ensure profile error:", error);
    return NextResponse.json(
      { error: "Failed to ensure profile" },
      { status: 500 }
    );
  }
}

