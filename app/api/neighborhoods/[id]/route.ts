import { NextRequest, NextResponse } from "next/server";
import {
  getNeighborhoodById,
  getComplaints,
  getNoisePoints,
  getReviews,
} from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const neighborhood = getNeighborhoodById(id);

    if (!neighborhood) {
      return NextResponse.json(
        { error: "해당 동네 정보를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const complaints = getComplaints(id);
    const noisePoints = getNoisePoints(id);
    const reviews = getReviews(id);

    return NextResponse.json({
      neighborhood,
      complaints,
      noisePoints,
      reviews,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
