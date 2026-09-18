"use client";

import React from "react";
import { MilestoneTree } from "@/components/roadmap/MilestoneTree";

export default function RoadmapPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <MilestoneTree />
    </div>
  );
}
