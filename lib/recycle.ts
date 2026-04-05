// ─────────────────────────────────────────────
// 분리수거 가이드 데이터 — "이사전에" 서비스
// ─────────────────────────────────────────────

// ── 타입 정의 ──────────────────────────────────

export type RecycleCategory =
  | "paper"
  | "plastic"
  | "vinyl"
  | "glass"
  | "can"
  | "styrofoam"
  | "food_waste"
  | "general"
  | "large"
  | "electronic"
  | "hazardous"
  | "clothing";

export interface RecycleItem {
  id: string;
  name: string;
  aliases: string[];
  category: RecycleCategory;
  method: string;
  preparation: string[];
  tips: string[];
  commonMistakes: string[];
  conditions: {
    condition: string;
    category: RecycleCategory;
    method: string;
  }[];
  tags: string[];
}

export interface CategoryInfo {
  id: RecycleCategory;
  label: string;
  icon: string;
  color: string;
  guide: string;
}

// ── 카테고리 정보 ──────────────────────────────

const CATEGORIES: CategoryInfo[] = [
  {
    id: "paper",
    label: "종이류",
    icon: "📄",
    color: "#3B82F6",
    guide: "펼쳐서 묶어 배출",
  },
  {
    id: "plastic",
    label: "플라스틱",
    icon: "🧴",
    color: "#EAB308",
    guide: "라벨 제거, 내용물 비우고 압축",
  },
  {
    id: "vinyl",
    label: "비닐류",
    icon: "🛍️",
    color: "#EAB308",
    guide: "이물질 제거 후 모아서",
  },
  {
    id: "glass",
    label: "유리",
    icon: "🫙",
    color: "#10B981",
    guide: "뚜껑 분리, 내용물 비우기",
  },
  {
    id: "can",
    label: "캔/고철",
    icon: "🥫",
    color: "#6B7280",
    guide: "내용물 비우기",
  },
  {
    id: "styrofoam",
    label: "스티로폼",
    icon: "📦",
    color: "#F5F5F5",
    guide: "테이프/스티커 제거",
  },
  {
    id: "food_waste",
    label: "음식물",
    icon: "🍂",
    color: "#D97706",
    guide: "물기 제거 후 배출",
  },
  {
    id: "general",
    label: "일반쓰레기",
    icon: "🗑️",
    color: "#374151",
    guide: "종량제 봉투에 담아서",
  },
  {
    id: "large",
    label: "대형폐기물",
    icon: "🛋️",
    color: "#7C3AED",
    guide: "지자체 신고 후 스티커 구매",
  },
  {
    id: "electronic",
    label: "전자폐기물",
    icon: "🔌",
    color: "#DC2626",
    guide: "소형가전 수거함",
  },
  {
    id: "hazardous",
    label: "위험폐기물",
    icon: "☢️",
    color: "#DC2626",
    guide: "전용 수거함",
  },
  {
    id: "clothing",
    label: "의류",
    icon: "👕",
    color: "#EC4899",
    guide: "의류수거함",
  },
];

// ── 80개 항목 데이터 ───────────────────────────

