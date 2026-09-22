import { z } from "zod";

export const GoalLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export const SchedulePreferenceSchema = z.enum(["morning", "afternoon", "evening", "flexible"]);
export const TaskDifficultySchema = z.enum(["easy", "medium", "hard"]);
export const TaskPrioritySchema = z.enum(["low", "medium", "high"]);
export const TaskStatusSchema = z.enum(["pending", "in_progress", "completed", "missed", "adapted"]);

export const CreateTaskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters"),
  description: z.string().default(""),
  difficulty: TaskDifficultySchema.default("medium"),
  estimatedMinutes: z.number().min(5).max(480).default(30),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  priority: TaskPrioritySchema.default("medium"),
  topic: z.string().min(1, "Topic is required"),
  tags: z.array(z.string()).default([]),
});

export const CreateMilestoneSchema = z.object({
  title: z.string().min(3, "Milestone title must be at least 3 characters"),
  description: z.string().default(""),
  order: z.number().int().min(1),
  estimatedDays: z.number().int().min(1).default(14),
  tasks: z.array(CreateTaskSchema).default([]),
});

export const CreateGoalSchema = z.object({
  title: z.string().min(3, "Goal title must be at least 3 characters"),
  description: z.string().min(5, "Please provide a short description or purpose"),
  targetDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  currentLevel: GoalLevelSchema.default("beginner"),
  dailyMinutesTarget: z.number().min(15).max(480).default(60),
  preferredSchedule: SchedulePreferenceSchema.default("evening"),
  category: z.enum(["coding", "language", "career", "academics", "fitness", "other"]).default("coding"),
  priorExperience: z.string().optional(),
});

export const SubmitCheckInSchema = z.object({
  goalId: z.string().min(1, "Goal ID is required"),
  completedTaskIds: z.array(z.string()).default([]),
  actualMinutesSpent: z.number().min(0).max(1440),
  perceivedDifficulty: z.number().int().min(1).max(5),
  blockers: z.string().optional(),
  reflectionNotes: z.string().optional(),
  mood: z.enum(["great", "good", "neutral", "struggling", "burnt_out"]).default("good"),
  confidenceScore: z.number().int().min(1).max(5).default(3),
});

export const ChatMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  contextTag: z.string().optional(),
});
