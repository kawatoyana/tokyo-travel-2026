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
  resolvedUrl?: string;

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

export interface ClientUnshortenResult {
  resolvedUrl: string;
  title: string;
  japaneseTitle?: string;
  googleCategory?: string;
  rating?: string;
  reviewCount?: string;
  editorialSummary?: string;
  address?: string;
  hoursNote?: string;
  categoryClue?: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
  yahooCategory?: string;
  tabelogRating?: string;
  tabelogReviews?: string;
  isHyakumeiten?: boolean;
  foundingYear?: string;
  menuItems?: string[];
  priceRangeHint?: string;
  accessInfo?: string;
  extraHighlights?: string[];
  wikiSummary?: string;
  osmCategory?: string;
  osmType?: string;
}

export function toJapaneseAreaHint(str: string): string {
  if (!str) return "";
  return str
    .replace(/澀谷/g, "渋谷")
    .replace(/淺草/g, "浅草")
    .replace(/武藏野/g, "武蔵野")
    .replace(/惠比壽/g, "恵比寿")
    .replace(/廣尾/g, "広尾")
    .replace(/豐洲/g, "豊洲")
    .replace(/濱松町/g, "浜松町")
    .replace(/龜戶/g, "亀戸")
    .replace(/高圓寺/g, "高円寺")
    .replace(/神樂坂/g, "神楽坂")
    .replace(/表參道/g, "表参道")
    .replace(/自由之丘/g, "自由が丘")
    .replace(/橫濱/g, "横浜")
    .replace(/關西/g, "関西")
    .replace(/大阪梅田/g, "梅田")
    .replace(/東京站/g, "東京駅")
    .replace(/車站/g, "駅")
    .replace(/區/g, "区")
    .trim();
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

const KNOWN_AREA_BRANCH_TOKENS = [
  "千代田区", "中央区", "港区", "新宿区", "文京区", "台東区", "墨田区", "江東区", "品川区", "目黒区", "大田区", "世田谷区",
  "渋谷区", "中野区", "杉並区", "豊島区", "北区", "荒川区", "板橋区", "練馬区", "足立区", "葛飾区", "江戸川区",
  "渋谷", "神宮前", "新宿", "西新宿", "銀座", "原宿", "表参道", "南青山", "北青山", "青山", "恵比寿", "中目黒", "代官山", "六本木", "麻布十番", "麻布台", "赤坂",
  "池袋", "上野", "浅草", "西浅草", "雷門", "駒形", "三筋", "蔵前", "合羽橋", "松が谷", "入谷",
  "秋葉原", "神田", "日本橋", "人形町", "築地", "丸の内", "東京駅", "有楽町", "日比谷",
  "品川", "五反田", "目黒", "新橋", "浜松町", "大門", "押上", "スカイツリー", "錦糸町", "両国", "門前仲町", "清澄白河",
  "豊洲", "有明", "台場", "お台場", "吉祥寺", "三鷹", "中野", "高円寺", "下北沢", "自由が丘", "二子玉川", "飯田橋",
  "神楽坂", "水道橋", "九段下", "本郷", "駒込", "巣鴨", "千駄ヶ谷", "北千住", "谷中", "根津", "千駄木",
  "横浜", "鎌倉", "道頓堀", "難波", "心斎橋", "梅田", "祇園",
];

export function extractAreaBranchTokens(text: string): string[] {
  if (!text) return [];
  const norm = toJapaneseAreaHint(text).toLowerCase();
  const found = new Set<string>();
  for (const tok of KNOWN_AREA_BRANCH_TOKENS) {
    if (norm.includes(tok.toLowerCase())) {
      found.add(tok);
      if (tok.endsWith("区") && /^(?:新宿|渋谷|世田谷|目黒|品川|豊島|文京|墨田|江東|中野|杉並|北|太田)区$/.test(tok)) {
        found.add(tok.slice(0, -1));
      }
    }
  }
  // Guard "京都" against matching inside "東京都", and "寿" against matching inside "寿司" / "恵比寿"
  if (/(?:^|[^東])京都/.test(norm)) found.add("京都");
  if (/(?:台東区|浅草|蔵前)?\s*寿[1-4０-９丁目]|寿町/.test(norm)) found.add("寿");
  const enMap: Record<string, string[]> = {
    chiyoda: ["千代田区"], chuo: ["中央区"], minato: ["港区"], shinjuku: ["新宿区", "新宿"], "nishi-shinjuku": ["西新宿"], nishishinjuku: ["西新宿"],
    bunkyo: ["文京区", "文京"], taito: ["台東区"], sumida: ["墨田区", "墨田"], koto: ["江東区", "江東"],
    shibuya: ["渋谷区", "渋谷"], jingumae: ["神宮前"], ginza: ["銀座"], harajuku: ["原宿"], omotesando: ["表参道"], aoyama: ["青山"], "minami-aoyama": ["南青山"], minamiaoyama: ["南青山"], "kita-aoyama": ["北青山"],
    ebisu: ["恵比寿"], nakameguro: ["中目黒"], daikanyama: ["代官山"], roppongi: ["六本木"], akasaka: ["赤坂"],
    ikebukuro: ["池袋"], ueno: ["上野"], asakusa: ["浅草"], kaminarimon: ["雷門"], komagata: ["駒形"], kotobuki: ["寿"], kuramae: ["蔵前"], kappabashi: ["合羽橋"],
    akihabara: ["秋葉原"], kanda: ["神田"], nihonbashi: ["日本橋"], ningyocho: ["人形町"], tsukiji: ["築地"], marunouchi: ["丸の内"], yurakucho: ["有楽町"],
    shinagawa: ["品川"], shinbashi: ["新橋"], oshiage: ["押上"], skytree: ["スカイツリー"], toyosu: ["豊洲"],
    ariake: ["有明"], odaiba: ["お台場"], kichijoji: ["吉祥寺"], nakano: ["中野"], shimokitazawa: ["下北沢"],
    jiyugaoka: ["自由が丘"], kagurazaka: ["神楽坂"], hongo: ["本郷"], yanaka: ["谷中"], nezu: ["根津"], sendagi: ["千駄木"],
    yokohama: ["横浜"], namba: ["難波"], umeda: ["梅田"], kyoto: ["京都"], setagaya: ["世田谷区", "世田谷"],
    kiyosumi: ["清澄白河"], azabudai: ["麻布台"], sendagaya: ["千駄ヶ谷"], kudanshita: ["九段下"], suidobashi: ["水道橋"],
  };
  for (const [en, jps] of Object.entries(enMap)) {
    if (new RegExp(`\\b${en}\\b`, "i").test(norm)) {
      for (const jp of jps) found.add(jp);
    }
  }
  if (norm.includes("神宮前")) {
    found.add("神宮前");
    found.add("表参道");
    found.add("原宿");
    found.add("渋谷");
  }
  return Array.from(found);
}

function normalizeVariantCjkClient(str: string): string {
  return str
    .replace(/[゛゜]/g, "")
    .replace(/淺/g, "浅").replace(/廣/g, "広").replace(/藏/g, "蔵").replace(/惠/g, "恵")
    .replace(/壽/g, "寿").replace(/麵/g, "麺").replace(/燒/g, "焼").replace(/雞/g, "鶏")
    .replace(/鐵/g, "鉄").replace(/櫻/g, "桜").replace(/龜/g, "亀").replace(/龍/g, "竜")
    .replace(/圓/g, "円").replace(/國/g, "国").replace(/區/g, "区").replace(/驛/g, "駅")
    .replace(/站/g, "駅").replace(/鋪/g, "舗").replace(/實/g, "実").replace(/樂/g, "楽")
    .replace(/藝/g, "芸").replace(/萬/g, "万").replace(/與/g, "と").replace(/澀/g, "渋")
    .replace(/澤/g, "沢").replace(/豐/g, "豊").replace(/濱/g, "浜").replace(/雜/g, "雑")
    .replace(/德/g, "徳").replace(/學/g, "学");
}

function isDmsOrCoordNameClient(s: string): boolean {
  const t = (s || "").trim();
  if (!t) return true;
  if (/^[\d.,\s+-]+$/.test(t)) return true;
  if (/\d+°\d+['′]/.test(t) || /^[NSWE]?\s*\d{1,3}°/.test(t)) return true;
  if (/^-?[\d.]+,\s*-?[\d.]+$/.test(t)) return true;
  return false;
}

function extractCoreEntityTokensClient(name: string): string[] {
  const norm = normalizeVariantCjkClient(name).toLowerCase();
  const stopWords = new Set([
    "tokyo", "osaka", "kyoto", "japan", "ginza", "shibuya", "shinjuku", "asakusa", "ueno", "harajuku",
    "ebisu", "nakameguro", "kuramae", "yanaka", "nihonbashi", "store", "shop", "shrine", "temple",
    "park", "garden", "museum", "tower", "station", "hotel", "inn", "cafe", "coffee", "restaurant",
    "the", "and", "of", "at", "in", "東京", "大阪", "京都", "日本", "銀座", "渋谷", "新宿", "浅草",
    "本店", "支店", "店舗", "神社", "寺院", "公園", "庭園", "美術館", "博物館", "商店", "店",
  ]);
  const tokens = new Set<string>();
  for (const m of norm.matchAll(/[a-z0-9]{2,}/g)) {
    if (!/^\d+$/.test(m[0]) && !stopWords.has(m[0])) tokens.add(m[0]);
  }
  for (const m of norm.matchAll(/[a-z0-9]+&[a-z0-9]+/g)) {
    tokens.add(m[0]);
  }
  for (const m of norm.matchAll(/[\u30a0-\u30ffー]{2,}/g)) {
    tokens.add(m[0]);
  }
  for (const m of norm.matchAll(/[\u4e00-\u9fa5]{2,}/g)) {
    const w = m[0];
    if (!stopWords.has(w)) {
      tokens.add(w);
      if (w.length >= 3) {
        for (let i = 0; i <= w.length - 2; i++) {
          const bi = w.slice(i, i + 2);
          if (!stopWords.has(bi)) tokens.add(bi);
        }
      }
    }
  }
  return Array.from(tokens);
}

interface ClientLandmarkGuard {
  coords?: [number, number];
  isChain?: boolean;
  branchTokens?: string[];
  requirePattern?: RegExp;
  excludePattern?: RegExp;
}

const CLIENT_LANDMARK_GUARDS: Record<string, ClientLandmarkGuard> = {
  "志乃多": { coords: [35.6860, 139.7825], isChain: true, branchTokens: ["日本橋", "人形町"] },
  "今半": { coords: [35.7136, 139.7924], isChain: true, branchTokens: ["浅草", "国際通り", "西浅草"] },
  "敘敘苑": { coords: [35.7101, 139.8107], isChain: true, branchTokens: ["押上", "スカイツリー", "晴空塔"] },
  "叙々苑": { coords: [35.7101, 139.8107], isChain: true, branchTokens: ["押上", "スカイツリー", "晴空塔"] },
  "利久": { coords: [35.6345, 139.7905], isChain: true, branchTokens: ["有明", "江東"] },
  "afuri": { coords: [35.6725, 139.7042], isChain: true, branchTokens: ["原宿", "千駄ヶ谷"] },
  "dixans": { coords: [35.6873, 139.7819], isChain: true, branchTokens: ["日本橋", "人形町", "富沢町", "中央"] },
  "harbs": { coords: [35.6590, 139.7034], isChain: true, branchTokens: ["渋谷", "ヒカリエ", "hikarie"] },
  "teamlab": { coords: [35.6491, 139.7897], isChain: true, branchTokens: ["豊洲", "新豊洲", "江東"] },
  "築地": {
    coords: [35.6648, 139.7703],
    requirePattern: /築地場外|築地市場|tsukiji\s*(?:outer\s*)?market/i,
    excludePattern: /本願寺|銀だこ|すしざんまい|玉寿司|駅|station|hotel|ホテル/i,
  },
  "挽肉與米": { requirePattern: /挽肉と米|挽肉與米/i, isChain: true, branchTokens: [] },
  "一蘭": { isChain: true, branchTokens: [] },
  "金子半之助": { coords: [35.6858, 139.7745], isChain: true, branchTokens: ["日本橋", "室町", "中央"] },
  "淺草寺": { coords: [35.7148, 139.7967], excludePattern: /公園|駅|ホテル|hotel|inn|cafe|咖啡|restaurant/i },
  "皇居": { coords: [35.6852, 139.7528], excludePattern: /ホテル|hotel|run|ラン|cafe|駅/i },
  "東京鐵塔": { coords: [35.6586, 139.7454], excludePattern: /駅|hotel|cafe|restaurant/i },
  "晴空塔": { coords: [35.7101, 139.8107], excludePattern: /叙々苑|敘敘苑|harbs|ポケモン|pokemon|cafe|restaurant|shop/i },
  "有明花園": { coords: [35.6345, 139.7905], excludePattern: /利久|無印|aeon|イオン|spa|泉天空|hotel/i },
};

/**
 * Attempt to unshorten Google Maps short link client-side via CORS-friendly proxies
 * (Works 100% on static hosts like GitHub Pages without backend)
 */
export async function unshortenGoogleMapsLinkClient(shortUrl: string): Promise<ClientUnshortenResult> {
  let resolvedUrl = "";
  let title = "";
  let japaneseTitle = "";
  let googleCategory = "";
  let rating = "";
  let reviewCount = "";
  let editorialSummary = "";
  let address = "";
  let hoursNote = "";

  const cleanShort = shortUrl.trim();
  const isShort =
    cleanShort.includes("maps.app.goo.gl") ||
    cleanShort.includes("goo.gl") ||
    cleanShort.includes("g.co/") ||
    cleanShort.includes("page.link");

  if (!isShort && cleanShort.startsWith("http")) {
    resolvedUrl = cleanShort;
    title = extractPlaceNameFromUrl(cleanShort);
  }

  const unwrapRedirect = (u: string): string => {
    let cur = u;
    for (let i = 0; i < 3; i++) {
      if (cur.includes("consent.google.com") || cur.includes("google.com/sorry")) {
        const m = cur.match(/[?&]continue=([^&#]+)/i);
        if (m && m[1]) {
          try {
            cur = decodeURIComponent(m[1]);
            continue;
          } catch {}
        }
      }
      break;
    }
    return cur;
  };

  const isLikelyStreetAddress = (cand: string): boolean => {
    const c = cand.trim();
    if (!c || c.length < 5 || c.length > 140) return false;
    if (/^(?:This|The|A|An)\s+[a-z]+\b/i.test(c)) return false;
    if (/\b(?:is the main|with scenic|tours of|residence of|famous for|known for|features a|featuring)\b/i.test(c)) return false;
    return /(?:〒?\d{3}-\d{4}|(?:東京都|大阪府|京都府|神奈川県|千葉県|埼玉県|北海道|福岡県)|[\u4e00-\u9fa5]+[市区町村郡]|丁目|番地|\b\d+-\d+|\bChome\b|\b-ku\b|\b-shi\b)/i.test(c);
  };

  // 1. Try Jina Reader Proxy ONLY for short links or non-google-maps URLs without a title
  // (Jina blocks direct www.google.com/maps/... URLs with 403 AbuseAlleviationError, whereas maps.app.goo.gl returns 200!)
  if (isShort || !title) {
    try {
      const jinaUrl = `https://r.jina.ai/${cleanShort}`;
      const res = await fetch(jinaUrl, {
        signal: AbortSignal.timeout(9500),
        headers: {
          Accept: "text/plain",
        },
      });
      if (res.ok) {
        const text = await res.text();
        if (!text.trim().startsWith("{")) {
          const finalUrlMatch = text.match(/Final URL:\s*(https?:\/\/[^\s\n]+)/i);
          if (finalUrlMatch && finalUrlMatch[1]) {
            resolvedUrl = unwrapRedirect(finalUrlMatch[1].trim());
          }

          const ignoredHeadings = /^(?:google\s*maps|google\s*地圖|google\s*マップ|before you continue.*|sign in|consent.*|sorry.*|access denied.*)$/i;
          const h1Matches = text.matchAll(/^#\s+([^\n\r]+)/gm);
          for (const m of h1Matches) {
            const candidate = m[1].trim();
            if (candidate && !ignoredHeadings.test(candidate) && !candidate.startsWith("[") && !isDmsOrCoordNameClient(candidate)) {
              title = candidate;
              break;
            }
          }

          const ignoredH2 = /^(photos|review summary|reviews|admission|about these results|overview|about|people also search for|web results|before you continue.*|sign in|manage options)$/i;
          const h2Matches = text.matchAll(/^##\s+([^\n\r]+)/gm);
          for (const m of h2Matches) {
            const candidate = m[1].trim();
            if (candidate && !ignoredH2.test(candidate) && !candidate.startsWith("[") && !isDmsOrCoordNameClient(candidate)) {
              japaneseTitle = candidate;
              break;
            }
          }

          if (!title) {
            const titleMatch = text.match(/Title:\s*([^\n\r]+)/i);
            if (titleMatch && titleMatch[1]) {
              const rawT = titleMatch[1].trim();
              if (rawT.includes("/maps/place/") && !resolvedUrl) {
                resolvedUrl = unwrapRedirect(rawT);
              }
              let t = rawT.replace(/\s*[-–—|·]\s*Google\s*(?:Maps|地圖|マップ)?.*$/i, "").trim();
              t = t.replace(/\s*[-–—|·]\s*Google.*$/i, "").trim();
              if (t && !t.startsWith("http") && !ignoredHeadings.test(t) && !isDmsOrCoordNameClient(t)) {
                title = t;
              }
            }
          }

          const ratingCatMatch = text.match(/(\d\.\d)\(([0-9,]+)\)([A-Za-z\u4e00-\u9fa5\u3040-\u30ff][A-Za-z0-9\u4e00-\u9fa5\u3040-\u30ff\s/&'-]{1,40}?)(?=[·\n\r\uE000-\uF8FF]|$)/);
          if (ratingCatMatch) {
            rating = ratingCatMatch[1];
            reviewCount = ratingCatMatch[2];
            googleCategory = ratingCatMatch[3]
              .replace(/(?:Overview|Reviews|About|Directions|Save|Nearby|Tickets)$/i, "")
              .trim();
          }

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
                editorialSummary = line;
                break;
              }
            }
          }

          const addrIconMatch = text.match(/\uE0C8([^\n\r\uE000-\uF8FF]{8,140})/);
          if (addrIconMatch && addrIconMatch[1]) {
            const cand = addrIconMatch[1].trim();
            if (isLikelyStreetAddress(cand)) address = cand;
          }
          if (!address) {
            const japanAddrMatch =
              text.match(/(Japan,\s*〒?\d{3}-\d{4}[^\n\r]{4,120})/i) ||
              text.match(/(〒\d{3}-\d{4}\s*[^\n\r]{4,120})/) ||
              text.match(/((?:東京都|大阪府|京都府|神奈川県|千葉県|埼玉県|北海道|福岡県)[^\n\r]{4,90})/);
            if (japanAddrMatch && japanAddrMatch[1]) {
              const cand = japanAddrMatch[1].replace(/[\uE000-\uF8FF]/g, "").trim();
              if (isLikelyStreetAddress(cand)) address = cand;
            }
          }

          const closesMatch = text.match(/Open\s*·\s*Closes\s*(\d{1,2}(?::\d{2})?\s*[AP]M)/i);
          if (closesMatch) {
            hoursNote = `營業至 ${closesMatch[1]}`;
          }
        }
      }
    } catch {
      // Continue cleanly to coordinate + Yahoo + Wikipedia pipeline
    }
  }

  resolvedUrl = unwrapRedirect(resolvedUrl);

  // Extract category clue from !15s protobuf OR Google category string
  let categoryClue = "";
  const catLower = googleCategory.toLowerCase();
  if (/(cake shop|pastry|bakery|patisserie|dessert|donut|doughnut|cafe|coffee|tea house|ice cream|confectionery)/.test(catLower)) {
    categoryClue = "cafe";
  } else if (/(sushi|ramen|restaurant|izakaya|yakitori|yakiniku|udon|soba|tonkatsu|tempura|seafood|steak|bar|pub|dining|bistro)/.test(catLower)) {
    categoryClue = "dining";
  } else if (/(shrine|shinto|temple|buddhist|museum|art gallery|park|garden|tourist attraction|historical landmark|castle|aquarium|zoo|landmark|observatory|monument|botanical)/.test(catLower)) {
    categoryClue = "sightseeing";
  } else if (/(shopping mall|department store|stationery|book store|bookstore|cutlery|kitchen supply|hardware|variety store|general store|gift shop|clothing store|home goods|furniture|electronics|drugstore|pharmacy|store|shop|market|outlet|florist|boutique|jewelry)/.test(catLower)) {
    categoryClue = "shopping";
  } else if (/(hotel|lodging|inn|ryokan|hostel)/.test(catLower)) {
    categoryClue = "stay";
  }

  if (!categoryClue) {
    const dataMatch = resolvedUrl.match(/!15s([A-Za-z0-9_-]+)/);
    if (dataMatch && dataMatch[1] && typeof atob === "function") {
      try {
        const b64 = dataMatch[1].replace(/-/g, "+").replace(/_/g, "/");
        const protoAscii = atob(b64).toLowerCase();
        if (/(cake_shop|pastry|bakery|cafe|coffee|dessert|tea_house|ice_cream|confectionery|donut)/.test(protoAscii)) {
          categoryClue = "cafe";
        } else if (/(sushi|ramen|restaurant|izakaya|yakitori|yakiniku|udon|soba|tonkatsu|tempura|seafood|steak|bar|pub|food|dining)/.test(protoAscii)) {
          categoryClue = "dining";
        } else if (/(shrine|shinto|temple|buddhist|museum|art_gallery|park|garden|tourist_attraction|historical_landmark|castle|aquarium|zoo|landmark|observatory|monument)/.test(protoAscii)) {
          categoryClue = "sightseeing";
        } else if (/(shopping_mall|department_store|stationery|book_store|clothing_store|gift_shop|variety_store|home_goods|hardware_store|kitchen_supply|cutlery|store|shop|market|boutique|drugstore|pharmacy|electronics)/.test(protoAscii)) {
          categoryClue = "shopping";
        } else if (/(hotel|lodging|inn|ryokan|hostel)/.test(protoAscii)) {
          categoryClue = "stay";
        }
      } catch {}
    }
  }

  // CORS-friendly Client-side Reverse Geocoding via HeartRails GeoAPI + Photon OSM + BigDataCloud (+ Wiki GeoSearch for coord-only pins)
  // Note: Nominatim returns 403 in browser CORS requests, whereas HeartRails, Photon, BigDataCloud, and Wikipedia return 200 ACAO: *!
  let neighborhood = "";
  let lat: number | undefined;
  let lng: number | undefined;
  let osmCategory: string | undefined = undefined;
  let osmType: string | undefined = undefined;
  if (resolvedUrl || cleanShort) {
    const coordSource = resolvedUrl || cleanShort;
    const coordMatch = coordSource.match(/!3d(-?[0-9.]+)!4d(-?[0-9.]+)/) || coordSource.match(/@(-?[0-9.]+),(-?[0-9.]+)/);
    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[2]);
      const needsCoordPoi = !title || isDmsOrCoordNameClient(title);
      const [hrResObj, bdcResObj, photonResObj, wikiGeoResObj] = await Promise.all([
        fetch(`https://geoapi.heartrails.com/api/json?method=searchByGeoLocation&x=${lng}&y=${lat}`, {
          signal: AbortSignal.timeout(2600),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ja`, {
          signal: AbortSignal.timeout(2600),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`, {
          signal: AbortSignal.timeout(2500),
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
        needsCoordPoi
          ? fetch(
              `https://ja.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=180&gslimit=3&format=json&origin=*`,
              { signal: AbortSignal.timeout(2200) }
            )
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          : Promise.resolve(null),
      ]);

      let hrPref = "";
      let hrCity = "";
      let hrTown = "";
      const hrLocations: any[] = hrResObj?.response?.location || [];
      if (hrLocations.length > 0) {
        let bestLoc = hrLocations[0];
        let bestDist = Infinity;
        for (const loc of hrLocations) {
          const ly = parseFloat(loc.y);
          const lx = parseFloat(loc.x);
          if (!isNaN(ly) && !isNaN(lx)) {
            const d = (ly - lat) ** 2 + (lx - lng) ** 2;
            if (d < bestDist) {
              bestDist = d;
              bestLoc = loc;
            }
          }
        }
        hrPref = String(bestLoc?.prefecture || "").trim();
        hrCity = String(bestLoc?.city || "").trim();
        const rawHrTown = String(bestLoc?.town || "").replace(/[一二三四五六七八九十]+丁目.*$/, "").trim();
        hrTown = /(?:[0-9０-９]階|スクランブルスクエア|エルタワー|ヒカリエ|ストリーム|タワー|ビル|ヒルズ|ミッドタウン|駅)/.test(rawHrTown) ? "" : rawHrTown;
      }

      let bdcPref = String(bdcResObj?.principalSubdivision || "").trim();
      let bdcCity = String(bdcResObj?.city || bdcResObj?.locality || "").trim();
      if (/^[A-Za-z\s-]+$/.test(bdcPref)) bdcPref = "";
      if (/^[A-Za-z\s-]+$/.test(bdcCity)) bdcCity = "";

      const photonProps = photonResObj?.features?.[0]?.properties || {};
      const photonName = String(photonProps.name || "").trim();
      const photonKey = String(photonProps.osm_key || "").trim();
      const photonVal = String(photonProps.osm_value || "").trim();
      const nonPoiOsm = /^(?:building|highway|railway|place|boundary|landuse|waterway|natural)$/i;
      const nonPoiType = /^(?:residential|apartments|house|road|footway|pedestrian|path|street|bus_stop|parking|suburb|quarter)$/i;
      const photonIsPoi = Boolean(
        photonName &&
          photonKey &&
          !nonPoiOsm.test(photonKey) &&
          !nonPoiType.test(photonVal) &&
          !/(?:ビル|マンション|アパート|住宅|建物|丁目|通り|駐車場)$/.test(photonName)
      );

      if (photonIsPoi) {
        const titleNorm = normalizeVariantCjkClient(`${title} ${japaneseTitle}`).toLowerCase();
        const photonNorm = normalizeVariantCjkClient(photonName).toLowerCase();
        const matchesTitle = Boolean(
          title && (titleNorm.includes(photonNorm) || photonNorm.includes(titleNorm) || extractCoreEntityTokensClient(title).some((t) => photonNorm.includes(t)))
        );
        if (matchesTitle || needsCoordPoi) {
          osmCategory = photonKey;
          osmType = photonVal || undefined;
        }
        if (needsCoordPoi) {
          title = photonName;
          if (/[\u3040-\u30ff\u4e00-\u9fa5]/.test(photonName)) japaneseTitle = photonName;
        }
      }

      if ((!title || isDmsOrCoordNameClient(title)) && wikiGeoResObj?.query?.geosearch?.[0]?.title) {
        const geoTitle = String(wikiGeoResObj.query.geosearch[0].title).trim();
        title = geoTitle;
        japaneseTitle = geoTitle;
        osmCategory = osmCategory || "tourism";
      }

      const finalPref = hrPref || bdcPref || String(photonProps.state || "").trim();
      const finalCity = hrCity || bdcCity || String(photonProps.city || "").trim();
      const rawPhotonTown = String(photonProps.locality || photonProps.district || "").trim();
      const cleanPhotonTown = /(?:[0-9０-９]階|スクランブルスクエア|エルタワー|駅)/.test(rawPhotonTown) ? "" : rawPhotonTown;
      const finalTown = hrTown || cleanPhotonTown;
      neighborhood = [finalCity, finalTown].filter(Boolean).join(" ").trim();
      const rawStreet = String(photonProps.street || "").trim();
      const validStreet = rawStreet && !/(?:駅|奉納所|鳥居|入口|出口|橋|階|タワー|スクランブル)/.test(rawStreet) ? rawStreet : "";
      const houseNum = String(photonProps.housenumber || "").trim();
      const streetPart =
        validStreet && houseNum
          ? /^\d+$/.test(validStreet) && /^\d+$/.test(houseNum)
            ? `${validStreet}-${houseNum}`
            : `${validStreet}${houseNum}`
          : validStreet || "";
      const rawGeoParts = [finalPref, finalCity, finalTown, streetPart].filter(Boolean);
      const dedupGeo: string[] = [];
      for (const p of rawGeoParts) {
        if (!dedupGeo.some((ex) => ex === p || ex.includes(p))) dedupGeo.push(p);
      }
      const geoAddr = dedupGeo.join("");
      if (!address && geoAddr) {
        address = geoAddr;
      }
    }
  }

  return { resolvedUrl, title, japaneseTitle, googleCategory, rating, reviewCount, editorialSummary, address, hoursNote, categoryClue, neighborhood, lat, lng, osmCategory, osmType };
}

function parseYahooSearchMarkdownClient(text: string, expectedAreaTokens: string[] = [], queryName: string = ""): Partial<ClientUnshortenResult> {
  const out: Partial<ClientUnshortenResult> = {};
  if (!text || text.trim().startsWith("{") || text.length < 200) return out;

  // Preserve raw markdown headings (#/##/###) to isolate individual Yahoo search result cards cleanly
  const rawLines = text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1 ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1 ")
    .replace(/\*\*/g, "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^https?:\/\//.test(l) && !/^Title:|^URL Source:|^Markdown Content:/.test(l));

  const trimmed = rawLines.map((l) => l.replace(/^#{1,4}\s+/, "")).join(" ").replace(/\s+/g, " ").trim().slice(0, 26000);

  // Isolate ONLY boundary-safe cards relevant to queryName so adjacent ads (e.g. Tonkatsu beside Koffee Mameya) never leak in!
  const coreTokens = extractCoreEntityTokensClient(queryName);
  let scopedText = "";
  if (coreTokens.length > 0) {
    const matchedChunks: string[] = [];
    for (let i = 0; i < rawLines.length; i++) {
      const lineNorm = normalizeVariantCjkClient(rawLines[i]).toLowerCase();
      if (coreTokens.some((tok) => lineNorm.includes(tok))) {
        const blockLines: string[] = [rawLines[i].replace(/^#{1,4}\s+/, "")];
        for (let j = i + 1; j < Math.min(rawLines.length, i + 4); j++) {
          const next = rawLines[j];
          if (/^#{1,4}\s+/.test(next) || /^[0-9]+\s*\/\s*[0-9]+/.test(next) || /^(?:PR|広告)\b/i.test(next)) break;
          blockLines.push(next);
        }
        matchedChunks.push(blockLines.join(" "));
      }
    }
    if (matchedChunks.length > 0) {
      const branchFiltered =
        expectedAreaTokens.length > 0
          ? matchedChunks.filter((chunk) => {
              const cTokens = extractAreaBranchTokens(chunk);
              return cTokens.length === 0 || cTokens.some((ct) => expectedAreaTokens.includes(ct));
            })
          : matchedChunks;
      if (branchFiltered.length > 0) {
        scopedText = branchFiltered.join(" | ").replace(/\s+/g, " ").slice(0, 12000);
      }
    }
  }
  const safeHighlightScope = scopedText || "";

  const isObviouslyNonFoodQuery = /(神社|寺|神宮|大社|\bshrine\b|\btemple\b|\bmuseum\b|美術館|博物館|\bgallery\b|\bpark\b|\bgarden\b|stationery|文具|書店|bookstore|cutlery|kitchen\s*supply|百貨|\bmall\b|\bhotel\b|\binn\b|kama-?asa|商店街|shopping street|谷中銀座)/i.test(queryName);
  const isCoffeeOrBakeryQuery = /(coffee|cafe|珈琲|コーヒー|ドーナツ|donut|doughnut|bakery|bread|boulangerie|パン|ベーカリー|スイーツ|patisserie|pelican|ペリカン|koffee|mameya)/i.test(queryName);
  const isMuseumOrGalleryQuery = /(美術館|博物館|記念館|資料館|\bmuseum\b|art gallery)/i.test(queryName);

  if (safeHighlightScope) {
    if (!isObviouslyNonFoodQuery) {
      const tabMatch = safeHighlightScope.match(/評価[：:]\s*(\d\.\d)\s*[-–—]\s*([0-9,]+)\s*件/);
      if (tabMatch) {
        out.tabelogRating = tabMatch[1];
        out.tabelogReviews = tabMatch[2];
      }
      const catMatch =
        safeHighlightScope.match(/\/([^/\s|｜\-–\n]{2,25})\s*[|｜]\s*食べログ/i) ||
        safeHighlightScope.match(/食べログ[^/\n]{0,40}\/\s*([^\s|｜\-–\n]{2,20})\s*[-–|｜]/i);
      if (catMatch && catMatch[1]) {
        out.yahooCategory = catMatch[1].replace(/[*#]/g, "").trim();
      }
      if (/百名店/.test(safeHighlightScope)) out.isHyakumeiten = true;
    }
    const yearMatch = safeHighlightScope.match(/((?:1[89]\d{2}|20[0-2]\d)年|(?:明治|大正|昭和)\d{1,2}年)(?:に)?(?:創業|開業|設立|誕生|創建)/);
    if (yearMatch) out.foundingYear = `${yearMatch[1]}創業`;
    const budgetMatch = safeHighlightScope.match(/[¥￥]([0-9,]+)\s*[〜~～\-]\s*[¥￥]?([0-9,]+)/);
    if (budgetMatch) out.priceRangeHint = `約 ¥${budgetMatch[1]} - ¥${budgetMatch[2]} / 人`;
  }

  // Score all candidate Japanese street addresses against expectedAreaTokens after stripping postal codes ("〒150-0042")
  const addrSource = (safeHighlightScope ? `${safeHighlightScope} ${trimmed}` : trimmed).replace(/〒\s*\d{3}-\d{4}\s*/g, "");
  const addrRe = /((?:東京都|大阪府|京都府|神奈川県|千葉県|埼玉県|北海道|福岡県)\s?[^\s、。,；;()（）「」<>[\]〒]{2,34}[0-9０-９]{1,3}[-－−丁目番地號号][0-9０-９\-－−]{1,12})/g;
  const addrCandidates = Array.from(addrSource.matchAll(addrRe))
    .map((m) => m[1].replace(/－/g, "-").replace(/\s+/g, "").trim())
    .filter((c) => !/〒/.test(c) && !/(?:[0-9０-９]階|スクランブルスクエア|エルタワー|駅)/.test(c) && c.length >= 6);
  if (addrCandidates.length > 0) {
    if (expectedAreaTokens.length > 0) {
      let bestAddr = "";
      let bestScore = -1;
      for (const cand of addrCandidates) {
        let score = 0;
        for (const tok of expectedAreaTokens) {
          if (cand.includes(tok)) score += tok.length;
        }
        if (score > bestScore) {
          bestScore = score;
          bestAddr = cand;
        }
      }
      if (bestScore > 0) {
        out.address = bestAddr;
      } else {
        const cand0 = addrCandidates[0];
        const candTokens = extractAreaBranchTokens(cand0);
        const wardConflict = candTokens.length > 0 && expectedAreaTokens.some((t) => KNOWN_AREA_BRANCH_TOKENS.includes(t)) && !candTokens.some((t) => expectedAreaTokens.includes(t));
        if (!wardConflict) {
          out.address = cand0;
        }
      }
    } else {
      out.address = addrCandidates[0];
    }
  }

  const accessSource = safeHighlightScope || (coreTokens.length === 0 ? trimmed : "");
  const accessRe = /(?:▶︎|▸|►|：|:|\s|^)([A-Za-z0-9一-龠ぁ-んァ-ヶー]{2,14}駅(?:[東西南北中央]*口)?(?:から)?徒歩[0-9０-９]{1,2}分)/g;
  const accessMatches = accessSource ? Array.from(accessSource.matchAll(accessRe)) : [];
  if (accessMatches.length > 0) {
    if (expectedAreaTokens.length > 0) {
      const stationMatch = accessMatches.find((m) => {
        const st = m[1].replace(/[「」]/g, "").trim();
        return expectedAreaTokens.some((t) => st.includes(t) || t.includes(st.replace(/駅.*$/, "")));
      });
      if (stationMatch) {
        out.accessInfo = stationMatch[1].replace(/[「」]/g, "").trim();
      } else if (safeHighlightScope) {
        const contextVerified = accessMatches.find((m) => {
          const idx = m.index ?? 0;
          const windowText = accessSource.slice(Math.max(0, idx - 120), idx + 120);
          const ctxTokens = extractAreaBranchTokens(windowText);
          return ctxTokens.length > 0 && ctxTokens.some((t) => expectedAreaTokens.includes(t));
        });
        if (contextVerified) {
          out.accessInfo = contextVerified[1].replace(/[「」]/g, "").trim();
        }
      }
    } else if (safeHighlightScope) {
      out.accessInfo = accessMatches[0][1].replace(/[「」]/g, "").trim();
    }
  }

  if (safeHighlightScope) {
    const ruleParts: string[] = [];
    const hoursRange = safeHighlightScope.match(/(?:営業時間[：:\s]*)?(\d{1,2}:\d{2}\s*[〜~～\-]\s*\d{1,2}:\d{2})/);
    const closeTime = safeHighlightScope.match(/営業終了\s*(\d{1,2}:\d{2})/);
    if (hoursRange) ruleParts.push(`營業 ${hoursRange[1].replace(/[〜~～]/g, "-")}`);
    else if (closeTime) ruleParts.push(`營業至 ${closeTime[1]}`);
    const closedMatch = safeHighlightScope.match(/定休日[：:\s]*([^\s。、\n]{2,15})/);
    if (closedMatch && closedMatch[1] && !/閉じる|確認/.test(closedMatch[1])) {
      ruleParts.push(
        closedMatch[1]
          .replace(/日曜日/, "週日公休")
          .replace(/月曜日/, "週一公休")
          .replace(/火曜日/, "週二公休")
          .replace(/水曜日/, "週三公休")
          .replace(/木曜日/, "週四公休")
          .replace(/金曜日/, "週五公休")
          .replace(/土曜日/, "週六公休")
          .replace(/なし|年中無休/, "全年無休")
      );
    }
    if (/現金のみ/.test(safeHighlightScope)) ruleParts.push("僅收現金");
    if (/予約不可/.test(safeHighlightScope)) ruleParts.push("不接受預約（現場候位）");
    if (/免税|TAX[- ]?FREE/i.test(safeHighlightScope)) ruleParts.push("支援免稅購物 (Tax-Free)");
    if (/焼き上がり時間|次回.*焼き上が/.test(safeHighlightScope)) ruleParts.push("每日分批現烤出爐");
    if (ruleParts.length > 0) out.hoursNote = ruleParts.join("・");

    const isFoodBlock = !isObviouslyNonFoodQuery && Boolean(out.tabelogRating || out.yahooCategory || /食べログ|ぐるなび|ホットペッパー|ランチ|ディナー/.test(safeHighlightScope));
    const menuSet = new Set<string>();
    if (isFoodBlock) {
      const pricedRe = /([一-龠ぁ-んァ-ヶー]{2,14})\s*[.．·・\s]{0,4}([0-9,]{3,5})\s*円/g;
      for (const m of safeHighlightScope.matchAll(pricedRe)) {
        const item = m[1].trim();
        const price = m[2].trim();
        if (!/営業時間|アクセス|徒歩|予約|電話|住所|評価|レビュー|地図|創業|入園|拝観|入場/.test(item)) {
          menuSet.add(`${item} ¥${price}`);
        }
        if (menuSet.size >= 4) break;
      }
      const menuPillMatch = safeHighlightScope.match(/\[メニュー\s+([^\]]{4,80})\]/);
      if (menuPillMatch && menuPillMatch[1]) {
        for (const part of menuPillMatch[1].split(/\s+/)) {
          if (part.length >= 2 && !/^http/.test(part) && menuSet.size < 4) menuSet.add(part);
        }
      }
    }
    if (menuSet.size > 0) out.menuItems = Array.from(menuSet);

    const hi: string[] = [];
    if (!isObviouslyNonFoodQuery) {
      if (/生ドーナツ|ドーナツ/.test(safeHighlightScope)) hi.push("招牌蓬鬆現炸生甜甜圈");
      if (/シュークリーム/.test(safeHighlightScope)) hi.push("招牌現烤酥脆泡芙");
      if (/胡麻|黒ごま/.test(safeHighlightScope)) hi.push("特製黑芝麻脆皮外層");
      if (/カスタード/.test(safeHighlightScope)) hi.push("濃厚香草卡士達內餡");
      if (/フレジェ|ケーキ|洋菓子|スイーツ/.test(safeHighlightScope)) hi.push("每日新鮮手作法式蛋糕甜點");
      if (/食パン|ロールパン/.test(safeHighlightScope)) hi.push("老鋪限定每日現烤香濃吐司與小餐包");
      if (/クロワッサン/.test(safeHighlightScope)) hi.push("多層香酥手工可頌");
      if (/カレーパン/.test(safeHighlightScope)) hi.push("人氣招牌香濃炸咖哩麵包");
      if (/ベーグル|スコーン|カヌレ/.test(safeHighlightScope)) hi.push("每日限量手工可麗露與歐風烘焙");
      if (/シングルオリジン|自家焙煎|バリスタ|スペシャルティコーヒー/.test(safeHighlightScope)) hi.push("精品單品咖啡豆與咖啡師現場手沖體驗");
      else if (/ハンドドリップ|ネルドリップ|珈琲|コーヒー/.test(safeHighlightScope)) hi.push("職人手沖精品咖啡");
      if (!isCoffeeOrBakeryQuery) {
        if (/野原焼き|黒毛和牛|シャトーブリアン|A5/.test(safeHighlightScope)) hi.push("頂級 A5 黑毛和牛特選部位與「野原燒」招牌涮烤");
        if (/煮干/.test(safeHighlightScope)) hi.push("極濃小魚乾煮干湯頭");
        if (/塩ラーメン|醤油ラーメン|鶏白湯/.test(safeHighlightScope)) hi.push("黃金澄澈雞骨魚介高湯拉麵");
        if (/十割蕎麦|手打ちそば/.test(safeHighlightScope)) hi.push("石臼現磨芳香十割蕎麥麵");
        if (/焼き鳥|焼鳥|もつ焼き|やきとん/.test(safeHighlightScope)) hi.push("備長炭現烤多汁串燒");
        if (isFoodBlock && /とんかつ|ロース|ヒレ/.test(safeHighlightScope)) hi.push("金黃酥脆厚切炸豬排");
        if (/カルボナーラ/.test(safeHighlightScope)) hi.push("招牌奶油培根烏龍麵");
      }
      if (/かぼちゃプリン/.test(safeHighlightScope)) hi.push("復古濃郁南瓜布丁");
      if (/シフォンケーキ/.test(safeHighlightScope)) hi.push("綿密紅茶／抹茶戚風蛋糕");
    }

    if (/文具|文房具|万年筆|ノート|インク|オーダーノート/.test(safeHighlightScope)) hi.push("原創手帳文具與精品書寫墨水");
    if (/包丁|料理道具|鉄鍋|キッチン用品|釜浅|kitchen supply|cutlery/i.test(safeHighlightScope)) hi.push("職人鍛造料理刀具與專業和食廚具");
    if (/生活雑貨|雑貨|セレクトショップ|ライフスタイル/.test(safeHighlightScope)) hi.push("高質感生活雜貨與日系風格選物");
    if (!isMuseumOrGalleryQuery && !isCoffeeOrBakeryQuery && /商店街|shopping street/i.test(safeHighlightScope)) hi.push("充滿昭和懷舊人情味的下町商店街");
    if (/百貨店|ショッピングモール|免税|TAX[- ]?FREE/i.test(safeHighlightScope)) hi.push("人氣專櫃雜貨與免稅購物優惠");
    if (/古着|ヴィンテージ|ファッション/.test(safeHighlightScope)) hi.push("日系潮流服飾與精選單品");
    if (/書店|本屋|書籍/.test(safeHighlightScope)) hi.push("主題精選藏書與生活提案空間");

    if (/千本鳥居/.test(safeHighlightScope)) hi.push("朱紅連綿千本鳥居景觀");
    if (/つつじ/.test(safeHighlightScope)) hi.push("東京著名百年杜鵑花賞花勝地");
    if (/重要文化財|国宝/.test(safeHighlightScope)) hi.push("日本國寶與重要文化財典藏建築");
    if (/御朱印|縁結び|厄除|金運/.test(safeHighlightScope)) hi.push("人氣特色御朱印與開運祈福參拜");
    if (/日本庭園|枯山水|回遊式/.test(safeHighlightScope)) hi.push("雅致傳統日式山水庭園景觀");
    if (/隈研吾|安藤忠雄/.test(safeHighlightScope)) hi.push("當代建築大師打造的空間光影美學");
    if (/浮世絵|日本画|茶道具/.test(safeHighlightScope)) hi.push("珍貴浮世繪版畫與傳統東洋美術典藏");
    if ((isMuseumOrGalleryQuery || (!isFoodBlock && !isCoffeeOrBakeryQuery)) && /美術館|博物館|展示|ギャラリー/.test(safeHighlightScope)) {
      hi.push("精選典藏與建築美學展覽空間");
    }

    if (out.isHyakumeiten) hi.push("榮獲日本美食指標「Tabelog 百名店」");
    if (hi.length > 0) out.extraHighlights = Array.from(new Set(hi));
  }

  return out;
}

/**
 * Full client-side live web enrichment for pure static deployments (no backend server).
 * Resolves short links, Nominatim pin metadata, Yahoo Japan / Tabelog snippets, and Wikipedia extracts.
 */
export async function enrichPlaceClientSide(rawUrl: string, knownName: string = ""): Promise<ClientUnshortenResult> {
  const isShort =
    rawUrl.includes("maps.app.goo.gl") ||
    rawUrl.includes("goo.gl") ||
    rawUrl.includes("g.co/") ||
    rawUrl.includes("page.link");

  let base: ClientUnshortenResult = {
    resolvedUrl: isShort ? "" : rawUrl,
    title: knownName,
  };

  if (isShort || rawUrl.startsWith("http")) {
    base = await unshortenGoogleMapsLinkClient(rawUrl);
    if (!base.resolvedUrl) base.resolvedUrl = rawUrl;
  }

  const effectiveUrl = base.resolvedUrl || rawUrl;
  const extractedName = base.title || knownName || extractPlaceNameFromUrl(effectiveUrl);

  // English -> Japanese Wikipedia langlinks bridge for Latin-only queries in static mode (e.g. "Hamarikyu Gardens" -> "浜離宮恩賜庭園")
  const cleanEnName = (extractedName || "").replace(/[()（）]/g, " ").trim();
  const isLatinOnlyQuery =
    !base.japaneseTitle &&
    /[A-Za-z]{3,}/.test(cleanEnName) &&
    !/[\u4e00-\u9fa5\u3040-\u30ff]/.test(cleanEnName) &&
    !isDmsOrCoordNameClient(cleanEnName);
  let bridgeJpTitle = "";
  if (isLatinOnlyQuery) {
    try {
      const enRes = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanEnName)}&gsrlimit=2&prop=langlinks&lllang=ja&format=json&origin=*`,
        { signal: AbortSignal.timeout(1600) }
      );
      if (enRes.ok) {
        const enJson: any = await enRes.json();
        const pages = Object.values(enJson?.query?.pages || {}) as any[];
        const enCore = extractCoreEntityTokensClient(cleanEnName).map((t) => t.replace(/[-'\s]/g, ""));
        for (const pg of pages) {
          const jaLink = pg?.langlinks?.[0]?.["*"];
          const pgNorm = String(pg?.title || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[-'\s]/g, "");
          if (jaLink && (enCore.length === 0 || enCore.some((tok) => pgNorm.includes(tok)))) {
            bridgeJpTitle = String(jaLink).trim();
            break;
          }
        }
      }
    } catch {}
  }

  const resolvedJpTitle = base.japaneseTitle || bridgeJpTitle;
  const queryTerm = toJapaneseAreaHint((resolvedJpTitle || extractedName || "").replace(/[()（）]/g, " ").trim());
  const jpAreaHint = toJapaneseAreaHint(base.neighborhood || "");
  const expectedAreaTokens = extractAreaBranchTokens(`${extractedName} ${resolvedJpTitle || ""} ${base.neighborhood || ""} ${base.address || ""}`);

  if (!queryTerm) return base;

  const yahooQuery =
    jpAreaHint && !queryTerm.includes(jpAreaHint) && extractAreaBranchTokens(queryTerm).length === 0
      ? `${queryTerm} ${jpAreaHint}`.trim()
      : extractAreaBranchTokens(queryTerm).length > 0
      ? queryTerm
      : `${queryTerm} ${jpAreaHint || "東京"}`.trim();
  const yahooUrl = `https://r.jina.ai/https://search.yahoo.co.jp/search?p=${encodeURIComponent(yahooQuery)}`;
  const wikiUrl = `https://ja.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(queryTerm)}&srlimit=3&format=json&origin=*`;

  const [yahooText, wikiJson] = await Promise.all([
    fetch(yahooUrl, { signal: AbortSignal.timeout(7000), headers: { Accept: "text/plain" } })
      .then((r) => (r.ok ? r.text() : ""))
      .catch(() => ""),
    fetch(wikiUrl, { signal: AbortSignal.timeout(2800) })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
  ]);

  const yFacts = parseYahooSearchMarkdownClient(yahooText, expectedAreaTokens, `${extractedName} ${resolvedJpTitle || ""}`);
  let wikiSummary = "";
  const wikiHits: any[] = wikiJson?.query?.search || [];
  const coreEntityTokens = extractCoreEntityTokensClient(`${extractedName} ${resolvedJpTitle || ""}`);
  for (const hit of wikiHits) {
    const hitTitleNorm = normalizeVariantCjkClient(String(hit?.title || "")).toLowerCase();
    const snippetClean = String(hit?.snippet || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const titleMatches = coreEntityTokens.length > 0 && coreEntityTokens.some((tok) => hitTitleNorm.includes(tok));
    const isJapanSpot = /(東京|大阪|京都|神奈川|文京|台東|中央|渋谷|新宿|港|目黒|駅|商店街|文具|店|神社|寺院|庭園|公園|博物館|美術館|百貨)/.test(snippetClean);
    if (titleMatches && isJapanSpot) {
      wikiSummary = snippetClean;
      break;
    }
  }

  return {
    ...base,
    title: base.title || extractedName,
    japaneseTitle: base.japaneseTitle || bridgeJpTitle || undefined,
    address: yFacts.address || base.address,
    hoursNote: yFacts.hoursNote || base.hoursNote,
    yahooCategory: yFacts.yahooCategory || base.yahooCategory,
    tabelogRating: yFacts.tabelogRating,
    tabelogReviews: yFacts.tabelogReviews,
    isHyakumeiten: yFacts.isHyakumeiten,
    foundingYear: yFacts.foundingYear,
    menuItems: yFacts.menuItems,
    priceRangeHint: yFacts.priceRangeHint,
    accessInfo: yFacts.accessInfo,
    extraHighlights: yFacts.extraHighlights,
    wikiSummary: wikiSummary || undefined,
  };
}

/**
 * Sanitizes any Google Maps URL to ensure it NEVER opens Google's Cookie consent page
 * while preserving resolved branch pins or building branch-accurate search fallbacks.
 */
export function cleanGoogleMapsLink(rawUrl: string, fallbackName?: string, fallbackAddress?: string): string {
  const cleanName = (fallbackName || "").trim();
  const cleanAddr = (fallbackAddress || "").trim();
  const isGenericAddr = !cleanAddr || /^(東京都內精華商圈|東京都內|東京都中心商圈|日本都會商圈|東京|大阪|京都)$/.test(cleanAddr);
  const queryTarget =
    cleanName && !isGenericAddr && !cleanName.includes(cleanAddr)
      ? `${cleanName} ${cleanAddr}`
      : cleanName || (!isGenericAddr ? cleanAddr : "") || "東京";

  let clean = (rawUrl || "").replace(/[\\'",;)]+$/g, "").trim();

  // Unwrap consent / sorry wrappers before checking if we have a real resolved URL
  for (let i = 0; i < 3; i++) {
    if (clean.includes("consent.google.com") || clean.includes("google.com/sorry")) {
      const match = clean.match(/[?&]continue=([^&#]+)/i);
      if (match && match[1]) {
        try {
          clean = decodeURIComponent(match[1]);
          continue;
        } catch {}
      }
    }
    break;
  }

  // Only downgrade to search API if still an unexpanded short link or unrecoverable consent wall
  if (
    queryTarget &&
    (!clean ||
      clean === "undefined" ||
      clean === "null" ||
      clean.includes("maps.app.goo.gl") ||
      clean.includes("goo.gl") ||
      clean.includes("g.co/") ||
      clean.includes("page.link") ||
      clean.includes("consent.google.com") ||
      clean.includes("google.com/sorry") ||
      !clean.startsWith("http"))
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryTarget)}`;
  }

  return clean;
}

/**
 * Extract place name from a resolved Google Maps URL (extract raw segment first so %2F inside shop names isn't truncated)
 */
export function extractPlaceNameFromUrl(url: string): string {
  try {
    const safeDec = (s: string) => {
      let cur = s;
      for (let i = 0; i < 4; i++) {
        try {
          const n = decodeURIComponent(cur);
          if (n === cur) break;
          cur = n;
        } catch {
          break;
        }
      }
      return cur;
    };

    const stripTail = (s: string) =>
      s
        .replace(/\+/g, " ")
        .replace(/@.*$/, "")
        .replace(/data=.*$/, "")
        .replace(/\/$/, "")
        .replace(/\s*(?:〒?\d{3}-\d{4}\s*)?(?:東京都|大阪府|京都府|神奈川県|千葉県|埼玉県|北海道|福岡県)[^\n]{4,80}$/g, "")
        .trim();

    // Unwrap consent / sorry continue= param if present
    const contMatch = url.match(/[?&]continue=([^&#]+)/i);
    if (contMatch && contMatch[1]) {
      const inner = extractPlaceNameFromUrl(safeDec(contMatch[1]));
      if (inner) return inner;
    }

    // Match /place/<raw_encoded_name>/ before full decoding so %2F inside names is preserved
    const pm = url.match(/\/(?:maps\/)?place\/([^?]+?)(?:\/@|\/data=|\/?(?:\?|$|#))/i) || url.match(/\/place\/([^/@?&]+)/i);
    if (pm && pm[1]) {
      const n = stripTail(safeDec(pm[1]));
      if (n && !n.startsWith("http") && !n.startsWith("0x") && !n.startsWith("ChIJ") && !isDmsOrCoordNameClient(n)) {
        return n;
      }
    }

    // Match /search/<raw>/
    const sm = url.match(/\/(?:maps\/)?search\/([^?]+?)(?:\/@|\/data=|\/?(?:\?|$|#))/i) || url.match(/\/search\/([^/@?&]+)/i);
    if (sm && sm[1]) {
      const n = stripTail(safeDec(sm[1]));
      if (n && !n.startsWith("http") && !n.startsWith("0x") && !isDmsOrCoordNameClient(n)) {
        return n;
      }
    }

    // Match query=PlaceName or q=PlaceName
    const qm = url.match(/[?&](?:query|q)=([^&#]+)/i);
    if (qm && qm[1]) {
      let n = stripTail(safeDec(qm[1]));
      if (n.includes(",")) n = n.split(",")[0].trim();
      if (n && !n.startsWith("http") && !n.startsWith("EhA") && !n.startsWith("loc:") && !isDmsOrCoordNameClient(n)) {
        return n;
      }
    }

    // Match destination=PlaceName
    const dm = url.match(/[?&]destination=([^&#]+)/i);
    if (dm && dm[1]) {
      let n = stripTail(safeDec(dm[1]));
      if (n.includes(",")) n = n.split(",")[0].trim();
      if (n && !n.startsWith("http") && !n.startsWith("0x") && !isDmsOrCoordNameClient(n)) {
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
  const t = toJapaneseAreaHint(text).toLowerCase();
  // Check non-Tokyo prefectures first if explicit
  if (t.includes("大阪府") || t.includes("大阪市") || /\b(osaka|namba|umeda|dotonbori)\b/.test(t)) return "大阪府";
  if (t.includes("京都府") || t.includes("京都市") || /\b(kyoto|gion|arashiyama)\b/.test(t)) return "京都府";
  if (t.includes("神奈川県") || t.includes("横浜市") || t.includes("鎌倉市")) return "神奈川縣";
  if (t.includes("千葉県") || t.includes("浦安市") || t.includes("成田市")) return "千葉縣";
  if (t.includes("埼玉県")) return "埼玉縣";
  // Check explicit ward names FIRST so "東京都港区南青山 Nezu Museum" never matches "nezu" -> 文京區!
  if (t.includes("港区") || t.includes("南青山") || t.includes("北青山")) return "東京都港區（青山／六本木）";
  if (t.includes("台東区")) return "東京都台東區（淺草／上野／藏前）";
  if (t.includes("中央区")) return "東京都中央區（日本橋／銀座）";
  if (t.includes("千代田区")) return "東京都千代田區（神田／秋葉原／丸之內）";
  if (t.includes("新宿区")) return "東京都新宿區";
  if (t.includes("渋谷区")) return "東京都澀谷區";
  if (t.includes("文京区")) return "東京都文京區";
  if (t.includes("墨田区")) return "東京都墨田區（晴空塔周邊）";
  if (t.includes("江東区")) return "東京都江東區（有明／台場／清澄白河）";
  if (t.includes("目黒区")) return "東京都目黑區（中目黑／自由之丘）";
  if (t.includes("豊島区")) return "東京都豐島區（池袋）";
  if (t.includes("世田谷区")) return "東京都世田谷區（下北澤）";

  // Check specific compound neighborhoods next (e.g. 谷中銀座 -> Taito, NOT Chuo Ginza!)
  if (t.includes("谷中") || t.includes("yanaka") || t.includes("千駄木") || t.includes("sendagi")) {
    return "東京都台東區（谷中／谷根千）";
  }
  if (t.includes("根津神社") || t.includes("根津駅") || t.includes("文京区根津") || /\bnezu\s*shrine\b/.test(t)) {
    return "東京都文京區（根津／谷根千）";
  }
  if (t.includes("台東") || t.includes("浅草") || t.includes("上野") || t.includes("蔵前") || t.includes("駒形") || t.includes("雷門") || t.includes("入谷") || t.includes("合羽橋") || /\b(asakusa|ueno|kuramae|kappabashi|kama-asa)\b/.test(t)) {
    return "東京都台東區（淺草／上野／藏前）";
  }
  if (t.includes("墨田") || t.includes("押上") || t.includes("晴空塔") || t.includes("錦糸町") || /\b(oshiage|skytree)\b/.test(t)) {
    return "東京都墨田區（晴空塔周邊）";
  }
  if (t.includes("築地") || /\btsukiji\b/.test(t)) {
    return "東京都中央區（築地／銀座）";
  }
  if (t.includes("中央") || t.includes("日本橋") || t.includes("銀座") || t.includes("人形町") || /\b(ginza|nihonbashi|ningyocho)\b/.test(t)) {
    return "東京都中央區（日本橋／銀座）";
  }
  if (t.includes("千代田") || t.includes("神田") || t.includes("秋葉原") || t.includes("丸の内") || t.includes("有楽町") || /\b(kanda|akihabara|marunouchi|yurakucho)\b/.test(t)) {
    return "東京都千代田區（神田／秋葉原／丸之內）";
  }
  if (t.includes("港") || t.includes("六本木") || t.includes("麻布") || t.includes("赤坂") || t.includes("白金") || /\b(roppongi|azabu|akasaka|aoyama)\b/.test(t)) {
    return "東京都港區（六本木／赤坂／青山）";
  }
  if (t.includes("新宿") || t.includes("大久保") || t.includes("歌舞伎町") || t.includes("高田馬場") || /\bshinjuku\b/.test(t)) {
    return "東京都新宿區";
  }
  if (t.includes("渋谷") || t.includes("原宿") || t.includes("表参道") || t.includes("代官山") || t.includes("恵比寿") || /\b(shibuya|harajuku|omotesando|daikanyama|ebisu)\b/.test(t)) {
    return "東京都澀谷區";
  }
  if (t.includes("江東") || t.includes("有明") || t.includes("豊洲") || t.includes("台場") || t.includes("門前仲町") || t.includes("清澄白河") || /\b(ariake|toyosu|odaiba|kiyosumi)\b/.test(t)) {
    return "東京都江東區（有明／台場／清澄白河）";
  }
  if (t.includes("文京") || t.includes("本郷") || t.includes("後楽園") || t.includes("駒込") || /\bkomagome\b/.test(t)) {
    return "東京都文京區";
  }
  if (t.includes("豊島") || t.includes("池袋") || t.includes("目白") || /\bikebukuro\b/.test(t)) {
    return "東京都豐島區（池袋）";
  }
  if (t.includes("目黒") || t.includes("中目黒") || t.includes("祐天寺") || t.includes("自由が丘") || /\b(nakameguro|jiyugaoka|meguro)\b/.test(t)) {
    return "東京都目黑區（中目黑／自由之丘）";
  }
  if (t.includes("武蔵野") || t.includes("吉祥寺") || /\bkichijoji\b/.test(t)) {
    return "東京都武藏野市（吉祥寺）";
  }
  if (t.includes("世田谷") || t.includes("下北沢") || /\bshimokitazawa\b/.test(t)) {
    return "東京都世田谷區（下北澤）";
  }
  return "日本精選散策商圈";
}

/**
 * Deep Client-Side Place Synthesis Engine
 * Guarantees zero generic placeholder words like "東京精選推薦據點".
 */
export function synthesizePlaceData(
  rawName: string,
  url: string,
  rawText: string,
  userNotes: string = "",
  categoryClue: string = "",
  extraMeta?: Partial<ClientUnshortenResult>
): AnalyzedPlaceData {
  const resolvedPinUrl = extraMeta?.resolvedUrl && !extraMeta.resolvedUrl.includes("consent.google.com") && !extraMeta.resolvedUrl.includes("google.com/sorry")
    ? extraMeta.resolvedUrl
    : url;
  const metaNameHint = [rawName, extraMeta?.japaneseTitle, extraMeta?.address, extraMeta?.googleCategory].filter(Boolean).join(" ");
  const combined = `${metaNameHint} ${rawText} ${userNotes} ${resolvedPinUrl}`.toLowerCase();
  const clue = (categoryClue || extraMeta?.categoryClue || "").toLowerCase().trim();

  // 1. Check landmark dictionary matches ONLY against place names (never userNotes or address), guarded by branch & coordinate distance
  const nameOnlyText = toJapaneseAreaHint([rawName, extraMeta?.title, extraMeta?.japaneseTitle].filter(Boolean).join(" ")).toLowerCase();
  const pinCoordMatch = resolvedPinUrl.match(/!3d(-?[0-9.]+)!4d(-?[0-9.]+)/) || resolvedPinUrl.match(/@(-?[0-9.]+),(-?[0-9.]+)/);
  const pinLat = extraMeta?.lat ?? (pinCoordMatch ? parseFloat(pinCoordMatch[1]) : undefined);
  const pinLng = extraMeta?.lng ?? (pinCoordMatch ? parseFloat(pinCoordMatch[2]) : undefined);
  const urlAndPinTokens = extractAreaBranchTokens(
    `${rawName} ${extraMeta?.title || ""} ${extraMeta?.japaneseTitle || ""} ${extraMeta?.neighborhood || ""} ${extraMeta?.address || ""} ${resolvedPinUrl}`
  );

  for (const [key, data] of Object.entries(TOKYO_LANDMARKS)) {
    const keyNorm = toJapaneseAreaHint(key).toLowerCase();
    if (!nameOnlyText.includes(keyNorm)) continue;

    const guard = CLIENT_LANDMARK_GUARDS[key];
    if (guard) {
      if (guard.requirePattern && !guard.requirePattern.test(nameOnlyText)) continue;
      if (guard.excludePattern && guard.excludePattern.test(nameOnlyText)) continue;

      if (guard.coords && pinLat && pinLng) {
        if (haversineKm(pinLat, pinLng, guard.coords[0], guard.coords[1]) > 1.8) continue;
      }

      if (guard.isChain) {
        if (!guard.branchTokens || guard.branchTokens.length === 0) continue;
        if (urlAndPinTokens.length > 0) {
          const matchesPresetBranch = urlAndPinTokens.some((tok) =>
            guard.branchTokens!.some((bt) => bt.toLowerCase() === tok.toLowerCase() || tok.toLowerCase().includes(bt.toLowerCase()))
          );
          if (!matchesPresetBranch) continue;
        }
      }
    }

    const spotTitle = data.name || rawName;
    const spotDesc = data.summary || `${spotTitle} 是東京極具口碑的熱門去處，氛圍與特色深受旅人喜愛。`;
    const spotRec = data.tips || `${spotTitle} 推薦招牌特色；造訪前可開啟地圖確認營業狀態。`;
    const presetAddrIsGeneric = !data.address || /\/|精華商/.test(data.address);
    const resolvedAddr = extraMeta?.address && (presetAddrIsGeneric || urlAndPinTokens.some((t) => extraMeta.address!.includes(t)))
      ? extraMeta.address
      : data.address || extraMeta?.address || detectDistrict(combined);
    return {
      spotName: spotTitle,
      categoryLabel: data.categoryLabel || "餐廳美饌",
      tag: `東京散策、${data.categoryLabel || "人氣探訪"}、自由行推薦`,
      desc: spotDesc,
      recommendation: spotRec,
      suggestedTime: data.bestTimeToVisit || "午後散策時段",
      mapUrl: cleanGoogleMapsLink(resolvedPinUrl, spotTitle, resolvedAddr),
      resolvedUrl: resolvedPinUrl,

      name: spotTitle,
      japaneseName: data.japaneseName || extraMeta?.japaneseTitle || rawName,
      category: (data.category as any) || "dining",
      highlight: data.highlight || `${spotTitle} 自由行私房人氣必訪推薦`,
      summary: spotDesc,
      address: resolvedAddr,
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

  // 2. Intelligent Category and Content Deduction based on keywords + protobuf/Google/Yahoo/Tabelog clues
  const district =
    extraMeta?.address ||
    (extraMeta?.neighborhood ? detectDistrict(extraMeta.neighborhood) : "") ||
    detectDistrict(combined);
  const cleanNonUrlRawText = (rawText || "")
    .replace(/https?:\/\/[^\s]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const safeNameCand = [
    rawName,
    extraMeta?.title,
    extraMeta?.japaneseTitle,
    cleanNonUrlRawText,
  ].find((cand) => cand && !/^https?:\/\//i.test(cand.trim()) && !isDmsOrCoordNameClient(cand.trim()));
  const rawBaseName = (
    safeNameCand ||
    (extraMeta?.neighborhood ? `${extraMeta.neighborhood} 私房據點` : "日本私房探索據點")
  ).trim();
  const cleanName =
    extraMeta?.japaneseTitle && !rawBaseName.includes(extraMeta.japaneseTitle)
      ? `${rawBaseName} (${extraMeta.japaneseTitle})`
      : rawBaseName;
  const ratingNote = extraMeta?.rating
    ? `於 Google 地圖累積 ${extraMeta.reviewCount ? `${extraMeta.reviewCount} 則評價、` : ""}獲得 ${extraMeta.rating} ★ 好評，`
    : "";
  const foodRatingNote = ratingNote
    ? ratingNote
    : extraMeta?.tabelogRating
    ? `${extraMeta.isHyakumeiten ? "曾獲選「Tabelog 百名店」、" : ""}於 Tabelog 累積 ${extraMeta.tabelogReviews ? `${extraMeta.tabelogReviews} 則食評、` : ""}維持 ${extraMeta.tabelogRating} 分高評價，`
    : "";
  const foundingNote = extraMeta?.foundingYear
    ? `${extraMeta.foundingYear}的在地名店，${extraMeta.accessInfo ? `距離${extraMeta.accessInfo}，` : ""}`
    : extraMeta?.accessInfo
    ? `鄰近${extraMeta.accessInfo}，`
    : "";
  const hoursSuffix = extraMeta?.hoursNote ? `（${extraMeta.hoursNote}）` : "";

  // Extract domain traits from Google Maps category, Editorial summary, and Wikipedia summary
  const groundSource = `${extraMeta?.googleCategory || ""} ${extraMeta?.editorialSummary || ""} ${extraMeta?.wikiSummary || ""}`.toLowerCase();
  const wikiTraits: string[] = [];
  if (/生ドーナツ|ドーナツ|donut|doughnut/.test(groundSource)) wikiTraits.push("招牌蓬鬆現炸生甜甜圈");
  if (/croissant|クロワッサン|boulangerie/.test(groundSource)) wikiTraits.push("酥脆多層手工可頌與歐風烘焙");
  if (/食パン|ロールパン|パン/.test(groundSource)) wikiTraits.push("每日現烤手作麵包吐司");
  if (/シングルオリジン|スペシャルティ|バリスタ|自家焙煎|coffee|espresso|コーヒー/.test(groundSource)) wikiTraits.push("職人現場手沖單品咖啡體驗");
  if (/野原焼き|黒毛和牛|焼肉|wagyu|yakiniku/.test(groundSource)) wikiTraits.push("頂級 A5 黑毛和牛與炭火燒肉手藝");
  if (/stationery|notebook|fountain pen|paper|文具|手帳|万年筆|インク/.test(groundSource)) wikiTraits.push("原創設計文具與精品紙品");
  if (/cutlery|knife|knives|kitchen supply|kitchenware|包丁|厨具|廚具|鉄鍋|料理道具/.test(groundSource)) wikiTraits.push("職人鍛造料理刀具與專業廚具");
  if (/variety store|general store|lifestyle|zakka|home goods|雑貨|生活道具/.test(groundSource)) wikiTraits.push("日系設計生活雜貨與日常選物");
  if (/bookstore|book store|書店|本屋/.test(groundSource)) wikiTraits.push("精選藏書與風格企劃展區");
  if (/shopping street|商店街|昔ながら|昭和/.test(groundSource)) wikiTraits.push("濃郁昭和下町人情味的懷舊商店街");
  if (/shrine|shinto|つつじ|神社|鳥居/.test(groundSource)) {
    if (/つつじ/.test(groundSource)) wikiTraits.push("百年杜鵑花勝景與傳統社殿鳥居");
    else wikiTraits.push("歷史悠久的傳統鳥居與靜謐神社境內");
  }
  if (/temple|buddhist|寺院/.test(groundSource)) wikiTraits.push("莊嚴清幽的古剎參拜境內");
  if (/隈研吾|安藤忠雄/.test(groundSource)) wikiTraits.push("建築大師打造的空間光影美學");
  if (/浮世絵|日本画|国宝/.test(groundSource)) wikiTraits.push("珍貴浮世繪版畫與國寶級典藏");
  if (/museum|art gallery|美術館|博物館/.test(groundSource)) wikiTraits.push("典藏展覽與空間建築美學");
  if (/garden|park|庭園|公園/.test(groundSource)) wikiTraits.push("四季景致宜人的都會庭園綠意");

  const realHighlights = Array.from(new Set([...(extraMeta?.extraHighlights || []), ...wikiTraits])).filter(Boolean);
  const highlightSentence = realHighlights.length > 0 ? `以「${realHighlights.slice(0, 3).join("、")}」聞名，` : "";
  const menuListText = extraMeta?.menuItems && extraMeta.menuItems.length > 0 ? extraMeta.menuItems.slice(0, 3).join("、") : "";
  const osmShopTag = extraMeta?.osmCategory === "shop" ? "shopping shop" : "";
  const nameAndNotes = `${rawName} ${extraMeta?.japaneseTitle || ""} ${extraMeta?.googleCategory || ""} ${extraMeta?.yahooCategory || ""} ${osmShopTag} ${extraMeta?.osmType || ""} ${(extraMeta?.menuItems || []).join(" ")} ${realHighlights.join(" ")} ${extraMeta?.editorialSummary || ""} ${extraMeta?.wikiSummary || ""} ${rawText} ${userNotes}`.toLowerCase();

  const translateCategoryToZhTw = (rawCat: string, fallbackZh: string): string => {
    const c = (rawCat || "").trim();
    if (!c) return fallbackZh;
    const cl = c.toLowerCase();
    if (/(donut|doughnut|ドーナツ|生ドーナツ)/.test(cl)) return "職人手作生甜甜圈";
    if (/(bread|bakery|boulangerie|パン|ベーカリー)/.test(cl)) return "職人手作烘焙坊";
    if (/(コーヒースタンド|coffee stand|roaster|ロースター)/.test(cl)) return "職人精品咖啡吧";
    if (/(coffee|cafe|珈琲|コーヒー|カフェ)/.test(cl)) return "手沖精品咖啡館";
    if (/(cake|patisserie|pastry|sweets|洋菓子|スイーツ)/.test(cl)) return "法式手作甜點店";
    if (/(焼肉|焼き肉|yakiniku)/.test(cl)) return "極上炭火和牛燒肉";
    if (/(すき焼き|すき焼|sukiyaki)/.test(cl)) return "頂級日式壽喜燒";
    if (/(寿司|鮨|すし|sushi)/.test(cl)) return "江戶前新鮮壽司";
    if (/(ラーメン|らーめん|ramen|つけ麺)/.test(cl)) return "道地濃郁拉麵";
    if (/(焼鳥|焼き鳥|やきとん|もつ焼き|居酒屋|酒場|izakaya|yakitori)/.test(cl)) return "道地炭火串燒居酒屋";
    if (/(とんかつ|豚カツ|tonkatsu)/.test(cl)) return "極厚酥脆炸豬排";
    if (/(天ぷら|tempura|天丼)/.test(cl)) return "江戶前酥脆天婦羅";
    if (/(そば|蕎麦|soba)/.test(cl)) return "職人手打蕎麥麵";
    if (/(うどん|udon)/.test(cl)) return "職人手打烏龍麵";
    if (/(居酒屋|ダイニング|ビストロ|bistro|restaurant)/.test(cl)) return fallbackZh;
    if (/[\u4e00-\u9fa5]{2,}/.test(c) && !/[\u3040-\u30ff]/.test(c)) return c;
    return fallbackZh;
  };

  const nameIsExplicitCafeOrFoodClient = /(starbucks|スターバックス|blue bottle|coffee|cafe|roastery|espresso|bakery|boulangerie|patisserie|donut|doughnut|ramen|sushi|yakiniku|izakaya|restaurant|珈琲|コーヒー|カフェ|喫茶|ドーナツ|ラーメン|寿司|焼肉|居酒屋|食堂)/i.test(
    `${rawName} ${extraMeta?.japaneseTitle || ""} ${extraMeta?.googleCategory || ""}`
  );

  const isExplicitSightseeingClient =
    clue === "sightseeing" ||
    clue === "shrine" ||
    /(神社|\bshrine\b|寺院?|お寺|\btemple\b|神宮|\bjingu\b|大社|稲荷|庭園|\bgarden\b|\bgardens\b|公園|\bpark\b(?!ing)|美術館|博物館|記念館|\bmuseum\b|art gallery|\bcastle\b|\bpalace\b|展望台|\bobservatory\b|\btower\b|御苑)/i.test(
      `${rawName} ${extraMeta?.japaneseTitle || ""} ${extraMeta?.googleCategory || ""}`
    );

  const isExplicitShop =
    !nameIsExplicitCafeOrFoodClient &&
    (clue === "shopping" ||
      extraMeta?.osmCategory === "shop" ||
      /(kitchen supply|cutlery|stationery|variety store|general store|book\s*store|bookstore|shopping mall|department store|商店街|shopping street|谷中銀座|kama-?asa|shoten|itoya|kakimori|traveler's factory|d&department|\bcibone\b|\bhands\b|東急ハンズ|tokyu hands|\bhonya\b|\btsutaya\b|蔦屋|書店|選書|藏書)/i.test(
        `${rawName} ${extraMeta?.japaneseTitle || ""} ${extraMeta?.googleCategory || ""}`
      ));

  const isExplicitCafe =
    !isExplicitShop &&
    !isExplicitSightseeingClient &&
    (clue === "cafe" ||
      /(coffee shop|cafe|bakery|cake shop|patisserie|dessert|donut|doughnut|ドーナツ|生ドーナツ|ベーカリー|カフェ|コーヒースタンド|コーヒー|パン屋|食パン|ロールパン|スイーツ|kissaten|\bkoffee\b)/i.test(
        `${rawName} ${extraMeta?.japaneseTitle || ""} ${extraMeta?.googleCategory || ""} ${extraMeta?.yahooCategory || ""}`
      ));

  // Dining Keywords (exclude kitchen supply / cutlery / explicit shops & cafes/bakeries!)
  if (
    !isExplicitShop &&
    !isExplicitCafe &&
    !isExplicitSightseeingClient &&
    (clue === "dining" ||
      clue === "sushi" ||
      clue === "ramen" ||
      /(拉麵|ラーメン|らーめん|つけ麺|tsukemen|mazemen|壽司|寿司|鮨|回転寿司|燒肉|焼き肉|焼肉|ホルモン|壽喜燒|すき焼き|すき焼|sukiyaki|牛舌|牛たん|牛タン|ねぎし|和牛|wagyu|居酒屋|酒場|立ち飲み|ダイニングバー|食堂|shokudo|定食|teishoku|丼飯|\bkaisen(?:don)?\b|\bdonburi\b|\bgyudon\b|\bunadon\b|\bkatsudon\b|\boyakodon\b|tsujihan|つじ半|志乃多|いなり|洋食|yoshoku|中華|義大利|意大利|イタリアン|法式料理|フレンチ|ビストロ|串燒|焼き鳥|焼鳥|yakitori|yakiton|motsuyaki|kushikatsu|もつ焼き|鳥料理|鳥元|torigen|鰻魚|うなぎ|\bunagi\b|天婦羅|天ぷら|\btempura\b|天丼|tendon|漢堡排|ハンバーグ|hamburg|炸豬排|とんかつ|豚カツ|\btonkatsu\b|炸牛排|牛かつ|gyukatsu|火鍋|しゃぶしゃぶ|\bshabu(?:-?shabu)?\b|もつ鍋|鐵板燒|鉄板焼|teppanyaki|teppan|關東煮|おでん|\boden\b|料理(?!道具|刀具|器具)|和食(?!廚具|道具|器)|割烹|kappo|懷石|懐石|kaiseki|omakase|おまかせ|烏龍|うどん|蕎麥|そば|蕎麦|海鮮|お好み焼き|okonomiyaki|takoyaki|yakisoba|もんじゃ|\bmonja\b|咖哩|カレー|\bcurry\b|餐廳|\bafuri\b|一風堂|山頭火|大戸屋|やよい軒|サイゼリヤ|\brestaurant\b|\bsushi\b|\bramen\b|\byakiniku\b|\budon\b|\bsoba\b|\bizakaya\b|\byakitori\b|\bsteak\b|\bbistro\b|\btrattoria\b|\bosteria\b|\bpizzeria\b|\bkitchen\b(?!\s*(?:supply|ware|knife|knives|tool|utensil|goods|store|shop))|\bgrill\b|\btavern\b)/i.test(nameAndNotes))
  ) {
    let highlight = realHighlights[0]
      ? `${cleanName} ${realHighlights.slice(0, 2).join("・")}`
      : `${cleanName} 嚴選道地風味人氣料理與招牌美食`;
    let cuisineType = translateCategoryToZhTw(extraMeta?.yahooCategory || "", "日式特色料理");
    let signatureDishes =
      extraMeta?.menuItems && extraMeta.menuItems.length > 0
        ? extraMeta.menuItems.slice(0, 3)
        : realHighlights.length > 0
        ? realHighlights.slice(0, 3)
        : ["主廚特選料理", "人氣定番菜色"];
    if (nameAndNotes.includes("拉麵") || nameAndNotes.includes("ラーメン") || nameAndNotes.includes("らーめん") || /\b(?:afuri|ramen|tsukemen)\b/i.test(nameAndNotes) || clue === "ramen") {
      if (!realHighlights[0]) highlight = `${cleanName} 濃厚醇郁湯頭與現煮彈牙拉麵`;
      cuisineType = "道地日式拉麵・沾麵";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["特製招牌拉麵", "炙燒叉燒糖心蛋"];
    } else if (/(志乃多|いなり|稲荷)/.test(nameAndNotes)) {
      if (!realHighlights[0]) highlight = `${cleanName} 秘傳甘甜柴魚高湯油揚豆皮稻荷壽司`;
      cuisineType = "老鋪豆皮稻荷壽司";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["秘傳豆皮稻荷壽司", "傳統干瓢卷折詰盒"];
    } else if (/(海鮮丼|\bkaisen(?:don)?\b|tsujihan|つじ半)/i.test(nameAndNotes)) {
      if (!realHighlights[0]) highlight = `${cleanName} 產地直送極鮮魚料與海膽鮭魚卵海鮮丼`;
      cuisineType = "產地直送極上海鮮丼";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["特製綜合海鮮丼", "鯛魚高湯茶漬吃法"];
    } else if (nameAndNotes.includes("壽司") || nameAndNotes.includes("寿司") || /\bsushi\b/i.test(nameAndNotes) || clue === "sushi") {
      if (!realHighlights[0]) highlight = `${cleanName} 產地直送極鮮魚料與職人握壽司`;
      cuisineType = "江戶前壽司・海鮮料理";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["主廚特選握壽司盛合", "極鮮鮪魚中腹手卷"];
    } else if (nameAndNotes.includes("燒肉") || nameAndNotes.includes("焼き肉") || nameAndNotes.includes("焼肉") || nameAndNotes.includes("yakiniku")) {
      if (!realHighlights[0]) highlight = `${cleanName} 極上頂級油花和牛與秘傳炭烤香氣`;
      cuisineType = "極上炭火和牛燒肉";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["特選黑毛和牛拼盤", "招牌炙燒霜降肉片", "蔥鹽極厚牛舌"];
    } else if (nameAndNotes.includes("牛舌") || nameAndNotes.includes("牛たん") || nameAndNotes.includes("牛タン") || nameAndNotes.includes("ねぎし")) {
      if (!realHighlights[0]) highlight = `${cleanName} 極厚切炭烤牛舌、麥飯與清燉牛尾湯`;
      cuisineType = "仙台炭火牛舌專門";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["極厚切牛舌定食", "清燉牛尾湯", "山藥泥麥飯"];
    } else if (nameAndNotes.includes("壽喜燒") || nameAndNotes.includes("すき焼き") || nameAndNotes.includes("すき焼")) {
      if (!realHighlights[0]) highlight = `${cleanName} 百年秘傳高湯割下與柔嫩黑毛和牛`;
      cuisineType = "黑毛和牛壽喜燒・涮涮鍋";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["特選和牛壽喜燒定食", "百年割下和牛御膳"];
    } else if (/(串燒|焼鳥|焼き鳥|鳥元|torigen|yakitori|izakaya|居酒屋)/i.test(nameAndNotes)) {
      if (!realHighlights[0]) highlight = `${cleanName} 備長炭現烤多汁串燒與道地和風居酒屋酒肴`;
      cuisineType = "道地炭火串燒居酒屋";
      if (!extraMeta?.menuItems?.length && !realHighlights.length) signatureDishes = ["炭火職人串燒拼盤", "嚴選銘酒佐餐小料理"];
    }

    const jpName = extraMeta?.japaneseTitle || cleanName;
    const catLabelZh = translateCategoryToZhTw(extraMeta?.yahooCategory || "", cuisineType || "餐廳美饌");
    const recMenu = menuListText ? `推薦必點「${menuListText}」。` : realHighlights.length > 0 ? `推薦必嚐店內人氣「${realHighlights.slice(0, 2).join("、")}」。` : "建議點選招牌特選主菜與當日季節限量品項；";
    const resolvedMap = cleanGoogleMapsLink(resolvedPinUrl, cleanName, district);
    return {
      spotName: cleanName,
      desc: `佇立於${district}的「${cleanName}」，${foundingNote}${foodRatingNote}${highlightSentence}是備受在地饕客信賴的${catLabelZh}名鋪。推開門簾便能感受到職人的火候功力與嚴選食材本味，入口層次豐富細膩，為自由行添上一抹難忘的美味記憶。`,
      recommendation: `${recMenu}熱門用餐時段建議提早前往或事先訂位${hoursSuffix}。`,
      suggestedTime: "午間定食或晚間用餐時段",
      tag: `${detectDistrict(district).replace(/（.*$/, "")}、${cuisineType}、自由行推薦`,
      mapUrl: resolvedMap,
      resolvedUrl: resolvedPinUrl,

      name: cleanName,
      japaneseName: jpName,
      category: "dining",
      categoryLabel: catLabelZh,
      highlight,
      summary: `${cleanName} 位於${district}，${foundingNote}${foodRatingNote}${highlightSentence}用餐氛圍溫馨道地，是旅伴共享美食時光的必嚐首選。`,
      address: district,
      tips: `${recMenu}熱門用餐時段建議提早前往或離峰造訪${hoursSuffix}；可點選地圖確認最新菜單與公休日。`,
      cuisineType,
      signatureDishes,
      priceRange: extraMeta?.priceRangeHint || (/(燒肉|焼肉|壽喜燒|すき焼き|懷石|割烹)/.test(nameAndNotes) ? "約 ¥5,000 - ¥12,000 / 人" : "約 ¥1,500 - ¥4,000 / 人"),
      diningAtmosphere: `${extraMeta?.accessInfo ? `${extraMeta.accessInfo}・` : ""}道地溫馨日式食堂與質感用餐氛圍`,
    };
  }

  // Cafe, Bakery & Dessert Keywords (exclude explicit shopping stores & shopping streets!)
  if (
    !isExplicitShop &&
    (isExplicitCafe ||
      clue === "cafe" ||
      /(咖啡|珈琲|\bcoffee\b|\bcafe\b|\broastery\b|\bespresso\b|カフェ|コーヒースタンド|コーヒー|ロースター|喫茶|kissaten|甘味処|甜點|甜品|\bdessert\b|\bsweets\b|スイーツ|洋菓子|和菓子|wagashi|dorayaki|taiyaki|mochi|蛋糕|\bcake\b|\bpastry\b|\bpatisserie\b|\bchocolatier\b|\bchoux\b|甜甜圈|ドーナツ|生ドーナツ|\bdonut\b|\bdoughnut\b|泡芙|シュー|布丁|プリン|可麗露|カヌレ|貝果|ベーグル|可頌|クロワッサン|生吐司|食パン|カレーパン|ジェラート|\bgelato\b|\bwaffle\b|\bcrepe\b|\bparlor\b|フルーツパーラー|\btea house\b|\btea room\b|\bbread\b|パン|ベーカリー|\bbakery\b|\bboulangerie\b|烘焙|麵包|抹茶|焙茶|菓子)/i.test(nameAndNotes))
  ) {
    const jpName = extraMeta?.japaneseTitle || cleanName;
    const isBakery = /(bread|bakery|boulangerie|パン|ベーカリー|パン屋|食パン|ロールパン|クロワッサン|ペリカン|pelican)/i.test(nameAndNotes);
    const isDonut = /(ドーナツ|生ドーナツ|donut|doughnut)/i.test(nameAndNotes);
    const isCoffeeOnly = !isBakery && !isDonut && /(コーヒースタンド|coffee stand|roastery|ロースター|自家焙煎|koffee|mameya)/i.test(nameAndNotes);
    const fallbackCafeLabel = isDonut ? "職人手作生甜甜圈" : isBakery ? "職人手作烘焙坊" : isCoffeeOnly ? "職人精品咖啡吧" : "甜點咖啡";
    const cafeType = translateCategoryToZhTw(extraMeta?.yahooCategory || "", fallbackCafeLabel);
    const cafeDishes =
      extraMeta?.menuItems && extraMeta.menuItems.length > 0
        ? extraMeta.menuItems.slice(0, 3)
        : realHighlights.length > 0
        ? realHighlights.slice(0, 3)
        : isDonut
        ? ["原味蓬鬆生甜甜圈", "開心果奶油夾心", "檸檬糖霜口味"]
        : isBakery
        ? ["每日現烤山型吐司", "麥香小餐包", "招牌烘焙麵包"]
        : ["單品手沖精品咖啡", "當日手作招牌甜點"];
    const cafeRec = menuListText
      ? `招牌必點「${menuListText}」，`
      : realHighlights.length > 0
      ? `招牌必嚐「${realHighlights.slice(0, 2).join("、")}」，`
      : isDonut
      ? "推薦首選原味蓬鬆生甜甜圈與開心果奶油款，"
      : isBakery
      ? "推薦一早前往挑選每日限量的現烤山型吐司與小餐包，"
      : isCoffeeOnly
      ? "推薦請咖啡師依風味喜好沖煮當季單品濾掛或濃縮飲品，"
      : "推薦點選招牌單品手沖咖啡或現烤甜點，";
    const cafeScene = isDonut
      ? "剛出爐的鬆軟麵香與細緻糖霜交織出幸福甜韻，每口都讓人驚艷"
      : isBakery
      ? "麥香濃厚、外酥內軟的現烤麵包香氣撲鼻而來，承載著職人日常手作的純粹溫度"
      : "現磨咖啡豆與輕柔手沖韻味在空氣中緩緩流動，為東京散策留下一段沉靜而美好的午後時光";
    const resolvedMap = cleanGoogleMapsLink(resolvedPinUrl, cleanName, district);
    return {
      spotName: cleanName,
      desc: `隱身在${district}街角的「${cleanName}」，${foundingNote}${foodRatingNote}${highlightSentence}${cafeScene}，是自由行途中不可多得的${cafeType}好去處。`,
      recommendation: `${cafeRec}${isCoffeeOnly ? "門市常為精品手沖吧形式，建議預留品味與選豆時間" : "熱門手作烘焙品項常提早完售，建議提早到訪"}${hoursSuffix}。`,
      suggestedTime: isBakery ? "晨間至午間出爐時段 (09:30 - 13:30)" : "午後悠閒散策時段 (13:30 - 16:30)",
      tag: `${detectDistrict(district).replace(/（.*$/, "")}、${cafeType}、午茶散策`,
      mapUrl: resolvedMap,
      resolvedUrl: resolvedPinUrl,

      name: cleanName,
      japaneseName: jpName,
      category: "cafe",
      categoryLabel: cafeType,
      highlight: realHighlights[0] ? `${cleanName} ${realHighlights.slice(0, 2).join("・")}` : `${cleanName} ${cafeType}`,
      summary: `${cleanName} 位於${district}，${foundingNote}${foodRatingNote}${highlightSentence}${cafeScene}。`,
      address: district,
      tips: `${cafeRec}可點選地圖確認最新營業與公休日資訊${hoursSuffix}。`,
      cuisineType: cafeType,
      signatureDishes: cafeDishes,
      priceRange: extraMeta?.priceRangeHint || "約 ¥600 - ¥1,600 / 人",
      diningAtmosphere: `${extraMeta?.accessInfo ? `${extraMeta.accessInfo}・` : ""}柔和靜謐空間，適合散策歇腳與品味手作點心`,
    };
  }

  // Strict Sightseeing Landmarks (Shrines, Temples, Museums, Parks, Towers)
  if (
    clue === "sightseeing" ||
    clue === "shrine" ||
    /(神社|\bshrine\b|寺院?|お寺|\btemple\b|神宮|\bjingu\b|大社|稲荷|観音|八幡|豪徳寺|浅草寺|増上寺|gotoku-?ji|senso-?ji|zojo-?ji|公園|\bpark\b(?!ing)|庭園|\bgardens?\b|植物園|\bbotanical\b|展望台|\bobservatory\b|\btower\b|鐵塔|晴空塔|美術館|博物館|記念館|資料館|\bmuseum\b|art gallery|\bcastle\b|\bpalace\b|遺跡|渓谷|\bvalley\b|御苑)/i.test(nameAndNotes)
  ) {
    let spotType = "歷史古蹟 / 名勝古剎";
    let mustSeeHighlights = realHighlights.length > 0 ? realHighlights.slice(0, 3) : ["傳統建築工藝", "四季景致庭園"];
    if (/(神社|神宮|寺|temple|shrine|大社|稲荷|観音|gotoku-?ji|senso-?ji|zojo-?ji)/i.test(nameAndNotes)) {
      spotType = "古老神社寺院 / 祈福名所";
      if (realHighlights.length === 0) mustSeeHighlights = ["壯麗鳥居與山門", "御守與御朱印祈福參拜", "境內歷史造景"];
    } else if (/(展望台|塔|tower|observatory)/i.test(nameAndNotes)) {
      spotType = "高空展望台 / 都會地標";
      if (realHighlights.length === 0) mustSeeHighlights = ["360度東京天際線俯瞰", "夕陽與璀璨百萬夜景"];
    } else if (/(公園|庭園|御苑|\bpark\b|\bgardens?\b|植物園)/i.test(nameAndNotes)) {
      spotType = "都會綠洲 / 悠閒日式庭園";
      if (realHighlights.length === 0) mustSeeHighlights = ["迴遊式庭園水景", "四季櫻花與紅葉步道"];
    } else if (/(美術館|博物館|記念館|museum|gallery)/i.test(nameAndNotes)) {
      spotType = "藝術文化 / 典藏美術館";
      if (realHighlights.length === 0) mustSeeHighlights = ["精選常設與特展", "建築空間光影美學"];
    }

    const jpName = extraMeta?.japaneseTitle || cleanName;
    const accessTips = extraMeta?.accessInfo ? `鄰近${extraMeta.accessInfo}，` : "";
    const resolvedMap = cleanGoogleMapsLink(resolvedPinUrl, cleanName, district);
    return {
      spotName: cleanName,
      desc: `${cleanName} 佇立在${district}，${foundingNote}${ratingNote}${highlightSentence}承載著深厚文化與歲月沉澱，微風輕拂綠意，隨處可見歷史與當代生活交織的細膩痕跡，是自由行散策途中最舒心難忘的探訪角落。`,
      recommendation: `${accessTips}造訪時建議預留彈性時間漫步參觀，欣賞周邊傳統建築與四季風情${hoursSuffix}。`,
      suggestedTime: /(美術館|博物館|gallery|museum)/.test(nameAndNotes) ? "日間開館展期時段 (10:30 - 16:30)" : "清晨參拜或黃昏散策時段",
      tag: `${detectDistrict(district).replace(/（.*$/, "")}、${spotType.split(" / ")[0]}、散策攝影`,
      mapUrl: resolvedMap,
      resolvedUrl: resolvedPinUrl,

      name: cleanName,
      japaneseName: jpName,
      category: "sightseeing",
      categoryLabel: spotType.split(" / ")[0] || "觀光景點",
      highlight: realHighlights[0] ? `${cleanName} ${realHighlights.slice(0, 2).join("・")}` : `${cleanName} 古典歷史風華與悠閒散策景致`,
      summary: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}環境優雅清幽，富含深厚人文底蘊與四季景致，漫步其間令人心曠神怡，非常適合安排在自由行漫遊路線中。`,
      address: district,
      tips: `${accessTips}造訪時建議預留彈性時間漫步參觀，欣賞周邊建築與風景；清晨或離峰時段最為舒適${hoursSuffix}。`,
      spotType,
      mustSeeHighlights,
      ticketInfo: extraMeta?.hoursNote || "依現場或官網展覽開放資訊為主",
      bestTimeToVisit: /(美術館|博物館|gallery|museum)/.test(nameAndNotes) ? "日間開館展期時段 (10:30 - 16:30)" : "清晨或午後柔和光影時段",
    };
  }

  // Shopping Keywords (Department stores, indie stationery, cutlery, zakka, bookstores, shopping streets, boutiques)
  if (
    clue === "shopping" ||
    extraMeta?.osmCategory === "shop" ||
    /(\bmall\b|\bmarket\b|商場|百貨|購物|\bstore\b|\bshop\b|\boutlet\b|\bdepartment\b|department store|variety store|general store|stationery|文具|文房具|手帳|鋼筆|書局|書店|本屋|書房|書籍|選書|蔵書|藏書|\bhonya\b|\bbookstore\b|\btsutaya\b|蔦屋|紀伊國屋|丸善|有隣堂|雜貨|雑貨|選物|選品|生活道具|生活提案|設計選物|長效設計|家居|家具|furniture|design store|select shop|lifestyle shop|craft shop|craft store|pottery|ceramics|廚具|道具街|刀具|包丁|刃物|陶器|cutlery|kitchen supply|kitchenware|hardware|home goods|gift shop|souvenir|伴手禮|商店|商会|専門店|\bshoten\b|\bzakka\b|\bgoods\b|古著|服飾|精品|clothing|apparel|vintage|boutique|藥妝|drugstore|pharmacy|電器|electronics|camera|loft|ロフト|itoya|伊東屋|kakimori|カキモリ|muji|無印|don quijote|uniqlo|\bhands\b|ハンズ|tokyu hands|d&department|\bcibone\b|\bbeams\b|\bparco\b|\blumine\b|\bhikarie\b|\btakashimaya\b|\bisetan\b|\bmitsukoshi\b|\bmarui\b|デパート|マルイ|ルミネ|パルコ|traveler's factory|kama-?asa|釜浅|釜淺|谷中銀座|商店街|shopping street)/i.test(nameAndNotes)
  ) {
    let shopLabel = "特色選物商店";
    let shopHighlightFallback = "質感生活雜貨、日系選物與在地限定好物";
    if (/(文具|文房具|stationery|itoya|kakimori|traveler's factory)/.test(nameAndNotes)) {
      shopLabel = "質感文具・手帳選物店";
      shopHighlightFallback = "原創設計手帳、鋼筆墨水與客製紙品專區";
    } else if (/(包丁|刀具|廚具|道具|cutlery|kitchen|hardware|kama-?asa|釜浅|釜淺)/.test(nameAndNotes)) {
      shopLabel = "百年職人廚具道具店";
      shopHighlightFallback = "職人鍛造料理刀具、鐵鍋與和食專業器皿";
    } else if (/(書店|本屋|書房|bookstore|\bhonya\b|tsutaya|蔦屋|選書|藏書)/.test(nameAndNotes)) {
      shopLabel = "主題精選書店";
      shopHighlightFallback = "精選風格書牆、文化雜貨與生活提案選品";
    } else if (/(d&department|cibone|設計選物|長效設計|家具|工藝)/.test(nameAndNotes)) {
      shopLabel = "設計工藝・生活選物店";
      shopHighlightFallback = "長效設計美學單品、日本地方工藝與生活器物";
    } else if (/(hands|ハンズ|tokyu hands|loft|ロフト)/.test(nameAndNotes)) {
      shopLabel = "日式創意生活百貨";
      shopHighlightFallback = "質感手帳文具、日系家居雜貨與創意設計好物";
    } else if (/(商店街|谷中銀座|shopping street)/.test(nameAndNotes)) {
      shopLabel = "懷舊下町商店街";
      shopHighlightFallback = "濃厚昭和下町氛圍、特色老鋪小店與散策好物";
    } else if (/(百貨|商場|\bmall\b|department store|\boutlet\b)/.test(nameAndNotes)) {
      shopLabel = "購物商場・百貨";
      shopHighlightFallback = "精選品牌專櫃、生活雜貨與免稅購物一站滿足";
    } else if (/(古著|服飾|clothing|apparel|vintage|boutique)/.test(nameAndNotes)) {
      shopLabel = "風格服飾・古著選品";
      shopHighlightFallback = "日系潮流服飾、精選單品與質感配飾";
    }

    const jpName = extraMeta?.japaneseTitle || cleanName;
    const accessTips = extraMeta?.accessInfo ? `鄰近${extraMeta.accessInfo}，` : "";
    const resolvedMap = cleanGoogleMapsLink(resolvedPinUrl, cleanName, district);
    return {
      spotName: cleanName,
      desc: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}以充滿職人巧思與日系美學的選品陳列備受旅人推崇，動線輕鬆愜意，適合放慢步調挖掘別具紀念價值的限定好物。`,
      recommendation: `${accessTips}建議預留充裕時間細看特色商品，若單筆達免稅標準可出示護照確認 Tax-Free 退稅服務${hoursSuffix}。`,
      suggestedTime: "午後或傍晚質感散策採買時段 (13:00 - 18:00)",
      tag: `${detectDistrict(district).replace(/（.*$/, "")}、${shopLabel}、自由行選物`,
      mapUrl: resolvedMap,
      resolvedUrl: resolvedPinUrl,

      name: cleanName,
      japaneseName: jpName,
      category: "shopping",
      categoryLabel: shopLabel,
      highlight: realHighlights[0] ? `${cleanName} ${realHighlights.slice(0, 2).join("・")}` : `${cleanName} ${shopHighlightFallback}`,
      summary: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}匯集多元品牌、特色日常道具與旅途選物，逛街散策十分舒適。`,
      address: district,
      tips: `${accessTips}外國旅客可留意門市免稅服務（Tax-Free）與限量限定商品；可點選地圖確認最新營業時間${hoursSuffix}。`,
    };
  }

  // Lodging Keywords
  if (
    clue === "stay" ||
    /(\bhotel\b|旅館|飯店|溫泉宿|\binn\b|\bresort\b|\bhostel\b)/i.test(nameAndNotes)
  ) {
    const jpName = extraMeta?.japaneseTitle || cleanName;
    const accessTips = extraMeta?.accessInfo ? `鄰近${extraMeta.accessInfo}，` : "";
    const resolvedMap = cleanGoogleMapsLink(resolvedPinUrl, cleanName, district);
    return {
      spotName: cleanName,
      desc: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}地理位置優越，提供整潔溫馨的住宿環境與齊全設施服務，讓旅人在充實的行程後獲得充分放鬆與舒眠。`,
      recommendation: `${accessTips}建議留意飯店入住（Check-in）時間，提早抵達通常可先於櫃台免費寄存行李${hoursSuffix}。`,
      suggestedTime: "入住登記時段 (15:00 後)",
      tag: `${detectDistrict(district).replace(/（.*$/, "")}、交通便利、舒適旅宿`,
      mapUrl: resolvedMap,
      resolvedUrl: resolvedPinUrl,

      name: cleanName,
      japaneseName: jpName,
      category: "stay",
      categoryLabel: "旅宿飯店",
      highlight: `${cleanName} 舒適客房、生活機能優質與交通便捷據點`,
      summary: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}提供整潔溫馨的住宿環境與齊全設施服務，讓旅人在充實的行程後獲得充分放鬆與舒眠。`,
      address: district,
      tips: `${accessTips}建議留意飯店入住（Check-in）時間，提早抵達通常可先於櫃台免費寄存行李${hoursSuffix}。`,
    };
  }

  // Default fallback for any Tokyo spot: Never use "東京精選推薦據點"
  const jpName = extraMeta?.japaneseTitle || cleanName;
  const accessTips = extraMeta?.accessInfo ? `鄰近${extraMeta.accessInfo}，` : "";
  const resolvedMap = cleanGoogleMapsLink(resolvedPinUrl, cleanName, district);
  return {
    spotName: cleanName,
    desc: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}以其獨特的在地魅力與人文風采吸引旅人前來探訪，是自由行散策途中值得駐足細細感受的特色去處。`,
    recommendation: `${accessTips}前往時可利用 Google 地圖實時步行導航，並可點擊地圖連結確認今日最新營業時間${hoursSuffix}。`,
    suggestedTime: "午後散策時段",
    tag: `${detectDistrict(district).replace(/（.*$/, "")}、自由行推薦、私房清單`,
    mapUrl: resolvedMap,
    resolvedUrl: resolvedPinUrl,

    name: cleanName,
    japaneseName: jpName,
    category: "sightseeing",
    categoryLabel: "觀光景點",
    highlight: realHighlights[0] ? `${cleanName} ${realHighlights.slice(0, 2).join("・")}` : `${cleanName} 自由行私房人氣探訪推薦`,
    summary: `${cleanName} 位於${district}，${foundingNote}${ratingNote}${highlightSentence}是在地廣受歡迎的探訪點。點擊卡片右上角地圖圖示可直接開啟 Google Maps 查看即時街景、最新評價與步行路線。`,
    address: district,
    tips: `${accessTips}前往時可利用 Google 地圖實時步行導航，並可點擊地圖連結確認今日最新營業時間${hoursSuffix}。`,
  };
}
