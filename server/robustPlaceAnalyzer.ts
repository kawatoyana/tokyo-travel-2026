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
  category: "dining" | "sightseeing" | "cafe" | "shopping" | "stay" | "other" | string;
  categoryLabel: string;
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
export function extractPlaceFromUrl(rawUrl: string): { name: string; lat?: number; lng?: number } {
  if (!rawUrl) return { name: "" };
  const decoded = safeDecode(rawUrl);

  // 1. Google Maps place path: /maps/place/<name>/@<lat>,<lng>
  const placeMatch = decoded.match(/\/maps\/place\/([^/@?]+)/i);
  if (placeMatch && placeMatch[1]) {
    const raw = placeMatch[1].replace(/\+/g, " ").trim();
    if (raw && !raw.startsWith("http") && !raw.startsWith("0x") && !raw.startsWith("ChIJ")) {
      return { name: raw };
    }
  }

  // 2. Query parameter: ?q=<name> or ?query=<name>
  const queryMatch = decoded.match(/[?&](?:q|query)=([^&#]+)/i);
  if (queryMatch && queryMatch[1]) {
    const raw = queryMatch[1].replace(/\+/g, " ").trim();
    if (raw && !raw.startsWith("http") && !raw.startsWith("loc:") && !/^-?[\d.]+,[\d.]+$/.test(raw)) {
      return { name: raw };
    }
  }

  // 3. Search path: /maps/search/<name>/
  const searchMatch = decoded.match(/\/maps\/search\/([^/@?]+)/i);
  if (searchMatch && searchMatch[1]) {
    const raw = searchMatch[1].replace(/\+/g, " ").trim();
    if (raw && !raw.startsWith("http")) {
      return { name: raw };
    }
  }

  return { name: "" };
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

// Scrape HTML Title, Open Graph (og:title, og:description, og:image), and Schema.org JSON-LD
export async function scrapeOpenGraphAndMetadata(targetUrl: string): Promise<ScrapedOpenGraph> {
  const result: ScrapedOpenGraph = {};
  if (
    (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) ||
    targetUrl.includes("google.com/maps/search")
  ) {
    return result;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(targetUrl, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "zh-TW,zh;q=0.9,ja;q=0.8,en;q=0.7",
      },
    });

    clearTimeout(timeout);

    if (res.ok) {
      const html = await res.text();

      // og:title
      const ogTitleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        result.title = cleanMetaTitle(ogTitleMatch[1]);
      }

      // title tag fallback
      if (!result.title) {
        const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleTagMatch && titleTagMatch[1]) {
          result.title = cleanMetaTitle(titleTagMatch[1]);
        }
      }

      // og:description
      const ogDescMatch =
        html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i) ||
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      if (ogDescMatch && ogDescMatch[1]) {
        result.description = ogDescMatch[1].trim();
      }

      // og:image
      const ogImgMatch =
        html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (ogImgMatch && ogImgMatch[1]) {
        result.image = ogImgMatch[1].trim();
      }

      // Schema.org JSON-LD
      const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (jsonLdMatch && jsonLdMatch[1]) {
        try {
          const jsonLd = JSON.parse(jsonLdMatch[1]);
          if (jsonLd) {
            result.schemaType = jsonLd["@type"] || jsonLd.type;
            if (jsonLd.name && !result.title) {
              result.title = cleanMetaTitle(jsonLd.name);
            }
            if (jsonLd.address) {
              result.schemaAddress =
                typeof jsonLd.address === "string"
                  ? jsonLd.address
                  : jsonLd.address.streetAddress || jsonLd.address.addressLocality;
            }
            if (jsonLd.aggregateRating?.ratingValue) {
              result.schemaRating = Number(jsonLd.aggregateRating.ratingValue);
            }
          }
        } catch {}
      }
    }
  } catch (err) {
    // Open Graph scraping is non-blocking; fails gracefully
  }

  // Jina reader fallback if title not found
  if (!result.title && (targetUrl.includes("maps.app.goo.gl") || targetUrl.includes("goo.gl"))) {
    try {
      const jinaRes = await fetch(`https://r.jina.ai/${targetUrl}`, {
        signal: AbortSignal.timeout(3500),
        headers: { Accept: "text/plain" },
      });
      if (jinaRes.ok) {
        const jinaText = await jinaRes.text();
        const titleMatch = jinaText.match(/Title:\s*([^\n\r]+)/i);
        if (titleMatch && titleMatch[1]) {
          result.title = cleanMetaTitle(titleMatch[1]);
        }
      }
    } catch {}
  }

  return result;
}

