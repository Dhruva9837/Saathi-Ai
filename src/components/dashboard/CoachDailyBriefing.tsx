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
    activeGoal?.milestones[0]
      ? `Welcome to your focus session for "${activeGoal.title}"! Today's mission is to tackle the tasks in "${activeGoal.milestones[0].title}". Stay consistent and commit to your ${activeGoal.dailyMinutesTarget || 60}m daily target!`
      : "Welcome to Saathi AI! Create a personalized roadmap to begin your daily adaptive coaching sessions.";

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6CFF] to-[#4F8BFF] text-white shadow-sm">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F2F3F8] font-heading">
                AI Coach Daily Briefing
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#171A2B] text-[#7C6CFF] border border-[rgba(255,255,255,0.07)]">
                Context Active
              </span>
            </div>
            <p className="text-[11px] text-[#8B90A8]">
              Evaluated from your latest check-ins & weak areas
            </p>
          </div>
        </div>

        {/* Audio Briefing Simulator */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
            isPlayingAudio
              ? "bg-[#171A2B] border-[#7C6CFF] text-[#7C6CFF]"
              : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B]"
          }`}
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>{isPlayingAudio ? "Playing..." : "Listen"}</span>
        </button>
      </div>

      {/* Quote Container */}
      <div className="p-4 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.07)]">
        <p className="text-xs text-[#F2F3F8] leading-relaxed">
          "{briefingText}"
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/coach"
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-[#8B90A8] hover:text-[#F2F3F8] transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="h-3 w-3 text-[#F5B544]" />
            <span>I only have 30 mins today</span>
          </Link>
          <Link
            href="/dashboard/coach"
            className="text-[11px] px-2.5 py-1 rounded-md bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-[#8B90A8] hover:text-[#F2F3F8] transition-colors flex items-center gap-1.5"
          >
            <HelpCircle className="h-3 w-3 text-[#7C6CFF]" />
            <span>Break down two-pointer intuition</span>
          </Link>
        </div>

        <Link
          href="/dashboard/coach"
          className="text-xs text-[#7C6CFF] hover:opacity-80 font-semibold flex items-center gap-1 group"
        >
          <span>Chat with Coach</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
