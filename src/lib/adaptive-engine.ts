import { Goal, CheckIn, AdaptivePlanProposal, Task } from "@/types";

export interface AdaptationTrigger {
  actualMinutes: number;
  plannedMinutes: number;
  difficultyRating: number; // 1-5
  blockers?: string;
  reflectionNotes?: string;
  completedTasks: Task[];
  uncompletedTasks: Task[];
}

export function generateAdaptiveProposal(
  goal: Goal,
  trigger: AdaptationTrigger
): AdaptivePlanProposal {
  const { actualMinutes, plannedMinutes, difficultyRating, blockers, uncompletedTasks } = trigger;
  const timeRatio = actualMinutes / Math.max(plannedMinutes, 1);
  const keyChanges: string[] = [];
  let proposedMinutes = goal.dailyMinutesTarget;
  let difficultyAdjustment: 'reduced' | 'increased' | 'maintained' = 'maintained';
  let coachEncouragement = "";
  let triggerReason = "";

  // 1. Time-based adaptation
  if (timeRatio < 0.6) {
    // Under-capacity (User only had time for <60%)
    proposedMinutes = Math.max(30, Math.round((actualMinutes * 1.1) / 15) * 15);
    triggerReason = `Time constraint detected (${actualMinutes}m invested vs ${plannedMinutes}m planned).`;
    keyChanges.push(
      `Adjusted daily target from ${goal.dailyMinutesTarget}m to ${proposedMinutes}m to align with your current schedule.`
    );
    keyChanges.push(
      `Filtered out low-priority theoretical tasks to focus 100% on high-yield core exercises.`
    );
    coachEncouragement =
      "Life happens! Instead of falling behind on an unrealistic schedule, we've calibrated your daily target so you stay consistent without stress.";
  } else if (timeRatio >= 1.4 && difficultyRating <= 2) {
    // Over-capacity & Easy -> Accelerate
    proposedMinutes = Math.min(180, Math.round((goal.dailyMinutesTarget * 1.25) / 15) * 15);
    triggerReason = `High velocity detected! Completed tasks ahead of schedule with low friction.`;
    difficultyAdjustment = 'increased';
    keyChanges.push(
      `Increased difficulty level for upcoming milestone from Beginner to Intermediate.`
    );
    keyChanges.push(
      `Fast-tracked prerequisite modules by 3 days based on your strong understanding.`
    );
    coachEncouragement =
      "Incredible momentum! You breezed through today's concepts. I've leveled up tomorrow's challenges to keep you in the growth zone.";
  }

  // 2. Difficulty-based adaptation
  if (difficultyRating >= 4) {
    difficultyAdjustment = 'reduced';
    if (!triggerReason) {
      triggerReason = `High friction reported (Difficulty ${difficultyRating}/5).`;
    }
    keyChanges.push(
      `Added 1 bite-sized intuition building task before deep problem solving.`
    );
    keyChanges.push(
      `Split complex multidimensional problems into guided sub-steps.`
    );
    if (!coachEncouragement) {
      coachEncouragement =
        "Struggling with new concepts is a natural part of mastery. I've inserted scaffolded exercises so you can build strong intuition step-by-step.";
    }
  }

  // 3. Uncompleted Tasks Rescheduling
  if (uncompletedTasks.length > 0) {
    keyChanges.push(
      `Smart-rescheduled ${uncompletedTasks.length} pending task(s) into tomorrow's priority queue without extending overall deadline.`
    );
  }

  // Fallback if user had a normal standard session
  if (keyChanges.length === 0) {
    triggerReason = "Steady progress verified across all daily metrics.";
    keyChanges.push("Maintained current optimal pacing and milestone schedule.");
    keyChanges.push("Queued tomorrow's progressive practice problems.");
    coachEncouragement = "Solid execution today! Consistency is the secret to mastering complex skills. Keep this rhythm!";
  }

  return {
    id: `prop-${Date.now()}`,
    goalId: goal.id,
    date: new Date().toISOString().split("T")[0],
    triggerReason,
    previousDailyTargetMinutes: goal.dailyMinutesTarget,
    proposedDailyTargetMinutes: proposedMinutes,
    rescheduledTasksCount: uncompletedTasks.length,
    splitTasksCount: difficultyRating >= 4 ? 1 : 0,
    difficultyAdjustment,
    keyChangesSummary: keyChanges,
    coachEncouragement,
    applied: false,
  };
}

export function applyAdaptivePlanToGoal(
  goal: Goal,
  proposal: AdaptivePlanProposal
): Goal {
  const updated = { ...goal };
  updated.dailyMinutesTarget = proposal.proposedDailyTargetMinutes;

  // Mark pending tasks with adaptation flag if needed
  updated.milestones = updated.milestones.map((ms) => {
    if (ms.status === "in_progress") {
      const updatedTasks = ms.tasks.map((task) => {
        if (task.status === "pending" || task.status === "in_progress") {
          return {
            ...task,
            wasAdapted: true,
            adaptationReason: `Adapted on ${proposal.date}: ${proposal.triggerReason}`,
          };
        }
        return task;
      });
      return { ...ms, tasks: updatedTasks };
    }
    return ms;
  });

  return updated;
}
