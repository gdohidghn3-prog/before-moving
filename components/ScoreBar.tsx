"use client";

import { motion } from "framer-motion";

interface ScoreBarProps {
  label: string;
  score: number;
  color?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10B981";
  if (score >= 60) return "#F59E0B";
  return "#EF4444";
}

export default function ScoreBar({ label, score, color }: ScoreBarProps) {
  const barColor = color ?? getScoreColor(score);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[#64748B] w-8 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-medium w-7 text-right" style={{ color: barColor }}>
        {score}
      </span>
    </div>
  );
}
