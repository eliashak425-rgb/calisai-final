"use client";

import { useState, useEffect } from "react";
import { StatsCards, WeeklyChart, RecentActivity, PersonalRecords } from "@/components/dashboard";

interface Stats {
  totalWorkouts: number;
  currentStreak: number;
  totalSetsThisWeek: number;
  fitnessLevel: string;
  recentWorkouts: Array<{
    id: string;
    date: string;
    type: string;
    duration: number;
    exercises: number;
  }>;
  personalRecords: Array<{
    exercise: string;
    type: string;
    value: number | null;
    date: string;
  }>;
  weeklyData: Array<{ day: string; count: number }>;
}

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0A0B0E] border border-white/10 rounded-2xl h-28" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl h-64" />
          <div className="bg-[#0A0B0E] border border-white/10 rounded-2xl h-64" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <StatsCards
        totalWorkouts={stats.totalWorkouts}
        currentStreak={stats.currentStreak}
        totalSetsThisWeek={stats.totalSetsThisWeek}
        fitnessLevel={stats.fitnessLevel}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <WeeklyChart data={stats.weeklyData} />
        <PersonalRecords records={stats.personalRecords} />
      </div>

      <RecentActivity workouts={stats.recentWorkouts} />
    </div>
  );
}

