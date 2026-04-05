import { NextRequest, NextResponse } from "next/server";
import {
  searchLocal,
  getRemainingCalls,
  type NaverLocalItem,
} from "@/lib/naver-api";

// ─── 메모리 캐시 (Vercel 서버리스 호환) ─────────────────────

const cache = new Map<string, { data: NaverLocalItem[]; ts: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7일

function getCacheKey(neighborhoodId: string, category: string): string {
  return `${neighborhoodId}_${category}`;
}

function getCache(neighborhoodId: string, category: string): NaverLocalItem[] | null {
  const entry = cache.get(getCacheKey(neighborhoodId, category));
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) {
    cache.delete(getCacheKey(neighborhoodId, category));
    return null;
  }
  return entry.data;
}

function setCache(neighborhoodId: string, category: string, data: NaverLocalItem[]) {
  cache.set(getCacheKey(neighborhoodId, category), { data, ts: Date.now() });
}

// ─── 카테고리별 검색 설정 ────────────────────────────────────

interface CategoryConfig {
  searches: { keyword: string; display: number }[];
  allowedCategories: string[];
  sort?: "random" | "comment";
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  restaurant: {
    searches: [
      { keyword: "맛집", display: 5 },
      { keyword: "음식점", display: 5 },
      { keyword: "식당", display: 5 },
      { keyword: "한식", display: 5 },
      { keyword: "고기집", display: 5 },
    ],
    allowedCategories: ["음식점", "한식", "중식", "일식", "양식", "분식", "치킨", "피자", "고기", "해물", "국수", "냉면", "돈가스", "찌개", "백반", "곱창", "족발", "쌈밥", "김밥", "비빔밥", "뷔페", "아시아음식", "패밀리레스토랑", "중국요리", "인도음식", "태국음식", "멕시칸", "샐러드", "샌드위치", "햄버거", "라멘"],
  },
  cafe: {
    searches: [
      { keyword: "카페", display: 5 },
      { keyword: "디저트 카페", display: 5 },
      { keyword: "베이커리", display: 5 },
    ],
    allowedCategories: ["카페", "디저트", "베이커리", "커피", "케이크", "아이스크림", "제과", "찻집", "도넛"],
  },
  hospital: {
    searches: [
      { keyword: "내과 의원", display: 5 },
      { keyword: "치과 의원", display: 5 },
      { keyword: "소아과", display: 5 },
      { keyword: "정형외과", display: 3 },
      { keyword: "이비인후과", display: 3 },
      { keyword: "약국", display: 5 },
    ],
    allowedCategories: ["병원", "의원", "내과", "치과", "소아과", "소아청소년과", "정형외과", "이비인후과", "피부과", "안과", "산부인과", "한의원", "약국", "의료"],
  },
  school: {
    searches: [
      { keyword: "초등학교", display: 5 },
      { keyword: "중학교", display: 5 },
      { keyword: "고등학교", display: 5 },
    ],
    allowedCategories: [">초등학교", ">중학교", ">고등학교", ">대학교", "교육,학문>학교"],
    sort: "random",
  },
  park: {
    searches: [
      { keyword: "공원", display: 5 },
      { keyword: "산책로", display: 5 },
      { keyword: "근린공원", display: 3 },
      { keyword: "한강공원", display: 3 },
    ],
    allowedCategories: ["공원", "산책", "도시공원", "근린공원", "어린이공원", "한강", "수목원", "식물원", "생태공원", "체육공원", "자연", "휴양"],
    sort: "random",
  },
  academy: {
    searches: [
      { keyword: "학원", display: 5 },
      { keyword: "입시학원", display: 5 },
      { keyword: "영어학원", display: 5 },
      { keyword: "수학학원", display: 5 },
      { keyword: "보습학원", display: 3 },
    ],
    allowedCategories: ["학원", "교습", "입시", "보습", "영어", "수학", "과학", "국어", "논술", "코딩", "피아노", "미술", "태권도", "음악", "체육", "교육"],
  },
};

// ─── 카테고리 필터링 ─────────────────────────────────────────

