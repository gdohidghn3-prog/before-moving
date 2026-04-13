"use client";

import { useState, useMemo, useRef, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ChevronRight, Clock, Heart, X, Trash2 } from "lucide-react";
import {
  searchNeighborhoods,
  getCityList,
  getDistrictsByCity,
  getNeighborhoodsByDistrict,
  getPopularByCity,
  getNeighborhoodById,
  type Neighborhood,
} from "@/lib/data";
import {
  getHistory,
  clearHistory,
  getFavorites,
  toggleFavorite,
  type HistoryEntry,
} from "@/lib/history";
import NeighborhoodCard from "@/components/NeighborhoodCard";
import ScoreBadge from "@/components/ScoreBadge";
import BlogWidget from "@/components/BlogWidget";

// ── localStorage 구독 (useSyncExternalStore) ───────────
function subscribeHistory(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("history-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("history-change", cb);
    window.removeEventListener("storage", cb);
  };
}
function subscribeFavorites(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("favorites-change", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("favorites-change", cb);
    window.removeEventListener("storage", cb);
  };
}
const emptyHistory: HistoryEntry[] = [];
const emptyFavorites: string[] = [];

export default function Home() {
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  // 최근 본 동네 + 즐겨찾기 (SSR-safe)
  const history = useSyncExternalStore(subscribeHistory, getHistory, () => emptyHistory);
  const favoriteIds = useSyncExternalStore(subscribeFavorites, getFavorites, () => emptyFavorites);
  const favoriteAreas = useMemo(
    () => favoriteIds.map((id) => getNeighborhoodById(id)).filter(Boolean) as Neighborhood[],
    [favoriteIds],
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const cities = useMemo(() => getCityList(), []);

  // 검색어로 도시 카드 필터: 동/구/시 이름에 매칭되는 도시만 표시
  const filteredCities = useMemo(() => {
    const q = query.trim();
    if (!q) return cities;
    const results = searchNeighborhoods(q);
    if (results.length === 0) return cities;
    const matchedCities = new Set(results.map((n) => n.city));
    return cities.filter((c) => matchedCities.has(c));
  }, [cities, query]);

  const districts = useMemo(() => {
    if (!selectedCity) return [];
    return getDistrictsByCity(selectedCity);
  }, [selectedCity]);

  const searchResults = useMemo(() => {
    if (query.trim().length === 0) return [];
    return searchNeighborhoods(query).slice(0, 8);
  }, [query]);

  const popularNeighborhoods = useMemo(() => {
    if (!selectedCity) return [];
    return getPopularByCity(selectedCity);
  }, [selectedCity]);

  const filteredNeighborhoods = useMemo(() => {
    if (!selectedDistrict) return [];
    return getNeighborhoodsByDistrict(selectedDistrict).sort(
      (a, b) => b.overallScore - a.overallScore
    );
  }, [selectedDistrict]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district === selectedDistrict ? null : district);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-3xl mx-auto px-4 pb-16">
        {/* Search */}
        <section className="pt-8 pb-4">
          <div ref={searchRef} className="relative">
            <div
              className={`flex items-center gap-3 bg-white border rounded-xl px-4 h-13 transition-shadow ${
                isFocused
                  ? "border-[#6366F1] shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
                  : "border-[#E2E8F0]"
              }`}
            >
              <Search size={20} className="text-[#94A3B8] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="동네 이름을 검색하세요 (예: 역삼동, 합정동)"
                className="flex-1 bg-transparent outline-none text-[#0F172A] placeholder:text-[#94A3B8] text-base py-3"
              />
              {query && (
                <button
                  onClick={() => { setQuery(""); setIsFocused(false); }}
                  className="text-[#94A3B8] hover:text-[#64748B] text-lg leading-none"
                >
                  &times;
                </button>
              )}
            </div>

            <AnimatePresence>
              {isFocused && searchResults.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-xl shadow-lg overflow-hidden z-40"
                >
                  {searchResults.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/area/${n.id}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-[#F8FAFC] transition-colors"
                        onClick={() => setIsFocused(false)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-[#94A3B8]" />
                          <span className="font-medium text-[#0F172A]">{n.name}</span>
                          <span className="text-xs text-[#94A3B8]">{n.district}</span>
                        </div>
                        <ScoreBadge score={n.overallScore} size="sm" />
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── 즐겨찾기 ────────────────────────────────────── */}
        {!selectedCity && favoriteAreas.length > 0 && (
          <section className="pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
                <Heart size={18} className="text-rose-500 fill-rose-500" /> 즐겨찾기
              </h2>
              <span className="text-xs text-[#94A3B8]">{favoriteAreas.length}개</span>
            </div>
            <div className="space-y-3">
              {favoriteAreas.map((n, i) => (
                <div key={n.id} className="relative">
                  <NeighborhoodCard neighborhood={n} index={i} />
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(n.id); }}
                    className="absolute top-3 right-14 p-1.5 rounded-full bg-white border border-rose-200 shadow-sm hover:bg-rose-50 transition-colors z-10 cursor-pointer"
                    title="즐겨찾기 해제"
                  >
                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 최근 본 동네 ──────────────────────────────── */}
        {!selectedCity && history.length > 0 && (
          <section className="pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-1.5">
                <Clock size={18} className="text-[#6366F1]" /> 최근 본 동네
              </h2>
              <button
                onClick={clearHistory}
                className="text-xs text-[#94A3B8] hover:text-[#EF4444] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 size={12} /> 전체 삭제
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
              {history.map((h) => (
                <Link
                  key={h.id}
                  href={`/area/${h.id}`}
                  className="shrink-0 bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 hover:border-[#6366F1] hover:shadow-sm transition-all min-w-[140px]"
                >
                  <div className="font-semibold text-sm text-[#0F172A] truncate">{h.name}</div>
                  <div className="text-[11px] text-[#94A3B8] truncate">{h.city} {h.district}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <ScoreBadge score={h.overallScore} size="sm" />
                    <span className="text-[10px] text-[#CBD5E1]">
                      {new Date(h.visitedAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* City Selection */}
        {!selectedCity && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-6"
          >
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">
              {query.trim() ? `"${query.trim()}" 관련 지역` : "어디로 이사하세요?"}
            </h2>
            {filteredCities.length === 0 && (
              <p className="text-sm text-[#94A3B8] py-8 text-center">검색 결과가 없습니다</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              {filteredCities.map((city) => (
                <motion.button
                  key={city}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCitySelect(city)}
                  className="bg-white border border-[#E2E8F0] rounded-xl p-5 text-left hover:border-[#6366F1] hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="text-2xl mb-2">{city === "서울" ? "🏙️" : "🌇"}</div>
                  <div className="text-lg font-bold text-[#0F172A]">{city}</div>
                  <div className="text-xs text-[#94A3B8] mt-1 flex items-center gap-1">
                    동네 정보 보기 <ChevronRight size={12} />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}

        {/* District Tabs (after city selection) */}
        {selectedCity && (
          <>
            <section className="pb-4">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => { setSelectedCity(null); setSelectedDistrict(null); }}
                  className="text-sm text-[#6366F1] font-medium hover:underline cursor-pointer"
                >
                  ← 시 선택
                </button>
                <span className="text-sm text-[#94A3B8]">/</span>
                <span className="text-sm font-bold text-[#0F172A]">{selectedCity}</span>
              </div>
              <div
                ref={tabScrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {districts.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleDistrictSelect(d)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      selectedDistrict === d
                        ? "bg-[#6366F1] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#6366F1] hover:text-[#6366F1]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </section>

            {/* Content */}
            <AnimatePresence mode="wait">
              {!selectedDistrict ? (
                <motion.section
                  key="popular"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-[#0F172A]">
                      {selectedCity} 인기 동네 TOP 10
                    </h2>
                    <span className="text-xs text-[#94A3B8]">종합 점수 순</span>
                  </div>
                  <div className="space-y-3">
                    {popularNeighborhoods.map((n, i) => (
                      <NeighborhoodCard key={n.id} neighborhood={n} rank={i + 1} index={i} />
                    ))}
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key={selectedDistrict}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-[#0F172A]">
                      {selectedDistrict} 동네 목록
                    </h2>
                    <span className="text-xs text-[#94A3B8]">
                      {filteredNeighborhoods.length}개 동네 · 종합 점수 순
                    </span>
                  </div>
                  <div className="space-y-3">
                    {filteredNeighborhoods.map((n, i) => (
                      <NeighborhoodCard key={n.id} neighborhood={n} index={i} />
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 블로그 위젯 */}
        <BlogWidget />
      </main>
    </div>
  );
}
