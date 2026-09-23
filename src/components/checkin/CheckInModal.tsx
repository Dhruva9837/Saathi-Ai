"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import { submitCheckInAction } from "@/server/actions/checkins";
import {
  X,
  Sparkles,
  CheckCircle,
  Clock,
  Gauge,
  MessageSquare,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AdaptivePlanProposal } from "@/types";
import { triggerLevelUpConfetti } from "@/lib/confetti";

export const CheckInModal: React.FC = () => {
  const {
    isCheckInModalOpen,
    setIsCheckInModalOpen,
    activeGoal,
    todayTasks,
    submitCheckIn,
    acceptAdaptiveProposal,
  } = useCoach();

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
    todayTasks.filter((t) => t.status === "completed").map((t) => t.id)
  );
  const [actualMinutes, setActualMinutes] = useState<number>(
    activeGoal?.dailyMinutesTarget || 60
  );
  const [difficulty, setDifficulty] = useState<number>(3);
  const [blockers, setBlockers] = useState<string>("");
  const [reflection, setReflection] = useState<string>("");
  const [mood, setMood] = useState<"great" | "good" | "neutral" | "struggling" | "burnt_out">("good");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<AdaptivePlanProposal | null>(null);

  if (!isCheckInModalOpen || !activeGoal) return null;

  const toggleTaskSelection = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const proposal = submitCheckIn({
        completedTaskIds: selectedTaskIds,
        actualMinutesSpent: actualMinutes,
        perceivedDifficulty: difficulty,
        blockers,
        reflectionNotes: reflection,
        mood,
        confidenceScore: difficulty <= 2 ? 5 : difficulty === 3 ? 4 : 2,
      });

      triggerLevelUpConfetti();

      // Persist to Supabase if authenticated
      try {
        await submitCheckInAction({
          goalId: activeGoal.id,
          date: new Date().toISOString().split("T")[0],
          completedTaskIds: selectedTaskIds,
          actualMinutesSpent: actualMinutes,
          perceivedDifficulty: difficulty,
          blockers,
          reflectionNotes: reflection,
          mood,
          confidenceScore: difficulty <= 2 ? 5 : difficulty === 3 ? 4 : 2,
          aiFeedbackSummary: proposal.triggerReason,
        });
      } catch (err) {
        // Ignored in guest mode
      }

      setGeneratedProposal(proposal);
    } catch (err) {
      console.error("Check-in error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyAdaptation = () => {
    if (generatedProposal) {
      acceptAdaptiveProposal(generatedProposal.id);
      triggerLevelUpConfetti();
      setIsCheckInModalOpen(false);
      setGeneratedProposal(null);
    }
  };

  const handleClose = () => {
    setIsCheckInModalOpen(false);
    setGeneratedProposal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel-glow border border-surfaceBorder bg-surface p-6 sm:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-surfaceBorder mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-purple flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                AI Daily Check-In
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating progress for: <span className="text-primary-300 font-medium">{activeGoal.title}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surfaceLight transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!generatedProposal ? (
          /* Check-in Input Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Tasks Completed */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>1. Which tasks did you finish today?</span>
                <span className="text-slate-400 normal-case font-normal text-xs">
                  {selectedTaskIds.length}/{todayTasks.length} Completed
                </span>
              </label>
              <div className="space-y-2">
                {todayTasks.map((t) => {
                  const isChecked = selectedTaskIds.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskSelection(t.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "bg-primary-600/15 border-primary-500/40 text-slate-100"
                          : "bg-surfaceLight/40 border-surfaceBorder/60 text-slate-300 hover:bg-surfaceLight"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-primary-500 border-primary-400 text-white"
                              : "border-slate-500"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="h-3.5 w-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-medium">{t.title}</div>
                          <div className="text-[10px] text-slate-400">{t.topic} • {t.estimatedMinutes}m est.</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase bg-surface border border-surfaceBorder text-slate-300">
                        {t.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Time Spent vs Target */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surfaceLight/30 border border-surfaceBorder">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-accent-cyan" />
                    Actual Time Spent
                  </span>
                  <span className="text-sm font-bold text-accent-cyan font-mono">
                    {actualMinutes} min
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={240}
                  step={15}
                  value={actualMinutes}
                  onChange={(e) => setActualMinutes(Number(e.target.value))}
                  className="w-full accent-primary-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>15m</span>
                  <span>Target: {activeGoal.dailyMinutesTarget}m</span>
                  <span>4h</span>
                </div>
              </div>

              {/* Perceived Difficulty */}
              <div className="p-4 rounded-xl bg-surfaceLight/30 border border-surfaceBorder">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-accent-amber" />
                    Perceived Difficulty
                  </span>
                  <span className="text-xs font-bold text-accent-amber">
                    {difficulty === 1 ? "1 - Very Easy" : difficulty === 2 ? "2 - Easy" : difficulty === 3 ? "3 - Optimal" : difficulty === 4 ? "4 - Hard" : "5 - High Friction"}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Breeze</span>
                  <span>Optimal</span>
                  <span>Struggling</span>
                </div>
              </div>
            </div>

            {/* Step 3: Natural Language Feedback / Blockers */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-primary-400" />
                <span>What blocked you or went well? (Natural Language)</span>
              </label>
              <textarea
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="e.g. Aaj college ka exam tha toh sirf 30 min mila, ya recursion base condition me confusion hui..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surfaceLight/50 border border-surfaceBorder text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary-500/70 focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surfaceLight transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-cyan text-white text-xs font-bold shadow-lg shadow-primary-500/25 hover:from-primary-500 hover:to-cyan-500 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>AI Analyzing Feedback...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Analyze & Adapt Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* AI Adaptive Engine Proposal View */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary-950/60 to-surface border border-primary-500/40">
              <div className="flex items-center gap-2 text-xs font-bold text-primary-300 mb-1">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>AI Adaptive Planning Engine Triggered</span>
              </div>
              <p className="text-xs text-slate-300">
                {generatedProposal.triggerReason}
              </p>
            </div>

            {/* Diff Comparison: Old vs Adapted Plan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surfaceLight/30 border border-surfaceBorder">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Previous Plan Target
                </div>
                <div className="text-xl font-bold text-slate-300 font-mono">
                  {generatedProposal.previousDailyTargetMinutes} min / day
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Static Roadmap schedule
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary-600/15 border border-primary-500/40 shadow-inner">
                <div className="text-[11px] font-semibold text-primary-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Adapted Plan Target
                </div>
                <div className="text-xl font-bold text-accent-cyan font-mono flex items-center gap-2">
                  {generatedProposal.proposedDailyTargetMinutes} min / day
                  {generatedProposal.proposedDailyTargetMinutes < generatedProposal.previousDailyTargetMinutes ? (
                    <TrendingDown className="h-4 w-4 text-amber-400" />
                  ) : generatedProposal.proposedDailyTargetMinutes > generatedProposal.previousDailyTargetMinutes ? (
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  ) : null}
                </div>
                <div className="text-xs text-primary-200 mt-1">
                  Calibrated to your actual velocity
                </div>
              </div>
            </div>

            {/* Key Adaptive Changes */}
            <div>
              <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2.5">
                Roadmap Changes & Rescheduling
              </div>
              <ul className="space-y-2">
                {generatedProposal.keyChangesSummary.map((change, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-surfaceLight/40 border border-surfaceBorder/60 text-xs text-slate-200"
                  >
                    <CheckCircle className="h-4 w-4 text-accent-emerald shrink-0 mt-0.5" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coach Encouragement Quote */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" />
                Coach Note
              </div>
              <p className="text-xs italic text-amber-200/90 leading-relaxed">
                "{generatedProposal.coachEncouragement}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surfaceLight transition-colors"
              >
                Keep Current Plan
              </button>
              <button
                onClick={handleApplyAdaptation}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-emerald to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Accept & Apply Adapted Plan</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
