import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllNeighborhoods,
  getNeighborhoodById,
  getComplaints,
  getNoisePoints,
  getReviews,
} from "@/lib/data";
import AreaDetailContent from "@/components/AreaDetailContent";

// ── 정적 경로 생성 (252개 동) ────────────────────────────────

export function generateStaticParams() {
  return getAllNeighborhoods().map((n) => ({ id: n.id }));
}

// ── 동적 메타데이터 (SEO 핵심) ───────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const area = getNeighborhoodById(id);
  if (!area) return { title: "동네 정보를 찾을 수 없습니다 | 이사전에" };

  const title = `${area.name} ${area.district} 동네 정보 - 소음·안전·편의 점수 | 이사전에`;
  const description = `${area.city} ${area.district} ${area.name}의 소음 ${area.noiseScore}점, 안전 ${area.safetyScore}점, 편의 ${area.convenienceScore}점. 민원 현황, 주민 리뷰, 부동산 매물까지 한눈에 확인하세요.`;

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

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const area = getNeighborhoodById(id);

  if (!area) notFound();

  const complaints = getComplaints(id);
  const noisePoints = getNoisePoints(id);
  const reviews = getReviews(id);

  return (
    <AreaDetailContent
      area={area}
      complaints={complaints}
      noisePoints={noisePoints}
      reviews={reviews}
      id={id}
    />
  );
}
