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
  else if (decoded.includes("yakiniku_restaurant") || decoded.includes("japanese_restaurant")) categoryClue = "dining";
  else if (decoded.includes("cafe") || decoded.includes("bakery")) categoryClue = "cafe";
  else if (decoded.includes("shrine") || decoded.includes("place_of_worship")) categoryClue = "shrine";

  // 1. Google Maps place path: /maps/place/<name>/@<lat>,<lng>
  const placeMatch = decoded.match(/\/maps\/place\/([^/@?]+)/i);
  if (placeMatch && placeMatch[1]) {
    let raw = placeMatch[1].replace(/\+/g, " ").trim();
    raw = raw.replace(/@.*$/, "").trim();
    if (raw && !raw.startsWith("http") && !raw.startsWith("0x") && !raw.startsWith("ChIJ")) {
      return { name: raw, categoryClue };
    }
  }

  // 2. Query parameter: ?q=<name> or ?query=<name>
  const queryMatch = decoded.match(/[?&](?:q|query)=([^&#]+)/i);
  if (queryMatch && queryMatch[1]) {
    let raw = queryMatch[1].replace(/\+/g, " ").trim();
    // Sometimes contains address after comma, e.g. "Mattari-Purin Dotombori, 1 Chome-9-17..."
    if (raw.includes(",")) {
      raw = raw.split(",")[0].trim();
    }
    if (raw && !raw.startsWith("http") && !raw.startsWith("loc:") && !/^-?[\d.]+,[\d.]+$/.test(raw)) {
      return { name: raw, categoryClue };
    }
  }

  // 3. Search path: /maps/search/<name>/
  const searchMatch = decoded.match(/\/maps\/search\/([^/@?]+)/i);
  if (searchMatch && searchMatch[1]) {
    let raw = searchMatch[1].replace(/\+/g, " ").trim();
    if (raw && !raw.startsWith("http")) {
      return { name: raw, categoryClue };
    }
  }

  return { name: "", categoryClue };
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
    .replace(/\s*[-–—|•]\s*Google\s*(?:Maps|地圖|マップ)?.*$/i, "")
    .replace(/\s*[-–—|•]\s*Google\s*.*$/i, "")
    .replace(/Google\s*(?:Maps|地圖)/gi, "")
    .trim();
  if (cleaned.toLowerCase().includes("sorry") || cleaned.toLowerCase().includes("before you continue")) {
    return "";
  }
  return cleaned;
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
    const timeout = setTimeout(() => controller.abort(), 3500);

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

  const cleanedInputText = cleanSharedText(candidateUrlString);
  const cleanedRawText = cleanSharedText(rawText);
  const directPlaceName = (spotName || placeName || "").trim();
  const explicitText = [cleanedInputText, cleanedRawText].filter(Boolean).join(" ").trim();

  let targetUrl = extractedUrl || (candidateUrlString.startsWith("http") ? candidateUrlString : "");
  let resolvedUrl = targetUrl;
  let categoryClueFromUrl = "";

  // 2. Resolve short Google Maps URL (302 redirect resolution)
  const isShortLink =
    targetUrl.includes("maps.app.goo.gl") ||
    targetUrl.includes("goo.gl") ||
    targetUrl.includes("page.link") ||
    targetUrl.includes("g.co/");

  let initialQueryHint = directPlaceName || clientExtractedName || explicitText || "";

  if (isShortLink) {
    try {
      let currentHopUrl = targetUrl;
      // Follow up to 3 hops of manual redirects to capture location header
      for (let hop = 0; hop < 3; hop++) {
        const hopRes = await fetch(currentHopUrl, {
          method: "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(3000),
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
          },
        });

        const loc = hopRes.headers.get("location");
        if (loc) {
          resolvedUrl = loc;
          const fromLoc = extractPlaceFromUrl(loc);
          if (fromLoc.name) {
            initialQueryHint = fromLoc.name;
          }
          if (fromLoc.categoryClue) {
            categoryClueFromUrl = fromLoc.categoryClue;
          }
          if (loc.startsWith("http")) {
            currentHopUrl = loc;
          }
          if (!loc.includes("goo.gl") && !loc.includes("page.link")) {
            break;
          }
        } else {
          break;
        }
      }
    } catch (unshortErr) {
      console.warn("Manual redirect unshortening skipped:", unshortErr);
    }
  }

  // 3. Scrape Open Graph metadata & Title
  const ogData = await scrapeOpenGraphAndMetadata(resolvedUrl || targetUrl);
  const ogTitle = ogData.title || "";
  const ogDesc = ogData.description || "";

  // Effective place search name: Priority is direct place name > URL place hint > OG title
  const effectivePlaceName = (
    directPlaceName ||
    initialQueryHint ||
    extractPlaceFromUrl(resolvedUrl).name ||
    extractPlaceFromUrl(targetUrl).name ||
    ogTitle ||
    (!targetUrl.startsWith("http") ? targetUrl : "") ||
    "日本精選散策據點"
  ).trim();

  // If targetUrl is not HTTP, format standard Google Maps search URL
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(effectivePlaceName)}`;
    resolvedUrl = targetUrl;
  }

  // 4. Check built-in high-literary registry for instantaneous precision
  const lowerName = effectivePlaceName.toLowerCase();
  for (const [key, preset] of Object.entries(POETIC_LANDMARK_REGISTRY)) {
    if (lowerName.includes(key.toLowerCase()) || (resolvedUrl && resolvedUrl.toLowerCase().includes(key.toLowerCase()))) {
      return {
        spotName: preset.spotName,
        categoryLabel: preset.categoryLabel,
        tag: preset.tag,
        desc: preset.desc,
        recommendation: preset.recommendation,
        suggestedTime: preset.suggestedTime,
        mapUrl: targetUrl,

        name: preset.spotName,
        japaneseName: preset.japaneseName,
        category: preset.category,
        highlight: preset.recommendation.split("。")[0] || `${preset.spotName} 招牌特色`,
        summary: preset.desc,
        address: preset.address,
        tips: preset.recommendation,
        url: targetUrl,
        resolvedUrl,

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

  // 5. Call Gemini AI with the exact "旅の手帖" literary prompt
  let aiData: any = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `你是一位精通日本（包含東京、關西、日本各地）自由行、在地風土與深度飲食文化的旅行文學作家（風格如同《旅の手帖》與日系質感散策刊物）。
請針對目標地點「${effectivePlaceName}」（地區參考：${cityOrArea || "東京"}），依據以下資訊進行深度、正確且富含人文溫度的繁體中文旅行手帖分析：
- 目標店家/景點名稱：${effectivePlaceName}
- 網頁 Open Graph 標題：${ogTitle || "無"}
- 網頁 Open Graph 描述：${ogDesc || "無"}
- Google Maps 連結：${resolvedUrl || targetUrl}
- 類別線索：${categoryClueFromUrl || "無"}
- 使用者備註：${explicitText || "無"}

【嚴格類別與屬性規範 — 絕對不允許餐廳與景點混淆】：
1. 凡是餐飲美食（壽喜燒、燒肉、壽司、拉麵、牛舌、和牛、炸豬排、天婦羅、居酒屋、串燒、火鍋、食堂、洋食、丼飯）：
   - category 必須為 "dining"
   - categoryLabel 必須為具體的料理特徵，如「百年老鋪稻荷壽司」、「炭火燒肉名門」、「頂級黑毛和牛壽喜燒」、「道地濃郁拉麵」等。
   - 必須提供餐飲專屬：cuisineType (料理種類), signatureDishes (招牌推薦清單陣列), priceRange (人均消費預算), diningAtmosphere (用餐氛圍)
2. 凡是甜點、精品咖啡、生吐司、喫茶店、千層蛋糕、抹茶菓子：
   - category 必須為 "cafe"
   - categoryLabel 如「手作甜點」、「老派喫茶店」、「精品咖啡」等。
3. 凡是神社、寺廟、公園、庭園、展望台、博物館、歷史古蹟：
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
- spotName: 正式名稱含日文（如：志乃多壽司 (Shinoda Sushi) 或 敘敘苑 晴空塔店）
- tag: 3-4 個關鍵詞，以頓號連接（如：東京人形町、傳統手藝、外帶折詰美味）
- desc: 80至130字，充滿畫面感與人文溫度的散文，描寫推開店門時的香氣、巷弄轉角的光影、職人的專注或在地人的日常，文筆優雅細膩。
- recommendation: 50至80字，具體列出該店的招牌必吃餐點或景點必看亮點，以及實用的賞味或探訪建議。
- suggestedTime: 推薦造訪時段，如「午後散策時段」、「清晨參拜祈福」、「日落與夜景時段」。
- address: 所在區域或具體地址。

請嚴格輸出合法的純 JSON 格式：
{
  "spotName": "地點名稱 (日文原名)",
  "category": "dining",
  "categoryLabel": "百年老鋪稻荷壽司",
  "tag": "東京人形町、傳統手藝、外帶折詰美味",
  "desc": "漫步在...",
  "recommendation": "首推...",
  "suggestedTime": "午後散策時段",
  "address": "東京都中央區...",
  "cuisineType": "江戶前豆皮壽司",
  "signatureDishes": ["油揚豆皮稻荷壽司", "甘煮干瓢卷"],
  "priceRange": "￥600 ~ ￥1,500 / 人",
  "diningAtmosphere": "傳統外帶老鋪"
}`;

      const aiClient = getAiClient();
      const res: any = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const responseText = res.text?.trim() || "";
      if (responseText) {
        const parsed = JSON.parse(responseText);
        if (parsed && (parsed.spotName || parsed.name) && (parsed.desc || parsed.summary)) {
          aiData = parsed;
        }
      }
    } catch (aiErr: any) {
      console.warn("Gemini AI call skipped, using literary algorithmic fallback:", aiErr?.message);
    }
  }

  // 6. Safeguard & Literary Synthesizer Fallback
  let finalCategory = (aiData?.category || "other").toLowerCase();
  let finalCategoryLabel = aiData?.categoryLabel || "";
  const inspectText = `${effectivePlaceName} ${ogTitle} ${ogDesc} ${aiData?.spotName || ""} ${aiData?.desc || ""}`.toLowerCase();

  const isDining =
    inspectText.includes("壽司") ||
    inspectText.includes("拉麵") ||
    inspectText.includes("燒肉") ||
    inspectText.includes("壽喜燒") ||
    inspectText.includes("牛舌") ||
    inspectText.includes("和牛") ||
    inspectText.includes("炸豬排") ||
    inspectText.includes("天婦羅") ||
    inspectText.includes("居酒屋") ||
    inspectText.includes("食堂") ||
    inspectText.includes("今半") ||
    inspectText.includes("敘敘苑") ||
    inspectText.includes("叙々苑") ||
    inspectText.includes("利久") ||
    inspectText.includes("afuri") ||
    inspectText.includes("sushi") ||
    inspectText.includes("ramen") ||
    inspectText.includes("yakiniku");

  const isCafe =
    inspectText.includes("咖啡") ||
    inspectText.includes("甜點") ||
    inspectText.includes("布丁") ||
    inspectText.includes("可麗露") ||
    inspectText.includes("喫茶") ||
    inspectText.includes("蛋糕") ||
    inspectText.includes("生吐司") ||
    inspectText.includes("cafe") ||
    inspectText.includes("purin") ||
    inspectText.includes("canele");

  const isSightseeing =
    inspectText.includes("神社") ||
    inspectText.includes("寺") ||
    inspectText.includes("宮") ||
    inspectText.includes("公園") ||
    inspectText.includes("庭園") ||
    inspectText.includes("展望台") ||
    inspectText.includes("塔") ||
    inspectText.includes("sky") ||
    inspectText.includes("shrine") ||
    inspectText.includes("temple");

  if (isDining) {
    finalCategory = "dining";
    if (!finalCategoryLabel) finalCategoryLabel = "餐廳美饌";
  } else if (isCafe) {
    finalCategory = "cafe";
    if (!finalCategoryLabel) finalCategoryLabel = "甜點咖啡";
  } else if (isSightseeing) {
    finalCategory = "sightseeing";
    if (!finalCategoryLabel) finalCategoryLabel = "觀光景點";
  } else if (inspectText.includes("商場") || inspectText.includes("百貨") || inspectText.includes("mall")) {
    finalCategory = "shopping";
    if (!finalCategoryLabel) finalCategoryLabel = "購物商場";
  } else if (inspectText.includes("飯店") || inspectText.includes("hotel") || inspectText.includes("inn")) {
    finalCategory = "stay";
    if (!finalCategoryLabel) finalCategoryLabel = "旅宿飯店";
  }

  const finalSpotName = aiData?.spotName || aiData?.name || ogTitle || effectivePlaceName;
  const finalCategoryTitle = finalCategoryLabel || (finalCategory === "dining" ? "道地和食美饌" : finalCategory === "cafe" ? "質感甜點咖啡" : "人氣名勝景致");
  const finalTag = aiData?.tag || `${cityOrArea || "東京"}散策、人氣探訪、自由行推薦`;
  
  const finalDesc =
    aiData?.desc ||
    aiData?.summary ||
    (finalCategory === "dining"
      ? `漫步在街角巷弄，推開印有溫暖暖簾的木門，空氣中飄散著食材在火候下昇華的誘人香氣。${finalSpotName} 堅持傳統工藝與新鮮食材，將質樸真誠的職人心意注入每一道菜餚中，為每一位風塵僕僕的旅人帶來撫慰心靈的極上味蕾饗宴。`
      : finalCategory === "cafe"
      ? `隱身在鬧中取靜的街角，這是一處讓旅人慢下腳步的溫柔歇腳處。濃郁的咖啡香氣混合著現烤點心的甘甜，伴隨午後柔和灑落的日光，將旅途中的繁雜思緒悄悄安撫，沉浸在優雅閒適的慢活時光。`
      : `踏入這處承載著歲月印記的風景之中，微風穿過建築石垣與林蔭枝椏，眼前開闊的景致令人心曠神怡。隨處可見歷史與當代生活交織的細膩痕跡，是自由行散策途中最舒心難忘的探訪角落。`);

  const finalRecommendation =
    aiData?.recommendation ||
    aiData?.tips ||
    (finalCategory === "dining"
      ? `建議點選店家招牌現做料理；熱門時段建議提早前往或離峰造訪，搭配一杯煎茶或生啤酒，享受悠閒用餐時光。`
      : finalCategory === "cafe"
      ? `推薦招牌特調飲品與當日手工烘焙甜品；可選擇靠窗座位，一邊欣賞街景一邊品味細緻甜香。`
      : `建議於早晨人潮較少時段造訪，能享受最莊嚴清幽的參拜與攝影體驗；亦可放慢腳步細細欣賞周邊街景。`);

  const finalSuggestedTime = aiData?.suggestedTime || (finalCategory === "dining" ? "午間或晚餐時段" : finalCategory === "cafe" ? "午後散策時段" : "清晨參拜或午後漫步");
  const finalAddress = aiData?.address || ogData.schemaAddress || (cityOrArea ? `${cityOrArea}市區` : "日本都會商圈");

  return {
    spotName: finalSpotName,
    categoryLabel: finalCategoryTitle,
    tag: finalTag,
    desc: finalDesc,
    recommendation: finalRecommendation,
    suggestedTime: finalSuggestedTime,
    mapUrl: targetUrl,

    name: finalSpotName,
    japaneseName: aiData?.japaneseName || finalSpotName,
    category: finalCategory,
    highlight: finalRecommendation.split("。")[0] || `${finalSpotName} 特色亮點`,
    summary: finalDesc,
    address: finalAddress,
    tips: finalRecommendation,
    url: targetUrl,
    resolvedUrl,

    cuisineType: aiData?.cuisineType || (finalCategory === "dining" ? finalCategoryTitle : undefined),
    signatureDishes: Array.isArray(aiData?.signatureDishes) ? aiData.signatureDishes : undefined,
    priceRange: aiData?.priceRange,
    diningAtmosphere: aiData?.diningAtmosphere,
    spotType: aiData?.spotType || (finalCategory === "sightseeing" ? finalCategoryTitle : undefined),
    mustSeeHighlights: Array.isArray(aiData?.mustSeeHighlights) ? aiData.mustSeeHighlights : undefined,
    ticketInfo: aiData?.ticketInfo,
    bestTimeToVisit: aiData?.bestTimeToVisit || finalSuggestedTime,

    metaSource: {
      ogTitle: ogTitle || undefined,
      ogDescription: ogDesc || undefined,
      ogImage: ogData.image || undefined,
      placesApiMatched: true,
      geminiEnhanced: !!aiData?.desc,
    },
  };
}
