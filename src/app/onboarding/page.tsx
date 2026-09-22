"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCoach } from "@/context/CoachContext";
import { createGoalWithMilestonesAction } from "@/server/actions/goals";
import {
  BrainCircuit,
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
} from "lucide-react";
import { GoalLevel, SchedulePreference } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { createNewGoal } = useCoach();

  const [step, setStep] = useState(1);
  const [goalCategory, setGoalCategory] = useState<string>("coding");
  const [goalTitle, setGoalTitle] = useState("DSA & Algorithmic Problem Solving");
  const [goalDescription, setGoalDescription] = useState(
    "Crack top product company tech interviews with structured roadmap."
  );
  const [deadline, setDeadline] = useState("2026-12-15");
  const [level, setLevel] = useState<GoalLevel>("beginner");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [schedule, setSchedule] = useState<SchedulePreference>("evening");
  const [priorExperience, setPriorExperience] = useState(
    "Basic knowledge of syntax, but struggle with pointers and dynamic programming."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMilestone, setGeneratingMilestone] = useState(0);

  const presetGoals = [
    {
      id: "coding",
      title: "DSA & Algorithmic Coding",
      desc: "Crack technical interviews with 150+ structured problems.",
      category: "coding",
      icon: Code2,
    },
    {
      id: "language",
      title: "Japanese JLPT N3",
      desc: "Master Kanji, listening comprehension, and Bunpro grammar.",
      category: "language",
      icon: Languages,
    },
    {
      id: "career",
      title: "Full-Stack Portfolio Project",
      desc: "Ship a production-ready Next.js + AI application.",
      category: "career",
      icon: Briefcase,
    },
    {
      id: "academics",
      title: "Semester Exam / GATE Prep",
      desc: "Comprehensive syllabus mastery with active recall.",
      category: "academics",
      icon: GraduationCap,
    },
  ];

  const handleSelectPreset = (preset: typeof presetGoals[0]) => {
    setGoalCategory(preset.category);
    setGoalTitle(preset.title);
    setGoalDescription(preset.desc);
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);

    const stepTimer1 = setTimeout(() => setGeneratingMilestone(1), 600);
    const stepTimer2 = setTimeout(() => setGeneratingMilestone(2), 1200);
    const stepTimer3 = setTimeout(() => setGeneratingMilestone(3), 1800);

    try {
      // Call live AI planner API
      const res = await fetch("/api/ai/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: goalTitle,
          description: goalDescription,
          targetDeadline: deadline,
          currentLevel: level,
          dailyMinutesTarget: dailyMinutes,
          preferredSchedule: schedule,
          category: goalCategory,
        }),
      });

      let milestones: any[] = [];
      if (res.ok) {
        const data = await res.json();
        if (data.milestones && data.milestones.length > 0) {
          milestones = data.milestones.map((m: any, idx: number) => ({
            id: `ms-${Date.now()}-${idx + 1}`,
            goalId: `goal-${Date.now()}`,
            title: m.title,
            description: m.description,
            order: m.order || idx + 1,
            status: idx === 0 ? "in_progress" : "locked",
            estimatedDays: m.estimatedDays || 14,
            tasks: (m.tasks || []).map((t: any, tIdx: number) => ({
              id: `task-${Date.now()}-${idx + 1}-${tIdx + 1}`,
              milestoneId: `ms-${Date.now()}-${idx + 1}`,
              title: t.title,
              description: t.description,
              difficulty: t.difficulty || "medium",
              estimatedMinutes: t.estimatedMinutes || dailyMinutes,
              dueDate: new Date().toISOString().split("T")[0],
              status: "pending",
              priority: t.priority || "medium",
              topic: t.topic || "Core",
            })),
          }));
        }
      }

      // Save into store
      const created = createNewGoal({
        title: goalTitle,
        description: goalDescription,
        targetDeadline: deadline,
        currentLevel: level,
        dailyMinutesTarget: dailyMinutes,
        preferredSchedule: schedule,
        category: goalCategory as any,
        milestones: milestones.length > 0 ? milestones : undefined,
      });

      // Attempt Supabase server action persistence (if user is authenticated)
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
        // Ignored if guest mode
      }

      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } catch (err) {
      console.warn("AI planner error, creating standard goal:", err);
      createNewGoal({
        title: goalTitle,
        description: goalDescription,
        targetDeadline: deadline,
        currentLevel: level,
        dailyMinutesTarget: dailyMinutes,
        preferredSchedule: schedule,
        category: goalCategory as any,
      });
      router.push("/dashboard");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-radial-gradient text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <span className="font-heading font-bold text-lg text-white">
            Saathi <span className="text-gradient-brand">AI</span>
          </span>
        </div>
        <div className="text-xs text-slate-400">
          Step <span className="text-primary-400 font-bold">{step}</span> of 4
        </div>
      </div>

      {/* Main Card Container */}
      <div className="max-w-2xl mx-auto w-full my-6">
        <div className="rounded-3xl glass-panel-glow border border-surfaceBorder bg-surface/90 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Step 1: Goal Definition */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                  Phase 1 • Goal Setup
                </span>
                <h1 className="text-2xl font-extrabold text-white font-heading mt-1">
                  What do you want to achieve?
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Select a proven track or define your custom ambitious goal.
                </p>
              </div>

              {/* Preset Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {presetGoals.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = goalTitle === preset.title;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-primary-600/20 border-primary-500 shadow-md shadow-primary-500/15"
                          : "bg-surfaceLight/40 border-surfaceBorder/70 hover:bg-surfaceLight hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? "bg-primary-500 text-white"
                              : "bg-surfaceLight text-slate-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-primary-400" />
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-100 mb-1">
                        {preset.title}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {preset.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Custom Goal Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surfaceLight/60 border border-surfaceBorder text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Description / Core Purpose
                  </label>
                  <input
                    type="text"
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surfaceLight/60 border border-surfaceBorder text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Deadline & Skill Level */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                  Phase 2 • Timeline & Baseline
                </span>
                <h1 className="text-2xl font-extrabold text-white font-heading mt-1">
                  When is your deadline and what is your level?
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  AI will calculate realistic pacing to avoid over-optimistic schedules.
                </p>
              </div>

              {/* Target Deadline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent-cyan" />
                  Target Completion Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surfaceLight/60 border border-surfaceBorder text-xs text-white focus:outline-none focus:border-primary-500 font-mono"
                />
              </div>

              {/* Current Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                  Current Proficiency Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "beginner", label: "Beginner", desc: "Starting from basics" },
                    { id: "intermediate", label: "Intermediate", desc: "Know fundamentals" },
                    { id: "advanced", label: "Advanced", desc: "Looking for polish" },
                  ].map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id as GoalLevel)}
                      className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                        level === lvl.id
                          ? "bg-primary-600/20 border-primary-500 text-white"
                          : "bg-surfaceLight/40 border-surfaceBorder/70 text-slate-400 hover:bg-surfaceLight"
                      }`}
                    >
                      <div className="text-xs font-bold mb-1">{lvl.label}</div>
                      <div className="text-[10px] text-slate-400">{lvl.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Daily Availability & Schedule */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                  Phase 3 • Availability
                </span>
                <h1 className="text-2xl font-extrabold text-white font-heading mt-1">
                  How much time can you realistically invest?
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  The #1 reason study plans fail is over-committing. Be honest!
                </p>
              </div>

              {/* Daily Time Options */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                  Daily Time Commitment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { minutes: 30, label: "30 min", note: "Bite-sized" },
                    { minutes: 60, label: "1 hour", note: "Recommended" },
                    { minutes: 90, label: "1.5 hours", note: "Dedicated" },
                    { minutes: 120, label: "2+ hours", note: "Intense" },
                  ].map((time) => (
                    <div
                      key={time.minutes}
                      onClick={() => setDailyMinutes(time.minutes)}
                      className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                        dailyMinutes === time.minutes
                          ? "bg-primary-600/20 border-primary-500 text-white shadow-md"
                          : "bg-surfaceLight/40 border-surfaceBorder/70 text-slate-400 hover:bg-surfaceLight"
                      }`}
                    >
                      <div className="text-sm font-bold mb-0.5">{time.label}</div>
                      <div className="text-[10px] text-primary-300">{time.note}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Preference */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "morning", label: "Morning" },
                    { id: "afternoon", label: "Afternoon" },
                    { id: "evening", label: "Evening" },
                    { id: "flexible", label: "Flexible" },
                  ].map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSchedule(s.id as SchedulePreference)}
                      className={`p-3 rounded-xl border text-center cursor-pointer text-xs font-semibold transition-all ${
                        schedule === s.id
                          ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan"
                          : "bg-surfaceLight/40 border-surfaceBorder/70 text-slate-400 hover:bg-surfaceLight"
                      }`}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Prior Knowledge & AI Synthesis */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {!isGenerating ? (
                <>
                  <div>
                    <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                      Phase 4 • Background Context
                    </span>
                    <h1 className="text-2xl font-extrabold text-white font-heading mt-1">
                      Tell AI Coach about your background
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">
                      Previous completed courses, past roadblocks, or weak points.
                    </p>
                  </div>

                  <div>
                    <textarea
                      rows={4}
                      value={priorExperience}
                      onChange={(e) => setPriorExperience(e.target.value)}
                      placeholder="e.g. Completed a Python course on YouTube, know array basics, but struggle when questions combine hash maps and binary search..."
                      className="w-full px-4 py-3 rounded-xl bg-surfaceLight/60 border border-surfaceBorder text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-surfaceLight/40 border border-surfaceBorder text-xs text-slate-300 space-y-1.5">
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      Plan Profile Ready for Generation:
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>Goal: <span className="text-slate-200">{goalTitle}</span></div>
                      <div>Pacing: <span className="text-slate-200">{dailyMinutes}m / day ({schedule})</span></div>
                      <div>Proficiency: <span className="text-slate-200 capitalize">{level}</span></div>
                      <div>Target: <span className="text-slate-200">{deadline}</span></div>
                    </div>
                  </div>
                </>
              ) : (
                /* AI Generation Loading Animation */
                <div className="py-8 space-y-6 text-center animate-in fade-in">
                  <div className="relative mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-cyan text-white shadow-xl shadow-primary-500/30 animate-pulse">
                    <BrainCircuit className="h-8 w-8" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white font-heading">
                      AI Coach is synthesizing your adaptive roadmap...
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Analyzing {goalTitle} at {level} level ({dailyMinutes}m daily target)
                    </p>
                  </div>

                  <div className="max-w-md mx-auto space-y-2.5 text-left text-xs">
                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        generatingMilestone >= 1
                          ? "bg-primary-600/15 border-primary-500/40 text-primary-200"
                          : "bg-surfaceLight/30 border-surfaceBorder/40 text-slate-500"
                      }`}
                    >
                      {generatingMilestone >= 1 ? (
                        <Check className="h-4 w-4 text-accent-emerald shrink-0" />
                      ) : (
                        <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
                      )}
                      <span>Breaking down into progressive milestones...</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        generatingMilestone >= 2
                          ? "bg-primary-600/15 border-primary-500/40 text-primary-200"
                          : "bg-surfaceLight/30 border-surfaceBorder/40 text-slate-500"
                      }`}
                    >
                      {generatingMilestone >= 2 ? (
                        <Check className="h-4 w-4 text-accent-emerald shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span>Calibrating task difficulty & reinforcement steps...</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                        generatingMilestone >= 3
                          ? "bg-primary-600/15 border-primary-500/40 text-primary-200"
                          : "bg-surfaceLight/30 border-surfaceBorder/40 text-slate-500"
                      }`}
                    >
                      {generatingMilestone >= 3 ? (
                        <Check className="h-4 w-4 text-accent-emerald shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-600 shrink-0" />
                      )}
                      <span>Setting up initial missions & coach memory loop...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          {!isGenerating && (
            <div className="flex items-center justify-between pt-8 border-t border-surfaceBorder/70 mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-surfaceLight transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-primary-500/25 hover:from-primary-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateRoadmap}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-primary-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-primary-500 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Generate Adaptive Roadmap</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 py-2">
        Saathi AI Coach • Adaptive Planning Engine & Continuous Feedback Loop
      </div>
    </div>
  );
}
