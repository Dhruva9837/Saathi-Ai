"use client";

import React, { useMemo } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Zap,
  Flame,
  Award,
  CheckCircle,
} from "lucide-react";

export const AnalyticsView: React.FC = () => {
  const { userProfile, activeGoal, checkIns, todayTasks } = useCoach();

  // 1. Dynamic Past 7 Days Study Time (Planned vs. Actual)
  const dailyTimeData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = i === 0 ? `${days[d.getDay()]} (Today)` : days[d.getDay()];

      // Check if user has a checkin for this date
      const checkin = checkIns.find((c) => c.date === dateStr);
      let actualMinutes = checkin ? checkin.actualMinutesSpent : 0;

      // If today, calculate from completed tasks
      if (i === 0) {
        const todayCompletedMinutes = todayTasks
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + (t.actualMinutes || t.estimatedMinutes), 0);
        actualMinutes = Math.max(actualMinutes, todayCompletedMinutes);
      }

      result.push({
        day: dayName,
        planned: activeGoal?.dailyMinutesTarget || 60,
        actual: actualMinutes,
      });
    }

    return result;
  }, [activeGoal, checkIns, todayTasks]);

  // 2. Dynamic Skill Mastery Radar from Active Goal Milestones
  const skillRadarData = useMemo(() => {
    if (!activeGoal || !activeGoal.milestones.length) {
      return [
        { subject: "Fundamentals", mastery: 20 },
        { subject: "Problem Solving", mastery: 15 },
        { subject: "Speed", mastery: 10 },
        { subject: "Syntax", mastery: 25 },
        { subject: "Edge Cases", mastery: 10 },
      ];
    }

    // Group tasks by topic / milestone title
    const topicMap: Record<string, { total: number; completed: number }> = {};

    activeGoal.milestones.forEach((m) => {
      m.tasks.forEach((t) => {
        const topic = t.topic || m.title.split(" ")[0] || "General";
        if (!topicMap[topic]) {
          topicMap[topic] = { total: 0, completed: 0 };
        }
        topicMap[topic].total += 1;
        if (t.status === "completed") {
          topicMap[topic].completed += 1;
        }
      });
    });

    const topics = Object.keys(topicMap);
    if (topics.length < 3) {
      return [
        { subject: activeGoal.title.split(" ")[0] || "Foundations", mastery: 25 },
        { subject: "Practice Drills", mastery: 15 },
        { subject: "Consistency", mastery: Math.min(100, userProfile.streakDays * 15) },
        { subject: "Revision", mastery: 20 },
        { subject: "Advanced", mastery: 10 },
      ];
    }

    return topics.slice(0, 6).map((topic) => {
      const data = topicMap[topic];
      const mastery = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 10;
      return {
        subject: topic,
        mastery: Math.max(mastery, 10),
      };
    });
  }, [activeGoal, userProfile]);

  // 3. Dynamic Aggregates
  const totalGoalTasks =
    activeGoal?.milestones.reduce((acc, m) => acc + m.tasks.length, 0) || 0;
  const completedGoalTasks =
    activeGoal?.milestones.reduce(
      (acc, m) => acc + m.tasks.filter((t) => t.status === "completed").length,
      0
    ) || 0;

  const retentionPercent =
    totalGoalTasks > 0 ? Math.round((completedGoalTasks / totalGoalTasks) * 100) : 0;

  const xpProgressInCurrentLevel = userProfile.totalXp % 150;
  const xpRemainingToNextLevel = 150 - xpProgressInCurrentLevel;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.07)] p-6 bg-[#11131F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded font-semibold bg-[#171A2B] text-[#7C6CFF] text-[10px] uppercase tracking-wider border border-[rgba(255,255,255,0.07)]">
                Analytics
              </span>
              <span className="text-[#8B90A8] text-xs">• Real-Time Performance</span>
            </div>
            <h2 className="text-xl font-bold text-[#F2F3F8] font-heading">
              Progress & Velocity
            </h2>
            <p className="text-xs text-[#8B90A8] mt-1">
              Tracking consistency, study hours, and skill curves for <span className="text-[#7C6CFF] font-medium">{activeGoal?.title || "Active Goal"}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[#171A2B] border border-[rgba(255,255,255,0.07)] text-[#3DDC97] text-xs font-semibold flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              <span>{userProfile.streakDays} Day Active Streak</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Daily Study Time: Planned vs Actual */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F2F3F8] flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#7C6CFF]" />
                <span>Daily Minutes: Planned vs. Actual</span>
              </h3>
              <p className="text-[11px] text-[#8B90A8]">
                Pacing calibrated dynamically via daily check-ins
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-[#8B90A8]">
                <span className="h-2 w-2 rounded bg-[#171A2B] border border-[rgba(255,255,255,0.15)]" /> Planned
              </span>
              <span className="flex items-center gap-1 text-[#7C6CFF]">
                <span className="h-2 w-2 rounded bg-[#7C6CFF]" /> Actual
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="day" stroke="#8B90A8" fontSize={11} />
                <YAxis stroke="#8B90A8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0B14",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "#F2F3F8",
                  }}
                />
                <Bar dataKey="planned" fill="#171A2B" stroke="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} name="Planned (min)" />
                <Bar dataKey="actual" fill="#7C6CFF" radius={[4, 4, 0, 0]} name="Actual (min)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Skill Mastery Radar Chart */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F2F3F8] flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#7C6CFF]" />
                <span>Skill Mastery Radar</span>
              </h3>
              <p className="text-[11px] text-[#8B90A8]">
                Generated dynamically from your roadmap tasks
              </p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-[#171A2B] text-[#7C6CFF] border border-[#7C6CFF]/30">
              Active Phase
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadarData}>
                <PolarGrid stroke="rgba(255,255,255,0.07)" />
                <PolarAngleAxis dataKey="subject" stroke="#8B90A8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={9} />
                <Radar
                  name="Mastery %"
                  dataKey="mastery"
                  stroke="#7C6CFF"
                  fill="#7C6CFF"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consistency & Gamification Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Streak & Consistency */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5">
          <div className="flex items-center gap-2 text-[#F5B544] mb-3">
            <Flame className="h-5 w-5 fill-[#F5B544] text-[#F5B544]" />
            <h4 className="text-xs font-bold text-[#F2F3F8] uppercase tracking-wider">
              Consistency Streak
            </h4>
          </div>
          <div className="text-3xl font-bold text-[#F5B544] font-mono mb-2">
            {userProfile.streakDays} {userProfile.streakDays === 1 ? "Day" : "Days"}
          </div>
          <p className="text-xs text-[#8B90A8] mb-3">
            {userProfile.streakDays > 1
              ? `You've maintained focus for ${userProfile.streakDays} consecutive days!`
              : "Day 1 of your journey! Complete today's mission to start your streak."}
          </p>
          <div className="flex gap-1.5 justify-between">
            {["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"].map((d, i) => (
              <div
                key={i}
                className={`flex-1 py-1.5 rounded border text-[10px] text-center font-bold ${
                  i < userProfile.streakDays
                    ? "bg-[#F5B544]/20 border-[#F5B544]/40 text-[#F5B544]"
                    : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8]/50"
                }`}
              >
                {d.split(" ")[1]}
              </div>
            ))}
          </div>
        </div>

        {/* Level & XP Progression */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5">
          <div className="flex items-center gap-2 text-[#7C6CFF] mb-3">
            <Award className="h-5 w-5" />
            <h4 className="text-xs font-bold text-[#F2F3F8] uppercase tracking-wider">
              Level & XP
            </h4>
          </div>
          <div className="text-3xl font-bold text-[#7C6CFF] font-mono mb-1">
            Level {userProfile.level}
          </div>
          <div className="text-xs text-[#8B90A8] mb-2">
            {userProfile.totalXp} XP Total ({xpRemainingToNextLevel} XP to Level {userProfile.level + 1})
          </div>
          <div className="w-full bg-[#0A0B14] h-2 rounded-full overflow-hidden border border-[rgba(255,255,255,0.07)]">
            <div
              className="bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] h-full rounded-full transition-all"
              style={{ width: `${(xpProgressInCurrentLevel / 150) * 100}%` }}
            />
          </div>
        </div>

        {/* Plan Retention Rate */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] p-5">
          <div className="flex items-center gap-2 text-[#3DDC97] mb-3">
            <CheckCircle className="h-5 w-5" />
            <h4 className="text-xs font-bold text-[#F2F3F8] uppercase tracking-wider">
              Goal Completion Rate
            </h4>
          </div>
          <div className="text-3xl font-bold text-[#3DDC97] font-mono mb-2">
            {retentionPercent}%
          </div>
          <p className="text-xs text-[#8B90A8]">
            {completedGoalTasks} of {totalGoalTasks} scheduled tasks completed.
          </p>
        </div>
      </div>
    </div>
  );
};
