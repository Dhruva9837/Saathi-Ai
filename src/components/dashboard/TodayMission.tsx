"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCoach } from "@/context/CoachContext";
import { triggerTaskCompleteConfetti, triggerLevelUpConfetti } from "@/lib/confetti";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Check,
  Trophy,
  PartyPopper,
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

  const handleTaskToggle = (taskId: string) => {
    const task = todayTasks.find((t) => t.id === taskId);
    const willBeCompleted = task?.status !== "completed";

    toggleTaskStatus(taskId);

    if (willBeCompleted) {
      const remainingUncompleted = todayTasks.filter(
        (t) => t.id !== taskId && t.status !== "completed"
      ).length;

      if (remainingUncompleted === 0) {
        triggerLevelUpConfetti();
      } else {
        triggerTaskCompleteConfetti();
      }
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
  const isAllCompleted = todayTasks.length > 0 && completedCount === todayTasks.length;

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#151E2E] p-5 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Background glow when all completed */}
      {isAllCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#22C55E]/5 via-[#6366F1]/5 to-[#38BDF8]/5 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#1E293B] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md font-semibold bg-[#1E293B] text-[#818CF8] text-[10px] uppercase tracking-wider border border-[#334155]">
              {activeGoal?.title || "Daily Mission"}
            </span>
            <span className="text-[#94A3B8] text-xs">• Today's Action Plan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] font-heading flex items-center gap-2">
            <span>Today's Tasks</span>
            {isAllCompleted && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] font-medium"
              >
                <Trophy className="h-3.5 w-3.5" />
                All Done!
              </motion.span>
            )}
          </h2>
        </div>

        {/* Progress Bar & Quick Stats */}
        <div className="flex items-center gap-4 bg-[#0B1120]/70 border border-[#1E293B] p-2.5 sm:px-4 rounded-xl">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#F8FAFC]">
              {completedCount} of {todayTasks.length} Done ({progressPercent}%)
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              Target: <span className="text-[#F8FAFC] font-semibold">{totalMinutes} min</span>
            </div>
          </div>
          <div className="w-24 sm:w-28 h-2.5 rounded-full bg-[#0B1120] overflow-hidden border border-[#1E293B] relative">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                isAllCompleted
                  ? "bg-gradient-to-r from-[#22C55E] to-[#10B981] shadow-sm shadow-[#22C55E]/50"
                  : "bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 15 }}
            />
          </div>
        </div>
      </div>

      {/* 100% Celebration Banner */}
      {isAllCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-[#22C55E]/15 to-[#6366F1]/15 border border-[#22C55E]/30 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 text-[#F8FAFC]">
            <PartyPopper className="h-5 w-5 text-[#22C55E] shrink-0 animate-bounce" />
            <span>
              <strong>Outstanding work today!</strong> You completed all scheduled missions. Ready for check-in?
            </span>
          </div>
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Check-In Now
          </button>
        </motion.div>
      )}

      {/* Task List with Framer Motion */}
      <div className="mt-5 space-y-3 relative z-10">
        {todayTasks.length === 0 ? (
          <div className="text-center py-10 text-[#94A3B8] text-xs">
            No tasks scheduled for today. Take a quick rest or generate new goals!
          </div>
        ) : (
          <AnimatePresence>
            {todayTasks.map((task, index) => {
              const isDone = task.status === "completed";
              const diffStyle = getDifficultyColor(task.difficulty);
              const isCurrentTimer = activeTimerTaskId === task.id;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    isDone
                      ? "bg-[#0B1120]/50 border-[#1E293B]/60 opacity-60 hover:opacity-90"
                      : "bg-[#0B1120] border-[#1E293B] hover:border-[#334155] shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Checkbox & Info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleTaskToggle(task.id)}
                        className={`mt-0.5 h-5 w-5 rounded-lg border flex items-center justify-center transition-all ${
                          isDone
                            ? "bg-[#22C55E] border-[#22C55E] text-white shadow-sm shadow-[#22C55E]/40"
                            : "border-[#334155] hover:border-[#818CF8] bg-[#151E2E] text-transparent hover:scale-105"
                        }`}
                      >
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </motion.button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold transition-all ${
                              isDone ? "line-through text-[#94A3B8]" : "text-[#F8FAFC]"
                            }`}
                          >
                            {task.title}
                          </span>

                          {task.wasAdapted && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1E293B] border border-[#6366F1]/30 text-[#818CF8] text-[10px] font-medium">
                              <Sparkles className="h-2.5 w-2.5" />
                              Adapted
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-[#94A3B8] line-clamp-1">
                          {task.description}
                        </p>

                        {task.adaptationReason && (
                          <p className="text-[10px] text-[#818CF8] italic font-medium">
                            ↳ {task.adaptationReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Badges & Timer Action */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      <div className="flex items-center gap-1 text-[11px] text-[#94A3B8] font-mono bg-[#151E2E] px-2 py-0.5 rounded-md border border-[#1E293B]">
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
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium transition-all ${
                            isCurrentTimer && isTimerRunning
                              ? "bg-[#EF4444]/15 border-[#EF4444]/40 text-[#EF4444] animate-pulse"
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom CTA for Check-in */}
      <div className="mt-6 pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="text-xs text-[#94A3B8] flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#818CF8]" />
          <span>Finished studying? Complete your daily check-in to calibrate tomorrow's plan.</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCheckInModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-lg shadow-[#6366F1]/20 transition-all"
        >
          <span>Complete Daily Check-In</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>
    </div>
  );
};

