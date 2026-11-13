import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getAiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export interface PlaceAttributes {
  // Osaka-trip-2027 standard fields (旅の手帖風格)
  spotName: string;
  categoryLabel: string;
  tag: string;
  desc: string;
  recommendation: string;
  suggestedTime: string;
  mapUrl: string;

  // Compatibility fields for Tokyo guide
  category: "dining" | "sightseeing" | "cafe" | "shopping" | "stay" | "other" | string;
  name: string;
  japaneseName: string;
  highlight: string;
  summary: string;
  address: string;
  tips: string;
  url: string;
  resolvedUrl?: string;

  // Specific attributes for Dining (餐飲專屬)
  cuisineType?: string;            // 料理種類 (如：黑毛和牛燒肉、百年壽喜燒、極濃柚子拉麵)
  signatureDishes?: string[];       // 招牌必點菜色清單
  priceRange?: string;              // 預估人均消費區間 (如：￥4,000 ~ ￥8,000)
  diningAtmosphere?: string;        // 用餐氛圍/特色 (如：高空景觀席、預約制百年老店)

  // Specific attributes for Sightseeing (景點專屬)
  spotType?: string;                // 景點類型 (如：歷史神社、高空展望台、古典庭園)
  mustSeeHighlights?: string[];    // 必看亮點清單
  ticketInfo?: string;              // 門票/參拜資訊 (如：免費參觀、需預約購票)
  bestTimeToVisit?: string;         // 推薦造訪時段 (如：清晨避開人潮、黃昏日落夜景)

  // Specific attributes for Cafe / Dessert (甜點咖啡)
  dessertType?: string;             // 甜品特色 (如：厚切生吐司、手沖精品咖啡)

  // Specific attributes for Shopping (購物商場)
  mallType?: string;                // 商場類型 (如：綜合百貨商場、潮流服飾免稅)
  taxFreeInfo?: string;             // 免稅資訊

  // Scraped Metadata Source Audit
  metaSource?: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    schemaType?: string;
    placesApiMatched?: boolean;
    geminiEnhanced?: boolean;
  };
}

// Multi-tier URI decoder for nested Google Maps redirect URLs
export function safeDecode(str: string): string {
  let prev = str;
  for (let i = 0; i < 4; i++) {
    try {
      const next = decodeURIComponent(prev);
      if (next === prev) break;
      prev = next;
    } catch {
      break;
    }
  }
  return prev;
}

