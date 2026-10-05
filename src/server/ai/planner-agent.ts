import { CreateGoalSchema } from "@/lib/validators";
import { z } from "zod";
import { callLLM } from "./llm-client";
import { validateRoadmap, calculateGoalFeasibility } from "./roadmap-validator";

export interface GeneratedMilestone {
  title: string;
  description: string;
  order: number;
  estimatedDays: number;
  dayRange?: string;
  weeklyObjective?: string;
  expectedOutcome?: string;
  tasks: {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    estimatedMinutes: number;
    priority: "low" | "medium" | "high";
    topic: string;
    type?: "learn" | "practice" | "project" | "revision";
  }[];
}

export interface PlannerOutput {
  milestones: GeneratedMilestone[];
  feasibility: ReturnType<typeof calculateGoalFeasibility>;
  validationScore: number;
}

export async function generateRoadmapPlan(
  input: z.infer<typeof CreateGoalSchema> & {
    totalDaysTarget?: number;
    diagnosticScore?: number;
    calibratedLevel?: "beginner" | "intermediate" | "advanced";
  }
): Promise<PlannerOutput> {
  const deadlineDays = input.totalDaysTarget || 60;
  const effectiveLevel = input.calibratedLevel || input.currentLevel || "beginner";

  // Step 1: Constraint & Feasibility Check
  const feasibility = calculateGoalFeasibility(
    input.title,
    deadlineDays,
    input.dailyMinutesTarget,
    input.category,
    effectiveLevel
  );

  const systemPrompt = `You are Saathi AI's Elite Roadmap Planner & Productivity Coach.
Generate a structured, progressive learning roadmap for a user who wants to achieve a target goal.

Follow strict pedagogical guidelines:
1. Divide the journey into 4-6 distinct, ordered Phases covering the ${deadlineDays}-day timeline.
2. Include Weekly Objectives and Concrete Tangible Outcomes for each Phase.
3. Every task must be granular (Learn theory, Practice hands-on, or build a Project).
4. Task durations must strictly respect the daily budget of ${input.dailyMinutesTarget} minutes.
5. Include strategic Project phases and Revision/Buffer days.

Always output strict JSON conforming to this schema:
{
  "milestones": [
    {
      "title": "Phase 1: Foundations & Core Architecture",
      "description": "Master essential concepts and initial mental models.",
      "order": 1,
      "estimatedDays": 10,
      "dayRange": "Day 1 - 10",
      "weeklyObjective": "Understand core mental models and set up developer environment.",
      "expectedOutcome": "Build and run your first working base application.",
      "tasks": [
        {
          "title": "Core Architecture & Fundamentals",
          "description": "Learn key concepts and mental models.",
          "difficulty": "easy",
          "estimatedMinutes": ${Math.min(input.dailyMinutesTarget, 45)},
          "priority": "high",
          "topic": "Architecture",
          "type": "learn"
        },
        {
          "title": "Hands-on Practice Drill",
          "description": "Implement initial practical exercises.",
          "difficulty": "easy",
          "estimatedMinutes": ${input.dailyMinutesTarget},
          "priority": "high",
          "topic": "Practice",
          "type": "practice"
        }
      ]
    }
  ]
}`;

  const userPrompt = `Goal: ${input.title}
Scope Focus: ${feasibility.suggestedFocusScope || input.description || "Comprehensive Mastery"}
Total Timeline: ${deadlineDays} Days (${feasibility.totalHours} total available hours)
Daily Time Budget: ${input.dailyMinutesTarget} minutes/day (${input.preferredSchedule} preference)
Calibrated Starting Level: ${effectiveLevel} (Diagnostic Score: ${input.diagnosticScore ?? "N/A"})
Category: ${input.category}

Generate 4-5 phased milestones with explicit Day Ranges and actionable tasks fitting ${input.dailyMinutesTarget} mins daily. Return ONLY valid JSON.`;

  let milestones: GeneratedMilestone[] = [];

  // Try real LLM first
  const llmResult = await callLLM({
    systemPrompt,
    userPrompt,
    temperature: 0.4,
    responseFormatJson: true,
  });

  if (llmResult) {
    try {
      const cleaned = llmResult.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.milestones && Array.isArray(parsed.milestones) && parsed.milestones.length > 0) {
        milestones = parsed.milestones;
      }
    } catch (e) {
      console.warn("Failed to parse LLM roadmap response, falling back to heuristic engine:", e);
    }
  }

  // Deterministic Heuristic Fallback tailored to the goal
  if (!milestones || milestones.length === 0) {
    milestones = generateDeterministicPhases(input.title, input.category, deadlineDays, input.dailyMinutesTarget, effectiveLevel);
  }

  // Step 7: Roadmap Validation Layer
  const validation = validateRoadmap(milestones, input.dailyMinutesTarget, deadlineDays);

  return {
    milestones,
    feasibility,
    validationScore: validation.score,
  };
}

