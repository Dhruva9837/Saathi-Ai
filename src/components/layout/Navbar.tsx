"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCoach } from "@/context/CoachContext";
import { createClient } from "@/lib/supabase/client";
import { AuthModal } from "@/components/auth/AuthModal";
import { Logo } from "@/components/brand/Logo";
import {
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronDown,
  PlusCircle,
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
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setIsUserMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.07)] bg-[#0A0B14]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo & App Name */}
          <div className="flex items-center gap-6">
            <Logo href="/" size="sm" subtitle="AI Coach" />

            {/* Goal Switcher Dropdown */}
            {activeGoal && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] hover:bg-[#171A2B] hover:border-[rgba(255,255,255,0.15)] transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-[#7C6CFF]" />
                  <span className="font-medium max-w-[180px] truncate">
                    {activeGoal.title}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#8B90A8]" />
                </button>

                {isGoalDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] p-1.5 shadow-2xl z-50">
                    <div className="text-[11px] font-semibold text-[#8B90A8] px-2.5 py-1 uppercase tracking-wider">
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
                            ? "bg-[#171A2B] text-[#7C6CFF] border border-[#7C6CFF]/40"
                            : "text-[#8B90A8] hover:bg-[#171A2B] hover:text-[#F2F3F8]"
                        }`}
                      >
                        <span className="truncate">{g.title}</span>
                        {g.id === activeGoal.id && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#7C6CFF] shrink-0" />
                        )}
                      </button>
                    ))}
                    <div className="my-1 border-t border-[rgba(255,255,255,0.07)]" />
                    <Link
                      href="/onboarding"
                      onClick={() => setIsGoalDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#7C6CFF] hover:bg-[#171A2B] transition-colors font-medium"
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
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-90 text-white text-xs font-semibold shadow-sm transition-opacity"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Daily Check-in</span>
            </button>

            {/* Streak Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-[#F5B544] text-xs font-semibold">
              <Flame className="h-4 w-4 fill-[#F5B544] text-[#F5B544]" />
              <span>{userProfile.streakDays} Day Streak</span>
            </div>

            {/* XP & Level Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-xs text-[#8B90A8]">
              <span className="font-semibold text-[#7C6CFF] flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" />
                Lvl {userProfile.level}
              </span>
              <span className="text-[rgba(255,255,255,0.2)]">•</span>
              <span className="text-[#8B90A8] font-mono">{userProfile.totalXp} XP</span>
            </div>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 border-l border-[rgba(255,255,255,0.07)] hover:opacity-85 transition-opacity"
              >
                <div className="h-8 w-8 rounded-full bg-[#171A2B] border border-[rgba(255,255,255,0.1)] overflow-hidden flex items-center justify-center text-xs font-bold text-[#7C6CFF]">
                  {userProfile.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    (userProfile.name?.charAt(0) || "U").toUpperCase()
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-[#F2F3F8] leading-tight">
                    {authUser?.user_metadata?.name || userProfile.name || "Learner"}
                  </div>
                  <div className="text-[10px] text-[#3DDC97] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3DDC97]" />
                    Active
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-[#8B90A8] hidden xl:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] p-1.5 shadow-2xl z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-2 text-xs text-[#8B90A8] border-b border-[rgba(255,255,255,0.07)]">
                    Profile
                    <div className="font-semibold text-[#F2F3F8] truncate mt-0.5">
                      {authUser?.email || userProfile.email || "Learner"}
                    </div>
                  </div>

                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B] transition-colors font-medium"
                  >
                    <span>Settings & Persona</span>
                  </Link>

                  {authUser && (
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-0.5 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#FF6B7A] hover:bg-[#FF6B7A]/10 transition-colors font-medium"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
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
