import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getNeighborhoodById,
  getNeighborhoodsByDistrict,
  getComplaints,
  getNoisePoints,
  getReviews,
  getSafetyInfo,
  getPopularByCity,
} from "@/lib/data";
import ProReportContent from "@/components/ProReportContent";

// PRO 심층 리포트는 무료 공개 — 정적 생성
export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const area = getNeighborhoodById(id);
  if (!area) return { title: "PRO 리포트 | 이사전에" };

  const title = `${area.name} 심층 PRO 리포트 | 이사전에`;
  const description = `${area.city} ${area.district} ${area.name}의 종합 분석, 인근 동네 비교, 강점·약점, 입주 전 체크포인트까지 한눈에. PDF 저장 가능.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
  };
}

export default async function ProReportPage({
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
  const safety = getSafetyInfo(id);

  // 인근 동(같은 구) 비교 데이터
  const sameDistrict = getNeighborhoodsByDistrict(area.district)
    .filter((n) => n.id !== area.id)
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 5);

  // 같은 시 TOP 5 (랭킹 비교용)
  const cityTop = getPopularByCity(area.city)
    .filter((n) => n.id !== area.id)
    .slice(0, 5);

  return (
    <ProReportContent
      area={area}
      complaints={complaints}
      noisePoints={noisePoints}
      reviews={reviews}
      safety={safety}
      sameDistrict={sameDistrict}
      cityTop={cityTop}
    />
  );
}
