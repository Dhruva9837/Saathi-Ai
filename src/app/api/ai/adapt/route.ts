import { NextRequest, NextResponse } from "next/server";
import { evaluateCheckInAndAdapt } from "@/server/ai/evaluator-agent";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { goal, trigger } = await req.json();

    if (!goal || !trigger) {
      return NextResponse.json({ success: false, error: "Goal and trigger data are required" }, { status: 400 });
    }

    const proposal = await evaluateCheckInAndAdapt({ goal, trigger });

    return NextResponse.json({
      success: true,
      proposal,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate adaptation proposal" },
      { status: 500 }
    );
  }
}
