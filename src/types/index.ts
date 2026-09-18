export type Difficulty = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'missed' | 'adapted';
export type GoalLevel = 'beginner' | 'intermediate' | 'advanced';
export type SchedulePreference = 'morning' | 'afternoon' | 'evening' | 'flexible';

export interface Task {
  id: string;
  milestoneId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  actualMinutes?: number;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  priority: 'high' | 'medium' | 'low';
  tags?: string[];
  topic: string;
  notes?: string;
  wasAdapted?: boolean;
  adaptationReason?: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  order: number;
  status: 'locked' | 'in_progress' | 'completed';
  estimatedDays: number;
  tasks: Task[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDeadline: string; // YYYY-MM-DD
  currentLevel: GoalLevel;
  dailyMinutesTarget: number;
  preferredSchedule: SchedulePreference;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  category: 'coding' | 'language' | 'career' | 'academics' | 'fitness' | 'other';
  milestones: Milestone[];
  weakAreas: string[];
  strongAreas: string[];
}

export interface CheckIn {
  id: string;
  goalId: string;
  date: string; // YYYY-MM-DD
  completedTaskIds: string[];
  actualMinutesSpent: number;
  perceivedDifficulty: number; // 1 to 5
  blockers?: string;
  reflectionNotes?: string;
  mood: 'great' | 'good' | 'neutral' | 'struggling' | 'burnt_out';
  confidenceScore: number; // 1 to 5
  aiFeedbackSummary?: string;
}

export interface AdaptivePlanProposal {
  id: string;
  goalId: string;
  date: string;
  triggerReason: string;
  previousDailyTargetMinutes: number;
  proposedDailyTargetMinutes: number;
  rescheduledTasksCount: number;
  splitTasksCount: number;
  difficultyAdjustment?: 'reduced' | 'increased' | 'maintained';
  keyChangesSummary: string[];
  coachEncouragement: string;
  applied: boolean;
}

export interface WeeklyReview {
  id: string;
  goalId: string;
  weekStartDate: string;
  weekEndDate: string;
  tasksCompleted: number;
  tasksTotal: number;
  completionRatePercent: number;
  consistencyScorePercent: number;
  totalHoursSpent: number;
  strongAreas: string[];
  weakAreas: string[];
  keyWins: string[];
  nextWeekFocus: string[];
  aiExecutiveSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach' | 'system';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  contextTag?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  streakDays: number;
  totalXp: number;
  level: number;
  joinedDate: string;
}
