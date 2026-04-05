"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import type { RecycleItem, CategoryInfo, RecycleCategory } from "@/lib/recycle";

interface RecycleDetailContentProps {
  item: RecycleItem;
  categoryInfo?: CategoryInfo;
  allCategories: CategoryInfo[];
}

function getCategoryInfo(
  categories: CategoryInfo[],
  catId: RecycleCategory,
): CategoryInfo | undefined {
  return categories.find((c) => c.id === catId);
}

export default function RecycleDetailContent({
  item,
  categoryInfo,
  allCategories,
}: RecycleDetailContentProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-2xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-2 pt-6 pb-2">
          <Link
            href="/recycle"
            className="flex items-center gap-1 text-sm text-[#64748B] hover:text-[#16A34A] transition-colors"
          >
            <ArrowLeft size={16} /> 분리수거
          </Link>
          <span className="text-[#CBD5E1]">/</span>
          <h1 className="text-lg font-bold text-[#0F172A]">{item.name}</h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Badge */}
          {categoryInfo && (
            <section className="pt-6 pb-4">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold"
                style={{
                  backgroundColor: categoryInfo.color + "18",
                  color: categoryInfo.color,
                }}
              >
                <span className="text-xl">{categoryInfo.icon}</span>
                {categoryInfo.label}
              </div>
            </section>
          )}

          {/* Main Method */}
          <section className="mb-6">
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
              <h2 className="text-sm font-semibold text-[#16A34A] mb-2">
                분리수거 방법
              </h2>
              <p className="text-lg font-bold text-[#0F172A]">{item.method}</p>
            </div>
          </section>

          {/* Preparation Checklist */}
          {item.preparation.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#0F172A] mb-3">
                배출 전 처리
              </h2>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-2.5">
                {item.preparation.map((step, i) => (
                  <label
                    key={i}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 rounded border-[#D1D5DB] text-[#16A34A] focus:ring-[#16A34A] accent-[#16A34A]"
                    />
                    <span className="text-[#374151] text-sm group-hover:text-[#0F172A] transition-colors">
                      {step}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          )}

          {/* Conditional Classification */}
          {item.conditions.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#0F172A] mb-3">
                조건에 따라 다른 경우
              </h2>
              <div className="space-y-2">
                {item.conditions.map((cond, i) => {
                  const condCat = getCategoryInfo(allCategories, cond.category);
                  const isGeneral =
                    cond.category === "general" || cond.category === "hazardous";
                  return (
                    <div
                      key={i}
                      className="rounded-xl p-4 border"
                      style={{
                        backgroundColor: isGeneral ? "#FEF2F2" : "#F0FDF4",
                        borderColor: isGeneral ? "#FECACA" : "#BBF7D0",
                      }}
                    >
                      <p className="text-sm font-semibold mb-1">
                        <span>{isGeneral ? "\u26A0\uFE0F" : "\u2705"}</span>{" "}
                        <span
                          style={{
                            color: isGeneral ? "#DC2626" : "#16A34A",
                          }}
                        >
                          {cond.condition}
                        </span>
                      </p>
                      <p className="text-sm text-[#374151]">
                        {"\u2192"} {cond.method}
                        {condCat && (
                          <span
                            className="ml-2 text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              backgroundColor: condCat.color + "18",
                              color: condCat.color,
                            }}
                          >
                            {condCat.label}
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tips */}
          {item.tips.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#0F172A] mb-3">
                {"\uD83D\uDCA1"} 꿀팁
              </h2>
              <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 space-y-2">
                {item.tips.map((tip, i) => (
                  <p key={i} className="text-sm text-[#92400E]">
                    {"\u2022"} {tip}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Common Mistakes */}
          {item.commonMistakes.length > 0 && (
            <section className="mb-6">
              <h2 className="text-base font-bold text-[#0F172A] mb-3">
                {"\u274C"} 흔한 실수
              </h2>
              <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4 space-y-2">
                {item.commonMistakes.map((mistake, i) => (
                  <p key={i} className="text-sm text-[#991B1B]">
                    {"\u2022"} {mistake}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Disclaimer */}
          <section className="mb-8">
            <div className="bg-[#F1F5F9] rounded-xl p-4">
              <p className="text-xs text-[#64748B] text-center">
                지자체별로 규정이 다를 수 있습니다. 정확한 정보는 관할 구청에
                문의하세요.
              </p>
            </div>
          </section>

          {/* Back to Search */}
          <section className="text-center">
            <Link
              href="/recycle"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#16A34A] text-white rounded-xl font-medium hover:bg-[#15803D] transition-colors"
            >
              <Search size={18} />
              다른 물건 검색하기
            </Link>
          </section>
        </motion.div>
      </main>
    </div>
  );
}
