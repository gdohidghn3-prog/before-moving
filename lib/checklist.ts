// ============================================================
// "이사전에" 서비스 - 이사 체크리스트 데이터
// ============================================================

// ─── 타입 정의 ────────────────────────────────────────────────

export interface CheckItem {
  id: string;
  title: string;           // "전입신고"
  category: string;        // "required" | "finance" | "telecom" | "car" | "housing" | "other"
  description: string;     // 상세 설명
  where: string;           // "정부24 또는 주민센터"
  deadline: string;        // "이사 후 14일 이내"
  penalty?: string;        // "미신고 시 과태료 5만원"
  documents?: string[];    // 필요 서류
  url?: string;            // 바로가기 URL (정부24 등)
  condition?: string;      // "차량 소유자만" 같은 조건
}

// ─── 카테고리 정의 ────────────────────────────────────────────

const categories = [
  { id: "required", label: "필수", icon: "📋" },
  { id: "finance", label: "금융", icon: "💰" },
  { id: "telecom", label: "통신/배송", icon: "📱" },
  { id: "car", label: "자동차", icon: "🚗" },
  { id: "housing", label: "주거", icon: "🏠" },
  { id: "other", label: "기타", icon: "📦" },
];

// ─── 체크리스트 데이터 (22개) ─────────────────────────────────

