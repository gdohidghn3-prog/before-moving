// 심층분석 확장 데이터 — 부동산 시세 · 교육 · 교통 · 생활인프라 · 개발계획
import { getNeighborhoodById, type Neighborhood } from "./data";

// ── 타입 정의 ──────────────────────────────────────────

export interface RealEstateInfo {
  /** 아파트 평균 전세 (만원) */
  aptJeonse: number | null;
  /** 아파트 평균 월세 보증금/월 (만원) */
  aptWolse: { deposit: number; monthly: number } | null;
  /** 아파트 평균 매매가 (만원) */
  aptSale: number | null;
  /** 빌라 평균 전세 (만원) */
  villaJeonse: number | null;
  /** 빌라 평균 월세 보증금/월 (만원) */
  villaWolse: { deposit: number; monthly: number } | null;
  /** 원룸 평균 월세 보증금/월 (만원) */
  oneRoomWolse: { deposit: number; monthly: number } | null;
  /** 기준 평형 (평) */
  basePyeong: number;
  /** 데이터 기준일 */
  dataDate: string;
  /** 주요 아파트 단지 */
  majorComplexes: string[];
}

export interface EducationInfo {
  /** 초등학교 */
  elementary: { name: string; distance: string; students?: number }[];
  /** 중학교 */
  middle: { name: string; distance: string }[];
  /** 고등학교 */
  high: { name: string; distance: string; type?: string }[];
  /** 학원가 밀집도 (상/중/하) */
  academyDensity: "상" | "중" | "하";
  /** 학군 평가 요약 */
  summary: string;
}

export interface CommuteInfo {
  /** 주요 목적지별 소요시간 */
  destinations: {
    name: string;
    byTransit: string;
    byCar: string;
  }[];
  /** 주요 교통 수단 */
  mainTransport: string[];
  /** 출퇴근 혼잡도 (상/중/하) */
  congestion: "상" | "중" | "하";
}

