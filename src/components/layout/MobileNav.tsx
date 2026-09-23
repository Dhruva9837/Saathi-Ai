"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCoach } from "@/context/CoachContext";
import {
  LayoutDashboard,
  Milestone,
  BotMessageSquare,
  BarChart3,
  Sparkles,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { setIsCheckInModalOpen } = useCoach();

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Roadmap",
      href: "/dashboard/roadmap",
      icon: Milestone,
    },
    {
      name: "Check-in",
      action: () => setIsCheckInModalOpen(true),
      isAction: true,
      icon: Sparkles,
    },
    {
      name: "AI Coach",
      href: "/dashboard/coach",
      icon: BotMessageSquare,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0B1120]/90 backdrop-blur-lg border-t border-[#1E293B] px-2 py-1.5 safe-area-pb">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item, idx) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#818CF8] text-white flex items-center justify-center shadow-lg shadow-[#6366F1]/40 border-2 border-[#0B1120] transform group-active:scale-95 transition-all">
                  <Icon className="h-5 w-5 animate-pulse" />
                </div>
                <span className="text-[10px] font-semibold text-[#818CF8] mt-0.5">
                  Check-in
                </span>
              </button>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive
                  ? "text-[#818CF8]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#818CF8]" : "text-[#94A3B8]"}`} />
              <span className="text-[10px] font-medium mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
