import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { neighborhoodId, rating, pros, cons, livedYears } = body;

    if (!neighborhoodId || !rating || !pros || !cons) {
      return NextResponse.json(
        { error: "필수 항목을 모두 입력해주세요." },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "평점은 1~5 사이여야 합니다." },
        { status: 400 },
      );
    }

    // TODO: 실제 데이터 저장 로직 추가
    return NextResponse.json(
      {
        success: true,
        message: "리뷰가 등록되었습니다.",
        review: { neighborhoodId, rating, pros, cons, livedYears },
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "리뷰 등록 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
