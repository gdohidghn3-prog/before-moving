"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Download,
  Crown,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Trophy,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import type {
  Neighborhood,
  Complaint,
  NoisePoint,
  AreaReview,
  SafetyInfo,
} from "@/lib/data";

// ─── 가격 ──────────────────────────────────────────────
const PRO_PRICE = 2900;

// ─── helpers ───────────────────────────────────────────
function scoreColor(v: number) {
  if (v >= 80) return "#10B981";
  if (v >= 60) return "#F59E0B";
  return "#EF4444";
}

function scoreLabel(v: number) {
  if (v >= 80) return "우수";
  if (v >= 60) return "보통";
  return "주의";
}

const COMPLAINT_KR: Record<string, string> = {
  noise: "소음",
  parking: "주정차",
  trash: "쓰레기",
  road: "도로",
  construction: "공사",
  other: "기타",
};

// ─── unlock 로직 (sessionStorage 기반 mock) ───────────
function unlockKey(id: string) {
  return `pro:unlocked:${id}`;
}

function setUnlocked(id: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(unlockKey(id), "1");
  // sessionStorage는 storage 이벤트를 같은 탭에 발화하지 않으므로 수동 dispatch
  window.dispatchEvent(new Event("pro-unlock-change"));
}

// useSyncExternalStore: 하이드레이션 안전 + 외부 스토어 구독
function subscribeUnlock(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("pro-unlock-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("pro-unlock-change", callback);
  };
}

function getUnlockSnapshot(id: string): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(unlockKey(id)) === "1";
}

function getServerSnapshot(): boolean {
  return false;
}

interface Props {
  area: Neighborhood;
  complaints: Complaint[];
  noisePoints: NoisePoint[];
  reviews: AreaReview[];
  safety?: SafetyInfo;
  sameDistrict: Neighborhood[];
  cityTop: Neighborhood[];
}

