import { NextRequest, NextResponse } from "next/server";
import { CreateGoalSchema } from "@/lib/validators";
import { generateRoadmapPlan } from "@/server/ai/planner-agent";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = CreateGoalSchema.parse(body);

    const milestones = await generateRoadmapPlan(validatedData);

    return NextResponse.json({
      success: true,
      milestones,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate roadmap" },
      { status: 400 }
    );
  }
}
