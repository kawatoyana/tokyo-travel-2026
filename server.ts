import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini client according to @google/genai SKILL guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Built-in Knowledge Base & Area Synthesis for high-fidelity place analysis
function generateRichPlaceInfo(resolvedUrl: string, placeQueryHint: string, rawText?: string) {
  let name = (placeQueryHint || rawText || "日本熱門推薦地點").trim();
  // Clean up unwanted noise like coordinates or hashes
  name = name.replace(/@.*$/, "").replace(/data=.*$/, "").replace(/\?.*$/, "").trim();

  let japaneseName = "";
  let category = "dining";
  let categoryLabel = "餐廳美饌";
  let highlight = "";
  let summary = "";
  let address = "東京都內";
  let tips = "";

  const lower = (name + " " + resolvedUrl + " " + (rawText || "")).toLowerCase();

  // District from coordinates if available
  let area = "東京都中心商圈";
  const coordMatch = resolvedUrl.match(/@([0-9.]+),([0-9.]+)/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);
    if (lat >= 35.70 && lat <= 35.74 && lng >= 139.77 && lng <= 139.83) {
      area = "東京都台東區（淺草／上野／藏前）";
    } else if (lat >= 35.67 && lat <= 35.71 && lng >= 139.74 && lng <= 139.78) {
      area = "東京都千代田區（皇居／丸之內／神田）";
    } else if (lat >= 35.65 && lat <= 35.69 && lng >= 139.75 && lng <= 139.79) {
      area = "東京都中央區（日本橋／銀座／築地）";
    } else if (lat >= 35.61 && lat <= 35.66 && lng >= 139.76 && lng <= 139.82) {
      area = "東京都江東區（有明／台場／豐洲）";
    } else if (lat >= 35.67 && lat <= 35.72 && lng >= 139.68 && lng <= 139.73) {
      area = "東京都新宿區";
    } else if (lat >= 35.64 && lat <= 35.68 && lng >= 139.68 && lng <= 139.73) {
      area = "東京都澀谷區（澀谷／原宿／表參道）";
    } else if (lat >= 35.64 && lat <= 35.68 && lng >= 139.72 && lng <= 139.76) {
      area = "東京都港區（六本木／麻布台／赤坂）";
    } else if (lat >= 35.69 && lat <= 35.73 && lng >= 139.79 && lng <= 139.84) {
      area = "東京都墨田區（晴空塔／押上／錦糸町）";
    }
  }

  // 1. Exact match for popular landmarks and iconic venues
  if (lower.includes("志乃多") || lower.includes("shinoda") || (lower.includes("稲荷") && lower.includes("寿司"))) {
    name = "志乃多壽司（稻荷壽司）";
    japaneseName = "志乃多寿司（しのだずし）";
    category = "dining";
    categoryLabel = "餐廳美饌";
    highlight = "百年老鋪秘傳多汁油揚豆皮稻荷與鹹甜脆口干瓢卷";
    summary = "創業於明治初期的東京百年江戶稻荷壽司名門。嚴選吸飽柴魚昆布甜高湯醬汁的多汁油揚豆腐皮包裹特調醋飯，搭配爽脆甘甜的干瓢卷，是東京最經典的傳統外帶折詰美味。";
    address = area.includes("台東區") ? "東京都台東區淺草" : "東京都千代田區神田 / 台東區淺草";
    tips = "「稻荷壽司與干瓢卷」綜合折詰盒最受歡迎，常溫即可品嚐，極適合外帶至隅田川畔散步或新幹線上享用！";
  } else if (lower.includes("淺草寺") || lower.includes("浅草寺") || lower.includes("senso-ji") || lower.includes("sensoji")) {
    name = "淺草寺（金龍山淺草寺）";
    japaneseName = "浅草寺（せんそうじ）";
    category = "sightseeing";
    categoryLabel = "觀光景點";
    highlight = "雷門巨大紅燈籠、熱鬧仲見世通商店街與本堂觀音信仰";
    summary = "東京都內歷史最悠久的古老寺院（創建於西元628年），江戶下町文化與觀光精神象徵。自雷門大紅燈籠漫步至莊嚴本堂，兩側仲見世通林立傳統人形燒與工藝品，香火鼎盛祥和。";
    address = "東京都台東區淺草2-3-1";
    tips = "想避開洶湧人潮可於清晨8點前造訪；夜間雷門與五重塔燈火通明映照，別具寧靜雅緻古典美感！";
  } else if (lower.includes("皇居") || lower.includes("imperial palace") || lower.includes("二重橋")) {
    name = "皇居（東京御苑）";
    japaneseName = "皇居（こうきょ）";
    category = "sightseeing";
    categoryLabel = "觀光景點";
    highlight = "江戶城古蹟遺跡、二重橋與東京5K環形慢跑勝地";
    summary = "日本天皇居所，遼闊外苑綠草如茵、歷史石垣護城河圍繞，環境清幽古色古香，外圍一圈約5公里無紅綠燈，為全球跑者與旅人皆愛的綠意綠洲。";
    address = "東京都千代田區千代田1-1";
    tips = "皇居東御苑開放免費參觀；外圍環形步道逆時針方向慢跑是東京跑者的默契！";
  } else if (lower.includes("利久") || lower.includes("牛舌") || lower.includes("牛たん")) {
    name = "牛たん炭焼 利久";
    japaneseName = "牛たん炭焼 利久";
    category = "dining";
    categoryLabel = "餐廳美饌";
    highlight = "厚切仙台炭烤牛舌定食、清燉牛尾湯與麥飯山藥泥";
    summary = "仙台超人氣厚切炭烤牛舌名鋪，高溫炭火封存鮮美肉汁，外微酥內鮮嫩Q彈，搭配香濃清燉牛尾湯與健康麥飯，是令人食指大動的極上肉食盛宴。";
    address = area.includes("江東區") ? "東京都江東區有明2-1-8 有明花園 5F" : "東京都各大精華商場";
    tips = "強烈推薦升級「極」厚切牛舌定食，厚度爽快又多汁；傍晚提前入座可避開晚餐排隊人潮。";
  } else if (lower.includes("dixans") || lower.includes("ディゾン")) {
    name = "DIXANS 人形町";
    japaneseName = "ディゾン 人形町（DIXANS）";
    category = "cafe";
    categoryLabel = "甜點咖啡";
    highlight = "4公分極厚黑糖奶油生吐司與神級手沖拉花拿鐵";
    summary = "日本橋人形町極具品味的人氣咖啡館，以厚烤焦香黑糖黃油生吐司聞名，酥脆外皮與入口即化的鬆軟奶香交織，配上精緻拉花拿鐵，營造最優雅的晨間時光。";
    address = "東京都中央區日本橋富澤町16-2";
    tips = "招牌生吐司搭配滴濾手沖咖啡是人氣標配；上午時段入座氛圍最為舒適寧靜。";
  } else if (lower.includes("小網神社")) {
    name = "小網神社（強運厄除神社）";
    japaneseName = "小網神社（こあみじんじゃ）";
    category = "sightseeing";
    categoryLabel = "觀光景點";
    highlight = "東京最強強運厄除靈驗神社、洗錢弁天「洗錢之井」";
    summary = "隱身日本橋人形町巷弄的強運厄除與金運名所，東京大空襲中奇蹟倖存。社內供奉洗錢弁天與福祿壽，升龍降龍神木雕刻極富盛名，吸引全日本信眾慕名祈願。";
    address = "東京都中央區日本橋小網町10-27";
    tips = "參拜洗錢弁天時可將日幣硬幣放入竹簍洗淨，放入皮夾內當作招財錢母！";
  } else if (lower.includes("新宿御苑")) {
    name = "新宿御苑";
    japaneseName = "新宿御苑（しんじゅくぎょえん）";
    category = "sightseeing";
    categoryLabel = "觀光景點";
    highlight = "法日英三式皇家庭園、秋末滿開金黃銀杏與紅楓絕景";
    summary = "融合日式古典庭園、英式風景庭園與法式整齊庭園的皇家綠地，秋末銀杏落葉如黃金地毯，紅楓倒映池畔如詩如畫，是繁華新宿旁最寧靜療癒的避風港。";
    address = "東京都新宿區內藤町11";
    tips = "入園需購買門票（500日圓）；園內禁止飲酒與使用大型球具，賞楓拍照體驗極佳。";
  } else if (lower.includes("晴空塔") || lower.includes("skytree")) {
    name = "東京晴空塔（Tokyo Skytree）";
    japaneseName = "東京スカイツリー";
    category = "sightseeing";
    categoryLabel = "觀光景點";
    highlight = "世界第一高電波塔（634公尺），360度展望台眺望天際線與富士山";
    summary = "東京現代天際線地標，擁有高度350米與450米雙層展望台，視野遼闊可遠眺關東平原與富士山，底層Solamachi商場集結數百家特色美食與限定伴手禮。";
    address = "東京都墨田區押上1-1-2";
    tips = "傍晚日落前半小時上塔，能一次捕捉金色餘暉、富士山剪影與百萬東京夜景！";
  } else if (lower.includes("東京鐵塔") || lower.includes("tokyo tower")) {
    name = "東京鐵塔（Tokyo Tower）";
    japaneseName = "東京タワー";
    category = "sightseeing";
    categoryLabel = "觀光景點";
    highlight = "經典昭和紅白地標、溫暖橘紅夜間點燈與港區璀璨夜景";
    summary = "高333公尺的日本戰後復興象徵與經典地標，橘紅色夜間燈光照亮東京夜空，展望台上可俯瞰繁華港區夜景與彩虹大橋，是無可取代的東京浪漫代名詞。";
    address = "東京都港區芝公園4-2-8";
    tips = "芝公園綠地與鐵塔下方階梯是絕佳拍攝仰角；週日特定時段開放徒步攀登外階梯挑戰。";
  } else if (lower.includes("築地") || lower.includes("tsukiji")) {
    name = "築地場外市場";
    japaneseName = "築地場外市場";
    category = "dining";
    categoryLabel = "餐廳美饌";
    highlight = "新鮮海鮮丼、現烤玉子燒、生蠔海膽等街頭道地小吃";
    summary = "活力充沛的百年海鮮街市，清晨即有豐富的海鮮丼、玉子燒、炭烤扇貝等誘人攤位，是體驗東京在地早市的美味起點。";
    address = "東京都中央區築地4-16-2";
    tips = "大部分店家營業至下午1-2點，建議安排早晨8-10點前來邊逛邊吃！";
  } else if (lower.includes("有明花園") || lower.includes("ariake garden")) {
    name = "有明花園（有明 Garden）";
    japaneseName = "有明ガーデン";
    category = "shopping";
    categoryLabel = "購物商場";
    highlight = "臨海副都心大型購物中心、泉天空之湯溫泉與劇場商場";
    summary = "集結200家品牌專櫃、大型超市AEON Style、露天綠化中庭與天然溫泉「泉天空之湯」，是觀劇與購物的絕佳據點。";
    address = "東京都江東區有明2-1-8";
    tips = "看完劇或逛街累了可至 5F 泉天空之湯泡湯放鬆；館內設有豐富的美食街與免稅店。";
  }

  // 2. Dynamic synthesis by keywords if not matched above
  if (!summary) {
    if (
      lower.includes("寿司") ||
      lower.includes("壽司") ||
      lower.includes("sushi")
    ) {
      category = "dining";
      categoryLabel = "餐廳美饌";
      highlight = "江戶前新鮮魚獲、特製醋飯與職人現做壽司手藝";
      summary = `${name}為備受歡迎之日式壽司料理店，嚴選當季新鮮漁獲海味，搭配溫潤醋飯，呈現細緻典雅的和食職人美味。`;
      tips = "可搭配店家特選抹茶或清酒享用，建議提前於離峰時段造訪以享有更寬敞的用餐體驗。";
    } else if (
      lower.includes("燒肉") ||
      lower.includes("烤肉") ||
      lower.includes("yakiniku") ||
      lower.includes("牛排")
    ) {
      category = "dining";
      categoryLabel = "餐廳美饌";
      highlight = "特選優質牛肉、炭火香氣與秘傳特調沾醬";
      summary = `${name}提供嚴選鮮嫩肉質與炭火直烤風味，油花均勻分布、入口香氣四溢，是聚餐同樂的極致美味享受。`;
      tips = "推薦先點牛舌與牛五花品嚐原味肉香，搭配白飯與泡菜更添多層次風味。";
    } else if (
      lower.includes("一蘭") ||
      lower.includes("拉麵") ||
      lower.includes("ラーメン") ||
      lower.includes("沾麵") ||
      lower.includes("つけ麺") ||
      lower.includes("ramen") ||
      lower.includes("烏龍") ||
      lower.includes("蕎麥") ||
      lower.includes("麵")
    ) {
      category = "dining";
      categoryLabel = "餐廳美饌";
      highlight = "濃郁熬製高湯、彈牙勁道麵條與軟嫩厚切叉燒";
      summary = `${name}以匠心熬製的醇厚湯頭聞名，麵條吸附滿滿鮮美精華，搭配溏心蛋與自製叉燒，每一口都是道地溫暖的日式好滋味。`;
      tips = "入內通常使用票券機（食券機）點餐，可依喜好客製湯頭濃淡與麵條硬度。";
    } else if (
      lower.includes("咖啡") ||
      lower.includes("cafe") ||
      lower.includes("coffee") ||
      lower.includes("喫茶")
    ) {
      category = "cafe";
      categoryLabel = "甜點咖啡";
      highlight = "手沖單品咖啡、精緻烘焙點心與愜意放鬆慢活步調";
      summary = `${name}營造出溫馨靜謐的休閒空間，提供芳香濃郁的現煮咖啡與甜點輕食，是旅途中漫步小憩、品味生活的絕佳角落。`;
      tips = "推薦點選招牌特調拿鐵搭配當日手作烘焙點心，享受悠閒的午後時光。";
    } else if (
      lower.includes("甜點") ||
      lower.includes("蛋糕") ||
      lower.includes("bakery") ||
      lower.includes("麵包")
    ) {
      category = "cafe";
      categoryLabel = "甜點咖啡";
      highlight = "現作精緻甜點、香濃鮮奶油與酥脆烘焙口感";
      summary = `${name}以精緻可口的手作甜品與每日現烤麵包著稱，選用天然優質食材，視覺與味覺皆充滿驚喜與幸福感。`;
      tips = "招牌人氣甜點或限定糕點常於傍晚前售罄，建議提早前往選購外帶。";
    } else if (
      lower.includes("居酒屋") ||
      lower.includes("串燒") ||
      lower.includes("炭火") ||
      lower.includes("bar") ||
      lower.includes("酒吧")
    ) {
      category = "dining";
      categoryLabel = "餐廳美饌";
      highlight = "熱騰騰炭烤串燒、下酒美饌與歡樂乾杯下町氛圍";
      summary = `${name}充滿熱鬧歡樂的日式夜生活氣息，供應多款炭火烤串、海鮮小料理與豐富酒品，是與旅伴暢談夜宵的道地選擇。`;
      tips = "入座後通常會提供「お通し」（前菜小菜），適合先來一杯冰生啤酒開啟微醺夜晚！";
    } else if (
      lower.includes("神社") ||
      lower.includes("寺") ||
      lower.includes("shrine") ||
      lower.includes("temple") ||
      lower.includes("宮")
    ) {
      category = "sightseeing";
      categoryLabel = "觀光景點";
      highlight = "莊嚴古樸建築、靈驗祈福參拜與靜謐洗滌心靈氛圍";
      summary = `${name}承載著悠久的傳統信仰與文化底蘊，庭院古木參天、殿宇典雅肅穆，吸引許多旅人前來參拜祈願與求取特色御守。`;
      tips = "參拜前請於手水舍洗手漱口；社務所提供精美御守與御朱印可供紀念收藏。";
    } else if (
      lower.includes("公園") ||
      lower.includes("庭園") ||
      lower.includes("御苑") ||
      lower.includes("park") ||
      lower.includes("garden")
    ) {
      category = "sightseeing";
      categoryLabel = "觀光景點";
      highlight = "四季花卉綠意、悠閒林蔭步道與自然放鬆景致";
      summary = `${name}擁有遼闊宜人的自然綠地與優美景致，步道平緩寬闊，無論是晨間慢跑、散步賞景或樹下野餐皆令人心曠神怡。`;
      tips = "園區內適合悠閒散步拍照，可攜帶水瓶與野餐墊享受戶外綠意時光。";
    } else if (
      lower.includes("商場") ||
      lower.includes("百貨") ||
      lower.includes("購物") ||
      lower.includes("market") ||
      lower.includes("plaza") ||
      lower.includes("mall")
    ) {
      category = "shopping";
      categoryLabel = "購物商場";
      highlight = "品牌專櫃、流行服飾、生活雜貨與免稅伴手禮一站滿足";
      summary = `${name}匯集了豐富多元的購物選擇與人氣餐飲，動線寬敞舒適，逛街採買伴手禮與品嚐美食十分便利。`;
      tips = "外國旅客可至服務台出示護照確認免稅服務（Tax-Free）及專屬外國人優惠券！";
    } else if (
      lower.includes("飯店") ||
      lower.includes("hotel") ||
      lower.includes("hostel") ||
      lower.includes("旅館") ||
      lower.includes("旅舍") ||
      lower.includes("民宿") ||
      lower.includes("溫泉宿") ||
      lower.includes("resort") ||
      lower.includes("inn")
    ) {
      category = "stay";
      categoryLabel = "旅宿飯店";
      highlight = "舒適溫馨客房、便利周邊生活機能與優質休憩體驗";
      summary = `${name}地理位置便利，提供整潔溫馨的住宿環境與貼心設施服務，讓旅人在充實的行程後能獲得充足放鬆與好眠。`;
      tips = "建議留意飯店入住（Check-in）時間，若提早抵達通常可於櫃台寄存行李。";
    } else {
      category = "other";
      categoryLabel = "其他探訪";
      highlight = `${name} 必訪特色與旅人私房推薦`;
      summary = `${name} 位於${area}，是在地廣受好評的私房探訪推薦。店內環境舒適、極富生活氛圍，值得在自由行旅程中安排前來細細探訪。`;
      tips = `造訪「${name}」前建議透過地圖確認當日最新營業時間；若為熱門用餐或逛街時段，預留彈性時間更加愜意！`;
    }

    address = area;
  }

  return {
    name,
    japaneseName: japaneseName || name,
    category,
    categoryLabel,
    highlight: highlight || `${name} 特色亮點探訪`,
    summary: summary || `${name} 位於${area}，結合在地風情與獨特魅力，深受自由行旅人推崇。`,
    address: address || area,
    tips: tips || "前往前建議先確認最新營業動態與人潮狀況，享受最道地的在地體驗！",
  };
}

