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
  Volume2,
  VolumeX,
  RotateCcw,
  Sliders,
} from "lucide-react";
import Link from "next/link";

export const CoachChatView: React.FC = () => {
  const { activeGoal, userProfile, chatMessages, sendChatMessage } = useCoach();
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setInputText("");
    await sendChatMessage(text);
    setIsSending(false);
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          setIsListening(false);
        }
      } else {
        // Fallback demo simulation
        setIsListening(true);
        setTimeout(() => {
          setIsListening(false);
          setInputText("I have only 30 minutes today, please adjust my plan.");
        }, 1500);
      }
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Adjust pitch and rate based on persona
    if (userProfile.coachPersona === "tough_love") {
      utterance.rate = 1.1;
      utterance.pitch = 0.95;
    } else if (userProfile.coachPersona === "socratic") {
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
    } else if (userProfile.coachPersona === "analytical") {
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
    }

    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const personaLabels: Record<string, string> = {
    supportive: "🛡️ Empathetic Mentor",
    tough_love: "⚔️ Drill Sergeant",
    analytical: "🔬 Biohacker",
    socratic: "🏛️ Socratic Strategist",
  };

  const activePersonaLabel =
    personaLabels[userProfile.coachPersona || "supportive"] || "🛡️ Empathetic Mentor";

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
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#11131F] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-[rgba(255,255,255,0.07)] bg-[#0A0B14] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C6CFF] to-[#4F8BFF] text-white">
            <BotMessageSquare className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#F2F3F8]">
                AI Coach
              </h2>
              <Link
                href="/dashboard/settings"
                className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#171A2B] hover:bg-[#171A2B]/80 text-[#7C6CFF] border border-[#7C6CFF]/40 flex items-center gap-1 transition-colors"
                title="Change AI Coach Persona in Settings"
              >
                <span>{activePersonaLabel}</span>
                <Sliders className="h-2.5 w-2.5" />
              </Link>
            </div>
            <p className="text-[11px] text-[#8B90A8]">
              Context: <span className="text-[#7C6CFF] font-medium">{activeGoal?.title || "Active Goal"}</span>
            </p>
          </div>
        </div>

        {/* Live Context Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded bg-[#171A2B] border border-[rgba(255,255,255,0.07)] text-[#F5B544] flex items-center gap-1 font-semibold">
            <Flame className="h-3 w-3 fill-[#F5B544]" />
            <span>{userProfile.streakDays}d Streak</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-[#171A2B] border border-[rgba(255,255,255,0.07)] text-[#8B90A8] flex items-center gap-1">
            <Clock className="h-3 w-3 text-[#7C6CFF]" />
            <span>{activeGoal?.dailyMinutesTarget || 60}m Target</span>
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg) => {
          const isCoach = msg.sender === "coach";
          const isSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isCoach ? "justify-start" : "justify-end"
              }`}
            >
              {isCoach && (
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#7C6CFF] to-[#4F8BFF] flex items-center justify-center text-white shrink-0 mt-0.5">
                  <BotMessageSquare className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-xl p-4 text-xs leading-relaxed relative group ${
                  isCoach
                    ? "bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-[#F2F3F8]"
                    : "bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 gap-2">
                  {msg.contextTag ? (
                    <div className="text-[10px] font-semibold text-[#7C6CFF] flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>{msg.contextTag}</span>
                    </div>
                  ) : <div />}

                  {isCoach && (
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className={`text-[10px] p-1 rounded-md transition-colors ${
                        isSpeaking
                          ? "bg-[#7C6CFF]/20 text-[#7C6CFF]"
                          : "text-[#8B90A8] hover:text-[#F2F3F8] opacity-0 group-hover:opacity-100"
                      }`}
                      title={isSpeaking ? "Stop speech" : "Read aloud"}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-3.5 w-3.5 text-[#7C6CFF] animate-pulse" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="whitespace-pre-line text-xs">
                  {msg.content}
                </div>

                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[rgba(255,255,255,0.07)] flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(action.label)}
                        className="text-[11px] px-2.5 py-1 rounded bg-[#171A2B] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-[#8B90A8] hover:text-[#F2F3F8] transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className={`text-[9px] mt-2 font-mono ${
                    isCoach ? "text-[#8B90A8]" : "text-white/80"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isCoach && (
                <div className="h-7 w-7 rounded-lg bg-[#171A2B] border border-[rgba(255,255,255,0.07)] flex items-center justify-center text-[#8B90A8] shrink-0 mt-0.5">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-[#7C6CFF] flex items-center justify-center text-white shrink-0">
              <BotMessageSquare className="h-4 w-4" />
            </div>
            <div className="p-3 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] flex items-center gap-1.5 text-xs text-[#8B90A8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C6CFF] animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C6CFF] animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C6CFF] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">AI Coach is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-[#0A0B14] border-t border-[rgba(255,255,255,0.07)] flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-semibold text-[#8B90A8] uppercase shrink-0">
          Quick Prompts:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp.prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded bg-[#171A2B] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-[#8B90A8] hover:text-[#F2F3F8] transition-colors"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.07)] bg-[#11131F]">
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
                ? "bg-[#FF6B7A]/20 border-[#FF6B7A] text-[#FF6B7A]"
                : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8]"
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
            className="flex-1 px-4 py-2 rounded-lg bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] placeholder-[#8B90A8] focus:outline-none focus:border-[#7C6CFF]"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2.5 rounded-lg bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] hover:opacity-90 text-white shadow-sm transition-opacity disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
