"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Milestone,
  BotMessageSquare,
  BarChart3,
  CalendarCheck2,
  Sparkles,
  Compass,
  PlusCircle,
  HelpCircle,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: "Today",
    },
    {
      name: "Adaptive Roadmap",
      href: "/dashboard/roadmap",
      icon: Milestone,
    },
    {
      name: "AI Mentor Coach",
      href: "/dashboard/coach",
      icon: BotMessageSquare,
      badge: "Active",
    },
    {
      name: "Analytics & Progress",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Weekly AI Review",
      href: "/dashboard/review",
      icon: CalendarCheck2,
      badge: "New",
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-surfaceBorder/60 bg-surface/30 backdrop-blur-xl hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Coaching Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600/20 to-indigo-600/10 text-primary-300 border border-primary-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-surfaceLight/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-primary-400" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                        isActive
                          ? "bg-primary-500/20 text-primary-300"
                          : "bg-surfaceLight text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Goal Creation Card */}
        <div className="p-3.5 rounded-xl glass-panel border border-surfaceBorder bg-gradient-to-br from-surface to-surfaceLight/80">
          <div className="flex items-center gap-2 mb-2 text-primary-400">
            <Compass className="h-4 w-4" />
            <span className="text-xs font-bold text-slate-200">Start New Goal</span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Create another personalized roadmap with AI-tailored milestones.
          </p>
          <Link
            href="/onboarding"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-surfaceBorder hover:bg-primary-600/30 hover:border-primary-500/40 border border-surfaceBorder text-xs text-slate-200 font-medium transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5 text-accent-cyan" />
            <span>Launch Onboarding</span>
          </Link>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-xl bg-surfaceLight/40 border border-surfaceBorder/40">
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-accent-emerald" />
          <span>Adaptive Feedback Loop: <strong>Active</strong></span>
        </div>
      </div>
    </aside>
  );
};
