"use server";

import { createClient } from "@/lib/supabase/server";

export async function getRecentAIMemoriesAction(goalId?: string) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    let query = supabase
      .from("ai_memories")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (goalId) {
      query = query.eq("goal_id", goalId);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Error fetching AI memories:", err);
    return [];
  }
}
