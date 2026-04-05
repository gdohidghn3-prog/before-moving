import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "분리수거 가이드 - 이거 어디에 버려? | 이사전에",
  description:
    "헷갈리는 분리수거 방법을 검색하세요. 종이, 플라스틱, 비닐, 유리, 캔, 음식물, 대형폐기물 등 80개 항목의 올바른 배출 방법을 안내합니다.",
  openGraph: {
    title: "분리수거 가이드 - 이거 어디에 버���? | 이사전에",
    description:
      "헷갈리는 분리수거 방법 80개 항목 검색. 조건에 따라 달라지는 분류 방법까지.",
    type: "article",
  },
};

export default function RecycleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
