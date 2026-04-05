"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { getAllCheckItems, getCategories } from "@/lib/checklist";
import type { CheckItem } from "@/lib/checklist";

// ── localStorage key ────────────────────────────────────────

const STORAGE_KEY = "before-moving-checklist";
const FILTER_STORAGE_KEY = "before-moving-checklist-filters";

// ── condition toggles ───────────────────────────────────────

const conditionToggles = [
  { key: "car", label: "🚗 차량 있음", matchValues: ["차량 소유자"] },
  { key: "child", label: "👶 자녀 있음", matchValues: ["자녀 있는 경우"] },
  { key: "pet", label: "🐾 반려동물 있음", matchValues: ["반려동물 있는 경우"] },
];

// ── main page ───────────────────────────────────────────────

export default function ChecklistPage() {
  const allItems = useMemo(() => getAllCheckItems(), []);
  const categories = useMemo(() => getCategories(), []);

  // ── state ─────────────────────────────────────────────────

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Record<string, boolean>>({
    car: false,
    child: false,
    pet: false,
  });
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [hydrated, setHydrated] = useState(false);

  // ── load from localStorage ────────────────────────────────

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
      const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
      if (savedFilters) setFilters(JSON.parse(savedFilters));
    } catch {
      // ignore
    }
    // expand all categories by default
    const expanded: Record<string, boolean> = {};
    categories.forEach((c) => {
      expanded[c.id] = true;
    });
    setExpandedCategories(expanded);
    setHydrated(true);
  }, [categories]);

  // ── save to localStorage ──────────────────────────────────

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters, hydrated]);

  // ── filter items ──────────────────────────────────────────

  const visibleItems = useMemo(() => {
    return allItems.filter((item) => {
      if (!item.condition) return true;
      // check if any active filter matches this condition
      return conditionToggles.some(
        (toggle) =>
          filters[toggle.key] &&
          toggle.matchValues.some((v) => item.condition?.includes(v)),
      );
    });
  }, [allItems, filters]);

  // ── progress ──────────────────────────────────────────────

  const totalVisible = visibleItems.length;
  const checkedCount = visibleItems.filter((item) => checked[item.id]).length;
  const progressPercent =
    totalVisible > 0 ? Math.round((checkedCount / totalVisible) * 100) : 0;

  // ── handlers ──────────────────────────────────────────────

  const toggleCheck = useCallback((itemId: string) => {
    setChecked((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  const toggleFilter = useCallback((key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  }, []);

  const toggleItemDetail = useCallback((itemId: string) => {
    setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  // ── items grouped by category ─────────────────────────────

  const groupedItems = useMemo(() => {
    const map = new Map<string, CheckItem[]>();
    visibleItems.forEach((item) => {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return map;
  }, [visibleItems]);

  // ── render ────────────────────────────────────────────────

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-[#64748B]">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ─── 1. 헤더 ─────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-4"
          >
            <ArrowLeft size={16} /> 메인으로
          </Link>

          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-[#0F172A]">
              이사 체크리스트
            </h1>
            <span className="text-sm font-medium text-[#64748B]">
              {checkedCount}/{totalVisible} 완료
            </span>
          </div>

          {/* 프로그레스 바 */}
          <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#6366F1]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-[#94A3B8] mt-1 text-right">
            {progressPercent}% 완료
          </p>
        </motion.section>

        {/* ─── 2. 조건 필터 토글 ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-2">
            {conditionToggles.map((toggle) => (
              <button
                key={toggle.key}
                onClick={() => toggleFilter(toggle.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters[toggle.key]
                    ? "bg-[#6366F1] text-white"
                    : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#6366F1] hover:text-[#6366F1]"
                }`}
              >
                {toggle.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ─── 3. 카테고리별 섹션 ────────────────────────── */}
        {categories.map((category, catIndex) => {
          const items = groupedItems.get(category.id);
          if (!items || items.length === 0) return null;
          const isExpanded = expandedCategories[category.id] ?? true;

          return (
            <motion.section
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + catIndex * 0.03 }}
              className="mb-4"
            >
              {/* 카테고리 헤더 */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl hover:border-[#6366F1] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-semibold text-[#0F172A]">
                    {category.label}
                  </span>
                  <span className="text-xs text-[#94A3B8]">
                    ({items.filter((i) => checked[i.id]).length}/{items.length})
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-[#94A3B8]" />
                ) : (
                  <ChevronDown size={18} className="text-[#94A3B8]" />
                )}
              </button>

              {/* 항목 리스트 */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 space-y-2">
                      {items.map((item) => (
                        <CheckItemCard
                          key={item.id}
                          item={item}
                          isChecked={!!checked[item.id]}
                          isExpanded={!!expandedItems[item.id]}
                          onToggleCheck={() => toggleCheck(item.id)}
                          onToggleDetail={() => toggleItemDetail(item.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}

// ── CheckItemCard sub-component ─────────────────────────────

function CheckItemCard({
  item,
  isChecked,
  isExpanded,
  onToggleCheck,
  onToggleDetail,
}: {
  item: CheckItem;
  isChecked: boolean;
  isExpanded: boolean;
  onToggleCheck: () => void;
  onToggleDetail: () => void;
}) {
  return (
    <motion.div
      layout
      className={`bg-white border rounded-xl overflow-hidden transition-colors ${
        isChecked ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-[#E2E8F0]"
      }`}
    >
      {/* 메인 행 */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* 체크박스 */}
        <button
          onClick={onToggleCheck}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
            isChecked
              ? "bg-[#6366F1] border-[#6366F1]"
              : "border-[#CBD5E1] hover:border-[#6366F1]"
          }`}
        >
          {isChecked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 7L6 10L11 4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}
        </button>

        {/* 제목 */}
        <button
          onClick={onToggleDetail}
          className="flex-1 text-left min-w-0"
        >
          <span
            className={`text-sm font-semibold transition-colors ${
              isChecked
                ? "text-[#94A3B8] line-through"
                : "text-[#0F172A]"
            }`}
          >
            {item.title}
          </span>
          {item.condition && (
            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#EA580C]">
              {item.condition}
            </span>
          )}
        </button>

        {/* 펼치기 버튼 */}
        <button
          onClick={onToggleDetail}
          className="text-[#94A3B8] shrink-0"
        >
          {isExpanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
      </div>

      {/* 상세 정보 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={`px-4 pb-4 pt-1 border-t border-[#F1F5F9] space-y-2 ${
                isChecked ? "opacity-50" : ""
              }`}
            >
              {/* 설명 */}
              <p className="text-xs text-[#475569] leading-relaxed">
                {item.description}
              </p>

              {/* 어디서 */}
              <div className="flex items-start gap-2">
                <span className="text-xs text-[#94A3B8] shrink-0 w-14">
                  어디서
                </span>
                <span className="text-xs text-[#0F172A]">{item.where}</span>
              </div>

              {/* 기한 */}
              <div className="flex items-start gap-2">
                <span className="text-xs text-[#94A3B8] shrink-0 w-14">
                  기한
                </span>
                <span className="text-xs font-medium text-[#EF4444]">
                  {item.deadline}
                </span>
              </div>

              {/* 과태료 */}
              {item.penalty && (
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#94A3B8] shrink-0 w-14">
                    과태료
                  </span>
                  <span className="text-xs font-bold text-[#EF4444]">
                    {item.penalty}
                  </span>
                </div>
              )}

              {/* 필요 서류 */}
              {item.documents && item.documents.length > 0 && (
                <div className="flex items-start gap-2">
                  <span className="text-xs text-[#94A3B8] shrink-0 w-14">
                    서류
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {item.documents.map((doc) => (
                      <span
                        key={doc}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 바로가기 링크 */}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#6366F1] hover:underline mt-1"
                >
                  바로가기 <ExternalLink size={12} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
