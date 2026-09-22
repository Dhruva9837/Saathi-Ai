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
  Compass,
  PlusCircle,
  Sparkles,
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
      name: "Roadmap",
      href: "/dashboard/roadmap",
      icon: Milestone,
    },
    {
      name: "AI Coach",
      href: "/dashboard/coach",
      icon: BotMessageSquare,
      badge: "Active",
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Weekly Review",
      href: "/dashboard/review",
      icon: CalendarCheck2,
    },
  ];

  return (
    <aside className="w-60 shrink-0 border-r border-[#1E293B] bg-[#0B1120] hidden md:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#151E2E] text-[#818CF8] border border-[#1E293B]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151E2E]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-[#818CF8]" : "text-[#94A3B8]"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        isActive
                          ? "bg-[#1E293B] text-[#818CF8]"
                          : "bg-[#151E2E] text-[#94A3B8]"
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
        <div className="p-3.5 rounded-xl border border-[#1E293B] bg-[#151E2E]">
          <div className="flex items-center gap-2 mb-1.5 text-[#818CF8]">
            <Compass className="h-4 w-4" />
            <span className="text-xs font-bold text-[#F8FAFC]">Create Goal</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mb-3 leading-relaxed">
            Generate an AI-structured roadmap tailored to your timeline.
          </p>
          <Link
            href="/onboarding"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#0B1120] hover:bg-[#1E293B] border border-[#1E293B] text-xs text-[#F8FAFC] font-medium transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5 text-[#818CF8]" />
            <span>New Roadmap</span>
          </Link>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-2.5 rounded-lg bg-[#151E2E] border border-[#1E293B]">
        <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
          <Sparkles className="h-3.5 w-3.5 text-[#22C55E]" />
          <span>Feedback Loop: <strong className="text-[#F8FAFC]">Active</strong></span>
        </div>
      </div>
    </aside>
  );
};
