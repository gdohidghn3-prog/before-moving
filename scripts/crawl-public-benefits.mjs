#!/usr/bin/env node
/**
 * 공공혜택 데이터 크롤러
 * 공공데이터포털 API -> data/public-benefits/benefits.json
 *
 * Usage: node scripts/crawl-public-benefits.mjs
 *        node scripts/crawl-public-benefits.mjs --dry-run
 * Env: PUBLIC_DATA_API_KEY=<your-key>
 *
 * 5개 데이터셋:
 * 1. 청년정책 통합검색
 * 2. 주거지원 정책 (LH/HUG)
 * 3. 시군구별 출산장려금
 * 4. 전국 공공도서관 정보
 * 5. 지역화폐 발행 현황
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.PUBLIC_DATA_API_KEY;
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'public-benefits', 'benefits.json');
const DRY_RUN = process.argv.includes('--dry-run');

if (!API_KEY) {
  console.error('PUBLIC_DATA_API_KEY 환경변수가 필요합니다.');
  console.error('   data.go.kr에서 인증키를 발급받으세요.');
  process.exit(1);
}

// ─── 공통 유틸 ──────────────────────────────────────────────────

/** data.go.kr API 호출 (JSON 우선, XML 폴백) */
async function fetchApi(url, label) {
  console.log(`  [${label}] 요청: ${url.replace(API_KEY, 'API_KEY')}`);

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      console.warn(`  [${label}] HTTP ${res.status} - ${res.statusText}`);
      return null;
    }

    const contentType = res.headers.get('content-type') || '';

    // JSON 응답
    if (contentType.includes('json')) {
      const json = await res.json();
      return json;
    }

    // XML 응답 -> 텍스트로 반환 (호출자에서 파싱)
    const text = await res.text();

    // data.go.kr가 JSON을 text/xml로 보내는 경우 대비
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        return JSON.parse(text);
      } catch {
        // 순수 XML
      }
    }

    console.warn(`  [${label}] XML 응답 수신 (${text.length}자) - JSON 파싱 불가, 건너뜀`);
    return null;
  } catch (err) {
    console.warn(`  [${label}] 요청 실패: ${err.message}`);
    return null;
  }
}

/** 응답 데이터에서 items 배열 추출 (data.go.kr 공통 구조) */
function extractItems(json) {
  if (!json) return [];

  // 패턴 1: { response: { body: { items: { item: [...] } } } }
  const items1 = json?.response?.body?.items?.item;
  if (Array.isArray(items1)) return items1;
  if (items1 && typeof items1 === 'object') return [items1]; // 단건

  // 패턴 2: { response: { body: { items: [...] } } }
  const items2 = json?.response?.body?.items;
  if (Array.isArray(items2)) return items2;

  // 패턴 3: { data: [...] }
  const items3 = json?.data;
  if (Array.isArray(items3)) return items3;

  // 패턴 4: 최상위 배열
  if (Array.isArray(json)) return json;

  // 패턴 5: { result: [...] } (일부 API)
  const items5 = json?.result;
  if (Array.isArray(items5)) return items5;

  return [];
}

/** 고유 ID 생성 */
function makeId(prefix, index, title) {
  const slug = (title || '').replace(/\s+/g, '-').replace(/[^가-힣a-zA-Z0-9-]/g, '').slice(0, 30);
  return `${prefix}-${String(index).padStart(4, '0')}-${slug}`;
}

/**
 * 시군구 코드/이름을 "시 구" 형태의 district key로 매핑
 * data.go.kr 응답에는 다양한 필드명이 쓰임
 */
function toDistrictKey(item) {
  // 시/도 + 시군구 조합
  const city = item.sido || item.sidoNm || item.ctpvNm || item.sido_nm || '';
  const district = item.sigungu || item.sigunguNm || item.sggnNm || item.sigungu_nm || '';

  if (city && district) {
    // "서울특별시" -> "서울", "경기도" -> "경기"
    const shortCity = city
      .replace(/특별시|광역시|특별자치시|특별자치도/, '')
      .replace(/도$/, '')
      .trim();
    return `${shortCity} ${district}`;
  }

  // 지역명에서 추출 시도
  const region = item.region || item.regionNm || item.lcgvNm || '';
  if (region) return region;

  return null;
}

