"use client";

import React, { useState } from "react";
import { useCoach } from "@/context/CoachContext";
import { CoachPersona, AdaptationSensitivity, SchedulePreference } from "@/types";
import {
  ShieldAlert,
  Flame,
  Binary,
  Brain,
  Sliders,
  Clock,
  Bell,
  Sparkles,
  Download,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Calendar,
  Save,
  UserCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

interface PersonaOption {
  id: CoachPersona;
  title: string;
  tagline: string;
  icon: any;
  quote: string;
  badge: string;
}

const PERSONAS: PersonaOption[] = [
  {
    id: "supportive",
    title: "Empathetic Mentor",
    tagline: "Compassionate, uplifting, and focuses on sustainable habits.",
    icon: Sparkles,
    quote: "“You’re doing great! Let's break this into gentle steps and protect your energy.”",
    badge: "Balanced Growth",
  },
  {
    id: "tough_love",
    title: "Tough Love Drill Sergeant",
    tagline: "High accountability, zero excuses, pushes you to your true limits.",
    icon: Flame,
    quote: "“Stop overthinking. Execute the next 30 minutes without distractions!”",
    badge: "High Intensity",
  },
  {
    id: "analytical",
    title: "Scientific Biohacker",
    tagline: "Data-driven, tracks cognitive load, optimizes retention curves.",
    icon: Binary,
    quote: "“Your retention curve indicates optimal spaced recall intervals at +18 hours.”",
    badge: "Data-Driven",
  },
  {
    id: "socratic",
    title: "Socratic Strategist",
    tagline: "Asks piercing questions to help you derive solutions from first principles.",
    icon: Brain,
    quote: "“What assumption did you make about state here? What happens if that fails?”",
    badge: "First Principles",
  },
];

export const SettingsView: React.FC = () => {
  const { userProfile, updateUserProfile, activeGoal, updateActiveGoal } = useCoach();

  // Local form state
  const [selectedPersona, setSelectedPersona] = useState<CoachPersona>(
    userProfile.coachPersona || "supportive"
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(
    activeGoal?.dailyMinutesTarget || 60
  );
  const [schedulePref, setSchedulePref] = useState<SchedulePreference>(
    activeGoal?.preferredSchedule || "evening"
  );
  const [sensitivity, setSensitivity] = useState<AdaptationSensitivity>(
    userProfile.adaptationSensitivity || "balanced"
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    userProfile.soundEffects !== false
  );
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(
    userProfile.dailyReminders !== false
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSave = () => {
    updateUserProfile({
      coachPersona: selectedPersona,
      adaptationSensitivity: sensitivity,
      soundEffects: soundEnabled,
      dailyReminders: remindersEnabled,
    });

    if (activeGoal) {
      updateActiveGoal({
        dailyMinutesTarget: dailyMinutes,
        preferredSchedule: schedulePref,
      });
    }

    setIsSaved(true);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#7C6CFF", "#4F8BFF", "#3DDC97"],
      });
    } catch (e) {}

    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportData = () => {
    try {
      const exportBlob = new Blob(
        [
          JSON.stringify(
            {
              profile: userProfile,
              activeGoal,
              exportedAt: new Date().toISOString(),
            },
            null,
            2
          ),
        ],
        { type: "application/json" }
      );
      const url = URL.createObjectURL(exportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `saathi-ai-profile-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    } catch (e) {
      console.error("Export failed", e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.07)] pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F2F3F8]">
            Settings & AI Persona
          </h1>
          <p className="text-sm text-[#8B90A8] mt-1">
            Customize how your AI Coach communicates, paces daily milestones, and adapts to blockers.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-95 text-white font-semibold text-sm shadow-lg shadow-[#7C6CFF]/20 transition-all transform active:scale-95 shrink-0"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-white" />
              <span>Preferences Saved!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Section 1: AI Coach Persona */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-[#7C6CFF]" />
          <h2 className="text-lg font-bold text-[#F2F3F8]">AI Coach Personality</h2>
        </div>
        <p className="text-xs text-[#8B90A8]">
          Choose the tone and coaching methodology that keeps you most motivated and disciplined.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONAS.map((persona) => {
            const Icon = persona.icon;
            const isSelected = selectedPersona === persona.id;

            return (
              <div
                key={persona.id}
                onClick={() => setSelectedPersona(persona.id)}
                className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-[#11131F] border-[#7C6CFF] shadow-lg shadow-[#7C6CFF]/15 ring-1 ring-[#7C6CFF]"
                    : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#11131F]/60"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                        isSelected
                          ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#7C6CFF]"
                          : "bg-[#171A2B] border-[rgba(255,255,255,0.07)] text-[#8B90A8]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-[#F2F3F8]">
                        {persona.title}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#171A2B] text-[#7C6CFF]">
                        {persona.badge}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-[#7C6CFF] bg-[#7C6CFF] text-[#0A0B14]"
                        : "border-[rgba(255,255,255,0.15)] bg-transparent"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                </div>

                <p className="text-xs text-[#8B90A8] leading-relaxed mb-3">
                  {persona.tagline}
                </p>

                <div className="p-3 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8]/90 italic">
                  {persona.quote}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Daily Pacing & Schedule */}
      <div className="p-6 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] space-y-6">
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-4">
          <Clock className="h-5 w-5 text-[#7C6CFF]" />
          <div>
            <h2 className="text-base font-bold text-[#F2F3F8]">
              Daily Target & Time Window
            </h2>
            <p className="text-xs text-[#8B90A8]">
              Control daily commitment and when your AI generates your morning focus sprint.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Daily Minutes Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-[#F2F3F8]">
                Daily Study / Focus Target
              </label>
              <span className="text-sm font-bold text-[#7C6CFF] px-2.5 py-0.5 rounded-md bg-[#171A2B] border border-[rgba(255,255,255,0.07)]">
                {dailyMinutes} minutes / day
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="180"
              step="15"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full h-2 bg-[#171A2B] rounded-lg appearance-none cursor-pointer accent-[#7C6CFF]"
            />
            <div className="flex justify-between text-[10px] text-[#8B90A8] mt-1">
              <span>15m (Micro-Sprint)</span>
              <span>60m (Standard)</span>
              <span>120m (Deep Dive)</span>
              <span>180m (Intensive)</span>
            </div>
          </div>

          {/* Schedule Window */}
          <div>
            <label className="block text-xs font-semibold text-[#F2F3F8] mb-2">
              Preferred Focus Window
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "morning", label: "Morning (6 AM - 12 PM)" },
                { id: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
                { id: "evening", label: "Evening (5 PM - 11 PM)" },
                { id: "flexible", label: "Flexible Schedule" },
              ].map((slot) => {
                const isSelected = schedulePref === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSchedulePref(slot.id as SchedulePreference)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-colors ${
                      isSelected
                        ? "bg-[#171A2B] border-[#7C6CFF] text-[#7C6CFF] font-bold"
                        : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
                    }`}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Adaptation Engine Sensitivity */}
      <div className="p-6 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] space-y-6">
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-4">
          <Sliders className="h-5 w-5 text-[#7C6CFF]" />
          <div>
            <h2 className="text-base font-bold text-[#F2F3F8]">
              Adaptive Engine Sensitivity
            </h2>
            <p className="text-xs text-[#8B90A8]">
              Determine how quickly Saathi AI reorganizes future milestone tasks when you face blockers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: "conservative",
              title: "Conservative",
              desc: "Requires 2+ missed days before proposing pace or milestone changes.",
            },
            {
              id: "balanced",
              title: "Balanced (Recommended)",
              desc: "Proactively redistributes tasks after any missed day or high friction rating.",
            },
            {
              id: "aggressive",
              title: "Dynamic Sprint",
              desc: "Instantly reorganizes daily tasks and schedules micro-reinforcement drills after every check-in.",
            },
          ].map((item) => {
            const isSelected = sensitivity === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSensitivity(item.id as AdaptationSensitivity)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-[#171A2B] border-[#7C6CFF] text-[#F2F3F8]"
                    : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#F2F3F8]">{item.title}</h4>
                  <div
                    className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-[#7C6CFF] bg-[#7C6CFF]"
                        : "border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-[#0A0B14]" />}
                  </div>
                </div>
                <p className="text-[11px] text-[#8B90A8] leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Notifications & Audio */}
      <div className="p-6 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] space-y-4">
        <div className="flex items-center gap-2 border-b border-[rgba(255,255,255,0.07)] pb-4">
          <Bell className="h-5 w-5 text-[#7C6CFF]" />
          <div>
            <h2 className="text-base font-bold text-[#F2F3F8]">
              Notifications & Sound
            </h2>
            <p className="text-xs text-[#8B90A8]">
              Manage task completion celebrations and check-in prompts.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-[#7C6CFF]" />
              <div>
                <span className="text-xs font-semibold text-[#F2F3F8] block">
                  Celebration Confetti & Effects
                </span>
                <span className="text-[11px] text-[#8B90A8]">
                  Trigger particle effects on milestone and task completions.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="h-4 w-4 accent-[#7C6CFF] rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.07)]">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-[#7C6CFF]" />
              <div>
                <span className="text-xs font-semibold text-[#F2F3F8] block">
                  Daily Briefing & Check-in Reminders
                </span>
                <span className="text-[11px] text-[#8B90A8]">
                  Receive subtle reminder prompts during your selected focus window.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={remindersEnabled}
              onChange={(e) => setRemindersEnabled(e.target.checked)}
              className="h-4 w-4 accent-[#7C6CFF] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Section 5: Data & Backup */}
      <div className="p-6 rounded-2xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#F2F3F8]">Data Portability & Backup</h3>
          <p className="text-xs text-[#8B90A8] mt-0.5">
            Download your active milestones, streak records, and AI coach history as JSON.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportData}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#171A2B] hover:bg-[#171A2B]/80 border border-[rgba(255,255,255,0.07)] text-xs font-semibold text-[#F2F3F8] transition-colors shrink-0"
        >
          <Download className="h-3.5 w-3.5 text-[#7C6CFF]" />
          <span>Export Profile JSON</span>
        </button>
      </div>
    </div>
  );
};
