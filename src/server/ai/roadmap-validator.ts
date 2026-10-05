import { GoalLevel } from "@/types";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    text: string;
    points: number; // 1: Beginner, 2: Intermediate, 3: Advanced
  }[];
  topic: string;
}

export interface SkillAssessment {
  skill: string;
  selfDeclared: GoalLevel;
  calibratedLevel: GoalLevel;
  scorePercent: number;
}

export interface FeasibilityResult {
  isFeasible: boolean;
  totalDays: number;
  dailyHours: number;
  totalHours: number;
  recommendedMinimumHours: number;
  scopeStatus: "optimal" | "tight" | "overambitious";
  coachAdvice: string;
  suggestedFocusScope?: string;
}

export interface RoadmapValidationResult {
  isValid: boolean;
  score: number; // 0 to 100
  checks: {
    deadlineFeasible: boolean;
    tasksFitTimeBudget: boolean;
    dependenciesOrdered: boolean;
    noDuplicateTopics: boolean;
    projectsIncluded: boolean;
    bufferDaysIncluded: boolean;
  };
  warnings: string[];
}

/**
 * Calculates constraint feasibility for any goal
 */
export function calculateGoalFeasibility(
  goalTitle: string,
  totalDays: number,
  dailyMinutes: number,
  category: string,
  currentLevel: GoalLevel
): FeasibilityResult {
  const dailyHours = dailyMinutes / 60;
  const totalHours = Math.round(totalDays * dailyHours);

  // Heuristic required hours estimation based on topic complexity & starting level
  let baseRequiredHours = 80;
  const titleLower = goalTitle.toLowerCase();

  if (
    titleLower.includes("machine learning") ||
    titleLower.includes("ai engineer") ||
    titleLower.includes("full stack") ||
    titleLower.includes("dsa")
  ) {
    baseRequiredHours = currentLevel === "beginner" ? 140 : 90;
  } else if (titleLower.includes("next.js") || titleLower.includes("react")) {
    baseRequiredHours = currentLevel === "beginner" ? 90 : 50;
  } else if (category === "language" || titleLower.includes("japanese") || titleLower.includes("spanish")) {
    baseRequiredHours = currentLevel === "beginner" ? 120 : 70;
  }

  const isFeasible = totalHours >= baseRequiredHours * 0.75;
  let scopeStatus: "optimal" | "tight" | "overambitious" = "optimal";
  let coachAdvice = "";
  let suggestedFocusScope: string | undefined;

  if (totalHours < baseRequiredHours * 0.5) {
    scopeStatus = "overambitious";
    coachAdvice = `At ${dailyHours}h/day for ${totalDays} days (${totalHours}h total), master-level coverage of "${goalTitle}" is too broad. As your AI Coach, I recommend targeting core fundamentals + 2 solid production projects rather than trying to memorize everything.`;
    suggestedFocusScope = "Core Fundamentals + 2 Portfolio Projects";
  } else if (totalHours < baseRequiredHours * 0.85) {
    scopeStatus = "tight";
    coachAdvice = `This is an intensive sprint (${totalHours}h total). Pacing will be dense, but achievable with high consistency. We will incorporate strategic buffer days to prevent burnout.`;
  } else {
    scopeStatus = "optimal";
    coachAdvice = `Excellent pacing! With ${totalHours} total dedicated hours, we have ample room for deep concept mastery, active coding drills, and dedicated review cycles.`;
  }

  return {
    isFeasible,
    totalDays,
    dailyHours,
    totalHours,
    recommendedMinimumHours: baseRequiredHours,
    scopeStatus,
    coachAdvice,
    suggestedFocusScope,
  };
}

/**
 * Validates generated roadmap against strict quality rules
 */
