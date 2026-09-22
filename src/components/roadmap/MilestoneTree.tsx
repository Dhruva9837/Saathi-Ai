"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Clock,
  Check,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

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
      <div className="rounded-xl border border-[#1E293B] p-6 bg-[#151E2E]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded font-semibold bg-[#1E293B] text-[#818CF8] text-[10px] uppercase tracking-wider border border-[#334155]">
                Roadmap
              </span>
              <span className="text-[#94A3B8] text-xs">• Milestone Progression</span>
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC] font-heading">
              {activeGoal.title}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Target: <span className="text-[#F8FAFC] font-medium">{activeGoal.targetDeadline}</span> • Daily Target: <span className="text-[#818CF8] font-medium">{activeGoal.dailyMinutesTarget}m/day</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B1120] border border-[#1E293B] hover:border-[#334155] text-xs font-semibold text-[#F8FAFC] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#818CF8]" />
              <span>Simulate Check-in & Adapt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Milestone List */}
      <div className="space-y-3.5">
        {activeGoal.milestones.map((milestone) => {
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
              className={`rounded-xl border transition-colors ${
                isInProgress
                  ? "bg-[#151E2E] border-[#334155]"
                  : isCompleted
                  ? "bg-[#151E2E] border-[#22C55E]/30"
                  : "bg-[#151E2E]/60 border-[#1E293B] opacity-60"
              }`}
            >
              {/* Milestone Accordion Header */}
              <div
                onClick={() => !isLocked && toggleMilestone(milestone.id)}
                className={`p-5 flex items-center justify-between cursor-pointer select-none ${
                  isLocked ? "cursor-not-allowed" : "hover:bg-[#1E293B]/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isInProgress
                        ? "bg-[#6366F1] text-white"
                        : isCompleted
                        ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30"
                        : "bg-[#0B1120] text-[#94A3B8] border border-[#1E293B]"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isLocked ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      `0${milestone.order}`
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#F8FAFC]">
                        {milestone.title}
                      </h3>
                      {isInProgress && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-[#1E293B] text-[#818CF8] border border-[#334155]">
                          Active Phase
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium uppercase bg-[#0B1120] text-[#94A3B8]">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      {milestone.description} • Est. {milestone.estimatedDays} Days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {totalTasksCount > 0 && (
                    <div className="hidden sm:flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-semibold text-[#F8FAFC]">
                          {completedTasksCount}/{totalTasksCount} Tasks
                        </div>
                        <div className="text-[10px] text-[#94A3B8] font-mono">
                          {progressPercent}% Done
                        </div>
                      </div>
                      <div className="w-16 h-1.5 rounded-full bg-[#0B1120] overflow-hidden border border-[#1E293B]">
                        <div
                          className="h-full bg-[#22C55E] rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!isLocked && (
                    <div className="text-[#94A3B8]">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Tasks Content */}
              {isExpanded && !isLocked && (
                <div className="px-5 pb-5 pt-2 border-t border-[#1E293B] space-y-2">
                  <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                    Action Items
                  </div>

                  {milestone.tasks.length === 0 ? (
                    <div className="text-xs text-[#94A3B8] py-3 italic">
                      No discrete tasks generated yet for this phase.
                    </div>
                  ) : (
                    milestone.tasks.map((task) => {
                      const isTaskDone = task.status === "completed";
                      const diff = getDifficultyColor(task.difficulty);

                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            isTaskDone
                              ? "bg-[#0B1120]/60 border-[#1E293B]/60 opacity-60"
                              : "bg-[#0B1120] border-[#1E293B] hover:border-[#334155]"
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleTaskStatus(task.id)}
                              className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                isTaskDone
                                  ? "bg-[#22C55E] border-[#22C55E] text-white"
                                  : "border-[#334155] bg-[#151E2E]"
                              }`}
                            >
                              {isTaskDone && <Check className="h-3 w-3" />}
                            </button>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-medium ${
                                    isTaskDone
                                      ? "line-through text-[#94A3B8]"
                                      : "text-[#F8FAFC]"
                                  }`}
                                
                                >
                                  {task.title}
                                </span>
                                {task.wasAdapted && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1E293B] text-[#818CF8] border border-[#6366F1]/30 font-medium flex items-center gap-0.5">
                                    <Sparkles className="h-2 w-2" />
                                    Adapted
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#94A3B8]">
                                {task.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="text-[10px] text-[#94A3B8] font-mono flex items-center gap-1">
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
