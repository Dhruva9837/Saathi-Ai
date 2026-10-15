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
  const studyDaysCount = input.studyDays && input.studyDays.length > 0 ? input.studyDays.length : 7;
  const feasibility = calculateGoalFeasibility(
    input.title,
    deadlineDays,
    input.dailyMinutesTarget,
    input.category,
    effectiveLevel,
    studyDaysCount
  );

  const systemPrompt = `You are Saathi AI's Elite Roadmap Planner & Productivity Coach.
Generate a structured, progressive learning roadmap for a user who wants to achieve a target goal.

Follow strict pedagogical guidelines:
1. Divide the journey into 4-6 distinct, ordered Phases covering the ${deadlineDays}-day timeline.
2. Include Weekly Objectives and Concrete Tangible Outcomes for each Phase.
3. Every task must be granular (Learn theory, Practice hands-on, or build a Project/Assessment).
4. Task durations must strictly respect the daily budget of ${input.dailyMinutesTarget} minutes.
5. Include strategic Project/Practical phases and Revision/Buffer days.

Always output strict JSON conforming to this schema:
{
  "milestones": [
    {
      "title": "Phase 1: Foundations & Core Vocabulary",
      "description": "Master essential concepts and initial mental models.",
      "order": 1,
      "estimatedDays": 15,
      "dayRange": "Day 1 - 15",
      "weeklyObjective": "Understand core fundamentals and baseline vocabulary.",
      "expectedOutcome": "Formulate basic expressions and complete initial exercises.",
      "tasks": [
        {
          "title": "Pronunciation, Alphabet & Core Vocabulary",
          "description": "Learn phonetics, alphabet sounds, and essential greetings.",
          "difficulty": "easy",
          "estimatedMinutes": ${Math.min(input.dailyMinutesTarget, 45)},
          "priority": "high",
          "topic": "Fundamentals",
          "type": "learn"
        },
        {
          "title": "Active Practice & Drill",
          "description": "Reinforce concepts with structured hands-on drills.",
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
Target Outcome / Success Definition: ${input.targetOutcome || input.description || "Comprehensive Mastery"}
Total Timeline: ${deadlineDays} Days (${feasibility.totalHours} total available hours, ${studyDaysCount} study days/week)
Daily Time Budget: ${input.dailyMinutesTarget} minutes/day (${input.preferredSchedule} preference)
Calibrated Starting Level: ${effectiveLevel} (Diagnostic Score: ${input.diagnosticScore ?? "N/A"})
Category: ${input.category}
Learning Preference: ${input.learningPreference || "Hands-on practice & structured drills"}
Assessment Method: ${input.assessmentMethod || "Milestone quizzes & mock test"}

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
  const isLanguage =
    category === "language" ||
    title.toLowerCase().includes("french") ||
    title.toLowerCase().includes("spanish") ||
    title.toLowerCase().includes("japanese") ||
    title.toLowerCase().includes("jlpt") ||
    title.toLowerCase().includes("german") ||
    title.toLowerCase().includes("language");

  if (isLanguage) {
    const p1 = Math.round(totalDays * 0.25);
    const p2 = Math.round(totalDays * 0.25);
    const p3 = Math.round(totalDays * 0.25);
    const p4 = totalDays - (p1 + p2 + p3);

    return [
      {
        title: "Phase 1: Foundations & Core Vocabulary",
        description: "Pronunciation, alphabet, basic vocabulary, numbers, and everyday greetings.",
        order: 1,
        estimatedDays: p1,
        dayRange: `Day 1 - ${p1}`,
        weeklyObjective: "Master phonetic accents, pronunciation rules, and initial 150 survival words.",
        expectedOutcome: "Introduce yourself comfortably, count, and pronounce words accurately.",
        tasks: [
          {
            title: "Alphabet, Phonetics & Pronunciation Rules",
            description: "Study key phonetic sounds, silent letters, and vowel accents.",
            difficulty: "easy",
            estimatedMinutes: Math.min(dailyMinutes, 45),
            priority: "high",
            topic: "Phonetics",
            type: "learn",
          },
          {
            title: "Basic Greetings & Everyday Vocabulary Drill",
            description: "Memorize first 50 essential survival expressions with flashcards.",
            difficulty: "easy",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Vocabulary",
            type: "practice",
          },
          {
            title: "Numbers, Days, Months & Personal Pronouns",
            description: "Practice counting, expressing dates, and subject pronouns.",
            difficulty: "easy",
            estimatedMinutes: Math.min(dailyMinutes, 45),
            priority: "medium",
            topic: "Core Syntax",
            type: "learn",
          },
        ],
      },
      {
        title: "Phase 2: Core Grammar & Sentence Construction",
        description: "Articles, verbs conjugation, sentence construction, and listening comprehension.",
        order: 2,
        estimatedDays: p2,
        dayRange: `Day ${p1 + 1} - ${p1 + p2}`,
        weeklyObjective: "Conjugate high-frequency verbs in present tense and form questions and negative statements.",
        expectedOutcome: "Construct full grammatical sentences and follow beginner conversational audio.",
        tasks: [
          {
            title: "Articles, Gender Rules & Plurals",
            description: "Learn definite/indefinite articles and noun gender patterns.",
            difficulty: "medium",
            estimatedMinutes: Math.min(dailyMinutes, 45),
            priority: "high",
            topic: "Grammar",
            type: "learn",
          },
          {
            title: "Essential Verbs & Present Tense Conjugation",
            description: "Master regular verbs and top irregular verbs (être, avoir, aller, faire).",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Conjugation",
            type: "practice",
          },
          {
            title: "Sentence Construction & Listening Drills",
            description: "Form questions, negation, and listen to spoken dialogue audio.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Listening",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 3: Practical Immersion & Conversational Usage",
        description: "Reading, writing, conversation, and real-world comprehension exercises.",
        order: 3,
        estimatedDays: p3,
        dayRange: `Day ${p1 + p2 + 1} - ${p1 + p2 + p3}`,
        weeklyObjective: "Hold 10-15 minute daily situational dialogues, read dialogues, and write short paragraphs.",
        expectedOutcome: "Communicate in travel, restaurant, and everyday scenarios with natural pacing.",
        tasks: [
          {
            title: "Situational Roleplay & Conversational Drills",
            description: "Practice ordering food, asking directions, and introducing friends.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Conversation",
            type: "practice",
          },
          {
            title: "Short Story Reading & Comprehension Lab",
            description: "Read graded reader paragraphs and answer comprehension questions.",
            difficulty: "medium",
            estimatedMinutes: Math.min(dailyMinutes, 50),
            priority: "high",
            topic: "Reading",
            type: "practice",
          },
          {
            title: "Daily Journal Writing & Audio Shadowing",
            description: "Write 5 sentences about your day and repeat after native speakers.",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "medium",
            topic: "Writing",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 4: Revision, Mock Assessment & Weak Areas",
        description: "Revision, mock tests, weak areas repair, and retention polish.",
        order: 4,
        estimatedDays: p4,
        dayRange: `Day ${p1 + p2 + p3 + 1} - ${totalDays}`,
        weeklyObjective: "Reinforce difficult grammar points and take a full benchmark mock test.",
        expectedOutcome: "Attain 85%+ score on target proficiency benchmark and confident retention.",
        tasks: [
          {
            title: "Full-Length Benchmark Mock Proficiency Test",
            description: "Simulate an official level assessment (reading, listening, grammar).",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Assessment",
            type: "project",
          },
          {
            title: "Targeted Weak Areas & Spaced Repetition Drill",
            description: "Review missed test questions and drill high-friction conjugations.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Revision",
            type: "revision",
          },
        ],
      },
    ];
  }

  const isDSA = title.toLowerCase().includes("dsa") || title.toLowerCase().includes("algorithm") || title.toLowerCase().includes("leetcode");
  if (isDSA) {
    const p1 = Math.round(totalDays * 0.25);
    const p2 = Math.round(totalDays * 0.30);
    const p3 = Math.round(totalDays * 0.25);
    const p4 = totalDays - (p1 + p2 + p3);

    return [
      {
        title: "Phase 1: Linear Structures & Two Pointers",
        description: "Arrays, String manipulation, HashMaps, Two Pointers, and Sliding Window.",
        order: 1,
        estimatedDays: p1,
        dayRange: `Day 1 - ${p1}`,
        weeklyObjective: "Master core array patterns and complexity tradeoffs.",
        expectedOutcome: "Solve 20+ foundational LeetCode Easy/Medium problems with clean code.",
        tasks: [
          {
            title: "Arrays, HashMaps & Frequency Counters",
            description: "Implement Two-Sum, Group Anagrams, and frequency hashing.",
            difficulty: "easy",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Arrays",
            type: "practice",
          },
          {
            title: "Two Pointers & Sliding Window Patterns",
            description: "Solve Container With Most Water, 3Sum, and Best Time to Buy/Sell Stock.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Pointers",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 2: Recursion, Trees & Graph Traversals",
        description: "Linked Lists, Binary Trees, BFS, DFS, and Topological Sorting.",
        order: 2,
        estimatedDays: p2,
        dayRange: `Day ${p1 + 1} - ${p1 + p2}`,
        weeklyObjective: "Master tree recursions and graph connectivity algorithms.",
        expectedOutcome: "Write tree traversals and graph BFS/DFS without templates.",
        tasks: [
          {
            title: "Binary Tree Traversals & Depth Calculation",
            description: "Solve Maximum Depth, Invert Tree, and Level Order Traversal.",
            difficulty: "medium",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Trees",
            type: "practice",
          },
          {
            title: "Graph BFS/DFS & Island Counting",
            description: "Implement Number of Islands, Clone Graph, and Course Schedule.",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Graphs",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 3: Dynamic Programming & Heaps",
        description: "1D/2D Dynamic Programming, Backtracking, and Priority Queues.",
        order: 3,
        estimatedDays: p3,
        dayRange: `Day ${p1 + p2 + 1} - ${p1 + p2 + p3}`,
        weeklyObjective: "Recognize optimal substructure and subproblem recurrence.",
        expectedOutcome: "Formulate DP states and solve Coin Change, Longest Subsequence.",
        tasks: [
          {
            title: "1D Dynamic Programming Foundations",
            description: "Solve Climbing Stairs, House Robber, and Coin Change.",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "DP",
            type: "practice",
          },
        ],
      },
      {
        title: "Phase 4: Timed Mock Interviews & Polish",
        description: "Mock technical interview sessions, blind-75 speed solving, and revision.",
        order: 4,
        estimatedDays: p4,
        dayRange: `Day ${p1 + p2 + p3 + 1} - ${totalDays}`,
        weeklyObjective: "Communicate solution approach in 35-minute timed sessions.",
        expectedOutcome: "Ready for live technical screen with high confidence.",
        tasks: [
          {
            title: "Timed 45-Min LeetCode Simulation",
            description: "Solve 2 unseen problems with active verbal explanation.",
            difficulty: "hard",
            estimatedMinutes: dailyMinutes,
            priority: "high",
            topic: "Mock Interview",
            type: "project",
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
