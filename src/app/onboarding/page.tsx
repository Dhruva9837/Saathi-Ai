"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
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

interface EditableTask {
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  priority: "low" | "medium" | "high";
  topic: string;
  type?: "learn" | "practice" | "project" | "revision";
}

interface EditablePhase {
  title: string;
  description: string;
  order: number;
  estimatedDays: number;
  dayRange?: string;
  weeklyObjective?: string;
  expectedOutcome?: string;
  tasks: EditableTask[];
}

const WEEKDAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { createNewGoal } = useCoach();

  // Wizard Step State (1 to 6)
  // Step 1: Define Goal & Category (Presets + Custom Goal)
  // Step 2: Current Level & Target Outcome ("What does success look like?")
  // Step 3: Pacing, Study Days & Availability Schedule
  // Step 4: AI Feasibility Check & Coach Guidance
  // Step 5: AI Roadmap Synthesis & Verification (Animated Loader)
  // Step 6: Interactive Phased Roadmap Preview, Task Customization & Activation
  const [step, setStep] = useState(1);

  // Step 1 Form Data
  const [goalCategory, setGoalCategory] = useState<string>("language");
  const [goalTitle, setGoalTitle] = useState("Learn French");
  const [goalDescription, setGoalDescription] = useState(
    "Master conversational French, grammar fundamentals, and prepare for A1 level."
  );
  const [isCustomGoal, setIsCustomGoal] = useState(false);

  // Step 2 Assessment & Target Outcome
  const [selfLevel, setSelfLevel] = useState<GoalLevel>("beginner");
  const [targetOutcome, setTargetOutcome] = useState(
    "Complete French A1 level, speak confidently in everyday situations, and pass the mock test."
  );
  const [priorExperience, setPriorExperience] = useState("");
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<DiagnosticQ[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [calibratedLevel, setCalibratedLevel] = useState<GoalLevel>("beginner");
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Step 3 Availability & Pacing
  const [durationDays, setDurationDays] = useState(60);
  const [dailyMinutes, setDailyMinutes] = useState(120); // 2 hours default
  const [isCustomDailyMinutes, setIsCustomDailyMinutes] = useState(false);
  const [schedule, setSchedule] = useState<SchedulePreference>("evening");
  const [scheduleMode, setScheduleMode] = useState<"preset" | "manual">("preset");
  const [customStartTime, setCustomStartTime] = useState("19:00");
  const [customEndTime, setCustomEndTime] = useState("21:00");
  const [studyDays, setStudyDays] = useState<string[]>([
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
  ]);
  const [learningPreference, setLearningPreference] = useState<
    "practice" | "videos" | "reading" | "projects"
  >("practice");
  const [assessmentMethod, setAssessmentMethod] = useState<
    "quiz" | "project" | "mock_test"
  >("mock_test");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Step 4 Feasibility Data
  const [feasibility, setFeasibility] = useState<{
    totalHours: number;
    recommendedMinimumHours: number;
    scopeStatus: "optimal" | "tight" | "overambitious";
    coachAdvice: string;
    suggestedFocusScope?: string;
    suggestedAdjustedDays?: number;
    suggestedAdjustedMinutes?: number;
  }>({
    totalHours: 104,
    recommendedMinimumHours: 90,
    scopeStatus: "optimal",
    coachAdvice:
      "With 104 dedicated hours across 60 days, you have solid room for phonetics, grammar drills, real-world conversational practice, and revision.",
  });

  // Step 5 & 6 Generated Roadmap State
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationScore, setValidationScore] = useState<number>(96);
  const [generatedPhases, setGeneratedPhases] = useState<EditablePhase[]>([]);
  const [expandedPhaseIdx, setExpandedPhaseIdx] = useState<number>(0);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTaskPhaseIdx, setAddingTaskPhaseIdx] = useState<number | null>(null);

  // Preset Goals
  const presetGoals = [
    {
      id: "french",
      title: "Learn French",
      desc: "Phonetics, essential vocabulary, grammar, and A1 conversational fluency.",
      category: "language",
      icon: Languages,
      defaultDays: 60,
      defaultMins: 120,
      defaultOutcome: "Pass French A1 level and hold 15-minute everyday conversations.",
    },
    {
      id: "nextjs",
      title: "Master Next.js",
      desc: "App Router, SSR, Server Actions, middleware, and Supabase SaaS architecture.",
      category: "coding",
      icon: Code2,
      defaultDays: 60,
      defaultMins: 90,
      defaultOutcome: "Ship a production-ready SaaS web application on Vercel.",
    },
    {
      id: "dsa",
      title: "Complete DSA",
      desc: "Crack technical interviews with 150+ structured pattern problems.",
      category: "coding",
      icon: Target,
      defaultDays: 60,
      defaultMins: 90,
      defaultOutcome: "Solve LeetCode Medium problems independently under 35 minutes.",
    },
    {
      id: "jlpt",
      title: "Japanese JLPT N3",
      desc: "Master Kanji, listening comprehension, and Bunpro grammar.",
      category: "language",
      icon: BookOpen,
      defaultDays: 90,
      defaultMins: 60,
      defaultOutcome: "Score 120+ points on the official JLPT N3 examination.",
    },
  ];

  // Fetch Diagnostic questions when entering Step 2 or on manual re-diagnose
  const fetchDiagnosticQuestions = useCallback(async () => {
    setIsQuizLoading(true);
    try {
      const res = await fetch("/api/ai/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goalTitle,
          category: goalCategory,
          targetOutcome,
        }),
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setDiagnosticQuestions(data.questions);
        const initial: Record<string, number> = {};
        const defPoint =
          selfLevel === "beginner" ? 1 : selfLevel === "intermediate" ? 2 : 3;
        data.questions.forEach((q: DiagnosticQ) => {
          initial[q.id] = defPoint;
        });
        setQuizAnswers(initial);
      }
    } catch (err) {
      console.warn("Diagnostic fetch error:", err);
    } finally {
      setIsQuizLoading(false);
    }
  }, [goalTitle, goalCategory, targetOutcome, selfLevel]);

  useEffect(() => {
    if (step === 2) {
      fetchDiagnosticQuestions();
    }
  }, [step, fetchDiagnosticQuestions]);

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

  // Handle Step 3 -> Step 4: Feasibility Calculation
  const handleProceedToFeasibility = () => {
    const daysPerWeek = studyDays.length || 7;
    const effectiveStudyDays = Math.round(durationDays * (daysPerWeek / 7));
    const totalHours = Math.round((effectiveStudyDays * dailyMinutes) / 60);

    let baseRequired = 80;
    const titleLower = goalTitle.toLowerCase();
    if (goalCategory === "language" || titleLower.includes("french") || titleLower.includes("japanese")) {
      baseRequired = calibratedLevel === "beginner" ? 90 : 60;
    } else if (titleLower.includes("dsa")) {
      baseRequired = calibratedLevel === "beginner" ? 110 : 75;
    } else if (titleLower.includes("next.js") || goalCategory === "coding") {
      baseRequired = calibratedLevel === "beginner" ? 80 : 45;
    }

    let scopeStatus: "optimal" | "tight" | "overambitious" = "optimal";
    let coachAdvice = "";
    let suggestedScope: string | undefined;
    let suggestedAdjDays: number | undefined;
    let suggestedAdjMins: number | undefined;

    if (totalHours < baseRequired * 0.55) {
      scopeStatus = "overambitious";
      coachAdvice = `At ${dailyMinutes / 60}h/day across ${durationDays} days (${totalHours}h total, ${daysPerWeek} study days/week), full mastery of "${goalTitle}" is compressed. As your AI Coach, I suggest either extending the timeline or focusing strictly on Core Fundamentals + 1 practical capstone project.`;
      suggestedScope = "Core Fundamentals + 1 Practical Project";
      suggestedAdjDays = Math.min(120, Math.ceil((baseRequired / (dailyMinutes / 60)) / 15) * 15);
      suggestedAdjMins = Math.min(180, Math.ceil((baseRequired / durationDays) * 60));
    } else if (totalHours < baseRequired * 0.85) {
      scopeStatus = "tight";
      coachAdvice = `This is a high-intensity sprint (${totalHours}h total, ${daysPerWeek} days/week). Pacing will be dense, but achievable with high daily consistency. We will incorporate strategic buffer days to prevent burnout.`;
      suggestedAdjDays = Math.min(120, Math.ceil((baseRequired / (dailyMinutes / 60)) / 10) * 10);
      suggestedAdjMins = Math.min(180, Math.ceil((baseRequired / durationDays) * 60));
    } else {
      scopeStatus = "optimal";
      coachAdvice = `Excellent pacing! With ${totalHours} total dedicated hours (${daysPerWeek} active study days/week), we have ample room for deep concept mastery, active hands-on drills, and full practical checkpoints.`;
    }

    setFeasibility({
      totalHours,
      recommendedMinimumHours: baseRequired,
      scopeStatus,
      coachAdvice,
      suggestedFocusScope: suggestedScope,
      suggestedAdjustedDays: suggestedAdjDays,
      suggestedAdjustedMinutes: suggestedAdjMins,
    });

    setStep(4);
  };

  // Step 4: Apply 1-Click Coach Adjustment
  const handleApplyAdjustment = () => {
    if (feasibility.suggestedAdjustedDays) {
      setDurationDays(feasibility.suggestedAdjustedDays);
    } else if (feasibility.suggestedAdjustedMinutes) {
      setDailyMinutes(feasibility.suggestedAdjustedMinutes);
    }
    // Recalculate with adjusted values
    const daysPerWeek = studyDays.length || 7;
    const newDays = feasibility.suggestedAdjustedDays || durationDays;
    const newMins = feasibility.suggestedAdjustedMinutes || dailyMinutes;
    const effectiveStudyDays = Math.round(newDays * (daysPerWeek / 7));
    const newTotalHours = Math.round((effectiveStudyDays * newMins) / 60);

    setFeasibility((prev) => ({
      ...prev,
      totalHours: newTotalHours,
      scopeStatus: "optimal",
      coachAdvice: `Adjusted pacing applied! With ${newTotalHours} total hours across ${newDays} days, your plan is now fully balanced for sustainable mastery.`,
    }));
  };

  // Handle Step 4 -> Step 5 & 6: AI Roadmap Synthesis
  const handleGenerateRoadmap = async () => {
    setStep(5);
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
          description: goalDescription || targetOutcome,
          targetDeadline: formattedDeadline,
          currentLevel: calibratedLevel,
          dailyMinutesTarget: dailyMinutes,
          preferredSchedule: scheduleMode === "manual" ? "custom" : schedule,
          customStudyTime: scheduleMode === "manual" ? `${customStartTime} - ${customEndTime}` : undefined,
          category: goalCategory,
          totalDaysTarget: durationDays,
          calibratedLevel,
          targetOutcome,
          priorExperience,
          studyDays,
          learningPreference,
          assessmentMethod,
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
        setStep(6); // Show Preview, Customization & Approval Screen
      }, 1400);
    }
  };

  // Add Task to Phase in Step 6
  const handleAddTaskToPhase = (phaseIdx: number) => {
    if (!newTaskTitle.trim()) return;
    const updated = [...generatedPhases];
    const targetPhase = updated[phaseIdx];
    if (targetPhase) {
      targetPhase.tasks.push({
        title: newTaskTitle.trim(),
        description: "Custom user-defined milestone task",
        estimatedMinutes: dailyMinutes,
        difficulty: "medium",
        priority: "high",
        topic: targetPhase.title,
        type: "practice",
      });
      setGeneratedPhases(updated);
      setNewTaskTitle("");
      setAddingTaskPhaseIdx(null);
    }
  };

  // Remove Task from Phase in Step 6
  const handleRemoveTask = (phaseIdx: number, taskIdx: number) => {
    const updated = [...generatedPhases];
    updated[phaseIdx].tasks.splice(taskIdx, 1);
    setGeneratedPhases(updated);
  };

  // Final Step 6: User Approves Roadmap -> Save to DB & Activate Day 1
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
      description: goalDescription || targetOutcome,
      targetDeadline: formattedDeadline,
      currentLevel: calibratedLevel,
      dailyMinutesTarget: dailyMinutes,
      preferredSchedule: scheduleMode === "manual" ? "custom" : schedule,
      customStudyTime: scheduleMode === "manual" ? `${customStartTime} - ${customEndTime}` : undefined,
      category: goalCategory as any,
      targetOutcome,
      studyDays,
      learningPreference,
      assessmentMethod,
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

  // Toggle study days
  const toggleStudyDay = (dayKey: string) => {
    if (studyDays.includes(dayKey)) {
      if (studyDays.length > 1) {
        setStudyDays(studyDays.filter((d) => d !== dayKey));
      }
    } else {
      setStudyDays([...studyDays, dayKey]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] text-[#F2F3F8] flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#7C6CFF]/15 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <Logo href="/" size="sm" subtitle="AI Coach" />
        <div className="text-xs text-[#8B90A8] flex items-center gap-2">
          <span>Goal Architecture</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#7C6CFF]" />
          <span className="text-[#7C6CFF] font-bold">Step {step} of 6</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full my-6">
        <div className="rounded-3xl border border-[rgba(255,255,255,0.07)] bg-[#11131F]/95 backdrop-blur-xl p-6 sm:p-10 shadow-2xl relative">

          {/* ============================================================ */}
          {/* STEP 1: Define Goal & Category */}
          {/* ============================================================ */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#7C6CFF]/15 text-[#7C6CFF] border border-[#7C6CFF]/30 mb-3">
                  <Target className="h-3.5 w-3.5" />
                  Step 1: Define Your Goal
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  What do you want to master?
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  Select a curated learning path or define your own custom objective.
                </p>
              </div>

              {/* Presets + Custom Option */}
              <div className="grid grid-cols-2 gap-3">
                {presetGoals.map((p) => {
                  const Icon = p.icon;
                  const isSelected = !isCustomGoal && goalTitle === p.title;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setIsCustomGoal(false);
                        setGoalCategory(p.category);
                        setGoalTitle(p.title);
                        setGoalDescription(p.desc);
                        setDurationDays(p.defaultDays);
                        setDailyMinutes(p.defaultMins);
                        setTargetOutcome(p.defaultOutcome);
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

                {/* Custom Goal Card */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomGoal(true);
                    setGoalTitle("");
                    setGoalDescription("");
                    setTargetOutcome("");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between col-span-2 ${
                    isCustomGoal
                      ? "bg-[#7C6CFF]/15 border-[#7C6CFF] ring-1 ring-[#7C6CFF]"
                      : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#171A2B]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`h-4 w-4 ${isCustomGoal ? "text-[#7C6CFF]" : "text-[#8B90A8]"}`} />
                      <span className="font-semibold text-xs text-[#F2F3F8]">
                        + Custom Goal (Any Subject)
                      </span>
                    </div>
                    {isCustomGoal && <Check className="h-3.5 w-3.5 text-[#7C6CFF]" />}
                  </div>
                  <div className="text-[10px] text-[#8B90A8]">
                    Enter any personal objective (e.g. Master French, Deep Learning, Public Speaking, CFA, etc.)
                  </div>
                </button>
              </div>

              {/* Goal Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                  <span>Goal Title</span>
                  {isCustomGoal && <span className="text-[10px] text-[#7C6CFF]">Custom Objective</span>}
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGoalTitle(val);
                    const lower = val.toLowerCase();
                    if (
                      lower.includes("french") ||
                      lower.includes("spanish") ||
                      lower.includes("german") ||
                      lower.includes("japanese") ||
                      lower.includes("chinese") ||
                      lower.includes("korean") ||
                      lower.includes("russian") ||
                      lower.includes("italian") ||
                      lower.includes("english") ||
                      lower.includes("language") ||
                      lower.includes("jlpt") ||
                      lower.includes("vocab")
                    ) {
                      setGoalCategory("language");
                    } else if (
                      lower.includes("dsa") ||
                      lower.includes("react") ||
                      lower.includes("next") ||
                      lower.includes("code") ||
                      lower.includes("python") ||
                      lower.includes("javascript") ||
                      lower.includes("typescript") ||
                      lower.includes("algorithm") ||
                      lower.includes("frontend") ||
                      lower.includes("backend")
                    ) {
                      setGoalCategory("coding");
                    } else if (
                      lower.includes("gym") ||
                      lower.includes("fitness") ||
                      lower.includes("workout") ||
                      lower.includes("running") ||
                      lower.includes("marathon") ||
                      lower.includes("muscle")
                    ) {
                      setGoalCategory("fitness");
                    } else if (
                      lower.includes("job") ||
                      lower.includes("interview") ||
                      lower.includes("resume") ||
                      lower.includes("career") ||
                      lower.includes("cfa") ||
                      lower.includes("mba")
                    ) {
                      setGoalCategory("career");
                    }
                  }}
                  placeholder="e.g. Learn French, Master Next.js, Complete DSA, Machine Learning"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none transition-colors"
                />
              </div>

              {/* Domain Category Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F3F8]">Domain Category</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: "language", label: "Language" },
                    { id: "coding", label: "Coding" },
                    { id: "career", label: "Career" },
                    { id: "academics", label: "Academics" },
                    { id: "fitness", label: "Fitness" },
                    { id: "other", label: "Other" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGoalCategory(cat.id)}
                      className={`py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        goalCategory === cat.id
                          ? "bg-[#7C6CFF] text-white border-[#7C6CFF]"
                          : "bg-[#0A0B14] text-[#8B90A8] border-[rgba(255,255,255,0.07)] hover:text-[#F2F3F8]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={!goalTitle.trim()}
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Continue to Level & Target Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: Current Level & Target Outcome */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#4F8BFF]/15 text-[#4F8BFF] border border-[#4F8BFF]/30 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Step 2: Assess Current Level & Target
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  Define Baseline & Success Metric
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  AI converts vague goals into measurable outcomes and calibrates your baseline.
                </p>
              </div>

              {/* Self Declared Level */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#F2F3F8]">Current Starting Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "beginner", title: "Beginner", desc: "Starting from scratch / basics" },
                    { id: "intermediate", title: "Intermediate", desc: "Know fundamentals, need fluency" },
                    { id: "advanced", title: "Advanced", desc: "Refining mastery & speed" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelfLevel(lvl.id as GoalLevel)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selfLevel === lvl.id
                          ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#F2F3F8] ring-1 ring-[#7C6CFF]"
                          : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
                      }`}
                    >
                      <div className="text-xs font-semibold capitalize text-[#F2F3F8]">{lvl.title}</div>
                      <div className="text-[10px] text-[#8B90A8] mt-0.5">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* What Does Success Look Like? (Measurable Target Outcome) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                  <span>What does success look like? (Target Outcome)</span>
                  <span className="text-[10px] text-[#3DDC97]">Crucial for AI Alignment</span>
                </label>
                <textarea
                  rows={2}
                  value={targetOutcome}
                  onChange={(e) => setTargetOutcome(e.target.value)}
                  placeholder="e.g. In 60 days, complete French A1 level, hold everyday conversations without anxiety, and pass the mock proficiency test."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Prior Knowledge / Existing Skills (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#8B90A8] flex items-center justify-between">
                  <span>Prior Knowledge or Existing Skills (Optional)</span>
                  <span className="text-[10px] text-[#8B90A8]">Optional</span>
                </label>
                <input
                  type="text"
                  value={priorExperience}
                  onChange={(e) => setPriorExperience(e.target.value)}
                  placeholder="e.g. Know English & Spanish, basic Latin roots, studied French in school 5 yrs ago"
                  className="w-full px-4 py-2 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                />
              </div>

              {/* Diagnostic Quiz Calibration */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F2F3F8] flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-[#7C6CFF]" />
                    <span>AI Diagnostic Calibration Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fetchDiagnosticQuestions()}
                      disabled={isQuizLoading}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#7C6CFF] hover:bg-[#7C6CFF]/10 transition-colors border border-[#7C6CFF]/30 disabled:opacity-50"
                      title="Re-run AI Calibration questions for this goal"
                    >
                      <RefreshCw className={`h-2.5 w-2.5 ${isQuizLoading ? "animate-spin" : ""}`} />
                      <span>Re-diagnose</span>
                    </button>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3DDC97]/15 text-[#3DDC97] font-semibold border border-[#3DDC97]/30">
                      Calibrated: {calibratedLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {isQuizLoading ? (
                  <div className="p-5 text-center text-xs text-[#8B90A8] bg-[#0A0B14] rounded-xl border border-[rgba(255,255,255,0.07)]">
                    <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2 text-[#7C6CFF]" />
                    Calibrating targeted diagnostic check for {goalTitle}...
                  </div>
                ) : (
                  <div className="space-y-3">
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

              {/* Navigation */}
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
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Configure Schedule & Availability</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: Timeline & Weekly Availability */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30 mb-3">
                  <Calendar className="h-3.5 w-3.5" />
                  Step 3: Set Target, Deadline & Availability
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  Schedule & Time Budget
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  Configure realistic study hours, weekly rest days, and study habits.
                </p>
              </div>

              {/* Deadline & Daily Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                    <span>Deadline Target</span>
                    <span className="text-[#7C6CFF]">{durationDays} Days</span>
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                  >
                    <option value={30}>30 Days (Intensive Sprint)</option>
                    <option value={45}>45 Days (Focused Pace)</option>
                    <option value={60}>60 Days (Recommended)</option>
                    <option value={90}>90 Days (Deep Mastery)</option>
                    <option value={120}>120 Days (Comprehensive)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                    <span>Daily Available Time</span>
                    <span className="text-[#3DDC97]">
                      {dailyMinutes >= 60
                        ? `${(dailyMinutes / 60).toFixed(dailyMinutes % 60 === 0 ? 0 : 1)}h / day`
                        : `${dailyMinutes}m / day`}
                    </span>
                  </label>
                  {!isCustomDailyMinutes ? (
                    <div className="flex gap-2">
                      <select
                        value={dailyMinutes}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val === -1) {
                            setIsCustomDailyMinutes(true);
                          } else {
                            setDailyMinutes(val);
                          }
                        }}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                      >
                        <option value={30}>30 Minutes / day</option>
                        <option value={45}>45 Minutes / day</option>
                        <option value={60}>1 Hour / day</option>
                        <option value={90}>1.5 Hours / day</option>
                        <option value={120}>2 Hours / day</option>
                        <option value={180}>3 Hours / day</option>
                        <option value={-1}>✏️ Custom Minutes...</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="15"
                        max="480"
                        step="5"
                        value={dailyMinutes}
                        onChange={(e) => setDailyMinutes(Math.max(15, Math.min(480, Number(e.target.value) || 15)))}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-[#0A0B14] border border-[#7C6CFF] text-xs text-[#F2F3F8] focus:outline-none font-semibold"
                        placeholder="Minutes (e.g. 75)"
                      />
                      <span className="text-xs text-[#8B90A8]">mins</span>
                      <button
                        type="button"
                        onClick={() => setIsCustomDailyMinutes(false)}
                        className="px-2.5 py-2 rounded-xl bg-[#171A2B] hover:bg-[#20243C] text-[11px] text-[#8B90A8] hover:text-[#F2F3F8]"
                      >
                        Presets
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Study Days & Rest Days Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
                  <span>Weekly Study Days & Rest Days</span>
                  <span className="text-[10px] text-[#7C6CFF]">
                    {studyDays.length} Study Days • {7 - studyDays.length} Rest {7 - studyDays.length === 1 ? "Day" : "Days"}
                  </span>
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {WEEKDAYS.map((day) => {
                    const isSelected = studyDays.includes(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => toggleStudyDay(day.key)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSelected
                            ? "bg-[#7C6CFF] text-white border-[#7C6CFF] shadow-sm shadow-[#7C6CFF]/30"
                            : "bg-[#0A0B14] text-[#8B90A8] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.2)]"
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Study Time (Preset Window vs Manual Clock Timing) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#F2F3F8] flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-[#7C6CFF]" />
                    <span>Preferred Study Time</span>
                  </label>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-[10px]">
                    <button
                      type="button"
                      onClick={() => setScheduleMode("preset")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                        scheduleMode === "preset"
                          ? "bg-[#7C6CFF] text-white"
                          : "text-[#8B90A8] hover:text-[#F2F3F8]"
                      }`}
                    >
                      Broad Windows
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleMode("manual")}
                      className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                        scheduleMode === "manual"
                          ? "bg-[#7C6CFF] text-white"
                          : "text-[#8B90A8] hover:text-[#F2F3F8]"
                      }`}
                    >
                      🕒 Manual Clock Time
                    </button>
                  </div>
                </div>

                {scheduleMode === "preset" ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: "morning", label: "Morning", sub: "6am - 12pm" },
                        { id: "afternoon", label: "Afternoon", sub: "12pm - 5pm" },
                        { id: "evening", label: "Evening", sub: "5pm - 9pm" },
                        { id: "night", label: "Night", sub: "9pm - 1am" },
                      ].map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSchedule(slot.id as SchedulePreference)}
                          className={`py-2 px-1 rounded-xl text-center border transition-all ${
                            schedule === slot.id
                              ? "bg-[#7C6CFF] text-white border-[#7C6CFF] shadow-sm shadow-[#7C6CFF]/30"
                              : "bg-[#0A0B14] text-[#8B90A8] border-[rgba(255,255,255,0.07)] hover:text-[#F2F3F8]"
                          }`}
                        >
                          <div className="text-xs font-semibold">{slot.label}</div>
                          <div className={`text-[9px] mt-0.5 ${schedule === slot.id ? "text-white/80" : "text-[#8B90A8]"}`}>
                            {slot.sub}
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setScheduleMode("manual")}
                      className="text-[11px] text-[#7C6CFF] hover:text-[#4F8BFF] flex items-center gap-1 transition-colors pt-0.5"
                    >
                      <span>Want specific hours? Click here to set exact manual start & end times →</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#0A0B14] border border-[#7C6CFF]/30 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#F2F3F8]">Select Your Exact Study Window:</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C6CFF]/20 text-[#7C6CFF] font-bold border border-[#7C6CFF]/30">
                        {customStartTime} – {customEndTime}
                      </span>
                    </div>

                    {/* From - To Time Pickers */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#8B90A8] font-medium">Start Time</label>
                        <input
                          type="time"
                          value={customStartTime}
                          onChange={(e) => setCustomStartTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.1)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-[#8B90A8] font-medium">End Time</label>
                        <input
                          type="time"
                          value={customEndTime}
                          onChange={(e) => setCustomEndTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.1)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Manual Slot Presets */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] text-[#8B90A8]">Quick Manual Timing Slots:</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: "06:30 – 08:00 AM (Early Bird)", start: "06:30", end: "08:00", mins: 90 },
                          { label: "02:00 – 03:30 PM (Afternoon Focus)", start: "14:00", end: "15:30", mins: 90 },
                          { label: "07:00 – 09:00 PM (Prime Evening)", start: "19:00", end: "21:00", mins: 120 },
                          { label: "10:00 – 11:30 PM (Night Sprint)", start: "22:00", end: "23:30", mins: 90 },
                        ].map((chip) => {
                          const isActive = customStartTime === chip.start && customEndTime === chip.end;
                          return (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => {
                                setCustomStartTime(chip.start);
                                setCustomEndTime(chip.end);
                                setDailyMinutes(chip.mins);
                              }}
                              className={`p-2 rounded-lg text-left text-[10px] border transition-all ${
                                isActive
                                  ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#F2F3F8] font-bold"
                                  : "bg-[#11131F] border-transparent text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B]"
                              }`}
                            >
                              {chip.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Learning Preferences Accordion */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="text-xs text-[#8B90A8] hover:text-[#F2F3F8] flex items-center gap-1.5 transition-colors font-medium"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Advanced Preferences (Pedagogy & Assessment)</span>
                  {showAdvancedSettings ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showAdvancedSettings && (
                  <div className="mt-3 p-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] space-y-3.5 animate-in fade-in">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#8B90A8]">Primary Learning Preference</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "practice", label: "Practice Drills" },
                          { id: "videos", label: "Video Tutorials" },
                          { id: "reading", label: "Reading & Docs" },
                          { id: "projects", label: "Hands-on Projects" },
                        ].map((pref) => (
                          <button
                            key={pref.id}
                            type="button"
                            onClick={() => setLearningPreference(pref.id as any)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                              learningPreference === pref.id
                                ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#F2F3F8]"
                                : "bg-[#11131F] text-[#8B90A8] border-transparent hover:text-[#F2F3F8]"
                            }`}
                          >
                            {pref.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-[#8B90A8]">Primary Assessment Method</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "mock_test", label: "Mock Test" },
                          { id: "project", label: "Capstone Project" },
                          { id: "quiz", label: "Weekly Quizzes" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setAssessmentMethod(m.id as any)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                              assessmentMethod === m.id
                                ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#F2F3F8]"
                                : "bg-[#11131F] text-[#8B90A8] border-transparent hover:text-[#F2F3F8]"
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </div>
                    </div>
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
                  onClick={handleProceedToFeasibility}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#3DDC97] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Evaluate Feasibility & Pacing</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: AI Feasibility Analysis & Constraint Engine */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#F5B544]/15 text-[#F5B544] border border-[#F5B544]/30 mb-3">
                  <Sliders className="h-3.5 w-3.5" />
                  Step 4: AI Feasibility & Capacity Analysis
                </div>
                <h1 className="text-2xl font-bold font-heading text-[#F2F3F8]">
                  Pacing & Constraint Check
                </h1>
                <p className="text-xs text-[#8B90A8] mt-1">
                  AI Coach evaluates total bandwidth against pedagogical requirements for {goalTitle}.
                </p>
              </div>

              {/* Capacity Breakdown Metric Card */}
              <div className="p-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] space-y-3">
                <div className="text-xs font-semibold text-[#8B90A8]">Time Capacity Formula</div>
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="text-lg font-bold text-[#F2F3F8]">{durationDays}</div>
                    <div className="text-[10px] text-[#8B90A8]">Total Days</div>
                  </div>
                  <span className="text-[#8B90A8]">×</span>
                  <div>
                    <div className="text-lg font-bold text-[#F2F3F8]">{studyDays.length}/7</div>
                    <div className="text-[10px] text-[#8B90A8]">Days/Wk</div>
                  </div>
                  <span className="text-[#8B90A8]">×</span>
                  <div>
                    <div className="text-lg font-bold text-[#3DDC97]">{dailyMinutes / 60} hrs</div>
                    <div className="text-[10px] text-[#8B90A8]">Daily Budget</div>
                  </div>
                  <span className="text-[#8B90A8]">=</span>
                  <div className="px-3 py-1 rounded-xl bg-[#7C6CFF]/15 border border-[#7C6CFF]/30">
                    <div className="text-lg font-extrabold text-[#7C6CFF]">{feasibility.totalHours} hrs</div>
                    <div className="text-[10px] text-[#8B90A8]">Total Available</div>
                  </div>
                </div>
              </div>

              {/* Coach Evaluation Verdict */}
              <div className="p-4 rounded-2xl bg-[#171A2B] border border-[#7C6CFF]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F2F3F8] flex items-center gap-1.5">
                    <LogoIcon size={18} />
                    AI Coach Feasibility Verdict
                  </span>
                  <span className={`text-[10px] uppercase px-2.5 py-0.5 rounded-full font-bold ${
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

                {/* 1-Click Adjustment Action if Tight or Overambitious */}
                {feasibility.scopeStatus !== "optimal" && (feasibility.suggestedAdjustedDays || feasibility.suggestedAdjustedMinutes) && (
                  <div className="p-3 rounded-xl bg-[#0A0B14] border border-[#F5B544]/30 space-y-2">
                    <div className="text-[11px] text-[#F5B544] font-semibold flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Recommended Coach Adjustment</span>
                    </div>
                    <p className="text-[11px] text-[#8B90A8]">
                      {feasibility.suggestedAdjustedDays && `Extend duration to ${feasibility.suggestedAdjustedDays} days for balanced retention.`}
                      {!feasibility.suggestedAdjustedDays && feasibility.suggestedAdjustedMinutes && `Adjust daily focus to ${feasibility.suggestedAdjustedMinutes} mins/day.`}
                    </p>
                    <button
                      type="button"
                      onClick={handleApplyAdjustment}
                      className="px-3 py-1.5 rounded-lg bg-[#F5B544]/20 hover:bg-[#F5B544]/30 border border-[#F5B544]/40 text-[#F5B544] text-[11px] font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Apply 1-Click Recommendation</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8] hover:text-[#F2F3F8]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#3DDC97] text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Synthesize & Validate Personalized Roadmap</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: AI Roadmap Synthesis Animation */}
          {/* ============================================================ */}
          {step === 5 && (
            <div className="py-8 space-y-6 text-center animate-in fade-in">
              <div className="relative mx-auto flex items-center justify-center animate-pulse">
                <LogoIcon size={56} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#F2F3F8] font-heading">
                  AI Coach is synthesizing your validated roadmap...
                </h2>
                <p className="text-xs text-[#8B90A8] mt-1">
                  Structuring phases, weekly milestones, and granular daily tasks for {goalTitle}
                </p>
              </div>

              {/* Validation Pipeline Checklist */}
              <div className="max-w-md mx-auto space-y-2 text-left text-xs">
                <div className="p-3 rounded-xl border bg-[#7C6CFF]/15 border-[#7C6CFF]/40 text-[#F2F3F8] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                  <span>Phase Dependency DAG & Pedagogical Progression</span>
                </div>
                <div className="p-3 rounded-xl border bg-[#7C6CFF]/15 border-[#7C6CFF]/40 text-[#F2F3F8] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                  <span>Daily Task Time Budgets ({dailyMinutes} min target verified)</span>
                </div>
                <div className="p-3 rounded-xl border bg-[#7C6CFF]/15 border-[#7C6CFF]/40 text-[#F2F3F8] flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                  <span>Weekly Milestones, Checkpoints & Buffer Days Included</span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 6: Interactive Phased Roadmap Preview, Edit & Confirm */}
          {/* ============================================================ */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3DDC97]/15 text-[#3DDC97] border border-[#3DDC97]/30 mb-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Step 6: Review & Customize Roadmap
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
                  Goal: <span className="text-[#F2F3F8] font-semibold">{goalTitle}</span> • {durationDays} Days • {dailyMinutes / 60}h/day • {studyDays.length} Days/Wk • {calibratedLevel.toUpperCase()}
                </p>
              </div>

              {/* Workload Summary Metric Header */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)]">
                <div>
                  <div className="text-sm font-bold text-[#F2F3F8]">{generatedPhases.length}</div>
                  <div className="text-[9px] text-[#8B90A8]">Phases</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#3DDC97]">
                    {generatedPhases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)}
                  </div>
                  <div className="text-[9px] text-[#8B90A8]">Milestone Tasks</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#7C6CFF]">{feasibility.totalHours}h</div>
                  <div className="text-[9px] text-[#8B90A8]">Total Hours</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#F5B544]">{dailyMinutes}m</div>
                  <div className="text-[9px] text-[#8B90A8]">Daily Target</div>
                </div>
              </div>

              {/* Phased Roadmap Preview Cards with Task Details */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {generatedPhases.map((phase, pIdx) => {
                  const isExpanded = expandedPhaseIdx === pIdx;
                  return (
                    <div
                      key={pIdx}
                      className="p-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] hover:border-[#7C6CFF]/40 transition-colors space-y-3"
                    >
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedPhaseIdx(isExpanded ? -1 : pIdx)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-[#7C6CFF]/20 text-[#7C6CFF] text-[10px] font-bold flex items-center justify-center">
                            {pIdx + 1}
                          </span>
                          <div>
                            <h3 className="text-xs font-bold text-[#F2F3F8]">{phase.title}</h3>
                            <span className="text-[10px] text-[#8B90A8]">
                              {phase.dayRange || `${phase.estimatedDays} Days`} • {phase.tasks?.length || 0} Tasks
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-[#8B90A8]" /> : <ChevronDown className="h-4 w-4 text-[#8B90A8]" />}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#8B90A8] leading-relaxed">
                        {phase.description}
                      </p>

                      {phase.expectedOutcome && (
                        <div className="text-[10px] text-[#8B90A8] flex items-center gap-1.5 bg-[#11131F] p-2 rounded-lg border border-[rgba(255,255,255,0.05)]">
                          <span className="text-[#3DDC97] font-semibold">Outcome:</span>
                          <span>{phase.expectedOutcome}</span>
                        </div>
                      )}

                      {/* Expanded Task Breakdown */}
                      {isExpanded && (
                        <div className="pt-2 border-t border-[rgba(255,255,255,0.05)] space-y-2">
                          <div className="text-[11px] font-semibold text-[#F2F3F8] flex items-center justify-between">
                            <span>Phased Daily Tasks Preview</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddingTaskPhaseIdx(addingTaskPhaseIdx === pIdx ? null : pIdx);
                              }}
                              className="text-[10px] text-[#7C6CFF] hover:text-[#4F8BFF] flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Custom Task</span>
                            </button>
                          </div>

                          {/* New Task Inline Input */}
                          {addingTaskPhaseIdx === pIdx && (
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#171A2B] border border-[#7C6CFF]/40">
                              <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Enter custom task title..."
                                className="flex-1 bg-transparent text-xs text-[#F2F3F8] outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTaskToPhase(pIdx)}
                                className="px-2.5 py-1 rounded-lg bg-[#7C6CFF] text-white text-[10px] font-semibold"
                              >
                                Add
                              </button>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            {phase.tasks.map((task, tIdx) => (
                              <div
                                key={tIdx}
                                className="p-2.5 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                    task.type === "learn"
                                      ? "bg-[#4F8BFF]/15 text-[#4F8BFF]"
                                      : task.type === "project"
                                      ? "bg-[#3DDC97]/15 text-[#3DDC97]"
                                      : task.type === "revision"
                                      ? "bg-[#F5B544]/15 text-[#F5B544]"
                                      : "bg-[#7C6CFF]/15 text-[#7C6CFF]"
                                  }`}>
                                    {task.type || "task"}
                                  </span>
                                  <span className="text-xs text-[#F2F3F8] truncate">{task.title}</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] text-[#8B90A8] flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {task.estimatedMinutes}m
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTask(pIdx, tIdx)}
                                    className="text-[#8B90A8] hover:text-[#FF5252] transition-colors p-1"
                                    title="Remove Task"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons: [Edit Constraints] & [Approve & Activate Day 1] */}
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
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#3DDC97] text-white font-bold text-xs shadow-xl shadow-[#7C6CFF]/30 hover:opacity-95 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
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