// ─── 1. 청년정책 통합검색 ───────────────────────────────────────

async function fetchYouthPolicies() {
  console.log('\n[1/5] 청년정책 통합검색...');

  // TODO: 실제 API 키 발급 후 정확한 endpoint 확인 필요
  // https://www.data.go.kr/data/15059679/openapi.do (청년정책 통합검색)
  const url = `https://apis.data.go.kr/1383000/youthPolicyApi/youthPolicyList?serviceKey=${API_KEY}&type=json&numOfRows=1000&pageNo=1`;

  const json = await fetchApi(url, '청년정책');
  const items = extractItems(json);
  console.log(`  -> ${items.length}건 수신`);

  return items.map((item, i) => ({
    id: makeId('youth', i, item.plcyNm || item.title),
    title: item.plcyNm || item.title || '청년정책',
    category: 'youth',
    personas: ['youth'],
    description: item.plcyCn || item.description || '',
    eligibility: item.ageInfo || item.eligibility || undefined,
    amount: item.sprtCn || item.amount || undefined,
    period: item.rqutPrdCn || item.period || undefined,
    howToApply: item.rqutMthdCn || item.howToApply || undefined,
    url: item.rqutUrla || item.url || undefined,
    source: '공공데이터포털 - 청년정책 통합검색',
    _district: toDistrictKey(item),
  }));
}

// ─── 2. 주거지원 정책 ───────────────────────────────────────────

async function fetchHousingSupport() {
  console.log('\n[2/5] 주거지원 정책...');

  // TODO: 실제 API 키 발급 후 정확한 endpoint 확인 필요
  // https://www.data.go.kr/data/15058462/openapi.do (LH 주거복지정보)
  const url = `https://apis.data.go.kr/B552555/housingSupportApi/housingSupportList?serviceKey=${API_KEY}&type=json&numOfRows=1000&pageNo=1`;

  const json = await fetchApi(url, '주거지원');
  const items = extractItems(json);
  console.log(`  -> ${items.length}건 수신`);

  return items.map((item, i) => ({
    id: makeId('housing', i, item.bsnmNm || item.title),
    title: item.bsnmNm || item.title || '주거지원',
    category: 'housing',
    personas: mapHousingPersona(item),
    description: item.bsnmCn || item.description || '',
    eligibility: item.slctCndtCn || item.eligibility || undefined,
    amount: item.sprtCn || item.amount || undefined,
    period: item.rcptDdlnCn || item.period || undefined,
    howToApply: item.rcptMthdCn || item.howToApply || undefined,
    url: item.dtlPgUrl || item.url || undefined,
    source: '공공데이터포털 - 주거지원 정책',
    _district: toDistrictKey(item),
  }));
}

function mapHousingPersona(item) {
  const personas = ['general'];
  const text = `${item.bsnmNm || ''} ${item.slctCndtCn || ''} ${item.bsnmCn || ''}`.toLowerCase();
  if (text.includes('청년') || text.includes('대학생')) personas.push('youth');
  if (text.includes('신혼') || text.includes('혼인')) personas.push('newlywed');
  if (text.includes('출산') || text.includes('영유아') || text.includes('육아')) personas.push('childcare');
  if (text.includes('고령') || text.includes('노인') || text.includes('시니어')) personas.push('senior');
  return [...new Set(personas)];
}

// ─── 3. 시군구별 출산장려금 ─────────────────────────────────────

