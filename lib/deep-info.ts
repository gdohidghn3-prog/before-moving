// 심층분석 확장 데이터 — 아파트 랭킹 · 부동산 시세 · 교육 · 교통 · 생활인프라 · 개발계획
import { getNeighborhoodById, type Neighborhood } from "./data";

// ── 타입 정의 ──────────────────────────────────────────

export interface ApartmentComplex {
  name: string;
  score: number;       // 종합점수 0~100
  lat: number;
  lng: number;
  units: number;       // 세대수
  builtYear: number;   // 준공년도
  avgPyeong: number;   // 대표 평형
  avgSale: number;     // 매매가 (만원)
  avgJeonse: number;   // 전세가 (만원)
}

export interface RealEstateInfo {
  aptJeonse: number | null;
  aptWolse: { deposit: number; monthly: number } | null;
  aptSale: number | null;
  villaJeonse: number | null;
  villaWolse: { deposit: number; monthly: number } | null;
  oneRoomWolse: { deposit: number; monthly: number } | null;
  basePyeong: number;
  dataDate: string;
  apartments: ApartmentComplex[];  // TOP 10 아파트 랭킹
}

export interface PoiLocation {
  name: string;
  lat: number;
  lng: number;
  extra?: string; // 학생수, 유형 등
}

export interface EducationInfo {
  elementary: PoiLocation[];
  middle: PoiLocation[];
  high: (PoiLocation & { type?: string })[];
  academyDensity: "상" | "중" | "하";
  summary: string;
}

export interface CommuteInfo {
  destinations: { name: string; byTransit: string; byCar: string }[];
  mainTransport: string[];
  congestion: "상" | "중" | "하";
}

export interface InfraLocation {
  name: string;
  lat: number;
  lng: number;
  extra?: string;
}

export interface InfraInfo {
  hospital: InfraLocation | null;
  clinicCount: number;
  pharmacyCount: number;
  mart: InfraLocation | null;
  park: InfraLocation | null;
  library: InfraLocation | null;
}

export interface DevelopmentPlan {
  title: string;
  status: "예정" | "진행중" | "완료예정";
  expectedYear: string;
  impact: string;
}

export interface DeepInfo {
  realEstate: RealEstateInfo;
  education: EducationInfo;
  commute: CommuteInfo;
  infra: InfraInfo;
  developments: DevelopmentPlan[];
}

// ── 거리 계산 유틸 (Haversine) ─────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** 두 좌표 사이 도보/차량 소요시간 문자열 반환 */
export function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): { walk: string; drive: string } {
  const km = haversineKm(lat1, lng1, lat2, lng2);
  const walkMin = Math.round(km / 0.07); // 도보 약 4.2km/h
  const driveMin = Math.max(1, Math.round(km / 0.5)); // 차량 약 30km/h (시내)
  const walkStr = walkMin <= 60 ? `도보 ${walkMin}분` : `도보 ${Math.round(walkMin / 60)}시간 ${walkMin % 60}분`;
  const driveStr = `차량 ${driveMin}분`;
  return { walk: walkStr, drive: driveStr };
}

// ── 시드 기반 의사 난수 ─────────────────────────────────

function seedHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function seededRange(seed: number, min: number, max: number): number {
  return min + (seed % (max - min + 1));
}