// Clean title tag / Open Graph title
function cleanMetaTitle(raw: string): string {
  let cleaned = raw
    .replace(/\s*[-–—|•]\s*Google\s*(?:Maps|地圖|マップ)?.*$/i, "")
    .replace(/\s*[-–—|•]\s*Google\s*.*$/i, "")
    .replace(/Google\s*(?:Maps|地圖)/gi, "")
    .trim();
  if (cleaned.toLowerCase().includes("sorry") || cleaned.toLowerCase().includes("before you continue")) {
    return "";
  }
  return cleaned;
}

// Query Google Places API (New) Text Search if API key is configured
export async function queryGooglePlacesApiIfAvailable(
  placeName: string,
  locationHint: string = ""
): Promise<any | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey || !placeName) return null;

  try {
    const textQuery = `${placeName} ${locationHint || "東京"}`.trim();
    const endpoint = "https://places.googleapis.com/v1/places:searchText";

    const res = await fetch(endpoint, {
      method: "POST",
      signal: AbortSignal.timeout(4000),
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.types,places.primaryType,places.priceLevel,places.rating,places.userRatingCount,places.editorialSummary",
      },
      body: JSON.stringify({
        textQuery,
        languageCode: "zh-TW",
        maxResultCount: 1,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.places && data.places.length > 0) {
        return data.places[0];
      }
    }
  } catch (placesErr) {
    console.warn("Google Places API call skipped:", placesErr);
  }

  return null;
}

// Comprehensive Robust Place Analysis Pipeline
export async function analyzePlaceWithRobustPipeline(params: {
  url?: string;
  placeName?: string;
  rawText?: string;
  clientExtractedName?: string;
}): Promise<PlaceAttributes> {
  const { url = "", placeName = "", rawText = "", clientExtractedName = "" } = params;

  // 1. Sanitize & extract URL and text
  const inputStr = (url || "").trim();
  let extractedUrl = "";
  const urlMatch = inputStr.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    extractedUrl = urlMatch[0];
  }

  const cleanedInputText = cleanSharedText(inputStr);
  const cleanedRawText = cleanSharedText(rawText);
  const directPlaceName = (placeName || "").trim();
  const explicitText = [cleanedInputText, cleanedRawText].filter(Boolean).join(" ").trim();

  let targetUrl = extractedUrl || (inputStr.startsWith("http") ? inputStr : "");
  let resolvedUrl = targetUrl;

  // 2. Resolve short Google Maps URL if applicable
  const isShortLink =
    targetUrl.includes("maps.app.goo.gl") ||
    targetUrl.includes("goo.gl") ||
    targetUrl.includes("page.link") ||
    targetUrl.includes("g.co/");

  let initialQueryHint = directPlaceName || clientExtractedName || explicitText || "";

  if (isShortLink) {
    try {
      const hopRes = await fetch(targetUrl, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(2500),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
        },
      });
      const loc = hopRes.headers.get("location");
      if (loc) {
        resolvedUrl = loc;
        const fromLoc = extractPlaceFromUrl(loc);
        if (fromLoc.name) initialQueryHint = fromLoc.name;
      }
    } catch {}
  }

  // 3. Scrape Open Graph metadata & Title
  const ogData = await scrapeOpenGraphAndMetadata(resolvedUrl || targetUrl);
  const ogTitle = ogData.title || "";
  const ogDesc = ogData.description || "";

  // Effective place search name: Priority is direct place name > OG title > URL place hint
  const effectivePlaceName = (
    directPlaceName ||
    ogTitle ||
    initialQueryHint ||
    extractPlaceFromUrl(resolvedUrl).name ||
    extractPlaceFromUrl(targetUrl).name ||
    (!targetUrl.startsWith("http") ? targetUrl : "") ||
    "日本熱門景點"
  ).trim();

  // If no URL or target is not HTTP, format standard Google Maps search URL
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(effectivePlaceName)}`;
    resolvedUrl = targetUrl;
  }

  // 4. Query Google Places API (New) if key exists
  const placesApiResult = await queryGooglePlacesApiIfAvailable(effectivePlaceName, ogData.schemaAddress || "");
  const placesTypes = (placesApiResult?.types || []).join(" ");
  const placesPrimaryType = placesApiResult?.primaryType || "";

  // 5. Call Gemini 3.8 Flash with Open Graph + Places metadata grounded context
  let aiAttributes: Partial<PlaceAttributes> = {};
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `你是一位精通日本東京自由行、頂級料理與景點文化的資深嚮導。
請針對目標地點「${effectivePlaceName}」，依據以下真實網路與元數據進行深度繁體中文分析：
- 目標店家/景點名稱：${effectivePlaceName}
- 網頁 Open Graph 標題：${ogTitle || "無"}
- 網頁 Open Graph 描述：${ogDesc || "無"}
- Google Maps 連結：${resolvedUrl || targetUrl}
- Google Places 類別資訊：${placesPrimaryType} ${placesTypes}
- 使用者備註：${explicitText || "無"}