async function fetchBirthIncentives() {
  console.log('\n[3/5] 시군구별 출산장려금...');

  // TODO: 실제 API 키 발급 후 정확한 endpoint 확인 필요
  // https://www.data.go.kr/data/15076300/openapi.do (출산장려금 지원현황)
  const url = `https://apis.data.go.kr/1741000/birthIncentiveApi/birthIncentiveList?serviceKey=${API_KEY}&type=json&numOfRows=1000&pageNo=1`;

  const json = await fetchApi(url, '출산장려금');
  const items = extractItems(json);
  console.log(`  -> ${items.length}건 수신`);

  return items.map((item, i) => ({
    id: makeId('birth', i, item.sigunguNm || item.region),
    title: `${item.sigunguNm || item.region || ''} 출산장려금`,
    category: 'childcare',
    personas: ['childcare', 'newlywed'],
    description: item.sprtCn || item.description || `${item.sigunguNm || ''} 출산 시 장려금 지원`,
    eligibility: item.slctCndtCn || item.eligibility || undefined,
    amount: item.sprtAmt
      ? `${Number(item.sprtAmt).toLocaleString()}원`
      : item.amount || undefined,
    period: item.sprtPrd || item.period || undefined,
    howToApply: item.rqutMthd || item.howToApply || '관할 주민센터 방문 또는 정부24 온라인 신청',
    url: item.dtlUrl || item.url || undefined,
    source: '공공데이터포털 - 출산장려금 지원현황',
    _district: toDistrictKey(item),
  }));
}

// ─── 4. 전국 공공도서관 정보 ────────────────────────────────────

async function fetchPublicLibraries() {
  console.log('\n[4/5] 전국 공공도서관 정보...');

  // TODO: 실제 API 키 발급 후 정확한 endpoint 확인 필요
  // https://www.data.go.kr/data/15013109/standard.do (전국 공공도서관 표준데이터)
  const url = `https://apis.data.go.kr/6260000/PublicLibraryInfoService/getPublicLibraryInfo?serviceKey=${API_KEY}&type=json&numOfRows=1000&pageNo=1`;

  const json = await fetchApi(url, '공공도서관');
  const items = extractItems(json);
  console.log(`  -> ${items.length}건 수신`);

  return items.map((item, i) => ({
    id: makeId('library', i, item.lbrryNm || item.libNm),
    title: item.lbrryNm || item.libNm || item.title || '공공도서관',
    category: 'culture',
    personas: ['general'],
    description: [
      item.lbrryNm || item.libNm || '',
      item.rdnmadr || item.addr || '',
      item.operTm ? `운영시간: ${item.operTm}` : '',
      item.hldyInfo ? `휴관일: ${item.hldyInfo}` : '',
    ].filter(Boolean).join(' | '),
    eligibility: undefined,
    amount: undefined,
    period: item.operTm || undefined,
    howToApply: item.homepageUrl ? `홈페이지: ${item.homepageUrl}` : undefined,
    url: item.homepageUrl || item.url || undefined,
    source: '공공데이터포털 - 전국 공공도서관 표준데이터',
    _district: toDistrictKey(item),
  }));
}

// ─── 5. 지역화폐 발행 현황 ─────────────────────────────────────

async function fetchLocalCurrency() {
  console.log('\n[5/5] 지역화폐 발행 현황...');

  // TODO: 실제 API 키 발급 후 정확한 endpoint 확인 필요
  // https://www.data.go.kr/data/15069887/openapi.do (지역화폐 발행현황)
  const url = `https://apis.data.go.kr/1383000/gmoney/gmoneyList?serviceKey=${API_KEY}&type=json&numOfRows=1000&pageNo=1`;

  const json = await fetchApi(url, '지역화폐');
  const items = extractItems(json);
  console.log(`  -> ${items.length}건 수신`);

  return items.map((item, i) => ({
    id: makeId('currency', i, item.lcgvNm || item.regionNm),
    title: `${item.lcgvNm || item.regionNm || ''} 지역화폐`,
    category: 'local_currency',
    personas: ['general'],
    description: [
      item.lcgvNm || item.regionNm || '',
      item.crdNm ? `카드명: ${item.crdNm}` : '',
      item.issuAmt ? `발행액: ${Number(item.issuAmt).toLocaleString()}원` : '',
      item.dscntRt ? `할인율: ${item.dscntRt}%` : '',
    ].filter(Boolean).join(' | '),
    eligibility: item.joinCndtn || undefined,
    amount: item.dscntRt ? `${item.dscntRt}% 할인` : item.amount || undefined,
    period: undefined,
    howToApply: item.joinMthd || item.howToApply || undefined,
    url: item.homepageUrl || item.url || undefined,
    source: '공공데이터포털 - 지역화폐 발행현황',
    _district: toDistrictKey(item),
  }));
}

