import type { MetadataRoute } from "next";
import { getAllNeighborhoods } from "@/lib/data";
import { getAllRecycleItems } from "@/lib/recycle";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://before-moving.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const neighborhoods = getAllNeighborhoods();
  const recycleItems = getAllRecycleItems();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/checklist`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/recycle`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 동네 상세 페이지 (252개)
  const areaPages: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${BASE_URL}/area/${n.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 안전 상세 페이지 (252개)
  const safetyPages: MetadataRoute.Sitemap = neighborhoods.map((n) => ({
    url: `${BASE_URL}/safety/${n.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 분리수거 상세 페이지
  const recyclePages: MetadataRoute.Sitemap = recycleItems.map((item) => ({
    url: `${BASE_URL}/recycle/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...areaPages, ...safetyPages, ...recyclePages];
}
