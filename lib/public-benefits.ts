// ============================================================
// "이사전에" 서비스 - 공공혜택 데이터 타입 + 유틸 함수
// JSON 기반 (data/public-benefits/benefits.json)
// ============================================================

import fs from 'fs';
import path from 'path';

// ─── 타입 정의 ────────────────────────────────────────────────

export type BenefitCategory = 'housing' | 'youth' | 'childcare' | 'senior' | 'culture' | 'local_currency';

export type Persona = 'youth' | 'newlywed' | 'childcare' | 'senior' | 'general';

export interface PublicBenefit {
  id: string;
  title: string;
  category: BenefitCategory;
  personas: Persona[];        // 이 혜택의 대상 페르소나
  description: string;
  eligibility?: string;       // 신청자격
  amount?: string;            // 지원금액
  period?: string;            // 지원기간
  howToApply?: string;        // 신청방법
  url?: string;               // 관련 링크
  source: string;             // 데이터 출처
}

export interface BenefitsData {
  national: PublicBenefit[];   // 전국 공통 혜택
  cities: Record<string, PublicBenefit[]>;  // 시/도 단위 혜택
  districts: Record<string, PublicBenefit[]>; // 구/군 단위 혜택
  updatedAt: string;
}

// ─── 카테고리 라벨 (한글) ─────────────────────────────────────

export const CATEGORY_LABELS: Record<BenefitCategory, string> = {
  housing: '주거 지원',
  youth: '청년 정책',
  childcare: '출산·육아',
  senior: '시니어',
  culture: '문화·생활',
  local_currency: '지역화폐',
};

// ─── 카테고리 아이콘 (lucide 아이콘 이름) ─────────────────────

export const CATEGORY_ICONS: Record<BenefitCategory, string> = {
  housing: 'Home',
  youth: 'GraduationCap',
  childcare: 'Baby',
  senior: 'Heart',
  culture: 'Palette',
  local_currency: 'Wallet',
};

// ─── 페르소나 라벨 (한글) ─────────────────────────────────────

export const PERSONA_LABELS: Record<Persona, string> = {
  youth: '청년 (만 19~34세)',
  newlywed: '신혼부부',
  childcare: '영유아·육아',
  senior: '시니어 (만 65세+)',
  general: '일반',
};

// ─── 데이터 로딩 (서버 전용, 모듈 레벨 캐시) ─────────────────

let cachedData: BenefitsData | null = null;

const BENEFITS_JSON_PATH = path.join(process.cwd(), 'data/public-benefits/benefits.json');

/** JSON 파일에서 공공혜택 데이터를 로드 (캐시 사용) */
export function loadBenefitsData(): BenefitsData {
  if (cachedData) return cachedData;

  const raw = fs.readFileSync(BENEFITS_JSON_PATH, 'utf-8');
  cachedData = JSON.parse(raw) as BenefitsData;
  return cachedData;
}

// ─── 유틸 함수 ────────────────────────────────────────────────

/** 특정 구에 해당하는 혜택 목록 (전국 + 시/도 + 구/군 병합) */
export function getBenefitsForDistrict(city: string, district: string): PublicBenefit[] {
  const data = loadBenefitsData();
  const districtKey = `${city} ${district}`; // e.g. "서울 강남구"

  const national = data.national ?? [];
  const cityBenefits = data.cities?.[city] ?? [];
  const districtBenefits = data.districts?.[districtKey] ?? [];

  return [...national, ...cityBenefits, ...districtBenefits];
}

/** 페르소나별 필터. 'general'이면 전체 반환, 그 외는 해당 페르소나 또는 'general' 포함 항목만 */
export function filterByPersona(benefits: PublicBenefit[], persona: Persona): PublicBenefit[] {
  if (persona === 'general') return benefits;
  return benefits.filter(
    (b) => b.personas.includes(persona) || b.personas.includes('general'),
  );
}

/** 카테고리별 필터 */
export function filterByCategory(benefits: PublicBenefit[], category: BenefitCategory): PublicBenefit[] {
  return benefits.filter((b) => b.category === category);
}

/** 카테고리별 그룹핑 (혜택이 있는 카테고리만 포함) */
export function groupByCategory(benefits: PublicBenefit[]): Partial<Record<BenefitCategory, PublicBenefit[]>> {
  const grouped: Partial<Record<BenefitCategory, PublicBenefit[]>> = {};

  for (const benefit of benefits) {
    if (!grouped[benefit.category]) {
      grouped[benefit.category] = [];
    }
    grouped[benefit.category]!.push(benefit);
  }

  return grouped;
}

/** 혜택 데이터가 존재하는 모든 구/군 키 목록 */
export function getAvailableDistricts(): string[] {
  const data = loadBenefitsData();
  return Object.keys(data.districts ?? {});
}
