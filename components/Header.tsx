"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/checklist", label: "체크리스트" },
    { href: "/recycle", label: "분리수거" },
    { href: "/about", label: "소개" },
  ];

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#6366F1]">
          이사전에
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#EEF2FF] text-[#6366F1]"
                    : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#6366F1]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
