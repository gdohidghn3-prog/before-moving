"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, ThumbsDown, PenLine, X } from "lucide-react";
import type { AreaReview } from "@/lib/data";

const STORAGE_KEY = "before-moving-reviews";

interface SavedReview {
  id: string;
  neighborhoodId: string;
  rating: number;
  pros: string;
  cons: string;
  livedYears: string;
  createdAt: string;
}

function loadLocalReviews(neighborhoodId: string): SavedReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all: SavedReview[] = JSON.parse(raw);
    return all.filter((r) => r.neighborhoodId === neighborhoodId);
  } catch {
    return [];
  }
}

function saveLocalReview(review: SavedReview) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: SavedReview[] = raw ? JSON.parse(raw) : [];
    all.unshift(review);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

// ── 리뷰 작성 폼 ────────────────────────────────────────────

function ReviewForm({
  neighborhoodId,
  onSubmit,
  onCancel,
}: {
  neighborhoodId: string;
  onSubmit: (review: SavedReview) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [livedYears, setLivedYears] = useState("1년 미만");

  const handleSubmit = () => {
    if (rating === 0 || !pros.trim() || !cons.trim()) return;

    const review: SavedReview = {
      id: `local-${Date.now()}`,
      neighborhoodId,
      rating,
      pros: pros.trim(),
      cons: cons.trim(),
      livedYears,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    saveLocalReview(review);
    onSubmit(review);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-white border border-[#6366F1] rounded-xl p-4 mt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[#0F172A]">리뷰 작성</span>
          <button onClick={onCancel} className="text-[#94A3B8] hover:text-[#64748B]">
            <X size={16} />
          </button>
        </div>

        {/* 별점 */}
        <div>
          <label className="text-xs text-[#64748B] mb-1 block">별점</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onMouseEnter={() => setHoverRating(v)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(v)}
                className="text-xl transition-colors"
              >
                {v <= (hoverRating || rating) ? (
                  <span className="text-yellow-400">&#9733;</span>
                ) : (
                  <span className="text-[#E2E8F0]">&#9733;</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 거주 기간 */}
        <div>
          <label className="text-xs text-[#64748B] mb-1 block">거주 기간</label>
          <select
            value={livedYears}
            onChange={(e) => setLivedYears(e.target.value)}
            className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 outline-none focus:border-[#6366F1]"
          >
            <option>1년 미만</option>
            <option>1~3년</option>
            <option>3~5년</option>
            <option>5년 이상</option>
          </select>
        </div>

        {/* 장점 */}
        <div>
          <label className="text-xs text-[#64748B] mb-1 block">장점</label>
          <textarea
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="이 동네의 좋은 점을 알려주세요"
            rows={2}
            className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 outline-none focus:border-[#6366F1] resize-none"
          />
        </div>

        {/* 단점 */}
        <div>
          <label className="text-xs text-[#64748B] mb-1 block">단점</label>
          <textarea
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="아쉬운 점을 알려주세요"
            rows={2}
            className="w-full text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 outline-none focus:border-[#6366F1] resize-none"
          />
        </div>

        {/* 제출 */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0 || !pros.trim() || !cons.trim()}
          className="w-full py-2.5 bg-[#6366F1] text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:bg-[#4F46E5] transition-colors"
        >
          리뷰 등록
        </button>
      </div>
    </motion.div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────

interface ReviewSectionProps {
  neighborhoodId: string;
  serverReviews: AreaReview[];
}

export default function ReviewSection({
  neighborhoodId,
  serverReviews,
}: ReviewSectionProps) {
  const [localReviews, setLocalReviews] = useState<SavedReview[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLocalReviews(loadLocalReviews(neighborhoodId));
    setHydrated(true);
  }, [neighborhoodId]);

  const handleSubmit = useCallback((review: SavedReview) => {
    setLocalReviews((prev) => [review, ...prev]);
    setShowForm(false);
  }, []);

  // 모든 리뷰 합침 (로컬 + 서버)
  const allReviews = [
    ...localReviews.map((r) => ({ ...r, isLocal: true })),
    ...serverReviews.map((r) => ({ ...r, isLocal: false })),
  ];

  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length
      : 0;

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">
          주민 리뷰
        </h2>
        {allReviews.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-[var(--text)]">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-[var(--text-secondary)] text-xs">
              ({allReviews.length}개)
            </span>
          </div>
        )}
      </div>

      {allReviews.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">
          아직 등록된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
        </p>
      ) : (
        <div className="space-y-3">
          {allReviews.map((rv) => (
            <div
              key={rv.id}
              className="bg-white border border-[var(--border)] rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < rv.rating ? "\u2605" : "\u2606",
                  ).join("")}
                </span>
                <span className="text-[11px] px-2 py-0.5 bg-[#F1F5F9] text-[#475569] rounded-full">
                  {rv.livedYears} 거주
                </span>
                {rv.isLocal && (
                  <span className="text-[11px] px-2 py-0.5 bg-[#EEF2FF] text-[#6366F1] rounded-full">
                    내 리뷰
                  </span>
                )}
              </div>

              <div className="flex items-start gap-2 mb-1">
                <ThumbsUp size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-[var(--text)] leading-relaxed">{rv.pros}</p>
              </div>

              <div className="flex items-start gap-2 mb-2">
                <ThumbsDown size={13} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-[var(--text)] leading-relaxed">{rv.cons}</p>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] text-right">
                {rv.createdAt}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 리뷰 쓰기 */}
      <AnimatePresence>
        {showForm && hydrated && (
          <ReviewForm
            neighborhoodId={neighborhoodId}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[var(--primary)] text-[var(--primary)] text-sm font-medium hover:bg-indigo-50 transition-colors"
        >
          <PenLine size={14} /> 리뷰 쓰기
        </button>
      )}
    </>
  );
}
