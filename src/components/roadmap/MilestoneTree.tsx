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

  if (!activeGoal) {
    return (
      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-8 text-center space-y-4">
        <h3 className="text-base font-bold text-[#F2F3F8]">No Roadmap Active</h3>
        <p className="text-xs text-[#8B90A8] max-w-sm mx-auto">
          You haven't created a roadmap yet. Generate an AI-structured study plan with milestones and daily tasks.
        </p>
        <a
          href="/onboarding"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C6CFF] hover:bg-[#6352E8] text-white text-xs font-semibold shadow-lg shadow-[#7C6CFF]/25 transition-all"
        >
          <span>Create New Roadmap</span>
        </a>
      </div>
    );
  }

  const toggleMilestone = (id: string) => {
    setExpandedMilestoneIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.07)] p-6 bg-[#11131F]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded font-semibold bg-[#171A2B] text-[#7C6CFF] text-[10px] uppercase tracking-wider border border-[rgba(255,255,255,0.07)]">
                Roadmap
              </span>
              <span className="text-[#8B90A8] text-xs">• Milestone Progression</span>
            </div>
            <h2 className="text-xl font-bold text-[#F2F3F8] font-heading">
              {activeGoal.title}
            </h2>
            <p className="text-xs text-[#8B90A8] mt-1">
              Target: <span className="text-[#F2F3F8] font-medium">{activeGoal.targetDeadline}</span> • Daily Target: <span className="text-[#7C6CFF] font-medium">{activeGoal.dailyMinutesTarget}m/day</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCheckInModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-xs font-semibold text-[#F2F3F8] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7C6CFF]" />
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
                  ? "bg-[#11131F] border-[rgba(255,255,255,0.15)] shadow-sm"
                  : isCompleted
                  ? "bg-[#11131F] border-[#3DDC97]/30"
                  : "bg-[#11131F]/60 border-[rgba(255,255,255,0.05)] opacity-60"
              }`}
            >
              {/* Milestone Accordion Header */}
              <div
                onClick={() => !isLocked && toggleMilestone(milestone.id)}
                className={`p-5 flex items-center justify-between cursor-pointer select-none ${
                  isLocked ? "cursor-not-allowed" : "hover:bg-[#171A2B]/40"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isInProgress
                        ? "bg-gradient-to-br from-[#7C6CFF] to-[#4F8BFF] text-white shadow-sm"
                        : isCompleted
                        ? "bg-[#3DDC97]/20 text-[#3DDC97] border border-[#3DDC97]/30"
                        : "bg-[#0A0B14] text-[#8B90A8] border border-[rgba(255,255,255,0.07)]"
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
                      <h3 className="text-sm font-bold text-[#F2F3F8]">
                        {milestone.title}
                      </h3>
                      {isInProgress && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase bg-[#171A2B] text-[#7C6CFF] border border-[rgba(255,255,255,0.07)]">
                          Active Phase
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-medium uppercase bg-[#0A0B14] text-[#8B90A8]">
                          Locked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B90A8] mt-0.5">
                      {milestone.description} • Est. {milestone.estimatedDays} Days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {totalTasksCount > 0 && (
                    <div className="hidden sm:flex items-center gap-3 text-right">
                      <div>
                        <div className="text-xs font-semibold text-[#F2F3F8]">
                          {completedTasksCount}/{totalTasksCount} Tasks
                        </div>
                        <div className="text-[10px] text-[#8B90A8] font-mono">
                          {progressPercent}% Done
                        </div>
                      </div>
                      <div className="w-16 h-1.5 rounded-full bg-[#0A0B14] overflow-hidden border border-[rgba(255,255,255,0.07)]">
                        <div
                          className="h-full bg-gradient-to-r from-[#3DDC97] to-[#4F8BFF] rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {!isLocked && (
                    <div className="text-[#8B90A8]">
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
                <div className="px-5 pb-5 pt-2 border-t border-[rgba(255,255,255,0.07)] space-y-2">
                  <div className="text-[11px] font-semibold text-[#8B90A8] uppercase tracking-wider mb-2">
                    Action Items
                  </div>

                  {milestone.tasks.length === 0 ? (
                    <div className="text-xs text-[#8B90A8] py-3 italic">
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
                              ? "bg-[#0A0B14]/60 border-[rgba(255,255,255,0.04)] opacity-60"
                              : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)]"
                          }`}
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleTaskStatus(task.id)}
                              className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                                isTaskDone
                                  ? "bg-[#3DDC97] border-[#3DDC97] text-[#0A0B14]"
                                  : "border-[rgba(255,255,255,0.15)] bg-[#171A2B]"
                              }`}
                            >
                              {isTaskDone && <Check className="h-3 w-3 stroke-[3]" />}
                            </button>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-medium ${
                                    isTaskDone
                                      ? "line-through text-[#8B90A8]"
                                      : "text-[#F2F3F8]"
                                  }`}
                                >
                                  {task.title}
                                </span>
                                {task.wasAdapted && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#171A2B] text-[#7C6CFF] border border-[#7C6CFF]/30 font-medium flex items-center gap-0.5">
                                    <Sparkles className="h-2 w-2" />
                                    Adapted
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#8B90A8]">
                                {task.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="text-[10px] text-[#8B90A8] font-mono flex items-center gap-1">
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
