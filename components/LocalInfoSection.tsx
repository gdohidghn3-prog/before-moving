"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Utensils,
  Coffee,
  Stethoscope,
  GraduationCap,
  Trees,
  BookOpen,
  MapPin,
  Phone,
  ExternalLink,
  Map,
  Loader2,
  Search,
  X,
} from "lucide-react";

// ── 타입 ────────────────────────────────────────────────────

interface NaverItem {
  title: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  link: string;
  mapx: string;
  mapy: string;
}

interface LocalInfoSectionProps {
  neighborhoodId: string;
  district: string;
  name: string;
  city: string;
}

// ── 카테고리 설정 ────────────────────────────────────────────

const CATEGORIES = [
  { key: "restaurant", label: "맛집", icon: Utensils, color: "#EF4444" },
  { key: "cafe", label: "카페", icon: Coffee, color: "#8B5CF6" },
  { key: "hospital", label: "병원/약국", icon: Stethoscope, color: "#3B82F6" },
  { key: "school", label: "학교", icon: GraduationCap, color: "#F59E0B" },
  { key: "academy", label: "학원", icon: BookOpen, color: "#EC4899" },
  { key: "park", label: "공원/산책", icon: Trees, color: "#10B981" },
] as const;

// ── 카테고리 추출 ────────────────────────────────────────────

function formatCategory(raw: string): string {
  const parts = raw.split(">");
  return parts[parts.length - 1]?.trim() || raw;
}

// ── 네이버 지도 URL 생성 ─────────────────────────────────────

function getNaverMapUrl(item: NaverItem, district: string, name: string): string {
  const cleanTitle = item.title.replace(/<[^>]*>/g, "");
  return `https://map.naver.com/v5/search/${encodeURIComponent(district + " " + name + " " + cleanTitle)}`;
}

// ── 아이템 카드 ──────────────────────────────────────────────

function ItemCard({ item, color, district, name }: { item: NaverItem; color: string; district: string; name: string }) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h4 className="font-semibold text-[#0F172A] text-sm leading-tight">
          {item.title}
        </h4>
        {/* 지도 + 웹사이트 링크 */}
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={getNaverMapUrl(item, district, name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-[11px] px-2 py-1 rounded-md bg-[#F0FDF4] text-[#16A34A] hover:bg-[#DCFCE7] transition-colors"
            title="네이버 지도"
          >
            <Map size={12} />
            지도
          </a>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-[11px] px-2 py-1 rounded-md bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF] transition-colors"
              title="웹사이트"
            >
              <ExternalLink size={12} />
              SNS
            </a>
          )}
        </div>
      </div>

      <span
        className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium mb-2"
        style={{ backgroundColor: color + "18", color }}
      >
        {formatCategory(item.category)}
      </span>

      {item.roadAddress && (
        <div className="flex items-start gap-1.5 mb-1">
          <MapPin size={12} className="text-[#94A3B8] mt-0.5 shrink-0" />
          <span className="text-xs text-[#64748B] leading-relaxed">
            {item.roadAddress}
          </span>
        </div>
      )}

      {item.telephone && (
        <div className="flex items-center gap-1.5">
          <Phone size={12} className="text-[#94A3B8] shrink-0" />
          <a
            href={`tel:${item.telephone}`}
            className="text-xs text-[#6366F1] hover:underline"
          >
            {item.telephone}
          </a>
        </div>
      )}
    </div>
  );
}

// ── 검색 바 ──────────────────────────────────────────────────

