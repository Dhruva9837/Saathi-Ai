"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCoach } from "@/context/CoachContext";
import {
  Sparkles,
  BotMessageSquare,
  Volume2,
  ArrowRight,
  Lightbulb,
  HelpCircle,
} from "lucide-react";

export const CoachDailyBriefing: React.FC = () => {
  const { activeGoal } = useCoach();
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
    <div className="rounded-xl border border-[#1E293B] bg-[#151E2E] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1] text-white shadow-sm">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F8FAFC] font-heading">
                AI Coach Daily Briefing
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#1E293B] text-[#818CF8] border border-[#334155]">
                Context Active
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Evaluated from your latest check-ins & weak areas
            </p>
          </div>
        </div>

        {/* Audio Briefing Simulator */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            isPlayingAudio
              ? "bg-[#1E293B] border-[#818CF8] text-[#818CF8]"
              : "bg-[#0B1120] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155]"
          }`}
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>{isPlayingAudio ? "Playing..." : "Listen"}</span>
        </button>
      </div>

      {/* Quote Container */}
      <div className="p-4 rounded-lg bg-[#0B1120] border border-[#1E293B]">
        <p className="text-xs text-[#F8FAFC] leading-relaxed">
          "{briefingText}"
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/coach"
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#0B1120] border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="h-3 w-3 text-[#F59E0B]" />
            <span>I only have 30 mins today</span>
          </Link>
          <Link
            href="/dashboard/coach"
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#0B1120] border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="h-3 w-3 text-[#818CF8]" />
            <span>Break down two-pointer intuition</span>
          </Link>
        </div>

        <Link
          href="/dashboard/coach"
          className="text-xs text-[#818CF8] hover:text-[#A5B4FC] font-semibold flex items-center gap-1 group"
        >
          <span>Chat with Coach</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
