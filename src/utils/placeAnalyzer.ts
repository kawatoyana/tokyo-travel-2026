/**
 * Intelligent Place Analyzer for Tokyo Travel Guide
 * Works both with Node server and 100% client-side on static deployments (GitHub Pages).
 */

export interface AnalyzedPlaceData {
  name: string;
  japaneseName: string;
  category: "dining" | "sightseeing" | "shopping" | "cafe" | "stay" | "other";
  categoryLabel: string;
  highlight: string;
  summary: string;
  address: string;
  tips: string;
}

/**
 * High-precision dictionary of Tokyo iconic travel spots
 */
const TOKYO_LANDMARKS: Record<string, Partial<AnalyzedPlaceData>> = {
  "志乃多": {
    name: "志乃多壽司",
    japaneseName: "志乃多寿司（しのだずし）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "明治十年老鋪・秘傳多汁油揚豆皮稻荷壽司與干瓢卷",
    summary: "創業於明治時代的百年江戶老字號。特選吸滿香甜柴魚高湯精華的油揚豆皮包裹特調溫潤醋飯，搭配甜鹹爽脆的干瓢卷，是東京最經典的傳統外帶壽司美味。",
    address: "東京都台東區淺草1-1-12",
    tips: "推薦購買「稻荷壽司與干瓢卷」綜合折詰盒，常溫即可享用，極適合外帶至隅田川畔野餐！",
  },
  "今半": {
    name: "淺草今半（壽喜燒）",
    japaneseName: "浅草今半 国際通り本店",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "明治28年創業・頂級黑毛和牛壽喜燒與百年秘傳割下醬汁",
    summary: "東京最具代表性的百年壽喜燒老鋪，嚴選霜降油花極致細膩的日本黑毛和牛，搭配秘傳百年割下高湯醬汁涮煮，入口滑嫩香甜，為自由行必嚐的極上美食饗宴。",
    address: "東京都台東區西淺草3-1-12",
    tips: "午間時段供應的壽喜燒定食CP值極高，建議提早於開店前30分鐘抵達或事先預約！",
  },
  "敘敘苑": {
    name: "敘敘苑（燒肉）",
    japaneseName: "叙々苑（じょじょえん）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "極上上等牛五花、招牌秘傳燒肉醬汁與高空景觀用餐體驗",
    summary: "日本頂級連鎖燒肉名店，肉質細緻嫩滑、油花豐潤，招牌牛五花與特選牛舌搭配獨家爽口沙拉，深受海內外旅人推崇。",
    address: "東京都精華商圈（晴空街道 30F / 銀座 / 新宿）",
    tips: "晴空塔分店具備絕美高空景觀，建議提早於官網預約窗邊景觀座位。",
  },
  "叙々苑": {
    name: "敘敘苑（燒肉）",
    japaneseName: "叙々苑（じょじょえん）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "極上上等牛五花、招牌秘傳燒肉醬汁與高空景觀用餐體驗",
    summary: "日本頂級連鎖燒肉名店，肉質細緻嫩滑、油花豐潤，招牌牛五花與特選牛舌搭配獨家爽口沙拉，深受海內外旅人推崇。",
    address: "東京都精華商圈（晴空街道 30F / 銀座 / 新宿）",
    tips: "晴空塔分店具備絕美高空景觀，建議提早於官網預約窗邊景觀座位。",
  },
  "利久": {
    name: "牛たん炭焼 利久",
    japaneseName: "牛たん炭焼 利久（りきゅう）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "仙台炭火極厚牛舌定食、清燉牛尾湯與麥飯山藥泥",
    summary: "仙台超人氣厚切炭烤牛舌名店，高溫炭火封存鮮美肉汁，外酥內嫩多汁Q彈，搭配香濃清燉牛尾湯與健康麥飯，是令人滿足的極上肉食盛宴。",
    address: "東京都江東區有明2-1-8 有明花園 5F",
    tips: "推薦點選「極」厚切牛舌定食，厚度普通兩倍超滿足；傍晚16:30前入座免排隊！",
  },
  "牛たん": {
    name: "牛たん炭焼 利久",
    japaneseName: "牛たん炭焼 利久",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "仙台炭火極厚牛舌定食、清燉牛尾湯與麥飯山藥泥",
    summary: "仙台超人氣厚切炭烤牛舌名店，高溫炭火封存鮮美肉汁，外酥內嫩多汁Q彈，搭配香濃清燉牛尾湯與健康麥飯，是令人滿足的極上肉食盛宴。",
    address: "東京都江東區有明2-1-8 有明花園 5F",
    tips: "推薦點選「極」厚切牛舌定食，厚度普通兩倍超滿足；傍晚16:30前入座免排隊！",
  },
  "淺草寺": {
    name: "淺草寺（金龍山淺草寺）",
    japaneseName: "浅草寺（せんそうじ）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "雷門巨型紅燈籠、熱鬧仲見世通商店街與本堂觀音信仰",
    summary: "東京都內歷史最悠久的古老寺院（創建於西元628年），江戶下町文化與觀光精神象徵。自雷門大紅燈籠漫步至莊嚴本堂，兩側仲見世通林立傳統人形燒與工藝品，香火鼎盛祥和。",
    address: "東京都台東區淺草2-3-1",
    tips: "想避開洶湧人潮可於清晨8點前造訪；夜間雷門與五重塔燈火通明，別具寧靜古典美感！",
  },
  "皇居": {
    name: "皇居（東京御苑）",
    japaneseName: "皇居（こうきょ）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "江戶城古蹟遺跡、二重橋與東京5K環形慢跑勝地",
    summary: "日本天皇居所，遼闊外苑綠草如茵、歷史石垣護城河圍繞，環境清幽古色古香，外圍一圈約5公里無紅綠燈，為全球跑者與旅人皆愛的綠意綠洲。",
    address: "東京都千代田區千代田1-1",
    tips: "皇居東御苑開放免費參觀；外圍環形步道逆時針方向慢跑是東京跑者的默契！",
  },
  "東京鐵塔": {
    name: "東京鐵塔（Tokyo Tower）",
    japaneseName: "東京タワー",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "經典紅白雙色地標，360度展望台遠眺富士山與港區百萬夜景",
    summary: "高達333公尺的東京永恆精神地標，展望台上視野開闊，黃昏與夜晚燈火璀璨，底層FootTown商場集合伴手禮與餐飲，是自由行必訪的浪漫經典。",
    address: "東京都港區芝公園4-2-8",
    tips: "傍晚時分登塔可同時欣賞金色日落與東京夜景；芝公園是拍攝鐵塔全景的最佳角度。",
  },
  "晴空塔": {
    name: "東京晴空塔（Tokyo Skytree）",
    japaneseName: "東京スカイツリー",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "世界第一高電波塔（634公尺），晴空街道商場與展望台盛景",
    summary: "東京現代天際線象徵，350米與450米雙層展望台俯瞰關東平原，下方Solamachi商場匯聚300多家美食餐廳與限定伴手禮店。",
    address: "東京都墨田區押上1-1-2",
    tips: "建議事先線上預訂門票免排隊；晴空街道退稅服務於1樓與3樓櫃台提供。",
  },
  "小網神社": {
    name: "小網神社（強運厄除神社）",
    japaneseName: "小網神社（こあみじんじゃ）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "東京最強強運厄除神社、洗錢弁天洗錢之井招財名所",
    summary: "隱身日本橋人形町巷弄的強運厄除名所，在東京大空襲中奇蹟倖存。社內供奉洗錢弁天，可將硬幣放入竹簍洗淨作為招財錢母。",
    address: "東京都中央區日本橋小網町10-27",
    tips: "參拜後可求取強運蠶繭御守；平日早晨前往排隊人潮較少。",
  },
  "新宿御苑": {
    name: "新宿御苑",
    japaneseName: "新宿御苑（しんじゅくぎょえん）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "日法英三式皇家庭園、秋末滿開金黃銀杏與紅楓絕景",
    summary: "融合日式庭園、英式風景與法式庭園的皇家綠地，秋末銀杏金黃燦爛、池畔紅楓如畫，繁華新宿旁最寧靜療癒的散策景點。",
    address: "東京都新宿區內藤町11",
    tips: "入園門票500日圓；園內禁止飲酒與大型球具，適合悠閒散步拍照。",
  },
  "六義園": {
    name: "六義園",
    japaneseName: "六義園（りくぎえん）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "江戶時代大名迴遊式築山泉水庭園，秋季紅葉倒影勝景",
    summary: "德川綱吉時代修建的和歌主題古典名園，中央大泉水池環繞林蔭山石，秋季楓葉轉紅倒映水面，清幽深遠。",
    address: "東京都文京區本駒込6-16-3",
    tips: "漫步一圈約需1小時，吹上茶屋提供抹茶與和菓子可供休憩品嚐。",
  },
  "dixans": {
    name: "DIXANS 人形町",
    japaneseName: "ディゾン 人形町（DIXANS）",
    category: "cafe",
    categoryLabel: "甜點咖啡",
    highlight: "4公分厚烤焦香黑糖奶油生吐司與神級拉花手沖拿鐵",
    summary: "日本橋人形町極具質感的文青精品咖啡館，以超厚烤黑糖黃油生吐司聞名，酥脆表皮與鬆軟奶香交織，是午後品嚐咖啡甜點的極致享受。",
    address: "東京都中央區日本橋富澤町16-2",
    tips: "招牌厚生吐司限量供應，下午時段熱門品項常提早售罄，建議午間造訪！",
  },
  "afuri": {
    name: "AFURI 拉麵",
    japaneseName: "AFURI（あふり）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "清新天然柚子香氣金色雞湯、炭火炙燒叉燒與全麥細麵",
    summary: "東京現代拉麵代表，選用神奈川阿夫利山天然水與清澈雞湯熬製，佐以微酸香醇的日本天然柚子汁與現烤香氣叉燒，清爽不膩。",
    address: "東京都精華商圈（原宿／惠比壽／六本木）",
    tips: "門口票券機支援多國語言；「柚子鹽拉麵」是人氣第一招牌！",
  },
  "harbs": {
    name: "HARBS 蛋糕",
    japaneseName: "ハーブス（HARBS）",
    category: "cafe",
    categoryLabel: "甜點咖啡",
    highlight: "招牌新鮮六層繽紛水果千層蛋糕（Mille Crepes）",
    summary: "日本殿堂級千層蛋糕名店，薄透蛋皮夾入草莓、奇異果、香蕉等豐富新鮮當季水果與特製不膩鮮奶油，口感綿密層次極致。",
    address: "東京都精華商場（晴空街道 / 新宿Lumine / 六本木之丘）",
    tips: "內用每人需低消一杯飲品；亦可直接於冷藏櫃外帶回飯店享用！",
  },
  "shibuya sky": {
    name: "SHIBUYA SKY（澀谷天空）",
    japaneseName: "SHIBUYA SKY",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "229公尺無遮蔽360度露天高空展望台、俯瞰澀谷十字路口與富士山",
    summary: "澀谷最熱門的高空地標，坐落於Shibuya Scramble Square頂樓，屋頂Sky Edge透明玻璃角落為超人氣打卡點，日落與夜景美不勝言。",
    address: "東京都澀谷區澀谷2-24-12 47F",
    tips: "日落時段門票極難搶購，建議提前28天於官網預約搶票！",
  },
  "teamlab": {
    name: "teamLab 數位藝術美術館",
    japaneseName: "チームラボ（teamLab）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: "沉浸式光影互動數位展覽、光之水晶世界與漂浮花園",
    summary: "享譽全球的沉浸式數位藝術空間，結合光影、鏡面與水流營造出無邊際的幻境體驗，是自由行視覺感官的一大震撼。",
    address: "東京都江東區豐洲6-1-16 / 麻布台之丘",
    tips: "入館需穿著方便步行的衣物，部分展區需赤腳涉水（水位約至小腿）。",
  },
  "有明花園": {
    name: "有明花園（Ariake Garden）",
    japaneseName: "有明ガーデン",
    category: "shopping",
    categoryLabel: "購物商場",
    highlight: "臨海副都心大型購物中心、泉天空之湯溫泉與劇場商場一站滿足",
    summary: "匯聚200家品牌專櫃、AEON大型超市、露天綠化中庭與24小時天然溫泉「泉天空之湯」，為觀劇與散策購物的首選據點。",
    address: "東京都江東區有明2-1-8",
    tips: "觀劇或路跑後可至 5F 泉天空之湯泡湯放鬆；館內設有豐富的美食街與退稅專櫃。",
  },
  "築地": {
    name: "築地場外市場",
    japaneseName: "築地場外市場",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "新鮮極上海鮮丼、現烤熱騰騰玉子燒與道地海鮮街頭小吃",
    summary: "充滿活力的百年老街市，早晨林立著生蠔、海膽、炭烤扇貝與現切生魚片攤位，是品味東京早晨在地鮮味的必訪起點。",
    address: "東京都中央區築地4-16-2",
    tips: "多數店家於下午1至2點陸續打烊，建議於早晨8:30至11:00前往邊逛邊嚐！",
  },
  "挽肉與米": {
    name: "挽肉與米（挽肉と米）",
    japaneseName: "挽肉と米（ひき肉とこめ）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "炭火現烤純和牛漢堡排、現煮羽釜白米飯與生蛋拌飯三吃",
    summary: "東京超人氣炭烤漢堡排專門店，師傅於眼前炭火翻烤100%純牛肉漢堡排，肉汁豐沛香濃，搭配羽釜鍋現煮頂級白米飯與生食級雞蛋，極致美味。",
    address: "東京都澀谷區道玄坂2-28-1 / 武藏野市吉祥寺",
    tips: "採每週五上午線上預約制或當日早晨排隊發放整理券，極具人氣！",
  },
  "一蘭": {
    name: "一蘭拉麵",
    japaneseName: "天然とんこつラーメン一蘭",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "天然豚骨湯頭、客製化味集中座位與赤紅秘傳醬汁",
    summary: "享譽國際的豚骨拉麵名店，獨創「味集中座位」讓顧客專注享受每一口濃郁無腥味的豚骨湯與特製生麵。",
    address: "東京都精華商圈（澀谷／新宿／上野／淺草）",
    tips: "建議在點餐用紙選擇「麵偏硬、蒜泥適量、秘傳醬汁1/2倍」，風味最佳！",
  },
  "金子半之助": {
    name: "金子半之助 天丼",
    japaneseName: "日本橋天丼 金子半之助",
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: "江戶前豪邁炸穴子魚巨無霸天丼、半熟炸玉子與秘傳醬汁",
    summary: "日本橋排隊名物天丼，滿滿一大碗鋪滿炸穴子海鰻、鮮蝦、干貝魷魚海鮮炸餅與半熟炸蛋，淋上三代傳承秘汁，香氣四溢。",
    address: "東京都中央區日本橋室町1-11-15",
    tips: "用餐尖峰排隊約需45至60分鐘，建議於下午2點至4點離峰時段前往。",
  },
};

