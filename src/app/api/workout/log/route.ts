import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface SetLog {
  setNumber: number;
  reps: number | null;
  completed: boolean;
  notes?: string;
}

interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

interface LogRequest {
  dayId: string;
  logs: ExerciseLog[];
  completedAt: string;
  duration: number;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: LogRequest = await req.json();
    const { dayId, logs, completedAt, duration } = body;

    // Verify the workout day belongs to user
    const workoutDay = await prisma.workoutDay.findFirst({
      where: {
        id: dayId,
        plan: {
          userId: session.user.id,
        },
      },
    });

    if (!workoutDay) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    // Create workout log
    const workoutLog = await prisma.workoutLog.create({
      data: {
        userId: session.user.id,
        dayId,
        completedAt: new Date(completedAt),
        durationMin: duration,
        notes: null,
      },
    });

    // Create exercise logs
    for (const exerciseLog of logs) {
      const completedSets = exerciseLog.sets.filter((s) => s.completed);
      const totalReps = completedSets.reduce((sum, s) => sum + (s.reps || 0), 0);

      await prisma.exerciseLog.create({
        data: {
          workoutLogId: workoutLog.id,
          exerciseId: exerciseLog.exerciseId,
          setsCompleted: completedSets.length,
          repsData: JSON.stringify(exerciseLog.sets),
          totalReps,
        },
      });

      // Update personal records
      const maxReps = Math.max(...completedSets.map((s) => s.reps || 0));
      
      const existingPR = await prisma.personalRecord.findFirst({
        where: {
          userId: session.user.id,
          exerciseId: exerciseLog.exerciseId,
          recordType: "max_reps",
        },
      });

      if (!existingPR || maxReps > (existingPR.value || 0)) {
        await prisma.personalRecord.upsert({
          where: {
            id: existingPR?.id || "",
          },
          update: {
            value: maxReps,
            achievedAt: new Date(completedAt),
          },
          create: {
            userId: session.user.id,
            exerciseId: exerciseLog.exerciseId,
            recordType: "max_reps",
            value: maxReps,
            achievedAt: new Date(completedAt),
          },
        });
      }
    }

    // Update user stats
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalWorkouts: { increment: 1 },
        lastWorkoutAt: new Date(completedAt),
      },
    });

    return NextResponse.json({
      success: true,
      workoutLogId: workoutLog.id,
    });
  } catch (error) {
    console.error("Log workout error:", error);
    return NextResponse.json(
      { error: "Failed to log workout" },
      { status: 500 }
    );
  }
}

// Get workout history
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const logs = await prisma.workoutLog.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: limit,
      include: {
        day: {
          select: {
            dayType: true,
            dayNumber: true,
          },
        },
        exerciseLogs: true,
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Get workout logs error:", error);
    return NextResponse.json(
      { error: "Failed to get workout logs" },
      { status: 500 }
    );
  }
}

