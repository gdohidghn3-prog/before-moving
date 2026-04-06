"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Train,
  Volume2,
  HardHat,
  Car,
  Construction,
  CircleAlert,
  Users,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Neighborhood, Complaint, NoisePoint, AreaReview } from "@/lib/data";
import ScoreBadge from "@/components/ScoreBadge";
import LocalInfoSection from "@/components/LocalInfoSection";
import BlogWidget from "@/components/BlogWidget";
import ReviewSection from "@/components/ReviewSection";

// ── helpers ──────────────────────────────────────────────────

function scoreColor(v: number) {
  if (v >= 80) return "#10B981";
  if (v >= 60) return "#F59E0B";
  return "#EF4444";
}

function noiseLabel(v: number) {
  if (v >= 80) return "조용한 편";
  if (v >= 60) return "보통";
  return "시끄러운 편";
}
function safetyLabel(v: number) {
  if (v >= 80) return "안전한 편";
  if (v >= 60) return "보통";
  return "주의 필요";
}
function convLabel(v: number) {
  if (v >= 80) return "편리한 편";
  if (v >= 60) return "보통";
  return "불편한 편";
}

const COMPLAINT_KR: Record<string, string> = {
  noise: "소음",
  parking: "주정차",
  trash: "쓰레기",
  road: "도로",
  construction: "공사",
  other: "기타",
};

const NOISE_ICON: Record<string, React.ReactNode> = {
  construction: <HardHat size={16} />,
  traffic: <Car size={16} />,
  nightlife: <Volume2 size={16} />,
  factory: <Construction size={16} />,
  other: <CircleAlert size={16} />,
};

const NOISE_TYPE_KR: Record<string, string> = {
  construction: "공사장",
  traffic: "도로교통",
  nightlife: "유흥가",
  factory: "공장",
  other: "기타",
};

// ── fade-in wrapper ─────────────────────────────────────────

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="mb-8"
    >
      {children}
    </motion.section>
  );
}

// ── ScoreCard sub-component ─────────────────────────────────

function ScoreCard({
  label,
  score,
  desc,
  extra,
}: {
  label: string;
  score: number;
  desc: string;
  extra?: React.ReactNode;
}) {
  const color = scoreColor(score);

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--text)]">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>
          {score}
        </span>
      </div>
      {/* bar */}
      <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden mb-1">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
      {extra}
    </div>
  );
}

// ── props ────────────────────────────────────────────────────

interface AreaDetailContentProps {
  area: Neighborhood;
  complaints: Complaint[];
  noisePoints: NoisePoint[];
  reviews: AreaReview[];
  id: string;
}

// ── main component ──────────────────────────────────────────

