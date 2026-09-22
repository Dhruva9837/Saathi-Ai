import { generateAdaptiveProposal, AdaptationTrigger } from "@/lib/adaptive-engine";
import { Goal, AdaptivePlanProposal } from "@/types";

export interface EvaluatorInput {
  goal: Goal;
  trigger: AdaptationTrigger;
}

export async function evaluateCheckInAndAdapt(input: EvaluatorInput): Promise<AdaptivePlanProposal> {
  const { goal, trigger } = input;
  // Compute adaptive proposal using pure deterministic + heuristics engine
  return generateAdaptiveProposal(goal, trigger);
}