【分類判斷原則 — 絕對嚴格，嚴禁餐廳景點混淆】：
1. 凡是餐飲美食（燒肉、壽喜燒、壽司、拉麵、牛舌、和牛、炸豬排、天婦羅、居酒屋、串燒、火鍋、食堂、洋食、丼飯）：
   - category 必須為 "dining"
   - categoryLabel 必須為 "餐廳美饌"
   - 必須提供餐飲專屬屬性：cuisineType (料理種類), signatureDishes (必吃招牌菜推薦陣列), priceRange (人均消費預算), diningAtmosphere (用餐氛圍)
2. 凡是甜點、精品咖啡、生吐司、喫茶店、千層蛋糕、抹茶菓子：
   - category 必須為 "cafe"
   - categoryLabel 必須為 "甜點咖啡"
   - 提供 dessertType 與 signatureDishes
3. 凡是寺廟、神社、公園、庭園、展望台、博物館、歷史古蹟：
   - category 必須為 "sightseeing"
   - categoryLabel 必須為 "觀光景點"
   - 必須提供景點專屬屬性：spotType (景點類型), mustSeeHighlights (必看重點亮點陣列), ticketInfo (門票/參拜資訊), bestTimeToVisit (最佳造訪時段)
4. 凡是購物中心、百貨、商店街、免稅商場：
   - category 必須為 "shopping"
   - categoryLabel 必須為 "購物商場"
   - 提供 mallType 與 taxFreeInfo
5. 凡是飯店、旅館、溫泉宿：
   - category 必須為 "stay"
   - categoryLabel 必須為 "旅宿飯店"

【內容要求】：
- name: 繁體中文標準名稱（如：敘敘苑 晴空塔店、淺草今半 國際通本店、小網神社）
- japaneseName: 日文原名及假名（如：叙々苑（じょじょえん）、浅草今半（あさくさいまはん））
- highlight: 一句話招牌亮點（30字以內）
- summary: 2至3句話介紹核心特色、招牌料理或歷史（80至150字，具體寫出招牌菜或看點）
- address: 所在區域或具體地址（如：東京都墨田區押上1-1-2 晴空街道30F）
- tips: 1至2句自由行實用排隊、預約或避雷貼士

