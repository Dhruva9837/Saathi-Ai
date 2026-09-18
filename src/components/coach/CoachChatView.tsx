"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  Send,
  BotMessageSquare,
  Sparkles,
  User,
  Zap,
  Flame,
  Lightbulb,
  Clock,
  Layers,
  HelpCircle,
  RefreshCw,
  Mic,
  MicOff,
} from "lucide-react";

export const CoachChatView: React.FC = () => {
  const { activeGoal, userProfile, chatMessages, sendChatMessage } = useCoach();
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setInputText("");
    await sendChatMessage(text);
    setIsSending(false);
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText("Mujhe recursion ke base cases samajh nahi aa rahe, can you give me a simple intuition?");
      }, 2500);
    }
  };

  const quickPrompts = [
    {
      label: "⚡ I only have 30 mins today",
      prompt: "I only have 30 minutes available today. Can you compress my tasks?",
    },
    {
      label: "🧠 Explain Recursion simply",
      prompt: "Mujhe recursion samajh nahi aa rahi. Give me a clear mental model.",
    },
    {
      label: "📅 Reschedule missed tasks",
      prompt: "Kal mera task complete nahi hua tha, please adapt my upcoming schedule.",
    },
    {
      label: "🎯 Review my weak areas",
      prompt: "What are my current weak areas and how are we fixing them?",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-2xl glass-panel border border-surfaceBorder bg-surface/90 overflow-hidden shadow-2xl">
      {/* Context Awareness Header */}
      <div className="p-4 border-b border-surfaceBorder bg-surfaceLight/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <BotMessageSquare className="h-5 w-5" />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent-emerald border-2 border-surface" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-heading">
                AI Mentor & Decision Engine
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/30">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active Context: <span className="text-primary-300 font-medium">{activeGoal?.title || "Productivity"}</span>
            </p>
          </div>
        </div>

        {/* Live Context Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder text-slate-300 flex items-center gap-1">
            <Flame className="h-3 w-3 text-amber-400" />
            <span>Streak: {userProfile.streakDays}d</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder text-rose-300 flex items-center gap-1">
            <Zap className="h-3 w-3 text-rose-400" />
            <span>Weak: {activeGoal?.weakAreas[0] || "Recursion"}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder text-accent-cyan flex items-center gap-1">
            <Clock className="h-3 w-3 text-accent-cyan" />
            <span>Target: {activeGoal?.dailyMinutesTarget || 60}m</span>
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg) => {
          const isCoach = msg.sender === "coach";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isCoach ? "justify-start" : "justify-end"
              }`}
            >
              {isCoach && (
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <BotMessageSquare className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isCoach
                    ? "bg-surfaceLight/70 border border-surfaceBorder text-slate-200"
                    : "bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-lg shadow-primary-500/15"
                }`}
              >
                {msg.contextTag && (
                  <div className="text-[10px] font-semibold text-primary-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>{msg.contextTag}</span>
                  </div>
                )}

                <div className="whitespace-pre-line prose prose-invert max-w-none text-xs">
                  {msg.content}
                </div>

                {/* Suggested Action Buttons if any */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-surfaceBorder/60 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action.label)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder hover:border-primary-500/50 text-slate-300 hover:text-white transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-2 font-mono ${
                    isCoach ? "text-slate-400" : "text-primary-200"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isCoach && (
                <div className="h-8 w-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <BotMessageSquare className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-2xl bg-surfaceLight/70 border border-surfaceBorder flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">Coach is thinking with your goal context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2 bg-surfaceLight/30 border-t border-surfaceBorder/60 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-semibold text-slate-400 uppercase shrink-0">
          Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder hover:border-primary-500/40 text-slate-300 hover:text-white transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-surfaceBorder bg-surface/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Simulator */}
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? "bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse"
                : "bg-surfaceLight border-surfaceBorder text-slate-400 hover:text-white"
            }`}
            title="Simulate Voice Input"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? "Listening... Speak your question..."
                : "Ask anything about your roadmap, concepts, or schedule..."
            }
            className="flex-1 px-4 py-2.5 rounded-xl bg-surfaceLight/60 border border-surfaceBorder text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/25 hover:from-primary-500 hover:to-indigo-500 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
