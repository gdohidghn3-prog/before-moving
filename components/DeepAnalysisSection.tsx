"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Building2,
  GraduationCap,
  Hospital,
  ShoppingCart,
  TreePine,
  BookOpen,
  Clock,
  TrendingUp,
  MapPin,
  ExternalLink,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ── 타입 ────────────────────────────────────────────────

interface NaverItem {
  title: string;
  category: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
  link: string;
}

interface AptItem extends NaverItem {
  score: number;
  distKm: number;
}

interface Props {
  neighborhoodId: string;
  district: string;
  name: string;
  city: string;
  areaLat: number;
  areaLng: number;
}

// ── 좌표 변환 + 거리 계산 ──────────────────────────────

// 네이버 API의 mapx/mapy는 KATECH 좌표계(x,y)가 아니라 WGS84 × 10^7
function naverToLatLng(mapx: string, mapy: string): { lat: number; lng: number } {
  return { lat: parseFloat(mapy) / 1e7, lng: parseFloat(mapx) / 1e7 };
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distLabel(km: number): { walk: string; drive: string } {
  const walkMin = Math.round(km / 0.07);
  const driveMin = Math.max(1, Math.round(km / 0.5));
  const walk = walkMin <= 60 ? `도보 ${walkMin}분` : `도보 ${Math.floor(walkMin / 60)}시간 ${walkMin % 60}분`;
  return { walk, drive: `차량 ${driveMin}분` };
}

function cleanTitle(t: string) {
  return t.replace(/<[^>]*>/g, "");
}

// ── API fetch 훅 ───────────────────────────────────────

function useFetchCategory(district: string, name: string, neighborhoodId: string, category: string) {
  const [items, setItems] = useState<NaverItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loaded) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ id: neighborhoodId, district, name, category });
      const res = await fetch(`/api/local-info?${params}`);
      const json = await res.json();
      setItems(json.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [district, name, neighborhoodId, category, loaded]);

  return { items, loading, loaded, load };
}

// ── 아파트 검색 (네이버 API) ───────────────────────────

function useApartments(district: string, name: string, areaLat: number, areaLng: number) {
  const [apts, setApts] = useState<AptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoading(true);

    async function fetchApts() {
      try {
        const params = new URLSearchParams({ district, name, q: "아파트" });
        const res = await fetch(`/api/local-info?${params}`);
        const json = await res.json();
        const raw: NaverItem[] = json.items ?? [];

        // 아파트 카테고리만 필터 + 점수 계산
        const aptItems: AptItem[] = raw
          .filter((item) => item.category.includes("아파트") || item.category.includes("부동산") || item.category.includes("주거"))
          .map((item) => {
            const { lat, lng } = naverToLatLng(item.mapx, item.mapy);
            const distKm = haversineKm(areaLat, areaLng, lat, lng);
            // 점수: 거리 가까울수록 높음 (동 중심 2km 이내 기준)
            const distScore = Math.max(0, 100 - Math.round(distKm * 50));
            return { ...item, title: cleanTitle(item.title), score: distScore, distKm };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);

        setApts(aptItems);
      } catch {
        setApts([]);
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    }
    fetchApts();
  }, [district, name, areaLat, areaLng, loaded]);

  return { apts, loading };
}

// ── POI 리스트 카드 ────────────────────────────────────

