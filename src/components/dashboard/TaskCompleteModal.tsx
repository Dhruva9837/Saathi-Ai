"use client";

import React, { useState } from "react";
import { Task } from "@/types";
import {
  X,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
} from "lucide-react";

interface TaskCompleteModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string, actualMinutes: number, score?: number, notes?: string) => void;
}

export const TaskCompleteModal: React.FC<TaskCompleteModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [actualMinutes, setActualMinutes] = useState<number>(task?.estimatedMinutes || 30);
  const [difficultyRating, setDifficultyRating] = useState<number>(3); // 1 (Very Easy) to 5 (Very Hard)
  const [notes, setNotes] = useState<string>(task?.notes || "");

  React.useEffect(() => {
    if (task) {
      setActualMinutes(task.actualMinutes || task.estimatedMinutes || 30);
      setNotes(task.notes || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(task.id, actualMinutes, undefined, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0B14]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#11131F] p-6 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-[rgba(255,255,255,0.07)] pb-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#3DDC97] flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verify Task Completion
            </div>
            <h3 className="text-base font-bold text-[#F2F3F8] mt-1">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Actual Minutes Spent */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8B90A8] flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#F2F3F8]">
                <Clock className="h-3.5 w-3.5 text-[#7C6CFF]" />
                Actual Time Spent (Minutes)
              </span>
              <span className="text-[11px] text-[#8B90A8]">Target: {task.estimatedMinutes}m</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={480}
                value={actualMinutes}
                onChange={(e) => setActualMinutes(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.08)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none font-mono"
              />
              <span className="text-xs text-[#8B90A8]">min</span>
            </div>
          </div>

          {/* Perceived Difficulty */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F2F3F8] flex items-center justify-between">
              <span>How difficult was this task?</span>
              <span className="text-[10px] text-[#8B90A8]">
                {difficultyRating <= 2 ? "Felt Easy" : difficultyRating === 3 ? "Just Right" : "Challenging"}
              </span>
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficultyRating(lvl)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    difficultyRating === lvl
                      ? "bg-[#7C6CFF] text-white border-[#7C6CFF]"
                      : "bg-[#0A0B14] text-[#8B90A8] border-[rgba(255,255,255,0.07)] hover:text-[#F2F3F8]"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Quick reflection / key takeaway notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#8B90A8]">
              Key Takeaway or Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Mastered French numbers 1-20, need more review on pronunciation of 16-19..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.08)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs font-semibold text-[#8B90A8] hover:text-[#F2F3F8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#3DDC97] to-[#2cb87d] text-[#0A0B14] text-xs font-bold shadow-md shadow-[#3DDC97]/20 hover:opacity-95 transition-opacity"
            >
              Save & Mark Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
