import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "서비스 소개 | 이사전에",
  description:
    "이사전에는 이사 가기 전 동네의 소음, 안전, 편의 정보를 한눈에 확인할 수 있는 무료 서비스입니다.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0F172A]">
            이사전에
          </h1>
          <p className="text-[#64748B] mt-2">
            이사 가기 전, 동네 정보를 한눈에 확인하세요.
          </p>
        </div>

        {/* 서비스 소개 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">
            서비스 소개
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3">
            <p className="text-sm text-[#374151] leading-relaxed">
              <strong>이사전에</strong>는 이사를 준비하는 분들이 동네 정보를
              쉽고 빠르게 확인할 수 있도록 만든 무료 서비스입니다.
            </p>
            <p className="text-sm text-[#374151] leading-relaxed">
              전국 252개 동네의 소음·안전·편의 점수, 민원 현황, CCTV 정보,
              주변 맛집·병원·학교·공원 정보, 이사 체크리스트, 분리수거
              가이드까지 한 곳에서 확인할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 주요 기능 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">
            주요 기능
          </h2>
          <div className="space-y-3">
            {[
              {
                icon: "🏘️",
                title: "동네 점수",
                desc: "소음·안전·편의 3가지 점수로 동네 환경을 한눈에 파악할 수 있습니다.",
              },
              {
                icon: "📊",
                title: "민원 현황",
                desc: "실제 민원 데이터 기반 카테고리별·월별 민원 추이를 확인할 수 있습니다.",
              },
              {
                icon: "🔒",
                title: "안전 정보",
                desc: "CCTV, 경찰서, 비상벨, 24시 편의점 등 안전 인프라 정보를 제공합니다.",
              },
              {
                icon: "🍽️",
                title: "동네 생활 정보",
                desc: "맛집, 카페, 병원, 학교, 공원 등 주변 시설 정보를 네이버 검색 기반으로 제공합니다.",
              },
              {
                icon: "📋",
                title: "이사 체크리스트",
                desc: "전입신고, 건강보험, 자동차 등록 등 이사 후 해야 할 일을 빠짐없이 관리할 수 있습니다.",
              },
              {
                icon: "♻️",
                title: "분리수거 가이드",
                desc: "80개 항목의 올바른 분리수거 방법을 검색하고 확인할 수 있습니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-xl p-4"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 데이터 출처 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">
            데이터 출처
          </h2>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <ul className="space-y-2 text-sm text-[#374151]">
              <li>
                <strong>동네 점수·민원 데이터</strong> — 공공데이터포털, 각
                지자체 민원 통계
              </li>
              <li>
                <strong>안전 정보</strong> — 경찰청 CCTV 현황, 안전지도
              </li>
              <li>
                <strong>맛집·병원·공원</strong> — 네이버 지역 검색 API
              </li>
              <li>
                <strong>분리수거</strong> — 환경부 분리배출 가이드, 각 지자체
                분리수거 기준
              </li>
            </ul>
            <p className="text-xs text-[#94A3B8] mt-3">
              데이터는 주기적으로 업데이트되며, 실제와 다를 수 있습니다.
              정확한 정보는 관할 기관에 문의하세요.
            </p>
          </div>
        </section>

        {/* 문의 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#0F172A] mb-3">문의</h2>
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
            <p className="text-sm text-[#374151]">
              서비스 관련 문의, 데이터 오류 제보, 제휴 문의는 아래로
              연락해주세요.
            </p>
            <p className="text-sm text-[#6366F1] font-medium mt-2">
              {/* 이메일 주소를 입력하세요 */}
              이메일: (준비 중)
            </p>
          </div>
        </section>

        {/* 하단 링크 */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#6366F1] text-white rounded-xl font-medium hover:bg-[#4F46E5] transition-colors"
          >
            동네 정보 확인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