function PoiCard({ item, refLat, refLng, icon: Icon, colorClass }: {
  item: NaverItem;
  refLat: number;
  refLng: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  colorClass: string;
}) {
  const { lat, lng } = naverToLatLng(item.mapx, item.mapy);
  const km = haversineKm(refLat, refLng, lat, lng);
  const d = distLabel(km);
  const title = cleanTitle(item.title);

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 min-w-0">
        <Icon size={14} className={`shrink-0 ${colorClass}`} />
        <span className="text-sm text-[var(--text)] truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-[var(--text-secondary)]">{d.walk}</span>
        <span className="text-[10px] text-[var(--border)]">|</span>
        <span className="text-[11px] text-[var(--text-secondary)]">{d.drive}</span>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────

export default function DeepAnalysisSection({ neighborhoodId, district, name, city, areaLat, areaLng }: Props) {
  // 아파트 검색
  const { apts, loading: aptLoading } = useApartments(district, name, areaLat, areaLng);
  const [selectedApt, setSelectedApt] = useState<AptItem | null>(null);
  const [showAllApts, setShowAllApts] = useState(false);

  // 기준 좌표: 선택된 아파트 or 동 중심
  const refLat = selectedApt ? naverToLatLng(selectedApt.mapx, selectedApt.mapy).lat : areaLat;
  const refLng = selectedApt ? naverToLatLng(selectedApt.mapx, selectedApt.mapy).lng : areaLng;

  // 카테고리별 데이터
  const schools = useFetchCategory(district, name, neighborhoodId, "school");
  const hospitals = useFetchCategory(district, name, neighborhoodId, "hospital");
  const parks = useFetchCategory(district, name, neighborhoodId, "park");

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => { schools.load(); }, [schools.load]);
  useEffect(() => { hospitals.load(); }, [hospitals.load]);
  useEffect(() => { parks.load(); }, [parks.load]);

  const visibleApts = showAllApts ? apts : apts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* ── 아파트 랭킹 ──────────────────────────── */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
          <Building2 size={16} className="text-emerald-600" /> 아파트 · 부동산
        </h2>

        {selectedApt && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 mb-3 flex items-center justify-between">
            <span className="text-xs text-indigo-700">
              <strong>{selectedApt.title}</strong> 기준으로 거리 표시 중
            </span>
            <button onClick={() => setSelectedApt(null)} className="text-xs text-indigo-500 hover:text-indigo-700 cursor-pointer">해제</button>
          </div>
        )}

        {aptLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={18} className="animate-spin text-[var(--text-secondary)]" />
            <span className="ml-2 text-sm text-[var(--text-secondary)]">아파트 정보 검색 중...</span>
          </div>
        ) : apts.length === 0 ? (
          <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center text-sm text-[var(--text-secondary)]">
            주변 아파트 정보를 찾을 수 없습니다
          </div>
        ) : (
          <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-[var(--background)] border-b border-[var(--border)]">
              <span className="text-xs font-medium text-[var(--text-secondary)]">주변 아파트 · 탭하여 기준 위치 설정</span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {visibleApts.map((apt, i) => {
                const isSelected = selectedApt?.title === apt.title;
                const d = distLabel(apt.distKm);
                return (
                  <button
                    key={`${apt.title}-${i}`}
                    onClick={() => setSelectedApt(isSelected ? null : apt)}
                    className={`w-full text-left px-4 py-3 hover:bg-[var(--background)] transition-colors cursor-pointer ${isSelected ? "bg-indigo-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold w-6 shrink-0 ${i < 3 ? "text-[#6366F1]" : "text-[var(--text-secondary)]"}`}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[var(--text)] truncate">{apt.title}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">{apt.roadAddress || apt.address}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-[var(--text-secondary)]">{d.walk}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {apts.length > 5 && (
              <button
                onClick={() => setShowAllApts(!showAllApts)}
                className="w-full px-4 py-2.5 text-xs text-[#6366F1] font-medium hover:bg-[var(--background)] transition-colors cursor-pointer flex items-center justify-center gap-1 border-t border-[var(--border)]"
              >
                {showAllApts ? <><ChevronUp size={14} /> 접기</> : <><ChevronDown size={14} /> 전체 {apts.length}개 보기</>}
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          <a href={`https://new.land.naver.com/complexes?ms=${areaLat},${areaLng},16&a=APT:PRE:ABYG:JGC&e=RETAIL&ad=true`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-3 rounded-lg text-white text-sm font-medium bg-green-600 hover:bg-green-700 transition-colors">네이버 부동산 <ExternalLink size={12} /></a>
          <a href={`https://search.naver.com/search.naver?query=${encodeURIComponent(district + " " + name + " 전세 월세 매물")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-3 rounded-lg text-white text-sm font-medium bg-blue-600 hover:bg-blue-700 transition-colors">매물 통합검색 <ExternalLink size={12} /></a>
        </div>
      </section>

      {/* ── 교육 환경 (실제 학교 데이터) ──────── */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
          <GraduationCap size={16} className="text-blue-600" /> 교육 환경
          {selectedApt && <span className="text-[10px] text-indigo-500 ml-1">({selectedApt.title} 기준)</span>}
        </h2>
        {schools.loading ? (
          <div className="flex items-center justify-center py-6"><Loader2 size={16} className="animate-spin text-[var(--text-secondary)]" /><span className="ml-2 text-sm text-[var(--text-secondary)]">학교 정보 검색 중...</span></div>
        ) : schools.items.length === 0 ? (
          <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center text-sm text-[var(--text-secondary)]">주변 학교 정보를 찾을 수 없습니다</div>
        ) : (
          <div className="bg-white border border-[var(--border)] rounded-xl p-4 divide-y divide-[var(--border)]">
            {schools.items.map((s, i) => (
              <PoiCard key={`${s.title}-${i}`} item={s} refLat={refLat} refLng={refLng} icon={GraduationCap} colorClass="text-blue-500" />
            ))}
          </div>
        )}
      </section>

      {/* ── 생활 인프라 (실제 병원/마트/공원) ─── */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
          <Hospital size={16} className="text-rose-500" /> 생활 인프라
          {selectedApt && <span className="text-[10px] text-indigo-500 ml-1">({selectedApt.title} 기준)</span>}
        </h2>

        {/* 병원/약국 */}
        <div className="mb-3">
          <div className="text-xs font-medium text-[var(--text)] mb-1.5">병원 · 약국</div>
          {hospitals.loading ? (
            <div className="flex items-center py-4"><Loader2 size={14} className="animate-spin text-[var(--text-secondary)]" /><span className="ml-2 text-xs text-[var(--text-secondary)]">검색 중...</span></div>
          ) : hospitals.items.length === 0 ? (
            <div className="text-xs text-[var(--text-secondary)] py-2">정보 없음</div>
          ) : (
            <div className="bg-white border border-[var(--border)] rounded-xl px-4 divide-y divide-[var(--border)]">
              {hospitals.items.slice(0, 8).map((h, i) => (
                <PoiCard key={`${h.title}-${i}`} item={h} refLat={refLat} refLng={refLng} icon={Hospital} colorClass="text-rose-500" />
              ))}
            </div>
          )}
        </div>

        {/* 공원 */}
        <div>
          <div className="text-xs font-medium text-[var(--text)] mb-1.5">공원 · 산책</div>
          {parks.loading ? (
            <div className="flex items-center py-4"><Loader2 size={14} className="animate-spin text-[var(--text-secondary)]" /><span className="ml-2 text-xs text-[var(--text-secondary)]">검색 중...</span></div>
          ) : parks.items.length === 0 ? (
            <div className="text-xs text-[var(--text-secondary)] py-2">정보 없음</div>
          ) : (
            <div className="bg-white border border-[var(--border)] rounded-xl px-4 divide-y divide-[var(--border)]">
              {parks.items.slice(0, 5).map((p, i) => (
                <PoiCard key={`${p.title}-${i}`} item={p} refLat={refLat} refLng={refLng} icon={TreePine} colorClass="text-emerald-500" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
