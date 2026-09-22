import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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
import confetti from "canvas-confetti";

interface CoachState {
  goals: Goal[];
  activeGoalId: string;
  userProfile: UserProfile;
  checkIns: CheckIn[];
  latestProposal: AdaptivePlanProposal | null;
  chatMessages: ChatMessage[];
  weeklyReview: WeeklyReview;
  isCheckInModalOpen: boolean;

  // Actions
  setActiveGoalId: (id: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  submitCheckIn: (checkInData: Omit<CheckIn, "id" | "date" | "goalId">) => AdaptivePlanProposal;
  acceptAdaptiveProposal: (proposalId: string) => void;
  dismissProposal: () => void;
  createNewGoal: (newGoalData: Partial<Goal>) => Goal;
  sendChatMessage: (content: string, customTag?: string) => Promise<void>;
  setIsCheckInModalOpen: (open: boolean) => void;
  getActiveGoal: () => Goal | null;
  getTodayTasks: () => Task[];
}

export const useCoachStore = create<CoachState>()(
  persist(
    (set, get) => ({
      goals: initialGoals,
      activeGoalId: initialGoals[0]?.id || "",
      userProfile: initialUserProfile,
      checkIns: [],
      latestProposal: null,
      chatMessages: initialCoachMessages,
      weeklyReview: initialWeeklyReview,
      isCheckInModalOpen: false,

      setActiveGoalId: (id: string) => set({ activeGoalId: id }),

      setIsCheckInModalOpen: (open: boolean) => set({ isCheckInModalOpen: open }),

      getActiveGoal: () => {
        const { goals, activeGoalId } = get();
        return goals.find((g) => g.id === activeGoalId) || goals[0] || null;
      },

      getTodayTasks: () => {
        const activeGoal = get().getActiveGoal();
        if (!activeGoal) return [];
        const allTasks: Task[] = [];
        activeGoal.milestones.forEach((m) => {
          m.tasks.forEach((t) => allTasks.push(t));
        });
        return allTasks.slice(0, 4);
      },

      toggleTaskStatus: (taskId: string) => {
        const activeGoal = get().getActiveGoal();
        if (!activeGoal) return;

        let justCompleted = false;

        set((state) => {
          const updatedGoals = state.goals.map((g) => {
            if (g.id !== activeGoal.id) return g;
            const updatedMilestones = g.milestones.map((m) => {
              const updatedTasks = m.tasks.map((t) => {
                if (t.id === taskId) {
                  const newStatus = t.status === "completed" ? "pending" : "completed";
                  if (newStatus === "completed") justCompleted = true;
                  return { ...t, status: newStatus as any };
                }
                return t;
              });
              return { ...m, tasks: updatedTasks };
            });
            return { ...g, milestones: updatedMilestones };
          });

          let updatedProfile = state.userProfile;
          if (justCompleted) {
            const newXp = state.userProfile.totalXp + 25;
            const newLevel = Math.floor(newXp / 150) + 1;
            updatedProfile = {
              ...state.userProfile,
              totalXp: newXp,
              level: newLevel,
            };
          }

          return { goals: updatedGoals, userProfile: updatedProfile };
        });

        if (justCompleted) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
              colors: ["#6366f1", "#06b6d4", "#10b981"],
            });
          } catch (e) {}
        }
      },

      submitCheckIn: (checkInData) => {
        const activeGoal = get().getActiveGoal();
        if (!activeGoal) throw new Error("No active goal");

        const newCheckIn: CheckIn = {
          id: `checkin-${Date.now()}`,
          goalId: activeGoal.id,
          date: new Date().toISOString().split("T")[0],
          ...checkInData,
        };

        const todayTasks = get().getTodayTasks();
        const completed = todayTasks.filter((t) => checkInData.completedTaskIds.includes(t.id));
        const uncompleted = todayTasks.filter((t) => !checkInData.completedTaskIds.includes(t.id));

        const proposal = generateAdaptiveProposal(activeGoal, {
          actualMinutes: checkInData.actualMinutesSpent,
          plannedMinutes: activeGoal.dailyMinutesTarget,
          difficultyRating: checkInData.perceivedDifficulty,
          blockers: checkInData.blockers,
          reflectionNotes: checkInData.reflectionNotes,
          completedTasks: completed,
          uncompletedTasks: uncompleted,
        });

        set((state) => ({
          checkIns: [newCheckIn, ...state.checkIns],
          latestProposal: proposal,
        }));

        return proposal;
      },

