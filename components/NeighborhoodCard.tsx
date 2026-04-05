"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Train } from "lucide-react";
import ScoreBadge from "./ScoreBadge";
import ScoreBar from "./ScoreBar";
import type { Neighborhood } from "@/lib/data";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  rank?: number;
  index?: number;
}

export default function NeighborhoodCard({
  neighborhood: n,
  rank,
  index = 0,
}: NeighborhoodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link
        href={`/area/${n.id}`}
        className="block bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          {/* Rank */}
          {rank != null && (
            <span className="text-lg font-bold text-[#6366F1] w-7 shrink-0 pt-0.5">
              {rank}
            </span>
          )}

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-[#0F172A] truncate">
                {n.name}
              </h3>
              <span className="text-xs text-[#64748B]">{n.district}</span>
            </div>

            {/* Score bars */}
            <div className="space-y-1.5 mb-3">
              <ScoreBar label="소음" score={n.noiseScore} />
              <ScoreBar label="안전" score={n.safetyScore} />
              <ScoreBar label="편의" score={n.convenienceScore} />
            </div>

            {/* Subway */}
            {n.subway.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2">
                <Train size={12} className="shrink-0" />
                <span className="truncate">{n.subway.join(", ")}</span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {n.highlights.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Overall score badge */}
          <ScoreBadge score={n.overallScore} size="lg" />
        </div>
      </Link>
    </motion.div>
  );
}