// ─── 메인 ───────────────────────────────────────────────────────

async function main() {
  console.log('=== 공공혜택 데이터 크롤러 ===');
  if (DRY_RUN) console.log('(--dry-run 모드: 파일 저장 없음)\n');

  // 1. 기존 데이터 로드 (national/cities 보존용)
  let existing = { national: [], cities: {}, districts: {}, updatedAt: '' };
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
      console.log(`기존 데이터 로드: national ${existing.national?.length || 0}건, cities ${Object.keys(existing.cities || {}).length}개, districts ${Object.keys(existing.districts || {}).length}개`);
    } catch (err) {
      console.warn(`기존 데이터 파싱 실패, 새로 생성: ${err.message}`);
    }
  } else {
    console.log('기존 데이터 없음, 새로 생성합니다.');
  }

  // 2. 5개 API에서 데이터 수집
  const results = await Promise.allSettled([
    fetchYouthPolicies(),
    fetchHousingSupport(),
    fetchBirthIncentives(),
    fetchPublicLibraries(),
    fetchLocalCurrency(),
  ]);

  const allBenefits = [];
  const labels = ['청년정책', '주거지원', '출산장려금', '공공도서관', '지역화폐'];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === 'fulfilled') {
      allBenefits.push(...result.value);
      console.log(`\n  [OK] ${labels[i]}: ${result.value.length}건`);
    } else {
      console.warn(`\n  [FAIL] ${labels[i]}: ${result.reason?.message || result.reason}`);
    }
  }

  // 3. district key별 분류
  const newDistricts = {};
  let unmapped = 0;

  for (const benefit of allBenefits) {
    const districtKey = benefit._district;
    delete benefit._district; // 내부 필드 제거

    if (districtKey) {
      if (!newDistricts[districtKey]) newDistricts[districtKey] = [];
      newDistricts[districtKey].push(benefit);
    } else {
      unmapped++;
    }
  }

  // 4. 병합: national/cities는 기존 보존, districts는 API 데이터로 갱신
  const merged = {
    national: existing.national || [],
    cities: existing.cities || {},
    districts: {
      ...(existing.districts || {}),  // 수동 추가 데이터 보존
      ...newDistricts,                 // API 데이터로 덮어쓰기
    },
    updatedAt: new Date().toISOString(),
  };

  // 5. 통계
  const totalNational = merged.national.length;
  const totalCities = Object.values(merged.cities).reduce((sum, arr) => sum + arr.length, 0);
  const totalDistricts = Object.values(merged.districts).reduce((sum, arr) => sum + arr.length, 0);
  const totalAll = totalNational + totalCities + totalDistricts;

  console.log('\n=== 결과 요약 ===');
  console.log(`  API 수집: ${allBenefits.length}건 (매핑 실패: ${unmapped}건)`);
  console.log(`  national: ${totalNational}건 (보존)`);
  console.log(`  cities: ${totalCities}건, ${Object.keys(merged.cities).length}개 시/도 (보존)`);
  console.log(`  districts: ${totalDistricts}건, ${Object.keys(merged.districts).length}개 구/군`);
  console.log(`  총 혜택: ${totalAll}건`);

  // 6. 저장
  if (DRY_RUN) {
    console.log('\n--dry-run: 파일 저장을 건너뜁니다.');
    console.log(`  저장 경로: ${OUTPUT_PATH}`);
  } else {
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`\n저장 완료: ${OUTPUT_PATH}`);
  }

  console.log('\n=== 크롤링 완료 ===');
}

main().catch((err) => {
  console.error('크롤러 실행 오류:', err);
  process.exit(1);
});
