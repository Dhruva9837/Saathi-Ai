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
  Zap,
  Share2,
  Copy,
  Check,
  X,
  Flame,
  Target,
} from "lucide-react";
import { LogoIcon } from "@/components/brand/Logo";
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
        colors: ["#7C6CFF", "#4F8BFF", "#3DDC97"],
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
      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] p-6 bg-gradient-to-r from-[#11131F] to-[#0A0B14]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7C6CFF]/20 border border-[#7C6CFF]/30 text-[#7C6CFF] text-[10px] font-bold uppercase tracking-wider">
                Automated Retrospective
              </span>
              <span className="text-[#8B90A8] text-xs">• Weekly AI Review</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F2F3F8]">
              {activeGoal?.title || "Mastery Track"} Retrospective
            </h2>
            <p className="text-xs text-[#8B90A8] mt-1">
              Goal Focus: <span className="text-[#7C6CFF] font-medium">{activeGoal?.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/30 text-[#3DDC97] text-xs font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{hitRate}% Completion</span>
            </span>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#7C6CFF]/20 hover:bg-[#7C6CFF]/30 border border-[#7C6CFF]/40 text-[#7C6CFF] text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share Card</span>
            </button>

            <button
              onClick={handleRefreshReview}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] hover:border-[#7C6CFF] text-[#8B90A8] hover:text-[#F2F3F8] text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Generate fresh AI insights"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#7C6CFF]" : "text-[#8B90A8]"}`} />
              <span>{isRefreshing ? "Re-evaluating..." : "Re-evaluate"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F]">
          <div className="text-xs text-[#8B90A8] font-medium mb-1">Tasks Completed</div>
          <div className="text-2xl font-bold text-[#F2F3F8] font-mono">
            {completedGoalTasks}/{totalGoalTasks}
          </div>
          <div className="text-[10px] text-[#3DDC97] mt-1 font-semibold">
            {hitRate}% Hit Rate
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F]">
          <div className="text-xs text-[#8B90A8] font-medium mb-1">Time Invested</div>
          <div className="text-2xl font-bold text-[#7C6CFF] font-mono">
            {totalHours} hrs
          </div>
          <div className="text-[10px] text-[#8B90A8] mt-1">
            Across active sessions
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F]">
          <div className="text-xs text-[#8B90A8] font-medium mb-1">Top Strength</div>
          <div className="text-lg font-bold text-[#3DDC97] truncate">
            {topStrength}
          </div>
          <div className="text-[10px] text-[#8B90A8] mt-1">
            High confidence
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F]">
          <div className="text-xs text-[#8B90A8] font-medium mb-1">Target Weakness</div>
          <div className="text-lg font-bold text-[#FF6B7A] truncate">
            {targetWeakness}
          </div>
          <div className="text-[10px] text-[#FF6B7A]/80 mt-1">
            Targeted for drills
          </div>
        </div>
      </div>

      {/* AI Executive Summary Card */}
      <div className="rounded-2xl glass-panel border border-[#7C6CFF]/30 bg-[#11131F]/90 p-6 shadow-xl relative">
        <div className="flex items-center gap-3 mb-3">
          <LogoIcon size={36} />
          <div>
            <h3 className="text-sm font-bold text-[#F2F3F8] font-heading">
              AI Coach Executive Analysis
            </h3>
            <p className="text-[11px] text-[#8B90A8]">
              Synthesized from daily check-ins, velocity, and error patterns
            </p>
          </div>
        </div>

        <div className="text-xs text-[#F2F3F8] leading-relaxed p-4 rounded-xl bg-[#171A2B]/70 border border-[rgba(255,255,255,0.07)] whitespace-pre-line">
          {currentSummary}
        </div>
      </div>

      {/* Wins & Next Week Roadmap Calibration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Wins */}
        <div className="rounded-2xl glass-panel border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5">
          <h3 className="text-xs font-bold text-[#F2F3F8] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="h-4 w-4 text-[#F5B544]" />
            <span>Key Breakthroughs & Wins</span>
          </h3>
          <ul className="space-y-2.5">
            {weeklyReview.keyWins.map((win, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#171A2B]/40 border border-[rgba(255,255,255,0.05)] text-xs text-[#F2F3F8]"
              >
                <CheckCircle className="h-4 w-4 text-[#3DDC97] shrink-0 mt-0.5" />
                <span>{win}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Week's AI Adapted Plan */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5">
          <h3 className="text-xs font-bold text-[#F2F3F8] uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#7C6CFF]" />
            <span>Next Week's Adaptive Adjustments</span>
          </h3>
          <ul className="space-y-2.5">
            {weeklyReview.nextWeekFocus.map((focus, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8]"
              >
                <ArrowRight className="h-4 w-4 text-[#7C6CFF] shrink-0 mt-0.5" />
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shareable Retrospective Card Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-[#7C6CFF]" />
                <h3 className="text-sm font-bold text-[#F2F3F8]">
                  Share Weekly Accomplishment Card
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Visual Card Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#11131F] via-[#0A0B14] to-[#171A2B] border-2 border-[#7C6CFF]/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#7C6CFF] to-[#4F8BFF] flex items-center justify-center text-white font-bold text-xs">
                    S
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F2F3F8]">Saathi AI Retrospective</h4>
                    <span className="text-[10px] text-[#8B90A8]">{userProfile.name} • Level {userProfile.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5B544]/20 text-[#F5B544] text-xs font-bold border border-[#F5B544]/30">
                  <Flame className="h-3.5 w-3.5 fill-[#F5B544]" />
                  <span>{userProfile.streakDays} Day Streak</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0B14]/80 border border-[rgba(255,255,255,0.07)]">
                <div className="text-[11px] font-semibold text-[#7C6CFF] mb-0.5">Focus Goal</div>
                <div className="text-sm font-bold text-[#F2F3F8]">{activeGoal?.title || "Focus Mission"}</div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[10px] text-[#8B90A8]">Consistency</div>
                  <div className="text-base font-bold text-[#3DDC97]">{weeklyReview.consistencyScorePercent}%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[10px] text-[#8B90A8]">Tasks Done</div>
                  <div className="text-base font-bold text-[#F2F3F8]">{weeklyReview.tasksCompleted}/{weeklyReview.tasksTotal}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)]">
                  <div className="text-[10px] text-[#8B90A8]">Focus Hours</div>
                  <div className="text-base font-bold text-[#7C6CFF]">{weeklyReview.totalHoursSpent}h</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#0A0B14]/60 border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8] flex items-start gap-2">
                <Award className="h-4 w-4 text-[#F5B544] shrink-0 mt-0.5" />
                <span><strong>Top Breakthrough:</strong> {weeklyReview.keyWins[0]}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B] transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyShareCard}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-90 text-white font-semibold text-xs shadow-lg shadow-[#7C6CFF]/25 transition-opacity"
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