function seededFloat(seed: number): number {
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

// ── 도시별 기준 시세 ───────────────────────────────────

const CITY_BASE: Record<string, { sale: number; jeonse: number; villaJ: number; oneRoom: number }> = {
  "서울":   { sale: 90000, jeonse: 55000, villaJ: 25000, oneRoom: 55 },
  "성남":   { sale: 70000, jeonse: 42000, villaJ: 20000, oneRoom: 50 },
  "고양":   { sale: 50000, jeonse: 32000, villaJ: 16000, oneRoom: 42 },
  "수원":   { sale: 48000, jeonse: 30000, villaJ: 15000, oneRoom: 40 },
  "용인":   { sale: 55000, jeonse: 35000, villaJ: 17000, oneRoom: 43 },
  "부천":   { sale: 45000, jeonse: 28000, villaJ: 14000, oneRoom: 38 },
  "안양":   { sale: 52000, jeonse: 33000, villaJ: 16000, oneRoom: 42 },
  "안산":   { sale: 35000, jeonse: 22000, villaJ: 12000, oneRoom: 35 },
  "인천":   { sale: 40000, jeonse: 25000, villaJ: 13000, oneRoom: 36 },
  "부산":   { sale: 42000, jeonse: 26000, villaJ: 13000, oneRoom: 38 },
  "대구":   { sale: 38000, jeonse: 24000, villaJ: 12000, oneRoom: 35 },
  "광주":   { sale: 30000, jeonse: 20000, villaJ: 10000, oneRoom: 30 },
  "대전":   { sale: 32000, jeonse: 21000, villaJ: 11000, oneRoom: 32 },
  "울산":   { sale: 35000, jeonse: 22000, villaJ: 11000, oneRoom: 33 },
  "세종":   { sale: 40000, jeonse: 25000, villaJ: 12000, oneRoom: 35 },
  "제주":   { sale: 35000, jeonse: 22000, villaJ: 12000, oneRoom: 38 },
  "화성":   { sale: 45000, jeonse: 28000, villaJ: 14000, oneRoom: 38 },
  "김포":   { sale: 42000, jeonse: 26000, villaJ: 13000, oneRoom: 37 },
  "하남":   { sale: 60000, jeonse: 38000, villaJ: 18000, oneRoom: 45 },
  "광명":   { sale: 58000, jeonse: 36000, villaJ: 17000, oneRoom: 44 },
  "남양주": { sale: 42000, jeonse: 26000, villaJ: 13000, oneRoom: 37 },
  "파주":   { sale: 32000, jeonse: 20000, villaJ: 10000, oneRoom: 32 },
  "시흥":   { sale: 35000, jeonse: 22000, villaJ: 12000, oneRoom: 35 },
  "군포":   { sale: 42000, jeonse: 26000, villaJ: 13000, oneRoom: 38 },
  "의정부": { sale: 35000, jeonse: 22000, villaJ: 12000, oneRoom: 35 },
  "평택":   { sale: 32000, jeonse: 20000, villaJ: 10000, oneRoom: 32 },
  "오산":   { sale: 28000, jeonse: 18000, villaJ: 9000, oneRoom: 30 },
};
const DEFAULT_BASE = { sale: 30000, jeonse: 18000, villaJ: 10000, oneRoom: 30 };

const CITY_HOSPITAL: Record<string, { name: string; lat: number; lng: number }> = {
  "서울": { name: "서울대학교병원", lat: 37.5796, lng: 126.9990 },
  "성남": { name: "분당서울대병원", lat: 37.3520, lng: 127.1237 },
  "수원": { name: "아주대학교병원", lat: 37.2795, lng: 127.0455 },
  "고양": { name: "일산백병원", lat: 37.6504, lng: 126.7739 },
  "용인": { name: "용인세브란스병원", lat: 37.2315, lng: 127.1900 },
  "인천": { name: "인하대병원", lat: 37.4512, lng: 126.6810 },
  "부산": { name: "부산대학교병원", lat: 35.1595, lng: 129.0185 },
  "대구": { name: "경북대학교병원", lat: 35.8665, lng: 128.6010 },
  "광주": { name: "전남대학교병원", lat: 35.1430, lng: 126.9210 },
  "대전": { name: "충남대학교병원", lat: 36.3210, lng: 127.4110 },
  "울산": { name: "울산대학교병원", lat: 35.5410, lng: 129.2570 },
};

const COMMUTE_TO_GANGNAM: Record<string, string> = {
  "서울": "30~50분", "성남": "40~55분", "고양": "1시간", "수원": "1시간 20분",
  "용인": "50분~1시간", "부천": "55분", "안양": "45분", "인천": "1시간 10분",
  "하남": "50분", "광명": "40분", "김포": "1시간 10분", "남양주": "1시간",
  "화성": "1시간 30분", "의정부": "1시간 10분", "시흥": "1시간", "군포": "50분",
  "파주": "1시간 20분", "안산": "1시간 10분", "평택": "1시간 40분", "오산": "1시간 20분",
};

// ── 아파트 브랜드 + 접미사 풀 ───────────────────────────

const APT_BRANDS = [
  "래미안", "e편한세상", "힐스테이트", "자이", "푸르지오", "더샵",
  "롯데캐슬", "SK뷰", "아이파크", "꿈에그린", "우미린", "중흥S-클래스",
  "호반써밋", "한화포레나", "쌍용더플래티넘", "대방노블랜드",
];
const APT_SUFFIX = ["1단지", "2단지", "3단지", "센트럴", "파크", "리버", "힐", "스카이"];

// ── 아파트 TOP 10 자동 생성 ─────────────────────────────

function generateApartments(area: Neighborhood): ApartmentComplex[] {
  const h = seedHash(area.id);
  const base = CITY_BASE[area.city] ?? DEFAULT_BASE;
  const scoreMult = 0.7 + (area.overallScore / 100) * 0.6;
  const baseSale = Math.round(base.sale * scoreMult / 1000) * 1000;
  const apts: ApartmentComplex[] = [];

  for (let i = 0; i < 10; i++) {
    const s = h + i * 13;
    const brand = APT_BRANDS[s % APT_BRANDS.length];
    const suffix = APT_SUFFIX[(s + 5) % APT_SUFFIX.length];
    const name = `${area.name.replace(/동$/, "")} ${brand} ${suffix}`;

    // 좌표: 동 중심에서 반경 ~500m 내 분산
    const latOff = (seededFloat(s) - 0.5) * 0.008;
    const lngOff = (seededFloat(s + 1) - 0.5) * 0.010;

    const builtYear = seededRange(s + 2, 1998, 2024);
    const ageScore = Math.min(30, Math.max(0, 2025 - builtYear)); // 0~30 (신축일수록 높음)
    const newScore = 30 - ageScore;

    const units = seededRange(s + 3, 200, 2500);
    const sizeScore = Math.min(20, Math.round(units / 125)); // 세대수 기반 0~20

    const avgPyeong = seededRange(s + 4, 18, 42);

    // 점수: 신축도(30) + 세대수(20) + 편의점수(25) + 안전점수(25) + 랜덤변동
    const baseScore = newScore + sizeScore +
      Math.round(area.convenienceScore * 0.25) +
      Math.round(area.safetyScore * 0.25);
    const score = Math.min(100, Math.max(30, baseScore + seededRange(s + 5, -5, 5)));

    // 시세: 점수에 따라 변동
    const priceVar = 0.75 + (score / 100) * 0.5;
    const avgSale = Math.round(baseSale * priceVar * (avgPyeong / 25) / 1000) * 1000;
    const avgJeonse = Math.round(avgSale * 0.6 / 1000) * 1000;

    apts.push({
      name,
      score,
      lat: area.lat + latOff,
      lng: area.lng + lngOff,
      units,
      builtYear,
      avgPyeong,
      avgSale,
      avgJeonse,
    });
  }

  return apts.sort((a, b) => b.score - a.score);
}

// ── 교육 POI 자동 생성 ─────────────────────────────────

function generateEducation(area: Neighborhood): EducationInfo {
  const h = seedHash(area.id);
  const elName = area.name.replace(/동$/, "");
  const distName = area.district.replace(/구$|시$|군$/, "");
  const academyDensity: "상" | "중" | "하" =
    area.convenienceScore >= 80 ? "상" : area.convenienceScore >= 65 ? "중" : "하";

  const elementary: PoiLocation[] = [
    { name: `${elName}초등학교`, lat: area.lat + (seededFloat(h) - 0.5) * 0.006, lng: area.lng + (seededFloat(h + 1) - 0.5) * 0.008, extra: `${seededRange(h + 9, 300, 900)}명` },
  ];
  if (area.population === "높음") {
    elementary.push({ name: `${distName}초등학교`, lat: area.lat + (seededFloat(h + 2) - 0.5) * 0.006, lng: area.lng + (seededFloat(h + 3) - 0.5) * 0.008 });
  }

  const middle: PoiLocation[] = [
    { name: `${distName}중학교`, lat: area.lat + (seededFloat(h + 4) - 0.5) * 0.008, lng: area.lng + (seededFloat(h + 5) - 0.5) * 0.010 },
  ];

  const highTypes = ["일반고", "일반고", "일반고", "자사고", "특목고", "특성화고"];
  const high: (PoiLocation & { type?: string })[] = [
    { name: `${distName}고등학교`, lat: area.lat + (seededFloat(h + 6) - 0.5) * 0.010, lng: area.lng + (seededFloat(h + 7) - 0.5) * 0.012, type: highTypes[h % highTypes.length] },
  ];

  const summary = academyDensity === "상"
    ? `학원가가 발달해 교육 접근성이 우수한 지역`
    : academyDensity === "중"
    ? `기본 학교 인프라를 갖추고 있으며 인근 학원가 이용 가능`
    : `학원가가 멀어 인근 지역 이동이 필요할 수 있음`;

  return { elementary, middle, high, academyDensity, summary };
}

// ── 인프라 POI 자동 생성 ───────────────────────────────

function generateInfra(area: Neighborhood): InfraInfo {
  const h = seedHash(area.id);
  const elName = area.name.replace(/동$/, "");
  const distName = area.district.replace(/구$|시$|군$/, "");

  const hosp = CITY_HOSPITAL[area.city];
  const hospital: InfraLocation | null = hosp
    ? { name: hosp.name, lat: hosp.lat, lng: hosp.lng }
    : { name: `${area.city} 종합병원`, lat: area.lat + 0.02, lng: area.lng + 0.02 };

  const clinicCount = seededRange(h + 4, 5, 20);
  const pharmacyCount = Math.max(3, Math.round(clinicCount * 0.6));

  const martBrands = ["이마트", "홈플러스", "롯데마트", "코스트코", "하나로마트"];
  const mart: InfraLocation = {
    name: `${martBrands[h % martBrands.length]} ${distName}점`,
    lat: area.lat + (seededFloat(h + 10) - 0.5) * 0.012,
    lng: area.lng + (seededFloat(h + 11) - 0.5) * 0.015,
  };

  const parkNames = [`${elName}공원`, `${distName}근린공원`, `${area.city}천 산책로`];
  const park: InfraLocation = {
    name: parkNames[h % parkNames.length],
    lat: area.lat + (seededFloat(h + 12) - 0.5) * 0.006,
    lng: area.lng + (seededFloat(h + 13) - 0.5) * 0.008,
  };

  const library: InfraLocation = {
    name: `${distName}도서관`,
    lat: area.lat + (seededFloat(h + 14) - 0.5) * 0.008,
    lng: area.lng + (seededFloat(h + 15) - 0.5) * 0.010,
  };

  return { hospital, clinicCount, pharmacyCount, mart, park, library };
}

// ── 전체 DeepInfo 자동 생성 ─────────────────────────────

function generateDeepInfo(area: Neighborhood): DeepInfo {
  const h = seedHash(area.id);
  const base = CITY_BASE[area.city] ?? DEFAULT_BASE;
  const scoreMult = 0.7 + (area.overallScore / 100) * 0.6;
  const convMult = 0.8 + (area.convenienceScore / 100) * 0.4;

  const aptSale = Math.round(base.sale * scoreMult / 1000) * 1000;
  const aptJeonse = Math.round(base.jeonse * scoreMult / 1000) * 1000;
  const villaJeonse = Math.round(base.villaJ * scoreMult / 1000) * 1000;
  const oneRoomMonthly = Math.round(base.oneRoom * convMult);

  const apartments = generateApartments(area);

  // 교통
  const hasSubway = area.subway.length > 0;
  const congestion: "상" | "중" | "하" =
    area.population === "높음" ? "상" : area.population === "보통" ? "중" : "하";
  const mainTransport = hasSubway ? [...area.subway, "버스"] : ["버스"];
  const destinations: { name: string; byTransit: string; byCar: string }[] = [];

  if (area.city === "서울") {
    destinations.push(
      { name: "강남역", byTransit: hasSubway ? `${seededRange(h, 20, 50)}분` : `${seededRange(h, 35, 65)}분`, byCar: `${seededRange(h, 15, 40)}분` },
      { name: "여의도", byTransit: hasSubway ? `${seededRange(h+1, 25, 50)}분` : `${seededRange(h+1, 40, 70)}분`, byCar: `${seededRange(h+1, 15, 40)}분` },
    );
  } else {
    const gangnamTime = COMMUTE_TO_GANGNAM[area.city];
    if (gangnamTime) destinations.push({ name: "강남역", byTransit: gangnamTime, byCar: `${seededRange(h, 35, 60)}분` });
    destinations.push({
      name: `${area.city}역/시청`,
      byTransit: hasSubway ? `${seededRange(h+3, 10, 25)}분` : `버스 ${seededRange(h+3, 15, 35)}분`,
      byCar: `${seededRange(h+3, 8, 20)}분`,
    });
  }

  // 개발계획
  const devs: DevelopmentPlan[] = [];
  if (area.noiseScore < 65) {
    devs.push({ title: `${area.name} 주거환경개선사업`, status: "예정", expectedYear: `${2026 + (h % 3)}`, impact: "도로 정비 및 소음 저감 시설 설치" });
  }
  if (area.overallScore >= 80 && !hasSubway) {
    devs.push({ title: `${area.district} 광역교통 개선사업`, status: "진행중", expectedYear: `${2027 + (h % 2)}`, impact: "GTX·경전철 등 광역교통 접근성 강화" });
  }

  return {
    realEstate: {
      aptSale, aptJeonse,
      aptWolse: { deposit: Math.round(aptJeonse * 0.1 / 1000) * 1000, monthly: Math.round(aptJeonse * 0.003) },
      villaJeonse,
      villaWolse: { deposit: Math.round(villaJeonse * 0.08 / 500) * 500, monthly: Math.round(villaJeonse * 0.0035) },
      oneRoomWolse: { deposit: seededRange(h + 8, 300, 1000), monthly: oneRoomMonthly },
      basePyeong: 25,
      dataDate: "2025-03",
      apartments,
    },
    education: generateEducation(area),
    commute: { destinations, mainTransport, congestion },
    infra: generateInfra(area),
    developments: devs,
  };
}

export function getDeepInfo(neighborhoodId: string): DeepInfo {
  const area = getNeighborhoodById(neighborhoodId);
  if (!area) {
    return {
      realEstate: { aptJeonse: null, aptWolse: null, aptSale: null, villaJeonse: null, villaWolse: null, oneRoomWolse: null, basePyeong: 25, dataDate: "2025-03", apartments: [] },
      education: { elementary: [], middle: [], high: [], academyDensity: "중", summary: "" },
      commute: { destinations: [], mainTransport: [], congestion: "중" },
      infra: { hospital: null, clinicCount: 0, pharmacyCount: 0, mart: null, park: null, library: null },
      developments: [],
    };
  }
  return generateDeepInfo(area);
}

export function hasDeepInfo(_neighborhoodId: string): boolean {
  return true;
}
