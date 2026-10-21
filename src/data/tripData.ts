export interface FlightInfo {
  flightNumber: string;
  airline: string;
  date: string;
  origin: string;
  originCode: string;
  originTerminal: string;
  destination: string;
  destinationCode: string;
  destinationTerminal: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  notes: string;
}

export interface HotelInfo {
  name: string;
  japaneseName: string;
  address: string;
  checkIn: string;
  checkOut: string;
  access: string;
  highlights: string[];
  features: {
    comfort: string;
    luggage: string;
    subway: string;
    convenience: string;
  };
  googleMapsUrl: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  durationMinutes?: number;
  title: string;
  location: string;
  description: string;
  tag?: string;
  track?: 'theater' | 'runner' | 'shared';
  category: 'flight' | 'transit' | 'hotel' | 'dining' | 'activity' | 'shopping' | 'sightseeing';
  transitLine?: string;
  mapsQuery?: string;
  tips?: string;
}

export interface RunningSegment {
  distance: string;
  title: string;
  from: string;
  to: string;
  routeDescription: string;
  sceneryHighlights: string[];
  elevation: string;
  surface: string;
}

export interface Attraction {
  id: string;
  itineraryOrder: number;
  itineraryTime: string;
  name: string;
  japaneseName: string;
  category: string;
  day: number;
  highlight: string;
  description: string;
  address: string;
  tips: string[];
  imageSrc: string;
  unsplashUrl?: string;
  officialWebsite?: string;
  googleMapsUrl: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  desc?: string;
  defaultChecked?: boolean;
  isImportant?: boolean;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  feelsLike: number;
  condition: string;
  pop: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  isRunTime?: boolean;
}

export interface DailyForecast {
  date: string;
  dayOfWeek: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  pop: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  marineStatus: string;
}

export const TRIP_META = {
  title: "台北東京 2026 週末快閃之旅",
  dates: "2026/11/28（六）– 11/29（日）",
  duration: "2 天 1 夜（充實週末行程）",
  travelers: "雙人同行（SHOCK 舞台劇 ＆ 10K 路跑）",
  hotelName: "VIA INN PRIME 日本橋人形町",
  flightSummary: "酷航 TR866 / TR875 早去晚回",
};

export const FLIGHTS: { outbound: FlightInfo; inbound: FlightInfo } = {
  outbound: {
    flightNumber: "TR866",
    airline: "酷航 (Scoot)",
    date: "2026/11/28（六）",
    origin: "台北桃園國際機場",
    originCode: "TPE",
    originTerminal: "第一航廈 (T1)",
    destination: "東京成田國際機場",
    destinationCode: "NRT",
    destinationTerminal: "第一航廈 (T1)",
    departureTime: "06:50",
    arrivalTime: "10:55",
    duration: "3 小時 05 分",
    aircraft: "Boeing 787 夢幻客機",
    notes: "預計 04:50 前抵達桃機第一航廈櫃檯報到。出境後搭乘成田 Sky Access 特急直通都營淺草線至人形町。",
  },
  inbound: {
    flightNumber: "TR875",
    airline: "酷航 (Scoot)",
    date: "2026/11/29（日）",
    origin: "東京成田國際機場",
    originCode: "NRT",
    originTerminal: "第一航廈 (T1)",
    destination: "台北桃園國際機場",
    destinationCode: "TPE",
    destinationTerminal: "第一航廈 (T1)",
    departureTime: "19:45",
    arrivalTime: "22:55",
    duration: "4 小時 10 分",
    aircraft: "Boeing 787 夢幻客機",
    notes: "建議於 17:30 前抵達成田 T1 報到櫃檯。於人形町搭乘淺草線直通 Access 特急班次約 70 分鐘抵達機場。",
  },
};

export const HOTEL: HotelInfo = {
  name: "VIA INN PRIME 日本橋人形町",
  japaneseName: "ヴィアインプライム日本橋人形町",
  address: "東京都中央区日本橋人形町2-24-3",
  checkIn: "15:00 以後（可提前於 13:30 寄放行李）",
  checkOut: "10:00 以前（退房後可寄放行李至返程）",
  access: "都營淺草線／東京地鐵日比谷線「人形町站」A3/A6 出口步行約 3 分鐘；半藏門線「水天宮前站」步行約 7 分鐘",
  highlights: [
    "直通成田機場：都營淺草線免換乘直達，省時省力免搬行李走樓梯",
    "全客房席夢思名床：配備獨立筒名床與加濕空氣清淨機，享受靜謐好眠",
    "人形町下町老街核心：周邊包圍小網神社、甘酒橫丁、三原堂與排隊名店",
    "自助智能行李寄存機：全自動置物鎖，取放行李免漫長排隊",
  ],
  features: {
    comfort: "全室配備席夢思 (Simmons) 獨立筒名床、加濕空氣清淨機與獨立衛浴設備",
    luggage: "入住前與退房後均提供免費自動寄存櫃服務",
    subway: "都營淺草線直通 Access 特急，一線直抵成田機場與新橋",
    convenience: "步行 1 分鐘內即有 7-Eleven 與 FamilyMart 便利商店",
  },
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=VIA+INN+PRIME+Nihonbashi+Ningyocho",
};

