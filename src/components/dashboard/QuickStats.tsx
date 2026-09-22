"use client";

import React from "react";
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
    activeGoal?.milestones.reduce((acc, m) => acc + m.tasks.length, 0) || 12;
  const completedTasks =
    activeGoal?.milestones.reduce(
      (acc, m) => acc + m.tasks.filter((t) => t.status === "completed").length,
      0
    ) || 4;

  const progressPercent = Math.min(
    100,
    Math.round((completedTasks / Math.max(totalTasks, 1)) * 100)
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Progress */}
      <div className="rounded-xl border border-[#1E293B] p-4 bg-[#151E2E] flex flex-col justify-between hover:border-[#334155] transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider">Goal Progress</span>
          <Target className="h-4 w-4 text-[#818CF8]" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono">{progressPercent}%</div>
          <div className="w-full bg-[#0B1120] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="text-[10px] text-[#94A3B8]">
          {completedTasks}/{totalTasks} Tasks Completed
        </div>
      </div>

      {/* 2. Consistency Streak */}
      <div className="rounded-xl border border-[#1E293B] p-4 bg-[#151E2E] flex flex-col justify-between hover:border-[#334155] transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider">Streak</span>
          <Flame className="h-4 w-4 text-[#F59E0B] fill-[#F59E0B]" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold text-[#F59E0B] font-mono flex items-center gap-1.5">
            {userProfile.streakDays} <span className="text-xs text-[#94A3B8] font-sans font-normal">Days</span>
          </div>
          <div className="text-[11px] text-[#22C55E] flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="h-3 w-3" />
            Top 5% Consistency
          </div>
        </div>
        <div className="text-[10px] text-[#94A3B8]">
          Daily goal met consecutively
        </div>
      </div>

      {/* 3. Time Invested */}
      <div className="rounded-xl border border-[#1E293B] p-4 bg-[#151E2E] flex flex-col justify-between hover:border-[#334155] transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider">Time Invested</span>
          <Clock className="h-4 w-4 text-[#818CF8]" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono">
            31.5 <span className="text-xs text-[#94A3B8] font-sans font-normal">Hours</span>
          </div>
          <div className="text-[11px] text-[#94A3B8] mt-1">
            Target: {activeGoal?.dailyMinutesTarget || 60}m / day
          </div>
        </div>
        <div className="text-[10px] text-[#94A3B8]">
          Calibrated via check-in data
        </div>
      </div>

      {/* 4. Adaptive Focus */}
      <div className="rounded-xl border border-[#1E293B] p-4 bg-[#151E2E] flex flex-col justify-between hover:border-[#334155] transition-colors shadow-sm">
        <div className="flex items-center justify-between text-[#94A3B8]">
          <span className="text-xs font-semibold uppercase tracking-wider">Skill Focus</span>
          <Zap className="h-4 w-4 text-[#818CF8]" />
        </div>
        <div className="my-1.5 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8]">Focus Area:</span>
            <span className="font-semibold text-[#EF4444] truncate max-w-[110px]">
              {activeGoal?.weakAreas[0] || "Recursion"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#94A3B8]">Strong Area:</span>
            <span className="font-semibold text-[#22C55E] truncate max-w-[110px]">
              {activeGoal?.strongAreas[0] || "Arrays"}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-[#818CF8] font-medium">
          Adaptive drills scheduled
        </div>
      </div>
    </div>
  );
};
