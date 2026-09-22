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
} from "lucide-react";

export const WeeklyReviewView: React.FC = () => {
  const { weeklyReview, activeGoal } = useCoach();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState(weeklyReview.aiExecutiveSummary);

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
            streakDays: 7,
            weakAreas: activeGoal?.weakAreas || ["Recursion & Backtracking"],
            strongAreas: activeGoal?.strongAreas || ["Arrays & Two Pointers"],
            targetDailyMinutes: activeGoal?.dailyMinutesTarget || 60,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl glass-panel-glow border border-surfaceBorder p-6 bg-gradient-to-r from-surface to-primary-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-purple/20 border border-accent-purple/30 text-accent-purple text-[10px] font-bold uppercase tracking-wider">
                Automated Retrospective
              </span>
              <span className="text-slate-400 text-xs">• Weekly AI Review</span>
            </div>
            <h2 className="text-xl font-extrabold text-white font-heading">
              Week {weeklyReview.weekStartDate} — {weeklyReview.weekEndDate}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Goal Focus: <span className="text-primary-300 font-medium">{activeGoal?.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 rounded-xl bg-accent-emerald/15 border border-accent-emerald/30 text-accent-emerald text-xs font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{weeklyReview.consistencyScorePercent}% Consistency Score</span>
            </span>
            <button
              onClick={handleRefreshReview}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl bg-surface border border-surfaceBorder hover:border-primary-500 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
              title="Generate fresh AI insights"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary-400" : "text-slate-400"}`} />
              <span>{isRefreshing ? "Re-evaluating..." : "Re-evaluate"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-surfaceBorder bg-surface/70">
          <div className="text-xs text-slate-400 font-medium mb-1">Tasks Completed</div>
          <div className="text-2xl font-bold text-white font-mono">
            {weeklyReview.tasksCompleted}/{weeklyReview.tasksTotal}
          </div>
          <div className="text-[10px] text-accent-emerald mt-1 font-semibold">
            {weeklyReview.completionRatePercent}% Hit Rate
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-surfaceBorder bg-surface/70">
          <div className="text-xs text-slate-400 font-medium mb-1">Time Invested</div>
          <div className="text-2xl font-bold text-accent-cyan font-mono">
            {weeklyReview.totalHoursSpent} hrs
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Across 7 active days
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-surfaceBorder bg-surface/70">
          <div className="text-xs text-slate-400 font-medium mb-1">Top Strength</div>
          <div className="text-lg font-bold text-accent-emerald truncate">
            {weeklyReview.strongAreas[0]}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Mastery achieved
          </div>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-surfaceBorder bg-surface/70">
          <div className="text-xs text-slate-400 font-medium mb-1">Target Weakness</div>
          <div className="text-lg font-bold text-rose-400 truncate">
            {weeklyReview.weakAreas[0]}
          </div>
          <div className="text-[10px] text-rose-300/80 mt-1">
            Scaffolded for next week
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
        <div className="rounded-2xl glass-panel border border-primary-500/30 bg-surface/80 p-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-400" />
            <span>Next Week's Adaptive Adjustments</span>
          </h3>
          <ul className="space-y-2.5">
            {weeklyReview.nextWeekFocus.map((focus, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-primary-600/10 border border-primary-500/30 text-xs text-primary-200"
              >
                <ArrowRight className="h-4 w-4 text-primary-400 shrink-0 mt-0.5" />
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
