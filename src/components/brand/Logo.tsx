"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string | null;
  href?: string;
  className?: string;
}

/**
 * Pure SVG Logo Mark for Saathi AI
 * Features a dynamic intertwined infinity-S neural loop with radiant nexus core
 */
export function LogoIcon({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
    >
      <defs>
        {/* Background Glass Gradient */}
        <linearGradient
          id="saathi-bg-grad"
          x1="0"
          y1="0"
          x2="44"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#0F172A" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        {/* Primary Radiant Gradient (Indigo to Cyan) */}
        <linearGradient
          id="saathi-primary-grad"
          x1="6"
          y1="38"
          x2="38"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7C6CFF" />
          <stop offset="45%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Companion Accent Gradient (Cyan to Mint Emerald) */}
        <linearGradient
          id="saathi-accent-grad"
          x1="12"
          y1="8"
          x2="38"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="60%" stopColor="#4F8BFF" />
          <stop offset="100%" stopColor="#3DDC97" />
        </linearGradient>

        {/* Star Spark Center Glow */}
        <radialGradient
          id="saathi-core-glow"
          cx="22"
          cy="22"
          r="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7C6CFF" stopOpacity="0" />
        </radialGradient>

        {/* Border Glow Gradient */}
        <linearGradient
          id="saathi-border-grad"
          x1="0"
          y1="0"
          x2="44"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7C6CFF" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3DDC97" stopOpacity="0.6" />
        </linearGradient>

        {/* Filter Glow */}
        <filter id="saathi-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Squircle Container with Soft Shadow & Metallic Border */}
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="12"
        fill="url(#saathi-bg-grad)"
        stroke="url(#saathi-border-grad)"
        strokeWidth="1.2"
      />

      {/* Subtle Inner Ambient Glow */}
      <circle
        cx="22"
        cy="22"
        r="14"
        fill="url(#saathi-core-glow)"
        opacity="0.25"
      />

      {/* Loop Track 1: Dynamic "S" Ribbon & Neural Infinity Sweep */}
      <path
        d="M 12 28 C 12 34, 20 35, 25 31 C 29 27.5, 29 21, 22 19 C 15 17, 15 11, 21 8 C 26 5.5, 32 8, 32 14"
        stroke="url(#saathi-primary-grad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Loop Track 2: Intersecting Companion Helix & Forward Momentum */}
      <path
        d="M 32 16 C 32 10, 24 9, 19 13 C 15 16.5, 15 23, 22 25 C 29 27, 29 33, 23 36 C 18 38.5, 12 36, 12 30"
        stroke="url(#saathi-accent-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1.5 0.5"
        fill="none"
        opacity="0.85"
      />

      {/* Central Radiant AI Nexus / 4-Point Guiding Spark */}
      <path
        d="M 22 17.5 L 23.3 20.7 L 26.5 22 L 23.3 23.3 L 22 26.5 L 20.7 23.3 L 17.5 22 L 20.7 20.7 Z"
        fill="#FFFFFF"
        filter="url(#saathi-glow-filter)"
      />

      {/* Micro Neural Spark Nodes */}
      <circle cx="12" cy="28" r="1.75" fill="#7C6CFF" />
      <circle cx="32" cy="16" r="1.75" fill="#3DDC97" />
    </svg>
  );
}

/**
 * Full Brand Logo with Responsive Sizes, Typography, and Subtitle
 */
export function Logo({
  size = "md",
  showText = true,
  subtitle = "AI Coach",
  href,
  className = "",
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 30, text: "text-base", sub: "text-[9px]", gap: "gap-2" },
    md: { icon: 36, text: "text-lg", sub: "text-[10px]", gap: "gap-2.5" },
    lg: { icon: 44, text: "text-xl", sub: "text-[11px]", gap: "gap-3" },
    xl: { icon: 54, text: "text-2xl", sub: "text-xs", gap: "gap-3.5" },
  };

  const { icon, text, sub, gap } = sizeMap[size];

  const content = (
    <div className={`flex items-center ${gap} group ${className}`}>
      {/* Emblem with Hover Polish */}
      <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(124,108,255,0.45)]">
        <LogoIcon size={icon} />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-none select-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-extrabold tracking-tight text-[#F2F3F8] ${text}`}
            >
              Saathi
            </span>
            <span
              className={`font-heading font-black tracking-wider bg-gradient-to-r from-[#7C6CFF] via-[#4F8BFF] to-[#3DDC97] bg-clip-text text-transparent ${text}`}
            >
              AI
            </span>
          </div>
          {subtitle && (
            <span
              className={`uppercase font-semibold tracking-[0.18em] text-[#8B90A8] mt-1 ${sub}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
