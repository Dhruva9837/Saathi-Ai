"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCoach } from "@/context/CoachContext";
import {
  Flame,
  Target,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react";

export const QuickStats: React.FC = () => {
  const { activeGoal, userProfile } = useCoach();

  const totalTasks =
    activeGoal?.milestones.reduce((acc, m) => acc + m.tasks.length, 0) || 0;
  const completedTasks =
    activeGoal?.milestones.reduce(
      (acc, m) => acc + m.tasks.filter((t) => t.status === "completed").length,
      0
    ) || 0;

  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedMinutes =
    activeGoal?.milestones.reduce(
      (acc, m) =>
        acc +
        m.tasks
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + (t.actualMinutes || t.estimatedMinutes), 0),
      0
    ) || 0;

  const timeInvestedHours = (completedMinutes / 60).toFixed(1);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {/* 1. Overall Progress */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="rounded-2xl border border-[rgba(255,255,255,0.07)] p-4 sm:p-5 bg-[#11131F] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all shadow-md group"
      >
        <div className="flex items-center justify-between text-[#8B90A8]">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Goal Progress</span>
          <Target className="h-4 w-4 text-[#7C6CFF] group-hover:scale-110 transition-transform" />
        </div>
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold text-[#F2F3F8] font-mono">{progressPercent}%</div>
          <div className="w-full bg-[#0A0B14] h-1.5 rounded-full overflow-hidden mt-2 border border-[rgba(255,255,255,0.07)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#3DDC97] to-[#4F8BFF] h-full rounded-full"
            />
          </div>
        </div>
        <div className="text-[10px] text-[#8B90A8]">
          {completedTasks}/{totalTasks} Tasks Completed
        </div>
      </motion.div>

      {/* 2. Consistency Streak */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="rounded-2xl border border-[rgba(255,255,255,0.07)] p-4 sm:p-5 bg-[#11131F] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all shadow-md group relative overflow-hidden"
      >
        <div className="flex items-center justify-between text-[#8B90A8]">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Streak</span>
          <Flame className="h-4 w-4 text-[#F5B544] fill-[#F5B544] animate-pulse" />
        </div>
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold text-[#F5B544] font-mono flex items-center gap-1.5">
            {userProfile.streakDays || 1} <span className="text-xs text-[#8B90A8] font-sans font-normal">Day{(userProfile.streakDays || 1) === 1 ? "" : "s"}</span>
          </div>
          <div className="text-[11px] text-[#3DDC97] flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="h-3 w-3" />
            {(userProfile.streakDays || 1) > 3
              ? "Top 5% Consistency"
              : (userProfile.streakDays || 1) > 1
              ? "Streak Momentum Active"
              : "Day 1 of Journey"}
          </div>
        </div>
        <div className="text-[10px] text-[#8B90A8]">
          {(userProfile.streakDays || 1) > 1
            ? "Daily goal met consecutively"
            : "Complete today's tasks to build streak"}
        </div>
      </motion.div>

      {/* 3. Time Invested */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="rounded-2xl border border-[rgba(255,255,255,0.07)] p-4 sm:p-5 bg-[#11131F] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all shadow-md group"
      >
        <div className="flex items-center justify-between text-[#8B90A8]">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Time Invested</span>
          <Clock className="h-4 w-4 text-[#7C6CFF] group-hover:scale-110 transition-transform" />
        </div>
        <div className="my-2.5">
          <div className="text-2xl sm:text-3xl font-bold text-[#F2F3F8] font-mono">
            {timeInvestedHours} <span className="text-xs text-[#8B90A8] font-sans font-normal">Hours</span>
          </div>
          <div className="text-[11px] text-[#8B90A8] mt-1">
            Target: {activeGoal?.dailyMinutesTarget || 60}m / day
          </div>
        </div>
        <div className="text-[10px] text-[#8B90A8]">
          Calibrated via check-in data
        </div>
      </motion.div>

      {/* 4. Adaptive Focus */}
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="rounded-2xl border border-[rgba(255,255,255,0.07)] p-4 sm:p-5 bg-[#11131F] flex flex-col justify-between hover:border-[rgba(255,255,255,0.15)] transition-all shadow-md group"
      >
        <div className="flex items-center justify-between text-[#8B90A8]">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider">Skill Focus</span>
          <Zap className="h-4 w-4 text-[#7C6CFF] group-hover:scale-110 transition-transform" />
        </div>
        <div className="my-2 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8B90A8]">Weak Area:</span>
            <span className="font-semibold text-[#FF6B7A] truncate max-w-[110px]" title={activeGoal?.weakAreas?.[0] || activeGoal?.milestones[0]?.title || "Core Fundamentals"}>
              {activeGoal?.weakAreas?.[0] || activeGoal?.milestones[0]?.title?.split(" ")[0] || "Foundations"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#8B90A8]">Strong Area:</span>
            <span className="font-semibold text-[#3DDC97] truncate max-w-[110px]" title={activeGoal?.strongAreas?.[0] || "Core Concepts"}>
              {activeGoal?.strongAreas?.[0] || "Problem Solving"}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-[#7C6CFF] font-medium">
          Adaptive drills scheduled
        </div>
      </motion.div>
    </div>
  );
};
