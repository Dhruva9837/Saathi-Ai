import { Goal, UserProfile, WeeklyReview, ChatMessage } from "@/types";

export const initialUserProfile: UserProfile = {
  name: "",
  email: "",
  avatarUrl: "",
  streakDays: 0,
  totalXp: 0,
  level: 1,
  joinedDate: new Date().toISOString().split("T")[0],
  coachPersona: "supportive",
  adaptationSensitivity: "balanced",
  dailyReminders: true,
  soundEffects: true,
};

export const initialGoals: Goal[] = [];

export const initialWeeklyReview: WeeklyReview = {
  id: "review-init",
  goalId: "",
  weekStartDate: new Date().toISOString().split("T")[0],
  weekEndDate: new Date().toISOString().split("T")[0],
  tasksCompleted: 0,
  tasksTotal: 0,
  completionRatePercent: 0,
  consistencyScorePercent: 0,
  totalHoursSpent: 0,
  strongAreas: [],
  weakAreas: [],
  keyWins: ["Create your first roadmap to start tracking your progress!"],
  nextWeekFocus: ["Complete daily focus tasks and check-in to calibrate your plan."],
  aiExecutiveSummary:
    "Welcome to Saathi AI! Generate your first roadmap to begin daily adaptive coaching and weekly retrospectives.",
};

export const initialCoachMessages: ChatMessage[] = [
  {
    id: "msg-welcome",
    sender: "coach",
    content: "👋 Welcome to Saathi AI! I am your AI Coach. Create your first goal to get a personalized, adaptive roadmap and daily focus missions.",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    suggestedActions: [
      { label: "Create First Goal", action: "create_goal" },
    ],
    contextTag: "Welcome",
  },
];
