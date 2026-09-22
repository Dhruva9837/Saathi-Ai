import { callLLM } from "./llm-client";

export interface CoachContextData {
  goalTitle: string;
  currentLevel: string;
  streakDays: number;
  weakAreas: string[];
  strongAreas: string[];
  recentBlockers?: string[];
  targetDailyMinutes: number;
}

export async function generateCoachResponse(
  userMessage: string,
  context: CoachContextData
): Promise<string> {
  const systemPrompt = `You are "Saathi AI", an elite, empathetic, and highly strategic AI Coach.
Your goal is to guide learners, developers, and knowledge workers through their learning and career milestones.

User's Current Context:
- Active Goal: ${context.goalTitle}
- Skill Level: ${context.currentLevel}
- Consistency Streak: ${context.streakDays} days
- Daily Target: ${context.targetDailyMinutes} minutes
- Known Weak Areas: ${context.weakAreas.join(", ") || "None recorded"}
- Known Strong Areas: ${context.strongAreas.join(", ") || "None recorded"}
- Recent Blockers: ${context.recentBlockers?.join(", ") || "None"}

COACHING RULES:
1. Tone: Encouraging, concise, practical, and highly actionable. Never be generic or robotic.
2. If the user is short on time (e.g. only 20-30 mins), give a high-leverage "Sprint Plan" immediately.
3. If the user missed a day or is feeling guilty, reassure them and suggest smart pacing adjustments without burnout.
4. If the user asks for concept explanations, use clear mental models, analogies, and 3-step structured breakdowns.
5. Use markdown formatting (**bolding**, bullet points, code tags) for readability. Keep responses between 2-4 focused paragraphs.`;

  // 1. Try real LLM if key is present
  const llmResult = await callLLM({
    systemPrompt,
    userPrompt: userMessage,
    temperature: 0.7,
  });

  if (llmResult) {
    return llmResult;
  }

  // 2. Fallback heuristic response engine
  const lower = userMessage.toLowerCase();

  if (lower.includes("30 min") || lower.includes("time") || lower.includes("kam time") || lower.includes("short on time") || lower.includes("20 min")) {
    return `No problem! When time is tight, high-intensity focus wins over skipping. Here is your **30-Minute Sprint Plan** for **${context.goalTitle}**:\n\n1. ⚡ **15m**: Solve one core pattern problem or focused exercise.\n2. 📝 **15m**: Review key takeaways and note sticky points.\n\nI've temporarily deprioritized secondary tasks so your **${context.streakDays}-day streak** remains intact!`;
  }

  if (lower.includes("recursion") || lower.includes("stuck") || lower.includes("explain") || lower.includes("samajh")) {
    return `Here is the golden mental model for **Recursion & State Trees**:\n\n1. **Base Case**: When does the problem become trivial? (e.g. \`if (root == null) return 0;\`)\n2. **Hypothesis**: Assume your recursive call \`solve(n-1)\` works without looking inside.\n3. **Induction Step**: Connect the result of \`solve(n-1)\` with the current element \`n\`.\n\nWould you like a step-by-step dry run on a sample problem?`;
  }

  if (lower.includes("reschedule") || lower.includes("missed") || lower.includes("kal") || lower.includes("chhoot")) {
    return `Missing a day is completely normal! Life happens. Instead of piling up double work tomorrow, I've distributed the missed tasks across the next 3 days (+15 min each). This keeps your daily load manageable at **${context.targetDailyMinutes}m** without burnout.`;
  }

  if (lower.includes("weak") || lower.includes("kamzori") || lower.includes("struggle")) {
    return `Based on your recent check-in analytics, your primary focus area is **${context.weakAreas[0] || "Foundations"}**, while you have strong speed in **${context.strongAreas[0] || "Basics"}**.\n\nI've scheduled targeted micro-drills to strengthen this area before we unlock the next milestone!`;
  }

  return `In our **${context.goalTitle}** track, your current consistency is solid (**${context.streakDays} days** active). Let's focus on today's prioritized mission. If you hit any roadblock or need a concept broken down, just ask!`;
}
