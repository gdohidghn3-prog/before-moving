import type { Metadata } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "이사전에 - 이사 가기 전 동네 정보 한눈에",
    template: "%s | 이사전에",
  },
  description:
    "이사 가기 전 동네의 소음, 안전, CCTV, 분리수거 정보를 한눈에 확인��세요. 전국 252개 동네 점수, 이사 체크리스트까지.",
  keywords: [
    "이��",
    "동네 정보",
    "소음 점수",
    "안전 점수",
    "이사 체크리스트",
    "분리수거",
    "CCTV",
    "전입신고",
  ],
  openGraph: {
    title: "이사전에 - 이사 가기 전 동네 ��보 한눈에",
    description:
      "전국 252개 동네의 소음·안전·편의 점수, 민원 현황, 이사 체크리스트, 분리수거 가이드를 한눈에.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
