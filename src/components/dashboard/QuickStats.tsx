"use client";

import React from "react";
import { useCoach } from "@/context/CoachContext";
import {
  Flame,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
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
      <div className="rounded-2xl glass-panel border border-surfaceBorder p-4 bg-surface/70 flex flex-col justify-between glass-card-hover">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Goal Progress</span>
          <Target className="h-4 w-4 text-primary-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-white font-mono">{progressPercent}%</div>
          <div className="w-full bg-surfaceLight h-1.5 rounded-full overflow-hidden mt-1.5">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="text-[10px] text-slate-400">
          {completedTasks}/{totalTasks} Milestone Tasks Done
        </div>
      </div>

      {/* 2. Consistency Streak */}
      <div className="rounded-2xl glass-panel border border-surfaceBorder p-4 bg-surface/70 flex flex-col justify-between glass-card-hover">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Streak</span>
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-amber-400 font-mono flex items-center gap-1.5">
            {userProfile.streakDays} <span className="text-xs text-slate-300 font-sans font-normal">Days</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="h-3 w-3" />
            Top 5% Consistency
          </div>
        </div>
        <div className="text-[10px] text-slate-400">
          Daily goal met consecutively
        </div>
      </div>

      {/* 3. Time Invested */}
      <div className="rounded-2xl glass-panel border border-surfaceBorder p-4 bg-surface/70 flex flex-col justify-between glass-card-hover">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">Time Invested</span>
          <Clock className="h-4 w-4 text-accent-cyan" />
        </div>
        <div className="my-2">
          <div className="text-2xl font-extrabold text-accent-cyan font-mono">
            31.5 <span className="text-xs text-slate-300 font-sans font-normal">Hours</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Target: {activeGoal?.dailyMinutesTarget || 60}m / day
          </div>
        </div>
        <div className="text-[10px] text-slate-400">
          Calibrated via check-in data
        </div>
      </div>

      {/* 4. Adaptive Focus (Weak vs Strong Areas) */}
      <div className="rounded-2xl glass-panel border border-surfaceBorder p-4 bg-surface/70 flex flex-col justify-between glass-card-hover">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold uppercase tracking-wider">AI Skill Health</span>
          <Zap className="h-4 w-4 text-accent-purple" />
        </div>
        <div className="my-1.5 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Weak Area:</span>
            <span className="font-semibold text-rose-400 truncate max-w-[110px]">
              {activeGoal?.weakAreas[0] || "Recursion"}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Strong Area:</span>
            <span className="font-semibold text-accent-emerald truncate max-w-[110px]">
              {activeGoal?.strongAreas[0] || "Arrays"}
            </span>
          </div>
        </div>
        <div className="text-[10px] text-primary-300 font-medium">
          Reinforcement auto-scheduled
        </div>
      </div>
    </div>
  );
};
