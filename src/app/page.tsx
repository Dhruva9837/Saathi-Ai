"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Compass,
  Calendar,
  Layers,
  BotMessageSquare,
  BarChart3,
  Zap,
  ShieldCheck,
  Award,
  ChevronRight,
  Play,
} from "lucide-react";

export default function LandingPage() {
  // Interactive Simulator state
  const [simScenario, setSimScenario] = useState<"under" | "over" | "struggling">("under");

  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-primary-500 selection:text-white">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-surfaceBorder/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-primary-500/25">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-white">
              Saathi <span className="text-gradient-brand">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#adaptation-demo" className="hover:text-white transition-colors">
              Adaptive Engine Demo
            </a>
            <a href="#comparison" className="hover:text-white transition-colors">
              Why Saathi AI
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-surfaceLight transition-colors"
            >
              Live Demo
            </Link>
            <Link
              href="/onboarding"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-cyan text-white text-xs font-bold shadow-lg shadow-primary-500/20 hover:from-primary-500 hover:to-cyan-500 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Start Coaching Free</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary-500/30 text-xs font-semibold text-primary-300 mb-8 shadow-inner shadow-primary-500/10 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>The Next Generation Adaptive Productivity Coach</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-white max-w-5xl mx-auto leading-[1.15]">
          An AI Coach that changes your plan based on{" "}
          <span className="text-gradient-brand">what you actually do.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Forget rigid static to-do lists. Saathi AI creates realistic roadmaps for DSA, languages, and exams, then continuously adapts your daily tasks as life happens.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-accent-cyan text-white font-bold text-sm shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.03] transition-all"
          >
            <span>Create Your Personalized Goal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl glass-panel border border-surfaceBorder hover:border-slate-500 text-slate-200 hover:text-white text-sm font-bold transition-all"
          >
            <Play className="h-4 w-4 text-accent-cyan fill-accent-cyan" />
            <span>Explore Live Dashboard</span>
          </Link>
        </div>

        {/* Social Proof / Stats Pill */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
            <span>Continuous Feedback Loop</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
            <span>Zero Guilt Rescheduling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-accent-emerald" />
            <span>Deep Context-Aware Mentor</span>
          </div>
        </div>
      </section>

      {/* Interactive Adaptive Simulator Demo */}
      <section id="adaptation-demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
            Live Core USP Demo
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
            See Adaptive Coaching in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Try different real-world situations and watch how Saathi AI dynamically adjusts your roadmap in real-time.
          </p>
        </div>

        {/* Scenario Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setSimScenario("under")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              simScenario === "under"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10"
                : "glass-panel border-surfaceBorder text-slate-400 hover:text-white"
            }`}
          >
            Scenario 1: College Exam (Only 35m Available)
          </button>
          <button
            onClick={() => setSimScenario("struggling")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              simScenario === "struggling"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10"
                : "glass-panel border-surfaceBorder text-slate-400 hover:text-white"
            }`}
          >
            Scenario 2: Struggling on Recursion (High Friction)
          </button>
          <button
            onClick={() => setSimScenario("over")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              simScenario === "over"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10"
                : "glass-panel border-surfaceBorder text-slate-400 hover:text-white"
            }`}
          >
            Scenario 3: Fast Learner (Breezed through Tasks)
          </button>
        </div>

        {/* Simulator Display Card */}
        <div className="rounded-3xl glass-panel-glow border border-surfaceBorder bg-surface/90 p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old / Default Plan */}
            <div className="p-5 rounded-2xl bg-surfaceLight/40 border border-surfaceBorder">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Static Traditional Plan
              </div>
              <div className="text-xl font-bold text-slate-300 font-mono mb-3">
                {simScenario === "under"
                  ? "Planned: 2 Hours / Day"
                  : simScenario === "struggling"
                  ? "Difficulty: Fixed Hard (5 Problems)"
                  : "Planned: 60m / Standard Pace"}
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="p-2.5 rounded-lg bg-surface border border-surfaceBorder">
                  ✗ Ignores daily real-life schedule variations
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-surfaceBorder">
                  ✗ Piles uncompleted tasks into a massive guilt backlog
                </div>
                <div className="p-2.5 rounded-lg bg-surface border border-surfaceBorder">
                  ✗ Leaves you stuck on difficult concepts with generic advice
                </div>
              </div>
            </div>

            {/* Saathi AI Adapted Plan */}
            <div className="p-5 rounded-2xl bg-primary-600/15 border border-primary-500/40 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-primary-300 uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-accent-cyan animate-spin-slow" />
                  Saathi AI Adapted Plan
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-emerald/20 text-accent-emerald font-bold border border-accent-emerald/30">
                  Auto-Calibrated
                </span>
              </div>

              <div className="text-xl font-bold text-accent-cyan font-mono mb-3 flex items-center gap-2">
                {simScenario === "under" ? (
                  <>
                    <span>Target: 45m / Day</span>
                    <TrendingDown className="h-4 w-4 text-amber-400" />
                  </>
                ) : simScenario === "struggling" ? (
                  <>
                    <span>Intuition Scaffold + 2 Guided Drills</span>
                    <Sparkles className="h-4 w-4 text-purple-400" />
                  </>
                ) : (
                  <>
                    <span>Target: Accelerated Level (Intermediate)</span>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-200">
                {simScenario === "under" && (
                  <>
                    <div className="p-2.5 rounded-lg bg-surfaceLight border border-surfaceBorder/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                      <span>Filtered out low-priority reading; preserved high-yield drills.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surfaceLight border border-surfaceBorder/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                      <span>Smart-rescheduled missed items across 3 days without guilt.</span>
                    </div>
                  </>
                )}
                {simScenario === "struggling" && (
                  <>
                    <div className="p-2.5 rounded-lg bg-surfaceLight border border-surfaceBorder/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                      <span>Inserted 1 visual base-case tutorial before medium exercises.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surfaceLight border border-surfaceBorder/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                      <span>Flagged Recursion as a focus weak area for weekly AI review.</span>
                    </div>
                  </>
                )}
                {simScenario === "over" && (
                  <>
                    <div className="p-2.5 rounded-lg bg-surfaceLight border border-surfaceBorder/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                      <span>Fast-tracked milestone schedule by 4 days based on high velocity.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surfaceLight border border-surfaceBorder/80 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                      <span>Unlocked advanced pattern challenges.</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Continuous Feedback Cycle */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
            Coaching Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
            Plan → Execute → Track → Analyze → Adapt
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Traditional tools stop at step 3. Saathi AI completes the cycle with continuous adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Plan",
              desc: "AI creates a realistic roadmap broken into milestones, weekly targets & daily missions.",
              icon: Compass,
              color: "text-primary-400",
            },
            {
              step: "02",
              title: "Execute",
              desc: "Focus on today's prioritized mission with live timers and difficulty indicators.",
              icon: Zap,
              color: "text-accent-cyan",
            },
            {
              step: "03",
              title: "Track",
              desc: "1-minute AI daily check-in logs actual time, difficulty friction, and blockers.",
              icon: CheckCircle2,
              color: "text-accent-emerald",
            },
            {
              step: "04",
              title: "Analyze",
              desc: "Evaluator engine discovers patterns (e.g. fatigue, fast progress, recurring bottlenecks).",
              icon: BarChart3,
              color: "text-amber-400",
            },
            {
              step: "05",
              title: "Adapt",
              desc: "AI rebalances tomorrow's schedule and difficulty so you never fall behind or burn out.",
              icon: RefreshCw,
              color: "text-accent-purple",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                className="p-5 rounded-2xl glass-panel border border-surfaceBorder bg-surface/70 flex flex-col justify-between glass-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      {card.step}
                    </span>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-accent-emerald uppercase tracking-wider">
            Comparison
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
            Why Static Apps Fail & How Saathi AI Wins
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl glass-panel border border-surfaceBorder shadow-2xl">
          <div className="grid grid-cols-3 p-4 bg-surfaceLight/80 border-b border-surfaceBorder text-xs font-bold">
            <div className="text-slate-300">Feature</div>
            <div className="text-slate-400">Generic To-Do & LLM Chatbots</div>
            <div className="text-primary-300">Saathi AI Coach Agent</div>
          </div>
          <div className="divide-y divide-surfaceBorder/60 text-xs">
            {[
              {
                feature: "Roadmap Adaptation",
                generic: "Static list; user must manually reschedule",
                saathi: "Auto-adapts daily load based on velocity",
              },
              {
                feature: "Feedback Loop",
                generic: "One-off generated study plan; forgotten next day",
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
                saathi: "Aware of your streak, weak areas & past check-ins",
              },
              {
                feature: "Weekly Retrospective",
                generic: "Basic numeric graphs or no reviews",
                saathi: "AI synthesizes weak areas & sets next week focus",
              },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 p-4 items-center gap-2">
                <div className="font-semibold text-slate-200">{row.feature}</div>
                <div className="text-slate-400">{row.generic}</div>
                <div className="text-accent-cyan font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0" />
                  <span>{row.saathi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl glass-panel-glow border border-primary-500/40 bg-gradient-to-tr from-primary-950/60 via-surface to-surface p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Ready to achieve your goals with an AI coach that adapts to you?
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto">
            Set up your custom roadmap for DSA, Languages, or College Exams in under 2 minutes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-cyan text-white font-bold text-xs shadow-xl shadow-primary-500/25 hover:scale-105 transition-all"
            >
              Start Free Coaching
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-surfaceLight border border-surfaceBorder text-slate-300 hover:text-white text-xs font-semibold"
            >
              Open Live Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surfaceBorder/60 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-primary-400" />
            <span className="font-bold text-slate-300">Saathi AI</span>
            <span>• Adaptive Productivity Coach</span>
          </div>
          <div>Built for ambitious learners, students, and developers.</div>
        </div>
      </footer>
    </div>
  );
}