export const DAY1_ITINERARY: ItineraryItem[] = [
  {
    id: "d1-1",
    time: "06:50–10:55",
    title: "搭乘酷航 TR866 航班出發",
    location: "台北桃園 T1 → 東京成田 T1",
    description: "搭乘清晨航班出發，機上稍作休息。降落前確認手機 Visit Japan Web 審查 QR Code。",
    category: "flight",
    track: "shared",
    tips: "建議在桃機先裝滿水壺，降落成田前 40 分鐘調整手錶時區（日本快台灣 1 小時）。",
  },
  {
    id: "d1-2",
    time: "10:55–12:15",
    title: "入境審查、領取行李、開通網路",
    location: "成田機場第一航廈",
    description: "依循指標出境，掃描入境審查與海關電子申報 QR Code，提領托運行李。",
    category: "activity",
    track: "shared",
    tips: "確認手機 eSIM 訊號切換正常、Suica / PASMO 交通卡餘額充足（建議儲值 3,000 日圓）。",
  },
  {
    id: "d1-3",
    time: "12:15–13:30",
    durationMinutes: 75,
    title: "成田機場 → 人形町（Access 特急直通車）",
    location: "成田機場鐵道月台 → 人形町站",
    transitLine: "京成成田 Sky Access 特急直通都營淺草線 · 免換乘直達",
    description: "搭乘「成田 Sky Access／Access 特急（直通都營淺草線／京急線）」班次，中途無需換車，一車直達人形町站。",
    category: "transit",
    track: "shared",
    mapsQuery: "成田空港第一ターミナル から 人形町駅",
    tips: "看清發車資訊幕「羽田空港行」或「西馬込行」之 Access 特急，刷 IC 卡即可搭乘，票價約 1,370 日圓。",
  },
  {
    id: "d1-4",
    time: "13:30–13:50",
    title: "抵達飯店寄放行李",
    location: "VIA INN PRIME 日本橋人形町",
    description: "由人形町站出站步行 3 分鐘抵達飯店，於前台或自助寄物區寄放隨身行李，輕裝出發。",
    category: "hotel",
    track: "shared",
    mapsQuery: "VIA INN PRIME 日本橋人形町",
    tips: "跑者可將跑鞋、運動保暖風衣放入隨身輕量背包隨行攜帶。",
  },
  {
    id: "d1-5",
    time: "13:50–14:40",
    durationMinutes: 50,
    title: "人形町 → 新橋 → 有明（搭乘海鷗號）",
    location: "都營淺草線人形町站 → 新橋站 → 百合海鷗號有明站",
    transitLine: "都營淺草線至新橋（7 分鐘）+ 轉乘百合海鷗號高架電車（25 分鐘）",
    description: "搭淺草線至新橋，轉乘高架臨海單軌電車「百合海鷗號 (Yurikamome)」橫越彩虹大橋抵達有明站。",
    category: "transit",
    track: "shared",
    mapsQuery: "新橋駅 百合かもめ",
    tips: "百合海鷗號過彩虹大橋時窗外東京灣風景極佳，可站於車頭或右側車窗觀賞。",
  },
  {
    id: "d1-6",
    time: "14:40–15:00",
    title: "步行至有明花園、確認動線",
    location: "有明花園 (Ariake Garden) / 東京花園劇場",
    description: "由有明站出站經天橋連通道步行至有明花園複合商場，先行確認劇場入場入口、跑者置物與晚間會合點。",
    category: "activity",
    track: "shared",
    mapsQuery: "東京ガーデンシアター",
    tips: "劇場入口位於商場旁的 2F 通廊，標示清晰好找。",
  },
  {
    id: "d1-7",
    time: "15:00–16:20",
    title: "有明花園商場購物（必逛店家指南）",
    location: "有明花園購物中心 1F–5F",
    description: "東京灣岸近 200 間店舖的複合旗艦大型商場，集結關東旗艦生活選物、生鮮超市、免稅電器、運動慢跑專門店與天然溫泉設施，動線寬敞舒適好逛。",
    category: "shopping",
    track: "shared",
    tips: "商場服務台提供外國旅客免稅手續諮詢；大型寄物櫃多集中於 2F/3F 連通道旁。",
  },
  {
    id: "d1-8",
    time: "16:20–17:05",
    title: "牛たん炭焼 利久 提前晚餐",
    location: "有明花園 5F 美食街餐廳區",
    description: "仙台炭烤厚切牛舌名店！提前避開用餐尖峰享用香烤牛舌定食、麥飯、山藥泥與牛尾澄清湯，為跑步與看劇補足元氣。",
    category: "dining",
    track: "shared",
    mapsQuery: "牛たん炭焼 利久 有明ガーデン店",
    tips: "推薦「極（きわみ）定食」，厚切牛舌外脆內嫩多汁，好消化又具飽足感。",
  },
  {
    id: "d1-9",
    time: "17:05–17:50",
    title: "分流準備：更衣、熱身與入場候位",
    location: "有明花園 2F 劇場走廊 / 更衣更換跑步裝備",
    description: "看劇者持票驗票準備入場；跑步者至商場洗手間更換跑服、進行動態暖身，步行至官方跑步路線起點。",
    category: "activity",
    track: "shared",
    tips: "11 月下旬傍晚氣溫約 11–13°C，海風偏涼，跑者請務必做好關節活絡與熱身。",
  },
  {
    id: "d1-10",
    time: "18:00–約 19:20",
    title: "一人欣賞 SHOCK 舞台劇；另一人完成 10 公里跑步",
    location: "東京花園劇場 vs 有明·台場·青海 10 公里環線",
    description: "【看劇者】於東京花園劇場欣賞由堂本光一主演・構成・演出的經典神作《Endless SHOCK Memories -CONTINUE-》（東宝官網：https://www.tohostage.com/shock/），見證客席紅綢飛越與 25 年殿堂傳奇。\n【跑步者】由劇場出發，橫越夢之大橋，沿台場海濱公園、彩虹大橋夜景海岸、潮風公園、青海南埠頭，跑出完整不重複的 10 公里環線！",
    category: "activity",
    track: "shared",
    tips: "看劇注意：劇場 17:05 開放進場，開演前手機請關靜音，演出全程嚴禁攝影；跑者配速約 5:30–6:00/km，夜間海風清爽照明極佳。",
  },
  {
    id: "d1-11",
    time: "19:20–20:50",
    title: "跑步者返回有明花園，休息、喝飲料或逛商場",
    location: "有明花園商場 / 休憩區",
    description: "跑步者完成 10K 後進行伸展收操，換上保暖乾爽衣物，在商場買飲料休息或逛街，等候舞台劇散場。",
    category: "activity",
    track: "runner",
    tips: "商場 5F「泉天空之湯」有豐富飲品自動販賣機與休息長椅；如時間充裕亦可自費單次泡湯洗浴。",
  },
  {
    id: "d1-12",
    time: "約 21:00",
    title: "兩人於東京花園劇場入口外約定地點會合",
    location: "東京花園劇場 (Tokyo Garden Theater) 2F 主入口",
    description: "舞台劇散場後於約定地點碰頭會合，分享看劇心得與夜跑夜景。",
    category: "activity",
    track: "shared",
    tips: "散場人潮較多，建議站在 2F 連通道側柱或商場服務台顯眼處等候。",
  },
  {
    id: "d1-13",
    time: "21:00 後",
    durationMinutes: 40,
    title: "搭車返回人形町飯店",
    location: "有明站 → 新橋站 → 人形町站",
    transitLine: "百合海鷗號（有明站 ➔ 新橋站）+ 轉乘都營淺草線（新橋站 ➔ 人形町站）",
    description: "詳細交通路線：自商場步行 4 分鐘至「有明站」，搭乘【百合海鷗號（往新橋方向）】至終點「新橋站」（約 25 分鐘）；站內依循指標轉乘【都營地下鐵淺草線（往押上/青砥方向）】直達「人形町站」（約 7 分鐘），A3 出口步行 3 分鐘回抵飯店辦理入住手續。",
    category: "transit",
    track: "shared",
    mapsQuery: "有明駅から人形町駅",
  },
  {
    id: "d1-14",
    time: "21:40–23:00",
    title: "飯店辦理入住與客房舒眠放鬆",
    location: "VIA INN PRIME 日本橋人形町",
    description: "於自助智能機台辦理入住領取房卡，進入客房享受席夢思名床與舒適衛浴，整理今日戰利品並充分放鬆休息，儲備明日探索老街與賞楓的滿滿活力。",
    category: "hotel",
    track: "shared",
    tips: "客房配備獨立溫控空調、加濕型空氣清淨機與高品質洗沐用品，環境安靜優雅。",
  },
];

