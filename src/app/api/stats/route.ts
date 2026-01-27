import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get workout history for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalWorkouts,
      recentWorkouts,
      personalRecords,
      profile,
      weeklyLogs,
    ] = await Promise.all([
      // Total workouts count
      prisma.workoutLog.count({
        where: { userId },
      }),

      // Recent workouts (last 7)
      prisma.workoutLog.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 7,
        include: {
          day: { select: { dayType: true } },
          exerciseLogs: true,
        },
      }),

      // Personal records
      prisma.personalRecord.findMany({
        where: { userId },
        orderBy: { achievedAt: "desc" },
        take: 5,
      }),

      // User profile
      prisma.trainingProfile.findFirst({
        where: { userId, isActive: true },
      }),

      // Weekly workout counts for chart
      prisma.workoutLog.groupBy({
        by: ["completedAt"],
        where: {
          userId,
          completedAt: { gte: thirtyDaysAgo },
        },
        _count: true,
      }),
    ]);

    // Calculate streak
    let currentStreak = 0;
    const sortedWorkouts = recentWorkouts.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    if (sortedWorkouts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < sortedWorkouts.length; i++) {
        const workoutDate = new Date(sortedWorkouts[i].completedAt);
        workoutDate.setHours(0, 0, 0, 0);
        
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        if (workoutDate.getTime() === expectedDate.getTime()) {
          currentStreak++;
        } else if (i === 0 && workoutDate.getTime() === expectedDate.getTime() - 86400000) {
          // Allow yesterday to count if we haven't worked out today
          currentStreak = 1;
        } else {
          break;
        }
      }
    }

    // Calculate total volume (sets) from recent workouts
    const totalSetsThisWeek = recentWorkouts.reduce((acc, log) => {
      return acc + log.exerciseLogs.reduce((sum, el) => sum + el.setsCompleted, 0);
    }, 0);

    // Format weekly data for chart
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      
      const dayLogs = weeklyLogs.filter((log) => {
        const logDate = new Date(log.completedAt);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        count: dayLogs.length,
      };
    });

    return NextResponse.json({
      totalWorkouts,
      currentStreak,
      totalSetsThisWeek,
      fitnessLevel: profile?.fitnessLevel || "beginner",
      recentWorkouts: recentWorkouts.map((w) => ({
        id: w.id,
        date: w.completedAt,
        type: w.day.dayType,
        duration: w.durationMin,
        exercises: w.exerciseLogs.length,
      })),
      personalRecords: personalRecords.map((pr) => ({
        exercise: pr.exerciseId,
        type: pr.recordType,
        value: pr.value,
        date: pr.achievedAt,
      })),
      weeklyData,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to get stats" },
      { status: 500 }
    );
  }
}