const RECYCLE_ITEMS: RecycleItem[] = [
  // ─── 종이 (10) ───────────────────────────────
  {
    id: "cardboard-box",
    name: "택배박스",
    aliases: ["택배상자", "골판지박스", "골판지상자"],
    category: "paper",
    method: "종이류 분리수거함에 배출",
    preparation: [
      "테이프와 송장(운송장) 제거",
      "박스를 접어서 납작하게 펴기",
      "비닐 완충재 분리",
    ],
    tips: [
      "테이프를 완전히 떼기 어려우면 테이프 부분만 잘라내도 됩니다",
      "비 오는 날에는 젖지 않게 배출하세요",
    ],
    commonMistakes: [
      "테이프를 붙인 채 배출하는 경우가 많습니다",
      "송장을 제거하지 않고 배출 — 개인정보 유출 위험",
    ],
    conditions: [
      {
        condition: "기름·음식물이 묻은 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["택배", "박스", "상자", "골판지", "이사"],
  },
  {
    id: "receipt",
    name: "영수증",
    aliases: ["감열지영수증", "카드영수증"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["개인정보 부분 파쇄 또는 잘라서 배출"],
    tips: [
      "영수증은 감열지(열에 반응하는 종이)로 재활용이 불가능합니다",
      "종이처럼 보여도 일반쓰레기입니다",
    ],
    commonMistakes: [
      "종이류로 잘못 분류하는 경우가 많습니다",
      "영수증 한 장이 종이 재활용 전체를 오염시킬 수 있습니다",
    ],
    conditions: [],
    tags: ["영수증", "감열지", "카드전표"],
  },
  {
    id: "milk-carton",
    name: "우유팩",
    aliases: ["종이팩", "두유팩", "주스팩"],
    category: "paper",
    method: "종이팩 전용 수거함 또는 일반 종이류와 별도 배출",
    preparation: [
      "내용물을 비우고 깨끗이 헹구기",
      "팩을 펼쳐서 말리기",
      "종이팩끼리 묶어서 배출",
    ],
    tips: [
      "주민센터에서 종이팩을 모아가면 종량제 봉투로 교환해줍니다",
      "안쪽 은박이 있는 팩(멸균팩)은 별도 분리하세요",
    ],
    commonMistakes: [
      "일반 종이류와 섞어 배출 — 종이팩은 별도 수거입니다",
      "헹구지 않고 배출하면 악취 발생",
    ],
    conditions: [
      {
        condition: "내부에 은박 코팅이 있는 멸균팩",
        category: "paper",
        method: "멸균팩 전용 수거함에 별도 배출",
      },
    ],
    tags: ["우유팩", "종이팩", "두유팩", "주스팩", "멸균팩"],
  },
  {
    id: "newspaper-magazine",
    name: "신문·잡지",
    aliases: ["신문지", "잡지", "전단지", "광고지"],
    category: "paper",
    method: "종이류 분리수거함에 배출",
    preparation: [
      "비닐 포장이나 코팅 부분 제거",
      "묶어서 배출",
    ],
    tips: [
      "이사할 때 그릇 포장재로 활용하면 좋습니다",
      "습기 제거용으로도 활용 가능",
    ],
    commonMistakes: [
      "비닐 코팅된 표지를 분리하지 않고 배출",
    ],
    conditions: [],
    tags: ["신문", "잡지", "전단지", "광고지", "책"],
  },
  {
    id: "paper-cup",
    name: "종이컵",
    aliases: ["일회용컵", "커피컵", "테이크아웃컵"],
    category: "paper",
    method: "종이컵 전용 수거함 또는 종이류로 배출",
    preparation: [
      "내용물 비우고 헹구기",
      "뚜껑(플라스틱)은 분리하여 플라스틱으로 배출",
      "빨대 제거",
    ],
    tips: [
      "종이컵도 종이팩처럼 종량제 봉투 교환 대상입니다",
    ],
    commonMistakes: [
      "플라스틱 뚜껑을 분리하지 않는 경우",
      "커피 등 내용물을 비우지 않고 배출",
    ],
    conditions: [
      {
        condition: "내부 코팅이 심하거나 오염된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["종이컵", "커피컵", "일회용컵", "테이크아웃"],
  },
  {
    id: "coated-paper",
    name: "코팅종이",
    aliases: ["광택종이", "코팅전단지", "라미네이팅"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종이와 분리하여 종량제 봉투에 배출"],
    tips: [
      "종이를 찢었을 때 얇은 비닐 막이 보이면 코팅종이입니다",
      "손으로 찢어지지 않으면 코팅 가능성이 높습니다",
    ],
    commonMistakes: [
      "일반 종이류로 잘못 분류하는 경우가 많습니다",
    ],
    conditions: [],
    tags: ["코팅종이", "광택지", "라미네이팅", "광고지"],
  },
  {
    id: "tissue",
    name: "화장지",
    aliases: ["휴지", "키친타올", "냅킨"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종량제 봉투에 담아서 배출"],
    tips: [
      "화장지는 물에 녹도록 만들어져 재활용이 불가합니다",
      "화장지 안쪽 종이심은 종이류 재활용 가능",
    ],
    commonMistakes: [
      "종이류로 잘못 분류하는 경우",
    ],
    conditions: [],
    tags: ["화장지", "휴지", "키친타올", "냅킨", "티슈"],
  },
  {
    id: "egg-carton",
    name: "달걀판",
    aliases: ["계란판", "에그트레이"],
    category: "paper",
    method: "종이류 분리수거함에 배출",
    preparation: ["이물질 제거 후 배출"],
    tips: [
      "종이 달걀판만 재활용 가능합니다",
    ],
    commonMistakes: [
      "플라스틱 달걀판을 종이류로 배출하는 경우",
    ],
    conditions: [
      {
        condition: "플라스틱 재질인 경우",
        category: "plastic",
        method: "플라스틱류 분리수거함에 배출",
      },
    ],
    tags: ["달걀판", "계란판", "에그트레이"],
  },
  {
    id: "paper-bag",
    name: "종이쇼핑백",
    aliases: ["종이가방", "쇼핑백"],
    category: "paper",
    method: "종이류 분리수거함에 배출",
    preparation: [
      "손잡이(끈)가 비닐이나 천이면 제거",
      "납작하게 접어서 배출",
    ],
    tips: [
      "이사 짐 싸기할 때 소품 담는 용도로 재사용하세요",
    ],
    commonMistakes: [
      "비닐 코팅된 쇼핑백을 종이류로 배출",
    ],
    conditions: [
      {
        condition: "비닐 코팅된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["종이쇼핑백", "종이가방", "쇼핑백", "선물백"],
  },
  {
    id: "thermal-paper",
    name: "감열지",
    aliases: ["팩스용지", "ATM명세서", "주차확인증"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["개인정보 부분 파쇄 또는 잘라서 배출"],
    tips: [
      "열을 가하면 글씨가 나타나는 종이는 모두 감열지입니다",
      "BPA가 포함되어 있어 재활용 시 유해합니다",
    ],
    commonMistakes: [
      "종이류에 넣어 재활용 종이를 오염시키는 경우",
    ],
    conditions: [],
    tags: ["감열지", "팩스용지", "영수증", "ATM", "주차확인증"],
  },

  // ─── 플라스틱 (10) ───────────────────────────
  {
    id: "pet-bottle",
    name: "페트병",
    aliases: ["PET병", "생수병", "음료수병"],
    category: "plastic",
    method: "플라스틱 분리수거함에 배출 (투명 PET는 별도)",
    preparation: [
      "내용물 비우고 헹구기",
      "라벨(비닐) 제거",
      "뚜껑 분리 후 각각 배출",
      "가능하면 압축",
    ],
    tips: [
      "투명 페트병은 별도 수거함이 있으면 따로 배출하세요",
      "뚜껑도 플라스틱이니 분리수거 가능합니다",
    ],
    commonMistakes: [
      "라벨을 제거하지 않는 경우",
      "내용물을 비우지 않고 배출",
    ],
    conditions: [],
    tags: ["페트병", "PET", "생수병", "음료수병", "물병"],
  },
  {
    id: "side-dish-container",
    name: "반찬용기",
    aliases: ["플라스틱반찬통", "배달용기", "일회용용기"],
    category: "plastic",
    method: "플라스틱 분리수거함에 배출",
    preparation: [
      "남은 음식물 제거",
      "깨끗이 헹구기",
      "뚜껑 분리",
    ],
    tips: [
      "기름기가 남아있으면 뜨거운 물로 헹구세요",
    ],
    commonMistakes: [
      "음식물이 묻은 채 배출하는 경우가 많습니다",
    ],
    conditions: [
      {
        condition: "세척이 어려울 정도로 오염된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["반찬용기", "배달용기", "일회용용기", "플라스틱통"],
  },
  {
    id: "yogurt-cup",
    name: "요거트컵",
    aliases: ["요구르트병", "요플레통"],
    category: "plastic",
    method: "플라스틱 분리수거함에 배출",
    preparation: [
      "내용물 비우고 헹구기",
      "알루미늄 뚜껑 분리하여 캔류로 배출",
    ],
    tips: [
      "뚜껑의 알루미늄 호일은 캔류로 배출하세요",
    ],
    commonMistakes: [
      "뚜껑을 분리하지 않고 배출",
      "헹구지 않고 배출하여 악취 발생",
    ],
    conditions: [],
    tags: ["요거트", "요구르트", "요플레", "유제품컵"],
  },
  {
    id: "straw",
    name: "빨대",
    aliases: ["플라스틱빨대"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["헹궈서 종량제 봉투에 배출"],
    tips: [
      "빨대는 너무 작아서 재활용 선별이 어렵습니다",
      "종이빨대도 일반쓰레기입니다",
    ],
    commonMistakes: [
      "플라스틱이라 분리수거 가능하다고 생각하는 경우",
    ],
    conditions: [],
    tags: ["빨대", "스트로우"],
  },
  {
    id: "drink-cap",
    name: "음료뚜껑",
    aliases: ["플라스틱뚜껑", "컵뚜껑"],
    category: "plastic",
    method: "플라스틱 분리수거함에 배출",
    preparation: ["헹궈서 배출"],
    tips: [
      "페트병 뚜껑은 별도 분리하여 플라스틱으로 배출하세요",
    ],
    commonMistakes: [
      "컵에 붙인 채로 배출하는 경우",
    ],
    conditions: [],
    tags: ["뚜껑", "병뚜껑", "캡"],
  },
  {
    id: "toothbrush",
    name: "칫솔",
    aliases: ["전동칫솔헤드"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종량제 봉투에 배출"],
    tips: [
      "칫솔은 여러 재질이 혼합되어 재활용이 어렵습니다",
    ],
    commonMistakes: [
      "플라스틱이라 분리수거함에 넣는 경우",
    ],
    conditions: [],
    tags: ["칫솔", "양치", "전동칫솔"],
  },
  {
    id: "ballpoint-pen",
    name: "볼펜",
    aliases: ["펜", "필기구", "사인펜", "형광펜"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종량제 봉투에 배출"],
    tips: [
      "여러 재질이 혼합되어 있어 재활용이 어렵습니다",
    ],
    commonMistakes: [
      "플라스틱으로 분류하는 경우",
    ],
    conditions: [],
    tags: ["볼펜", "펜", "필기구", "사인펜", "형광펜"],
  },
  {
    id: "toy",
    name: "장난감",
    aliases: ["플라스틱장난감", "인형"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "건전지가 있으면 분리하여 전용 수거함에 배출",
      "종량제 봉투에 담아 배출",
    ],
    tips: [
      "상태가 좋으면 아름다운가게 등에 기부하세요",
      "이사 전 정리할 때 기부처를 먼저 확인하세요",
    ],
    commonMistakes: [
      "플라스틱이라 분리수거 가능하다고 생각하는 경우",
      "건전지를 분리하지 않고 배출",
    ],
    conditions: [
      {
        condition: "대형 장난감(규격 봉투에 안 들어가는 크기)",
        category: "large",
        method: "대형폐기물로 신고 후 배출",
      },
    ],
    tags: ["장난감", "완구", "인형", "블록", "레고"],
  },
  {
    id: "cd-dvd",
    name: "CD/DVD",
    aliases: ["시디", "디브이디", "블루레이"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["케이스와 CD를 분리", "케이스는 플라스틱으로 배출"],
    tips: [
      "CD 케이스(투명 플라스틱)는 재활용 가능합니다",
    ],
    commonMistakes: [
      "CD 자체를 플라스틱으로 분류하는 경우",
    ],
    conditions: [],
    tags: ["CD", "DVD", "시디", "디스크"],
  },
  {
    id: "hanger",
    name: "옷걸이",
    aliases: ["플라스틱옷걸이", "철옷걸이"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종량제 봉투에 담아 배출"],
    tips: [
      "세탁소 옷걸이는 세탁소에 반납하면 재사용됩니다",
      "철 옷걸이는 고철로 배출 가능합니다",
    ],
    commonMistakes: [
      "플라스틱이라 분리수거함에 넣는 경우",
    ],
    conditions: [
      {
        condition: "철(금속) 옷걸이인 경우",
        category: "can",
        method: "고철류 분리수거함에 배출",
      },
    ],
    tags: ["옷걸이", "행거", "세탁소옷걸이"],
  },

  // ─── 비닐 (5) ────────────────────────────────
  {
    id: "plastic-bag",
    name: "비닐봉지",
    aliases: ["비닐봉투", "마트봉지"],
    category: "vinyl",
    method: "비닐류 분리수거함에 배출",
    preparation: [
      "이물질 제거",
      "여러 개 모아서 하나에 담아 배출",
    ],
    tips: [
      "비닐봉지 안에 다른 비닐을 모아서 배출하면 편합니다",
    ],
    commonMistakes: [
      "이물질이 묻은 채 배출하는 경우",
    ],
    conditions: [
      {
        condition: "이물질 제거가 어려운 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["비닐봉지", "비닐봉투", "마트봉지", "검정봉투"],
  },
  {
    id: "snack-bag",
    name: "과자봉지",
    aliases: ["과자포장지", "라면봉지"],
    category: "vinyl",
    method: "비닐류 분리수거함에 배출",
    preparation: [
      "내용물 비우기",
      "부스러기 털어내기",
      "가볍게 헹구거나 닦기",
    ],
    tips: [
      "은박이 붙어있어도 비닐로 배출 가능합니다",
    ],
    commonMistakes: [
      "과자 부스러기를 털지 않고 배출",
    ],
    conditions: [],
    tags: ["과자봉지", "라면봉지", "포장지", "식품포장"],
  },
  {
    id: "bubble-wrap",
    name: "에어캡",
    aliases: ["뽁뽁이", "완충재", "버블랩"],
    category: "vinyl",
    method: "비닐류 분리수거함에 배출",
    preparation: [
      "테이프 등 이물질 제거",
      "모아서 배출",
    ],
    tips: [
      "이사할 때 깨지기 쉬운 물건 포장에 재사용하세요",
    ],
    commonMistakes: [
      "플라스틱으로 잘못 분류하는 경우",
    ],
    conditions: [],
    tags: ["에어캡", "뽁뽁이", "완충재", "버블랩", "포장재"],
  },
  {
    id: "zipper-bag",
    name: "지퍼백",
    aliases: ["지플백", "밀봉봉지"],
    category: "vinyl",
    method: "비닐류 분리수거함에 배출",
    preparation: [
      "내용물 비우고 헹구기",
      "물기 제거 후 배출",
    ],
    tips: [
      "깨끗한 지퍼백은 여러 번 재사용 가능합니다",
    ],
    commonMistakes: [
      "음식물이 묻은 채 배출하는 경우",
    ],
    conditions: [
      {
        condition: "세척이 어려울 정도로 오염된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["지퍼백", "지플백", "밀봉봉지"],
  },
  {
    id: "plastic-wrap",
    name: "랩",
    aliases: ["비닐랩", "식품랩"],
    category: "vinyl",
    method: "비닐류 분리수거함에 배출",
    preparation: [
      "음식물 이물질 제거",
      "모아서 배출",
    ],
    tips: [
      "깨끗한 랩만 비닐로 배출 가능합니다",
    ],
    commonMistakes: [
      "음식물이 묻은 랩을 비닐류로 배출",
    ],
    conditions: [
      {
        condition: "음식물이 묻어 세척이 어려운 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["랩", "비닐랩", "식품랩", "포장랩"],
  },

  // ─── 유리 (5) ────────────────────────────────
  {
    id: "glass-bottle",
    name: "유리병",
    aliases: ["소주병", "맥주병", "와인병", "음료병"],
    category: "glass",
    method: "유리병 분리수거함에 배출",
    preparation: [
      "내용물 비우고 헹구기",
      "뚜껑(금속/플라스틱) 분리",
      "색상별로 분리하면 좋음",
    ],
    tips: [
      "소주병·맥주병은 슈퍼에 반납하면 보증금을 돌려받을 수 있습니다",
    ],
    commonMistakes: [
      "뚜껑을 분리하지 않고 배출",
    ],
    conditions: [],
    tags: ["유리병", "소주병", "맥주병", "와인병", "음료병"],
  },
  {
    id: "broken-glass",
    name: "깨진 유리",
    aliases: ["유리조각", "깨진거울"],
    category: "general",
    method: "신문지 등으로 감싸서 종량제 봉투에 배출",
    preparation: [
      "신문지나 두꺼운 종이로 감싸기",
      "봉투에 '유리조각' 표시",
      "종량제 봉투에 담아 배출",
    ],
    tips: [
      "수거 작업자 안전을 위해 반드시 감싸고 표시해주세요",
    ],
    commonMistakes: [
      "유리 분리수거함에 넣는 경우 — 위험합니다",
      "감싸지 않고 봉투에 넣는 경우",
    ],
    conditions: [],
    tags: ["깨진유리", "유리조각", "파편"],
  },
  {
    id: "mirror",
    name: "거울",
    aliases: ["손거울", "전신거울"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "깨지지 않게 신문지 등으로 감싸기",
      "봉투에 '거울' 표시",
    ],
    tips: [
      "거울은 코팅 처리가 되어 있어 유리 재활용이 불가합니다",
    ],
    commonMistakes: [
      "유리 분리수거함에 넣는 경우",
    ],
    conditions: [
      {
        condition: "전신거울 등 대형인 경우",
        category: "large",
        method: "대형폐기물로 신고 후 배출",
      },
    ],
    tags: ["거울", "손거울", "전신거울", "화장거울"],
  },
  {
    id: "ceramic",
    name: "도자기",
    aliases: ["사기그릇", "도자기접시", "화분"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "깨지지 않게 감싸서 배출",
      "봉투에 '도자기' 표시",
    ],
    tips: [
      "도자기는 유리와 재질이 달라 유리 재활용이 불가합니다",
    ],
    commonMistakes: [
      "유리 분리수거함에 넣는 경우",
    ],
    conditions: [],
    tags: ["도자기", "사기그릇", "접시", "화분", "항아리"],
  },
  {
    id: "cosmetic-glass-bottle",
    name: "화장품 유리용기",
    aliases: ["향수병", "화장품병"],
    category: "glass",
    method: "유리병 분리수거함에 배출",
    preparation: [
      "내용물 비우기",
      "펌프·뚜껑 분리",
      "가능하면 헹구기",
    ],
    tips: [
      "펌프 부분은 여러 재질 혼합이라 일반쓰레기입니다",
    ],
    commonMistakes: [
      "펌프를 분리하지 않고 통째로 배출",
    ],
    conditions: [
      {
        condition: "플라스틱 재질 화장품 용기",
        category: "plastic",
        method: "헹궈서 플라스틱 분리수거함에 배출",
      },
    ],
    tags: ["화장품", "유리용기", "향수", "로션병"],
  },

  // ─── 캔/고철 (5) ─────────────────────────────
  {
    id: "aluminum-can",
    name: "알루미늄캔",
    aliases: ["음료캔", "맥주캔", "탄산캔"],
    category: "can",
    method: "캔류 분리수거함에 배출",
    preparation: [
      "내용물 비우고 헹구기",
      "가능하면 압축(찌그러뜨리기)",
    ],
    tips: [
      "캔을 찌그러뜨리면 부피가 줄어 수거가 효율적입니다",
    ],
    commonMistakes: [
      "내용물을 비우지 않고 배출",
    ],
    conditions: [],
    tags: ["알루미늄캔", "음료캔", "맥주캔", "콜라캔"],
  },
  {
    id: "butane-gas",
    name: "부탄가스",
    aliases: ["가스통", "부탄가스캔", "휴대용가스"],
    category: "can",
    method: "캔류 분리수거함에 배출",
    preparation: [
      "잔여 가스를 완전히 빼기 (통풍 좋은 곳에서)",
      "구멍을 뚫어 가스 배출 확인",
    ],
    tips: [
      "가스가 남아있으면 폭발 위험이 있으니 반드시 가스를 빼세요",
      "캠핑용 가스통도 동일하게 배출합니다",
    ],
    commonMistakes: [
      "가스를 빼지 않고 배출 — 화재·폭발 위험",
    ],
    conditions: [],
    tags: ["부탄가스", "가스통", "휴대용가스", "캠핑가스"],
  },
  {
    id: "pot",
    name: "냄비",
    aliases: ["스텐냄비", "압력밥솥"],
    category: "can",
    method: "고철류 분리수거함에 배출",
    preparation: [
      "내용물 비우고 세척",
      "손잡이 등 플라스틱 부분 분리 가능하면 분리",
    ],
    tips: [
      "스테인리스·알루미늄 냄비는 고철로 재활용됩니다",
    ],
    commonMistakes: [
      "대형폐기물로 잘못 분류하는 경우",
    ],
    conditions: [],
    tags: ["냄비", "솥", "압력밥솥", "스텐냄비"],
  },
  {
    id: "coated-pan",
    name: "코팅 프라이팬",
    aliases: ["후라이팬", "팬", "프라이팬"],
    category: "can",
    method: "고철류 분리수거함에 배출",
    preparation: [
      "기름기 제거 후 세척",
      "손잡이(플라스틱) 분리 가능하면 분리",
    ],
    tips: [
      "코팅이 벗겨져도 고철로 배출 가능합니다",
    ],
    commonMistakes: [
      "코팅이 있어서 일반쓰레기로 버리는 경우",
    ],
    conditions: [],
    tags: ["프라이팬", "후라이팬", "팬", "코팅팬"],
  },
  {
    id: "aluminum-foil",
    name: "알루미늄 호일",
    aliases: ["은박지", "쿠킹호일"],
    category: "can",
    method: "캔류 분리수거함에 배출",
    preparation: [
      "음식물 이물질 제거",
      "가볍게 헹구기",
      "뭉쳐서 배출",
    ],
    tips: [
      "깨끗한 호일만 재활용 가능합니다",
    ],
    commonMistakes: [
      "기름에 찌든 호일을 재활용으로 배출",
    ],
    conditions: [
      {
        condition: "음식물이 심하게 묻어 세척이 어려운 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["알루미늄호일", "은박지", "쿠킹호일", "포일"],
  },

  // ─── 스티로폼 (4) ──────────────────────────────
  {
    id: "delivery-styrofoam",
    name: "택배 스티로폼",
    aliases: ["스티로폼박스", "아이스박스"],
    category: "styrofoam",
    method: "스티로폼 분리수거함에 배출",
    preparation: [
      "테이프·스티커 제거",
      "이물질 세척",
      "부피가 크면 잘게 부숴서 배출",
    ],
    tips: [
      "깨끗한 흰색 스티로폼만 재활용됩니다",
    ],
    commonMistakes: [
      "테이프를 제거하지 않고 배출",
    ],
    conditions: [
      {
        condition: "색깔이 있는 스티로폼",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["택배스티로폼", "스티로폼박스", "아이스박스"],
  },
  {
    id: "cup-noodle-container",
    name: "컵라면 용기",
    aliases: ["컵라면통", "라면용기"],
    category: "styrofoam",
    method: "스티로폼 분리수거함에 배출",
    preparation: [
      "남은 국물과 건더기 비우기",
      "깨끗이 헹구기",
      "건조 후 배출",
    ],
    tips: [
      "세척이 어려우면 일반쓰레기로 배출하세요",
    ],
    commonMistakes: [
      "국물을 비우지 않고 배출",
      "종이 컵라면 용기를 스티로폼으로 착각",
    ],
    conditions: [
      {
        condition: "세척이 어렵거나 종이 재질인 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["컵라면", "라면용기", "컵라면통"],
  },
  {
    id: "fruit-tray",
    name: "과일 포장 트레이",
    aliases: ["과일포장", "과일트레이", "스티로폼트레이"],
    category: "styrofoam",
    method: "스티로폼 분리수거함에 배출",
    preparation: [
      "스티커·라벨 제거",
      "이물질 세척",
    ],
    tips: [
      "검은색 트레이는 재활용이 안 될 수 있습니다",
    ],
    commonMistakes: [
      "라벨을 떼지 않고 배출",
    ],
    conditions: [
      {
        condition: "색깔이 있는 트레이(PSP가 아닌 경우)",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["과일포장", "트레이", "스티로폼트레이"],
  },
  {
    id: "colored-styrofoam",
    name: "색깔 스티로폼",
    aliases: ["칼라스티로폼", "검정스티로폼"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["잘게 부숴서 종량제 봉투에 배출"],
    tips: [
      "흰색 스티로폼만 재활용되고, 색깔이 있으면 일반쓰레기입니다",
    ],
    commonMistakes: [
      "스티로폼이니까 재활용된다고 생각하는 경우",
    ],
    conditions: [],
    tags: ["색깔스티로폼", "칼라스티로폼", "검정스티로폼"],
  },

  // ─── 음식물 (10) ─────────────────────────────
  {
    id: "fruit-peel",
    name: "과일 껍질",
    aliases: ["사과껍질", "귤껍질", "바나나껍질"],
    category: "food_waste",
    method: "음식물쓰레기 전용 봉투/수거함에 배출",
    preparation: [
      "물기 제거",
      "음식물쓰레기 봉투에 담아 배출",
    ],
    tips: [
      "과일 껍질은 물기가 많으니 한번 짜서 배출하면 좋습니다",
    ],
    commonMistakes: [
      "코코넛·파인애플 등 딱딱한 껍질은 일반쓰레기입니다",
    ],
    conditions: [
      {
        condition: "코코넛, 파인애플 등 딱딱한 껍질",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["과일껍질", "사과껍질", "귤껍질", "바나나껍질"],
  },
  {
    id: "eggshell",
    name: "달걀 껍데기",
    aliases: ["계란껍데기", "메추리알껍데기"],
    category: "food_waste",
    method: "음식물쓰레기 전용 봉투/수거함에 배출",
    preparation: [
      "음식물쓰레기 봉투에 담아 배출",
    ],
    tips: [
      "달걀 껍데기는 음식물쓰레기로 분류됩니다(지자체마다 다를 수 있음)",
    ],
    commonMistakes: [
      "일반쓰레기로 버리는 경우 — 대부분 지자체에서 음식물로 분류",
    ],
    conditions: [
      {
        condition: "일부 지자체에서 일반쓰레기로 분류하는 경우",
        category: "general",
        method: "해당 지자체 규정에 따라 배출",
      },
    ],
    tags: ["달걀껍데기", "계란껍데기", "껍질"],
  },
  {
    id: "shellfish",
    name: "조개 껍데기",
    aliases: ["굴껍데기", "홍합껍데기", "꼬막껍데기", "게껍데기"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "물기 제거 후 종량제 봉투에 배출",
    ],
    tips: [
      "조개·굴·게 등 갑각류 껍데기는 음식물쓰레기가 아닙니다",
    ],
    commonMistakes: [
      "음식물쓰레기로 잘못 배출하는 경우가 많습니다",
    ],
    conditions: [],
    tags: ["조개껍데기", "굴껍데기", "게껍데기", "갑각류"],
  },
  {
    id: "bone",
    name: "뼈",
    aliases: ["닭뼈", "돼지뼈", "소뼈", "생선뼈"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "물기 제거 후 종량제 봉투에 배출",
    ],
    tips: [
      "크고 딱딱한 뼈는 음식물쓰레기가 아닙니다",
      "작은 생선가시는 음식물쓰레기로 가능한 지자체도 있습니다",
    ],
    commonMistakes: [
      "음식물쓰레기로 잘못 배출하는 경우",
    ],
    conditions: [
      {
        condition: "작은 생선가시 (일부 지자체)",
        category: "food_waste",
        method: "음식물쓰레기로 배출 가능 (지자체 확인)",
      },
    ],
    tags: ["뼈", "닭뼈", "돼지뼈", "소뼈", "생선가시"],
  },
  {
    id: "coffee-grounds",
    name: "커피 찌꺼기",
    aliases: ["커피가루", "커피박", "원두찌꺼기"],
    category: "food_waste",
    method: "음식물쓰레기 전용 봉투/수거함에 배출",
    preparation: [
      "물기 최대한 제거",
      "음식물쓰레기 봉투에 담아 배출",
    ],
    tips: [
      "말려서 탈취제·제습제로 재활용할 수 있습니다",
      "화분 비료로도 활용 가능합니다",
    ],
    commonMistakes: [
      "커피 필터(종이)와 함께 배출하는 경우",
    ],
    conditions: [],
    tags: ["커피찌꺼기", "커피가루", "커피박", "원두"],
  },
  {
    id: "onion-peel",
    name: "양파 껍질",
    aliases: ["마늘껍질", "옥수수껍질"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "종량제 봉투에 담아 배출",
    ],
    tips: [
      "양파·마늘의 바깥 딱딱한 껍질은 음식물쓰레기가 아닙니다",
      "안쪽 부드러운 부분은 음식물쓰레기 가능",
    ],
    commonMistakes: [
      "음식물쓰레기로 잘못 배출하는 경우가 많습니다",
    ],
    conditions: [],
    tags: ["양파껍질", "마늘껍질", "채소껍질"],
  },
  {
    id: "fruit-seed",
    name: "과일 씨",
    aliases: ["복숭아씨", "아보카도씨", "살구씨"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "종량제 봉투에 담아 배출",
    ],
    tips: [
      "딱딱하고 큰 씨앗은 음식물 처리기를 고장낼 수 있습니다",
    ],
    commonMistakes: [
      "음식물쓰레기로 잘못 배출하는 경우",
    ],
    conditions: [],
    tags: ["과일씨", "복숭아씨", "아보카도씨", "씨앗"],
  },
  {
    id: "green-onion-root",
    name: "파 뿌리",
    aliases: ["대파뿌리", "쪽파뿌리"],
    category: "food_waste",
    method: "음식물쓰레기 전용 봉투/수거함에 배출",
    preparation: [
      "흙 제거 후 음식물쓰레기 봉투에 배출",
    ],
    tips: [
      "파뿌리는 음식물쓰레기로 배출 가능합니다",
    ],
    commonMistakes: [
      "일반쓰레기로 버리는 경우",
    ],
    conditions: [],
    tags: ["파뿌리", "대파뿌리", "채소뿌리"],
  },
  {
    id: "tea-bag",
    name: "티백",
    aliases: ["녹차티백", "홍차티백"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "물기 짜기",
      "종량제 봉투에 배출",
    ],
    tips: [
      "티백 내용물(찻잎)만 분리하면 음식물쓰레기, 봉지는 일반쓰레기",
      "건조 후 탈취제로 활용 가능",
    ],
    commonMistakes: [
      "통째로 음식물쓰레기에 넣는 경우 — 봉지 부분은 분해 안 됨",
    ],
    conditions: [
      {
        condition: "내용물(찻잎)만 분리한 경우",
        category: "food_waste",
        method: "찻잎은 음식물쓰레기로 배출",
      },
    ],
    tags: ["티백", "녹차", "홍차", "차"],
  },
  {
    id: "leftover-food",
    name: "남은 음식",
    aliases: ["잔반", "먹다남은음식"],
    category: "food_waste",
    method: "음식물쓰레기 전용 봉투/수거함에 배출",
    preparation: [
      "물기 최대한 제거",
      "이쑤시개 등 이물질 제거",
      "음식물쓰레기 봉투에 담아 배출",
    ],
    tips: [
      "이사 전에 냉장고를 미리 비우고 음식물을 정리하세요",
    ],
    commonMistakes: [
      "비닐·이쑤시개 등 이물질을 함께 배출",
    ],
    conditions: [],
    tags: ["남은음식", "잔반", "음식물", "반찬"],
  },

  // ─── 일반쓰레기 (7) ──────────────────────────
  {
    id: "chicken-box",
    name: "치킨 박스",
    aliases: ["치킨상자", "배달치킨박스"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "남은 음식물 제거하여 음식물쓰레기로 배출",
      "기름 묻은 박스는 종량제 봉투에 배출",
    ],
    tips: [
      "기름이 배면 종이 재활용이 불가능합니다",
      "기름이 안 묻은 깨끗한 부분만 종이류로 배출 가능",
    ],
    commonMistakes: [
      "종이류로 잘못 배출하는 경우가 매우 많습니다",
    ],
    conditions: [
      {
        condition: "기름이 전혀 묻지 않은 깨끗한 부분",
        category: "paper",
        method: "종이류 분리수거함에 배출",
      },
    ],
    tags: ["치킨박스", "치킨상자", "배달", "기름박스"],
  },
  {
    id: "pizza-box",
    name: "피자 박스",
    aliases: ["피자상자"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "남은 음식물 제거",
      "기름 묻은 박스는 종량제 봉투에 배출",
    ],
    tips: [
      "치즈·기름이 묻지 않은 뚜껑 부분만 종이 재활용 가능",
    ],
    commonMistakes: [
      "종이류로 잘못 배출하는 경우",
    ],
    conditions: [
      {
        condition: "기름이 전혀 묻지 않은 뚜껑 부분",
        category: "paper",
        method: "종이류 분리수거함에 배출",
      },
    ],
    tags: ["피자박스", "피자상자", "배달"],
  },
  {
    id: "ice-pack-gel",
    name: "보냉팩",
    aliases: ["아이스팩(젤)", "젤아이스팩"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "내용물(젤)을 하수구에 버리지 않기",
      "통째로 종량제 봉투에 배출",
    ],
    tips: [
      "젤 내용물은 고흡수성 폴리머로 하수구를 막힙니다",
      "물 타입 아이스팩은 물을 버리고 비닐만 비닐류로 배출",
    ],
    commonMistakes: [
      "젤을 하수구에 버리는 경우 — 막힘 원인",
      "비닐류로 잘못 배출하는 경우",
    ],
    conditions: [
      {
        condition: "물 타입 아이스팩",
        category: "vinyl",
        method: "물은 버리고 비닐만 비닐류로 배출",
      },
    ],
    tags: ["보냉팩", "아이스팩", "젤팩", "냉동팩"],
  },
  {
    id: "rubber-gloves",
    name: "고무장갑",
    aliases: ["라텍스장갑", "일회용장갑"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종량제 봉투에 담아 배출"],
    tips: [
      "고무 재질은 재활용이 되지 않습니다",
    ],
    commonMistakes: [
      "비닐류나 플라스틱으로 분류하는 경우",
    ],
    conditions: [],
    tags: ["고무장갑", "라텍스장갑", "일회용장갑", "청소"],
  },
  {
    id: "umbrella",
    name: "우산",
    aliases: ["장우산", "접이식우산"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "가능하면 천(비닐)과 살대(금속) 분리",
      "살대는 고철류로, 천은 종량제 봉투로",
    ],
    tips: [
      "분리가 어려우면 통째로 종량제 봉투에 배출하세요",
    ],
    commonMistakes: [
      "분리하지 않고 분리수거함에 넣는 경우",
    ],
    conditions: [
      {
        condition: "살대(금속)를 분리한 경우",
        category: "can",
        method: "고철류 분리수거함에 배출",
      },
    ],
    tags: ["우산", "장우산", "접이식우산"],
  },
  {
    id: "mask",
    name: "마스크",
    aliases: ["일회용마스크", "KF94", "KF80", "덴탈마스크"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "끈을 잘라서 배출 (야생동물 보호)",
      "밀봉하여 배출",
    ],
    tips: [
      "마스크 끈이 야생동물에게 감길 수 있으니 잘라주세요",
    ],
    commonMistakes: [
      "비닐류로 잘못 분류하는 경우",
    ],
    conditions: [],
    tags: ["마스크", "KF94", "일회용마스크", "덴탈마스크"],
  },
  {
    id: "shipping-label",
    name: "택배 송장",
    aliases: ["운송장", "택배스티커"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "개인정보 부분 파쇄 또는 유성펜으로 지우기",
      "종량제 봉투에 배출",
    ],
    tips: [
      "송장은 감열지+비닐 재질이라 재활용이 불가합니다",
      "택배박스에서 송장을 반드시 떼어내세요",
    ],
    commonMistakes: [
      "택배박스에 붙인 채 종이류로 배출",
    ],
    conditions: [],
    tags: ["택배송장", "운송장", "스티커", "개인정보"],
  },

  // ─── 대형폐기물 (4) ──────────────────────────
  {
    id: "furniture",
    name: "가구",
    aliases: ["책상", "의자", "옷장", "서랍장", "침대프레임"],
    category: "large",
    method: "지자체 대형폐기물 신고 후 스티커 부착하여 배출",
    preparation: [
      "지자체 홈페이지 또는 앱에서 대형폐기물 배출 신고",
      "수수료 납부 후 스티커 수령",
      "스티커를 부착하고 지정 장소에 배출",
    ],
    tips: [
      "이사 시 여러 개를 한 번에 신고하면 편합니다",
      "상태가 좋으면 중고거래 또는 기부를 고려하세요",
    ],
    commonMistakes: [
      "신고 없이 도로에 방치하면 과태료 부과",
    ],
    conditions: [],
    tags: ["가구", "책상", "의자", "옷장", "서랍장", "이사"],
  },
  {
    id: "appliance",
    name: "가전제품",
    aliases: ["냉장고", "세탁기", "에어컨", "TV"],
    category: "large",
    method: "대형가전은 무상수거 서비스(1599-0903) 이용",
    preparation: [
      "한국전자제품자원순환공제조합(1599-0903)에 무상 수거 신청",
      "또는 새 제품 구매 시 판매업체에 역회수 요청",
    ],
    tips: [
      "냉장고·세탁기·에어컨·TV는 무상 방문수거됩니다",
      "이사할 때 미리 수거 예약하세요",
    ],
    commonMistakes: [
      "대형폐기물 스티커를 구매하는 경우 — 대형가전은 무상수거",
    ],
    conditions: [],
    tags: ["가전", "냉장고", "세탁기", "에어컨", "TV", "이사"],
  },
  {
    id: "mattress",
    name: "매트리스",
    aliases: ["침대매트리스", "토퍼", "스프링매트리스"],
    category: "large",
    method: "지자체 대형폐기물 신고 후 스티커 부착하여 배출",
    preparation: [
      "지자체 대형폐기물 배출 신고",
      "수수료 납부 후 스티커 수령",
      "스티커 부착 후 지정 장소에 배출",
    ],
    tips: [
      "크기에 따라 수수료가 다릅니다",
      "이사업체에 처리를 맡길 수도 있습니다",
    ],
    commonMistakes: [
      "신고 없이 배출하면 과태료 부과",
    ],
    conditions: [],
    tags: ["매트리스", "침대", "토퍼", "이사"],
  },
  {
    id: "bicycle",
    name: "자전거",
    aliases: ["전동킥보드", "킥보드"],
    category: "large",
    method: "지자체 대형폐기물 신고 후 스티커 부착하여 배출",
    preparation: [
      "지자체 대형폐기물 배출 신고",
      "수수료 납부 후 스티커 부착",
    ],
    tips: [
      "상태가 좋으면 중고거래를 고려하세요",
    ],
    commonMistakes: [
      "고철로 분류하여 무단 배출하는 경우",
    ],
    conditions: [],
    tags: ["자전거", "킥보드", "전동킥보드", "이사"],
  },

  // ─── 전자폐기물 (4) ──────────────────────────
  {
    id: "mobile-phone",
    name: "핸드폰",
    aliases: ["스마트폰", "휴대폰", "갤럭시", "아이폰"],
    category: "electronic",
    method: "소형가전 수거함 또는 통신사 대리점에 반납",
    preparation: [
      "개인정보 초기화",
      "유심·SD카드 제거",
      "소형가전 수거함에 배출",
    ],
    tips: [
      "통신사 대리점에 가져가면 수거해줍니다",
      "보상판매 프로그램을 확인해보세요",
    ],
    commonMistakes: [
      "일반쓰레기로 배출 — 배터리 화재 위험",
      "개인정보를 초기화하지 않고 배출",
    ],
    conditions: [],
    tags: ["핸드폰", "스마트폰", "휴대폰", "전자기기"],
  },
  {
    id: "laptop",
    name: "노트북",
    aliases: ["랩탑", "넷북"],
    category: "electronic",
    method: "소형가전 수거함 또는 대형가전 무상수거 서비스 이용",
    preparation: [
      "개인정보·데이터 삭제",
      "배터리 분리 가능하면 분리",
      "소형가전 수거함에 배출",
    ],
    tips: [
      "대형가전 무상수거(1599-0903)도 이용 가능합니다",
    ],
    commonMistakes: [
      "데이터를 삭제하지 않고 배출",
    ],
    conditions: [],
    tags: ["노트북", "랩탑", "컴퓨터", "전자기기"],
  },
  {
    id: "earphones",
    name: "이어폰",
    aliases: ["이어팟", "에어팟", "헤드셋", "헤드폰"],
    category: "electronic",
    method: "소형가전 수거함에 배출",
    preparation: [
      "소형가전 수거함에 배출",
    ],
    tips: [
      "동주민센터나 아파트 소형가전 수거함을 이용하세요",
    ],
    commonMistakes: [
      "일반쓰레기로 배출",
    ],
    conditions: [],
    tags: ["이어폰", "에어팟", "헤드폰", "헤드셋"],
  },
  {
    id: "led-bulb",
    name: "LED 전구",
    aliases: ["LED램프", "형광등", "백열전구"],
    category: "electronic",
    method: "전용 수거함에 배출",
    preparation: [
      "깨지지 않게 보호하여 전용 수거함에 배출",
    ],
    tips: [
      "아파트·주민센터에 폐형광등 수거함이 있습니다",
      "깨진 형광등은 종량제 봉투에 따로 감싸서 배출",
    ],
    commonMistakes: [
      "일반쓰레기로 배출 — 수은 등 유해물질 포함",
    ],
    conditions: [
      {
        condition: "깨진 전구/형광등",
        category: "general",
        method: "신문지로 감싸서 종량제 봉투에 배출 (유해물질 주의)",
      },
    ],
    tags: ["LED", "전구", "형광등", "램프", "백열전구"],
  },

  // ─── 의류 (4) ────────────────────────────────
  {
    id: "used-clothes",
    name: "헌 옷",
    aliases: ["중고의류", "안입는옷"],
    category: "clothing",
    method: "의류수거함에 배출",
    preparation: [
      "세탁 후 마른 상태로 배출",
      "투명 봉투에 담아서 배출",
    ],
    tips: [
      "상태가 좋으면 중고거래나 기부를 고려하세요",
      "비 오는 날은 피해서 배출하세요",
    ],
    commonMistakes: [
      "젖은 옷을 배출하면 곰팡이가 생깁니다",
    ],
    conditions: [
      {
        condition: "심하게 오염·훼손된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["헌옷", "중고의류", "의류", "옷", "이사"],
  },
  {
    id: "underwear",
    name: "속옷",
    aliases: ["양말", "내의", "스타킹"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "종량제 봉투에 담아 배출",
    ],
    tips: [
      "속옷·양말은 위생상 의류수거함에 넣지 않습니다",
    ],
    commonMistakes: [
      "의류수거함에 넣는 경우",
    ],
    conditions: [],
    tags: ["속옷", "양말", "내의", "스타킹"],
  },
  {
    id: "bedding",
    name: "이불",
    aliases: ["베개", "담요", "이불솜"],
    category: "clothing",
    method: "의류수거함에 배출",
    preparation: [
      "세탁 후 건조 상태로 배출",
      "큰 봉투에 담아서 배출",
    ],
    tips: [
      "의류수거함에 넣기 어려운 크기면 대형폐기물로 신고",
    ],
    commonMistakes: [
      "젖거나 오염된 상태로 배출",
    ],
    conditions: [
      {
        condition: "의류수거함에 들어가지 않는 대형",
        category: "large",
        method: "대형폐기물로 신고 후 배출",
      },
      {
        condition: "심하게 오염·훼손된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["이불", "베개", "담요", "침구", "이사"],
  },
  {
    id: "shoes",
    name: "신발",
    aliases: ["운동화", "구두", "슬리퍼"],
    category: "clothing",
    method: "의류수거함에 배출",
    preparation: [
      "짝을 맞춰서 묶어 배출",
      "봉투에 담아 배출",
    ],
    tips: [
      "상태가 좋으면 기부를 고려하세요",
    ],
    commonMistakes: [
      "짝이 안 맞게 배출하는 경우",
    ],
    conditions: [
      {
        condition: "심하게 훼손된 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["신발", "운동화", "구두", "슬리퍼"],
  },

  // ─── 기타 (6) ────────────────────────────────
  {
    id: "spray-can",
    name: "스프레이캔",
    aliases: ["헤어스프레이", "살충제캔", "탈취제캔"],
    category: "can",
    method: "캔류 분리수거함에 배출",
    preparation: [
      "통풍 좋은 곳에서 잔여 내용물 완전히 비우기",
      "가스 배출 후 구멍 뚫기",
    ],
    tips: [
      "실내에서 가스를 배출하면 위험합니다",
      "완전히 비운 후 배출하세요",
    ],
    commonMistakes: [
      "내용물을 비우지 않고 배출 — 폭발 위험",
    ],
    conditions: [],
    tags: ["스프레이", "스프레이캔", "탈취제", "헤어스프레이", "살충제"],
  },
  {
    id: "medicine",
    name: "약",
    aliases: ["유통기한지난약", "폐의약품", "물약", "알약"],
    category: "hazardous",
    method: "약국 또는 주민센터 폐의약품 수거함에 배출",
    preparation: [
      "포장 그대로 폐의약품 수거함에 배출",
      "물약은 별도 용기에 담아 배출",
    ],
    tips: [
      "이사 전에 약 정리하고, 가까운 약국 수거함에 넣으세요",
      "절대 변기나 하수구에 버리지 마세요",
    ],
    commonMistakes: [
      "일반쓰레기로 배출하거나 변기에 버리는 경우",
    ],
    conditions: [],
    tags: ["약", "폐의약품", "알약", "물약", "유통기한"],
  },
  {
    id: "cooking-oil",
    name: "식용유",
    aliases: ["폐식용유", "튀김기름"],
    category: "general",
    method: "폐식용유 전용 수거함 또는 종량제 봉투에 배출",
    preparation: [
      "신문지·키친타올에 흡수시켜 종량제 봉투에 배출",
      "또는 폐식용유 전용 수거함 이용",
    ],
    tips: [
      "폐식용유 수거함이 주민센터에 있는 경우가 있습니다",
      "하수구에 절대 버리지 마세요",
    ],
    commonMistakes: [
      "하수구에 버리는 경우 — 수질오염 및 배관 막힘",
    ],
    conditions: [],
    tags: ["식용유", "폐식용유", "기름", "튀김기름"],
  },
  {
    id: "cosmetic-container",
    name: "화장품 용기",
    aliases: ["로션통", "스킨통", "화장품통"],
    category: "plastic",
    method: "헹궈서 플라스틱 분리수거함에 배출",
    preparation: [
      "내용물 비우기",
      "펌프·뚜껑 분리",
      "헹궈서 배출",
    ],
    tips: [
      "내용물이 남았으면 화장지로 닦아내세요",
      "재질에 따라 분리: 유리 → 유리, 플라스틱 → 플라스틱",
    ],
    commonMistakes: [
      "펌프를 분리하지 않고 통째로 배출",
      "내용물이 남은 채 배출",
    ],
    conditions: [
      {
        condition: "유리 재질인 경우",
        category: "glass",
        method: "유리병 분리수거함에 배출",
      },
      {
        condition: "내용물 제거가 어려운 경우",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["화장품", "로션", "스킨", "화장품용기"],
  },
  {
    id: "ice-pack-water",
    name: "아이스팩 (물)",
    aliases: ["물아이스팩", "워터아이스팩"],
    category: "vinyl",
    method: "물을 버리고 비닐만 비닐류로 배출",
    preparation: [
      "가위로 잘라서 물 버리기",
      "비닐 부분은 비닐류로 배출",
    ],
    tips: [
      "물 타입 아이스팩만 물을 버릴 수 있습니다",
      "젤 타입과 혼동하지 마세요",
    ],
    commonMistakes: [
      "젤 타입과 혼동하여 하수구에 젤을 버리는 경우",
    ],
    conditions: [
      {
        condition: "젤 타입 아이스팩",
        category: "general",
        method: "통째로 종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["아이스팩", "물아이스팩", "냉동팩"],
  },
  {
    id: "paper-tape",
    name: "종이테이프",
    aliases: ["크라프트테이프", "마스킹테이프"],
    category: "paper",
    method: "종이류 분리수거함에 배출",
    preparation: [
      "종이류와 함께 배출",
    ],
    tips: [
      "종이테이프는 재활용 가능한 테이프입니다",
      "택배 포장 시 종이테이프를 사용하면 분리수거가 편해집니다",
    ],
    commonMistakes: [
      "일반 비닐테이프와 혼동하여 일반쓰레기로 버리는 경우",
    ],
    conditions: [
      {
        condition: "비닐(OPP) 테이프",
        category: "general",
        method: "종량제 봉투에 담아 일반쓰레기로 배출",
      },
    ],
    tags: ["종이테이프", "크라프트테이프", "마스킹테이프", "테이프"],
  },
  {
    id: "battery",
    name: "건전지",
    aliases: ["알카라인건전지", "충전지", "리튬전지", "AA건전지"],
    category: "hazardous",
    method: "전용 수거함에 배출",
    preparation: [
      "단자 부분에 테이프를 붙여 합선 방지",
      "아파트·주민센터 폐건전지 수거함에 배출",
    ],
    tips: [
      "폐건전지 수거함은 아파트 관리사무소나 주민센터에 있습니다",
      "건전지를 모아두었다가 한 번에 배출하세요",
    ],
    commonMistakes: [
      "일반쓰레기로 배출 — 중금속 오염 위험",
      "여러 건전지를 단자끼리 맞닿게 보관 — 합선 위험",
    ],
    conditions: [],
    tags: ["건전지", "배터리", "AA", "AAA", "리튬전지", "충전지"],
  },
  {
    id: "paint",
    name: "페인트",
    aliases: ["락카", "페인트통", "스프레이페인트"],
    category: "hazardous",
    method: "전용 수거함 또는 지자체 수거 서비스 이용",
    preparation: [
      "굳히거나 신문지에 흡수시켜서 배출",
      "빈 페인트통은 고철로 배출 가능",
    ],
    tips: [
      "남은 페인트는 하수구에 절대 버리지 마세요",
      "소량이면 신문지에 흡수시킨 후 말려서 종량제 봉투에 배출",
    ],
    commonMistakes: [
      "하수구에 버리는 경우 — 수질오염",
    ],
    conditions: [
      {
        condition: "완전히 비워진 금속 페인트통",
        category: "can",
        method: "고철류 분리수거함에 배출",
      },
    ],
    tags: ["페인트", "락카", "도료", "페인트통"],
  },
  {
    id: "knife-scissors",
    name: "칼/가위",
    aliases: ["커터칼", "부엌칼", "가위"],
    category: "can",
    method: "날 부분을 감싸서 고철류 분리수거함에 배출",
    preparation: [
      "날카로운 부분을 신문지나 테이프로 감싸기",
      "고철류 수거함에 배출",
    ],
    tips: [
      "수거 작업자 안전을 위해 반드시 날을 감싸주세요",
    ],
    commonMistakes: [
      "감싸지 않고 배출하여 작업자 부상 위험",
    ],
    conditions: [],
    tags: ["칼", "가위", "커터칼", "부엌칼", "고철"],
  },
  {
    id: "wet-wipe",
    name: "물티슈",
    aliases: ["웻티슈", "아기물티슈"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: ["종량제 봉투에 담아 배출"],
    tips: [
      "물티슈는 합성섬유(폴리에스터)로 만들어져 재활용 불가합니다",
      "화장실 변기에 버리면 막힙니다",
    ],
    commonMistakes: [
      "화장실 변기에 버리는 경우 — 배관 막힘 원인",
      "비닐류로 분류하는 경우",
    ],
    conditions: [],
    tags: ["물티슈", "웻티슈", "청소", "위생"],
  },
  {
    id: "disposable-cutlery",
    name: "일회용 수저",
    aliases: ["나무젓가락", "플라스틱수저", "포크"],
    category: "general",
    method: "종량제 봉투에 담아 일반쓰레기로 배출",
    preparation: [
      "음식물 닦아내기",
      "종량제 봉투에 배출",
    ],
    tips: [
      "나무젓가락은 코팅 처리가 되어있어 종이 재활용 불가",
    ],
    commonMistakes: [
      "나무젓가락을 종이류로 배출하는 경우",
      "플라스틱 수저를 플라스틱 분리수거함에 넣는 경우",
    ],
    conditions: [],
    tags: ["일회용수저", "나무젓가락", "포크", "배달", "일회용"],
  },
  {
    id: "fluorescent-lamp",
    name: "형광등",
    aliases: ["형광램프", "직관형광등"],
    category: "hazardous",
    method: "폐형광등 전용 수거함에 배출",
    preparation: [
      "깨지지 않게 조심해서 전용 수거함에 배출",
    ],
    tips: [
      "아파트·주민센터에 폐형광등 수거함이 있습니다",
      "형광등에는 수은이 포함되어 있어 깨지면 위험합니다",
    ],
    commonMistakes: [
      "일반쓰레기로 배출 — 수은 유출 위험",
      "깨진 형광등을 유리로 분류하는 경우",
    ],
    conditions: [
      {
        condition: "깨진 형광등",
        category: "general",
        method: "신문지로 감싸서 종량제 봉투에 배출 (수은 주의)",
      },
    ],
    tags: ["형광등", "형광램프", "전구", "수은"],
  },
];

// ── 유틸리티 함수 ──────────────────────────────

/**
 * 전체 분리수거 항목을 반환합니다.
 */
export function getAllRecycleItems(): RecycleItem[] {
  return RECYCLE_ITEMS;
}

/**
 * ID로 분리수거 항목을 조회합니다.
 */
export function getRecycleItemById(id: string): RecycleItem | undefined {
  return RECYCLE_ITEMS.find((item) => item.id === id);
}

/**
 * 검색어로 분리수거 항목을 검색합니다.
 * name, aliases, tags를 모두 검색합니다.
 */
export function searchRecycleItems(query: string): RecycleItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return RECYCLE_ITEMS.filter((item) => {
    if (item.name.toLowerCase().includes(q)) return true;
    if (item.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    if (item.tags.some((t) => t.toLowerCase().includes(q))) return true;
    return false;
  });
}

/**
 * 카테고리별 분리수거 항목을 반환합니다.
 */
export function getRecycleItemsByCategory(
  category: RecycleCategory,
): RecycleItem[] {
  return RECYCLE_ITEMS.filter((item) => item.category === category);
}

/**
 * 조건에 따라 분류가 달라지는 (헷갈리는) 항목을 반환합니다.
 */
export function getConfusingItems(): RecycleItem[] {
  return RECYCLE_ITEMS.filter((item) => item.conditions.length > 0);
}

/**
 * 전체 카테고리 정보를 반환합니다.
 */
export function getAllCategories(): CategoryInfo[] {
  return CATEGORIES;
}
