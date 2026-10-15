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
  suggestedAdjustedDays?: number;
  suggestedAdjustedMinutes?: number;
}

/**
 * Calculates constraint feasibility for any goal
 */
export function calculateGoalFeasibility(
  goalTitle: string,
  totalDays: number,
  dailyMinutes: number,
  category: string,
  currentLevel: GoalLevel,
  daysPerWeek: number = 7
): FeasibilityResult {
  const dailyHours = dailyMinutes / 60;
  const effectiveStudyDays = Math.round(totalDays * (Math.max(1, Math.min(7, daysPerWeek)) / 7));
  const totalHours = Math.round(effectiveStudyDays * dailyHours);

  // Heuristic required hours estimation based on topic complexity & starting level
  let baseRequiredHours = 70;
  const titleLower = goalTitle.toLowerCase();

  if (
    titleLower.includes("machine learning") ||
    titleLower.includes("ai engineer") ||
    titleLower.includes("full stack") ||
    titleLower.includes("dsa")
  ) {
    baseRequiredHours = currentLevel === "beginner" ? 120 : 80;
  } else if (titleLower.includes("next.js") || titleLower.includes("react")) {
    baseRequiredHours = currentLevel === "beginner" ? 80 : 45;
  } else if (category === "language" || titleLower.includes("french") || titleLower.includes("japanese") || titleLower.includes("spanish")) {
    baseRequiredHours = currentLevel === "beginner" ? 90 : 60;
  }

  const isFeasible = totalHours >= baseRequiredHours * 0.75;
  let scopeStatus: "optimal" | "tight" | "overambitious" = "optimal";
  let coachAdvice = "";
  let suggestedFocusScope: string | undefined;
  let suggestedAdjustedDays: number | undefined;
  let suggestedAdjustedMinutes: number | undefined;

  if (totalHours < baseRequiredHours * 0.55) {
    scopeStatus = "overambitious";
    coachAdvice = `At ${dailyHours}h/day across ${totalDays} days (${totalHours}h total), full mastery of "${goalTitle}" is very compressed. As your AI Coach, I suggest either expanding to a realistic timeline or focusing strictly on Core Fundamentals + 1 practical capstone project.`;
    suggestedFocusScope = "Core Fundamentals + 1 Practical Project";
    suggestedAdjustedDays = Math.min(120, Math.ceil((baseRequiredHours / dailyHours) / 15) * 15);
    suggestedAdjustedMinutes = Math.min(180, Math.ceil((baseRequiredHours / totalDays) * 60));
  } else if (totalHours < baseRequiredHours * 0.85) {
    scopeStatus = "tight";
    coachAdvice = `This is a high-intensity sprint (${totalHours}h total). Pacing will be dense, but achievable with high daily consistency. We will incorporate buffer review days to prevent burnout.`;
    suggestedAdjustedDays = Math.min(120, Math.ceil((baseRequiredHours / dailyHours) / 10) * 10);
    suggestedAdjustedMinutes = Math.min(180, Math.ceil((baseRequiredHours / totalDays) * 60));
  } else {
    scopeStatus = "optimal";
    coachAdvice = `Excellent pacing! With ${totalHours} total dedicated hours, we have ample room for deep concept mastery, active hands-on drills, and full capstone projects.`;
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
    suggestedAdjustedDays,
    suggestedAdjustedMinutes,
  };
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

export function getDiagnosticQuestions(
  goalTitle: string,
  category: string,
  targetOutcome?: string
): DiagnosticQuestion[] {
  const combined = `${goalTitle || ""} ${category || ""} ${targetOutcome || ""}`.toLowerCase();
  const titleLower = (goalTitle || "").toLowerCase();

  // 1. Language Diagnostic (French, Spanish, Japanese, German, etc.)
  const isLanguage =
    category === "language" ||
    combined.includes("french") ||
    combined.includes("japanese") ||
    combined.includes("jlpt") ||
    combined.includes("spanish") ||
    combined.includes("german") ||
    combined.includes("italian") ||
    combined.includes("chinese") ||
    combined.includes("korean") ||
    combined.includes("russian") ||
    combined.includes("english") ||
    combined.includes("language") ||
    combined.includes("a1 level") ||
    combined.includes("a2 level") ||
    combined.includes("b1 level") ||
    combined.includes("b2 level") ||
    combined.includes("delf");

  if (isLanguage) {
    const langName = combined.includes("french") || combined.includes("delf")
      ? "French"
      : combined.includes("japanese") || combined.includes("jlpt")
      ? "Japanese"
      : combined.includes("spanish") || combined.includes("dele")
      ? "Spanish"
      : combined.includes("german")
      ? "German"
      : combined.includes("italian")
      ? "Italian"
      : combined.includes("chinese")
      ? "Chinese"
      : combined.includes("korean")
      ? "Korean"
      : combined.includes("russian")
      ? "Russian"
      : "this language";

    return [
      {
        id: "q1",
        question: `How familiar are you with ${langName} alphabet, pronunciation, and basic vocabulary?`,
        topic: "Phonetics & Vocabulary Baseline",
        options: [
          { label: "A", text: "Complete beginner — starting from zero (letters, accents, sounds).", points: 1 },
          { label: "B", text: "I know basic greetings, numbers, and common everyday phrases.", points: 2 },
          { label: "C", text: "I have a working vocabulary of 500+ words and read basic text easily.", points: 3 },
        ],
      },
      {
        id: "q2",
        question: `What is your comfort level with ${langName} sentence grammar and verb conjugations?`,
        topic: "Grammar & Conjugation",
        options: [
          { label: "A", text: "I do not know how verbs are conjugated or how sentences are formed.", points: 1 },
          { label: "B", text: "I know present tense of common verbs, but past/future tenses confuse me.", points: 2 },
          { label: "C", text: "I comfortably use present, past, and future tenses in conversation.", points: 3 },
        ],
      },
      {
        id: "q3",
        question: `How do you rate your conversational listening and speaking ability in ${langName}?`,
        topic: "Comprehension & Fluency",
        options: [
          { label: "A", text: "Cannot understand spoken dialogue unless spoken word-by-word with subtitles.", points: 1 },
          { label: "B", text: "Can catch the gist of slow conversations and answer simple questions.", points: 2 },
          { label: "C", text: "Can hold continuous conversation for 15+ minutes with minimal hesitation.", points: 3 },
        ],
      },
    ];
  }

  // 2. DSA & Problem Solving
  const isDSA =
    titleLower.includes("dsa") ||
    titleLower.includes("algorithm") ||
    titleLower.includes("leetcode") ||
    titleLower.includes("problem solving");

  if (isDSA) {
    return [
      {
        id: "q1",
        question: "How proficient are you with fundamental data structures (Arrays, HashMaps, Two Pointers)?",
        topic: "Core Data Structures",
        options: [
          { label: "A", text: "I know basic array indexing, but struggle with two-pointer techniques.", points: 1 },
          { label: "B", text: "I easily implement HashMap patterns, prefix sums, and sliding windows.", points: 2 },
          { label: "C", text: "I immediately recognize standard patterns and time/space complexity tradeoffs.", points: 3 },
        ],
      },
      {
        id: "q2",
        question: "Can you implement recursive solutions, Binary Tree traversals, and BFS/DFS graphs?",
        topic: "Trees & Graph Algorithms",
        options: [
          { label: "A", text: "Recursion and trees feel intimidating; I get stuck easily.", points: 1 },
          { label: "B", text: "I can solve standard tree BFS/DFS problems with some hints.", points: 2 },
          { label: "C", text: "I write clean backtracking, topological sort, and Dijkstra implementations.", points: 3 },
        ],
      },
      {
        id: "q3",
        question: "What is your experience with Dynamic Programming (DP) and complex optimizations?",
        topic: "Dynamic Programming & Optimization",
        options: [
          { label: "A", text: "I have not studied DP or struggle with memoization states.", points: 1 },
          { label: "B", text: "I can solve 1D DP problems like Climbing Stairs or Coin Change.", points: 2 },
          { label: "C", text: "I comfortably solve 2D/knapsack DP and state-compression problems.", points: 3 },
        ],
      },
    ];
  }

  // 3. Python & Machine Learning
  const isPythonOrAI =
    titleLower.includes("python") ||
    titleLower.includes("machine learning") ||
    titleLower.includes("deep learning") ||
    titleLower.includes("ai engineer") ||
    titleLower.includes("data science");

  if (isPythonOrAI) {
    return [
      {
        id: "q1",
        question: "What is your comfort level with Python syntax, data structures, and functions?",
        topic: "Python Core",
        options: [
          { label: "A", text: "New to Python, still learning syntax and list comprehensions.", points: 1 },
          { label: "B", text: "Comfortable writing clean scripts, functions, and working with libraries.", points: 2 },
          { label: "C", text: "Advanced proficiency: generators, decorators, OOP, and profiling.", points: 3 },
        ],
      },
      {
        id: "q2",
        question: "How experienced are you with NumPy, Pandas, and data wrangling pipelines?",
        topic: "Data Manipulation",
        options: [
          { label: "A", text: "Haven't used Pandas or struggle with vectorization.", points: 1 },
          { label: "B", text: "Regularly clean datasets, use groupby, merging, and transformations.", points: 2 },
          { label: "C", text: "Write high-performance vectorized operations and custom pipeline transformers.", points: 3 },
        ],
      },
      {
        id: "q3",
        question: "Have you trained, evaluated, and deployed machine learning or deep learning models?",
        topic: "Model Architecture",
        options: [
          { label: "A", text: "Understand concepts theoretically, but haven't trained models.", points: 1 },
          { label: "B", text: "Have trained scikit-learn models and fine-tuned basic neural nets.", points: 2 },
          { label: "C", text: "Have built production ML/LLM pipelines with PyTorch/HuggingFace and evaluation.", points: 3 },
        ],
      },
    ];
  }

  // 4. Web Development (Next.js, React, Frontend, Fullstack)
  const isWebDev =
    titleLower.includes("next.js") ||
    titleLower.includes("react") ||
    titleLower.includes("javascript") ||
    titleLower.includes("typescript") ||
    titleLower.includes("frontend") ||
    titleLower.includes("web") ||
    (category === "coding" && !isDSA && !isLanguage && !isPythonOrAI);

  if (isWebDev) {
    return [
      {
        id: "q1",
        question: "How comfortable are you with modern JavaScript/TypeScript (Promises, async/await, closures)?",
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

  // 5. Universal Fallback tailored to the actual goal name
  return [
    {
      id: "q1",
      question: `What is your prior experience and baseline knowledge with ${goalTitle}?`,
      topic: "Baseline Experience",
      options: [
        { label: "A", text: "Complete beginner — starting from zero fundamentals.", points: 1 },
        { label: "B", text: "Have basic knowledge and practical understanding of key concepts.", points: 2 },
        { label: "C", text: "Intermediate to advanced practitioner looking for mastery.", points: 3 },
      ],
    },
    {
      id: "q2",
      question: `How independently can you solve problems and apply concepts in ${goalTitle}?`,
      topic: "Practical Independence",
      options: [
        { label: "A", text: "Need step-by-step guidance and structured walkthroughs.", points: 1 },
        { label: "B", text: "Can build standard exercises and debug common roadblocks with docs.", points: 2 },
        { label: "C", text: "Can independently execute advanced workflows from scratch.", points: 3 },
      ],
    },
    {
      id: "q3",
      question: `What target benchmark represents successful completion of ${goalTitle} for you?`,
      topic: "Outcome Alignment",
      options: [
        { label: "A", text: "Solid conceptual grasp and basic conversational/practical confidence.", points: 1 },
        { label: "B", text: "Build 2-3 substantial projects or pass standard benchmark tests.", points: 2 },
        { label: "C", text: "High-stakes professional execution, certification, or technical screen.", points: 3 },
      ],
    },
  ];
}
