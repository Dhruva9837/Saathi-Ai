"use server";

import { createClient } from "@/lib/supabase/server";
import { CheckIn } from "@/types";
import { revalidatePath } from "next/cache";

export async function submitCheckInAction(checkIn: Omit<CheckIn, "id">) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data, error } = await supabase
      .from("checkins")
      .insert({
        user_id: user.id,
        goal_id: checkIn.goalId,
        checkin_date: checkIn.date,
        completed_task_ids: checkIn.completedTaskIds,
        actual_minutes_spent: checkIn.actualMinutesSpent,
        perceived_difficulty: checkIn.perceivedDifficulty,
        mood: checkIn.mood,
        confidence_score: checkIn.confidenceScore,
        blockers: checkIn.blockers || null,
        reflection_notes: checkIn.reflectionNotes || null,
        ai_feedback_summary: checkIn.aiFeedbackSummary || null,
      })
      .select()
      .single();

    if (error) throw error;

    // If user mentioned blockers or strong reflections, save into AI memories
    if (checkIn.blockers && checkIn.blockers.trim().length > 5) {
      await supabase.from("ai_memories").insert({
        user_id: user.id,
        goal_id: checkIn.goalId,
        content: `Blocker on ${checkIn.date}: ${checkIn.blockers}`,
        memory_type: "blocker",
        metadata: { date: checkIn.date, mood: checkIn.mood },
      });
    }

    revalidatePath("/dashboard");
    return { success: true, checkInId: data.id };
  } catch (err: any) {
    console.error("Error submitting checkin:", err);
    return { success: false, error: err.message };
  }
}
