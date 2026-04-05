"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Phone } from "lucide-react";
import type { Neighborhood } from "@/lib/data";
import ScoreBadge from "@/components/ScoreBadge";

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

// ── emergency contacts ──────────────────────────────────────

const emergencyContacts = [
  { label: "경찰", number: "112", description: "범죄 신고, 긴급 상황" },
  { label: "소방/구급", number: "119", description: "화재, 응급 환자" },
  { label: "여성긴급전화", number: "1366", description: "여성폭력 피해 상담" },
  { label: "자살예방상담", number: "1393", description: "정신건강 위기상담" },
];

// ── props ────────────────────────────────────────────────────

interface SafetyDetailContentProps {
  area: Neighborhood;
  safety: {
    neighborhoodId: string;
    cctvCount: number;
    cctvTraffic: number;
    policeStation: string;
    policeDistance: string;
    convenienceStores24h: number;
    emergencyBells: number;
    safetyScore: number;
  };
  id: string;
}

// ── main component ──────────────────────────────────────────

export default function SafetyDetailContent({
  area,
  safety,
  id,
}: SafetyDetailContentProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ─── 1. 헤더 ─────────────────────────────────────── */}
        <Section delay={0}>
          <Link
            href={`/area/${id}`}
            className="inline-flex items-center gap-1 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-4"
          >
            <ArrowLeft size={16} /> 돌아가기
          </Link>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#0F172A]">
              {area.name} 안전 정보
            </h1>
            <ScoreBadge score={safety.safetyScore} size="lg" />
          </div>
        </Section>

        {/* ─── 2. 핵심 지표 카드 3개 ─────────────────────── */}
        <Section delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-2xl mb-2">📹</div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1">CCTV</h3>
              <p className="text-2xl font-bold text-[#7C3AED]">
                {safety.cctvCount + safety.cctvTraffic}
                <span className="text-sm font-normal text-[#64748B] ml-1">대</span>
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                방범 {safety.cctvCount} + 교통 {safety.cctvTraffic}
              </p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-2xl mb-2">👮</div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1">경찰서</h3>
              <p className="text-base font-bold text-[#7C3AED]">
                {safety.policeStation}
              </p>
              <p className="text-xs text-[#64748B] mt-1">{safety.policeDistance}</p>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-2xl mb-2">🏪</div>
              <h3 className="text-sm font-semibold text-[#0F172A] mb-1">
                24시 편의점 / 비상벨
              </h3>
              <p className="text-2xl font-bold text-[#7C3AED]">
                {safety.convenienceStores24h}
                <span className="text-sm font-normal text-[#64748B] ml-1">개</span>
                <span className="text-sm font-normal text-[#64748B] mx-1">/</span>
                {safety.emergencyBells}
                <span className="text-sm font-normal text-[#64748B] ml-1">개</span>
              </p>
            </div>
          </div>
        </Section>

        {/* ─── 3. 비상 연락처 ───────────────────────────── */}
        <Section delay={0.1}>
          <h2 className="text-sm font-semibold text-[#64748B] mb-3">
            비상 연락처
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {emergencyContacts.map((contact) => (
              <a
                key={contact.number}
                href={`tel:${contact.number}`}
                className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-xl p-3 hover:border-[#7C3AED] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#F3F0FF] flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#7C3AED]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#0F172A]">{contact.number}</p>
                  <p className="text-xs font-medium text-[#7C3AED]">{contact.label}</p>
                  <p className="text-[11px] text-[#94A3B8] truncate">
                    {contact.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* ─── 4. 하단 링크 ─────────────────────────────── */}
        <Section delay={0.15}>
          <Link
            href={`/area/${id}`}
            className="block text-center py-3 rounded-xl border border-[#7C3AED] text-[#7C3AED] text-sm font-medium hover:bg-[#F3F0FF] transition-colors"
          >
            동네 상세로 돌아가기
          </Link>
        </Section>
      </div>
    </div>
  );
}
