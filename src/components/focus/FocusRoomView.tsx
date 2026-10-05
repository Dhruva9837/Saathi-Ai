"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCoach } from "@/context/CoachContext";
import { ambientSound } from "@/lib/audio-synthesizer";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CloudRain,
  Waves,
  Brain,
  Wind,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Flame,
  Coffee,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";

type TimerMode = "pomodoro_25" | "deep_50" | "short_break" | "long_break";

const TIMER_PRESETS: Record<TimerMode, { label: string; minutes: number; type: "focus" | "break" }> = {
  pomodoro_25: { label: "25m Sprint", minutes: 25, type: "focus" },
  deep_50: { label: "50m Deep Flow", minutes: 50, type: "focus" },
  short_break: { label: "5m Rest", minutes: 5, type: "break" },
  long_break: { label: "15m Reset", minutes: 15, type: "break" },
};

export const FocusRoomView: React.FC = () => {
  const { todayTasks, toggleTaskStatus, userProfile } = useCoach();

  const [mode, setMode] = useState<TimerMode>("pomodoro_25");
  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER_PRESETS.pomodoro_25.minutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(todayTasks[0]?.id || "");
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalDuration = TIMER_PRESETS[mode].minutes * 60;
  const progressRatio = (totalDuration - secondsLeft) / totalDuration;

  // Countdown timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      ambientSound.stop();
    };
  }, []);

  const handleSessionComplete = () => {
    setIsRunning(false);
    ambientSound.playChime();

    if (TIMER_PRESETS[mode].type === "focus") {
      setCompletedSessions((prev) => prev + 1);

      // Auto-complete selected task if chosen
      if (selectedTaskId) {
        toggleTaskStatus(selectedTaskId);
      }

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#7C6CFF", "#4F8BFF", "#3DDC97"],
        });
      } catch (e) {}
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsLeft(TIMER_PRESETS[newMode].minutes * 60);
  };

  const toggleSound = (soundType: "rain" | "ocean" | "binaural" | "white_noise") => {
    if (activeSound === soundType) {
      ambientSound.stop();
      setActiveSound(null);
    } else {
      ambientSound.play(soundType, isMuted ? 0 : volume);
      setActiveSound(soundType);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (!isMuted) {
      ambientSound.setVolume(newVol);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientSound.setVolume(volume);
    } else {
      setIsMuted(true);
      ambientSound.setVolume(0);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const soundOptions = [
    { id: "rain", label: "Rain", icon: CloudRain },
    { id: "ocean", label: "Ocean", icon: Waves },
    { id: "binaural", label: "40Hz Gamma", icon: Brain },
    { id: "white_noise", label: "White Noise", icon: Wind },
  ];

  const uncompletedTasks = todayTasks.filter((t) => t.status !== "completed");

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl border border-[rgba(255,255,255,0.07)] bg-gradient-to-b from-[#0A0B14] via-[#11131F] to-[#0A0B14] p-6 sm:p-10 transition-all shadow-xl ${
        isFullscreen ? "h-screen w-screen flex flex-col justify-between overflow-y-auto" : "min-h-[75vh]"
      }`}
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.07)] pb-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#7C6CFF] to-[#4F8BFF] flex items-center justify-center text-white shadow-md shadow-[#7C6CFF]/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F2F3F8]">Ambient Focus Room</h2>
            <p className="text-xs text-[#8B90A8]">
              {completedSessions} focus sprints completed today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#11131F] border border-[rgba(255,255,255,0.07)] text-xs text-[#F5B544] font-semibold">
            <Flame className="h-3.5 w-3.5 fill-[#F5B544]" />
            <span>{userProfile.streakDays}d Streak Active</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#11131F] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-[#8B90A8] hover:text-[#F2F3F8] transition-colors"
            title="Toggle Zen Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex justify-center my-6">
        <div className="inline-flex p-1 rounded-2xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] gap-1 max-w-full overflow-x-auto">
          {(Object.keys(TIMER_PRESETS) as TimerMode[]).map((key) => {
            const isSelected = mode === key;
            const preset = TIMER_PRESETS[key];
            return (
              <button
                key={key}
                onClick={() => handleModeChange(key)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-[#7C6CFF] to-[#6352E8] text-white shadow-md shadow-[#7C6CFF]/25"
                    : "text-[#8B90A8] hover:text-[#F2F3F8] hover:bg-[#171A2B]"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Timer Display & Circular Ring */}
      <div className="flex flex-col items-center justify-center my-6">
        <div className="relative h-64 w-64 sm:h-72 sm:w-72 flex items-center justify-center">
          {/* SVG Progress Circle */}
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#171A2B]"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#7C6CFF] transition-all duration-1000 ease-linear"
              strokeWidth="5"
              strokeDasharray="276.46"
              strokeDashoffset={`${276.46 * (1 - progressRatio)}`}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time & Play Controls */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono text-[#F2F3F8] tracking-tight">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#7C6CFF] font-bold mt-1">
              {TIMER_PRESETS[mode].type === "focus" ? "Deep Focus" : "Rest & Recharge"}
            </span>

            {/* Play/Pause & Reset */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95 ${
                  isRunning
                    ? "bg-[#FF6B7A] hover:opacity-90 shadow-[#FF6B7A]/25"
                    : "bg-[#7C6CFF] hover:opacity-90 shadow-[#7C6CFF]/30"
                }`}
              >
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5 fill-white" />}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(totalDuration);
                }}
                className="h-10 w-10 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] text-[#8B90A8] hover:text-[#F2F3F8] flex items-center justify-center transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Task Linker */}
        {uncompletedTasks.length > 0 && TIMER_PRESETS[mode].type === "focus" && (
          <div className="mt-4 flex items-center gap-2 max-w-md w-full px-4">
            <span className="text-xs text-[#8B90A8] shrink-0 font-medium">Link Task:</span>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#0A0B14] border border-[rgba(255,255,255,0.07)] text-xs text-[#F2F3F8] focus:outline-none focus:border-[#7C6CFF]"
            >
              {uncompletedTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.estimatedMinutes}m)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Ambient Soundscapes Bar */}
      <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.07)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-[#7C6CFF]" />
          <span className="text-xs font-bold text-[#F2F3F8]">Procedural Ambient Soundscapes:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {soundOptions.map((s) => {
            const Icon = s.icon;
            const isPlaying = activeSound === s.id;
            return (
              <button
                key={s.id}
                onClick={() => toggleSound(s.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isPlaying
                    ? "bg-[#7C6CFF]/20 border-[#7C6CFF] text-[#7C6CFF] shadow-sm shadow-[#7C6CFF]/20"
                    : "bg-[#0A0B14] border-[rgba(255,255,255,0.07)] text-[#8B90A8] hover:text-[#F2F3F8] hover:border-[rgba(255,255,255,0.15)]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isPlaying ? "animate-pulse" : ""}`} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="text-[#8B90A8] hover:text-[#F2F3F8] transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-[#FF6B7A]" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 sm:w-24 h-1.5 bg-[#171A2B] rounded-lg appearance-none cursor-pointer accent-[#7C6CFF]"
          />
        </div>
      </div>
    </div>
  );
};
