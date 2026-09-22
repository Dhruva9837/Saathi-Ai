"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Check,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

export const TodayMission: React.FC = () => {
  const { activeGoal, todayTasks, toggleTaskStatus, setIsCheckInModalOpen } = useCoach();

  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = (taskId: string) => {
    if (activeTimerTaskId === taskId) {
      setIsTimerRunning(!isTimerRunning);
    } else {
      setActiveTimerTaskId(taskId);
      setTimerSeconds(0);
      setIsTimerRunning(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completedCount = todayTasks.filter((t) => t.status === "completed").length;
  const totalMinutes = todayTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const progressPercent = todayTasks.length > 0 ? Math.round((completedCount / todayTasks.length) * 100) : 0;

  return (
    <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded font-semibold bg-[#1E293B] text-[#818CF8] text-[10px] uppercase tracking-wider border border-[#334155]">
              {activeGoal?.title || "Daily Mission"}
            </span>
            <span className="text-[#94A3B8] text-xs">• Today's Objective</span>
          </div>
          <h2 className="text-xl font-bold text-[#F8FAFC] font-heading">
            Today's Tasks
          </h2>
        </div>

        {/* Progress Bar & Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#F8FAFC]">
              {completedCount} of {todayTasks.length} Done ({progressPercent}%)
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              Target: <span className="text-[#F8FAFC] font-semibold">{totalMinutes} min</span>
            </div>
          </div>
          <div className="w-24 h-2 rounded-full bg-[#0B1120] overflow-hidden border border-[#1E293B]">
            <div
              className="h-full bg-[#22C55E] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-5 space-y-2.5">
        {todayTasks.length === 0 ? (
          <div className="text-center py-10 text-[#94A3B8] text-xs">
            No tasks scheduled for today. Take a quick rest or generate new goals!
          </div>
        ) : (
          todayTasks.map((task) => {
            const isDone = task.status === "completed";
            const diffStyle = getDifficultyColor(task.difficulty);
            const isCurrentTimer = activeTimerTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`rounded-lg border p-3.5 transition-colors ${
                  isDone
                    ? "bg-[#0B1120]/60 border-[#1E293B]/60 opacity-60"
                    : "bg-[#0B1120] border-[#1E293B] hover:border-[#334155]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 h-5 w-5 rounded border flex items-center justify-center transition-colors ${
                        isDone
                          ? "bg-[#22C55E] border-[#22C55E] text-white"
                          : "border-[#334155] hover:border-[#818CF8] bg-[#151E2E] text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isDone ? "line-through text-[#94A3B8]" : "text-[#F8FAFC]"
                          }`}
                        >
                          {task.title}
                        </span>

                        {task.wasAdapted && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-[#1E293B] border border-[#6366F1]/30 text-[#818CF8] text-[10px] font-medium">
                            <Sparkles className="h-2.5 w-2.5" />
                            Adapted
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#94A3B8] line-clamp-1">
                        {task.description}
                      </p>

                      {task.adaptationReason && (
                        <p className="text-[10px] text-[#818CF8] italic">
                          ↳ {task.adaptationReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges & Timer Action */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    <div className="flex items-center gap-1 text-[11px] text-[#94A3B8] font-mono">
                      <Clock className="h-3 w-3" />
                      <span>{task.estimatedMinutes}m</span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium uppercase border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
                    >
                      {task.difficulty}
                    </span>

                    {!isDone && (
                      <button
                        onClick={() => toggleTimer(task.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono font-medium transition-colors ${
                          isCurrentTimer && isTimerRunning
                            ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444]"
                            : "bg-[#151E2E] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155]"
                        }`}
                      >
                        {isCurrentTimer && isTimerRunning ? (
                          <>
                            <Pause className="h-3 w-3 fill-[#EF4444]" />
                            <span>{formatTimer(timerSeconds)}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 fill-[#94A3B8]" />
                            <span>Focus</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom CTA for Check-in */}
      <div className="mt-5 pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-[#94A3B8] flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#818CF8]" />
          <span>Finished studying? Complete your daily check-in to calibrate tomorrow's plan.</span>
        </div>
        <button
          onClick={() => setIsCheckInModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <span>Complete Daily Check-In</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