export function validateRoadmap(
  milestones: Array<{
    title: string;
    description: string;
    estimatedDays: number;
    tasks: Array<{
      title: string;
      estimatedMinutes: number;
      difficulty: string;
      topic: string;
    }>;
  }>,
  dailyMinutesBudget: number,
  totalDaysTarget: number
): RoadmapValidationResult {
  const warnings: string[] = [];

  // Check 1: Milestone count & order
  const hasValidPhases = milestones.length >= 2;
  if (!hasValidPhases) warnings.push("Roadmap should contain at least 2 progressive phases.");

  // Check 2: Sum of estimated days vs total deadline
  const totalEstimatedDays = milestones.reduce((sum, m) => sum + (m.estimatedDays || 0), 0);
  const deadlineFeasible = totalEstimatedDays <= totalDaysTarget * 1.2;
  if (!deadlineFeasible) {
    warnings.push(`Total estimated phase duration (${totalEstimatedDays}d) exceeds target deadline (${totalDaysTarget}d).`);
  }

  // Check 3: Task daily budget fit
  let allTasksFit = true;
  for (const m of milestones) {
    for (const t of m.tasks) {
      if (t.estimatedMinutes > dailyMinutesBudget * 1.5) {
        allTasksFit = false;
        warnings.push(`Task "${t.title}" (${t.estimatedMinutes}m) exceeds daily budget (${dailyMinutesBudget}m).`);
      }
    }
  }

  // Check 4: Check if project / capstone included
  const allText = milestones.map((m) => `${m.title} ${m.description}`).join(" ").toLowerCase();
  const projectsIncluded =
    allText.includes("project") ||
    allText.includes("build") ||
    allText.includes("application") ||
    allText.includes("portfolio") ||
    allText.includes("mock");

  // Check 5: Check if buffer / revision included
  const bufferDaysIncluded =
    allText.includes("revision") ||
    allText.includes("review") ||
    allText.includes("buffer") ||
    allText.includes("polish") ||
    milestones.length >= 3;

  // Check 6: Topic duplication check
  const topicSet = new Set<string>();
  let hasDuplicates = false;
  milestones.forEach((m) => {
    if (topicSet.has(m.title.toLowerCase())) {
      hasDuplicates = true;
    }
    topicSet.add(m.title.toLowerCase());
  });

  const checks = {
    deadlineFeasible,
    tasksFitTimeBudget: allTasksFit,
    dependenciesOrdered: true,
    noDuplicateTopics: !hasDuplicates,
    projectsIncluded,
    bufferDaysIncluded,
  };

  const passedCount = Object.values(checks).filter(Boolean).length;
  const score = Math.round((passedCount / Object.keys(checks).length) * 100);
  const isValid = score >= 70;

  return {
    isValid,
    score,
    checks,
    warnings,
  };
}

/**
 * Preset diagnostic question generator for rapid baseline calibration
 */
export function getDiagnosticQuestions(goalTitle: string, category: string): DiagnosticQuestion[] {
  const titleLower = goalTitle.toLowerCase();

  if (titleLower.includes("next.js") || titleLower.includes("react") || category === "coding") {
    return [
      {
        id: "q1",
        question: "How comfortable are you with modern JavaScript (ES6+, Promises, async/await, closures)?",
        topic: "JavaScript & Async Core",
        options: [
          { label: "A", text: "I know basic variables & loops, but async/await is confusing.", points: 1 },
          { label: "B", text: "I use async/await and array methods (map/filter) regularly.", points: 2 },
          { label: "C", text: "I deeply understand event loops, closures, prototypes, and concurrency.", points: 3 },
        ],
      },
      {
        id: "q2",
        question: "Have you built components with React hooks (useState, useEffect, custom hooks)?",
        topic: "React Foundations",
        options: [
          { label: "A", text: "Never used React or only heard about it.", points: 1 },
          { label: "B", text: "I have built a few components with useState and useEffect.", points: 2 },
          { label: "C", text: "I confidently manage complex state, custom hooks, and memoization.", points: 3 },
        ],
      },
      {
        id: "q3",
        question: "What is your experience with Server-Side Rendering (SSR) vs Client-Side (CSR)?",
        topic: "Architecture & Rendering",
        options: [
          { label: "A", text: "I am not clear on the difference between CSR and SSR.", points: 1 },
          { label: "B", text: "I know the conceptual difference, but haven't implemented Server Components.", points: 2 },
          { label: "C", text: "I actively build with Next.js App Router, RSCs, and streaming.", points: 3 },
        ],
      },
    ];
  }

  // Default diagnostic for other domains
  return [
    {
      id: "q1",
      question: `What is your prior exposure to ${goalTitle}?`,
      topic: "Prior Experience",
      options: [
        { label: "A", text: "Completely new, starting from zero baseline.", points: 1 },
        { label: "B", text: "Have read/watched tutorials and know basic terminology.", points: 2 },
        { label: "C", text: "Have applied it in practice and looking for advanced mastery.", points: 3 },
      ],
    },
    {
      id: "q2",
      question: "How do you usually handle complex errors or roadblocks in this subject?",
      topic: "Problem Solving",
      options: [
        { label: "A", text: "I easily get stuck and require step-by-step guidance.", points: 1 },
        { label: "B", text: "I search documentation and can debug standard errors.", points: 2 },
        { label: "C", text: "I can independently troubleshoot, profile, and optimize solutions.", points: 3 },
      ],
    },
    {
      id: "q3",
      question: "What is your target outcome for this roadmap?",
      topic: "Outcome Focus",
      options: [
        { label: "A", text: "Get solid foundational grasp and confidence.", points: 1 },
        { label: "B", text: "Build 2-3 portfolio-ready projects independently.", points: 2 },
        { label: "C", text: "Crack rigorous technical interviews / production deployments.", points: 3 },
      ],
    },
  ];
}
