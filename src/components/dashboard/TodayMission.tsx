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
  CheckCircle2,
  Calendar,
  Layers,
  Target,
  Trophy,
  PartyPopper,
  BookOpen,
  HelpCircle,
  MoreVertical,
  RotateCcw,
  Check,
  AlertCircle,
  Flame,
  Hourglass,
  CheckSquare,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";
import { Task } from "@/types";
import { TaskFocusSessionModal } from "./TaskFocusSessionModal";
import { TaskCompleteModal } from "./TaskCompleteModal";

export const TodayMission: React.FC = () => {
  const {
    activeGoal,
    currentMilestone,
    todayTasks,
    updateTaskStatus,
    rescheduleTask,
    setIsCheckInModalOpen,
  } = useCoach();

  // Modals state
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [completeTaskModal, setCompleteTaskModal] = useState<Task | null>(null);

  // Quick Action menu open state
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  // Calculations strictly adhering to AI Coaching guidelines
  const totalTasks = todayTasks.length;
  const completedTasks = todayTasks.filter((t) => t.status === "completed");
  const pendingTasks = todayTasks.filter((t) => t.status !== "completed");

  // 1. Task completion: Completed tasks ÷ Total tasks × 100
  const taskCompletionPercent =
    totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // 2. Study time: Completed study sessions ke actual minutes ka sum
  const actualStudyMinutes = todayTasks.reduce(
    (sum, t) => sum + (t.status === "completed" ? (t.actualMinutes || t.estimatedMinutes) : (t.actualMinutes || 0)),
    0
  );

  // 3. Remaining time: Pending tasks ke estimated minutes ka sum
  const remainingMinutes = pendingTasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  // 4. Daily goal progress: Actual study minutes ÷ Planned minutes × 100
  const plannedDailyMinutes = activeGoal?.dailyMinutesTarget || 120;
  const dailyGoalProgressPercent = Math.min(
    100,
    Math.round((actualStudyMinutes / plannedDailyMinutes) * 100)
  );

  const isAllCompleted = totalTasks > 0 && completedTasks.length === totalTasks;

  const handleLaunchFocus = (task: Task) => {
    // If planned or pending, switch to in_progress
    if (task.status === "planned" || task.status === "pending") {
      updateTaskStatus(task.id, "in_progress");
    }
    setFocusTask(task);
  };

  const handleCompleteSession = (
    taskId: string,
    actualMinutes: number,
    score?: number,
    notes?: string
  ) => {
    updateTaskStatus(taskId, "completed", actualMinutes, score, notes);
    triggerTaskCompleteConfetti();
    if (completedTasks.length + 1 === totalTasks) {
      triggerLevelUpConfetti();
    }
  };

  const handleReschedule = (taskId: string) => {
    rescheduleTask(taskId);
    setActiveMenuTaskId(null);
  };

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5 sm:p-7 shadow-xl relative overflow-hidden space-y-6">
      {/* Background celebration glow */}
      {isAllCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#3DDC97]/5 via-[#7C6CFF]/5 to-[#4F8BFF]/5 pointer-events-none" />
      )}

      {/* ============================================================ */}
      {/* HEADER: Goal, Roadmap Phase & Rigorous Progress Formulas */}
      {/* ============================================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[rgba(255,255,255,0.07)] relative z-10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md font-semibold bg-[#171A2B] text-[#7C6CFF] text-[10px] uppercase tracking-wider border border-[rgba(255,255,255,0.07)]">
              {activeGoal?.title || "Daily Mission"}
            </span>
            {currentMilestone && (
              <span className="px-2.5 py-0.5 rounded-md font-semibold bg-[#4F8BFF]/10 text-[#4F8BFF] text-[10px] uppercase tracking-wider border border-[#4F8BFF]/20 flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {currentMilestone.title}
              </span>
            )}
            <span className="text-[#8B90A8] text-xs">• Today's Action Plan</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#F2F3F8] font-heading flex items-center gap-2">
            <span>Today's Tasks</span>
            {isAllCompleted && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#3DDC97]/15 border border-[#3DDC97]/30 text-[#3DDC97] font-medium"
              >
                <Trophy className="h-3.5 w-3.5" />
                All Done!
              </motion.span>
            )}
          </h2>
          <p className="text-xs text-[#8B90A8]">
            Tasks are dynamically synchronized with your current roadmap phase, target outcome, and daily time budget.
          </p>
        </div>

        {/* Dual Progress Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#0A0B14]/80 border border-[rgba(255,255,255,0.07)] p-3 rounded-2xl">
          {/* 1. Task Completion */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#8B90A8] flex items-center gap-1">
              <CheckSquare className="h-3 w-3 text-[#3DDC97]" />
              Tasks Done
            </div>
            <div className="text-sm font-bold text-[#F2F3F8] font-mono">
              {completedTasks.length} of {totalTasks} ({taskCompletionPercent}%)
            </div>
            <div className="w-full bg-[#171A2B] h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#3DDC97] to-[#2cb87d] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${taskCompletionPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* 2. Actual Study Time */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#8B90A8] flex items-center gap-1">
              <Flame className="h-3 w-3 text-[#F5B544]" />
              Study Time
            </div>
            <div className="text-sm font-bold text-[#F5B544] font-mono">
              {actualStudyMinutes} min logged
            </div>
            <div className="text-[10px] text-[#8B90A8]">Actual focused effort</div>
          </div>

          {/* 3. Remaining Time */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#8B90A8] flex items-center gap-1">
              <Hourglass className="h-3 w-3 text-[#4F8BFF]" />
              Remaining
            </div>
            <div className="text-sm font-bold text-[#F2F3F8] font-mono">
              {remainingMinutes} min
            </div>
            <div className="text-[10px] text-[#8B90A8]">Pending workload</div>
          </div>

          {/* 4. Daily Goal Progress */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#8B90A8] flex items-center gap-1">
              <Target className="h-3 w-3 text-[#7C6CFF]" />
              Daily Budget
            </div>
            <div className="text-sm font-bold text-[#7C6CFF] font-mono">
              {actualStudyMinutes}/{plannedDailyMinutes}m ({dailyGoalProgressProgressText(dailyGoalProgressPercent)})
            </div>
            <div className="w-full bg-[#171A2B] h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${dailyGoalProgressPercent}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 100% Celebration Banner */}
      {isAllCompleted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-gradient-to-r from-[#3DDC97]/15 to-[#7C6CFF]/15 border border-[#3DDC97]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5 text-[#F2F3F8]">
            <PartyPopper className="h-5 w-5 text-[#3DDC97] shrink-0 animate-bounce" />
            <span>
              <strong>Outstanding consistency today!</strong> You completed all {totalTasks} scheduled tasks ({actualStudyMinutes} minutes of focused learning logged). Ready to adapt tomorrow's plan?
            </span>
          </div>
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="shrink-0 px-4 py-2 rounded-xl bg-[#3DDC97] hover:bg-[#34c485] text-[#0A0B14] text-xs font-bold transition-all shadow-md"
          >
            Start Daily Check-In
          </button>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* TASK CARDS LIST */}
      {/* ============================================================ */}
      <div className="space-y-3 relative z-10">
        {todayTasks.length === 0 ? (
          <div className="text-center py-12 text-[#8B90A8] text-xs bg-[#0A0B14] rounded-2xl border border-[rgba(255,255,255,0.06)] p-6 space-y-3">
            <Sparkles className="h-6 w-6 text-[#7C6CFF] mx-auto animate-pulse" />
            <p className="font-semibold text-[#F2F3F8]">No tasks scheduled for today.</p>
            <p className="text-[11px] max-w-sm mx-auto">
              You are completely up to date with your roadmap, or today is designated as an active rest day.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {todayTasks.map((task, index) => {
              const isDone = task.status === "completed";
              const isInProgress = task.status === "in_progress";
              const isRescheduled = task.status === "rescheduled";
              const diffStyle = getDifficultyColor(task.difficulty);

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  layout
                  className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                    isDone
                      ? "bg-[#0A0B14]/40 border-[rgba(255,255,255,0.04)] opacity-75 hover:opacity-100"
                      : isInProgress
                      ? "bg-[#0E101D] border-[#7C6CFF]/40 shadow-lg shadow-[#7C6CFF]/10 ring-1 ring-[#7C6CFF]/20"
                      : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] shadow-sm"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Task Title & Learning Objective */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Status Icon */}
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                            isDone
                              ? "bg-[#3DDC97] text-[#0A0B14]"
                              : isInProgress
                              ? "bg-[#7C6CFF] text-white animate-pulse"
                              : "bg-[#171A2B] text-[#8B90A8] border border-[rgba(255,255,255,0.1)]"
                          }`}
                        >
                          {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : index + 1}
                        </div>

                        <h3
                          className={`text-sm sm:text-base font-bold transition-all ${
                            isDone ? "line-through text-[#8B90A8]" : "text-[#F2F3F8]"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Badges */}
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
                        >
                          {task.difficulty}
                        </span>

                        <span className="text-[9px] px-2 py-0.5 rounded font-semibold uppercase bg-[#171A2B] text-[#8B90A8] border border-[rgba(255,255,255,0.07)]">
                          {task.taskType || "Practice"}
                        </span>

                        {isInProgress && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-semibold uppercase bg-[#7C6CFF]/15 text-[#7C6CFF] border border-[#7C6CFF]/30 animate-pulse">
                            In Progress
                          </span>
                        )}

                        {isRescheduled && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-semibold uppercase bg-[#F5B544]/15 text-[#F5B544] border border-[#F5B544]/30">
                            Rescheduled
                          </span>
                        )}

                        {task.resultScore !== undefined && (
                          <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30">
                            Score: {task.resultScore}%
                          </span>
                        )}
                      </div>

                      {/* Learning Objective / Outcome */}
                      <div className="space-y-1 pl-7">
                        <div className="text-xs text-[#F2F3F8] leading-relaxed">
                          <span className="font-semibold text-[#7C6CFF]">Learning outcome: </span>
                          <span>{task.learningObjective || task.description}</span>
                        </div>

                        {task.completionCriteria && (
                          <div className="text-[11px] text-[#8B90A8] flex items-center gap-1.5">
                            <span className="font-medium text-[#8B90A8]/80">Criteria:</span>
                            <span>{task.completionCriteria}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Duration, Start Learning & Mark Complete Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center pl-7 md:pl-0 shrink-0">
                      {/* Duration Tag */}
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#8B90A8] bg-[#11131F] px-2.5 py-1.5 rounded-xl border border-[rgba(255,255,255,0.07)]">
                        <Clock className="h-3 w-3 text-[#7C6CFF]" />
                        <span>{task.estimatedMinutes} min</span>
                      </div>

                      {/* Start Learning / Focus Button */}
                      {!isDone ? (
                        <button
                          type="button"
                          onClick={() => handleLaunchFocus(task)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C6CFF] hover:bg-[#6A58FF] text-white text-xs font-semibold shadow-md shadow-[#7C6CFF]/20 transition-all"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>{isInProgress ? "Resume" : "Start Learning"}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-[#3DDC97] font-semibold bg-[#3DDC97]/10 px-3 py-1 rounded-xl border border-[#3DDC97]/25">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Completed ({task.actualMinutes || task.estimatedMinutes}m)</span>
                        </div>
                      )}

                      {/* Mark Complete Action */}
                      {!isDone && (
                        <button
                          type="button"
                          onClick={() => setCompleteTaskModal(task)}
                          className="px-3 py-1.5 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.08)] text-[#8B90A8] hover:text-[#3DDC97] hover:border-[#3DDC97]/40 text-xs font-semibold transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}

                      {/* Options Menu (Reschedule) */}
                      {!isDone && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id)
                            }
                            className="p-1.5 rounded-lg text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B] transition-colors"
                            title="Task Options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {activeMenuTaskId === task.id && (
                            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.12)] p-1.5 shadow-xl z-30 space-y-1">
                              <button
                                type="button"
                                onClick={() => handleReschedule(task.id)}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#202438] flex items-center gap-2"
                              >
                                <Calendar className="h-3.5 w-3.5 text-[#F5B544]" />
                                <span>Reschedule for Tomorrow</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ============================================================ */}
      {/* BOTTOM FOOTER: Daily Check-In Prompt */}
      {/* ============================================================ */}
      <div className="pt-4 border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="text-xs text-[#8B90A8] flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7C6CFF] shrink-0" />
          <span>
            Daily Check-In logs your actual time, notes blockers, and automatically adapts tomorrow's roadmap.
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCheckInModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-[#7C6CFF]/20 transition-all shrink-0"
        >
          <span>Daily Check-In & Adapt Plan</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>

      {/* Interactive Focus Session Modal */}
      <TaskFocusSessionModal
        task={focusTask}
        milestone={currentMilestone}
        goalTitle={activeGoal?.title}
        isOpen={!!focusTask}
        onClose={() => setFocusTask(null)}
        onComplete={handleCompleteSession}
      />

      {/* Task Completion Self-Assessment Modal */}
      <TaskCompleteModal
        task={completeTaskModal}
        isOpen={!!completeTaskModal}
        onClose={() => setCompleteTaskModal(null)}
        onConfirm={handleCompleteSession}
      />
    </div>
  );
};

function dailyGoalProgressProgressText(percent: number): string {
  return `${percent}%`;
}
