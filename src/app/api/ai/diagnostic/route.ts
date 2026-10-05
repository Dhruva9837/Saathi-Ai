import { NextRequest, NextResponse } from "next/server";
import { getDiagnosticQuestions } from "@/server/ai/roadmap-validator";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { goalTitle, category } = await req.json();

    const questions = getDiagnosticQuestions(goalTitle || "Goal", category || "general");

    return NextResponse.json({
      success: true,
      questions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load diagnostic" },
      { status: 400 }
    );
  }
}
