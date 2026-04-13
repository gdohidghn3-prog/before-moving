"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  GraduationCap,
  Baby,
  Heart,
  Palette,
  Wallet,
  ChevronDown,
  ExternalLink,
  Loader2,
  RefreshCw,
  Gift,
} from "lucide-react";

// ── types ──────────────────────────────────────────────────

type BenefitCategory =
  | "housing"
  | "youth"
  | "childcare"
  | "senior"
  | "culture"
  | "local_currency";

type Persona = "youth" | "newlywed" | "childcare" | "senior" | "general";

interface PublicBenefit {
  id: string;
  title: string;
  category: BenefitCategory;
  personas: Persona[];
  description: string;
  eligibility?: string;
  amount?: string;
  period?: string;
  howToApply?: string;
  url?: string;
  source: string;
}

interface PublicBenefitsSectionProps {
  district: string;
  city: string;
}

// ── constants ──────────────────────────────────────────────

const CATEGORY_LABELS: Record<BenefitCategory, string> = {
  housing: "주거 지원",
  youth: "청년 정책",
  childcare: "출산·육아",
  senior: "시니어",
  culture: "문화·생활",
  local_currency: "지역화폐",
};

const CATEGORY_ICONS: Record<BenefitCategory, React.ElementType> = {
  housing: Home,
  youth: GraduationCap,
  childcare: Baby,
  senior: Heart,
  culture: Palette,
  local_currency: Wallet,
};

const CATEGORY_COLORS: Record<BenefitCategory, string> = {
  housing: "#6366F1",
  youth: "#3B82F6",
  childcare: "#EC4899",
  senior: "#EF4444",
  culture: "#8B5CF6",
  local_currency: "#10B981",
};

const PERSONA_LABELS: Record<Persona, string> = {
  general: "전체",
  youth: "청년",
  newlywed: "신혼",
  childcare: "육아",
  senior: "시니어",
};

const PERSONA_ORDER: Persona[] = [
  "general",
  "youth",
  "newlywed",
  "childcare",
  "senior",
];

const CATEGORY_ORDER: BenefitCategory[] = [
  "housing",
  "youth",
  "childcare",
  "senior",
  "culture",
  "local_currency",
];

const LS_KEY = "benefits-persona";

// ── skeleton card ──────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 animate-pulse">
      <div className="h-4 bg-[#E2E8F0] rounded w-3/4 mb-2" />
      <div className="h-3 bg-[#E2E8F0] rounded w-full mb-1.5" />
      <div className="h-3 bg-[#E2E8F0] rounded w-2/3" />
    </div>
  );
}

// ── benefit card ───────────────────────────────────────────

