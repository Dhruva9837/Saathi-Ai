"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCoach } from "@/context/CoachContext";
import {
  Sparkles,
  BotMessageSquare,
  Volume2,
  VolumeX,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export const CoachDailyBriefing: React.FC = () => {
  const { activeGoal, sendChatMessage } = useCoach();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      setTimeout(() => setIsPlayingAudio(false), 4500);
    }
  };

  const briefingText =
    activeGoal?.id === "goal-dsa-1"
      ? "Yesterday you mentioned feeling friction with boundary conditions on two pointers. Today I've scheduled 3 targeted reinforcement problems before we move on to Linked Lists. Stay patient and draw the pointers on paper!"
      : activeGoal?.id === "goal-japanese-2"
      ? "Great job on yesterday's Kanji retention! Today we're attacking N3 Bunpro Lesson 4. Spend extra time with the example sentences."
      : "Your system architecture design is taking shape. Today focus on locking in the Supabase schema and PostgreSQL indexes.";

  return (
    <div className="rounded-2xl glass-panel-glow border border-primary-500/30 bg-gradient-to-br from-surface to-primary-950/40 p-6 shadow-xl relative overflow-hidden">
      {/* AI Glow Ornament */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-500 to-accent-cyan shadow-lg shadow-primary-500/30">
            <BotMessageSquare className="h-6 w-6 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-emerald border-2 border-surface">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-heading">
                AI Coach Daily Briefing
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">
                Personalized
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Evaluated from your latest check-ins & weak areas
            </p>
          </div>
        </div>

        {/* Audio Briefing Simulator */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            isPlayingAudio
              ? "bg-accent-cyan/20 border-accent-cyan text-accent-cyan animate-pulse"
              : "bg-surfaceLight/60 border-surfaceBorder text-slate-300 hover:text-white hover:bg-surfaceLight"
          }`}
        >
          {isPlayingAudio ? (
            <>
              <Volume2 className="h-4 w-4" />
              <span>Playing Audio...</span>
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4 text-slate-400" />
              <span>Listen (15s)</span>
            </>
          )}
        </button>
      </div>

      {/* Quote Container */}
      <div className="p-4 rounded-xl bg-surfaceLight/40 border border-surfaceBorder/60 relative">
        <p className="text-xs text-slate-200 leading-relaxed italic">
          "{briefingText}"
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="mt-4 pt-3 border-t border-surfaceBorder/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/coach"
            className="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder hover:border-primary-500/40 text-slate-300 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            <Lightbulb className="h-3 w-3 text-amber-400" />
            <span>I only have 30 mins today</span>
          </Link>
          <Link
            href="/dashboard/coach"
            className="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder hover:border-primary-500/40 text-slate-300 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            <HelpCircle className="h-3 w-3 text-accent-cyan" />
            <span>Break down two-pointer intuition</span>
          </Link>
        </div>

        <Link
          href="/dashboard/coach"
          className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1 group"
        >
          <span>Chat with Coach</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
