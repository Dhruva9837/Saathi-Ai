import { Task, TaskType, TaskStudyMaterial } from "@/types";

/**
 * Generates pedagogically sound learning objectives, task types,
 * completion criteria, and interactive study material with mini-quizzes.
 */
export function enrichTaskWithLearningContent(
  task: Task,
  goalCategory: string = "general",
  goalTitle: string = "Learning Goal"
): Task {
  // If task already has complete study material and objective, return as-is
  if (task.learningObjective && task.completionCriteria && task.studyMaterial) {
    return task;
  }

  const titleLower = (task.title || "").toLowerCase();
  const topicLower = (task.topic || "").toLowerCase();
  const goalLower = (goalTitle || "").toLowerCase();
  const descLower = (task.description || "").toLowerCase();
  const combined = `${titleLower} ${topicLower} ${goalLower} ${descLower}`;

  let taskType: TaskType = task.taskType || "practice";
  let learningObjective = task.learningObjective || "";
  let completionCriteria = task.completionCriteria || "";
  let studyMaterial: TaskStudyMaterial;

  // 1. Language Learning (French, Spanish, Japanese, etc.)
  if (
    goalCategory === "language" ||
    combined.includes("french") ||
    combined.includes("spanish") ||
    combined.includes("japanese") ||
    combined.includes("german") ||
    combined.includes("vocabulary") ||
    combined.includes("alphabet") ||
    combined.includes("pronunciation") ||
    combined.includes("grammar") ||
    combined.includes("greetings")
  ) {
    const isFrench = combined.includes("french");
    const lang = isFrench ? "French" : "target language";

    if (combined.includes("greeting") || combined.includes("intro") || combined.includes("salutation")) {
      taskType = "practice";
      learningObjective = `Introduce yourself confidently and master 10 everyday greetings and polite phrases in ${lang}.`;
      completionCriteria = `Speak 5 common greetings aloud with proper pronunciation and score >= 80% on the greeting check.`;
      studyMaterial = {
        overview: `In ${lang}, greetings set the emotional tone for social interactions. Distinguish between formal (polite) and informal (friendly) registers.`,
        keyPoints: [
          `"Bonjour" (Good day / Hello) is polite and universal throughout the day.`,
          `"Bonsoir" is used in the late afternoon and evening.`,
          `"Salut" is casual (Hi/Bye) between close friends and peers.`,
          `"Enchanté(e)" means "Pleased to meet you".`,
          `Polite inquiry: "Comment allez-vous ?" (formal) vs "Comment ça va ?" (informal).`,
        ],
        examples: [
          `Dialogue 1 (Formal):\n— Bonjour Madame Dupont, comment allez-vous ?\n— Très bien, merci. Et vous ?\n— Très bien, bonne journée !`,
          `Dialogue 2 (Informal):\n— Salut Thomas ! Ça va ?\n— Ça va super, et toi ? À plus tard !`,
        ],
        practicePrompt: `Practice introducing yourself aloud: "Bonjour, je m'appelle [Your Name]. Je suis ravi(e) de faire votre connaissance !" Repeat 3 times.`,
        miniQuiz: [
          {
            question: `Which greeting is most appropriate when greeting a stranger or shopkeeper during the day in French?`,
            options: [`Salut !`, `Bonjour !`, `Bonne nuit !`, `À bientôt !`],
            correctIndex: 1,
            explanation: `"Bonjour" is standard polite etiquette for daily interactions with strangers or in formal settings.`,
          },
          {
            question: `How do you respond politely to "Comment allez-vous ?"`,
            options: [`Ça roule`, `Très bien, merci. Et vous ?`, `Au revoir`, `De rien`],
            correctIndex: 1,
            explanation: `"Très bien, merci. Et vous ?" translates to "Very well, thank you. And you?" which is formal and polite.`,
          },
        ],
      };
    } else if (combined.includes("verb") || combined.includes("conjugat") || combined.includes("grammar")) {
      taskType = "practice";
      learningObjective = `Understand auxiliary verbs (être & avoir) and master regular -ER present tense verb conjugations.`;
      completionCriteria = `Correctly conjugate 5 sample verbs in present tense and identify correct pronoun agreements.`;
      studyMaterial = {
        overview: `Verbs are the backbone of sentence construction. In ${lang}, verbs change endings based on the subject pronoun (je, tu, il/elle, nous, vous, ils/elles).`,
        keyPoints: [
          `Être (to be): je suis, tu es, il est, nous sommes, vous êtes, ils sont.`,
          `Avoir (to have): j'ai, tu as, il a, nous avons, vous avez, ils ont.`,
          `Regular -ER verbs (e.g. Parler): drop "-er" and add -e, -es, -e, -ons, -ez, -ent.`,
        ],
        examples: [
          `Je parle français. (I speak French.)`,
          `Nous avons une question. (We have a question.)`,
          `Vous êtes prêt(e) ? (Are you ready?)`,
        ],
        practicePrompt: `Conjugate "Habiter" (to live) for all 6 subject pronouns on your notepad.`,
        miniQuiz: [
          {
            question: `What is the correct form: "Nous ____ (être) étudiants."?`,
            options: [`sommes`, `êtes`, `sont`, `suis`],
            correctIndex: 0,
            explanation: `"Nous sommes" is the correct 1st person plural conjugation of the irregular verb être.`,
          },
        ],
      };
    } else {
      taskType = "reading";
      learningObjective = `Grasp foundational phonetics, vowel combinations, and everyday conversational vocabulary in ${lang}.`;
      completionCriteria = `Complete audio/text drill with active pronunciation and record 3 key phrases in session notes.`;
      studyMaterial = {
        overview: `Accurate pronunciation starts with ear training for nasal vowels and liaison rules where word boundaries flow together smoothly.`,
        keyPoints: [
          `Nasal sounds: "an/en", "in", "on", "un".`,
          `Silent final consonants: generally "d, p, s, t, x, z" are not pronounced at the end of a word unless liaised.`,
          `Accents change sound: "é" (closed e) vs "è / ê" (open e).`,
        ],
        examples: [
          `Liaison: "Les amis" sounds like "Le-z-amis".`,
          `Accents: "Répéter" (to repeat), "Fenêtre" (window).`,
        ],
        practicePrompt: `Read aloud: "Un bon vin blanc" focusing on distinct nasal vowel resonance.`,
        miniQuiz: [
          {
            question: `In standard French, is the final consonant 's' in "Paris" typically pronounced?`,
            options: [`Yes, always pronounced as 'ss'`, `No, silent unless followed by a vowel liaison`, `Only in informal speech`],
            correctIndex: 1,
            explanation: `In "Paris", the final 's' is silent in standard French.`,
          },
        ],
      };
    }
  }
  // 2. Data Structures & Algorithms
  else if (
    combined.includes("dsa") ||
    combined.includes("algorithm") ||
    combined.includes("leetcode") ||
    combined.includes("tree") ||
    combined.includes("array") ||
    combined.includes("pointer") ||
    combined.includes("dp") ||
    combined.includes("recursion")
  ) {
    taskType = "exercise";
    learningObjective = `Analyze algorithmic complexity, identify edge cases, and implement optimal two-pointer / hashing patterns.`;
    completionCriteria = `Write clean code that passes standard and boundary test cases with O(N) time and O(1) space complexity.`;
    studyMaterial = {
      overview: `Pattern recognition is key to solving algorithmic problems under time constraints. Avoid naive nested loops by utilizing lookup structures or sorted two-pointer reductions.`,
      keyPoints: [
        `Identify invariants: what property remains true on every iteration?`,
        `Space vs Time tradeoffs: Hash table gives O(1) lookup at cost of O(N) memory.`,
        `Boundary conditions: empty input, single element, duplicates, negative values, integer overflow.`,
      ],
      examples: [
        `Two Pointers (Sorted Array Target Sum):\nlet left = 0, right = arr.length - 1;\nwhile (left < right) {\n  const sum = arr[left] + arr[right];\n  if (sum === target) return [left, right];\n  else if (sum < target) left++;\n  else right--;\n}`,
      ],
      practicePrompt: `Implement a solution for checking if a string with alphanumeric characters is a valid palindrome while ignoring case and non-alphanumeric symbols.`,
      miniQuiz: [
        {
          question: `What is the optimal time complexity to find if a pair exists with target sum in a sorted array using two pointers?`,
          options: [`O(N^2)`, `O(N log N)`, `O(N)`, `O(1)`],
          correctIndex: 2,
          explanation: `In a sorted array, two pointers from both ends converge in single linear pass O(N) time without extra memory.`,
        },
      ],
    };
  }
  // 3. Coding & Web Development (Next.js, React, TypeScript)
  else if (
    goalCategory === "coding" ||
    combined.includes("react") ||
    combined.includes("next.js") ||
    combined.includes("javascript") ||
    combined.includes("typescript") ||
    combined.includes("ssr") ||
    combined.includes("backend") ||
    combined.includes("frontend")
  ) {
    taskType = "project";
    learningObjective = `Implement resilient component architecture, leverage Server Components, and optimize client-side re-renders.`;
    completionCriteria = `Construct functioning interactive component with proper TypeScript types and error boundary handling.`;
    studyMaterial = {
      overview: `Modern React architecture cleanly separates Server Components (data fetching close to source with 0 client bundle) from Client Components (interactive UI states with "use client").`,
      keyPoints: [
        `RSC by default: Keep data loading on server, pass serialized props down.`,
        `Minimize "use client" boundaries: push interactivity to the leaves of the component tree.`,
        `Server Actions provide type-safe mutations without manual REST boilerplate.`,
      ],
      examples: [
        `// Server Component fetching:\nasync function UserProfile({ id }: { id: string }) {\n  const user = await db.user.findUnique({ where: { id } });\n  return <ClientCard initialData={user} />;\n}`,
      ],
      practicePrompt: `Create a responsive card component that fetches server data and includes an optimistic like button with custom hook state.`,
      miniQuiz: [
        {
          question: `In Next.js App Router, what happens when you omit the "use client" directive in a page or component?`,
          options: [
            `It defaults to a Client Component`,
            `It defaults to a React Server Component (RSC)`,
            `It throws a build syntax error`,
          ],
          correctIndex: 1,
          explanation: `In Next.js App Router, all components inside the app directory are React Server Components by default unless marked with 'use client'.`,
        },
      ],
    };
  }
  // 4. Universal / General Subject
  else {
    taskType = "practice";
    learningObjective = `Master core fundamentals of ${task.title} and apply practical principles through deliberate practice.`;
    completionCriteria = `Review theoretical principles, complete 1 hands-on exercise, and document reflections in session notes.`;
    studyMaterial = {
      overview: `Deliberate practice requires concentrated effort on specific sub-skills just beyond your current comfort zone, followed by immediate feedback.`,
      keyPoints: [
        `Deconstruct the skill: break complex goals into manageable daily sub-units.`,
        `Active recall: test yourself repeatedly rather than passive re-reading.`,
        `Spaced repetition: reinforce concepts at expanding intervals to build long-term retention.`,
      ],
      examples: [
        `Action Step: Spend 15 minutes reviewing baseline rules, 15 minutes applying them independently without notes, and 5 minutes self-grading.`,
      ],
      practicePrompt: `Write down 3 actionable insights from this session and how you will apply them in your next project or milestone.`,
      miniQuiz: [
        {
          question: `According to cognitive learning science, which method yields higher long-term retention?`,
          options: [
            `Passive re-reading of notes`,
            `Active retrieval practice and self-testing`,
            `Highlighting textbook passages`,
          ],
          correctIndex: 1,
          explanation: `Active retrieval practice forces memory reconstruction and produces significantly stronger neural pathways and retention than passive review.`,
        },
      ],
    };
  }

  return {
    ...task,
    taskType: task.taskType || taskType,
    learningObjective: task.learningObjective || learningObjective,
    completionCriteria: task.completionCriteria || completionCriteria,
    studyMaterial: task.studyMaterial || studyMaterial,
  };
}