export const RUNNING_SEGMENTS: RunningSegment[] = [
  {
    distance: "0 – 2.5 km",
    title: "起跑橫越夢之大橋 → DiverCity",
    from: "東京花園劇場起點",
    to: "台場海濱公園入口",
    routeDescription: "自東京花園劇場外起跑，沿 Symbol Promenade Park 寬闊的中央步道直行，跑上夢之大橋。經過 DiverCity Tokyo Plaza（獨角獸鋼彈巨像）後續往台場海濱公園。此段單向不原路折返。",
    sceneryHighlights: ["Symbol Promenade Park 寬闊步道", "夢之大橋幾何燈柱景致", "DiverCity 獨角獸鋼彈立像"],
    elevation: "全平坦（僅上落橋坡度 < 1.5%）",
    surface: "平整人行道磚與橡膠步道",
  },
  {
    distance: "2.5 – 4.5 km",
    title: "台場海濱公園 → 海岸觀景步道",
    from: "台場海濱公園入口",
    to: "第三台場遺址周邊海岸步道",
    routeDescription: "沿海岸往北側延伸，欣賞東京灣與彩虹大橋景色，再利用不同的園區步道接往西側，不刻意重跑同一段。",
    sceneryHighlights: ["彩虹大橋正面夜景", "自由女神像海濱景觀", "海面上穿梭的屋形船燈火"],
    elevation: "完全平坦 (0m 海拔)",
    surface: "海濱木棧道與石板路",
  },
  {
    distance: "4.5 – 6.5 km",
    title: "台場海岸 → 潮風公園 → 船之科學館周邊",
    from: "潮風公園海之廣場",
    to: "船之科學館周邊步道",
    routeDescription: "沿東京灣海岸步道往南行進，串接潮風公園的海景路段，避免回頭穿越已跑過的台場中央步道。",
    sceneryHighlights: ["潮風公園開闊海角夜景", "東京港郵輪碼頭海灣景致", "船之科學館大型船舶輪廓"],
    elevation: "平坦海堤人行道",
    surface: "寬敞瀝青步道與柏油路",
  },
  {
    distance: "6.5 – 8.2 km",
    title: "青海南埠頭公園 → 青海、Telecom Center 周邊",
    from: "青海南埠頭公園",
    to: "Telecom Center 電信中心東側",
    routeDescription: "沿園區南側路段往青海方向前進，轉入返程方向。這段以沿海主步道及可通行的人行路段為主，路幅寬敞安靜。",
    sceneryHighlights: ["大井貨櫃碼頭夜景燈火", "Telecom Center 凱旋門造型建築", "寬闊平整的人行徒步區"],
    elevation: "極微小起伏",
    surface: "專用人行步道",
  },
  {
    distance: "8.2 – 10.0 km",
    title: "青海 → 東京 Big Sight → 有明 → 東京花園劇場終點",
    from: "東京 Big Sight 南側外圍",
    to: "東京花園劇場終點 (10.0K)",
    routeDescription: "由南側人行路線往東京 Big Sight，再經有明周邊外圍步道接回劇場，與去程中央步道分開，完成環線。",
    sceneryHighlights: ["Tokyo Big Sight 倒金字塔建築夜景", "Ariake Arena 遠眺夜色", "10K 完跑終點：東京花園劇場外廣場"],
    elevation: "平坦衝刺路段",
    surface: "平整花崗岩鋪面廣場",
  },
];

