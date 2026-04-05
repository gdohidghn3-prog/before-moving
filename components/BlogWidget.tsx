"use client";

import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { BLOG_CONFIG, BLOG_POSTS, type BlogPost } from "@/lib/blog";

interface BlogWidgetProps {
  category?: BlogPost["category"];
  maxPosts?: number;
}

export default function BlogWidget({
  category,
  maxPosts = 3,
}: BlogWidgetProps) {
  const posts = category
    ? BLOG_POSTS.filter((p) => p.category === category).slice(0, maxPosts)
    : BLOG_POSTS.slice(0, maxPosts);

  // 블로그 URL이 없거나 글이 없으면 렌더링하지 않음
  if (!BLOG_CONFIG.url && posts.length === 0) return null;

  return (
    <section className="mt-8 mb-8">
      <div className="bg-gradient-to-br from-[#F8FAFC] to-[#EEF2FF] border border-[#E2E8F0] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={16} className="text-[#6366F1]" />
          <h3 className="text-sm font-semibold text-[#0F172A]">
            {BLOG_CONFIG.name}
          </h3>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-2 mb-3">
            {posts.map((post, i) => (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 p-2.5 bg-white rounded-lg hover:shadow-sm transition-shadow group"
              >
                <span
                  className="text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5"
                  style={{
                    backgroundColor: getCategoryColor(post.category) + "18",
                    color: getCategoryColor(post.category),
                  }}
                >
                  {post.category}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#6366F1] transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-[#94A3B8] truncate">
                    {post.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#94A3B8] mb-3">
            더 자세한 이사·생활 꿀팁은 블로그에서 확인하세요.
          </p>
        )}

        {BLOG_CONFIG.url && (
          <a
            href={BLOG_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6366F1] hover:underline"
          >
            블로그 방문하기 <ExternalLink size={12} />
          </a>
        )}
      </div>
    </section>
  );
}

function getCategoryColor(category: BlogPost["category"]): string {
  switch (category) {
    case "이사": return "#6366F1";
    case "동네": return "#10B981";
    case "분리수거": return "#16A34A";
    case "생활": return "#F59E0B";
    case "부동산": return "#3B82F6";
    default: return "#64748B";
  }
}
