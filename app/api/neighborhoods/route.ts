import { NextRequest, NextResponse } from "next/server";
import {
  searchNeighborhoods,
  getNeighborhoodsByDistrict,
  getAllNeighborhoods,
} from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q");
  const district = searchParams.get("district");

  try {
    let data;

    if (q) {
      data = searchNeighborhoods(q);
    } else if (district) {
      data = getNeighborhoodsByDistrict(district);
    } else {
      data = getAllNeighborhoods();
    }

    return NextResponse.json({ neighborhoods: data });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