export const DAY2_ITINERARY: ItineraryItem[] = [
  {
    id: "d2-1",
    time: "07:45–08:15",
    title: "起床、退房、寄放行李",
    location: "VIA INN PRIME 日本橋人形町",
    description: "起床整理行李。至 1F 辦理退房，並將大件行李免費寄放於飯店行李櫃，輕裝出發。",
    category: "hotel",
    track: "shared",
    tips: "隨身攜帶小包裝護照、錢包與參拜零錢，其餘物品均寄存於飯店。",
  },
  {
    id: "d2-2",
    time: "08:15–08:30",
    durationMinutes: 15,
    title: "前往小網神社",
    location: "人形町街區步道（步行約 400 公尺）",
    transitLine: "人形町街區步行 · 約 400m",
    description: "早晨的人形町老街空氣清新寧靜，穿行在傳統日式建築街區前往小網神社。",
    category: "transit",
    track: "shared",
    mapsQuery: "小網神社",
  },
  {
    id: "d2-3",
    time: "08:30–09:15",
    title: "小網神社：參拜、領御守",
    location: "小網神社 (Koami Shrine)",
    description: "東京知名強運厄除、金運向上的代表神社。於手水舍洗手參拜，並在「洗錢井」清洗硬幣作為招財錢母，請領人氣強運厄除龍御守與財運御守。",
    category: "sightseeing",
    track: "shared",
    tips: "準備 5 円、50 円或 500 円日幣硬幣放入竹簍過水洗滌，放入皮夾作錢母；社務所 09:00 開賣御守。",
  },
  {
    id: "d2-4",
    time: "09:15–09:30",
    durationMinutes: 15,
    title: "步行前往 DIXANS",
    location: "人形町巷弄步行約 300 公尺",
    transitLine: "街區步行 · 約 300m",
    description: "從小網神社漫步前往風格雅緻的 DIXANS 人形町店。",
    category: "transit",
    track: "shared",
    mapsQuery: "DIXANS 人形町",
  },
  {
    id: "d2-5",
    time: "09:30–10:00",
    title: "DIXANS：黑糖厚片吐司、咖啡早餐",
    location: "DIXANS Ningyocho",
    description: "享用烤得金黃酥脆的厚切烤土司佐黑糖黃油，搭配精緻拉花拿鐵或單品手沖咖啡早餐。",
    category: "dining",
    track: "shared",
    tips: "厚切黑糖吐司外層焦脆、內層柔軟拉絲，搭配熱拿鐵非常美味。",
  },
  {
    id: "d2-6",
    time: "10:00–10:15",
    title: "甘酒橫丁短暫散步",
    location: "人形町甘酒橫丁 (Amazake Yokocho)",
    description: "人形町最具代表性的傳統商店街，兩旁林立老字號和菓子鋪與茶葉鋪，感受濃厚江戶老街風情。",
    category: "sightseeing",
    track: "shared",
    mapsQuery: "甘酒横丁",
    tips: "街道兩旁的紅磚與傳統燈籠十分適合散步留影。",
  },
  {
    id: "d2-7",
    time: "10:15–10:30",
    title: "三原堂本店買鹽煎餅",
    location: "人形町三原堂本店（人形町站前十字路口）",
    description: "創立於明治十年的百年名店。購買招牌「鹽煎餅」——選用優質梗米佐以伯方鹽與白醬油烘烤，米香濃郁帶鹹香顆粒感，是熱門伴手禮。",
    category: "shopping",
    track: "shared",
    mapsQuery: "三原堂本店 人形町",
    tips: "鹽煎餅常溫保存期長達數週，輕便耐放，亦有精緻鐵盒包裝。",
  },
  {
    id: "d2-8",
    time: "10:30–11:00",
    title: "前往花山烏龍麵、候位",
    location: "五代目花山うどん 日本橋店",
    description: "自甘酒橫丁步行約 700 公尺抵達花山烏龍麵日本橋店。該店 11:00 開門，提早抵達排在第一批入場名單內。",
    category: "dining",
    track: "shared",
    mapsQuery: "五代目 花山うどん 日本橋店",
    tips: "11:00 前抵達基本能順利在第一輪入座，省下用餐尖峰的等候時間。",
  },
  {
    id: "d2-9",
    time: "11:00–11:45",
    title: "五代目花山烏龍麵日本橋店午餐",
    location: "五代目花山うどん 日本橋店",
    description: "品嚐群馬縣百年老店名物「鬼ひも川」寬烏龍麵！盛裝在信樂燒狸貓陶碗中，寬達 5 公分的麵條滑順彈牙，搭配芝麻醬汁或上州麥豚肉湯。",
    category: "dining",
    track: "shared",
    tips: "推薦「鬼御膳」，能同時吃到冰鎮 Q 彈鬼ひも川與香脆天婦羅小丼飯。",
  },
  {
    id: "d2-10",
    time: "11:45–12:20",
    durationMinutes: 35,
    title: "搭地鐵前往新宿御苑",
    location: "日本橋站 → 赤坂見附（同月台轉乘） → 新宿御苑前站",
    transitLine: "銀座線（日本橋 ➔ 赤坂見附）+ 同月台轉丸之內線（赤坂見附 ➔ 新宿御苑前）",
    description: "詳細交通路線：自花山烏龍麵步行 2 分鐘至「日本橋站」搭乘【東京地下鐵銀座線（往澀谷方向）】至「赤坂見附站」，於同月台對面直接轉乘【丸之內線（往荻窪方向）】至「新宿御苑前站」（車程約 20 分鐘），由 1 號出口出站步行 3 分鐘抵達新宿御苑「新宿門」。",
    category: "transit",
    track: "shared",
    mapsQuery: "日本橋駅から新宿御苑前駅",
    tips: "赤坂見附站為銀座線與丸之內線同月台平面轉乘，走 5 步即到對面月台，完全不需上下樓梯！",
  },
  {
    id: "d2-11",
    time: "12:20–14:20",
    title: "新宿御苑賞銀杏、紅葉、日本庭園",
    location: "新宿御苑 (Shinjuku Gyoen)",
    description: "11 月底正是東京秋意最濃的季節！漫步於巨木銀杏大道，腳下踩著金色落葉毯；探訪日本庭園區與中之池，火紅的雞爪槭倒映在水面上。",
    category: "sightseeing",
    track: "shared",
    tips: "精華拍照動線：新宿門進 → 銀杏林 (金色大道) → 中之池 → 日本傳統庭園 (紅葉倒影) → 大木戶門散步出。",
  },
  {
    id: "d2-12",
    time: "14:20–15:10",
    durationMinutes: 50,
    title: "返回人形町飯店",
    location: "新宿御苑前站 → 赤坂見附/銀座 → 人形町站",
    transitLine: "丸之內線（新宿御苑前 ➔ 銀座/赤坂見附）+ 轉銀座線/淺草線至人形町",
    description: "詳細交通路線：自「新宿御苑前站」搭乘【丸之內線（往池袋方向）】至「赤坂見附站」同月台轉【銀座線（往淺草方向）】至「日本橋站」，轉乘【都營淺草線】1 站至「人形町站」（車程約 25 分鐘），A3 出口步行 3 分鐘回飯店取行李。",
    category: "transit",
    track: "shared",
    mapsQuery: "新宿御苑前駅から人形町駅",
  },
  {
    id: "d2-13",
    time: "15:10–15:30",
    title: "領行李、前往車站",
    location: "VIA INN PRIME 人形町 → 都營淺草線人形町站",
    description: "於飯店前台領回大行李箱，稍作打包整理，步行 3 分鐘至淺草線人形町站月台等候機場直通班次。",
    category: "hotel",
    track: "shared",
    tips: "利用 A3 出口之電梯或無障礙升降設施攜帶行李箱最為省力。",
  },
  {
    id: "d2-14",
    time: "約 15:30–17:00",
    durationMinutes: 90,
    title: "搭直通班次前往成田機場",
    location: "都營淺草線人形町站 → 成田機場第一航廈",
    transitLine: "都營淺草線直通京成 Access 特急（成田空港行）· 一車到底免轉乘（約 70 分）",
    description: "搭乘淺草線直通京成 Access 特急，一車直達無須搬行李轉車，舒適直抵成田機場 T1。",
    category: "transit",
    track: "shared",
    tips: "列車設有大型行李放置處與清晰雙語廣播，可於車上補眠休息。",
  },
  {
    id: "d2-15",
    time: "17:00–17:30",
    title: "抵達機場、報到及出境",
    location: "成田機場第一航廈 4F 出境大廳",
    description: "抵達酷航 (Scoot) 報到櫃檯辦理登機證列印、托運行李過磅，通過安檢與自動通關出境。",
    category: "flight",
    track: "shared",
    tips: "酷航櫃檯通常於起飛前 3 小時開放，17:30 前完成手續時間充裕，出境後可逛免稅店採買伴手禮。",
  },
  {
    id: "d2-16",
    time: "19:45–22:55",
    title: "TR875 起飛返台",
    location: "成田機場 T1 → 台北桃園 T1",
    description: "搭乘酷航 TR875 班機平安返回台北桃園國際機場，結束充實精彩的東京週末行程。",
    category: "flight",
    track: "shared",
    tips: "班機預計 22:55 降落桃園第一航廈，出關領行李約 23:45。",
  },
];

