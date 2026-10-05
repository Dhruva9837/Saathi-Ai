"use client";

import React from "react";
import Link from "next/link";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { CoachDailyBriefing } from "@/components/dashboard/CoachDailyBriefing";
import { TodayMission } from "@/components/dashboard/TodayMission";
import { useCoach } from "@/context/CoachContext";
import { PlusCircle, Compass } from "lucide-react";

export default function DashboardPage() {
  const { userProfile, activeGoal, goals } = useCoach();

  const greetingName = userProfile.name ? userProfile.name.split(" ")[0] : "Learner";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F2F3F8] font-heading tracking-tight">
            Welcome, {greetingName} 👋
          </h1>
          <p className="text-xs text-[#8B90A8] mt-0.5">
            {activeGoal
              ? `Your personalized mission for "${activeGoal.title}" is ready.`
              : "Generate an AI roadmap to start your daily coaching sessions."}
          </p>
        </div>

        {goals.length === 0 && (
          <Link
            href="/onboarding"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity self-start sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create First Goal</span>
          </Link>
        )}
      </div>

      {/* If no goals exist yet, display an onboarding CTA card */}
      {goals.length === 0 && (
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-6 sm:p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-[#7C6CFF]/20 border border-[#7C6CFF]/40 text-[#7C6CFF] flex items-center justify-center mx-auto">
            <Compass className="h-6 w-6 animate-pulse" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-[#F2F3F8]">
              No Active Roadmaps Found
            </h3>
            <p className="text-xs text-[#8B90A8] mt-1 leading-relaxed">
              Create your first learning or career target. Saathi AI will automatically scaffold structured milestones, daily tasks, and adaptive reviews.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C6CFF] hover:bg-[#6352E8] text-white text-xs font-semibold shadow-lg shadow-[#7C6CFF]/25 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Start AI Roadmap Generator</span>
          </Link>
        </div>
      )}

      {/* 4 Quick Stat Cards */}
      <QuickStats />

      {/* AI Coach Daily Briefing with Audio simulator */}
      <CoachDailyBriefing />

      {/* Today's Actionable Mission Card */}
      <TodayMission />
    </div>
  );
}