export default function AreaDetailContent({
  area,
  complaints,
  noisePoints,
  reviews,
  id,
}: AreaDetailContentProps) {
  // ── derived data ───────────────────────────────────────────

  const categorySums = useMemo(() => {
    const sums: Record<string, number> = {};
    complaints
      .filter((c: Complaint) => c.year === 2024)
      .forEach((c: Complaint) => {
        sums[c.category] = (sums[c.category] ?? 0) + c.count;
      });
    const order = ["noise", "parking", "trash", "road", "construction", "other"];
    return order.map((cat) => ({ category: cat, count: sums[cat] ?? 0 }));
  }, [complaints]);

  const maxCategoryCount = useMemo(
    () => Math.max(...categorySums.map((c) => c.count), 1),
    [categorySums],
  );

  const monthlyData = useMemo(() => {
    const map = new Map<string, number>();
    complaints.forEach((c: Complaint) => {
      const key = `${c.year}.${c.month}`;
      map.set(key, (map.get(key) ?? 0) + c.count);
    });
    const result: { label: string; count: number }[] = [];
    for (let y = 2024; y <= 2025; y++) {
      const mEnd = y === 2025 ? 3 : 12;
      for (let m = 1; m <= mEnd; m++) {
        const key = `${y}.${m}`;
        result.push({ label: key, count: map.get(key) ?? 0 });
      }
    }
    return result;
  }, [complaints]);


  // ── render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ─── 1. 헤더 ─────────────────────────────────────── */}
        <Section delay={0}>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors mb-4"
          >
            <ArrowLeft size={16} /> 돌아가기
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)]">
                {area.name}{" "}
                <span className="text-base font-normal text-[var(--text-secondary)]">
                  &middot; {area.district}
                </span>
              </h1>
            </div>
            <ScoreBadge score={area.overallScore} size="lg" />
          </div>
        </Section>

        {/* ─── 2. 핵심 점수 카드 ─────────────────────────── */}
        <Section delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ScoreCard
              label="소음"
              score={area.noiseScore}
              desc={noiseLabel(area.noiseScore)}
            />
            <ScoreCard
              label="안전"
              score={area.safetyScore}
              desc={safetyLabel(area.safetyScore)}
            />
            <ScoreCard
              label="편의"
              score={area.convenienceScore}
              desc={convLabel(area.convenienceScore)}
              extra={
                area.subway.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {area.subway.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600"
                      >
                        <Train size={10} /> {s}
                      </span>
                    ))}
                  </div>
                ) : null
              }
            />
          </div>

          {/* 안전 상세 링크 */}
          <Link
            href={`/safety/${id}`}
            className="mt-3 flex items-center justify-between px-4 py-3 bg-white border border-[var(--border)] rounded-xl hover:border-purple-400 transition-colors group"
          >
            <span className="text-sm font-medium text-[var(--text)]">
              안전 상세 보기
            </span>
            <span className="text-sm text-purple-600 group-hover:translate-x-0.5 transition-transform">
              &rarr;
            </span>
          </Link>
        </Section>

        {/* ─── 3. 특징 태그 ──────────────────────────────── */}
        <Section delay={0.1}>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
            동네 특징
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {area.highlights.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full"
              >
                {tag}
              </span>
            ))}
            <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full inline-flex items-center gap-1">
              <Users size={12} /> 인구밀도 {area.population}
            </span>
          </div>
        </Section>

        {/* ─── 4. 민원 현황 ──────────────────────────────── */}
        <Section delay={0.15}>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            민원 현황 (2024)
          </h2>

          {/* 카테고리별 바 */}
          <div className="space-y-2 mb-6">
            {categorySums.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-secondary)] w-12 shrink-0">
                  {COMPLAINT_KR[item.category]}
                </span>
                <div className="flex-1 h-5 bg-[#F1F5F9] rounded overflow-hidden">
                  <motion.div
                    className="h-full rounded"
                    style={{ backgroundColor: "var(--primary)" }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.count / maxCategoryCount) * 100}%`,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--text)] w-10 text-right">
                  {item.count}건
                </span>
              </div>
            ))}
          </div>

          {/* 월별 추이 */}
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
            월별 민원 추이
          </h3>
          <div className="w-full h-48 bg-white rounded-xl border border-[var(--border)] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 10 }} width={30} />
                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  labelFormatter={(l) => `${l}월`}
                />
                <Bar
                  dataKey="count"
                  name="민원"
                  fill="var(--primary)"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        {/* ─── 5. 소음 정보 ──────────────────────────────── */}
        {noisePoints.length > 0 && (
          <Section delay={0.2}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
              소음 포인트
            </h2>
            <div className="space-y-2">
              {noisePoints.map((np: NoisePoint) => (
                <div
                  key={np.id}
                  className="flex items-start gap-3 bg-white border border-[var(--border)] rounded-lg p-3"
                >
                  <span className="text-[var(--text-secondary)] mt-0.5">
                    {NOISE_ICON[np.type] ?? <CircleAlert size={16} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[var(--text)]">
                        {NOISE_TYPE_KR[np.type] ?? np.type}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {np.description}
                    </p>
                  </div>
                  {/* level bar 1~5 */}
                  <div className="flex gap-0.5 shrink-0 mt-1">
                    {[1, 2, 3, 4, 5].map((lv) => (
                      <div
                        key={lv}
                        className="w-3 h-3 rounded-sm"
                        style={{
                          backgroundColor:
                            lv <= np.level ? scoreColor(100 - np.level * 20) : "#E2E8F0",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── 6. 주민 리뷰 ──────────────────────────────── */}
        <Section delay={0.25}>
          <ReviewSection neighborhoodId={id} serverReviews={reviews} />
        </Section>

        {/* ─── 7. 동네 생활 정보 (네이버 API) ────────────── */}
        <LocalInfoSection
          neighborhoodId={id}
          district={area.district}
          name={area.name}
          city={area.city}
        />

        {/* ─── 8. 부동산 링크 ────────────────────────────── */}
        <Section delay={0.3}>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            이 동네 매물 보기
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(area.district + " " + area.name + " 부동산 매물")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-2.5 rounded-lg text-white text-sm font-medium bg-green-600 hover:bg-green-700 transition-colors"
            >
              매물 검색 <ExternalLink size={12} />
            </a>
            <a
              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(area.district + " " + area.name + " 전세 월세")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-2.5 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              전세·월세 <ExternalLink size={12} />
            </a>
            <a
              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(area.district + " " + area.name + " 아파트 시세")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-2.5 rounded-lg text-white text-sm font-medium bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              아파트 시세 <ExternalLink size={12} />
            </a>
          </div>
        </Section>

        {/* ─── 9. 블로그 ─────────────────────────────────── */}
        <BlogWidget category="동네" />
      </div>
    </div>
  );
}
