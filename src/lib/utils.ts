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
        bg: "bg-[#3DDC97]/10",
        text: "text-[#3DDC97]",
        border: "border-[#3DDC97]/30",
      };
    case "medium":
      return {
        bg: "bg-[#F5B544]/10",
        text: "text-[#F5B544]",
        border: "border-[#F5B544]/30",
      };
    case "hard":
      return {
        bg: "bg-[#FF6B7A]/10",
        text: "text-[#FF6B7A]",
        border: "border-[#FF6B7A]/30",
      };
    default:
      return {
        bg: "bg-[#4F8BFF]/10",
        text: "text-[#4F8BFF]",
        border: "border-[#4F8BFF]/30",
      };
  }
}

export function getPriorityColor(priority: string): { bg: string; text: string; dot: string } {
  switch (priority?.toLowerCase()) {
    case "high":
      return { bg: "bg-[#FF6B7A]/15", text: "text-[#FF6B7A]", dot: "bg-[#FF6B7A]" };
    case "medium":
      return { bg: "bg-[#F5B544]/15", text: "text-[#F5B544]", dot: "bg-[#F5B544]" };
    case "low":
    default:
      return { bg: "bg-[#4F8BFF]/15", text: "text-[#4F8BFF]", dot: "bg-[#4F8BFF]" };
  }
}