/**
 * Intelligent deterministic multi-phase generator fallback
 */
function generateDeterministicPhases(
  title: string,
  category: string,
  totalDays: number,
  dailyMinutes: number,
  level: string
): GeneratedMilestone[] {
  const isCoding = category === "coding" || title.toLowerCase().includes("next.js") || title.toLowerCase().includes("react") || title.toLowerCase().includes("dsa");

  if (isCoding && title.toLowerCase().includes("next.js")) {
    const p1Days = Math.round(totalDays * 0.16);
    const p2Days = Math.round(totalDays * 0.20);
    const p3Days = Math.round(totalDays * 0.25);
    const p4Days = Math.round(totalDays * 0.18);
    const p5Days = totalDays - (p1Days + p2Days + p3Days + p4Days);

    return [
      {
        title: "Phase 1: Next.js Architecture & App Router",
        description: "Mental models of Server vs Client components, layouts, and file-based routing conventions.",
        order: 1,
        estimatedDays: p1Days,
        dayRange: `Day 1 - ${p1Days}`,
        weeklyObjective: "Understand App Router, server vs client boundaries, and layouts.",
        expectedOutcome: "Build a multi-page interactive web application.",
        tasks: [
          {
            title: "Next.js 14/15 Architecture & Component Trees",
            description: "Learn server components, client components, and directive boundaries.",
            difficulty: "easy",
            estimatedMinutes: Math.min(dailyMinutes, 45),
            priority: "high",
            topic: "App Router",
            type: "learn",
          },
          {
            title: "Nested Layouts & Dynamic Routing Lab",
            description: "Create dynamic parameter routes `[slug]` and nested dashboard layouts.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Routing",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 2: Data Fetching, Mutations & Server Actions",
        description: "Parallel data fetching, caching strategies, revalidation, and secure Server Actions.",
        order: 2,
        estimatedDays: p2Days,
        dayRange: `Day ${p1Days + 1} - ${p1Days + p2Days}`,
        weeklyObjective: "Master server-side data fetching and form mutations.",
        expectedOutcome: "Connect database queries directly to Server Components.",
        tasks: [
          {
            title: "Async Server Components & Fetch Cache Tags",
            description: "Implement `fetch` caching options and revalidatePath triggers.",
            difficulty: "medium",
            estimatedMinutes: Math.min(dailyMinutes, 50),
            priority: "high",
            topic: "Data Fetching",
            type: "learn",
          },
          {
            title: "Server Actions & Optimistic UI Updates",
            description: "Build interactive form actions with `useOptimistic` hook.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Server Actions",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 3: Full-Stack Auth, Middleware & DB Integration",
        description: "Supabase / PostgreSQL database integration, user session tokens, and route protection.",
        order: 3,
        estimatedDays: p3Days,
        dayRange: `Day ${p1Days + p2Days + 1} - ${p1Days + p2Days + p3Days}`,
        weeklyObjective: "Build authenticated user flows with edge middleware.",
        expectedOutcome: "A secure end-to-end full-stack SaaS shell with auth & database.",
        tasks: [
          {
            title: "Supabase SSR Auth & Edge Middleware",
            description: "Implement cookie-based session management and protected route handlers.",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Authentication",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 4: Production Capstone Project",
        description: "Build a production-grade full-stack Next.js project with styling, caching, and database.",
        order: 4,
        estimatedDays: p4Days,
        dayRange: `Day ${p1Days + p2Days + p3Days + 1} - ${totalDays - p5Days}`,
        weeklyObjective: "Synthesize all concepts into a portfolio-ready product.",
        expectedOutcome: "Deploy live production app on Vercel with CI/CD.",
        tasks: [
          {
            title: "Capstone System Design & Database Schema",
            description: "Design relational schema, component hierarchy, and API contracts.",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Project",
            type: "project",
          },
        ],
      },
      {
        title: "Phase 5: Performance Optimization & Buffer Review",
        description: "Core Web Vitals profiling, dynamic imports, SEO metadata, and final polish.",
        order: 5,
        estimatedDays: p5Days,
        dayRange: `Day ${totalDays - p5Days + 1} - ${totalDays}`,
        weeklyObjective: "Polish edge cases, optimize performance, and conduct final review.",
        expectedOutcome: "Lighthouse 95+ score and production deployment.",
        tasks: [
          {
            title: "Bundle Analysis & Image/Font Optimization",
            description: "Run `@next/bundle-analyzer` and optimize layout shifts.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "medium",
            topic: "Optimization",
            type: "revision",
          },
        ],
      },
    ];
  }

  // Generic 4-Phase Curriculum
  const p1 = Math.round(totalDays * 0.25);
  const p2 = Math.round(totalDays * 0.35);
  const p3 = Math.round(totalDays * 0.25);
  const p4 = totalDays - (p1 + p2 + p3);

  return [
    {
      title: `Phase 1: Foundations & Core Concepts of ${title}`,
      description: "Establish core terminology, fundamental concepts, and essential workflow setup.",
      order: 1,
      estimatedDays: p1,
      dayRange: `Day 1 - ${p1}`,
      weeklyObjective: "Build foundational mental models and initial setup.",
      expectedOutcome: "Complete initial baseline drills without reference docs.",
      tasks: [
        {
          title: `Core Mental Models: ${title}`,
          description: "Study key principles and syntax.",
          difficulty: "easy",
          estimatedMinutes: Math.min(dailyMinutes, 45),
          priority: "high",
          topic: "Fundamentals",
          type: "learn",
        },
        {
          title: "Hands-on Practice Exercises",
          description: "Solve initial problem sets to reinforce learning.",
          difficulty: "easy",
          estimatedMinutes: dailyMinutes,
          priority: "high",
          topic: "Practice",
          type: "practice",
        },
      ],
    },
    {
      title: `Phase 2: Intermediate Application & Problem Solving`,
      description: "Tackle real-world scenarios and integrate techniques into practical case studies.",
      order: 2,
      estimatedDays: p2,
      dayRange: `Day ${p1 + 1} - ${p1 + p2}`,
      weeklyObjective: "Apply core knowledge to independent problems.",
      expectedOutcome: "Solve intermediate challenges with confidence.",
      tasks: [
        {
          title: "Applied Problem Solving Drills",
          description: "Build end-to-end practical exercises.",
          difficulty: "medium",
          estimatedMinutes: dailyMinutes,
          priority: "high",
          topic: "Application",
          type: "practice",
        },
      ],
    },
    {
      title: `Phase 3: Real-World Capstone Project`,
      description: "Consolidate skills by building a complete standalone project from scratch.",
      order: 3,
      estimatedDays: p3,
      dayRange: `Day ${p1 + p2 + 1} - ${p1 + p2 + p3}`,
      weeklyObjective: "Build a complete real-world project.",
      expectedOutcome: "A polished portfolio piece demonstrating subject mastery.",
      tasks: [
        {
          title: "Capstone Project Development",
          description: "Implement full features and real-world workflows.",
          difficulty: "hard",
          estimatedMinutes: dailyMinutes,
          priority: "high",
          topic: "Project",
          type: "project",
        },
      ],
    },
    {
      title: `Phase 4: Revision, Polish & Buffer Review`,
      description: "Reinforce sticky points, conduct mock assessments, and catch up on buffer items.",
      order: 4,
      estimatedDays: p4,
      dayRange: `Day ${p1 + p2 + p3 + 1} - ${totalDays}`,
      weeklyObjective: "Final mastery review and knowledge retention test.",
      expectedOutcome: "100% readiness and validated mastery.",
      tasks: [
        {
          title: "Comprehensive Active Recall Drill",
          description: "Test retention on all weak areas with spaced repetition.",
          difficulty: "medium",
          estimatedMinutes: dailyMinutes,
          priority: "high",
          topic: "Review",
          type: "revision",
        },
      ],
    },
  ];
}
