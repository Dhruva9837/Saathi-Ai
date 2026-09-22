"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCoach } from "@/context/CoachContext";
import {
  Send,
  BotMessageSquare,
  Sparkles,
  User,
  Clock,
  Mic,
  MicOff,
  Flame,
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
        setInputText("I'm feeling stuck on today's algorithm. Can you break it down?");
      }, 2000);
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
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-xl border border-[#1E293B] bg-[#151E2E] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B] bg-[#0B1120] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366F1] text-white">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#F8FAFC]">
                AI Coach
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#1E293B] text-[#22C55E] border border-[#22C55E]/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Context: <span className="text-[#818CF8] font-medium">{activeGoal?.title || "Active Goal"}</span>
            </p>
          </div>
        </div>

        {/* Live Context Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded bg-[#151E2E] border border-[#1E293B] text-[#F59E0B] flex items-center gap-1">
            <Flame className="h-3 w-3 fill-[#F59E0B]" />
            <span>{userProfile.streakDays}d Streak</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-[#151E2E] border border-[#1E293B] text-[#94A3B8] flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#818CF8]" />
            <span>{activeGoal?.dailyMinutesTarget || 60}m Target</span>
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
                <div className="h-7 w-7 rounded-lg bg-[#6366F1] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <BotMessageSquare className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-xl p-4 text-xs leading-relaxed ${
                  isCoach
                    ? "bg-[#0B1120] border border-[#1E293B] text-[#F8FAFC]"
                    : "bg-[#6366F1] text-white"
                }`}
              >
                {msg.contextTag && (
                  <div className="text-[10px] font-semibold text-[#818CF8] mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>{msg.contextTag}</span>
                  </div>
                )}

                <div className="whitespace-pre-line text-xs">
                  {msg.content}
                </div>

                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action.label)}
                        className="text-[11px] px-2.5 py-1 rounded bg-[#151E2E] border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-2 font-mono ${
                    isCoach ? "text-[#94A3B8]" : "text-white/80"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isCoach && (
                <div className="h-7 w-7 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#94A3B8] shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-[#6366F1] flex items-center justify-center text-white shrink-0">
              <BotMessageSquare className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-xl bg-[#0B1120] border border-[#1E293B] flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#818CF8] animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#818CF8] animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#818CF8] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">AI Coach is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-[#0B1120] border-t border-[#1E293B] flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-semibold text-[#94A3B8] uppercase shrink-0">
          Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded bg-[#151E2E] border border-[#1E293B] hover:border-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#1E293B] bg-[#151E2E]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={toggleMic}
            className={`p-2.5 rounded-lg border transition-colors ${
              isListening
                ? "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]"
                : "bg-[#0B1120] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
            title="Voice input simulation"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask your coach anything about concepts, tasks, or pacing..."
            className="flex-1 px-4 py-2 rounded-lg bg-[#0B1120] border border-[#1E293B] text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#818CF8]"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-sm transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