/**
 * Attempt to unshorten Google Maps short link client-side via CORS-friendly proxies
 */
export async function unshortenGoogleMapsLinkClient(shortUrl: string): Promise<{ resolvedUrl: string; title: string }> {
  let resolvedUrl = "";
  let title = "";

  // 1. Try AllOrigins (fetches page and follows redirects)
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(shortUrl)}`, {
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.status?.url) {
        resolvedUrl = data.status.url;
      }
      if (data?.contents && typeof data.contents === "string") {
        // Extract title tag
        const titleMatch = data.contents.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          let t = titleMatch[1].trim();
          t = t.replace(/\s*[-–—|]\s*Google\s*(?:Maps|地圖|マップ)?.*$/i, "").trim();
          t = t.replace(/\s*[-–—|]\s*Google.*$/i, "").trim();
          if (t && !t.includes("Google") && t !== "Google Maps") {
            title = t;
          }
        }
      }
    }
  } catch (e) {
    // Ignore and proceed to next proxy
  }

  // 2. Try unshorten.me if not resolved yet
  if (!resolvedUrl) {
    try {
      const unRes = await fetch("https://unshorten.me/json/" + encodeURIComponent(shortUrl), {
        signal: AbortSignal.timeout(2500),
      });
      if (unRes.ok) {
        const uData = await unRes.json();
        if (uData?.resolved_url) {
          resolvedUrl = uData.resolved_url;
        }
      }
    } catch (e) {
      // Ignore
    }
  }

  return { resolvedUrl, title };
}

/**
 * Extract place name from a resolved Google Maps URL
 */
export function extractPlaceNameFromUrl(url: string): string {
  try {
    let dec = url;
    for (let i = 0; i < 4; i++) {
      try {
        const n = decodeURIComponent(dec);
        if (n === dec) break;
        dec = n;
      } catch {
        break;
      }
    }

    // Match /place/PlaceName/
    const pm = dec.match(/\/place\/([^/@?&]+)/i);
    if (pm && pm[1]) {
      let n = pm[1].replace(/\+/g, " ").trim();
      n = n.replace(/@.*$/, "").replace(/data=.*$/, "").trim();
      if (n && !n.startsWith("http") && !n.startsWith("0x")) {
        return n;
      }
    }

    // Match /search/PlaceName/
    const sm = dec.match(/\/search\/([^/@?&]+)/i);
    if (sm && sm[1]) {
      let n = sm[1].replace(/\+/g, " ").trim();
      n = n.replace(/@.*$/, "").replace(/data=.*$/, "").trim();
      if (n && !n.startsWith("http") && !n.startsWith("0x")) {
        return n;
      }
    }

    // Match query=PlaceName or q=PlaceName
    const qm = dec.match(/[?&](?:query|q)=([^&]+)/i);
    if (qm && qm[1]) {
      let n = qm[1].replace(/\+/g, " ").trim();
      if (n && !n.startsWith("http") && !n.startsWith("EhA")) {
        return n;
      }
    }

    // Match destination=PlaceName
    const dm = dec.match(/[?&]destination=([^&]+)/i);
    if (dm && dm[1]) {
      let n = dm[1].replace(/\+/g, " ").trim();
      if (n && !n.startsWith("http") && !n.startsWith("0x")) {
        return n;
      }
    }
  } catch {}
  return "";
}

/**
 * District detection helper from address or text
 */
function detectDistrict(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("台東") || t.includes("淺草") || t.includes("上野") || t.includes("藏前") || t.includes("入谷")) {
    return "東京都台東區（淺草／上野）";
  }
  if (t.includes("墨田") || t.includes("押上") || t.includes("晴空塔") || t.includes("錦糸町")) {
    return "東京都墨田區（晴空塔周邊）";
  }
  if (t.includes("中央") || t.includes("日本橋") || t.includes("銀座") || t.includes("築地") || t.includes("人形町")) {
    return "東京都中央區（日本橋／銀座）";
  }
  if (t.includes("千代田") || t.includes("神田") || t.includes("秋葉原") || t.includes("丸之內") || t.includes("有樂町")) {
    return "東京都千代田區（神田／秋葉原）";
  }
  if (t.includes("港區") || t.includes("六本木") || t.includes("麻布") || t.includes("赤坂") || t.includes("白金")) {
    return "東京都港區（六本木／赤坂）";
  }
  if (t.includes("新宿") || t.includes("大久保") || t.includes("歌舞伎町") || t.includes("高田馬場")) {
    return "東京都新宿區";
  }
  if (t.includes("澀谷") || t.includes("渋谷") || t.includes("原宿") || t.includes("表參道") || t.includes("代官山")) {
    return "東京都澀谷區";
  }
  if (t.includes("江東") || t.includes("有明") || t.includes("豐洲") || t.includes("台場") || t.includes("門前仲町")) {
    return "東京都江東區（有明／台場）";
  }
  if (t.includes("文京") || t.includes("本鄉") || t.includes("後樂園") || t.includes("駒込")) {
    return "東京都文京區";
  }
  if (t.includes("豐島") || t.includes("池袋") || t.includes("目白")) {
    return "東京都豐島區（池袋）";
  }
  if (t.includes("目黑") || t.includes("中目黑") || t.includes("祐天寺")) {
    return "東京都目黑區";
  }
  return "東京都內精華商圈";
}

/**
 * Deep Client-Side Place Synthesis Engine
 * Guarantees zero generic placeholder words like "東京精選推薦據點".
 */
export function synthesizePlaceData(
  rawName: string,
  url: string,
  rawText: string,
  userNotes: string = ""
): AnalyzedPlaceData {
  const combined = `${rawName} ${rawText} ${userNotes} ${url}`.toLowerCase();

  // 1. Check exact or partial landmark dictionary matches
  for (const [key, data] of Object.entries(TOKYO_LANDMARKS)) {
    if (combined.includes(key.toLowerCase())) {
      return {
        name: data.name || rawName,
        japaneseName: data.japaneseName || rawName,
        category: (data.category as any) || "dining",
        categoryLabel: data.categoryLabel || "餐廳美饌",
        highlight: data.highlight || `${data.name} 自由行私房人氣必訪推薦`,
        summary: data.summary || `${data.name} 是東京極具口碑的熱門去處，氛圍與特色深受旅人喜愛。`,
        address: data.address || detectDistrict(combined),
        tips: data.tips || "出發前可開啟 Google 地圖再次確認即時營業時間與公休日。",
      };
    }
  }

  // 2. Intelligent Category and Content Deduction based on keywords
  const district = detectDistrict(combined);
  const cleanName = (rawName || rawText || "私房探訪據點").trim();

  // Dining Keywords
  if (
    combined.includes("拉麵") ||
    combined.includes("壽司") ||
    combined.includes("燒肉") ||
    combined.includes("壽喜燒") ||
    combined.includes("牛舌") ||
    combined.includes("和牛") ||
    combined.includes("居酒屋") ||
    combined.includes("食堂") ||
    combined.includes("串燒") ||
    combined.includes("鰻魚") ||
    combined.includes("天婦羅") ||
    combined.includes("漢堡排") ||
    combined.includes("炸豬排") ||
    combined.includes("鍋") ||
    combined.includes("料理") ||
    combined.includes("割烹") ||
    combined.includes("餐廳") ||
    combined.includes("restaurant") ||
    combined.includes("sushi") ||
    combined.includes("ramen") ||
    combined.includes("yakiniku")
  ) {
    let highlight = `${cleanName} 嚴選道地風味人氣料理與招牌美食`;
    if (combined.includes("拉麵")) highlight = `${cleanName} 濃厚醇郁湯頭與現煮彈牙拉麵`;
    else if (combined.includes("壽司")) highlight = `${cleanName} 築地直送極鮮魚料與職人握壽司`;
    else if (combined.includes("燒肉")) highlight = `${cleanName} 極上頂級油花和牛與秘傳炭烤香氣`;
    else if (combined.includes("牛舌")) highlight = `${cleanName} 極厚切炭烤牛舌、麥飯與清燉牛尾湯`;
    else if (combined.includes("壽喜燒")) highlight = `${cleanName} 百年秘傳高湯割下與柔嫩黑毛和牛`;

    return {
      name: cleanName,
      japaneseName: cleanName,
      category: "dining",
      categoryLabel: "餐廳美饌",
      highlight,
      summary: `${cleanName} 位於${district}，以道地烹調技藝與新鮮食材聞名，用餐氛圍熱絡溫馨，是旅伴共享美食時光的必嚐首選。`,
      address: district,
      tips: "熱門用餐時段建議提早前往或離峰造訪，以享舒適品嚐空間；可點選地圖確認最新菜單與公休日。",
    };
  }

  // Cafe & Dessert Keywords
  if (
    combined.includes("coffee") ||
    combined.includes("cafe") ||
    combined.includes("咖啡") ||
    combined.includes("甜點") ||
    combined.includes("喫茶") ||
    combined.includes("吐司") ||
    combined.includes("cake") ||
    combined.includes("bread") ||
    combined.includes("bakery") ||
    combined.includes("烘焙") ||
    combined.includes("抹茶")
  ) {
    return {
      name: cleanName,
      japaneseName: cleanName,
      category: "cafe",
      categoryLabel: "甜點咖啡",
      highlight: `${cleanName} 手沖芳醇精品咖啡與手作精緻甜點`,
      summary: `${cleanName} 營造出溫馨愜意的休憩氛圍，提供現煮精品咖啡與每日限定甜品，是旅途散策中品味時光、放鬆小憩的完美據點。`,
      address: district,
      tips: "推薦點選招牌手沖咖啡或拿鐵，搭配當日手作烘焙點心；下午時段甜點常提早售罄建議提早到訪。",
    };
  }

  // Sightseeing Keywords
  if (
    combined.includes("shrine") ||
    combined.includes("temple") ||
    combined.includes("神社") ||
    combined.includes("寺") ||
    combined.includes("宮") ||
    combined.includes("公園") ||
    combined.includes("庭園") ||
    combined.includes("展望台") ||
    combined.includes("塔") ||
    combined.includes("美術館") ||
    combined.includes("博物館") ||
    combined.includes("城") ||
    combined.includes("橋")
  ) {
    return {
      name: cleanName,
      japaneseName: cleanName,
      category: "sightseeing",
      categoryLabel: "觀光景點",
      highlight: `${cleanName} 古典歷史風華與悠閒散策景致`,
      summary: `${cleanName} 位於${district}，環境優雅清幽，富含深厚人文底蘊與四季景致，漫步其間令人心曠神怡，非常適合安排在自由行漫遊路線中。`,
      address: district,
      tips: "造訪時建議預留彈性時間漫步參觀，欣賞周邊傳統建築風情；晨間造訪人潮最為清幽舒適。",
    };
  }

  // Shopping Keywords
  if (
    combined.includes("mall") ||
    combined.includes("market") ||
    combined.includes("商場") ||
    combined.includes("百貨") ||
    combined.includes("購物") ||
    combined.includes("store") ||
    combined.includes("shop") ||
    combined.includes("outlet") ||
    combined.includes("藥妝") ||
    combined.includes("電器")
  ) {
    return {
      name: cleanName,
      japaneseName: cleanName,
      category: "shopping",
      categoryLabel: "購物商場",
      highlight: `${cleanName} 精選品牌專櫃、生活雜貨與免稅購物一站滿足`,
      summary: `${cleanName} 匯集多元品牌、潮流服飾、在地伴手禮與人氣餐飲，動線寬敞舒適，逛街採買十分便利。`,
      address: district,
      tips: "外國旅客可至服務櫃台出示護照確認免稅服務（Tax-Free）與外國人專屬優惠券。",
    };
  }

  // Lodging Keywords
  if (
    combined.includes("hotel") ||
    combined.includes("旅館") ||
    combined.includes("飯店") ||
    combined.includes("宿") ||
    combined.includes("inn") ||
    combined.includes("resort") ||
    combined.includes("hostel") ||
    combined.includes("溫泉")
  ) {
    return {
      name: cleanName,
      japaneseName: cleanName,
      category: "stay",
      categoryLabel: "旅宿飯店",
      highlight: `${cleanName} 舒適客房、生活機能優質與交通便捷據點`,
      summary: `${cleanName} 地理位置優越，提供整潔溫馨的住宿環境與齊全設施服務，讓旅人在充實的行程後獲得充分放鬆與舒眠。`,
      address: district,
      tips: "建議留意飯店入住（Check-in）時間，提早抵達通常可先於櫃台免費寄存行李。",
    };
  }

  // Default fallback for any Tokyo spot: Never use "東京精選推薦據點"
  return {
    name: cleanName,
    japaneseName: cleanName,
    category: "dining",
    categoryLabel: "餐廳美饌",
    highlight: `${cleanName} 自由行私房人氣探訪推薦`,
    summary: `${cleanName} 位於${district}，是在地廣受歡迎的探訪點。點擊卡片右上角地圖圖示可直接開啟 Google Maps 查看即時街景、最新評價與步行路線。`,
    address: district,
    tips: "前往時可利用 Google 地圖實時步行導航，並可點擊地圖連結確認今日最新營業時間。",
  };
}

/**
 * Client-Side Direct Gemini API Call (Works when VITE_GEMINI_API_KEY or localStorage key exists)
 */
export async function analyzePlaceWithClientGemini(
  nameOrQuery: string,
  url: string,
  notes: string = ""
): Promise<AnalyzedPlaceData | null> {
  const apiKey =
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    (typeof window !== "undefined" ? localStorage.getItem("tokyo_custom_gemini_api_key") : null);

  if (!apiKey) return null;

  try {
    const prompt = `你是一位精通日本東京自由行與在地美食的資深旅人嚮導。
請為以下地點提供深度繁體中文景點/餐廳分析，嚴禁使用空泛廢話或無意義預設名稱：
地點或名稱：${nameOrQuery}
連結：${url}
筆記：${notes}

請嚴格輸出合法的純 JSON（禁止 Markdown 標記）：
{
  "name": "繁體中文名稱",
  "japaneseName": "日文原名及假名",
  "category": "dining",
  "categoryLabel": "餐廳美饌",
  "highlight": "一句話招牌亮點（30字內）",
  "summary": "2至3句話介紹核心招牌菜或歷史特色（80至130字）",
  "address": "所在區域或具體地址",
  "tips": "1至2句自由行實用避雷或預約排隊建議"
}
category 限：dining, sightseeing, shopping, cafe, stay, other
categoryLabel 對應：餐廳美饌, 觀光景點, 購物商場, 甜點咖啡, 旅宿飯店, 其他探訪`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(6000),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed && parsed.name && parsed.summary) {
          return parsed as AnalyzedPlaceData;
        }
      }
    }
  } catch (e) {
    console.warn("Client Gemini API call skipped or failed:", e);
  }

  return null;
}
