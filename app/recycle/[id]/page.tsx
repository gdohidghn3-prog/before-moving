import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllRecycleItems,
  getRecycleItemById,
  getAllCategories,
} from "@/lib/recycle";
import RecycleDetailContent from "@/components/RecycleDetailContent";

// ── 정적 경로 생성 ──────────────────────────────────────────

export function generateStaticParams() {
  return getAllRecycleItems().map((item) => ({ id: item.id }));
}

// ── 동적 메타데이터 ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = getRecycleItemById(id);
  if (!item) return { title: "분리수거 정보를 찾을 수 없습니다 | 이사전에" };

  const categories = getAllCategories();
  const cat = categories.find((c) => c.id === item.category);

  const title = `${item.name} 분리수거 방법 - ${cat?.label ?? ""} | 이사전에`;
  const description = `${item.name} 버리는 법: ${item.method}. ${item.tips.length > 0 ? item.tips[0] : ""} 분리수거 꿀팁과 흔한 실수를 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

// ── 페이지 (서버 컴포넌트) ───────────────────────────────────

export default async function RecycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getRecycleItemById(id);

  if (!item) notFound();

  const allCategories = getAllCategories();
  const categoryInfo = allCategories.find((c) => c.id === item.category);

  return (
    <RecycleDetailContent
      item={item}
      categoryInfo={categoryInfo}
      allCategories={allCategories}
    />
  );
}
