import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이사 체크리스트 - 전입신고부터 주소변경까지 | 이사전에",
  description:
    "이사 후 해야 할 일 22가지 체크리스트. 전입신고, 건강보험, 자동차 등록, 인터넷 이전 등 기한과 과태료까지 한눈에 확인하세요.",
  openGraph: {
    title: "이사 체크리스트 - ���입신고부터 주소변경까지 | 이사전에",
    description:
      "이사 후 해야 할 일 22가지 체크리스트. 전입신고, 건강보험, 자동차 등록 등 기한과 과태료까지.",
    type: "article",
  },
};

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
