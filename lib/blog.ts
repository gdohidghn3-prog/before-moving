// ============================================================
// 블로그 연결 설정
// 블로그 URL과 추천 글 목록을 여기서 관리합니다.
// ============================================================

export const BLOG_CONFIG = {
  // 블로그 메인 URL (네이버 블로그, 티스토리 등)
  url: "", // 예: "https://blog.naver.com/your-id"
  name: "오니오니 블로그",
  description: "이사·생활 꿀팁 모음",
};

// 블로그 추천 글 (수동 관리 — 새 글 쓸 때마다 여기 추가)
export interface BlogPost {
  title: string;
  url: string;
  description: string;
  category: "이사" | "동네" | "분리수거" | "생활" | "부동산";
}

export const BLOG_POSTS: BlogPost[] = [
  // ── 아래 예시를 실제 블로그 글로 교체하세요 ──
  // {
  //   title: "이사 전 꼭 해야 할 10가지",
  //   url: "https://blog.naver.com/your-id/1234",
  //   description: "전입신고부터 인터넷 이전까지 빠짐없이 정리",
  //   category: "이사",
  // },
];

// 카테고리별 필터
export function getBlogPostsByCategory(category: BlogPost["category"]): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}

// 최신 N개
export function getRecentBlogPosts(count: number = 3): BlogPost[] {
  return BLOG_POSTS.slice(0, count);
}