function BenefitCard({ benefit }: { benefit: PublicBenefit }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-1">
        <h4 className="font-medium text-sm text-[var(--text)] leading-tight">
          {benefit.title}
        </h4>
        {benefit.url && (
          <a
            href={benefit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 text-[11px] px-2 py-1 rounded-md bg-[#EEF2FF] text-[#6366F1] hover:bg-[#E0E7FF] transition-colors shrink-0"
            title="자세히 보기"
          >
            <ExternalLink size={12} />
            링크
          </a>
        )}
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">
        {benefit.description}
      </p>

      {/* amount badge */}
      {benefit.amount && (
        <span className="inline-block text-[11px] px-2 py-0.5 rounded-full font-medium bg-[#F0FDF4] text-[#16A34A] mb-2">
          {benefit.amount}
        </span>
      )}

      {/* eligibility */}
      {benefit.eligibility && (
        <p className="text-[11px] text-[#94A3B8] mb-1">
          <span className="font-medium text-[#64748B]">대상:</span>{" "}
          {benefit.eligibility}
        </p>
      )}

      {/* period */}
      {benefit.period && (
        <p className="text-[11px] text-[#94A3B8] mb-1">
          <span className="font-medium text-[#64748B]">기간:</span>{" "}
          {benefit.period}
        </p>
      )}

      {/* howToApply - expandable */}
      {benefit.howToApply && (
        <>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-[11px] text-[#6366F1] hover:underline mt-1 cursor-pointer"
          >
            {expanded ? "신청 방법 접기" : "신청 방법 보기"}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[11px] text-[#64748B] mt-1 leading-relaxed overflow-hidden"
              >
                {benefit.howToApply}
              </motion.p>
            )}
          </AnimatePresence>
        </>
      )}

      {/* source */}
      <p className="text-[10px] text-[#CBD5E1] mt-2">{benefit.source}</p>
    </div>
  );
}

// ── category section ───────────────────────────────────────

function CategoryGroup({
  category,
  benefits,
  defaultExpanded,
}: {
  category: BenefitCategory;
  benefits: PublicBenefit[];
  defaultExpanded: boolean;
}) {
  const [open, setOpen] = useState(defaultExpanded);
  const Icon = CATEGORY_ICONS[category];
  const color = CATEGORY_COLORS[category];

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 py-2 cursor-pointer"
      >
        <Icon size={18} style={{ color }} />
        <span className="text-sm font-semibold text-[var(--text)]">
          {CATEGORY_LABELS[category]}
        </span>
        <span
          className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: color + "18", color }}
        >
          {benefits.length}
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto text-[#94A3B8] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2 overflow-hidden"
          >
            {benefits.map((b) => (
              <BenefitCard key={b.id} benefit={b} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── main component ─────────────────────────────────────────

export default function PublicBenefitsSection({
  district,
  city,
}: PublicBenefitsSectionProps) {
  const [persona, setPersona] = useState<Persona>("general");
  const [benefits, setBenefits] = useState<PublicBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // load persona from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved && PERSONA_ORDER.includes(saved as Persona)) {
        setPersona(saved as Persona);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  // fetch benefits
  const fetchBenefits = useCallback(
    async (p: Persona) => {
      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `/api/public-benefits/${encodeURIComponent(district)}?city=${encodeURIComponent(city)}&persona=${p}`
        );
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        setBenefits(json.benefits ?? []);
      } catch {
        setError(true);
        setBenefits([]);
      } finally {
        setLoading(false);
      }
    },
    [district, city]
  );

  // fetch on mount and persona change
  useEffect(() => {
    fetchBenefits(persona);
  }, [persona, fetchBenefits]);

  // handle persona change
  const handlePersonaChange = (p: Persona) => {
    setPersona(p);
    try {
      localStorage.setItem(LS_KEY, p);
    } catch {
      // localStorage unavailable
    }
  };

  // group benefits by category
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    benefits: benefits.filter((b) => b.category === cat),
  })).filter((g) => g.benefits.length > 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Gift size={18} className="text-purple-600" />
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">
          이 동네 공공혜택
        </h2>
      </div>

      {/* persona filter bar */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-3">
        {PERSONA_ORDER.map((p) => {
          const isActive = persona === p;
          return (
            <button
              key={p}
              onClick={() => handlePersonaChange(p)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-purple-600 text-white"
                  : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
              }`}
            >
              {PERSONA_LABELS[p]}
            </button>
          );
        })}
      </div>

      {/* content */}
      <div className="min-h-[120px]">
        {loading ? (
          /* skeleton */
          <div className="space-y-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          /* error */
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <span className="text-sm text-[#94A3B8]">
              혜택 정보를 불러오지 못했습니다.
            </span>
            <button
              onClick={() => fetchBenefits(persona)}
              className="flex items-center gap-1 text-xs text-[#6366F1] hover:underline cursor-pointer"
            >
              <RefreshCw size={12} />
              다시 시도
            </button>
          </div>
        ) : grouped.length === 0 ? (
          /* empty */
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-[#94A3B8]">
              이 지역의 공공혜택 정보가 준비 중입니다.
            </span>
          </div>
        ) : (
          /* benefits list */
          <AnimatePresence mode="wait">
            <motion.div
              key={persona}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {grouped.map((g, idx) => (
                <CategoryGroup
                  key={g.category}
                  category={g.category}
                  benefits={g.benefits}
                  defaultExpanded={idx < 2}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <p className="text-[11px] text-[#CBD5E1] text-right mt-2">
        공공데이터포털 · 지자체 정보 제공
      </p>
    </div>
  );
}
