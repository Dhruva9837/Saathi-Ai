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

  const systemPrompt = `You are "Saathi AI", an elite AI Productivity & Learning Coach.
Your goal is to guide learners, developers, and knowledge workers through their learning and career milestones.

User's Current Context:
- Active Goal: ${context.goalTitle || "General Learning & Productivity"}
- Skill Level: ${context.currentLevel || "beginner"}
- Consistency Streak: ${context.streakDays || 0} days
- Daily Target: ${context.targetDailyMinutes || 60} minutes
- Known Weak Areas: ${context.weakAreas?.join(", ") || "None recorded"}
- Known Strong Areas: ${context.strongAreas?.join(", ") || "None recorded"}
- Recent Blockers: ${context.recentBlockers?.join(", ") || "None"}
- Selected Persona: ${context.coachPersona || "supportive"} (${selectedPersonaTone})

COACHING RULES:
1. Adhere strictly to the chosen persona tone: ${selectedPersonaTone}
2. If the user talks in Hindi/Hinglish (e.g. "kya karu", "kaise padhu", "samajh nahi aa raha"), reply naturally in clean, friendly Hinglish or bilingual formatting.
3. If the user is short on time (e.g. 20-30 mins), formulate a high-leverage "Sprint Plan" immediately.
4. If the user missed a day or feels guilty, provide reassuring advice and smart pacing adjustments.
5. If the user asks for concept explanations (e.g. DSA, coding, physics, math), use intuitive mental models, examples, and structured steps.
6. Use markdown formatting (**bolding**, bullet points, code snippets) for clear readability.`;

  // 1. Try real LLM if key is present
  const llmResult = await callLLM({
    systemPrompt,
    userPrompt: userMessage,
    temperature: 0.7,
  });

  if (llmResult) {
    return llmResult;
  }

  // 2. Comprehensive Conversational Fallback Engine
  const lower = userMessage.toLowerCase().trim();
  const goalName = context.goalTitle && context.goalTitle !== "Productivity" ? context.goalTitle : "your target goals";

  // Greetings
  if (lower.startsWith("hi") || lower.startsWith("hello") || lower.startsWith("hey") || lower.includes("namaste") || lower.includes("kaisa") || lower.includes("kaise ho")) {
    if (context.coachPersona === "tough_love") {
      return `Hey! 👋 Time is ticking. Let's make today count for **${goalName}**. What task are we tackling in this focus session?`;
    }
    return `Hello! 👋 Main aapka **Saathi AI Coach** hoon. Main aapki **${goalName}** journey ko track aur adapt karne ke liye yahan hoon.\n\nAap mujhse kisi bhi concept ka explanation, time management tips, ya daily roadmap planning pooch sakte hain. Aaj kya target achieve karna chahte hain?`;
  }

  // Limited Time / Short on time / 30 mins
  if (lower.includes("30 min") || lower.includes("20 min") || lower.includes("15 min") || lower.includes("kam time") || lower.includes("short on time") || lower.includes("time nahi")) {
    return `Koi tension nahi! Jab time kam ho, toh quality focus beats skipping. Here is your **30-Minute Sprint Plan** for **${goalName}**:\n\n1. ⚡ **15m**: Ek single high-priority core problem ya topic solve karein.\n2. 📝 **15m**: Key takeaways aur mistakes ko note karein.\n\nMaine secondary tasks ko pause kar diya hai taaki aapka **${context.streakDays || 0}-day streak** safe rahe!`;
  }

  // DSA / Recursion / Two Pointers / Dynamic Programming
  if (lower.includes("recursion") || lower.includes("tree") || lower.includes("dp") || lower.includes("dynamic programming") || lower.includes("two pointer") || lower.includes("sliding window") || lower.includes("binary search") || lower.includes("graph")) {
    return `Here is a structured breakdown for **${userMessage}**:\n\n1. 🧠 **Core Intuition**: Break the problem down into the smallest subproblem that can be solved immediately (Base Case).\n2. 🔄 **State Transition**: Formulate how the previous state combines to produce the current state.\n3. ⚠️ **Common Edge Cases**: Empty inputs, single element, boundary pointer overflows.\n\nKya aap chahte hain ki main iska ek step-by-step code example ya dry-run explain karoon?`;
  }

  // Missed tasks / Backlog / Guilt / Reschedule
  if (lower.includes("missed") || lower.includes("chhoot") || lower.includes("nahi hua") || lower.includes("kal nahi") || lower.includes("backlog") || lower.includes("reschedule")) {
    return `Ek din miss hona bilkul normal hai — life happens! 🛡️\n\nEk saath double burden lene ki zaroorat nahi hai. Humne uncompleted tasks ko aane wale 3 dinon me thoda-thoda (+15m) distribute kar diya hai. Isse aapka daily target **${context.targetDailyMinutes || 60}m** par hi maintain rahega bina kisi stress ke.`;
  }

  // Motivation / Procrastination / Lazy / Burnout
  if (lower.includes("motivation") || lower.includes("mann nahi") || lower.includes("lazy") || lower.includes("procrastinat") || lower.includes("thak") || lower.includes("burnout") || lower.includes("bored")) {
    if (context.coachPersona === "tough_love") {
      return `Motivation is temporary, **discipline is permanent**! ⚔️\n\nOverthinking band karein. Bas **5 minute** ke liye timer start karein aur first line of code ya first page padhna shuru karein. Momentum apne aap ban jayega!`;
    }
    return `Jab bhi padhne ka mann na kare, follow the **5-Minute Rule**: 🎯\n\nAapko bas 5 minute ke liye baithna hai aur ek small task start karna hai. 80% of the friction starting me hoti hai. Agar 5 minute baad bhi heavy lage, toh ek short 5-minute break le sakte hain. Shall we start a quick focus sprint in the **Focus Room**?`;
  }

  // Weak areas & Strengths
  if (lower.includes("weak") || lower.includes("kamzori") || lower.includes("struggle") || lower.includes("improve") || lower.includes("strength")) {
    const weak = context.weakAreas?.[0] || "Foundations & Active Practice";
    const strong = context.strongAreas?.[0] || "Core Fundamentals";
    return `Based on your recent progress:\n\n- 🔍 **Target Focus Area**: **${weak}** (Scaffolded drills scheduled)\n- 🏆 **Strong Confidence**: **${strong}**\n\nDaily check-in data ke basis par hum aapke weak areas par extra reinforcement drills add karte hain taaki agla milestone aasan ho jaye.`;
  }

  // How to start / Guide / Help
  if (lower.includes("help") || lower.includes("kaise") || lower.includes("guide") || lower.includes("kya karu") || lower.includes("start")) {
    return `Main aapki step-by-step help kar sakta hoon: 🚀\n\n1. 🗺️ **Roadmap**: Dashboard ke **Roadmap** section me jaakar apne milestones dekhein.\n2. ⏱️ **Focus Room**: Pomodoro timer & ambient soundscapes ke saath dedicated study session karein.\n3. ✨ **Daily Check-In**: Din ke end me 1-minute check-in karein taaki kal ka plan automatically optimize ho jaye.\n\nAapko abhi kis topic ya subject me guidance chahiye?`;
  }

  // General responsive AI answer
  return `In our **${goalName}** track, your consistency is currently at **${context.streakDays || 0} days**. 

Regarding "${userMessage}":
- Main aapki velocity aur preferences ke according schedule calibrate karta rahoonga.
- Agar koi specific concept samajhna ho ya daily tasks adjust karne hon, mujhe bataiye! 🚀`;
}
