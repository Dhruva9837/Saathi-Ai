"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Goal,
  Task,
  CheckIn,
  AdaptivePlanProposal,
  WeeklyReview,
  ChatMessage,
  UserProfile,
} from "@/types";
import {
  initialGoals,
  initialUserProfile,
  initialWeeklyReview,
  initialCoachMessages,
} from "@/lib/dummy-data";
import { generateAdaptiveProposal, applyAdaptivePlanToGoal } from "@/lib/adaptive-engine";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import confetti from "canvas-confetti";

interface CoachContextType {
  goals: Goal[];
  activeGoal: Goal | null;
  setActiveGoalId: (id: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateActiveGoal: (goalData: Partial<Goal>) => void;
  todayTasks: Task[];
  toggleTaskStatus: (taskId: string) => void;
  checkIns: CheckIn[];
  latestProposal: AdaptivePlanProposal | null;
  submitCheckIn: (
    checkInData: Omit<CheckIn, "id" | "date" | "goalId">
  ) => AdaptivePlanProposal;
  acceptAdaptiveProposal: (proposalId: string) => void;
  dismissProposal: () => void;
  createNewGoal: (newGoalData: Partial<Goal>) => Goal;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string, customTag?: string) => Promise<void>;
  weeklyReview: WeeklyReview;
  isCheckInModalOpen: boolean;
  setIsCheckInModalOpen: (open: boolean) => void;
  isLoading: boolean;
}

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [activeGoalId, setActiveGoalId] = useState<string>(initialGoals[0]?.id || "");
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [latestProposal, setLatestProposal] = useState<AdaptivePlanProposal | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialCoachMessages);
  const [weeklyReview, setWeeklyReview] = useState<WeeklyReview>(initialWeeklyReview);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Initial Load & Auth Listener for Supabase
  useEffect(() => {
    // First load from localStorage for instant offline rendering
    try {
      const savedGoals = localStorage.getItem("saathi_v2_goals");
      if (savedGoals) {
        const parsedGoals: Goal[] = JSON.parse(savedGoals);
        // Filter out legacy dummy goals
        const realGoals = parsedGoals.filter(
          (g) => !["goal-dsa-1", "goal-japanese-2", "goal-portfolio-3"].includes(g.id)
        );
        setGoals(realGoals);
        if (realGoals.length > 0) {
          const savedActiveGoalId = localStorage.getItem("saathi_v2_active_goal_id");
          const validActiveId = realGoals.find((g) => g.id === savedActiveGoalId)?.id || realGoals[0].id;
          setActiveGoalId(validActiveId);
        } else {
          setActiveGoalId("");
        }
      }
      const savedProfile = localStorage.getItem("saathi_v2_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.email === "user@example.com" && parsed.streakDays === 7) {
          setUserProfile(initialUserProfile);
        } else {
          setUserProfile(parsed);
        }
      }
      const savedMessages = localStorage.getItem("saathi_v2_messages");
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    }

    // If Supabase is configured, check live auth & fetch real database records
    if (isSupabaseConfigured()) {
      const supabase = createClient();

      const fetchSupabaseData = async (uid: string) => {
        setIsLoading(true);
        try {
          // Fetch Profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", uid)
            .single();

          if (profileData) {
            setUserProfile((prev) => ({
              ...prev,
              name: profileData.name || prev.name,
              email: profileData.email || prev.email,
              avatarUrl: profileData.avatar_url || prev.avatarUrl,
              streakDays: profileData.streak_days ?? prev.streakDays,
              totalXp: profileData.total_xp ?? prev.totalXp,
              level: profileData.level ?? prev.level,
              coachPersona: profileData.coach_persona || prev.coachPersona,
              adaptationSensitivity: profileData.adaptation_sensitivity || prev.adaptationSensitivity,
            }));
          }

          // Fetch Goals, Milestones, and Tasks
          const { data: dbGoals } = await supabase
            .from("goals")
            .select(`
              *,
              milestones (
                *,
                tasks (*)
              )
            `)
            .eq("user_id", uid)
            .order("created_at", { ascending: false });

          if (dbGoals && dbGoals.length > 0) {
            const formattedGoals: Goal[] = dbGoals.map((g: any) => ({
              id: g.id,
              title: g.title,
              description: g.description || "",
              targetDeadline: g.deadline,
              currentLevel: g.current_level,
              dailyMinutesTarget: g.daily_minutes_target,
              preferredSchedule: g.preferred_schedule,
              status: g.status,
              category: g.category,
              weakAreas: g.weak_areas || [],
              strongAreas: g.strong_areas || [],
              createdAt: g.created_at,
              milestones: (g.milestones || [])
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((m: any) => ({
                  id: m.id,
                  goalId: m.goal_id,
                  title: m.title,
                  description: m.description || "",
                  order: m.order_index,
                  status: m.status,
                  estimatedDays: m.estimated_days,
                  tasks: (m.tasks || []).map((t: any) => ({
                    id: t.id,
                    milestoneId: t.milestone_id,
                    title: t.title,
                    description: t.description || "",
                    difficulty: t.difficulty,
                    estimatedMinutes: t.estimated_minutes,
                    actualMinutes: t.actual_minutes,
                    dueDate: t.due_date,
                    status: t.status,
                    priority: t.priority,
                    topic: t.topic,
                    tags: t.tags || [],
                    wasAdapted: t.was_adapted,
                    adaptationReason: t.adaptation_reason,
                  })),
                })),
            }));

            setGoals(formattedGoals);
            setActiveGoalId(formattedGoals[0]?.id || "");
          }

          // Fetch Checkins
          const { data: dbCheckins } = await supabase
            .from("checkins")
            .select("*")
            .eq("user_id", uid)
            .order("created_at", { ascending: false });

          if (dbCheckins && dbCheckins.length > 0) {
            const formattedCheckins: CheckIn[] = dbCheckins.map((c: any) => ({
              id: c.id,
              goalId: c.goal_id,
              date: c.checkin_date,
              completedTaskIds: c.completed_task_ids || [],
              actualMinutesSpent: c.actual_minutes_spent,
              perceivedDifficulty: c.perceived_difficulty,
              mood: c.mood,
              confidenceScore: c.confidence_score,
              blockers: c.blockers,
              reflectionNotes: c.reflection_notes,
            }));
            setCheckIns(formattedCheckins);
          }
        } catch (err) {
          console.warn("Error fetching Supabase user data:", err);
        } finally {
          setIsLoading(false);
        }
      };

      // Check current session
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setUserId(user.id);
          fetchSupabaseData(user.id);
        }
      });

      // Listen for auth state changes (login/logout)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserId(session.user.id);
          fetchSupabaseData(session.user.id);
        } else {
          setUserId(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("saathi_v2_goals", JSON.stringify(goals));
      localStorage.setItem("saathi_v2_active_goal_id", activeGoalId);
      localStorage.setItem("saathi_v2_profile", JSON.stringify(userProfile));
      localStorage.setItem("saathi_v2_messages", JSON.stringify(chatMessages));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [goals, activeGoalId, userProfile, chatMessages]);

  const activeGoal = goals.find((g) => g.id === activeGoalId) || goals[0] || null;

  const updateUserProfile = (profileUpdates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profileUpdates };
      if (isSupabaseConfigured() && userId) {
        const supabase = createClient();
        supabase
          .from("profiles")
          .update({
            name: updated.name,
            coach_persona: updated.coachPersona,
            adaptation_sensitivity: updated.adaptationSensitivity,
            streak_days: updated.streakDays,
            total_xp: updated.totalXp,
            level: updated.level,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
          .then(({ error }) => {
            if (error) console.warn("Supabase profile update warning:", error);
          });
      }
      return updated;
    });
  };

  const updateActiveGoal = (goalUpdates: Partial<Goal>) => {
    if (!activeGoal) return;
    setGoals((prev) =>
      prev.map((g) => (g.id === activeGoal.id ? { ...g, ...goalUpdates } : g))
    );

    if (isSupabaseConfigured() && userId && activeGoal.id && !activeGoal.id.startsWith("goal-dummy")) {
      const supabase = createClient();
      supabase
        .from("goals")
        .update({
          title: goalUpdates.title ?? activeGoal.title,
          description: goalUpdates.description ?? activeGoal.description,
          daily_minutes_target: goalUpdates.dailyMinutesTarget ?? activeGoal.dailyMinutesTarget,
          status: goalUpdates.status ?? activeGoal.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeGoal.id)
        .then(({ error }) => {
          if (error) console.warn("Supabase goal update warning:", error);
        });
    }
  };

  // Extract tasks for today
  const todayTasks: Task[] = React.useMemo(() => {
    if (!activeGoal) return [];
    const allTasks: Task[] = [];
    activeGoal.milestones.forEach((m) => {
      m.tasks.forEach((t) => {
        allTasks.push(t);
      });
    });
    // Return first milestone's tasks or tasks marked for today
    return allTasks.slice(0, 4);
  }, [activeGoal]);

  const toggleTaskStatus = (taskId: string) => {
    if (!activeGoal) return;

    let justCompleted = false;
    let finalStatus: "completed" | "pending" = "pending";

    setGoals((prevGoals) =>
      prevGoals.map((g) => {
        if (g.id !== activeGoal.id) return g;
        const updatedMilestones = g.milestones.map((m) => {
          const updatedTasks = m.tasks.map((t) => {
            if (t.id === taskId) {
              const newStatus = t.status === "completed" ? "pending" : "completed";
              finalStatus = newStatus;
              if (newStatus === "completed") justCompleted = true;
              return { ...t, status: newStatus as any };
            }
            return t;
          });
          return { ...m, tasks: updatedTasks };
        });
        return { ...g, milestones: updatedMilestones };
      })
    );

    // Sync task status to Supabase if not dummy id
    if (isSupabaseConfigured() && userId && !taskId.startsWith("task-")) {
      const supabase = createClient();
      supabase
        .from("tasks")
        .update({ status: finalStatus, updated_at: new Date().toISOString() })
        .eq("id", taskId)
        .then(({ error }) => {
          if (error) console.warn("Supabase task sync error:", error);
        });
    }

    if (justCompleted) {
      // Trigger rewarding confetti & XP boost
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#6366f1", "#06b6d4", "#10b981"],
        });
      } catch (e) {}

      setUserProfile((prev) => {
        const newXp = prev.totalXp + 25;
        const newLevel = Math.floor(newXp / 150) + 1;
        const updated = {
          ...prev,
          totalXp: newXp,
          level: newLevel,
        };

        if (isSupabaseConfigured() && userId) {
          const supabase = createClient();
          supabase
            .from("profiles")
            .update({ total_xp: newXp, level: newLevel, updated_at: new Date().toISOString() })
            .eq("id", userId)
            .then(() => {});
        }

        return updated;
      });
    }
  };

  const submitCheckIn = (
    checkInData: Omit<CheckIn, "id" | "date" | "goalId">
  ): AdaptivePlanProposal => {
    if (!activeGoal) throw new Error("No active goal");

    const newCheckIn: CheckIn = {
      id: `checkin-${Date.now()}`,
      goalId: activeGoal.id,
      date: new Date().toISOString().split("T")[0],
      ...checkInData,
    };

    setCheckIns((prev) => [newCheckIn, ...prev]);

    // Calculate uncompleted vs completed tasks
    const completed = todayTasks.filter((t) => checkInData.completedTaskIds.includes(t.id));
    const uncompleted = todayTasks.filter((t) => !checkInData.completedTaskIds.includes(t.id));

    // Run Adaptive Coaching Engine
    const proposal = generateAdaptiveProposal(activeGoal, {
      actualMinutes: checkInData.actualMinutesSpent,
      plannedMinutes: activeGoal.dailyMinutesTarget,
      difficultyRating: checkInData.perceivedDifficulty,
      blockers: checkInData.blockers,
      reflectionNotes: checkInData.reflectionNotes,
      completedTasks: completed,
      uncompletedTasks: uncompleted,
    });

    // Sync Check-in to Supabase
    if (isSupabaseConfigured() && userId && activeGoal.id && !activeGoal.id.startsWith("goal-dummy")) {
      const supabase = createClient();
      supabase
        .from("checkins")
        .insert({
          user_id: userId,
          goal_id: activeGoal.id,
          checkin_date: newCheckIn.date,
          completed_task_ids: checkInData.completedTaskIds.filter((id) => !id.startsWith("task-")),
          actual_minutes_spent: checkInData.actualMinutesSpent,
          perceived_difficulty: checkInData.perceivedDifficulty,
          mood: checkInData.mood,
          confidence_score: checkInData.confidenceScore,
          blockers: checkInData.blockers,
          reflection_notes: checkInData.reflectionNotes,
          ai_feedback_summary: proposal.coachEncouragement,
        })
        .then(({ error }) => {
          if (error) console.warn("Supabase checkin insert warning:", error);
        });
    }

    setLatestProposal(proposal);
    return proposal;
  };

  const acceptAdaptiveProposal = (proposalId: string) => {
    if (!latestProposal || latestProposal.id !== proposalId || !activeGoal) return;

    const updatedGoal = applyAdaptivePlanToGoal(activeGoal, latestProposal);
    setGoals((prev) => prev.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)));

    // Post coaching notification message to chat
    const coachMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "coach",
      content: `⚡ **Plan Adapted**: I've revised your daily target to **${latestProposal.proposedDailyTargetMinutes}m** and rescheduled uncompleted items. ${latestProposal.coachEncouragement}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextTag: "Plan Adaptation Applied",
    };
    setChatMessages((prev) => [...prev, coachMsg]);

    setLatestProposal(null);
  };

  const dismissProposal = () => {
    setLatestProposal(null);
  };

  const createNewGoal = (newGoalData: Partial<Goal>): Goal => {
    const defaultMilestones = [
      {
        id: `ms-${Date.now()}-1`,
        goalId: `goal-${Date.now()}`,
        title: "Foundations & Core Fundamentals",
        description: "Master the essential principles and build foundational competency.",
        order: 1,
        status: "in_progress" as const,
        estimatedDays: 14,
        tasks: [
          {
            id: `task-${Date.now()}-1`,
            milestoneId: `ms-${Date.now()}-1`,
            title: `Introduction to ${newGoalData.title || "Goal"} Essentials`,
            description: "Deep dive into initial mental models and setup workspace.",
            difficulty: "easy" as const,
            estimatedMinutes: 30,
            dueDate: new Date().toISOString().split("T")[0],
            status: "pending" as const,
            priority: "high" as const,
            topic: "Fundamentals",
            tags: [],
          },
          {
            id: `task-${Date.now()}-2`,
            milestoneId: `ms-${Date.now()}-1`,
            title: "First Hands-on Problem / Project Exercise",
            description: "Apply concepts learned with an active implementation task.",
            difficulty: "medium" as const,
            estimatedMinutes: 45,
            dueDate: new Date().toISOString().split("T")[0],
            status: "pending" as const,
            priority: "high" as const,
            topic: "Practice",
            tags: [],
          },
          {
            id: `task-${Date.now()}-3`,
            milestoneId: `ms-${Date.now()}-1`,
            title: "Review & Active Recall Check",
            description: "Summarize key learnings and resolve unanswered questions.",
            difficulty: "easy" as const,
            estimatedMinutes: 15,
            dueDate: new Date().toISOString().split("T")[0],
            status: "pending" as const,
            priority: "medium" as const,
            topic: "Recall",
            tags: [],
          },
        ],
      },
      {
        id: `ms-${Date.now()}-2`,
        goalId: `goal-${Date.now()}`,
        title: "Intermediate Application & Projects",
        description: "Scale knowledge into complex real-world problem solving.",
        order: 2,
        status: "locked" as const,
        estimatedDays: 21,
        tasks: [],
      },
      {
        id: `ms-${Date.now()}-3`,
        goalId: `goal-${Date.now()}`,
        title: "Advanced Mastery & Capstone Target",
        description: "Polish edge cases, speed tests, and final milestone review.",
        order: 3,
        status: "locked" as const,
        estimatedDays: 30,
        tasks: [],
      },
    ];

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoalData.title || "New Goal",
      description: newGoalData.description || "Personal goal track",
      targetDeadline: newGoalData.targetDeadline || "2026-12-31",
      currentLevel: newGoalData.currentLevel || "beginner",
      dailyMinutesTarget: newGoalData.dailyMinutesTarget || 60,
      preferredSchedule: newGoalData.preferredSchedule || "evening",
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      category: newGoalData.category || "coding",
      weakAreas: [],
      strongAreas: [],
      milestones: defaultMilestones,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setActiveGoalId(newGoal.id);

    // Sync to Supabase if logged in
    if (isSupabaseConfigured() && userId) {
      const supabase = createClient();
      supabase
        .from("goals")
        .insert({
          user_id: userId,
          title: newGoal.title,
          description: newGoal.description,
          deadline: newGoal.targetDeadline,
          current_level: newGoal.currentLevel,
          daily_minutes_target: newGoal.dailyMinutesTarget,
          preferred_schedule: newGoal.preferredSchedule,
          status: newGoal.status,
          category: newGoal.category,
          weak_areas: newGoal.weakAreas || [],
          strong_areas: newGoal.strongAreas || [],
        })
        .select()
        .single()
        .then(async ({ data: savedGoal, error }) => {
          if (error || !savedGoal) {
            console.warn("Supabase goal creation warning:", error);
            return;
          }

          // Insert Milestones & Tasks for this goal
          for (const ms of defaultMilestones) {
            const { data: savedMs } = await supabase
              .from("milestones")
              .insert({
                goal_id: savedGoal.id,
                title: ms.title,
                description: ms.description,
                order_index: ms.order,
                status: ms.status,
                estimated_days: ms.estimatedDays,
              })
              .select()
              .single();

            if (savedMs && ms.tasks.length > 0) {
              const taskInserts = ms.tasks.map((t: any) => ({
                goal_id: savedGoal.id,
                milestone_id: savedMs.id,
                title: t.title,
                description: t.description,
                difficulty: t.difficulty,
                estimated_minutes: t.estimatedMinutes,
                due_date: t.dueDate,
                status: t.status,
                priority: t.priority,
                topic: t.topic,
                tags: t.tags || [],
              }));
              await supabase.from("tasks").insert(taskInserts);
            }
          }
        });
    }

    return newGoal;
  };

  const sendChatMessage = async (content: string, customTag?: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/ai/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          context: {
            goalTitle: activeGoal?.title || "Focus Mission",
            currentLevel: activeGoal?.currentLevel || "intermediate",
            streakDays: userProfile.streakDays,
            weakAreas: activeGoal?.weakAreas || ["Recursion & Backtracking"],
            strongAreas: activeGoal?.strongAreas || ["Arrays & Two Pointers"],
            targetDailyMinutes: activeGoal?.dailyMinutesTarget || 60,
            coachPersona: userProfile.coachPersona || "supportive",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          const coachMsg: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: "coach",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            contextTag: customTag || `${activeGoal?.title || "Coach"} • Active Session`,
          };
          setChatMessages((prev) => [...prev, coachMsg]);
          return;
        }
      }
    } catch (e) {
      console.warn("API coach fetch failed, falling back to local heuristic", e);
    }

    // Heuristic fallback customized by persona
    let reply = `In our **${activeGoal?.title || "Goal"}** roadmap, your consistency is solid. Let's focus on executing today's mission with high focus!`;
    const lower = content.toLowerCase();

    if (userProfile.coachPersona === "tough_love") {
      reply = `Focus is a muscle. Stop scrolling, pick today's top task for **${activeGoal?.title || "Goal"}**, and give it 100% intensity for the next 25 minutes. No excuses!`;
    } else if (userProfile.coachPersona === "analytical") {
      reply = `Based on your telemetry, cognitive efficiency peaks during uninterrupted 45-minute blocks. Today's task density is optimized for your target of **${activeGoal?.dailyMinutesTarget || 60} minutes**.`;
    } else if (userProfile.coachPersona === "socratic") {
      reply = `Before diving into today's mission: What is the single core concept in **${activeGoal?.title || "Goal"}** that feels most ambiguous right now? Let's unpack it first.`;
    }

    if (lower.includes("30 min") || lower.includes("time") || lower.includes("short on time")) {
      reply = `No problem! When time is tight, high-intensity focus wins over skipping. Here is your **30-Minute Sprint Plan**:\n1. ⚡ **15m**: Solve one core pattern problem.\n2. 📝 **15m**: Review key takeaways in your notes.\n\nI've deprioritized secondary tasks so your streak remains safe!`;
    } else if (lower.includes("recursion") || lower.includes("stuck") || lower.includes("explain")) {
      reply = `Here is the golden mental model for **Recursion**:\n\n1. **Base Case**: When does the problem become trivial? (e.g. \`if (root == null) return 0;\`)\n2. **Hypothesis**: Assume your recursive call \`solve(n-1)\` works flawlessly.\n3. **Induction Step**: Connect the result of \`solve(n-1)\` with the current element \`n\`.\n\nWould you like a step-by-step walkthrough?`;
    }

    const coachMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: "coach",
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      contextTag: customTag || `${activeGoal?.title || "Coach"} • Active Session`,
    };

    setChatMessages((prev) => [...prev, coachMsg]);
  };

  return (
    <CoachContext.Provider
      value={{
        goals,
        activeGoal,
        setActiveGoalId,
        userProfile,
        updateUserProfile,
        updateActiveGoal,
        todayTasks,
        toggleTaskStatus,
        checkIns,
        latestProposal,
        submitCheckIn,
        acceptAdaptiveProposal,
        dismissProposal,
        createNewGoal,
        chatMessages,
        sendChatMessage,
        weeklyReview,
        isCheckInModalOpen,
        setIsCheckInModalOpen,
        isLoading,
      }}
    >
      {children}
    </CoachContext.Provider>
  );
};

export const useCoach = () => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error("useCoach must be used within a CoachProvider");
  }
  return context;
};
