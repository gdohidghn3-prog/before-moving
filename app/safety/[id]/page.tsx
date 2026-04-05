import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllNeighborhoods,
  getNeighborhoodById,
  getSafetyInfo,
} from "@/lib/data";
import SafetyDetailContent from "@/components/SafetyDetailContent";

// ── 정적 경로 생성 ──────────────────────────────────────────

export function generateStaticParams() {
  return getAllNeighborhoods().map((n) => ({ id: n.id }));
}

// ── 동적 메타데이터 ─────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const area = getNeighborhoodById(id);
  const safety = getSafetyInfo(id);
  if (!area || !safety) return { title: "안전 정보를 찾을 수 없습니다 | 이사전에" };

  const title = `${area.name} ${area.district} 안전 정보 - CCTV·경찰서·비상벨 | 이사전에`;
  const description = `${area.city} ${area.district} ${area.name}의 CCTV ${safety.cctvCount + safety.cctvTraffic}대, ${safety.policeStation} ${safety.policeDistance}, 24시 편의점 ${safety.convenienceStores24h}개. 안전 점수 ${safety.safetyScore}점.`;

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

export default async function SafetyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const area = getNeighborhoodById(id);
  const safety = getSafetyInfo(id);

  if (!area || !safety) notFound();

  return <SafetyDetailContent area={area} safety={safety} id={id} />;
}
