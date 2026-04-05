// ============================================================
// 네이버 검색 API — 일일 25,000건 제한 포함
// Vercel 서버리스 호환 (메모리 캐시)
// ============================================================

const CLIENT_ID = process.env.NAVER_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET ?? "";

const DAILY_LIMIT = 25000;

// ─── 일일 호출 카운터 (메모리) ─────��─────────────────────────

let counterDate = "";
let counterCount = 0;

function incrementCounter(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  if (counterDate !== today) {
    counterDate = today;
    counterCount = 0;
  }
  if (counterCount >= DAILY_LIMIT) return false;
  counterCount += 1;
  return true;
}

export function getRemainingCalls(): number {
  const today = new Date().toISOString().slice(0, 10);
  if (counterDate !== today) return DAILY_LIMIT;
  return Math.max(0, DAILY_LIMIT - counterCount);
}

// ��── 네이버 지역 검색 API ────────────────────���───────────────

export interface NaverLocalItem {
  title: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
  link: string;
}

interface NaverLocalResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverLocalItem[];
}

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

export async function searchLocal(
  query: string,
  display: number = 5,
  sort: "random" | "comment" = "comment",
  start: number = 1,
): Promise<NaverLocalItem[]> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.warn("[naver-api] API 키 미설정");
    return [];
  }

  if (!incrementCounter()) {
    console.warn(`[naver-api] 일일 한도 ${DAILY_LIMIT}건 초과`);
    return [];
  }

  try {
    const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`;

    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      console.error(`[naver-api] HTTP ${res.status}`);
      return [];
    }

    const data: NaverLocalResponse = await res.json();

    return data.items.map((item) => ({
      ...item,
      title: stripHtml(item.title),
    }));
  } catch (err) {
    console.error("[naver-api] ���청 실패:", err);
    return [];
  }
}
