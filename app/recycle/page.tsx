"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, AlertTriangle } from "lucide-react";
import {
  searchRecycleItems,
  getConfusingItems,
  getAllCategories,
  getRecycleItemsByCategory,
  type RecycleItem,
  type CategoryInfo,
  type RecycleCategory,
} from "@/lib/recycle";

export default function RecyclePage() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<RecycleCategory | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const categories = useMemo(() => getAllCategories(), []);
  const confusingItems = useMemo(() => getConfusingItems().slice(0, 8), []);

  const searchResults = useMemo(() => {
    if (query.trim().length === 0) return [];
    return searchRecycleItems(query).slice(0, 8);
  }, [query]);

  const categoryInfo = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find((c) => c.id === selectedCategory) ?? null;
  }, [selectedCategory, categories]);

  const categoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return getRecycleItemsByCategory(selectedCategory);
  }, [selectedCategory]);

  function getCategoryForItem(item: RecycleItem): CategoryInfo | undefined {
    return categories.find((c) => c.id === item.category);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-2xl mx-auto px-4 pb-16">
        <h1 className="text-lg font-bold text-[#0F172A] pt-6 pb-2">이거 어디에 버려?</h1>
        {/* Search Bar */}
        <section className="pt-8 pb-6">
          <div ref={searchRef} className="relative">
            <div
              className={`flex items-center gap-3 bg-white border rounded-xl px-5 h-14 transition-shadow ${
                isFocused
                  ? "border-[#16A34A] shadow-[0_0_0_3px_rgba(22,163,74,0.12)]"
                  : "border-[#E2E8F0]"
              }`}
            >
              <Search size={22} className="text-[#94A3B8] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim()) setSelectedCategory(null);
                }}
                onFocus={() => setIsFocused(true)}
                placeholder="물건 이름을 입력하세요 (예: 치킨 박스, 우유팩)"
                className="flex-1 bg-transparent outline-none text-[#0F172A] placeholder:text-[#94A3B8] text-base py-3"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setIsFocused(false);
                  }}
                  className="text-[#94A3B8] hover:text-[#64748B] text-lg leading-none"
                  aria-label="검색어 지우기"
                >
                  &times;
                </button>
              )}
            </div>

            {/* Autocomplete */}
            <AnimatePresence>
              {isFocused && searchResults.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden z-40"
                >
                  {searchResults.map((item) => {
                    const cat = getCategoryForItem(item);
                    return (
                      <li key={item.id}>
                        <Link
                          href={`/recycle/${item.id}`}
                          className="flex items-center justify-between px-4 py-3 hover:bg-[#F0FDF4] transition-colors"
                          onClick={() => setIsFocused(false)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat?.icon}</span>
                            <span className="font-medium text-[#0F172A]">
                              {item.name}
                            </span>
                          </div>
                          {cat && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: cat.color + "18",
                                color: cat.color,
                              }}
                            >
                              {cat.label}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </section>

        <AnimatePresence mode="wait">
          {selectedCategory && categoryInfo ? (
            /* Category Detail View */
            <motion.section
              key={`cat-${selectedCategory}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Category Header */}
              <div className="mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-[#64748B] hover:text-[#16A34A] transition-colors mb-3 flex items-center gap-1"
                >
                  <ArrowLeft size={14} />
                  전체 카테고리
                </button>
                <div
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ backgroundColor: categoryInfo.color + "14" }}
                >
                  <span className="text-3xl">{categoryInfo.icon}</span>
                  <div>
                    <h2
                      className="text-lg font-bold"
                      style={{ color: categoryInfo.color }}
                    >
                      {categoryInfo.label}
                    </h2>
                    <p className="text-sm text-[#64748B]">
                      {categoryInfo.guide}
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Items */}
              <div className="space-y-2">
                {categoryItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/recycle/${item.id}`}
                    className="block bg-white border border-[#E2E8F0] rounded-xl p-4 hover:border-[#16A34A] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-[#0F172A]">
                          {item.name}
                        </span>
                        <p className="text-sm text-[#64748B] mt-0.5">
                          {item.method}
                        </p>
                      </div>
                      {item.conditions.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-[#F59E0B]">
                          <AlertTriangle size={12} />
                          조건에 따라 다름
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          ) : (
            /* Default View */
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Confusing Items */}
              <section className="mb-8">
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">
                  {"\u2753"} 자주 헷갈리는 것들
                </h2>
                <div className="space-y-2">
                  {confusingItems.map((item) => {
                    const cat = getCategoryForItem(item);
                    return (
                      <Link
                        key={item.id}
                        href={`/recycle/${item.id}`}
                        className="flex items-center justify-between bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 hover:border-[#16A34A] hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat?.icon}</span>
                          <span className="font-medium text-[#0F172A]">
                            {item.name}
                          </span>
                          {cat && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: cat.color + "18",
                                color: cat.color,
                              }}
                            >
                              {cat.label}
                            </span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 text-xs text-[#F59E0B]">
                          조건에 따라 다름 {"\u26A0\uFE0F"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>

              {/* Category Grid */}
              <section>
                <h2 className="text-lg font-bold text-[#0F172A] mb-3">
                  {"\uD83D\uDCC2"} 카테고리별 보기
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-[#E2E8F0] bg-white hover:shadow-sm transition-all text-center"
                      style={{
                        borderColor: cat.color + "40",
                      }}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: cat.color }}
                      >
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