請嚴格輸出合法的純 JSON 格式：
{
  "name": "繁體中文名稱",
  "japaneseName": "日文原名及假名",
  "category": "dining",
  "categoryLabel": "餐廳美饌",
  "highlight": "一句話亮點",
  "summary": "深度介紹",
  "address": "地址商圈",
  "tips": "探訪貼步",
  "cuisineType": "黑毛和牛燒肉",
  "signatureDishes": ["極上牛五花", "厚切牛舌", "招牌特調沙拉"],
  "priceRange": "￥5,000 ~ ￥8,000",
  "diningAtmosphere": "30F晴空塔高空景觀、包廂窗邊席",
  "spotType": "歷史神社",
  "mustSeeHighlights": ["洗錢之井", "強運厄除鳥居", "升龍神木雕刻"],
  "ticketInfo": "境內免費參拜",
  "bestTimeToVisit": "早晨08:00前造訪人少清幽"
}`;

      const aiClient = getAiClient();
      const generatePromise = aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.15,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Gemini API call timed out (9s)")), 9000)
      );

      const res: any = await Promise.race([generatePromise, timeoutPromise]);

      const responseText = res.text?.trim() || "";
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed && parsed.name && parsed.summary) {
          aiAttributes = parsed;
        }
      }
    } catch (aiErr: any) {
      console.warn("Gemini call skipped or failed, using algorithmic baseline:", aiErr?.message);
    }
  }

  // 6. Algorithmic Fallback & Hard Enforcement Safeguards
  let finalCategory = (aiAttributes.category || "other").toLowerCase();
  let finalCategoryLabel = aiAttributes.categoryLabel || "其他探訪";

  const fullTextToInspect = `${effectivePlaceName} ${ogTitle} ${ogDesc} ${placesTypes} ${placesPrimaryType} ${aiAttributes.name || ""} ${aiAttributes.highlight || ""} ${aiAttributes.summary || ""}`.toLowerCase();

  // Hard Category Rule 1: Dining keywords ALWAYS force "dining"
  const diningTerms = [
    "燒肉", "烤肉", "壽司", "拉麵", "牛舌", "牛たん", "壽喜燒", "和牛", "居酒屋", "食堂",
    "串燒", "鰻魚", "天婦羅", "天丼", "漢堡排", "炸豬排", "火鍋", "涮涮鍋", "餐廳", "今半",
    "敘敘苑", "叙々苑", "利久", "afuri", "一蘭", "挽肉", "金子半之助", "割烹", "料亭",
    "restaurant", "sushi", "ramen", "yakiniku", "sukiyaki"
  ];
  if (diningTerms.some((t) => fullTextToInspect.includes(t))) {
    finalCategory = "dining";
    finalCategoryLabel = "餐廳美饌";
  } else if (
    fullTextToInspect.includes("咖啡") ||
    fullTextToInspect.includes("甜點") ||
    fullTextToInspect.includes("喫茶") ||
    fullTextToInspect.includes("生吐司") ||
    fullTextToInspect.includes("千層蛋糕") ||
    fullTextToInspect.includes("cafe") ||
    fullTextToInspect.includes("coffee") ||
    fullTextToInspect.includes("bakery")
  ) {
    finalCategory = "cafe";
    finalCategoryLabel = "甜點咖啡";
  } else if (
    fullTextToInspect.includes("神社") ||
    fullTextToInspect.includes("寺") ||
    fullTextToInspect.includes("宮") ||
    fullTextToInspect.includes("公園") ||
    fullTextToInspect.includes("庭園") ||
    fullTextToInspect.includes("展望台") ||
    fullTextToInspect.includes("塔") ||
    fullTextToInspect.includes("shrine") ||
    fullTextToInspect.includes("temple") ||
    fullTextToInspect.includes("museum") ||
    fullTextToInspect.includes("tower")
  ) {
    finalCategory = "sightseeing";
    finalCategoryLabel = "觀光景點";
  } else if (
    fullTextToInspect.includes("商場") ||
    fullTextToInspect.includes("百貨") ||
    fullTextToInspect.includes("購物") ||
    fullTextToInspect.includes("mall")
  ) {
    finalCategory = "shopping";
    finalCategoryLabel = "購物商場";
  } else if (
    fullTextToInspect.includes("飯店") ||
    fullTextToInspect.includes("旅館") ||
    fullTextToInspect.includes("hotel")
  ) {
    finalCategory = "stay";
    finalCategoryLabel = "旅宿飯店";
  }

  // Deduce specific attributes if not populated by Gemini:
  let finalCuisineType = aiAttributes.cuisineType;
  let finalSignatureDishes = aiAttributes.signatureDishes;
  let finalPriceRange = aiAttributes.priceRange;
  let finalDiningAtmosphere = aiAttributes.diningAtmosphere;

  let finalSpotType = aiAttributes.spotType;
  let finalMustSeeHighlights = aiAttributes.mustSeeHighlights;
  let finalTicketInfo = aiAttributes.ticketInfo;
  let finalBestTimeToVisit = aiAttributes.bestTimeToVisit;

  if (finalCategory === "dining") {
    if (!finalCuisineType) {
      if (fullTextToInspect.includes("燒肉") || fullTextToInspect.includes("敘敘苑") || fullTextToInspect.includes("叙々苑")) finalCuisineType = "高級和牛燒肉";
      else if (fullTextToInspect.includes("壽喜燒") || fullTextToInspect.includes("今半")) finalCuisineType = "百年和牛壽喜燒";
      else if (fullTextToInspect.includes("拉麵") || fullTextToInspect.includes("afuri") || fullTextToInspect.includes("一蘭")) finalCuisineType = "道地拉麵";
      else if (fullTextToInspect.includes("壽司") || fullTextToInspect.includes("志乃多")) finalCuisineType = "江戶前壽司名門";
      else if (fullTextToInspect.includes("牛舌") || fullTextToInspect.includes("利久")) finalCuisineType = "仙台厚切炭烤牛舌";
      else finalCuisineType = "道地和食美饌";
    }

    if (!finalSignatureDishes || finalSignatureDishes.length === 0) {
      if (fullTextToInspect.includes("燒肉") || fullTextToInspect.includes("敘敘苑")) finalSignatureDishes = ["極上牛五花", "厚切牛舌", "招牌特調燒肉沙拉"];
      else if (fullTextToInspect.includes("壽喜燒") || fullTextToInspect.includes("今半")) finalSignatureDishes = ["黑毛和牛壽喜燒", "百年割下醬汁", "牛肉丼定食"];
      else if (fullTextToInspect.includes("拉麵")) finalSignatureDishes = ["特製高湯拉麵", "炙燒叉燒肉", "溏心蛋"];
      else if (fullTextToInspect.includes("壽司")) finalSignatureDishes = ["油揚豆皮稻荷壽司", "甘甜干瓢卷", "特選綜合握壽司"];
      else if (fullTextToInspect.includes("牛舌")) finalSignatureDishes = ["「極」厚切炭烤牛舌", "麥飯山藥泥", "清燉牛尾湯"];
      else finalSignatureDishes = ["主廚特選料理", "當季招牌菜"];
    }

    if (!finalPriceRange) {
      if (fullTextToInspect.includes("燒肉") || fullTextToInspect.includes("今半")) finalPriceRange = "￥5,000 ~ ￥10,000 /人";
      else if (fullTextToInspect.includes("拉麵") || fullTextToInspect.includes("壽司")) finalPriceRange = "￥1,000 ~ ￥2,500 /人";
      else finalPriceRange = "￥2,000 ~ ￥5,000 /人";
    }

    if (!finalDiningAtmosphere) {
      if (fullTextToInspect.includes("晴空塔")) finalDiningAtmosphere = "30F晴空塔高空景觀席、獨立包廂";
      else if (fullTextToInspect.includes("今半")) finalDiningAtmosphere = "明治百年老鋪、和風典雅包廂";
      else finalDiningAtmosphere = "溫馨熱絡、旅人共享首選";
    }
  } else if (finalCategory === "sightseeing") {
    if (!finalSpotType) {
      if (fullTextToInspect.includes("神社") || fullTextToInspect.includes("寺")) finalSpotType = "靈驗歷史神社寺院";
      else if (fullTextToInspect.includes("塔") || fullTextToInspect.includes("展望台")) finalSpotType = "地標現代高空展望台";
      else if (fullTextToInspect.includes("庭園") || fullTextToInspect.includes("公園")) finalSpotType = "都會皇家庭園景致";
      else finalSpotType = "歷史文化散策景點";
    }

    if (!finalMustSeeHighlights || finalMustSeeHighlights.length === 0) {
      if (fullTextToInspect.includes("小網神社")) finalMustSeeHighlights = ["洗錢之井招財錢母", "強運厄除鳥居", "升龍降龍木雕"];
      else if (fullTextToInspect.includes("淺草寺")) finalMustSeeHighlights = ["雷門巨大紅燈籠", "仲見世通商店街", "五重塔日夜景致"];
      else if (fullTextToInspect.includes("晴空塔")) finalMustSeeHighlights = ["360度東京天際線", "富士山絕景剪影", "Solamachi商場"];
      else if (fullTextToInspect.includes("新宿御苑")) finalMustSeeHighlights = ["秋末滿開金黃銀杏林", "池畔倒映紅楓景致", "英日式皇家庭園"];
      else finalMustSeeHighlights = ["四季迷人人文風采", "建築歷史巡禮"];
    }

    if (!finalTicketInfo) {
      if (fullTextToInspect.includes("神社") || fullTextToInspect.includes("寺") || fullTextToInspect.includes("皇居")) finalTicketInfo = "境內免費自由參拜漫步";
      else if (fullTextToInspect.includes("新宿御苑")) finalTicketInfo = "成人入園門票 500日圓";
      else if (fullTextToInspect.includes("晴空塔") || fullTextToInspect.includes("鐵塔")) finalTicketInfo = "展望台需購票入場（建議提前線上預約）";
      else finalTicketInfo = "免費參觀或現場公告為準";
    }

    if (!finalBestTimeToVisit) {
      if (fullTextToInspect.includes("神社") || fullTextToInspect.includes("寺")) finalBestTimeToVisit = "清晨08:00前參拜人少清幽、最為莊嚴";
      else if (fullTextToInspect.includes("展望台") || fullTextToInspect.includes("塔")) finalBestTimeToVisit = "日落前半小時上塔，飽覽夕陽富士山與璀璨夜景";
      else finalBestTimeToVisit = "上午或午後悠閒漫步體驗最佳";
    }
  }

  // 7. Compose finalized structured place data
  const finalName = aiAttributes.name || ogTitle || effectivePlaceName;
  const finalSummary =
    aiAttributes.summary ||
    ogDesc ||
    (finalCategory === "dining"
      ? `${finalName} 是備受推崇的道地美饌名店，以新鮮食材與精湛廚藝呈現頂級和風美味，深受在地人與旅伴喜愛。`
      : `${finalName} 位於東京都內，景致優美且富含深厚文化氛圍，非常適合安排在自由行漫遊路線中細細體驗。`);

  const finalHighlight =
    aiAttributes.highlight ||
    (finalCategory === "dining"
      ? `${finalName} 招牌現烤風味與道地料理`
      : `${finalName} 人氣必訪特色與古典散策勝地`);

  const finalTips =
    aiAttributes.tips ||
    (finalCategory === "dining"
      ? "熱門用餐時段建議提早前往或避開尖峰候位；可點選地圖確認最新營業動態與公休日。"
      : "造訪前可開啟地圖再次確認開放時間；清晨或午後時段散步參觀最為舒適悠閒。");

  return {
    url: targetUrl,
    resolvedUrl,
    name: finalName,
    japaneseName: aiAttributes.japaneseName || finalName,
    category: finalCategory,
    categoryLabel: finalCategoryLabel,
    highlight: finalHighlight,
    summary: finalSummary,
    address: aiAttributes.address || ogData.schemaAddress || "東京都內",
    tips: finalTips,

    // Specific Attributes for Dining
    cuisineType: finalCuisineType,
    signatureDishes: finalSignatureDishes,
    priceRange: finalPriceRange,
    diningAtmosphere: finalDiningAtmosphere,

    // Specific Attributes for Sightseeing
    spotType: finalSpotType,
    mustSeeHighlights: finalMustSeeHighlights,
    ticketInfo: finalTicketInfo,
    bestTimeToVisit: finalBestTimeToVisit,

    // Specific Attributes for Cafe / Shopping
    dessertType: aiAttributes.dessertType,
    mallType: aiAttributes.mallType,
    taxFreeInfo: aiAttributes.taxFreeInfo,

    metaSource: {
      ogTitle: ogTitle || undefined,
      ogDescription: ogDesc || undefined,
      ogImage: ogData.image || undefined,
      schemaType: ogData.schemaType || undefined,
      placesApiMatched: !!placesApiResult,
      geminiEnhanced: !!aiAttributes.summary,
    },
  };
}