function filterByCategory(items: NaverLocalItem[], allowed: string[]): NaverLocalItem[] {
  return items.filter((item) =>
    allowed.some((keyword) => item.category.includes(keyword)),
  );
}

// ─── 중복 제거 (이름+주소 기반) ──────────────────────────────

function deduplicateItems(items: NaverLocalItem[]): NaverLocalItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.title}_${item.roadAddress || item.address}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── 동의어 매핑 ─────────────────────────────────────────────

const SYNONYMS: Record<string, string[]> = {
  "소아과": ["소아청소년과", "소아과", "키즈의원", "아이병원"],
  "파스타": ["파스타", "양식", "이탈리안", "스파게티"],
  "피자": ["피자", "이탈리안"],
  "중국집": ["중식", "중국요리", "짜장", "짬뽕"],
  "이비인후과": ["이비인후과", "귀코목"],
  "헬스": ["헬스", "피트니스", "gym", "운동"],
  "필라테스": ["필라테스", "요가", "yoga"],
};

// ─── API 핸들러 ──────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const neighborhoodId = searchParams.get("id");
  const district = searchParams.get("district");
  const name = searchParams.get("name");
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  if (!district || !name) {
    return NextResponse.json(
      { error: "district, name 파라미터 필요" },
      { status: 400 },
    );
  }

  // ── 자유 검색 모드 ──
  if (q && q.trim()) {
    const rawWords = q.trim().split(/\s+/);
    const searchWords: string[] = [];
    for (const word of rawWords) {
      searchWords.push(word);
      const syn = SYNONYMS[word];
      if (syn) searchWords.push(...syn);
    }
    const allItems: NaverLocalItem[] = [];

    const suffixes = ["", "맛집", "카페", "학원", "병원", "음식점"];
    const baseQueries = [
      `${name} ${q.trim()}`,
      `${district} ${q.trim()}`,
    ];

    const promises: Promise<NaverLocalItem[]>[] = [];
    for (const base of baseQueries) {
      for (const suffix of suffixes) {
        const query = suffix ? `${base} ${suffix}` : base;
        promises.push(searchLocal(query, 5, "comment"));
        promises.push(searchLocal(query, 5, "random"));
      }
    }
    const results = await Promise.all(promises);
    for (const items of results) {
      allItems.push(...items);
    }

    const unique = deduplicateItems(allItems);

    const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").toLowerCase();
    const filtered = unique.filter((item) =>
      searchWords.some((word) => {
        const w = word.toLowerCase();
        return (
          stripHtml(item.title).includes(w) ||
          stripHtml(item.category).includes(w) ||
          stripHtml(item.description || "").includes(w)
        );
      }),
    );

    return NextResponse.json({
      items: filtered,
      source: "search",
      remaining: getRemainingCalls(),
    });
  }

  // ── 카테고리 모드 ──
  if (!neighborhoodId || !category) {
    return NextResponse.json(
      { error: "category 또는 q 파라미터 필요" },
      { status: 400 },
    );
  }

  const config = CATEGORY_CONFIG[category];
  if (!config) {
    return NextResponse.json(
      { error: "유효하지 않은 category" },
      { status: 400 },
    );
  }

  const cached = getCache(neighborhoodId, category);
  if (cached) {
    return NextResponse.json({
      items: cached,
      source: "cache",
      remaining: getRemainingCalls(),
    });
  }

  const allItems: NaverLocalItem[] = [];
  const sort = config.sort ?? "comment";
  for (const search of config.searches) {
    const query = `${district} ${name} ${search.keyword}`;
    const items = await searchLocal(query, search.display, sort);
    allItems.push(...items);
  }

  const filtered = filterByCategory(allItems, config.allowedCategories);
  const uniqueItems = deduplicateItems(filtered);

  if (uniqueItems.length > 0) {
    setCache(neighborhoodId, category, uniqueItems);
  }

  return NextResponse.json({
    items: uniqueItems,
    source: "api",
    remaining: getRemainingCalls(),
  });
}
