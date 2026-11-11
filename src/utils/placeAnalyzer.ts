/**
 * Intelligent Place Analyzer for Tokyo Travel Guide
 * Works both with Node server and 100% client-side on static deployments (GitHub Pages).
 */

export interface AnalyzedPlaceData {
  // Osaka-trip-2027 standard literary fields
  spotName?: string;
  categoryLabel: string;
  tag?: string;
  desc?: string;
  recommendation?: string;
  suggestedTime?: string;
  mapUrl?: string;

  // Compatibility fields
  name: string;
  japaneseName: string;
  category: "dining" | "sightseeing" | "shopping" | "cafe" | "stay" | "other";
  highlight: string;
  summary: string;
  address: string;
  tips: string;
  // Distinct Dining attributes
  cuisineType?: string;
  signatureDishes?: string[];
  priceRange?: string;
  diningAtmosphere?: string;
  // Distinct Sightseeing attributes
  spotType?: string;
  mustSeeHighlights?: string[];
  ticketInfo?: string;
  bestTimeToVisit?: string;
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
    cuisineType: "江戶前傳統豆皮壽司與干瓢卷",
    signatureDishes: ["秘傳豆皮稻荷壽司", "甘煮干瓢卷折詰盒"],
    priceRange: "約 ¥500 - ¥1,500 / 人",
    diningAtmosphere: "百年傳統外帶老鋪，適合隅田川畔野餐小憩",
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
    cuisineType: "百年黑毛和牛壽喜燒・涮涮鍋",
    signatureDishes: ["特選黑毛和牛壽喜燒定食", "百年秘傳割下和牛御膳"],
    priceRange: "午間約 ¥4,000 - ¥8,000 / 晚間約 ¥12,000+",
    diningAtmosphere: "傳統典雅日式榻榻米包廂，具備專業女將桌邊服務",
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
    cuisineType: "高級日式燒肉",
    signatureDishes: ["特選上等牛五花", "招牌蔥花牛舌", "敘敘苑招牌沙拉"],
    priceRange: "午間約 ¥3,500 - ¥6,000 / 晚間約 ¥10,000+",
    diningAtmosphere: "尊榮高空景觀席與精緻排煙包廂，極適浪漫約會聚餐",
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
    cuisineType: "高級日式燒肉",
    signatureDishes: ["特選上等牛五花", "招牌蔥花牛舌", "敘敘苑招牌沙拉"],
    priceRange: "午間約 ¥3,500 - ¥6,000 / 晚間約 ¥10,000+",
    diningAtmosphere: "尊榮高空景觀席與精緻排煙包廂，極適浪漫約會聚餐",
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
    cuisineType: "仙台炭火牛舌料理",
    signatureDishes: ["極厚切牛舌定食", "清燉牛尾湯", "山藥泥麥飯"],
    priceRange: "約 ¥2,000 - ¥3,500 / 人",
    diningAtmosphere: "日式連鎖餐廳，適合家庭朋友聚餐",
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
    cuisineType: "仙台炭火牛舌料理",
    signatureDishes: ["極厚切牛舌定食", "清燉牛尾湯", "山藥泥麥飯"],
    priceRange: "約 ¥2,000 - ¥3,500 / 人",
    diningAtmosphere: "日式連鎖餐廳，適合家庭朋友聚餐",
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
    spotType: "歷史古蹟 / 佛教寺院",
    mustSeeHighlights: ["雷門巨型紅燈籠", "仲見世通商店街", "五重塔夜間點燈"],
    ticketInfo: "境內全日免費自由參拜",
    bestTimeToVisit: "清晨 08:00 前避開人潮，或日落後欣賞夜間打燈",
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
    spotType: "歷史名勝 / 皇室宮苑",
    mustSeeHighlights: ["皇居二重橋", "東御苑歷史石垣", "5公里無號誌環形慢跑道"],
    ticketInfo: "外苑與東御苑免費入園",
    bestTimeToVisit: "清晨或傍晚散策、慢跑時段",
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
    spotType: "地標建築 / 高空展望台",
    mustSeeHighlights: ["Main Deck 360度展望台", "芝公園拍鐵塔全景", "經典夜間紅白點燈"],
    ticketInfo: "展望台門票成人約 ¥1,200起",
    bestTimeToVisit: "傍晚 17:00 前入場，同時欣賞日落黃金時刻與絢爛夜景",
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
    spotType: "現代地標 / 超高空展望台",
    mustSeeHighlights: ["天望甲板(350m)與天望回廊(450m)", "晴空街道商場採買", "隅田川夜景"],
    ticketInfo: "天望甲板門票約 ¥2,100起，建議事先預訂",
    bestTimeToVisit: "晴天午後至黃昏，遠眺富士山視野最佳",
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
    spotType: "神社參拜 / 開運求財名所",
    mustSeeHighlights: ["洗錢弁天招財之井洗錢母", "強運厄除真繭御守", "神樂殿昇龍彫刻"],
    ticketInfo: "社境全日免費參拜，洗錢與求御守開放時間約 09:00-17:00",
    bestTimeToVisit: "平日上午 09:00 前前往，避開排隊人潮",
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
 * (Works 100% on static hosts like GitHub Pages without backend)
 */
export async function unshortenGoogleMapsLinkClient(shortUrl: string): Promise<{ resolvedUrl: string; title: string }> {
  let resolvedUrl = "";
  let title = "";

  const cleanShort = shortUrl.trim();

  // 1. Try Jina Reader Proxy (Fast, follows 302 redirects, returns Final URL & Markdown)
  try {
    const jinaUrl = `https://r.jina.ai/${cleanShort}`;
    const res = await fetch(jinaUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        Accept: "text/plain",
      },
    });
    if (res.ok) {
      const text = await res.text();
      const finalUrlMatch = text.match(/Final URL:\s*(https?:\/\/[^\s\n]+)/i);
      if (finalUrlMatch && finalUrlMatch[1]) {
        resolvedUrl = finalUrlMatch[1].trim();
      }

      const titleMatch = text.match(/Title:\s*([^\n\r]+)/i);
      if (titleMatch && titleMatch[1]) {
        let t = titleMatch[1].trim();
        t = t.replace(/\s*[-–—|]\s*Google\s*(?:Maps|地圖|マップ)?.*$/i, "").trim();
        t = t.replace(/\s*[-–—|]\s*Google.*$/i, "").trim();
        if (t && !t.includes("Google") && t !== "Google Maps") {
          title = t;
        }
      }
    }
  } catch (e) {
    // Continue to next fallback
  }

  // 2. Try unshorten.me if not resolved yet
  if (!resolvedUrl) {
    try {
      const unRes = await fetch("https://unshorten.me/json/" + encodeURIComponent(cleanShort), {
        signal: AbortSignal.timeout(2500),
      });
      if (unRes.ok) {
        const uData = await unRes.json();
        if (uData?.resolved_url) {
          resolvedUrl = uData.resolved_url;
        }
      }
    } catch (e) {
      // Continue
    }
  }

  // 3. Try AllOrigins as third fallback
  if (!resolvedUrl) {
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(cleanShort)}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.status?.url) {
          resolvedUrl = data.status.url;
        }
        if (data?.contents && typeof data.contents === "string") {
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
      // Ignore
    }
  }

  // If resolvedUrl is a Google consent redirect, extract the actual continue= destination
  if (resolvedUrl.includes("consent.google.com")) {
    try {
      const continueMatch = resolvedUrl.match(/[?&]continue=([^&#]+)/i);
      if (continueMatch && continueMatch[1]) {
        resolvedUrl = decodeURIComponent(continueMatch[1]);
      }
    } catch {}
  }

  return { resolvedUrl, title };
}

/**
 * Sanitizes any Google Maps URL to ensure it NEVER opens Google's Cookie consent page
 */
export function cleanGoogleMapsLink(rawUrl: string, fallbackName?: string): string {
  if (!rawUrl) {
    return fallbackName
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackName)}`
      : "https://www.google.com/maps";
  }

  let clean = rawUrl.trim();

  // Strip consent.google.com wrapper if present
  if (clean.includes("consent.google.com")) {
    try {
      const match = clean.match(/[?&]continue=([^&#]+)/i);
      if (match && match[1]) {
        clean = decodeURIComponent(match[1]);
      }
    } catch {}
  }

  // Strip sorry/index bot check wrapper
  if (clean.includes("google.com/sorry")) {
    try {
      const match = clean.match(/[?&]continue=([^&#]+)/i);
      if (match && match[1]) {
        clean = decodeURIComponent(match[1]);
      }
    } catch {}
  }

  // Fallback if still consent
  if (clean.includes("consent.google.com") || clean.includes("google.com/sorry")) {
    if (fallbackName) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackName)}`;
    }
    return "https://www.google.com/maps";
  }

  // If not HTTP, format as Google Maps search
  if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clean || fallbackName || "東京")}`;
  }

  return clean;
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
      const spotTitle = data.name || rawName;
      const spotDesc = data.summary || `${spotTitle} 是東京極具口碑的熱門去處，氛圍與特色深受旅人喜愛。`;
      const spotRec = data.tips || `${spotTitle} 推薦招牌特色；造訪前可開啟地圖確認營業狀態。`;
      return {
        spotName: spotTitle,
        categoryLabel: data.categoryLabel || "餐廳美饌",
        tag: `東京散策、${data.categoryLabel || "人氣探訪"}、自由行推薦`,
        desc: spotDesc,
        recommendation: spotRec,
        suggestedTime: data.bestTimeToVisit || "午後散策時段",
        mapUrl: url,

        name: spotTitle,
        japaneseName: data.japaneseName || rawName,
        category: (data.category as any) || "dining",
        highlight: data.highlight || `${spotTitle} 自由行私房人氣必訪推薦`,
        summary: spotDesc,
        address: data.address || detectDistrict(combined),
        tips: spotRec,
        cuisineType: data.cuisineType,
        signatureDishes: data.signatureDishes,
        priceRange: data.priceRange,
        diningAtmosphere: data.diningAtmosphere,
        spotType: data.spotType,
        mustSeeHighlights: data.mustSeeHighlights,
        ticketInfo: data.ticketInfo,
        bestTimeToVisit: data.bestTimeToVisit,
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
    let cuisineType = "日式特色料理";
    let signatureDishes = ["主廚特選料理", "人氣定番菜色"];
    if (combined.includes("拉麵")) {
      highlight = `${cleanName} 濃厚醇郁湯頭與現煮彈牙拉麵`;
      cuisineType = "道地日式拉麵・沾麵";
      signatureDishes = ["特製招牌拉麵", "炙燒叉燒糖心蛋"];
    } else if (combined.includes("壽司")) {
      highlight = `${cleanName} 築地直送極鮮魚料與職人握壽司`;
      cuisineType = "江戶前壽司・海鮮料理";
      signatureDishes = ["主廚特選握壽司盛合", "極鮮鮪魚中腹手卷"];
    } else if (combined.includes("燒肉")) {
      highlight = `${cleanName} 極上頂級油花和牛與秘傳炭烤香氣`;
      cuisineType = "日式炭火高級燒肉";
      signatureDishes = ["特上牛五花", "蔥花極厚牛舌", "招牌拌沙拉"];
    } else if (combined.includes("牛舌")) {
      highlight = `${cleanName} 極厚切炭烤牛舌、麥飯與清燉牛尾湯`;
      cuisineType = "仙台炭火牛舌專門";
      signatureDishes = ["極厚切牛舌定食", "清燉牛尾湯", "山藥泥麥飯"];
    } else if (combined.includes("壽喜燒")) {
      highlight = `${cleanName} 百年秘傳高湯割下與柔嫩黑毛和牛`;
      cuisineType = "黑毛和牛壽喜燒・涮涮鍋";
      signatureDishes = ["特選和牛壽喜燒定食", "百年割下和牛御膳"];
    }

    return {
      spotName: cleanName,
      desc: `${cleanName} 位於${district}，以道地烹調技藝與新鮮食材聞名，空氣中瀰漫著誘人料理香氣，每一口都感受得到對食材的專注堅持，是旅程中療癒味蕾的極上選擇。`,
      recommendation: "建議品嚐店內的招牌現做料理；尖峰用餐時段人潮較多，推薦提早前往候位或離峰造訪，以享舒適品嚐空間。",
      suggestedTime: "午間定食或晚間用餐時段",
      tag: `東京散策、在地美食、自由行推薦`,
      mapUrl: url,

      name: cleanName,
      japaneseName: cleanName,
      category: "dining",
      categoryLabel: "餐廳美饌",
      highlight,
      summary: `${cleanName} 位於${district}，以道地烹調技藝與新鮮食材聞名，用餐氛圍熱絡溫馨，是旅伴共享美食時光的必嚐首選。`,
      address: district,
      tips: "熱門用餐時段建議提早前往或離峰造訪，以享舒適品嚐空間；可點選地圖確認最新菜單與公休日。",
      cuisineType,
      signatureDishes,
      priceRange: "約 ¥1,500 - ¥4,000 / 人",
      diningAtmosphere: "道地溫馨日式食堂與熱絡用餐氛圍",
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
      spotName: cleanName,
      desc: `${cleanName} 營造出寧靜溫柔的木質休憩氛圍，現煮精品咖啡香氣流淌，搭配每日手作限定甜點，將旅途中的奔波悄悄撫平，沉浸在優雅愜意的午後時光。`,
      recommendation: "推薦點選招牌手沖咖啡或拿鐵，搭配當日手作烘焙點心；下午時段甜點常提早售罄建議提早到訪。",
      suggestedTime: "午後悠閒散策時段 (13:30 - 16:30)",
      tag: `東京咖啡、手作甜點、午茶散策`,
      mapUrl: url,

      name: cleanName,
      japaneseName: cleanName,
      category: "cafe",
      categoryLabel: "甜點咖啡",
      highlight: `${cleanName} 手沖芳醇精品咖啡與手作精緻甜點`,
      summary: `${cleanName} 營造出溫馨愜意的休憩氛圍，提供現煮精品咖啡與每日限定甜品，是旅途散策中品味時光、放鬆小憩的完美據點。`,
      address: district,
      tips: "推薦點選招牌手沖咖啡或拿鐵，搭配當日手作烘焙點心；下午時段甜點常提早售罄建議提早到訪。",
      cuisineType: "精品手沖咖啡・法式手作烘焙甜點",
      signatureDishes: ["招牌手沖精品咖啡", "當季水果千層蛋糕"],
      priceRange: "約 ¥800 - ¥1,800 / 人",
      diningAtmosphere: "優雅放鬆文青空間，適合悠閒歇腳與拍照",
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
    let spotType = "歷史古蹟 / 名勝古剎";
    let mustSeeHighlights = ["傳統建築工藝", "四季景致庭園"];
    if (combined.includes("神社") || combined.includes("寺")) {
      spotType = "古老神社寺院 / 祈福名所";
      mustSeeHighlights = ["壯麗鳥居與山門", "御守祈福參拜", "境內歷史造景"];
    } else if (combined.includes("展望台") || combined.includes("塔")) {
      spotType = "高空展望台 / 都會地標";
      mustSeeHighlights = ["360度東京天際線俯瞰", "夕陽與璀璨百萬夜景"];
    } else if (combined.includes("公園") || combined.includes("庭園")) {
      spotType = "都會綠洲 / 悠閒日式庭園";
      mustSeeHighlights = ["迴遊式庭園水景", "四季櫻花與紅葉步道"];
    }

    return {
      spotName: cleanName,
      desc: `${cleanName} 佇立在${district}，承載著深厚文化與歲月沉澱，微風輕拂綠意，隨處可見歷史與當代生活交織的細膩痕跡，是自由行散策途中最舒心難忘的探訪角落。`,
      recommendation: "造訪時建議預留彈性時間漫步參觀，欣賞周邊傳統建築風情；晨間造訪人潮最為清幽舒適。",
      suggestedTime: "清晨參拜或黃昏散策時段",
      tag: `東京名勝、歷史古蹟、散策攝影`,
      mapUrl: url,

      name: cleanName,
      japaneseName: cleanName,
      category: "sightseeing",
      categoryLabel: "觀光景點",
      highlight: `${cleanName} 古典歷史風華與悠閒散策景致`,
      summary: `${cleanName} 位於${district}，環境優雅清幽，富含深厚人文底蘊與四季景致，漫步其間令人心曠神怡，非常適合安排在自由行漫遊路線中。`,
      address: district,
      tips: "造訪時建議預留彈性時間漫步參觀，欣賞周邊傳統建築風情；晨間造訪人潮最為清幽舒適。",
      spotType,
      mustSeeHighlights,
      ticketInfo: "境內免票或依現場購票規定為準",
      bestTimeToVisit: "清晨 08:30 前或黃昏日落時段",
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
      spotName: cleanName,
      desc: `${cleanName} 匯集多元特色品牌與潮流雜貨，動線開闊明亮，逛街採買十分舒適便捷，能一站滿足各類伴手禮與生活選物需求。`,
      recommendation: "外國旅客可至服務櫃台出示護照確認免稅服務（Tax-Free）與外國人專屬優惠券。",
      suggestedTime: "午後或晚間採買時段",
      tag: `東京購物、免稅商場、精選伴手禮`,
      mapUrl: url,

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
      spotName: cleanName,
      desc: `${cleanName} 地理位置優越，提供整潔溫馨的住宿環境與齊全設施服務，讓旅人在充實的行程後獲得充分放鬆與舒眠。`,
      recommendation: "建議留意飯店入住（Check-in）時間，提早抵達通常可先於櫃台免費寄存行李。",
      suggestedTime: "入住登記時段 (15:00 後)",
      tag: `東京住宿、交通便利、舒適旅宿`,
      mapUrl: url,

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
    spotName: cleanName,
    desc: `${cleanName} 位於${district}，以其獨特的在地魅力與熱情氛圍吸引旅人前來探訪，是自由行散策途中值得駐足感受的特色去處。`,
    recommendation: "前往時可利用 Google 地圖實時步行導航，並可點擊地圖連結確認今日最新營業時間。",
    suggestedTime: "午後散策時段",
    tag: `東京散策、自由行推薦、私房清單`,
    mapUrl: url,

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
  "tips": "1至2句自由行實用避雷或預約排隊建議",
  "cuisineType": "若為餐飲則填寫料理種類（如：黑毛和牛壽喜燒、仙台炭火牛舌、濃厚豚骨拉麵），非餐飲留空",
  "signatureDishes": ["招牌菜色1", "招牌菜色2"],
  "priceRange": "若為餐飲則填人均預估預算（如：約 ¥1,500 - ¥3,000 / 人）",
  "diningAtmosphere": "若為餐飲填寫用餐特色氛圍（如：景觀高空席、溫馨熱絡食堂、百年老鋪）",
  "spotType": "若為景點則填寫景點類型（如：歷史名勝、開運求財神社、都會高空展望台），非景點留空",
  "mustSeeHighlights": ["必看亮點1", "必看亮點2"],
  "ticketInfo": "若為景點填寫門票或參拜資訊（如：境內免費自由參拜、展望台門票約 ¥2,000起）",
  "bestTimeToVisit": "若為景點填寫最佳造訪時段（如：清晨08:00前清幽無人、日落黃昏百萬夜景）"
}
category 限：dining, sightseeing, shopping, cafe, stay, other
categoryLabel 對應：餐廳美饌, 觀光景點, 購物商場, 甜點咖啡, 旅宿飯店, 其他探訪`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(10000),
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
          // Hard enforce dining category if name or summary mentions dining terms
          const combinedStr = `${parsed.name} ${parsed.summary} ${parsed.highlight || ""}`.toLowerCase();
          const diningTerms = ["燒肉", "壽司", "拉麵", "壽喜燒", "牛舌", "和牛", "居酒屋", "食堂", "鰻魚", "天婦羅", "丼", "串燒", "鍋", "割烹", "料理", "餐廳", "sushi", "ramen", "yakiniku"];
          if (diningTerms.some((k) => combinedStr.includes(k))) {
            parsed.category = "dining";
            parsed.categoryLabel = "餐廳美饌";
          }
          return parsed as AnalyzedPlaceData;
        }
      }
    }
  } catch (e) {
    console.warn("Client Gemini API call skipped or failed:", e);
  }

  return null;
}