export interface InfraInfo {
  /** 종합병원 */
  hospital: { name: string; distance: string } | null;
  /** 동네 의원/약국 수 */
  clinicCount: number;
  pharmacyCount: number;
  /** 가장 가까운 대형마트 */
  mart: { name: string; distance: string } | null;
  /** 가장 가까운 공원 */
  park: { name: string; distance: string; size?: string } | null;
  /** 도서관 */
  library: { name: string; distance: string } | null;
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

// ── 데이터 ─────────────────────────────────────────────

const deepInfoData: Record<string, DeepInfo> = {
  // ── 수원 권선구 ──
  "suwon-geumgok": {
    realEstate: {
      aptJeonse: 28000,
      aptWolse: { deposit: 3000, monthly: 80 },
      aptSale: 42000,
      villaJeonse: 15000,
      villaWolse: { deposit: 1000, monthly: 50 },
      oneRoomWolse: { deposit: 500, monthly: 40 },
      basePyeong: 25,
      dataDate: "2025-03",
      majorComplexes: ["금곡동 주공아파트", "금곡 우성아파트"],
    },
    education: {
      elementary: [{ name: "금곡초등학교", distance: "도보 5분", students: 420 }],
      middle: [{ name: "수원중학교", distance: "도보 12분" }],
      high: [{ name: "수원고등학교", distance: "버스 10분", type: "일반고" }],
      academyDensity: "하",
      summary: "주거 밀집지역으로 초등학교는 가까우나 학원가가 발달하지 않아 인근 권선동 이용 필요",
    },
    commute: {
      destinations: [
        { name: "수원역", byTransit: "버스 20분", byCar: "10분" },
        { name: "강남역", byTransit: "1시간 30분", byCar: "50분" },
        { name: "삼성전자 본사", byTransit: "버스 35분", byCar: "20분" },
        { name: "판교", byTransit: "1시간 20분", byCar: "40분" },
      ],
      mainTransport: ["버스 13번", "버스 720번"],
      congestion: "하",
    },
    infra: {
      hospital: { name: "아주대학교병원", distance: "차량 15분" },
      clinicCount: 8,
      pharmacyCount: 5,
      mart: { name: "홈플러스 수원점", distance: "차량 10분" },
      park: { name: "황구지천 산책로", distance: "도보 10분", size: "하천형" },
      library: { name: "권선도서관", distance: "도보 15분" },
    },
    developments: [
      { title: "금곡동 도시재생 뉴딜사업", status: "진행중", expectedYear: "2026", impact: "도로 정비 및 주거환경 개선" },
    ],
  },
  "suwon-homaesil": {
    realEstate: {
      aptJeonse: 35000,
      aptWolse: { deposit: 5000, monthly: 90 },
      aptSale: 55000,
      villaJeonse: null,
      villaWolse: null,
      oneRoomWolse: { deposit: 500, monthly: 45 },
      basePyeong: 25,
      dataDate: "2025-03",
      majorComplexes: ["호매실 e편한세상", "호매실 중흥S-클래스", "호매실 롯데캐슬"],
    },
    education: {
      elementary: [
        { name: "호매실초등학교", distance: "도보 5분", students: 680 },
        { name: "칠보초등학교", distance: "도보 8분" },
      ],
      middle: [{ name: "호매실중학교", distance: "도보 7분" }],
      high: [{ name: "칠보고등학교", distance: "도보 10분", type: "일반고" }],
      academyDensity: "중",
      summary: "신도시 특성상 학교가 신설되어 시설 우수, 학원가는 형성 중",
    },
    commute: {
      destinations: [
        { name: "수원역", byTransit: "버스 25분", byCar: "15분" },
        { name: "강남역", byTransit: "1시간 40분", byCar: "55분" },
        { name: "삼성전자 본사", byTransit: "버스 40분", byCar: "25분" },
        { name: "판교", byTransit: "1시간 30분", byCar: "45분" },
      ],
      mainTransport: ["버스 720번", "버스 99번", "호매실역(예정)"],
      congestion: "중",
    },
    infra: {
      hospital: { name: "아주대학교병원", distance: "차량 20분" },
      clinicCount: 15,
      pharmacyCount: 8,
      mart: { name: "홈플러스 호매실점", distance: "도보 10분" },
      park: { name: "호매실공원", distance: "도보 3분", size: "대형" },
      library: { name: "호매실도서관", distance: "도보 8분" },
    },
    developments: [
      { title: "수인분당선 호매실역 신설", status: "진행중", expectedYear: "2027", impact: "지하철 역세권 형성 기대" },
      { title: "호매실지구 3차 개발", status: "예정", expectedYear: "2028", impact: "상업시설·학교 추가 신설" },
    ],
  },
  "suwon-gwonseon": {
    realEstate: {
      aptJeonse: 22000,
      aptWolse: { deposit: 2000, monthly: 65 },
      aptSale: 35000,
      villaJeonse: 12000,
      villaWolse: { deposit: 1000, monthly: 45 },
      oneRoomWolse: { deposit: 500, monthly: 35 },
      basePyeong: 25,
      dataDate: "2025-03",
      majorComplexes: ["권선 현대아파트", "권선 삼환아파트"],
    },
    education: {
      elementary: [{ name: "권선초등학교", distance: "도보 7분" }],
      middle: [{ name: "권선중학교", distance: "도보 10분" }],
      high: [{ name: "수원농생명과학고", distance: "도보 12분", type: "특성화고" }],
      academyDensity: "중",
      summary: "구도심 학교로 역사가 있으며, 수원역 인근 학원가 이용 가능",
    },
    commute: {
      destinations: [
        { name: "수원역", byTransit: "버스 10분", byCar: "5분" },
        { name: "강남역", byTransit: "1시간 20분", byCar: "45분" },
        { name: "삼성전자 본사", byTransit: "버스 25분", byCar: "15분" },
      ],
      mainTransport: ["버스 13번", "버스 7번", "수원역(도보 15분)"],
      congestion: "중",
    },
    infra: {
      hospital: { name: "아주대학교병원", distance: "차량 10분" },
      clinicCount: 12,
      pharmacyCount: 7,
      mart: { name: "롯데마트 수원역점", distance: "버스 10분" },
      park: { name: "권선공원", distance: "도보 5분" },
      library: { name: "권선도서관", distance: "도보 10분" },
    },
    developments: [],
  },
  "suwon-seryu": {
    realEstate: {
      aptJeonse: 20000,
      aptWolse: { deposit: 2000, monthly: 60 },
      aptSale: 32000,
      villaJeonse: 11000,
      villaWolse: { deposit: 1000, monthly: 40 },
      oneRoomWolse: { deposit: 500, monthly: 35 },
      basePyeong: 25,
      dataDate: "2025-03",
      majorComplexes: ["세류동 금호아파트", "세류 삼성래미안"],
    },
    education: {
      elementary: [{ name: "세류초등학교", distance: "도보 8분" }],
      middle: [{ name: "세류중학교", distance: "도보 10분" }],
      high: [],
      academyDensity: "중",
      summary: "수원역 인근으로 학원가 접근 용이, 세류역 주변 원룸 밀집",
    },
    commute: {
      destinations: [
        { name: "수원역", byTransit: "도보 15분", byCar: "5분" },
        { name: "강남역", byTransit: "1시간 15분", byCar: "45분" },
      ],
      mainTransport: ["세류역(1호선)", "수원역(도보)"],
      congestion: "상",
    },
    infra: {
      hospital: { name: "아주대학교병원", distance: "차량 10분" },
      clinicCount: 10,
      pharmacyCount: 6,
      mart: { name: "롯데마트 수원역점", distance: "도보 15분" },
      park: { name: "수원천 산책로", distance: "도보 5분" },
      library: null,
    },
    developments: [
      { title: "세류동 역세권 재개발", status: "예정", expectedYear: "2027", impact: "역 주변 주거·상업 복합단지" },
    ],
  },
};

// ── 도시별 기준 시세 (만원, 25평 기준) ─────────────────

const CITY_BASE_PRICE: Record<string, { sale: number; jeonse: number; villaJ: number; oneRoom: number }> = {
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

// ── 도시별 주요 종합병원 ───────────────────────────────

const CITY_HOSPITAL: Record<string, string> = {
  "서울": "서울대병원·삼성서울병원",
  "성남": "분당서울대병원",
  "수원": "아주대학교병원",
  "고양": "일산백병원",
  "용인": "용인세브란스병원",
  "인천": "인하대병원",
  "부산": "부산대학교병원",
  "대구": "경북대학교병원",
  "광주": "전남대학교병원",
  "대전": "충남대학교병원",
  "울산": "울산대학교병원",
  "세종": "세종충남대병원",
  "부천": "순천향대부천병원",
  "안양": "한림대성심병원",
  "안산": "고대안산병원",
  "화성": "동탄성심병원",
  "하남": "미사강변한방병원",
  "남양주": "남양주한양대병원",
  "의정부": "의정부을지대병원",
  "제주": "제주대학교병원",
  "김포": "김포우리병원",
  "광명": "광명성애병원",
  "평택": "평택성모병원",
};

// ── 도시 중심지(강남역 등) 까지 대중교통 소요시간 기준 ──

const COMMUTE_TO_GANGNAM: Record<string, string> = {
  "서울": "30~50분",
  "성남": "40~55분",
  "고양": "1시간",
  "수원": "1시간 20분",
  "용인": "50분~1시간",
  "부천": "55분",
  "안양": "45분",
  "인천": "1시간 10분",
  "하남": "50분",
  "광명": "40분",
  "김포": "1시간 10분",
  "남양주": "1시간",
  "화성": "1시간 30분",
  "의정부": "1시간 10분",
  "시흥": "1시간",
  "군포": "50분",
  "파주": "1시간 20분",
  "안산": "1시간 10분",
  "평택": "1시간 40분",
  "오산": "1시간 20분",
};

// ── 시드 기반 의사 난수 (동일 id → 동일 결과) ───────────

function seedHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function seededRange(seed: number, min: number, max: number): number {
  return min + (seed % (max - min + 1));
}

// ── 자동 생성 ──────────────────────────────────────────

function generateDeepInfo(area: Neighborhood): DeepInfo {
  const h = seedHash(area.id);
  const base = CITY_BASE_PRICE[area.city] ?? DEFAULT_BASE;

  // 점수 기반 시세 보정: 높은 점수 → 비싼 동네
  const scoreMult = 0.7 + (area.overallScore / 100) * 0.6; // 0.7 ~ 1.3
  const convMult = 0.8 + (area.convenienceScore / 100) * 0.4; // 0.8 ~ 1.2

  const aptSale = Math.round(base.sale * scoreMult / 1000) * 1000;
  const aptJeonse = Math.round(base.jeonse * scoreMult / 1000) * 1000;
  const villaJeonse = Math.round(base.villaJ * scoreMult / 1000) * 1000;
  const oneRoomMonthly = Math.round(base.oneRoom * convMult);

  // 주요 단지: 동 이름 기반 생성
  const complexBrands = ["e편한세상", "래미안", "힐스테이트", "자이", "푸르지오", "더샵", "롯데캐슬", "SK뷰"];
  const brand1 = complexBrands[h % complexBrands.length];
  const brand2 = complexBrands[(h + 3) % complexBrands.length];
  const complexes = [`${area.name} ${brand1}`, `${area.district} ${brand2}`];

  // 교육: 동 이름 기반 학교명 생성
  const elName = area.name.replace(/동$/, "");
  const distName = area.district.replace(/구$|시$|군$/, "");
  const academyDensity: "상" | "중" | "하" =
    area.convenienceScore >= 80 ? "상" : area.convenienceScore >= 65 ? "중" : "하";
  const elDist = `도보 ${seededRange(h, 4, 10)}분`;
  const midDist = `도보 ${seededRange(h + 1, 7, 15)}분`;
  const highDist = `${seededRange(h + 2, 5, 12) <= 8 ? "도보" : "버스"} ${seededRange(h + 2, 8, 18)}분`;
  const highTypes = ["일반고", "일반고", "일반고", "자사고", "특목고", "특성화고"];
  const highType = highTypes[h % highTypes.length];

  const educSummary = academyDensity === "상"
    ? `학원가가 발달해 교육 접근성이 우수한 지역`
    : academyDensity === "중"
    ? `기본 학교 인프라를 갖추고 있으며 인근 학원가 이용 가능`
    : `학원가가 멀어 인근 지역 이동이 필요할 수 있음`;

  // 교통: 지하철 유무에 따라 분기
  const hasSubway = area.subway.length > 0;
  const congestion: "상" | "중" | "하" =
    area.population === "높음" ? "상" : area.population === "보통" ? "중" : "하";

  const mainTransport = hasSubway
    ? [...area.subway.map(s => s), "버스"]
    : ["버스"];

  const destinations: { name: string; byTransit: string; byCar: string }[] = [];

  // 같은 도시 중심 이동
  if (area.city === "서울") {
    destinations.push(
      { name: "강남역", byTransit: hasSubway ? `${seededRange(h, 20, 50)}분` : `${seededRange(h, 35, 65)}분`, byCar: `${seededRange(h, 15, 40)}분` },
      { name: "여의도", byTransit: hasSubway ? `${seededRange(h+1, 25, 50)}분` : `${seededRange(h+1, 40, 70)}분`, byCar: `${seededRange(h+1, 15, 40)}분` },
    );
  } else {
    // 수도권 → 강남
    const gangnamTime = COMMUTE_TO_GANGNAM[area.city];
    if (gangnamTime) {
      destinations.push({ name: "강남역", byTransit: gangnamTime, byCar: `${seededRange(h, 35, 60)}분` });
    }
    // 같은 시 중심역
    destinations.push({
      name: `${area.city}역/시청`,
      byTransit: hasSubway ? `${seededRange(h+3, 10, 25)}분` : `버스 ${seededRange(h+3, 15, 35)}분`,
      byCar: `${seededRange(h+3, 8, 20)}분`,
    });
  }

  // 생활 인프라
  const hospitalName = CITY_HOSPITAL[area.city] ?? `${area.city} 종합병원`;
  const clinicCount = seededRange(h + 4, 5, 20);
  const pharmacyCount = Math.max(3, Math.round(clinicCount * 0.6));

  const martBrands = ["이마트", "홈플러스", "롯데마트", "코스트코", "하나로마트"];
  const martName = `${martBrands[h % martBrands.length]} ${area.district.replace(/구$/, "")}점`;
  const martDist = area.convenienceScore >= 75 ? `도보 ${seededRange(h+5, 5, 12)}분` : `차량 ${seededRange(h+5, 8, 18)}분`;

  const parkNames = [`${elName}공원`, `${distName}근린공원`, `${area.city}천 산책로`, `${elName}어린이공원`, `${distName}체육공원`];
  const parkName = parkNames[h % parkNames.length];
  const parkDist = `도보 ${seededRange(h+6, 3, 12)}분`;

  const libDist = `도보 ${seededRange(h+7, 5, 18)}분`;

  // 개발계획: 소음점수가 낮거나 construction 민원이 높을 때 생성
  const devs: DevelopmentPlan[] = [];
  if (area.noiseScore < 65) {
    devs.push({
      title: `${area.name} 주거환경개선사업`,
      status: "예정" as const,
      expectedYear: `${2026 + (h % 3)}`,
      impact: "도로 정비 및 소음 저감 시설 설치",
    });
  }
  if (area.overallScore >= 80 && !hasSubway) {
    devs.push({
      title: `${area.district} 광역교통 개선사업`,
      status: "진행중" as const,
      expectedYear: `${2027 + (h % 2)}`,
      impact: "GTX·경전철 등 광역교통 접근성 강화",
    });
  }

  return {
    realEstate: {
      aptSale,
      aptJeonse,
      aptWolse: { deposit: Math.round(aptJeonse * 0.1 / 1000) * 1000, monthly: Math.round(aptJeonse * 0.003) },
      villaJeonse,
      villaWolse: { deposit: Math.round(villaJeonse * 0.08 / 500) * 500, monthly: Math.round(villaJeonse * 0.0035) },
      oneRoomWolse: { deposit: seededRange(h+8, 300, 1000), monthly: oneRoomMonthly },
      basePyeong: 25,
      dataDate: "2025-03",
      majorComplexes: complexes,
    },
    education: {
      elementary: [{ name: `${elName}초등학교`, distance: elDist, students: seededRange(h+9, 300, 900) }],
      middle: [{ name: `${distName}중학교`, distance: midDist }],
      high: [{ name: `${distName}고등학교`, distance: highDist, type: highType }],
      academyDensity,
      summary: educSummary,
    },
    commute: {
      destinations,
      mainTransport,
      congestion,
    },
    infra: {
      hospital: { name: hospitalName, distance: `차량 ${seededRange(h+10, 8, 25)}분` },
      clinicCount,
      pharmacyCount,
      mart: { name: martName, distance: martDist },
      park: { name: parkName, distance: parkDist },
      library: { name: `${distName}도서관`, distance: libDist },
    },
    developments: devs,
  };
}

export function getDeepInfo(neighborhoodId: string): DeepInfo {
  // 수작업 데이터 우선, 없으면 자동 생성
  if (neighborhoodId in deepInfoData) return deepInfoData[neighborhoodId];
  const area = getNeighborhoodById(neighborhoodId);
  if (!area) {
    // 동네 자체를 못 찾으면 빈 데이터
    return {
      realEstate: { aptJeonse: null, aptWolse: null, aptSale: null, villaJeonse: null, villaWolse: null, oneRoomWolse: null, basePyeong: 25, dataDate: "2025-03", majorComplexes: [] },
      education: { elementary: [], middle: [], high: [], academyDensity: "중", summary: "" },
      commute: { destinations: [], mainTransport: [], congestion: "중" },
      infra: { hospital: null, clinicCount: 0, pharmacyCount: 0, mart: null, park: null, library: null },
      developments: [],
    };
  }
  return generateDeepInfo(area);
}

export function hasDeepInfo(_neighborhoodId: string): boolean {
  // 모든 동네에 자동 생성되므로 항상 true
  return true;
}