function SearchBar({
  placeholder,
  onSearch,
  loading,
}: {
  placeholder: string;
  onSearch: (query: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setValue("");
    onSearch(""); // 빈 검색 = 기본 카테고리 결과로 복귀
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-3">
      <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-3.5 h-11 focus-within:border-[#6366F1] focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-shadow">
        <Search size={16} className="text-[#94A3B8] shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-[#0F172A] placeholder:text-[#94A3B8]"
        />
        {loading && (
          <Loader2 size={14} className="animate-spin text-[#94A3B8] shrink-0" />
        )}
        {value && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[#94A3B8] hover:text-[#64748B] shrink-0"
          >
            <X size={14} />
          </button>
        )}
        <button
          type="submit"
          disabled={!value.trim() || loading}
          className="shrink-0 px-2.5 py-1 bg-[#6366F1] text-white text-xs font-medium rounded-lg disabled:opacity-40 hover:bg-[#4F46E5] transition-colors"
        >
          검색
        </button>
      </div>
    </form>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────

export default function LocalInfoSection({
  neighborhoodId,
  district,
  name,
  city,
}: LocalInfoSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("restaurant");
  const [data, setData] = useState<Record<string, NaverItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [searchResults, setSearchResults] = useState<NaverItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    if (loaded[activeTab]) return;

    async function fetchData() {
      setLoading((p) => ({ ...p, [activeTab]: true }));

      try {
        const params = new URLSearchParams({
          id: neighborhoodId,
          district,
          name,
          category: activeTab,
        });
        const res = await fetch(`/api/local-info?${params}`);
        const json = await res.json();

        setData((p) => ({ ...p, [activeTab]: json.items ?? [] }));
        setLoaded((p) => ({ ...p, [activeTab]: true }));
      } catch {
        setData((p) => ({ ...p, [activeTab]: [] }));
        setLoaded((p) => ({ ...p, [activeTab]: true }));
      } finally {
        setLoading((p) => ({ ...p, [activeTab]: false }));
      }
    }

    fetchData();
  }, [activeTab, neighborhoodId, district, name, loaded]);

  // 검색 핸들러 — 네이버 API 실시간 호출
  const handleSearch = useCallback(
    async (query: string) => {
      if (!query) {
        setSearchResults(null);
        setIsSearchMode(false);
        return;
      }

      setSearchLoading(true);
      setIsSearchMode(true);

      try {
        const params = new URLSearchParams({ district, name, q: query });
        const res = await fetch(`/api/local-info?${params}`);
        const json = await res.json();
        setSearchResults(json.items ?? []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    },
    [district, name],
  );

  const activeCat = CATEGORIES.find((c) => c.key === activeTab)!;
  const items = isSearchMode ? (searchResults ?? []) : (data[activeTab] ?? []);
  const isLoading = isSearchMode ? searchLoading : (loading[activeTab] ?? false);
  const displayColor = isSearchMode ? "#6366F1" : activeCat.color;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="mb-8"
    >
      <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
        동네 생활 정보
      </h2>

      {/* 통합 검색 */}
      <SearchBar
        placeholder={`${district} ${name} 주변 검색 (예: 이탈리안 맛집, 피부과)`}
        onSearch={handleSearch}
        loading={searchLoading}
      />

      {/* 탭 (검색 모드가 아닐 때) */}
      {!isSearchMode && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "text-white"
                    : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#6366F1] hover:text-[#6366F1]"
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 검색 모드 표시 */}
      {isSearchMode && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-[#6366F1] font-medium">검색 결과</span>
          <button
            onClick={() => {
              setIsSearchMode(false);
              setSearchResults(null);
            }}
            className="text-xs text-[#94A3B8] hover:text-[#6366F1] underline"
          >
            카테고리로 돌아가기
          </button>
        </div>
      )}

      {/* 콘텐츠 */}
      <div className="min-h-[120px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-[#94A3B8]" />
            <span className="ml-2 text-sm text-[#94A3B8]">불러오는 중...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-[#94A3B8]">
              {isSearchMode
                ? "검색 결과가 없습니다. 다른 키워드로 검색해보세요."
                : `주변 ${activeCat.label} 정보를 찾을 수 없습니다.`}
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={isSearchMode ? "search" : activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {items.map((item, i) => (
                <ItemCard key={`${item.title}-${i}`} item={item} color={displayColor} district={district} name={name} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <p className="text-[11px] text-[#CBD5E1] text-right mt-2">
        네이버 지역 검색 제공
      </p>
    </motion.section>
  );
}