      acceptAdaptiveProposal: (proposalId: string) => {
        const { latestProposal } = get();
        const activeGoal = get().getActiveGoal();
        if (!latestProposal || latestProposal.id !== proposalId || !activeGoal) return;

        const updatedGoal = applyAdaptivePlanToGoal(activeGoal, latestProposal);

        const coachMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "coach",
          content: `⚡ **Plan Adapted**: I've revised your daily target to **${latestProposal.proposedDailyTargetMinutes}m** and rescheduled uncompleted items. ${latestProposal.coachEncouragement}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          contextTag: "Plan Adaptation Applied",
        };

        set((state) => ({
          goals: state.goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
          chatMessages: [...state.chatMessages, coachMsg],
          latestProposal: null,
        }));
      },

      dismissProposal: () => set({ latestProposal: null }),

      createNewGoal: (newGoalData) => {
        const defaultMilestones = [
          {
            id: `ms-${Date.now()}-1`,
            goalId: `goal-${Date.now()}`,
            title: "Foundations & Core Fundamentals",
            description: "Master essential principles and build foundational competency.",
            order: 1,
            status: "in_progress" as const,
            estimatedDays: 14,
            tasks: [
              {
                id: `task-${Date.now()}-1`,
                milestoneId: `ms-${Date.now()}-1`,
                title: `Introduction to ${newGoalData.title || "Goal"} Essentials`,
                description: "Deep dive into initial mental models and workspace setup.",
                difficulty: "easy" as const,
                estimatedMinutes: 30,
                dueDate: new Date().toISOString().split("T")[0],
                status: "pending" as const,
                priority: "high" as const,
                topic: "Fundamentals",
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
              },
            ],
          },
          {
            id: `ms-${Date.now()}-2`,
            goalId: `goal-${Date.now()}`,
            title: "Intermediate Application & Deep Dives",
            description: "Scale knowledge into complex real-world problem solving.",
            order: 2,
            status: "locked" as const,
            estimatedDays: 21,
            tasks: [],
          },
          {
            id: `ms-${Date.now()}-3`,
            goalId: `goal-${Date.now()}`,
            title: "Advanced Mastery & Polish",
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

        set((state) => ({
          goals: [newGoal, ...state.goals],
          activeGoalId: newGoal.id,
        }));

        return newGoal;
      },

      sendChatMessage: async (content: string, customTag?: string) => {
        const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: "user",
          content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        set((state) => ({ chatMessages: [...state.chatMessages, userMsg] }));

        const activeGoal = get().getActiveGoal();

        try {
          const res = await fetch("/api/ai/coach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content,
              context: {
                goalTitle: activeGoal?.title || "Focus Mission",
                currentLevel: activeGoal?.currentLevel || "intermediate",
                streakDays: get().userProfile.streakDays,
                weakAreas: activeGoal?.weakAreas || ["Recursion & Backtracking"],
                strongAreas: activeGoal?.strongAreas || ["Arrays & Two Pointers"],
                targetDailyMinutes: activeGoal?.dailyMinutesTarget || 60,
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
              set((state) => ({ chatMessages: [...state.chatMessages, coachMsg] }));
              return;
            }
          }
        } catch (e) {
          console.warn("API coach fetch failed, using internal coach logic", e);
        }

        // Fallback response if fetch fails
        let reply = `In our **${activeGoal?.title || "Goal"}** roadmap, your consistency is solid. Let's focus on today's highest priority items. Let me know if you need any concept broken down!`;
        const lower = content.toLowerCase();
        if (lower.includes("30 min") || lower.includes("time") || lower.includes("short on time")) {
          reply = `No problem! When time is tight, high-intensity focus wins over skipping. Here is your **30-Minute Sprint Plan**:\n1. ⚡ **15m**: Solve one core pattern problem.\n2. 📝 **15m**: Review key takeaways in your notes.\n\nI've deprioritized the remaining tasks so your streak remains safe!`;
        }

        const fallbackMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: "coach",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          contextTag: customTag || `${activeGoal?.title || "Coach"} • Active Session`,
        };
        set((state) => ({ chatMessages: [...state.chatMessages, fallbackMsg] }));
      },
    }),
    {
      name: "saathi-coach-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        goals: state.goals,
        activeGoalId: state.activeGoalId,
        userProfile: state.userProfile,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
