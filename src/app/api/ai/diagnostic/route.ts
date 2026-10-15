import { NextRequest, NextResponse } from "next/server";
import { getDiagnosticQuestions } from "@/server/ai/roadmap-validator";
import { callLLM } from "@/server/ai/llm-client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { goalTitle, category, targetOutcome } = await req.json();

    const title = (goalTitle || "Learning Goal").trim();
    const effectiveCategory = category || "general";

    // 1. Try real AI LLM generation for completely personalized diagnostic questions
    try {
      const systemPrompt = `You are Saathi AI's Skill Calibration Diagnostic Engine.
Given a learning goal, generate exactly 3 diagnostic multiple-choice questions to accurately calibrate whether the user is beginner, intermediate, or advanced in this specific subject.

Pedagogical Rules:
- Questions must be directly relevant to "${title}" (e.g. if the goal is French, ask about French vocabulary, grammar/conjugation, and comprehension; if it's DSA, ask about data structures & algorithms; if it's Next.js, ask about React & Next.js).
- Question 1 should test foundational knowledge/prerequisites.
- Question 2 should test intermediate application/practical core skills.
- Question 3 should test advanced/fluency/architectural problem solving.
- Every question must have 3 options:
  - Option A: Beginner baseline (points: 1)
  - Option B: Intermediate familiarity (points: 2)
  - Option C: Advanced / fluent mastery (points: 3)

Return ONLY valid JSON matching this schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text here?",
      "topic": "Topic Name",
      "options": [
        { "label": "A", "text": "Beginner option...", "points": 1 },
        { "label": "B", "text": "Intermediate option...", "points": 2 },
        { "label": "C", "text": "Advanced option...", "points": 3 }
      ]
    }
  ]
}`;

      const userPrompt = `Learning Goal: ${title}
Category: ${effectiveCategory}
Target Success Metric: ${targetOutcome || "Fluency & competence"}

Generate 3 targeted, domain-specific calibration questions strictly for ${title}. Return ONLY valid JSON.`;

      const llmResult = await callLLM({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
        responseFormatJson: true,
      });

      if (llmResult) {
        const cleaned = llmResult.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length >= 2) {
          return NextResponse.json({
            success: true,
            source: "ai",
            questions: parsed.questions,
          });
        }
      }
    } catch (aiErr) {
      console.warn("[Diagnostic AI] LLM error, falling back to heuristic engine:", aiErr);
    }

    // 2. Intelligent Domain-Specific Heuristic Fallback
    const fallbackQuestions = getDiagnosticQuestions(title, effectiveCategory, targetOutcome);

    return NextResponse.json({
      success: true,
      source: "heuristic",
      questions: fallbackQuestions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load diagnostic" },
      { status: 400 }
    );
  }
}
