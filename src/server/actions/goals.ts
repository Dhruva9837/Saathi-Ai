"use server";

import { createClient } from "@/lib/supabase/server";
import { Goal, Milestone, Task } from "@/types";
import { revalidatePath } from "next/cache";

export async function getGoalsAction(): Promise<Goal[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data: goals, error: goalsError } = await supabase
      .from("goals")
      .select(`
        *,
        milestones (
          *,
          tasks (*)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (goalsError || !goals) {
      console.warn("Failed to fetch goals:", goalsError);
      return [];
    }

    // Map to frontend Goal structure
    return goals.map((g: any) => ({
      id: g.id,
      title: g.title,
      description: g.description || "",
      targetDeadline: g.deadline,
      currentLevel: g.current_level,
      dailyMinutesTarget: g.daily_minutes_target,
      preferredSchedule: g.preferred_schedule,
      status: g.status,
      category: g.category,
      weakAreas: g.weak_areas || [],
      strongAreas: g.strong_areas || [],
      createdAt: g.created_at,
      milestones: (g.milestones || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((m: any) => ({
          id: m.id,
          goalId: m.goal_id,
          title: m.title,
          description: m.description || "",
          order: m.order_index,
          status: m.status,
          estimatedDays: m.estimated_days,
          tasks: (m.tasks || []).map((t: any) => ({
            id: t.id,
            milestoneId: t.milestone_id,
            title: t.title,
            description: t.description || "",
            difficulty: t.difficulty,
            estimatedMinutes: t.estimated_minutes,
            actualMinutes: t.actual_minutes,
            dueDate: t.due_date,
            status: t.status,
            priority: t.priority,
            topic: t.topic,
            tags: t.tags || [],
            wasAdapted: t.was_adapted,
            adaptationReason: t.adaptation_reason,
          })),
        })),
    }));
  } catch (err) {
    console.error("Error in getGoalsAction:", err);
    return [];
  }
}

export async function createGoalWithMilestonesAction(goal: Omit<Goal, "id" | "createdAt">): Promise<string | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Insert Goal
    const { data: newGoal, error: goalErr } = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: goal.title,
        description: goal.description,
        deadline: goal.targetDeadline,
        current_level: goal.currentLevel,
        daily_minutes_target: goal.dailyMinutesTarget,
        preferred_schedule: goal.preferredSchedule,
        status: goal.status || "active",
        category: goal.category,
        weak_areas: goal.weakAreas || [],
        strong_areas: goal.strongAreas || [],
      })
      .select()
      .single();

    if (goalErr || !newGoal) throw goalErr;

    // 2. Insert Milestones & Tasks
    for (const milestone of goal.milestones) {
      const { data: newMilestone, error: msErr } = await supabase
        .from("milestones")
        .insert({
          goal_id: newGoal.id,
          title: milestone.title,
          description: milestone.description,
          order_index: milestone.order,
          status: milestone.status || "locked",
          estimated_days: milestone.estimatedDays,
        })
        .select()
        .single();

      if (msErr || !newMilestone) continue;

      if (milestone.tasks && milestone.tasks.length > 0) {
        const taskInserts = milestone.tasks.map((t) => ({
          goal_id: newGoal.id,
          milestone_id: newMilestone.id,
          title: t.title,
          description: t.description,
          difficulty: t.difficulty,
          estimated_minutes: t.estimatedMinutes,
          due_date: t.dueDate || new Date().toISOString().split("T")[0],
          status: t.status || "pending",
          priority: t.priority || "medium",
          topic: t.topic,
          tags: t.tags || [],
        }));

        await supabase.from("tasks").insert(taskInserts);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/roadmap");
    return newGoal.id;
  } catch (err) {
    console.error("Error creating goal in Supabase:", err);
    return null;
  }
}

export async function toggleTaskStatusAction(taskId: string, status: "completed" | "pending") {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("tasks")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", taskId);

    if (error) throw error;
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
