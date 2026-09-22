"use client";

import React from "react";
import { useCoach } from "@/context/CoachContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Zap,
  Flame,
  Award,
  CheckCircle,
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const { userProfile } = useCoach();

  // Mock past 7-day study time
  const dailyTimeData = [
    { day: "Thu", planned: 90, actual: 90 },
    { day: "Fri", planned: 90, actual: 80 },
    { day: "Sat", planned: 90, actual: 120 },
    { day: "Sun", planned: 90, actual: 90 },
    { day: "Mon", planned: 90, actual: 45 },
    { day: "Tue", planned: 60, actual: 60 },
    { day: "Wed (Today)", planned: 60, actual: 65 },
  ];

  // Skill Mastery Radar Data
  const skillRadarData = [
    { subject: "Arrays & Strings", mastery: 90 },
    { subject: "Two Pointers", mastery: 75 },
    { subject: "Sliding Window", mastery: 65 },
    { subject: "Linked Lists", mastery: 50 },
    { subject: "Recursion", mastery: 35 },
    { subject: "Tree Traversals", mastery: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-[#1E293B] p-6 bg-[#151E2E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded font-semibold bg-[#1E293B] text-[#818CF8] text-[10px] uppercase tracking-wider border border-[#334155]">
                Analytics
              </span>
              <span className="text-[#94A3B8] text-xs">• Real-Time Performance</span>
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC] font-heading">
              Progress & Velocity
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Tracking consistency, study hours, and skill curves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155] text-[#22C55E] text-xs font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>+18% Consistency this month</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Daily Study Time: Planned vs Actual */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#818CF8]" />
                <span>Daily Minutes: Planned vs. Actual</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Pacing calibrated dynamically via daily check-ins
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#94A3B8]">
                <span className="h-2 w-2 rounded bg-[#334155]" /> Planned
              </span>
              <span className="flex items-center gap-1 text-[#818CF8]">
                <span className="h-2 w-2 rounded bg-[#6366F1]" /> Actual
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0B1120",
                    borderColor: "#1E293B",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "#F8FAFC",
                  }}
                />
                <Bar dataKey="planned" fill="#334155" radius={[4, 4, 0, 0]} name="Planned (min)" />
                <Bar dataKey="actual" fill="#6366F1" radius={[4, 4, 0, 0]} name="Actual (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Skill Mastery Radar Chart */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#818CF8]" />
                <span>Skill Mastery Radar</span>
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Identifies weak areas for targeted AI drill allocation
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#1E293B] text-[#EF4444] border border-[#EF4444]/30">
              Recursion Drill
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="#1E293B" />
                <PolarAngleAxis dataKey="subject" stroke="#94A3B8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar
                  name="Mastery %"
                  dataKey="mastery"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consistency & Gamification Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak & Consistency */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-5">
          <div className="flex items-center gap-2 text-[#F59E0B] mb-3">
            <Flame className="h-5 w-5 fill-[#F59E0B] text-[#F59E0B]" />
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
              Consistency Streak
            </h4>
          </div>
          <div className="text-3xl font-bold text-[#F59E0B] font-mono mb-2">
            {userProfile.streakDays} Days
          </div>
          <p className="text-xs text-[#94A3B8] mb-3">
            You've studied 7 consecutive days without skipping.
          </p>
          <div className="flex gap-1.5 justify-between">
            {["T", "F", "S", "S", "M", "T", "W"].map((d, i) => (
              <div
                key={i}
                className="flex-1 py-1.5 rounded bg-[#0B1120] border border-[#1E293B] text-[#F59E0B] font-bold text-[10px] text-center"
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Level & XP Progression */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-5">
          <div className="flex items-center gap-2 text-[#818CF8] mb-3">
            <Award className="h-5 w-5" />
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
              Level & XP
            </h4>
          </div>
          <div className="text-3xl font-bold text-[#818CF8] font-mono mb-1">
            Level {userProfile.level}
          </div>
          <div className="text-xs text-[#94A3B8] mb-2">
            {userProfile.totalXp} XP Total (50 XP to Next Level)
          </div>
          <div className="w-full bg-[#0B1120] h-2 rounded-full overflow-hidden border border-[#1E293B]">
            <div
              className="bg-[#6366F1] h-full rounded-full"
              style={{ width: `${(userProfile.totalXp % 150 / 150) * 100}%` }}
            />
          </div>
        </div>

        {/* Plan Retention Rate */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-5">
          <div className="flex items-center gap-2 text-[#22C55E] mb-3">
            <CheckCircle className="h-5 w-5" />
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">
              Retention Rate
            </h4>
          </div>
          <div className="text-3xl font-bold text-[#22C55E] font-mono mb-2">
            94.2%
          </div>
          <p className="text-xs text-[#94A3B8]">
            Tasks completed on time within adapted schedule windows.
          </p>
        </div>
      </div>
    </div>
  );
};
