"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { getDifficultyColor, getPriorityColor } from "@/lib/utils";

export const TodayMission: React.FC = () => {
  const { activeGoal, todayTasks, toggleTaskStatus, setIsCheckInModalOpen } = useCoach();

  // Active Timer state for currently running task
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
    <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface/80 p-6 shadow-xl relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-surfaceBorder/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-[10px] font-bold uppercase tracking-wider">
              {activeGoal?.title || "Daily Mission"}
            </span>
            <span className="text-slate-400 text-xs">• Today's Objective</span>
          </div>
          <h2 className="text-xl font-extrabold text-white font-heading flex items-center gap-2">
            Today's Mission
          </h2>
        </div>

        {/* Progress Bar & Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-300">
              {completedCount} of {todayTasks.length} Done ({progressPercent}%)
            </div>
            <div className="text-[11px] text-slate-400">
              Est. Total: <span className="text-accent-cyan font-semibold">{totalMinutes} min</span>
            </div>
          </div>
          <div className="w-24 h-2.5 rounded-full bg-surfaceLight overflow-hidden border border-surfaceBorder">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-accent-emerald transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-5 space-y-3">
        {todayTasks.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No tasks scheduled for today. Take a quick rest or generate new goals!
          </div>
        ) : (
          todayTasks.map((task) => {
            const isDone = task.status === "completed";
            const diffStyle = getDifficultyColor(task.difficulty);
            const prioStyle = getPriorityColor(task.priority);
            const isCurrentTimer = activeTimerTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`group relative rounded-xl border p-4 transition-all ${
                  isDone
                    ? "bg-surfaceLight/30 border-surfaceBorder/40 opacity-75"
                    : "bg-surfaceLight/60 border-surfaceBorder/80 hover:border-primary-500/40 hover:bg-surfaceLight"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`mt-0.5 h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${
                        isDone
                          ? "bg-accent-emerald border-accent-emerald text-white shadow-md shadow-emerald-500/20"
                          : "border-slate-500 hover:border-primary-400 bg-surface text-transparent hover:text-slate-400"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isDone ? "line-through text-slate-400" : "text-slate-100"
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Adapted Pill */}
                        {task.wasAdapted && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-purple/15 border border-accent-purple/30 text-accent-purple text-[10px] font-semibold">
                            <Sparkles className="h-2.5 w-2.5" />
                            AI Adapted
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {task.description}
                      </p>

                      {task.adaptationReason && (
                        <p className="text-[10px] text-primary-300/90 italic flex items-center gap-1">
                          ↳ {task.adaptationReason}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Badges & Timer Action */}
                  <div className="flex items-center gap-2.5 self-end sm:self-center">
                    {/* Time estimate */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{task.estimatedMinutes}m</span>
                    </div>

                    {/* Difficulty Badge */}
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
                    >
                      {task.difficulty}
                    </span>

                    {/* Timer button */}
                    {!isDone && (
                      <button
                        onClick={() => toggleTimer(task.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all ${
                          isCurrentTimer && isTimerRunning
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                            : "bg-surface border-surfaceBorder text-slate-300 hover:border-primary-500/50"
                        }`}
                      >
                        {isCurrentTimer && isTimerRunning ? (
                          <>
                            <Pause className="h-3 w-3 fill-rose-400 text-rose-400" />
                            <span>{formatTimer(timerSeconds)}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3 w-3 fill-slate-300 text-slate-300" />
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
      <div className="mt-5 pt-4 border-t border-surfaceBorder/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-accent-cyan" />
          <span>Finished with today's study? Let AI analyze and update tomorrow's load.</span>
        </div>
        <button
          onClick={() => setIsCheckInModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-primary-500/20 hover:from-primary-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
        >
          <span>Complete Daily Check-In</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
