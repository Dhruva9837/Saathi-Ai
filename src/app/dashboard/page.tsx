"use client";

import React from "react";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { CoachDailyBriefing } from "@/components/dashboard/CoachDailyBriefing";
import { TodayMission } from "@/components/dashboard/TodayMission";
import { useCoach } from "@/context/CoachContext";

export default function DashboardPage() {
  const { userProfile, activeGoal } = useCoach();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Good Morning, {userProfile.name.split(" ")[0]} 👋
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your personalized mission is ready for today.
          </p>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <QuickStats />

      {/* AI Coach Daily Briefing with Audio simulator */}
      <CoachDailyBriefing />

      {/* Today's Actionable Mission Card */}
      <TodayMission />
    </div>
  );
}