const checkItems: CheckItem[] = [
  // ── 필수 ──
  {
    id: "check-01",
    title: "전입신고",
    category: "required",
    description: "새 주소지로 전입신고를 해야 합니다. 온라인(정부24) 또는 주민센터 방문으로 처리 가능합니다.",
    where: "정부24 또는 주민센터",
    deadline: "이사 후 14일 이내",
    penalty: "미신고 시 과태료 5만원",
    documents: ["신분증", "임대차계약서(해당 시)"],
    url: "https://www.gov.kr",
  },
  {
    id: "check-02",
    title: "건강보험 주소변경",
    category: "required",
    description: "국민건강보험공단에 주소 변경 신고를 합니다. 지역가입자는 보험료가 변경될 수 있습니다.",
    where: "국민건강보험공단 홈페이지 또는 지사 방문",
    deadline: "이사 후 14일 이내",
    documents: ["신분증"],
    url: "https://www.nhis.or.kr",
  },
  {
    id: "check-03",
    title: "국민연금 주소변경",
    category: "required",
    description: "국민연금공단에 주소 변경을 신고합니다. 전입신고 시 자동 연동되는 경우도 있습니다.",
    where: "국민연금공단 홈페이지 또는 지사 방문",
    deadline: "이사 후 14일 이내",
    documents: ["신분증"],
  },

  // ── 금융 ──
  {
    id: "check-04",
    title: "은행 주소변경",
    category: "finance",
    description: "주거래 은행의 등록 주소를 변경합니다. 모바일 앱에서 간편하게 변경 가능합니다.",
    where: "주거래 은행 앱 또는 영업점 방문",
    deadline: "이사 후 가능한 빨리",
    documents: ["신분증"],
  },
  {
    id: "check-05",
    title: "신용카드 주소변경",
    category: "finance",
    description: "카드사에 등록된 청구지 주소를 변경합니다. 앱 또는 고객센터 전화로 처리 가능합니다.",
    where: "카드사 앱 또는 고객센터 전화",
    deadline: "이사 후 가능한 빨리",
  },
  {
    id: "check-06",
    title: "보험 주소변경",
    category: "finance",
    description: "생명보험, 손해보험 등 가입된 보험사에 주소 변경을 신고합니다.",
    where: "각 보험사 앱 또는 고객센터",
    deadline: "이사 후 가능한 빨리",
  },
  {
    id: "check-21",
    title: "증권/투자 주소변경",
    category: "finance",
    description: "증권사 계좌에 등록된 주소를 변경합니다. 모바일 앱에서 변경 가능합니다.",
    where: "증권사 앱 또는 영업점 방문",
    deadline: "이사 후 가능한 빨리",
  },

  // ── 통신/배송 ──
  {
    id: "check-07",
    title: "휴대폰 주소변경",
    category: "telecom",
    description: "이동통신사에 등록된 주소를 변경합니다. 각 통신사 앱에서 간편하게 변경 가능합니다.",
    where: "SKT/KT/LGU+ 앱 또는 고객센터",
    deadline: "이사 후 가능한 빨리",
  },
  {
    id: "check-08",
    title: "인터넷/TV 이전 설치",
    category: "telecom",
    description: "인터넷 및 IPTV 이전 설치를 예약합니다. 이사 1~2주 전에 미리 신청하는 것이 좋습니다.",
    where: "ISP(KT/SK브로드밴드/LGU+) 고객센터",
    deadline: "이사 1~2주 전 예약",
  },
  {
    id: "check-09",
    title: "택배 기본 배송지 변경",
    category: "telecom",
    description: "쿠팡, 네이버쇼핑 등 자주 사용하는 쇼핑몰의 기본 배송지를 변경합니다.",
    where: "쿠팡/네이버/마켓컬리 등 각 쇼핑몰 앱",
    deadline: "이사 당일",
  },

  // ── 자동차 ──
  {
    id: "check-10",
    title: "자동차 등록증 주소변경",
    category: "car",
    description: "자동차 등록 주소를 변경합니다. 관할 구청 또는 차량등록사업소에서 처리합니다.",
    where: "관할 구청 또는 차량등록사업소",
    deadline: "이사 후 30일 이내",
    penalty: "미변경 시 과태료 부과",
    documents: ["자동차등록증", "신분증", "전입 확인 서류"],
    condition: "차량 소유자",
  },
  {
    id: "check-11",
    title: "운전면허증 주소변경",
    category: "car",
    description: "운전면허증 뒷면에 새 주소를 기재합니다. 경찰서 또는 정부24에서 처리 가능합니다.",
    where: "경찰서 또는 정부24",
    deadline: "이사 후 가능한 빨리",
    documents: ["운전면허증", "신분증"],
    condition: "차량 소유자",
  },
  {
    id: "check-12",
    title: "자동차 보험 주소변경",
    category: "car",
    description: "자동차 보험에 등록된 주소를 변경합니다. 주소에 따라 보험료가 달라질 수 있습니다.",
    where: "자동차 보험사 앱 또는 고객센터",
    deadline: "이사 후 가능한 빨리",
    condition: "차량 소유자",
  },
  {
    id: "check-20",
    title: "내비게이션 집 주소 변경",
    category: "car",
    description: "차량 내비게이션 및 스마트폰 지도 앱의 집/회사 주소를 변경합니다.",
    where: "내비게이션 앱 또는 차량 설정",
    deadline: "이사 당일",
    condition: "차량 소유자",
  },

  // ── 주거 ──
  {
    id: "check-13",
    title: "우편물 전송 신청",
    category: "housing",
    description: "이전 주소로 오는 우편물을 새 주소로 전송하도록 신청합니다. 6개월간 전송됩니다.",
    where: "우체국 방문 또는 인터넷우체국",
    deadline: "이사 전 또는 직후",
    url: "https://www.epost.go.kr",
  },
  {
    id: "check-14",
    title: "관리비 정산",
    category: "housing",
    description: "이전 아파트/빌라 관리비를 정산하고, 새 아파트에 관리비 납부자로 등록합니다.",
    where: "이전 관리사무소 + 새 관리사무소",
    deadline: "이사 당일 ~ 3일 이내",
    documents: ["입주 확인서(해당 시)"],
  },
  {
    id: "check-15",
    title: "도시가스 명의변경/개통",
    category: "housing",
    description: "이전 집 도시가스를 해지(정산)하고 새 집 도시가스를 개통 또는 명의변경합니다.",
    where: "지역 도시가스 회사 고객센터",
    deadline: "이사 1~3일 전 예약",
  },
  {
    id: "check-16",
    title: "전기 명의변경",
    category: "housing",
    description: "한국전력에 전기 사용자 명의를 변경합니다. 온라인으로 간편하게 처리 가능합니다.",
    where: "한국전력 사이버지점",
    deadline: "이사 후 가능한 빨리",
    url: "https://cyber.kepco.co.kr",
  },
  {
    id: "check-17",
    title: "수도 명의변경",
    category: "housing",
    description: "지역 수도사업소에 수도 사용자 명의를 변경합니다.",
    where: "지역 수도사업소 또는 구청",
    deadline: "이사 후 가능한 빨리",
  },

  // ── 기타 ──
  {
    id: "check-18",
    title: "학교 전학 신청",
    category: "other",
    description: "자녀의 전학 절차를 진행합니다. 전입신고 후 배정학교를 확인하고 전학서류를 준비합니다.",
    where: "교육청 또는 전입 학교",
    deadline: "이사 전 2~4주",
    documents: ["전입신고 확인서", "재학증명서", "건강기록부"],
    condition: "자녀 있는 경우",
  },
  {
    id: "check-19",
    title: "반려동물 등록 주소변경",
    category: "other",
    description: "반려동물 등록 정보의 주소를 변경합니다. 동물보호관리시스템에서 온라인으로 처리 가능합니다.",
    where: "동물보호관리시스템 또는 시군구청",
    deadline: "이사 후 30일 이내",
    penalty: "미변경 시 과태료 부과",
    condition: "반려동물 있는 경우",
  },
  {
    id: "check-22",
    title: "선거인 등록 주소변경",
    category: "other",
    description: "전입신고를 하면 선거인명부가 자동으로 변경됩니다. 별도 신고가 필요 없습니다.",
    where: "전입신고 시 자동 변경",
    deadline: "전입신고와 동시",
  },
];

// ─── 유틸 함수 ─────────────────────────────────────────────────

/** 전체 체크리스트 항목 반환 */
export function getAllCheckItems(): CheckItem[] {
  return checkItems;
}

/** 카테고리별 체크리스트 항목 조회 */
export function getCheckItemsByCategory(category: string): CheckItem[] {
  return checkItems.filter((item) => item.category === category);
}

/** 카테고리 목록 반환 */
export function getCategories(): { id: string; label: string; icon: string }[] {
  return categories;
}
