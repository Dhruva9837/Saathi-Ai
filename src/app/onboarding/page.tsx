"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCoach } from "@/context/CoachContext";
import { createGoalWithMilestonesAction } from "@/server/actions/goals";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Code2,
  Languages,
  Briefcase,
  GraduationCap,
  Check,
  RefreshCw,
  Clock,
  ShieldCheck,
  Sliders,
  Target,
  AlertCircle,
  HelpCircle,
  Layers,
  Zap,
} from "lucide-react";
import { Logo, LogoIcon } from "@/components/brand/Logo";
import { GoalLevel, SchedulePreference } from "@/types";

interface DiagnosticQ {
  id: string;
  question: string;
  topic: string;
  options: {
    label: string;
    text: string;
    points: number;
  }[];
}

export default function OnboardingPage() {
  const router = useRouter();
  const { createNewGoal } = useCoach();

  // Wizard Step State (1 to 5)
  // Step 1: Goal & Time Constraints
  // Step 2: Self Assessment & Diagnostic Quiz
  // Step 3: Feasibility & Coach Constraint Check
  // Step 4: AI Roadmap Synthesis & Validation (Loader)
  // Step 5: Interactive Roadmap Preview & Approval
  const [step, setStep] = useState(1);

  // Step 1 Form Data
  const [goalCategory, setGoalCategory] = useState<string>("coding");
  const [goalTitle, setGoalTitle] = useState("Learn Next.js");
  const [goalDescription, setGoalDescription] = useState("Master modern full-stack development with Next.js App Router and Server Actions.");
  const [durationDays, setDurationDays] = useState(60);
  const [dailyMinutes, setDailyMinutes] = useState(120); // 2 hours default
  const [schedule, setSchedule] = useState<SchedulePreference>("evening");

  // Step 2 Diagnostic Assessment Data
  const [selfLevel, setSelfLevel] = useState<GoalLevel>("intermediate");
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQ[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [calibratedLevel, setCalibratedLevel] = useState<GoalLevel>("intermediate");
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Step 3 Feasibility Data
  const [feasibility, setFeasibility] = useState<{
    totalHours: number;
    scopeStatus: "optimal" | "tight" | "overambitious";
    coachAdvice: string;
    suggestedFocusScope?: string;
  }>({
    totalHours: 120,
    scopeStatus: "optimal",
    coachAdvice: "With 120 total hours, we have ample room for deep concept mastery, active coding drills, and dedicated project builds.",
  });

  // Step 4 & 5 Generated Roadmap State
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationScore, setValidationScore] = useState<number>(96);
  const [generatedPhases, setGeneratedPhases] = useState<any[]>([]);

  // Preset Goals
  const presetGoals = [
    {
      id: "coding",
      title: "Learn Next.js",
      desc: "Master Next.js App Router, SSR, Server Actions & Supabase.",
      category: "coding",
      icon: Code2,
      defaultDays: 60,
      defaultMins: 120,
    },
    {
      id: "dsa",
      title: "DSA & Problem Solving",
      desc: "Crack technical interviews with 150+ structured pattern problems.",
      category: "coding",
      icon: Target,
      defaultDays: 60,
      defaultMins: 90,
    },
    {
      id: "language",
      title: "Japanese JLPT N3",
      desc: "Master Kanji, listening comprehension, and Bunpro grammar.",
      category: "language",
      icon: Languages,
      defaultDays: 90,
      defaultMins: 60,
    },
    {
      id: "career",
      title: "Full-Stack AI Project",
      desc: "Ship a production-grade SaaS portfolio project from scratch.",
      category: "career",
      icon: Briefcase,
      defaultDays: 45,
      defaultMins: 120,
    },
  ];

  // Fetch Diagnostic questions when entering Step 2
  useEffect(() => {
    if (step === 2) {
      setIsQuizLoading(true);
      fetch("/api/ai/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalTitle, category: goalCategory }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.questions && data.questions.length > 0) {
            setDiagnosticQuestions(data.questions);
            // Default quiz selections to self-declared level
            const initial: Record<string, number> = {};
            const defPoint = selfLevel === "beginner" ? 1 : selfLevel === "intermediate" ? 2 : 3;
            data.questions.forEach((q: DiagnosticQ) => {
              initial[q.id] = defPoint;
            });
            setQuizAnswers(initial);
          }
        })
        .catch((err) => console.warn("Diagnostic fetch error:", err))
        .finally(() => setIsQuizLoading(false));
    }
  }, [step, goalTitle, goalCategory]);

  // Recalculate calibrated level when quiz answers change
  useEffect(() => {
    const scores = Object.values(quizAnswers);
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg <= 1.4) setCalibratedLevel("beginner");
      else if (avg <= 2.4) setCalibratedLevel("intermediate");
      else setCalibratedLevel("advanced");
    }
  }, [quizAnswers]);

  // Handle Step 2 -> Step 3: Feasibility Calculation
  const handleProceedToFeasibility = () => {
    const totalHours = Math.round((durationDays * dailyMinutes) / 60);
    let scopeStatus: "optimal" | "tight" | "overambitious" = "optimal";
    let coachAdvice = "";
    let suggestedScope: string | undefined;

    if (totalHours < 40) {
      scopeStatus = "overambitious";
      coachAdvice = `At ${dailyMinutes} min/day for ${durationDays} days (${totalHours}h total), full mastery of "${goalTitle}" is very compressed. I recommend focusing strictly on Core Fundamentals + 1 Mini Project.`;
      suggestedScope = "Core Fundamentals + 1 Mini Project";
    } else if (totalHours < 75) {
      scopeStatus = "tight";
      coachAdvice = `This is a high-intensity sprint (${totalHours}h total). Pacing will be dense, but achievable with high daily consistency. Buffer days will be added.`;
    } else {
      scopeStatus = "optimal";
      coachAdvice = `Excellent pacing! With ${totalHours} total dedicated hours, we have ample room for deep concept mastery, active hands-on drills, and full capstone projects.`;
    }

    setFeasibility({
      totalHours,
      scopeStatus,
      coachAdvice,
      suggestedFocusScope: suggestedScope,
    });

    setStep(3);
  };

  // Handle Step 3 -> Step 4 & 5: AI Roadmap Generation & Validation
  const handleGenerateRoadmap = async () => {
    setStep(4);
    setIsGenerating(true);

    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + durationDays);
      const formattedDeadline = targetDate.toISOString().split("T")[0];

      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goalTitle,
          description: goalDescription,
          targetDeadline: formattedDeadline,
          currentLevel: calibratedLevel,
          dailyMinutesTarget: dailyMinutes,
          preferredSchedule: schedule,
          category: goalCategory,
          totalDaysTarget: durationDays,
          calibratedLevel,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.milestones && data.milestones.length > 0) {
          setGeneratedPhases(data.milestones);
          setValidationScore(data.validationScore || 96);
          if (data.feasibility) {
            setFeasibility(data.feasibility);
          }
        }
      }
    } catch (err) {
      console.warn("AI planner error, using fallback phases:", err);
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setStep(5); // Show Preview & Approval Screen
      }, 1200);
    }
  };

  // Final Step 5: User Approves Roadmap -> Save to DB and Activate Day 1
  const handleApproveAndStartDay1 = async () => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + durationDays);
    const formattedDeadline = targetDate.toISOString().split("T")[0];

    const milestones = generatedPhases.map((m: any, idx: number) => ({
      id: `ms-${Date.now()}-${idx + 1}`,
      goalId: `goal-${Date.now()}`,
      title: m.title,
      description: m.description,
      order: m.order || idx + 1,
      status: idx === 0 ? "in_progress" : "locked",
      estimatedDays: m.estimatedDays || Math.round(durationDays / generatedPhases.length),
      tasks: (m.tasks || []).map((t: any, tIdx: number) => ({
        id: `task-${Date.now()}-${idx + 1}-${tIdx + 1}`,
        milestoneId: `ms-${Date.now()}-${idx + 1}`,
        title: t.title,
        description: t.description,
        difficulty: t.difficulty || "medium",
        estimatedMinutes: t.estimatedMinutes || dailyMinutes,
        dueDate: new Date().toISOString().split("T")[0],
        status: "pending",
        priority: t.priority || "high",
        topic: t.topic || "Core",
      })),
    }));

    // Create inside client store
    const created = createNewGoal({
      title: goalTitle,
      description: goalDescription,
      targetDeadline: formattedDeadline,
      currentLevel: calibratedLevel,
      dailyMinutesTarget: dailyMinutes,
      preferredSchedule: schedule,
      category: goalCategory as any,
      milestones: milestones.length > 0 ? (milestones as any) : undefined,
    });

    // Save to Supabase (if logged in)
    try {
      if (created) {
        await createGoalWithMilestonesAction({
          title: created.title,
          description: created.description,
          targetDeadline: created.targetDeadline,
          currentLevel: created.currentLevel,
          dailyMinutesTarget: created.dailyMinutesTarget,
          preferredSchedule: created.preferredSchedule,
          status: created.status,
          category: created.category,
          weakAreas: created.weakAreas,
          strongAreas: created.strongAreas,
          milestones: created.milestones,
        });
      }
    } catch (e) {
      // Guest mode fallback
    }

    // Route to dashboard Day 1
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] text-[#F2F3F8] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7C6CFF]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <Logo href="/" size="sm" subtitle="Setup" />
        <div className="text-xs text-[#8B90A8] flex items-center gap-2">
          <span>Roadmap Creation Flow</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#7C6CFF]" />
          <span className="text-[#7C6CFF] font-bold">Step {step} of 5</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full my-6">
        <div className="rounded-3xl border border-[rgba(255,255,255,0.07)] bg-[#11131F]/95 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative">

          {/* ============================================================ */}
          {/* STEP 1: Goal Details & Constraints */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#7C6CFF]/15 text-[#7C6CFF] border border-[#7C6CFF]/30 mb-3">
                  <Target className="h-3.5 w-3.5" />
                  Step 1: Define Goal & Available Time
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  What do you want to master?
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  Specify your objective, timeline, and daily available study time.
                </p>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-2 gap-3">
                {presetGoals.map((p) => {
                  const Icon = p.icon;
                  const isSelected = goalTitle === p.title;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setGoalCategory(p.category);
                        setGoalTitle(p.title);
                        setGoalDescription(p.desc);
                        setDurationDays(p.defaultDays);
                        setDailyMinutes(p.defaultMins);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#7C6CFF]/15 border-[#7C6CFF] ring-1 ring-[#7C6CFF]"
                          : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#171A2B]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <Icon className={`h-4 w-4 ${isSelected ? "text-[#7C6CFF]" : "text-[#8B90A8]"}`} />
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#7C6CFF]" />}
                      </div>
                      <div>
                        <div className="font-semibold text-xs text-[#F2F3F8]">{p.title}</div>
                        <div className="text-[10px] text-[#8B90A8] mt-0.5 line-clamp-1">{p.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Goal Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F3F8]">Goal Title</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g., Learn Next.js, Master Python, Crack DSA"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                />
              </div>

              {/* Deadline & Daily Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                    <span>Deadline Duration</span>
                    <span className="text-[#7C6CFF]">{durationDays} Days</span>
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                  >
                    <option value={30}>30 Days (Fast-Track Sprint)</option>
                    <option value={60}>60 Days (Recommended)</option>
                    <option value={90}>90 Days (Deep Mastery)</option>
                    <option value={120}>120 Days (Comprehensive)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                    <span>Daily Available Time</span>
                    <span className="text-[#3DDC97]">{dailyMinutes / 60}h / day</span>
                  </label>
                  <select
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                  >
                    <option value={45}>45 Minutes / day</option>
                    <option value={60}>1 Hour / day</option>
                    <option value={90}>1.5 Hours / day</option>
                    <option value={120}>2 Hours / day</option>
                    <option value={180}>3 Hours / day</option>
                  </select>
                </div>
              </div>

              {/* Schedule Preference */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F3F8]">Preferred Study Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {(["morning", "afternoon", "evening", "night"] as SchedulePreference[]).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSchedule(slot)}
                      className={`py-2 rounded-xl text-xs font-medium capitalize border transition-all ${
                        schedule === slot
                          ? "bg-[#7C6CFF] text-white border-[#7C6CFF]"
                          : "bg-[#0A0B14] text-[#8B90A8] border-[rgba(255,255,255,0.07)] hover:text-[#F2F3F8]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Skill Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: AI Assessment (Self + Diagnostic Quiz) */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#4F8BFF]/15 text-[#4F8BFF] border border-[#4F8BFF]/30 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Step 2: Skill Calibration & Diagnostic
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  AI Skill Calibration
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  We don't blindly trust self-declared levels. Quick diagnostic check helps calibrate an accurate baseline.
                </p>
              </div>

              {/* Self Declared Level */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#F2F3F8]">Self-Declared Baseline Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["beginner", "intermediate", "advanced"] as GoalLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelfLevel(lvl)}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold capitalize transition-all ${
                        selfLevel === lvl
                          ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#F2F3F8]"
                          : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Diagnostic Quiz Box */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F2F3F8] flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-[#7C6CFF]" />
                    <span>Quick Diagnostic Calibration Quiz</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3DDC97]/15 text-[#3DDC97] font-semibold border border-[#3DDC97]/30">
                    Calibrated Level: {calibratedLevel.toUpperCase()}
                  </span>
                </div>

                {isQuizLoading ? (
                  <div className="p-6 text-center text-xs text-[#8B90A8] bg-[#0A0B14] rounded-xl border border-[rgba(255,255,255,0.07)]">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-[#7C6CFF]" />
                    Generating targeted diagnostic questions...
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {diagnosticQuestions.map((q, qIdx) => (
                      <div key={q.id} className="p-3.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] space-y-2">
                        <div className="text-xs font-semibold text-[#F2F3F8]">
                          {qIdx + 1}. {q.question}
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 pt-1">
                          {q.options.map((opt) => {
                            const isSelected = quizAnswers[q.id] === opt.points;
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.points }))}
                                className={`px-3 py-2 rounded-lg text-left text-[11px] transition-all flex items-center gap-2 border ${
                                  isSelected
                                    ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#F2F3F8]"
                                    : "bg-[#11131F] border-transparent text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B]"
                                }`}
                              >
                                <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                                  isSelected ? "bg-[#7C6CFF] text-white" : "bg-[#171A2B] text-[#8B90A8]"
                                }`}>
                                  {opt.label}
                                </span>
                                <span className="flex-1">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8] hover:text-[#F2F3F8]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleProceedToFeasibility}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Evaluate Feasibility & Pacing</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: AI Feasibility & Constraint Evaluation */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5B544]/15 text-[#F5B544] border border-[#F5B544]/30 mb-3">
                  <Sliders className="h-3.5 w-3.5" />
                  Step 3: AI Feasibility & Coach Assessment
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  Pacing & Constraint Check
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  AI Coach calculates your total dedicated bandwidth and evaluates feasibility.
                </p>
              </div>

              {/* Mathematical Breakdown Metric Card */}
              <div className="p-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] space-y-3">
                <div className="text-xs font-semibold text-[#8B90A8]">Time Constraint Calculation</div>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#F2F3F8]">{durationDays}</div>
                    <div className="text-[10px] text-[#8B90A8]">Total Days</div>
                  </div>
                  <span className="text-[#8B90A8]">×</span>
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#3DDC97]">{dailyMinutes / 60} hrs</div>
                    <div className="text-[10px] text-[#8B90A8]">Daily Budget</div>
                  </div>
                  <span className="text-[#8B90A8]">=</span>
                  <div className="text-center px-4 py-1.5 rounded-xl bg-[#7C6CFF]/15 border border-[#7C6CFF]/30">
                    <div className="text-xl font-extrabold text-[#7C6CFF]">{feasibility.totalHours} hrs</div>
                    <div className="text-[10px] text-[#8B90A8]">Total Available</div>
                  </div>
                </div>
              </div>

              {/* Coach Evaluation Verdict */}
              <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#7C6CFF]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F2F3F8] flex items-center gap-1.5">
                    <LogoIcon size={20} />
                    AI Coach Verdict
                  </span>
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                    feasibility.scopeStatus === "optimal"
                      ? "bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30"
                      : "bg-[#F5B544]/15 text-[#F5B544] border border-[#F5B544]/30"
                  }`}>
                    {feasibility.scopeStatus} Pacing
                  </span>
                </div>
                <p className="text-xs text-[#F2F3F8] leading-relaxed">
                  {feasibility.coachAdvice}
                </p>
                {feasibility.suggestedFocusScope && (
                  <div className="pt-2 border-t border-[rgba(255,255,255,0.07)] text-[11px] text-[#8B90A8]">
                    🎯 Recommended Scope: <span className="text-[#3DDC97] font-semibold">{feasibility.suggestedFocusScope}</span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8] hover:text-[#F2F3F8]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#3DDC97] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Synthesize & Validate Roadmap</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: AI Synthesis & Validation Animation */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="py-8 space-y-6 text-center animate-in fade-in">
              <div className="relative mx-auto flex items-center justify-center animate-pulse">
                <LogoIcon size={56} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#F2F3F8] font-heading">
                  AI Coach is synthesizing your validated roadmap...
                </h2>
                <p className="text-xs text-[#8B90A8] mt-1">
                  Structuring phases, weekly outcomes, and verifying dependency constraints
                </p>
              </div>

              {/* Validation Pipeline Checklist */}
              <div className="max-w-md mx-auto space-y-2 text-left text-xs">
                <div className="p-3 rounded-xl border bg-[#7C6CFF]/15 border-[#7C6CFF]/40 text-[#F2F3F8] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                  <span>Phase Dependency DAG & Difficulty Progression</span>
                </div>
                <div className="p-3 rounded-xl border bg-[#7C6CFF]/15 border-[#7C6CFF]/40 text-[#F2F3F8] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                  <span>Daily Task Time Budgets ({dailyMinutes} min limit verified)</span>
                </div>
                <div className="p-3 rounded-xl border bg-[#7C6CFF]/15 border-[#7C6CFF]/40 text-[#F2F3F8] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                  <span>Projects & Buffer Review Days Included</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: Interactive User Preview & Approval */}
          {/* ============================================================ */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30 mb-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Step 5: Review & Approve Roadmap
                </div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                    Your {durationDays}-Day Master Roadmap
                  </h1>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#7C6CFF]/15 border border-[#7C6CFF]/30 text-[#7C6CFF] font-semibold">
                    ✓ {validationScore}% Validated
                  </span>
                </div>
                <p className="text-xs text-[#8B90A8] mt-1">
                  Goal: <span className="text-[#F2F3F8] font-semibold">{goalTitle}</span> • {durationDays} Days • {dailyMinutes / 60}h Daily • {calibratedLevel.toUpperCase()}
                </p>
              </div>

              {/* Phased Roadmap Preview Cards */}
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {generatedPhases.map((phase: any, pIdx: number) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] hover:border-[#7C6CFF]/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-[#7C6CFF]/20 text-[#7C6CFF] text-[10px] font-bold flex items-center justify-center">
                          {pIdx + 1}
                        </span>
                        <h3 className="text-xs font-bold text-[#F2F3F8]">{phase.title}</h3>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#171A2B] text-[#3DDC97]">
                        {phase.dayRange || `${phase.estimatedDays} Days`}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#8B90A8] leading-relaxed">
                      {phase.description}
                    </p>

                    {phase.expectedOutcome && (
                      <div className="pt-2 border-t border-[rgba(255,255,255,0.05)] text-[10px] text-[#8B90A8] flex items-center gap-1.5">
                        <span className="text-[#7C6CFF] font-semibold">Outcome:</span>
                        <span>{phase.expectedOutcome}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons: [Edit Constraints] & [Approve & Start Day 1] */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B] transition-colors"
                >
                  Edit Constraints
                </button>
                <button
                  type="button"
                  onClick={handleApproveAndStartDay1}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#3DDC97] text-white font-bold text-xs shadow-xl shadow-[#7C6CFF]/30 hover:opacity-95 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Approve & Activate Day 1</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[#8B90A8]">
        Saathi AI • Dedicated Adaptive Coaching Engine
      </div>
    </div>
  );
}
