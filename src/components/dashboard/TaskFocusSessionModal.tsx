"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, Milestone } from "@/types";
import { useCoach } from "@/context/CoachContext";
import { triggerTaskCompleteConfetti, triggerLevelUpConfetti } from "@/lib/confetti";
import { ambientSound } from "@/lib/audio-synthesizer";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Edit3,
  Award,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  CloudRain,
  Flame,
  Check,
  ChevronRight,
  Target,
} from "lucide-react";
import { getDifficultyColor } from "@/lib/utils";

interface TaskFocusSessionModalProps {
  task: Task | null;
  milestone?: Milestone | null;
  goalTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (taskId: string, actualMinutes: number, score?: number, notes?: string) => void;
}

export const TaskFocusSessionModal: React.FC<TaskFocusSessionModalProps> = ({
  task,
  milestone,
  goalTitle,
  isOpen,
  onClose,
  onComplete,
}) => {
  const { userProfile } = useCoach();

  // Active Tab: 'study' | 'practice' | 'notes'
  const [activeTab, setActiveTab] = useState<"study" | "practice" | "notes">("study");

  // Timer State
  const initialSeconds = (task?.estimatedMinutes || 25) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [actualSecondsSpent, setActualSecondsSpent] = useState<number>(0);

  // Notes state
  const [notes, setNotes] = useState<string>(task?.notes || "");

  // Mini-Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(100);

  // Exercise Checklist State
  const [criteriaChecked, setCriteriaChecked] = useState<Record<number, boolean>>({ 0: false, 1: false });

  // Sound State
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);

  // Reset timer & state when task changes
  useEffect(() => {
    if (task) {
      const secs = (task.estimatedMinutes || 25) * 60;
      setSecondsRemaining(secs);
      setIsTimerRunning(false);
      setActualSecondsSpent(task.actualMinutes ? task.actualMinutes * 60 : 0);
      setNotes(task.notes || "");
      setQuizAnswers({});
      setQuizSubmitted(false);
      setCriteriaChecked({ 0: false, 1: false });
    }
  }, [task]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        setActualSecondsSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen || !task) return null;

  const diffStyle = getDifficultyColor(task.difficulty);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddMinutes = (mins: number) => {
    setSecondsRemaining((prev) => prev + mins * 60);
  };

  const toggleSound = () => {
    if (isSoundPlaying) {
      ambientSound.stop();
      setIsSoundPlaying(false);
    } else {
      ambientSound.play("rain", 0.3);
      setIsSoundPlaying(true);
    }
  };

  const handleQuizSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    const questions = task.studyMaterial?.miniQuiz || [];
    if (questions.length === 0) return;

    let correct = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setQuizScore(finalScore);
    setQuizSubmitted(true);
    ambientSound.playChime();
  };

  const handleCompleteSession = () => {
    setIsTimerRunning(false);
    if (isSoundPlaying) {
      ambientSound.stop();
      setIsSoundPlaying(false);
    }

    const calculatedMinutes = Math.max(1, Math.round(actualSecondsSpent / 60) || task.estimatedMinutes);
    triggerLevelUpConfetti();

    onComplete(task.id, calculatedMinutes, quizSubmitted ? quizScore : undefined, notes);
    onClose();
  };

  const miniQuiz = task.studyMaterial?.miniQuiz || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0A0B14]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[#11131F] shadow-2xl flex flex-col">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between p-5 sm:px-8 border-b border-[rgba(255,255,255,0.07)] bg-[#0E101A] sticky top-0 z-20">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-md font-semibold bg-[#7C6CFF]/15 text-[#7C6CFF] text-[10px] uppercase tracking-wider border border-[#7C6CFF]/30">
                {goalTitle || "Learning Goal"}
              </span>
              {milestone && (
                <span className="text-[#8B90A8] text-[11px] flex items-center gap-1">
                  <ChevronRight className="h-3 w-3 text-[#8B90A8]/60" />
                  {milestone.title}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#F2F3F8] font-heading flex items-center gap-2">
              <span>{task.title}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              title={isSoundPlaying ? "Mute ambient rain" : "Play ambient focus rain"}
              className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
                isSoundPlaying
                  ? "bg-[#3DDC97]/15 border-[#3DDC97]/30 text-[#3DDC97]"
                  : "bg-[#171A2B] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
              }`}
            >
              {isSoundPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span className="hidden sm:inline text-[10px]">Ambient</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#1E2238] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Learning Outcome Banner */}
        <div className="bg-gradient-to-r from-[#7C6CFF]/10 via-[#4F8BFF]/5 to-transparent px-5 sm:px-8 py-3.5 border-b border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C6CFF] flex items-center gap-1.5">
              <Target className="h-3 w-3" />
              Learning Outcome
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#F2F3F8]">
              {task.learningObjective || task.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className={`text-[10px] px-2.5 py-1 rounded-md font-semibold uppercase border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
              {task.difficulty}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-md font-semibold uppercase bg-[#0A0B14] text-[#8B90A8] border border-[rgba(255,255,255,0.07)]">
              {task.taskType || "Practice"}
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-md font-mono bg-[#171A2B] text-[#F2F3F8] border border-[rgba(255,255,255,0.07)] flex items-center gap-1">
              <Clock className="h-3 w-3 text-[#7C6CFF]" />
              {task.estimatedMinutes}m target
            </span>
          </div>
        </div>

        {/* Modal Main Grid: Timer Sentry on left, Study / Exercises on right */}
        <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Focus Timer & Session Control (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Timer Card */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#0A0B14] p-6 text-center space-y-4 shadow-inner relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-[#8B90A8]">
                <span className="flex items-center gap-1 font-semibold text-[#7C6CFF]">
                  <Flame className="h-3.5 w-3.5" />
                  Live Focus Sprint
                </span>
                <span className="font-mono text-[11px]">
                  Logged: {Math.floor(actualSecondsSpent / 60)}m {actualSecondsSpent % 60}s
                </span>
              </div>

              {/* Large Digital Clock */}
              <div className="py-2">
                <div className={`font-mono text-5xl sm:text-6xl font-extrabold tracking-tight ${
                  isTimerRunning ? "text-[#3DDC97] animate-pulse" : "text-[#F2F3F8]"
                }`}>
                  {formatTime(secondsRemaining)}
                </div>
                <div className="text-[11px] text-[#8B90A8] mt-1">
                  {secondsRemaining === 0 ? "Target time reached! Keep going or complete." : "Concentrate without distractions."}
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                    isTimerRunning
                      ? "bg-[#FF6B7A] hover:bg-[#E55A69] text-white shadow-[#FF6B7A]/25"
                      : "bg-gradient-to-r from-[#3DDC97] to-[#2cb87d] text-[#0A0B14] shadow-[#3DDC97]/25 hover:opacity-95"
                  }`}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>{actualSecondsSpent > 0 ? "Resume Timer" : "Start Focus"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setSecondsRemaining((task.estimatedMinutes || 25) * 60);
                  }}
                  className="p-2.5 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8] transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleAddMinutes(5)}
                  className="px-3 py-2 rounded-xl bg-[#171A2B] border border-[rgba(255,255,255,0.07)] text-[11px] font-semibold text-[#8B90A8] hover:text-[#F2F3F8] transition-colors"
                  title="Add 5 Minutes"
                >
                  +5m
                </button>
              </div>
            </div>

            {/* Completion Criteria Box */}
            <div className="p-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] space-y-2.5">
              <div className="text-xs font-bold text-[#F2F3F8] flex items-center justify-between">
                <span>Completion Criteria</span>
                <span className="text-[10px] text-[#3DDC97] font-semibold">Mastery Verification</span>
              </div>
              <p className="text-xs text-[#8B90A8] leading-relaxed">
                {task.completionCriteria || "Complete guided practice and verify self-assessment before marking done."}
              </p>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-xs text-[#F2F3F8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={criteriaChecked[0]}
                    onChange={(e) => setCriteriaChecked((p) => ({ ...p, 0: e.target.checked }))}
                    className="rounded border-[rgba(255,255,255,0.15)] text-[#7C6CFF] focus:ring-0 bg-[#171A2B]"
                  />
                  <span>Read study material & tested examples</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[#F2F3F8] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={criteriaChecked[1]}
                    onChange={(e) => setCriteriaChecked((p) => ({ ...p, 1: e.target.checked }))}
                    className="rounded border-[rgba(255,255,255,0.15)] text-[#7C6CFF] focus:ring-0 bg-[#171A2B]"
                  />
                  <span>Attempted practice questions or exercise</span>
                </label>
              </div>
            </div>

            {/* Complete Task CTA */}
            <button
              type="button"
              onClick={handleCompleteSession}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#7C6CFF] to-[#4F8BFF] hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-[#7C6CFF]/25 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Verify & Complete Task</span>
            </button>
          </div>

          {/* Right Column: Tabbed Content (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("study")}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "study"
                    ? "bg-[#7C6CFF] text-white shadow-sm"
                    : "text-[#8B90A8] hover:text-[#F2F3F8]"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Learning Material</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("practice")}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "practice"
                    ? "bg-[#7C6CFF] text-white shadow-sm"
                    : "text-[#8B90A8] hover:text-[#F2F3F8]"
                }`}
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Practice & Quiz</span>
                {miniQuiz.length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                    {miniQuiz.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === "notes"
                    ? "bg-[#7C6CFF] text-white shadow-sm"
                    : "text-[#8B90A8] hover:text-[#F2F3F8]"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Session Notes</span>
              </button>
            </div>

            {/* Tab 1: Learning Material */}
            {activeTab === "study" && (
              <div className="space-y-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] p-5 flex-1 overflow-y-auto max-h-[500px]">
                {task.studyMaterial ? (
                  <>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C6CFF]">Concept Overview</h4>
                      <p className="text-xs text-[#F2F3F8] leading-relaxed">
                        {task.studyMaterial.overview}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#4F8BFF]">Key Rules & Takeaways</h4>
                      <ul className="space-y-1.5">
                        {task.studyMaterial.keyPoints.map((pt, i) => (
                          <li key={i} className="text-xs text-[#8B90A8] flex items-start gap-2">
                            <span className="text-[#3DDC97] font-bold">✓</span>
                            <span className="text-[#F2F3F8]">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {task.studyMaterial.examples && task.studyMaterial.examples.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F5B544]">Practical Examples</h4>
                        <div className="space-y-2">
                          {task.studyMaterial.examples.map((ex, i) => (
                            <pre
                              key={i}
                              className="p-3 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-[11px] font-mono text-[#3DDC97] whitespace-pre-wrap leading-relaxed"
                            >
                              {ex}
                            </pre>
                          ))}
                        </div>
                      </div>
                    )}

                    {task.studyMaterial.practicePrompt && (
                      <div className="p-3.5 rounded-xl bg-[#7C6CFF]/10 border border-[#7C6CFF]/30 space-y-1">
                        <div className="text-[11px] font-bold text-[#7C6CFF] flex items-center gap-1.5">
                          <Sparkles className="h-3 w-3" />
                          Try It Right Now
                        </div>
                        <p className="text-xs text-[#F2F3F8]">{task.studyMaterial.practicePrompt}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-[#8B90A8] space-y-2">
                    <p>{task.description}</p>
                    <p className="italic">Focus on active practice and note down key discoveries.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Practice & Quiz */}
            {activeTab === "practice" && (
              <div className="space-y-4 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] p-5 flex-1 overflow-y-auto max-h-[500px]">
                {miniQuiz.length > 0 ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.07)] pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-[#F2F3F8]">Knowledge Check</h4>
                        <p className="text-[11px] text-[#8B90A8]">
                          Test your immediate recall and verify mastery.
                        </p>
                      </div>
                      {quizSubmitted && (
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          quizScore >= 80
                            ? "bg-[#3DDC97]/15 text-[#3DDC97] border-[#3DDC97]/30"
                            : "bg-[#F5B544]/15 text-[#F5B544] border-[#F5B544]/30"
                        }`}>
                          Score: {quizScore}%
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {miniQuiz.map((q, qIdx) => {
                        const selectedOption = quizAnswers[qIdx];
                        const isCorrect = selectedOption === q.correctIndex;

                        return (
                          <div key={qIdx} className="space-y-2.5 p-3.5 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.06)]">
                            <div className="text-xs font-semibold text-[#F2F3F8]">
                              {qIdx + 1}. {q.question}
                            </div>
                            <div className="space-y-1.5">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedOption === optIdx;
                                let btnStyle = "bg-[#0A0B14] text-[#8B90A8] border-[rgba(255,255,255,0.07)]";

                                if (quizSubmitted) {
                                  if (optIdx === q.correctIndex) {
                                    btnStyle = "bg-[#3DDC97]/20 text-[#3DDC97] border-[#3DDC97]";
                                  } else if (isSelected && !isCorrect) {
                                    btnStyle = "bg-[#FF6B7A]/20 text-[#FF6B7A] border-[#FF6B7A]";
                                  }
                                } else if (isSelected) {
                                  btnStyle = "bg-[#7C6CFF]/20 text-[#F2F3F8] border-[#7C6CFF]";
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleQuizSelect(qIdx, optIdx)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs border transition-all flex items-center justify-between ${btnStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {quizSubmitted && optIdx === q.correctIndex && (
                                      <Check className="h-3.5 w-3.5 text-[#3DDC97]" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <p className="text-[11px] text-[#8B90A8] pt-1 italic">
                                💡 {q.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        type="button"
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length < miniQuiz.length}
                        className="w-full py-2.5 rounded-xl bg-[#7C6CFF] hover:bg-[#6A58FF] disabled:opacity-40 text-white font-bold text-xs transition-colors"
                      >
                        Submit Answers
                      </button>
                    ) : (
                      <div className="p-3 text-center text-xs text-[#3DDC97] bg-[#3DDC97]/10 rounded-xl border border-[#3DDC97]/20 font-medium">
                        Quiz complete! Score of {quizScore}% logged to this session.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3">
                    <Award className="h-8 w-8 text-[#7C6CFF] mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[#F2F3F8]">Self-Directed Practice Exercise</div>
                    <p className="text-[11px] text-[#8B90A8] max-w-sm mx-auto">
                      Execute this task's hands-on exercise, test your work thoroughly, and verify your results against the completion criteria.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Session Notes */}
            {activeTab === "notes" && (
              <div className="space-y-3 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#F2F3F8]">Learner Scratchpad</h4>
                  <span className="text-[10px] text-[#8B90A8]">Saved with this task</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your takeaways, French phrases learned, code snippets, or questions for your AI Coach..."
                  className="flex-1 w-full min-h-[220px] p-3 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:border-[#7C6CFF] focus:outline-none transition-colors resize-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
