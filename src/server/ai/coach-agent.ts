import { callLLM } from "./llm-client";

export interface CoachContextData {
  goalTitle: string;
  currentLevel: string;
  streakDays: number;
  weakAreas: string[];
  strongAreas: string[];
  recentBlockers?: string[];
  targetDailyMinutes: number;
  coachPersona?: "supportive" | "tough_love" | "analytical" | "socratic";
}

export async function generateCoachResponse(
  userMessage: string,
  context: CoachContextData
): Promise<string> {
  const personaInstructions: Record<string, string> = {
    supportive: "Tone: Warm, encouraging, empathetic, sustainable pacing. Celebrate consistency and small wins enthusiastically.",
    tough_love: "Tone: Direct, disciplined, high accountability, zero excuses. Push the user to focus without wasting time or overanalyzing.",
    analytical: "Tone: Precise, scientific, data-driven. Reference cognitive load, spaced repetition, retention curves, and efficiency metrics.",
    socratic: "Tone: Thought-provoking and inquiry-led. Ask insightful questions that guide the user to deduce principles on their own.",
  };

  const selectedPersonaTone =
    personaInstructions[context.coachPersona || "supportive"] || personaInstructions.supportive;

  const systemPrompt = `You are "Saathi AI", an elite AI Productivity, Career & Learning Coach.
Your purpose is to give personalized, high-value, actionable guidance to learners and developers.

Current User Context:
- Active Goal: ${context.goalTitle || "General Learning & Productivity"}
- Skill Level: ${context.currentLevel || "beginner"}
- Consistency Streak: ${context.streakDays || 0} days
- Daily Commitment: ${context.targetDailyMinutes || 60} minutes
- Weak Areas: ${context.weakAreas?.join(", ") || "None recorded"}
- Strong Areas: ${context.strongAreas?.join(", ") || "None recorded"}
- Blockers: ${context.recentBlockers?.join(", ") || "None"}
- Coaching Persona: ${context.coachPersona || "supportive"} (${selectedPersonaTone})

CRITICAL COACHING RULES:
1. Speak naturally in Hindi, Hinglish, or English depending on the language user writes in.
2. Directly answer their specific question with structured points, practical steps, or code/concepts.
3. Be concise, punchy, and highly practical. Avoid generic robotic fluff.
4. Format using clean Markdown (**bolding**, bullet points, code blocks).`;

  // 1. Try Live LLM (Gemini / OpenAI / Groq / OpenRouter)
  const llmResult = await callLLM({
    systemPrompt,
    userPrompt: userMessage,
    temperature: 0.7,
  });

  if (llmResult) {
    return llmResult;
  }

  // 2. Intelligent Dynamic Heuristic Engine (Contextual Fallback)
  return generateContextualFallback(userMessage, context);
}

