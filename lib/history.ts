// 최근 본 동네 + 즐겨찾기 — localStorage 기반
// sessionStorage가 아닌 localStorage를 사용하여 브라우저 종료 후에도 유지

const HISTORY_KEY = "before-moving:history";
const FAVORITES_KEY = "before-moving:favorites";
const MAX_HISTORY = 10;

export interface HistoryEntry {
  id: string;
  name: string;
  district: string;
  city: string;
  overallScore: number;
  visitedAt: number; // timestamp
}

// ── 캐시 (useSyncExternalStore 호환 — 참조 안정성 보장) ──

let _historyCache: HistoryEntry[] | null = null;
let _historyRaw: string | null = null;

let _favoritesCache: string[] | null = null;
let _favoritesRaw: string | null = null;

function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_KEY) || "[]";
  if (raw === _historyRaw && _historyCache) return _historyCache;
  try {
    _historyRaw = raw;
    _historyCache = JSON.parse(raw);
    return _historyCache!;
  } catch {
    _historyRaw = "[]";
    _historyCache = [];
    return _historyCache;
  }
}

function readFavorites(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(FAVORITES_KEY) || "[]";
  if (raw === _favoritesRaw && _favoritesCache) return _favoritesCache;
  try {
    _favoritesRaw = raw;
    _favoritesCache = JSON.parse(raw);
    return _favoritesCache!;
  } catch {
    _favoritesRaw = "[]";
    _favoritesCache = [];
    return _favoritesCache;
  }
}

// ── history ─────────────────────────────────────────────

export function getHistory(): HistoryEntry[] {
  return readHistory();
}

export function addHistory(entry: Omit<HistoryEntry, "visitedAt">) {
  if (typeof window === "undefined") return;
  const list = readHistory().filter((h) => h.id !== entry.id);
  list.unshift({ ...entry, visitedAt: Date.now() });
  if (list.length > MAX_HISTORY) list.length = MAX_HISTORY;
  const raw = JSON.stringify(list);
  localStorage.setItem(HISTORY_KEY, raw);
  _historyRaw = raw;
  _historyCache = list;
  window.dispatchEvent(new Event("history-change"));
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
  _historyRaw = "[]";
  _historyCache = [];
  window.dispatchEvent(new Event("history-change"));
}

// ── favorites ───────────────────────────────────────────

export function getFavorites(): string[] {
  return readFavorites();
}

export function toggleFavorite(id: string): boolean {
  if (typeof window === "undefined") return false;
  const list = [...readFavorites()];
  const idx = list.indexOf(id);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(id);
  }
  const raw = JSON.stringify(list);
  localStorage.setItem(FAVORITES_KEY, raw);
  _favoritesRaw = raw;
  _favoritesCache = list;
  window.dispatchEvent(new Event("favorites-change"));
  return idx < 0; // true = 추가됨, false = 제거됨
}

export function isFavorite(id: string): boolean {
  return readFavorites().includes(id);
}