// Clean mobile share sheet text (strips rating stars, review counts, Japanese phone numbers, postal codes)
export function cleanSharedText(input: string): string {
  if (!input) return "";
  let text = input.replace(/https?:\/\/[^\s]+/gi, " ").trim();
  text = text.replace(/\([\d,]+[+\s\w\u4e00-\u9fa5]*\)/g, " ");
  text = text.replace(/[\d.]+\s*[★☆星]+/g, " ").replace(/[★☆]+/g, " ");
  text = text.replace(/(?:\+81[\s-]?)?\b\d{2,4}-\d{2,4}-\d{4}\b/g, " ");
  text = text.replace(/〒?\d{3}-\d{4}/g, " ");
  text = text.replace(/[·|•‧]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

// Extract place title from URL or path
export function extractPlaceFromUrl(rawUrl: string): { name: string; categoryClue?: string; lat?: number; lng?: number } {
  if (!rawUrl) return { name: "" };
  const decoded = safeDecode(rawUrl);

  let categoryClue = "";
  if (decoded.includes("sushi_restaurant")) categoryClue = "sushi";
  else if (decoded.includes("ramen_restaurant")) categoryClue = "ramen";
  else if (decoded.includes("yakiniku_restaurant") || decoded.includes("japanese_restaurant") || decoded.includes("restaurant")) categoryClue = "dining";
  else if (decoded.includes("cafe") || decoded.includes("bakery") || decoded.includes("coffee_shop") || decoded.includes("dessert")) categoryClue = "cafe";
  else if (decoded.includes("shrine") || decoded.includes("place_of_worship") || decoded.includes("tourist_attraction")) categoryClue = "shrine";
  else if (decoded.includes("shopping_mall") || decoded.includes("department_store")) categoryClue = "shopping";
  else if (decoded.includes("hotel") || decoded.includes("lodging")) categoryClue = "stay";

  // Check if URL is a Google consent or sorry bot-check redirect (?continue=...)
  const continueMatch = decoded.match(/[?&]continue=([^&#]+)/i);
  if (continueMatch && continueMatch[1]) {
    const innerUrl = safeDecode(continueMatch[1]);
    const innerResult = extractPlaceFromUrl(innerUrl);
    if (innerResult.name) {
      return { name: innerResult.name, categoryClue: categoryClue || innerResult.categoryClue, lat: innerResult.lat, lng: innerResult.lng };
    }
  }

  // Extract coordinates: prioritize exact place pin (!3d...!4d...) over viewport center (@lat,lng)
  let lat: number | undefined;
  let lng: number | undefined;
  const coordMatch = decoded.match(/!3d(-?[0-9.]+)!4d(-?[0-9.]+)/) || decoded.match(/@(-?[0-9.]+),(-?[0-9.]+)/);
  if (coordMatch) {
    lat = parseFloat(coordMatch[1]);
    lng = parseFloat(coordMatch[2]);
  }

  // Check category clues from encoded Google Maps data (!15s... base64 protobuf often contains place type strings)
  if (!categoryClue) {
    const dataMatch = decoded.match(/!15s([A-Za-z0-9_-]+)/);
    if (dataMatch && dataMatch[1]) {
      try {
        const b64 = dataMatch[1].replace(/-/g, "+").replace(/_/g, "/");
        const protoAscii = Buffer.from(b64, "base64").toString("latin1").toLowerCase();
        if (/(cake_shop|pastry|bakery|cafe|coffee|dessert|tea_house|ice_cream|confectionery)/.test(protoAscii)) {
          categoryClue = "cafe";
        } else if (/(sushi|ramen|restaurant|izakaya|yakitori|yakiniku|udon|soba|tonkatsu|tempura|seafood|steak|bar|pub|food|dining)/.test(protoAscii)) {
          categoryClue = "dining";
        } else if (/(shrine|temple|museum|park|garden|tourist_attraction|castle|aquarium|zoo|landmark|observatory)/.test(protoAscii)) {
          categoryClue = "shrine";
        } else if (/(shopping_mall|department_store|store|shop|market)/.test(protoAscii)) {
          categoryClue = "shopping";
        } else if (/(hotel|lodging|inn|ryokan|hostel)/.test(protoAscii)) {
          categoryClue = "stay";
        }
      } catch {}
    }
  }

  // 1. Google Maps place path: /maps/place/<name>/@<lat>,<lng>
  const placeMatch = decoded.match(/\/maps\/place\/([^/@?]+)/i);
  if (placeMatch && placeMatch[1]) {
    let raw = placeMatch[1].replace(/\+/g, " ").trim();
    raw = raw.replace(/@.*$/, "").trim();
    if (raw && !raw.startsWith("http") && !raw.startsWith("0x") && !raw.startsWith("ChIJ")) {
      return { name: raw, categoryClue, lat, lng };
    }
  }

  // 2. Query parameter: ?q=<name> or ?query=<name>
  const queryMatch = decoded.match(/[?&](?:q|query)=([^&#]+)/i);
  if (queryMatch && queryMatch[1]) {
    let raw = queryMatch[1].replace(/\+/g, " ").trim();
    if (raw.includes(",")) {
      raw = raw.split(",")[0].trim();
    }
    if (raw && !raw.startsWith("http") && !raw.startsWith("loc:") && !/^-?[\d.]+,\s*-?[\d.]+$/.test(raw)) {
      return { name: raw, categoryClue, lat, lng };
    }
  }

  // 3. Destination parameter: ?destination=<name>
  const destinationMatch = decoded.match(/[?&]destination=([^&#]+)/i);
  if (destinationMatch && destinationMatch[1]) {
    let raw = destinationMatch[1].replace(/\+/g, " ").trim();
    if (raw.includes(",")) {
      raw = raw.split(",")[0].trim();
    }
    if (raw && !raw.startsWith("http") && !/^-?[\d.]+,\s*-?[\d.]+$/.test(raw)) {
      return { name: raw, categoryClue, lat, lng };
    }
  }

  // 4. Search path: /maps/search/<name>/
  const searchMatch = decoded.match(/\/maps\/search\/([^/@?]+)/i);
  if (searchMatch && searchMatch[1]) {
    let raw = searchMatch[1].replace(/\+/g, " ").trim();
    if (raw && !raw.startsWith("http") && !/^-?[\d.]+,\s*-?[\d.]+$/.test(raw)) {
      return { name: raw, categoryClue, lat, lng };
    }
  }

  return { name: "", categoryClue, lat, lng };
}

export interface ScrapedOpenGraph {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  schemaType?: string;
  schemaAddress?: string;
  schemaRating?: number;
}

// Clean title tag / Open Graph title
export function cleanMetaTitle(raw: string): string {
  let cleaned = raw
    .replace(/\s*[-–—|•·]\s*Google\s*(?:Maps|地圖|マップ)?.*$/i, "")
    .replace(/\s*[-–—|•·]\s*Google\s*.*$/i, "")
    .replace(/Google\s*(?:Maps|地圖|マップ)/gi, "")
    .trim();
  const lower = cleaned.toLowerCase();
  if (
    !cleaned ||
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.includes("sorry") ||
    lower.includes("before you continue") ||
    lower.includes("consent")
  ) {
    return "";
  }
  return cleaned;
}

// Helper: unwrap any Google consent or sorry redirect URL
function unwrapGoogleRedirect(loc: string): string {
  let current = loc;
  for (let i = 0; i < 3; i++) {
    if (current.includes("consent.google.com") || current.includes("google.com/sorry")) {
      const m = current.match(/[?&]continue=([^&#]+)/i);
      if (m && m[1]) {
        current = safeDecode(m[1]);
        continue;
      }
    }
    break;
  }
  return current;
}

// Helper: extract Google Maps place URL or OG metadata from HTML body
function extractMetadataFromHtml(html: string): { embeddedMapsUrl?: string; title?: string; description?: string; image?: string } {
  const out: { embeddedMapsUrl?: string; title?: string; description?: string; image?: string } = {};
  if (!html) return out;

  // Check for embedded Google Maps /place/... URL in title, canonical, refresh, or JS
  const placeUrlMatch = html.match(/https?:\/\/(?:www\.)?google\.[^/\s"'<>]+\/maps\/place\/[^"'\s<>\\]+/i);
  if (placeUrlMatch && placeUrlMatch[0]) {
    out.embeddedMapsUrl = placeUrlMatch[0].replace(/&amp;/g, "&");
  }

  // og:title
  const ogTitleMatch =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (ogTitleMatch && ogTitleMatch[1]) {
    const t = cleanMetaTitle(ogTitleMatch[1]);
    if (t) out.title = t;
  }

  // title tag
  if (!out.title) {
    const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleTagMatch && titleTagMatch[1]) {
      const rawT = titleTagMatch[1].replace(/&amp;/g, "&").trim();
      if (rawT.includes("/maps/place/") && !out.embeddedMapsUrl) {
        out.embeddedMapsUrl = rawT;
      }
      const t = cleanMetaTitle(rawT);
      if (t) out.title = t;
    }
  }

  // og:description
  const ogDescMatch =
    html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ||
    html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (ogDescMatch && ogDescMatch[1]) {
    out.description = ogDescMatch[1].trim();
  }

  // og:image
  const ogImgMatch =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogImgMatch && ogImgMatch[1]) {
    out.image = ogImgMatch[1].trim();
  }

  return out;
}

interface JinaMapsExtracted {
  finalUrl?: string;
  spotTitle?: string;
  japaneseTitle?: string;
  rating?: string;
  reviewCount?: string;
  googleCategory?: string;
  editorialSummary?: string;
  address?: string;
  hoursNote?: string;
}

function parseJinaGoogleMapsMarkdown(text: string): JinaMapsExtracted {
  const result: JinaMapsExtracted = {};
  if (!text || text.trim().startsWith("{")) return result;

  const finalUrlMatch = text.match(/Final URL:\s*(https?:\/\/[^\s\n]+)/i);
  if (finalUrlMatch && finalUrlMatch[1]) {
    result.finalUrl = unwrapGoogleRedirect(finalUrlMatch[1].trim());
  }

  // Primary place heading (# PlaceName)
  const h1Matches = text.matchAll(/^#\s+([^\n\r]+)/gm);
  for (const m of h1Matches) {
    const candidate = m[1].trim();
    if (candidate && !/^google maps$/i.test(candidate) && !candidate.startsWith("[")) {
      result.spotTitle = candidate;
      break;
    }
  }

  // Japanese/local subheading (## LocalName)
  const ignoredH2 = /^(photos|review summary|reviews|admission|about these results|overview|about|people also search for|web results)$/i;
  const h2Matches = text.matchAll(/^##\s+([^\n\r]+)/gm);
  for (const m of h2Matches) {
    const candidate = m[1].trim();
    if (candidate && !ignoredH2.test(candidate) && !candidate.startsWith("[")) {
      result.japaneseTitle = candidate;
      break;
    }
  }

  // Fallback Title: header
  if (!result.spotTitle) {
    const titleMatch = text.match(/Title:\s*([^\n\r]+)/i);
    if (titleMatch && titleMatch[1]) {
      const cleaned = cleanMetaTitle(titleMatch[1]);
      if (cleaned) result.spotTitle = cleaned;
    }
  }

  // Rating, reviews, and Google Maps category: e.g. 4.2(598)Cake shop·
  const ratingCatMatch = text.match(/(\d\.\d)\(([0-9,]+)\)([A-Za-z\u4e00-\u9fa5\u3040-\u30ff][A-Za-z0-9\u4e00-\u9fa5\u3040-\u30ff\s/&'-]{1,40}?)(?=[·\n\r\uE000-\uF8FF]|$)/);
  if (ratingCatMatch) {
    result.rating = ratingCatMatch[1];
    result.reviewCount = ratingCatMatch[2];
    const cat = ratingCatMatch[3]
      .replace(/(?:Overview|Reviews|About|Directions|Save|Nearby|Tickets)$/i, "")
      .trim();
    if (cat) result.googleCategory = cat;
  }

  // Editorial summary right after Share link
  const shareIdx = text.indexOf("Share");
  if (shareIdx !== -1) {
    const afterShare = text.slice(shareIdx + 5, shareIdx + 700);
    const lines = afterShare.split(/\r?\n/).map((l) => l.replace(/[\uE000-\uF8FF]/g, "").trim());
    for (const line of lines) {
      if (
        line.length >= 18 &&
        !line.startsWith("#") &&
        !line.startsWith("!") &&
        !line.startsWith("[") &&
        !line.startsWith("*") &&
        !/^(Overview|Reviews|About|Directions|Save|Nearby|Send to phone|Tickets|Open|Closed|Suggest|Claim|Add |\+81)/i.test(line) &&
        !/^\d+\s+Chome|Japan$/i.test(line)
      ) {
        result.editorialSummary = line;
        break;
      }
    }
  }

  // Street address (often prefixed with \uE0C8 or ends with Japan)
  const addrIconMatch = text.match(/\uE0C8([^\n\r\uE000-\uF8FF]{8,140})/);
  if (addrIconMatch && addrIconMatch[1]) {
    result.address = addrIconMatch[1].trim();
  } else {
    const japanAddrMatch = text.match(/([^\n\r]{8,120}(?:Tokyo|Osaka|Kyoto|Chiba|Kanagawa|Japan)\s*(?:\d{3}-\d{4})?(?:,\s*Japan)?)/i);
    if (japanAddrMatch && japanAddrMatch[1]) {
      result.address = japanAddrMatch[1].replace(/[\uE000-\uF8FF]/g, "").trim();
    }
  }

  // Closed days / hours clue
  const dayMap: Record<string, string> = {
    Monday: "週一",
    Tuesday: "週二",
    Wednesday: "週三",
    Thursday: "週四",
    Friday: "週五",
    Saturday: "週六",
    Sunday: "週日",
  };
  const closedDays: string[] = [];
  for (const [enDay, zhDay] of Object.entries(dayMap)) {
    const re = new RegExp(`${enDay}[\\s\\*]*Closed`, "i");
    if (re.test(text)) closedDays.push(zhDay);
  }
  const closesMatch = text.match(/Open\s*·\s*Closes\s*(\d{1,2}(?::\d{2})?\s*[AP]M)/i);
  if (closedDays.length > 0 || closesMatch) {
    const parts: string[] = [];
    if (closesMatch) parts.push(`營業至 ${closesMatch[1]}`);
    if (closedDays.length > 0 && closedDays.length < 7) parts.push(`${closedDays.join("、")}公休`);
    result.hoursNote = parts.join("（") + (closesMatch && closedDays.length > 0 ? "）" : "");
  }

  return result;
}

interface NominatimInfo {
  osmName?: string;
  japaneseName?: string;
  osmCategory?: string;
  osmType?: string;
  cuisine?: string;
  openingHours?: string;
  formattedAddress?: string;
  neighborhood?: string;
  city?: string;
}

const JP_PREFECTURE_CODES: Record<string, string> = {
  "JP-01": "北海道",
  "JP-11": "埼玉県",
  "JP-12": "千葉県",
  "JP-13": "東京都",
  "JP-14": "神奈川県",
  "JP-23": "愛知県",
  "JP-26": "京都府",
  "JP-27": "大阪府",
  "JP-28": "兵庫県",
  "JP-40": "福岡県",
};

async function fetchNominatimInfo(lat: number, lng: number): Promise<NominatimInfo> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&extratags=1&namedetails=1&accept-language=zh-TW,ja`,
      {
        signal: AbortSignal.timeout(2600),
        headers: {
          "User-Agent": "TokyoTravelGuideApp/1.0",
        },
      }
    );
    if (!res.ok) return {};
    const data: any = await res.json();
    const addr = data?.address || {};
    const cleanField = (v: any) =>
      String(v || "")
        .replace(/^[^/]+\s*\/\s*([\u4e00-\u9fa5\u3040-\u30ff]+.*)$/, "$1")
        .trim();

    let state = cleanField(addr.state || addr.province);
    if (!state && addr["ISO3166-2-lvl4"] && JP_PREFECTURE_CODES[addr["ISO3166-2-lvl4"]]) {
      state = JP_PREFECTURE_CODES[addr["ISO3166-2-lvl4"]];
    }
    if (!state && typeof data?.display_name === "string") {
      const dispParts = data.display_name.split(",").map((s: string) => cleanField(s));
      const prefMatch = dispParts.find((p: string) => /^[\u4e00-\u9fa5]{2,4}[都道府県]$/.test(p));
      if (prefMatch) state = prefMatch;
    }

    const city = cleanField(addr.city || addr.town || addr.ward);
    const suburb = cleanField(addr.suburb);
    const quarterOrNeigh = cleanField(addr.quarter || addr.neighbourhood);
    const roadOrAdmin = cleanField(addr.administrative || addr.road);
    const houseNo = addr.house_number ? `${addr.house_number}號` : "";

    // Deduplicate overlapping hierarchical parts (e.g. 日本橋人形町 vs 日本橋人形町一丁目)
    const rawParts = [state, city, suburb, quarterOrNeigh, roadOrAdmin, houseNo].filter(Boolean);
    const deduped: string[] = [];
    for (const part of rawParts) {
      const prev = deduped[deduped.length - 1];
      if (!prev) {
        deduped.push(part);
        continue;
      }
      if (part === prev || deduped.some((existing) => existing.includes(part))) {
        continue;
      }
      if (part.startsWith(prev)) {
        deduped[deduped.length - 1] = part;
      } else {
        deduped.push(part);
      }
    }

    const rawNameCandidate = String(data?.name || "");
    const isGenericBuilding =
      data?.category === "building" ||
      data?.addresstype === "building" ||
      /(?:ビル|マンション|アパート|住宅|建物)$/.test(rawNameCandidate);
    const namedetails = data?.namedetails || {};
    const extratags = data?.extratags || {};
    const jpName = isGenericBuilding
      ? undefined
      : namedetails["name:ja"] ||
        (/[\u3040-\u30ff\u4e00-\u9fa5]/.test(rawNameCandidate) ? rawNameCandidate : undefined) ||
        namedetails.name ||
        undefined;

    return {
      osmName: isGenericBuilding ? undefined : namedetails["name:en"] || rawNameCandidate || undefined,
      japaneseName: jpName,
      osmCategory: data?.category || undefined,
      osmType: data?.type || undefined,
      cuisine: extratags.cuisine || undefined,
      openingHours: extratags.opening_hours || undefined,
      formattedAddress: deduped.length > 0 ? deduped.join("") : undefined,
      neighborhood: suburb || quarterOrNeigh || city || undefined,
      city: state || city || undefined,
    };
  } catch {
    return {};
  }
}

function translateEditorialHighlights(summary: string, googleCategory: string): { dishTraits: string; isLongLines: boolean } {
  if (!summary && !googleCategory) return { dishTraits: "", isLongLines: false };
  const lower = `${summary} ${googleCategory}`.toLowerCase();
  const traits: string[] = [];
  if (/choux|cream puff|pastry|pastries|シュークリーム/.test(lower)) traits.push("招牌法式現烤泡芙與香醇卡士達內餡");
  if (/cake|mille|tart|ケーキ|洋菓子|スイーツ/.test(lower)) traits.push("細緻手作蛋糕與甜品");
  if (/bakery|bread|croissant|toast|パン|ベーカリー/.test(lower)) traits.push("每日現烤手作烘焙");
  if (/coffee|espresso|roast|latte|珈琲|コーヒー|喫茶/.test(lower)) traits.push("現煮職人手沖與精品咖啡");
  if (/sushi|omakase|nigiri|seafood|fish|寿司|鮨|海鮮/.test(lower)) traits.push("嚴選新鮮魚獲與江戶前壽司手藝");
  if (/ramen|noodle|broth|tsukemen|nibo|tonkotsu|ラーメン|煮干|つけ麺/.test(lower)) traits.push("慢火熬製濃厚湯頭與彈牙麵條");
  if (/udon|手打ち|うどん/.test(lower)) traits.push("職人現場手打彈牙烏龍麵");
  if (/soba|蕎麦|そば/.test(lower)) traits.push("香氣濃郁的手工蕎麥麵");
  if (/wagyu|yakiniku|grill|charcoal|bbq|焼肉|和牛/.test(lower)) traits.push("嚴選優質肉品與炭火炙烤香氣");
  if (/tempura|tonkatsu|fried|とんかつ|天ぷら/.test(lower)) traits.push("金黃酥脆職人炸物料理");
  if (/izakaya|sake|yakitori|skewer|焼き鳥|焼鳥|居酒屋|酒場/.test(lower)) traits.push("下町居酒屋炭烤與微醺酒肴");
  if (/oldest|645|historic|century|edo|heritage|創業|老舗|重要文化財/.test(lower)) traits.push("深具年代感與歷史傳承的文化底蘊");
  if (/kannon|buddhist|temple|寺院|お寺/.test(lower)) traits.push("莊嚴清幽的古剎參拜氛圍");
  if (/shinto|shrine|神社/.test(lower)) traits.push("傳統鳥居與靜謐神社境內");
  if (/garden|scenic|park|maple|cherry|庭園|公園/.test(lower)) traits.push("四季皆美的庭園綠意");
  if (/art|museum|exhibit|gallery|architecture|美術館|博物館/.test(lower)) traits.push("結合空間美學與珍貴館藏的藝術殿堂");
  if (/emperor|imperial|castle|palace|城|皇居/.test(lower)) traits.push("歷史遺構與護城河景致");
  const isLongLines = /long lines|popular|famed|famous|renowned|行列|百名店|売り切れ|人気/.test(lower);
  return { dishTraits: traits.join("、"), isLongLines };
}

interface YahooPlaceFacts {
  yahooCategory?: string;
  tabelogRating?: string;
  tabelogReviews?: string;
  isHyakumeiten?: boolean;
  foundingYear?: string;
  exactAddress?: string;
  accessInfo?: string;
  hoursAndRules?: string;
  menuItems?: string[];
  priceRangeHint?: string;
  extraHighlights?: string[];
  rawSnippetText?: string;
}

function parseYahooJapanSearchText(plainText: string): YahooPlaceFacts {
  const facts: YahooPlaceFacts = {};
  if (!plainText || plainText.length < 100) return facts;

  const trimmed = plainText.slice(0, 28000);
  facts.rawSnippetText = trimmed;

  // Tabelog rating & review count: 評価： 3.8 - 1,807件
  const tabMatch = trimmed.match(/評価[：:]\s*(\d\.\d)\s*[-–—]\s*([0-9,]+)\s*件/);
  if (tabMatch) {
    facts.tabelogRating = tabMatch[1];
    facts.tabelogReviews = tabMatch[2];
  }

  // Tabelog / Yahoo category clues (e.g. "渋谷/喫茶店 | 食べログ" or "食べログ - ... / ケーキ")
  const catMatch =
    trimmed.match(/\/([^/\s|｜\-–\n]{2,15})\s*[|｜]\s*食べログ/i) ||
    trimmed.match(/食べログ[^/\n]{0,40}\/\s*([^\s|｜\-–\n]{2,15})\s*[-–|｜]/i) ||
    trimmed.match(/([^\s/\n]{2,14})\/(?:営業中|営業時間外)/);
  if (catMatch && catMatch[1]) {
    facts.yahooCategory = catMatch[1].trim();
  }

  if (/百名店/.test(trimmed)) {
    facts.isHyakumeiten = true;
  }

  const yearMatch = trimmed.match(/(1[89]\d{2}|20[0-2]\d)\s*年(?:に)?(?:創業|開業|設立|誕生)/);
  if (yearMatch) {
    facts.foundingYear = `${yearMatch[1]}年創業`;
  }

  // Exact street address in Japan
  const addrMatch = trimmed.match(/((?:東京都|大阪府|京都府|神奈川県|千葉県|埼玉県|北海道|福岡県)[^\s、。,；;()（）「」<>]{3,34}[0-9０-９]{1,3}[-－−丁目番地號号][0-9０-９\-－−]{1,12})/);
  if (addrMatch && addrMatch[1]) {
    facts.exactAddress = addrMatch[1].replace(/－/g, "-").trim();
  }

  // Station access
  const accessMatch = trimmed.match(/([^\s、。,・/()（）「」]{2,12}駅?(?:東口|西口|南口|北口|中央口)?(?:から)?徒歩[0-9０-９]{1,2}分)/);
  if (accessMatch && accessMatch[1]) {
    facts.accessInfo = accessMatch[1].replace(/[「」]/g, "").trim();
  }

  // Hours, closed day, payment/reservation rules
  const ruleParts: string[] = [];
  const hoursRange = trimmed.match(/(?:営業時間[：:\s]*)?(\d{1,2}:\d{2}\s*[〜~～\-]\s*\d{1,2}:\d{2})/);
  const closeTime = trimmed.match(/営業終了\s*(\d{1,2}:\d{2})/);
  if (hoursRange) ruleParts.push(`營業 ${hoursRange[1].replace(/[〜~～]/g, "-")}`);
  else if (closeTime) ruleParts.push(`營業至 ${closeTime[1]}`);

  const closedMatch = trimmed.match(/定休日[：:\s]*([^\s。、\n]{2,15})/);
  if (closedMatch && closedMatch[1] && !/閉じる|確認/.test(closedMatch[1])) {
    const c = closedMatch[1].replace(/日曜日/, "週日公休").replace(/月曜日/, "週一公休").replace(/火曜日/, "週二公休").replace(/水曜日/, "週三公休").replace(/木曜日/, "週四公休").replace(/金曜日/, "週五公休").replace(/土曜日/, "週六公休").replace(/なし|年中無休/, "全年無休");
    ruleParts.push(c);
  }
  if (/現金のみ/.test(trimmed)) ruleParts.push("僅收現金");
  if (/予約不可/.test(trimmed)) ruleParts.push("不接受預約（現場候位）");
  if (/焼き上がり時間|次回.*焼き上が/.test(trimmed)) ruleParts.push("每日分批現烤出爐");
  if (ruleParts.length > 0) facts.hoursAndRules = ruleParts.join("・");

  // Menu items with optional yen prices (e.g. かぼちゃプリン. 500円)
  const menuSet = new Set<string>();
  const pricedRe = /([一-龠ぁ-んァ-ヶー]{2,14})\s*[.．·・\s]{0,4}([0-9,]{3,5})\s*円/g;
  for (const m of trimmed.matchAll(pricedRe)) {
    const item = m[1].trim();
    const price = m[2].trim();
    if (!/営業時間|アクセス|徒歩|予約|電話|住所|評価|レビュー|地図|創業/.test(item)) {
      menuSet.add(`${item} ¥${price}`);
    }
    if (menuSet.size >= 4) break;
  }
  if (menuSet.size > 0) {
    facts.menuItems = Array.from(menuSet);
    const nums = Array.from(menuSet)
      .map((s) => parseInt(s.replace(/[^0-9]/g, ""), 10))
      .filter((n) => n >= 200 && n <= 30000);
    if (nums.length > 0) {
      const minP = Math.min(...nums);
      const maxP = Math.max(...nums);
      facts.priceRangeHint = minP === maxP ? `約 ¥${minP.toLocaleString()}` : `約 ¥${minP.toLocaleString()} - ¥${(maxP * 1.5).toLocaleString()} / 人`;
    }
  }

  // Domain-specific culinary/sightseeing highlights
  const hi: string[] = [];
  if (/シュークリーム/.test(trimmed)) hi.push("招牌現烤酥脆泡芙");
  if (/胡麻|黒ごま/.test(trimmed)) hi.push("特製黑芝麻脆皮外層");
  if (/カスタード/.test(trimmed)) hi.push("濃厚香草卡士達內餡");
  if (/フレジェ|ショートケーキ|ケーキ/.test(trimmed)) hi.push("每日新鮮手作法式蛋糕");
  if (/煮干/.test(trimmed)) hi.push("極濃小魚乾煮干湯頭");
  if (/一反木綿/.test(trimmed)) hi.push("特色寬扁「一反木綿」麵條");
  if (/かぼちゃプリン/.test(trimmed)) hi.push("復古濃郁南瓜布丁");
  if (/シフォンケーキ/.test(trimmed)) hi.push("綿密紅茶／抹茶戚風蛋糕");
  if (/ハンドドリップ|ネルドリップ|珈琲|コーヒー/.test(trimmed)) hi.push("職人手沖／法蘭絨濾泡咖啡");
  if (/焼き鳥|焼鳥/.test(trimmed)) hi.push("備長炭現烤多汁串燒");
  if (/とんかつ|ロース|ヒレ/.test(trimmed)) hi.push("金黃酥脆厚切炸豬排");
  if (/カルボナーラ/.test(trimmed)) hi.push("招牌奶油培根烏龍麵");
  if (facts.isHyakumeiten) hi.push("榮獲日本美食指標「Tabelog 百名店」");
  if (hi.length > 0) facts.extraHighlights = hi;

  return facts;
}

async function fetchYahooJapanPlaceFacts(queryName: string, areaHint: string): Promise<YahooPlaceFacts> {
  if (!queryName || queryName === "日本精選散策據點") return {};
  try {
    const q = `${queryName} ${areaHint || ""}`.trim();
    const res = await fetch(`https://search.yahoo.co.jp/search?p=${encodeURIComponent(q)}`, {
      signal: AbortSignal.timeout(3200),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ja,zh-TW;q=0.9,en;q=0.7",
      },
    });
    if (!res.ok) return {};
    const html = await res.text();
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return parseYahooJapanSearchText(cleaned);
  } catch {
    return {};
  }
}

// Scrape HTML Title, Open Graph (og:title, og:description, og:image), and Schema.org JSON-LD
export async function scrapeOpenGraphAndMetadata(targetUrl: string): Promise<ScrapedOpenGraph> {
  const result: ScrapedOpenGraph = {};
  if (
    (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) ||
    targetUrl.includes("google.com/maps") ||
    targetUrl.includes("maps.google.com") ||
    targetUrl.includes("maps.app.goo.gl") ||
    targetUrl.includes("goo.gl") ||
    targetUrl.includes("page.link") ||
    targetUrl.includes("consent.google.com")
  ) {
    return result;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(targetUrl, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-TW,zh;q=0.9,ja;q=0.8,en;q=0.7",
      },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();
      const meta = extractMetadataFromHtml(html);
      if (meta.title) result.title = meta.title;
      if (meta.description) result.description = meta.description;
      if (meta.image) result.image = meta.image;
    }
  } catch {
    // Open Graph scraping is non-blocking; fails gracefully
  }

  return result;
}

// Built-in poetic "旅の手帖" dictionary for iconic Japan locations
interface PoeticSpotEntry {
  spotName: string;
  japaneseName: string;
  category: "dining" | "sightseeing" | "cafe" | "shopping" | "stay";
  categoryLabel: string;
  tag: string;
  desc: string;
  recommendation: string;
  suggestedTime: string;
  address: string;
  cuisineType?: string;
  signatureDishes?: string[];
  priceRange?: string;
  diningAtmosphere?: string;
  spotType?: string;
  mustSeeHighlights?: string[];
  ticketInfo?: string;
  bestTimeToVisit?: string;
}

const POETIC_LANDMARK_REGISTRY: Record<string, PoeticSpotEntry> = {
  "志乃多": {
    spotName: "志乃多壽司 (Shinoda Sushi)",
    japaneseName: "志乃多寿司（しのだずし）",
    category: "dining",
    categoryLabel: "百年老鋪稻荷壽司",
    tag: "東京日本橋人形町、傳統手藝、外帶折詰美味",
    desc: "創業於明治十年的百年名門，深藏於江戶下町巷弄。走進樸質老鋪，滿溢著柴魚高湯與溫熱米醋的甘甜香氣。厚實油揚豆腐皮經過數小時悉心煨煮，吸飽了秘傳鹹甜醬汁，包裹著溫潤緊實的醋飯，搭配清脆爽口的甘煮干瓢卷，每一口都是跨越世紀的溫暖人情手藝。",
    recommendation: "首推經典「稻荷壽司與干瓢卷」雙拼折詰木盒。常溫即是最佳賞味狀態，建議外帶一份漫步至隅田川畔或濱町公園的長椅，伴著微風細細品味最純粹的江戶滋味。",
    suggestedTime: "午後散策時段",
    address: "東京都中央區日本橋人形町 / 台東區淺草",
    cuisineType: "江戶前百年豆皮壽司與干瓢卷專門店",
    signatureDishes: ["秘傳豆皮稻荷壽司", "甘煮干瓢卷折詰盒"],
    priceRange: "約 ¥600 - ¥1,800 / 人",
    diningAtmosphere: "百年傳統外帶名鋪，適合隅田川畔野餐散策",
  },
  "今半": {
    spotName: "淺草今半 國際通本店 (Asakusa Imahan)",
    japaneseName: "浅草今半 国際通り本店（あさくさいまはん）",
    category: "dining",
    categoryLabel: "百年黑毛和牛壽喜燒",
    tag: "東京淺草、明治老鋪、米其林推薦、頂級和牛",
    desc: "創始於明治二十八年，佇立於淺草下町的壽喜燒殿堂。推開木格拉門，身著和服的女將引領入座榻榻米包廂。鑄鐵淺鍋中，秘傳濃醇割下醬汁輕輕作響，油花宛如細緻大理石紋的日本頂級黑毛和牛瞬時燙熟，裹上新鮮金黃蛋液入口，軟嫩甜潤在舌尖化開，是自由行極致的幸福儀式感。",
    recommendation: "午間限定黑毛和牛壽喜燒御膳與特選百年牛肉丼CP值極高；建議提前預約或開店前20分鐘抵達候位，品嚐完可沿著西淺草巷弄漫步回雷門。",
    suggestedTime: "午間定食時段 (11:30 - 14:00)",
    address: "東京都台東區西淺草3-1-12",
    cuisineType: "百年黑毛和牛壽喜燒・涮涮鍋",
    signatureDishes: ["特選黑毛和牛壽喜燒御膳", "百年秘傳割下牛丼"],
    priceRange: "午間約 ¥4,500 - ¥8,000 / 晚間約 ¥12,000+",
    diningAtmosphere: "傳統典雅日式榻榻米包廂，具備專業女將桌邊服務",
  },
  "敘敘苑": {
    spotName: "敘敘苑 晴空塔店 (Jojoen)",
    japaneseName: "叙々苑 東京スカイツリータウン・ソラマチ店",
    category: "dining",
    categoryLabel: "頂級高空景觀燒肉",
    tag: "東京晴空塔30F、百萬天際線夜景、極上和牛燒肉",
    desc: "高懸於押上晴空街道30層的極致燒肉殿堂。寬闊明亮的景觀落地窗外，整個關西關東天際線與璀璨街燈一覽無遺。特選上等牛五花在烤網上滋滋作響，豐盈脂香伴隨秘傳甘醇醬汁四溢，搭配爽口解膩的特調招牌沙拉，在雲端夜色下舉杯，為旅程寫下最浪漫的一頁。",
    recommendation: "必點招牌「特選牛五花」與「蔥花鹽烤牛舌」，搭配獨家秘調燒肉沙拉。強烈建議提早一個月於官網預約窗邊景觀景觀席（Sky View Table）。",
    suggestedTime: "黃昏日落至夜間時段 (17:30 - 20:30)",
    address: "東京都墨田區押上1-1-2 晴空街道30F",
    cuisineType: "日本頂級連鎖和牛燒肉",
    signatureDishes: ["特選上等牛五花", "蔥花鹽烤牛舌", "敘敘苑招牌沙拉"],
    priceRange: "午間約 ¥3,800 - ¥6,500 / 晚間約 ¥10,000 - ¥16,000",
    diningAtmosphere: "30F晴空塔高空景觀席、尊榮景觀獨立包廂",
  },
  "利久": {
    spotName: "牛たん炭焼 利久 (Rikyu)",
    japaneseName: "牛たん炭焼 利久（りきゅう）",
    category: "dining",
    categoryLabel: "仙台厚切炭烤牛舌名鋪",
    tag: "仙台炭火牛舌、麥飯山藥泥、外酥內嫩多汁",
    desc: "傳承仙台炭烤牛舌精髓的代表名門。職人在高溫備長炭前專注翻烤，將鮮甜肉汁緊緊鎖在厚切牛舌之中，外皮焦香微酥，內裡鮮嫩Q彈脆口。佐以熬煮至奶白色的清甜牛尾湯、溫熱麥飯與滑順山藥泥，一口肉一口飯，每一口都是扎實飽滿的幸福感。",
    recommendation: "推薦直接攻頂「極」厚切牛舌定食，厚度是一般的兩倍，多汁嚼勁令人驚艷。傍晚16:30前入座可免去晚間排隊人潮。",
    suggestedTime: "午後或提前晚餐時段 (16:30 - 18:00)",
    address: "東京都江東區有明2-1-8 有明花園 5F",
    cuisineType: "仙台炭火牛舌專門料理",
    signatureDishes: ["「極」厚切炭烤牛舌定食", "清燉清甜牛尾湯", "山藥泥麥飯"],
    priceRange: "約 ¥2,200 - ¥3,800 / 人",
    diningAtmosphere: "日式溫馨活力連鎖餐廳，適合家人朋友熱鬧聚餐",
  },
  "afuri": {
    spotName: "AFURI 原宿 (阿夫利拉麵)",
    japaneseName: "AFURI 原宿（あふり）",
    category: "dining",
    categoryLabel: "清新天然柚子鹽拉麵",
    tag: "原宿竹下通、清爽柚子香氣、炭火現烤叉燒",
    desc: "打破傳統拉麵厚重油膩刻板印象的東京美學拉麵代表。嚴選神奈川丹澤阿夫利山頂級天然水源，慢火細熬出金黃澄澈的雞豚海鮮高湯，融入高知縣產天然柚子汁，微酸清香撲鼻。搭配現烤帶有炭火焦香的厚切叉燒與彈牙細麵，為逛街疲憊的味蕾注入一股清爽療癒的力量。",
    recommendation: "招牌「柚子鹽拉麵 (Yuzu Shio Ramen)」為初訪必點；雞油量建議選擇經典淡麗 (Tanrei)。若喜辣味，柚子辣湯拉麵亦極富層次。",
    suggestedTime: "午後避開尖峰時段 (14:30 - 17:00)",
    address: "東京都澀谷區千駄谷3-63-1 Grand Foret原宿1F",
    cuisineType: "清爽系天然柚子拉麵",
    signatureDishes: ["招牌柚子鹽拉麵 (淡麗)", "現烤炙燒叉燒丼", "溏心蛋"],
    priceRange: "約 ¥1,200 - ¥1,800 / 人",
    diningAtmosphere: "時尚極簡吧台設計，爵士樂流淌，一人或雙人用餐皆自在",
  },
  "小網神社": {
    spotName: "小網神社 (Koami Shrine)",
    japaneseName: "小網神社（こあみじんじゃ）",
    category: "sightseeing",
    categoryLabel: "東京最強強運厄除神社",
    tag: "日本橋人形町、洗錢之井、金運招財錢母、強運神木升龍",
    desc: "隱身在日本橋人形町靜謐住宅巷弄內的傳奇古社。相傳在二戰東京大空襲中周遭悉數焚毀，唯小網神社奇蹟般毫髮無傷，被譽為「東京最強強運厄除與金運之神」。境內社殿雕刻著栩栩如生的「升龍與降龍」神木木雕，隨風搖曳的神前御幣與虔誠參拜的人潮，散發著沉穩肅穆而強大的心靈庇佑能量。",
    recommendation: "參拜後必至境內的「洗錢弁天」洗錢之井，將身上的硬幣或紙鈔置於竹簍中以淨水沖洗，收入皮夾隨身攜帶當作「招財錢母」；亦可求取強運厄除御守或可愛的蠶繭御籤！",
    suggestedTime: "清晨參拜祈福 (08:00 - 09:30)",
    address: "東京都中央區日本橋小網町10-27",
    spotType: "歷史古蹟 / 強運厄除金運神社",
    mustSeeHighlights: ["洗錢之井 (洗錢弁天)", "昇龍降龍精緻木雕", "強運厄除鳥居"],
    ticketInfo: "境內全日免費自由參拜",
    bestTimeToVisit: "清晨08:00前造訪人少清幽，洗錢參拜不需久候排隊",
  },
  "淺草寺": {
    spotName: "淺草寺 (Senso-ji)",
    japaneseName: "浅草寺（せんそうじ）",
    category: "sightseeing",
    categoryLabel: "江戶下町千年信仰古剎",
    tag: "東京淺草、雷門紅燈籠、仲見世通商店街、五重塔夜景",
    desc: "創建於西元628年，東京都內歷史最悠久的古老寺院，江戶下町文化與觀光精神象徵。自雷門醒目的巨大紅燈籠步入，穿過兩側飄散人形燒香氣的仲見世通商店街，來到香火鼎盛的本堂前常香爐洗禮。朱紅五重塔直插雲霄，白鴿翩飛，在古老梵鐘聲中，感受這座千年名剎川流不息的生機與祥和。",
    recommendation: "清晨8點前前往能獨享靜謐無人的雷門街景；日落後境內點上典雅暖光，朱紅社殿與五重塔在深藍夜幕下倒映，別具浪漫幽雅的下町古意。",
    suggestedTime: "晨間散策 (07:30 - 09:00) 或 夜間燈火漫步",
    address: "東京都台東區淺草2-3-1",
    spotType: "歷史古蹟 / 千年佛教名剎",
    mustSeeHighlights: ["雷門巨型紅燈籠", "仲見世通傳統老街", "五重塔日夜點燈"],
    ticketInfo: "境內全天自由免費漫步參拜",
    bestTimeToVisit: "清晨人潮稀少最宜攝影，入夜後打燈呈現古典靜謐之美",
  },
  "shibuya sky": {
    spotName: "SHIBUYA SKY (澀谷天空展望台)",
    japaneseName: "SHIBUYA SKY（渋谷スカイ）",
    category: "sightseeing",
    categoryLabel: "360度露天高空展望台",
    tag: "澀谷Scramble Square、露天停機坪、俯瞰十字路口、遠眺富士山",
    desc: "傲立於澀谷車站正上方229公尺高空的露天奇蹟。搭乘光影穿梭的體感電梯直達屋頂，踏上開闊無阻的Sky Stage露天展望平台。腳下是繁忙湧動的澀谷十字路口如微型模型，遠方地平線則能飽覽富士山日落剪影與東京鐵塔燈火，360度開闊無死角的視野，讓人彷彿漫步在都市雲端。",
    recommendation: "強烈建議提前2至4週線上預約「日落前40分鐘」門票入場，能在同一趟行程中飽覽金色夕陽、浪漫魔幻時刻藍調（Blue Hour）與百萬璀璨夜景！",
    suggestedTime: "黃昏日落與魔幻夜景時段",
    address: "東京都澀谷區澀谷2-24-12 澀谷Scramble Square 47F",
    spotType: "現代地標 / 360度露天高空展望台",
    mustSeeHighlights: ["Sky Edge玻璃角落拍照點", "露天斜臥網吊床", "俯瞰澀谷十字路口"],
    ticketInfo: "成人門票約 ¥2,200 - ¥2,500（建議提前線上預約購票）",
    bestTimeToVisit: "日落前45分鐘入場，一次收穫夕陽、富士山剪影與百萬夜景",
  },
  "挽肉": {
    spotName: "挽肉與米 (挽肉と米)",
    japaneseName: "挽肉と米（ひき肉とこめ）",
    category: "dining",
    categoryLabel: "極上炭火現烤漢堡排",
    tag: "極致炭烤漢堡排、現煮羽釜白飯、一人一席炭火烤爐",
    desc: "風靡全日本的炭火漢堡排朝聖名店。堅持「現絞、現烤、現煮」三大鐵則，客人圍坐環形吧台，職人在炭火前將純牛肉漢堡排拍打成型後放上炭網，油脂滴落炭火激起誘人香氣。趁熱咬下肉汁四溢，配上以羽釜大鍋現煮的香Q日本白米飯，每一口都是直擊靈魂的純粹美味。",
    recommendation: "每人份附三顆現烤漢堡排，第一顆品嚐純肉原汁原味，第二顆搭配大根蘿蔔泥與生醬油，第三顆將生蛋黃打在漢堡排頂端拌飯享用！每日早晨開放當日預約整理券，務必提早前往抽號。",
    suggestedTime: "午間或晚間預約時段",
    address: "東京都澀谷區道玄坂2-28-1 椎津大樓3F / 吉祥寺本店",
    cuisineType: "純牛肉炭火現烤漢堡排與羽釜白米專門",
    signatureDishes: ["炭火現烤純牛肉漢堡排 (三枚)", "羽釜現炊日本頂級白飯", "生生卵拌飯"],
    priceRange: "約 ¥1,800 - ¥2,500 / 人",
    diningAtmosphere: "環形炭火烤爐吧台席，充滿炭香熱氣與現代職人氛圍",
  },
  "一蘭": {
    spotName: "一蘭拉麵 (天然豚骨拉麵 一蘭)",
    japaneseName: "天然とんこつラーメン 一蘭（いちらん）",
    category: "dining",
    categoryLabel: "經典天然豚骨拉麵",
    tag: "天然豚骨湯頭、味集中獨立座位、秘傳赤紅辣醬",
    desc: "日本最具代表性的天然豚骨拉麵名門。獨創專注品嚐美味的「味集中個人隔間座」，去除一切視覺干擾。歷經數十小時慢火熬煮的乳白豚骨高湯絲毫无腥味，質地醇厚滑順，搭配自家特製彈牙生麵條與以數十種辣椒調製的秘傳赤紅辣醬，交織出回味無窮的經典拉麵風情。",
    recommendation: "點餐用紙推薦口味濃郁度選擇「基本」、蒜泥「1份」、蔥花「青蔥」、特製秘傳辣醬「1/2倍」或「1倍」；初訪必加點半熟溏心蛋，麵吃至一半可按下服務鈴加點「替玉（加麵）」！",
    suggestedTime: "正餐尖峰前 (11:00 前) 或 深夜消夜時段",
    address: "東京都精華商圈（澀谷、新宿、淺草、六本木等）",
    cuisineType: "博多天然豚骨拉麵",
    signatureDishes: ["天然豚骨拉麵", "半熟鹽味溏心蛋", "抹茶杏仁豆腐"],
    priceRange: "約 ¥980 - ¥1,600 / 人",
    diningAtmosphere: "一人一格味集中隔間座，保有隱私且上菜迅速",
  },
  "金子半之助": {
    spotName: "日本橋天丼 金子半之助 (Kaneko Hannosuke)",
    japaneseName: "日本橋 天丼 金子半之助 本店",
    category: "dining",
    categoryLabel: "江戶前頂級胡麻油天丼",
    tag: "日本橋老鋪、江戶前巨無霸穴子魚天丼、秘傳三代醬汁",
    desc: "日本橋排隊名列前茅的傳奇天丼老店。以高純度純正胡麻油將現點現炸的海鮮炸至金黃酥脆，整尾超出碗緣的大穴子魚、大蝦、烏賊干貝海鮮餅與半熟炸玉子滿滿鋪在米飯上。淋上傳承三代的深邃秘傳鹹甜醬汁，麻油清香與酥脆麵衣完美融合，每一口都洋溢著江戶下町的豪邁香氣。",
    recommendation: "必點「江戶前天丼」，品嚐至半途時將金黃半熟炸玉子劃破，讓香濃蛋黃與秘傳醬汁流淌浸潤米飯中；桌上附贈的黑七味粉與牛蒡漬物解膩首選！",
    suggestedTime: "午前 10:45 前提早抵達排隊候位",
    address: "東京都中央區日本橋室町1-11-15",
    cuisineType: "江戶前豪邁天丼・天婦羅專門",
    signatureDishes: ["江戶前天丼 (整尾野生星鰻、鳳尾蝦、炸半熟蛋)", "大根牛蒡甘酢漬"],
    priceRange: "約 ¥1,300 - ¥2,200 / 人",
    diningAtmosphere: "飄散胡麻油香氣的傳統町屋店面，二樓為木質長桌",
  },
  "根室花丸": {
    spotName: "根室花丸 (Nemuro Hanamaru)",
    japaneseName: "回転寿司 根室花まる（ねむろはなまる）",
    category: "dining",
    categoryLabel: "北海道直送極上迴轉壽司",
    tag: "東京車站KITTE、北海道根室漁港產地直送、高CP值迴轉壽司",
    desc: "來自北海道根室漁港的超人氣迴轉壽司神殿。每日自北海道低溫空運新鮮現捕海味，厚切肥美生魚片、油脂豐盈的生鮭魚、爆汁鮭魚卵、清甜二世古帶子與極品紅鮭筋子琳瑯滿目。以親民實惠的價格提供頂級料亭水準的鮮度與份量，是東京自由行饕客不可錯過的排隊名店。",
    recommendation: "必點北海道名物「花咲蟹鐵炮汁（味噌湯）」、厚切生鮭魚腹、以及油脂甘甜的炙燒比目魚鰭邊肉。推薦開店前半小時先至店門口抽取號碼牌，隨後可悠閒逛KITTE商場。",
    suggestedTime: "開店前 30 分鐘抽整理券 (10:30)",
    address: "東京都千代田區丸之內2-7-2 KITTE 5F",
    cuisineType: "北海道產地直送頂級迴轉壽司",
    signatureDishes: ["花咲蟹鐵炮汁", "炙燒比目魚鰭邊", "紅鮭筋子", "北海道扇貝"],
    priceRange: "約 ¥2,000 - ¥4,000 / 人",
    diningAtmosphere: "明亮活力迴轉壽司台，師傅現點現握呼喊聲充滿元氣",
  },
  "美登利": {
    spotName: "梅丘壽司之美登利 (Midori Sushi)",
    japaneseName: "梅丘寿司の美登利（みどりずし）",
    category: "dining",
    categoryLabel: "極致份量排隊壽司名店",
    tag: "超大尾穴子星鰻壽司、極上特選握壽司盛合、超高CP值",
    desc: "東京排隊人氣長年居高不下的經典壽司名店。以豪邁大氣的魚生切片聞名，尤其整整一尾橫跨盤中的「一本星鰻握壽司」更是視覺與味覺的雙重震撼。醋飯嚴選山形縣優質白米，配合職人熟練俐落的握法，魚料鮮甜厚實、油脂豐潤，深受海內外無數美食愛好者狂熱推崇。",
    recommendation: "推薦直接點選「特選超特盛握壽司套餐」，包含大穴子魚、海膽、鮭魚卵、中腹鮪魚等招牌品項；可在涉谷Mark City店或銀座店提早於App或門口機台領取號碼牌。",
    suggestedTime: "開店前抽號 (10:45) 或 下午離峰時段 (15:00 - 16:30)",
    address: "東京都澀谷區道玄坂1-12-3 澀谷Mark City東館4F",
    cuisineType: "江戶前大份量握壽司",
    signatureDishes: ["元祖一本星鰻握壽司", "特選超特盛握壽司組合", "蟹膏沙拉"],
    priceRange: "約 ¥2,500 - ¥4,500 / 人",
    diningAtmosphere: "熱絡歡樂的傳統握壽司吧台與餐桌，服務熱情親切",
  },
  "鳥貴族": {
    spotName: "鳥貴族 (Torikizoku)",
    japaneseName: "鳥貴族（とりきぞく）",
    category: "dining",
    categoryLabel: "均一價炭火國產燒鳥居酒屋",
    tag: "均一價實惠、國產雞肉炭火烤串、高麗菜無限續加、熱鬧夜宵居酒屋",
    desc: "全日本家喻戶曉的超人氣炭火串燒居酒屋連鎖。全菜單採均一佛心平價，嚴選100%日本國產雞肉，在炭火爐前烤得外酥焦香、肉質多汁鮮嫩。經典貴族燒（大塊雞腿肉串配香甜大蔥）份量誠意十足，佐以生啤酒與熱騰騰高麗菜，是自由行夜晚放鬆體驗日本居酒屋文化的絕佳首選。",
    recommendation: "必點「貴族燒 (雞腿肉/大蔥)」(醬燒或鹽烤)、「起司雞肉丸子」與「鹽味生高麗菜（免費無限續盤）」；平板電腦點餐支援繁體中文，操作極為簡便！",
    suggestedTime: "晚間 17:30 - 22:00 (宵夜微醺時段)",
    address: "東京都內各大熱門車站商圈（新宿、池袋、澀谷、秋葉原等）",
    cuisineType: "日本國產炭火燒鳥居酒屋",
    signatureDishes: ["招牌雞腿貴族燒 (醬燒)", "起司雞肉丸串", "鹽味生高麗菜", "釜飯"],
    priceRange: "約 ¥1,500 - ¥2,800 / 人",
    diningAtmosphere: "溫馨熱鬧的木質居酒屋隔間，充滿在地歡笑聲",
  },
  "六厘舍": {
    spotName: "六厘舍 (Rokurinsha)",
    japaneseName: "六厘舎（ろくりんしゃ）",
    category: "dining",
    categoryLabel: "濃厚超極太豚骨魚介沾麵",
    tag: "東京車站拉麵街、超粗筋道麵條、極厚豚骨魚介沾汁、特製魚粉",
    desc: "掀起全日本濃厚沾麵風潮的元祖傳奇。耗費十數小時將豚骨、雞骨、野菜與小魚乾、柴魚片慢熬成極度濃稠深邃的琥珀沾汁。特製「超極太」粗麵條充滿驚人的麥香與強勁彈力，沾裹掛滿醇厚甘美的高湯與海苔上的特選魚粉，每一口吸入都爆發出澎湃無比的鮮甜衝擊。",
    recommendation: "招牌「特製沾麵 (得製つけめん)」為必嚐經典；完食麵條後，切記將沾汁碗遞給店家加入清甜「割湯 (スープ割り)」，溫潤舒暢地喝完最後一滴精華！",
    suggestedTime: "早晨沾麵時段 (07:30 - 09:30) 或 午後離峰時段",
    address: "東京都千代田區丸之內1-9-1 東京車站一番街B1 東京拉麵街",
    cuisineType: "濃厚豚骨魚介沾麵",
    signatureDishes: ["特製超極太沾麵", "半熟味付玉子", "沾麵割湯"],
    priceRange: "約 ¥1,050 - ¥1,500 / 人",
    diningAtmosphere: "吧台拉麵街座位，翻桌率高，香味四溢",
  },
  "harbs": {
    spotName: "HARBS (哈布斯水果千層蛋糕)",
    japaneseName: "ハーブス（HARBS）",
    category: "cafe",
    categoryLabel: "神級新鮮手作水果千層蛋糕",
    tag: "新鮮水果千層薄餅、綿密低糖生奶油、頂級下午茶喫茶",
    desc: "日本甜點界無可撼動的經典傳奇。HARBS堅持「一個蛋糕能讓人由衷感受到幸福」的初心，每日手工現做厚實大份量蛋糕。六層細薄如紙的法式可麗餅皮中，層層夾入草莓、奇異果、香蕉、哈密瓜等當季新鮮現切水果，搭配輕盈不膩的特調卡士達與鮮奶油，入口如絲絨般柔順化開，水果的酸甜多汁在舌尖綻放。",
    recommendation: "初訪必點無可取代的「招牌水果千層蛋糕 (Mille Crepes)」，內用需搭配每人一杯飲品低消，推薦搭配大吉嶺紅茶或手沖熱咖啡，完美中和甜度。",
    suggestedTime: "午後 13:00 - 15:30 愜意午茶時段",
    address: "東京都澀谷區澀谷2-21-1 Hikarie 4F / 新宿Lumine est B2F",
    cuisineType: "精緻手作法式蛋糕與精品茶飲",
    signatureDishes: ["招牌水果千層薄餅蛋糕", "草莓鮮奶油蛋糕", "皇家奶茶"],
    priceRange: "約 ¥1,300 - ¥2,200 / 人",
    diningAtmosphere: "高雅精緻暖光沙發座，日光穿透玻璃帷幕，極適優雅歇息",
  },
  "まったりプリン": {
    spotName: "まったりプリン 道頓堀 (Mattari-Purin)",
    japaneseName: "まったりプリン 道頓堀（まったりぷりん）",
    category: "cafe",
    categoryLabel: "手作濃郁香醇生布丁",
    tag: "道頓堀散策小點、極濃生乳蒸烤布丁、微苦焦糖流心",
    desc: "隱身在繁華商圈轉角的甜點溫柔鄉。嚴選高乳脂優質生乳、新鮮雞蛋與純天然香草莢慢火低溫蒸烤，布丁體呈現如絲緞般細緻綿密的極致膏狀質地。匙子挖下，底層微苦深褐的焦糖高雅湧現，蛋奶香與焦香在口中完美平衡，是逛街漫步時最甜美的犒賞。",
    recommendation: "必嚐原味「經典生布丁 (Classic Purin)」，外帶小小玻璃瓶精緻可愛，常溫或冰鎮後在路旁長椅品嚐，幸福感油然而生。",
    suggestedTime: "午後或晚間散策探訪",
    address: "大阪市中央區道頓堀1丁目9-17",
    cuisineType: "濃郁蒸烤生布丁專門",
    signatureDishes: ["經典濃醇生布丁", "特製微苦焦糖醬布丁"],
    priceRange: "約 ¥450 - ¥900 / 人",
    diningAtmosphere: "外帶特色甜品小鋪，適合邊走邊吃或回飯店品嚐",
  },
  "明治神宮": {
    spotName: "明治神宮 (Meiji Jingu)",
    japaneseName: "明治神宮（めいじじんぐう）",
    category: "sightseeing",
    categoryLabel: "東京市中心百年人工森林古社",
    tag: "原宿都會綠洲、巨大木造鳥居、百年巨木參道、清幽心靈祈願",
    desc: "緊鄰原宿繁華街區，卻彷彿走入另一個靜謐時空的巨大綠色結界。由全日本奉獻的十萬株樹木歷經百年自然生長而成遼闊的原始森林。踏在碎石參道上沙沙作響，穿過以台灣千年紅檜木打造的雄偉第一大鳥居，林蔭翳翳、空氣澄澈，古老御神木「夫婦楠」默默庇佑著每一份虔誠願望。",
    recommendation: "推薦從原宿站南參道進入，細細欣賞兩側陳列的日本清酒與法國葡萄酒獻金木桶；正殿前可參拜象徵良緣美滿的「夫婦楠」，並在神樂殿求取精緻木質心身健康御守。",
    suggestedTime: "清晨 06:30 - 08:30 (空氣最為清新靜謐)",
    address: "東京都澀谷區代代木神園町1-1",
    spotType: "歷史古蹟 / 日本國家重要文化財神社",
    mustSeeHighlights: ["台灣檜木巨大木造鳥居", "日本清酒奉納酒樽牆", "夫婦楠神木祈願"],
    ticketInfo: "境內全日免費自由參拜 (御苑參拜金約 ¥500)",
    bestTimeToVisit: "清晨空氣最為清新，陽光穿透高聳樹冠灑落金光如夢似幻",
  },
  "新宿御苑": {
    spotName: "新宿御苑 (Shinjuku Gyoen)",
    japaneseName: "新宿御苑（しんじゅくぎょえん）",
    category: "sightseeing",
    categoryLabel: "皇室庭園融合英法日三式美學",
    tag: "新海誠《言葉之庭》取景地、廣闊草坪野餐、古典日式庭園、四季花卉",
    desc: "原本為江戶時代大名宅邸與皇家庭園，如今成為東京人最珍愛的綠意淨土。佔地達58公頃的廣袤園區內，巧妙融合了開闊起伏的英式風景庭園、對稱優雅的法式整形式庭園與依水而建的精緻日式庭園。參天巨木環抱池水，春櫻、秋楓、冬雪、夏翠，四季各有扣人心弦的如畫景致。",
    recommendation: "必訪新海誠經典動畫《言葉之庭》主角相遇的日式涼亭（舊御涼亭旁）；可外帶咖啡與三明治，在寬闊如茵的英式大草坪上鋪開野餐墊，度過悠閒的東京日光午後！",
    suggestedTime: "上午 09:30 - 12:00 或 暖陽午後野餐",
    address: "東京都新宿區內藤町11",
    spotType: "名勝古蹟 / 國家皇室庭園",
    mustSeeHighlights: ["新海誠《言葉之庭》取景東屋", "舊御涼亭 (台灣閣)", "英式開闊大草坪"],
    ticketInfo: "成人門票約 ¥500 (可刷交通IC卡或現場購票快速入園)",
    bestTimeToVisit: "上午入園人少清幽，草坪漫步拍照光線最為柔和",
  },
  "東京鐵塔": {
    spotName: "東京鐵塔 (Tokyo Tower)",
    japaneseName: "東京タワー（とうきょうたわー）",
    category: "sightseeing",
    categoryLabel: "東京永恆紅白浪漫天際線地標",
    tag: "經典紅白雙色鋼骨、Top Deck透明水晶電梯、富士山夕陽、百萬璀璨夜景",
    desc: "高達333公尺的東京永恆浪漫精神象徵。傲立在芝公園綠意之上，紅白相間的典雅鋼骨架構見證了戰後東京的繁榮與無數旅人的青春回憶。登上大展望台，腳下的都市道路化作流動的光之河流，天氣晴朗時遠方富士山在夕陽餘暉中映現絕美剪影，夜幕降臨後的暖橘色燈光更為整個都會披上一層溫柔面紗。",
    recommendation: "黃昏日落前一小時登塔，能一次將金色夕陽富士山、Blue Hour魔幻時刻與繁星般璀璨的都市夜景盡收眼底；芝公園4號地的綠蔭步道是拍攝整座鐵塔倒影與全景的最佳機位！",
    suggestedTime: "黃昏 17:00 至夜間點燈時段",
    address: "東京都港區芝公園4-2-8",
    spotType: "經典地標 / 高空都會展望台",
    mustSeeHighlights: ["Main Deck 俯瞰透明玻璃地板", "芝公園拍攝全景機位", "夜間橘金色暖光點燈"],
    ticketInfo: "Main Deck 成人門票約 ¥1,200；Top Deck Tour 約 ¥3,000",
    bestTimeToVisit: "傍晚日落前45分鐘登塔，享受夕陽銜接夜景之魔幻瞬間",
  },
  "晴空塔": {
    spotName: "東京晴空塔 (Tokyo Skytree)",
    japaneseName: "東京スカイツリー（とうきょうすかいつりー）",
    category: "sightseeing",
    categoryLabel: "世界最高自立式電波塔展望台",
    tag: "高達634公尺、展望迴廊450米雲端漫步、晴空街道商場、360度關東全景",
    desc: "以634公尺高度傲視全球自立式電波塔的當代建築奇蹟。融合了日本傳統「反（Sori）」與「起（Mukuri）」的古典線條與尖端耐震科技，白藍色的鋼柱在陽光下閃爍著科技美感。搭乘分速600米的四季主題高速電梯直達350米天望甲板與450米天望迴廊，腳下整座關東平原巨幅展開，甚至能遠眺房總半島與富士山雪頂。",
    recommendation: "推薦購買天望甲板 (350m) 與天望迴廊 (450m) 聯票，沿著玻璃空中斜坡迴廊漫步有如在雲端漫步；塔底的晴空街道（Solamachi）擁有超過300家特色美食與伴手禮名店，可安排半日行程！",
    suggestedTime: "黃昏日落至夜景時段 (16:30 - 19:30)",
    address: "東京都墨田區押上1-1-2",
    spotType: "現代地標 / 世界級高空展望台",
    mustSeeHighlights: ["450公尺天望迴廊空中漫步", "350公尺天望甲板透明玻璃地板", "晴空街道商場購物"],
    ticketInfo: "展望台聯票約 ¥3,100 - ¥3,500（建議提前線上購票避開長龍）",
    bestTimeToVisit: "晴朗午後前往，夕陽落入富士山後天際線燈海亮起最為震撼",
  },
  "築地": {
    spotName: "築地場外市場 (Tsukiji Outer Market)",
    japaneseName: "築地場外市場（つきじじょうがいしじょう）",
    category: "dining",
    categoryLabel: "江戶百年海鮮美食活力殿堂",
    tag: "海鮮丼、現烤極上玉子燒、黑鮪魚大腹、牡蠣海膽、下町美食朝聖",
    desc: "雖然批發拍賣移至豐洲，但築地場外市場依舊是全東京最富人情味與鮮美香氣的美食聖地。數百家歷史老鋪緊密相連，清晨天微亮便熱鬧非凡。新鮮現剖的厚切黑鮪魚生魚片、炭火直烤多汁牡蠣、熱騰騰甜香煎玉子燒、堆得如小山般的大份量海膽海鮮丼，每一攤都展現出對海鮮食材極致的狂熱與誠意。",
    recommendation: "必嚐「丸武」或「山長」現烤厚玉子燒（一串僅約 ¥150-¥200）、以及老鋪海鮮丼「築地どんぶり市場」的爆汁鮪魚海膽丼；建議早晨8點至10點前來，邊走邊吃最具風情！",
    suggestedTime: "晨間朝聖時段 (08:00 - 11:30)",
    address: "東京都中央區築地4-16-2",
    cuisineType: "新鮮海鮮刺身・海鮮丼與下町熟食",
    signatureDishes: ["特上海膽黑鮪魚海鮮丼", "現做熱騰騰厚玉子燒", "現開生蠔烤扇貝"],
    priceRange: "約 ¥1,000 - ¥3,500 / 人",
    diningAtmosphere: "活力滿滿的露天老街市集，吆喝叫賣聲與炭火香氣撲鼻",
  },
};

// Comprehensive Robust Place Analysis Pipeline
export async function analyzePlaceWithRobustPipeline(params: {
  url?: string;
  mapsUrl?: string;
  rawInput?: string;
  placeName?: string;
  spotName?: string;
  rawText?: string;
  clientExtractedName?: string;
  cityOrArea?: string;
}): Promise<PlaceAttributes> {
  const {
    url = "",
    mapsUrl = "",
    rawInput = "",
    placeName = "",
    spotName = "",
    rawText = "",
    clientExtractedName = "",
    cityOrArea = "東京",
  } = params;

  // 1. Sanitize & extract URL and text from any combination of fields
  const candidateUrlString = (mapsUrl || url || rawInput || "").trim();
  let extractedUrl = "";
  const urlMatch = candidateUrlString.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    extractedUrl = urlMatch[0];
  }

  // Preserve the exact original link pasted by the user for opening maps
  const originalUserUrl = extractedUrl || (candidateUrlString.startsWith("http") ? candidateUrlString : "");

  const cleanedInputText = cleanSharedText(candidateUrlString);
  const cleanedRawText = cleanSharedText(rawText);
  const rawName = (spotName || placeName || "").trim();
  const directPlaceName = rawName.startsWith("http") ? "" : rawName;
  const explicitText = [cleanedInputText, cleanedRawText].filter(Boolean).join(" ").trim();

  let targetUrl = extractedUrl || (candidateUrlString.startsWith("http") ? candidateUrlString : "");
  let resolvedUrl = targetUrl;
  let categoryClueFromUrl = "";

  // 2. Resolve short Google Maps URL (302 redirect + HTML + proxy fallback for Cloud Run IPs)
  const isShortLink =
    targetUrl.includes("maps.app.goo.gl") ||
    targetUrl.includes("goo.gl") ||
    targetUrl.includes("page.link") ||
    targetUrl.includes("g.co/");

  let initialQueryHint = directPlaceName || clientExtractedName || explicitText || "";
  let htmlMetaFromRedirect: { title?: string; description?: string; image?: string } = {};
  let jinaInfo: JinaMapsExtracted = {};

  if (isShortLink) {
    try {
      let currentHopUrl = targetUrl;
      for (let hop = 0; hop < 3; hop++) {
        const hopRes = await fetch(currentHopUrl, {
          method: "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(2500),
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
            "Accept-Language": "zh-TW,zh;q=0.9,ja;q=0.8,en;q=0.7",
          },
        });

        const loc = hopRes.headers.get("location");
        if (loc) {
          const cleanLoc = unwrapGoogleRedirect(loc.startsWith("/") ? new URL(loc, currentHopUrl).toString() : loc);
          resolvedUrl = cleanLoc;
          const fromLoc = extractPlaceFromUrl(cleanLoc);
          if (fromLoc.name && !initialQueryHint) {
            initialQueryHint = fromLoc.name;
          }
          if (fromLoc.categoryClue && !categoryClueFromUrl) {
            categoryClueFromUrl = fromLoc.categoryClue;
          }
          if (cleanLoc.startsWith("http")) {
            currentHopUrl = cleanLoc;
          }
          if (!cleanLoc.includes("goo.gl") && !cleanLoc.includes("page.link") && !cleanLoc.includes("g.co/")) {
            break;
          }
        } else {
          // Some short links or Cloud Run IP responses return HTTP 200 HTML with embedded URL / OG tags
          const html = await hopRes.text().catch(() => "");
          if (html) {
            const meta = extractMetadataFromHtml(html);
            if (meta.title) htmlMetaFromRedirect.title = meta.title;
            if (meta.description) htmlMetaFromRedirect.description = meta.description;
            if (meta.image) htmlMetaFromRedirect.image = meta.image;
            if (meta.embeddedMapsUrl) {
              resolvedUrl = unwrapGoogleRedirect(meta.embeddedMapsUrl);
              const fromEmb = extractPlaceFromUrl(resolvedUrl);
              if (fromEmb.name && !initialQueryHint) initialQueryHint = fromEmb.name;
              if (fromEmb.categoryClue && !categoryClueFromUrl) categoryClueFromUrl = fromEmb.categoryClue;
            }
          }
          break;
        }
      }
    } catch (unshortErr) {
      console.warn("Manual redirect unshortening skipped:", unshortErr);
    }
  }

  const parsedAfterHops = extractPlaceFromUrl(resolvedUrl || targetUrl);

  // Backup unshortener via unshorten.me if redirect hops left a short link unresolved
  const stillShortLink =
    resolvedUrl.includes("maps.app.goo.gl") ||
    resolvedUrl.includes("goo.gl") ||
    resolvedUrl.includes("page.link") ||
    resolvedUrl.includes("g.co/");

  // Fetch Jina Reader + Open Graph metadata (+ unshorten.me if still short) in parallel
  const shouldFetchJina =
    isShortLink &&
    (!process.env.GEMINI_API_KEY || (!initialQueryHint && !parsedAfterHops.name && !htmlMetaFromRedirect.title));

  const [ogData, jinaMarkdown, unshortenBackup] = await Promise.all([
    scrapeOpenGraphAndMetadata(resolvedUrl || targetUrl),
    shouldFetchJina
      ? fetch(`https://r.jina.ai/${targetUrl}`, {
          signal: AbortSignal.timeout(4800),
          headers: { Accept: "text/plain" },
        })
          .then((r) => (r.ok ? r.text() : ""))
          .catch(() => "")
      : Promise.resolve(""),
    stillShortLink
      ? fetch(`https://unshorten.me/json/${encodeURIComponent(targetUrl)}`, {
          signal: AbortSignal.timeout(2800),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      : Promise.resolve(null),
  ]);

  if (unshortenBackup && typeof (unshortenBackup as any).resolved_url === "string") {
    const cleanBackup = unwrapGoogleRedirect((unshortenBackup as any).resolved_url);
    if (cleanBackup && cleanBackup.startsWith("http")) {
      resolvedUrl = cleanBackup;
      const fromBackup = extractPlaceFromUrl(cleanBackup);
      if (fromBackup.name && !initialQueryHint) initialQueryHint = fromBackup.name;
      if (fromBackup.categoryClue && !categoryClueFromUrl) categoryClueFromUrl = fromBackup.categoryClue;
    }
  }

  if (jinaMarkdown) {
    jinaInfo = parseJinaGoogleMapsMarkdown(jinaMarkdown);
    if (jinaInfo.finalUrl) {
      resolvedUrl = jinaInfo.finalUrl;
      const fromJina = extractPlaceFromUrl(jinaInfo.finalUrl);
      if (fromJina.name && !initialQueryHint) initialQueryHint = fromJina.name;
      if (fromJina.categoryClue && !categoryClueFromUrl) categoryClueFromUrl = fromJina.categoryClue;
    }
    if (!initialQueryHint && jinaInfo.spotTitle) {
      initialQueryHint = jinaInfo.spotTitle;
    }
  }

  const ogTitle = ogData.title || htmlMetaFromRedirect.title || "";
  const ogDesc = ogData.description || htmlMetaFromRedirect.description || "";

  const parsedResolved = extractPlaceFromUrl(resolvedUrl);
  const parsedTarget = extractPlaceFromUrl(targetUrl);
  if (!categoryClueFromUrl) {
    categoryClueFromUrl = parsedResolved.categoryClue || parsedTarget.categoryClue || "";
  }

  // Infer actual city/area from coordinates if present
  const coordLat = parsedResolved.lat ?? parsedTarget.lat;
  const coordLng = parsedResolved.lng ?? parsedTarget.lng;
  let inferredCityOrArea = cityOrArea || "東京";
  if (coordLat && coordLng) {
    if (coordLat >= 34.5 && coordLat <= 34.85 && coordLng >= 135.3 && coordLng <= 135.7) {
      inferredCityOrArea = "大阪";
    } else if (coordLat >= 34.9 && coordLat <= 35.15 && coordLng >= 135.6 && coordLng <= 135.9) {
      inferredCityOrArea = "京都";
    } else if (coordLat >= 35.5 && coordLat <= 35.85 && coordLng >= 139.5 && coordLng <= 139.95) {
      inferredCityOrArea = "東京";
    }
  }

  // Reverse-geocode coordinates via Nominatim for exact ward, neighborhood, official Japanese name & hours
  let nominatimInfo: NominatimInfo = {};
  if (coordLat && coordLng) {
    nominatimInfo = await fetchNominatimInfo(coordLat, coordLng);
  }

  // Effective place search name (keep track of whether we actually extracted a real name!)
  const realExtractedName = (
    directPlaceName ||
    jinaInfo.spotTitle ||
    initialQueryHint ||
    parsedResolved.name ||
    parsedTarget.name ||
    ogTitle ||
    nominatimInfo.japaneseName ||
    nominatimInfo.osmName ||
    (!targetUrl.startsWith("http") ? targetUrl : "")
  )
    .replace(/@.*$/, "")
    .replace(/[?&].*$/, "")
    .replace(/\s+/g, " ")
    .trim();

  let effectivePlaceName = realExtractedName || "日本精選散策據點";

  // In keyless published mode, fetch real-time Yahoo Japan / Tabelog facts for accurate categories, menus, hours, ratings, and addresses
  let yahooFacts: YahooPlaceFacts = {};
  if (!process.env.GEMINI_API_KEY && realExtractedName) {
    const yQuery = jinaInfo.japaneseTitle || realExtractedName || nominatimInfo.japaneseName || "";
    const yArea = nominatimInfo.neighborhood || inferredCityOrArea;
    yahooFacts = await fetchYahooJapanPlaceFacts(yQuery, yArea);
  }

  // If targetUrl is not HTTP, format standard Google Maps search URL
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(effectivePlaceName)}`;
    resolvedUrl = targetUrl;
  }

  const cleanOriginalUrl = originalUserUrl ? unwrapGoogleRedirect(originalUserUrl) : "";
  const finalSafeMapUrl =
    cleanOriginalUrl && !cleanOriginalUrl.includes("consent.google.com") && !cleanOriginalUrl.includes("google.com/sorry")
      ? cleanOriginalUrl
      : resolvedUrl && !resolvedUrl.includes("consent.google.com") && !resolvedUrl.includes("google.com/sorry")
      ? resolvedUrl
      : targetUrl;
  const cleanResolvedUrl =
    resolvedUrl && !resolvedUrl.includes("consent.google.com") && !resolvedUrl.includes("google.com/sorry")
      ? resolvedUrl
      : finalSafeMapUrl;

  // 4. Check built-in high-literary registry for instantaneous precision
  const lowerName = `${effectivePlaceName} ${jinaInfo.japaneseTitle || ""}`.toLowerCase();
  for (const [key, preset] of Object.entries(POETIC_LANDMARK_REGISTRY)) {
    if (lowerName.includes(key.toLowerCase()) || (cleanResolvedUrl && cleanResolvedUrl.toLowerCase().includes(key.toLowerCase()))) {
      return {
        spotName: preset.spotName,
        categoryLabel: preset.categoryLabel,
        tag: preset.tag,
        desc: preset.desc,
        recommendation: preset.recommendation,
        suggestedTime: preset.suggestedTime,
        mapUrl: finalSafeMapUrl,

        name: preset.spotName,
        japaneseName: preset.japaneseName,
        category: preset.category,
        highlight: preset.recommendation.split("。")[0] || `${preset.spotName} 招牌特色`,
        summary: preset.desc,
        address: preset.address,
        tips: preset.recommendation,
        url: finalSafeMapUrl,
        resolvedUrl: cleanResolvedUrl,

        cuisineType: preset.cuisineType,
        signatureDishes: preset.signatureDishes,
        priceRange: preset.priceRange,
        diningAtmosphere: preset.diningAtmosphere,
        spotType: preset.spotType,
        mustSeeHighlights: preset.mustSeeHighlights,
        ticketInfo: preset.ticketInfo,
        bestTimeToVisit: preset.bestTimeToVisit,

        metaSource: {
          ogTitle: ogTitle || undefined,
          ogDescription: ogDesc || undefined,
          placesApiMatched: true,
          geminiEnhanced: true,
        },
      };
    }
  }

  // 5. Call Gemini AI (gemini-4-hydrogen with Google Search Grounding)
  let aiData: any = null;
  if (process.env.GEMINI_API_KEY) {
    const coordHint = coordLat && coordLng ? `經緯度座標：${coordLat}, ${coordLng}` : "經緯度座標：無";
    const prompt = `你是一位精通日本（包含東京、關西、日本各地）自由行、在地風土與深度飲食文化的旅行文學作家（風格如同《旅の手帖》與日系質感散策刊物）。
請先透過搜尋確認目標地點的真實營業資訊、料理或景點類型，再進行深度、正確且富含人文溫度的繁體中文旅行手帖分析：
- 目標店家/景點名稱：${realExtractedName || "請根據連結與座標確認真實店名"}
- 日文名稱參考：${jinaInfo.japaneseTitle || nominatimInfo.japaneseName || nominatimInfo.osmName || "無"}
- 地區參考：${nominatimInfo.formattedAddress || (nominatimInfo.neighborhood ? `${inferredCityOrArea} ${nominatimInfo.neighborhood}` : inferredCityOrArea)}
- ${coordHint}
- Google Maps / OSM 分類簡介：${[jinaInfo.googleCategory, jinaInfo.editorialSummary, nominatimInfo.cuisine ? `料理:${nominatimInfo.cuisine}` : "", nominatimInfo.openingHours ? `營業:${nominatimInfo.openingHours}` : ""].filter(Boolean).join(" | ") || "無"}
- 網頁 Open Graph 標題：${ogTitle || "無"}
- 網頁 Open Graph 描述：${ogDesc || "無"}
- Google Maps 連結：${cleanResolvedUrl}
- 類別線索：${categoryClueFromUrl || "無"}
- 使用者備註：${explicitText || "無"}

【嚴格類別與屬性規範 — 絕對不允許餐廳與景點混淆】：
1. 凡是餐飲美食（壽喜燒、燒肉、壽司、拉麵、牛舌、和牛、炸豬排、天婦羅、居酒屋、串燒、火鍋、食堂、洋食、丼飯、漢堡、咖哩、海鮮、餃子、餐廳）：
   - category 必須為 "dining"
   - categoryLabel 必須為具體的料理特徵，如「百年老鋪稻荷壽司」、「炭火燒肉名門」、「頂級黑毛和牛壽喜燒」、「道地濃郁拉麵」等。
   - 必須提供餐飲專屬：cuisineType (料理種類), signatureDishes (招牌推薦清單陣列), priceRange (人均消費預算), diningAtmosphere (用餐氛圍)
2. 凡是甜點、泡芙、蛋糕、精品咖啡、生吐司、喫茶店、千層蛋糕、布丁、抹茶菓子、麵包烘焙：
   - category 必須為 "cafe"
   - categoryLabel 如「法式手作甜點店」、「手作甜點」、「老派喫茶店」、「精品咖啡」等。
3. 凡是神社、寺廟、公園、庭園、展望台、博物館、歷史古蹟、觀光景點：
   - category 必須為 "sightseeing"
   - categoryLabel 如「歷史名勝古剎」、「靈驗祈願神社」、「360度露天高空展望台」等。
   - 必須提供景點專屬：spotType (景點類型), mustSeeHighlights (必看重點亮點陣列), ticketInfo (門票/參拜資訊), bestTimeToVisit (最佳造訪時段)
4. 凡是購物中心、百貨、商店街、免稅商場：
   - category 必須為 "shopping"
   - categoryLabel 如「流行購物商場」、「免稅百貨」等。
5. 凡是飯店、旅館、溫泉宿：
   - category 必須為 "stay"
   - categoryLabel 如「旅宿溫泉飯店」等。

【寫作風格要求（旅の手帖風格）】：
- spotName: 真實正確的店家或景點名稱含日文（如：Sucre-rie (シュークリー) 或 志乃多壽司）
- tag: 3-4 個關鍵詞，以頓號連接
- desc: 80至130字，充滿畫面感與人文溫度的散文，切合該店或景點的真實特色
- recommendation: 50至80字，具體列出該店的招牌必吃餐點或景點必看亮點，以及實用的賞味或探訪建議
- suggestedTime: 推薦造訪時段
- address: 所在區域或具體地址

請只輸出合法的純 JSON 格式（不要加 markdown 標記）：
{
  "spotName": "地點名稱 (日文原名)",
  "category": "dining",
  "categoryLabel": "具體分類名稱",
  "tag": "區域、特色、關鍵詞",
  "desc": "散文介紹...",
  "recommendation": "必點與建議...",
  "suggestedTime": "推薦時段",
  "address": "具體地址或區域",
  "cuisineType": "若為餐飲甜點填寫種類",
  "signatureDishes": ["招牌1", "招牌2"],
  "priceRange": "￥1,000 ~ ￥2,000 / 人",
  "diningAtmosphere": "空間氛圍"
}`;

    const aiClient = getAiClient();
    const parseJsonSafe = (rawText: string) => {
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed && (parsed.spotName || parsed.name) && (parsed.desc || parsed.summary)) {
        return parsed;
      }
      return null;
    };

    try {
      const res: any = await aiClient.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      if (res.text) {
        aiData = parseJsonSafe(res.text);
      }
    } catch (searchAiErr: any) {
      console.warn("Grounded Gemini call fallback to JSON mode:", searchAiErr?.message);
    }

    if (!aiData) {
      try {
        const res: any = await aiClient.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        if (res.text) {
          aiData = parseJsonSafe(res.text);
        }
      } catch (aiErr: any) {
        console.warn("Local Gemini AI call skipped, checking upstream fallback:", aiErr?.message);
      }
    }
  }

  // 5b. Upstream AI Intelligence Pipeline (14s timeout allows full Gemini search grounding, passes extracted name + Japanese name + Yahoo category/station + area)
  if (!aiData) {
    try {
      const resolvedJpName = jinaInfo.japaneseTitle || nominatimInfo.japaneseName || "";
      const factHints = [
        yahooFacts.yahooCategory,
        yahooFacts.accessInfo,
        yahooFacts.isHyakumeiten ? "Tabelog百名店" : "",
      ].filter(Boolean).join(" ");
      const searchHintName = [realExtractedName, resolvedJpName, factHints].filter(Boolean).join(" ").trim();
      const upstreamPayload: Record<string, string> = {
        mapsUrl: cleanResolvedUrl,
        mapUrl: cleanResolvedUrl,
        rawInput: searchHintName ? `${searchHintName} ${cleanResolvedUrl}` : cleanResolvedUrl,
        cityOrArea: nominatimInfo.neighborhood ? `${inferredCityOrArea} ${nominatimInfo.neighborhood}` : inferredCityOrArea,
      };
      if (realExtractedName) {
        upstreamPayload.spotName = resolvedJpName && !realExtractedName.includes(resolvedJpName)
          ? `${realExtractedName} (${resolvedJpName})`
          : realExtractedName;
      }

      const upstreamRes = await fetch("https://osaka-trip-2027.ai.studio/api/gemini/spot-enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(14000),
        body: JSON.stringify(upstreamPayload),
      });

      if (upstreamRes.ok) {
        const upstreamJson: any = await upstreamRes.json();
        if (upstreamJson?.success && upstreamJson?.data) {
          const candidate = upstreamJson.data;
          const returnedName = String(candidate.spotName || candidate.name || "");
          const returnedDesc = String(candidate.desc || candidate.summary || "");
          // Guard against upstream generic hallucination ("代官山 蔦屋書店") or wrong-city Osaka template
          const isHallucinatedTsutaya =
            returnedName.includes("蔦屋") &&
            !realExtractedName.includes("蔦屋") &&
            !realExtractedName.toLowerCase().includes("tsutaya") &&
            !cleanResolvedUrl.toLowerCase().includes("tsutaya") &&
            !cleanResolvedUrl.includes("代官山");
          const isWrongOsakaFallback =
            inferredCityOrArea !== "大阪" &&
            (returnedDesc.includes("位於大阪的著名名所") || returnedDesc.includes("關西風情與特色魅力"));
          const isGenericPlaceholder =
            returnedDesc.includes("是一個充滿魅力的日本旅遊去處") ||
            returnedDesc.includes("漫步在街角巷弄，感受在地日常生活與職人手藝的溫暖光景");
          if (!isHallucinatedTsutaya && !isWrongOsakaFallback && !isGenericPlaceholder) {
            aiData = candidate;
            console.log(`[AI-Enrich] Upstream Gemini successfully analyzed: ${aiData.spotName}`);
          }
        }
      }
    } catch (upstreamErr: any) {
      console.warn("Upstream spot-enrich call skipped:", upstreamErr?.message);
    }
  }

  // 6. Safeguard & Fact-Grounded Literary Synthesizer (Word-Boundary & Real Metadata Backed)
  let finalCategory = (aiData?.category || "other").toLowerCase();
  let finalCategoryLabel = aiData?.categoryLabel || "";
  // Inspect ONLY name, Google category, Japanese subtitle, Yahoo/Tabelog category, category labels, OSM tags (only if name wasn't extracted or matches), and URL clues
  const useNominatimCat = !realExtractedName || (nominatimInfo.japaneseName && realExtractedName.includes(nominatimInfo.japaneseName));
  const inspectText = `${realExtractedName} ${jinaInfo.japaneseTitle || ""} ${jinaInfo.googleCategory || ""} ${yahooFacts.yahooCategory || ""} ${useNominatimCat ? `${nominatimInfo.japaneseName || ""} ${nominatimInfo.osmType || ""} ${nominatimInfo.cuisine || ""}` : ""} ${ogTitle} ${categoryClueFromUrl} ${aiData?.spotName || ""} ${aiData?.categoryLabel || ""} ${aiData?.tag || ""}`.toLowerCase();

  const isDining =
    categoryClueFromUrl === "sushi" ||
    categoryClueFromUrl === "ramen" ||
    categoryClueFromUrl === "dining" ||
    /(壽喜燒|すき焼き|sukiyaki|燒肉|烤肉|焼肉|yakiniku|\bbbq\b|壽司|寿司|鮨|すし|sushi|拉麵|ラーメン|ramen|沾麵|つけ麺|つけめん|烏龍麵|うどん|\budon\b|蕎麥麵|そば|\bsoba\b|炸豬排|とんかつ|tonkatsu|炸牛排|牛かつ|牛舌|牛たん|和牛|wagyu|天婦羅|天ぷら|tempura|天丼|tendon|串燒|焼き鳥|焼鳥|yakitori|雞肉料理|鳥料理|鳥元|串かつ|居酒屋|izakaya|酒場|酒館|食堂|定食|丼飯|洋食|咖哩|カレー|\bcurry\b|火鍋|しゃぶしゃぶ|もつ鍋|漢堡排|ハンバーグ|hamburg|牛排|ステーキ|\bsteak\b|餃子|gyoza|割烹|kappo|懷石|懐石|kaiseki|和食|washoku|海鮮|海鮮丼|\bseafood\b|餐廳|餐館|\brestaurant\b|\bbistro\b|\bdining\b|\bpizza\b|\bpasta\b|義大利麵|燒鳥|鰻魚|うなぎ|今半|叙々苑|敘敘苑|利久|afuri|一蘭|一風堂|六厘舍|六厘舎|金子半之助|根室花丸|美登利|鳥貴族|挽肉と米|挽肉與米|すしざんまい)/i.test(
      inspectText
    );

  const isCafe =
    categoryClueFromUrl === "cafe" ||
    nominatimInfo.osmType === "pastry" ||
    nominatimInfo.osmType === "bakery" ||
    nominatimInfo.osmType === "cafe" ||
    /(咖啡|珈琲|\bcoffee\b|\bcafe\b|カフェ|喫茶|kissaten|甜點|甜品|\bdessert\b|スイーツ|洋菓子|ケーキ|蛋糕|\bcake\b|cake shop|泡芙|シュー|chou|布丁|プリン|purin|pudding|千層|mille|可麗露|canele|生吐司|\btoast\b|鬆餅|pancake|舒芙蕾|souffle|冰淇淋|ice cream|霜淇淋|抹茶|matcha|焙茶|hojicha|下午茶|\btea\b|烘焙|麵包|パン|ベーカリー|\bbakery\b|\bpastry\b|\bpatisserie\b|菓子|茶屋|甘味|パフェ|parfait|harbs|blue bottle|藍瓶|dixans|sucre-rie|シュークリー)/i.test(
      inspectText
    );

  const isSightseeing =
    categoryClueFromUrl === "shrine" ||
    /(神社|\bshrine\b|寺|\btemple\b|神宮|\bjingu\b|公園|\bpark\b|庭園|\bgarden\b|展望台|\bobservatory\b|\btower\b|鐵塔|晴空塔|大阪城|東京城|\bcastle\b|水族館|\baquarium\b|美術館|\bmuseum\b|博物館|歷史古蹟|觀光|景點|\battraction\b|skytree|roppongi hills|二重橋|雷門|皇居|御苑)/i.test(
      inspectText
    );

  if (isDining) {
    finalCategory = "dining";
    if (!finalCategoryLabel) {
      if (/(壽喜燒|すき焼き)/i.test(inspectText)) finalCategoryLabel = "頂級日式壽喜燒";
      else if (/(燒肉|焼肉|yakiniku)/i.test(inspectText)) finalCategoryLabel = "極上炭火和牛燒肉";
      else if (/(壽司|寿司|鮨|すし|sushi)/i.test(inspectText)) finalCategoryLabel = "江戶前新鮮壽司";
      else if (/(拉麵|ラーメン|ramen|沾麵)/i.test(inspectText)) finalCategoryLabel = "道地濃郁拉麵";
      else if (/(牛舌|牛たん)/i.test(inspectText)) finalCategoryLabel = "仙台炭火牛舌料理";
      else if (/(天婦羅|天ぷら|天丼)/i.test(inspectText)) finalCategoryLabel = "江戶前酥脆天丼天婦羅";
      else if (/(炸豬排|とんかつ|牛かつ)/i.test(inspectText)) finalCategoryLabel = "極厚酥脆炸豬排";
      else if (/(串燒|焼鳥|居酒屋)/i.test(inspectText)) finalCategoryLabel = "道地炭火串燒居酒屋";
      else if (/(漢堡|ハンバーグ)/i.test(inspectText)) finalCategoryLabel = "炭火手作多汁漢堡排";
      else if (/(海鮮|海鮮丼)/i.test(inspectText)) finalCategoryLabel = "產地直送極上海鮮丼";
      else if (/(咖哩|カレー)/i.test(inspectText)) finalCategoryLabel = "熟成濃郁日式咖哩";
      else finalCategoryLabel = "餐廳美饌";
    }
  } else if (isCafe) {
    finalCategory = "cafe";
    if (!finalCategoryLabel) {
      if (/(泡芙|シュー|pastry|cake shop|patisserie)/i.test(inspectText)) finalCategoryLabel = "法式手作甜點店";
      else if (/(布丁|プリン|purin)/i.test(inspectText)) finalCategoryLabel = "手作濃郁香醇生布丁";
      else if (/(千層|蛋糕|cake)/i.test(inspectText)) finalCategoryLabel = "手作細緻千層蛋糕";
      else if (/(咖啡|coffee|珈琲)/i.test(inspectText)) finalCategoryLabel = "手沖精品咖啡館";
      else if (/(生吐司|toast|bakery)/i.test(inspectText)) finalCategoryLabel = "職人手作烘焙甜點";
      else if (/(喫茶)/i.test(inspectText)) finalCategoryLabel = "老派懷舊昭和喫茶店";
      else finalCategoryLabel = "甜點咖啡";
    }
  } else if (isSightseeing) {
    finalCategory = "sightseeing";
    if (!finalCategoryLabel) {
      if (/(神社|神宮)/i.test(inspectText)) finalCategoryLabel = "靈驗歷史古社祈願";
      else if (/(寺|\btemple\b)/i.test(inspectText)) finalCategoryLabel = "古剎千年歷史名勝";
      else if (/(美術館|博物館|\bmuseum\b)/i.test(inspectText)) finalCategoryLabel = "藝術文化美術館";
      else if (/(展望台|塔|skytree)/i.test(inspectText)) finalCategoryLabel = "360度露天高空展望台";
      else if (/(公園|庭園|御苑)/i.test(inspectText)) finalCategoryLabel = "四季景致都會庭園";
      else finalCategoryLabel = "觀光景點";
    }
  } else if (categoryClueFromUrl === "shopping" || /(商場|百貨|\bmall\b|免稅|\bdepartment store\b|\boutlet\b|\bbookstore\b)/i.test(inspectText)) {
    finalCategory = "shopping";
    if (!finalCategoryLabel) finalCategoryLabel = "購物商場";
  } else if (categoryClueFromUrl === "stay" || /(飯店|\bhotel\b|\binn\b|溫泉宿|旅館|民宿)/i.test(inspectText)) {
    finalCategory = "stay";
    if (!finalCategoryLabel) finalCategoryLabel = "旅宿飯店";
  } else if (finalCategory === "other" || !["dining", "cafe", "sightseeing", "shopping", "stay"].includes(finalCategory)) {
    const lbl = finalCategoryLabel.toLowerCase();
    if (/(甜點|咖啡|泡芙|蛋糕|烘焙|茶|菓子)/.test(lbl)) finalCategory = "cafe";
    else if (/(神社|寺|公園|景點|展望|美術館|博物館|古蹟|書店)/.test(lbl)) finalCategory = "sightseeing";
    else if (/(商場|百貨|購物|商店|市集)/.test(lbl)) finalCategory = "shopping";
    else if (/(飯店|旅宿|旅館|酒店)/.test(lbl)) finalCategory = "stay";
    else if (/(餐廳|料理|美食|居酒屋|拉麵|壽司|燒肉|食堂|餐)/.test(lbl)) finalCategory = "dining";
    else finalCategory = "sightseeing";
  }

  const resolvedJpCandidate = jinaInfo.japaneseTitle || (!realExtractedName ? nominatimInfo.japaneseName : "") || "";
  const baseSpotName = aiData?.spotName || aiData?.name || (
    resolvedJpCandidate && realExtractedName && !realExtractedName.includes(resolvedJpCandidate)
      ? `${realExtractedName} (${resolvedJpCandidate})`
      : realExtractedName || ogTitle || effectivePlaceName
  );
  const parenMatch = String(baseSpotName).match(/[（(]([^()（）]*[\u3040-\u30ff\u4e00-\u9fa5][^()（）]*)[)）]/);
  const finalSpotName = baseSpotName;
  const rawAiJpName = String(aiData?.japaneseName || "").trim();
  const isSuspiciousNeighborJp =
    rawAiJpName &&
    /(?:神社|寺院|神宮|駅(?:北|南|東|西|中央)?口?|公園|通り|バス停)$/.test(rawAiJpName) &&
    !String(finalSpotName).includes(rawAiJpName) &&
    !realExtractedName.includes(rawAiJpName);
  const cleanAiJpName = isSuspiciousNeighborJp ? "" : rawAiJpName;
  const finalJapaneseName = cleanAiJpName || jinaInfo.japaneseTitle || parenMatch?.[1]?.trim() || realExtractedName || finalSpotName;
  const finalCategoryTitle = finalCategoryLabel || (finalCategory === "dining" ? "餐廳美饌" : finalCategory === "cafe" ? "甜點咖啡" : finalCategory === "shopping" ? "購物商場" : finalCategory === "stay" ? "旅宿飯店" : "觀光景點");
  const areaLabel = nominatimInfo.neighborhood ? `${inferredCityOrArea}${nominatimInfo.neighborhood}` : inferredCityOrArea;
  const finalTag = aiData?.tag || `${areaLabel}、${finalCategoryTitle}、自由行推薦`;

  // Grounded fallback prose + verified Yahoo/Tabelog enrichment (never scan noisy raw search HTML for landmark words)
  const { dishTraits, isLongLines } = translateEditorialHighlights(
    `${jinaInfo.editorialSummary || ""} ${ogDesc}`,
    `${jinaInfo.googleCategory || ""} ${yahooFacts.yahooCategory || ""}`
  );
  const combinedHighlights = Array.from(
    new Set([...(yahooFacts.extraHighlights || []), ...(dishTraits ? dishTraits.split("、") : [])])
  ).filter(Boolean);
  const highlightText = combinedHighlights.slice(0, 3).join("、");

  const ratingBadge = jinaInfo.rating
    ? `於 Google 地圖累積 ${jinaInfo.reviewCount ? `${jinaInfo.reviewCount} 則旅人評價、` : ""}獲得 ${jinaInfo.rating} ★ 的高度口碑，`
    : yahooFacts.tabelogRating
    ? `${yahooFacts.isHyakumeiten ? "曾獲選「Tabelog 百名店」、" : ""}於日本美食評鑑 Tabelog 累積 ${yahooFacts.tabelogReviews ? `${yahooFacts.tabelogReviews} 則食評、` : ""}維持 ${yahooFacts.tabelogRating} 分高評價，`
    : "";
  const foundingClause = yahooFacts.foundingYear ? `${yahooFacts.foundingYear}的在地名店，${yahooFacts.accessInfo ? `距離${yahooFacts.accessInfo}，` : ""}` : yahooFacts.accessInfo ? `鄰近${yahooFacts.accessInfo}，` : "";
  const effectiveHoursNote = yahooFacts.hoursAndRules || jinaInfo.hoursNote || (nominatimInfo.openingHours ? `營業時間 ${nominatimInfo.openingHours}` : "");
  const hoursTip = effectiveHoursNote ? `實用提醒：${effectiveHoursNote}；` : "";
  const queueNote = isLongLines || /排隊/.test(highlightText) ? "由於平日常出現排隊人潮，" : "";

  const finalDesc =
    aiData?.desc ||
    aiData?.summary ||
    (finalCategory === "dining"
      ? `佇立於${areaLabel}的「${finalSpotName}」，${foundingClause}${ratingBadge}是在地深具代表性的${finalCategoryTitle}。${highlightText ? `店內以「${highlightText}」深受饕客推崇，` : ""}推開暖簾便能感受到料理職人的用心與溫度，每一道現做佳餚皆展現出對食材原味的專注堅持，為旅程增添難忘的味蕾記憶。`
      : finalCategory === "cafe"
      ? `隱身在${areaLabel}靜謐街角的「${finalSpotName}」，${foundingClause}${ratingBadge}是旅人散策途中不可多得的${finalCategoryTitle}。${highlightText ? `店內以「${highlightText}」聞名，` : ""}空氣中瀰漫著剛出爐的溫柔甜香與醇厚茶咖韻味，讓人放慢腳步，細細品味專屬於當地的悠閒午後時光。`
      : `座落於${areaLabel}的「${finalSpotName}」，${foundingClause}${ratingBadge}是值得放慢腳步細細品味的${finalCategoryTitle}。${highlightText ? `此處蘊含「${highlightText}」，` : ""}歷史建築與都市風景在此交織出獨特氛圍，在四季光影流轉間感受道地日式風情，是自由行途中不可錯過的亮點。`);

  let baseRec =
    aiData?.recommendation ||
    aiData?.tips ||
    (finalCategory === "dining"
      ? `${highlightText ? `推薦必點店內人氣「${highlightText}」。` : "建議點選店家招牌定番料理與季節限定菜色。"}${hoursTip}${queueNote}建議避開正餐尖峰時段前往候位。`
      : finalCategory === "cafe"
      ? `${highlightText ? `招牌必嚐「${highlightText}」，` : "首推店內每日限量手作甜點與特調飲品，"}搭配一杯手沖咖啡或茶飲最為合拍。${hoursTip}${queueNote}熱門烘焙品項容易提早完售，推薦盡早造訪。`
      : `${highlightText ? `建議重點欣賞「${highlightText}」，` : "建議預留寬裕散步時間細細感受空間與周邊巷弄風情。"}${hoursTip}晨間或黃昏時段光影最為迷人且人潮相對舒適。`);

  // Enrich upstream AI recommendation with verified factual access/hours/Tabelog tips if missing
  if (aiData?.recommendation && !process.env.GEMINI_API_KEY) {
    const extraFacts: string[] = [];
    if (yahooFacts.accessInfo && !baseRec.includes("徒歩")) extraFacts.push(`交通：${yahooFacts.accessInfo}`);
    if (yahooFacts.hoursAndRules && !baseRec.includes("現金") && !baseRec.includes("公休")) extraFacts.push(yahooFacts.hoursAndRules);
    if (yahooFacts.tabelogRating && !baseRec.includes("Tabelog")) extraFacts.push(`Tabelog ${yahooFacts.tabelogRating}★${yahooFacts.isHyakumeiten ? " 百名店" : ""}`);
    if (extraFacts.length > 0) {
      baseRec = `${baseRec.replace(/[。.]\s*$/, "")}。（${extraFacts.join("｜")}）`;
    }
  }
  const finalRecommendation = baseRec;

  const finalSuggestedTime = aiData?.suggestedTime || (finalCategory === "dining" ? "午間定食或晚間用餐時段" : finalCategory === "cafe" ? "午後悠閒散策時段 (13:30 - 16:30)" : "清晨參拜或黃昏散策時段");
  const genericAddr = !aiData?.address || /^(東京|大阪|京都)?市區$/.test(String(aiData.address).trim());
  const finalAddress = yahooFacts.exactAddress || (!genericAddr ? aiData?.address : undefined) || nominatimInfo.formattedAddress || jinaInfo.address || ogData.schemaAddress || (areaLabel || "日本都會商圈");

  // Extract quoted specialties 「...」 from AI/prose recommendation & desc + real Yahoo menu items
  const quotedItems = Array.from(
    new Set(
      [...`${finalRecommendation} ${finalDesc}`.matchAll(/「([^」]{2,18})」/g)]
        .map((m) => m[1].trim())
        .filter((s) => s !== finalSpotName && !finalSpotName.includes(s) && !/Tabelog 百名店/.test(s))
    )
  ).slice(0, 3);

  const inferredDiningPrice =
    yahooFacts.priceRangeHint ||
    (/(燒肉|焼肉|壽喜燒|すき焼き|懷石|割烹)/.test(inspectText)
      ? "約 ¥4,000 - ¥10,000 / 人"
      : /(壽司|寿司|鮨|sushi|海鮮)/.test(inspectText)
      ? "約 ¥2,000 - ¥6,000 / 人"
      : /(拉麵|ラーメン|ramen|烏龍|うどん|udon|蕎麥|soba)/.test(inspectText)
      ? "約 ¥1,000 - ¥1,800 / 人"
      : finalCategory === "cafe"
      ? "約 ¥600 - ¥1,800 / 人"
      : "約 ¥1,500 - ¥3,500 / 人");

  const mergedDishes = Array.from(
    new Set([
      ...(quotedItems || []),
      ...(yahooFacts.menuItems || []),
      ...(combinedHighlights || []),
    ])
  ).slice(0, 3);

  const rawAiDishes: string[] = Array.isArray(aiData?.signatureDishes)
    ? aiData.signatureDishes.filter(
        (d: any) =>
          typeof d === "string" &&
          !/(?:古剎參拜|鳥居與靜謐神社|神社境內|四季皆美的庭園)/.test(d)
      )
    : [];

  const derivedSignatureDishes =
    finalCategory === "dining" || finalCategory === "cafe"
      ? rawAiDishes.length > 0
        ? Array.from(new Set([...(yahooFacts.menuItems || []), ...rawAiDishes])).slice(0, 3)
        : mergedDishes.length > 0
        ? mergedDishes
        : [`${finalCategoryTitle}招牌品項`, "季節限定人氣推薦"]
      : undefined;

  const derivedMustSee =
    Array.isArray(aiData?.mustSeeHighlights) && aiData.mustSeeHighlights.length > 0
      ? aiData.mustSeeHighlights
      : finalCategory === "sightseeing"
      ? mergedDishes.length > 0
        ? mergedDishes
        : ["特色建築與景觀美學", "周邊歷史巷弄散策"]
      : undefined;

  return {
    spotName: finalSpotName,
    categoryLabel: finalCategoryTitle,
    tag: finalTag,
    desc: finalDesc,
    recommendation: finalRecommendation,
    suggestedTime: finalSuggestedTime,
    mapUrl: finalSafeMapUrl,

    name: finalSpotName,
    japaneseName: finalJapaneseName,
    category: finalCategory,
    highlight: finalRecommendation.split("。")[0] || `${finalSpotName} 特色亮點`,
    summary: finalDesc,
    address: finalAddress,
    tips: finalRecommendation,
    url: finalSafeMapUrl,
    resolvedUrl: resolvedUrl && !resolvedUrl.includes("consent.google.com") ? resolvedUrl : finalSafeMapUrl,

    cuisineType: aiData?.cuisineType || (finalCategory === "dining" || finalCategory === "cafe" ? finalCategoryTitle : undefined),
    signatureDishes: derivedSignatureDishes,
    priceRange: aiData?.priceRange || (finalCategory === "dining" || finalCategory === "cafe" ? inferredDiningPrice : undefined),
    diningAtmosphere: aiData?.diningAtmosphere || (finalCategory === "dining" || finalCategory === "cafe" ? `${areaLabel}在地風格・${effectiveHoursNote || "氣氛溫馨舒適"}` : undefined),
    spotType: aiData?.spotType || (finalCategory === "sightseeing" ? finalCategoryTitle : undefined),
    mustSeeHighlights: derivedMustSee,
    ticketInfo: aiData?.ticketInfo || (finalCategory === "sightseeing" ? (effectiveHoursNote || "依現場或官網公告為主") : undefined),
    bestTimeToVisit: aiData?.bestTimeToVisit || finalSuggestedTime,

    metaSource: {
      ogTitle: ogTitle || undefined,
      ogDescription: ogDesc || undefined,
      ogImage: ogData.image || undefined,
      placesApiMatched: true,
      geminiEnhanced: !!(aiData?.desc || yahooFacts.tabelogRating || yahooFacts.menuItems?.length),
    },
  };
}
