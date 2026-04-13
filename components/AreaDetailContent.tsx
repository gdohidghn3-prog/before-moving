"use client";

import { useMemo, useEffect, useSyncExternalStore } from "react";
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
  Crown,
  Heart,
  Building2,
  GraduationCap,
  Clock,
  Hospital,
  TreePine,
  Landmark,
  TrendingUp,
} from "lucide-react";
import { addHistory, isFavorite, toggleFavorite, getFavorites } from "@/lib/history";
import { getDeepInfo, hasDeepInfo, type DeepInfo } from "@/lib/deep-info";
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
import PublicBenefitsSection from "@/components/PublicBenefitsSection";
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

// ── 즐겨찾기 구독 ──────────────────────────────────────────
function subscribeFav(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("favorites-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("favorites-change", cb);
    window.removeEventListener("storage", cb);
  };
}
const emptyFavs: string[] = [];

export default function AreaDetailContent({
  area,
  complaints,
  noisePoints,
  reviews,
  id,
}: AreaDetailContentProps) {
  // ── 방문 기록 저장 + 즐겨찾기 ────────────────────────────
  useEffect(() => {
    addHistory({
      id: area.id,
      name: area.name,
      district: area.district,
      city: area.city,
      overallScore: area.overallScore,
    });
  }, [area]);

  const favIds = useSyncExternalStore(subscribeFav, getFavorites, () => emptyFavs);
  const isFav = favIds.includes(area.id);

  const deepInfo = useMemo(() => getDeepInfo(area.id), [area.id]);
  const hasDeep = useMemo(() => hasDeepInfo(area.id), [area.id]);

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
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(area.id)}
                className="p-2 rounded-full border border-[var(--border)] hover:bg-rose-50 hover:border-rose-300 transition-colors cursor-pointer"
                title={isFav ? "즐겨찾기 해제" : "즐겨찾기 추가"}
              >
                <Heart
                  size={18}
                  className={isFav ? "text-rose-500 fill-rose-500" : "text-[var(--text-secondary)]"}
                />
              </button>
              <ScoreBadge score={area.overallScore} size="lg" />
            </div>
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

        {/* ─── 8. 공공혜택 ──────────────────────────────── */}
        <Section delay={0.28}>
          <PublicBenefitsSection district={area.district} city={area.city} />
        </Section>

        {/* ─── 9. 부동산 시세 ────────────────────────────── */}
        <Section delay={0.3}>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
            <Building2 size={16} className="text-emerald-600" /> 부동산 시세
          </h2>
          {hasDeep && deepInfo.realEstate.aptJeonse ? (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4 mb-3">
              <div className="text-[10px] text-[var(--text-secondary)] mb-3">
                기준: {deepInfo.realEstate.basePyeong}평 기준 · {deepInfo.realEstate.dataDate} 실거래
              </div>
              <div className="space-y-2.5">
                {deepInfo.realEstate.aptSale && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">아파트 매매</span>
                    <span className="font-semibold text-[var(--text)]">
                      {(deepInfo.realEstate.aptSale / 10000).toFixed(1)}억원
                    </span>
                  </div>
                )}
                {deepInfo.realEstate.aptJeonse && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">아파트 전세</span>
                    <span className="font-semibold text-[var(--text)]">
                      {(deepInfo.realEstate.aptJeonse / 10000).toFixed(1)}억원
                    </span>
                  </div>
                )}
                {deepInfo.realEstate.aptWolse && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">아파트 월세</span>
                    <span className="font-semibold text-[var(--text)]">
                      {deepInfo.realEstate.aptWolse.deposit.toLocaleString()}/{deepInfo.realEstate.aptWolse.monthly}만
                    </span>
                  </div>
                )}
                {deepInfo.realEstate.villaJeonse && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">빌라 전세</span>
                    <span className="font-semibold text-[var(--text)]">
                      {deepInfo.realEstate.villaJeonse.toLocaleString()}만원
                    </span>
                  </div>
                )}
                {deepInfo.realEstate.villaWolse && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">빌라 월세</span>
                    <span className="font-semibold text-[var(--text)]">
                      {deepInfo.realEstate.villaWolse.deposit.toLocaleString()}/{deepInfo.realEstate.villaWolse.monthly}만
                    </span>
                  </div>
                )}
                {deepInfo.realEstate.oneRoomWolse && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">원룸 월세</span>
                    <span className="font-semibold text-[var(--text)]">
                      {deepInfo.realEstate.oneRoomWolse.deposit.toLocaleString()}/{deepInfo.realEstate.oneRoomWolse.monthly}만
                    </span>
                  </div>
                )}
              </div>
              {deepInfo.realEstate.majorComplexes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <div className="text-xs text-[var(--text-secondary)] mb-1">주요 단지</div>
                  <div className="flex flex-wrap gap-1">
                    {deepInfo.realEstate.majorComplexes.map((c) => (
                      <span key={c} className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-[var(--border)] rounded-xl p-4 mb-3 text-center text-sm text-[var(--text-secondary)]">
              시세 정보 준비 중입니다
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`https://new.land.naver.com/complexes?ms=${area.lat},${area.lng},16&a=APT:PRE:ABYG:JGC&e=RETAIL&ad=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-3 rounded-lg text-white text-sm font-medium bg-green-600 hover:bg-green-700 transition-colors"
            >
              네이버 부동산 <ExternalLink size={12} />
            </a>
            <a
              href={`https://search.naver.com/search.naver?query=${encodeURIComponent(area.district + " " + area.name + " 전세 월세 매물")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-3 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              매물 통합검색 <ExternalLink size={12} />
            </a>
          </div>
        </Section>

        {/* ─── 9-2. 교육 환경 ──────────────────────────── */}
        {hasDeep && (
          <Section delay={0.32}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
              <GraduationCap size={16} className="text-blue-600" /> 교육 환경
            </h2>
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              {(deepInfo.education.elementary.length > 0 || deepInfo.education.middle.length > 0 || deepInfo.education.high.length > 0) ? (
                <div className="space-y-3">
                  {deepInfo.education.elementary.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-[var(--text)] mb-1">초등학교</div>
                      {deepInfo.education.elementary.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                          <span>{s.name}</span>
                          <span className="text-xs">{s.distance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {deepInfo.education.middle.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-[var(--text)] mb-1">중학교</div>
                      {deepInfo.education.middle.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                          <span>{s.name}</span>
                          <span className="text-xs">{s.distance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {deepInfo.education.high.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-[var(--text)] mb-1">고등학교</div>
                      {deepInfo.education.high.map((s) => (
                        <div key={s.name} className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
                          <span>{s.name} {s.type && <span className="text-[10px] text-blue-500">({s.type})</span>}</span>
                          <span className="text-xs">{s.distance}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pt-2 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[var(--text-secondary)]">학원 밀집도</span>
                      <span className={`font-medium ${deepInfo.education.academyDensity === "상" ? "text-emerald-600" : deepInfo.education.academyDensity === "중" ? "text-amber-600" : "text-rose-600"}`}>
                        {deepInfo.education.academyDensity}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{deepInfo.education.summary}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-center text-[var(--text-secondary)]">교육 정보 준비 중입니다</p>
              )}
            </div>
          </Section>
        )}

        {/* ─── 9-3. 교통 분석 ──────────────────────────── */}
        {hasDeep && deepInfo.commute.destinations.length > 0 && (
          <Section delay={0.34}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
              <Clock size={16} className="text-indigo-600" /> 출퇴근 교통
            </h2>
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <div className="space-y-2">
                {deepInfo.commute.destinations.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text)] font-medium">{d.name}</span>
                    <div className="flex gap-3 text-xs text-[var(--text-secondary)]">
                      <span>대중교통 {d.byTransit}</span>
                      <span className="text-[var(--border)]">|</span>
                      <span>자차 {d.byCar}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[var(--text-secondary)] mb-1">주요 교통</div>
                  <div className="flex flex-wrap gap-1">
                    {deepInfo.commute.mainTransport.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-secondary)]">혼잡도</div>
                  <span className={`text-sm font-medium ${deepInfo.commute.congestion === "상" ? "text-rose-600" : deepInfo.commute.congestion === "중" ? "text-amber-600" : "text-emerald-600"}`}>
                    {deepInfo.commute.congestion}
                  </span>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* ─── 9-4. 생활 인프라 ─────────────────────────── */}
        {hasDeep && (deepInfo.infra.hospital || deepInfo.infra.clinicCount > 0) && (
          <Section delay={0.36}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
              <Hospital size={16} className="text-rose-500" /> 생활 인프라
            </h2>
            <div className="bg-white border border-[var(--border)] rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {deepInfo.infra.hospital && (
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] mb-0.5">종합병원</div>
                    <div className="font-medium text-[var(--text)]">{deepInfo.infra.hospital.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{deepInfo.infra.hospital.distance}</div>
                  </div>
                )}
                {deepInfo.infra.clinicCount > 0 && (
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] mb-0.5">동네 의원 / 약국</div>
                    <div className="font-medium text-[var(--text)]">{deepInfo.infra.clinicCount}곳 / {deepInfo.infra.pharmacyCount}곳</div>
                  </div>
                )}
                {deepInfo.infra.mart && (
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] mb-0.5">대형마트</div>
                    <div className="font-medium text-[var(--text)]">{deepInfo.infra.mart.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{deepInfo.infra.mart.distance}</div>
                  </div>
                )}
                {deepInfo.infra.park && (
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] mb-0.5">공원</div>
                    <div className="font-medium text-[var(--text)]">{deepInfo.infra.park.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{deepInfo.infra.park.distance}</div>
                  </div>
                )}
                {deepInfo.infra.library && (
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] mb-0.5">도서관</div>
                    <div className="font-medium text-[var(--text)]">{deepInfo.infra.library.name}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{deepInfo.infra.library.distance}</div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* ─── 9-5. 개발 계획 ──────────────────────────── */}
        {hasDeep && deepInfo.developments.length > 0 && (
          <Section delay={0.38}>
            <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
              <TrendingUp size={16} className="text-amber-600" /> 개발 계획
            </h2>
            <div className="space-y-2">
              {deepInfo.developments.map((d) => (
                <div key={d.title} className="bg-white border border-[var(--border)] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[var(--text)]">{d.title}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      d.status === "진행중" ? "bg-blue-50 text-blue-600" :
                      d.status === "예정" ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    }`}>
                      {d.status}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {d.expectedYear}년 · {d.impact}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ─── 10. PRO 리포트 CTA ────────────────────────── */}
        <Section delay={0.32}>
          <Link
            href={`/area/${id}/pro`}
            className="block bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown size={18} className="text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                이사전에 PRO
              </span>
            </div>
            <h3 className="font-bold text-[var(--text)] mb-1">
              {area.name} 심층 리포트 보기
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              인근 동 비교 · 강점/약점 분석 · 안전 인프라 상세 · 입주 체크포인트
              · PDF 저장
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-amber-700">2,900원</span>
                <span className="text-xs text-[var(--text-secondary)] line-through">
                  4,900원
                </span>
              </div>
              <span className="text-xs text-amber-700 font-medium">
                자세히 보기 →
              </span>
            </div>
          </Link>
        </Section>

        {/* ─── 11. 블로그 ─────────────────────────────────── */}
        <BlogWidget category="동네" />
      </div>
    </div>
  );
}
