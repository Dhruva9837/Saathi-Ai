import { NextRequest, NextResponse } from "next/server";
import { generateCoachResponse } from "@/server/ai/coach-agent";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const reply = await generateCoachResponse(message, context || {
      goalTitle: "Productivity",
      currentLevel: "beginner",
      streakDays: 7,
      weakAreas: ["Recursion"],
      strongAreas: ["Arrays"],
      targetDailyMinutes: 60,
    });

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get coach response" },
      { status: 500 }
    );
  }
}
