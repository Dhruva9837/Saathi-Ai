"use client";

import React from "react";
import Link from "next/link";
import { useCoach } from "@/context/CoachContext";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronDown,
  PlusCircle,
  BrainCircuit,
  MessageSquare,
  Zap,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    goals,
    activeGoal,
    setActiveGoalId,
    userProfile,
    setIsCheckInModalOpen,
  } = useCoach();

  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surfaceBorder/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & App Name */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan shadow-lg shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <BrainCircuit className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent-emerald animate-ping" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent-emerald border-2 border-background" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-heading">
                Saathi <span className="text-gradient-brand">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block -mt-1">
                Adaptive Coach
              </span>
            </div>
          </Link>

          {/* Goal Switcher Dropdown */}
          {activeGoal && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface/80 border border-surfaceBorder text-xs text-slate-200 hover:border-primary-500/50 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-primary-400" />
                <span className="font-medium max-w-[180px] truncate">
                  {activeGoal.title}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isGoalDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl glass-panel-glow border border-surfaceBorder p-1.5 shadow-2xl z-50">
                  <div className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                    Active Roadmaps
                  </div>
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setActiveGoalId(g.id);
                        setIsGoalDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        g.id === activeGoal.id
                          ? "bg-primary-600/20 text-primary-300 border border-primary-500/30"
                          : "text-slate-300 hover:bg-surfaceLight"
                      }`}
                    >
                      <span className="truncate">{g.title}</span>
                      {g.id === activeGoal.id && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary-400 shrink-0" />
                      )}
                    </button>
                  ))}
                  <div className="my-1 border-t border-surfaceBorder/60" />
                  <Link
                    href="/onboarding"
                    onClick={() => setIsGoalDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-accent-cyan hover:bg-accent-cyan/10 transition-colors font-medium"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Create New Goal</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Check-in Button */}
          <button
            onClick={() => setIsCheckInModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-xs font-semibold shadow-md shadow-primary-500/20 hover:from-primary-500 hover:to-indigo-500 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Daily Check-in</span>
          </button>

          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold">
            <Flame className="h-4 w-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{userProfile.streakDays} Day Streak</span>
          </div>

          {/* XP & Level Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-surfaceBorder text-xs text-slate-300">
            <span className="font-semibold text-accent-cyan flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              Lvl {userProfile.level}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{userProfile.totalXp} XP</span>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-surfaceBorder">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-accent-cyan p-[1.5px]">
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">
                {userProfile.name}
              </div>
              <div className="text-[10px] text-slate-400">Pro Learner</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