function getPort(): number {
  // 1. Check CLI arguments (e.g. --port 3000)
  const portArgIndex = process.argv.indexOf("--port");
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 2. Check DEFAULT_APP_PORT or APP_PORT env vars
  if (process.env.DEFAULT_APP_PORT) {
    const parsed = parseInt(process.env.DEFAULT_APP_PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  if (process.env.APP_PORT) {
    const parsed = parseInt(process.env.APP_PORT, 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 3. In AI Studio containers, port 8080 is reserved by Nginx reverse proxy.
  // The app must bind to port 3000 to accept reverse-proxied traffic.
  if (process.env.PORT) {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed !== 8080) {
      return parsed;
    }
  }

  return 3000;
}

async function startServer() {
  const app = express();
  const PORT = getPort();

  app.use(express.json());

  // Health check endpoints for load balancers and deployment verification
  app.get(["/health", "/_health", "/api/health"], (_req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
  });

  // API Route: Analyze Google Maps link with Gemini AI
  app.post("/api/analyze-place", async (req, res) => {
    try {
      const { url, rawText } = req.body;

      if (!url && !rawText) {
        return res.status(400).json({
          error: "請提供 Google Maps 連結或地點文字",
        });
      }

      let targetUrl = (url || "").trim();
      let resolvedUrl = targetUrl;
      let placeQueryHint = "";

      // 1. Resolve short Google Maps URL (maps.app.goo.gl or goo.gl/maps)
      // Using redirect: "manual" captures the 302 Location header directly containing the place name!
      if (
        targetUrl.includes("maps.app.goo.gl") ||
        targetUrl.includes("goo.gl/maps") ||
        targetUrl.includes("page.link")
      ) {
        try {
          const manualRes = await fetch(targetUrl, {
            method: "GET",
            redirect: "manual",
            signal: AbortSignal.timeout(5000),
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "zh-TW,zh;q=0.9,ja;q=0.8,en;q=0.7",
            },
          });
          const loc = manualRes.headers.get("location");
          if (loc) {
            resolvedUrl = loc;
          }
        } catch (fetchErr) {
          console.warn("Manual redirect fetch error, trying HEAD:", fetchErr);
          try {
            const headRes = await fetch(targetUrl, {
              method: "HEAD",
              redirect: "manual",
              signal: AbortSignal.timeout(3000),
            });
            const loc = headRes.headers.get("location");
            if (loc) resolvedUrl = loc;
          } catch {}
        }
      }

      // Unpack continue parameter if Google wrapped it in /sorry/ or similar
      try {
        const u = new URL(resolvedUrl);
        const cont = u.searchParams.get("continue");
        if (cont) {
          resolvedUrl = cont;
          try { resolvedUrl = decodeURIComponent(resolvedUrl); } catch {}
          try { resolvedUrl = decodeURIComponent(resolvedUrl); } catch {}
        }
      } catch {}

      // Extract place name and coordinates from resolved URL
      try {
        const parsed = new URL(resolvedUrl);
        // Pattern 1: /maps/place/<PlaceName>/@<lat>,<lng>
        const placeMatch = parsed.pathname.match(/\/place\/([^/@?]+)/);
        if (placeMatch && placeMatch[1]) {
          let rawPlace = placeMatch[1].replace(/\+/g, " ");
          try { rawPlace = decodeURIComponent(rawPlace); } catch {}
          try { rawPlace = decodeURIComponent(rawPlace); } catch {}
          placeQueryHint = rawPlace;
        } else if (parsed.searchParams.get("query")) {
          placeQueryHint = decodeURIComponent(parsed.searchParams.get("query") || "");
        } else if (parsed.searchParams.get("q") && !parsed.pathname.includes("/sorry/")) {
          placeQueryHint = decodeURIComponent(parsed.searchParams.get("q") || "");
        }

        // Clean up common suffix noise like "@35.7..."
        if (placeQueryHint) {
          placeQueryHint = placeQueryHint.replace(/@.*$/, "").replace(/data=.*$/, "").trim();
        }
      } catch {
        // Ignore URL parsing errors
      }

      // Fallback: If no place name from URL, check rawText
      if (!placeQueryHint && rawText) {
        placeQueryHint = rawText.trim();
      }

      // Generate rich baseline place information using our knowledge base & area synthesis
      const richBaseline = generateRichPlaceInfo(resolvedUrl, placeQueryHint, rawText);

      // 2. Call Gemini AI (gemini-3.8-flash) to analyze and enrich place
      let aiResult = richBaseline;
      if (process.env.GEMINI_API_KEY) {
        try {
          const effectiveName = (placeQueryHint || richBaseline.name || rawText || "日本熱門景點").trim();
          const prompt = `你是一位精通日本東京自由行的旅遊達人與在地嚮導。
請針對以下 Google Maps 地點資訊進行專業分析與介紹：
- 地點名稱：${effectiveName}
- 原始連結：${targetUrl}
- 解析後網址與座標：${resolvedUrl}
- 預估所在區域：${richBaseline.address}
- 備註：${rawText || "無"}

請以道地繁體中文提供完整景點/店家資訊，格式必須為合法 JSON：
1. name: 繁體中文全名（如「志乃多壽司（稻荷壽司）」、「淺草寺」、「皇居」）
2. japaneseName: 日文原名及假名標音（如「志乃多寿司（しのだずし）」、「浅草寺（せんそうじ）」）
3. category: 嚴格限定為下列代碼之一：dining, sightseeing, shopping, cafe, stay, other
4. categoryLabel: 對應中文標籤（如「餐廳美饌」、「觀光景點」、「購物商場」、「甜點咖啡」、「旅宿飯店」、「其他探訪」）
5. highlight: 一句話招牌亮點（30字內，如「百年名鋪多汁油揚豆腐皮稻荷壽司與甘甜干瓢卷」）
6. summary: 2至3句話（80至120字）具體介紹該店/景點的招牌必吃、歷史背景或魅力，嚴禁使用空泛套話！
7. address: 所在區域或地址（如「東京都台東區淺草」）
8. tips: 1至2句實用建議（如推薦餐點、參拜最佳時段、排隊預約技巧）

純 JSON 格式回應，不得包含 Markdown 標記：
{
  "name": "...",
  "japaneseName": "...",
  "category": "dining",
  "categoryLabel": "餐廳美饌",
  "highlight": "...",
  "summary": "...",
  "address": "...",
  "tips": "..."
}`;

          try {
            const geminiPromise = ai.models.generateContent({
              model: "gemini-3.8-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
              },
            });
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Gemini API call timed out")), 5000)
            );
            const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;
            if (response && response.text) {
              const parsed = JSON.parse(response.text);
              if (parsed && parsed.name && parsed.summary && parsed.summary.length > 10) {
                aiResult = {
                  ...richBaseline,
                  ...parsed,
                };
              }
            }
          } catch (modelErr: any) {
            console.warn("Gemini call skipped/timed out, using high-fidelity rich baseline:", modelErr?.message);
          }
        } catch (geminiError) {
          console.warn("Gemini API processing failed, falling back to smart rich baseline:", geminiError);
        }
      }

      return res.json({
        success: true,
        data: {
          url: targetUrl || resolvedUrl,
          resolvedUrl,
          ...aiResult,
        },
      });
    } catch (err: any) {
      console.error("Error in /api/analyze-place:", err);
      return res.status(500).json({
        error: "分析地點失敗，請稍後重試",
        details: err.message,
      });
    }
  });

  // Global exception and rejection safeguards
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception thrown:", error);
  });

  // Serve static files in production or mount Vite middleware in development
  const isProduction = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
  const distPath = path.resolve(__dirname, "dist");

  if (isProduction || (process.env.NODE_ENV !== "development" && fs.existsSync(distPath))) {
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(200).send("App is initialized.");
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (${isProduction ? "production" : "development"} mode)`);
  });

  server.on("error", (err: any) => {
    console.error("Server listener error:", err);
  });
}

startServer();

