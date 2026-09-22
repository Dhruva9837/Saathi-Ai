"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCoach } from "@/context/CoachContext";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronDown,
  PlusCircle,
  BrainCircuit,
  Zap,
  LogIn,
  LogOut,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    goals,
    activeGoal,
    setActiveGoalId,
    userProfile,
    setIsCheckInModalOpen,
  } = useCoach();

  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authUser, setAuthUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    window.location.reload();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#1E293B] bg-[#0B1120]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & App Name */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366F1] text-white shadow-sm group-hover:bg-[#4F46E5] transition-colors">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-[#F8FAFC] flex items-center gap-1.5 font-heading">
                  Saathi <span className="text-[#818CF8]">AI</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#94A3B8] block -mt-1">
                  AI Coach
                </span>
              </div>
            </Link>

            {/* Goal Switcher Dropdown */}
            {activeGoal && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151E2E] border border-[#1E293B] text-xs text-[#F8FAFC] hover:border-[#334155] transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-[#6366F1]" />
                  <span className="font-medium max-w-[180px] truncate">
                    {activeGoal.title}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
                </button>

                {isGoalDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#151E2E] border border-[#1E293B] p-1.5 shadow-2xl z-50">
                    <div className="text-[11px] font-semibold text-[#94A3B8] px-2.5 py-1 uppercase tracking-wider">
                      Active Goals
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
                            ? "bg-[#1E293B] text-[#818CF8] border border-[#6366F1]/40"
                            : "text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]"
                        }`}
                      >
                        <span className="truncate">{g.title}</span>
                        {g.id === activeGoal.id && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#6366F1] shrink-0" />
                        )}
                      </button>
                    ))}
                    <div className="my-1 border-t border-[#1E293B]" />
                    <Link
                      href="/onboarding"
                      onClick={() => setIsGoalDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#818CF8] hover:bg-[#1E293B] transition-colors font-medium"
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Daily Check-in</span>
            </button>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151E2E] border border-[#1E293B] text-[#F59E0B] text-xs font-semibold">
              <Flame className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{userProfile.streakDays} Day Streak</span>
            </div>

            {/* XP & Level Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151E2E] border border-[#1E293B] text-xs text-[#94A3B8]">
              <span className="font-semibold text-[#818CF8] flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" />
                Lvl {userProfile.level}
              </span>
              <span className="text-[#334155]">•</span>
              <span className="text-[#94A3B8]">{userProfile.totalXp} XP</span>
            </div>

            {/* User Profile / Auth Button */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-[#1E293B] hover:opacity-85 transition-opacity"
                >
                  <div className="h-8 w-8 rounded-full bg-[#1E293B] border border-[#334155] overflow-hidden">
                    <img
                      src={userProfile.avatarUrl}
                      alt={authUser.email}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-semibold text-[#F8FAFC] leading-tight">
                      {authUser.user_metadata?.name || userProfile.name}
                    </div>
                    <div className="text-[10px] text-[#22C55E] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
                      Synced
                    </div>
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#151E2E] border border-[#1E293B] p-1.5 shadow-2xl z-50">
                    <div className="px-3 py-2 text-xs text-[#94A3B8] border-b border-[#1E293B]">
                      Signed in as
                      <div className="font-semibold text-[#F8FAFC] truncate mt-0.5">
                        {authUser.email}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151E2E] border border-[#1E293B] text-[#F8FAFC] text-xs font-medium hover:border-[#334155] hover:bg-[#1E293B] transition-colors shadow-sm"
              >
                <LogIn className="h-3.5 w-3.5 text-[#818CF8]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Supabase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
