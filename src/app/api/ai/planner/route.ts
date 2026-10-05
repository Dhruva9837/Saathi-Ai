import { NextRequest, NextResponse } from "next/server";
import { CreateGoalSchema } from "@/lib/validators";
import { generateRoadmapPlan } from "@/server/ai/planner-agent";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = CreateGoalSchema.parse(body);

    const result = await generateRoadmapPlan({
      ...validatedData,
      totalDaysTarget: body.totalDaysTarget || 60,
      diagnosticScore: body.diagnosticScore,
      calibratedLevel: body.calibratedLevel,
    });

    return NextResponse.json({
      success: true,
      milestones: result.milestones,
      feasibility: result.feasibility,
      validationScore: result.validationScore,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate roadmap" },
      { status: 400 }
    );
  }
}
