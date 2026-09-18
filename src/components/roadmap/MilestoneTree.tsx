"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  Milestone,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Clock,
  Layers,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { getDifficultyColor, getPriorityColor } from "@/lib/utils";

export const MilestoneTree: React.FC = () => {
  const { activeGoal, toggleTaskStatus, setIsCheckInModalOpen } = useCoach();
  const [expandedMilestoneIds, setExpandedMilestoneIds] = useState<string[]>([
    activeGoal?.milestones[0]?.id || "",
  ]);

  if (!activeGoal) return null;

  const toggleMilestone = (id: string) => {
    setExpandedMilestoneIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl glass-panel-glow border border-surfaceBorder p-6 bg-gradient-to-r from-surface to-primary-950/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-[10px] font-bold uppercase tracking-wider">
                Roadmap Architecture
              </span>
              <span className="text-slate-400 text-xs">• Dynamic Milestone Tree</span>
            </div>
            <h2 className="text-xl font-extrabold text-white font-heading">
              {activeGoal.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Target Deadline: <span className="text-slate-200 font-medium">{activeGoal.targetDeadline}</span> • Target Daily: <span className="text-accent-cyan font-medium">{activeGoal.dailyMinutesTarget}m/day</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surfaceLight border border-surfaceBorder hover:border-primary-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Simulate Plan Adaptation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Milestone List */}
      <div className="space-y-4">
        {activeGoal.milestones.map((milestone, index) => {
          const isExpanded = expandedMilestoneIds.includes(milestone.id);
          const isCompleted = milestone.status === "completed";
          const isLocked = milestone.status === "locked";
          const isInProgress = milestone.status === "in_progress";

          const completedTasksCount = milestone.tasks.filter(
            (t) => t.status === "completed"
          ).length;
          const totalTasksCount = milestone.tasks.length;
          const progressPercent =
            totalTasksCount > 0
              ? Math.round((completedTasksCount / totalTasksCount) * 100)
              : 0;

          return (
            <div
              key={milestone.id}
              className={`rounded-2xl border transition-all ${
                isInProgress
                  ? "bg-surface/90 border-primary-500/30 shadow-lg shadow-primary-500/5"
                  : isCompleted
                  ? "bg-surface/50 border-accent-emerald/30 opacity-90"
                  : "bg-surface/30 border-surfaceBorder/60 opacity-60"
              }`}
            >
              {/* Milestone Accordion Header */}
              <div
                onClick={() => !isLocked && toggleMilestone(milestone.id)}
                className={`p-5 flex items-center justify-between cursor-pointer select-none ${
                  isLocked ? "cursor-not-allowed" : "hover:bg-surfaceLight/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-heading font-extrabold text-sm ${
                      isInProgress
                        ? "bg-gradient-to-tr from-primary-600 to-accent-cyan text-white shadow-md shadow-primary-500/25"
                        : isCompleted
                        ? "bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30"
                        : "bg-surfaceLight text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      `0${milestone.order}`
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100">
                        {milestone.title}
                      </h3>
                      {isInProgress && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-primary-500/20 text-primary-300 border border-primary-500/30">
                          Active Phase
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase bg-surfaceLight text-slate-500">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {milestone.description} • Est. {milestone.estimatedDays} Days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {totalTasksCount > 0 && (
                    <div className="hidden sm:flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-semibold text-slate-300">
                          {completedTasksCount}/{totalTasksCount} Tasks
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {progressPercent}% Complete
                        </div>
                      </div>
                      <div className="w-16 h-2 rounded-full bg-surfaceLight overflow-hidden">
                        <div
                          className="h-full bg-primary-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!isLocked && (
                    <div className="text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Tasks Content */}
              {isExpanded && !isLocked && (
                <div className="px-5 pb-5 pt-2 border-t border-surfaceBorder/60 space-y-2.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Milestone Action Items
                  </div>

                  {milestone.tasks.length === 0 ? (
                    <div className="text-xs text-slate-500 py-3 italic">
                      No discrete tasks generated yet for this phase.
                    </div>
                  ) : (
                    milestone.tasks.map((task) => {
                      const isTaskDone = task.status === "completed";
                      const diff = getDifficultyColor(task.difficulty);

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isTaskDone
                              ? "bg-surfaceLight/30 border-surfaceBorder/40 opacity-70"
                              : "bg-surfaceLight/60 border-surfaceBorder/70 hover:border-primary-500/40"
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleTaskStatus(task.id)}
                              className={`mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                                isTaskDone
                                  ? "bg-accent-emerald border-accent-emerald text-white"
                                  : "border-slate-500 bg-surface"
                              }`}
                            >
                              {isTaskDone && <Check className="h-3.5 w-3.5" />}
                            </button>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-medium ${
                                    isTaskDone
                                      ? "line-through text-slate-400"
                                      : "text-slate-200"
                                  }`}
                                >
                                  {task.title}
                                </span>
                                {task.wasAdapted && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent-purple/20 text-accent-purple border border-accent-purple/30 font-semibold flex items-center gap-0.5">
                                    <Sparkles className="h-2 w-2" />
                                    Adapted
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400">
                                {task.description}
                              </p>
                              {task.adaptationReason && (
                                <p className="text-[10px] text-primary-300 italic">
                                  ↳ {task.adaptationReason}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.estimatedMinutes}m
                            </span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold border ${diff.bg} ${diff.text} ${diff.border}`}
                            >
                              {task.difficulty}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
