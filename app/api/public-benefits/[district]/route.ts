import { NextRequest, NextResponse } from "next/server";
import {
  getBenefitsForDistrict,
  filterByPersona,
  filterByCategory,
  groupByCategory,
  type Persona,
  type BenefitCategory,
} from "@/lib/public-benefits";

const VALID_PERSONAS: Persona[] = ["youth", "newlywed", "childcare", "senior", "general"];
const VALID_CATEGORIES: BenefitCategory[] = [
  "housing", "youth", "childcare", "senior", "culture", "local_currency",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ district: string }> },
) {
  const { district: rawDistrict } = await params;
  const district = decodeURIComponent(rawDistrict);

  const { searchParams } = request.nextUrl;
  const city = searchParams.get("city");
  const persona = (searchParams.get("persona") ?? "general") as Persona;
  const category = searchParams.get("category") as BenefitCategory | null;

  // city 필수
  if (!city) {
    return NextResponse.json(
      { error: "city 파라미터가 필요합니다. (예: ?city=서울)" },
      { status: 400 },
    );
  }

  // persona 유효성 검사
  if (!VALID_PERSONAS.includes(persona)) {
    return NextResponse.json(
      { error: `유효하지 않은 persona: ${persona}. 가능한 값: ${VALID_PERSONAS.join(", ")}` },
      { status: 400 },
    );
  }

  // category 유효성 검사
  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: `유효하지 않은 category: ${category}. 가능한 값: ${VALID_CATEGORIES.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    let benefits = getBenefitsForDistrict(city, district);

    // 페르소나 필터
    benefits = filterByPersona(benefits, persona);

    // 카테고리 필터
    if (category) {
      benefits = filterByCategory(benefits, category);
    }

    const grouped = groupByCategory(benefits);

    return NextResponse.json(
      {
        benefits,
        grouped,
        total: benefits.length,
        persona,
        district,
        city,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "공공혜택 데이터를 불러오는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