export default function ProReportContent({
  area,
  complaints,
  noisePoints,
  reviews,
  safety,
  sameDistrict,
  cityTop,
}: Props) {
  const unlocked = useSyncExternalStore(
    subscribeUnlock,
    () => getUnlockSnapshot(area.id),
    getServerSnapshot,
  );
  const [purchasing, setPurchasing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // ─── derived analytics ─────────────────────────────────
  const categorySums = useMemo(() => {
    const sums: Record<string, number> = {};
    complaints
      .filter((c) => c.year === 2024)
      .forEach((c) => {
        sums[c.category] = (sums[c.category] ?? 0) + c.count;
      });
    return Object.entries(sums)
      .map(([k, v]) => ({ category: k, count: v }))
      .sort((a, b) => b.count - a.count);
  }, [complaints]);

  const totalComplaints = useMemo(
    () => categorySums.reduce((s, c) => s + c.count, 0),
    [categorySums]
  );

  // 같은 시 평균과 비교
  const cityAvg = useMemo(() => {
    if (cityTop.length === 0) return null;
    const all = [...cityTop, area];
    const n = all.length;
    return {
      noise: Math.round(all.reduce((s, x) => s + x.noiseScore, 0) / n),
      safety: Math.round(all.reduce((s, x) => s + x.safetyScore, 0) / n),
      convenience: Math.round(all.reduce((s, x) => s + x.convenienceScore, 0) / n),
      overall: Math.round(all.reduce((s, x) => s + x.overallScore, 0) / n),
    };
  }, [cityTop, area]);

  // 강점/약점 분석 (시 평균 대비 ±5점 기준)
  const strengths = useMemo(() => {
    if (!cityAvg) return [];
    const items: { label: string; diff: number }[] = [];
    if (area.noiseScore - cityAvg.noise >= 5)
      items.push({ label: "소음 환경 우수", diff: area.noiseScore - cityAvg.noise });
    if (area.safetyScore - cityAvg.safety >= 5)
      items.push({ label: "안전도 우수", diff: area.safetyScore - cityAvg.safety });
    if (area.convenienceScore - cityAvg.convenience >= 5)
      items.push({ label: "생활 편의 우수", diff: area.convenienceScore - cityAvg.convenience });
    return items;
  }, [area, cityAvg]);

  const weaknesses = useMemo(() => {
    if (!cityAvg) return [];
    const items: { label: string; diff: number }[] = [];
    if (cityAvg.noise - area.noiseScore >= 5)
      items.push({ label: "소음 주의", diff: area.noiseScore - cityAvg.noise });
    if (cityAvg.safety - area.safetyScore >= 5)
      items.push({ label: "안전 주의", diff: area.safetyScore - cityAvg.safety });
    if (cityAvg.convenience - area.convenienceScore >= 5)
      items.push({ label: "편의 시설 부족", diff: area.convenienceScore - cityAvg.convenience });
    return items;
  }, [area, cityAvg]);

  // 입주 추천도 (5단계)
  const recommendation = useMemo(() => {
    const s = area.overallScore;
    if (s >= 85) return { label: "강력 추천", color: "#10B981", emoji: "🏆" };
    if (s >= 75) return { label: "추천", color: "#10B981", emoji: "👍" };
    if (s >= 65) return { label: "보통", color: "#F59E0B", emoji: "🤔" };
    if (s >= 55) return { label: "신중 검토", color: "#F59E0B", emoji: "⚠️" };
    return { label: "비추천", color: "#EF4444", emoji: "🚫" };
  }, [area.overallScore]);

  // ─── handlers ──────────────────────────────────────────
  const handlePurchase = () => {
    setPurchasing(true);
    // TODO: 토스페이먼츠 실제 결제 통합
    // 현재는 mock — 환경변수 NEXT_PUBLIC_TOSS_CLIENT_KEY 설정 시 교체
    setTimeout(() => {
      setUnlocked(area.id);
      setPurchasing(false);
    }, 600);
  };

  const handleDownloadPdf = async () => {
    if (typeof window === "undefined") return;
    setDownloading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const el = document.getElementById("pro-report-content");
      if (!el) return;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `이사전에_PRO_${area.name}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(el).save();
    } finally {
      setDownloading(false);
    }
  };

  // ─── unlock gate ───────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[var(--background)] no-print">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link
            href={`/area/${area.id}`}
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6"
          >
            <ArrowLeft size={16} /> 동 상세로 돌아가기
          </Link>

          {/* 헤더 */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} className="text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">PRO 리포트</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] mb-1">
              {area.name} 심층 분석 리포트
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {area.city} {area.district} · 종합 {area.overallScore}점
            </p>
          </div>

          {/* 가치 제안 */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">PRO 리포트에 포함된 내용</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>인근 동네 비교 표</strong> — 같은 구 동네들과 점수 순위 비교
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>강점·약점 분석</strong> — 시 평균 대비 +/- 점수 차이
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>민원 카테고리 분석</strong> — 어떤 민원이 많은 동네인지
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>안전 인프라 상세</strong> — CCTV·경찰서·비상벨·24시 편의점
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>입주 추천 등급</strong> — 5단계 종합 평가 + 체크포인트
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                <span>
                  <strong>PDF 저장</strong> — 버튼 1클릭으로 PDF 파일 다운로드
                </span>
              </li>
            </ul>
          </div>

          {/* 결제 카드 */}
          <div className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-lg">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-[var(--text-secondary)]">단건 리포트</span>
              <span className="text-xs text-emerald-600 font-medium">
                평생 액세스
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-[var(--text)]">
                {PRO_PRICE.toLocaleString()}원
              </span>
              <span className="text-sm text-[var(--text-secondary)] line-through">
                4,900원
              </span>
            </div>

            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {purchasing ? (
                <>처리 중...</>
              ) : (
                <>
                  <Lock size={16} /> {PRO_PRICE.toLocaleString()}원 결제하고 열람
                </>
              )}
            </button>

            <p className="text-xs text-[var(--text-secondary)] text-center mt-3">
              ※ 현재 베타 — 결제 시스템 준비 중. 버튼 클릭 시 임시 액세스 부여
            </p>
          </div>

          <p className="text-[10px] text-[var(--text-secondary)] text-center mt-4">
            본 리포트는 공개 데이터 기반 정보 제공 목적이며, 부동산 매매·임대 의사결정의 법적 근거가 아닙니다.
          </p>
        </div>
      </div>
    );
  }

  // ─── unlocked: 본 리포트 ────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--background)] pro-report">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 상단 액션 (PDF에서 제외) */}
        <div className="flex items-center justify-between mb-6 no-print">
          <Link
            href={`/area/${area.id}`}
            className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
          >
            <ArrowLeft size={16} /> 돌아가기
          </Link>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--text)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {downloading ? (
              <><Loader2 size={14} className="animate-spin" /> PDF 생성 중...</>
            ) : (
              <><Download size={14} /> PDF 다운로드</>
            )}
          </button>
        </div>

        {/* ── PDF 캡처 대상 시작 ── */}
        <div id="pro-report-content">

        {/* 리포트 헤더 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              이사전에 PRO 리포트
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)]">
            {area.name} 심층 분석
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {area.city} {area.district} · 발행일{" "}
            {new Date().toISOString().slice(0, 10)}
          </p>
        </div>

        {/* 1. 종합 점수 + 추천 등급 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" /> 종합 평가
          </h2>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-[var(--text-secondary)] mb-1">종합 점수</div>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: scoreColor(area.overallScore) }}
                  >
                    {area.overallScore}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--text-secondary)] mb-1">입주 추천</div>
                <div
                  className="text-lg font-bold flex items-center gap-1"
                  style={{ color: recommendation.color }}
                >
                  <span>{recommendation.emoji}</span>
                  <span>{recommendation.label}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--border)]">
              <ScoreItem label="소음" score={area.noiseScore} />
              <ScoreItem label="안전" score={area.safetyScore} />
              <ScoreItem label="편의" score={area.convenienceScore} />
            </div>
          </div>
        </section>

        {/* 2. 강점 / 약점 */}
        {(strengths.length > 0 || weaknesses.length > 0) && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">강점 · 약점 분석</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp size={16} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-700">강점</span>
                </div>
                {strengths.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)]">
                    시 평균 대비 두드러진 강점 없음
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {strengths.map((s) => (
                      <li key={s.label} className="text-sm flex items-center justify-between">
                        <span>{s.label}</span>
                        <span className="text-xs font-medium text-emerald-600">
                          +{s.diff}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown size={16} className="text-rose-600" />
                  <span className="text-sm font-semibold text-rose-700">약점</span>
                </div>
                {weaknesses.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)]">
                    시 평균 대비 두드러진 약점 없음
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {weaknesses.map((w) => (
                      <li key={w.label} className="text-sm flex items-center justify-between">
                        <span>{w.label}</span>
                        <span className="text-xs font-medium text-rose-600">
                          {w.diff}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. 인근 동네 비교 (같은 구) */}
        {sameDistrict.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">
              {area.district} 내 비교
            </h2>
            <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--background)]">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-[var(--text-secondary)]">
                      동
                    </th>
                    <th className="text-center px-2 py-2.5 font-medium text-[var(--text-secondary)]">
                      소음
                    </th>
                    <th className="text-center px-2 py-2.5 font-medium text-[var(--text-secondary)]">
                      안전
                    </th>
                    <th className="text-center px-2 py-2.5 font-medium text-[var(--text-secondary)]">
                      편의
                    </th>
                    <th className="text-center px-3 py-2.5 font-medium text-[var(--text-secondary)]">
                      종합
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-amber-50 border-t border-amber-200">
                    <td className="px-4 py-2.5 font-bold text-amber-700">
                      ⭐ {area.name} (현재)
                    </td>
                    <td className="text-center px-2 py-2.5">{area.noiseScore}</td>
                    <td className="text-center px-2 py-2.5">{area.safetyScore}</td>
                    <td className="text-center px-2 py-2.5">{area.convenienceScore}</td>
                    <td
                      className="text-center px-3 py-2.5 font-bold"
                      style={{ color: scoreColor(area.overallScore) }}
                    >
                      {area.overallScore}
                    </td>
                  </tr>
                  {sameDistrict.map((n) => (
                    <tr
                      key={n.id}
                      className="border-t border-[var(--border)]"
                    >
                      <td className="px-4 py-2.5">{n.name}</td>
                      <td className="text-center px-2 py-2.5 text-[var(--text-secondary)]">
                        {n.noiseScore}
                      </td>
                      <td className="text-center px-2 py-2.5 text-[var(--text-secondary)]">
                        {n.safetyScore}
                      </td>
                      <td className="text-center px-2 py-2.5 text-[var(--text-secondary)]">
                        {n.convenienceScore}
                      </td>
                      <td
                        className="text-center px-3 py-2.5 font-medium"
                        style={{ color: scoreColor(n.overallScore) }}
                      >
                        {n.overallScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 4. 시 평균 대비 */}
        {cityAvg && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">{area.city} 평균 대비</h2>
            <div className="bg-white border border-[var(--border)] rounded-2xl p-5 space-y-3">
              <CompareRow
                label="소음"
                mine={area.noiseScore}
                avg={cityAvg.noise}
              />
              <CompareRow
                label="안전"
                mine={area.safetyScore}
                avg={cityAvg.safety}
              />
              <CompareRow
                label="편의"
                mine={area.convenienceScore}
                avg={cityAvg.convenience}
              />
              <CompareRow
                label="종합"
                mine={area.overallScore}
                avg={cityAvg.overall}
                bold
              />
            </div>
          </section>
        )}

        {/* 5. 민원 분석 */}
        {totalComplaints > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">민원 카테고리 분석</h2>
            <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                2024년 누적 {totalComplaints.toLocaleString()}건
              </p>
              <div className="space-y-2">
                {categorySums.slice(0, 5).map((c) => {
                  const pct = Math.round((c.count / totalComplaints) * 100);
                  return (
                    <div key={c.category}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[var(--text)]">
                          {COMPLAINT_KR[c.category] ?? c.category}
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {c.count.toLocaleString()}건 · {pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 6. 안전 인프라 */}
        {safety && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-500" /> 안전 인프라
            </h2>
            <div className="bg-white border border-[var(--border)] rounded-2xl p-5 grid grid-cols-2 gap-3 text-sm">
              <SafetyRow label="방범 CCTV" value={`${safety.cctvCount}대`} />
              <SafetyRow label="교통 CCTV" value={`${safety.cctvTraffic}대`} />
              <SafetyRow label="가까운 파출소" value={safety.policeStation} />
              <SafetyRow label="파출소 거리" value={safety.policeDistance ?? "정보 없음"} />
              <SafetyRow
                label="24시 편의점"
                value={`${safety.convenienceStores24h}곳`}
              />
              <SafetyRow label="비상벨" value={`${safety.emergencyBells}개`} />
            </div>
          </section>
        )}

        {/* 7. 입주 체크포인트 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> 입주 전 체크포인트
          </h2>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-5">
            <ul className="space-y-2 text-sm">
              {area.noiseScore < 70 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    <strong>소음 점검 필수</strong> — 야간/주말 직접 방문 후 결정 권장
                  </span>
                </li>
              )}
              {area.safetyScore < 70 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    <strong>안전 점검</strong> — CCTV·가로등·인적 동선 확인
                  </span>
                </li>
              )}
              {area.convenienceScore < 70 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    <strong>생활 편의</strong> — 마트·병원·약국 도보 거리 확인
                  </span>
                </li>
              )}
              {noisePoints.length > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>
                    <strong>소음 핫스팟 {noisePoints.length}곳</strong> — 매물 위치와 거리 확인
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>등기부등본 발급</strong> — 인터넷 등기소에서 700원
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>전세보증보험 가입 가능 여부</strong> 확인 (HUG/SGI)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>관리비 내역</strong> — 평균 사용료 및 수도/난방 방식
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>
                  <strong>주차 가능 여부</strong> — 세대당 주차 대수
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 8. 주민 리뷰 요약 */}
        {reviews.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-3">
              주민 리뷰 ({reviews.length}건)
            </h2>
            <div className="space-y-2">
              {reviews.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-[var(--border)] rounded-xl p-4 text-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-amber-500">{"★".repeat(r.rating)}</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {r.livedYears} · {r.createdAt}
                    </span>
                  </div>
                  <p className="text-emerald-700 mb-1">👍 {r.pros}</p>
                  <p className="text-rose-700">👎 {r.cons}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 푸터 */}
        <div className="mt-12 pt-6 border-t border-[var(--border)] text-center text-xs text-[var(--text-secondary)]">
          <p>이사전에 PRO 리포트 · {new Date().toISOString().slice(0, 10)}</p>
          <p className="mt-1">
            본 리포트는 공개 데이터 기반 정보 제공 목적이며, 부동산 거래의 법적
            근거가 아닙니다.
          </p>
        </div>

        </div>{/* ── PDF 캡처 대상 끝 ── */}
      </div>
    </div>
  );
}

// ─── sub components ────────────────────────────────────

function ScoreItem({ label, score }: { label: string; score: number }) {
  return (
    <div className="text-center">
      <div className="text-xs text-[var(--text-secondary)] mb-1">{label}</div>
      <div className="text-xl font-bold" style={{ color: scoreColor(score) }}>
        {score}
      </div>
      <div className="text-[10px] text-[var(--text-secondary)]">
        {scoreLabel(score)}
      </div>
    </div>
  );
}

function CompareRow({
  label,
  mine,
  avg,
  bold = false,
}: {
  label: string;
  mine: number;
  avg: number;
  bold?: boolean;
}) {
  const diff = mine - avg;
  const diffColor = diff >= 0 ? "#10B981" : "#EF4444";
  const sign = diff >= 0 ? "+" : "";
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-[var(--text-secondary)] text-xs">평균 {avg}</span>
        <span className={bold ? "font-bold" : "font-medium"}>{mine}</span>
        <span
          className="text-xs font-medium w-10 text-right"
          style={{ color: diffColor }}
        >
          {sign}
          {diff}
        </span>
      </div>
    </div>
  );
}

function SafetyRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-[var(--text-secondary)] mb-0.5">{label}</div>
      <div className="font-medium text-[var(--text)]">{value}</div>
    </div>
  );
}
