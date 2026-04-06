// ============================================================
// "이사전에" 서비스 - 동 단위 데이터 + 유틸 함수
// JSON 기반 (Supabase 없이 동작)
// ============================================================

// ─── 타입 정의 ────────────────────────────────────────────────

export interface Neighborhood {
  id: string;
  name: string;            // 동 이름
  district: string;        // 구 이름
  city: string;            // "서울" 등
  lat: number;
  lng: number;
  noiseScore: number;      // 0~100 (높을수록 조용)
  safetyScore: number;     // 0~100
  convenienceScore: number;// 0~100
  overallScore: number;    // 0~100
  population: string;      // "높음" | "보통" | "낮음"
  subway: string[];        // 가까운 지하철역
  highlights: string[];    // 특징 태그
}

export interface Complaint {
  neighborhoodId: string;
  category: string;  // 'noise' | 'parking' | 'trash' | 'road' | 'construction' | 'other'
  count: number;
  year: number;
  month: number;
}

export interface NoisePoint {
  id: string;
  lat: number;
  lng: number;
  level: number;  // 1~5
  type: string;   // 'construction' | 'traffic' | 'nightlife' | 'factory' | 'other'
  description: string;
}

export interface AreaReview {
  id: string;
  neighborhoodId: string;
  rating: number;   // 1~5
  pros: string;
  cons: string;
  livedYears: string;  // "1년 미만" | "1~3년" | "3~5년" | "5년 이상"
  createdAt: string;
}

// ─── 동 데이터 (60개 + α) ─────────────────────────────────────

export const neighborhoods: Neighborhood[] = [
  // ── 강남구 ──
  {
    id: "gangnam-yeoksam",
    name: "역삼동",
    district: "강남구",
    city: "서울",
    lat: 37.5007,
    lng: 127.0365,
    noiseScore: 55,
    safetyScore: 75,
    convenienceScore: 95,
    overallScore: 75,
    population: "높음",
    subway: ["역삼역", "강남역"],
    highlights: ["IT기업 밀집", "카페 거리", "야간 유동인구 많음", "학원가", "오피스 밀집"],
  },
  {
    id: "gangnam-samsung",
    name: "삼성동",
    district: "강남구",
    city: "서울",
    lat: 37.5088,
    lng: 127.0631,
    noiseScore: 58,
    safetyScore: 80,
    convenienceScore: 92,
    overallScore: 77,
    population: "높음",
    subway: ["삼성역", "봉은사역"],
    highlights: ["코엑스", "무역센터", "대기업 본사", "컨벤션", "고급 주거지"],
  },
  {
    id: "gangnam-daechi",
    name: "대치동",
    district: "강남구",
    city: "서울",
    lat: 37.4946,
    lng: 127.0626,
    noiseScore: 68,
    safetyScore: 85,
    convenienceScore: 90,
    overallScore: 81,
    population: "높음",
    subway: ["대치역", "한티역", "도곡역"],
    highlights: ["학원가 중심", "교육 특구", "아파트 밀집", "학부모 커뮤니티"],
  },
  {
    id: "gangnam-nonhyeon",
    name: "논현동",
    district: "강남구",
    city: "서울",
    lat: 37.5116,
    lng: 127.0284,
    noiseScore: 48,
    safetyScore: 70,
    convenienceScore: 93,
    overallScore: 70,
    population: "높음",
    subway: ["논현역", "신논현역"],
    highlights: ["가로수길", "유흥가", "맛집 밀집", "심야 영업 많음", "패션 거리"],
  },

  // ── 서초구 ──
  {
    id: "seocho-seocho",
    name: "서초동",
    district: "서초구",
    city: "서울",
    lat: 37.4920,
    lng: 127.0155,
    noiseScore: 62,
    safetyScore: 82,
    convenienceScore: 91,
    overallScore: 78,
    population: "높음",
    subway: ["서초역", "교대역"],
    highlights: ["법원·검찰청", "법조타운", "예술의전당 인근", "교육 환경 우수"],
  },
  {
    id: "seocho-banpo",
    name: "반포동",
    district: "서초구",
    city: "서울",
    lat: 37.5082,
    lng: 126.9910,
    noiseScore: 72,
    safetyScore: 88,
    convenienceScore: 85,
    overallScore: 82,
    population: "보통",
    subway: ["고속터미널역", "반포역"],
    highlights: ["한강 접근성", "반포 아파트", "고급 주거지", "세빛섬 인근"],
  },
  {
    id: "seocho-bangbae",
    name: "방배동",
    district: "서초구",
    city: "서울",
    lat: 37.4812,
    lng: 126.9886,
    noiseScore: 75,
    safetyScore: 84,
    convenienceScore: 78,
    overallScore: 79,
    population: "보통",
    subway: ["방배역", "사당역"],
    highlights: ["조용한 주거지", "카페 골목", "예술인 거주", "서래마을 인근"],
  },

  // ── 마포구 ──
  {
    id: "mapo-hapjeong",
    name: "합정동",
    district: "마포구",
    city: "서울",
    lat: 37.5496,
    lng: 126.9139,
    noiseScore: 60,
    safetyScore: 78,
    convenienceScore: 88,
    overallScore: 75,
    population: "높음",
    subway: ["합정역"],
    highlights: ["카페 밀집", "젊은 층 선호", "출판사 밀집", "한강 접근성"],
  },
  {
    id: "mapo-mangwon",
    name: "망원동",
    district: "마포구",
    city: "서울",
    lat: 37.5563,
    lng: 126.9098,
    noiseScore: 62,
    safetyScore: 77,
    convenienceScore: 86,
    overallScore: 75,
    population: "높음",
    subway: ["망원역", "합정역"],
    highlights: ["망원시장", "한강공원 가까움", "맛집 골목", "SNS 핫플"],
  },
  {
    id: "mapo-yeonnam",
    name: "연남동",
    district: "마포구",
    city: "서울",
    lat: 37.5660,
    lng: 126.9246,
    noiseScore: 55,
    safetyScore: 75,
    convenienceScore: 87,
    overallScore: 72,
    population: "높음",
    subway: ["홍대입구역"],
    highlights: ["연트럴파크", "카페 거리", "외국인 많음", "주말 혼잡", "독립서점"],
  },
  {
    id: "mapo-sangsu",
    name: "상수동",
    district: "마포구",
    city: "서울",
    lat: 37.5477,
    lng: 126.9236,
    noiseScore: 56,
    safetyScore: 76,
    convenienceScore: 85,
    overallScore: 72,
    population: "높음",
    subway: ["상수역"],
    highlights: ["갤러리 거리", "디자인 스튜디오", "젊은 문화", "소규모 공방"],
  },

  // ── 송파구 ──
  {
    id: "songpa-jamsil",
    name: "잠실동",
    district: "송파구",
    city: "서울",
    lat: 37.5133,
    lng: 127.1001,
    noiseScore: 60,
    safetyScore: 82,
    convenienceScore: 92,
    overallScore: 78,
    population: "높음",
    subway: ["잠실역", "잠실새내역"],
    highlights: ["롯데월드", "석촌호수", "올림픽공원 인근", "대단지 아파트"],
  },
  {
    id: "songpa-garak",
    name: "가락동",
    district: "송파구",
    city: "서울",
    lat: 37.4961,
    lng: 127.1180,
    noiseScore: 65,
    safetyScore: 80,
    convenienceScore: 82,
    overallScore: 76,
    population: "보통",
    subway: ["가락시장역", "수서역"],
    highlights: ["가락시장", "재건축 진행 중", "SRT 수서역 인근"],
  },
  {
    id: "songpa-munjeong",
    name: "문정동",
    district: "송파구",
    city: "서울",
    lat: 37.4857,
    lng: 127.1225,
    noiseScore: 68,
    safetyScore: 83,
    convenienceScore: 80,
    overallScore: 77,
    population: "보통",
    subway: ["문정역", "장지역"],
    highlights: ["법조단지", "문정법조타운", "가든파이브", "신축 아파트"],
  },
  {
    id: "songpa-wirye",
    name: "위례동",
    district: "송파구",
    city: "서울",
    lat: 37.4785,
    lng: 127.1420,
    noiseScore: 76,
    safetyScore: 86,
    convenienceScore: 75,
    overallScore: 79,
    population: "보통",
    subway: ["위례역(예정)", "복정역"],
    highlights: ["위례신도시", "신축 아파트", "공원 많음", "트램 예정", "교육 환경 좋음"],
  },

  // ── 동대문구 ──
  {
    id: "dongdaemun-hwigyeong",
    name: "휘경동",
    district: "동대문구",
    city: "서울",
    lat: 37.5890,
    lng: 127.0580,
    noiseScore: 70,
    safetyScore: 77,
    convenienceScore: 72,
    overallScore: 73,
    population: "보통",
    subway: ["휘경역", "외대앞역"],
    highlights: ["한국외대 인근", "경의중앙선", "배봉산 산책로", "주거 위주"],
  },
  {
    id: "dongdaemun-hoegi",
    name: "회기동",
    district: "동대문구",
    city: "서울",
    lat: 37.5894,
    lng: 127.0517,
    noiseScore: 62,
    safetyScore: 74,
    convenienceScore: 75,
    overallScore: 70,
    population: "높음",
    subway: ["회기역", "외대앞역"],
    highlights: ["경희대 인근", "대학가", "경의중앙선·1호선", "회기시장"],
  },
  {
    id: "dongdaemun-jangan",
    name: "장안동",
    district: "동대문구",
    city: "서울",
    lat: 37.5710,
    lng: 127.0680,
    noiseScore: 66,
    safetyScore: 75,
    convenienceScore: 74,
    overallScore: 72,
    population: "보통",
    subway: ["장한평역"],
    highlights: ["중고차 매매단지", "5호선 이용", "답십리 인근", "주거 중심"],
  },
  {
    id: "dongdaemun-jeonnong",
    name: "전농동",
    district: "동대문구",
    city: "서울",
    lat: 37.5770,
    lng: 127.0570,
    noiseScore: 68,
    safetyScore: 76,
    convenienceScore: 73,
    overallScore: 72,
    population: "보통",
    subway: ["청량리역", "전농역"],
    highlights: ["서울시립대 인근", "청량리역 환승", "배봉산 인근", "주거 밀집"],
  },

  // ── 영등포구 ──
  {
    id: "yeongdeungpo-yeouido",
    name: "여의도동",
    district: "영등포구",
    city: "서울",
    lat: 37.5219,
    lng: 126.9245,
    noiseScore: 60,
    safetyScore: 85,
    convenienceScore: 90,
    overallScore: 78,
    population: "보통",
    subway: ["여의도역", "여의나루역", "국회의사당역"],
    highlights: ["금융 중심지", "한강공원", "여의도공원", "국회의사당", "IFC몰"],
  },
  {
    id: "yeongdeungpo-dangsan",
    name: "당산동",
    district: "영등포구",
    city: "서울",
    lat: 37.5339,
    lng: 126.9025,
    noiseScore: 62,
    safetyScore: 76,
    convenienceScore: 83,
    overallScore: 74,
    population: "높음",
    subway: ["당산역"],
    highlights: ["교통 요지", "2·9호선 환승", "직장인 거주지", "먹자골목"],
  },
  {
    id: "yeongdeungpo-yeongdeungpo",
    name: "영등포동",
    district: "영등포구",
    city: "서울",
    lat: 37.5157,
    lng: 126.9077,
    noiseScore: 50,
    safetyScore: 65,
    convenienceScore: 80,
    overallScore: 65,
    population: "높음",
    subway: ["영등포역", "영등포시장역"],
    highlights: ["영등포시장", "타임스퀘어", "유동인구 많음", "구도심"],
  },

  // ── 용산구 ──
  {
    id: "yongsan-itaewon",
    name: "이태원동",
    district: "용산구",
    city: "서울",
    lat: 37.5345,
    lng: 126.9946,
    noiseScore: 40,
    safetyScore: 65,
    convenienceScore: 85,
    overallScore: 63,
    population: "높음",
    subway: ["이태원역"],
    highlights: ["외국인 밀집", "클럽·바 밀집", "다문화 거리", "야간 소음 주의", "세계 음식"],
  },
  {
    id: "yongsan-hannam",
    name: "한남동",
    district: "용산구",
    city: "서울",
    lat: 37.5340,
    lng: 127.0050,
    noiseScore: 65,
    safetyScore: 80,
    convenienceScore: 82,
    overallScore: 76,
    population: "보통",
    subway: ["한남역", "이태원역"],
    highlights: ["블루스퀘어", "갤러리 밀집", "고급 주거지", "한강 접근성"],
  },
  {
    id: "yongsan-yongsan",
    name: "용산동",
    district: "용산구",
    city: "서울",
    lat: 37.5300,
    lng: 126.9810,
    noiseScore: 55,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 68,
    population: "보통",
    subway: ["용산역", "삼각지역"],
    highlights: ["용산역 KTX", "국립중앙박물관", "재개발 예정", "전자상가"],
  },

  // ── 성동구 ──
  {
    id: "seongdong-seongsu",
    name: "성수동",
    district: "성동구",
    city: "서울",
    lat: 37.5445,
    lng: 127.0563,
    noiseScore: 55,
    safetyScore: 75,
    convenienceScore: 87,
    overallScore: 72,
    population: "높음",
    subway: ["성수역", "뚝섬역"],
    highlights: ["성수 카페거리", "수제화 골목", "힙스터 핫플", "소셜벤처 밀집", "갤러리"],
  },
  {
    id: "seongdong-wangsimni",
    name: "왕십리동",
    district: "성동구",
    city: "서울",
    lat: 37.5614,
    lng: 127.0370,
    noiseScore: 58,
    safetyScore: 74,
    convenienceScore: 82,
    overallScore: 71,
    population: "높음",
    subway: ["왕십리역"],
    highlights: ["비트플렉스", "교통 허브", "한양대 인근", "재개발 완료 지역"],
  },
  {
    id: "seongdong-oksu",
    name: "옥수동",
    district: "성동구",
    city: "서울",
    lat: 37.5412,
    lng: 127.0170,
    noiseScore: 72,
    safetyScore: 82,
    convenienceScore: 73,
    overallScore: 76,
    population: "보통",
    subway: ["옥수역"],
    highlights: ["한강 조망", "조용한 주거지", "옥수 한강공원", "재건축 추진"],
  },

  // ── 관악구 ──
  {
    id: "gwanak-sillim",
    name: "신림동",
    district: "관악구",
    city: "서울",
    lat: 37.4842,
    lng: 126.9299,
    noiseScore: 50,
    safetyScore: 62,
    convenienceScore: 75,
    overallScore: 62,
    population: "높음",
    subway: ["신림역", "서울대입구역"],
    highlights: ["고시촌", "서울대 인근", "1인 가구 많음", "저렴한 월세", "먹자골목"],
  },
  {
    id: "gwanak-bongcheon",
    name: "봉천동",
    district: "관악구",
    city: "서울",
    lat: 37.4782,
    lng: 126.9517,
    noiseScore: 55,
    safetyScore: 65,
    convenienceScore: 73,
    overallScore: 64,
    population: "높음",
    subway: ["봉천역", "서울대입구역"],
    highlights: ["관악산 등산로", "대학가", "원룸 밀집", "저렴한 물가"],
  },

  // ── 노원구 ──
  {
    id: "nowon-sanggye",
    name: "상계동",
    district: "노원구",
    city: "서울",
    lat: 37.6571,
    lng: 127.0717,
    noiseScore: 80,
    safetyScore: 82,
    convenienceScore: 65,
    overallScore: 76,
    population: "높음",
    subway: ["상계역", "노원역"],
    highlights: ["주거 위주", "대단지 아파트", "수락산 인근", "조용한 동네", "학교 밀집"],
  },
  {
    id: "nowon-junggye",
    name: "중계동",
    district: "노원구",
    city: "서울",
    lat: 37.6475,
    lng: 127.0745,
    noiseScore: 78,
    safetyScore: 83,
    convenienceScore: 68,
    overallScore: 76,
    population: "높음",
    subway: ["중계역", "하계역"],
    highlights: ["은행사거리 학원가", "불암산 등산로", "아파트 밀집", "교육열 높음"],
  },
  {
    id: "nowon-hagye",
    name: "하계동",
    district: "노원구",
    city: "서울",
    lat: 37.6388,
    lng: 127.0666,
    noiseScore: 77,
    safetyScore: 81,
    convenienceScore: 67,
    overallScore: 75,
    population: "보통",
    subway: ["하계역"],
    highlights: ["서울과학기술대", "주거 중심", "공원 많음", "중랑천 산책로"],
  },

  // ── 은평구 ──
  {
    id: "eunpyeong-eungam",
    name: "응암동",
    district: "은평구",
    city: "서울",
    lat: 37.5985,
    lng: 126.9210,
    noiseScore: 72,
    safetyScore: 78,
    convenienceScore: 70,
    overallScore: 73,
    population: "보통",
    subway: ["응암역", "역촌역"],
    highlights: ["주거 중심", "은평한옥마을 인근", "저렴한 전세", "재래시장"],
  },
  {
    id: "eunpyeong-bulgwang",
    name: "불광동",
    district: "은평구",
    city: "서울",
    lat: 37.6095,
    lng: 126.9290,
    noiseScore: 70,
    safetyScore: 77,
    convenienceScore: 72,
    overallScore: 73,
    population: "보통",
    subway: ["불광역"],
    highlights: ["북한산 접근성", "6호선 이용", "연신내 인근", "주거 밀집"],
  },
  {
    id: "eunpyeong-nokbeon",
    name: "녹번동",
    district: "은평구",
    city: "서울",
    lat: 37.6098,
    lng: 126.9369,
    noiseScore: 73,
    safetyScore: 79,
    convenienceScore: 69,
    overallScore: 74,
    population: "보통",
    subway: ["녹번역"],
    highlights: ["북한산 등산 기점", "조용한 주거지", "3호선 이용", "은평뉴타운 인근"],
  },

  // ── 강서구 ──
  {
    id: "gangseo-hwagok",
    name: "화곡동",
    district: "강서구",
    city: "서울",
    lat: 37.5415,
    lng: 126.8395,
    noiseScore: 65,
    safetyScore: 74,
    convenienceScore: 75,
    overallScore: 71,
    population: "높음",
    subway: ["화곡역", "까치산역"],
    highlights: ["5호선 이용", "김포공항 접근", "저렴한 주거비", "먹자골목"],
  },
  {
    id: "gangseo-magok",
    name: "마곡동",
    district: "강서구",
    city: "서울",
    lat: 37.5611,
    lng: 126.8267,
    noiseScore: 78,
    safetyScore: 86,
    convenienceScore: 80,
    overallScore: 81,
    population: "보통",
    subway: ["마곡역", "마곡나루역"],
    highlights: ["마곡 R&D 단지", "신축 아파트", "서울식물원", "김포공항 인근", "쾌적한 환경"],
  },
  {
    id: "gangseo-deungchon",
    name: "등촌동",
    district: "강서구",
    city: "서울",
    lat: 37.5508,
    lng: 126.8553,
    noiseScore: 68,
    safetyScore: 77,
    convenienceScore: 74,
    overallScore: 73,
    population: "보통",
    subway: ["등촌역"],
    highlights: ["주거 중심", "가양역 인근", "이마트 등 대형마트", "한강 접근 가능"],
  },

  // ── 구로구 ──
  {
    id: "guro-guro",
    name: "구로동",
    district: "구로구",
    city: "서울",
    lat: 37.4942,
    lng: 126.8847,
    noiseScore: 55,
    safetyScore: 68,
    convenienceScore: 77,
    overallScore: 67,
    population: "높음",
    subway: ["구로역", "구로디지털단지역"],
    highlights: ["G밸리", "디지털단지", "직장인 밀집", "다문화 거리"],
  },
  {
    id: "guro-gocheok",
    name: "고척동",
    district: "구로구",
    city: "서울",
    lat: 37.5019,
    lng: 126.8621,
    noiseScore: 67,
    safetyScore: 75,
    convenienceScore: 70,
    overallScore: 71,
    population: "보통",
    subway: ["개봉역"],
    highlights: ["고척돔", "주거 위주", "안양천 산책로", "조용한 편"],
  },
  {
    id: "guro-sindorim",
    name: "신도림동",
    district: "구로구",
    city: "서울",
    lat: 37.5090,
    lng: 126.8912,
    noiseScore: 52,
    safetyScore: 72,
    convenienceScore: 83,
    overallScore: 69,
    population: "높음",
    subway: ["신도림역"],
    highlights: ["디큐브시티", "1·2호선 환승", "교통 요지", "유동인구 많음"],
  },

  // ── 동작구 ──
  {
    id: "dongjak-sadang",
    name: "사당동",
    district: "동작구",
    city: "서울",
    lat: 37.4767,
    lng: 126.9816,
    noiseScore: 58,
    safetyScore: 74,
    convenienceScore: 82,
    overallScore: 71,
    population: "높음",
    subway: ["사당역", "이수역"],
    highlights: ["2·4호선 환승", "교통 중심지", "먹자골목", "학원가"],
  },
  {
    id: "dongjak-noryangjin",
    name: "노량진동",
    district: "동작구",
    city: "서울",
    lat: 37.5133,
    lng: 126.9427,
    noiseScore: 55,
    safetyScore: 70,
    convenienceScore: 76,
    overallScore: 67,
    population: "높음",
    subway: ["노량진역"],
    highlights: ["수산시장", "고시촌", "1인 가구 밀집", "한강 접근성"],
  },
  {
    id: "dongjak-heukseok",
    name: "흑석동",
    district: "동작구",
    city: "서울",
    lat: 37.5073,
    lng: 126.9625,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 68,
    overallScore: 72,
    population: "보통",
    subway: ["흑석역"],
    highlights: ["중앙대 인근", "한강 조망", "재개발 완료", "조용한 편"],
  },

  // ── 광진구 ──
  {
    id: "gwangjin-gunja",
    name: "건대입구",
    district: "광진구",
    city: "서울",
    lat: 37.5407,
    lng: 127.0700,
    noiseScore: 45,
    safetyScore: 68,
    convenienceScore: 90,
    overallScore: 68,
    population: "높음",
    subway: ["건대입구역"],
    highlights: ["건국대 인근", "먹자골목", "유흥가", "커먼그라운드", "야간 유동인구"],
  },
  {
    id: "gwangjin-jayang",
    name: "자양동",
    district: "광진구",
    city: "서울",
    lat: 37.5346,
    lng: 127.0720,
    noiseScore: 55,
    safetyScore: 73,
    convenienceScore: 80,
    overallScore: 69,
    population: "높음",
    subway: ["건대입구역", "구의역"],
    highlights: ["스타시티", "뚝섬유원지 인근", "중국 음식거리", "한강 접근"],
  },
  {
    id: "gwangjin-guui",
    name: "구의동",
    district: "광진구",
    city: "서울",
    lat: 37.5430,
    lng: 127.0858,
    noiseScore: 63,
    safetyScore: 76,
    convenienceScore: 75,
    overallScore: 71,
    population: "보통",
    subway: ["구의역", "강변역"],
    highlights: ["테크노마트", "한강 산책", "광진구청 인근", "주거 혼합"],
  },

  // ── 중구 ──
  {
    id: "junggu-myeongdong",
    name: "명동",
    district: "중구",
    city: "서울",
    lat: 37.5636,
    lng: 126.9827,
    noiseScore: 30,
    safetyScore: 72,
    convenienceScore: 95,
    overallScore: 66,
    population: "높음",
    subway: ["명동역", "을지로입구역"],
    highlights: ["관광 특구", "쇼핑 중심", "외국인 관광객", "백화점 밀집", "유동인구 최다"],
  },
  {
    id: "junggu-chungmuro",
    name: "충무로",
    district: "중구",
    city: "서울",
    lat: 37.5613,
    lng: 126.9949,
    noiseScore: 52,
    safetyScore: 74,
    convenienceScore: 82,
    overallScore: 69,
    population: "보통",
    subway: ["충무로역", "동국대입구역"],
    highlights: ["인쇄 골목", "동국대 인근", "3·4호선 환승", "도심 접근성"],
  },
  {
    id: "junggu-euljiro",
    name: "을지로동",
    district: "중구",
    city: "서울",
    lat: 37.5660,
    lng: 126.9919,
    noiseScore: 48,
    safetyScore: 73,
    convenienceScore: 86,
    overallScore: 69,
    population: "보통",
    subway: ["을지로3가역", "을지로4가역"],
    highlights: ["힙지로", "노포 골목", "을지로 세운상가", "레트로 감성", "공구 거리"],
  },

  // ── 종로구 ──
  {
    id: "jongno-jongno",
    name: "종로동",
    district: "종로구",
    city: "서울",
    lat: 37.5707,
    lng: 126.9920,
    noiseScore: 42,
    safetyScore: 75,
    convenienceScore: 88,
    overallScore: 68,
    population: "높음",
    subway: ["종로3가역", "종각역"],
    highlights: ["종묘·탑골공원", "도심 중심", "1호선 이용", "유동인구 많음"],
  },
  {
    id: "jongno-hyehwa",
    name: "혜화동",
    district: "종로구",
    city: "서울",
    lat: 37.5824,
    lng: 127.0019,
    noiseScore: 60,
    safetyScore: 80,
    convenienceScore: 80,
    overallScore: 73,
    population: "보통",
    subway: ["혜화역"],
    highlights: ["대학로 연극거리", "성균관대 인근", "카페 골목", "문화 예술"],
  },
  {
    id: "jongno-samcheong",
    name: "삼청동",
    district: "종로구",
    city: "서울",
    lat: 37.5824,
    lng: 126.9818,
    noiseScore: 68,
    safetyScore: 85,
    convenienceScore: 72,
    overallScore: 75,
    population: "낮음",
    subway: ["안국역"],
    highlights: ["북촌한옥마을", "경복궁 인근", "갤러리 거리", "조용하고 예스러운 분위기"],
  },

  // ── 강동구 ──
  {
    id: "gangdong-cheonho",
    name: "천호동",
    district: "강동구",
    city: "서울",
    lat: 37.5387,
    lng: 127.1236,
    noiseScore: 58,
    safetyScore: 74,
    convenienceScore: 82,
    overallScore: 71,
    population: "높음",
    subway: ["천호역"],
    highlights: ["현대백화점", "5·8호선 환승", "로데오거리", "상권 발달"],
  },
  {
    id: "gangdong-gildong",
    name: "길동",
    district: "강동구",
    city: "서울",
    lat: 37.5322,
    lng: 127.1380,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 72,
    overallScore: 75,
    population: "보통",
    subway: ["길동역"],
    highlights: ["길동생태공원", "조용한 주거지", "5호선 이용", "어린이집 다수"],
  },
  {
    id: "gangdong-myeongil",
    name: "명일동",
    district: "강동구",
    city: "서울",
    lat: 37.5508,
    lng: 127.1440,
    noiseScore: 70,
    safetyScore: 79,
    convenienceScore: 73,
    overallScore: 74,
    population: "보통",
    subway: ["명일역", "고덕역"],
    highlights: ["고덕 신도시 인근", "아파트 밀집", "한강 접근 가능"],
  },

  // ── 서대문구 ──
  {
    id: "seodaemun-yeonhui",
    name: "연희동",
    district: "서대문구",
    city: "서울",
    lat: 37.5688,
    lng: 126.9346,
    noiseScore: 78,
    safetyScore: 84,
    convenienceScore: 73,
    overallScore: 78,
    population: "보통",
    subway: ["연희역(경의중앙)"],
    highlights: ["연희동 카페 골목", "조용한 주택가", "고급 주거지", "연세대 인근"],
  },
  {
    id: "seodaemun-sinchon",
    name: "신촌동",
    district: "서대문구",
    city: "서울",
    lat: 37.5554,
    lng: 126.9368,
    noiseScore: 42,
    safetyScore: 68,
    convenienceScore: 88,
    overallScore: 66,
    population: "높음",
    subway: ["신촌역"],
    highlights: ["대학가", "유흥가", "젊은 층 밀집", "저렴한 음식점", "야간 소음"],
  },
  {
    id: "seodaemun-hongje",
    name: "홍제동",
    district: "서대문구",
    city: "서울",
    lat: 37.5878,
    lng: 126.9437,
    noiseScore: 72,
    safetyScore: 78,
    convenienceScore: 70,
    overallScore: 73,
    population: "보통",
    subway: ["홍제역"],
    highlights: ["인왕산 접근성", "3호선 이용", "안산 자락길", "주거 중심"],
  },

  // ── 양천구 ──
  {
    id: "yangcheon-mokdong",
    name: "목동",
    district: "양천구",
    city: "서울",
    lat: 37.5279,
    lng: 126.8756,
    noiseScore: 73,
    safetyScore: 85,
    convenienceScore: 82,
    overallScore: 80,
    population: "높음",
    subway: ["목동역", "오목교역"],
    highlights: ["학원가", "대단지 아파트", "교육열 높음", "목동 운동장", "하이퍼리온"],
  },
  {
    id: "yangcheon-sinjeong",
    name: "신정동",
    district: "양천구",
    city: "서울",
    lat: 37.5173,
    lng: 126.8560,
    noiseScore: 68,
    safetyScore: 76,
    convenienceScore: 72,
    overallScore: 72,
    population: "보통",
    subway: ["신정역", "신정네거리역"],
    highlights: ["2호선 이용", "주거 중심", "목동 인근", "저렴한 편"],
  },

  // ── 수원 권선구 (서울 외 확장 예시) ──
  {
    id: "suwon-homaesil",
    name: "호매실동",
    district: "권선구",
    city: "수원",
    lat: 37.2685,
    lng: 126.9758,
    noiseScore: 82,
    safetyScore: 85,
    convenienceScore: 72,
    overallScore: 80,
    population: "보통",
    subway: ["호매실역(예정)"],
    highlights: ["신도시 개발", "신축 아파트", "쾌적한 환경", "학교 신설", "공원 많음"],
  },
  // 수원 장안구
  {
    id: "suwon-jeongja",
    name: "정자동",
    district: "장안구",
    city: "수원",
    lat: 37.3040,
    lng: 127.0065,
    noiseScore: 68,
    safetyScore: 74,
    convenienceScore: 72,
    overallScore: 71,
    population: "보통",
    subway: ["성균관대역"],
    highlights: ["성균관대 인근", "수원 구도심", "전통시장", "주거 밀집"],
  },
  {
    id: "suwon-jowon",
    name: "조원동",
    district: "장안구",
    city: "수원",
    lat: 37.2945,
    lng: 126.9865,
    noiseScore: 70,
    safetyScore: 72,
    convenienceScore: 68,
    overallScore: 70,
    population: "보통",
    subway: [],
    highlights: ["주거 중심", "수원천 인근", "재래시장", "버스 교통"],
  },
  // 수원 팔달구
  {
    id: "suwon-ingye",
    name: "인계동",
    district: "팔달구",
    city: "수원",
    lat: 37.2678,
    lng: 127.0312,
    noiseScore: 65,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 72,
    population: "높음",
    subway: ["수원시청역"],
    highlights: ["수원시청", "먹자골목", "나혜석거리", "학원가"],
  },
  {
    id: "suwon-maegyo",
    name: "매교동",
    district: "팔달구",
    city: "수원",
    lat: 37.2798,
    lng: 127.0145,
    noiseScore: 66,
    safetyScore: 70,
    convenienceScore: 75,
    overallScore: 70,
    population: "보통",
    subway: ["매교역"],
    highlights: ["수인분당선", "수원역 인근", "재개발 추진", "교통 편리"],
  },
  // 수원 영통구
  {
    id: "suwon-yeongtong",
    name: "영통동",
    district: "영통구",
    city: "수원",
    lat: 37.2545,
    lng: 127.0567,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 82,
    overallScore: 78,
    population: "높음",
    subway: ["영통역", "망포역"],
    highlights: ["삼성전자 인근", "영통 먹자골목", "수인분당선", "대단지 아파트"],
  },
  {
    id: "suwon-gwanggyo",
    name: "광교동",
    district: "영통구",
    city: "수원",
    lat: 37.2845,
    lng: 127.0478,
    noiseScore: 78,
    safetyScore: 85,
    convenienceScore: 84,
    overallScore: 82,
    population: "보통",
    subway: ["광교역", "광교중앙역"],
    highlights: ["광교신도시", "신분당선", "광교호수공원", "신축 아파트", "경기도청"],
  },
  {
    id: "suwon-maetan",
    name: "매탄동",
    district: "영통구",
    city: "수원",
    lat: 37.2645,
    lng: 127.0378,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 80,
    overallScore: 76,
    population: "높음",
    subway: ["매탄권선역"],
    highlights: ["삼성전자 본사", "수인분당선", "아파트 밀집", "학원가"],
  },
  // 수원 권선구 추가
  {
    id: "suwon-gwonseon",
    name: "권선동",
    district: "권선구",
    city: "수원",
    lat: 37.2585,
    lng: 126.9758,
    noiseScore: 67,
    safetyScore: 72,
    convenienceScore: 70,
    overallScore: 70,
    population: "보통",
    subway: [],
    highlights: ["수원역 인근", "구도심", "전통시장", "버스 교통"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 경기도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 성남시 ──
  {
    id: "seongnam-jeongja",
    name: "정자동",
    district: "분당구",
    city: "성남",
    lat: 37.3657,
    lng: 127.1085,
    noiseScore: 72,
    safetyScore: 85,
    convenienceScore: 90,
    overallScore: 82,
    population: "높음",
    subway: ["정자역"],
    highlights: ["분당선", "IT밸리", "카페거리", "네이버 본사", "정자공원"],
  },
  {
    id: "seongnam-seohyeon",
    name: "서현동",
    district: "분당구",
    city: "성남",
    lat: 37.3839,
    lng: 127.1231,
    noiseScore: 70,
    safetyScore: 83,
    convenienceScore: 88,
    overallScore: 80,
    population: "높음",
    subway: ["서현역"],
    highlights: ["분당선", "AK플라자", "서현역 상권", "학원가", "먹자골목"],
  },
  {
    id: "seongnam-sinheung",
    name: "신흥동",
    district: "수정구",
    city: "성남",
    lat: 37.4449,
    lng: 127.1456,
    noiseScore: 65,
    safetyScore: 70,
    convenienceScore: 75,
    overallScore: 70,
    population: "높음",
    subway: ["신흥역", "수진역"],
    highlights: ["8호선 연장", "구도심", "재개발 추진", "모란시장 인근"],
  },
  // 성남시 중원구
  {
    id: "seongnam-seongnam",
    name: "성남동",
    district: "중원구",
    city: "성남",
    lat: 37.4398,
    lng: 127.1578,
    noiseScore: 63,
    safetyScore: 68,
    convenienceScore: 72,
    overallScore: 68,
    population: "보통",
    subway: ["신흥역"],
    highlights: ["구도심", "전통시장", "8호선 연장", "재개발 추진"],
  },
  {
    id: "seongnam-jungang",
    name: "중앙동",
    district: "중원구",
    city: "성남",
    lat: 37.4298,
    lng: 127.1478,
    noiseScore: 65,
    safetyScore: 70,
    convenienceScore: 74,
    overallScore: 70,
    population: "보통",
    subway: ["모란역"],
    highlights: ["모란시장", "중원구청 인근", "8호선", "버스 환승"],
  },
  // 성남시 분당구 추가
  {
    id: "seongnam-yatap",
    name: "야탑동",
    district: "분당구",
    city: "성남",
    lat: 37.4112,
    lng: 127.1278,
    noiseScore: 70,
    safetyScore: 82,
    convenienceScore: 85,
    overallScore: 79,
    population: "높음",
    subway: ["야탑역"],
    highlights: ["분당선", "이마트", "야탑역 상권", "아파트 밀집", "학원가"],
  },
  // 성남시 수정구 추가
  {
    id: "seongnam-taepyeong",
    name: "태평동",
    district: "수정구",
    city: "성남",
    lat: 37.4498,
    lng: 127.1378,
    noiseScore: 64,
    safetyScore: 70,
    convenienceScore: 73,
    overallScore: 69,
    population: "보통",
    subway: ["태평역"],
    highlights: ["8호선", "성남시청 인근", "구도심", "재개발 기대"],
  },

  // ── 고양시 ──
  {
    id: "goyang-madu",
    name: "마두동",
    district: "일산동구",
    city: "고양",
    lat: 37.6537,
    lng: 126.7748,
    noiseScore: 73,
    safetyScore: 82,
    convenienceScore: 83,
    overallScore: 79,
    population: "보통",
    subway: ["마두역"],
    highlights: ["일산 호수공원", "3호선", "라페스타", "웨스턴돔"],
  },
  {
    id: "goyang-juyeop",
    name: "주엽동",
    district: "일산서구",
    city: "고양",
    lat: 37.6705,
    lng: 126.7560,
    noiseScore: 76,
    safetyScore: 84,
    convenienceScore: 80,
    overallScore: 80,
    population: "보통",
    subway: ["주엽역"],
    highlights: ["호수공원 인근", "3호선", "조용한 주거지", "학교 밀집"],
  },
  {
    id: "goyang-hwajeong",
    name: "화정동",
    district: "덕양구",
    city: "고양",
    lat: 37.6168,
    lng: 126.8319,
    noiseScore: 68,
    safetyScore: 76,
    convenienceScore: 82,
    overallScore: 75,
    population: "높음",
    subway: ["화정역"],
    highlights: ["3호선", "롯데백화점", "화정 먹자골목", "교통 편리"],
  },
  {
    id: "goyang-baekseok",
    name: "백석동",
    district: "일산동구",
    city: "고양",
    lat: 37.6498,
    lng: 126.7745,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 82,
    overallScore: 78,
    population: "높음",
    subway: ["백석역"],
    highlights: ["3호선", "킨텍스 인근", "일산 먹자골목", "대형마트"],
  },
  {
    id: "goyang-daehwa",
    name: "대화동",
    district: "일산서구",
    city: "고양",
    lat: 37.6745,
    lng: 126.7478,
    noiseScore: 74,
    safetyScore: 82,
    convenienceScore: 78,
    overallScore: 78,
    population: "보통",
    subway: ["대화역"],
    highlights: ["3호선 종점", "킨텍스", "일산호수공원 인근", "조용한 주거지"],
  },
  {
    id: "goyang-haengsin",
    name: "행신동",
    district: "덕양구",
    city: "고양",
    lat: 37.6198,
    lng: 126.8278,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 80,
    overallScore: 76,
    population: "높음",
    subway: ["행신역"],
    highlights: ["경의중앙선", "KTX 행신역", "스타필드 고양 인근", "아파트 밀집"],
  },

  // ── 용인시 ──
  {
    id: "yongin-jukjeon",
    name: "죽전동",
    district: "수지구",
    city: "용인",
    lat: 37.3253,
    lng: 127.1078,
    noiseScore: 74,
    safetyScore: 84,
    convenienceScore: 82,
    overallScore: 80,
    population: "보통",
    subway: ["죽전역"],
    highlights: ["분당선", "단국대", "신분당선 환승", "아파트 밀집"],
  },
  {
    id: "yongin-gugal",
    name: "구갈동",
    district: "기흥구",
    city: "용인",
    lat: 37.2818,
    lng: 127.1148,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 78,
    overallScore: 77,
    population: "보통",
    subway: ["구갈역"],
    highlights: ["분당선", "강남대학교", "롯데아울렛 인근", "주거 중심"],
  },
  {
    id: "yongin-yeoksam",
    name: "역삼동",
    district: "처인구",
    city: "용인",
    lat: 37.2364,
    lng: 127.2050,
    noiseScore: 82,
    safetyScore: 78,
    convenienceScore: 65,
    overallScore: 75,
    population: "낮음",
    subway: [],
    highlights: ["용인시청 인근", "한경대", "자연환경 좋음", "저렴한 전세"],
  },
  {
    id: "yongin-seongbok",
    name: "성복동",
    district: "수지구",
    city: "용인",
    lat: 37.3198,
    lng: 127.0878,
    noiseScore: 75,
    safetyScore: 84,
    convenienceScore: 80,
    overallScore: 80,
    population: "보통",
    subway: ["성복역"],
    highlights: ["신분당선", "성복역 상권", "쾌적한 주거지", "학교 밀집"],
  },
  {
    id: "yongin-bojeong",
    name: "보정동",
    district: "기흥구",
    city: "용인",
    lat: 37.3198,
    lng: 127.1078,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 80,
    overallScore: 77,
    population: "보통",
    subway: ["보정역"],
    highlights: ["분당선", "보정동 카페거리", "죽전 인근", "먹자골목"],
  },
  {
    id: "yongin-mohyeon",
    name: "모현읍",
    district: "처인구",
    city: "용인",
    lat: 37.2798,
    lng: 127.1878,
    noiseScore: 82,
    safetyScore: 76,
    convenienceScore: 60,
    overallScore: 73,
    population: "낮음",
    subway: [],
    highlights: ["한국민속촌 인근", "자연환경 우수", "전원주택", "저렴한 주거비"],
  },

  // ── 부천시 ──
  {
    id: "bucheon-sangdong",
    name: "상동",
    district: "부천시",
    city: "부천",
    lat: 37.5050,
    lng: 126.7538,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 83,
    overallScore: 77,
    population: "높음",
    subway: ["상동역"],
    highlights: ["7호선", "뉴코아아울렛", "중동신도시", "공원 많음"],
  },
  {
    id: "bucheon-jungdong",
    name: "중동",
    district: "부천시",
    city: "부천",
    lat: 37.5032,
    lng: 126.7648,
    noiseScore: 68,
    safetyScore: 77,
    convenienceScore: 82,
    overallScore: 76,
    population: "높음",
    subway: ["부천시청역", "신중동역"],
    highlights: ["7호선", "부천시청", "중앙공원", "상권 발달"],
  },
  {
    id: "bucheon-ojeong",
    name: "오정동",
    district: "부천시",
    city: "부천",
    lat: 37.5198,
    lng: 126.7878,
    noiseScore: 68,
    safetyScore: 74,
    convenienceScore: 72,
    overallScore: 71,
    population: "보통",
    subway: [],
    highlights: ["오정동 산업단지 인근", "주거 중심", "공원 조성", "버스 교통"],
  },
  {
    id: "bucheon-sosa",
    name: "소사동",
    district: "부천시",
    city: "부천",
    lat: 37.4878,
    lng: 126.7978,
    noiseScore: 66,
    safetyScore: 72,
    convenienceScore: 74,
    overallScore: 71,
    population: "보통",
    subway: ["소사역"],
    highlights: ["1호선", "소사역 상권", "구도심", "재래시장"],
  },

  // ── 안양시 ──
  {
    id: "anyang-pyeongchon",
    name: "평촌동",
    district: "동안구",
    city: "안양",
    lat: 37.3894,
    lng: 126.9511,
    noiseScore: 72,
    safetyScore: 82,
    convenienceScore: 85,
    overallScore: 80,
    population: "높음",
    subway: ["평촌역", "범계역"],
    highlights: ["4호선", "학원가", "평촌 신도시", "뉴코아", "교육 중심"],
  },
  {
    id: "anyang-anyang",
    name: "안양동",
    district: "만안구",
    city: "안양",
    lat: 37.4015,
    lng: 126.9220,
    noiseScore: 65,
    safetyScore: 70,
    convenienceScore: 75,
    overallScore: 70,
    population: "보통",
    subway: ["안양역"],
    highlights: ["1호선", "안양 구도심", "안양천 산책로", "재래시장"],
  },
  {
    id: "anyang-hogye",
    name: "호계동",
    district: "동안구",
    city: "안양",
    lat: 37.3898,
    lng: 126.9578,
    noiseScore: 70,
    safetyScore: 80,
    convenienceScore: 82,
    overallScore: 77,
    population: "높음",
    subway: ["범계역"],
    highlights: ["4호선", "범계 상권", "롯데백화점 인근", "학원가"],
  },
  {
    id: "anyang-seoksu",
    name: "석수동",
    district: "만안구",
    city: "안양",
    lat: 37.3978,
    lng: 126.9178,
    noiseScore: 68,
    safetyScore: 72,
    convenienceScore: 70,
    overallScore: 70,
    population: "보통",
    subway: ["석수역"],
    highlights: ["1호선", "관악산 등산로", "안양천 산책", "주거 중심"],
  },

  // ── 안산시 ──
  {
    id: "ansan-gojan",
    name: "고잔동",
    district: "단원구",
    city: "안산",
    lat: 37.3213,
    lng: 126.8304,
    noiseScore: 68,
    safetyScore: 74,
    convenienceScore: 80,
    overallScore: 74,
    population: "높음",
    subway: ["고잔역", "중앙역"],
    highlights: ["4호선", "안산 중심가", "롯데마트", "다문화 특구"],
  },
  {
    id: "ansan-bono",
    name: "본오동",
    district: "상록구",
    city: "안산",
    lat: 37.3032,
    lng: 126.8648,
    noiseScore: 75,
    safetyScore: 78,
    convenienceScore: 72,
    overallScore: 75,
    population: "보통",
    subway: ["반월역"],
    highlights: ["수인분당선", "주거 중심", "관산공원", "학교 밀집"],
  },
  {
    id: "ansan-wongok",
    name: "원곡동",
    district: "단원구",
    city: "안산",
    lat: 37.3198,
    lng: 126.8078,
    noiseScore: 65,
    safetyScore: 70,
    convenienceScore: 75,
    overallScore: 70,
    population: "높음",
    subway: ["안산역"],
    highlights: ["4호선", "다문화 거리", "먹자골목", "국제 음식점"],
  },
  {
    id: "ansan-sadong",
    name: "사동",
    district: "상록구",
    city: "안산",
    lat: 37.3078,
    lng: 126.8478,
    noiseScore: 73,
    safetyScore: 78,
    convenienceScore: 74,
    overallScore: 75,
    population: "보통",
    subway: ["사리역"],
    highlights: ["수인분당선", "안산식물원 인근", "주거 중심", "학교 밀집"],
  },

  // ── 화성시 ──
  {
    id: "hwaseong-dongtan",
    name: "동탄동",
    district: "화성시",
    city: "화성",
    lat: 37.2005,
    lng: 127.0746,
    noiseScore: 75,
    safetyScore: 85,
    convenienceScore: 82,
    overallScore: 81,
    population: "높음",
    subway: ["동탄역"],
    highlights: ["SRT 동탄역", "신도시", "신축 아파트", "커뮤니티 시설", "대형마트"],
  },
  {
    id: "hwaseong-byeongjeom",
    name: "병점동",
    district: "화성시",
    city: "화성",
    lat: 37.2234,
    lng: 127.0127,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 76,
    overallScore: 75,
    population: "보통",
    subway: ["병점역"],
    highlights: ["1호선", "롯데마트", "주거 중심", "세교 신도시 인근"],
  },
  {
    id: "hwaseong-bongdam",
    name: "봉담읍",
    district: "화성시",
    city: "화성",
    lat: 37.2178,
    lng: 126.9478,
    noiseScore: 75,
    safetyScore: 78,
    convenienceScore: 72,
    overallScore: 75,
    population: "보통",
    subway: [],
    highlights: ["봉담택지지구", "수원 인근", "신축 아파트", "자연환경"],
  },
  {
    id: "hwaseong-hyangnam",
    name: "향남읍",
    district: "화성시",
    city: "화성",
    lat: 37.1478,
    lng: 126.9178,
    noiseScore: 76,
    safetyScore: 78,
    convenienceScore: 70,
    overallScore: 75,
    population: "보통",
    subway: [],
    highlights: ["향남택지지구", "신축 아파트", "쾌적한 환경", "화성시청 인근"],
  },

  // ── 평택시 ──
  {
    id: "pyeongtaek-pyeongtaek",
    name: "평택동",
    district: "평택시",
    city: "평택",
    lat: 36.9927,
    lng: 127.0855,
    noiseScore: 68,
    safetyScore: 72,
    convenienceScore: 72,
    overallScore: 71,
    population: "보통",
    subway: ["평택역"],
    highlights: ["1호선", "평택역 상권", "전통시장", "구도심"],
  },
  {
    id: "pyeongtaek-bijeon",
    name: "비전동",
    district: "평택시",
    city: "평택",
    lat: 36.9948,
    lng: 127.1046,
    noiseScore: 72,
    safetyScore: 76,
    convenienceScore: 75,
    overallScore: 74,
    population: "보통",
    subway: [],
    highlights: ["평택시청 인근", "비전택지지구", "신축 아파트", "이마트"],
  },
  {
    id: "pyeongtaek-godeok",
    name: "고덕동",
    district: "평택시",
    city: "평택",
    lat: 37.0878,
    lng: 127.0878,
    noiseScore: 76,
    safetyScore: 82,
    convenienceScore: 78,
    overallScore: 79,
    population: "보통",
    subway: [],
    highlights: ["고덕신도시", "신축 아파트", "삼성전자 인근", "쾌적한 환경"],
  },
  {
    id: "pyeongtaek-seojeong",
    name: "서정동",
    district: "평택시",
    city: "평택",
    lat: 37.0678,
    lng: 127.0178,
    noiseScore: 70,
    safetyScore: 74,
    convenienceScore: 74,
    overallScore: 73,
    population: "보통",
    subway: ["서정리역"],
    highlights: ["1호선", "주거 중심", "택지개발", "캠프 험프리스 인근"],
  },

  // ── 김포시 ──
  {
    id: "gimpo-janggi",
    name: "장기동",
    district: "김포시",
    city: "김포",
    lat: 37.6360,
    lng: 126.6795,
    noiseScore: 74,
    safetyScore: 82,
    convenienceScore: 78,
    overallScore: 78,
    population: "높음",
    subway: ["장기역"],
    highlights: ["김포골드라인", "김포 한강신도시", "신축 아파트", "공원 많음"],
  },
  {
    id: "gimpo-gurae",
    name: "구래동",
    district: "김포시",
    city: "김포",
    lat: 37.6345,
    lng: 126.6662,
    noiseScore: 75,
    safetyScore: 83,
    convenienceScore: 80,
    overallScore: 79,
    population: "높음",
    subway: ["구래역"],
    highlights: ["김포골드라인", "라베니체 마치에비뉴", "호수공원", "신도시"],
  },
  {
    id: "gimpo-pungmu",
    name: "풍무동",
    district: "김포시",
    city: "김포",
    lat: 37.6178,
    lng: 126.7178,
    noiseScore: 72,
    safetyScore: 78,
    convenienceScore: 76,
    overallScore: 75,
    population: "보통",
    subway: ["풍무역"],
    highlights: ["김포골드라인", "김포시청 인근", "주거 중심", "먹자골목"],
  },
  {
    id: "gimpo-yangchon",
    name: "양촌읍",
    district: "김포시",
    city: "김포",
    lat: 37.5878,
    lng: 126.6878,
    noiseScore: 78,
    safetyScore: 76,
    convenienceScore: 65,
    overallScore: 73,
    population: "낮음",
    subway: [],
    highlights: ["전원주택", "자연환경 좋음", "김포 외곽", "저렴한 주거비"],
  },

  // ── 파주시 ──
  {
    id: "paju-unjeong",
    name: "운정동",
    district: "파주시",
    city: "파주",
    lat: 37.7143,
    lng: 126.7477,
    noiseScore: 78,
    safetyScore: 83,
    convenienceScore: 76,
    overallScore: 79,
    population: "높음",
    subway: ["운정역"],
    highlights: ["경의중앙선", "운정신도시", "운정호수공원", "신축 아파트"],
  },
  {
    id: "paju-geumchon",
    name: "금촌동",
    district: "파주시",
    city: "파주",
    lat: 37.7601,
    lng: 126.7817,
    noiseScore: 72,
    safetyScore: 75,
    convenienceScore: 72,
    overallScore: 73,
    population: "보통",
    subway: ["금촌역"],
    highlights: ["경의중앙선", "파주시청 인근", "구도심", "전통시장"],
  },
  {
    id: "paju-gyoha",
    name: "교하동",
    district: "파주시",
    city: "파주",
    lat: 37.7278,
    lng: 126.7478,
    noiseScore: 76,
    safetyScore: 82,
    convenienceScore: 78,
    overallScore: 79,
    population: "높음",
    subway: ["운정역"],
    highlights: ["교하신도시", "신축 아파트", "운정 인근", "공원 많음"],
  },
  {
    id: "paju-munsan",
    name: "문산읍",
    district: "파주시",
    city: "파주",
    lat: 37.8578,
    lng: 126.7878,
    noiseScore: 75,
    safetyScore: 72,
    convenienceScore: 65,
    overallScore: 71,
    population: "보통",
    subway: ["문산역"],
    highlights: ["경의중앙선", "파주 북부 중심", "군부대 인근", "전통시장"],
  },

  // ── 하남시 ──
  {
    id: "hanam-misa",
    name: "미사동",
    district: "하남시",
    city: "하남",
    lat: 37.5604,
    lng: 127.1818,
    noiseScore: 76,
    safetyScore: 85,
    convenienceScore: 82,
    overallScore: 81,
    population: "높음",
    subway: ["미사역"],
    highlights: ["5호선 연장", "미사강변도시", "한강 접근", "신축 아파트", "스타필드 인근"],
  },
  {
    id: "hanam-pungsan",
    name: "풍산동",
    district: "하남시",
    city: "하남",
    lat: 37.5530,
    lng: 127.2005,
    noiseScore: 73,
    safetyScore: 80,
    convenienceScore: 78,
    overallScore: 77,
    population: "보통",
    subway: ["풍산역"],
    highlights: ["5호선 연장", "하남시청 인근", "주거 중심", "교산 신도시 인근"],
  },
  {
    id: "hanam-sinjang",
    name: "신장동",
    district: "하남시",
    city: "하남",
    lat: 37.5478,
    lng: 127.2178,
    noiseScore: 70,
    safetyScore: 76,
    convenienceScore: 75,
    overallScore: 74,
    population: "보통",
    subway: ["하남시청역"],
    highlights: ["5호선 연장", "하남 구도심", "전통시장", "행정타운"],
  },
  {
    id: "hanam-deokpung",
    name: "덕풍동",
    district: "하남시",
    city: "하남",
    lat: 37.5378,
    lng: 127.2078,
    noiseScore: 68,
    safetyScore: 74,
    convenienceScore: 73,
    overallScore: 72,
    population: "보통",
    subway: ["하남풍산역"],
    highlights: ["5호선 연장", "스타필드 인근", "주거 중심", "학교 밀집"],
  },

  // ── 광명시 ──
  {
    id: "gwangmyeong-cheolsan",
    name: "철산동",
    district: "광명시",
    city: "광명",
    lat: 37.4768,
    lng: 126.8666,
    noiseScore: 65,
    safetyScore: 76,
    convenienceScore: 82,
    overallScore: 74,
    population: "높음",
    subway: ["철산역"],
    highlights: ["7호선", "광명사거리역 인근", "이케아 광명점", "코스트코"],
  },
  {
    id: "gwangmyeong-haan",
    name: "하안동",
    district: "광명시",
    city: "광명",
    lat: 37.4594,
    lng: 126.8705,
    noiseScore: 70,
    safetyScore: 75,
    convenienceScore: 73,
    overallScore: 73,
    population: "보통",
    subway: [],
    highlights: ["주거 중심", "광명동굴 인근", "재래시장", "도덕산 산책로"],
  },
  {
    id: "gwangmyeong-soha",
    name: "소하동",
    district: "광명시",
    city: "광명",
    lat: 37.4478,
    lng: 126.8778,
    noiseScore: 72,
    safetyScore: 78,
    convenienceScore: 76,
    overallScore: 75,
    population: "보통",
    subway: ["광명사거리역"],
    highlights: ["7호선", "소하택지지구", "신축 아파트", "KTX 광명역 인근"],
  },
  {
    id: "gwangmyeong-gwangmyeong",
    name: "광명동",
    district: "광명시",
    city: "광명",
    lat: 37.4678,
    lng: 126.8578,
    noiseScore: 68,
    safetyScore: 74,
    convenienceScore: 74,
    overallScore: 72,
    population: "보통",
    subway: ["광명사거리역"],
    highlights: ["7호선", "광명전통시장", "구도심", "광명동굴 인근"],
  },

  // ── 의정부시 ──
  {
    id: "uijeongbu-minrak",
    name: "민락동",
    district: "의정부시",
    city: "의정부",
    lat: 37.7503,
    lng: 127.0800,
    noiseScore: 75,
    safetyScore: 80,
    convenienceScore: 76,
    overallScore: 77,
    population: "보통",
    subway: ["회룡역"],
    highlights: ["1호선 인근", "민락지구", "신축 아파트", "공원 많음"],
  },
  {
    id: "uijeongbu-uijeongbu",
    name: "의정부동",
    district: "의정부시",
    city: "의정부",
    lat: 37.7383,
    lng: 127.0340,
    noiseScore: 63,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 71,
    population: "높음",
    subway: ["의정부역"],
    highlights: ["1호선", "의정부 중심가", "제일시장", "부대찌개 거리"],
  },
  {
    id: "uijeongbu-howon",
    name: "호원동",
    district: "의정부시",
    city: "의정부",
    lat: 37.7478,
    lng: 127.0478,
    noiseScore: 72,
    safetyScore: 78,
    convenienceScore: 74,
    overallScore: 75,
    population: "보통",
    subway: ["회룡역"],
    highlights: ["1호선", "회룡역 인근", "주거 중심", "산책로 좋음"],
  },
  {
    id: "uijeongbu-nokyang",
    name: "녹양동",
    district: "의정부시",
    city: "의정부",
    lat: 37.7378,
    lng: 127.0578,
    noiseScore: 70,
    safetyScore: 76,
    convenienceScore: 72,
    overallScore: 73,
    population: "보통",
    subway: ["녹양역"],
    highlights: ["경원선", "주거 중심", "자연환경 좋음", "신곡천 산책로"],
  },

  // ── 남양주시 ──
  {
    id: "namyangju-dasan",
    name: "다산동",
    district: "남양주시",
    city: "남양주",
    lat: 37.6118,
    lng: 127.1498,
    noiseScore: 75,
    safetyScore: 83,
    convenienceScore: 78,
    overallScore: 79,
    population: "높음",
    subway: ["다산역"],
    highlights: ["경의중앙선", "다산신도시", "신축 아파트", "한강 접근", "대형마트"],
  },
  {
    id: "namyangju-byeollae",
    name: "별내동",
    district: "남양주시",
    city: "남양주",
    lat: 37.6415,
    lng: 127.1208,
    noiseScore: 77,
    safetyScore: 84,
    convenienceScore: 76,
    overallScore: 79,
    population: "보통",
    subway: ["별내역"],
    highlights: ["경춘선", "별내신도시", "별내별가람역", "쾌적한 환경"],
  },
  {
    id: "namyangju-hopyeong",
    name: "호평동",
    district: "남양주시",
    city: "남양주",
    lat: 37.6578,
    lng: 127.2278,
    noiseScore: 75,
    safetyScore: 80,
    convenienceScore: 74,
    overallScore: 76,
    population: "보통",
    subway: ["호평역"],
    highlights: ["경춘선", "호평택지지구", "자연환경 좋음", "주거 중심"],
  },
  {
    id: "namyangju-pyeongnae",
    name: "평내동",
    district: "남양주시",
    city: "남양주",
    lat: 37.6378,
    lng: 127.2178,
    noiseScore: 73,
    safetyScore: 80,
    convenienceScore: 78,
    overallScore: 77,
    population: "보통",
    subway: ["평내호평역"],
    highlights: ["경춘선", "평내택지지구", "홈플러스", "아파트 밀집"],
  },

  // ── 구리시 ──
  {
    id: "guri-inchang",
    name: "인창동",
    district: "구리시",
    city: "구리",
    lat: 37.5997,
    lng: 127.1314,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 77,
    overallScore: 75,
    population: "보통",
    subway: ["구리역"],
    highlights: ["경의중앙선", "구리시청 인근", "왕숙천 산책로", "전통시장"],
  },
  {
    id: "guri-galmae",
    name: "갈매동",
    district: "구리시",
    city: "구리",
    lat: 37.6204,
    lng: 127.1176,
    noiseScore: 76,
    safetyScore: 82,
    convenienceScore: 73,
    overallScore: 77,
    population: "보통",
    subway: ["갈매역"],
    highlights: ["경춘선", "갈매지구", "신축 아파트", "자연환경 좋음"],
  },
  {
    id: "guri-sutaek",
    name: "수택동",
    district: "구리시",
    city: "구리",
    lat: 37.6078,
    lng: 127.1378,
    noiseScore: 68,
    safetyScore: 74,
    convenienceScore: 76,
    overallScore: 73,
    population: "보통",
    subway: ["구리역"],
    highlights: ["경의중앙선", "구리전통시장", "수택공원", "주거 밀집"],
  },
  {
    id: "guri-gyomun",
    name: "교문동",
    district: "구리시",
    city: "구리",
    lat: 37.5978,
    lng: 127.1278,
    noiseScore: 70,
    safetyScore: 76,
    convenienceScore: 74,
    overallScore: 73,
    population: "보통",
    subway: [],
    highlights: ["구리시청 인근", "왕숙천 산책로", "주거 중심", "학교 밀집"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 인천 ──
  // ══════════════════════════════════════════════════════════════

  // ── 연수구 ──
  {
    id: "incheon-songdo",
    name: "송도동",
    district: "연수구",
    city: "인천",
    lat: 37.3823,
    lng: 126.6580,
    noiseScore: 78,
    safetyScore: 86,
    convenienceScore: 83,
    overallScore: 82,
    population: "높음",
    subway: ["송도역", "인천대입구역"],
    highlights: ["인천1호선", "국제도시", "센트럴파크", "트리플스트리트", "해돋이공원"],
  },
  {
    id: "incheon-yeonsu",
    name: "연수동",
    district: "연수구",
    city: "인천",
    lat: 37.4100,
    lng: 126.6782,
    noiseScore: 72,
    safetyScore: 78,
    convenienceScore: 78,
    overallScore: 76,
    population: "높음",
    subway: ["연수역"],
    highlights: ["수인분당선", "연수구청 인근", "주거 중심", "학교 밀집"],
  },

  // ── 남동구 ──
  {
    id: "incheon-ganseok",
    name: "간석동",
    district: "남동구",
    city: "인천",
    lat: 37.4507,
    lng: 126.7233,
    noiseScore: 65,
    safetyScore: 73,
    convenienceScore: 76,
    overallScore: 71,
    population: "높음",
    subway: ["간석역", "간석오거리역"],
    highlights: ["인천1호선", "구도심", "먹자골목", "교통 편리"],
  },
  {
    id: "incheon-guwol",
    name: "구월동",
    district: "남동구",
    city: "인천",
    lat: 37.4500,
    lng: 126.7042,
    noiseScore: 62,
    safetyScore: 75,
    convenienceScore: 85,
    overallScore: 74,
    population: "높음",
    subway: ["예술회관역", "인천시청역"],
    highlights: ["인천1호선", "롯데백화점", "인천시청", "모래내시장"],
  },

  // ── 부평구 ──
  {
    id: "incheon-bupyeong",
    name: "부평동",
    district: "부평구",
    city: "인천",
    lat: 37.4894,
    lng: 126.7237,
    noiseScore: 58,
    safetyScore: 72,
    convenienceScore: 84,
    overallScore: 71,
    population: "높음",
    subway: ["부평역", "부평시장역"],
    highlights: ["인천1호선", "부평지하상가", "부평 문화의거리", "야시장"],
  },
  {
    id: "incheon-sipjeong",
    name: "십정동",
    district: "부평구",
    city: "인천",
    lat: 37.4974,
    lng: 126.7352,
    noiseScore: 65,
    safetyScore: 73,
    convenienceScore: 74,
    overallScore: 71,
    population: "보통",
    subway: ["백운역"],
    highlights: ["인천1호선", "주거 중심", "굴포천 산책로", "부평 인근"],
  },

  // ── 서구 ──
  {
    id: "incheon-geomdan",
    name: "검단동",
    district: "서구",
    city: "인천",
    lat: 37.5920,
    lng: 126.6518,
    noiseScore: 77,
    safetyScore: 82,
    convenienceScore: 74,
    overallScore: 78,
    population: "높음",
    subway: [],
    highlights: ["검단신도시", "신축 아파트", "공원 많음", "커뮤니티 시설"],
  },
  {
    id: "incheon-cheongna",
    name: "청라동",
    district: "서구",
    city: "인천",
    lat: 37.5268,
    lng: 126.6461,
    noiseScore: 76,
    safetyScore: 85,
    convenienceScore: 82,
    overallScore: 81,
    population: "높음",
    subway: [],
    highlights: ["청라국제도시", "청라호수공원", "커낼웨이", "신축 아파트", "국제업무지구"],
  },

  // ── 미추홀구 ──
  {
    id: "incheon-hagik",
    name: "학익동",
    district: "미추홀구",
    city: "인천",
    lat: 37.4391,
    lng: 126.6715,
    noiseScore: 67,
    safetyScore: 72,
    convenienceScore: 73,
    overallScore: 71,
    population: "보통",
    subway: ["인하대역"],
    highlights: ["수인분당선", "인하대 인근", "학익 재개발", "문학경기장 인근"],
  },
  {
    id: "incheon-yonghyeon",
    name: "용현동",
    district: "미추홀구",
    city: "인천",
    lat: 37.4533,
    lng: 126.6518,
    noiseScore: 62,
    safetyScore: 68,
    convenienceScore: 72,
    overallScore: 67,
    population: "높음",
    subway: ["인천역"],
    highlights: ["1호선", "차이나타운 인근", "구도심", "저렴한 물가"],
  },

  // ── 계양구 ──
  {
    id: "incheon-gyesan",
    name: "계산동",
    district: "계양구",
    city: "인천",
    lat: 37.5370,
    lng: 126.7330,
    noiseScore: 70,
    safetyScore: 78,
    convenienceScore: 77,
    overallScore: 75,
    population: "보통",
    subway: ["계산역"],
    highlights: ["인천1호선", "계양구청 인근", "주거 중심", "학원가"],
  },
  {
    id: "incheon-jakjeon",
    name: "작전동",
    district: "계양구",
    city: "인천",
    lat: 37.5260,
    lng: 126.7290,
    noiseScore: 67,
    safetyScore: 76,
    convenienceScore: 78,
    overallScore: 74,
    population: "높음",
    subway: ["작전역"],
    highlights: ["인천1호선", "작전 먹자골목", "아파트 밀집", "생활 편의시설"],
  },

  // ── 인천 중구 ──
  {
    id: "incheon-unseo",
    name: "운서동",
    district: "중구",
    city: "인천",
    lat: 37.4930,
    lng: 126.4930,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 72,
    overallScore: 75,
    population: "보통",
    subway: ["운서역"],
    highlights: ["인천공항철도", "영종도", "공항 종사자 거주", "신도시 개발"],
  },
  {
    id: "incheon-sinpo",
    name: "신포동",
    district: "중구",
    city: "인천",
    lat: 37.4735,
    lng: 126.6255,
    noiseScore: 58,
    safetyScore: 72,
    convenienceScore: 80,
    overallScore: 70,
    population: "보통",
    subway: ["신포역"],
    highlights: ["인천1호선", "신포국제시장", "차이나타운", "개항장 거리", "근대건축물"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 부산 ──
  // ══════════════════════════════════════════════════════════════

  // ── 해운대구 ──
  {
    id: "busan-udong",
    name: "우동",
    district: "해운대구",
    city: "부산",
    lat: 35.1636,
    lng: 129.1300,
    noiseScore: 60,
    safetyScore: 80,
    convenienceScore: 90,
    overallScore: 77,
    population: "높음",
    subway: ["센텀시티역", "벡스코역"],
    highlights: ["부산2호선", "센텀시티", "신세계 스파랜드", "영화의전당", "벡스코"],
  },
  {
    id: "busan-jungdong",
    name: "중동",
    district: "해운대구",
    city: "부산",
    lat: 35.1622,
    lng: 129.1623,
    noiseScore: 55,
    safetyScore: 78,
    convenienceScore: 88,
    overallScore: 74,
    population: "높음",
    subway: ["해운대역"],
    highlights: ["해운대해수욕장", "관광 특구", "먹자골목", "부산2호선"],
  },
  {
    id: "busan-jwadong",
    name: "좌동",
    district: "해운대구",
    city: "부산",
    lat: 35.1727,
    lng: 129.1747,
    noiseScore: 72,
    safetyScore: 82,
    convenienceScore: 80,
    overallScore: 78,
    population: "높음",
    subway: ["장산역"],
    highlights: ["부산2호선", "주거 중심", "해운대 배후", "학원가", "대형마트"],
  },

  // ── 부산진구 ──
  {
    id: "busan-bujeon",
    name: "부전동",
    district: "부산진구",
    city: "부산",
    lat: 35.1582,
    lng: 129.0593,
    noiseScore: 55,
    safetyScore: 74,
    convenienceScore: 88,
    overallScore: 72,
    population: "높음",
    subway: ["부전역", "서면역"],
    highlights: ["부산1호선", "서면 상권", "부전시장", "먹자골목", "유흥가"],
  },
  {
    id: "busan-jeonpo",
    name: "전포동",
    district: "부산진구",
    city: "부산",
    lat: 35.1522,
    lng: 129.0622,
    noiseScore: 60,
    safetyScore: 76,
    convenienceScore: 83,
    overallScore: 73,
    population: "보통",
    subway: ["전포역"],
    highlights: ["전포카페거리", "부산2호선", "트렌디한 동네", "젊은 층 선호"],
  },

  // ── 수영구 ──
  {
    id: "busan-gwangan",
    name: "광안동",
    district: "수영구",
    city: "부산",
    lat: 35.1532,
    lng: 129.1135,
    noiseScore: 62,
    safetyScore: 78,
    convenienceScore: 83,
    overallScore: 74,
    population: "높음",
    subway: ["광안역"],
    highlights: ["광안리해수욕장", "광안대교 야경", "카페거리", "부산2호선"],
  },
  {
    id: "busan-namcheon",
    name: "남천동",
    district: "수영구",
    city: "부산",
    lat: 35.1417,
    lng: 129.1084,
    noiseScore: 68,
    safetyScore: 80,
    convenienceScore: 78,
    overallScore: 75,
    population: "보통",
    subway: ["남천역"],
    highlights: ["부산2호선", "삼익비치 재건축", "바다 조망", "조용한 주거지"],
  },

  // ── 남구 ──
  {
    id: "busan-daeyeon",
    name: "대연동",
    district: "남구",
    city: "부산",
    lat: 35.1341,
    lng: 129.0837,
    noiseScore: 65,
    safetyScore: 76,
    convenienceScore: 80,
    overallScore: 74,
    population: "높음",
    subway: ["대연역", "못골역"],
    highlights: ["부산2호선", "경성대·부경대 인근", "대학가", "UN기념공원"],
  },
  {
    id: "busan-yongho",
    name: "용호동",
    district: "남구",
    city: "부산",
    lat: 35.1153,
    lng: 129.1086,
    noiseScore: 75,
    safetyScore: 80,
    convenienceScore: 72,
    overallScore: 76,
    population: "보통",
    subway: [],
    highlights: ["이기대 산책로", "바다 조망", "오륙도 인근", "조용한 환경"],
  },

  // ── 사하구 ──
  {
    id: "busan-hadan",
    name: "하단동",
    district: "사하구",
    city: "부산",
    lat: 35.1068,
    lng: 128.9663,
    noiseScore: 62,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 71,
    population: "높음",
    subway: ["하단역"],
    highlights: ["부산1호선", "하단 먹자골목", "낙동강 인근", "교통 요지"],
  },
  {
    id: "busan-dangni",
    name: "당리동",
    district: "사하구",
    city: "부산",
    lat: 35.0967,
    lng: 128.9748,
    noiseScore: 68,
    safetyScore: 73,
    convenienceScore: 70,
    overallScore: 70,
    population: "보통",
    subway: ["당리역"],
    highlights: ["부산1호선", "감천문화마을 인근", "언덕 지형", "주거 중심"],
  },

  // ── 동래구 ──
  {
    id: "busan-myeongnyun",
    name: "명륜동",
    district: "동래구",
    city: "부산",
    lat: 35.2044,
    lng: 129.0811,
    noiseScore: 63,
    safetyScore: 76,
    convenienceScore: 80,
    overallScore: 73,
    population: "보통",
    subway: ["동래역"],
    highlights: ["부산1호선", "동래시장", "온천 문화", "역사 유적"],
  },
  {
    id: "busan-oncheon",
    name: "온천동",
    district: "동래구",
    city: "부산",
    lat: 35.2101,
    lng: 129.0778,
    noiseScore: 67,
    safetyScore: 78,
    convenienceScore: 77,
    overallScore: 74,
    population: "보통",
    subway: ["온천장역"],
    highlights: ["부산1호선", "동래온천", "금강공원", "주거 중심"],
  },

  // ── 금정구 ──
  {
    id: "busan-jangjeon",
    name: "장전동",
    district: "금정구",
    city: "부산",
    lat: 35.2294,
    lng: 129.0888,
    noiseScore: 60,
    safetyScore: 76,
    convenienceScore: 80,
    overallScore: 72,
    population: "높음",
    subway: ["장전역"],
    highlights: ["부산1호선", "부산대 인근", "대학가", "먹자골목", "금정산 접근"],
  },
  {
    id: "busan-bugok",
    name: "부곡동",
    district: "금정구",
    city: "부산",
    lat: 35.2350,
    lng: 129.0830,
    noiseScore: 68,
    safetyScore: 78,
    convenienceScore: 75,
    overallScore: 74,
    population: "보통",
    subway: ["부산대앞역"],
    highlights: ["부산1호선", "주거 중심", "금정산 등산로", "학교 밀집"],
  },

  // ── 연제구 ──
  {
    id: "busan-geoje",
    name: "거제동",
    district: "연제구",
    city: "부산",
    lat: 35.1820,
    lng: 129.0660,
    noiseScore: 63,
    safetyScore: 77,
    convenienceScore: 82,
    overallScore: 74,
    population: "높음",
    subway: ["거제역"],
    highlights: ["부산3호선", "연제구청 인근", "종합운동장 인근", "주거 밀집"],
  },
  {
    id: "busan-yeonsan",
    name: "연산동",
    district: "연제구",
    city: "부산",
    lat: 35.1762,
    lng: 129.0780,
    noiseScore: 58,
    safetyScore: 74,
    convenienceScore: 84,
    overallScore: 72,
    population: "높음",
    subway: ["연산역"],
    highlights: ["부산1·3호선 환승", "연산 로터리", "먹자골목", "교통 편리"],
  },

  // ── 사상구 ──
  {
    id: "busan-jurye",
    name: "주례동",
    district: "사상구",
    city: "부산",
    lat: 35.1520,
    lng: 129.0150,
    noiseScore: 62,
    safetyScore: 72,
    convenienceScore: 76,
    overallScore: 70,
    population: "높음",
    subway: ["주례역"],
    highlights: ["부산2호선", "주례 먹자골목", "교통 요지", "저렴한 물가"],
  },
  {
    id: "busan-gamjeon",
    name: "감전동",
    district: "사상구",
    city: "부산",
    lat: 35.1445,
    lng: 129.0080,
    noiseScore: 58,
    safetyScore: 70,
    convenienceScore: 73,
    overallScore: 67,
    population: "보통",
    subway: ["감전역"],
    highlights: ["부산2호선", "사상공업지대 인근", "낙동강 접근", "저렴한 전세"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 대구 ──
  // ══════════════════════════════════════════════════════════════

  // ── 수성구 ──
  {
    id: "daegu-beomeo",
    name: "범어동",
    district: "수성구",
    city: "대구",
    lat: 35.8589,
    lng: 128.6269,
    noiseScore: 65,
    safetyScore: 82,
    convenienceScore: 87,
    overallScore: 78,
    population: "높음",
    subway: ["범어역"],
    highlights: ["대구2호선", "수성구 중심", "학원가", "대구 부촌", "대백프라자"],
  },
  {
    id: "daegu-manchon",
    name: "만촌동",
    district: "수성구",
    city: "대구",
    lat: 35.8531,
    lng: 128.6384,
    noiseScore: 70,
    safetyScore: 83,
    convenienceScore: 80,
    overallScore: 78,
    population: "보통",
    subway: ["만촌역"],
    highlights: ["대구2호선", "수성못 인근", "교육 환경 우수", "조용한 주거지"],
  },

  // ── 달서구 ──
  {
    id: "daegu-sangin",
    name: "상인동",
    district: "달서구",
    city: "대구",
    lat: 35.8282,
    lng: 128.5347,
    noiseScore: 66,
    safetyScore: 76,
    convenienceScore: 82,
    overallScore: 75,
    population: "높음",
    subway: ["상인역"],
    highlights: ["대구1호선", "이마트", "상인 상권", "월배 시장", "교통 편리"],
  },
  {
    id: "daegu-wolseong",
    name: "월성동",
    district: "달서구",
    city: "대구",
    lat: 35.8346,
    lng: 128.5541,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 78,
    overallScore: 77,
    population: "보통",
    subway: ["월배역"],
    highlights: ["대구1호선", "진천천 산책로", "아파트 밀집", "학교 많음"],
  },

  // ── 대구 중구 ──
  {
    id: "daegu-dongsungro",
    name: "동성로",
    district: "중구",
    city: "대구",
    lat: 35.8686,
    lng: 128.5963,
    noiseScore: 45,
    safetyScore: 75,
    convenienceScore: 92,
    overallScore: 71,
    population: "높음",
    subway: ["중앙로역", "반월당역"],
    highlights: ["대구1·2호선", "동성로 상권", "대구 최대 번화가", "야시장", "패션 거리"],
  },
  {
    id: "daegu-samdeok",
    name: "삼덕동",
    district: "중구",
    city: "대구",
    lat: 35.8720,
    lng: 128.6028,
    noiseScore: 60,
    safetyScore: 74,
    convenienceScore: 78,
    overallScore: 71,
    population: "보통",
    subway: ["중앙로역"],
    highlights: ["동성로 인근", "카페 골목", "근대골목 투어", "도심 주거"],
  },

  // ── 대구 북구 ──
  {
    id: "daegu-chimsan",
    name: "침산동",
    district: "북구",
    city: "대구",
    lat: 35.8868,
    lng: 128.5787,
    noiseScore: 68,
    safetyScore: 75,
    convenienceScore: 76,
    overallScore: 73,
    population: "보통",
    subway: ["침산역"],
    highlights: ["대구3호선", "침산공원", "주거 중심", "이마트 인근"],
  },
  {
    id: "daegu-sangyeok",
    name: "산격동",
    district: "북구",
    city: "대구",
    lat: 35.8952,
    lng: 128.6058,
    noiseScore: 70,
    safetyScore: 76,
    convenienceScore: 74,
    overallScore: 73,
    population: "보통",
    subway: ["경대병원역"],
    highlights: ["대구2호선", "경북대 인근", "대학가", "북구청 인근"],
  },

  // ── 대구 동구 ──
  {
    id: "daegu-sinam",
    name: "신암동",
    district: "동구",
    city: "대구",
    lat: 35.8810,
    lng: 128.6290,
    noiseScore: 63,
    safetyScore: 74,
    convenienceScore: 76,
    overallScore: 71,
    population: "보통",
    subway: ["신암역"],
    highlights: ["대구1호선", "동대구역 인근", "교통 편리", "먹자골목"],
  },
  {
    id: "daegu-hyomok",
    name: "효목동",
    district: "동구",
    city: "대구",
    lat: 35.8720,
    lng: 128.6350,
    noiseScore: 66,
    safetyScore: 75,
    convenienceScore: 74,
    overallScore: 72,
    population: "보통",
    subway: ["동구청역"],
    highlights: ["대구1호선", "동구청 인근", "주거 중심", "학교 밀집"],
  },

  // ── 대구 남구 ──
  {
    id: "daegu-daemyeong",
    name: "대명동",
    district: "남구",
    city: "대구",
    lat: 35.8450,
    lng: 128.5780,
    noiseScore: 58,
    safetyScore: 73,
    convenienceScore: 80,
    overallScore: 70,
    population: "높음",
    subway: ["대명역"],
    highlights: ["대구1호선", "앞산 접근", "대명 먹자골목", "대학가", "저렴한 물가"],
  },
  {
    id: "daegu-bongdeok",
    name: "봉덕동",
    district: "남구",
    city: "대구",
    lat: 35.8500,
    lng: 128.5950,
    noiseScore: 64,
    safetyScore: 74,
    convenienceScore: 76,
    overallScore: 71,
    population: "보통",
    subway: ["남구청역"],
    highlights: ["대구1호선", "남구청 인근", "주거 중심", "앞산공원 접근"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 대전 ──
  // ══════════════════════════════════════════════════════════════

  // ── 유성구 ──
  {
    id: "daejeon-bongmyeong",
    name: "봉명동",
    district: "유성구",
    city: "대전",
    lat: 36.3565,
    lng: 127.3492,
    noiseScore: 60,
    safetyScore: 78,
    convenienceScore: 83,
    overallScore: 74,
    population: "높음",
    subway: [],
    highlights: ["유성 번화가", "봉명동 먹자골목", "유성온천 인근", "젊은 층 밀집"],
  },
  {
    id: "daejeon-gungdong",
    name: "궁동",
    district: "유성구",
    city: "대전",
    lat: 36.3625,
    lng: 127.3449,
    noiseScore: 58,
    safetyScore: 75,
    convenienceScore: 80,
    overallScore: 71,
    population: "높음",
    subway: [],
    highlights: ["충남대 인근", "대학가", "먹자골목", "저렴한 월세", "젊은 분위기"],
  },

  // ── 대전 서구 ──
  {
    id: "daejeon-dunsan",
    name: "둔산동",
    district: "서구",
    city: "대전",
    lat: 36.3538,
    lng: 127.3837,
    noiseScore: 58,
    safetyScore: 82,
    convenienceScore: 90,
    overallScore: 77,
    population: "높음",
    subway: [],
    highlights: ["대전 행정중심", "갤러리아백화점", "둔산 상권", "시청", "법원"],
  },
  {
    id: "daejeon-tanbang",
    name: "탄방동",
    district: "서구",
    city: "대전",
    lat: 36.3502,
    lng: 127.3743,
    noiseScore: 65,
    safetyScore: 80,
    convenienceScore: 82,
    overallScore: 76,
    population: "보통",
    subway: [],
    highlights: ["둔산 인근", "갑천 산책로", "주거 중심", "학원가"],
  },

  // ── 대전 중구 ──
  {
    id: "daejeon-daeheung",
    name: "대흥동",
    district: "중구",
    city: "대전",
    lat: 36.3277,
    lng: 127.4215,
    noiseScore: 55,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 68,
    population: "보통",
    subway: [],
    highlights: ["대전역 인근", "대전 구도심", "성심당 본점", "문화예술의거리"],
  },
  {
    id: "daejeon-eunhaeng",
    name: "은행동",
    district: "중구",
    city: "대전",
    lat: 36.3286,
    lng: 127.4270,
    noiseScore: 52,
    safetyScore: 70,
    convenienceScore: 76,
    overallScore: 66,
    population: "보통",
    subway: [],
    highlights: ["중앙시장", "으능정이 거리", "대전 원도심", "재래시장"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 광주 ──
  // ══════════════════════════════════════════════════════════════

  // ── 광주 서구 ──
  {
    id: "gwangju-chipyeong",
    name: "치평동",
    district: "서구",
    city: "광주",
    lat: 35.1472,
    lng: 126.8508,
    noiseScore: 63,
    safetyScore: 78,
    convenienceScore: 85,
    overallScore: 75,
    population: "높음",
    subway: [],
    highlights: ["광주 상무지구", "상무 먹자골목", "갤러리아백화점", "도심 중심"],
  },
  {
    id: "gwangju-nongseong",
    name: "농성동",
    district: "서구",
    city: "광주",
    lat: 35.1527,
    lng: 126.8806,
    noiseScore: 62,
    safetyScore: 73,
    convenienceScore: 77,
    overallScore: 71,
    population: "보통",
    subway: ["농성역"],
    highlights: ["광주1호선", "광주역 인근", "양동시장", "구도심"],
  },

  // ── 광주 북구 ──
  {
    id: "gwangju-yongbong",
    name: "용봉동",
    district: "북구",
    city: "광주",
    lat: 35.1768,
    lng: 126.8947,
    noiseScore: 60,
    safetyScore: 74,
    convenienceScore: 78,
    overallScore: 71,
    population: "높음",
    subway: [],
    highlights: ["전남대 인근", "대학가", "먹자골목", "저렴한 월세"],
  },
  {
    id: "gwangju-unam",
    name: "운암동",
    district: "북구",
    city: "광주",
    lat: 35.1703,
    lng: 126.8650,
    noiseScore: 70,
    safetyScore: 76,
    convenienceScore: 75,
    overallScore: 74,
    population: "보통",
    subway: [],
    highlights: ["광주시립미술관", "주거 중심", "공원 많음", "중흥동 인근"],
  },

  // ── 광주 남구 ──
  {
    id: "gwangju-bongseon",
    name: "봉선동",
    district: "남구",
    city: "광주",
    lat: 35.1297,
    lng: 126.8919,
    noiseScore: 68,
    safetyScore: 78,
    convenienceScore: 80,
    overallScore: 75,
    population: "보통",
    subway: [],
    highlights: ["봉선동 카페거리", "주거 중심", "학원가", "교육 환경 좋음"],
  },
  {
    id: "gwangju-juwol",
    name: "주월동",
    district: "남구",
    city: "광주",
    lat: 35.1232,
    lng: 126.8831,
    noiseScore: 72,
    safetyScore: 80,
    convenienceScore: 77,
    overallScore: 76,
    population: "보통",
    subway: [],
    highlights: ["주월동 아파트단지", "봉선동 인근", "조용한 주거지", "교육 환경"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 울산 ──
  // ══════════════════════════════════════════════════════════════

  // ── 울산 남구 ──
  {
    id: "ulsan-samsan",
    name: "삼산동",
    district: "남구",
    city: "울산",
    lat: 35.5393,
    lng: 129.3385,
    noiseScore: 62,
    safetyScore: 80,
    convenienceScore: 85,
    overallScore: 76,
    population: "높음",
    subway: [],
    highlights: ["울산 행정중심", "롯데백화점", "삼산동 상권", "대형마트", "교통 편리"],
  },
  {
    id: "ulsan-dal",
    name: "달동",
    district: "남구",
    city: "울산",
    lat: 35.5340,
    lng: 129.3262,
    noiseScore: 58,
    safetyScore: 74,
    convenienceScore: 80,
    overallScore: 71,
    population: "높음",
    subway: [],
    highlights: ["달동 먹자골목", "삼산동 인근", "유흥가", "롯데마트 인근"],
  },

  // ── 울산 중구 ──
  {
    id: "ulsan-seongnam",
    name: "성남동",
    district: "중구",
    city: "울산",
    lat: 35.5573,
    lng: 129.3143,
    noiseScore: 55,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 68,
    population: "보통",
    subway: [],
    highlights: ["울산 구도심", "중앙시장", "문화의거리", "태화강 인근"],
  },
  {
    id: "ulsan-hakseong",
    name: "학성동",
    district: "중구",
    city: "울산",
    lat: 35.5585,
    lng: 129.3230,
    noiseScore: 60,
    safetyScore: 73,
    convenienceScore: 72,
    overallScore: 68,
    population: "낮음",
    subway: [],
    highlights: ["울산 원도심", "학성공원", "역사 유적", "태화강 산책"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 세종시 ──
  // ══════════════════════════════════════════════════════════════

  {
    id: "sejong-boram",
    name: "보람동",
    district: "보람동",
    city: "세종",
    lat: 36.5040,
    lng: 127.0000,
    noiseScore: 80,
    safetyScore: 85,
    convenienceScore: 78,
    overallScore: 81,
    population: "보통",
    subway: [],
    highlights: ["행정중심복합도시", "정부세종청사", "신축 아파트", "BRT", "공원 많음"],
  },
  {
    id: "sejong-naseong",
    name: "나성동",
    district: "나성동",
    city: "세종",
    lat: 36.5095,
    lng: 126.9940,
    noiseScore: 82,
    safetyScore: 86,
    convenienceScore: 76,
    overallScore: 81,
    population: "보통",
    subway: [],
    highlights: ["세종시청 인근", "중앙공원", "BRT", "교육 환경", "신도시"],
  },
  {
    id: "sejong-dodam",
    name: "도담동",
    district: "도담동",
    city: "세종",
    lat: 36.5150,
    lng: 127.0065,
    noiseScore: 81,
    safetyScore: 84,
    convenienceScore: 77,
    overallScore: 81,
    population: "보통",
    subway: [],
    highlights: ["세종호수공원 인근", "BRT", "복합커뮤니티센터", "신축 아파트"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 충청북도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 청주시 상당구 ──
  { id: "cheongju-sangdang-yongam", name: "용암동", district: "상당구", city: "청주", lat: 36.6178, lng: 127.5079, noiseScore: 75, safetyScore: 78, convenienceScore: 80, overallScore: 77, population: "높음", subway: [], highlights: ["청주 동남부 주거 중심", "대형마트", "학원가", "택지지구"] },
  { id: "cheongju-sangdang-seowon", name: "성안동", district: "상당구", city: "청주", lat: 36.6373, lng: 127.4895, noiseScore: 65, safetyScore: 72, convenienceScore: 85, overallScore: 74, population: "높음", subway: [], highlights: ["청주 구도심", "성안길 상권", "구청", "유동인구 많음"] },
  { id: "cheongju-sangdang-geumcheon", name: "금천동", district: "상당구", city: "청주", lat: 36.6235, lng: 127.5005, noiseScore: 72, safetyScore: 75, convenienceScore: 78, overallScore: 75, population: "높음", subway: [], highlights: ["주거 밀집", "학교 풍부", "교통 편리"] },

  // ── 청주시 서원구 ──
  { id: "cheongju-seowon-bokdae", name: "복대동", district: "서원구", city: "청주", lat: 36.6336, lng: 127.4493, noiseScore: 60, safetyScore: 72, convenienceScore: 90, overallScore: 75, population: "높음", subway: [], highlights: ["청주 서남부 중심상권", "현대백화점", "지웰시티", "터미널 인근"] },
  { id: "cheongju-seowon-sachang", name: "사창동", district: "서원구", city: "청주", lat: 36.6328, lng: 127.4646, noiseScore: 65, safetyScore: 75, convenienceScore: 85, overallScore: 75, population: "높음", subway: [], highlights: ["충북대 인근", "대학가 상권", "원룸 밀집"] },
  { id: "cheongju-seowon-suam", name: "수암골", district: "서원구", city: "청주", lat: 36.6285, lng: 127.4810, noiseScore: 80, safetyScore: 75, convenienceScore: 65, overallScore: 73, population: "낮음", subway: [], highlights: ["벽화마을", "관광지", "구도심"] },

  // ── 청주시 흥덕구 ──
  { id: "cheongju-heungdeok-gangseo", name: "강서동", district: "흥덕구", city: "청주", lat: 36.6498, lng: 127.4280, noiseScore: 70, safetyScore: 75, convenienceScore: 78, overallScore: 74, population: "보통", subway: [], highlights: ["강서지구", "택지개발", "주거 신도심"] },
  { id: "cheongju-heungdeok-bunpyeong", name: "분평동", district: "흥덕구", city: "청주", lat: 36.6155, lng: 127.4530, noiseScore: 73, safetyScore: 78, convenienceScore: 75, overallScore: 75, population: "높음", subway: [], highlights: ["주거지구", "학교 풍부", "분평지구"] },
  { id: "cheongju-heungdeok-okcheon", name: "옥산동", district: "흥덕구", city: "청주", lat: 36.6620, lng: 127.4015, noiseScore: 78, safetyScore: 75, convenienceScore: 65, overallScore: 73, population: "보통", subway: [], highlights: ["청주공항 인근", "산업단지", "조용한 주거지"] },

  // ── 청주시 청원구 ──
  { id: "cheongju-cheongwon-ochang", name: "오창읍", district: "청원구", city: "청주", lat: 36.7156, lng: 127.4426, noiseScore: 70, safetyScore: 75, convenienceScore: 80, overallScore: 75, population: "높음", subway: [], highlights: ["오창과학산업단지", "신축 아파트 단지", "교육환경 우수"] },
  { id: "cheongju-cheongwon-naesu", name: "내수읍", district: "청원구", city: "청주", lat: 36.7000, lng: 127.5345, noiseScore: 82, safetyScore: 78, convenienceScore: 60, overallScore: 73, population: "낮음", subway: [], highlights: ["전원형 주거", "농촌 인근", "조용한 환경"] },

  // ── 충주시 ──
  { id: "chungju-yeonsu", name: "연수동", district: "충주시", city: "충주", lat: 36.9928, lng: 127.9265, noiseScore: 70, safetyScore: 75, convenienceScore: 80, overallScore: 75, population: "높음", subway: [], highlights: ["충주 신시가지", "주거 중심", "학원가", "마트"] },
  { id: "chungju-bongbang", name: "봉방동", district: "충주시", city: "충주", lat: 36.9810, lng: 127.9275, noiseScore: 68, safetyScore: 72, convenienceScore: 78, overallScore: 73, population: "높음", subway: [], highlights: ["충주 구도심 인근", "주거·상업 혼재"] },
  { id: "chungju-yongtan", name: "용탄동", district: "충주시", city: "충주", lat: 36.9540, lng: 127.9210, noiseScore: 75, safetyScore: 75, convenienceScore: 72, overallScore: 74, population: "보통", subway: [], highlights: ["주거지", "남한강 인접"] },

  // ── 제천시 ──
  { id: "jecheon-jangrak", name: "장락동", district: "제천시", city: "제천", lat: 37.1372, lng: 128.2050, noiseScore: 73, safetyScore: 72, convenienceScore: 78, overallScore: 74, population: "높음", subway: [], highlights: ["제천 주거 중심", "장락택지지구", "학교 풍부"] },
  { id: "jecheon-cheongjeon", name: "청전동", district: "제천시", city: "제천", lat: 37.1308, lng: 128.1995, noiseScore: 68, safetyScore: 72, convenienceScore: 80, overallScore: 73, population: "높음", subway: [], highlights: ["제천 도심", "상권 밀집", "교통 편리"] },

  // ══════════════════════════════════════════════════════════════
  // ── 충청남도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 천안시 동남구 ──
  { id: "cheonan-dongnam-singbu", name: "신부동", district: "동남구", city: "천안", lat: 36.8203, lng: 127.1573, noiseScore: 55, safetyScore: 72, convenienceScore: 92, overallScore: 73, population: "높음", subway: ["천안역"], highlights: ["천안 최고 상권", "터미널 인근", "유동인구 매우 많음", "병원·관공서 밀집"] },
  { id: "cheonan-dongnam-cheongdang", name: "청당동", district: "동남구", city: "천안", lat: 36.7898, lng: 127.1640, noiseScore: 72, safetyScore: 78, convenienceScore: 75, overallScore: 75, population: "높음", subway: [], highlights: ["청당지구", "신축 아파트", "주거 환경 양호"] },
  { id: "cheonan-dongnam-mokcheon", name: "목천읍", district: "동남구", city: "천안", lat: 36.7635, lng: 127.2310, noiseScore: 82, safetyScore: 75, convenienceScore: 60, overallScore: 73, population: "낮음", subway: [], highlights: ["독립기념관", "전원형 주거", "교육환경"] },

  // ── 천안시 서북구 ──
  { id: "cheonan-seobuk-ssangyong", name: "쌍용동", district: "서북구", city: "천안", lat: 36.8095, lng: 127.1265, noiseScore: 68, safetyScore: 78, convenienceScore: 85, overallScore: 77, population: "높음", subway: ["쌍용역"], highlights: ["천안 서남부 주거 중심", "1호선", "마트·학원가"] },
  { id: "cheonan-seobuk-buldang", name: "불당동", district: "서북구", city: "천안", lat: 36.8235, lng: 127.1090, noiseScore: 72, safetyScore: 82, convenienceScore: 88, overallScore: 80, population: "높음", subway: [], highlights: ["천안 신도심", "고급 주거지", "학원가", "갤러리아백화점"] },
  { id: "cheonan-seobuk-seonghwan", name: "성환읍", district: "서북구", city: "천안", lat: 36.9152, lng: 127.1280, noiseScore: 78, safetyScore: 73, convenienceScore: 65, overallScore: 72, population: "보통", subway: ["성환역"], highlights: ["1호선", "남서울대 인근", "전원형 주거"] },

  // ── 아산시 ──
  { id: "asan-baebang", name: "배방읍", district: "아산시", city: "아산", lat: 36.7838, lng: 127.0470, noiseScore: 68, safetyScore: 78, convenienceScore: 82, overallScore: 76, population: "높음", subway: ["배방역"], highlights: ["1호선·SRT", "신축 아파트", "탕정 삼성디스플레이 인근"] },
  { id: "asan-tangjeong", name: "탕정면", district: "아산시", city: "아산", lat: 36.7785, lng: 127.0800, noiseScore: 72, safetyScore: 80, convenienceScore: 75, overallScore: 76, population: "높음", subway: ["탕정역"], highlights: ["삼성디스플레이", "신도시 개발", "직주근접"] },
  { id: "asan-onyang", name: "온양동", district: "아산시", city: "아산", lat: 36.7890, lng: 127.0040, noiseScore: 70, safetyScore: 75, convenienceScore: 82, overallScore: 76, population: "높음", subway: ["온양온천역"], highlights: ["온양온천", "아산 구도심", "관광지"] },

  // ── 공주시 ──
  { id: "gongju-sinkwan", name: "신관동", district: "공주시", city: "공주", lat: 36.4727, lng: 127.1230, noiseScore: 70, safetyScore: 75, convenienceScore: 80, overallScore: 75, population: "높음", subway: [], highlights: ["공주 신도심", "공주대 신관캠퍼스", "주거·상업 혼재"] },
  { id: "gongju-okryong", name: "옥룡동", district: "공주시", city: "공주", lat: 36.4498, lng: 127.1303, noiseScore: 75, safetyScore: 75, convenienceScore: 70, overallScore: 73, population: "보통", subway: [], highlights: ["공주 구도심", "공산성 인접", "역사 유적지"] },

  // ── 서산시 ──
  { id: "seosan-eupnae", name: "읍내동", district: "서산시", city: "서산", lat: 36.7846, lng: 126.4505, noiseScore: 65, safetyScore: 72, convenienceScore: 82, overallScore: 73, population: "높음", subway: [], highlights: ["서산 도심", "상권 중심", "터미널 인근"] },
  { id: "seosan-dongmun", name: "동문동", district: "서산시", city: "서산", lat: 36.7775, lng: 126.4583, noiseScore: 70, safetyScore: 75, convenienceScore: 76, overallScore: 74, population: "보통", subway: [], highlights: ["주거 밀집", "공원 인접", "조용한 편"] },

  // ── 당진시 ──
  { id: "dangjin-eupnae", name: "읍내동", district: "당진시", city: "당진", lat: 36.8930, lng: 126.6280, noiseScore: 65, safetyScore: 72, convenienceScore: 80, overallScore: 73, population: "높음", subway: [], highlights: ["당진 도심", "터미널 인근", "주거·상업 혼재"] },
  { id: "dangjin-songak", name: "송악읍", district: "당진시", city: "당진", lat: 36.9090, lng: 126.6920, noiseScore: 75, safetyScore: 73, convenienceScore: 65, overallScore: 71, population: "보통", subway: [], highlights: ["석문국가산단 인근", "공장 지역", "전원형 주거"] },

  // ── 보령시 ──
  { id: "boryeong-daecheon", name: "대천동", district: "보령시", city: "보령", lat: 36.3338, lng: 126.6068, noiseScore: 68, safetyScore: 73, convenienceScore: 78, overallScore: 73, population: "높음", subway: [], highlights: ["보령 도심", "대천해수욕장 인근", "관광지"] },
  { id: "boryeong-jugpo", name: "주포면", district: "보령시", city: "보령", lat: 36.3805, lng: 126.6175, noiseScore: 82, safetyScore: 75, convenienceScore: 60, overallScore: 72, population: "낮음", subway: [], highlights: ["전원형 주거", "농촌 환경", "조용함"] },

  // ── 논산시 ──
  { id: "nonsan-buchang", name: "부창동", district: "논산시", city: "논산", lat: 36.2030, lng: 127.0867, noiseScore: 70, safetyScore: 73, convenienceScore: 78, overallScore: 74, population: "높음", subway: ["논산역"], highlights: ["논산 도심", "상권 중심", "기차역 인근"] },
  { id: "nonsan-yeonmu", name: "연무읍", district: "논산시", city: "논산", lat: 36.1612, lng: 127.0720, noiseScore: 72, safetyScore: 75, convenienceScore: 70, overallScore: 72, population: "보통", subway: [], highlights: ["육군훈련소", "군 관련 인구 많음"] },

  // ══════════════════════════════════════════════════════════════
  // ── 강원특별자치도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 춘천시 ──
  { id: "chuncheon-hyoja", name: "효자동", district: "춘천시", city: "춘천", lat: 37.8654, lng: 127.7385, noiseScore: 60, safetyScore: 75, convenienceScore: 88, overallScore: 75, population: "높음", subway: ["춘천역"], highlights: ["춘천 도심 중심", "터미널·기차역 인접", "상권 밀집", "ITX-청춘"] },
  { id: "chuncheon-toegye", name: "퇴계동", district: "춘천시", city: "춘천", lat: 37.8530, lng: 127.7340, noiseScore: 65, safetyScore: 78, convenienceScore: 85, overallScore: 76, population: "높음", subway: ["남춘천역"], highlights: ["춘천 신도심", "현대백화점 인근", "주거·상업 혼재", "택지지구"] },
  { id: "chuncheon-seoksa", name: "석사동", district: "춘천시", city: "춘천", lat: 37.8755, lng: 127.7480, noiseScore: 70, safetyScore: 78, convenienceScore: 80, overallScore: 76, population: "높음", subway: [], highlights: ["석사지구", "강원대 인근", "학원가", "주거 밀집"] },
  { id: "chuncheon-onui", name: "온의동", district: "춘천시", city: "춘천", lat: 37.8590, lng: 127.7190, noiseScore: 72, safetyScore: 78, convenienceScore: 78, overallScore: 76, population: "높음", subway: [], highlights: ["주거 신도심", "공지천 인접", "신축 아파트"] },
  { id: "chuncheon-jungang", name: "조운동", district: "춘천시", city: "춘천", lat: 37.8810, lng: 127.7290, noiseScore: 62, safetyScore: 73, convenienceScore: 85, overallScore: 73, population: "보통", subway: [], highlights: ["춘천 구도심", "명동 상권", "닭갈비 골목"] },
  { id: "chuncheon-soyang", name: "소양동", district: "춘천시", city: "춘천", lat: 37.8895, lng: 127.7340, noiseScore: 75, safetyScore: 75, convenienceScore: 70, overallScore: 73, population: "보통", subway: [], highlights: ["소양강 인접", "조용한 주거지", "춘천 시청"] },

  // ── 원주시 ──
  { id: "wonju-myeongryun", name: "명륜동", district: "원주시", city: "원주", lat: 37.3500, lng: 127.9415, noiseScore: 60, safetyScore: 75, convenienceScore: 90, overallScore: 75, population: "높음", subway: [], highlights: ["원주 도심 중심", "터미널 인근", "상권 밀집", "유동인구 매우 많음"] },
  { id: "wonju-mujil", name: "무실동", district: "원주시", city: "원주", lat: 37.3340, lng: 127.9215, noiseScore: 70, safetyScore: 80, convenienceScore: 85, overallScore: 78, population: "높음", subway: [], highlights: ["원주 신도심", "택지지구", "신축 아파트", "학원가"] },
  { id: "wonju-tail", name: "단계동", district: "원주시", city: "원주", lat: 37.3625, lng: 127.9150, noiseScore: 68, safetyScore: 78, convenienceScore: 82, overallScore: 76, population: "높음", subway: [], highlights: ["주거 밀집", "단계택지", "학교 풍부"] },
  { id: "wonju-iljin", name: "일산동", district: "원주시", city: "원주", lat: 37.3450, lng: 127.9350, noiseScore: 65, safetyScore: 73, convenienceScore: 80, overallScore: 73, population: "보통", subway: [], highlights: ["원주 구도심", "전통 상권", "병원 밀집"] },
  { id: "wonju-bangok", name: "반곡동", district: "원주시", city: "원주", lat: 37.3160, lng: 127.9520, noiseScore: 75, safetyScore: 80, convenienceScore: 78, overallScore: 78, population: "높음", subway: ["만종역"], highlights: ["원주 혁신도시", "공공기관 이전", "신도시 개발", "건강보험심사평가원"] },
  { id: "wonju-bunchang", name: "봉산동", district: "원주시", city: "원주", lat: 37.3680, lng: 127.9405, noiseScore: 72, safetyScore: 75, convenienceScore: 75, overallScore: 74, population: "보통", subway: [], highlights: ["주거지", "봉산 인접", "조용한 편"] },

  // ── 강릉시 ──
  { id: "gangneung-gyo", name: "교동", district: "강릉시", city: "강릉", lat: 37.7610, lng: 128.8830, noiseScore: 65, safetyScore: 75, convenienceScore: 88, overallScore: 76, population: "높음", subway: ["강릉역"], highlights: ["강릉 도심 중심", "강릉역 KTX", "상권 밀집", "주거·상업 혼재"] },
  { id: "gangneung-okcheon", name: "옥천동", district: "강릉시", city: "강릉", lat: 37.7510, lng: 128.8945, noiseScore: 60, safetyScore: 73, convenienceScore: 85, overallScore: 73, population: "높음", subway: [], highlights: ["강릉 구도심", "전통시장", "유동인구 많음"] },
  { id: "gangneung-pohang", name: "포남동", district: "강릉시", city: "강릉", lat: 37.7635, lng: 128.9075, noiseScore: 70, safetyScore: 78, convenienceScore: 80, overallScore: 76, population: "높음", subway: [], highlights: ["주거 밀집", "포남택지지구", "학교 풍부"] },
  { id: "gangneung-gangmun", name: "강문동", district: "강릉시", city: "강릉", lat: 37.7935, lng: 128.9145, noiseScore: 78, safetyScore: 78, convenienceScore: 65, overallScore: 74, population: "낮음", subway: [], highlights: ["경포해변 인접", "관광지", "조용한 편"] },
  { id: "gangneung-jeodong", name: "저동", district: "강릉시", city: "강릉", lat: 37.7790, lng: 128.9015, noiseScore: 75, safetyScore: 75, convenienceScore: 72, overallScore: 74, population: "보통", subway: [], highlights: ["주거지", "안목해변 인접", "커피거리"] },
  { id: "gangneung-juge", name: "주문진읍", district: "강릉시", city: "강릉", lat: 37.8930, lng: 128.8265, noiseScore: 75, safetyScore: 73, convenienceScore: 70, overallScore: 73, population: "보통", subway: [], highlights: ["주문진항", "수산물 시장", "어촌 마을"] },

  // ── 속초시 ──
  { id: "sokcho-jungang", name: "조양동", district: "속초시", city: "속초", lat: 38.2065, lng: 128.5815, noiseScore: 68, safetyScore: 75, convenienceScore: 82, overallScore: 75, population: "높음", subway: [], highlights: ["속초 도심", "신축 아파트", "주거 중심"] },
  { id: "sokcho-dongmyeong", name: "동명동", district: "속초시", city: "속초", lat: 38.2115, lng: 128.5945, noiseScore: 70, safetyScore: 73, convenienceScore: 78, overallScore: 74, population: "보통", subway: [], highlights: ["속초항 인접", "동명항", "관광지"] },
  { id: "sokcho-gyo", name: "교동", district: "속초시", city: "속초", lat: 38.2050, lng: 128.5945, noiseScore: 65, safetyScore: 75, convenienceScore: 85, overallScore: 75, population: "높음", subway: [], highlights: ["속초 시청 인근", "상권 밀집", "주거 중심"] },
  { id: "sokcho-yeongnang", name: "영랑동", district: "속초시", city: "속초", lat: 38.2185, lng: 128.5825, noiseScore: 75, safetyScore: 78, convenienceScore: 70, overallScore: 74, population: "낮음", subway: [], highlights: ["영랑호 인접", "조용한 주거지", "산책로"] },

  // ── 동해시 ──
  { id: "donghae-cheongokdonghu", name: "천곡동", district: "동해시", city: "동해", lat: 37.5230, lng: 129.1140, noiseScore: 68, safetyScore: 75, convenienceScore: 82, overallScore: 75, population: "높음", subway: [], highlights: ["동해 도심", "주거·상업 중심", "상권 밀집"] },
  { id: "donghae-bukpyeong", name: "북평동", district: "동해시", city: "동해", lat: 37.4890, lng: 129.1325, noiseScore: 70, safetyScore: 73, convenienceScore: 75, overallScore: 73, population: "보통", subway: [], highlights: ["동해항 인접", "주거 밀집", "전통시장"] },
  { id: "donghae-mukho", name: "묵호동", district: "동해시", city: "동해", lat: 37.5470, lng: 129.1180, noiseScore: 75, safetyScore: 75, convenienceScore: 72, overallScore: 74, population: "보통", subway: ["묵호역"], highlights: ["묵호항", "어촌 마을", "관광지"] },

  // ── 삼척시 ──
  { id: "samcheok-jungang", name: "성내동", district: "삼척시", city: "삼척", lat: 37.4495, lng: 129.1655, noiseScore: 70, safetyScore: 75, convenienceScore: 78, overallScore: 74, population: "보통", subway: [], highlights: ["삼척 도심", "터미널 인접", "상권 중심"] },
  { id: "samcheok-jeongra", name: "정라동", district: "삼척시", city: "삼척", lat: 37.4380, lng: 129.1745, noiseScore: 75, safetyScore: 73, convenienceScore: 70, overallScore: 73, population: "보통", subway: [], highlights: ["삼척항 인접", "어항", "조용한 편"] },

  // ── 태백시 ──
  { id: "taebaek-hwangji", name: "황지동", district: "태백시", city: "태백", lat: 37.1638, lng: 128.9858, noiseScore: 78, safetyScore: 78, convenienceScore: 72, overallScore: 76, population: "보통", subway: [], highlights: ["태백 도심", "황지연못", "고지대"] },
  { id: "taebaek-jangseong", name: "장성동", district: "태백시", city: "태백", lat: 37.1245, lng: 128.9905, noiseScore: 82, safetyScore: 78, convenienceScore: 65, overallScore: 75, population: "낮음", subway: [], highlights: ["과거 탄광촌", "조용한 주거지", "산악 지형"] },

  // ── 홍천군 ──
  { id: "hongcheon-hongcheon", name: "홍천읍", district: "홍천군", city: "홍천", lat: 37.6915, lng: 127.8880, noiseScore: 75, safetyScore: 75, convenienceScore: 75, overallScore: 75, population: "보통", subway: [], highlights: ["홍천 중심지", "터미널", "주거·상업 중심"] },

  // ── 평창군 ──
  { id: "pyeongchang-pyeongchang", name: "평창읍", district: "평창군", city: "평창", lat: 37.3705, lng: 128.3905, noiseScore: 85, safetyScore: 80, convenienceScore: 60, overallScore: 75, population: "낮음", subway: [], highlights: ["평창 중심지", "산악 지역", "동계올림픽 개최지"] },

  // ══════════════════════════════════════════════════════════════
  // ── 제주시 ──
  // ══════════════════════════════════════════════════════════════

  {
    id: "jeju-yeondong",
    name: "연동",
    district: "연동",
    city: "제주",
    lat: 33.4889,
    lng: 126.4927,
    noiseScore: 58,
    safetyScore: 76,
    convenienceScore: 85,
    overallScore: 73,
    population: "높음",
    subway: [],
    highlights: ["제주 최대 상권", "누웨마루", "신라면세점", "관광객 밀집", "맛집 거리"],
  },
  {
    id: "jeju-nohyeong",
    name: "노형동",
    district: "노형동",
    city: "제주",
    lat: 33.4830,
    lng: 126.4768,
    noiseScore: 68,
    safetyScore: 78,
    convenienceScore: 80,
    overallScore: 75,
    population: "높음",
    subway: [],
    highlights: ["제주 신시가지", "아파트 밀집", "학원가", "이마트", "주거 중심"],
  },
  {
    id: "jeju-ido",
    name: "이도동",
    district: "이도동",
    city: "제주",
    lat: 33.5057,
    lng: 126.5290,
    noiseScore: 62,
    safetyScore: 74,
    convenienceScore: 78,
    overallScore: 71,
    population: "보통",
    subway: [],
    highlights: ["제주시청", "제주목관아", "구도심", "탑동 해변", "동문시장 인근"],
  },

  // ── 제주시 추가 ──
  { id: "jeju-aewol", name: "애월읍", district: "제주시", city: "제주", lat: 33.4655, lng: 126.3300, noiseScore: 80, safetyScore: 78, convenienceScore: 65, overallScore: 74, population: "보통", subway: [], highlights: ["애월해안도로", "카페 거리", "관광지", "한적한 마을"] },
  { id: "jeju-jocheon", name: "조천읍", district: "제주시", city: "제주", lat: 33.5360, lng: 126.6420, noiseScore: 82, safetyScore: 78, convenienceScore: 60, overallScore: 73, population: "낮음", subway: [], highlights: ["함덕해수욕장", "조용한 어촌", "이주민 많음"] },
  { id: "jeju-hallim", name: "한림읍", district: "제주시", city: "제주", lat: 33.4115, lng: 126.2685, noiseScore: 80, safetyScore: 75, convenienceScore: 65, overallScore: 73, population: "보통", subway: [], highlights: ["협재해수욕장", "관광 중심지", "한림항"] },
  { id: "jeju-samdo", name: "삼도동", district: "제주시", city: "제주", lat: 33.5135, lng: 126.5215, noiseScore: 65, safetyScore: 73, convenienceScore: 80, overallScore: 73, population: "높음", subway: [], highlights: ["제주 구도심", "원도심 재생사업", "역사 거리"] },

  // ── 서귀포시 ──
  { id: "seogwipo-jungang", name: "서홍동", district: "서귀포시", city: "서귀포", lat: 33.2540, lng: 126.5615, noiseScore: 70, safetyScore: 78, convenienceScore: 78, overallScore: 75, population: "높음", subway: [], highlights: ["서귀포 도심", "올레시장", "주거·상업 혼재"] },
  { id: "seogwipo-cheonji", name: "천지동", district: "서귀포시", city: "서귀포", lat: 33.2475, lng: 126.5605, noiseScore: 73, safetyScore: 76, convenienceScore: 76, overallScore: 75, population: "보통", subway: [], highlights: ["천지연폭포", "서귀포항 인접", "관광지"] },
  { id: "seogwipo-jungmun", name: "중문동", district: "서귀포시", city: "서귀포", lat: 33.2520, lng: 126.4180, noiseScore: 78, safetyScore: 80, convenienceScore: 70, overallScore: 76, population: "보통", subway: [], highlights: ["중문관광단지", "리조트 밀집", "고급 숙박"] },
  { id: "seogwipo-seongsan", name: "성산읍", district: "서귀포시", city: "서귀포", lat: 33.4380, lng: 126.9100, noiseScore: 82, safetyScore: 80, convenienceScore: 60, overallScore: 74, population: "낮음", subway: [], highlights: ["성산일출봉", "관광 명소", "어촌 마을"] },

  // ══════════════════════════════════════════════════════════════
  // ── 전라북도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 전주시 완산구 ──
  { id: "jeonju-wansan-seosin", name: "서신동", district: "완산구", city: "전주", lat: 35.8245, lng: 127.1188, noiseScore: 65, safetyScore: 75, convenienceScore: 88, overallScore: 76, population: "높음", subway: [], highlights: ["전주 신도심", "롯데백화점 인근", "상권 밀집", "주거·상업 혼재"] },
  { id: "jeonju-wansan-hyoja", name: "효자동", district: "완산구", city: "전주", lat: 35.8167, lng: 127.0972, noiseScore: 68, safetyScore: 78, convenienceScore: 85, overallScore: 77, population: "높음", subway: [], highlights: ["전주 시청 인근", "신축 아파트", "혁신도시 일부"] },
  { id: "jeonju-wansan-jungin", name: "중인동", district: "완산구", city: "전주", lat: 35.7805, lng: 127.0855, noiseScore: 80, safetyScore: 75, convenienceScore: 65, overallScore: 73, population: "낮음", subway: [], highlights: ["전주 외곽", "조용한 주거지", "자연환경"] },
  { id: "jeonju-wansan-pungnam", name: "풍남동", district: "완산구", city: "전주", lat: 35.8155, lng: 127.1465, noiseScore: 70, safetyScore: 73, convenienceScore: 80, overallScore: 74, population: "보통", subway: [], highlights: ["전주한옥마을", "관광지", "역사 지구"] },

  // ── 전주시 덕진구 ──
  { id: "jeonju-deokjin-songcheon", name: "송천동", district: "덕진구", city: "전주", lat: 35.8597, lng: 127.1248, noiseScore: 70, safetyScore: 78, convenienceScore: 82, overallScore: 77, population: "높음", subway: [], highlights: ["전주 북부 주거 중심", "택지지구", "학원가"] },
  { id: "jeonju-deokjin-jeonmi", name: "전미동", district: "덕진구", city: "전주", lat: 35.8855, lng: 127.1185, noiseScore: 72, safetyScore: 76, convenienceScore: 75, overallScore: 74, population: "보통", subway: [], highlights: ["주거 신도심", "전북혁신도시 인접"] },
  { id: "jeonju-deokjin-deokjin", name: "덕진동", district: "덕진구", city: "전주", lat: 35.8455, lng: 127.1318, noiseScore: 68, safetyScore: 73, convenienceScore: 78, overallScore: 73, population: "보통", subway: [], highlights: ["전북대 인근", "대학가", "원룸 밀집"] },

  // ── 군산시 ──
  { id: "gunsan-suchang", name: "수송동", district: "군산시", city: "군산", lat: 35.9745, lng: 126.7228, noiseScore: 70, safetyScore: 78, convenienceScore: 85, overallScore: 78, population: "높음", subway: [], highlights: ["군산 신도심", "상권 중심", "주거·상업 혼재"] },
  { id: "gunsan-mirong", name: "미룡동", district: "군산시", city: "군산", lat: 35.9510, lng: 126.6848, noiseScore: 72, safetyScore: 78, convenienceScore: 75, overallScore: 75, population: "보통", subway: [], highlights: ["군산대 인근", "택지지구"] },
  { id: "gunsan-jungang", name: "월명동", district: "군산시", city: "군산", lat: 35.9740, lng: 126.7060, noiseScore: 65, safetyScore: 73, convenienceScore: 78, overallScore: 72, population: "보통", subway: [], highlights: ["군산 구도심", "근대문화유산 거리", "관광지"] },

  // ── 익산시 ──
  { id: "iksan-yeongdeung", name: "영등동", district: "익산시", city: "익산", lat: 35.9608, lng: 126.9700, noiseScore: 65, safetyScore: 75, convenienceScore: 88, overallScore: 76, population: "높음", subway: ["익산역"], highlights: ["익산 도심", "KTX 익산역", "상권 밀집", "터미널"] },
  { id: "iksan-baekgu", name: "어양동", district: "익산시", city: "익산", lat: 35.9755, lng: 126.9555, noiseScore: 70, safetyScore: 78, convenienceScore: 80, overallScore: 76, population: "높음", subway: [], highlights: ["주거 신도심", "택지지구", "학원가"] },

  // ── 정읍시 ──
  { id: "jeongeup-yeonji", name: "연지동", district: "정읍시", city: "정읍", lat: 35.5705, lng: 126.8540, noiseScore: 70, safetyScore: 75, convenienceScore: 78, overallScore: 74, population: "보통", subway: [], highlights: ["정읍 도심", "주거·상업 중심"] },

  // ══════════════════════════════════════════════════════════════
  // ── 전라남도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 목포시 ──
  { id: "mokpo-hadang", name: "하당동", district: "목포시", city: "목포", lat: 34.7990, lng: 126.4115, noiseScore: 65, safetyScore: 78, convenienceScore: 88, overallScore: 77, population: "높음", subway: [], highlights: ["목포 신도심", "상권 밀집", "주거·상업 혼재", "롯데마트"] },
  { id: "mokpo-bukgyo", name: "북교동", district: "목포시", city: "목포", lat: 34.7945, lng: 126.3920, noiseScore: 68, safetyScore: 73, convenienceScore: 75, overallScore: 72, population: "보통", subway: [], highlights: ["목포 구도심", "근대역사문화공간", "유달산 인접"] },
  { id: "mokpo-yongdang", name: "용당동", district: "목포시", city: "목포", lat: 34.7830, lng: 126.4070, noiseScore: 72, safetyScore: 75, convenienceScore: 72, overallScore: 73, population: "보통", subway: [], highlights: ["주거지", "목포대 인근", "조용한 편"] },

  // ── 여수시 ──
  { id: "yeosu-yeocheon", name: "여천동", district: "여수시", city: "여수", lat: 34.7635, lng: 127.6675, noiseScore: 68, safetyScore: 78, convenienceScore: 85, overallScore: 77, population: "높음", subway: [], highlights: ["여수 신도심", "여천역", "상권 밀집", "주거 중심"] },
  { id: "yeosu-mansung", name: "만성리", district: "여수시", city: "여수", lat: 34.7570, lng: 127.7340, noiseScore: 78, safetyScore: 75, convenienceScore: 65, overallScore: 73, population: "낮음", subway: [], highlights: ["검은모래해변", "조용한 해변마을"] },
  { id: "yeosu-dolsan", name: "돌산읍", district: "여수시", city: "여수", lat: 34.6745, lng: 127.7665, noiseScore: 80, safetyScore: 78, convenienceScore: 65, overallScore: 74, population: "보통", subway: [], highlights: ["돌산대교", "갓김치", "관광지"] },

  // ── 순천시 ──
  { id: "suncheon-yeonhyang", name: "연향동", district: "순천시", city: "순천", lat: 34.9510, lng: 127.5125, noiseScore: 70, safetyScore: 80, convenienceScore: 88, overallScore: 79, population: "높음", subway: [], highlights: ["순천 신도심", "롯데마트", "상권 밀집", "주거 중심"] },
  { id: "suncheon-jungap", name: "중앙동", district: "순천시", city: "순천", lat: 34.9495, lng: 127.4870, noiseScore: 65, safetyScore: 75, convenienceScore: 80, overallScore: 73, population: "보통", subway: [], highlights: ["순천 구도심", "터미널", "전통시장"] },
  { id: "suncheon-haeryong", name: "해룡면", district: "순천시", city: "순천", lat: 34.9080, lng: 127.5340, noiseScore: 75, safetyScore: 80, convenienceScore: 75, overallScore: 77, population: "높음", subway: [], highlights: ["신대지구", "신축 아파트", "택지개발", "광양 인접"] },

  // ── 광양시 ──
  { id: "gwangyang-jungma", name: "중마동", district: "광양시", city: "광양", lat: 34.9395, lng: 127.6993, noiseScore: 68, safetyScore: 80, convenienceScore: 85, overallScore: 78, population: "높음", subway: [], highlights: ["광양 신도심", "POSCO 직주근접", "상권 밀집"] },
  { id: "gwangyang-okgok", name: "옥곡면", district: "광양시", city: "광양", lat: 34.9700, lng: 127.7140, noiseScore: 80, safetyScore: 76, convenienceScore: 65, overallScore: 74, population: "낮음", subway: [], highlights: ["전원형 주거", "조용한 환경"] },

  // ── 나주시 ──
  { id: "naju-bitgaram", name: "빛가람동", district: "나주시", city: "나주", lat: 35.0185, lng: 126.7900, noiseScore: 75, safetyScore: 82, convenienceScore: 80, overallScore: 79, population: "높음", subway: [], highlights: ["광주전남공동혁신도시", "공공기관 이전", "신도시 개발", "한국전력"] },
  { id: "naju-songwol", name: "송월동", district: "나주시", city: "나주", lat: 35.0320, lng: 126.7115, noiseScore: 70, safetyScore: 75, convenienceScore: 75, overallScore: 73, population: "보통", subway: [], highlights: ["나주 도심", "터미널 인근"] },

  // ══════════════════════════════════════════════════════════════
  // ── 경상북도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 포항시 북구 ──
  { id: "pohang-buk-yangduk", name: "양덕동", district: "북구", city: "포항", lat: 36.0780, lng: 129.3855, noiseScore: 65, safetyScore: 78, convenienceScore: 88, overallScore: 77, population: "높음", subway: [], highlights: ["포항 북부 신도심", "이마트", "상권 밀집", "주거 중심"] },
  { id: "pohang-buk-jangsung", name: "장성동", district: "북구", city: "포항", lat: 36.0610, lng: 129.3735, noiseScore: 70, safetyScore: 78, convenienceScore: 80, overallScore: 76, population: "높음", subway: [], highlights: ["주거 밀집", "택지지구", "학원가"] },
  { id: "pohang-buk-uchang", name: "우창동", district: "북구", city: "포항", lat: 36.0398, lng: 129.3632, noiseScore: 65, safetyScore: 75, convenienceScore: 82, overallScore: 74, population: "높음", subway: [], highlights: ["포항 도심", "포항역 인근", "상권 중심"] },
  { id: "pohang-buk-songra", name: "송라면", district: "북구", city: "포항", lat: 36.1850, lng: 129.4050, noiseScore: 82, safetyScore: 75, convenienceScore: 60, overallScore: 72, population: "낮음", subway: [], highlights: ["내연산", "전원형 주거"] },

  // ── 포항시 남구 ──
  { id: "pohang-nam-jecheol", name: "제철동", district: "남구", city: "포항", lat: 36.0123, lng: 129.3700, noiseScore: 60, safetyScore: 78, convenienceScore: 80, overallScore: 73, population: "높음", subway: [], highlights: ["POSCO 인접", "철강공단", "직주근접"] },
  { id: "pohang-nam-ojeon", name: "오천읍", district: "남구", city: "포항", lat: 35.9755, lng: 129.4035, noiseScore: 72, safetyScore: 78, convenienceScore: 78, overallScore: 76, population: "높음", subway: [], highlights: ["오천지구", "신축 아파트", "주거 신도심"] },
  { id: "pohang-nam-guryongpo", name: "구룡포읍", district: "남구", city: "포항", lat: 35.9870, lng: 129.5535, noiseScore: 80, safetyScore: 75, convenienceScore: 65, overallScore: 73, population: "낮음", subway: [], highlights: ["구룡포항", "과메기", "어촌"] },

  // ── 경주시 ──
  { id: "gyeongju-yonggang", name: "용강동", district: "경주시", city: "경주", lat: 35.8650, lng: 129.2270, noiseScore: 68, safetyScore: 78, convenienceScore: 82, overallScore: 76, population: "높음", subway: [], highlights: ["경주 도심", "주거 중심", "상권 밀집"] },
  { id: "gyeongju-hwangnam", name: "황남동", district: "경주시", city: "경주", lat: 35.8345, lng: 129.2155, noiseScore: 78, safetyScore: 76, convenienceScore: 72, overallScore: 75, population: "보통", subway: [], highlights: ["경주 한옥마을", "황리단길", "관광지"] },
  { id: "gyeongju-bomun", name: "보문동", district: "경주시", city: "경주", lat: 35.8420, lng: 129.2650, noiseScore: 82, safetyScore: 80, convenienceScore: 70, overallScore: 77, population: "낮음", subway: [], highlights: ["보문관광단지", "리조트 밀집", "관광지"] },

  // ── 안동시 ──
  { id: "andong-okdong", name: "옥동", district: "안동시", city: "안동", lat: 36.5575, lng: 128.7090, noiseScore: 70, safetyScore: 78, convenienceScore: 82, overallScore: 77, population: "높음", subway: [], highlights: ["안동 신도심", "택지지구", "주거 중심"] },
  { id: "andong-songhyeon", name: "송현동", district: "안동시", city: "안동", lat: 36.5615, lng: 128.7240, noiseScore: 68, safetyScore: 75, convenienceScore: 80, overallScore: 74, population: "보통", subway: [], highlights: ["주거 밀집", "안동 시청 인접"] },
  { id: "andong-pungcheon", name: "풍천면", district: "안동시", city: "안동", lat: 36.5510, lng: 128.5215, noiseScore: 80, safetyScore: 80, convenienceScore: 75, overallScore: 78, population: "보통", subway: [], highlights: ["경북도청 신도시", "공공기관 이전", "신도시 개발"] },

  // ── 구미시 ──
  { id: "gumi-songjeong", name: "송정동", district: "구미시", city: "구미", lat: 36.1175, lng: 128.3445, noiseScore: 65, safetyScore: 78, convenienceScore: 88, overallScore: 77, population: "높음", subway: [], highlights: ["구미 도심", "터미널 인근", "상권 중심"] },
  { id: "gumi-okgye", name: "옥계동", district: "구미시", city: "구미", lat: 36.1495, lng: 128.4290, noiseScore: 68, safetyScore: 78, convenienceScore: 82, overallScore: 76, population: "높음", subway: [], highlights: ["구미 동부", "주거 신도심", "삼성·LG 직주근접"] },
  { id: "gumi-indong", name: "인동동", district: "구미시", city: "구미", lat: 36.1105, lng: 128.4180, noiseScore: 70, safetyScore: 78, convenienceScore: 80, overallScore: 76, population: "높음", subway: [], highlights: ["구미 동부 주거", "택지지구", "공단 인접"] },
  { id: "gumi-gongdan", name: "공단동", district: "구미시", city: "구미", lat: 36.1075, lng: 128.3655, noiseScore: 55, safetyScore: 75, convenienceScore: 78, overallScore: 70, population: "보통", subway: [], highlights: ["구미국가산단", "직주근접", "공장 지역"] },

  // ── 경산시 ──
  { id: "gyeongsan-jungang", name: "중방동", district: "경산시", city: "경산", lat: 35.8270, lng: 128.7415, noiseScore: 65, safetyScore: 78, convenienceScore: 85, overallScore: 76, population: "높음", subway: ["경산역"], highlights: ["경산 도심", "1호선 연장", "주거·상업 중심"] },
  { id: "gyeongsan-jincheon", name: "진량읍", district: "경산시", city: "경산", lat: 35.8650, lng: 128.8000, noiseScore: 72, safetyScore: 76, convenienceScore: 72, overallScore: 73, population: "보통", subway: [], highlights: ["경산 동부", "산업단지 인접", "주거 신도심"] },
  { id: "gyeongsan-okgok", name: "옥곡동", district: "경산시", city: "경산", lat: 35.8190, lng: 128.7580, noiseScore: 68, safetyScore: 78, convenienceScore: 80, overallScore: 75, population: "높음", subway: [], highlights: ["대구 인접", "베드타운", "신축 아파트"] },

  // ══════════════════════════════════════════════════════════════
  // ── 경상남도 ──
  // ══════════════════════════════════════════════════════════════

  // ── 창원시 의창구 ──
  { id: "changwon-uichang-yongho", name: "용호동", district: "의창구", city: "창원", lat: 35.2400, lng: 128.6855, noiseScore: 60, safetyScore: 80, convenienceScore: 92, overallScore: 78, population: "높음", subway: [], highlights: ["창원 도심", "정우상가", "상권 밀집", "행정·상업 중심"] },
  { id: "changwon-uichang-bukmyeon", name: "북면", district: "의창구", city: "창원", lat: 35.3200, lng: 128.6450, noiseScore: 80, safetyScore: 78, convenienceScore: 70, overallScore: 76, population: "보통", subway: [], highlights: ["북면온천", "전원형 주거", "신도시 개발"] },

  // ── 창원시 성산구 ──
  { id: "changwon-seongsan-sangnam", name: "상남동", district: "성산구", city: "창원", lat: 35.2275, lng: 128.6810, noiseScore: 50, safetyScore: 78, convenienceScore: 95, overallScore: 75, population: "높음", subway: [], highlights: ["창원 최대 상권", "유흥가", "직장인 밀집", "야간 유동인구 많음"] },
  { id: "changwon-seongsan-banglim", name: "반림동", district: "성산구", city: "창원", lat: 35.2410, lng: 128.6963, noiseScore: 70, safetyScore: 80, convenienceScore: 85, overallScore: 78, population: "높음", subway: [], highlights: ["주거 신도심", "트리비앙", "신축 아파트"] },

  // ── 창원시 마산회원구 ──
  { id: "changwon-masan-haeun", name: "내서읍", district: "마산회원구", city: "창원", lat: 35.2510, lng: 128.5345, noiseScore: 70, safetyScore: 78, convenienceScore: 80, overallScore: 76, population: "높음", subway: [], highlights: ["내서지구", "택지개발", "주거 신도심"] },
  { id: "changwon-masan-yangdeok", name: "양덕동", district: "마산회원구", city: "창원", lat: 35.2300, lng: 128.5805, noiseScore: 65, safetyScore: 75, convenienceScore: 82, overallScore: 74, population: "높음", subway: [], highlights: ["마산 신도심", "롯데마트", "주거·상업 혼재"] },

  // ── 진주시 ──
  { id: "jinju-pyeonggeo", name: "평거동", district: "진주시", city: "진주", lat: 35.1925, lng: 128.0790, noiseScore: 68, safetyScore: 80, convenienceScore: 88, overallScore: 79, population: "높음", subway: [], highlights: ["진주 신도심", "이마트", "주거·상업 중심", "택지지구"] },
  { id: "jinju-cheongam", name: "초전동", district: "진주시", city: "진주", lat: 35.2095, lng: 128.0995, noiseScore: 72, safetyScore: 80, convenienceScore: 80, overallScore: 77, population: "높음", subway: [], highlights: ["혁신도시", "공공기관", "신도시 개발"] },
  { id: "jinju-sangbong", name: "상봉동", district: "진주시", city: "진주", lat: 35.1865, lng: 128.0925, noiseScore: 65, safetyScore: 75, convenienceScore: 80, overallScore: 73, population: "보통", subway: [], highlights: ["진주 구도심", "전통 상권", "진주성 인근"] },

  // ── 김해시 ──
  { id: "gimhae-naeoe", name: "내외동", district: "김해시", city: "김해", lat: 35.2310, lng: 128.8750, noiseScore: 65, safetyScore: 78, convenienceScore: 88, overallScore: 77, population: "높음", subway: ["수로왕릉역"], highlights: ["김해 도심", "부산김해경전철", "상권 밀집"] },
  { id: "gimhae-jangyu", name: "장유동", district: "김해시", city: "김해", lat: 35.1985, lng: 128.8055, noiseScore: 68, safetyScore: 80, convenienceScore: 82, overallScore: 77, population: "높음", subway: [], highlights: ["장유 신도심", "신축 아파트", "주거 중심", "대형마트"] },
  { id: "gimhae-juchon", name: "주촌면", district: "김해시", city: "김해", lat: 35.2440, lng: 128.8390, noiseScore: 72, safetyScore: 78, convenienceScore: 75, overallScore: 75, population: "보통", subway: [], highlights: ["주촌선천지구", "신축 아파트", "신도시 개발"] },

  // ── 양산시 ──
  { id: "yangsan-mulgeum", name: "물금읍", district: "양산시", city: "양산", lat: 35.2980, lng: 128.9890, noiseScore: 68, safetyScore: 80, convenienceScore: 85, overallScore: 78, population: "높음", subway: ["양산역", "남양산역"], highlights: ["양산 신도시", "2호선", "주거 중심", "상권 밀집"] },
  { id: "yangsan-dong", name: "동면", district: "양산시", city: "양산", lat: 35.3540, lng: 129.0185, noiseScore: 75, safetyScore: 80, convenienceScore: 75, overallScore: 77, population: "높음", subway: [], highlights: ["사송신도시", "신축 아파트", "택지개발"] },
  { id: "yangsan-jungang", name: "중앙동", district: "양산시", city: "양산", lat: 35.3330, lng: 129.0388, noiseScore: 65, safetyScore: 75, convenienceScore: 80, overallScore: 73, population: "보통", subway: ["양산역"], highlights: ["양산 구도심", "터미널 인근"] },

  // ── 거제시 ──
  { id: "geoje-okpo", name: "옥포동", district: "거제시", city: "거제", lat: 34.8830, lng: 128.6940, noiseScore: 60, safetyScore: 75, convenienceScore: 82, overallScore: 73, population: "높음", subway: [], highlights: ["대우조선해양", "조선소 직주근접", "상권 밀집"] },
  { id: "geoje-gohyeon", name: "고현동", district: "거제시", city: "거제", lat: 34.8845, lng: 128.6258, noiseScore: 65, safetyScore: 78, convenienceScore: 88, overallScore: 77, population: "높음", subway: [], highlights: ["거제 도심", "터미널", "상권 중심"] },
  { id: "geoje-sinhyeon", name: "상문동", district: "거제시", city: "거제", lat: 34.8760, lng: 128.6360, noiseScore: 72, safetyScore: 80, convenienceScore: 82, overallScore: 78, population: "높음", subway: [], highlights: ["주거 신도심", "신축 아파트"] },

  // ── 통영시 ──
  { id: "tongyeong-mubun", name: "무전동", district: "통영시", city: "통영", lat: 34.8645, lng: 128.4060, noiseScore: 68, safetyScore: 78, convenienceScore: 82, overallScore: 76, population: "높음", subway: [], highlights: ["통영 도심", "주거·상업 중심"] },
  { id: "tongyeong-bongpyeong", name: "봉평동", district: "통영시", city: "통영", lat: 34.8488, lng: 128.4160, noiseScore: 70, safetyScore: 75, convenienceScore: 75, overallScore: 73, population: "보통", subway: [], highlights: ["통영케이블카 인근", "관광지", "조용한 편"] },

  // ══════════════════════════════════════════════════════════════
  // ── 서울 추가 (중랑구·성북구·강북구·도봉구·금천구) ──
  // ══════════════════════════════════════════════════════════════

  // ── 중랑구 ──
  {
    id: "seoul-myeonmok",
    name: "면목동",
    district: "중랑구",
    city: "서울",
    lat: 37.5838,
    lng: 127.0845,
    noiseScore: 72,
    safetyScore: 70,
    convenienceScore: 68,
    overallScore: 70,
    population: "높음",
    subway: ["면목역"],
    highlights: ["중랑천", "주거 밀집", "재래시장"],
  },
  {
    id: "seoul-sangbong",
    name: "상봉동",
    district: "중랑구",
    city: "서울",
    lat: 37.5967,
    lng: 127.0854,
    noiseScore: 74,
    safetyScore: 72,
    convenienceScore: 70,
    overallScore: 72,
    population: "보통",
    subway: ["상봉역", "망우역"],
    highlights: ["상봉터미널", "중랑천 산책로", "주거지"],
  },
  {
    id: "seoul-mangu",
    name: "망우동",
    district: "중랑구",
    city: "서울",
    lat: 37.5986,
    lng: 127.0932,
    noiseScore: 78,
    safetyScore: 71,
    convenienceScore: 62,
    overallScore: 70,
    population: "보통",
    subway: ["망우역"],
    highlights: ["망우산", "조용한 주거지", "자연환경"],
  },

  // ── 성북구 ──
  {
    id: "seoul-gireum",
    name: "길음동",
    district: "성북구",
    city: "서울",
    lat: 37.6035,
    lng: 127.0245,
    noiseScore: 72,
    safetyScore: 73,
    convenienceScore: 72,
    overallScore: 72,
    population: "높음",
    subway: ["길음역"],
    highlights: ["미아리고개", "주거 밀집", "재래시장", "대학 인근"],
  },
  {
    id: "seoul-jeongneung",
    name: "정릉동",
    district: "성북구",
    city: "서울",
    lat: 37.6103,
    lng: 126.9597,
    noiseScore: 80,
    safetyScore: 74,
    convenienceScore: 62,
    overallScore: 72,
    population: "보통",
    subway: [],
    highlights: ["국민대학교", "북한산 인근", "조용한 주거지"],
  },
  {
    id: "seoul-donam",
    name: "돈암동",
    district: "성북구",
    city: "서울",
    lat: 37.5922,
    lng: 127.0180,
    noiseScore: 73,
    safetyScore: 72,
    convenienceScore: 70,
    overallScore: 72,
    population: "높음",
    subway: ["돈암역", "성신여대입구역"],
    highlights: ["성신여대", "고려대 인근", "주거지"],
  },

  // ── 강북구 ──
  {
    id: "seoul-suyu",
    name: "수유동",
    district: "강북구",
    city: "서울",
    lat: 37.6395,
    lng: 127.0253,
    noiseScore: 75,
    safetyScore: 72,
    convenienceScore: 68,
    overallScore: 72,
    population: "높음",
    subway: ["수유역"],
    highlights: ["북한산 등산로", "수유시장", "주거지"],
  },
  {
    id: "seoul-mia",
    name: "미아동",
    district: "강북구",
    city: "서울",
    lat: 37.6255,
    lng: 127.0280,
    noiseScore: 73,
    safetyScore: 70,
    convenienceScore: 67,
    overallScore: 70,
    population: "높음",
    subway: ["미아역", "미아사거리역"],
    highlights: ["재래시장", "주거 밀집", "길음뉴타운 인근"],
  },
  {
    id: "seoul-beon",
    name: "번동",
    district: "강북구",
    city: "서울",
    lat: 37.6340,
    lng: 127.0345,
    noiseScore: 76,
    safetyScore: 71,
    convenienceScore: 63,
    overallScore: 70,
    population: "보통",
    subway: [],
    highlights: ["북한산 인근", "조용한 주거지", "자연환경"],
  },

  // ── 도봉구 ──
  {
    id: "seoul-changdong",
    name: "창동",
    district: "도봉구",
    city: "서울",
    lat: 37.6534,
    lng: 127.0472,
    noiseScore: 72,
    safetyScore: 74,
    convenienceScore: 70,
    overallScore: 72,
    population: "높음",
    subway: ["창동역"],
    highlights: ["창동역 환승", "대형마트", "주거지", "창동 아레나(예정)"],
  },
  {
    id: "seoul-banghak",
    name: "방학동",
    district: "도봉구",
    city: "서울",
    lat: 37.6624,
    lng: 127.0392,
    noiseScore: 78,
    safetyScore: 75,
    convenienceScore: 65,
    overallScore: 73,
    population: "보통",
    subway: ["방학역"],
    highlights: ["도봉산 인근", "조용한 주거지", "공원 많음"],
  },
  {
    id: "seoul-ssangmun",
    name: "쌍문동",
    district: "도봉구",
    city: "서울",
    lat: 37.6485,
    lng: 127.0345,
    noiseScore: 75,
    safetyScore: 73,
    convenienceScore: 66,
    overallScore: 71,
    population: "보통",
    subway: ["쌍문역"],
    highlights: ["주거 위주", "학교 밀집", "조용한 동네"],
  },

  // ── 금천구 ──
  {
    id: "seoul-gasan",
    name: "가산동",
    district: "금천구",
    city: "서울",
    lat: 37.4780,
    lng: 126.8820,
    noiseScore: 62,
    safetyScore: 72,
    convenienceScore: 78,
    overallScore: 71,
    population: "높음",
    subway: ["가산디지털단지역"],
    highlights: ["가산디지털단지", "IT기업", "아울렛", "직주근접"],
  },
  {
    id: "seoul-doksan",
    name: "독산동",
    district: "금천구",
    city: "서울",
    lat: 37.4678,
    lng: 126.8953,
    noiseScore: 68,
    safetyScore: 68,
    convenienceScore: 65,
    overallScore: 67,
    population: "높음",
    subway: ["독산역"],
    highlights: ["주거 밀집", "재래시장", "금천구청 인근"],
  },
  {
    id: "seoul-siheung",
    name: "시흥동",
    district: "금천구",
    city: "서울",
    lat: 37.4553,
    lng: 126.9085,
    noiseScore: 72,
    safetyScore: 67,
    convenienceScore: 60,
    overallScore: 66,
    population: "보통",
    subway: [],
    highlights: ["관악산 인근", "주거지", "조용한 편"],
  },

  // ── 강남구 추가 ──
  { id: "gangnam-sinsa", name: "신사동", district: "강남구", city: "서울", lat: 37.5238, lng: 127.0236, noiseScore: 50, safetyScore: 78, convenienceScore: 95, overallScore: 76, population: "높음", subway: ["신사역", "압구정역"], highlights: ["가로수길", "카페·맛집", "유동인구 많음", "고급 상권"] },
  { id: "gangnam-apgujeong", name: "압구정동", district: "강남구", city: "서울", lat: 37.5273, lng: 127.0285, noiseScore: 60, safetyScore: 85, convenienceScore: 90, overallScore: 80, population: "보통", subway: ["압구정역", "압구정로데오역"], highlights: ["고급 주거지", "로데오거리", "성형외과 밀집", "한강공원 인접"] },
  { id: "gangnam-cheongdam", name: "청담동", district: "강남구", city: "서울", lat: 37.5244, lng: 127.0475, noiseScore: 62, safetyScore: 88, convenienceScore: 88, overallScore: 82, population: "보통", subway: ["청담역"], highlights: ["명품 거리", "고급 주거지", "갤러리·카페", "연예기획사 밀집"] },
  { id: "gangnam-dogok", name: "도곡동", district: "강남구", city: "서울", lat: 37.4884, lng: 127.0463, noiseScore: 72, safetyScore: 82, convenienceScore: 80, overallScore: 78, population: "보통", subway: ["매봉역", "도곡역"], highlights: ["타워팰리스", "조용한 주거지", "학군 우수", "양재천 인접"] },
  { id: "gangnam-gaepo", name: "개포동", district: "강남구", city: "서울", lat: 37.4789, lng: 127.0504, noiseScore: 75, safetyScore: 80, convenienceScore: 75, overallScore: 77, population: "보통", subway: ["개포디지털단지역", "대모산입구역"], highlights: ["재건축 활발", "학군 우수", "대모산 인접", "주거환경 양호"] },
  { id: "gangnam-suseo", name: "수서동", district: "강남구", city: "서울", lat: 37.4875, lng: 127.1013, noiseScore: 68, safetyScore: 78, convenienceScore: 78, overallScore: 75, population: "보통", subway: ["수서역"], highlights: ["SRT 수서역", "대모산 인접", "수서역세권 개발", "교통 편리"] },
  { id: "gangnam-ilwon", name: "일원동", district: "강남구", city: "서울", lat: 37.4870, lng: 127.0860, noiseScore: 73, safetyScore: 80, convenienceScore: 72, overallScore: 75, population: "보통", subway: ["일원역"], highlights: ["삼성서울병원", "조용한 주거지", "학군 양호", "대모산 인접"] },
  { id: "gangnam-segok", name: "세곡동", district: "강남구", city: "서울", lat: 37.4680, lng: 127.0795, noiseScore: 80, safetyScore: 78, convenienceScore: 60, overallScore: 72, population: "낮음", subway: [], highlights: ["신규 택지지구", "자연환경 우수", "대모산·구룡산", "개발 진행중"] },

  // ── 서초구 추가 ──
  { id: "seocho-jamwon", name: "잠원동", district: "서초구", city: "서울", lat: 37.5165, lng: 127.0117, noiseScore: 65, safetyScore: 82, convenienceScore: 85, overallScore: 78, population: "보통", subway: ["잠원역", "신사역"], highlights: ["한강공원 인접", "고속터미널 인근", "고급 주거지", "반포대교 인접"] },
  { id: "seocho-yangjae", name: "양재동", district: "서초구", city: "서울", lat: 37.4843, lng: 127.0345, noiseScore: 60, safetyScore: 80, convenienceScore: 82, overallScore: 75, population: "높음", subway: ["양재역", "양재시민의숲역"], highlights: ["양재천", "교육시설 밀집", "AT센터", "화훼단지", "IC 교통 편리"] },
  { id: "seocho-naegok", name: "내곡동", district: "서초구", city: "서울", lat: 37.4600, lng: 127.0700, noiseScore: 82, safetyScore: 78, convenienceScore: 55, overallScore: 70, population: "낮음", subway: [], highlights: ["국정원 인근", "조용한 주거지", "청계산 인접", "자연환경 우수"] },

  // ── 송파구 추가 ──
  { id: "songpa-pungnap", name: "풍납동", district: "송파구", city: "서울", lat: 37.5277, lng: 127.1177, noiseScore: 65, safetyScore: 75, convenienceScore: 78, overallScore: 73, population: "높음", subway: ["풍납역", "천호역"], highlights: ["올림픽공원 인접", "풍납토성", "재건축 진행", "한강 인접"] },
  { id: "songpa-bangi", name: "방이동", district: "송파구", city: "서울", lat: 37.5134, lng: 127.1210, noiseScore: 65, safetyScore: 78, convenienceScore: 80, overallScore: 75, population: "높음", subway: ["올림픽공원역", "방이역"], highlights: ["올림픽공원", "먹자골목", "체육시설 풍부", "주거환경 양호"] },
  { id: "songpa-ogeum", name: "오금동", district: "송파구", city: "서울", lat: 37.5022, lng: 127.1280, noiseScore: 68, safetyScore: 75, convenienceScore: 72, overallScore: 72, population: "보통", subway: ["오금역"], highlights: ["5호선·3호선 환승", "주거 밀집", "조용한 편", "송파공원 인접"] },
  { id: "songpa-geoyeo", name: "거여동", district: "송파구", city: "서울", lat: 37.4965, lng: 127.1420, noiseScore: 70, safetyScore: 73, convenienceScore: 68, overallScore: 70, population: "보통", subway: ["거여역", "마천역"], highlights: ["5호선", "주거 밀집", "성내천 인접", "조용한 주거지"] },
  { id: "songpa-seokchon", name: "석촌동", district: "송파구", city: "서울", lat: 37.5050, lng: 127.1080, noiseScore: 58, safetyScore: 78, convenienceScore: 88, overallScore: 76, population: "높음", subway: ["석촌역", "잠실역"], highlights: ["석촌호수", "롯데월드·롯데타워", "카페거리", "교통 편리"] },
  { id: "songpa-songpa", name: "송파동", district: "송파구", city: "서울", lat: 37.5045, lng: 127.1150, noiseScore: 62, safetyScore: 76, convenienceScore: 78, overallScore: 73, population: "높음", subway: ["석촌역", "송파역"], highlights: ["송파대로", "주거·상업 혼재", "학원가", "교통 편리"] },

  // ── 마포구 추가 ──
  { id: "mapo-gongdeok", name: "공덕동", district: "마포구", city: "서울", lat: 37.5448, lng: 126.9516, noiseScore: 52, safetyScore: 75, convenienceScore: 92, overallScore: 75, population: "높음", subway: ["공덕역"], highlights: ["5호선·6호선·공항철도 환승", "마포래미안", "교통 요충지", "오피스 밀집"] },
  { id: "mapo-dohwa", name: "도화동", district: "마포구", city: "서울", lat: 37.5398, lng: 126.9474, noiseScore: 58, safetyScore: 73, convenienceScore: 78, overallScore: 70, population: "보통", subway: ["마포역", "공덕역"], highlights: ["마포역 인근", "주거 밀집", "한강 가까움", "재개발 진행"] },
  { id: "mapo-seongsan", name: "성산동", district: "마포구", city: "서울", lat: 37.5667, lng: 126.9113, noiseScore: 65, safetyScore: 72, convenienceScore: 70, overallScore: 69, population: "보통", subway: ["월드컵경기장역"], highlights: ["월드컵경기장", "성산대교", "하늘공원·평화공원 인접", "주거지"] },
  { id: "mapo-ahyeon", name: "아현동", district: "마포구", city: "서울", lat: 37.5560, lng: 126.9562, noiseScore: 55, safetyScore: 72, convenienceScore: 80, overallScore: 70, population: "높음", subway: ["아현역", "이대역"], highlights: ["이대 인근", "재개발 완료", "마포래미안", "도심 접근성"] },

  // ── 강서구 추가 ──
  { id: "gangseo-balsan", name: "발산동", district: "강서구", city: "서울", lat: 37.5502, lng: 126.8378, noiseScore: 62, safetyScore: 75, convenienceScore: 82, overallScore: 74, population: "높음", subway: ["발산역", "우장산역"], highlights: ["9호선", "마곡 인접", "주거 밀집", "공항 접근성"] },
  { id: "gangseo-banghwa", name: "방화동", district: "강서구", city: "서울", lat: 37.5747, lng: 126.8131, noiseScore: 55, safetyScore: 70, convenienceScore: 68, overallScore: 65, population: "보통", subway: ["방화역", "개화산역"], highlights: ["김포공항 인접", "비행기 소음", "허준박물관", "방화대교 인접"] },
  { id: "gangseo-yeomchang", name: "염창동", district: "강서구", city: "서울", lat: 37.5457, lng: 126.8741, noiseScore: 63, safetyScore: 73, convenienceScore: 76, overallScore: 71, population: "보통", subway: ["염창역"], highlights: ["9호선", "한강 인접", "주거 밀집", "등촌역 인근"] },

  // ── 관악구 추가 ──
  { id: "gwanak-naksungdae", name: "낙성대동", district: "관악구", city: "서울", lat: 37.4765, lng: 126.9613, noiseScore: 65, safetyScore: 70, convenienceScore: 75, overallScore: 70, population: "보통", subway: ["낙성대역"], highlights: ["서울대 인근", "대학가", "젊은 상권", "관악산 입구"] },
  { id: "gwanak-cheongnyong", name: "청룡동", district: "관악구", city: "서울", lat: 37.4710, lng: 126.9390, noiseScore: 72, safetyScore: 68, convenienceScore: 60, overallScore: 66, population: "보통", subway: [], highlights: ["관악산 인접", "조용한 주거지", "자연환경 우수", "언덕 지형"] },
  { id: "gwanak-boramae", name: "보라매동", district: "관악구", city: "서울", lat: 37.4930, lng: 126.9225, noiseScore: 60, safetyScore: 72, convenienceScore: 80, overallScore: 72, population: "높음", subway: ["보라매역", "신대방역"], highlights: ["보라매공원", "보라매병원", "7호선", "신림선 개통"] },

  // ── 노원구 추가 ──
  { id: "nowon-wolgye", name: "월계동", district: "노원구", city: "서울", lat: 37.6195, lng: 127.0585, noiseScore: 65, safetyScore: 72, convenienceScore: 72, overallScore: 70, population: "높음", subway: ["월계역", "광운대역"], highlights: ["광운대 인근", "1호선", "초안산 인접", "주거 밀집"] },
  { id: "nowon-gongneung", name: "공릉동", district: "노원구", city: "서울", lat: 37.6252, lng: 127.0735, noiseScore: 68, safetyScore: 73, convenienceScore: 70, overallScore: 70, population: "보통", subway: ["공릉역"], highlights: ["서울과기대 인근", "7호선", "태릉 인접", "학생 상권"] },

  // ── 양천구 추가 ──
  { id: "yangcheon-sinwol", name: "신월동", district: "양천구", city: "서울", lat: 37.5275, lng: 126.8355, noiseScore: 65, safetyScore: 70, convenienceScore: 68, overallScore: 68, population: "높음", subway: ["신월역"], highlights: ["신월동 주거지", "서울식물원 인근", "가족형 주거", "양천공원"] },

  // ── 광진구 추가 ──
  { id: "gwangjin-neungdong", name: "능동", district: "광진구", city: "서울", lat: 37.5522, lng: 127.0806, noiseScore: 63, safetyScore: 75, convenienceScore: 78, overallScore: 73, population: "보통", subway: ["건대입구역", "어린이대공원역"], highlights: ["어린이대공원", "세종대 인근", "건대 상권 인접", "공원 환경"] },
  { id: "gwangjin-gwangjang", name: "광장동", district: "광진구", city: "서울", lat: 37.5456, lng: 127.1046, noiseScore: 70, safetyScore: 78, convenienceScore: 70, overallScore: 73, population: "보통", subway: ["광나루역"], highlights: ["워커힐 인근", "한강 인접", "아차산", "조용한 주거지"] },

  // ── 동대문구 추가 ──
  { id: "dongdaemun-dapsimni", name: "답십리동", district: "동대문구", city: "서울", lat: 37.5673, lng: 127.0526, noiseScore: 58, safetyScore: 70, convenienceScore: 75, overallScore: 68, population: "높음", subway: ["답십리역"], highlights: ["5호선", "청계천 인근", "먹자골목", "주거·상업 혼재"] },

  // ── 용산구 추가 ──
  { id: "yongsan-huam", name: "후암동", district: "용산구", city: "서울", lat: 37.5508, lng: 126.9796, noiseScore: 65, safetyScore: 75, convenienceScore: 72, overallScore: 71, population: "보통", subway: ["숙대입구역", "남영역"], highlights: ["남산 인접", "숙대·남영역 인근", "해방촌", "도심 접근성"] },
  { id: "yongsan-bogwang", name: "보광동", district: "용산구", city: "서울", lat: 37.5324, lng: 127.0010, noiseScore: 62, safetyScore: 72, convenienceScore: 70, overallScore: 68, population: "보통", subway: ["녹사평역"], highlights: ["이태원 인근", "한강진역 도보", "다문화 상권", "언덕 지형"] },

  // ── 성동구 추가 ──
  { id: "seongdong-geumho", name: "금호동", district: "성동구", city: "서울", lat: 37.5564, lng: 127.0186, noiseScore: 60, safetyScore: 72, convenienceScore: 72, overallScore: 68, population: "보통", subway: ["금호역"], highlights: ["약수역 인근", "응봉산", "한양대 인접", "도심 접근성"] },
  { id: "seongdong-haengdang", name: "행당동", district: "성동구", city: "서울", lat: 37.5580, lng: 127.0336, noiseScore: 58, safetyScore: 72, convenienceScore: 78, overallScore: 70, population: "높음", subway: ["왕십리역", "행당역"], highlights: ["왕십리역세권", "비트플렉스", "재개발 활발", "교통 편리"] },

  // ── 영등포구 추가 ──
  { id: "yeongdeungpo-singil", name: "신길동", district: "영등포구", city: "서울", lat: 37.5082, lng: 126.9145, noiseScore: 58, safetyScore: 68, convenienceScore: 75, overallScore: 67, population: "높음", subway: ["신길역"], highlights: ["1호선·5호선 환승", "보라매공원 인접", "재개발 진행", "학교 밀집"] },

  // ── 중구 추가 ──
  { id: "junggu-sindang", name: "신당동", district: "중구", city: "서울", lat: 37.5651, lng: 127.0099, noiseScore: 50, safetyScore: 70, convenienceScore: 85, overallScore: 70, population: "높음", subway: ["신당역"], highlights: ["2호선·6호선 환승", "중앙시장", "떡볶이 골목", "도심 접근성"] },
  { id: "junggu-jangchung", name: "장충동", district: "중구", city: "서울", lat: 37.5591, lng: 127.0049, noiseScore: 62, safetyScore: 75, convenienceScore: 72, overallScore: 70, population: "보통", subway: ["동대입구역"], highlights: ["남산 인접", "장충단공원", "족발 골목", "한옥 마을"] },

  // ── 종로구 추가 ──
  { id: "jongno-buam", name: "부암동", district: "종로구", city: "서울", lat: 37.5933, lng: 126.9665, noiseScore: 82, safetyScore: 80, convenienceScore: 50, overallScore: 70, population: "낮음", subway: [], highlights: ["북한산 인접", "고급 주거지", "카페 마을", "자하문터널 인근"] },
  { id: "jongno-pyeongchang", name: "평창동", district: "종로구", city: "서울", lat: 37.6117, lng: 126.9753, noiseScore: 85, safetyScore: 85, convenienceScore: 45, overallScore: 72, population: "낮음", subway: [], highlights: ["고급 단독주택", "북한산 자락", "조용한 주거", "자연환경 최고"] },

  // ══════════════════════════════════════════════════════════════
  // ── 부산 추가 (북구·동구·서구·영도구·강서구·기장군) ──
  // ══════════════════════════════════════════════════════════════

  // ── 부산 북구 ──
  {
    id: "busan-gupo",
    name: "구포동",
    district: "북구",
    city: "부산",
    lat: 35.1970,
    lng: 128.9882,
    noiseScore: 70,
    safetyScore: 68,
    convenienceScore: 65,
    overallScore: 68,
    population: "보통",
    subway: ["구포역"],
    highlights: ["구포시장", "낙동강", "주거지"],
  },
  {
    id: "busan-deokcheon",
    name: "덕천동",
    district: "북구",
    city: "부산",
    lat: 35.2045,
    lng: 129.0015,
    noiseScore: 72,
    safetyScore: 70,
    convenienceScore: 68,
    overallScore: 70,
    population: "높음",
    subway: ["덕천역"],
    highlights: ["덕천시장", "주거 밀집", "상권 발달"],
  },

  // ── 부산 동구 ──
  {
    id: "busan-beomil",
    name: "범일동",
    district: "동구",
    city: "부산",
    lat: 35.1345,
    lng: 129.0478,
    noiseScore: 65,
    safetyScore: 66,
    convenienceScore: 65,
    overallScore: 65,
    population: "보통",
    subway: ["범일역"],
    highlights: ["부산진시장", "원도심", "재개발 진행"],
  },
  {
    id: "busan-choryang",
    name: "초량동",
    district: "동구",
    city: "부산",
    lat: 35.1205,
    lng: 129.0395,
    noiseScore: 62,
    safetyScore: 65,
    convenienceScore: 68,
    overallScore: 65,
    population: "보통",
    subway: ["부산역", "초량역"],
    highlights: ["부산역 인근", "차이나타운", "텍사스거리", "관광지"],
  },

  // ── 부산 서구 ──
  {
    id: "busan-dongdaesin",
    name: "동대신동",
    district: "서구",
    city: "부산",
    lat: 35.1085,
    lng: 129.0178,
    noiseScore: 68,
    safetyScore: 66,
    convenienceScore: 62,
    overallScore: 65,
    population: "보통",
    subway: ["동대신역"],
    highlights: ["원도심", "언덕 지형", "구덕운동장 인근"],
  },
  {
    id: "busan-seodaesin",
    name: "서대신동",
    district: "서구",
    city: "부산",
    lat: 35.1042,
    lng: 129.0098,
    noiseScore: 70,
    safetyScore: 65,
    convenienceScore: 60,
    overallScore: 65,
    population: "보통",
    subway: ["서대신역"],
    highlights: ["언덕 지형", "조용한 주거지", "부산대병원 인근"],
  },

  // ── 부산 영도구 ──
  {
    id: "busan-dongsam",
    name: "동삼동",
    district: "영도구",
    city: "부산",
    lat: 35.0712,
    lng: 129.0802,
    noiseScore: 72,
    safetyScore: 68,
    convenienceScore: 60,
    overallScore: 67,
    population: "보통",
    subway: [],
    highlights: ["태종대", "한국해양대", "바다 전망"],
  },
  {
    id: "busan-cheonghak",
    name: "청학동",
    district: "영도구",
    city: "부산",
    lat: 35.0845,
    lng: 129.0632,
    noiseScore: 68,
    safetyScore: 66,
    convenienceScore: 62,
    overallScore: 65,
    population: "보통",
    subway: [],
    highlights: ["영도대교", "봉래산", "원도심 분위기"],
  },

  // ── 부산 강서구 ──
  {
    id: "busan-myeongji",
    name: "명지동",
    district: "강서구",
    city: "부산",
    lat: 35.0845,
    lng: 128.9278,
    noiseScore: 80,
    safetyScore: 82,
    convenienceScore: 75,
    overallScore: 79,
    population: "높음",
    subway: [],
    highlights: ["명지신도시", "신축 아파트", "낙동강", "개발 진행"],
  },
  {
    id: "busan-dajeo",
    name: "대저동",
    district: "강서구",
    city: "부산",
    lat: 35.1245,
    lng: 128.9578,
    noiseScore: 82,
    safetyScore: 78,
    convenienceScore: 62,
    overallScore: 74,
    population: "낮음",
    subway: [],
    highlights: ["대저생태공원", "낙동강", "자연환경", "토마토축제"],
  },

  // ── 부산 기장군 ──
  {
    id: "busan-gijang",
    name: "기장읍",
    district: "기장군",
    city: "부산",
    lat: 35.2445,
    lng: 129.2178,
    noiseScore: 78,
    safetyScore: 75,
    convenienceScore: 68,
    overallScore: 74,
    population: "보통",
    subway: ["기장역"],
    highlights: ["기장시장", "바다", "일광해수욕장 인근"],
  },
  {
    id: "busan-jeonggwan",
    name: "정관읍",
    district: "기장군",
    city: "부산",
    lat: 35.3245,
    lng: 129.1778,
    noiseScore: 82,
    safetyScore: 84,
    convenienceScore: 78,
    overallScore: 81,
    population: "높음",
    subway: [],
    highlights: ["정관신도시", "신축 아파트", "교육 환경", "쾌적한 주거"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 인천 추가 (동구) ──
  // ══════════════════════════════════════════════════════════════

  {
    id: "incheon-songnim",
    name: "송림동",
    district: "동구",
    city: "인천",
    lat: 37.4735,
    lng: 126.6432,
    noiseScore: 68,
    safetyScore: 65,
    convenienceScore: 62,
    overallScore: 65,
    population: "보통",
    subway: [],
    highlights: ["구도심", "송림시장", "재개발 예정"],
  },
  {
    id: "incheon-hwasu",
    name: "화수동",
    district: "동구",
    city: "인천",
    lat: 37.4698,
    lng: 126.6278,
    noiseScore: 65,
    safetyScore: 63,
    convenienceScore: 60,
    overallScore: 63,
    population: "낮음",
    subway: [],
    highlights: ["구도심", "인천항 인근", "달동네 분위기"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 대구 추가 (서구·달성군) ──
  // ══════════════════════════════════════════════════════════════

  // ── 대구 서구 ──
  {
    id: "daegu-bisan",
    name: "비산동",
    district: "서구",
    city: "대구",
    lat: 35.8672,
    lng: 128.5645,
    noiseScore: 70,
    safetyScore: 68,
    convenienceScore: 65,
    overallScore: 68,
    population: "보통",
    subway: ["내당역"],
    highlights: ["주거지", "비산네거리", "서구청 인근"],
  },
  {
    id: "daegu-naedang",
    name: "내당동",
    district: "서구",
    city: "대구",
    lat: 35.8598,
    lng: 128.5702,
    noiseScore: 72,
    safetyScore: 67,
    convenienceScore: 63,
    overallScore: 67,
    population: "보통",
    subway: ["내당역"],
    highlights: ["주거지", "재래시장", "조용한 편"],
  },

  // ── 대구 달성군 ──
  {
    id: "daegu-dasa",
    name: "다사읍",
    district: "달성군",
    city: "대구",
    lat: 35.8898,
    lng: 128.5378,
    noiseScore: 80,
    safetyScore: 82,
    convenienceScore: 75,
    overallScore: 79,
    population: "높음",
    subway: ["다사역"],
    highlights: ["다사신도시", "택지지구", "신축 아파트", "이마트"],
  },
  {
    id: "daegu-hwawon",
    name: "화원읍",
    district: "달성군",
    city: "대구",
    lat: 35.8198,
    lng: 128.5578,
    noiseScore: 82,
    safetyScore: 80,
    convenienceScore: 68,
    overallScore: 77,
    population: "보통",
    subway: ["화원역"],
    highlights: ["비슬산", "택지지구", "자연환경", "주거지"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 대전 추가 (동구·대덕구) ──
  // ══════════════════════════════════════════════════════════════

  // ── 대전 동구 ──
  {
    id: "daejeon-yongjeon",
    name: "용전동",
    district: "동구",
    city: "대전",
    lat: 36.3278,
    lng: 127.4345,
    noiseScore: 65,
    safetyScore: 66,
    convenienceScore: 68,
    overallScore: 66,
    population: "보통",
    subway: [],
    highlights: ["대전역 인근", "구도심", "중앙시장"],
  },
  {
    id: "daejeon-panam",
    name: "판암동",
    district: "동구",
    city: "대전",
    lat: 36.3198,
    lng: 127.4578,
    noiseScore: 72,
    safetyScore: 68,
    convenienceScore: 62,
    overallScore: 67,
    population: "보통",
    subway: ["판암역"],
    highlights: ["식장산", "주거지", "대전 외곽"],
  },

  // ── 대전 대덕구 ──
  {
    id: "daejeon-sintanjin",
    name: "신탄진동",
    district: "대덕구",
    city: "대전",
    lat: 36.4278,
    lng: 127.4245,
    noiseScore: 74,
    safetyScore: 72,
    convenienceScore: 68,
    overallScore: 71,
    population: "보통",
    subway: [],
    highlights: ["신탄진역", "대청호 인근", "주거지", "빵축제"],
  },
  {
    id: "daejeon-beopdong",
    name: "법동",
    district: "대덕구",
    city: "대전",
    lat: 36.3878,
    lng: 127.4178,
    noiseScore: 72,
    safetyScore: 70,
    convenienceScore: 65,
    overallScore: 69,
    population: "보통",
    subway: [],
    highlights: ["대덕연구단지 인근", "주거지", "조용한 편"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 광주 추가 (동구·광산구) ──
  // ══════════════════════════════════════════════════════════════

  // ── 광주 동구 ──
  {
    id: "gwangju-chungjang",
    name: "충장동",
    district: "동구",
    city: "광주",
    lat: 35.1488,
    lng: 126.9178,
    noiseScore: 58,
    safetyScore: 70,
    convenienceScore: 78,
    overallScore: 69,
    population: "높음",
    subway: [],
    highlights: ["충장로 번화가", "패션거리", "문화전당 인근"],
  },
  {
    id: "gwangju-sansu",
    name: "산수동",
    district: "동구",
    city: "광주",
    lat: 35.1545,
    lng: 126.9278,
    noiseScore: 70,
    safetyScore: 68,
    convenienceScore: 65,
    overallScore: 68,
    population: "보통",
    subway: [],
    highlights: ["무등산 입구", "주거지", "조용한 편"],
  },

  // ── 광주 광산구 ──
  {
    id: "gwangju-suwan",
    name: "수완동",
    district: "광산구",
    city: "광주",
    lat: 35.1898,
    lng: 126.8178,
    noiseScore: 80,
    safetyScore: 84,
    convenienceScore: 80,
    overallScore: 81,
    population: "높음",
    subway: [],
    highlights: ["수완지구", "신축 아파트", "상권 발달", "학원가"],
  },
  {
    id: "gwangju-cheomdan",
    name: "첨단동",
    district: "광산구",
    city: "광주",
    lat: 35.2198,
    lng: 126.8478,
    noiseScore: 82,
    safetyScore: 85,
    convenienceScore: 78,
    overallScore: 82,
    population: "보통",
    subway: [],
    highlights: ["첨단지구", "광주과기원", "공원 많음", "쾌적한 주거"],
  },

  // ══════════════════════════════════════════════════════════════
  // ── 울산 추가 (동구·북구·울주군) ──
  // ══════════════════════════════════════════════════════════════

  // ── 울산 동구 ──
  {
    id: "ulsan-jeonha",
    name: "전하동",
    district: "동구",
    city: "울산",
    lat: 35.5045,
    lng: 129.4178,
    noiseScore: 65,
    safetyScore: 68,
    convenienceScore: 65,
    overallScore: 66,
    population: "보통",
    subway: [],
    highlights: ["현대중공업 인근", "일산해수욕장", "주거지"],
  },
  {
    id: "ulsan-ilsan",
    name: "일산동",
    district: "동구",
    city: "울산",
    lat: 35.5198,
    lng: 129.4278,
    noiseScore: 68,
    safetyScore: 70,
    convenienceScore: 68,
    overallScore: 69,
    population: "보통",
    subway: [],
    highlights: ["일산해수욕장", "현대중공업", "바다 조망"],
  },

  // ── 울산 북구 ──
  {
    id: "ulsan-yeonam",
    name: "연암동",
    district: "북구",
    city: "울산",
    lat: 35.5898,
    lng: 129.3578,
    noiseScore: 75,
    safetyScore: 74,
    convenienceScore: 68,
    overallScore: 72,
    population: "보통",
    subway: [],
    highlights: ["주거지", "울산대 인근", "조용한 편"],
  },
  {
    id: "ulsan-maegok",
    name: "매곡동",
    district: "북구",
    city: "울산",
    lat: 35.5698,
    lng: 129.3178,
    noiseScore: 78,
    safetyScore: 76,
    convenienceScore: 65,
    overallScore: 73,
    population: "보통",
    subway: [],
    highlights: ["매곡산업단지 인근", "주거지", "자연환경"],
  },

  // ── 울산 울주군 ──
  {
    id: "ulsan-samnam",
    name: "삼남읍",
    district: "울주군",
    city: "울산",
    lat: 35.5198,
    lng: 129.1678,
    noiseScore: 85,
    safetyScore: 72,
    convenienceScore: 55,
    overallScore: 71,
    population: "낮음",
    subway: [],
    highlights: ["시외 지역", "자연환경", "영남알프스 인근"],
  },
  {
    id: "ulsan-beomseo",
    name: "범서읍",
    district: "울주군",
    city: "울산",
    lat: 35.5598,
    lng: 129.2578,
    noiseScore: 80,
    safetyScore: 74,
    convenienceScore: 62,
    overallScore: 72,
    population: "보통",
    subway: [],
    highlights: ["울산대학교", "택지개발", "자연환경"],
  },

  // ── 경기도 추가 (시흥, 군포, 오산, 광주, 이천, 양주, 포천, 여주, 동두천) ──

  // 시흥시
  { id: "siheung-jangseok", name: "장현동", district: "시흥시", city: "시흥", lat: 37.3850, lng: 126.8021, noiseScore: 78, safetyScore: 80, convenienceScore: 70, overallScore: 76, population: "보통", subway: ["시흥시청역(예정)"], highlights: ["배곧신도시", "서울대캠퍼스", "신축 아파트"] },
  { id: "siheung-baegot", name: "배곧동", district: "시흥시", city: "시흥", lat: 37.3647, lng: 126.7367, noiseScore: 82, safetyScore: 82, convenienceScore: 75, overallScore: 80, population: "높음", subway: [], highlights: ["배곧신도시", "서해바다", "공원 많음", "학군 좋음"] },
  { id: "siheung-jeongwang", name: "정왕동", district: "시흥시", city: "시흥", lat: 37.3459, lng: 126.7371, noiseScore: 65, safetyScore: 70, convenienceScore: 72, overallScore: 69, population: "높음", subway: ["정왕역"], highlights: ["시화공단", "오이도", "직장인 밀집"] },
  { id: "siheung-sindong", name: "신천동", district: "시흥시", city: "시흥", lat: 37.4438, lng: 126.8003, noiseScore: 70, safetyScore: 72, convenienceScore: 68, overallScore: 70, population: "보통", subway: [], highlights: ["구시가지", "재개발 예정", "교통 편리"] },

  // 군포시
  { id: "gunpo-sanbon", name: "산본동", district: "군포시", city: "군포", lat: 37.3593, lng: 126.9326, noiseScore: 72, safetyScore: 78, convenienceScore: 82, overallScore: 77, population: "높음", subway: ["산본역"], highlights: ["산본신도시", "중심상업지구", "학원가"] },
  { id: "gunpo-geumjeong", name: "금정동", district: "군포시", city: "군포", lat: 37.3682, lng: 126.9466, noiseScore: 68, safetyScore: 75, convenienceScore: 78, overallScore: 74, population: "보통", subway: ["금정역"], highlights: ["4호선 환승", "교통 요지"] },
  { id: "gunpo-dangri", name: "당정동", district: "군포시", city: "군포", lat: 37.3497, lng: 126.9355, noiseScore: 74, safetyScore: 76, convenienceScore: 72, overallScore: 74, population: "보통", subway: ["당정역"], highlights: ["주거 위주", "조용한 동네"] },
  { id: "gunpo-daeya", name: "대야동", district: "군포시", city: "군포", lat: 37.3724, lng: 126.9226, noiseScore: 70, safetyScore: 74, convenienceScore: 68, overallScore: 71, population: "보통", subway: [], highlights: ["수리산 등산", "자연환경"] },

  // 오산시
  { id: "osan-sema", name: "세마동", district: "오산시", city: "오산", lat: 37.1571, lng: 127.0707, noiseScore: 78, safetyScore: 78, convenienceScore: 70, overallScore: 75, population: "보통", subway: ["세마역(예정)"], highlights: ["세교신도시", "신축 아파트", "쾌적"] },
  { id: "osan-wonhwa", name: "원동", district: "오산시", city: "오산", lat: 37.1502, lng: 127.0667, noiseScore: 65, safetyScore: 72, convenienceScore: 75, overallScore: 71, population: "보통", subway: ["오산역"], highlights: ["오산 중심가", "전통시장"] },
  { id: "osan-nuri", name: "누읍동", district: "오산시", city: "오산", lat: 37.1635, lng: 127.0500, noiseScore: 80, safetyScore: 76, convenienceScore: 65, overallScore: 74, population: "낮음", subway: [], highlights: ["전원 분위기", "조용한 주거지"] },

  // 광주시 (경기)
  { id: "gg-gwangju-gyeongan", name: "경안동", district: "광주시", city: "광주(경기)", lat: 37.4098, lng: 127.2574, noiseScore: 70, safetyScore: 74, convenienceScore: 72, overallScore: 72, population: "보통", subway: [], highlights: ["광주시 중심", "행정타운"] },
  { id: "gg-gwangju-opo", name: "오포읍", district: "광주시", city: "광주(경기)", lat: 37.3610, lng: 127.2040, noiseScore: 78, safetyScore: 78, convenienceScore: 68, overallScore: 75, population: "높음", subway: [], highlights: ["택지개발", "판교 출퇴근", "신축 많음"] },
  { id: "gg-gwangju-gonji", name: "곤지암읍", district: "광주시", city: "광주(경기)", lat: 37.3437, lng: 127.3392, noiseScore: 82, safetyScore: 76, convenienceScore: 60, overallScore: 73, population: "낮음", subway: [], highlights: ["곤지암리조트", "전원생활", "자연환경"] },
  { id: "gg-gwangju-taejeon", name: "태전동", district: "광주시", city: "광주(경기)", lat: 37.4212, lng: 127.2678, noiseScore: 75, safetyScore: 75, convenienceScore: 66, overallScore: 72, population: "보통", subway: [], highlights: ["주거 단지", "학교 밀집"] },

  // 이천시
  { id: "icheon-jungang", name: "중리동", district: "이천시", city: "이천", lat: 37.2797, lng: 127.4428, noiseScore: 68, safetyScore: 72, convenienceScore: 72, overallScore: 71, population: "보통", subway: [], highlights: ["이천 중심가", "이천쌀", "도자기"] },
  { id: "icheon-bugu", name: "부발읍", district: "이천시", city: "이천", lat: 37.2384, lng: 127.4695, noiseScore: 72, safetyScore: 74, convenienceScore: 65, overallScore: 70, population: "보통", subway: [], highlights: ["SK하이닉스", "산업단지", "직장인 거주"] },
  { id: "icheon-majang", name: "마장면", district: "이천시", city: "이천", lat: 37.3050, lng: 127.3870, noiseScore: 85, safetyScore: 72, convenienceScore: 55, overallScore: 71, population: "낮음", subway: [], highlights: ["전원생활", "텃밭", "자연환경"] },

  // 양주시
  { id: "yangju-deokjeong", name: "덕정동", district: "양주시", city: "양주", lat: 37.8253, lng: 127.0695, noiseScore: 72, safetyScore: 74, convenienceScore: 70, overallScore: 72, population: "보통", subway: ["덕정역"], highlights: ["1호선", "양주 중심가"] },
  { id: "yangju-hoecheon", name: "회천동", district: "양주시", city: "양주", lat: 37.8101, lng: 127.0462, noiseScore: 76, safetyScore: 78, convenienceScore: 72, overallScore: 75, population: "높음", subway: ["회천역(예정)"], highlights: ["옥정신도시", "신축 아파트", "택지개발"] },
  { id: "yangju-okjeong", name: "옥정동", district: "양주시", city: "양주", lat: 37.8250, lng: 127.0350, noiseScore: 80, safetyScore: 80, convenienceScore: 74, overallScore: 78, population: "높음", subway: [], highlights: ["옥정신도시", "대규모 택지", "학교 신설"] },

  // 포천시
  { id: "pocheon-sinbuk", name: "신북면", district: "포천시", city: "포천", lat: 37.8857, lng: 127.1650, noiseScore: 85, safetyScore: 70, convenienceScore: 55, overallScore: 70, population: "낮음", subway: [], highlights: ["산정호수", "자연환경", "관광지"] },
  { id: "pocheon-sohol", name: "소흘읍", district: "포천시", city: "포천", lat: 37.8113, lng: 127.1423, noiseScore: 75, safetyScore: 74, convenienceScore: 68, overallScore: 72, population: "보통", subway: [], highlights: ["포천 중심", "주거 밀집", "교통 편리"] },

  // 여주시
  { id: "yeoju-yeoju", name: "여주동", district: "여주시", city: "여주", lat: 37.2983, lng: 127.6363, noiseScore: 78, safetyScore: 72, convenienceScore: 65, overallScore: 72, population: "보통", subway: ["여주역"], highlights: ["여주시 중심", "프리미엄아울렛", "남한강"] },
  { id: "yeoju-sejong", name: "세종대왕면", district: "여주시", city: "여주", lat: 37.3139, lng: 127.5987, noiseScore: 88, safetyScore: 70, convenienceScore: 52, overallScore: 70, population: "낮음", subway: [], highlights: ["세종대왕릉", "전원생활", "역사유적"] },

  // 동두천시
  { id: "dongducheon-jiwuk", name: "지행동", district: "동두천시", city: "동두천", lat: 37.9014, lng: 127.0574, noiseScore: 68, safetyScore: 68, convenienceScore: 70, overallScore: 69, population: "보통", subway: ["지행역"], highlights: ["동두천 중심가", "1호선", "군부대 인접"] },
  { id: "dongducheon-songnae", name: "송내동", district: "동두천시", city: "동두천", lat: 37.8960, lng: 127.0471, noiseScore: 72, safetyScore: 70, convenienceScore: 65, overallScore: 69, population: "보통", subway: [], highlights: ["주거 위주", "소요산 접근"] },

  // ── 기존 경기도 시 추가 동 ──

  // 수원 추가
  { id: "suwon-uman", name: "우만동", district: "팔달구", city: "수원", lat: 37.2860, lng: 127.0150, noiseScore: 65, safetyScore: 72, convenienceScore: 78, overallScore: 72, population: "높음", subway: [], highlights: ["수원역 인근", "전통시장", "구시가지"] },
  { id: "suwon-hwaseo", name: "화서동", district: "팔달구", city: "수원", lat: 37.2937, lng: 126.9888, noiseScore: 70, safetyScore: 74, convenienceScore: 75, overallScore: 73, population: "보통", subway: ["화서역"], highlights: ["수원화성", "관광지", "주거 혼합"] },

  // 성남 추가
  { id: "seongnam-pangyo", name: "판교동", district: "분당구", city: "성남", lat: 37.3948, lng: 127.1112, noiseScore: 72, safetyScore: 82, convenienceScore: 88, overallScore: 81, population: "높음", subway: ["판교역"], highlights: ["IT기업 밀집", "판교테크노밸리", "고급 주거지", "카카오", "네이버"] },

  // 고양 추가
  { id: "goyang-wondang", name: "원당동", district: "덕양구", city: "고양", lat: 37.6508, lng: 126.8345, noiseScore: 68, safetyScore: 72, convenienceScore: 72, overallScore: 71, population: "보통", subway: ["원당역"], highlights: ["원당시장", "서삼릉", "교통 편리"] },

  // 용인 추가
  { id: "yongin-dongbaek", name: "동백동", district: "기흥구", city: "용인", lat: 37.2831, lng: 127.1520, noiseScore: 76, safetyScore: 80, convenienceScore: 78, overallScore: 78, population: "높음", subway: ["동백역"], highlights: ["신도시", "에버라인", "학군 좋음"] },

  // 화성 추가
  { id: "hwaseong-songsan", name: "송산동", district: "화성시", city: "화성", lat: 37.2010, lng: 126.8080, noiseScore: 80, safetyScore: 76, convenienceScore: 62, overallScore: 73, population: "보통", subway: [], highlights: ["송산그린시티", "개발 진행 중"] },

  // 남양주 추가
  { id: "namyangju-jingeon", name: "진건읍", district: "남양주시", city: "남양주", lat: 37.6480, lng: 127.1750, noiseScore: 78, safetyScore: 74, convenienceScore: 62, overallScore: 71, population: "보통", subway: [], highlights: ["왕숙신도시 예정", "개발 호재"] },

  // 김포 추가
  { id: "gimpo-gochon", name: "고촌읍", district: "김포시", city: "김포", lat: 37.6118, lng: 126.7631, noiseScore: 68, safetyScore: 72, convenienceScore: 70, overallScore: 70, population: "보통", subway: ["고촌역(예정)"], highlights: ["김포골드라인", "서울 접근성"] },

  // 파주 추가
  { id: "paju-tanhyeon", name: "탄현면", district: "파주시", city: "파주", lat: 37.7575, lng: 126.7285, noiseScore: 82, safetyScore: 76, convenienceScore: 60, overallScore: 73, population: "보통", subway: [], highlights: ["헤이리예술마을", "프로방스", "자연환경"] },
];

// ─── 민원 데이터 ───────────────────────────────────────────────
// 각 동마다 2024-01 ~ 2025-03 (15개월), 카테고리별 건수

function generateComplaints(
  neighborhoodId: string,
  profile: Record<string, [number, number]>, // category -> [baseMin, baseMax]
): Complaint[] {
  const results: Complaint[] = [];
  const categories = Object.keys(profile);
  // 시드 기반 의사 난수 (재현 가능)
  let seed = 0;
  for (let i = 0; i < neighborhoodId.length; i++) seed += neighborhoodId.charCodeAt(i);

  for (let year = 2024; year <= 2025; year++) {
    const maxMonth = year === 2025 ? 3 : 12;
    for (let month = 1; month <= maxMonth; month++) {
      for (const cat of categories) {
        const [lo, hi] = profile[cat];
        seed = (seed * 9301 + 49297) % 233280;
        const rng = seed / 233280;
        const count = Math.round(lo + rng * (hi - lo));
        results.push({ neighborhoodId, category: cat, count, year, month });
      }
    }
  }
  return results;
}

const complaintProfiles: Record<string, Record<string, [number, number]>> = {
  "gangnam-yeoksam":       { noise: [30, 55], parking: [25, 45], trash: [10, 20], road: [5, 15], construction: [15, 30], other: [5, 12] },
  "gangnam-samsung":       { noise: [25, 45], parking: [20, 40], trash: [8, 18], road: [5, 12], construction: [12, 25], other: [4, 10] },
  "gangnam-daechi":        { noise: [15, 30], parking: [20, 38], trash: [8, 15], road: [4, 10], construction: [8, 18], other: [3, 8] },
  "gangnam-nonhyeon":      { noise: [35, 60], parking: [28, 50], trash: [12, 25], road: [6, 14], construction: [10, 22], other: [6, 15] },
  "seocho-seocho":         { noise: [18, 35], parking: [15, 30], trash: [7, 14], road: [4, 10], construction: [8, 18], other: [3, 8] },
  "seocho-banpo":          { noise: [12, 25], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [6, 14], other: [2, 6] },
  "seocho-bangbae":        { noise: [10, 20], parking: [8, 18], trash: [5, 10], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "mapo-hapjeong":         { noise: [22, 40], parking: [18, 35], trash: [10, 20], road: [5, 12], construction: [10, 20], other: [5, 10] },
  "mapo-mangwon":          { noise: [20, 38], parking: [15, 30], trash: [10, 22], road: [4, 10], construction: [8, 18], other: [4, 9] },
  "mapo-yeonnam":          { noise: [25, 45], parking: [22, 40], trash: [12, 25], road: [5, 12], construction: [8, 18], other: [5, 12] },
  "mapo-sangsu":           { noise: [22, 42], parking: [18, 35], trash: [10, 20], road: [4, 10], construction: [7, 16], other: [4, 10] },
  "songpa-jamsil":         { noise: [20, 38], parking: [18, 35], trash: [8, 18], road: [5, 12], construction: [12, 25], other: [4, 10] },
  "songpa-garak":          { noise: [15, 30], parking: [12, 25], trash: [7, 15], road: [4, 10], construction: [15, 35], other: [3, 8] },
  "songpa-munjeong":       { noise: [14, 28], parking: [10, 22], trash: [6, 14], road: [4, 9], construction: [10, 22], other: [3, 7] },
  "yeongdeungpo-yeouido":  { noise: [18, 35], parking: [15, 30], trash: [6, 14], road: [4, 10], construction: [10, 22], other: [3, 8] },
  "yeongdeungpo-dangsan":  { noise: [18, 32], parking: [15, 28], trash: [8, 16], road: [5, 10], construction: [8, 18], other: [4, 8] },
  "yeongdeungpo-yeongdeungpo": { noise: [28, 50], parking: [22, 42], trash: [15, 30], road: [6, 14], construction: [10, 22], other: [6, 14] },
  "yongsan-itaewon":       { noise: [40, 70], parking: [25, 45], trash: [18, 35], road: [5, 12], construction: [8, 18], other: [8, 18] },
  "yongsan-hannam":        { noise: [15, 30], parking: [12, 25], trash: [6, 14], road: [4, 9], construction: [8, 18], other: [3, 7] },
  "yongsan-yongsan":       { noise: [22, 40], parking: [18, 32], trash: [10, 20], road: [5, 12], construction: [15, 30], other: [5, 10] },
  "seongdong-seongsu":     { noise: [22, 42], parking: [20, 38], trash: [10, 22], road: [5, 12], construction: [12, 25], other: [5, 12] },
  "seongdong-wangsimni":   { noise: [20, 38], parking: [15, 30], trash: [8, 18], road: [5, 10], construction: [10, 22], other: [4, 9] },
  "seongdong-oksu":        { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 8], construction: [8, 20], other: [2, 6] },
  "gwanak-sillim":         { noise: [25, 45], parking: [20, 38], trash: [15, 30], road: [6, 14], construction: [8, 18], other: [6, 14] },
  "gwanak-bongcheon":      { noise: [20, 38], parking: [18, 32], trash: [12, 25], road: [5, 12], construction: [6, 15], other: [5, 12] },
  "nowon-sanggye":         { noise: [8, 18], parking: [10, 20], trash: [6, 12], road: [3, 8], construction: [4, 10], other: [2, 5] },
  "nowon-junggye":         { noise: [8, 18], parking: [10, 22], trash: [6, 14], road: [3, 8], construction: [4, 10], other: [2, 6] },
  "nowon-hagye":           { noise: [7, 16], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "eunpyeong-eungam":      { noise: [10, 22], parking: [8, 18], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "eunpyeong-bulgwang":    { noise: [10, 20], parking: [8, 16], trash: [5, 12], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "eunpyeong-nokbeon":     { noise: [8, 18], parking: [7, 15], trash: [5, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "gangseo-hwagok":        { noise: [15, 28], parking: [12, 25], trash: [8, 18], road: [4, 10], construction: [6, 14], other: [3, 8] },
  "gangseo-magok":         { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 25], other: [2, 5] },
  "gangseo-deungchon":     { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [3, 8], construction: [5, 14], other: [3, 6] },
  "guro-guro":             { noise: [22, 40], parking: [18, 35], trash: [12, 25], road: [5, 12], construction: [8, 18], other: [5, 12] },
  "guro-gocheok":          { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "guro-sindorim":         { noise: [25, 45], parking: [20, 38], trash: [10, 22], road: [5, 12], construction: [8, 18], other: [5, 10] },
  "dongjak-sadang":        { noise: [20, 38], parking: [18, 32], trash: [10, 20], road: [5, 12], construction: [8, 16], other: [4, 10] },
  "dongjak-noryangjin":    { noise: [22, 40], parking: [15, 30], trash: [12, 25], road: [5, 10], construction: [6, 14], other: [5, 10] },
  "dongjak-heukseok":      { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 8], construction: [8, 18], other: [2, 6] },
  "gwangjin-gunja":        { noise: [30, 55], parking: [22, 42], trash: [15, 30], road: [5, 12], construction: [8, 18], other: [6, 14] },
  "gwangjin-jayang":       { noise: [20, 38], parking: [15, 30], trash: [10, 22], road: [4, 10], construction: [8, 18], other: [4, 10] },
  "gwangjin-guui":         { noise: [15, 28], parking: [12, 24], trash: [7, 16], road: [4, 9], construction: [6, 14], other: [3, 7] },
  "junggu-myeongdong":     { noise: [45, 75], parking: [30, 55], trash: [20, 40], road: [8, 18], construction: [10, 22], other: [8, 18] },
  "junggu-chungmuro":      { noise: [20, 38], parking: [15, 28], trash: [8, 18], road: [5, 10], construction: [8, 16], other: [4, 8] },
  "junggu-euljiro":        { noise: [25, 45], parking: [18, 35], trash: [10, 22], road: [5, 12], construction: [10, 22], other: [5, 10] },
  "jongno-jongno":         { noise: [30, 55], parking: [22, 42], trash: [15, 28], road: [6, 14], construction: [8, 18], other: [6, 14] },
  "jongno-hyehwa":         { noise: [18, 35], parking: [12, 25], trash: [8, 16], road: [4, 10], construction: [5, 12], other: [3, 8] },
  "jongno-samcheong":      { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [2, 6], construction: [3, 8], other: [2, 5] },
  "gangdong-cheonho":      { noise: [18, 35], parking: [15, 30], trash: [8, 18], road: [5, 10], construction: [8, 18], other: [4, 8] },
  "gangdong-gildong":      { noise: [10, 20], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "gangdong-myeongil":     { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 8], construction: [8, 20], other: [2, 6] },
  "seodaemun-yeonhui":     { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [2, 6], construction: [4, 10], other: [2, 5] },
  "seodaemun-sinchon":     { noise: [32, 55], parking: [22, 42], trash: [15, 30], road: [5, 12], construction: [6, 14], other: [6, 14] },
  "seodaemun-hongje":      { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "yangcheon-mokdong":     { noise: [10, 22], parking: [12, 25], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "yangcheon-sinjeong":    { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "suwon-homaesil":        { noise: [6, 14], parking: [6, 14], trash: [4, 8], road: [3, 7], construction: [12, 28], other: [2, 5] },
  "songpa-wirye":          { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [14, 30], other: [2, 5] },
  "dongdaemun-hwigyeong":  { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "dongdaemun-hoegi":      { noise: [18, 32], parking: [14, 28], trash: [8, 16], road: [4, 9], construction: [5, 12], other: [4, 8] },
  "dongdaemun-jangan":     { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "dongdaemun-jeonnong":   { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },

  // ── 경기도 ──
  "seongnam-jeongja":      { noise: [12, 25], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [6, 14], other: [2, 6] },
  "seongnam-seohyeon":     { noise: [14, 28], parking: [12, 25], trash: [6, 14], road: [4, 9], construction: [6, 14], other: [3, 7] },
  "seongnam-sinheung":     { noise: [18, 34], parking: [15, 30], trash: [8, 18], road: [5, 10], construction: [10, 22], other: [4, 9] },
  "goyang-madu":           { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "goyang-juyeop":         { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "goyang-hwajeong":       { noise: [15, 28], parking: [12, 25], trash: [7, 15], road: [4, 9], construction: [6, 14], other: [3, 7] },
  "yongin-jukjeon":        { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "yongin-gugal":          { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [6, 14], other: [2, 6] },
  "yongin-yeoksam":        { noise: [6, 14], parking: [5, 12], trash: [3, 8], road: [2, 6], construction: [4, 10], other: [2, 4] },
  "bucheon-sangdong":      { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [6, 14], other: [3, 6] },
  "bucheon-jungdong":      { noise: [15, 28], parking: [12, 25], trash: [7, 15], road: [4, 9], construction: [6, 14], other: [3, 7] },
  "anyang-pyeongchon":     { noise: [12, 24], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "anyang-anyang":         { noise: [16, 30], parking: [14, 26], trash: [8, 16], road: [4, 10], construction: [6, 14], other: [3, 7] },
  "ansan-gojan":           { noise: [16, 30], parking: [14, 28], trash: [8, 18], road: [4, 10], construction: [6, 14], other: [4, 8] },
  "ansan-bono":            { noise: [10, 20], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "hwaseong-dongtan":      { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [12, 28], other: [2, 5] },
  "hwaseong-byeongjeom":   { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [4, 8], construction: [8, 18], other: [3, 6] },
  "pyeongtaek-pyeongtaek": { noise: [15, 28], parking: [12, 25], trash: [7, 16], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "pyeongtaek-bijeon":     { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 8], construction: [8, 18], other: [2, 6] },
  "gimpo-janggi":          { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "gimpo-gurae":           { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "paju-unjeong":          { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },
  "paju-geumchon":         { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "hanam-misa":            { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },
  "hanam-pungsan":         { noise: [10, 20], parking: [8, 18], trash: [5, 10], road: [3, 7], construction: [8, 18], other: [2, 5] },
  "gwangmyeong-cheolsan":  { noise: [16, 30], parking: [14, 28], trash: [7, 16], road: [4, 10], construction: [6, 14], other: [3, 7] },
  "gwangmyeong-haan":      { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "uijeongbu-minrak":      { noise: [10, 20], parking: [8, 18], trash: [5, 10], road: [3, 7], construction: [8, 18], other: [2, 5] },
  "uijeongbu-uijeongbu":   { noise: [18, 32], parking: [14, 28], trash: [8, 18], road: [4, 10], construction: [6, 14], other: [4, 8] },
  "namyangju-dasan":       { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },
  "namyangju-byeollae":    { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "guri-inchang":          { noise: [12, 24], parking: [10, 20], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "guri-galmae":           { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  // 수원 추가
  "suwon-jeongja":         { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "suwon-jowon":           { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "suwon-ingye":           { noise: [16, 30], parking: [14, 28], trash: [8, 16], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "suwon-maegyo":          { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [4, 8], construction: [8, 18], other: [3, 6] },
  "suwon-yeongtong":       { noise: [12, 24], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "suwon-gwanggyo":        { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },
  "suwon-maetan":          { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [6, 14], other: [2, 6] },
  "suwon-gwonseon":        { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  // 성남 추가
  "seongnam-seongnam":     { noise: [18, 34], parking: [14, 28], trash: [8, 18], road: [5, 10], construction: [8, 18], other: [4, 8] },
  "seongnam-jungang":      { noise: [16, 30], parking: [12, 25], trash: [7, 16], road: [4, 9], construction: [8, 18], other: [3, 7] },
  "seongnam-yatap":        { noise: [12, 24], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "seongnam-taepyeong":    { noise: [16, 30], parking: [14, 26], trash: [7, 16], road: [4, 9], construction: [8, 18], other: [3, 7] },
  // 고양 추가
  "goyang-baekseok":       { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "goyang-daehwa":         { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "goyang-haengsin":       { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 8], construction: [6, 14], other: [3, 6] },
  // 용인 추가
  "yongin-seongbok":       { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "yongin-bojeong":        { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [6, 14], other: [2, 6] },
  "yongin-mohyeon":        { noise: [6, 14], parking: [5, 12], trash: [3, 8], road: [2, 6], construction: [4, 10], other: [2, 4] },
  // 부천 추가
  "bucheon-ojeong":        { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "bucheon-sosa":          { noise: [16, 30], parking: [14, 26], trash: [7, 16], road: [4, 10], construction: [5, 12], other: [3, 7] },
  // 안양 추가
  "anyang-hogye":          { noise: [12, 24], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "anyang-seoksu":         { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  // 안산 추가
  "ansan-wongok":          { noise: [16, 30], parking: [14, 28], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "ansan-sadong":          { noise: [10, 20], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },
  // 화성 추가
  "hwaseong-bongdam":      { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "hwaseong-hyangnam":     { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },
  // 평택 추가
  "pyeongtaek-godeok":     { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [12, 28], other: [2, 5] },
  "pyeongtaek-seojeong":   { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [4, 8], construction: [6, 14], other: [3, 6] },
  // 김포 추가
  "gimpo-pungmu":          { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [8, 18], other: [2, 6] },
  "gimpo-yangchon":        { noise: [6, 14], parking: [6, 12], trash: [3, 8], road: [2, 6], construction: [4, 10], other: [2, 4] },
  // 파주 추가
  "paju-gyoha":            { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "paju-munsan":           { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  // 하남 추가
  "hanam-sinjang":         { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [8, 18], other: [2, 6] },
  "hanam-deokpung":        { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [4, 8], construction: [8, 18], other: [3, 6] },
  // 광명 추가
  "gwangmyeong-soha":      { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [8, 18], other: [2, 6] },
  "gwangmyeong-gwangmyeong": { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  // 의정부 추가
  "uijeongbu-howon":       { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [6, 14], other: [2, 5] },
  "uijeongbu-nokyang":     { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  // 남양주 추가
  "namyangju-hopyeong":    { noise: [10, 20], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [8, 18], other: [2, 5] },
  "namyangju-pyeongnae":   { noise: [10, 22], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [8, 18], other: [2, 5] },
  // 구리 추가
  "guri-sutaek":           { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "guri-gyomun":           { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },

  // ── 인천 ──
  "incheon-songdo":        { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },
  "incheon-yeonsu":        { noise: [12, 24], parking: [10, 22], trash: [6, 14], road: [4, 8], construction: [6, 14], other: [3, 6] },
  "incheon-ganseok":       { noise: [18, 34], parking: [15, 30], trash: [8, 18], road: [5, 10], construction: [6, 14], other: [4, 9] },
  "incheon-guwol":         { noise: [20, 36], parking: [15, 30], trash: [8, 18], road: [5, 12], construction: [8, 18], other: [4, 9] },
  "incheon-bupyeong":      { noise: [22, 40], parking: [18, 35], trash: [10, 22], road: [5, 12], construction: [8, 18], other: [5, 10] },
  "incheon-sipjeong":      { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "incheon-geomdan":       { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [12, 28], other: [2, 5] },
  "incheon-cheongna":      { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "incheon-hagik":         { noise: [15, 28], parking: [12, 24], trash: [7, 15], road: [4, 9], construction: [8, 18], other: [3, 7] },
  "incheon-yonghyeon":     { noise: [20, 36], parking: [16, 30], trash: [10, 20], road: [5, 12], construction: [6, 14], other: [5, 10] },
  "incheon-gyesan":        { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "incheon-jakjeon":       { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "incheon-unseo":         { noise: [10, 20], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "incheon-sinpo":         { noise: [18, 34], parking: [15, 28], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [4, 8] },

  // ── 부산 ──
  "busan-udong":           { noise: [18, 35], parking: [15, 28], trash: [6, 14], road: [4, 10], construction: [8, 18], other: [3, 8] },
  "busan-jungdong":        { noise: [25, 45], parking: [18, 35], trash: [10, 22], road: [5, 12], construction: [6, 14], other: [5, 12] },
  "busan-jwadong":         { noise: [12, 24], parking: [10, 22], trash: [5, 12], road: [4, 8], construction: [5, 12], other: [2, 6] },
  "busan-bujeon":          { noise: [25, 45], parking: [20, 38], trash: [10, 22], road: [5, 12], construction: [6, 14], other: [5, 12] },
  "busan-jeonpo":          { noise: [18, 32], parking: [12, 25], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "busan-gwangan":         { noise: [20, 36], parking: [15, 28], trash: [8, 16], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "busan-namcheon":        { noise: [14, 26], parking: [10, 22], trash: [5, 12], road: [3, 8], construction: [8, 20], other: [2, 6] },
  "busan-daeyeon":         { noise: [18, 32], parking: [14, 28], trash: [8, 16], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "busan-yongho":          { noise: [8, 18], parking: [6, 14], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "busan-hadan":           { noise: [18, 34], parking: [15, 28], trash: [8, 18], road: [5, 10], construction: [6, 14], other: [4, 8] },
  "busan-dangni":          { noise: [14, 26], parking: [10, 22], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "busan-myeongnyun":      { noise: [16, 30], parking: [12, 25], trash: [7, 15], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "busan-oncheon":         { noise: [14, 26], parking: [10, 22], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "busan-jangjeon":        { noise: [20, 36], parking: [15, 28], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "busan-bugok":           { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "busan-geoje":           { noise: [16, 30], parking: [14, 26], trash: [7, 15], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "busan-yeonsan":         { noise: [20, 36], parking: [16, 30], trash: [8, 18], road: [5, 10], construction: [6, 14], other: [4, 9] },
  "busan-jurye":           { noise: [18, 32], parking: [14, 28], trash: [8, 16], road: [5, 10], construction: [6, 14], other: [4, 8] },
  "busan-gamjeon":         { noise: [20, 36], parking: [14, 28], trash: [8, 18], road: [5, 10], construction: [6, 14], other: [4, 9] },

  // ── 대구 ──
  "daegu-beomeo":          { noise: [18, 32], parking: [14, 28], trash: [6, 14], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "daegu-manchon":         { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "daegu-sangin":          { noise: [16, 30], parking: [14, 26], trash: [7, 16], road: [4, 10], construction: [6, 14], other: [3, 7] },
  "daegu-wolseong":        { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 7], construction: [5, 12], other: [2, 5] },
  "daegu-dongsungro":      { noise: [30, 55], parking: [22, 42], trash: [12, 25], road: [5, 12], construction: [6, 14], other: [6, 14] },
  "daegu-samdeok":         { noise: [18, 34], parking: [14, 28], trash: [8, 16], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "daegu-chimsan":         { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "daegu-sangyeok":        { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "daegu-sinam":           { noise: [18, 32], parking: [14, 28], trash: [7, 16], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "daegu-hyomok":          { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "daegu-daemyeong":       { noise: [20, 36], parking: [16, 30], trash: [8, 18], road: [5, 10], construction: [5, 12], other: [4, 9] },
  "daegu-bongdeok":        { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },

  // ── 대전 ──
  "daejeon-bongmyeong":    { noise: [20, 36], parking: [15, 30], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [4, 9] },
  "daejeon-gungdong":      { noise: [22, 40], parking: [18, 32], trash: [10, 20], road: [5, 10], construction: [5, 12], other: [5, 10] },
  "daejeon-dunsan":        { noise: [20, 36], parking: [15, 30], trash: [7, 16], road: [4, 10], construction: [6, 14], other: [4, 8] },
  "daejeon-tanbang":       { noise: [14, 26], parking: [12, 24], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "daejeon-daeheung":      { noise: [22, 40], parking: [16, 30], trash: [10, 20], road: [5, 12], construction: [5, 12], other: [5, 10] },
  "daejeon-eunhaeng":      { noise: [25, 42], parking: [18, 34], trash: [10, 22], road: [5, 12], construction: [5, 12], other: [5, 10] },

  // ── 광주 ──
  "gwangju-chipyeong":     { noise: [18, 32], parking: [14, 28], trash: [7, 15], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "gwangju-nongseong":     { noise: [18, 34], parking: [14, 28], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "gwangju-yongbong":      { noise: [20, 36], parking: [15, 28], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [4, 8] },
  "gwangju-unam":          { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "gwangju-bongseon":      { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [3, 8], construction: [5, 12], other: [3, 6] },
  "gwangju-juwol":         { noise: [10, 20], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },

  // ── 울산 ──
  "ulsan-samsan":          { noise: [18, 32], parking: [14, 28], trash: [6, 14], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "ulsan-dal":             { noise: [22, 38], parking: [16, 30], trash: [8, 18], road: [5, 10], construction: [5, 12], other: [4, 8] },
  "ulsan-seongnam":        { noise: [22, 40], parking: [16, 30], trash: [10, 20], road: [5, 12], construction: [5, 12], other: [5, 10] },
  "ulsan-hakseong":        { noise: [18, 32], parking: [12, 24], trash: [7, 15], road: [4, 9], construction: [4, 10], other: [3, 7] },

  // ── 세종 ──
  "sejong-boram":          { noise: [6, 14], parking: [6, 14], trash: [3, 8], road: [3, 7], construction: [10, 24], other: [2, 5] },
  "sejong-naseong":        { noise: [6, 12], parking: [6, 14], trash: [3, 8], road: [3, 7], construction: [10, 22], other: [2, 4] },
  "sejong-dodam":          { noise: [6, 14], parking: [6, 14], trash: [3, 8], road: [3, 7], construction: [10, 24], other: [2, 5] },

  // ── 제주 ──
  "jeju-yeondong":         { noise: [20, 38], parking: [18, 34], trash: [8, 18], road: [4, 10], construction: [5, 12], other: [5, 10] },
  "jeju-nohyeong":         { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "jeju-ido":              { noise: [18, 34], parking: [15, 28], trash: [8, 16], road: [4, 10], construction: [5, 12], other: [4, 8] },

  // ── 서울 추가 (중랑구·성북구·강북구·도봉구·금천구) ──
  "seoul-myeonmok":        { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "seoul-sangbong":        { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "seoul-mangu":           { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "seoul-gireum":          { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "seoul-jeongneung":      { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "seoul-donam":           { noise: [12, 24], parking: [10, 22], trash: [6, 14], road: [4, 8], construction: [5, 12], other: [3, 6] },
  "seoul-suyu":            { noise: [10, 20], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "seoul-mia":             { noise: [12, 24], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "seoul-beon":            { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "seoul-changdong":       { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [8, 18], other: [3, 7] },
  "seoul-banghak":         { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "seoul-ssangmun":        { noise: [10, 20], parking: [10, 18], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "seoul-gasan":           { noise: [18, 34], parking: [15, 28], trash: [8, 16], road: [5, 10], construction: [8, 18], other: [4, 8] },
  "seoul-doksan":          { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [6, 14], other: [3, 7] },
  "seoul-siheung":         { noise: [10, 20], parking: [8, 18], trash: [5, 12], road: [3, 7], construction: [5, 12], other: [2, 5] },

  // ── 부산 추가 (북구·동구·서구·영도구·강서구·기장군) ──
  "busan-gupo":            { noise: [14, 28], parking: [12, 24], trash: [7, 15], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "busan-deokcheon":       { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "busan-beomil":          { noise: [18, 34], parking: [15, 28], trash: [8, 18], road: [5, 12], construction: [8, 18], other: [4, 9] },
  "busan-choryang":        { noise: [22, 38], parking: [16, 30], trash: [10, 20], road: [5, 12], construction: [6, 14], other: [5, 10] },
  "busan-dongdaesin":      { noise: [14, 26], parking: [10, 22], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "busan-seodaesin":       { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [4, 8], construction: [5, 12], other: [2, 6] },
  "busan-dongsam":         { noise: [10, 20], parking: [8, 18], trash: [5, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "busan-cheonghak":       { noise: [14, 26], parking: [10, 22], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "busan-myeongji":        { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [12, 28], other: [2, 5] },
  "busan-dajeo":           { noise: [6, 14], parking: [6, 14], trash: [3, 8], road: [3, 7], construction: [5, 12], other: [2, 4] },
  "busan-gijang":          { noise: [10, 20], parking: [8, 18], trash: [5, 10], road: [3, 8], construction: [6, 14], other: [2, 5] },
  "busan-jeonggwan":       { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },

  // ── 인천 추가 (동구) ──
  "incheon-songnim":       { noise: [16, 30], parking: [14, 26], trash: [8, 16], road: [4, 10], construction: [6, 14], other: [4, 8] },
  "incheon-hwasu":         { noise: [18, 32], parking: [14, 28], trash: [8, 18], road: [5, 10], construction: [5, 12], other: [4, 8] },

  // ── 대구 추가 (서구·달성군) ──
  "daegu-bisan":           { noise: [14, 26], parking: [12, 24], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 7] },
  "daegu-naedang":         { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "daegu-dasa":            { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [12, 28], other: [2, 5] },
  "daegu-hwawon":          { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [8, 18], other: [2, 5] },

  // ── 대전 추가 (동구·대덕구) ──
  "daejeon-yongjeon":      { noise: [20, 36], parking: [16, 30], trash: [8, 18], road: [5, 12], construction: [5, 12], other: [4, 9] },
  "daejeon-panam":         { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 8], construction: [5, 12], other: [2, 6] },
  "daejeon-sintanjin":     { noise: [12, 24], parking: [10, 20], trash: [5, 12], road: [4, 8], construction: [6, 14], other: [3, 6] },
  "daejeon-beopdong":      { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 7], construction: [5, 12], other: [2, 5] },

  // ── 광주 추가 (동구·광산구) ──
  "gwangju-chungjang":     { noise: [25, 42], parking: [18, 34], trash: [10, 20], road: [5, 12], construction: [5, 12], other: [5, 10] },
  "gwangju-sansu":         { noise: [12, 22], parking: [10, 20], trash: [5, 12], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "gwangju-suwan":         { noise: [10, 20], parking: [8, 18], trash: [4, 10], road: [3, 7], construction: [10, 22], other: [2, 5] },
  "gwangju-cheomdan":      { noise: [8, 16], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [10, 24], other: [2, 5] },

  // ── 울산 추가 (동구·북구·울주군) ──
  "ulsan-jeonha":          { noise: [18, 32], parking: [14, 26], trash: [7, 15], road: [4, 10], construction: [5, 12], other: [3, 7] },
  "ulsan-ilsan":           { noise: [14, 26], parking: [12, 22], trash: [6, 14], road: [4, 9], construction: [5, 12], other: [3, 6] },
  "ulsan-yeonam":          { noise: [10, 20], parking: [8, 18], trash: [5, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "ulsan-maegok":          { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [4, 10], other: [2, 5] },
  "ulsan-samnam":          { noise: [6, 14], parking: [6, 12], trash: [3, 8], road: [2, 6], construction: [3, 8], other: [2, 4] },
  "ulsan-beomseo":         { noise: [8, 18], parking: [8, 16], trash: [4, 10], road: [3, 7], construction: [8, 18], other: [2, 5] },
};

export const complaints: Complaint[] = Object.entries(complaintProfiles).flatMap(
  ([id, profile]) => generateComplaints(id, profile),
);

// ─── 소음 포인트 ───────────────────────────────────────────────

export const noisePoints: NoisePoint[] = [
  // 강남구
  { id: "np-yeoksam-1", lat: 37.5015, lng: 127.0374, level: 4, type: "traffic", description: "강남대로 차량 소음이 심한 구간" },
  { id: "np-yeoksam-2", lat: 37.4998, lng: 127.0350, level: 3, type: "nightlife", description: "역삼역 주변 유흥가 심야 소음" },
  { id: "np-samsung-1", lat: 37.5092, lng: 127.0610, level: 3, type: "traffic", description: "영동대로 교통 체증 구간" },
  { id: "np-samsung-2", lat: 37.5105, lng: 127.0595, level: 2, type: "construction", description: "현대차 GBC 공사 현장" },
  { id: "np-daechi-1", lat: 37.4955, lng: 127.0610, level: 2, type: "traffic", description: "학원가 주변 차량 이중주차 경적" },
  { id: "np-nonhyeon-1", lat: 37.5120, lng: 127.0270, level: 5, type: "nightlife", description: "논현동 유흥가 심야 소음 심각" },
  { id: "np-nonhyeon-2", lat: 37.5110, lng: 127.0300, level: 3, type: "traffic", description: "강남대로·논현로 교차 교통 소음" },

  // 서초구
  { id: "np-seocho-1", lat: 37.4925, lng: 127.0160, level: 3, type: "traffic", description: "서초대로 출퇴근 시간 교통 소음" },
  { id: "np-banpo-1", lat: 37.5085, lng: 126.9920, level: 2, type: "construction", description: "반포 재건축 공사 현장" },
  { id: "np-bangbae-1", lat: 37.4815, lng: 126.9890, level: 2, type: "traffic", description: "방배로 주변 교통량" },

  // 마포구
  { id: "np-hapjeong-1", lat: 37.5500, lng: 126.9145, level: 3, type: "nightlife", description: "합정역 주변 카페·바 야간 소음" },
  { id: "np-hapjeong-2", lat: 37.5490, lng: 126.9130, level: 2, type: "traffic", description: "양화로 교통 소음" },
  { id: "np-mangwon-1", lat: 37.5568, lng: 126.9105, level: 3, type: "nightlife", description: "망원동 카페거리 주말 소음" },
  { id: "np-yeonnam-1", lat: 37.5665, lng: 126.9250, level: 4, type: "nightlife", description: "연남동 주말 관광객 소음" },
  { id: "np-yeonnam-2", lat: 37.5655, lng: 126.9240, level: 3, type: "traffic", description: "홍대입구역 주변 교통 혼잡" },
  { id: "np-sangsu-1", lat: 37.5480, lng: 126.9240, level: 3, type: "nightlife", description: "상수역 주변 바 밀집 지역" },

  // 송파구
  { id: "np-jamsil-1", lat: 37.5140, lng: 127.1010, level: 4, type: "nightlife", description: "잠실역 롯데월드 주변 관광 소음" },
  { id: "np-jamsil-2", lat: 37.5125, lng: 127.0990, level: 3, type: "traffic", description: "올림픽로 교통 체증" },
  { id: "np-garak-1", lat: 37.4965, lng: 127.1185, level: 3, type: "construction", description: "가락 재건축 공사" },
  { id: "np-munjeong-1", lat: 37.4860, lng: 127.1230, level: 2, type: "traffic", description: "문정로데오거리 주변 교통량" },

  // 영등포구
  { id: "np-yeouido-1", lat: 37.5225, lng: 126.9250, level: 3, type: "traffic", description: "여의대로 출퇴근 교통 정체" },
  { id: "np-dangsan-1", lat: 37.5345, lng: 126.9030, level: 3, type: "traffic", description: "당산역 교차로 교통 소음" },
  { id: "np-yeongdeungpo-1", lat: 37.5160, lng: 126.9080, level: 4, type: "nightlife", description: "영등포역 주변 유흥가 소음" },
  { id: "np-yeongdeungpo-2", lat: 37.5150, lng: 126.9070, level: 3, type: "traffic", description: "영등포로 대형 차량 통행" },

  // 용산구
  { id: "np-itaewon-1", lat: 37.5350, lng: 126.9950, level: 5, type: "nightlife", description: "이태원 클럽거리 심야 소음 극심" },
  { id: "np-itaewon-2", lat: 37.5340, lng: 126.9940, level: 4, type: "nightlife", description: "경리단길 바·레스토랑 야간 소음" },
  { id: "np-hannam-1", lat: 37.5345, lng: 127.0055, level: 2, type: "traffic", description: "한남대교 북단 교통 소음" },
  { id: "np-yongsan-1", lat: 37.5305, lng: 126.9815, level: 3, type: "construction", description: "용산 정비창 재개발 공사" },

  // 성동구
  { id: "np-seongsu-1", lat: 37.5450, lng: 127.0570, level: 3, type: "nightlife", description: "성수 카페거리 주말 혼잡" },
  { id: "np-seongsu-2", lat: 37.5440, lng: 127.0555, level: 3, type: "construction", description: "성수동 재개발 공사 현장" },
  { id: "np-wangsimni-1", lat: 37.5618, lng: 127.0375, level: 3, type: "traffic", description: "왕십리역 로터리 교통 소음" },
  { id: "np-oksu-1", lat: 37.5415, lng: 127.0175, level: 2, type: "traffic", description: "옥수역 부근 도로 교통량" },

  // 관악구
  { id: "np-sillim-1", lat: 37.4845, lng: 126.9305, level: 3, type: "nightlife", description: "신림역 주변 먹자골목 야간 소음" },
  { id: "np-sillim-2", lat: 37.4840, lng: 126.9295, level: 3, type: "traffic", description: "신림로 교통 정체" },
  { id: "np-bongcheon-1", lat: 37.4785, lng: 126.9520, level: 2, type: "traffic", description: "봉천역 주변 도로 소음" },

  // 노원구
  { id: "np-sanggye-1", lat: 37.6575, lng: 127.0720, level: 1, type: "traffic", description: "동일로 주간 교통량 (비교적 조용)" },
  { id: "np-junggye-1", lat: 37.6480, lng: 127.0750, level: 2, type: "traffic", description: "은행사거리 학원가 주변 차량" },
  { id: "np-hagye-1", lat: 37.6390, lng: 127.0670, level: 1, type: "other", description: "중랑천변 산책로 (매우 조용)" },

  // 은평구
  { id: "np-eungam-1", lat: 37.5988, lng: 126.9215, level: 2, type: "traffic", description: "응암역 주변 교통량" },
  { id: "np-bulgwang-1", lat: 37.6098, lng: 126.9295, level: 2, type: "traffic", description: "통일로 차량 소음" },
  { id: "np-nokbeon-1", lat: 37.6100, lng: 126.9372, level: 1, type: "other", description: "북한산 등산로 입구 (조용)" },

  // 강서구
  { id: "np-hwagok-1", lat: 37.5420, lng: 126.8400, level: 3, type: "traffic", description: "화곡로 교통 소음" },
  { id: "np-magok-1", lat: 37.5615, lng: 126.8270, level: 2, type: "construction", description: "마곡 R&D 단지 잔여 공사" },
  { id: "np-deungchon-1", lat: 37.5510, lng: 126.8555, level: 2, type: "traffic", description: "등촌역 주변 교통량" },

  // 구로구
  { id: "np-guro-1", lat: 37.4945, lng: 126.8850, level: 3, type: "factory", description: "구로디지털단지 산업 소음" },
  { id: "np-guro-2", lat: 37.4940, lng: 126.8840, level: 3, type: "traffic", description: "디지털로 교통 정체" },
  { id: "np-gocheok-1", lat: 37.5022, lng: 126.8625, level: 2, type: "other", description: "고척돔 행사 시 소음 (비정기)" },
  { id: "np-sindorim-1", lat: 37.5095, lng: 126.8915, level: 4, type: "traffic", description: "신도림역 교차로 상시 교통 소음" },

  // 동작구
  { id: "np-sadang-1", lat: 37.4770, lng: 126.9820, level: 3, type: "traffic", description: "사당역 교차로 교통 혼잡" },
  { id: "np-noryangjin-1", lat: 37.5136, lng: 126.9430, level: 3, type: "traffic", description: "노량진로 대형 차량 통행" },
  { id: "np-noryangjin-2", lat: 37.5130, lng: 126.9425, level: 2, type: "other", description: "수산시장 새벽 물류 차량" },
  { id: "np-heukseok-1", lat: 37.5076, lng: 126.9628, level: 2, type: "construction", description: "흑석 재개발 잔여 공사" },

  // 광진구
  { id: "np-gunja-1", lat: 37.5410, lng: 127.0705, level: 5, type: "nightlife", description: "건대입구 먹자골목 심야 소음 극심" },
  { id: "np-jayang-1", lat: 37.5350, lng: 127.0725, level: 3, type: "traffic", description: "자양로 교통량" },
  { id: "np-guui-1", lat: 37.5433, lng: 127.0860, level: 2, type: "traffic", description: "강변역 주변 도로 소음" },

  // 중구
  { id: "np-myeongdong-1", lat: 37.5640, lng: 126.9830, level: 5, type: "other", description: "명동 거리 상시 관광객 소음" },
  { id: "np-myeongdong-2", lat: 37.5632, lng: 126.9822, level: 4, type: "traffic", description: "명동·을지로 교통 정체" },
  { id: "np-chungmuro-1", lat: 37.5616, lng: 126.9952, level: 2, type: "traffic", description: "퇴계로 주간 교통 소음" },
  { id: "np-euljiro-1", lat: 37.5663, lng: 126.9922, level: 3, type: "nightlife", description: "힙지로 바 밀집 야간 소음" },

  // 종로구
  { id: "np-jongno-1", lat: 37.5710, lng: 126.9925, level: 4, type: "traffic", description: "종로대로 상시 교통 소음" },
  { id: "np-jongno-2", lat: 37.5705, lng: 126.9915, level: 3, type: "other", description: "탑골공원 주변 유동인구 소음" },
  { id: "np-hyehwa-1", lat: 37.5828, lng: 127.0022, level: 3, type: "nightlife", description: "대학로 주말 공연장 주변 소음" },
  { id: "np-samcheong-1", lat: 37.5828, lng: 126.9822, level: 1, type: "other", description: "삼청동 골목 (매우 조용)" },

  // 강동구
  { id: "np-cheonho-1", lat: 37.5390, lng: 127.1240, level: 3, type: "traffic", description: "천호대로 교통 소음" },
  { id: "np-gildong-1", lat: 37.5325, lng: 127.1383, level: 1, type: "other", description: "길동생태공원 인근 (조용)" },
  { id: "np-myeongil-1", lat: 37.5510, lng: 127.1445, level: 2, type: "construction", description: "고덕 신도시 잔여 공사" },

  // 서대문구
  { id: "np-yeonhui-1", lat: 37.5690, lng: 126.9350, level: 1, type: "other", description: "연희동 주택가 (매우 조용)" },
  { id: "np-sinchon-1", lat: 37.5558, lng: 126.9372, level: 5, type: "nightlife", description: "신촌 유흥가 심야 소음 극심" },
  { id: "np-sinchon-2", lat: 37.5550, lng: 126.9365, level: 3, type: "traffic", description: "신촌로 교통 혼잡" },
  { id: "np-hongje-1", lat: 37.5880, lng: 126.9440, level: 2, type: "traffic", description: "통일로 주간 교통 소음" },

  // 양천구
  { id: "np-mokdong-1", lat: 37.5282, lng: 126.8760, level: 2, type: "traffic", description: "목동로 학원가 이중주차 경적" },
  { id: "np-sinjeong-1", lat: 37.5176, lng: 126.8563, level: 2, type: "traffic", description: "신정네거리 교통량" },

  // 수원
  { id: "np-homaesil-1", lat: 37.2688, lng: 126.9762, level: 2, type: "construction", description: "호매실 신도시 잔여 개발 공사" },

  // 송파구 위례동
  { id: "np-wirye-1", lat: 37.4788, lng: 127.1425, level: 2, type: "construction", description: "위례신도시 잔여 개발 공사" },
  { id: "np-wirye-2", lat: 37.4780, lng: 127.1415, level: 1, type: "traffic", description: "위례중앙로 교통 (비교적 조용)" },

  // 동대문구 휘경동
  { id: "np-hwigyeong-1", lat: 37.5893, lng: 127.0585, level: 2, type: "traffic", description: "회기로 주간 교통 소음" },
  { id: "np-hwigyeong-2", lat: 37.5888, lng: 127.0575, level: 2, type: "other", description: "한국외대 주변 학생 유동인구" },

  // 동대문구 회기동
  { id: "np-hoegi-1", lat: 37.5897, lng: 127.0520, level: 3, type: "nightlife", description: "경희대 대학가 야간 소음" },

  // 동대문구 장안동
  { id: "np-jangan-1", lat: 37.5713, lng: 127.0683, level: 2, type: "traffic", description: "장한평역 주변 교통 소음" },

  // 동대문구 전농동
  { id: "np-jeonnong-1", lat: 37.5773, lng: 127.0573, level: 3, type: "traffic", description: "청량리역 주변 교통 혼잡" },

  // ── 경기도 ──
  // 성남시
  { id: "np-jeongja-1", lat: 37.3660, lng: 127.1090, level: 2, type: "traffic", description: "정자역 주변 출퇴근 교통 소음" },
  { id: "np-jeongja-2", lat: 37.3650, lng: 127.1080, level: 2, type: "nightlife", description: "정자동 카페거리 주말 소음" },
  { id: "np-seohyeon-1", lat: 37.3842, lng: 127.1235, level: 3, type: "traffic", description: "서현역 로터리 교통 혼잡" },
  { id: "np-seohyeon-2", lat: 37.3835, lng: 127.1225, level: 2, type: "nightlife", description: "서현역 먹자골목 야간 소음" },
  { id: "np-sinheung-1", lat: 37.4452, lng: 127.1460, level: 3, type: "traffic", description: "구시가지 도로 교통 소음" },
  // 고양시
  { id: "np-madu-1", lat: 37.6540, lng: 126.7752, level: 2, type: "traffic", description: "호수공원 진입로 주말 교통 혼잡" },
  { id: "np-juyeop-1", lat: 37.6708, lng: 126.7565, level: 1, type: "other", description: "주엽동 주거지 (조용한 편)" },
  { id: "np-hwajeong-1", lat: 37.6172, lng: 126.8323, level: 3, type: "traffic", description: "화정역 사거리 교통 소음" },
  // 용인시
  { id: "np-jukjeon-1", lat: 37.3256, lng: 127.1082, level: 2, type: "traffic", description: "죽전역 주변 출퇴근 교통량" },
  { id: "np-gugal-1", lat: 37.2821, lng: 127.1152, level: 2, type: "traffic", description: "구갈역 주변 도로 소음" },
  { id: "np-yongin-yeoksam-1", lat: 37.2367, lng: 127.2055, level: 1, type: "other", description: "처인구 주거지 (매우 조용)" },
  // 부천시
  { id: "np-sangdong-1", lat: 37.5053, lng: 126.7542, level: 2, type: "traffic", description: "상동역 주변 교통량" },
  { id: "np-bucheon-jungdong-1", lat: 37.5035, lng: 126.7652, level: 3, type: "traffic", description: "부천시청역 사거리 교통 소음" },
  // 안양시
  { id: "np-pyeongchon-1", lat: 37.3897, lng: 126.9515, level: 2, type: "traffic", description: "평촌역 학원가 주변 이중주차 경적" },
  { id: "np-anyang-1", lat: 37.4018, lng: 126.9225, level: 3, type: "traffic", description: "안양역 주변 교통 혼잡" },
  // 안산시
  { id: "np-gojan-1", lat: 37.3216, lng: 126.8308, level: 3, type: "traffic", description: "중앙역 주변 교통 소음" },
  { id: "np-bono-1", lat: 37.3035, lng: 126.8652, level: 2, type: "traffic", description: "본오동 주간 교통량" },
  // 화성시
  { id: "np-dongtan-1", lat: 37.2008, lng: 127.0750, level: 2, type: "construction", description: "동탄2 잔여 개발 공사" },
  { id: "np-dongtan-2", lat: 37.2000, lng: 127.0740, level: 2, type: "traffic", description: "동탄대로 출퇴근 교통량" },
  { id: "np-byeongjeom-1", lat: 37.2237, lng: 127.0130, level: 2, type: "traffic", description: "병점역 주변 교통 소음" },
  // 평택시
  { id: "np-pyeongtaek-1", lat: 37.9930, lng: 127.0858, level: 3, type: "traffic", description: "평택역 주변 도로 소음" },
  { id: "np-bijeon-1", lat: 36.9951, lng: 127.1050, level: 2, type: "construction", description: "비전택지지구 잔여 공사" },
  // 김포시
  { id: "np-janggi-1", lat: 37.6363, lng: 126.6798, level: 2, type: "construction", description: "한강신도시 잔여 개발 공사" },
  { id: "np-gurae-1", lat: 37.6348, lng: 126.6665, level: 1, type: "other", description: "구래동 호수공원 인근 (조용)" },
  // 파주시
  { id: "np-unjeong-1", lat: 37.7146, lng: 126.7480, level: 2, type: "construction", description: "운정신도시 잔여 개발 공사" },
  { id: "np-geumchon-1", lat: 37.7604, lng: 126.7820, level: 2, type: "traffic", description: "금촌역 주변 교통 소음" },
  // 하남시
  { id: "np-misa-1", lat: 37.5607, lng: 127.1822, level: 2, type: "construction", description: "미사강변도시 잔여 개발 공사" },
  { id: "np-pungsan-1", lat: 37.5533, lng: 127.2008, level: 2, type: "construction", description: "교산 신도시 예정 공사" },
  // 광명시
  { id: "np-cheolsan-1", lat: 37.4771, lng: 126.8670, level: 3, type: "traffic", description: "철산역 사거리 교통 소음" },
  { id: "np-haan-1", lat: 37.4597, lng: 126.8708, level: 2, type: "traffic", description: "하안동 주간 도로 소음" },
  // 의정부시
  { id: "np-minrak-1", lat: 37.7506, lng: 127.0803, level: 2, type: "construction", description: "민락지구 잔여 공사" },
  { id: "np-uijeongbu-1", lat: 37.7386, lng: 127.0343, level: 3, type: "traffic", description: "의정부역 주변 교통 혼잡" },
  // 남양주시
  { id: "np-dasan-1", lat: 37.6121, lng: 127.1502, level: 2, type: "construction", description: "다산신도시 잔여 개발 공사" },
  { id: "np-byeollae-1", lat: 37.6418, lng: 127.1212, level: 2, type: "construction", description: "별내신도시 잔여 공사" },
  // 구리시
  { id: "np-inchang-1", lat: 37.6000, lng: 127.1318, level: 2, type: "traffic", description: "구리역 주변 교통 소음" },
  { id: "np-galmae-1", lat: 37.6207, lng: 127.1180, level: 1, type: "other", description: "갈매지구 주거지 (조용한 편)" },
  // 수원 추가
  { id: "np-suwon-jeongja-1", lat: 37.3043, lng: 127.0068, level: 2, type: "traffic", description: "성균관대역 주변 교통 소음" },
  { id: "np-suwon-jowon-1", lat: 37.2948, lng: 126.9868, level: 2, type: "traffic", description: "조원동 주간 도로 소음" },
  { id: "np-suwon-ingye-1", lat: 37.2681, lng: 127.0315, level: 3, type: "nightlife", description: "인계동 먹자골목 야간 소음" },
  { id: "np-suwon-maegyo-1", lat: 37.2801, lng: 127.0148, level: 3, type: "construction", description: "매교역 주변 재개발 공사" },
  { id: "np-suwon-yeongtong-1", lat: 37.2548, lng: 127.0570, level: 2, type: "traffic", description: "영통역 주변 출퇴근 교통량" },
  { id: "np-suwon-gwanggyo-1", lat: 37.2848, lng: 127.0481, level: 1, type: "other", description: "광교호수공원 인근 (조용)" },
  { id: "np-suwon-maetan-1", lat: 37.2648, lng: 127.0381, level: 2, type: "traffic", description: "삼성전자 출퇴근 교통량" },
  { id: "np-suwon-gwonseon-1", lat: 37.2588, lng: 126.9761, level: 3, type: "traffic", description: "권선동 구도심 교통 혼잡" },
  // 성남 추가
  { id: "np-seongnam-seongnam-1", lat: 37.4401, lng: 127.1581, level: 3, type: "traffic", description: "성남동 구시가지 교통 소음" },
  { id: "np-seongnam-jungang-1", lat: 37.4301, lng: 127.1481, level: 3, type: "traffic", description: "모란역 주변 교통 혼잡" },
  { id: "np-yatap-1", lat: 37.4115, lng: 127.1281, level: 2, type: "traffic", description: "야탑역 주변 출퇴근 교통량" },
  { id: "np-taepyeong-1", lat: 37.4501, lng: 127.1381, level: 3, type: "construction", description: "태평동 재개발 공사" },
  // 고양 추가
  { id: "np-baekseok-1", lat: 37.6501, lng: 126.7748, level: 2, type: "traffic", description: "백석역 주변 출퇴근 교통량" },
  { id: "np-daehwa-1", lat: 37.6748, lng: 126.7481, level: 1, type: "other", description: "대화동 주거지 (조용한 편)" },
  { id: "np-haengsin-1", lat: 37.6201, lng: 126.8281, level: 2, type: "traffic", description: "행신역 주변 교통 소음" },
  // 용인 추가
  { id: "np-seongbok-1", lat: 37.3201, lng: 127.0881, level: 2, type: "traffic", description: "성복역 주변 출퇴근 교통량" },
  { id: "np-bojeong-1", lat: 37.3201, lng: 127.1081, level: 2, type: "nightlife", description: "보정동 카페거리 주말 소음" },
  { id: "np-mohyeon-1", lat: 37.2801, lng: 127.1881, level: 1, type: "other", description: "모현읍 전원지역 (매우 조용)" },
  // 부천 추가
  { id: "np-ojeong-1", lat: 37.5201, lng: 126.7881, level: 2, type: "factory", description: "오정동 산업단지 주간 소음" },
  { id: "np-sosa-1", lat: 37.4881, lng: 126.7981, level: 3, type: "traffic", description: "소사역 주변 교통 혼잡" },
  // 안양 추가
  { id: "np-hogye-1", lat: 37.3901, lng: 126.9581, level: 2, type: "traffic", description: "범계역 주변 학원가 교통" },
  { id: "np-seoksu-1", lat: 37.3981, lng: 126.9181, level: 2, type: "traffic", description: "석수역 주변 도로 소음" },
  // 안산 추가
  { id: "np-wongok-1", lat: 37.3201, lng: 126.8081, level: 3, type: "nightlife", description: "원곡동 다문화거리 야간 소음" },
  { id: "np-sadong-1", lat: 37.3081, lng: 126.8481, level: 2, type: "traffic", description: "사동 주간 교통량" },
  // 화성 추가
  { id: "np-bongdam-1", lat: 37.2181, lng: 126.9481, level: 2, type: "construction", description: "봉담택지지구 잔여 공사" },
  { id: "np-hyangnam-1", lat: 37.1481, lng: 126.9181, level: 2, type: "construction", description: "향남택지지구 개발 공사" },
  // 평택 추가
  { id: "np-godeok-1", lat: 37.0881, lng: 127.0881, level: 2, type: "construction", description: "고덕신도시 개발 공사" },
  { id: "np-seojeong-1", lat: 37.0681, lng: 127.0181, level: 2, type: "traffic", description: "서정리역 주변 교통 소음" },
  // 김포 추가
  { id: "np-pungmu-1", lat: 37.6181, lng: 126.7181, level: 2, type: "traffic", description: "풍무역 주변 교통량" },
  { id: "np-yangchon-1", lat: 37.5881, lng: 126.6881, level: 1, type: "other", description: "양촌읍 전원지역 (조용)" },
  // 파주 추가
  { id: "np-gyoha-1", lat: 37.7281, lng: 126.7481, level: 2, type: "construction", description: "교하신도시 잔여 개발 공사" },
  { id: "np-munsan-1", lat: 37.8581, lng: 126.7881, level: 2, type: "traffic", description: "문산역 주변 교통 소음" },
  // 하남 추가
  { id: "np-sinjang-1", lat: 37.5481, lng: 127.2181, level: 2, type: "traffic", description: "하남시청역 주변 교통 소음" },
  { id: "np-deokpung-1", lat: 37.5381, lng: 127.2081, level: 2, type: "traffic", description: "덕풍동 주간 도로 소음" },
  // 광명 추가
  { id: "np-soha-1", lat: 37.4481, lng: 126.8781, level: 2, type: "construction", description: "소하택지지구 잔여 공사" },
  { id: "np-gwangmyeong-gwangmyeong-1", lat: 37.4681, lng: 126.8581, level: 3, type: "traffic", description: "광명전통시장 주변 교통 혼잡" },
  // 의정부 추가
  { id: "np-howon-1", lat: 37.7481, lng: 127.0481, level: 2, type: "traffic", description: "회룡역 주변 교통 소음" },
  { id: "np-nokyang-1", lat: 37.7381, lng: 127.0581, level: 2, type: "traffic", description: "녹양역 주변 도로 소음" },
  // 남양주 추가
  { id: "np-hopyeong-1", lat: 37.6581, lng: 127.2281, level: 2, type: "traffic", description: "호평역 주변 출퇴근 교통량" },
  { id: "np-pyeongnae-1", lat: 37.6381, lng: 127.2181, level: 2, type: "traffic", description: "평내호평역 주변 교통 소음" },
  // 구리 추가
  { id: "np-sutaek-1", lat: 37.6081, lng: 127.1381, level: 3, type: "traffic", description: "수택동 전통시장 주변 교통 혼잡" },
  { id: "np-gyomun-1", lat: 37.5981, lng: 127.1281, level: 2, type: "traffic", description: "교문동 주간 도로 소음" },

  // ── 인천 ──
  { id: "np-songdo-1", lat: 37.3826, lng: 126.6583, level: 2, type: "construction", description: "송도국제도시 잔여 개발 공사" },
  { id: "np-songdo-2", lat: 37.3820, lng: 126.6575, level: 1, type: "other", description: "센트럴파크 인근 (조용)" },
  { id: "np-incheon-yeonsu-1", lat: 37.4103, lng: 126.6785, level: 2, type: "traffic", description: "연수역 주변 교통량" },
  { id: "np-ganseok-1", lat: 37.4510, lng: 126.7236, level: 3, type: "traffic", description: "간석오거리 교통 혼잡" },
  { id: "np-guwol-1", lat: 37.4503, lng: 126.7045, level: 3, type: "traffic", description: "구월동 모래내시장 주변 교통 소음" },
  { id: "np-bupyeong-1", lat: 37.4897, lng: 126.7240, level: 4, type: "nightlife", description: "부평 문화의거리 야간 소음" },
  { id: "np-bupyeong-2", lat: 37.4890, lng: 126.7232, level: 3, type: "traffic", description: "부평역 지하상가 주변 교통 혼잡" },
  { id: "np-sipjeong-1", lat: 37.4977, lng: 126.7355, level: 2, type: "traffic", description: "백운역 주변 교통 소음" },
  { id: "np-geomdan-1", lat: 37.5923, lng: 126.6521, level: 2, type: "construction", description: "검단신도시 개발 공사" },
  { id: "np-cheongna-1", lat: 37.5271, lng: 126.6464, level: 2, type: "construction", description: "청라국제도시 잔여 공사" },
  { id: "np-hagik-1", lat: 37.4394, lng: 126.6718, level: 2, type: "traffic", description: "인하대역 주변 교통량" },
  { id: "np-yonghyeon-1", lat: 37.4536, lng: 126.6521, level: 3, type: "traffic", description: "인천역 주변 교통 소음" },
  // 계양구
  { id: "np-gyesan-1", lat: 37.5373, lng: 126.7333, level: 2, type: "traffic", description: "계산역 주변 교통 소음" },
  { id: "np-jakjeon-1", lat: 37.5263, lng: 126.7293, level: 2, type: "traffic", description: "작전역 사거리 교통량" },
  // 인천 중구
  { id: "np-unseo-1", lat: 37.4933, lng: 126.4933, level: 2, type: "other", description: "공항 항공기 이착륙 소음" },
  { id: "np-sinpo-1", lat: 37.4738, lng: 126.6258, level: 3, type: "nightlife", description: "신포국제시장 주변 야간 소음" },

  // ── 부산 ──
  { id: "np-udong-1", lat: 37.1639, lng: 129.1303, level: 3, type: "traffic", description: "센텀시티 출퇴근 교통 소음" },
  { id: "np-udong-2", lat: 35.1633, lng: 129.1297, level: 2, type: "other", description: "벡스코 행사 시 소음 (비정기)" },
  { id: "np-busan-jungdong-1", lat: 35.1625, lng: 129.1626, level: 4, type: "nightlife", description: "해운대 해수욕장 주변 관광 소음" },
  { id: "np-jwadong-1", lat: 35.1730, lng: 129.1750, level: 2, type: "traffic", description: "장산역 주변 교통량" },
  { id: "np-bujeon-1", lat: 35.1585, lng: 129.0596, level: 4, type: "nightlife", description: "서면 유흥가 심야 소음" },
  { id: "np-bujeon-2", lat: 35.1578, lng: 129.0590, level: 3, type: "traffic", description: "서면로 교통 혼잡" },
  { id: "np-jeonpo-1", lat: 35.1525, lng: 129.0625, level: 2, type: "nightlife", description: "전포카페거리 주말 소음" },
  { id: "np-gwangan-1", lat: 35.1535, lng: 129.1138, level: 3, type: "nightlife", description: "광안리 해변 야간 소음" },
  { id: "np-namcheon-1", lat: 35.1420, lng: 129.1087, level: 2, type: "construction", description: "삼익비치 재건축 공사" },
  { id: "np-daeyeon-1", lat: 35.1344, lng: 129.0840, level: 3, type: "nightlife", description: "경성대·부경대 대학가 야간 소음" },
  { id: "np-yongho-1", lat: 35.1156, lng: 129.1089, level: 1, type: "other", description: "이기대 산책로 (매우 조용)" },
  { id: "np-hadan-1", lat: 35.1071, lng: 128.9666, level: 3, type: "traffic", description: "하단역 주변 교통 혼잡" },
  { id: "np-dangni-1", lat: 35.0970, lng: 128.9751, level: 2, type: "traffic", description: "당리역 주변 도로 소음" },
  { id: "np-myeongnyun-1", lat: 35.2047, lng: 129.0814, level: 3, type: "traffic", description: "동래역 주변 교통 소음" },
  { id: "np-oncheon-1", lat: 35.2104, lng: 129.0781, level: 2, type: "other", description: "온천장역 주변 유동인구" },
  // 금정구
  { id: "np-jangjeon-1", lat: 35.2297, lng: 129.0891, level: 3, type: "nightlife", description: "부산대 대학가 야간 소음" },
  { id: "np-bugok-1", lat: 35.2353, lng: 129.0833, level: 2, type: "traffic", description: "부산대앞역 주변 교통량" },
  // 연제구
  { id: "np-geoje-1", lat: 35.1823, lng: 129.0663, level: 2, type: "traffic", description: "거제역 주변 교통 소음" },
  { id: "np-yeonsan-1", lat: 35.1765, lng: 129.0783, level: 3, type: "traffic", description: "연산 로터리 교통 혼잡" },
  // 사상구
  { id: "np-jurye-1", lat: 35.1523, lng: 129.0153, level: 3, type: "traffic", description: "주례역 주변 교통 소음" },
  { id: "np-gamjeon-1", lat: 35.1448, lng: 129.0083, level: 3, type: "factory", description: "사상공업지대 산업 소음" },

  // ── 대구 ──
  { id: "np-beomeo-1", lat: 35.8592, lng: 128.6272, level: 3, type: "traffic", description: "범어네거리 교통 소음" },
  { id: "np-manchon-1", lat: 35.8534, lng: 128.6387, level: 2, type: "traffic", description: "수성못 주변 주말 교통 혼잡" },
  { id: "np-sangin-1", lat: 35.8285, lng: 128.5350, level: 3, type: "traffic", description: "상인역 주변 교통 소음" },
  { id: "np-wolseong-1", lat: 35.8349, lng: 128.5544, level: 2, type: "traffic", description: "월배역 주변 도로 소음" },
  { id: "np-dongsungro-1", lat: 35.8689, lng: 128.5966, level: 5, type: "nightlife", description: "동성로 중심 번화가 상시 소음" },
  { id: "np-dongsungro-2", lat: 35.8683, lng: 128.5960, level: 3, type: "traffic", description: "중앙대로 교통 소음" },
  { id: "np-samdeok-1", lat: 35.8723, lng: 128.6031, level: 2, type: "nightlife", description: "삼덕동 카페 골목 주말 소음" },
  { id: "np-chimsan-1", lat: 35.8871, lng: 128.5790, level: 2, type: "traffic", description: "침산역 주변 교통량" },
  { id: "np-sangyeok-1", lat: 35.8955, lng: 128.6061, level: 2, type: "other", description: "경북대 주변 학생 유동인구" },
  // 대구 동구
  { id: "np-sinam-1", lat: 35.8813, lng: 128.6293, level: 3, type: "traffic", description: "동대구역 인근 교통 혼잡" },
  { id: "np-hyomok-1", lat: 35.8723, lng: 128.6353, level: 2, type: "traffic", description: "동구청역 주변 교통량" },
  // 대구 남구
  { id: "np-daemyeong-1", lat: 35.8453, lng: 128.5783, level: 3, type: "nightlife", description: "대명 먹자골목 야간 소음" },
  { id: "np-bongdeok-1", lat: 35.8503, lng: 128.5953, level: 2, type: "traffic", description: "남구청역 주변 교통 소음" },

  // ── 대전 ──
  { id: "np-bongmyeong-1", lat: 36.3568, lng: 127.3495, level: 3, type: "nightlife", description: "봉명동 먹자골목 야간 소음" },
  { id: "np-gungdong-1", lat: 36.3628, lng: 127.3452, level: 3, type: "nightlife", description: "충남대 앞 대학가 야간 소음" },
  { id: "np-dunsan-1", lat: 36.3541, lng: 127.3840, level: 3, type: "traffic", description: "둔산대로 출퇴근 교통 소음" },
  { id: "np-tanbang-1", lat: 36.3505, lng: 127.3746, level: 2, type: "traffic", description: "탄방동 주변 교통량" },
  { id: "np-daeheung-1", lat: 36.3280, lng: 127.4218, level: 3, type: "traffic", description: "대전역 주변 교통 소음" },
  { id: "np-eunhaeng-1", lat: 36.3289, lng: 127.4273, level: 3, type: "nightlife", description: "으능정이 거리 야간 소음" },

  // ── 광주 ──
  { id: "np-chipyeong-1", lat: 35.1475, lng: 126.8511, level: 3, type: "nightlife", description: "상무지구 먹자골목 야간 소음" },
  { id: "np-nongseong-1", lat: 35.1530, lng: 126.8809, level: 2, type: "traffic", description: "농성역 주변 교통 소음" },
  { id: "np-yongbong-1", lat: 35.1771, lng: 126.8950, level: 3, type: "nightlife", description: "전남대 대학가 야간 소음" },
  { id: "np-unam-1", lat: 35.1706, lng: 126.8653, level: 1, type: "other", description: "운암동 주거지 (조용한 편)" },
  { id: "np-bongseon-1", lat: 35.1300, lng: 126.8922, level: 2, type: "traffic", description: "봉선동 학원가 주변 교통량" },
  { id: "np-juwol-1", lat: 35.1235, lng: 126.8834, level: 1, type: "other", description: "주월동 주거지 (조용한 편)" },

  // ── 울산 ──
  { id: "np-samsan-1", lat: 35.5396, lng: 129.3388, level: 3, type: "traffic", description: "삼산동 중심가 교통 소음" },
  { id: "np-dal-1", lat: 35.5343, lng: 129.3265, level: 3, type: "nightlife", description: "달동 먹자골목 야간 소음" },
  { id: "np-ulsan-seongnam-1", lat: 35.5576, lng: 129.3146, level: 3, type: "traffic", description: "성남동 중앙시장 주변 교통 소음" },
  { id: "np-hakseong-1", lat: 35.5588, lng: 129.3233, level: 2, type: "other", description: "태화강변 산책로 (비교적 조용)" },

  // ── 세종 ──
  { id: "np-boram-1", lat: 36.5043, lng: 127.0003, level: 2, type: "construction", description: "세종시 잔여 개발 공사" },
  { id: "np-naseong-1", lat: 36.5098, lng: 126.9943, level: 1, type: "other", description: "나성동 주거지 (매우 조용)" },
  { id: "np-dodam-1", lat: 36.5153, lng: 127.0068, level: 2, type: "construction", description: "세종 신도시 잔여 공사" },

  // ── 제주 ──
  { id: "np-yeondong-1", lat: 33.4892, lng: 126.4930, level: 3, type: "nightlife", description: "연동 상권 야간 관광객 소음" },
  { id: "np-yeondong-2", lat: 33.4886, lng: 126.4924, level: 3, type: "traffic", description: "연동 중심가 교통 혼잡" },
  { id: "np-nohyeong-1", lat: 33.4833, lng: 126.4771, level: 2, type: "traffic", description: "노형동 주간 교통량" },
  { id: "np-ido-1", lat: 33.5060, lng: 126.5293, level: 2, type: "traffic", description: "이도동 시청 주변 교통 소음" },

  // ── 서울 중랑구 ──
  { id: "np-myeonmok-1", lat: 37.5842, lng: 127.0850, level: 2, type: "traffic", description: "면목역 주변 교통 소음" },
  { id: "np-sangbong-1", lat: 37.5970, lng: 127.0858, level: 2, type: "traffic", description: "상봉역 주변 교통량" },
  { id: "np-mangu-1", lat: 37.5990, lng: 127.0935, level: 1, type: "other", description: "망우동 주거지 (조용한 편)" },

  // ── 서울 성북구 ──
  { id: "np-gireum-1", lat: 37.6038, lng: 127.0248, level: 2, type: "traffic", description: "길음역 주변 교통 소음" },
  { id: "np-jeongneung-1", lat: 37.6106, lng: 126.9600, level: 1, type: "other", description: "정릉동 주거지 (조용한 편)" },
  { id: "np-donam-1", lat: 37.5925, lng: 127.0183, level: 2, type: "traffic", description: "성신여대입구역 주변 교통량" },

  // ── 서울 강북구 ──
  { id: "np-suyu-1", lat: 37.6398, lng: 127.0256, level: 2, type: "traffic", description: "수유역 주변 교통 소음" },
  { id: "np-mia-1", lat: 37.6258, lng: 127.0283, level: 2, type: "traffic", description: "미아사거리역 주변 교통량" },
  { id: "np-beon-1", lat: 37.6343, lng: 127.0348, level: 1, type: "other", description: "번동 주거지 (조용한 편)" },

  // ── 서울 도봉구 ──
  { id: "np-changdong-1", lat: 37.6537, lng: 127.0475, level: 2, type: "traffic", description: "창동역 환승 교통 소음" },
  { id: "np-changdong-2", lat: 37.6530, lng: 127.0468, level: 2, type: "construction", description: "창동 아레나 개발 공사" },
  { id: "np-banghak-1", lat: 37.6627, lng: 127.0395, level: 1, type: "other", description: "방학동 주거지 (조용한 편)" },
  { id: "np-ssangmun-1", lat: 37.6488, lng: 127.0348, level: 2, type: "traffic", description: "쌍문역 주변 교통량" },

  // ── 서울 금천구 ──
  { id: "np-gasan-1", lat: 37.4783, lng: 126.8823, level: 3, type: "traffic", description: "가산디지털단지역 출퇴근 교통 혼잡" },
  { id: "np-gasan-2", lat: 37.4775, lng: 126.8815, level: 2, type: "factory", description: "가산단지 주변 산업 소음" },
  { id: "np-doksan-1", lat: 37.4681, lng: 126.8956, level: 2, type: "traffic", description: "독산역 주변 교통 소음" },
  { id: "np-siheung-1", lat: 37.4556, lng: 126.9088, level: 1, type: "other", description: "시흥동 주거지 (조용한 편)" },

  // ── 부산 북구 ──
  { id: "np-gupo-1", lat: 35.1973, lng: 128.9885, level: 2, type: "traffic", description: "구포시장 주변 교통 소음" },
  { id: "np-deokcheon-1", lat: 35.2048, lng: 129.0018, level: 2, type: "traffic", description: "덕천역 주변 교통량" },

  // ── 부산 동구 ──
  { id: "np-beomil-1", lat: 35.1348, lng: 129.0481, level: 3, type: "traffic", description: "범일역 주변 교통 소음" },
  { id: "np-beomil-2", lat: 35.1340, lng: 129.0475, level: 2, type: "construction", description: "범일동 재개발 공사 현장" },
  { id: "np-choryang-1", lat: 35.1208, lng: 129.0398, level: 3, type: "traffic", description: "부산역 주변 교통 혼잡" },
  { id: "np-choryang-2", lat: 35.1200, lng: 129.0390, level: 2, type: "nightlife", description: "차이나타운 야간 관광객 소음" },

  // ── 부산 서구 ──
  { id: "np-dongdaesin-1", lat: 35.1088, lng: 129.0181, level: 2, type: "traffic", description: "동대신역 주변 교통 소음" },
  { id: "np-seodaesin-1", lat: 35.1045, lng: 129.0101, level: 1, type: "other", description: "서대신동 주거지 (조용한 편)" },

  // ── 부산 영도구 ──
  { id: "np-dongsam-1", lat: 35.0715, lng: 129.0805, level: 1, type: "other", description: "동삼동 해안가 (조용한 편)" },
  { id: "np-cheonghak-1", lat: 35.0848, lng: 129.0635, level: 2, type: "traffic", description: "청학동 영도대교 인근 교통량" },

  // ── 부산 강서구 ──
  { id: "np-myeongji-1", lat: 35.0848, lng: 128.9281, level: 2, type: "construction", description: "명지신도시 개발 공사" },
  { id: "np-dajeo-1", lat: 35.1248, lng: 128.9581, level: 1, type: "other", description: "대저동 농촌지역 (매우 조용)" },

  // ── 부산 기장군 ──
  { id: "np-gijang-1", lat: 35.2448, lng: 129.2181, level: 2, type: "traffic", description: "기장시장 주변 교통 소음" },
  { id: "np-jeonggwan-1", lat: 35.3248, lng: 129.1781, level: 2, type: "construction", description: "정관신도시 잔여 개발 공사" },

  // ── 인천 동구 ──
  { id: "np-songnim-1", lat: 37.4738, lng: 126.6435, level: 2, type: "traffic", description: "송림시장 주변 교통 소음" },
  { id: "np-hwasu-1", lat: 37.4701, lng: 126.6281, level: 2, type: "traffic", description: "인천항 인근 대형차량 통행 소음" },

  // ── 대구 서구 ──
  { id: "np-bisan-1", lat: 35.8675, lng: 128.5648, level: 2, type: "traffic", description: "비산네거리 주변 교통량" },
  { id: "np-naedang-1", lat: 35.8601, lng: 128.5705, level: 1, type: "other", description: "내당동 주거지 (조용한 편)" },

  // ── 대구 달성군 ──
  { id: "np-dasa-1", lat: 35.8901, lng: 128.5381, level: 2, type: "construction", description: "다사신도시 개발 공사" },
  { id: "np-hwawon-1", lat: 35.8201, lng: 128.5581, level: 1, type: "other", description: "화원읍 주거지 (조용한 편)" },

  // ── 대전 동구 ──
  { id: "np-yongjeon-1", lat: 36.3281, lng: 127.4348, level: 3, type: "traffic", description: "대전역 인근 교통 혼잡" },
  { id: "np-panam-1", lat: 36.3201, lng: 127.4581, level: 1, type: "other", description: "판암동 주거지 (조용한 편)" },

  // ── 대전 대덕구 ──
  { id: "np-sintanjin-1", lat: 36.4281, lng: 127.4248, level: 2, type: "traffic", description: "신탄진역 주변 교통 소음" },
  { id: "np-beopdong-1", lat: 36.3881, lng: 127.4181, level: 1, type: "other", description: "법동 주거지 (조용한 편)" },

  // ── 광주 동구 ──
  { id: "np-chungjang-1", lat: 35.1491, lng: 126.9181, level: 3, type: "nightlife", description: "충장로 번화가 야간 유동인구 소음" },
  { id: "np-sansu-1", lat: 35.1548, lng: 126.9281, level: 1, type: "other", description: "산수동 주거지 (조용한 편)" },

  // ── 광주 광산구 ──
  { id: "np-suwan-1", lat: 35.1901, lng: 126.8181, level: 2, type: "construction", description: "수완지구 잔여 개발 공사" },
  { id: "np-cheomdan-1", lat: 35.2201, lng: 126.8481, level: 1, type: "other", description: "첨단지구 주거지 (조용한 편)" },

  // ── 울산 동구 ──
  { id: "np-jeonha-1", lat: 35.5048, lng: 129.4181, level: 3, type: "factory", description: "현대중공업 인근 산업 소음" },
  { id: "np-ilsan-1", lat: 35.5201, lng: 129.4281, level: 2, type: "factory", description: "조선소 주변 작업 소음" },

  // ── 울산 북구 ──
  { id: "np-yeonam-1", lat: 35.5901, lng: 129.3581, level: 1, type: "other", description: "연암동 주거지 (조용한 편)" },
  { id: "np-maegok-1", lat: 35.5701, lng: 129.3181, level: 1, type: "other", description: "매곡동 주거지 (조용한 편)" },

  // ── 울산 울주군 ──
  { id: "np-samnam-1", lat: 35.5201, lng: 129.1681, level: 1, type: "other", description: "삼남읍 시외 지역 (매우 조용)" },
  { id: "np-beomseo-1", lat: 35.5601, lng: 129.2581, level: 2, type: "construction", description: "범서읍 택지개발 공사" },
];

// ─── 주민 리뷰 ─────────────────────────────────────────────────

export const reviews: AreaReview[] = [
  // 강남구 역삼동
  { id: "rv-yeoksam-1", neighborhoodId: "gangnam-yeoksam", rating: 4, pros: "직장이 가까워서 출퇴근이 편하고, 맛집도 많아요", cons: "밤에 좀 시끄럽고, 월세가 비싼 편이에요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-yeoksam-2", neighborhoodId: "gangnam-yeoksam", rating: 3, pros: "교통이 편리하고 뭐든지 가까이에 있어요", cons: "주차가 너무 힘들고 퇴근 시간 인파가 장난 아니에요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-yeoksam-3", neighborhoodId: "gangnam-yeoksam", rating: 4, pros: "IT 회사 밀집이라 네트워킹 하기 좋아요", cons: "골목 안쪽도 주말엔 사람이 많아요", livedYears: "1년 미만", createdAt: "2024-11-20" },

  // 강남구 삼성동
  { id: "rv-samsung-1", neighborhoodId: "gangnam-samsung", rating: 4, pros: "코엑스가 걸어서 5분이라 문화생활이 풍부해요", cons: "코엑스 행사 때 주변 교통이 마비돼요", livedYears: "3~5년", createdAt: "2025-01-22" },
  { id: "rv-samsung-2", neighborhoodId: "gangnam-samsung", rating: 5, pros: "주거 환경이 쾌적하고 한강 접근도 좋아요", cons: "물가가 전반적으로 비싸요", livedYears: "5년 이상", createdAt: "2024-12-05" },

  // 강남구 대치동
  { id: "rv-daechi-1", neighborhoodId: "gangnam-daechi", rating: 4, pros: "교육 환경이 정말 좋고, 학원가가 잘 되어있어요", cons: "밤 10시에도 학원가 주변은 차가 막혀요", livedYears: "5년 이상", createdAt: "2025-02-01" },
  { id: "rv-daechi-2", neighborhoodId: "gangnam-daechi", rating: 4, pros: "아이 교육에 이만한 곳이 없어요", cons: "사교육비가 상상을 초월해요", livedYears: "3~5년", createdAt: "2024-10-15" },
  { id: "rv-daechi-3", neighborhoodId: "gangnam-daechi", rating: 3, pros: "지하철 3개 역이 가까워서 교통 편리", cons: "동네 전체가 학원가 분위기라 조금 삭막해요", livedYears: "1~3년", createdAt: "2024-09-28" },

  // 강남구 논현동
  { id: "rv-nonhyeon-1", neighborhoodId: "gangnam-nonhyeon", rating: 3, pros: "가로수길 가까워서 쇼핑, 외식 최고", cons: "금~토 밤엔 정말 시끄러워서 잠을 못 자요", livedYears: "1~3년", createdAt: "2025-01-12" },
  { id: "rv-nonhyeon-2", neighborhoodId: "gangnam-nonhyeon", rating: 3, pros: "맛집이 많아서 외식 걱정이 없어요", cons: "유흥가 쪽은 새벽에 취객 소음이 심해요", livedYears: "1년 미만", createdAt: "2024-11-30" },

  // 서초구 서초동
  { id: "rv-seocho-1", neighborhoodId: "seocho-seocho", rating: 4, pros: "법원, 검찰청이 가까워 법조인에겐 최적", cons: "예술의전당 공연 날 주변 주차 대란", livedYears: "3~5년", createdAt: "2025-02-08" },
  { id: "rv-seocho-2", neighborhoodId: "seocho-seocho", rating: 4, pros: "교대역 인근이라 교통이 편리하고 학교도 좋아요", cons: "집값이 너무 비싸요", livedYears: "5년 이상", createdAt: "2024-12-20" },

  // 서초구 반포동
  { id: "rv-banpo-1", neighborhoodId: "seocho-banpo", rating: 5, pros: "한강 산책로가 바로 앞이라 주거 만족도 최고", cons: "재건축 기간 동안 먼지와 소음이 있었어요", livedYears: "5년 이상", createdAt: "2025-01-05" },
  { id: "rv-banpo-2", neighborhoodId: "seocho-banpo", rating: 4, pros: "고속터미널역 지하상가가 편리해요", cons: "반포대로 교통 체증이 심한 편", livedYears: "3~5년", createdAt: "2024-11-15" },

  // 서초구 방배동
  { id: "rv-bangbae-1", neighborhoodId: "seocho-bangbae", rating: 4, pros: "서래마을 분위기가 좋고 카페도 많아요", cons: "언덕이 많아서 걸어다니기 불편할 때 있어요", livedYears: "3~5년", createdAt: "2025-02-20" },
  { id: "rv-bangbae-2", neighborhoodId: "seocho-bangbae", rating: 4, pros: "조용하면서도 사당역이 가까워 교통 편리", cons: "대형마트까지 좀 걸어야 해요", livedYears: "1~3년", createdAt: "2024-10-05" },

  // 마포구 합정동
  { id: "rv-hapjeong-1", neighborhoodId: "mapo-hapjeong", rating: 4, pros: "카페, 맛집이 정말 많고 한강이 가까워요", cons: "주말엔 외부 유입 인구로 좀 복잡해요", livedYears: "3~5년", createdAt: "2025-01-18" },
  { id: "rv-hapjeong-2", neighborhoodId: "mapo-hapjeong", rating: 4, pros: "2·6호선 환승역이라 어디든 갈 수 있어요", cons: "원룸 월세가 계속 오르고 있어요", livedYears: "1~3년", createdAt: "2024-12-10" },
  { id: "rv-hapjeong-3", neighborhoodId: "mapo-hapjeong", rating: 3, pros: "출판사가 많아서 문화적 분위기가 좋아요", cons: "양화로 소음이 좀 있는 편이에요", livedYears: "1년 미만", createdAt: "2024-09-15" },

  // 마포구 망원동
  { id: "rv-mangwon-1", neighborhoodId: "mapo-mangwon", rating: 4, pros: "망원시장에서 장 보기 편하고 한강공원이 가까워요", cons: "골목이 좁아서 택배 차량이 오면 복잡해요", livedYears: "3~5년", createdAt: "2025-02-05" },
  { id: "rv-mangwon-2", neighborhoodId: "mapo-mangwon", rating: 4, pros: "동네 카페, 빵집 수준이 높아요", cons: "주말 카페거리 인파가 장난 아니에요", livedYears: "1~3년", createdAt: "2024-11-25" },

  // 마포구 연남동
  { id: "rv-yeonnam-1", neighborhoodId: "mapo-yeonnam", rating: 3, pros: "연트럴파크 산책이 좋고 분위기 있는 가게가 많아요", cons: "주말엔 관광지처럼 붐벼서 살기 불편해요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-yeonnam-2", neighborhoodId: "mapo-yeonnam", rating: 3, pros: "홍대입구역이 가까워 교통이 좋아요", cons: "저녁부터 새벽까지 소음이 심한 날이 있어요", livedYears: "1년 미만", createdAt: "2024-10-20" },
  { id: "rv-yeonnam-3", neighborhoodId: "mapo-yeonnam", rating: 4, pros: "외국인 친구 사귀기 좋고 다양한 음식이 있어요", cons: "주차할 곳이 거의 없어요", livedYears: "1~3년", createdAt: "2024-08-30" },

  // 마포구 상수동
  { id: "rv-sangsu-1", neighborhoodId: "mapo-sangsu", rating: 4, pros: "조용한 편이면서도 핫한 가게들이 있어요", cons: "6호선만 있어서 환승이 필요할 때가 많아요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-sangsu-2", neighborhoodId: "mapo-sangsu", rating: 3, pros: "갤러리, 공방이 많아 문화적 분위기가 좋아요", cons: "마트가 좀 멀어서 장보기 불편", livedYears: "1년 미만", createdAt: "2024-12-01" },

  // 송파구 잠실동
  { id: "rv-jamsil-1", neighborhoodId: "songpa-jamsil", rating: 4, pros: "롯데월드, 석촌호수 등 놀거리가 많아요", cons: "관광객이 많아서 주말엔 혼잡해요", livedYears: "5년 이상", createdAt: "2025-01-30" },
  { id: "rv-jamsil-2", neighborhoodId: "songpa-jamsil", rating: 5, pros: "대단지 아파트라 커뮤니티 시설이 잘 되어 있어요", cons: "2호선 출퇴근 시간 지옥철", livedYears: "3~5년", createdAt: "2024-11-10" },

  // 송파구 가락동
  { id: "rv-garak-1", neighborhoodId: "songpa-garak", rating: 3, pros: "가락시장이 가까워서 신선한 재료 구하기 좋아요", cons: "재건축 공사로 먼지가 많아요", livedYears: "5년 이상", createdAt: "2025-02-18" },
  { id: "rv-garak-2", neighborhoodId: "songpa-garak", rating: 4, pros: "SRT 수서역이 가까워 지방 출장 편리", cons: "재건축 완료되면 집값이 더 오를까 걱정", livedYears: "3~5년", createdAt: "2024-10-25" },

  // 송파구 문정동
  { id: "rv-munjeong-1", neighborhoodId: "songpa-munjeong", rating: 4, pros: "법조단지 근무자에게 최적, 가든파이브 쇼핑도 편리", cons: "저녁엔 좀 한산한 편이에요", livedYears: "1~3년", createdAt: "2025-01-14" },
  { id: "rv-munjeong-2", neighborhoodId: "songpa-munjeong", rating: 4, pros: "신축 아파트가 많아서 주거 환경이 깨끗해요", cons: "맛집이 좀 부족한 편", livedYears: "1년 미만", createdAt: "2024-12-08" },

  // 영등포구 여의도동
  { id: "rv-yeouido-1", neighborhoodId: "yeongdeungpo-yeouido", rating: 4, pros: "한강공원이 바로 앞이고 여의도공원 산책 최고", cons: "평일 점심시간 식당 대기줄이 너무 길어요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-yeouido-2", neighborhoodId: "yeongdeungpo-yeouido", rating: 4, pros: "금융권 출근이 편하고 IFC몰이 있어 편리해요", cons: "주거 인구가 적어 주말엔 좀 쓸쓸해요", livedYears: "1~3년", createdAt: "2024-11-05" },

  // 영등포구 당산동
  { id: "rv-dangsan-1", neighborhoodId: "yeongdeungpo-dangsan", rating: 4, pros: "2·9호선 환승이라 여의도, 강남 출퇴근 편리", cons: "역 주변 먹자골목이 좀 어수선해요", livedYears: "1~3년", createdAt: "2025-01-20" },
  { id: "rv-dangsan-2", neighborhoodId: "yeongdeungpo-dangsan", rating: 3, pros: "당산역 인근 생활 인프라가 잘 갖춰져 있어요", cons: "노후 건물이 많은 편이에요", livedYears: "3~5년", createdAt: "2024-10-10" },

  // 영등포구 영등포동
  { id: "rv-yeongdeungpo-1", neighborhoodId: "yeongdeungpo-yeongdeungpo", rating: 3, pros: "타임스퀘어 쇼핑이 편하고 교통이 좋아요", cons: "영등포역 주변 유흥가가 밤에 시끄러워요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-yeongdeungpo-2", neighborhoodId: "yeongdeungpo-yeongdeungpo", rating: 2, pros: "물가가 저렴한 편이에요", cons: "밤에 치안이 불안하다고 느낄 때가 있어요", livedYears: "1년 미만", createdAt: "2024-12-15" },

  // 용산구 이태원동
  { id: "rv-itaewon-1", neighborhoodId: "yongsan-itaewon", rating: 3, pros: "세계 각국 음식을 맛볼 수 있어 먹거리 천국", cons: "금토 심야에 클럽 소음이 정말 심해요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-itaewon-2", neighborhoodId: "yongsan-itaewon", rating: 2, pros: "이국적 분위기가 독특하고 매력적이에요", cons: "취객 문제, 소음, 치안 우려가 있어요", livedYears: "1년 미만", createdAt: "2024-11-18" },
  { id: "rv-itaewon-3", neighborhoodId: "yongsan-itaewon", rating: 3, pros: "경리단길 카페들이 예쁘고 분위기 좋아요", cons: "언덕이 심해서 매일 오르내리기 힘들어요", livedYears: "1~3년", createdAt: "2024-09-05" },

  // 용산구 한남동
  { id: "rv-hannam-1", neighborhoodId: "yongsan-hannam", rating: 5, pros: "블루스퀘어, 갤러리 등 문화시설 접근성 좋아요", cons: "한남대교 진출입 시간대에 교통 정체", livedYears: "3~5년", createdAt: "2025-02-03" },
  { id: "rv-hannam-2", neighborhoodId: "yongsan-hannam", rating: 4, pros: "고급 주거지답게 동네가 깨끗하고 조용해요", cons: "물가가 비싸고 슈퍼가 좀 멀어요", livedYears: "1~3년", createdAt: "2024-12-22" },

  // 용산구 용산동
  { id: "rv-yongsan-1", neighborhoodId: "yongsan-yongsan", rating: 3, pros: "KTX 용산역이 가까워 지방 이동이 편리해요", cons: "재개발 전이라 주변이 좀 어수선해요", livedYears: "1~3년", createdAt: "2025-01-10" },
  { id: "rv-yongsan-2", neighborhoodId: "yongsan-yongsan", rating: 3, pros: "국립중앙박물관, 전쟁기념관이 가까워요", cons: "전자상가 쪽은 좀 낙후된 느낌이에요", livedYears: "3~5년", createdAt: "2024-10-30" },

  // 성동구 성수동
  { id: "rv-seongsu-1", neighborhoodId: "seongdong-seongsu", rating: 4, pros: "카페, 팝업스토어가 많아서 즐길 거리 풍부", cons: "주말 성수 카페거리 인파로 동네가 관광지화", livedYears: "1~3년", createdAt: "2025-02-14" },
  { id: "rv-seongsu-2", neighborhoodId: "seongdong-seongsu", rating: 4, pros: "뚝섬유원지 한강공원이 가까워요", cons: "재개발로 곳곳에 공사 현장이 있어요", livedYears: "1년 미만", createdAt: "2024-11-28" },
  { id: "rv-seongsu-3", neighborhoodId: "seongdong-seongsu", rating: 3, pros: "서울숲이 가까워 산책하기 좋아요", cons: "젠트리피케이션으로 임대료가 급등 중", livedYears: "3~5년", createdAt: "2024-08-20" },

  // 성동구 왕십리동
  { id: "rv-wangsimni-1", neighborhoodId: "seongdong-wangsimni", rating: 4, pros: "5개 노선 환승이라 교통이 정말 편리해요", cons: "역 주변이 좀 복잡하고 어수선한 편", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-wangsimni-2", neighborhoodId: "seongdong-wangsimni", rating: 3, pros: "비트플렉스 영화관이 있어서 문화생활 편리", cons: "한양대 앞 도로가 항상 막혀요", livedYears: "3~5년", createdAt: "2024-10-08" },

  // 성동구 옥수동
  { id: "rv-oksu-1", neighborhoodId: "seongdong-oksu", rating: 4, pros: "한강 조망이 정말 좋고 산책 환경 최고", cons: "역에서 아파트까지 오르막이 있어요", livedYears: "3~5년", createdAt: "2025-02-25" },
  { id: "rv-oksu-2", neighborhoodId: "seongdong-oksu", rating: 4, pros: "조용한 주거 환경, 녹지가 많아요", cons: "상권이 부족해서 장보기가 좀 불편해요", livedYears: "5년 이상", createdAt: "2024-12-18" },

  // 관악구 신림동
  { id: "rv-sillim-1", neighborhoodId: "gwanak-sillim", rating: 3, pros: "월세가 저렴하고 먹거리가 다양해요", cons: "밤에 혼자 다니기 좀 불안할 때가 있어요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-sillim-2", neighborhoodId: "gwanak-sillim", rating: 3, pros: "서울대 도서관을 이용할 수 있어서 좋아요", cons: "고시원·원룸 밀집이라 주거 환경이 좀 열악해요", livedYears: "1년 미만", createdAt: "2024-11-12" },
  { id: "rv-sillim-3", neighborhoodId: "gwanak-sillim", rating: 2, pros: "신림선 개통 후 교통이 좋아졌어요", cons: "골목 안쪽 위생 상태가 안 좋은 곳이 있어요", livedYears: "1~3년", createdAt: "2024-09-20" },

  // 관악구 봉천동
  { id: "rv-bongcheon-1", neighborhoodId: "gwanak-bongcheon", rating: 3, pros: "관악산 등산을 생활처럼 할 수 있어요", cons: "언덕이 많아서 자전거 타기 힘들어요", livedYears: "3~5년", createdAt: "2025-02-08" },
  { id: "rv-bongcheon-2", neighborhoodId: "gwanak-bongcheon", rating: 3, pros: "2호선 봉천역이 가까워 교통 편리", cons: "원룸 밀집 지역은 밤에 좀 어두워요", livedYears: "1~3년", createdAt: "2024-10-18" },

  // 노원구 상계동
  { id: "rv-sanggye-1", neighborhoodId: "nowon-sanggye", rating: 4, pros: "조용하고 아이 키우기 좋은 환경이에요", cons: "강남 출퇴근이 1시간 이상 걸려요", livedYears: "5년 이상", createdAt: "2025-01-08" },
  { id: "rv-sanggye-2", neighborhoodId: "nowon-sanggye", rating: 4, pros: "수락산 등산이 일상, 공기가 좋아요", cons: "문화시설이 좀 부족하고 외식 선택지가 적어요", livedYears: "3~5년", createdAt: "2024-12-02" },
  { id: "rv-sanggye-3", neighborhoodId: "nowon-sanggye", rating: 3, pros: "대단지 아파트라 관리가 잘 돼요", cons: "역에서 아파트까지 거리가 좀 있어요", livedYears: "1~3년", createdAt: "2024-09-10" },

  // 노원구 중계동
  { id: "rv-junggye-1", neighborhoodId: "nowon-junggye", rating: 4, pros: "학원가가 잘 되어 있어 교육 환경 좋아요", cons: "학원가 주변 이중주차가 심해요", livedYears: "5년 이상", createdAt: "2025-02-12" },
  { id: "rv-junggye-2", neighborhoodId: "nowon-junggye", rating: 4, pros: "불암산이 가까워 자연 환경이 좋아요", cons: "7호선이 출퇴근 시간에 매우 혼잡해요", livedYears: "3~5년", createdAt: "2024-11-08" },

  // 노원구 하계동
  { id: "rv-hagye-1", neighborhoodId: "nowon-hagye", rating: 4, pros: "중랑천 산책로가 정말 좋아요", cons: "대형 쇼핑몰이 없어서 좀 불편해요", livedYears: "3~5년", createdAt: "2025-01-28" },
  { id: "rv-hagye-2", neighborhoodId: "nowon-hagye", rating: 3, pros: "서울과기대 학생들이 많아 활기차요", cons: "7호선 한 노선이라 환승이 필요해요", livedYears: "1~3년", createdAt: "2024-10-22" },

  // 은평구 응암동
  { id: "rv-eungam-1", neighborhoodId: "eunpyeong-eungam", rating: 4, pros: "6호선 이용 편리, 은평한옥마을도 가까워요", cons: "번화가가 없어서 외식이 좀 단조로워요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-eungam-2", neighborhoodId: "eunpyeong-eungam", rating: 3, pros: "전세가 저렴한 편이에요", cons: "역에서 집까지 오르막이 있어요", livedYears: "1~3년", createdAt: "2024-11-20" },

  // 은평구 불광동
  { id: "rv-bulgwang-1", neighborhoodId: "eunpyeong-bulgwang", rating: 4, pros: "북한산 접근이 좋아 주말마다 등산해요", cons: "연신내 쪽 유흥가가 좀 지저분해요", livedYears: "3~5년", createdAt: "2025-01-05" },
  { id: "rv-bulgwang-2", neighborhoodId: "eunpyeong-bulgwang", rating: 3, pros: "3·6호선 환승이 편리해요", cons: "동네가 좀 오래된 느낌이에요", livedYears: "1~3년", createdAt: "2024-10-28" },

  // 은평구 녹번동
  { id: "rv-nokbeon-1", neighborhoodId: "eunpyeong-nokbeon", rating: 4, pros: "북한산 코앞이라 공기가 정말 좋아요", cons: "상권이 부족해서 장보기 좀 불편해요", livedYears: "3~5년", createdAt: "2025-02-20" },
  { id: "rv-nokbeon-2", neighborhoodId: "eunpyeong-nokbeon", rating: 4, pros: "은평뉴타운이 인접해서 발전하고 있어요", cons: "3호선 출퇴근 시간 혼잡해요", livedYears: "1~3년", createdAt: "2024-12-12" },

  // 강서구 화곡동
  { id: "rv-hwagok-1", neighborhoodId: "gangseo-hwagok", rating: 3, pros: "5호선 이용 가능하고 물가가 저렴해요", cons: "골목이 좁고 주차 전쟁이에요", livedYears: "3~5년", createdAt: "2025-01-18" },
  { id: "rv-hwagok-2", neighborhoodId: "gangseo-hwagok", rating: 3, pros: "김포공항이 가까워 제주도 자주 가요", cons: "비행기 소음이 가끔 있어요", livedYears: "1~3년", createdAt: "2024-11-02" },

  // 강서구 마곡동
  { id: "rv-magok-1", neighborhoodId: "gangseo-magok", rating: 5, pros: "신축 아파트라 깨끗하고 서울식물원이 가까워요", cons: "R&D 단지 공사가 아직 남아있어 먼지가 있어요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-magok-2", neighborhoodId: "gangseo-magok", rating: 4, pros: "마곡나루역 주변이 쾌적하고 현대적이에요", cons: "아직 상권이 완전히 형성되지 않았어요", livedYears: "1년 미만", createdAt: "2024-12-28" },
  { id: "rv-magok-3", neighborhoodId: "gangseo-magok", rating: 4, pros: "LG, 코오롱 등 대기업 근무자에게 최적", cons: "주말에 할 것이 좀 없어요", livedYears: "1~3년", createdAt: "2024-09-15" },

  // 강서구 등촌동
  { id: "rv-deungchon-1", neighborhoodId: "gangseo-deungchon", rating: 3, pros: "한강까지 자전거로 10분이면 가요", cons: "역에서 좀 멀어서 버스를 타야 해요", livedYears: "3~5년", createdAt: "2025-01-25" },
  { id: "rv-deungchon-2", neighborhoodId: "gangseo-deungchon", rating: 3, pros: "이마트가 가까워서 장보기 편해요", cons: "맛집이 좀 부족해요", livedYears: "1~3년", createdAt: "2024-10-15" },

  // 구로구 구로동
  { id: "rv-guro-1", neighborhoodId: "guro-guro", rating: 3, pros: "G밸리 출퇴근이 편하고 직장인 인프라가 잘 돼 있어요", cons: "다문화 거리 쪽은 호불호가 갈려요", livedYears: "1~3년", createdAt: "2025-02-18" },
  { id: "rv-guro-2", neighborhoodId: "guro-guro", rating: 3, pros: "구로디지털단지역이 가까워 교통 편리", cons: "공장 지대 느낌이 좀 남아있어요", livedYears: "1년 미만", createdAt: "2024-11-22" },

  // 구로구 고척동
  { id: "rv-gocheok-1", neighborhoodId: "guro-gocheok", rating: 4, pros: "안양천 산책로가 좋고 비교적 조용해요", cons: "고척돔 경기 날엔 주변이 복잡해요", livedYears: "3~5년", createdAt: "2025-01-12" },
  { id: "rv-gocheok-2", neighborhoodId: "guro-gocheok", rating: 3, pros: "주거 위주라 살기 편안해요", cons: "지하철역까지 거리가 있어서 버스 이용 필수", livedYears: "1~3년", createdAt: "2024-10-05" },

  // 구로구 신도림동
  { id: "rv-sindorim-1", neighborhoodId: "guro-sindorim", rating: 3, pros: "1·2호선 환승역이라 어디든 빠르게 갈 수 있어요", cons: "역 주변 유동인구가 너무 많아 시끄러워요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-sindorim-2", neighborhoodId: "guro-sindorim", rating: 4, pros: "디큐브시티에서 영화·쇼핑 원스톱 가능", cons: "신도림역 출퇴근 시간 인파가 상상 이상", livedYears: "3~5년", createdAt: "2024-12-10" },

  // 동작구 사당동
  { id: "rv-sadang-1", neighborhoodId: "dongjak-sadang", rating: 4, pros: "2·4호선 환승이라 강남·종로 모두 편리해요", cons: "사당역 먹자골목이 밤에 좀 어수선해요", livedYears: "3~5년", createdAt: "2025-01-20" },
  { id: "rv-sadang-2", neighborhoodId: "dongjak-sadang", rating: 3, pros: "과천·분당 방면 버스가 많아 경기도 접근 좋아요", cons: "주차가 정말 힘들어요", livedYears: "1~3년", createdAt: "2024-11-08" },

  // 동작구 노량진동
  { id: "rv-noryangjin-1", neighborhoodId: "dongjak-noryangjin", rating: 3, pros: "노량진 수산시장에서 신선한 회를 저렴하게 먹어요", cons: "고시촌 분위기라 전체적으로 활기가 없어요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-noryangjin-2", neighborhoodId: "dongjak-noryangjin", rating: 3, pros: "한강 접근이 좋고 1호선 이용 편리", cons: "수산시장 새벽 물류 차량 소음이 있어요", livedYears: "1년 미만", createdAt: "2024-12-18" },

  // 동작구 흑석동
  { id: "rv-heukseok-1", neighborhoodId: "dongjak-heukseok", rating: 4, pros: "한강 조망이 좋고 재개발 후 환경이 깨끗해요", cons: "9호선 한 노선이라 다른 곳 갈 때 환승 필요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-heukseok-2", neighborhoodId: "dongjak-heukseok", rating: 4, pros: "중앙대 캠퍼스가 예쁘고 동네도 조용해요", cons: "상권이 좀 부족해요", livedYears: "3~5년", createdAt: "2024-10-12" },

  // 광진구 건대입구
  { id: "rv-gunja-1", neighborhoodId: "gwangjin-gunja", rating: 3, pros: "먹거리·즐길거리가 정말 다양해요", cons: "금~토 밤 유흥가 소음이 심각해요", livedYears: "1~3년", createdAt: "2025-02-10" },
  { id: "rv-gunja-2", neighborhoodId: "gwangjin-gunja", rating: 3, pros: "커먼그라운드, 스타시티 등 쇼핑 편리", cons: "취객들이 새벽까지 돌아다녀요", livedYears: "1년 미만", createdAt: "2024-11-25" },
  { id: "rv-gunja-3", neighborhoodId: "gwangjin-gunja", rating: 4, pros: "2·7호선 환승이라 교통이 편리해요", cons: "건대 앞 이중주차가 너무 심해요", livedYears: "3~5년", createdAt: "2024-08-15" },

  // 광진구 자양동
  { id: "rv-jayang-1", neighborhoodId: "gwangjin-jayang", rating: 3, pros: "뚝섬유원지가 가까워 한강 나들이 좋아요", cons: "중국 음식거리 주변 냄새가 신경 쓰여요", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-jayang-2", neighborhoodId: "gwangjin-jayang", rating: 4, pros: "스타시티 상가가 편리하고 어린이대공원 가까워요", cons: "자양사거리 교통 체증이 심해요", livedYears: "3~5년", createdAt: "2024-12-05" },

  // 광진구 구의동
  { id: "rv-guui-1", neighborhoodId: "gwangjin-guui", rating: 4, pros: "강변역 테크노마트가 가깝고 한강 산책 좋아요", cons: "아차산로 교통이 좀 혼잡한 편", livedYears: "1~3년", createdAt: "2025-02-18" },
  { id: "rv-guui-2", neighborhoodId: "gwangjin-guui", rating: 3, pros: "광진구청이 가까워 행정 업무 편리", cons: "2호선만 있어서 환승이 필요할 때가 많아요", livedYears: "3~5년", createdAt: "2024-10-28" },

  // 중구 명동
  { id: "rv-myeongdong-1", neighborhoodId: "junggu-myeongdong", rating: 2, pros: "뭐든 가까이에 있고 백화점 쇼핑 최고", cons: "관광객 인파로 평일에도 걷기 힘들어요", livedYears: "1년 미만", createdAt: "2025-01-30" },
  { id: "rv-myeongdong-2", neighborhoodId: "junggu-myeongdong", rating: 3, pros: "직장이 명동이라 출퇴근이 편해요", cons: "주거 환경이라기보다 상업지구예요. 마트가 없어요", livedYears: "1~3년", createdAt: "2024-11-15" },

  // 중구 충무로
  { id: "rv-chungmuro-1", neighborhoodId: "junggu-chungmuro", rating: 3, pros: "3·4호선 환승이라 어디든 편리해요", cons: "인쇄 골목 차량 통행이 좀 위험해요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-chungmuro-2", neighborhoodId: "junggu-chungmuro", rating: 4, pros: "동국대 캠퍼스가 예쁘고 남산이 가까워요", cons: "주변에 주거용 마트가 부족해요", livedYears: "3~5년", createdAt: "2024-12-20" },

  // 중구 을지로동
  { id: "rv-euljiro-1", neighborhoodId: "junggu-euljiro", rating: 4, pros: "힙지로 감성 가득한 바와 카페가 매력적", cons: "노후 건물 밀집이라 소방 안전이 걱정돼요", livedYears: "1년 미만", createdAt: "2025-01-22" },
  { id: "rv-euljiro-2", neighborhoodId: "junggu-euljiro", rating: 3, pros: "세운상가 리모델링으로 분위기가 좋아졌어요", cons: "주거 인구가 적어 밤엔 좀 으스스해요", livedYears: "1~3년", createdAt: "2024-10-15" },

  // 종로구 종로동
  { id: "rv-jongno-1", neighborhoodId: "jongno-jongno", rating: 3, pros: "종각역이 가까워 도심 어디든 접근 편리", cons: "종로 대로변 소음이 상당해요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-jongno-2", neighborhoodId: "jongno-jongno", rating: 3, pros: "광화문, 청계천이 걸어서 갈 수 있어요", cons: "집회·시위가 잦아서 주말에 불편할 때 있어요", livedYears: "3~5년", createdAt: "2024-11-28" },

  // 종로구 혜화동
  { id: "rv-hyehwa-1", neighborhoodId: "jongno-hyehwa", rating: 4, pros: "대학로 연극 보기 좋고 문화생활 풍부해요", cons: "주말 공연 시간에 혜화역 주변이 붐벼요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-hyehwa-2", neighborhoodId: "jongno-hyehwa", rating: 4, pros: "성균관대 분위기가 좋고 학구적이에요", cons: "언덕이 좀 있어서 걸어다니기 힘든 구간이 있어요", livedYears: "3~5년", createdAt: "2024-12-08" },

  // 종로구 삼청동
  { id: "rv-samcheong-1", neighborhoodId: "jongno-samcheong", rating: 5, pros: "경복궁, 북촌한옥마을이 바로 옆이라 환경이 아름다워요", cons: "생활 편의시설이 부족하고 마트가 멀어요", livedYears: "3~5년", createdAt: "2025-02-22" },
  { id: "rv-samcheong-2", neighborhoodId: "jongno-samcheong", rating: 4, pros: "갤러리가 많아서 예술적 분위기가 좋아요", cons: "주말 관광객이 많고 배달이 느려요", livedYears: "1~3년", createdAt: "2024-10-20" },

  // 강동구 천호동
  { id: "rv-cheonho-1", neighborhoodId: "gangdong-cheonho", rating: 4, pros: "현대백화점이 있고 5·8호선 환승이 편리해요", cons: "로데오거리 주변이 주말에 붐벼요", livedYears: "3~5년", createdAt: "2025-01-10" },
  { id: "rv-cheonho-2", neighborhoodId: "gangdong-cheonho", rating: 3, pros: "천호대로 상권이 발달해 있어요", cons: "오래된 건물이 많아 재건축 소음 우려", livedYears: "1~3년", createdAt: "2024-11-05" },

  // 강동구 길동
  { id: "rv-gildong-1", neighborhoodId: "gangdong-gildong", rating: 4, pros: "길동생태공원이 아이들과 산책하기 좋아요", cons: "5호선 한 노선이라 환승 필요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-gildong-2", neighborhoodId: "gangdong-gildong", rating: 4, pros: "조용하고 아이 키우기 좋은 환경이에요", cons: "먹거리 선택지가 좀 제한적이에요", livedYears: "5년 이상", createdAt: "2024-12-22" },

  // 강동구 명일동
  { id: "rv-myeongil-1", neighborhoodId: "gangdong-myeongil", rating: 4, pros: "고덕 신도시 개발로 인프라가 좋아지고 있어요", cons: "아직 공사 중인 곳이 있어요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-myeongil-2", neighborhoodId: "gangdong-myeongil", rating: 3, pros: "한강 산책로까지 자전거로 쉽게 가요", cons: "5호선 명일역이 좀 멀게 느껴져요", livedYears: "3~5년", createdAt: "2024-10-30" },

  // 서대문구 연희동
  { id: "rv-yeonhui-1", neighborhoodId: "seodaemun-yeonhui", rating: 5, pros: "카페 골목이 조용하고 세련됐어요. 동네 자체가 예뻐요", cons: "지하철역이 좀 멀어서 버스를 이용해야 해요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-yeonhui-2", neighborhoodId: "seodaemun-yeonhui", rating: 4, pros: "연세대 인근이라 학구적 분위기가 좋아요", cons: "언덕이 심해서 차 없으면 좀 불편해요", livedYears: "1~3년", createdAt: "2024-11-18" },

  // 서대문구 신촌동
  { id: "rv-sinchon-1", neighborhoodId: "seodaemun-sinchon", rating: 3, pros: "대학가라 활기차고 먹거리가 다양해요", cons: "목~토 밤 유흥가 소음이 정말 심해요", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-sinchon-2", neighborhoodId: "seodaemun-sinchon", rating: 2, pros: "2호선 신촌역이 가까워 교통 편리", cons: "취객, 노상방뇨 등 야간 치안이 불안해요", livedYears: "1년 미만", createdAt: "2024-12-10" },
  { id: "rv-sinchon-3", neighborhoodId: "seodaemun-sinchon", rating: 3, pros: "저렴한 식당이 많아 생활비 절약 가능", cons: "건물이 대체로 낡은 편이에요", livedYears: "1~3년", createdAt: "2024-09-25" },

  // 서대문구 홍제동
  { id: "rv-hongje-1", neighborhoodId: "seodaemun-hongje", rating: 4, pros: "인왕산 산책, 안산 자락길이 최고예요", cons: "3호선만 있어서 환승이 필요할 때 많아요", livedYears: "3~5년", createdAt: "2025-02-18" },
  { id: "rv-hongje-2", neighborhoodId: "seodaemun-hongje", rating: 3, pros: "전세가 합리적인 편이에요", cons: "동네가 좀 오래돼서 재건축 소문이 있어요", livedYears: "1~3년", createdAt: "2024-10-08" },

  // 양천구 목동
  { id: "rv-mokdong-1", neighborhoodId: "yangcheon-mokdong", rating: 4, pros: "교육열이 높아 아이 키우기 좋고 학원가가 잘 돼 있어요", cons: "학원 차량으로 저녁에 교통이 복잡해요", livedYears: "5년 이상", createdAt: "2025-01-22" },
  { id: "rv-mokdong-2", neighborhoodId: "yangcheon-mokdong", rating: 4, pros: "대단지 아파트라 커뮤니티 시설이 좋아요", cons: "5호선 한 노선이라 강남 출퇴근은 불편해요", livedYears: "3~5년", createdAt: "2024-11-12" },
  { id: "rv-mokdong-3", neighborhoodId: "yangcheon-mokdong", rating: 5, pros: "목동 운동장, 아이스링크 등 체육시설이 많아요", cons: "목동 사거리 교통 정체가 심해요", livedYears: "5년 이상", createdAt: "2024-08-20" },

  // 양천구 신정동
  { id: "rv-sinjeong-1", neighborhoodId: "yangcheon-sinjeong", rating: 3, pros: "2호선 이용 가능하고 목동 인프라를 같이 누려요", cons: "목동과 비교하면 주거 환경이 좀 떨어져요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-sinjeong-2", neighborhoodId: "yangcheon-sinjeong", rating: 3, pros: "전세가 목동보다 저렴해서 가성비 좋아요", cons: "신정네거리 주변이 좀 복잡해요", livedYears: "3~5년", createdAt: "2024-12-15" },

  // 수원 호매실동
  { id: "rv-homaesil-1", neighborhoodId: "suwon-homaesil", rating: 4, pros: "신도시라 깨끗하고 공원이 많아서 산책 좋아요", cons: "지하철이 아직 개통 안 돼서 버스 의존", livedYears: "1~3년", createdAt: "2025-02-25" },
  { id: "rv-homaesil-2", neighborhoodId: "suwon-homaesil", rating: 5, pros: "신축 아파트, 신설 학교, 쾌적한 환경 삼박자", cons: "서울 출퇴근 시 1시간 이상 걸려요", livedYears: "1~3년", createdAt: "2024-12-30" },
  { id: "rv-homaesil-3", neighborhoodId: "suwon-homaesil", rating: 4, pros: "아이 키우기 정말 좋은 환경이에요", cons: "상권이 아직 발달 중이라 외식 선택지 부족", livedYears: "1년 미만", createdAt: "2024-09-10" },

  // 송파구 위례동
  { id: "rv-wirye-1", neighborhoodId: "songpa-wirye", rating: 4, pros: "위례신도시라 모든 게 새 것이고 공원이 많아요", cons: "지하철이 아직 없어서 버스에 의존해야 해요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-wirye-2", neighborhoodId: "songpa-wirye", rating: 5, pros: "학교, 공원, 상가 모두 신축이라 쾌적해요", cons: "서울 도심까지 출퇴근이 좀 걸려요", livedYears: "1~3년", createdAt: "2024-11-20" },
  { id: "rv-wirye-3", neighborhoodId: "songpa-wirye", rating: 4, pros: "아이들 놀 곳이 많고 안전한 동네예요", cons: "위례 트램 공사로 한동안 소음이 있을 예정", livedYears: "1년 미만", createdAt: "2024-10-08" },

  // 동대문구 휘경동
  { id: "rv-hwigyeong-1", neighborhoodId: "dongdaemun-hwigyeong", rating: 4, pros: "경의중앙선이 지나가고 배봉산 산책이 좋아요", cons: "주변에 큰 상권이 없어서 외식이 단조로워요", livedYears: "3~5년", createdAt: "2025-01-12" },
  { id: "rv-hwigyeong-2", neighborhoodId: "dongdaemun-hwigyeong", rating: 3, pros: "한국외대 앞 음식점이 저렴하고 다양해요", cons: "1호선 회기역까지 좀 걸어야 해요", livedYears: "1~3년", createdAt: "2024-12-05" },

  // 동대문구 회기동
  { id: "rv-hoegi-1", neighborhoodId: "dongdaemun-hoegi", rating: 3, pros: "경희대·외대가 가까워 대학가 분위기가 좋아요", cons: "대학가라 주말 밤에 좀 시끄러워요", livedYears: "1~3년", createdAt: "2025-02-10" },

  // 동대문구 장안동
  { id: "rv-jangan-1", neighborhoodId: "dongdaemun-jangan", rating: 3, pros: "5호선 장한평역이 가깝고 물가가 저렴해요", cons: "중고차 매매단지 주변이 좀 어수선해요", livedYears: "1~3년", createdAt: "2025-01-15" },

  // 동대문구 전농동
  { id: "rv-jeonnong-1", neighborhoodId: "dongdaemun-jeonnong", rating: 4, pros: "청량리역 환승이 편리하고 서울시립대가 가까워요", cons: "청량리역 주변이 좀 복잡한 편이에요", livedYears: "3~5년", createdAt: "2025-02-20" },

  // ══════════════════════════════════════════════════════════════
  // ── 경기도 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 성남시 정자동
  { id: "rv-jeongja-1", neighborhoodId: "seongnam-jeongja", rating: 5, pros: "분당선과 신분당선 환승이 편리하고 IT 기업이 많아 출퇴근이 좋아요", cons: "카페거리 주변 주말 혼잡이 좀 있어요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-jeongja-2", neighborhoodId: "seongnam-jeongja", rating: 4, pros: "네이버 본사 인근이라 개발자 커뮤니티가 활발해요", cons: "물가가 서울 강남 못지않게 비싸요", livedYears: "1~3년", createdAt: "2024-11-15" },

  // 성남시 서현동
  { id: "rv-seohyeon-1", neighborhoodId: "seongnam-seohyeon", rating: 4, pros: "AK플라자와 먹자골목이 가까워 생활이 편리해요", cons: "서현역 주변 저녁 교통이 좀 복잡해요", livedYears: "3~5년", createdAt: "2025-01-20" },
  { id: "rv-seohyeon-2", neighborhoodId: "seongnam-seohyeon", rating: 4, pros: "학원가가 잘 되어있어 아이 교육에 좋아요", cons: "아파트가 오래된 편이라 리모델링 얘기가 많아요", livedYears: "5년 이상", createdAt: "2024-10-08" },

  // 성남시 신흥동
  { id: "rv-sinheung-1", neighborhoodId: "seongnam-sinheung", rating: 3, pros: "8호선 연장으로 교통이 좋아질 예정이에요", cons: "구도심이라 건물이 오래된 편이에요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-sinheung-2", neighborhoodId: "seongnam-sinheung", rating: 3, pros: "모란시장이 가까워 장보기 편해요", cons: "재개발 소문만 있고 진행이 느려요", livedYears: "3~5년", createdAt: "2024-12-20" },

  // 고양시 마두동
  { id: "rv-madu-1", neighborhoodId: "goyang-madu", rating: 4, pros: "일산 호수공원이 가까워 산책이 일상이에요", cons: "서울 출퇴근 시 3호선이 좀 혼잡해요", livedYears: "5년 이상", createdAt: "2025-01-15" },
  { id: "rv-madu-2", neighborhoodId: "goyang-madu", rating: 4, pros: "라페스타 상권이 발달해 있어요", cons: "주말 호수공원 주변 주차 전쟁이에요", livedYears: "3~5년", createdAt: "2024-11-28" },

  // 고양시 주엽동
  { id: "rv-juyeop-1", neighborhoodId: "goyang-juyeop", rating: 4, pros: "조용하고 학교가 많아 아이 키우기 좋아요", cons: "서울 도심까지 출퇴근이 1시간 가까이 걸려요", livedYears: "5년 이상", createdAt: "2025-02-18" },
  { id: "rv-juyeop-2", neighborhoodId: "goyang-juyeop", rating: 4, pros: "호수공원 산책로가 쾌적해요", cons: "상권이 마두동에 비해 좀 부족해요", livedYears: "3~5년", createdAt: "2024-10-25" },

  // 고양시 화정동
  { id: "rv-hwajeong-1", neighborhoodId: "goyang-hwajeong", rating: 3, pros: "3호선 화정역이 가까워 교통 편리해요", cons: "롯데백화점 주변 교통 체증이 심해요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-hwajeong-2", neighborhoodId: "goyang-hwajeong", rating: 4, pros: "먹자골목이 발달해 외식이 편해요", cons: "오래된 아파트가 많은 편이에요", livedYears: "3~5년", createdAt: "2024-12-12" },

  // 용인시 죽전동
  { id: "rv-jukjeon-1", neighborhoodId: "yongin-jukjeon", rating: 4, pros: "분당선으로 강남 출퇴근이 가능해요", cons: "출퇴근 시간 분당선이 만원이에요", livedYears: "3~5년", createdAt: "2025-02-22" },
  { id: "rv-jukjeon-2", neighborhoodId: "yongin-jukjeon", rating: 4, pros: "단국대 캠퍼스가 예쁘고 동네가 깨끗해요", cons: "서울까지 1시간 이상 걸릴 때가 있어요", livedYears: "1~3년", createdAt: "2024-11-05" },

  // 용인시 구갈동
  { id: "rv-gugal-1", neighborhoodId: "yongin-gugal", rating: 3, pros: "분당선 이용 가능하고 롯데아울렛이 가까워요", cons: "주변에 공장지대가 있어 분위기가 아쉬워요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-gugal-2", neighborhoodId: "yongin-gugal", rating: 4, pros: "전세가가 분당보다 합리적이에요", cons: "역에서 아파트까지 좀 거리가 있어요", livedYears: "3~5년", createdAt: "2024-10-15" },

  // 용인시 역삼동
  { id: "rv-yongin-yeoksam-1", neighborhoodId: "yongin-yeoksam", rating: 3, pros: "자연환경이 좋고 공기가 맑아요", cons: "지하철이 없어서 자차가 필수에요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-yongin-yeoksam-2", neighborhoodId: "yongin-yeoksam", rating: 3, pros: "전세가 매우 저렴한 편이에요", cons: "편의시설이 부족하고 외식 선택지가 적어요", livedYears: "1~3년", createdAt: "2024-12-08" },

  // 부천시 상동
  { id: "rv-sangdong-1", neighborhoodId: "bucheon-sangdong", rating: 4, pros: "7호선으로 서울 접근이 편리해요", cons: "유동인구가 많아 주변이 좀 복잡해요", livedYears: "3~5년", createdAt: "2025-01-12" },
  { id: "rv-sangdong-2", neighborhoodId: "bucheon-sangdong", rating: 3, pros: "공원이 많아 산책하기 좋아요", cons: "상동역 주변 아파트 노후화가 진행 중이에요", livedYears: "1~3년", createdAt: "2024-11-20" },

  // 부천시 중동
  { id: "rv-bucheon-jungdong-1", neighborhoodId: "bucheon-jungdong", rating: 4, pros: "7호선 부천시청역이 가깝고 중앙공원이 좋아요", cons: "출퇴근 시간 7호선이 매우 혼잡해요", livedYears: "3~5년", createdAt: "2025-02-08" },
  { id: "rv-bucheon-jungdong-2", neighborhoodId: "bucheon-jungdong", rating: 3, pros: "부천시청이 가까워 행정 업무가 편리해요", cons: "아파트가 오래되어 리모델링이 필요해요", livedYears: "5년 이상", createdAt: "2024-10-30" },

  // 안양시 평촌동
  { id: "rv-pyeongchon-1", neighborhoodId: "anyang-pyeongchon", rating: 4, pros: "4호선과 학원가가 잘 갖춰져 있어 교육 환경 좋아요", cons: "범계역 주변 주차가 매우 어려워요", livedYears: "5년 이상", createdAt: "2025-01-28" },
  { id: "rv-pyeongchon-2", neighborhoodId: "anyang-pyeongchon", rating: 4, pros: "뉴코아, 롯데백화점 등 편의시설 풍부", cons: "학원가 차량으로 저녁 교통이 복잡해요", livedYears: "3~5년", createdAt: "2024-11-10" },

  // 안양시 안양동
  { id: "rv-anyang-1", neighborhoodId: "anyang-anyang", rating: 3, pros: "1호선 안양역이 가깝고 안양천 산책로가 좋아요", cons: "구도심이라 건물이 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-anyang-2", neighborhoodId: "anyang-anyang", rating: 3, pros: "전세가가 평촌보다 저렴해요", cons: "상권이 좀 낙후된 느낌이에요", livedYears: "3~5년", createdAt: "2024-12-18" },

  // 안산시 고잔동
  { id: "rv-gojan-1", neighborhoodId: "ansan-gojan", rating: 3, pros: "4호선으로 서울 접근이 가능해요", cons: "다문화 지역이라 호불호가 갈려요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-gojan-2", neighborhoodId: "ansan-gojan", rating: 3, pros: "안산의 중심가라 편의시설이 잘 갖춰져 있어요", cons: "밤에 좀 어수선한 구간이 있어요", livedYears: "3~5년", createdAt: "2024-10-22" },

  // 안산시 본오동
  { id: "rv-bono-1", neighborhoodId: "ansan-bono", rating: 4, pros: "조용한 주거지로 아이 키우기 좋아요", cons: "수인분당선 배차가 좀 길어요", livedYears: "3~5년", createdAt: "2025-02-20" },
  { id: "rv-bono-2", neighborhoodId: "ansan-bono", rating: 3, pros: "관산공원이 가까워 산책이 편해요", cons: "편의시설이 고잔동보다 부족해요", livedYears: "1~3년", createdAt: "2024-11-28" },

  // 화성시 동탄동
  { id: "rv-dongtan-1", neighborhoodId: "hwaseong-dongtan", rating: 5, pros: "SRT 동탄역으로 서울 접근이 빨라요. 신축 아파트 쾌적!", cons: "출퇴근 시 교통 체증이 심해요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-dongtan-2", neighborhoodId: "hwaseong-dongtan", rating: 4, pros: "커뮤니티 시설이 잘 갖춰져 있어요", cons: "아직 개발 중인 곳이 있어 공사 소음이 있어요", livedYears: "1년 미만", createdAt: "2024-12-05" },

  // 화성시 병점동
  { id: "rv-byeongjeom-1", neighborhoodId: "hwaseong-byeongjeom", rating: 3, pros: "1호선 병점역이 있어 서울 출퇴근이 가능해요", cons: "1호선 배차 간격이 좀 길어요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-byeongjeom-2", neighborhoodId: "hwaseong-byeongjeom", rating: 3, pros: "세교 신도시 개발로 인프라가 좋아지고 있어요", cons: "서울까지 출퇴근이 1시간 반 가까이 걸려요", livedYears: "3~5년", createdAt: "2024-10-12" },

  // 평택시 평택동
  { id: "rv-pyeongtaek-1", neighborhoodId: "pyeongtaek-pyeongtaek", rating: 3, pros: "1호선 평택역이 있고 전통시장이 가까워요", cons: "구도심이라 시설이 좀 오래됐어요", livedYears: "3~5년", createdAt: "2025-02-08" },
  { id: "rv-pyeongtaek-2", neighborhoodId: "pyeongtaek-pyeongtaek", rating: 3, pros: "물가가 저렴한 편이에요", cons: "서울 출퇴근은 사실상 불가능해요", livedYears: "1~3년", createdAt: "2024-11-15" },

  // 평택시 비전동
  { id: "rv-bijeon-1", neighborhoodId: "pyeongtaek-bijeon", rating: 4, pros: "평택시청이 가깝고 신축 아파트가 많아요", cons: "대중교통이 서울에 비해 부족해요", livedYears: "1~3년", createdAt: "2025-01-10" },
  { id: "rv-bijeon-2", neighborhoodId: "pyeongtaek-bijeon", rating: 3, pros: "이마트 등 대형마트가 가까워요", cons: "문화시설이 좀 부족해요", livedYears: "1년 미만", createdAt: "2024-12-25" },

  // 김포시 장기동
  { id: "rv-janggi-1", neighborhoodId: "gimpo-janggi", rating: 4, pros: "김포골드라인으로 서울 접근이 편리해요", cons: "골드라인이 출퇴근 시간에 매우 혼잡해요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-janggi-2", neighborhoodId: "gimpo-janggi", rating: 4, pros: "신도시라 깨끗하고 공원이 많아요", cons: "김포시 외 지역으로 이동이 불편해요", livedYears: "1년 미만", createdAt: "2024-11-22" },

  // 김포시 구래동
  { id: "rv-gurae-1", neighborhoodId: "gimpo-gurae", rating: 4, pros: "라베니체에서 쇼핑·외식이 편리해요", cons: "서울 출퇴근 시 교통 정체가 심해요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-gurae-2", neighborhoodId: "gimpo-gurae", rating: 5, pros: "호수공원이 바로 앞이라 산책이 최고예요", cons: "골드라인 배차가 더 짧아졌으면 해요", livedYears: "1~3년", createdAt: "2024-10-18" },

  // 파주시 운정동
  { id: "rv-unjeong-1", neighborhoodId: "paju-unjeong", rating: 4, pros: "운정호수공원이 아름답고 신축 아파트가 쾌적해요", cons: "서울 출퇴근이 1시간 이상 걸려요", livedYears: "1~3년", createdAt: "2025-02-20" },
  { id: "rv-unjeong-2", neighborhoodId: "paju-unjeong", rating: 4, pros: "경의중앙선과 GTX 개통 예정이라 기대돼요", cons: "겨울에 바람이 정말 매워요", livedYears: "1년 미만", createdAt: "2024-12-10" },

  // 파주시 금촌동
  { id: "rv-geumchon-1", neighborhoodId: "paju-geumchon", rating: 3, pros: "파주시청이 가깝고 전통시장이 활기차요", cons: "구도심이라 건물이 오래됐어요", livedYears: "3~5년", createdAt: "2025-01-15" },
  { id: "rv-geumchon-2", neighborhoodId: "paju-geumchon", rating: 3, pros: "물가가 저렴한 편이에요", cons: "운정에 비해 인프라가 부족해요", livedYears: "1~3년", createdAt: "2024-11-08" },

  // 하남시 미사동
  { id: "rv-misa-1", neighborhoodId: "hanam-misa", rating: 5, pros: "5호선 미사역이 생겨서 교통이 좋아졌어요. 한강뷰 최고!", cons: "출퇴근 시간 5호선이 만원이에요", livedYears: "1~3년", createdAt: "2025-02-18" },
  { id: "rv-misa-2", neighborhoodId: "hanam-misa", rating: 4, pros: "신축 아파트와 스타필드 하남이 가까워요", cons: "아직 개발 중인 구간이 있어 공사 소음이 있어요", livedYears: "1년 미만", createdAt: "2024-11-25" },

  // 하남시 풍산동
  { id: "rv-pungsan-1", neighborhoodId: "hanam-pungsan", rating: 4, pros: "5호선 연장으로 서울 출퇴근이 가능해졌어요", cons: "상권이 미사보다 좀 부족해요", livedYears: "1~3년", createdAt: "2025-01-20" },
  { id: "rv-pungsan-2", neighborhoodId: "hanam-pungsan", rating: 3, pros: "하남시청이 가까워 행정 업무 편리", cons: "교산 신도시 공사로 교통이 좀 불편해요", livedYears: "3~5년", createdAt: "2024-10-28" },

  // 광명시 철산동
  { id: "rv-cheolsan-1", neighborhoodId: "gwangmyeong-cheolsan", rating: 4, pros: "7호선 철산역이 가깝고 이케아·코스트코가 있어요", cons: "구축 아파트가 많은 편이에요", livedYears: "3~5년", createdAt: "2025-02-05" },
  { id: "rv-cheolsan-2", neighborhoodId: "gwangmyeong-cheolsan", rating: 3, pros: "서울 접근성이 좋고 물가가 합리적이에요", cons: "광명사거리 교통 체증이 심해요", livedYears: "1~3년", createdAt: "2024-12-15" },

  // 광명시 하안동
  { id: "rv-haan-1", neighborhoodId: "gwangmyeong-haan", rating: 3, pros: "전세가 광명시 내에서 저렴한 편이에요", cons: "지하철역이 좀 멀어서 버스 이용이 필수에요", livedYears: "1~3년", createdAt: "2025-01-05" },
  { id: "rv-haan-2", neighborhoodId: "gwangmyeong-haan", rating: 3, pros: "도덕산 산책로가 가까워 자연이 좋아요", cons: "편의시설이 좀 부족해요", livedYears: "3~5년", createdAt: "2024-11-18" },

  // 의정부시 민락동
  { id: "rv-minrak-1", neighborhoodId: "uijeongbu-minrak", rating: 4, pros: "신축 아파트가 많고 공원이 잘 조성되어 있어요", cons: "서울 출퇴근이 1시간 넘게 걸려요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-minrak-2", neighborhoodId: "uijeongbu-minrak", rating: 4, pros: "아이 키우기 좋은 쾌적한 환경이에요", cons: "상권이 아직 완전히 형성되지 않았어요", livedYears: "1년 미만", createdAt: "2024-12-08" },

  // 의정부시 의정부동
  { id: "rv-uijeongbu-1", neighborhoodId: "uijeongbu-uijeongbu", rating: 3, pros: "1호선 의정부역이 가깝고 제일시장이 활기차요", cons: "구도심이라 건물이 오래되고 좀 어수선해요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-uijeongbu-2", neighborhoodId: "uijeongbu-uijeongbu", rating: 3, pros: "부대찌개 거리가 유명하고 맛집이 많아요", cons: "밤에 유흥가 주변이 좀 시끄러워요", livedYears: "3~5년", createdAt: "2024-10-05" },

  // 남양주시 다산동
  { id: "rv-dasan-1", neighborhoodId: "namyangju-dasan", rating: 4, pros: "다산신도시라 모든 것이 새것이고 한강 접근이 좋아요", cons: "경의중앙선 출퇴근 시 매우 혼잡해요", livedYears: "1~3년", createdAt: "2025-02-10" },
  { id: "rv-dasan-2", neighborhoodId: "namyangju-dasan", rating: 4, pros: "대형마트와 편의시설이 잘 갖춰져 있어요", cons: "아직 개발 중인 구간이 있어 먼지가 있어요", livedYears: "1년 미만", createdAt: "2024-11-12" },

  // 남양주시 별내동
  { id: "rv-byeollae-1", neighborhoodId: "namyangju-byeollae", rating: 4, pros: "별내신도시가 쾌적하고 자연환경이 좋아요", cons: "경춘선 배차가 좀 길어요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-byeollae-2", neighborhoodId: "namyangju-byeollae", rating: 4, pros: "별내별가람역이 생겨서 교통이 좋아졌어요", cons: "서울까지 환승이 필요해 출퇴근이 좀 걸려요", livedYears: "3~5년", createdAt: "2024-10-20" },

  // 구리시 인창동
  { id: "rv-inchang-1", neighborhoodId: "guri-inchang", rating: 3, pros: "경의중앙선 구리역이 가깝고 전통시장이 활기차요", cons: "구도심이라 건물이 좀 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-inchang-2", neighborhoodId: "guri-inchang", rating: 4, pros: "왕숙천 산책로가 좋고 동네가 정겨워요", cons: "서울 출퇴근 시 도로 정체가 심해요", livedYears: "3~5년", createdAt: "2024-12-22" },

  // 구리시 갈매동
  { id: "rv-galmae-1", neighborhoodId: "guri-galmae", rating: 4, pros: "갈매지구 신축 아파트가 쾌적해요", cons: "경춘선 배차가 길어요", livedYears: "1~3년", createdAt: "2025-01-12" },
  { id: "rv-galmae-2", neighborhoodId: "guri-galmae", rating: 4, pros: "자연환경이 좋고 조용한 주거지예요", cons: "상권이 아직 부족해요", livedYears: "1년 미만", createdAt: "2024-11-05" },

  // 수원 추가 리뷰
  { id: "rv-suwon-jeongja-1", neighborhoodId: "suwon-jeongja", rating: 3, pros: "성균관대역이 가까워 교통이 편리해요", cons: "구도심이라 건물이 오래된 편이에요", livedYears: "3~5년", createdAt: "2025-01-15" },
  { id: "rv-suwon-jowon-1", neighborhoodId: "suwon-jowon", rating: 3, pros: "수원천 산책로가 좋고 동네가 조용해요", cons: "지하철이 없어서 버스를 타야 해요", livedYears: "1~3년", createdAt: "2024-12-10" },
  { id: "rv-suwon-ingye-1", neighborhoodId: "suwon-ingye", rating: 4, pros: "수원시청이 가깝고 먹자골목이 발달해 있어요", cons: "주말에 유동인구가 많아 주차가 어려워요", livedYears: "3~5년", createdAt: "2025-02-18" },
  { id: "rv-suwon-maegyo-1", neighborhoodId: "suwon-maegyo", rating: 3, pros: "수인분당선 매교역이 가까워 강남 접근이 가능해요", cons: "재개발 공사 중이라 먼지가 좀 있어요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-suwon-yeongtong-1", neighborhoodId: "suwon-yeongtong", rating: 4, pros: "삼성전자 출퇴근이 편리하고 먹자골목이 좋아요", cons: "출퇴근 시간 도로 정체가 심해요", livedYears: "3~5년", createdAt: "2024-11-20" },
  { id: "rv-suwon-gwanggyo-1", neighborhoodId: "suwon-gwanggyo", rating: 5, pros: "광교호수공원이 아름답고 신분당선으로 강남이 40분이에요", cons: "물가가 수원에서 제일 비싼 편이에요", livedYears: "1~3년", createdAt: "2025-02-25" },
  { id: "rv-suwon-maetan-1", neighborhoodId: "suwon-maetan", rating: 4, pros: "삼성전자 본사가 가까워 직주근접이 가능해요", cons: "아파트가 좀 오래된 편이에요", livedYears: "3~5년", createdAt: "2025-01-22" },
  { id: "rv-suwon-gwonseon-1", neighborhoodId: "suwon-gwonseon", rating: 3, pros: "수원역 인근이라 KTX 이용이 편리해요", cons: "구도심이라 시설이 좀 낡았어요", livedYears: "1~3년", createdAt: "2024-10-18" },

  // 성남 추가 리뷰
  { id: "rv-seongnam-seongnam-1", neighborhoodId: "seongnam-seongnam", rating: 3, pros: "전통시장이 활기차고 물가가 저렴해요", cons: "구도심이라 건물이 오래되고 도로가 좁아요", livedYears: "3~5년", createdAt: "2025-01-12" },
  { id: "rv-seongnam-jungang-1", neighborhoodId: "seongnam-jungang", rating: 3, pros: "모란시장이 가까워 장보기 편하고 8호선이 있어요", cons: "재개발이 더뎌 주거환경이 아쉬워요", livedYears: "1~3년", createdAt: "2024-12-15" },
  { id: "rv-yatap-1", neighborhoodId: "seongnam-yatap", rating: 4, pros: "분당선 야탑역이 가깝고 이마트가 바로 있어요", cons: "역 주변 주차가 많이 어려워요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-taepyeong-1", neighborhoodId: "seongnam-taepyeong", rating: 3, pros: "8호선 태평역이 있어 서울 접근이 가능해요", cons: "구도심이라 아파트가 오래됐어요", livedYears: "1~3년", createdAt: "2025-01-20" },

  // 고양 추가 리뷰
  { id: "rv-baekseok-1", neighborhoodId: "goyang-baekseok", rating: 4, pros: "3호선 백석역이 가깝고 킨텍스가 근처예요", cons: "출퇴근 시간 3호선이 혼잡해요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-daehwa-1", neighborhoodId: "goyang-daehwa", rating: 4, pros: "3호선 종점이라 항상 앉아서 갈 수 있어요", cons: "서울까지 시간이 꽤 걸려요", livedYears: "5년 이상", createdAt: "2024-11-22" },
  { id: "rv-haengsin-1", neighborhoodId: "goyang-haengsin", rating: 4, pros: "KTX 행신역이 가까워 지방 출장이 편리해요", cons: "행신역 주변 아파트가 좀 오래됐어요", livedYears: "3~5년", createdAt: "2025-01-18" },

  // 용인 추가 리뷰
  { id: "rv-seongbok-1", neighborhoodId: "yongin-seongbok", rating: 4, pros: "신분당선 성복역이 가까워 강남 출퇴근이 편해요", cons: "역 주변 외에는 상권이 좀 부족해요", livedYears: "1~3년", createdAt: "2025-02-20" },
  { id: "rv-bojeong-1", neighborhoodId: "yongin-bojeong", rating: 4, pros: "보정동 카페거리가 예쁘고 분당선이 편리해요", cons: "주말에 카페거리 주차가 어려워요", livedYears: "3~5년", createdAt: "2024-12-08" },
  { id: "rv-mohyeon-1", neighborhoodId: "yongin-mohyeon", rating: 3, pros: "자연환경이 좋고 한국민속촌이 가까워요", cons: "대중교통이 부족해서 자차가 필수에요", livedYears: "1~3년", createdAt: "2025-01-10" },

  // 부천 추가 리뷰
  { id: "rv-ojeong-1", neighborhoodId: "bucheon-ojeong", rating: 3, pros: "공원이 잘 조성되어 있고 주거환경이 쾌적해요", cons: "지하철역이 좀 멀어서 버스를 타야 해요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-sosa-1", neighborhoodId: "bucheon-sosa", rating: 3, pros: "1호선 소사역이 가까워 교통이 편리해요", cons: "구도심이라 시설이 좀 오래됐어요", livedYears: "3~5년", createdAt: "2024-11-18" },

  // 안양 추가 리뷰
  { id: "rv-hogye-1", neighborhoodId: "anyang-hogye", rating: 4, pros: "범계역 상권이 발달해 있고 학원가가 좋아요", cons: "범계역 주변이 저녁에 좀 복잡해요", livedYears: "3~5년", createdAt: "2025-01-28" },
  { id: "rv-seoksu-1", neighborhoodId: "anyang-seoksu", rating: 3, pros: "1호선 석수역이 가깝고 관악산 등산이 편해요", cons: "상권이 좀 부족한 편이에요", livedYears: "1~3년", createdAt: "2024-12-20" },

  // 안산 추가 리뷰
  { id: "rv-wongok-1", neighborhoodId: "ansan-wongok", rating: 3, pros: "다양한 국제 음식점이 있어 맛집이 많아요", cons: "밤에 좀 어수선한 구간이 있어요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-sadong-1", neighborhoodId: "ansan-sadong", rating: 3, pros: "안산식물원이 가까워 산책이 좋아요", cons: "수인분당선 배차가 좀 길어요", livedYears: "3~5년", createdAt: "2024-11-25" },

  // 화성 추가 리뷰
  { id: "rv-bongdam-1", neighborhoodId: "hwaseong-bongdam", rating: 3, pros: "신축 아파트가 많고 수원 접근이 편해요", cons: "지하철이 없어서 버스에 의존해요", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-hyangnam-1", neighborhoodId: "hwaseong-hyangnam", rating: 3, pros: "쾌적한 환경에 신축 아파트가 많아요", cons: "서울까지 출퇴근이 힘들어요", livedYears: "1년 미만", createdAt: "2024-12-28" },

  // 평택 추가 리뷰
  { id: "rv-godeok-1", neighborhoodId: "pyeongtaek-godeok", rating: 4, pros: "고덕신도시 신축 아파트가 쾌적하고 삼성전자가 가까워요", cons: "아직 개발 중이라 편의시설이 부족해요", livedYears: "1년 미만", createdAt: "2025-02-18" },
  { id: "rv-seojeong-1", neighborhoodId: "pyeongtaek-seojeong", rating: 3, pros: "1호선 서정리역이 있어 교통이 가능해요", cons: "문화시설이 부족한 편이에요", livedYears: "1~3년", createdAt: "2024-11-08" },

  // 김포 추가 리뷰
  { id: "rv-pungmu-1", neighborhoodId: "gimpo-pungmu", rating: 4, pros: "골드라인 풍무역이 가깝고 김포시청이 근처예요", cons: "골드라인이 출퇴근 시 매우 혼잡해요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-yangchon-1", neighborhoodId: "gimpo-yangchon", rating: 3, pros: "조용하고 전원적인 분위기가 좋아요", cons: "대중교통이 매우 불편해요", livedYears: "3~5년", createdAt: "2024-10-28" },

  // 파주 추가 리뷰
  { id: "rv-gyoha-1", neighborhoodId: "paju-gyoha", rating: 4, pros: "교하신도시가 깨끗하고 공원이 많아요", cons: "서울 출퇴근이 1시간 이상 걸려요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-munsan-1", neighborhoodId: "paju-munsan", rating: 3, pros: "경의중앙선이 있어 서울 접근이 가능해요", cons: "파주 북부라 편의시설이 부족해요", livedYears: "3~5년", createdAt: "2024-12-05" },

  // 하남 추가 리뷰
  { id: "rv-sinjang-1", neighborhoodId: "hanam-sinjang", rating: 3, pros: "5호선 하남시청역이 생겨서 교통이 좋아졌어요", cons: "구도심이라 건물이 좀 오래됐어요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-deokpung-1", neighborhoodId: "hanam-deokpung", rating: 3, pros: "스타필드 하남이 가깝고 학교가 많아요", cons: "도로가 좁고 주차가 어려운 편이에요", livedYears: "3~5년", createdAt: "2024-11-12" },

  // 광명 추가 리뷰
  { id: "rv-soha-1", neighborhoodId: "gwangmyeong-soha", rating: 4, pros: "7호선과 KTX 광명역이 가까워 교통이 좋아요", cons: "소하택지지구 외 구간은 좀 낙후돼요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-gwangmyeong-gwangmyeong-1", neighborhoodId: "gwangmyeong-gwangmyeong", rating: 3, pros: "광명전통시장이 활기차고 7호선이 가까워요", cons: "구도심이라 아파트가 오래됐어요", livedYears: "3~5년", createdAt: "2024-12-18" },

  // 의정부 추가 리뷰
  { id: "rv-howon-1", neighborhoodId: "uijeongbu-howon", rating: 4, pros: "회룡역이 가깝고 주변 산책로가 좋아요", cons: "서울 출퇴근이 좀 시간이 걸려요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-nokyang-1", neighborhoodId: "uijeongbu-nokyang", rating: 3, pros: "조용하고 자연환경이 좋은 주거지예요", cons: "상권이 좀 부족해요", livedYears: "3~5년", createdAt: "2024-10-22" },

  // 남양주 추가 리뷰
  { id: "rv-hopyeong-1", neighborhoodId: "namyangju-hopyeong", rating: 4, pros: "경춘선 호평역이 있고 자연환경이 좋아요", cons: "서울 출퇴근 시 환승이 필요해요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-pyeongnae-1", neighborhoodId: "namyangju-pyeongnae", rating: 4, pros: "평내호평역이 가깝고 홈플러스가 있어요", cons: "경춘선 배차가 좀 길어요", livedYears: "3~5년", createdAt: "2024-11-28" },

  // 구리 추가 리뷰
  { id: "rv-sutaek-1", neighborhoodId: "guri-sutaek", rating: 3, pros: "구리전통시장이 활기차고 동네가 정겨워요", cons: "구도심이라 건물이 좀 오래됐어요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-gyomun-1", neighborhoodId: "guri-gyomun", rating: 3, pros: "구리시청이 가깝고 왕숙천 산책로가 좋아요", cons: "지하철역이 좀 멀어요", livedYears: "3~5년", createdAt: "2024-12-25" },

  // ══════════════════════════════════════════════════════════════
  // ── 인천 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 연수구 송도동
  { id: "rv-songdo-1", neighborhoodId: "incheon-songdo", rating: 5, pros: "센트럴파크가 정말 아름답고 도시 계획이 잘 되어 있어요", cons: "바닷바람이 강하고 겨울에 체감온도가 낮아요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-songdo-2", neighborhoodId: "incheon-songdo", rating: 4, pros: "국제학교, 외국 기업이 많아 글로벌한 분위기예요", cons: "서울까지 출퇴근이 1시간 이상 걸려요", livedYears: "3~5년", createdAt: "2024-11-20" },

  // 연수구 연수동
  { id: "rv-incheon-yeonsu-1", neighborhoodId: "incheon-yeonsu", rating: 3, pros: "수인분당선으로 서울 접근이 가능해요", cons: "송도에 비해 시설이 좀 오래됐어요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-incheon-yeonsu-2", neighborhoodId: "incheon-yeonsu", rating: 4, pros: "학교가 많고 주거 환경이 안정적이에요", cons: "상권이 좀 부족한 편이에요", livedYears: "5년 이상", createdAt: "2024-10-15" },

  // 남동구 간석동
  { id: "rv-ganseok-1", neighborhoodId: "incheon-ganseok", rating: 3, pros: "인천1호선이 있어 교통이 편해요", cons: "구도심이라 건물이 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-ganseok-2", neighborhoodId: "incheon-ganseok", rating: 3, pros: "물가가 저렴하고 먹자골목이 있어요", cons: "밤에 좀 어두운 골목이 있어요", livedYears: "3~5년", createdAt: "2024-12-18" },

  // 남동구 구월동
  { id: "rv-guwol-1", neighborhoodId: "incheon-guwol", rating: 4, pros: "롯데백화점과 인천시청이 가까워 편의시설 풍부", cons: "구월동 상권 주변 교통 정체가 심해요", livedYears: "3~5년", createdAt: "2025-01-20" },
  { id: "rv-guwol-2", neighborhoodId: "incheon-guwol", rating: 3, pros: "인천 내에서 접근성이 좋은 중심지예요", cons: "주말 롯데백화점 주변 주차가 힘들어요", livedYears: "1~3년", createdAt: "2024-11-10" },

  // 부평구 부평동
  { id: "rv-bupyeong-1", neighborhoodId: "incheon-bupyeong", rating: 3, pros: "부평지하상가와 야시장이 재미있어요", cons: "부평역 주변 야간 소음이 심해요", livedYears: "1~3년", createdAt: "2025-02-18" },
  { id: "rv-bupyeong-2", neighborhoodId: "incheon-bupyeong", rating: 3, pros: "1호선으로 서울 접근이 가능해요", cons: "유흥가 주변 치안이 좀 불안해요", livedYears: "1년 미만", createdAt: "2024-10-25" },

  // 부평구 십정동
  { id: "rv-sipjeong-1", neighborhoodId: "incheon-sipjeong", rating: 3, pros: "부평 상권이 가까워 생활이 편해요", cons: "노후 건물이 많은 편이에요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-sipjeong-2", neighborhoodId: "incheon-sipjeong", rating: 4, pros: "굴포천 산책로가 좋고 조용한 편이에요", cons: "상권이 부평동에 비해 부족해요", livedYears: "3~5년", createdAt: "2024-12-12" },

  // 서구 검단동
  { id: "rv-geomdan-1", neighborhoodId: "incheon-geomdan", rating: 4, pros: "검단신도시 신축 아파트가 깨끗하고 공원이 많아요", cons: "지하철이 없어 버스에 의존해야 해요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-geomdan-2", neighborhoodId: "incheon-geomdan", rating: 3, pros: "아이 키우기 좋은 쾌적한 환경이에요", cons: "서울 출퇴근이 매우 불편해요", livedYears: "1년 미만", createdAt: "2024-11-28" },

  // 서구 청라동
  { id: "rv-cheongna-1", neighborhoodId: "incheon-cheongna", rating: 4, pros: "청라호수공원과 커낼웨이가 아름다워요", cons: "서울 출퇴근 시 교통 정체가 심해요", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-cheongna-2", neighborhoodId: "incheon-cheongna", rating: 5, pros: "도시 계획이 잘 되어 있고 쾌적한 주거 환경이에요", cons: "지하철이 없어서 아쉬워요. 자차 필수", livedYears: "3~5년", createdAt: "2024-10-08" },

  // 미추홀구 학익동
  { id: "rv-hagik-1", neighborhoodId: "incheon-hagik", rating: 3, pros: "인하대 인근이라 학구적 분위기예요", cons: "재개발 중이라 주변이 좀 어수선해요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-hagik-2", neighborhoodId: "incheon-hagik", rating: 3, pros: "수인분당선 인하대역이 가까워요", cons: "문학경기장 행사 때 주변이 혼잡해요", livedYears: "3~5년", createdAt: "2024-12-20" },

  // 미추홀구 용현동
  { id: "rv-yonghyeon-1", neighborhoodId: "incheon-yonghyeon", rating: 2, pros: "물가가 인천에서도 저렴한 편이에요", cons: "노후 건물이 많고 치안이 좀 불안해요", livedYears: "1년 미만", createdAt: "2025-01-22" },
  { id: "rv-yonghyeon-2", neighborhoodId: "incheon-yonghyeon", rating: 3, pros: "1호선 인천역이 가까워 교통 편리", cons: "주변 환경이 좀 낙후된 느낌이에요", livedYears: "1~3년", createdAt: "2024-11-15" },

  // 계양구 계산동
  { id: "rv-gyesan-1", neighborhoodId: "incheon-gyesan", rating: 4, pros: "인천1호선 계산역이 가깝고 학원가가 잘 형성되어 있어요", cons: "구도심이라 건물이 좀 오래된 편이에요", livedYears: "3~5년", createdAt: "2025-01-18" },

  // 계양구 작전동
  { id: "rv-jakjeon-1", neighborhoodId: "incheon-jakjeon", rating: 3, pros: "작전역이 가깝고 먹자골목이 활기차요", cons: "출퇴근 시간 도로가 많이 막혀요", livedYears: "1~3년", createdAt: "2025-02-05" },

  // 인천 중구 운서동
  { id: "rv-unseo-1", neighborhoodId: "incheon-unseo", rating: 4, pros: "공항철도로 서울 접근이 편리하고 신도시라 깨끗해요", cons: "공항 소음이 가끔 있고 편의시설이 좀 부족해요", livedYears: "1~3년", createdAt: "2025-02-15" },

  // 인천 중구 신포동
  { id: "rv-sinpo-1", neighborhoodId: "incheon-sinpo", rating: 3, pros: "신포국제시장과 차이나타운이 가까워 먹거리가 풍부해요", cons: "관광객이 많고 주말엔 복잡해요", livedYears: "1~3년", createdAt: "2025-01-25" },

  // ══════════════════════════════════════════════════════════════
  // ── 부산 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 해운대구 우동
  { id: "rv-udong-1", neighborhoodId: "busan-udong", rating: 4, pros: "센텀시티 인프라가 훌륭하고 영화의전당이 가까워요", cons: "벡스코 행사 때 주변 교통이 마비돼요", livedYears: "3~5년", createdAt: "2025-02-12" },
  { id: "rv-udong-2", neighborhoodId: "busan-udong", rating: 4, pros: "신세계 스파랜드, 롯데백화점 등 편의시설 풍부", cons: "물가가 부산 내에서 비싼 편이에요", livedYears: "1~3년", createdAt: "2024-11-05" },

  // 해운대구 중동
  { id: "rv-busan-jungdong-1", neighborhoodId: "busan-jungdong", rating: 3, pros: "해운대 해수욕장이 가까워 바다 생활 최고", cons: "관광객이 많아 주말엔 동네가 관광지화돼요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-busan-jungdong-2", neighborhoodId: "busan-jungdong", rating: 3, pros: "먹거리가 다양하고 맛집이 많아요", cons: "여름 성수기에 소음이 극심해요", livedYears: "3~5년", createdAt: "2024-10-18" },

  // 해운대구 좌동
  { id: "rv-jwadong-1", neighborhoodId: "busan-jwadong", rating: 4, pros: "장산역이 가깝고 주거 환경이 안정적이에요", cons: "해운대와 비교하면 상권이 좀 부족해요", livedYears: "5년 이상", createdAt: "2025-02-20" },
  { id: "rv-jwadong-2", neighborhoodId: "busan-jwadong", rating: 4, pros: "학원가가 잘 되어 있어 교육 환경 좋아요", cons: "대형마트까지 좀 걸어야 해요", livedYears: "3~5년", createdAt: "2024-12-08" },

  // 부산진구 부전동
  { id: "rv-bujeon-1", neighborhoodId: "busan-bujeon", rating: 3, pros: "서면 상권이 바로 앞이라 뭐든 가까이 있어요", cons: "유흥가 소음이 심야까지 이어져요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-bujeon-2", neighborhoodId: "busan-bujeon", rating: 3, pros: "1호선·2호선 모두 이용 가능해 교통 편리", cons: "부전시장 물류 차량으로 새벽에 소음이 있어요", livedYears: "3~5년", createdAt: "2024-10-12" },

  // 부산진구 전포동
  { id: "rv-jeonpo-1", neighborhoodId: "busan-jeonpo", rating: 4, pros: "전포카페거리가 트렌디하고 분위기 좋아요", cons: "주말에 외부 유입 인구가 많아 혼잡해요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-jeonpo-2", neighborhoodId: "busan-jeonpo", rating: 4, pros: "서면 인프라를 공유하면서도 더 조용해요", cons: "주차 공간이 부족해요", livedYears: "3~5년", createdAt: "2024-11-22" },

  // 수영구 광안동
  { id: "rv-gwangan-1", neighborhoodId: "busan-gwangan", rating: 4, pros: "광안대교 야경이 정말 아름다워요", cons: "여름 바다축제 기간 소음이 극심해요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-gwangan-2", neighborhoodId: "busan-gwangan", rating: 4, pros: "카페거리가 발달해 있고 바다가 가까워요", cons: "관광지라 주말 주차가 어려워요", livedYears: "3~5년", createdAt: "2024-12-15" },

  // 수영구 남천동
  { id: "rv-namcheon-1", neighborhoodId: "busan-namcheon", rating: 4, pros: "바다 조망이 좋고 비교적 조용한 주거지예요", cons: "삼익비치 재건축 공사 소음이 있어요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-namcheon-2", neighborhoodId: "busan-namcheon", rating: 4, pros: "남천역이 가깝고 생활 편의시설이 갖춰져 있어요", cons: "재건축 완료 후 집값이 급등할 것 같아 걱정", livedYears: "5년 이상", createdAt: "2024-10-25" },

  // 남구 대연동
  { id: "rv-daeyeon-1", neighborhoodId: "busan-daeyeon", rating: 3, pros: "경성대·부경대 대학가라 활기차고 먹거리 다양", cons: "대학가 특유의 야간 소음이 있어요", livedYears: "1~3년", createdAt: "2025-01-10" },
  { id: "rv-daeyeon-2", neighborhoodId: "busan-daeyeon", rating: 4, pros: "UN기념공원이 가까워 산책이 좋아요", cons: "주차 공간이 부족해요", livedYears: "3~5년", createdAt: "2024-11-28" },

  // 남구 용호동
  { id: "rv-yongho-1", neighborhoodId: "busan-yongho", rating: 4, pros: "이기대 산책로와 바다 조망이 최고예요", cons: "교통이 불편하고 대중교통 배차가 길어요", livedYears: "3~5년", createdAt: "2025-02-18" },
  { id: "rv-yongho-2", neighborhoodId: "busan-yongho", rating: 4, pros: "조용하고 공기 좋은 주거 환경이에요", cons: "편의시설이 좀 부족해요", livedYears: "5년 이상", createdAt: "2024-12-05" },

  // 사하구 하단동
  { id: "rv-hadan-1", neighborhoodId: "busan-hadan", rating: 3, pros: "1호선 하단역이 있어 교통 편리해요", cons: "먹자골목 주변이 좀 어수선해요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-hadan-2", neighborhoodId: "busan-hadan", rating: 3, pros: "낙동강이 가까워 자연 접근성이 좋아요", cons: "사하구 전반적으로 노후화가 진행 중이에요", livedYears: "3~5년", createdAt: "2024-10-08" },

  // 사하구 당리동
  { id: "rv-dangni-1", neighborhoodId: "busan-dangni", rating: 3, pros: "감천문화마을 인근이라 분위기가 독특해요", cons: "언덕이 심해서 걸어다니기 힘들어요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-dangni-2", neighborhoodId: "busan-dangni", rating: 3, pros: "1호선 당리역이 가까워 교통 편리", cons: "상권이 좀 부족해요", livedYears: "3~5년", createdAt: "2024-11-18" },

  // 동래구 명륜동
  { id: "rv-myeongnyun-1", neighborhoodId: "busan-myeongnyun", rating: 4, pros: "동래시장이 활기차고 온천 문화가 독특해요", cons: "동래역 주변 교통이 좀 혼잡해요", livedYears: "3~5년", createdAt: "2025-01-15" },
  { id: "rv-myeongnyun-2", neighborhoodId: "busan-myeongnyun", rating: 3, pros: "역사 유적이 많아 문화적 분위기가 좋아요", cons: "오래된 건물이 많은 편이에요", livedYears: "1~3년", createdAt: "2024-12-22" },

  // 동래구 온천동
  { id: "rv-oncheon-1", neighborhoodId: "busan-oncheon", rating: 4, pros: "동래온천이 가깝고 금강공원 산책이 좋아요", cons: "1호선만 있어서 환승이 필요해요", livedYears: "3~5년", createdAt: "2025-02-08" },
  { id: "rv-oncheon-2", neighborhoodId: "busan-oncheon", rating: 3, pros: "주거 환경이 안정적이고 편의시설 적당히 갖춰져 있어요", cons: "해운대·서면에 비하면 좀 심심해요", livedYears: "5년 이상", createdAt: "2024-10-30" },

  // 금정구 장전동
  { id: "rv-jangjeon-1", neighborhoodId: "busan-jangjeon", rating: 3, pros: "부산대 대학가라 먹거리가 다양하고 활기차요", cons: "대학가 특유의 야간 소음이 있어요", livedYears: "1~3년", createdAt: "2025-02-08" },

  // 금정구 부곡동
  { id: "rv-bugok-1", neighborhoodId: "busan-bugok", rating: 4, pros: "금정산이 가깝고 주거 환경이 조용해요", cons: "번화가까지 좀 이동해야 해요", livedYears: "3~5년", createdAt: "2025-01-20" },

  // 연제구 거제동
  { id: "rv-geoje-1", neighborhoodId: "busan-geoje", rating: 4, pros: "연제구청과 종합운동장이 가깝고 교통이 편리해요", cons: "출퇴근 시간 교통 정체가 있어요", livedYears: "1~3년", createdAt: "2025-02-18" },

  // 연제구 연산동
  { id: "rv-yeonsan-1", neighborhoodId: "busan-yeonsan", rating: 3, pros: "1·3호선 환승역이라 교통이 정말 편리해요", cons: "연산 로터리 주변이 항상 복잡해요", livedYears: "1~3년", createdAt: "2025-01-10" },

  // 사상구 주례동
  { id: "rv-jurye-1", neighborhoodId: "busan-jurye", rating: 3, pros: "물가가 저렴하고 주례 먹자골목이 활기차요", cons: "동네가 좀 노후된 편이에요", livedYears: "1~3년", createdAt: "2025-02-22" },

  // 사상구 감전동
  { id: "rv-gamjeon-1", neighborhoodId: "busan-gamjeon", rating: 3, pros: "전세가 저렴하고 낙동강이 가까워요", cons: "공업지대 인근이라 주거 환경이 좀 아쉬워요", livedYears: "1~3년", createdAt: "2025-01-28" },

  // ══════════════════════════════════════════════════════════════
  // ── 대구 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 수성구 범어동
  { id: "rv-beomeo-1", neighborhoodId: "daegu-beomeo", rating: 4, pros: "대구에서 가장 교육 환경이 좋은 곳이에요", cons: "범어네거리 교통 체증이 심해요", livedYears: "5년 이상", createdAt: "2025-02-12" },
  { id: "rv-beomeo-2", neighborhoodId: "daegu-beomeo", rating: 4, pros: "대백프라자 등 편의시설이 풍부해요", cons: "물가가 대구 내에서 비싼 편이에요", livedYears: "3~5년", createdAt: "2024-11-05" },

  // 수성구 만촌동
  { id: "rv-manchon-1", neighborhoodId: "daegu-manchon", rating: 4, pros: "수성못 산책이 일상이고 조용한 주거지예요", cons: "2호선 외에 다른 교통수단이 좀 부족해요", livedYears: "5년 이상", createdAt: "2025-01-25" },
  { id: "rv-manchon-2", neighborhoodId: "daegu-manchon", rating: 4, pros: "교육 환경이 우수하고 동네가 깨끗해요", cons: "주말 수성못 주변 주차가 어려워요", livedYears: "3~5년", createdAt: "2024-10-18" },

  // 달서구 상인동
  { id: "rv-sangin-1", neighborhoodId: "daegu-sangin", rating: 3, pros: "1호선 상인역이 가깝고 이마트가 있어 편리해요", cons: "월배 시장 주변이 좀 복잡해요", livedYears: "3~5년", createdAt: "2025-02-20" },
  { id: "rv-sangin-2", neighborhoodId: "daegu-sangin", rating: 4, pros: "교통이 편리하고 상권이 발달해 있어요", cons: "오래된 아파트가 좀 있어요", livedYears: "1~3년", createdAt: "2024-12-08" },

  // 달서구 월성동
  { id: "rv-wolseong-1", neighborhoodId: "daegu-wolseong", rating: 4, pros: "진천천 산책로가 좋고 아파트가 깨끗해요", cons: "1호선까지 좀 걸어야 해요", livedYears: "3~5년", createdAt: "2025-01-18" },
  { id: "rv-wolseong-2", neighborhoodId: "daegu-wolseong", rating: 4, pros: "학교가 많아 아이 키우기 좋아요", cons: "상권이 상인동에 비해 좀 부족해요", livedYears: "5년 이상", createdAt: "2024-11-22" },

  // 대구 중구 동성로
  { id: "rv-dongsungro-1", neighborhoodId: "daegu-dongsungro", rating: 3, pros: "대구 최대 번화가라 뭐든 다 있어요", cons: "야간 소음이 심하고 유동인구가 너무 많아요", livedYears: "1년 미만", createdAt: "2025-02-05" },
  { id: "rv-dongsungro-2", neighborhoodId: "daegu-dongsungro", rating: 3, pros: "1·2호선 환승이 가능해 교통이 매우 편리해요", cons: "주거지라기보다 상업지구 느낌이에요", livedYears: "1~3년", createdAt: "2024-10-12" },

  // 대구 중구 삼덕동
  { id: "rv-samdeok-1", neighborhoodId: "daegu-samdeok", rating: 4, pros: "동성로 인근이면서도 조용한 주거 환경이에요", cons: "오래된 건물이 많은 편이에요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-samdeok-2", neighborhoodId: "daegu-samdeok", rating: 3, pros: "카페 골목이 예쁘고 근대골목 투어가 재미있어요", cons: "주차할 곳이 거의 없어요", livedYears: "1년 미만", createdAt: "2024-12-15" },

  // 대구 북구 침산동
  { id: "rv-chimsan-1", neighborhoodId: "daegu-chimsan", rating: 3, pros: "3호선 침산역이 가깝고 공원이 좋아요", cons: "상권이 좀 부족해요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-chimsan-2", neighborhoodId: "daegu-chimsan", rating: 4, pros: "주거 중심이라 조용하고 살기 편해요", cons: "동성로 가려면 환승이 필요해요", livedYears: "3~5년", createdAt: "2024-11-10" },

  // 대구 북구 산격동
  { id: "rv-sangyeok-1", neighborhoodId: "daegu-sangyeok", rating: 3, pros: "경북대가 가까워 학구적 분위기예요", cons: "대학가 특유의 유동인구가 있어요", livedYears: "1~3년", createdAt: "2025-01-10" },
  { id: "rv-sangyeok-2", neighborhoodId: "daegu-sangyeok", rating: 3, pros: "2호선 경대병원역이 가까워 교통 편리", cons: "맛집이 좀 제한적이에요", livedYears: "3~5년", createdAt: "2024-12-25" },

  // 대구 동구 신암동
  { id: "rv-sinam-1", neighborhoodId: "daegu-sinam", rating: 3, pros: "동대구역이 가까워 KTX 이용이 편리해요", cons: "역 주변이 좀 복잡하고 소음이 있어요", livedYears: "1~3년", createdAt: "2025-02-12" },

  // 대구 동구 효목동
  { id: "rv-hyomok-1", neighborhoodId: "daegu-hyomok", rating: 4, pros: "동구청이 가깝고 주거 환경이 안정적이에요", cons: "상권이 좀 부족한 편이에요", livedYears: "3~5년", createdAt: "2025-01-22" },

  // 대구 남구 대명동
  { id: "rv-daemyeong-1", neighborhoodId: "daegu-daemyeong", rating: 3, pros: "앞산 등산이 가깝고 대명 먹자골목이 활기차요", cons: "대학가라 주말 밤에 소음이 있어요", livedYears: "1~3년", createdAt: "2025-02-05" },

  // 대구 남구 봉덕동
  { id: "rv-bongdeok-1", neighborhoodId: "daegu-bongdeok", rating: 4, pros: "남구청역이 가깝고 앞산공원 접근이 좋아요", cons: "번화가까지 좀 이동해야 해요", livedYears: "3~5년", createdAt: "2025-01-15" },

  // ══════════════════════════════════════════════════════════════
  // ── 대전 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 유성구 봉명동
  { id: "rv-bongmyeong-1", neighborhoodId: "daejeon-bongmyeong", rating: 3, pros: "먹자골목이 발달해 외식이 편리해요", cons: "유흥가 주변 야간 소음이 있어요", livedYears: "1~3년", createdAt: "2025-02-18" },
  { id: "rv-bongmyeong-2", neighborhoodId: "daejeon-bongmyeong", rating: 3, pros: "유성온천이 가깝고 번화가 접근이 좋아요", cons: "주차가 힘들어요", livedYears: "3~5년", createdAt: "2024-11-15" },

  // 유성구 궁동
  { id: "rv-gungdong-1", neighborhoodId: "daejeon-gungdong", rating: 3, pros: "충남대 인근이라 저렴한 음식점이 많아요", cons: "대학가라 야간 소음이 좀 있어요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-gungdong-2", neighborhoodId: "daejeon-gungdong", rating: 3, pros: "월세가 저렴해 1인 가구에 적합해요", cons: "졸업 후 살기엔 좀 불편한 점이 있어요", livedYears: "1년 미만", createdAt: "2024-10-05" },

  // 대전 서구 둔산동
  { id: "rv-dunsan-1", neighborhoodId: "daejeon-dunsan", rating: 4, pros: "대전의 강남이라 편의시설이 최고예요", cons: "출퇴근 시간 둔산대로 교통 체증이 심해요", livedYears: "5년 이상", createdAt: "2025-02-10" },
  { id: "rv-dunsan-2", neighborhoodId: "daejeon-dunsan", rating: 4, pros: "갤러리아백화점, 시청이 가까워 뭐든 편리해요", cons: "물가가 대전에서 가장 비싼 편이에요", livedYears: "3~5년", createdAt: "2024-12-20" },

  // 대전 서구 탄방동
  { id: "rv-tanbang-1", neighborhoodId: "daejeon-tanbang", rating: 4, pros: "둔산 인프라를 공유하면서 더 조용한 주거지예요", cons: "갑천변 빌라 밀집 지역은 좀 어두워요", livedYears: "3~5년", createdAt: "2025-01-15" },
  { id: "rv-tanbang-2", neighborhoodId: "daejeon-tanbang", rating: 4, pros: "갑천 산책로가 좋고 학원가가 가까워요", cons: "둔산동에 비하면 상권이 좀 부족해요", livedYears: "1~3년", createdAt: "2024-11-08" },

  // 대전 중구 대흥동
  { id: "rv-daeheung-1", neighborhoodId: "daejeon-daeheung", rating: 3, pros: "대전역이 가깝고 성심당 본점이 있어요", cons: "구도심이라 건물이 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-daeheung-2", neighborhoodId: "daejeon-daeheung", rating: 3, pros: "문화예술의거리 분위기가 좋아요", cons: "둔산 신도심에 비해 인프라가 부족해요", livedYears: "3~5년", createdAt: "2024-10-15" },

  // 대전 중구 은행동
  { id: "rv-eunhaeng-1", neighborhoodId: "daejeon-eunhaeng", rating: 3, pros: "중앙시장과 으능정이 거리가 활기차요", cons: "밤에 좀 어두운 골목이 있어요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-eunhaeng-2", neighborhoodId: "daejeon-eunhaeng", rating: 2, pros: "물가가 저렴해요", cons: "노후 건물이 많고 주거 환경이 열악한 편이에요", livedYears: "1년 미만", createdAt: "2024-12-10" },

  // ══════════════════════════════════════════════════════════════
  // ── 광주 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 광주 서구 치평동
  { id: "rv-chipyeong-1", neighborhoodId: "gwangju-chipyeong", rating: 4, pros: "상무지구 중심이라 뭐든 가까이에 있어요", cons: "먹자골목 주변 주말 혼잡이 있어요", livedYears: "3~5년", createdAt: "2025-02-12" },
  { id: "rv-chipyeong-2", neighborhoodId: "gwangju-chipyeong", rating: 4, pros: "갤러리아백화점, 은행 등 편의시설 풍부", cons: "물가가 광주 내에서 비싼 편이에요", livedYears: "1~3년", createdAt: "2024-11-20" },

  // 광주 서구 농성동
  { id: "rv-nongseong-1", neighborhoodId: "gwangju-nongseong", rating: 3, pros: "광주1호선 농성역이 가깝고 양동시장이 있어요", cons: "구도심이라 건물이 오래됐어요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-nongseong-2", neighborhoodId: "gwangju-nongseong", rating: 3, pros: "광주역이 가까워 KTX 이용이 편리해요", cons: "상무지구에 비해 인프라가 부족해요", livedYears: "3~5년", createdAt: "2024-10-22" },

  // 광주 북구 용봉동
  { id: "rv-yongbong-1", neighborhoodId: "gwangju-yongbong", rating: 3, pros: "전남대 인근이라 활기차고 음식점이 저렴해요", cons: "대학가라 야간에 좀 시끄러울 때가 있어요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-yongbong-2", neighborhoodId: "gwangju-yongbong", rating: 3, pros: "월세가 광주에서도 저렴한 편이에요", cons: "대형 편의시설이 좀 부족해요", livedYears: "1년 미만", createdAt: "2024-12-18" },

  // 광주 북구 운암동
  { id: "rv-unam-1", neighborhoodId: "gwangju-unam", rating: 4, pros: "광주시립미술관이 가깝고 공원이 많아요", cons: "지하철이 좀 멀어요", livedYears: "3~5년", createdAt: "2025-01-18" },
  { id: "rv-unam-2", neighborhoodId: "gwangju-unam", rating: 3, pros: "조용한 주거 환경이에요", cons: "상권이 좀 부족해요", livedYears: "1~3년", createdAt: "2024-11-12" },

  // 광주 남구 봉선동
  { id: "rv-bongseon-1", neighborhoodId: "gwangju-bongseon", rating: 4, pros: "카페거리가 예쁘고 학원가가 잘 돼 있어요", cons: "학원 차량으로 저녁 교통이 좀 복잡해요", livedYears: "3~5년", createdAt: "2025-02-18" },
  { id: "rv-bongseon-2", neighborhoodId: "gwangju-bongseon", rating: 4, pros: "교육 환경이 좋고 주거 만족도가 높아요", cons: "주차 공간이 부족해요", livedYears: "5년 이상", createdAt: "2024-10-28" },

  // 광주 남구 주월동
  { id: "rv-juwol-1", neighborhoodId: "gwangju-juwol", rating: 4, pros: "봉선동 인프라를 공유하면서 더 조용해요", cons: "대중교통이 좀 불편한 곳이 있어요", livedYears: "3~5년", createdAt: "2025-01-10" },
  { id: "rv-juwol-2", neighborhoodId: "gwangju-juwol", rating: 4, pros: "아파트 단지가 잘 조성되어 있어요", cons: "외식 선택지가 좀 제한적이에요", livedYears: "5년 이상", createdAt: "2024-12-05" },

  // ══════════════════════════════════════════════════════════════
  // ── 울산 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  // 울산 남구 삼산동
  { id: "rv-samsan-1", neighborhoodId: "ulsan-samsan", rating: 4, pros: "울산 행정중심이라 편의시설이 최고예요", cons: "출퇴근 시간 교통 체증이 있어요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-samsan-2", neighborhoodId: "ulsan-samsan", rating: 4, pros: "롯데백화점, 대형마트 등 쇼핑 편리", cons: "지하철이 없어서 아쉬워요", livedYears: "1~3년", createdAt: "2024-11-25" },

  // 울산 남구 달동
  { id: "rv-dal-1", neighborhoodId: "ulsan-dal", rating: 3, pros: "먹자골목이 발달해 외식이 편해요", cons: "유흥가 주변 야간 소음이 있어요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-dal-2", neighborhoodId: "ulsan-dal", rating: 3, pros: "삼산동 인프라에 접근이 좋아요", cons: "밤에 좀 어수선한 구간이 있어요", livedYears: "3~5년", createdAt: "2024-10-08" },

  // 울산 중구 성남동
  { id: "rv-ulsan-seongnam-1", neighborhoodId: "ulsan-seongnam", rating: 3, pros: "태화강이 가깝고 문화의거리가 있어요", cons: "구도심이라 건물이 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-ulsan-seongnam-2", neighborhoodId: "ulsan-seongnam", rating: 3, pros: "중앙시장이 활기차고 물가가 저렴해요", cons: "삼산 신도심에 비해 인프라가 부족해요", livedYears: "3~5년", createdAt: "2024-12-20" },

  // 울산 중구 학성동
  { id: "rv-hakseong-1", neighborhoodId: "ulsan-hakseong", rating: 3, pros: "태화강 산책로가 좋고 역사 유적이 있어요", cons: "원도심이라 주거 환경이 좀 열악해요", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-hakseong-2", neighborhoodId: "ulsan-hakseong", rating: 3, pros: "물가가 매우 저렴해요", cons: "편의시설이 부족해요", livedYears: "3~5년", createdAt: "2024-11-08" },

  // ══════════════════════════════════════════════════════════════
  // ── 세종 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  { id: "rv-boram-1", neighborhoodId: "sejong-boram", rating: 4, pros: "정부세종청사가 가깝고 BRT가 편리해요", cons: "문화·여가 시설이 아직 부족해요", livedYears: "1~3년", createdAt: "2025-02-10" },
  { id: "rv-boram-2", neighborhoodId: "sejong-boram", rating: 5, pros: "신축 아파트, 공원, 깨끗한 환경 삼박자", cons: "서울이나 대전까지 나가야 할 때가 있어요", livedYears: "1~3년", createdAt: "2024-12-15" },

  { id: "rv-naseong-1", neighborhoodId: "sejong-naseong", rating: 4, pros: "세종시청이 가깝고 조용한 환경이에요", cons: "상권이 아직 발달 중이에요", livedYears: "1~3년", createdAt: "2025-01-20" },
  { id: "rv-naseong-2", neighborhoodId: "sejong-naseong", rating: 4, pros: "교육 환경이 좋고 아이 키우기 적합해요", cons: "대중교통이 BRT 위주라 불편할 때가 있어요", livedYears: "1년 미만", createdAt: "2024-11-05" },

  { id: "rv-dodam-1", neighborhoodId: "sejong-dodam", rating: 4, pros: "세종호수공원이 가까워 산책이 좋아요", cons: "겨울에 바람이 강해요", livedYears: "1~3년", createdAt: "2025-02-22" },
  { id: "rv-dodam-2", neighborhoodId: "sejong-dodam", rating: 4, pros: "복합커뮤니티센터 시설이 좋아요", cons: "외식 선택지가 좀 제한적이에요", livedYears: "1년 미만", createdAt: "2024-10-20" },

  // ══════════════════════════════════════════════════════════════
  // ── 제주 리뷰 ──
  // ══════════════════════════════════════════════════════════════

  { id: "rv-yeondong-1", neighborhoodId: "jeju-yeondong", rating: 3, pros: "제주 최대 상권이라 뭐든 가까이에 있어요", cons: "관광객이 많아 주말엔 복잡하고 물가가 비싸요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-yeondong-2", neighborhoodId: "jeju-yeondong", rating: 3, pros: "맛집과 카페가 정말 많아요", cons: "교통 체증이 심하고 주차가 어려워요", livedYears: "3~5년", createdAt: "2024-11-18" },

  { id: "rv-nohyeong-1", neighborhoodId: "jeju-nohyeong", rating: 4, pros: "학원가와 마트가 가까워 생활이 편리해요", cons: "연동 상권에 비해 좀 심심해요", livedYears: "3~5년", createdAt: "2025-01-25" },
  { id: "rv-nohyeong-2", neighborhoodId: "jeju-nohyeong", rating: 4, pros: "주거 중심이라 비교적 조용해요", cons: "대중교통이 불편해서 자차가 필수에요", livedYears: "1~3년", createdAt: "2024-10-12" },

  { id: "rv-ido-1", neighborhoodId: "jeju-ido", rating: 3, pros: "제주시청과 동문시장이 가까워요", cons: "구도심이라 건물이 좀 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-ido-2", neighborhoodId: "jeju-ido", rating: 3, pros: "탑동 해변이 가까워 바다를 즐길 수 있어요", cons: "관광 시즌에 차가 많이 막혀요", livedYears: "3~5년", createdAt: "2024-12-22" },

  // ══════════════════════════════════════════════════════════════
  // ── 서울 추가 리뷰 (중랑구·성북구·강북구·도봉구·금천구) ──
  // ══════════════════════════════════════════════════════════════

  // 중랑구 면목동
  { id: "rv-myeonmok-1", neighborhoodId: "seoul-myeonmok", rating: 3, pros: "중랑천 산책로가 좋고 재래시장이 가까워요", cons: "지하철 7호선 밖에 없어서 환승이 불편해요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-myeonmok-2", neighborhoodId: "seoul-myeonmok", rating: 3, pros: "물가가 저렴하고 조용한 편이에요", cons: "강남 출퇴근이 오래 걸려요", livedYears: "1~3년", createdAt: "2024-11-15" },

  // 중랑구 상봉동
  { id: "rv-sangbong-1", neighborhoodId: "seoul-sangbong", rating: 3, pros: "상봉터미널이 가까워 지방 이동이 편해요", cons: "역 주변 외에는 상권이 부족해요", livedYears: "1~3년", createdAt: "2025-01-20" },
  { id: "rv-sangbong-2", neighborhoodId: "seoul-sangbong", rating: 4, pros: "중랑천 산책로가 바로 앞이라 운동하기 좋아요", cons: "오래된 건물이 많아요", livedYears: "3~5년", createdAt: "2024-10-05" },

  // 중랑구 망우동
  { id: "rv-mangu-1", neighborhoodId: "seoul-mangu", rating: 3, pros: "조용하고 공기가 좋아요", cons: "편의시설이 부족하고 교통이 불편해요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-mangu-2", neighborhoodId: "seoul-mangu", rating: 3, pros: "월세가 저렴해서 부담이 적어요", cons: "망우산 때문에 밤에 좀 어두운 편이에요", livedYears: "1년 미만", createdAt: "2024-12-20" },

  // 성북구 길음동
  { id: "rv-gireum-1", neighborhoodId: "seoul-gireum", rating: 4, pros: "길음뉴타운 신축 아파트가 좋고 4호선 접근 좋아요", cons: "미아리고개 쪽은 오래된 건물이 많아요", livedYears: "3~5년", createdAt: "2025-02-15" },
  { id: "rv-gireum-2", neighborhoodId: "seoul-gireum", rating: 3, pros: "시장이 가깝고 물가가 강남보다 훨씬 저렴해요", cons: "언덕이 있어서 걸어 다니기 힘들 때가 있어요", livedYears: "1~3년", createdAt: "2024-10-22" },

  // 성북구 정릉동
  { id: "rv-jeongneung-1", neighborhoodId: "seoul-jeongneung", rating: 3, pros: "북한산이 가까워 등산하기 좋아요", cons: "지하철이 없어서 버스에 의존해야 해요", livedYears: "3~5년", createdAt: "2025-01-15" },
  { id: "rv-jeongneung-2", neighborhoodId: "seoul-jeongneung", rating: 3, pros: "국민대 근처라 젊은 분위기가 있어요", cons: "대중교통이 불편하고 언덕이 많아요", livedYears: "1~3년", createdAt: "2024-11-30" },

  // 성북구 돈암동
  { id: "rv-donam-1", neighborhoodId: "seoul-donam", rating: 3, pros: "성신여대입구역이 가까워 교통이 편리해요", cons: "골목이 좁고 주차가 어려워요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-donam-2", neighborhoodId: "seoul-donam", rating: 3, pros: "대학가라 맛집이 꽤 있어요", cons: "주거 환경이 좀 노후됐어요", livedYears: "3~5년", createdAt: "2024-12-10" },

  // 강북구 수유동
  { id: "rv-suyu-1", neighborhoodId: "seoul-suyu", rating: 3, pros: "수유역 근처 상권이 잘 되어있어요", cons: "북한산 쪽은 경사가 심해요", livedYears: "3~5년", createdAt: "2025-01-25" },
  { id: "rv-suyu-2", neighborhoodId: "seoul-suyu", rating: 4, pros: "북한산 등산을 매일 갈 수 있어서 좋아요", cons: "강남까지 출퇴근이 1시간 이상 걸려요", livedYears: "5년 이상", createdAt: "2024-10-18" },

  // 강북구 미아동
  { id: "rv-mia-1", neighborhoodId: "seoul-mia", rating: 3, pros: "미아사거리역 주변 편의시설이 괜찮아요", cons: "골목이 좁고 주차가 힘들어요", livedYears: "1~3년", createdAt: "2025-02-01" },
  { id: "rv-mia-2", neighborhoodId: "seoul-mia", rating: 3, pros: "월세가 저렴한 편이에요", cons: "언덕이 많아 걸어 다니기 불편해요", livedYears: "1년 미만", createdAt: "2024-11-08" },

  // 강북구 번동
  { id: "rv-beon-1", neighborhoodId: "seoul-beon", rating: 3, pros: "조용하고 북한산이 가까워요", cons: "지하철역이 멀어 버스를 타야 해요", livedYears: "3~5년", createdAt: "2025-01-12" },
  { id: "rv-beon-2", neighborhoodId: "seoul-beon", rating: 3, pros: "아이 키우기에 자연환경이 좋아요", cons: "상권이 거의 없어요", livedYears: "1~3년", createdAt: "2024-12-05" },

  // 도봉구 창동
  { id: "rv-changdong-1", neighborhoodId: "seoul-changdong", rating: 4, pros: "창동역 환승이 편리하고 대형마트가 가까워요", cons: "아레나 공사 중이라 소음이 있어요", livedYears: "3~5년", createdAt: "2025-02-18" },
  { id: "rv-changdong-2", neighborhoodId: "seoul-changdong", rating: 3, pros: "1·4호선 환승이라 교통이 괜찮아요", cons: "밤에 좀 한산한 편이에요", livedYears: "1~3년", createdAt: "2024-11-22" },

  // 도봉구 방학동
  { id: "rv-banghak-1", neighborhoodId: "seoul-banghak", rating: 4, pros: "도봉산이 바로 앞이라 자연환경이 최고예요", cons: "서울 중심부까지 거리가 멀어요", livedYears: "5년 이상", createdAt: "2025-01-30" },
  { id: "rv-banghak-2", neighborhoodId: "seoul-banghak", rating: 3, pros: "조용하고 공원이 많아 산책하기 좋아요", cons: "상권이 부족해서 쇼핑이 불편해요", livedYears: "1~3년", createdAt: "2024-10-15" },

  // 도봉구 쌍문동
  { id: "rv-ssangmun-1", neighborhoodId: "seoul-ssangmun", rating: 3, pros: "쌍문역이 가까워 교통이 괜찮아요", cons: "오래된 주택이 많고 좁은 골목이 있어요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-ssangmun-2", neighborhoodId: "seoul-ssangmun", rating: 3, pros: "조용하고 학교가 많아 교육 환경이 나쁘지 않아요", cons: "먹거리나 놀거리가 좀 부족해요", livedYears: "3~5년", createdAt: "2024-12-18" },

  // 금천구 가산동
  { id: "rv-gasan-1", neighborhoodId: "seoul-gasan", rating: 4, pros: "IT 회사 다니면 직주근접 최고예요", cons: "출퇴근 시간 역이 정말 혼잡해요", livedYears: "1~3년", createdAt: "2025-02-12" },
  { id: "rv-gasan-2", neighborhoodId: "seoul-gasan", rating: 3, pros: "아울렛이 가까워 쇼핑이 편해요", cons: "주거지보다 업무지구 느낌이 강해요", livedYears: "1년 미만", createdAt: "2024-11-25" },

  // 금천구 독산동
  { id: "rv-doksan-1", neighborhoodId: "seoul-doksan", rating: 3, pros: "물가가 저렴하고 시장이 가까워요", cons: "도로가 좁고 주차가 어려워요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-doksan-2", neighborhoodId: "seoul-doksan", rating: 3, pros: "1호선 독산역이 가까워요", cons: "주변이 좀 노후된 느낌이에요", livedYears: "3~5년", createdAt: "2024-10-28" },

  // 금천구 시흥동
  { id: "rv-siheung-1", neighborhoodId: "seoul-siheung", rating: 3, pros: "관악산 등산이 가능하고 조용해요", cons: "지하철역이 멀고 편의시설이 부족해요", livedYears: "1~3년", createdAt: "2025-01-05" },
  { id: "rv-siheung-2", neighborhoodId: "seoul-siheung", rating: 3, pros: "월세가 정말 저렴한 편이에요", cons: "밤에 어두운 골목이 있어요", livedYears: "1년 미만", createdAt: "2024-12-15" },

  // ══════════════════════════════════════════════════════════════
  // ── 부산 추가 리뷰 (북구·동구·서구·영도구·강서구·기장군) ──
  // ══════════════════════════════════════════════════════════════

  // 부산 북구 구포동
  { id: "rv-gupo-1", neighborhoodId: "busan-gupo", rating: 3, pros: "구포시장이 활기차고 물가가 저렴해요", cons: "낙동강 범람 우려가 가끔 있어요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-gupo-2", neighborhoodId: "busan-gupo", rating: 3, pros: "KTX 구포역이 가까워 서울 가기 편해요", cons: "시내 중심부까지 거리가 있어요", livedYears: "1~3년", createdAt: "2024-11-20" },

  // 부산 북구 덕천동
  { id: "rv-deokcheon-1", neighborhoodId: "busan-deokcheon", rating: 3, pros: "덕천역 주변 상권이 잘 되어있어요", cons: "주거지가 좀 밀집되어 있어요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-deokcheon-2", neighborhoodId: "busan-deokcheon", rating: 3, pros: "3호선 덕천역이라 교통이 괜찮아요", cons: "오래된 주택이 많아요", livedYears: "3~5년", createdAt: "2024-10-12" },

  // 부산 동구 범일동
  { id: "rv-beomil-1", neighborhoodId: "busan-beomil", rating: 3, pros: "부산진시장이 가깝고 물가가 저렴해요", cons: "재개발 공사로 소음이 있어요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-beomil-2", neighborhoodId: "busan-beomil", rating: 2, pros: "교통은 나쁘지 않아요", cons: "주거 환경이 많이 노후됐어요", livedYears: "3~5년", createdAt: "2024-12-08" },

  // 부산 동구 초량동
  { id: "rv-choryang-1", neighborhoodId: "busan-choryang", rating: 3, pros: "부산역이 가까워 KTX 이용이 편리해요", cons: "관광지라 주말에 사람이 많아요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-choryang-2", neighborhoodId: "busan-choryang", rating: 3, pros: "차이나타운 먹거리가 다양해요", cons: "경사가 심하고 골목이 좁아요", livedYears: "1년 미만", createdAt: "2024-11-10" },

  // 부산 서구 동대신동
  { id: "rv-dongdaesin-1", neighborhoodId: "busan-dongdaesin", rating: 3, pros: "도시철도역이 가깝고 구도심 정취가 있어요", cons: "언덕이 심해서 걸어 다니기 힘들어요", livedYears: "3~5년", createdAt: "2025-02-05" },
  { id: "rv-dongdaesin-2", neighborhoodId: "busan-dongdaesin", rating: 3, pros: "물가가 저렴한 편이에요", cons: "주차가 어렵고 도로가 좁아요", livedYears: "1~3년", createdAt: "2024-10-20" },

  // 부산 서구 서대신동
  { id: "rv-seodaesin-1", neighborhoodId: "busan-seodaesin", rating: 3, pros: "조용하고 부산대병원이 가까워요", cons: "경사가 가파르고 편의시설이 부족해요", livedYears: "3~5년", createdAt: "2025-01-15" },
  { id: "rv-seodaesin-2", neighborhoodId: "busan-seodaesin", rating: 3, pros: "월세가 저렴해요", cons: "오래된 동네라 건물이 낡았어요", livedYears: "1~3년", createdAt: "2024-12-01" },

  // 부산 영도구 동삼동
  { id: "rv-dongsam-1", neighborhoodId: "busan-dongsam", rating: 3, pros: "태종대가 가깝고 바다 조망이 좋아요", cons: "시내 접근성이 떨어져요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-dongsam-2", neighborhoodId: "busan-dongsam", rating: 3, pros: "한국해양대가 있어 젊은 분위기가 있어요", cons: "상권이 부족하고 대중교통이 불편해요", livedYears: "3~5년", createdAt: "2024-11-15" },

  // 부산 영도구 청학동
  { id: "rv-cheonghak-1", neighborhoodId: "busan-cheonghak", rating: 3, pros: "영도대교 야경이 멋지고 봉래산 산책로가 좋아요", cons: "영도 밖으로 나가려면 다리를 건너야 해요", livedYears: "3~5년", createdAt: "2025-01-20" },
  { id: "rv-cheonghak-2", neighborhoodId: "busan-cheonghak", rating: 2, pros: "물가가 저렴해요", cons: "생활 인프라가 많이 부족해요", livedYears: "1~3년", createdAt: "2024-10-08" },

  // 부산 강서구 명지동
  { id: "rv-myeongji-1", neighborhoodId: "busan-myeongji", rating: 4, pros: "명지신도시 신축 아파트가 좋고 공원이 많아요", cons: "도심까지 출퇴근 교통이 불편해요", livedYears: "1~3년", createdAt: "2025-02-18" },
  { id: "rv-myeongji-2", neighborhoodId: "busan-myeongji", rating: 4, pros: "깨끗하고 쾌적한 주거환경이에요", cons: "아직 상권이 완전히 형성되지 않았어요", livedYears: "1년 미만", createdAt: "2024-12-10" },

  // 부산 강서구 대저동
  { id: "rv-dajeo-1", neighborhoodId: "busan-dajeo", rating: 3, pros: "낙동강 생태공원이 가까워 자연이 좋아요", cons: "편의시설이 거의 없어요", livedYears: "3~5년", createdAt: "2025-01-05" },
  { id: "rv-dajeo-2", neighborhoodId: "busan-dajeo", rating: 3, pros: "조용하고 공기가 맑아요", cons: "시내까지 차 없이는 이동이 어려워요", livedYears: "1~3년", createdAt: "2024-11-28" },

  // 부산 기장군 기장읍
  { id: "rv-gijang-1", neighborhoodId: "busan-gijang", rating: 3, pros: "바다가 가깝고 해산물이 신선해요", cons: "부산 시내까지 거리가 있어요", livedYears: "3~5년", createdAt: "2025-02-12" },
  { id: "rv-gijang-2", neighborhoodId: "busan-gijang", rating: 3, pros: "기장시장 먹거리가 훌륭해요", cons: "대중교통이 불편하고 자차가 필수예요", livedYears: "1~3년", createdAt: "2024-10-25" },

  // 부산 기장군 정관읍
  { id: "rv-jeonggwan-1", neighborhoodId: "busan-jeonggwan", rating: 4, pros: "정관신도시 아파트가 깨끗하고 교육 환경이 좋아요", cons: "부산 시내까지 출퇴근이 오래 걸려요", livedYears: "1~3년", createdAt: "2025-01-25" },
  { id: "rv-jeonggwan-2", neighborhoodId: "busan-jeonggwan", rating: 4, pros: "공원이 많고 아이 키우기 좋아요", cons: "외식 선택지가 좀 제한적이에요", livedYears: "3~5년", createdAt: "2024-12-15" },

  // ══════════════════════════════════════════════════════════════
  // ── 인천 추가 리뷰 (동구) ──
  // ══════════════════════════════════════════════════════════════

  // 인천 동구 송림동
  { id: "rv-songnim-1", neighborhoodId: "incheon-songnim", rating: 3, pros: "송림시장이 가깝고 물가가 저렴해요", cons: "건물이 오래되고 재개발이 더뎌요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-songnim-2", neighborhoodId: "incheon-songnim", rating: 3, pros: "월세가 정말 저렴한 편이에요", cons: "주거 환경이 좀 열악해요", livedYears: "1~3년", createdAt: "2024-11-18" },

  // 인천 동구 화수동
  { id: "rv-hwasu-1", neighborhoodId: "incheon-hwasu", rating: 2, pros: "인천항이 가깝고 월세가 저렴해요", cons: "주거 환경이 열악하고 편의시설이 부족해요", livedYears: "1~3년", createdAt: "2025-01-08" },
  { id: "rv-hwasu-2", neighborhoodId: "incheon-hwasu", rating: 2, pros: "구도심 특유의 정감이 있어요", cons: "교통이 불편하고 밤에 어두운 편이에요", livedYears: "3~5년", createdAt: "2024-12-20" },

  // ══════════════════════════════════════════════════════════════
  // ── 대구 추가 리뷰 (서구·달성군) ──
  // ══════════════════════════════════════════════════════════════

  // 대구 서구 비산동
  { id: "rv-bisan-1", neighborhoodId: "daegu-bisan", rating: 3, pros: "서구청이 가깝고 생활 편의시설이 있어요", cons: "오래된 동네라 건물이 낡았어요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-bisan-2", neighborhoodId: "daegu-bisan", rating: 3, pros: "지하철역이 가까워 교통이 괜찮아요", cons: "주차가 어렵고 도로가 좁아요", livedYears: "3~5년", createdAt: "2024-10-15" },

  // 대구 서구 내당동
  { id: "rv-naedang-1", neighborhoodId: "daegu-naedang", rating: 3, pros: "조용하고 월세가 저렴해요", cons: "상권이 부족하고 좀 심심해요", livedYears: "1~3년", createdAt: "2025-01-20" },
  { id: "rv-naedang-2", neighborhoodId: "daegu-naedang", rating: 3, pros: "재래시장이 가까워 장보기 편해요", cons: "건물이 오래됐어요", livedYears: "3~5년", createdAt: "2024-11-28" },

  // 대구 달성군 다사읍
  { id: "rv-dasa-1", neighborhoodId: "daegu-dasa", rating: 4, pros: "신축 아파트가 많고 깨끗한 환경이에요", cons: "대구 시내까지 출퇴근이 좀 걸려요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-dasa-2", neighborhoodId: "daegu-dasa", rating: 4, pros: "이마트가 가깝고 교육 환경이 좋아요", cons: "아직 개발 중이라 공사 소음이 있어요", livedYears: "1년 미만", createdAt: "2024-12-08" },

  // 대구 달성군 화원읍
  { id: "rv-hwawon-1", neighborhoodId: "daegu-hwawon", rating: 3, pros: "비슬산이 가깝고 자연환경이 좋아요", cons: "시내까지 거리가 있어요", livedYears: "3~5년", createdAt: "2025-01-12" },
  { id: "rv-hwawon-2", neighborhoodId: "daegu-hwawon", rating: 4, pros: "택지지구라 주거 환경이 쾌적해요", cons: "외식 선택지가 제한적이에요", livedYears: "1~3년", createdAt: "2024-10-20" },

  // ══════════════════════════════════════════════════════════════
  // ── 대전 추가 리뷰 (동구·대덕구) ──
  // ══════════════════════════════════════════════════════════════

  // 대전 동구 용전동
  { id: "rv-yongjeon-1", neighborhoodId: "daejeon-yongjeon", rating: 3, pros: "대전역이 가까워 KTX 이용이 편해요", cons: "구도심이라 건물이 오래됐어요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-yongjeon-2", neighborhoodId: "daejeon-yongjeon", rating: 3, pros: "중앙시장이 가깝고 물가가 저렴해요", cons: "밤에 좀 한산해요", livedYears: "3~5년", createdAt: "2024-11-15" },

  // 대전 동구 판암동
  { id: "rv-panam-1", neighborhoodId: "daejeon-panam", rating: 3, pros: "식장산이 가까워 등산하기 좋아요", cons: "대전 외곽이라 시내 접근이 불편해요", livedYears: "1~3년", createdAt: "2025-01-22" },
  { id: "rv-panam-2", neighborhoodId: "daejeon-panam", rating: 3, pros: "1호선 판암역이 있어 최소한의 교통은 돼요", cons: "편의시설이 부족한 편이에요", livedYears: "3~5년", createdAt: "2024-12-05" },

  // 대전 대덕구 신탄진동
  { id: "rv-sintanjin-1", neighborhoodId: "daejeon-sintanjin", rating: 3, pros: "신탄진역이 있고 대청호 드라이브가 좋아요", cons: "대전 시내까지 거리가 좀 있어요", livedYears: "3~5년", createdAt: "2025-02-12" },
  { id: "rv-sintanjin-2", neighborhoodId: "daejeon-sintanjin", rating: 3, pros: "빵축제로 유명하고 먹거리가 있어요", cons: "밤에 좀 조용해서 심심해요", livedYears: "1~3년", createdAt: "2024-10-28" },

  // 대전 대덕구 법동
  { id: "rv-beopdong-1", neighborhoodId: "daejeon-beopdong", rating: 3, pros: "대덕연구단지가 가까워 출퇴근이 편해요", cons: "상권이 부족하고 좀 한산해요", livedYears: "1~3년", createdAt: "2025-01-18" },
  { id: "rv-beopdong-2", neighborhoodId: "daejeon-beopdong", rating: 3, pros: "조용하고 주거 환경이 나쁘지 않아요", cons: "대중교통이 불편해요", livedYears: "3~5년", createdAt: "2024-11-22" },

  // ══════════════════════════════════════════════════════════════
  // ── 광주 추가 리뷰 (동구·광산구) ──
  // ══════════════════════════════════════════════════════════════

  // 광주 동구 충장동
  { id: "rv-chungjang-1", neighborhoodId: "gwangju-chungjang", rating: 3, pros: "충장로 번화가라 쇼핑과 외식이 편해요", cons: "주말에 사람이 너무 많고 시끄러워요", livedYears: "1~3년", createdAt: "2025-02-15" },
  { id: "rv-chungjang-2", neighborhoodId: "gwangju-chungjang", rating: 3, pros: "문화전당이 가까워 문화생활이 좋아요", cons: "주거지보다 상업지구 느낌이 강해요", livedYears: "1년 미만", createdAt: "2024-11-10" },

  // 광주 동구 산수동
  { id: "rv-sansu-1", neighborhoodId: "gwangju-sansu", rating: 3, pros: "무등산 입구라 등산하기 좋아요", cons: "상권이 부족하고 경사가 있어요", livedYears: "3~5년", createdAt: "2025-01-25" },
  { id: "rv-sansu-2", neighborhoodId: "gwangju-sansu", rating: 3, pros: "조용하고 공기가 좋아요", cons: "대중교통이 좀 불편해요", livedYears: "1~3년", createdAt: "2024-12-18" },

  // 광주 광산구 수완동
  { id: "rv-suwan-1", neighborhoodId: "gwangju-suwan", rating: 4, pros: "수완지구 신축 아파트가 좋고 학원가가 잘 되어있어요", cons: "출퇴근 시간 교통 체증이 있어요", livedYears: "1~3년", createdAt: "2025-02-08" },
  { id: "rv-suwan-2", neighborhoodId: "gwangju-suwan", rating: 4, pros: "상권이 잘 발달해서 생활이 편리해요", cons: "주말에 상가 주변이 좀 복잡해요", livedYears: "3~5년", createdAt: "2024-10-22" },

  // 광주 광산구 첨단동
  { id: "rv-cheomdan-1", neighborhoodId: "gwangju-cheomdan", rating: 4, pros: "광주과기원이 가깝고 공원이 많아 쾌적해요", cons: "시내 중심부까지 좀 멀어요", livedYears: "1~3년", createdAt: "2025-01-15" },
  { id: "rv-cheomdan-2", neighborhoodId: "gwangju-cheomdan", rating: 5, pros: "깨끗하고 조용한 신도시 환경이에요", cons: "문화시설이 좀 부족해요", livedYears: "1년 미만", createdAt: "2024-12-08" },

  // ══════════════════════════════════════════════════════════════
  // ── 울산 추가 리뷰 (동구·북구·울주군) ──
  // ══════════════════════════════════════════════════════════════

  // 울산 동구 전하동
  { id: "rv-jeonha-1", neighborhoodId: "ulsan-jeonha", rating: 3, pros: "현대중공업 출퇴근이 편해요", cons: "산업 소음이 있는 편이에요", livedYears: "3~5년", createdAt: "2025-02-10" },
  { id: "rv-jeonha-2", neighborhoodId: "ulsan-jeonha", rating: 3, pros: "일산해수욕장이 가까워 바다를 즐길 수 있어요", cons: "밤에 좀 한산해요", livedYears: "1~3년", createdAt: "2024-11-20" },

  // 울산 동구 일산동
  { id: "rv-ilsan-1", neighborhoodId: "ulsan-ilsan", rating: 3, pros: "바다가 가깝고 해안 산책이 좋아요", cons: "시내 중심부까지 거리가 있어요", livedYears: "1~3년", createdAt: "2025-01-28" },
  { id: "rv-ilsan-2", neighborhoodId: "ulsan-ilsan", rating: 3, pros: "현대중공업 종사자에게 편리한 위치예요", cons: "상권이 좀 부족해요", livedYears: "3~5년", createdAt: "2024-12-12" },

  // 울산 북구 연암동
  { id: "rv-yeonam-1", neighborhoodId: "ulsan-yeonam", rating: 3, pros: "울산대가 가깝고 조용한 편이에요", cons: "시내까지 좀 멀어요", livedYears: "1~3년", createdAt: "2025-02-05" },
  { id: "rv-yeonam-2", neighborhoodId: "ulsan-yeonam", rating: 3, pros: "월세가 저렴하고 주거 환경이 괜찮아요", cons: "대중교통이 좀 불편해요", livedYears: "3~5년", createdAt: "2024-10-18" },

  // 울산 북구 매곡동
  { id: "rv-maegok-1", neighborhoodId: "ulsan-maegok", rating: 3, pros: "자연환경이 좋고 공기가 맑아요", cons: "편의시설이 부족해요", livedYears: "1~3년", createdAt: "2025-01-12" },
  { id: "rv-maegok-2", neighborhoodId: "ulsan-maegok", rating: 3, pros: "조용해서 아이 키우기에 나쁘지 않아요", cons: "자차가 없으면 생활이 불편해요", livedYears: "3~5년", createdAt: "2024-11-25" },

  // 울산 울주군 삼남읍
  { id: "rv-samnam-1", neighborhoodId: "ulsan-samnam", rating: 3, pros: "자연환경이 뛰어나고 공기가 좋아요", cons: "편의시설이 거의 없어서 시내로 나가야 해요", livedYears: "3~5년", createdAt: "2025-02-18" },
  { id: "rv-samnam-2", neighborhoodId: "ulsan-samnam", rating: 3, pros: "영남알프스 등산이 가까워요", cons: "대중교통이 매우 불편해요", livedYears: "1~3년", createdAt: "2024-12-22" },

  // 울산 울주군 범서읍
  { id: "rv-beomseo-1", neighborhoodId: "ulsan-beomseo", rating: 3, pros: "울산대학교가 가깝고 택지개발이 진행 중이에요", cons: "아직 인프라가 부족한 곳이 있어요", livedYears: "1~3년", createdAt: "2025-01-20" },
  { id: "rv-beomseo-2", neighborhoodId: "ulsan-beomseo", rating: 3, pros: "자연환경이 좋고 조용해요", cons: "시내까지 출퇴근이 좀 걸려요", livedYears: "3~5년", createdAt: "2024-10-30" },
];

// ─── 유틸 함수 ─────────────────────────────────────────────────

/** 전체 동 목록 반환 */
export function getAllNeighborhoods(): Neighborhood[] {
  return neighborhoods;
}

/** id로 단일 동 조회 */
export function getNeighborhoodById(id: string): Neighborhood | undefined {
  return neighborhoods.find((n) => n.id === id);
}

/** 구(district) 이름으로 해당 구의 동 목록 조회 */
export function getNeighborhoodsByDistrict(district: string): Neighborhood[] {
  return neighborhoods.filter((n) => n.district === district);
}

/** 검색 (동 이름, 구 이름, 도시 이름, highlights 매칭) */
export function searchNeighborhoods(query: string): Neighborhood[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return neighborhoods.filter(
    (n) =>
      n.name.toLowerCase().includes(q) ||
      n.district.toLowerCase().includes(q) ||
      n.city.toLowerCase().includes(q) ||
      n.highlights.some((h) => h.toLowerCase().includes(q)),
  );
}

/** 특정 동의 민원 데이터 조회 */
export function getComplaints(neighborhoodId: string): Complaint[] {
  return complaints.filter((c) => c.neighborhoodId === neighborhoodId);
}

/** 특정 동의 소음 포인트 조회 */
export function getNoisePoints(neighborhoodId: string): NoisePoint[] {
  // neighborhoodId 에서 마지막 segment 를 추출해 np-{segment} 접두사로 필터
  const parts = neighborhoodId.split("-");
  const key = parts[parts.length - 1]; // e.g. "yeoksam"
  return noisePoints.filter((np) => np.id.startsWith(`np-${key}`));
}

/** 특정 동의 주민 리뷰 조회 */
export function getReviews(neighborhoodId: string): AreaReview[] {
  return reviews.filter((r) => r.neighborhoodId === neighborhoodId);
}

/** 종합 점수 높은 순 TOP 10 */
export function getPopularNeighborhoods(): Neighborhood[] {
  return [...neighborhoods].sort((a, b) => b.overallScore - a.overallScore).slice(0, 10);
}

/** 전체 구 목록 (중복 제거, 가나다순) */
export function getDistrictList(): string[] {
  const set = new Set(neighborhoods.map((n) => n.district));
  return [...set].sort();
}

/** 시 목록 */
export function getCityList(): string[] {
  const set = new Set(neighborhoods.map((n) => n.city));
  return [...set].sort();
}

/** 특정 시의 구 목록 */
export function getDistrictsByCity(city: string): string[] {
  const set = new Set(
    neighborhoods.filter((n) => n.city === city).map((n) => n.district)
  );
  return [...set].sort();
}

/** 특정 시의 인기 동네 TOP 10 */
export function getPopularByCity(city: string): Neighborhood[] {
  return neighborhoods
    .filter((n) => n.city === city)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 10);
}

// ============================================================
// 안전지도 (Safety Map) — CCTV · 경찰서 · 비상벨 등
// ============================================================

export interface SafetyInfo {
  neighborhoodId: string;
  cctvCount: number;          // 방범 CCTV 수
  cctvTraffic: number;        // 교통 CCTV 수
  policeStation: string;      // 가까운 경찰서/지구대
  policeDistance?: string;
  convenienceStores24h: number; // 24시 편의점 수
  emergencyBells: number;     // 비상벨 수
  safetyScore: number;        // 0~100
}

export const safetyData: SafetyInfo[] = [
  // ── 강남구 ──
  { neighborhoodId: "gangnam-yeoksam", cctvCount: 45, cctvTraffic: 20, policeStation: "역삼파출소", policeDistance: "도보 3분", convenienceStores24h: 12, emergencyBells: 8, safetyScore: 85 },
  { neighborhoodId: "gangnam-samsung", cctvCount: 50, cctvTraffic: 22, policeStation: "삼성파출소", policeDistance: "도보 4분", convenienceStores24h: 14, emergencyBells: 10, safetyScore: 88 },
  { neighborhoodId: "gangnam-daechi", cctvCount: 42, cctvTraffic: 18, policeStation: "대치지구대", policeDistance: "도보 5분", convenienceStores24h: 10, emergencyBells: 9, safetyScore: 86 },
  { neighborhoodId: "gangnam-nonhyeon", cctvCount: 38, cctvTraffic: 16, policeStation: "논현파출소", policeDistance: "도보 4분", convenienceStores24h: 11, emergencyBells: 7, safetyScore: 82 },

  // ── 서초구 ──
  { neighborhoodId: "seocho-seocho", cctvCount: 48, cctvTraffic: 21, policeStation: "서초파출소", policeDistance: "도보 3분", convenienceStores24h: 13, emergencyBells: 9, safetyScore: 87 },
  { neighborhoodId: "seocho-banpo", cctvCount: 44, cctvTraffic: 19, policeStation: "반포지구대", policeDistance: "도보 5분", convenienceStores24h: 10, emergencyBells: 8, safetyScore: 86 },
  { neighborhoodId: "seocho-bangbae", cctvCount: 40, cctvTraffic: 17, policeStation: "방배지구대", policeDistance: "도보 6분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 83 },

  // ── 마포구 ──
  { neighborhoodId: "mapo-hapjeong", cctvCount: 35, cctvTraffic: 15, policeStation: "합정지구대", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 6, safetyScore: 78 },
  { neighborhoodId: "mapo-mangwon", cctvCount: 30, cctvTraffic: 12, policeStation: "망원파출소", policeDistance: "도보 6분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 74 },
  { neighborhoodId: "mapo-yeonnam", cctvCount: 28, cctvTraffic: 11, policeStation: "연남파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 5, safetyScore: 73 },
  { neighborhoodId: "mapo-sangsu", cctvCount: 32, cctvTraffic: 13, policeStation: "상수지구대", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 5, safetyScore: 75 },

  // ── 송파구 ──
  { neighborhoodId: "songpa-jamsil", cctvCount: 52, cctvTraffic: 24, policeStation: "잠실파출소", policeDistance: "도보 3분", convenienceStores24h: 15, emergencyBells: 11, safetyScore: 90 },
  { neighborhoodId: "songpa-garak", cctvCount: 38, cctvTraffic: 16, policeStation: "가락지구대", policeDistance: "도보 6분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 79 },
  { neighborhoodId: "songpa-munjeong", cctvCount: 36, cctvTraffic: 15, policeStation: "문정지구대", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "songpa-wirye", cctvCount: 55, cctvTraffic: 25, policeStation: "위례파출소", policeDistance: "도보 4분", convenienceStores24h: 12, emergencyBells: 12, safetyScore: 91 },

  // ── 동대문구 ──
  { neighborhoodId: "dongdaemun-hwigyeong", cctvCount: 26, cctvTraffic: 10, policeStation: "휘경파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 65 },
  { neighborhoodId: "dongdaemun-hoegi", cctvCount: 28, cctvTraffic: 11, policeStation: "회기지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "dongdaemun-jangan", cctvCount: 24, cctvTraffic: 10, policeStation: "장안파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "dongdaemun-jeonnong", cctvCount: 26, cctvTraffic: 11, policeStation: "전농지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 67 },

  // ── 영등포구 ──
  { neighborhoodId: "yeongdeungpo-yeouido", cctvCount: 46, cctvTraffic: 20, policeStation: "여의도파출소", policeDistance: "도보 3분", convenienceStores24h: 11, emergencyBells: 9, safetyScore: 84 },
  { neighborhoodId: "yeongdeungpo-dangsan", cctvCount: 32, cctvTraffic: 14, policeStation: "당산지구대", policeDistance: "도보 6분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "yeongdeungpo-yeongdeungpo", cctvCount: 28, cctvTraffic: 12, policeStation: "영등포경찰서", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 5, safetyScore: 68 },

  // ── 용산구 ──
  { neighborhoodId: "yongsan-itaewon", cctvCount: 40, cctvTraffic: 18, policeStation: "이태원파출소", policeDistance: "도보 3분", convenienceStores24h: 10, emergencyBells: 8, safetyScore: 76 },
  { neighborhoodId: "yongsan-hannam", cctvCount: 36, cctvTraffic: 15, policeStation: "한남파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "yongsan-yongsan", cctvCount: 34, cctvTraffic: 14, policeStation: "용산경찰서", policeDistance: "도보 4분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 75 },

  // ── 성동구 ──
  { neighborhoodId: "seongdong-seongsu", cctvCount: 34, cctvTraffic: 14, policeStation: "성수지구대", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 6, safetyScore: 77 },
  { neighborhoodId: "seongdong-wangsimni", cctvCount: 30, cctvTraffic: 13, policeStation: "왕십리파출소", policeDistance: "도보 4분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 73 },
  { neighborhoodId: "seongdong-oksu", cctvCount: 28, cctvTraffic: 11, policeStation: "옥수지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },

  // ── 관악구 ──
  { neighborhoodId: "gwanak-sillim", cctvCount: 25, cctvTraffic: 10, policeStation: "신림지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "gwanak-bongcheon", cctvCount: 23, cctvTraffic: 9, policeStation: "봉천파출소", policeDistance: "도보 8분", convenienceStores24h: 5, emergencyBells: 3, safetyScore: 60 },

  // ── 노원구 ──
  { neighborhoodId: "nowon-sanggye", cctvCount: 28, cctvTraffic: 11, policeStation: "상계파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 4, safetyScore: 67 },
  { neighborhoodId: "nowon-junggye", cctvCount: 26, cctvTraffic: 10, policeStation: "중계지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 65 },
  { neighborhoodId: "nowon-hagye", cctvCount: 22, cctvTraffic: 8, policeStation: "하계파출소", policeDistance: "도보 8분", convenienceStores24h: 5, emergencyBells: 3, safetyScore: 63 },

  // ── 은평구 ──
  { neighborhoodId: "eunpyeong-eungam", cctvCount: 24, cctvTraffic: 10, policeStation: "응암파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 3, safetyScore: 64 },
  { neighborhoodId: "eunpyeong-bulgwang", cctvCount: 22, cctvTraffic: 9, policeStation: "불광지구대", policeDistance: "도보 8분", convenienceStores24h: 5, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "eunpyeong-nokbeon", cctvCount: 20, cctvTraffic: 8, policeStation: "녹번파출소", policeDistance: "도보 9분", convenienceStores24h: 4, emergencyBells: 2, safetyScore: 60 },

  // ── 강서구 ──
  { neighborhoodId: "gangseo-hwagok", cctvCount: 26, cctvTraffic: 11, policeStation: "화곡지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "gangseo-magok", cctvCount: 48, cctvTraffic: 22, policeStation: "마곡파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 10, safetyScore: 88 },
  { neighborhoodId: "gangseo-deungchon", cctvCount: 24, cctvTraffic: 10, policeStation: "등촌지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 65 },

  // ── 구로구 ──
  { neighborhoodId: "guro-guro", cctvCount: 28, cctvTraffic: 12, policeStation: "구로경찰서", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "guro-gocheok", cctvCount: 24, cctvTraffic: 10, policeStation: "고척파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 3, safetyScore: 63 },
  { neighborhoodId: "guro-sindorim", cctvCount: 30, cctvTraffic: 13, policeStation: "신도림지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 70 },

  // ── 동작구 ──
  { neighborhoodId: "dongjak-sadang", cctvCount: 32, cctvTraffic: 14, policeStation: "사당지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "dongjak-noryangjin", cctvCount: 28, cctvTraffic: 11, policeStation: "노량진파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "dongjak-heukseok", cctvCount: 26, cctvTraffic: 10, policeStation: "흑석지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 67 },

  // ── 광진구 ──
  { neighborhoodId: "gwangjin-gunja", cctvCount: 30, cctvTraffic: 13, policeStation: "군자파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 71 },
  { neighborhoodId: "gwangjin-jayang", cctvCount: 26, cctvTraffic: 10, policeStation: "자양지구대", policeDistance: "도보 6분", convenienceStores24h: 8, emergencyBells: 4, safetyScore: 69 },
  { neighborhoodId: "gwangjin-guui", cctvCount: 28, cctvTraffic: 11, policeStation: "구의파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },

  // ── 중구 ──
  { neighborhoodId: "junggu-myeongdong", cctvCount: 55, cctvTraffic: 28, policeStation: "명동파출소", policeDistance: "도보 2분", convenienceStores24h: 18, emergencyBells: 12, safetyScore: 89 },
  { neighborhoodId: "junggu-chungmuro", cctvCount: 40, cctvTraffic: 18, policeStation: "충무로지구대", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "junggu-euljiro", cctvCount: 42, cctvTraffic: 20, policeStation: "을지로파출소", policeDistance: "도보 3분", convenienceStores24h: 12, emergencyBells: 8, safetyScore: 81 },

  // ── 종로구 ──
  { neighborhoodId: "jongno-jongno", cctvCount: 50, cctvTraffic: 25, policeStation: "종로경찰서", policeDistance: "도보 3분", convenienceStores24h: 14, emergencyBells: 10, safetyScore: 85 },
  { neighborhoodId: "jongno-hyehwa", cctvCount: 35, cctvTraffic: 14, policeStation: "혜화파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "jongno-samcheong", cctvCount: 30, cctvTraffic: 12, policeStation: "삼청파출소", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 5, safetyScore: 78 },

  // ── 강동구 ──
  { neighborhoodId: "gangdong-cheonho", cctvCount: 32, cctvTraffic: 14, policeStation: "천호파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 6, safetyScore: 74 },
  { neighborhoodId: "gangdong-gildong", cctvCount: 28, cctvTraffic: 11, policeStation: "길동지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 70 },
  { neighborhoodId: "gangdong-myeongil", cctvCount: 34, cctvTraffic: 15, policeStation: "명일파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 7, safetyScore: 76 },

  // ── 서대문구 ──
  { neighborhoodId: "seodaemun-yeonhui", cctvCount: 26, cctvTraffic: 10, policeStation: "연희파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "seodaemun-sinchon", cctvCount: 34, cctvTraffic: 15, policeStation: "신촌지구대", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 6, safetyScore: 73 },
  { neighborhoodId: "seodaemun-hongje", cctvCount: 22, cctvTraffic: 9, policeStation: "홍제파출소", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 63 },

  // ── 양천구 ──
  { neighborhoodId: "yangcheon-mokdong", cctvCount: 40, cctvTraffic: 18, policeStation: "목동파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 81 },
  { neighborhoodId: "yangcheon-sinjeong", cctvCount: 28, cctvTraffic: 11, policeStation: "신정지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 68 },

  // ── 수원 ──
  { neighborhoodId: "suwon-homaesil", cctvCount: 44, cctvTraffic: 20, policeStation: "호매실파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 82 },

  // ══════════════════════════════════════════════════════════════
  // ── 경기도 ──
  // ══════════════════════════════════════════════════════════════

  // 성남시
  { neighborhoodId: "seongnam-jeongja", cctvCount: 48, cctvTraffic: 22, policeStation: "정자파출소", policeDistance: "도보 4분", convenienceStores24h: 12, emergencyBells: 10, safetyScore: 87 },
  { neighborhoodId: "seongnam-seohyeon", cctvCount: 44, cctvTraffic: 20, policeStation: "서현지구대", policeDistance: "도보 5분", convenienceStores24h: 11, emergencyBells: 9, safetyScore: 85 },
  { neighborhoodId: "seongnam-sinheung", cctvCount: 28, cctvTraffic: 12, policeStation: "신흥파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 68 },

  // 고양시
  { neighborhoodId: "goyang-madu", cctvCount: 38, cctvTraffic: 16, policeStation: "마두파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "goyang-juyeop", cctvCount: 40, cctvTraffic: 18, policeStation: "주엽지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "goyang-hwajeong", cctvCount: 34, cctvTraffic: 15, policeStation: "화정파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 6, safetyScore: 76 },

  // 용인시
  { neighborhoodId: "yongin-jukjeon", cctvCount: 42, cctvTraffic: 18, policeStation: "죽전파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 8, safetyScore: 83 },
  { neighborhoodId: "yongin-gugal", cctvCount: 35, cctvTraffic: 14, policeStation: "구갈지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 78 },
  { neighborhoodId: "yongin-yeoksam", cctvCount: 18, cctvTraffic: 8, policeStation: "처인경찰서", policeDistance: "도보 10분", convenienceStores24h: 3, emergencyBells: 2, safetyScore: 60 },

  // 부천시
  { neighborhoodId: "bucheon-sangdong", cctvCount: 36, cctvTraffic: 16, policeStation: "상동파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "bucheon-jungdong", cctvCount: 34, cctvTraffic: 15, policeStation: "중동지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 77 },

  // 안양시
  { neighborhoodId: "anyang-pyeongchon", cctvCount: 42, cctvTraffic: 18, policeStation: "평촌파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 8, safetyScore: 83 },
  { neighborhoodId: "anyang-anyang", cctvCount: 28, cctvTraffic: 12, policeStation: "안양경찰서", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 68 },

  // 안산시
  { neighborhoodId: "ansan-gojan", cctvCount: 32, cctvTraffic: 14, policeStation: "고잔파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 74 },
  { neighborhoodId: "ansan-bono", cctvCount: 30, cctvTraffic: 12, policeStation: "본오지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },

  // 화성시
  { neighborhoodId: "hwaseong-dongtan", cctvCount: 52, cctvTraffic: 24, policeStation: "동탄파출소", policeDistance: "도보 4분", convenienceStores24h: 12, emergencyBells: 11, safetyScore: 88 },
  { neighborhoodId: "hwaseong-byeongjeom", cctvCount: 32, cctvTraffic: 14, policeStation: "병점지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 74 },

  // 평택시
  { neighborhoodId: "pyeongtaek-pyeongtaek", cctvCount: 26, cctvTraffic: 11, policeStation: "평택경찰서", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "pyeongtaek-bijeon", cctvCount: 34, cctvTraffic: 14, policeStation: "비전파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 74 },

  // 김포시
  { neighborhoodId: "gimpo-janggi", cctvCount: 40, cctvTraffic: 18, policeStation: "장기파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 80 },
  { neighborhoodId: "gimpo-gurae", cctvCount: 42, cctvTraffic: 18, policeStation: "구래지구대", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 8, safetyScore: 82 },

  // 파주시
  { neighborhoodId: "paju-unjeong", cctvCount: 44, cctvTraffic: 20, policeStation: "운정파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 9, safetyScore: 83 },
  { neighborhoodId: "paju-geumchon", cctvCount: 24, cctvTraffic: 10, policeStation: "금촌지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 65 },

  // 하남시
  { neighborhoodId: "hanam-misa", cctvCount: 48, cctvTraffic: 22, policeStation: "미사파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 10, safetyScore: 86 },
  { neighborhoodId: "hanam-pungsan", cctvCount: 36, cctvTraffic: 15, policeStation: "하남경찰서", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 78 },

  // 광명시
  { neighborhoodId: "gwangmyeong-cheolsan", cctvCount: 34, cctvTraffic: 15, policeStation: "철산파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "gwangmyeong-haan", cctvCount: 28, cctvTraffic: 11, policeStation: "하안지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 70 },

  // 의정부시
  { neighborhoodId: "uijeongbu-minrak", cctvCount: 38, cctvTraffic: 16, policeStation: "민락파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "uijeongbu-uijeongbu", cctvCount: 30, cctvTraffic: 13, policeStation: "의정부경찰서", policeDistance: "도보 4분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 72 },

  // 남양주시
  { neighborhoodId: "namyangju-dasan", cctvCount: 46, cctvTraffic: 20, policeStation: "다산파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 9, safetyScore: 84 },
  { neighborhoodId: "namyangju-byeollae", cctvCount: 42, cctvTraffic: 18, policeStation: "별내지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 82 },

  // 구리시
  { neighborhoodId: "guri-inchang", cctvCount: 30, cctvTraffic: 12, policeStation: "구리경찰서", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 74 },
  { neighborhoodId: "guri-galmae", cctvCount: 38, cctvTraffic: 16, policeStation: "갈매파출소", policeDistance: "도보 5분", convenienceStores24h: 6, emergencyBells: 7, safetyScore: 80 },

  // 수원 추가
  { neighborhoodId: "suwon-jeongja", cctvCount: 28, cctvTraffic: 12, policeStation: "장안파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "suwon-jowon", cctvCount: 26, cctvTraffic: 10, policeStation: "조원지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "suwon-ingye", cctvCount: 30, cctvTraffic: 14, policeStation: "인계파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 74 },
  { neighborhoodId: "suwon-maegyo", cctvCount: 28, cctvTraffic: 12, policeStation: "매교지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "suwon-yeongtong", cctvCount: 38, cctvTraffic: 16, policeStation: "영통파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "suwon-gwanggyo", cctvCount: 50, cctvTraffic: 22, policeStation: "광교파출소", policeDistance: "도보 4분", convenienceStores24h: 12, emergencyBells: 10, safetyScore: 88 },
  { neighborhoodId: "suwon-maetan", cctvCount: 36, cctvTraffic: 15, policeStation: "매탄파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 78 },
  { neighborhoodId: "suwon-gwonseon", cctvCount: 26, cctvTraffic: 11, policeStation: "권선지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },

  // 성남 추가
  { neighborhoodId: "seongnam-seongnam", cctvCount: 24, cctvTraffic: 10, policeStation: "성남파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 64 },
  { neighborhoodId: "seongnam-jungang", cctvCount: 28, cctvTraffic: 12, policeStation: "중앙지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 68 },
  { neighborhoodId: "seongnam-yatap", cctvCount: 42, cctvTraffic: 18, policeStation: "야탑파출소", policeDistance: "도보 5분", convenienceStores24h: 10, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "seongnam-taepyeong", cctvCount: 26, cctvTraffic: 11, policeStation: "태평지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 68 },

  // 고양 추가
  { neighborhoodId: "goyang-baekseok", cctvCount: 36, cctvTraffic: 16, policeStation: "백석파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "goyang-daehwa", cctvCount: 38, cctvTraffic: 17, policeStation: "대화지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "goyang-haengsin", cctvCount: 34, cctvTraffic: 14, policeStation: "행신파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },

  // 용인 추가
  { neighborhoodId: "yongin-seongbok", cctvCount: 40, cctvTraffic: 18, policeStation: "성복파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 7, safetyScore: 82 },
  { neighborhoodId: "yongin-bojeong", cctvCount: 36, cctvTraffic: 15, policeStation: "보정지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 78 },
  { neighborhoodId: "yongin-mohyeon", cctvCount: 16, cctvTraffic: 6, policeStation: "모현파출소", policeDistance: "도보 12분", convenienceStores24h: 2, emergencyBells: 2, safetyScore: 58 },

  // 부천 추가
  { neighborhoodId: "bucheon-ojeong", cctvCount: 30, cctvTraffic: 12, policeStation: "오정파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "bucheon-sosa", cctvCount: 28, cctvTraffic: 12, policeStation: "소사지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },

  // 안양 추가
  { neighborhoodId: "anyang-hogye", cctvCount: 38, cctvTraffic: 16, policeStation: "호계파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "anyang-seoksu", cctvCount: 26, cctvTraffic: 11, policeStation: "석수지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },

  // 안산 추가
  { neighborhoodId: "ansan-wongok", cctvCount: 30, cctvTraffic: 13, policeStation: "원곡파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "ansan-sadong", cctvCount: 32, cctvTraffic: 14, policeStation: "사동지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 76 },

  // 화성 추가
  { neighborhoodId: "hwaseong-bongdam", cctvCount: 34, cctvTraffic: 14, policeStation: "봉담파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "hwaseong-hyangnam", cctvCount: 34, cctvTraffic: 14, policeStation: "향남지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 6, safetyScore: 76 },

  // 평택 추가
  { neighborhoodId: "pyeongtaek-godeok", cctvCount: 42, cctvTraffic: 18, policeStation: "고덕파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "pyeongtaek-seojeong", cctvCount: 28, cctvTraffic: 12, policeStation: "서정지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },

  // 김포 추가
  { neighborhoodId: "gimpo-pungmu", cctvCount: 32, cctvTraffic: 14, policeStation: "풍무파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "gimpo-yangchon", cctvCount: 18, cctvTraffic: 8, policeStation: "양촌파출소", policeDistance: "도보 10분", convenienceStores24h: 3, emergencyBells: 2, safetyScore: 62 },

  // 파주 추가
  { neighborhoodId: "paju-gyoha", cctvCount: 40, cctvTraffic: 18, policeStation: "교하파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "paju-munsan", cctvCount: 22, cctvTraffic: 10, policeStation: "문산지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 64 },

  // 하남 추가
  { neighborhoodId: "hanam-sinjang", cctvCount: 30, cctvTraffic: 13, policeStation: "신장파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "hanam-deokpung", cctvCount: 28, cctvTraffic: 12, policeStation: "덕풍지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },

  // 광명 추가
  { neighborhoodId: "gwangmyeong-soha", cctvCount: 34, cctvTraffic: 14, policeStation: "소하파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "gwangmyeong-gwangmyeong", cctvCount: 30, cctvTraffic: 12, policeStation: "광명파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },

  // 의정부 추가
  { neighborhoodId: "uijeongbu-howon", cctvCount: 32, cctvTraffic: 14, policeStation: "호원파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "uijeongbu-nokyang", cctvCount: 28, cctvTraffic: 12, policeStation: "녹양지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },

  // 남양주 추가
  { neighborhoodId: "namyangju-hopyeong", cctvCount: 34, cctvTraffic: 14, policeStation: "호평파출소", policeDistance: "도보 5분", convenienceStores24h: 6, emergencyBells: 6, safetyScore: 78 },
  { neighborhoodId: "namyangju-pyeongnae", cctvCount: 36, cctvTraffic: 15, policeStation: "평내지구대", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 78 },

  // 구리 추가
  { neighborhoodId: "guri-sutaek", cctvCount: 28, cctvTraffic: 12, policeStation: "수택파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "guri-gyomun", cctvCount: 30, cctvTraffic: 13, policeStation: "교문지구대", policeDistance: "도보 5분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 74 },

  // ══════════════════════════════════════════════════════════════
  // ── 인천 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "incheon-songdo", cctvCount: 55, cctvTraffic: 25, policeStation: "송도파출소", policeDistance: "도보 4분", convenienceStores24h: 14, emergencyBells: 12, safetyScore: 90 },
  { neighborhoodId: "incheon-yeonsu", cctvCount: 34, cctvTraffic: 14, policeStation: "연수지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "incheon-ganseok", cctvCount: 28, cctvTraffic: 12, policeStation: "간석파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "incheon-guwol", cctvCount: 36, cctvTraffic: 16, policeStation: "구월파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "incheon-bupyeong", cctvCount: 38, cctvTraffic: 17, policeStation: "부평경찰서", policeDistance: "도보 3분", convenienceStores24h: 11, emergencyBells: 7, safetyScore: 76 },
  { neighborhoodId: "incheon-sipjeong", cctvCount: 28, cctvTraffic: 11, policeStation: "십정지구대", policeDistance: "도보 7분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "incheon-geomdan", cctvCount: 44, cctvTraffic: 20, policeStation: "검단파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 9, safetyScore: 82 },
  { neighborhoodId: "incheon-cheongna", cctvCount: 50, cctvTraffic: 22, policeStation: "청라파출소", policeDistance: "도보 4분", convenienceStores24h: 11, emergencyBells: 10, safetyScore: 87 },
  { neighborhoodId: "incheon-hagik", cctvCount: 26, cctvTraffic: 10, policeStation: "학익지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "incheon-yonghyeon", cctvCount: 24, cctvTraffic: 10, policeStation: "용현파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 64 },
  { neighborhoodId: "incheon-gyesan", cctvCount: 30, cctvTraffic: 12, policeStation: "계산파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 74 },
  { neighborhoodId: "incheon-jakjeon", cctvCount: 28, cctvTraffic: 11, policeStation: "작전지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "incheon-unseo", cctvCount: 36, cctvTraffic: 16, policeStation: "운서파출소", policeDistance: "도보 5분", convenienceStores24h: 6, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "incheon-sinpo", cctvCount: 32, cctvTraffic: 14, policeStation: "신포파출소", policeDistance: "도보 4분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 74 },

  // ══════════════════════════════════════════════════════════════
  // ── 부산 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "busan-udong", cctvCount: 48, cctvTraffic: 22, policeStation: "센텀파출소", policeDistance: "도보 4분", convenienceStores24h: 14, emergencyBells: 10, safetyScore: 86 },
  { neighborhoodId: "busan-jungdong", cctvCount: 42, cctvTraffic: 18, policeStation: "해운대파출소", policeDistance: "도보 3분", convenienceStores24h: 12, emergencyBells: 9, safetyScore: 82 },
  { neighborhoodId: "busan-jwadong", cctvCount: 40, cctvTraffic: 17, policeStation: "좌동지구대", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 8, safetyScore: 80 },
  { neighborhoodId: "busan-bujeon", cctvCount: 40, cctvTraffic: 18, policeStation: "부전파출소", policeDistance: "도보 3분", convenienceStores24h: 12, emergencyBells: 8, safetyScore: 78 },
  { neighborhoodId: "busan-jeonpo", cctvCount: 34, cctvTraffic: 14, policeStation: "전포지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 75 },
  { neighborhoodId: "busan-gwangan", cctvCount: 36, cctvTraffic: 16, policeStation: "광안파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "busan-namcheon", cctvCount: 34, cctvTraffic: 14, policeStation: "남천지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "busan-daeyeon", cctvCount: 32, cctvTraffic: 14, policeStation: "대연파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 75 },
  { neighborhoodId: "busan-yongho", cctvCount: 24, cctvTraffic: 10, policeStation: "용호지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "busan-hadan", cctvCount: 30, cctvTraffic: 13, policeStation: "하단파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "busan-dangni", cctvCount: 26, cctvTraffic: 10, policeStation: "당리지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "busan-myeongnyun", cctvCount: 32, cctvTraffic: 14, policeStation: "동래경찰서", policeDistance: "도보 4분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "busan-oncheon", cctvCount: 30, cctvTraffic: 12, policeStation: "온천파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 74 },
  { neighborhoodId: "busan-jangjeon", cctvCount: 30, cctvTraffic: 12, policeStation: "장전파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 74 },
  { neighborhoodId: "busan-bugok", cctvCount: 28, cctvTraffic: 11, policeStation: "부곡지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "busan-geoje", cctvCount: 32, cctvTraffic: 14, policeStation: "거제파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "busan-yeonsan", cctvCount: 34, cctvTraffic: 15, policeStation: "연산파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "busan-jurye", cctvCount: 28, cctvTraffic: 12, policeStation: "주례파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "busan-gamjeon", cctvCount: 24, cctvTraffic: 10, policeStation: "감전지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },

  // ══════════════════════════════════════════════════════════════
  // ── 대구 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "daegu-beomeo", cctvCount: 44, cctvTraffic: 20, policeStation: "수성경찰서", policeDistance: "도보 4분", convenienceStores24h: 11, emergencyBells: 9, safetyScore: 85 },
  { neighborhoodId: "daegu-manchon", cctvCount: 40, cctvTraffic: 17, policeStation: "만촌파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "daegu-sangin", cctvCount: 34, cctvTraffic: 15, policeStation: "상인파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "daegu-wolseong", cctvCount: 36, cctvTraffic: 15, policeStation: "월성지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "daegu-dongsungro", cctvCount: 52, cctvTraffic: 25, policeStation: "중부경찰서", policeDistance: "도보 2분", convenienceStores24h: 16, emergencyBells: 11, safetyScore: 84 },
  { neighborhoodId: "daegu-samdeok", cctvCount: 30, cctvTraffic: 12, policeStation: "삼덕파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "daegu-chimsan", cctvCount: 28, cctvTraffic: 11, policeStation: "침산지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "daegu-sangyeok", cctvCount: 30, cctvTraffic: 12, policeStation: "산격파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "daegu-sinam", cctvCount: 30, cctvTraffic: 13, policeStation: "신암파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "daegu-hyomok", cctvCount: 28, cctvTraffic: 11, policeStation: "효목지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "daegu-daemyeong", cctvCount: 30, cctvTraffic: 12, policeStation: "대명파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "daegu-bongdeok", cctvCount: 28, cctvTraffic: 11, policeStation: "봉덕지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },

  // ══════════════════════════════════════════════════════════════
  // ── 대전 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "daejeon-bongmyeong", cctvCount: 32, cctvTraffic: 14, policeStation: "봉명파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 6, safetyScore: 75 },
  { neighborhoodId: "daejeon-gungdong", cctvCount: 28, cctvTraffic: 11, policeStation: "궁동지구대", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "daejeon-dunsan", cctvCount: 46, cctvTraffic: 21, policeStation: "둔산파출소", policeDistance: "도보 3분", convenienceStores24h: 13, emergencyBells: 10, safetyScore: 87 },
  { neighborhoodId: "daejeon-tanbang", cctvCount: 36, cctvTraffic: 15, policeStation: "탄방지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 7, safetyScore: 78 },
  { neighborhoodId: "daejeon-daeheung", cctvCount: 28, cctvTraffic: 12, policeStation: "대흥파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "daejeon-eunhaeng", cctvCount: 26, cctvTraffic: 10, policeStation: "은행지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 66 },

  // ══════════════════════════════════════════════════════════════
  // ── 광주 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "gwangju-chipyeong", cctvCount: 38, cctvTraffic: 16, policeStation: "상무파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 7, safetyScore: 80 },
  { neighborhoodId: "gwangju-nongseong", cctvCount: 28, cctvTraffic: 12, policeStation: "농성지구대", policeDistance: "도보 5분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "gwangju-yongbong", cctvCount: 30, cctvTraffic: 12, policeStation: "용봉파출소", policeDistance: "도보 6분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "gwangju-unam", cctvCount: 28, cctvTraffic: 11, policeStation: "운암지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "gwangju-bongseon", cctvCount: 34, cctvTraffic: 14, policeStation: "봉선파출소", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "gwangju-juwol", cctvCount: 32, cctvTraffic: 13, policeStation: "주월지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 74 },

  // ══════════════════════════════════════════════════════════════
  // ── 울산 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "ulsan-samsan", cctvCount: 42, cctvTraffic: 18, policeStation: "삼산파출소", policeDistance: "도보 4분", convenienceStores24h: 11, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "ulsan-dal", cctvCount: 30, cctvTraffic: 13, policeStation: "달동지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "ulsan-seongnam", cctvCount: 28, cctvTraffic: 11, policeStation: "중부경찰서", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "ulsan-hakseong", cctvCount: 24, cctvTraffic: 10, policeStation: "학성지구대", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 64 },

  // ══════════════════════════════════════════════════════════════
  // ── 세종 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "sejong-boram", cctvCount: 48, cctvTraffic: 22, policeStation: "보람파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 10, safetyScore: 86 },
  { neighborhoodId: "sejong-naseong", cctvCount: 46, cctvTraffic: 20, policeStation: "세종경찰서", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 9, safetyScore: 85 },
  { neighborhoodId: "sejong-dodam", cctvCount: 44, cctvTraffic: 20, policeStation: "도담지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 9, safetyScore: 84 },

  // ══════════════════════════════════════════════════════════════
  // ── 제주 ──
  // ══════════════════════════════════════════════════════════════

  { neighborhoodId: "jeju-yeondong", cctvCount: 34, cctvTraffic: 15, policeStation: "연동파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 6, safetyScore: 76 },
  { neighborhoodId: "jeju-nohyeong", cctvCount: 32, cctvTraffic: 14, policeStation: "노형지구대", policeDistance: "도보 5분", convenienceStores24h: 8, emergencyBells: 6, safetyScore: 74 },
  { neighborhoodId: "jeju-ido", cctvCount: 30, cctvTraffic: 12, policeStation: "제주경찰서", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },

  // ── 서울 추가 (중랑구·성북구·강북구·도봉구·금천구) ──
  { neighborhoodId: "seoul-myeonmok", cctvCount: 26, cctvTraffic: 10, policeStation: "면목파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "seoul-sangbong", cctvCount: 28, cctvTraffic: 11, policeStation: "상봉지구대", policeDistance: "도보 5분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "seoul-mangu", cctvCount: 22, cctvTraffic: 9, policeStation: "망우파출소", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "seoul-gireum", cctvCount: 30, cctvTraffic: 12, policeStation: "길음파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "seoul-jeongneung", cctvCount: 22, cctvTraffic: 8, policeStation: "정릉지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "seoul-donam", cctvCount: 28, cctvTraffic: 11, policeStation: "돈암파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "seoul-suyu", cctvCount: 28, cctvTraffic: 11, policeStation: "수유파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "seoul-mia", cctvCount: 26, cctvTraffic: 10, policeStation: "미아파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "seoul-beon", cctvCount: 22, cctvTraffic: 8, policeStation: "번동지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "seoul-changdong", cctvCount: 32, cctvTraffic: 14, policeStation: "창동파출소", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 72 },
  { neighborhoodId: "seoul-banghak", cctvCount: 24, cctvTraffic: 10, policeStation: "방학지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "seoul-ssangmun", cctvCount: 24, cctvTraffic: 10, policeStation: "쌍문파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 3, safetyScore: 64 },
  { neighborhoodId: "seoul-gasan", cctvCount: 34, cctvTraffic: 15, policeStation: "가산파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 6, safetyScore: 74 },
  { neighborhoodId: "seoul-doksan", cctvCount: 26, cctvTraffic: 10, policeStation: "독산지구대", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "seoul-siheung", cctvCount: 20, cctvTraffic: 8, policeStation: "시흥파출소", policeDistance: "도보 9분", convenienceStores24h: 3, emergencyBells: 3, safetyScore: 60 },

  // ── 부산 추가 (북구·동구·서구·영도구·강서구·기장군) ──
  { neighborhoodId: "busan-gupo", cctvCount: 24, cctvTraffic: 10, policeStation: "구포파출소", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "busan-deokcheon", cctvCount: 28, cctvTraffic: 11, policeStation: "덕천지구대", policeDistance: "도보 5분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "busan-beomil", cctvCount: 24, cctvTraffic: 10, policeStation: "범일파출소", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 64 },
  { neighborhoodId: "busan-choryang", cctvCount: 30, cctvTraffic: 13, policeStation: "초량파출소", policeDistance: "도보 4분", convenienceStores24h: 7, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "busan-dongdaesin", cctvCount: 22, cctvTraffic: 9, policeStation: "동대신파출소", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "busan-seodaesin", cctvCount: 20, cctvTraffic: 8, policeStation: "서대신지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 60 },
  { neighborhoodId: "busan-dongsam", cctvCount: 20, cctvTraffic: 8, policeStation: "동삼파출소", policeDistance: "도보 8분", convenienceStores24h: 3, emergencyBells: 3, safetyScore: 60 },
  { neighborhoodId: "busan-cheonghak", cctvCount: 22, cctvTraffic: 9, policeStation: "청학지구대", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "busan-myeongji", cctvCount: 42, cctvTraffic: 18, policeStation: "명지파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "busan-dajeo", cctvCount: 18, cctvTraffic: 7, policeStation: "대저지구대", policeDistance: "도보 10분", convenienceStores24h: 2, emergencyBells: 2, safetyScore: 58 },
  { neighborhoodId: "busan-gijang", cctvCount: 26, cctvTraffic: 10, policeStation: "기장파출소", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "busan-jeonggwan", cctvCount: 44, cctvTraffic: 20, policeStation: "정관파출소", policeDistance: "도보 4분", convenienceStores24h: 10, emergencyBells: 9, safetyScore: 84 },

  // ── 인천 추가 (동구) ──
  { neighborhoodId: "incheon-songnim", cctvCount: 22, cctvTraffic: 9, policeStation: "송림파출소", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "incheon-hwasu", cctvCount: 18, cctvTraffic: 7, policeStation: "화수지구대", policeDistance: "도보 9분", convenienceStores24h: 3, emergencyBells: 2, safetyScore: 56 },

  // ── 대구 추가 (서구·달성군) ──
  { neighborhoodId: "daegu-bisan", cctvCount: 26, cctvTraffic: 10, policeStation: "비산파출소", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "daegu-naedang", cctvCount: 24, cctvTraffic: 9, policeStation: "내당지구대", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 64 },
  { neighborhoodId: "daegu-dasa", cctvCount: 42, cctvTraffic: 18, policeStation: "다사파출소", policeDistance: "도보 5분", convenienceStores24h: 9, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "daegu-hwawon", cctvCount: 32, cctvTraffic: 14, policeStation: "화원파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 6, safetyScore: 76 },

  // ── 대전 추가 (동구·대덕구) ──
  { neighborhoodId: "daejeon-yongjeon", cctvCount: 26, cctvTraffic: 11, policeStation: "용전파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "daejeon-panam", cctvCount: 22, cctvTraffic: 9, policeStation: "판암지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "daejeon-sintanjin", cctvCount: 28, cctvTraffic: 12, policeStation: "신탄진파출소", policeDistance: "도보 6분", convenienceStores24h: 6, emergencyBells: 5, safetyScore: 70 },
  { neighborhoodId: "daejeon-beopdong", cctvCount: 24, cctvTraffic: 10, policeStation: "법동지구대", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },

  // ── 광주 추가 (동구·광산구) ──
  { neighborhoodId: "gwangju-chungjang", cctvCount: 34, cctvTraffic: 15, policeStation: "충장파출소", policeDistance: "도보 3분", convenienceStores24h: 10, emergencyBells: 7, safetyScore: 76 },
  { neighborhoodId: "gwangju-sansu", cctvCount: 22, cctvTraffic: 9, policeStation: "산수지구대", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 62 },
  { neighborhoodId: "gwangju-suwan", cctvCount: 40, cctvTraffic: 18, policeStation: "수완파출소", policeDistance: "도보 5분", convenienceStores24h: 10, emergencyBells: 8, safetyScore: 82 },
  { neighborhoodId: "gwangju-cheomdan", cctvCount: 44, cctvTraffic: 20, policeStation: "첨단파출소", policeDistance: "도보 4분", convenienceStores24h: 9, emergencyBells: 9, safetyScore: 86 },

  // ── 울산 추가 (동구·북구·울주군) ──
  { neighborhoodId: "ulsan-jeonha", cctvCount: 24, cctvTraffic: 10, policeStation: "전하파출소", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "ulsan-ilsan", cctvCount: 26, cctvTraffic: 11, policeStation: "일산지구대", policeDistance: "도보 6분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 68 },
  { neighborhoodId: "ulsan-yeonam", cctvCount: 24, cctvTraffic: 10, policeStation: "연암파출소", policeDistance: "도보 7분", convenienceStores24h: 5, emergencyBells: 4, safetyScore: 66 },
  { neighborhoodId: "ulsan-maegok", cctvCount: 22, cctvTraffic: 9, policeStation: "매곡지구대", policeDistance: "도보 8분", convenienceStores24h: 4, emergencyBells: 3, safetyScore: 64 },
  { neighborhoodId: "ulsan-samnam", cctvCount: 16, cctvTraffic: 6, policeStation: "삼남파출소", policeDistance: "도보 12분", convenienceStores24h: 2, emergencyBells: 2, safetyScore: 56 },
  { neighborhoodId: "ulsan-beomseo", cctvCount: 24, cctvTraffic: 10, policeStation: "범서파출소", policeDistance: "도보 7분", convenienceStores24h: 4, emergencyBells: 4, safetyScore: 66 },
];

// ─── 안전지도 유틸 함수 ───────────────────────────────────────

/** id로 안전 정보 조회 */
export function getSafetyInfo(neighborhoodId: string): SafetyInfo | undefined {
  return safetyData.find((s) => s.neighborhoodId === neighborhoodId);
}

/** 안전점수 높은 순 랭킹 */
export function getSafetyRanking(): { neighborhood: Neighborhood; safety: SafetyInfo }[] {
  return safetyData
    .sort((a, b) => b.safetyScore - a.safetyScore)
    .map((s) => {
      const neighborhood = neighborhoods.find((n) => n.id === s.neighborhoodId);
      return neighborhood ? { neighborhood, safety: s } : null;
    })
    .filter((item): item is { neighborhood: Neighborhood; safety: SafetyInfo } => item !== null);
}
