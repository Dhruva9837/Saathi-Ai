import { CreateGoalSchema } from "@/lib/validators";
import { z } from "zod";
import { callLLM } from "./llm-client";

export interface GeneratedMilestone {
  title: string;
  description: string;
  order: number;
  estimatedDays: number;
  tasks: {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    estimatedMinutes: number;
    priority: "low" | "medium" | "high";
    topic: string;
  }[];
}

export async function generateRoadmapPlan(input: z.infer<typeof CreateGoalSchema>): Promise<GeneratedMilestone[]> {
  const systemPrompt = `You are Saathi AI's Strategic Roadmap Planner.
Generate a structured learning curriculum/plan for a user who wants to achieve a target goal.
Always output strict JSON conforming to this schema:
{
  "milestones": [
    {
      "title": "Phase 1: ...",
      "description": "...",
      "order": 1,
      "estimatedDays": 14,
      "tasks": [
        {
          "title": "...",
          "description": "...",
          "difficulty": "easy" | "medium" | "hard",
          "estimatedMinutes": 30,
          "priority": "high" | "medium" | "low",
          "topic": "..."
        }
      ]
    }
  ]
}`;

  const userPrompt = `Goal Title: ${input.title}
Description: ${input.description || "N/A"}
Current Skill Level: ${input.currentLevel}
Target Deadline: ${input.targetDeadline}
Daily Time Budget: ${input.dailyMinutesTarget} minutes/day
Category: ${input.category}

Generate 3-4 progressive milestones with 2-3 focused starter tasks each. Ensure task durations respect the ${input.dailyMinutesTarget} min/day budget. Return ONLY valid JSON.`;

  // 1. Try real LLM first
  const llmResult = await callLLM({
    systemPrompt,
    userPrompt,
    temperature: 0.4,
    responseFormatJson: true,
  });

  if (llmResult) {
    try {
      // Clean possible markdown code fences
      const cleaned = llmResult.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.milestones && Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        return parsed.milestones;
      }
    } catch (e) {
      console.warn("Failed to parse LLM roadmap response, falling back to heuristic engine:", e);
    }
  }

  // 2. Intelligent Deterministic Heuristic Fallback
  const isCoding = input.category === "coding" || input.title.toLowerCase().includes("dsa") || input.title.toLowerCase().includes("code");

  if (isCoding) {
    return [
      {
        title: "Phase 1: Linear Structures & Algorithmic Patterns",
        description: "Master two pointers, sliding window, prefix sums, and core array manipulations.",
        order: 1,
        estimatedDays: 14,
        tasks: [
          {
            title: `Arrays & Prefix Sum Foundations for ${input.title}`,
            description: "Deep dive into interval queries and subarray sum techniques.",
            difficulty: "easy",
            estimatedMinutes: Math.min(input.dailyMinutesTarget, 45),
            priority: "high",
            topic: "Arrays",
          },
          {
            title: "Two-Pointer & Sliding Window Problem Set",
            description: "Solve 3 template-based problems with variable boundary conditions.",
            difficulty: input.currentLevel === "beginner" ? "easy" : "medium",
            estimatedMinutes: Math.min(input.dailyMinutesTarget, 60),
            priority: "high",
            topic: "Two Pointers",
          },
        ],
      },
      {
        title: "Phase 2: Non-Linear Structures & Tree Traversals",
        description: "Binary Trees, BSTs, DFS/BFS traversals, and recursion state machines.",
        order: 2,
        estimatedDays: 20,
        tasks: [
          {
            title: "Tree Traversals & Depth Calculation",
            description: "Master pre/in/post order DFS and level-order BFS.",
            difficulty: "medium",
            estimatedMinutes: input.dailyMinutesTarget,
            priority: "high",
            topic: "Trees",
          },
        ],
      },
      {
        title: "Phase 3: Dynamic Programming & Advanced Graph Algorithms",
        description: "State transition formulas, memoization patterns, and shortest path algorithms.",
        order: 3,
        estimatedDays: 25,
        tasks: [
          {
            title: "1D DP & Knapsack Sub-problems",
            description: "Convert top-down recursive intuition into space-optimized tabulation.",
            difficulty: "hard",
            estimatedMinutes: input.dailyMinutesTarget,
            priority: "high",
            topic: "Dynamic Programming",
          },
        ],
      },
    ];
  }

  // Fallback for general skills / languages / custom goals
  return [
    {
      title: "Phase 1: Foundations & Core Immersion",
      description: `Establish core habits, fundamental syntax, and active recall drills for ${input.title}.`,
      order: 1,
      estimatedDays: 14,
      tasks: [
        {
          title: `Fundamental Concept Mastery: ${input.title}`,
          description: "Establish foundational mental models and initial setup.",
          difficulty: "easy",
          estimatedMinutes: Math.min(input.dailyMinutesTarget, 30),
          priority: "high",
          topic: "Basics",
        },
        {
          title: "Hands-on Practice & Active Recall",
          description: "Solve initial exercises and document sticky points in notes.",
          difficulty: "medium",
          estimatedMinutes: Math.min(input.dailyMinutesTarget, 45),
          priority: "high",
          topic: "Practice",
        },
      ],
    },
    {
      title: "Phase 2: Intermediate Application & Projects",
      description: "Tackle real-world scenarios and integrate components into comprehensive exercises.",
      order: 2,
      estimatedDays: 21,
      tasks: [
        {
          title: "Real-world Practical Drill",
          description: "Build a mini project or comprehensive case study.",
          difficulty: "medium",
          estimatedMinutes: input.dailyMinutesTarget,
          priority: "high",
          topic: "Projects",
        },
      ],
    },
    {
      title: "Phase 3: High Velocity Mastery & Polish",
      description: "Edge case testing, mock interviews/exams, and final review.",
      order: 3,
      estimatedDays: 28,
      tasks: [
        {
          title: "Speed Test & Timed Assessment",
          description: "Verify retention under realistic deadline constraints.",
          difficulty: "hard",
          estimatedMinutes: input.dailyMinutesTarget,
          priority: "high",
          topic: "Assessment",
        },
      ],
    },
  ];
}