// CHRONOLOGICAL ORDER of Attractions strictly matching the user's itinerary,
// WITH AUTHENTIC, DOCUMENTARY PHOTOS OF EACH ACTUAL SPOT FROM OFFICIAL WEBSITES:
export const ATTRACTIONS: Attraction[] = [
  {
    id: "attr-ariake-theater",
    itineraryOrder: 1,
    itineraryTime: "DAY 1｜14:40 抵達確認動線・15:00 購物・18:00 舞台劇開演",
    name: "有明花園 ＆ 東京花園劇場",
    japaneseName: "有明ガーデン / 東京ガーデンシアター",
    category: "大型複合商場・專業劇院",
    day: 1,
    highlight: "東京灣岸大型複合商場，擁有 8,000 人座席的東京花園劇場",
    description: "集結 200 間店舖的購物中心、大型無印良品旗艦店、天然溫泉「泉天空之湯」，以及全日本頂級規格的「東京花園劇場 (Tokyo Garden Theater)」。無論是大型音樂劇演出，或是看劇前後的購物餐飲、跑者置物休憩，動線皆無縫整合於同一園區。",
    address: "東京都江東区有明2-1-8",
    tips: [
      "劇場 2F 入口直接連通商場戶外景觀連通道，標示清晰好找",
      "商場設有豐富自動寄物櫃與休息沙發，跑者與看劇者極佳會合據點",
      "5F 泉天空之湯溫泉提供跑後洗浴放鬆",
    ],
    imageSrc: "/images/ariake_garden_exterior.jpg",
    unsplashUrl: "https://ariake.shopping-sumitomo-rd.com/",
    officialWebsite: "https://ariake.shopping-sumitomo-rd.com/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tokyo+Garden+Theater",
  },
  {
    id: "attr-rikyu",
    itineraryOrder: 2,
    itineraryTime: "DAY 1｜16:20 提前晚餐",
    name: "牛たん炭焼 利久 有明花園店",
    japaneseName: "牛たん炭焼 利久 有明ガーデン店",
    category: "仙台名物・炭烤極厚牛舌",
    day: 1,
    highlight: "仙台炭火燒烤厚切牛舌定食，高蛋白好消化，16:20 提前晚餐免排隊",
    description: "來自日本仙台的牛舌名店！採用職人炭火現烤，厚切牛舌外脆內嫩多汁，搭配麥飯、香滑山藥泥與清爽甘甜的牛尾澄湯，為晚間的舞台劇觀賞與 10K 東京灣海風跑步提供充沛元氣。",
    address: "東京都江東区有明2-1-8 有明ガーデン 5F",
    tips: [
      "推薦「極（きわみ）定食」，厚度約普通牛舌兩倍，外酥內嫩多汁",
      "16:20 前來可完全避開週末晚間排隊人潮",
      "備有日英對照菜單，出餐迅速",
    ],
    imageSrc: "/images/attraction_rikyu_gyutan.jpg",
    unsplashUrl: "https://corp.rikyu-gyutan.co.jp/menu/",
    officialWebsite: "https://corp.rikyu-gyutan.co.jp/menu/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=牛たん炭焼+利久+有明ガーデン店",
  },
  {
    id: "attr-shock-musical",
    itineraryOrder: 3,
    itineraryTime: "DAY 1｜17:05 入場準備・18:00–約 19:20 觀劇",
    name: "堂本光一 主演《Endless SHOCK Memories -CONTINUE-》",
    japaneseName: "堂本光一 主演 ミュージカル『Endless SHOCK Memories -CONTINUE-』",
    category: "東宝殿堂級音樂劇・25年傳奇最終章巡演",
    day: 1,
    highlight: "「Show Must Go On!」堂本光一創下 25 年 2,128 回公演全數即日完售神話，2026.11.28 全國巡迴首站於東京花園劇場盛大啟航！",
    description: "日本原創音樂劇的最高到達點！由堂本光一自 2000 年 11 月以 21 歲創下帝國劇場史上最年少座長紀錄以來，締造 25 年全 2,128 回公演全數即日完售的空前神話，動員超過 370 萬人。全劇以“Show Must Go On!”（無論如何演出必須繼續）為靈魂，描繪柯一（Koichi）與其カンパニー在命運洪流中奔馳的姿態。演出集結帝劇頂級世界級舞台機構、極限 22 段階梯滾落（階段落ち）、大迫力雙刀殺陣真劍交鋒、和太鼓演奏與堂本光一無安全繩紅綢飛越 1,900 席客席上空（客席フライング）！2026 年 11 月 28 日（六）全國巡迴《Endless SHOCK Memories -CONTINUE-》首場盛典於東京花園劇場震撼啟航，歷代豪華共演陣容齊聚！",
    address: "東京都江東区有明2-1-6 東京ガーデンシアター",
    tips: [
      "東宝官方特設網站：https://www.tohostage.com/shock/（官方最新公演日程與情報）",
      "17:05 開放驗票入場，建議提早 30–40 分鐘抵達現場購買官方場刊手冊與紀念週邊",
      "東京花園劇場 8,000 席世界級聲光，演出全程嚴格禁止任何拍照、錄音、錄影，開演前請將手機關靜音",
      "首站豪華卡司陣容：堂本光一、ふぉ～ゆ～（福田悠太/辰巳雄大/越岡裕貴/松崎祐介）、佐藤勝利、島田歌穂、前田美波里等",
    ],
    imageSrc: "/images/attraction_shock_stage.jpg",
    unsplashUrl: "https://www.tohostage.com/shock/images/visual.jpg",
    officialWebsite: "https://www.tohostage.com/shock/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tokyo+Garden+Theater",
  },
  {
    id: "attr-odaiba-run",
    itineraryOrder: 3,
    itineraryTime: "DAY 1｜18:00 10K 跑步出發",
    name: "台場與東京灣海岸步道",
    japaneseName: "お台場海浜公園・潮風公園",
    category: "海景跑步・彩虹大橋地標",
    day: 1,
    highlight: "開闊東京灣夜景！遠眺彩虹大橋與東京鐵塔燈火，全平坦無紅綠燈跑步路線",
    description: "東京灣岸最具代表性的臨海觀景路線。由夢之大橋出發，貫穿台場海濱公園、自由女神像、潮風公園與青海碼頭。整條路線緊鄰東京灣，夜幕降臨後，彩虹大橋點燈、遠方東京鐵塔與海面上穿梭的屋形船倒映在平靜海面上，海風徐徐，是全日本跑者最推崇的夜跑路線之一。",
    address: "東京都港区台場・品川区東八潮",
    tips: [
      "10K 環線全程均為專用人行步道與公園無車路段，安全性極佳",
      "沿途公廁、長椅與飲料販賣機密集，補給方便",
      "傍晚 16:30 日落，18:00 起跑正好處於華燈初上的絕美夜景",
    ],
    imageSrc: "/images/official_odaiba_gotokyo.webp",
    unsplashUrl: "https://www.gotokyo.org/tc/destinations/southern-tokyo/odaiba/index.html",
    officialWebsite: "https://www.gotokyo.org/tc/destinations/southern-tokyo/odaiba/index.html",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Odaiba+Marine+Park",
  },
  {
    id: "attr-koami",
    itineraryOrder: 4,
    itineraryTime: "DAY 2｜08:30 晨間參拜",
    name: "小網神社",
    japaneseName: "小網神社（こあみじんじゃ）",
    category: "日本橋下町・強運厄除名所",
    day: 2,
    highlight: "東京知名的「強運厄除」與「銭洗弁天」，二戰空襲奇蹟完好的靈驗神域",
    description: "隱身於日本橋寧靜巷弄間的神社，歷史可追溯至 1466 年。在第二次世界大戰時，攜帶該社御守出征的士兵全數平安歸鄉，且在東京大空襲中周邊全毀唯獨小網神社奇蹟安然無恙，因而被尊為東京「強運厄除」名所。境內「東京銭洗弁天」更吸引許多信眾前來以神泉洗滌錢幣祈求好運。",
    address: "東京都中央区日本橋小網町16-23",
    tips: [
      "早上 08:30 抵達可避開中午排隊人龍",
      "將 5 円或 500 円硬幣放在竹簍中浸潤神泉洗滌，擦乾後放入皮夾作為「錢母」",
      "代表性的「強運厄除龍御守」雕工精緻，極具紀念價值",
    ],
    imageSrc: "/images/official_koami_jinja.jpg",
    unsplashUrl: "https://www.koamijinja.or.jp/",
    officialWebsite: "https://www.koamijinja.or.jp/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Koami+Shrine",
  },
  {
    id: "attr-dixans",
    itineraryOrder: 5,
    itineraryTime: "DAY 2｜09:30 咖啡早餐",
    name: "DIXANS 人形町店",
    japaneseName: "ディゾン 人形町",
    category: "人氣烘焙・職人咖啡",
    day: 2,
    highlight: "厚達 4 公分的焦香黑糖黃油厚片吐司與精緻拉花拿鐵",
    description: "結合法式烘焙甜點與現代木質工業風的質感咖啡館。招牌「黑糖厚片吐司 (Brown Sugar Toast)」將厚切生吐司表面烘烤至琥珀焦香，淋上濃郁沖繩黑糖與發酵黃油，外酥內軟，香氣四溢，配上一杯手沖單品或拿鐵，是開啟東京早晨的美味選擇。",
    address: "東京都中央区日本橋富沢町16-5",
    tips: [
      "早晨 08:00 起營業，小網神社參拜後步行前來剛好避開外帶人潮",
      "除厚吐司外，店內特製栗子蒙布朗與布丁亦很受歡迎",
      "二樓提供寬敞座位區與溫暖木質採光，環境舒適安靜",
    ],
    imageSrc: "/images/attraction_dixans_toast.jpg",
    unsplashUrl: "https://www.instagram.com/dixans.ningyocho/",
    officialWebsite: "https://www.instagram.com/dixans.ningyocho/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=DIXANS+Ningyocho",
  },
  {
    id: "attr-amazake-miharado",
    itineraryOrder: 6,
    itineraryTime: "DAY 2｜10:00 散步・10:15 伴手禮",
    name: "甘酒橫丁 ＆ 三原堂本店",
    japaneseName: "甘酒横丁・人形町三原堂本店",
    category: "老街散步・百年伴手禮",
    day: 2,
    highlight: "明治十年名店招牌「鹽煎餅」，伯方之鹽與白醬油烘烤的甘醇米香",
    description: "人形町經典的傳統商店街甘酒橫丁。漫步在兩旁古色古香的店鋪間，在創立於 1877 年的三原堂本店採購名物「鹽煎餅 (塩せんべい)」——選用優質梗米烘烤出輕薄酥脆口感，佐以天然伯方鹽的微鹹甘甜，是歷久彌新的東京伴手禮首選。",
    address: "東京都中央区日本橋人形町1-14-10",
    tips: [
      "鹽煎餅常溫保存期可達數週，輕便耐碰撞，適合帶上飛機",
      "亦販售季節限定之生菓子與銅鑼燒",
      "人形町站出站十字路口即可見醒目招牌",
    ],
    imageSrc: "/images/official_amazake_yokocho.jpg",
    unsplashUrl: "https://iconia.co.jp/zh-tw/attractions-amazake-yokocho-tokyo-japan",
    officialWebsite: "https://iconia.co.jp/zh-tw/attractions-amazake-yokocho-tokyo-japan",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=三原堂本店+人形町",
  },
  {
    id: "attr-hanayama",
    itineraryOrder: 7,
    itineraryTime: "DAY 2｜10:30 候位・11:00 午餐",
    name: "五代目花山烏龍麵 日本橋店",
    japaneseName: "五代目 花山うどん 日本橋店",
    category: "百年排隊美食・群馬名物",
    day: 2,
    highlight: "明治 27 年創立！寬達 5 公分的傳奇「鬼ひも川」寬烏龍麵，三連霸冠軍",
    description: "來自群馬縣館林市的百年老字號。鎮店之寶「鬼ひも川」擁有驚人的 5 公分寬度，薄透滑溜卻兼具不可思議的 Q 彈嚼勁。以特製的信樂燒狸貓陶碗盛裝，無論是搭配冰鎮芝麻沾醬或是熱騰騰的上州麥豚肉高湯，入口極致滑潤，風味絕倫。",
    address: "東京都中央区日本橋2-10-12",
    tips: [
      "上午 11:00 開門營業，建議 10:30 前抵達排隊爭取第一輪入座",
      "推薦「鬼御膳（花山寬麵 + 天婦羅小天丼）」雙重享受",
      "店內可購買生麵條伴手禮盒回家烹煮",
    ],
    imageSrc: "/images/attraction_hanayama_udon.jpg",
    unsplashUrl: "https://www.hanayamaudon.co.jp/",
    officialWebsite: "https://www.hanayamaudon.co.jp/",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=五代目+花山うどん+日本橋店",
  },
  {
    id: "attr-shinjuku",
    itineraryOrder: 8,
    itineraryTime: "DAY 2｜12:20–14:20 秋季散策",
    name: "新宿御苑",
    japaneseName: "新宿御苑（しんじゅくぎょえん）",
    category: "秋季賞楓・黃金銀杏",
    day: 2,
    highlight: "11 月下旬秋季絕景！金黃銀杏林地毯 ＆ 典雅日式池泉庭園楓紅",
    description: "橫跨新宿與澀谷的國家級庭園，融合法式整形庭園、英式風景庭園與傳統日本庭園。每年 11 月下旬至 12 月初是銀杏與紅葉交織的季節，巨木銀杏落葉在陽光下灑成一片金光閃閃的厚地毯，池畔的雞爪槭紅艷似火，與遠方摩天大樓構成古今交織的經典東京畫卷。",
    address: "東京都新宿区内藤町11",
    tips: [
      "入園門票大人 500 日圓，可用電子支付或 IC 卡感應入場",
      "推薦由「新宿門」進入，先拍中之池與銀杏林，再前往日本庭園觀賞水面倒影",
      "園區全域禁止飲酒、全面禁菸，環境維持極為清幽雅緻",
    ],
    imageSrc: "/images/test_shinjuku_ginkgo.jpg",
    unsplashUrl: "https://policies.env.go.jp/national-garden/shinjukugyoen/index.html",
    officialWebsite: "https://policies.env.go.jp/national-garden/shinjukugyoen/index.html",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shinjuku+Gyoen+National+Garden",
  },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // 核心證件與票券
  { id: "c-passport", category: "重要證件與票券", title: "中華民國護照正本", desc: "確認效期滿 6 個月以上（建議 2027 年 6 月後到期）", defaultChecked: true },
  { id: "c-vjw", category: "重要證件與票券", title: "Visit Japan Web 填寫完成", desc: "事先於手機截圖保存入境審查與海關申報 QR Code", defaultChecked: true },
  { id: "c-theater-ticket", category: "重要證件與票券", title: "SHOCK 舞台劇電子票券 / 取票憑證", desc: "確認演出日期 11/28、開演時間 18:00 與座位序號", defaultChecked: true },
  { id: "c-flights", category: "重要證件與票券", title: "酷航電子機票行程單", desc: "TR866 (去 06:50) / TR875 (回 19:45) 訂位代碼與條碼", defaultChecked: true },
  { id: "c-hotel", category: "重要證件與票券", title: "VIA INN PRIME 日本橋人形町 訂房憑證", desc: "確認入住者姓名與確認信編號", defaultChecked: true },
  { id: "c-ic-card", category: "重要證件與票券", title: "Suica / PASMO / ICOCA 交通卡", desc: "推薦加入 Apple 錢包或實體卡充值至少 3,000 日圓", defaultChecked: true },
  { id: "c-yen", category: "重要證件與票券", title: "日幣現金（小網神社與老店專用）", desc: "準備 10,000~20,000 円現金，含洗錢用的 5 円/50 円硬幣", defaultChecked: false },
  { id: "c-credit-cards", category: "重要證件與票券", title: "海外高回饋信用卡 2 張", desc: "開通海外刷卡與預借現金/簡訊驗證碼功能", defaultChecked: false },

  // 10K 跑者裝備
  { id: "c-run-shoes", category: "10K 跑者裝備", title: "公路慢跑鞋", desc: "合腳且抓地力佳之日常訓練跑鞋", defaultChecked: false },
  { id: "c-run-apparel", category: "10K 跑者裝備", title: "防風薄風衣 / 長袖運動排汗衣", desc: "11 月底東京灣晚上海風較大，體感約 9–10°C", defaultChecked: false },
  { id: "c-run-tights", category: "10K 跑者裝備", title: "運動緊身跑褲 / 慢跑長短褲", desc: "建議透氣快乾防風材質", defaultChecked: false },
  { id: "c-run-watch", category: "10K 跑者裝備", title: "GPS 運動手錶或手機跑步臂套", desc: "記錄 10K 軌跡與配速（Garmin / Apple Watch / Strava）", defaultChecked: false },
  { id: "c-run-change", category: "10K 跑者裝備", title: "跑後更換之乾爽保暖衣物與毛巾", desc: "完跑後立即更換避免海風著涼", defaultChecked: false },
  { id: "c-run-flask", category: "10K 跑者裝備", title: "輕量隨身軟水壺 / 能量膠", desc: "隨身小腰包或收納短褲方便攜帶", defaultChecked: false },

  // 看劇必備
  { id: "c-opera-glass", category: "看劇裝備", title: "雙筒望遠鏡 (8–10 倍)", desc: "東京花園劇場場地廣大，觀看演員表情神情極佳利器", defaultChecked: false },
  { id: "c-theater-jacket", category: "看劇裝備", title: "室內保暖針織披肩 / 輕外套", desc: "劇場空調恆溫，久坐建議備有外套", defaultChecked: false },
  { id: "c-tote-bag", category: "看劇裝備", title: "折疊托特提袋 / 環保袋", desc: "盛裝官方購買之紀念場刊與周邊商品", defaultChecked: false },

  // 保暖與 3C 隨身用品
  { id: "c-warm-outer", category: "衣物穿搭與 3C 用品", title: "防風保暖大衣或輕羽絨外套", desc: "東京 11 月下旬早晚溫差大 (7–16°C)，洋蔥式穿搭必備", defaultChecked: false },
  { id: "c-scarf", category: "衣物穿搭與 3C 用品", title: "圍巾或輕便手套", desc: "早晚外出與海邊防風極為實用", defaultChecked: false },
  { id: "c-powerbank", category: "衣物穿搭與 3C 用品", title: "行動電源 (10,000mAh) 與充電線", desc: "注意！行動電源「必須放在隨身行李」，切勿託運", defaultChecked: false },
  { id: "c-esim", category: "衣物穿搭與 3C 用品", title: "日本上網 eSIM 或實體 SIM 卡", desc: "確認漫遊開通、設定好 APN", defaultChecked: false },
  { id: "c-meds", category: "衣物穿搭與 3C 用品", title: "個人常備藥品、護唇膏與眼藥水", desc: "日本秋末空氣乾燥，保濕與常備腸胃藥、止痛藥", defaultChecked: false },
];

