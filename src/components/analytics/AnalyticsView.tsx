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
  AreaChart,
  Area,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Flame,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const { activeGoal, userProfile } = useCoach();

  // Mock past 7-day study time & task completion
  const dailyTimeData = [
    { day: "Thu", planned: 90, actual: 90, tasksDone: 3 },
    { day: "Fri", planned: 90, actual: 80, tasksDone: 2 },
    { day: "Sat", planned: 90, actual: 120, tasksDone: 4 },
    { day: "Sun", planned: 90, actual: 90, tasksDone: 3 },
    { day: "Mon", planned: 90, actual: 45, tasksDone: 1 }, // friction day
    { day: "Tue", planned: 60, actual: 60, tasksDone: 2 }, // adapted day
    { day: "Wed (Today)", planned: 60, actual: 65, tasksDone: 2 },
  ];

  // Skill Mastery Radar Data
  const skillRadarData = [
    { subject: "Arrays & Strings", mastery: 90, fullMark: 100 },
    { subject: "Two Pointers", mastery: 75, fullMark: 100 },
    { subject: "Sliding Window", mastery: 65, fullMark: 100 },
    { subject: "Linked Lists", mastery: 50, fullMark: 100 },
    { subject: "Recursion", mastery: 35, fullMark: 100 }, // weak area
    { subject: "Tree Traversals", mastery: 20, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl glass-panel-glow border border-surfaceBorder p-6 bg-gradient-to-r from-surface to-primary-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-[10px] font-bold uppercase tracking-wider">
                Progress Intelligence
              </span>
              <span className="text-slate-400 text-xs">• Real-Time Analytics</span>
            </div>
            <h2 className="text-xl font-extrabold text-white font-heading">
              Performance & Habit Metrics
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tracking adaptability, consistency, and skill mastery curves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>+18% Velocity this month</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Daily Study Time: Planned vs Actual */}
        <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface/80 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-cyan" />
                <span>Daily Minutes: Planned vs. Actual</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Notice the adaptation on Mon/Tue to protect consistency
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="h-2.5 w-2.5 rounded bg-slate-600" /> Planned
              </span>
              <span className="flex items-center gap-1 text-accent-cyan">
                <span className="h-2.5 w-2.5 rounded bg-cyan-400" /> Actual
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111726",
                    borderColor: "#222F4C",
                    borderRadius: "0.75rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="planned" fill="#334155" radius={[4, 4, 0, 0]} name="Planned (min)" />
                <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Actual (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Skill Mastery Radar Chart */}
        <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface/80 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent-purple" />
                <span>Topic Mastery & Skill Health</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Identifies weak spots (Recursion) for automatic drill injection
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              Recursion Drill Active
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={9} />
                <Radar
                  name="Mastery %"
                  dataKey="mastery"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consistency & Gamification Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak & Consistency */}
        <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface p-5">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <Flame className="h-5 w-5 fill-amber-400 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Consistency Streak
            </h4>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono mb-2">
            {userProfile.streakDays} Days Active
          </div>
          <p className="text-xs text-slate-300 mb-3">
            You've studied 7 consecutive days without skipping.
          </p>
          <div className="flex gap-1.5 justify-between">
            {["T", "F", "S", "S", "M", "T", "W"].map((d, i) => (
              <div
                key={i}
                className="flex-1 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] text-center"
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Level & XP Progression */}
        <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface p-5">
          <div className="flex items-center gap-2 text-accent-cyan mb-3">
            <Award className="h-5 w-5" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Gamification Tier
            </h4>
          </div>
          <div className="text-3xl font-extrabold text-accent-cyan font-mono mb-1">
            Level {userProfile.level}
          </div>
          <div className="text-xs text-slate-400 mb-2">
            {userProfile.totalXp} XP Total (50 XP to Level {userProfile.level + 1})
          </div>
          <div className="w-full bg-surfaceLight h-2 rounded-full overflow-hidden">
            <div
              className="bg-accent-cyan h-full rounded-full"
              style={{ width: `${(userProfile.totalXp % 150 / 150) * 100}%` }}
            />
          </div>
        </div>

        {/* Adaptive Reschedule Efficiency */}
        <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface p-5">
          <div className="flex items-center gap-2 text-accent-emerald mb-3">
            <CheckCircle className="h-5 w-5" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Plan Retention Rate
            </h4>
          </div>
          <div className="text-3xl font-extrabold text-accent-emerald font-mono mb-2">
            94.2%
          </div>
          <p className="text-xs text-slate-300">
            Tasks completed within adapted windows without missing deadlines.
          </p>
        </div>
      </div>
    </div>
  );
};
