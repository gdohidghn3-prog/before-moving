import { NextResponse } from "next/server";
import { getPopularNeighborhoods } from "@/lib/data";

export async function GET() {
  try {
    const data = getPopularNeighborhoods();
    const top10 = data.slice(0, 10);

    return NextResponse.json({ neighborhoods: top10 });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
