"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
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
  Flame,
  Clock,
  Volume2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Target,
  Bot,
  Sliders,
} from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { Logo, LogoIcon } from "@/components/brand/Logo";

export default function LandingPage() {
  const [simScenario, setSimScenario] = useState<"under" | "over" | "struggling">("under");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Saathi AI adapt my plan when I miss a day?",
      a: "Unlike traditional static to-do lists that pile missed tasks into an overwhelming backlog, Saathi AI recalculates your upcoming daily velocity. It redistributes uncompleted items gradually across 2-3 future days without increasing daily fatigue or stress.",
    },
    {
      q: "Can I use Saathi AI for any subject or goal?",
      a: "Yes! Whether you're preparing for DSA technical interviews, learning languages (like Japanese JLPT), preparing for competitive exams (UPSC, GATE, GRE), or shipping software projects, Saathi AI breaks any ambitious goal into structured milestones.",
    },
    {
      q: "What are AI Coach Personas?",
      a: "You can customize your AI Coach's communication style anytime in settings: choose between Empathetic Mentor (compassionate & sustainable), Drill Sergeant (high accountability & direct), Scientific Biohacker (data-driven retention curves), or Socratic Guide (first-principles reasoning).",
    },
    {
      q: "Is my progress saved across devices?",
      a: "Yes, Saathi AI syncs seamlessly with Supabase cloud authentication so your streaks, roadmaps, and AI check-in history are accessible anywhere.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0B14] text-[#F2F3F8] selection:bg-[#7C6CFF]/30 selection:text-white relative overflow-hidden font-sans">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#7C6CFF]/15 via-[#4F8BFF]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-[#7C6CFF]/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[60%] left-[-10%] w-[500px] h-[500px] bg-[#4F8BFF]/10 blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.07)] bg-[#0A0B14]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href="/" size="sm" subtitle="AI Coach" />

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#8B90A8]">
            <a href="#how-it-works" className="hover:text-[#F2F3F8] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#F2F3F8] transition-colors">
              Features
            </a>
            <a href="#adaptation-demo" className="hover:text-[#F2F3F8] transition-colors">
              Adaptive Engine
            </a>
            <a href="#faq" className="hover:text-[#F2F3F8] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[#7C6CFF]/25 transition-all transform active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Start Free</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6352E8] to-[#4F8BFF] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Glowing Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11131F] border border-[rgba(255,255,255,0.1)] text-xs font-medium text-[#7C6CFF] mb-8 shadow-inner hover:border-[#7C6CFF]/40 transition-colors cursor-default">
          <span className="flex h-2 w-2 rounded-full bg-[#3DDC97] animate-pulse" />
          <span className="text-[#F2F3F8] font-semibold">Adaptive Engine 2.0</span>
          <span className="text-[#8B90A8]">• Zero Backlog Guilt</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-heading text-[#F2F3F8] max-w-5xl mx-auto leading-[1.12]">
          An AI Coach that adapts your plan to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C6CFF] via-[#4F8BFF] to-[#3DDC97]">
            what you actually achieve.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-lg text-[#8B90A8] max-w-2xl mx-auto leading-relaxed">
          Static to-do lists cause burnout when life gets busy. Saathi AI creates realistic roadmaps for DSA, Exams, and Career targets, then continuously recalibrates your workload as you check in.
        </p>

        {/* CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-[#7C6CFF]/30 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <span>Start Free Coaching</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] text-[#F2F3F8] text-xs font-semibold hover:bg-[#171A2B] transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-[#7C6CFF] text-[#7C6CFF]" />
            <span>Interactive Demo</span>
          </Link>
        </div>

        {/* Social Proof Metric Highlights */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#11131F]/80 border border-[rgba(255,255,255,0.06)] backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F2F3F8]">100%</div>
            <div className="text-[11px] text-[#8B90A8] mt-0.5">Dynamic Pacing</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11131F]/80 border border-[rgba(255,255,255,0.06)] backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#3DDC97]">94%</div>
            <div className="text-[11px] text-[#8B90A8] mt-0.5">Target Completion Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11131F]/80 border border-[rgba(255,255,255,0.06)] backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5B544]">0</div>
            <div className="text-[11px] text-[#8B90A8] mt-0.5">Guilt Backlogs</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#11131F]/80 border border-[rgba(255,255,255,0.06)] backdrop-blur-md">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-[#7C6CFF]">4</div>
            <div className="text-[11px] text-[#8B90A8] mt-0.5">AI Coach Personas</div>
          </div>
        </div>

        {/* Hero Interactive App Window Preview */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#11131F]/90 p-2 sm:p-3 shadow-2xl shadow-[#7C6CFF]/10 backdrop-blur-xl">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.06)] mb-3">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B7A]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#F5B544]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#3DDC97]" />
            </div>
            <div className="text-[11px] text-[#8B90A8] font-mono flex items-center gap-1.5">
              <LogoIcon size={16} />
              <span>Saathi AI Intelligent Cockpit</span>
            </div>
            <div className="w-10" />
          </div>

          {/* App Preview Content Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left p-2 sm:p-4">
            {/* Box 1: AI Coach Daily Briefing */}
            <div className="p-4 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#7C6CFF] mb-2">
                  <Bot className="h-4 w-4" />
                  <span>AI Coach Daily Briefing</span>
                </div>
                <p className="text-xs text-[#F2F3F8] leading-relaxed">
                  "Good morning! Based on your check-in, you had friction on Two-Pointer edge cases. Today I've scheduled 2 targeted visual intuition drills before your main problems."
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[10px] text-[#8B90A8]">
                <span>Persona: Empathetic Mentor</span>
                <span className="text-[#3DDC97] font-semibold">Active</span>
              </div>
            </div>

            {/* Box 2: Live Focus Room */}
            <div className="p-4 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] flex flex-col justify-between text-center">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#8B90A8] mb-2">
                  <span>Focus Sprint</span>
                  <Flame className="h-4 w-4 text-[#F5B544] fill-[#F5B544]" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-[#F2F3F8] my-1">
                  25:00
                </div>
                <div className="text-[10px] text-[#7C6CFF] uppercase font-bold tracking-wider">
                  Deep Flow Mode
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-around text-[10px] text-[#8B90A8]">
                <span className="flex items-center gap-1 text-[#4F8BFF]"><Volume2 className="h-3 w-3" /> Rain Lofi</span>
                <span>•</span>
                <span>Gamma 40Hz</span>
              </div>
            </div>

            {/* Box 3: Automated Adaptation */}
            <div className="p-4 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#3DDC97] mb-2">
                  <span className="flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Pacing Calibrated</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3DDC97]/20 text-[#3DDC97]">+15% Velocity</span>
                </div>
                <div className="space-y-1.5 text-xs text-[#8B90A8]">
                  <div className="flex items-center gap-2 text-[#F2F3F8]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#3DDC97] shrink-0" />
                    <span>3 Tasks completed today</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#F2F3F8]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#3DDC97] shrink-0" />
                    <span>Tomorrow adjusted to 45m</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] text-[10px] text-[#8B90A8]">
                No task backlog created
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-[#7C6CFF] uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F3F8] font-heading mt-2">
            Built for Serious Execution, Not Endless Backlogs
          </h2>
          <p className="text-xs sm:text-sm text-[#8B90A8] mt-2 max-w-xl mx-auto">
            Everything you need to turn vague ambitions into daily, high-focus momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] hover:border-[#7C6CFF]/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-11 w-11 rounded-xl bg-[#7C6CFF]/15 border border-[#7C6CFF]/30 text-[#7C6CFF] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F3F8] mb-2">
                1. AI Roadmap Scaffolding
              </h3>
              <p className="text-xs text-[#8B90A8] leading-relaxed">
                Tell Saathi AI your goal and timeline. It generates ordered milestone phases, daily estimated tasks, and progressive difficulty tiers.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] hover:border-[#7C6CFF]/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-11 w-11 rounded-xl bg-[#3DDC97]/15 border border-[#3DDC97]/30 text-[#3DDC97] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F3F8] mb-2">
                2. Adaptive Closed-Loop Engine
              </h3>
              <p className="text-xs text-[#8B90A8] leading-relaxed">
                Complete a 60-second daily check-in. If you faced blockers or had limited time, Saathi automatically redistributes tasks across upcoming days.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] hover:border-[#7C6CFF]/40 transition-all group flex flex-col justify-between">
            <div>
              <div className="h-11 w-11 rounded-xl bg-[#4F8BFF]/15 border border-[#4F8BFF]/30 text-[#4F8BFF] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F2F3F8] mb-2">
                3. Ambient Zen Focus Room
              </h3>
              <p className="text-xs text-[#8B90A8] leading-relaxed">
                Custom Pomodoro sprints equipped with procedural rain, ocean waves, white noise, and 40Hz Gamma binaural soundscapes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Adaptation Simulator Demo */}
      <section id="adaptation-demo" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#7C6CFF] uppercase tracking-wider">
            Live Engine Demo
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F3F8] font-heading mt-1">
            See Adaptive Planning in Action
          </h2>
          <p className="text-xs text-[#8B90A8] mt-1 max-w-lg mx-auto">
            Select a real-world friction scenario to see how Saathi AI recalculates daily pacing automatically.
          </p>
        </div>

        {/* Scenario Toggle Buttons */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-6">
          <button
            onClick={() => setSimScenario("under")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              simScenario === "under"
                ? "bg-[#171A2B] text-[#F2F3F8] border border-[#7C6CFF] shadow-md shadow-[#7C6CFF]/20"
                : "bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
            }`}
          >
            Scenario 1: College Exam (Only 35m)
          </button>
          <button
            onClick={() => setSimScenario("struggling")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              simScenario === "struggling"
                ? "bg-[#171A2B] text-[#F2F3F8] border border-[#7C6CFF] shadow-md shadow-[#7C6CFF]/20"
                : "bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
            }`}
          >
            Scenario 2: Stuck on Hard Concept
          </button>
          <button
            onClick={() => setSimScenario("over")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              simScenario === "over"
                ? "bg-[#171A2B] text-[#F2F3F8] border border-[#7C6CFF] shadow-md shadow-[#7C6CFF]/20"
                : "bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
            }`}
          >
            Scenario 3: Fast Velocity Sprints
          </button>
        </div>

        {/* Simulator Display Card */}
        <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#11131F] p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Static Plan */}
            <div className="p-5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)]">
              <div className="text-[11px] font-bold text-[#8B90A8] uppercase tracking-wider mb-2">
                Static Traditional To-Do
              </div>
              <div className="text-lg font-bold text-[#F2F3F8] font-mono mb-3">
                {simScenario === "under"
                  ? "Fixed: 2 Hours / Day"
                  : simScenario === "struggling"
                  ? "Fixed 5 Hard Problems"
                  : "Fixed 60m / Day Standard"}
              </div>
              <div className="space-y-2 text-xs text-[#8B90A8]">
                <div className="p-2.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.05)]">
                  ✗ Ignores daily schedule variations
                </div>
                <div className="p-2.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.05)]">
                  ✗ Missed tasks accumulate into massive backlog guilt
                </div>
              </div>
            </div>

            {/* Saathi AI Adapted Plan */}
            <div className="p-5 rounded-xl bg-[#11131F] border border-[#7C6CFF]/40 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#7C6CFF] uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-[#7C6CFF]" />
                  Saathi AI Adapted Plan
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#171A2B] text-[#3DDC97] font-semibold border border-[#3DDC97]/30">
                  Calibrated
                </span>
              </div>

              <div className="text-lg font-bold text-[#F2F3F8] font-mono mb-3 flex items-center gap-2">
                {simScenario === "under" ? (
                  <>
                    <span>Target: 35m Focus Sprint</span>
                    <TrendingDown className="h-4 w-4 text-[#F5B544]" />
                  </>
                ) : simScenario === "struggling" ? (
                  <>
                    <span>Intuition Scaffold + 2 Drills</span>
                    <Sparkles className="h-4 w-4 text-[#7C6CFF]" />
                  </>
                ) : (
                  <>
                    <span>Accelerated Phase (+15m)</span>
                    <TrendingUp className="h-4 w-4 text-[#3DDC97]" />
                  </>
                )}
              </div>

              <div className="space-y-2 text-xs text-[#F2F3F8]">
                {simScenario === "under" && (
                  <>
                    <div className="p-2.5 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3DDC97] shrink-0" />
                      <span>Deprioritized secondary reading; locked in 1 high-leverage drill.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3DDC97] shrink-0" />
                      <span>Distributed missed tasks over 3 days (+10m/day) without stress.</span>
                    </div>
                  </>
                )}
                {simScenario === "struggling" && (
                  <>
                    <div className="p-2.5 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3DDC97] shrink-0" />
                      <span>Inserted visual mental model breakdown before medium drills.</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3DDC97] shrink-0" />
                      <span>Flagged as focus weak area for weekly AI retrospective review.</span>
                    </div>
                  </>
                )}
                {simScenario === "over" && (
                  <>
                    <div className="p-2.5 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3DDC97] shrink-0" />
                      <span>Fast-tracked milestone schedule by 4 days based on strong velocity.</span>
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
          <span className="text-xs font-bold text-[#7C6CFF] uppercase tracking-wider">
            Methodology
          </span>
          <h2 className="text-3xl font-extrabold text-[#F2F3F8] font-heading mt-1">
            Plan → Execute → Track → Analyze → Adapt
          </h2>
          <p className="text-xs text-[#8B90A8] mt-2 max-w-lg mx-auto">
            Traditional tools stop at tracking. Saathi AI completes the cycle with continuous adaptation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Plan",
              desc: "AI creates a realistic roadmap broken into ordered milestones and daily missions.",
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
                className="p-5 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] flex flex-col justify-between hover:border-[#7C6CFF]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-[#8B90A8] font-mono">
                      {card.step}
                    </span>
                    <Icon className="h-4 w-4 text-[#7C6CFF]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#F2F3F8] mb-1.5">{card.title}</h3>
                  <p className="text-xs text-[#8B90A8] leading-relaxed">{card.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#7C6CFF] uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2F3F8] font-heading mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-sm font-bold text-[#F2F3F8]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#7C6CFF] shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#8B90A8] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#8B90A8] leading-relaxed border-t border-[rgba(255,255,255,0.05)]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative">
        <div className="rounded-3xl border border-[rgba(255,255,255,0.1)] bg-gradient-to-b from-[#11131F] to-[#0A0B14] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F2F3F8] font-heading relative z-10">
            Ready to achieve your targets with an AI Coach?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#8B90A8] max-w-lg mx-auto relative z-10 leading-relaxed">
            Set up your custom adaptive roadmap for DSA, Languages, or Exams in under 2 minutes.
          </p>
          <div className="mt-8 flex items-center justify-center relative z-10">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-9 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-95 text-white font-bold text-xs shadow-xl shadow-[#7C6CFF]/30 transition-all transform hover:scale-105 active:scale-95"
            >
              Start Free Coaching Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.07)] py-8 text-center text-xs text-[#8B90A8]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" subtitle={null} />
            <span className="text-[#8B90A8] hidden sm:inline">• Adaptive Productivity & Goal Coach</span>
          </div>
          <div>Built for ambitious learners, developers, and knowledge workers.</div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
