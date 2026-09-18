"use client";

import React from "react";
import { WeeklyReviewView } from "@/components/review/WeeklyReviewView";

export default function ReviewPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <WeeklyReviewView />
    </div>
  );
}
