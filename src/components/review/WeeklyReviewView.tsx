"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  CalendarCheck2,
  Sparkles,
  Award,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  BrainCircuit,
  Zap,
  Share2,
  Copy,
  Check,
  X,
  Flame,
  Target,
} from "lucide-react";
import confetti from "canvas-confetti";

export const WeeklyReviewView: React.FC = () => {
  const { weeklyReview, activeGoal, userProfile } = useCoach();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(weeklyReview.aiExecutiveSummary);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyShareCard = () => {
    const text = `🔥 Saathi AI Weekly Retrospective 🔥\n\n🎯 Goal: ${activeGoal?.title || "Focus Mission"}\n⭐ Consistency Score: ${weeklyReview.consistencyScorePercent}%\n⚡ Tasks Completed: ${weeklyReview.tasksCompleted}/${weeklyReview.tasksTotal} (${weeklyReview.completionRatePercent}%)\n⏱️ Time Invested: ${weeklyReview.totalHoursSpent} hrs\n🏆 Top Strength: ${weeklyReview.strongAreas[0]}\n🔥 Active Streak: ${userProfile.streakDays} Days | Level ${userProfile.level} (${userProfile.totalXp} XP)\n\nPowered by Saathi AI — Adaptive Learning & Productivity Coach`;

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#6366F1", "#38BDF8", "#10B981"],
      });
    } catch (e) {}
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleRefreshReview = async () => {
    setIsRefreshing(true);
    try {
      // Call coach API to synthesize fresh evaluation
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Please generate a 2-paragraph executive retrospective summary of my weekly progress, highlighting strong patterns, weak areas, and calibrated next steps.",
          context: {
            goalTitle: activeGoal?.title || "Mastery Track",
            currentLevel: activeGoal?.currentLevel || "intermediate",
            streakDays: userProfile.streakDays,
            weakAreas: activeGoal?.weakAreas || ["Recursion & Backtracking"],
            strongAreas: activeGoal?.strongAreas || ["Arrays & Two Pointers"],
            targetDailyMinutes: activeGoal?.dailyMinutesTarget || 60,
            coachPersona: userProfile.coachPersona || "supportive",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          setCurrentSummary(data.reply);
        }
      }
    } catch (e) {
      console.warn("Weekly review refresh fallback", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalGoalTasks =
    activeGoal?.milestones.reduce((acc, m) => acc + m.tasks.length, 0) || 0;
  const completedGoalTasks =
    activeGoal?.milestones.reduce(
      (acc, m) => acc + m.tasks.filter((t) => t.status === "completed").length,
      0
    ) || 0;
  const hitRate =
    totalGoalTasks > 0 ? Math.round((completedGoalTasks / totalGoalTasks) * 100) : 0;
  const totalCompletedMinutes =
    activeGoal?.milestones.reduce(
      (acc, m) =>
        acc +
        m.tasks
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + (t.actualMinutes || t.estimatedMinutes), 0),
      0
    ) || 0;
  const totalHours = (totalCompletedMinutes / 60).toFixed(1);
  const topStrength = activeGoal?.strongAreas[0] || "Foundations";
  const targetWeakness = activeGoal?.weakAreas[0] || "Active Practice";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#1E293B] p-6 bg-gradient-to-r from-[#151E2E] to-[#0B1120]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#818CF8]/20 border border-[#818CF8]/30 text-[#818CF8] text-[10px] font-bold uppercase tracking-wider">
                Automated Retrospective
              </span>
              <span className="text-[#94A3B8] text-xs">• Weekly AI Review</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F8FAFC]">
              {activeGoal?.title || "Mastery Track"} Retrospective
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Goal Focus: <span className="text-[#818CF8] font-medium">{activeGoal?.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] text-xs font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{hitRate}% Completion</span>
            </span>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#818CF8]/20 hover:bg-[#818CF8]/30 border border-[#818CF8]/40 text-[#818CF8] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Card</span>
            </button>

            <button
              onClick={handleRefreshReview}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-[#151E2E] border border-[#1E293B] hover:border-[#818CF8] text-[#94A3B8] hover:text-[#F8FAFC] text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Generate fresh AI insights"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#818CF8]" : "text-[#94A3B8]"}`} />
              <span>{isRefreshing ? "Re-evaluating..." : "Re-evaluate"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#151E2E]">
          <div className="text-xs text-[#94A3B8] font-medium mb-1">Tasks Completed</div>
          <div className="text-2xl font-bold text-[#F8FAFC] font-mono">
            {completedGoalTasks}/{totalGoalTasks}
          </div>
          <div className="text-[10px] text-[#22C55E] mt-1 font-semibold">
            {hitRate}% Hit Rate
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#151E2E]">
          <div className="text-xs text-[#94A3B8] font-medium mb-1">Time Invested</div>
          <div className="text-2xl font-bold text-[#818CF8] font-mono">
            {totalHours} hrs
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-1">
            Across active sessions
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#151E2E]">
          <div className="text-xs text-[#94A3B8] font-medium mb-1">Top Strength</div>
          <div className="text-lg font-bold text-[#22C55E] truncate">
            {topStrength}
          </div>
          <div className="text-[10px] text-[#94A3B8] mt-1">
            High confidence
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[#1E293B] bg-[#151E2E]">
          <div className="text-xs text-[#94A3B8] font-medium mb-1">Target Weakness</div>
          <div className="text-lg font-bold text-[#EF4444] truncate">
            {targetWeakness}
          </div>
          <div className="text-[10px] text-[#EF4444]/80 mt-1">
            Targeted for drills
          </div>
        </div>
      </div>

      {/* AI Executive Summary Card */}
      <div className="rounded-2xl glass-panel border border-primary-500/30 bg-surface/90 p-6 shadow-xl relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              AI Coach Executive Analysis
            </h3>
            <p className="text-[11px] text-slate-400">
              Synthesized from daily check-ins, velocity, and error patterns
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-200 leading-relaxed p-4 rounded-xl bg-surfaceLight/50 border border-surfaceBorder whitespace-pre-line">
          {currentSummary}
        </div>
      </div>

      {/* Wins & Next Week Roadmap Calibration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Wins */}
        <div className="rounded-2xl glass-panel border border-surfaceBorder bg-surface/80 p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Key Breakthroughs & Wins</span>
          </h3>
          <ul className="space-y-2.5">
            {weeklyReview.keyWins.map((win, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-surfaceLight/40 border border-surfaceBorder/60 text-xs text-slate-200"
              >
                <CheckCircle className="h-4 w-4 text-accent-emerald shrink-0 mt-0.5" />
                <span>{win}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Week's AI Adapted Plan */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#151E2E] p-5">
          <h3 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#818CF8]" />
            <span>Next Week's Adaptive Adjustments</span>
          </h3>
          <ul className="space-y-2.5">
            {weeklyReview.nextWeekFocus.map((focus, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0B1120] border border-[#1E293B] text-xs text-[#CBD5E1]"
              >
                <ArrowRight className="h-4 w-4 text-[#818CF8] shrink-0 mt-0.5" />
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shareable Retrospective Card Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0B1120] border border-[#1E293B] shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[#818CF8]" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  Share Weekly Accomplishment Card
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E2E] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Visual Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#151E2E] via-[#0B1120] to-[#1E1B4B] border-2 border-[#818CF8]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white font-bold text-xs">
                    S
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F8FAFC]">Saathi AI Retrospective</h4>
                    <span className="text-[10px] text-[#94A3B8]">{userProfile.name} • Level {userProfile.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/30">
                  <Flame className="h-3.5 w-3.5 fill-[#F59E0B]" />
                  <span>{userProfile.streakDays} Day Streak</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B1120]/80 border border-[#1E293B]">
                <div className="text-[11px] font-semibold text-[#818CF8] mb-0.5">Focus Goal</div>
                <div className="text-sm font-bold text-[#F8FAFC]">{activeGoal?.title || "Focus Mission"}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#151E2E] border border-[#1E293B]">
                  <div className="text-[10px] text-[#94A3B8]">Consistency</div>
                  <div className="text-base font-bold text-[#22C55E]">{weeklyReview.consistencyScorePercent}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151E2E] border border-[#1E293B]">
                  <div className="text-[10px] text-[#94A3B8]">Tasks Done</div>
                  <div className="text-base font-bold text-[#F8FAFC]">{weeklyReview.tasksCompleted}/{weeklyReview.tasksTotal}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#151E2E] border border-[#1E293B]">
                  <div className="text-[10px] text-[#94A3B8]">Focus Hours</div>
                  <div className="text-base font-bold text-[#818CF8]">{weeklyReview.totalHoursSpent}h</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0B1120]/60 border border-[#1E293B] text-xs text-[#CBD5E1] flex items-start gap-2">
                <Award className="h-4 w-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span><strong>Top Breakthrough:</strong> {weeklyReview.keyWins[0]}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E2E] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyShareCard}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#818CF8] hover:from-[#4F46E5] hover:to-[#6366F1] text-white font-semibold text-xs shadow-lg shadow-[#6366F1]/25 transition-all"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 text-white" />
                    <span>Summary Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Retrospective Card</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