export const METEOROLOGICAL_DATA = {
  station: "日本氣象廳 (JMA) · 東京地方氣象台發布",
  publishedAt: "2026-11-28 05:00 JST",
  forecastRegion: "東京都區部（中央區・江東區・港區・新宿區）",
  advisoryHeadline: "【注意報發布】秋晴小春日和・低溫乾燥與日夜溫差注意報（日間 16°C / 清晨 7°C），東京灣岸沿海晚間陣風 4–5 m/s",
  autumnFoliageStatus: {
    ginkgo: "見頃最盛期（100% 金黃）",
    momiji: "見頃（90% 楓紅水影）",
    spot: "新宿御苑銀杏大道與日本庭園紅葉正處於年度最佳黃金觀賞期",
  },
  days: [
    {
      date: "2026/11/28",
      dayOfWeek: "星期六",
      condition: "秋晴（晴時多雲）",
      highTemp: 15,
      lowTemp: 8,
      pop: 10,
      windSpeed: 3.8,
      windDirection: "北北東",
      humidity: 52,
      uvIndex: 3,
      sunrise: "06:28",
      sunset: "16:30",
      marineStatus: "東京灣微波，海風偏涼（體感約 9°C）",
    },
    {
      date: "2026/11/29",
      dayOfWeek: "星期日",
      condition: "晴空朗朗（快晴）",
      highTemp: 16,
      lowTemp: 7,
      pop: 5,
      windSpeed: 2.2,
      windDirection: "東南東",
      humidity: 48,
      uvIndex: 4,
      sunrise: "06:29",
      sunset: "16:30",
      marineStatus: "風和日麗，市區步行體感良好",
    },
  ] as DailyForecast[],
  hourly1128: [
    { time: "06:00", temp: 8, feelsLike: 7, condition: "晴", pop: 0, windSpeed: 2.1, windDirection: "北", humidity: 62 },
    { time: "09:00", temp: 11, feelsLike: 11, condition: "晴", pop: 0, windSpeed: 2.5, windDirection: "北", humidity: 55 },
    { time: "12:00", temp: 15, feelsLike: 15, condition: "晴時多雲", pop: 10, windSpeed: 3.2, windDirection: "北東", humidity: 48 },
    { time: "15:00", temp: 14, feelsLike: 13, condition: "多雲", pop: 10, windSpeed: 3.6, windDirection: "北北東", humidity: 50 },
    { time: "18:00", temp: 11, feelsLike: 9, condition: "晴朗夜空", pop: 0, windSpeed: 4.2, windDirection: "北", humidity: 56, isRunTime: true },
    { time: "21:00", temp: 9, feelsLike: 7, condition: "晴朗星空", pop: 0, windSpeed: 3.4, windDirection: "北北西", humidity: 60 },
  ] as HourlyForecast[],
  hourly1129: [
    { time: "06:00", temp: 7, feelsLike: 6, condition: "晨曦快晴", pop: 0, windSpeed: 1.5, windDirection: "東", humidity: 64 },
    { time: "08:30", temp: 10, feelsLike: 10, condition: "晴", pop: 0, windSpeed: 1.8, windDirection: "東", humidity: 58 },
    { time: "11:00", temp: 14, feelsLike: 14, condition: "晴朗溫暖", pop: 0, windSpeed: 2.2, windDirection: "東南", humidity: 46 },
    { time: "13:00", temp: 16, feelsLike: 16, condition: "秋日晴光", pop: 5, windSpeed: 2.4, windDirection: "南東", humidity: 45 },
    { time: "15:30", temp: 13, feelsLike: 12, condition: "晴", pop: 5, windSpeed: 2.6, windDirection: "東", humidity: 50 },
    { time: "18:00", temp: 10, feelsLike: 9, condition: "晴夜", pop: 0, windSpeed: 2.9, windDirection: "北東", humidity: 55 },
  ] as HourlyForecast[],
  indices: {
    clothing: "洋蔥式穿著：室內暖氣約 23°C，室外早晚寒涼，內穿薄長袖/針織，外搭防風大衣或羽絨外套最合適。",
    running: "台場灣岸 18:00 體感 9°C，海風 4.2 m/s，空氣乾爽涼爽，建議配戴薄手套與防風長袖外套。",
    theater: "東京花園劇場內部恆溫 22°C，久坐看劇建議準備針織披肩或薄外套。",
    uv: "紫外線指數 3–4（弱至中級），戶外賞楓佩戴太陽眼鏡或防曬即可。",
    airQuality: "空氣品質 AQI 22（良好 / 能見度高）。",
  },
};