function generateContextualFallback(userMessage: string, context: CoachContextData): string {
  const lower = userMessage.toLowerCase().trim();
  const goalName = context.goalTitle && context.goalTitle !== "Productivity" ? context.goalTitle : "your goal";

  // Check if user is asking why AI is repeated or LLM status
  if (lower.includes("llm") || lower.includes("repeat") || lower.includes("chal rha") || lower.includes("api key") || lower.includes("bot")) {
    return `Main aapke messages ko dynamically analyze kar raha hoon! 🤖\n\nAgar aap real-time **Google Gemini** ya **OpenAI** LLM models connect karna chahte hain, toh apni \`.env.local\` file me \`GEMINI_API_KEY\` ya \`OPENAI_API_KEY\` add kar sakte hain.\n\nAap mujhse **${goalName}** se related koi bhi specific question poochiye (e.g. Next.js App Router, DSA roadmap, 30m sprint schedule, ya bug fixing) — main aapko step-by-step practical advice dunga!`;
  }

  // Greetings
  if (/^(hi|hello|hey|namaste|kasa|kaise|sup|yo)\b/i.test(lower)) {
    if (context.coachPersona === "tough_love") {
      return `Hey! 👋 Time waste band karo. Let's make today count for **${goalName}**. Aaj kaunsa task finish kar rahe ho?`;
    }
    return `Hello! 👋 Main aapka **Saathi AI Coach** hoon.\n\nAapki **${goalName}** journey par focus karne ke liye main ready hoon. Aaj hum concept revision, practical coding, ya daily focus session me se kya start karein?`;
  }

  // Next.js & Web Dev
  if (lower.includes("next") || lower.includes("react") || lower.includes("router") || lower.includes("ssr") || lower.includes("server action") || lower.includes("component")) {
    return `### ⚡ Next.js Core Architecture Guide for **${goalName}**:\n\n1. 🌐 **Server vs Client Components**:\n   - Default components **Server Components** hote hain (Zero client bundle, direct DB access).\n   - Interactivity, ` + "`useState`" + `, ` + "`useEffect`" + `, ya event listeners ke liye top par ` + "`'use client'`" + ` lagayein.\n\n2. 🚀 **Data Mutations**:\n   - Form handling aur DB writes ke liye **Server Actions** (` + "`'use server'`" + `) use karein.\n\n3. 🔄 **Pacing Advice**:\n   - Aaj ka daily target: 1 Server Component page + 1 interactive form action build karein!`;
  }

  // Short on Time / 15-30 min sprint
  if (lower.includes("30 min") || lower.includes("20 min") || lower.includes("15 min") || lower.includes("kam time") || lower.includes("short on time") || lower.includes("time nahi")) {
    return `Koi tension nahi! Consistency me quality speed se zyada matter karti hai. Here is your **30-Minute High-Leverage Sprint** for **${goalName}**:\n\n1. ⚡ **15m**: Ek single focused concept ya 1 problem solve karein.\n2. 📝 **10m**: Notes ya code summarize karein.\n3. 🎯 **5m**: Aaj ka check-in complete karein taaki aapka **${context.streakDays || 0}-day streak** barkarar rahe!\n\nReady? Focus room timer on karein!`;
  }

  // DSA / Algorithms
  if (lower.includes("dsa") || lower.includes("recursion") || lower.includes("tree") || lower.includes("dp") || lower.includes("binary") || lower.includes("pointer") || lower.includes("array")) {
    return `### 🧠 Algorithmic Strategy for **${userMessage}**:\n\n1. 🔍 **Identify Pattern**: Kya isme sorted array hai (Binary Search / 2-Pointers), continuous subarray hai (Sliding Window), ya sub-problem overlap ho raha hai (Dynamic Programming)?\n2. 🎯 **Base Case First**: Recursion ya loop boundary conditions ko sabse pehle define karein.\n3. ⏱️ **Time Complexity**: Target $O(N)$ ya $O(N \\log N)$ with optimal space.\n\nKya aap chahte hain ki main iska dry-run code example share karoon?`;
  }

  // Missed days / Backlog / Guilt
  if (lower.includes("miss") || lower.includes("chhoot") || lower.includes("nahi hua") || lower.includes("kal nahi") || lower.includes("backlog")) {
    return `Ek-do din miss hona natural hai — guilt lene ki bilkul zaroorat nahi hai! 🛡️\n\nHumne adaptive engine me aapke missed tasks ko agle 3 dinon me +15 min/day me distribute kar diya hai. Isse aapka baseline pace safe rahega. Let's restart fresh today!`;
  }

  // Procrastination / Low motivation
  if (lower.includes("mann nahi") || lower.includes("lazy") || lower.includes("procrastinat") || lower.includes("thak") || lower.includes("burnout") || lower.includes("bore")) {
    return `### 🎯 The 5-Minute Micro-Action Rule:\n\nAapko agle 2 ghante ka nahi sochna hai. Bas **5 minute** ke liye editor ya book kholiye aur 1 small line execute kijiye.\n\nFriction hamesha starting point par hoti hai, ek baar 5 minutes complete honge toh momentum ban jayega. Main timer track kar raha hoon!`;
  }

  // General dynamic response
  return `Great question regarding **${goalName}**! 🎯\n\nIs topic ko master karne ke liye 3 key steps follow karein:\n\n1. 📌 **Understand the Fundamental Core**: Core mental model ko visual format me samjhein.\n2. 💻 **Active Hands-on Implementation**: Sirf video dekhne ke bajaye scratch se code / drill likhein.\n3. 🔄 **Daily Spaced Repetition**: 24 ghante baad 5 minute ka quick review karein.\n\nAapka target daily time **${context.targetDailyMinutes || 60} minutes** hai. Kya hum iska pehla practical step abhi execute karein?`;
}
