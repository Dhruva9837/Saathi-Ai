"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Compass,
  Zap,
  BarChart3,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const [simScenario, setSimScenario] = useState<"under" | "over" | "struggling">("under");

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1E293B] bg-[#0B1120]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366F1] text-white shadow-sm">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold text-lg text-[#F8FAFC]">
              Saathi <span className="text-[#818CF8]">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#94A3B8]">
            <a href="#how-it-works" className="hover:text-[#F8FAFC] transition-colors">
              How It Works
            </a>
            <a href="#adaptation-demo" className="hover:text-[#F8FAFC] transition-colors">
              Adaptive Engine
            </a>
            <a href="#comparison" className="hover:text-[#F8FAFC] transition-colors">
              Why Saathi
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E2E] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Start Free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151E2E] border border-[#1E293B] text-xs font-medium text-[#818CF8] mb-6">
          <Sparkles className="h-3.5 w-3.5 text-[#818CF8]" />
          <span>Adaptive AI Productivity Coach</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight font-heading text-[#F8FAFC] max-w-4xl mx-auto leading-[1.15]">
          An AI Coach that adapts your plan to{" "}
          <span className="text-[#818CF8]">what you actually achieve.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Static to-do lists fail when life gets busy. Saathi AI creates realistic roadmaps for DSA, languages, and exams, then continuously adapts your daily workload as you check in.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <span>Create Personalized Roadmap</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#151E2E] border border-[#1E293B] hover:border-[#334155] text-[#F8FAFC] text-xs font-semibold transition-colors"
          >
            <Play className="h-3.5 w-3.5 fill-[#818CF8] text-[#818CF8]" />
            <span>Live Dashboard Demo</span>
          </Link>
        </div>

        {/* Value Props */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
            <span>Continuous Feedback Loop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
            <span>Zero Guilt Rescheduling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
            <span>Context-Aware AI Mentor</span>
          </div>
        </div>
      </section>

      {/* Adaptive Simulator Demo */}
      <section id="adaptation-demo" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-[#818CF8] uppercase tracking-wider">
            Live Engine Demo
          </span>
          <h2 className="text-2xl font-bold text-[#F8FAFC] font-heading mt-1">
            See Adaptive Planning in Action
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-lg mx-auto">
            Choose a scenario to see how Saathi AI recalculates daily pacing automatically.
          </p>
        </div>

        {/* Scenario Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-6">
          <button
            onClick={() => setSimScenario("under")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              simScenario === "under"
                ? "bg-[#1E293B] text-[#F8FAFC] border border-[#818CF8]"
                : "bg-[#151E2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Scenario 1: College Exam (Only 35m)
          </button>
          <button
            onClick={() => setSimScenario("struggling")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              simScenario === "struggling"
                ? "bg-[#1E293B] text-[#F8FAFC] border border-[#818CF8]"
                : "bg-[#151E2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Scenario 2: Struggling on Recursion
          </button>
          <button
            onClick={() => setSimScenario("over")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              simScenario === "over"
                ? "bg-[#1E293B] text-[#F8FAFC] border border-[#818CF8]"
                : "bg-[#151E2E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            Scenario 3: Fast Velocity
          </button>
        </div>

        {/* Simulator Display Card */}
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Static Plan */}
            <div className="p-5 rounded-lg bg-[#0B1120] border border-[#1E293B]">
              <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
                Static Traditional To-Do
              </div>
              <div className="text-lg font-bold text-[#F8FAFC] font-mono mb-3">
                {simScenario === "under"
                  ? "Planned: 2 Hours / Day"
                  : simScenario === "struggling"
                  ? "Fixed Hard (5 Problems)"
                  : "Planned: 60m / Standard Pace"}
              </div>
              <div className="space-y-2 text-xs text-[#94A3B8]">
                <div className="p-2 rounded bg-[#151E2E] border border-[#1E293B]">
                  ✗ Ignores daily real-life schedule variations
                </div>
                <div className="p-2 rounded bg-[#151E2E] border border-[#1E293B]">
                  ✗ Piles uncompleted tasks into an overwhelming backlog
                </div>
              </div>
            </div>

            {/* Saathi AI Adapted Plan */}
            <div className="p-5 rounded-lg bg-[#151E2E] border border-[#334155]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#818CF8] uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-[#818CF8]" />
                  Saathi AI Adapted Plan
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E293B] text-[#22C55E] font-medium border border-[#22C55E]/30">
                  Calibrated
                </span>
              </div>

              <div className="text-lg font-bold text-[#F8FAFC] font-mono mb-3 flex items-center gap-2">
                {simScenario === "under" ? (
                  <>
                    <span>Target: 45m / Day</span>
                    <TrendingDown className="h-4 w-4 text-[#F59E0B]" />
                  </>
                ) : simScenario === "struggling" ? (
                  <>
                    <span>Intuition Scaffold + 2 Drills</span>
                    <Sparkles className="h-4 w-4 text-[#818CF8]" />
                  </>
                ) : (
                  <>
                    <span>Accelerated Phase (+15m)</span>
                    <TrendingUp className="h-4 w-4 text-[#22C55E]" />
                  </>
                )}
              </div>

              <div className="space-y-2 text-xs text-[#F8FAFC]">
                {simScenario === "under" && (
                  <>
                    <div className="p-2 rounded bg-[#0B1120] border border-[#1E293B] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                      <span>Deprioritized secondary reading; locked in core drills.</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B1120] border border-[#1E293B] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                      <span>Rescheduled missed items across 3 days without backlog guilt.</span>
                    </div>
                  </>
                )}
                {simScenario === "struggling" && (
                  <>
                    <div className="p-2 rounded bg-[#0B1120] border border-[#1E293B] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                      <span>Inserted 1 visual recursion breakdown before medium problems.</span>
                    </div>
                    <div className="p-2 rounded bg-[#0B1120] border border-[#1E293B] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                      <span>Flagged Recursion as focus weak area for weekly AI review.</span>
                    </div>
                  </>
                )}
                {simScenario === "over" && (
                  <>
                    <div className="p-2 rounded bg-[#0B1120] border border-[#1E293B] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                      <span>Fast-tracked milestone schedule by 4 days based on high velocity.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Continuous Feedback Cycle */}
      <section id="how-it-works" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#818CF8] uppercase tracking-wider">
            Framework
          </span>
          <h2 className="text-2xl font-bold text-[#F8FAFC] font-heading mt-1">
            Plan → Execute → Track → Analyze → Adapt
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-lg mx-auto">
            Traditional tools stop at tracking. Saathi AI completes the cycle with continuous adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {[
            {
              step: "01",
              title: "Plan",
              desc: "AI creates a realistic roadmap broken into milestones and daily missions.",
              icon: Compass,
            },
            {
              step: "02",
              title: "Execute",
              desc: "Focus on today's prioritized mission with live timers and difficulty indicators.",
              icon: Zap,
            },
            {
              step: "03",
              title: "Track",
              desc: "1-minute AI daily check-in logs actual time, difficulty friction, and blockers.",
              icon: CheckCircle2,
            },
            {
              step: "04",
              title: "Analyze",
              desc: "Evaluator engine discovers patterns (fatigue, fast progress, recurring blockers).",
              icon: BarChart3,
            },
            {
              step: "05",
              title: "Adapt",
              desc: "AI rebalances tomorrow's schedule so you never fall behind or burn out.",
              icon: RefreshCw,
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                className="p-4 rounded-xl border border-[#1E293B] bg-[#151E2E] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-[#94A3B8] font-mono">
                      {card.step}
                    </span>
                    <Icon className="h-4 w-4 text-[#818CF8]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F8FAFC] mb-1.5">{card.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Section */}
      <section id="comparison" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold text-[#818CF8] uppercase tracking-wider">
            Comparison
          </span>
          <h2 className="text-2xl font-bold text-[#F8FAFC] font-heading mt-1">
            Why Static Apps Fail vs Saathi AI
          </h2>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#1E293B] bg-[#151E2E]">
          <div className="grid grid-cols-3 p-3.5 bg-[#0B1120] border-b border-[#1E293B] text-xs font-semibold">
            <div className="text-[#F8FAFC]">Feature</div>
            <div className="text-[#94A3B8]">Generic To-Do Apps</div>
            <div className="text-[#818CF8]">Saathi AI Coach</div>
          </div>
          <div className="divide-y divide-[#1E293B] text-xs">
            {[
              {
                feature: "Roadmap Adaptation",
                generic: "Static list; user must manually reschedule",
                saathi: "Auto-adapts daily load based on velocity",
              },
              {
                feature: "Feedback Loop",
                generic: "One-off study plan; forgotten next day",
                saathi: "Daily check-in logs friction & calibrates roadmap",
              },
              {
                feature: "Handling Overwhelm",
                generic: "Overdue tasks stack up into stressful backlogs",
                saathi: "Smart rescheduling & topic reprioritization",
              },
              {
                feature: "Mentor Context",
                generic: "Generic ChatGPT prompt without progress context",
                saathi: "Aware of streak, weak areas & past check-ins",
              },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 p-3.5 items-center gap-2">
                <div className="font-medium text-[#F8FAFC]">{row.feature}</div>
                <div className="text-[#94A3B8]">{row.generic}</div>
                <div className="text-[#F8FAFC] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#22C55E] shrink-0" />
                  <span>{row.saathi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-8 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] font-heading">
            Ready to achieve your goals with an AI coach?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
            Set up your custom roadmap for DSA, Languages, or Exams in under 2 minutes.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="px-6 py-2.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs shadow-sm transition-colors"
            >
              Start Free Coaching
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg bg-[#0B1120] border border-[#1E293B] hover:border-[#334155] text-[#F8FAFC] text-xs font-semibold transition-colors"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E293B] py-6 text-center text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-[#818CF8]" />
            <span className="font-semibold text-[#F8FAFC]">Saathi AI</span>
            <span>• Adaptive Productivity Coach</span>
          </div>
          <div>Built for ambitious learners, developers, and students.</div>
        </div>
      </footer>
    </div>
  );
}
