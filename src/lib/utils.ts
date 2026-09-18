import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function getDifficultyColor(diff: string): { bg: string; text: string; border: string } {
  switch (diff?.toLowerCase()) {
    case "easy":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
      };
    case "medium":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-400",
        border: "border-amber-500/30",
      };
    case "hard":
      return {
        bg: "bg-rose-500/10",
        text: "text-rose-400",
        border: "border-rose-500/30",
      };
    default:
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/30",
      };
  }
}

export function getPriorityColor(priority: string): { bg: string; text: string; dot: string } {
  switch (priority?.toLowerCase()) {
    case "high":
      return { bg: "bg-rose-500/15", text: "text-rose-300", dot: "bg-rose-500" };
    case "medium":
      return { bg: "bg-amber-500/15", text: "text-amber-300", dot: "bg-amber-500" };
    case "low":
    default:
      return { bg: "bg-blue-500/15", text: "text-blue-300", dot: "bg-blue-500" };
  }
}
