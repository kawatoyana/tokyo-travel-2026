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
    bathhouse: string;
    luggage: string;
    subway: string;
    convenience: string;
  };
  googleMapsUrl: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  tag?: string;
  track?: 'theater' | 'runner' | 'shared';
  category: 'flight' | 'transit' | 'hotel' | 'dining' | 'activity' | 'shopping' | 'sightseeing';
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
  name: string;
  japaneseName: string;
  category: string;
  day: number;
  highlight: string;
  description: string;
  address: string;
  tips: string[];
  imageSrc: string;
  googleMapsUrl: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  desc?: string;
  defaultChecked?: boolean;
}

export const TRIP_META = {
  title: "台北東京 2026 秋末漫遊與東京灣 10K",
  dates: "2026/11/28（六）– 11/29（日）",
  duration: "2 天 1 夜（極致精實週末行）",
  travelers: "雙人同行（劇場愛好者 & 10K 跑者）",
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
    notes: "預計 04:50 前抵達桃機櫃檯報到。抵達成田出境後可直接搭乘成田 Sky Access 特急直通都營淺草線至人形町。",
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
    notes: "最晚需於 17:30 前抵達成田 T1 報到櫃檯（起飛前 2 小時）。於人形町搭乘都營淺草線直通 Access 特急班次約 70 分鐘抵達機場。",
  },
};

export const HOTEL: HotelInfo = {
  name: "VIA INN PRIME 日本橋人形町",
  japaneseName: "ヴィアインプライム日本橋人形町（水天の湯）",
  address: "東京都中央区日本橋人形町2-24-3",
  checkIn: "15:00 以後（可提前於 13:30 寄放行李）",
  checkOut: "10:00 以前（退房後可寄放行李至返程）",
  access: "都營淺草線／東京地鐵日比谷線「人形町站」A3/A6 出口步行約 3 分鐘；半藏門線「水天宮前站」步行約 7 分鐘",
  highlights: [
    "直通成田機場：都營淺草線免換乘直達，省時省力免搬行李走樓梯",
    "水天之湯頂樓大浴場：男女獨立大型浴場與微氣泡風呂，跑完步與觀劇後極致放鬆",
    "人形町下町老街核心：周邊包圍小網神社、甘酒橫丁、三原堂與排隊名店",
    "自助智能行李寄存機：全自動置物鎖，取放行李免漫長排隊",
  ],
  features: {
    bathhouse: "2F 水天之湯大浴場（15:00–25:00 / 06:00–09:00 開放）",
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
    title: "搭乘酷航 TR866 航班",
    location: "台北桃園 T1 → 東京成田 T1",
    description: "早班機清晨起飛，機上可稍作補眠。降落前填妥 Visit Japan Web 申報或準備好審查 QR Code。",
    category: "flight",
    track: "shared",
    tips: "建議在桃機先裝滿水壺，降落成田前 40 分鐘調整手錶時區（日本快台灣 1 小時）。",
  },
  {
    id: "d1-2",
    time: "10:55–12:15",
    title: "入境審查、提取行李、開通網路",
    location: "成田機場第一航廈",
    description: "依循指標出境，掃描入境審查與海關電子申報 QR Code，提領托運行李。",
    category: "activity",
    track: "shared",
    tips: "確認手機 eSIM 訊號切換正常、Suica / PASMO 交通卡餘額充足（建議儲值 3,000 日圓）。",
  },
  {
    id: "d1-3",
    time: "12:15–13:30",
    title: "成田機場 → 人形町（Access 特急直通車）",
    location: "成田機場鐵道月台 → 人形町站",
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
    title: "人形町 → 新橋 → 有明（搭乘海鷗號）",
    location: "都營淺草線人形町站 → 新橋站 → 百合海鷗號有明站",
    description: "搭淺草線 4 站至新橋（約 7 分鐘），轉乘高架臨海單軌電車「百合海鷗號 (Yurikamome)」橫越彩虹大橋抵達有明站（約 25 分鐘）。",
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
    tips: "劇場入口位於商場旁的 2F 通廊，標示清晰。",
  },
  {
    id: "d1-7",
    time: "15:00–16:20",
    title: "有明花園商場購物巡禮",
    location: "有明花園購物中心 1F–4F",
    description: "東京灣岸最大型購物中心，擁有大型無印良品 (MUJI 東京有明旗艦店)、運動用品品牌與服飾雜貨。",
    category: "shopping",
    track: "shared",
    tips: "無印良品有明店為全東京最大店之一，烘焙與限定生活選物相當齊全。",
  },
  {
    id: "d1-8",
    time: "16:20–17:05",
    title: "牛たん炭焼 利久 提前晚餐",
    location: "有明花園 5F 美食街餐廳區",
    description: "來自仙台的炭烤厚切牛舌名店！提前避開用餐尖峰享用香烤牛舌定食、麥飯、山藥泥與牛尾澄清湯，為跑步與看劇補足飽滿元氣。",
    category: "dining",
    track: "shared",
    mapsQuery: "牛たん炭焼 利久 有明ガーデン店",
    tips: "推薦「極（きわみ）定食」，厚切牛舌外脆內嫩多汁，高蛋白易消化。",
  },
  {
    id: "d1-9",
    time: "17:05–17:50",
    title: "分流準備：更衣、熱身與入場候位",
    location: "有明花園 2F 劇場走廊 / 更衣更換跑步裝備",
    description: "分工整備：劇迷持票驗票準備入場；跑者至商場洗手間更換跑服、進行動態暖身，緩步前往劇場外跑步起點。",
    category: "activity",
    track: "shared",
    tips: "11 月下旬傍晚氣溫約 11–13°C，海風偏涼，跑者請務必做好關節活絡與核心升溫。",
  },
  {
    id: "d1-10",
    time: "18:00–約 19:20",
    title: "雙軌平行：SHOCK 舞台劇 ＆ 10K 東京灣海風夜跑",
    location: "東京花園劇場 vs 有明·台場·青海 10 公里環線",
    description: "【劇迷】於頂級音響規格的東京花園劇場欣賞震撼心靈的 Endless SHOCK 舞台劇演出。\n【跑者】由劇場出發，橫越夢之大橋，沿台場海濱公園、彩虹大橋夜景海岸、潮風公園、青海南埠頭，跑出完整不重複的 10 公里環線！",
    category: "activity",
    track: "shared",
    tips: "跑者注意配速約 5:30–6:00/km，約 55–60 分鐘完成；路線平坦安全，夜間照明充足。",
  },
  {
    id: "d1-11",
    time: "19:20–20:50",
    title: "跑者完跑休息、補水更衣或逛商場",
    location: "有明花園商場 / 泉天空之湯溫泉外圍休憩區",
    description: "跑者完成 10K 後進行靜態伸展拉筋，擦乾汗水換上保暖乾衣，於商場 2F–5F 買運動機能飲品或熱飲休憩，悠閒等待舞台劇落幕。",
    category: "activity",
    track: "runner",
    tips: "商場 5F「泉天空之湯」有豐富飲品自動販賣機與休息長椅；如時間充裕亦可自費單次泡湯洗浴。",
  },
  {
    id: "d1-12",
    time: "約 21:00",
    title: "兩人於東京花園劇場入口外會合",
    location: "東京花園劇場 (Tokyo Garden Theater) 2F 主入口",
    description: "舞台劇散場後於約定地點順利碰頭，分享演出的熱血高潮與夜跑欣賞到的璀璨台場夜景。",
    category: "activity",
    track: "shared",
    tips: "散場人潮較多，建議站在 2F 連通道側柱或商場諮詢台顯眼處等候。",
  },
  {
    id: "d1-13",
    time: "21:00 後",
    title: "搭車返回人形町飯店、大浴場放鬆",
    location: "有明站 → 新橋 → 人形町站 → VIA INN PRIME",
    description: "搭乘百合海鷗號返回新橋轉都營淺草線回人形町。回飯店辦理正式 Check-in，前往 2F「水天之湯」大浴場浸泡舒緩雙腿肌肉，享受完美一夜好眠。",
    category: "hotel",
    track: "shared",
    tips: "飯店頂樓微氣泡大浴場開放至深夜 01:00，睡前泡湯消除整日疲勞。",
  },
];

export const RUNNING_SEGMENTS: RunningSegment[] = [
  {
    distance: "0 – 2.5 km",
    title: "起跑橫越夢之大橋 → DiverCity",
    from: "東京花園劇場起點",
    to: "台場海濱公園入口",
    routeDescription: "自東京花園劇場外起跑，沿 Symbol Promenade Park 寬闊的中央步道筆直西行，跑上壯觀的「夢之大橋 (Dream Bridge)」。穿過 DiverCity Tokyo Plaza（可瞥見巨大的獨角獸鋼彈巨像）後直奔台場海濱公園。此段單向不折返。",
    sceneryHighlights: ["Symbol Promenade Park 寬闊行人路", "夢之大橋未來感幾何燈柱", "DiverCity 獨角獸鋼彈燈光秀"],
    elevation: "平坦（僅上落橋坡度 < 1.5%）",
    surface: "平整人行磚道與橡膠步道",
  },
  {
    distance: "2.5 – 4.5 km",
    title: "台場海濱公園 → 海岸觀景步道",
    from: "台場海濱公園沙灘步道",
    to: "第三台場遺址周邊步道",
    routeDescription: "順著東京灣海濱北緣木棧道與步道跑進，右手邊是波光粼粼的東京灣海面，正前方即是燈火璀璨的彩虹大橋與對岸東京鐵塔。沿海岸步道北延繞經第三台場外緣，順勢轉往西側步道，完全不跑重疊路段。",
    sceneryHighlights: ["彩虹大橋正前方全景夜色", "自由女神像複製品燈光", "海面上穿梭的屋形船燈火"],
    elevation: "完全平坦 (0m 海拔)",
    surface: "海濱木棧道與石板路",
  },
  {
    distance: "4.5 – 6.5 km",
    title: "台場海岸 → 潮風公園 → 船之科學館",
    from: "潮風公園海之廣場",
    to: "船之科學館周邊林蔭道",
    routeDescription: "沿東京灣南向海岸長廊前行，貫穿潮風公園 (Shiokaze Park)。海風輕撫，遠離商場鬧區人群，視野開闊。穿過巨型船舶造型的「船之科學館」周邊步道，持續向南奔馳，巧妙避開去程走過的中央軸線。",
    sceneryHighlights: ["潮風公園開闊海角夜景", "東京港郵輪碼頭海灣光景", "船之科學館巨型艦艇輪廓"],
    elevation: "平坦海堤道",
    surface: "寬敞瀝青步道與柏油路",
  },
  {
    distance: "6.5 – 8.2 km",
    title: "青海南埠頭公園 → Telecom Center",
    from: "青海南埠頭公園",
    to: "電信中心站 (Telecom Center) 東側",
    routeDescription: "進入青海南側海港園區，跑在青海南埠頭公園的林蔭臨海主道，沿途可見貨櫃碼頭的工業機械燈海，轉入向東返程軸線。此段行人稀少、路幅寬裕，是維持 5:30 節奏巡航的極佳路段。",
    sceneryHighlights: ["大井貨櫃碼頭遠景燈火", "Telecom Center 凱旋門造型建築照明", "靜謐寬廣的無車人行徒步區"],
    elevation: "極微小起伏",
    surface: "專用人行步道",
  },
  {
    distance: "8.2 – 10.0 km",
    title: "青海 → 東京 Big Sight → 有明花園終點",
    from: "東京 Big Sight 南側外圍",
    to: "東京花園劇場終點線 (10.0K)",
    routeDescription: "由南側人行大道逼近東京國際展示場 (Tokyo Big Sight)，仰望巨型倒金字塔會議塔的震撼建築夜照；接著循有明外圍綠意步道北上，順暢接回東京花園劇場起點外廣場，與去程中央步道完全分離，完美畫出 10.0K 甜甜圈環線！",
    sceneryHighlights: ["Tokyo Big Sight 倒金字塔光雕", "Ariake Arena 遠眺夜景", "10K 完跑衝線：東京花園劇場廣場"],
    elevation: "平坦衝刺路段",
    surface: "現代化花崗岩鋪面廣場",
  },
];

export const DAY2_ITINERARY: ItineraryItem[] = [
  {
    id: "d2-1",
    time: "07:45–08:15",
    title: "晨起梳洗、辦理退房與行李寄存",
    location: "VIA INN PRIME 日本橋人形町",
    description: "起床整理行李箱。至 1F 智能機台辦理退房手續，並將大件行李箱免費寄放於飯店行李櫃，輕裝出門開啟下町晨遊。",
    category: "hotel",
    track: "shared",
    tips: "隨身攜帶小包裝護照、錢包與御守零錢，其餘物品均寄存於飯店。",
  },
  {
    id: "d2-2",
    time: "08:15–08:30",
    title: "晨間漫步前往小網神社",
    location: "人形町街區步道（步行約 400 公尺）",
    description: "清晨的人形町老街空氣清新寧靜，穿行在傳統日式建築與辦公林立的巷弄中，前往東京知名的強運厄除靈驗神社。",
    category: "sightseeing",
    track: "shared",
    mapsQuery: "小網神社",
    tips: "早晨 08:30 前人潮較少，是避開白天排隊人龍的最佳黃金時段！",
  },
  {
    id: "d2-3",
    time: "08:30–09:15",
    title: "小網神社：參拜、錢洗弁天與領取強運御守",
    location: "小網神社 (Koami Shrine)",
    description: "東京最強強運厄除、金運向上的代表神社。於手水舍洗手，參拜神殿，並在「洗錢井 (銭洗いの井)」以竹簍清洗硬幣帶回做為招財錢母，請領人氣強運厄除龍御守與財運御守。",
    category: "sightseeing",
    track: "shared",
    tips: "準備 5 円、50 円或 500 円日幣硬幣放入竹簍過水沖洗，放入皮夾作錢母；社務所 09:00 開賣御守。",
  },
  {
    id: "d2-4",
    time: "09:15–09:30",
    title: "步行前往 DIXANS 咖啡館",
    location: "人形町巷弄步行約 300 公尺",
    description: "自小網神社漫步前往風格雅緻的 DIXANS 人形町店，感受下町早晨從容氣息。",
    category: "transit",
    track: "shared",
    mapsQuery: "DIXANS 人形町",
  },
  {
    id: "d2-5",
    time: "09:30–10:00",
    title: "DIXANS 人形町：招牌黑糖厚片吐司與咖啡早餐",
    location: "DIXANS Ningyocho",
    description: "東京人氣烘焙咖啡館。享用烤得金黃酥脆的厚切烤土司佐黑糖黃油、精緻拉花拿鐵或單品手沖咖啡，甜鹹香濃，極致滿足。",
    category: "dining",
    track: "shared",
    tips: "厚切黑糖吐司外層焦脆、內層如雲朵般柔軟拉絲，搭配中深焙熱拿鐵堪稱絕配。",
  },
  {
    id: "d2-6",
    time: "10:00–10:15",
    title: "甘酒橫丁老街散步",
    location: "人形町甘酒橫丁 (Amazake Yokocho)",
    description: "人形町最富盛名的傳統下町商店街，兩旁林立老字號和菓子鋪、茶葉店與傳統豆腐店，感受濃郁江戶風情。",
    category: "sightseeing",
    track: "shared",
    mapsQuery: "甘酒横丁",
    tips: "街道兩旁的紅磚與燈籠十分適合拍照留念。",
  },
  {
    id: "d2-7",
    time: "10:15–10:30",
    title: "三原堂本店：採買名物鹽煎餅",
    location: "人形町三原堂本店（人形町站前交差點）",
    description: "創立於明治十年的百年名店。購買招牌「鹽煎餅 (塩せんべい)」——選用優質梗米佐以伯方鹽與白醬油烘烤，米香濃郁帶鹹香顆粒感，是絕佳送禮伴手禮。",
    category: "shopping",
    track: "shared",
    mapsQuery: "三原堂本店 人形町",
    tips: "鹽煎餅常溫保存期長達數週，輕便耐放，亦有精緻鐵盒包裝。",
  },
  {
    id: "d2-8",
    time: "10:30–11:00",
    title: "前往五代目花山烏龍麵提早候位",
    location: "五代目花山うどん 日本橋店",
    description: "自甘酒橫丁漫步約 700 公尺抵達花山烏龍麵日本橋店。該店 11:00 開門，提前 30 分鐘抵達排在第一批入場名單內。",
    category: "dining",
    track: "shared",
    mapsQuery: "五代目 花山うどん 日本橋店",
    tips: "11:00 前抵達基本能順利在第一輪入座，免去動輒 60–90 分鐘的等候時間。",
  },
  {
    id: "d2-9",
    time: "11:00–11:45",
    title: "花山烏龍麵午餐：名物鬼ひも川寬烏龍麵",
    location: "五代目花山うどん 日本橋店",
    description: "享譽日本群馬縣的傳奇百年寬烏龍麵！盛裝在可愛的信樂燒狸貓陶碗中，寬達 5 公分的「鬼ひも川」麵條晶瑩剔透、滑順彈牙，搭配濃郁芝麻醬汁或上州麥豚肉湯，一口驚艷。",
    category: "dining",
    track: "shared",
    tips: "必點「鬼御膳」或「花山御前」，能同時品嚐到冰鎮 Q 彈鬼ひも川與香脆天婦羅小丼飯。",
  },
  {
    id: "d2-10",
    time: "11:45–12:20",
    title: "搭乘地鐵前往新宿御苑",
    location: "人形町站 / 日本橋站 → 新宿三丁目 / 新宿御苑前站",
    description: "搭乘東京地鐵或都營新宿線前往新宿御苑前站，出站後步行 3 分鐘由「新宿門」進入庭園。",
    category: "transit",
    track: "shared",
    mapsQuery: "新宿御苑 新宿門",
    tips: "可使用 Suica 快速嗶進車站；秋季新宿御苑門票可於現場自動售票機購票（大人 500 日圓）。",
  },
  {
    id: "d2-11",
    time: "12:20–14:20",
    title: "新宿御苑：金黃銀杏林、池泉楓紅與日式庭園漫步",
    location: "新宿御苑 (Shinjuku Gyoen)",
    description: "11 月底正是東京秋意最濃的季節！漫步於巨木銀杏大道，腳下踩著燦爛金黃落葉毯；接續探訪日本庭園區、舊御休所周邊，火紅的雞爪槭倒映在如鏡水面上，美不勝收。",
    category: "sightseeing",
    track: "shared",
    tips: "精華拍照動線：新宿門進 → 銀杏林 (金色隧道) → 中之池 → 日本傳統庭園 (紅葉倒影) → 大木戶門散步出。",
  },
  {
    id: "d2-12",
    time: "14:20–15:10",
    title: "搭地鐵返回人形町飯店",
    location: "新宿御苑前站 → 都營線/地鐵 → 人形町",
    description: "結束賞楓行程，搭乘地鐵返抵人形町站，回到 VIA INN PRIME 飯店準備提取早晨寄存的行李。",
    category: "transit",
    track: "shared",
    tips: "時間掌握充裕，搭乘地鐵約 25–30 分鐘，輕鬆無趕場壓力。",
  },
  {
    id: "d2-13",
    time: "15:10–15:30",
    title: "飯店取行李、步行至人形町站月台",
    location: "VIA INN PRIME 人形町 → 都營淺草線人形町站",
    description: "於飯店前台領回大行李箱，稍作打包整理，步行 3 分鐘至淺草線人形町站月台等候機場直通班次。",
    category: "hotel",
    track: "shared",
    tips: "利用 A3 出口之電梯或無障礙升降設施攜帶行李箱最為省力。",
  },
  {
    id: "d2-14",
    time: "約 15:30–17:00",
    title: "搭乘 Access 特急直通班次前往成田機場",
    location: "都營淺草線人形町站 → 成田機場第一航廈",
    description: "搭乘都營淺草線直通京成 Access 特急（成田空港行），一車直達無須搬行李轉車，約 70 分鐘舒適抵達成田機場 T1。",
    category: "transit",
    track: "shared",
    tips: "列車設有大型行李放置處與清晰雙語廣播，可於車上補眠休息。",
  },
  {
    id: "d2-15",
    time: "17:00–17:30",
    title: "抵達成田機場 T1、報到託運與出境",
    location: "成田機場第一航廈 4F 出境大廳",
    description: "抵達酷航 (Scoot) 報到櫃檯辦理登機證列印、托運行李過磅，通過安檢與自動通關出境。",
    category: "flight",
    track: "shared",
    tips: "酷航櫃檯通常於起飛前 3 小時開放，17:30 前完成手續時間極其寬裕，出境後可逛免稅店採買伴手禮。",
  },
  {
    id: "d2-16",
    time: "19:45–22:55",
    title: "搭乘酷航 TR875 班機平安返台",
    location: "成田機場 T1 → 台北桃園 T1",
    description: "登機啟程返台，帶著舞台劇的感動、10K 完跑的成就感、小網神社的祝福與秋楓銀杏美好回憶滿載而歸！",
    category: "flight",
    track: "shared",
    tips: "機上預計 22:55 降落桃園第一航廈，出關領行李約 23:45。",
  },
];

export const ATTRACTIONS: Attraction[] = [
  {
    id: "attr-shinjuku",
    name: "新宿御苑",
    japaneseName: "新宿御苑（しんじゅくぎょえん）",
    category: "秋季賞楓・黃金銀杏",
    day: 2,
    highlight: "11 月下旬盛秋極致絕景！巨幅金黃銀杏林地毯 ＆ 典雅日式池泉庭園楓紅",
    description: "橫跨新宿與澀谷的國家級庭園，融合法式整形庭園、英式風景庭園與傳統日本庭園。每年 11 月下旬至 12 月初是銀杏與紅葉交織的最高峰，巨木銀杏落葉在陽光下灑成一片金光閃閃的厚地毯，池畔的雞爪槭紅艷似火，與遠方摩天大樓構成古今交織的經典東京畫卷。",
    address: "東京都新宿区内藤町11",
    tips: [
      "入園門票大人 500 日圓，可用電子支付或 IC 卡感應入場",
      "推薦由「新宿門」進入，先拍中之池與銀杏林，再前往日本庭園觀賞水面倒影",
      "園區全域禁止飲酒、全面禁菸，環境維持極為清幽雅緻",
    ],
    imageSrc: "/src/assets/images/attraction_shinjuku_gyoen_1792382036412.jpg",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shinjuku+Gyoen+National+Garden",
  },
  {
    id: "attr-odaiba-run",
    name: "台場與東京灣海岸步道",
    japaneseName: "お台場海浜公園・潮風公園",
    category: "海景夜跑・彩虹大橋地標",
    day: 1,
    highlight: "無敵開闊海灣夜景！遠眺彩虹大橋與東京鐵塔燈火，全平坦零紅綠燈跑步聖地",
    description: "東京灣岸最具代表性的臨海觀景路線。由夢之大橋出發，貫串台場海濱公園、自由女神像、潮風公園與青海碼頭。整條路線緊鄰東京灣，夜幕降臨後，彩虹大橋五彩點燈、遠方東京鐵塔與海面上穿梭的屋形船倒映在平靜海面上，海風徐徐，是全日本跑者最推崇的夜跑路線之一。",
    address: "東京都港区台場・品川区東八潮",
    tips: [
      "10K 環線全程均為專用人行步道與公園無車路段，安全性極佳",
      "沿途公廁、長椅與飲料販賣機密集，補給極為方便",
      "傍晚 16:30 日落，18:00 起跑正好處於華燈初上的藍調時刻與絕美夜景",
    ],
    imageSrc: "/src/assets/images/attraction_tokyo_bay_run_1792382036853.jpg",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Odaiba+Marine+Park",
  },
  {
    id: "attr-koami",
    name: "小網神社",
    japaneseName: "小網神社（こあみじんじゃ）",
    category: "日本橋下町・強運厄除名所",
    day: 2,
    highlight: "東京最強「強運厄除」與「銭洗弁天」！二戰東京大空襲奇蹟完好的靈驗神域",
    description: "隱身於日本橋寧靜巷弄間的神社，歷史可追溯至 1466 年。在第二次世界大戰時，攜帶該社御守出征的士兵全數平安歸鄉，且在東京大空襲中周邊全毀唯獨小網神社奇蹟安然無恙，因而被尊為東京最強「強運厄除」的神靈之所。境內「東京銭洗弁天」更吸引絡繹不絕的香客前來以神泉洗滌錢幣祈求財源廣進。",
    address: "東京都中央区日本橋小網町16-23",
    tips: [
      "早上 08:30 抵達可避開中午動輒 1 小時以上的排隊人龍",
      "將 5 円或 500 円硬幣放在竹簍中浸潤神泉洗滌，擦乾後放入皮夾作為「種錢/財母」",
      "代表性的「強運厄除龍御守」雕工精緻，是極具紀念價值的隨身守護符",
    ],
    imageSrc: "/src/assets/images/attraction_koami_shrine_1792382037606.jpg",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Koami+Shrine",
  },
  {
    id: "attr-ariake-garden",
    name: "有明花園 ＆ 東京花園劇場",
    japaneseName: "有明ガーデン / 東京ガーデンシアター",
    category: "大型複合商場・頂級劇院",
    day: 1,
    highlight: "東京灣岸最大複合購物中心，配備容納 8,000 人的國際級舞台劇殿堂",
    description: "2020 年開幕的大型綜合開發區，集結 200 間店舖的購物中心、大型無印良品旗艦店、天然溫泉「泉天空之湯」，以及全日本頂級規格的「東京花園劇場 (Tokyo Garden Theater)」。無論是大型音樂劇 SHOCK 演出，或是看劇前後的購物餐飲、跑者置物休憩，動線皆無縫整合於同一園區。",
    address: "東京都江東区有明2-1-8",
    tips: [
      "劇場 2F 入口直接連通商場戶外景觀連通道，指示清晰好找",
      "5F「牛たん炭焼 利久」為仙台知名厚切炭烤牛舌，提前至 16:20 用餐免排隊",
      "商場設有豐富置物櫃與休息沙發，完跑者可舒適等待散場會合",
    ],
    imageSrc: "/src/assets/images/hero_tokyo_autumn_1792382036175.jpg",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tokyo+Garden+Theater",
  },
  {
    id: "attr-hanayama",
    name: "五代目花山烏龍麵 日本橋店",
    japaneseName: "五代目 花山うどん 日本橋店",
    category: "百年排隊美食・群馬名物",
    day: 2,
    highlight: "明治 27 年創立！寬達 5 公分的傳奇「鬼ひも川」寬烏龍麵，連續榮獲日本烏龍麵天下一決定戰三連霸",
    description: "來自群馬縣館林市的百年老字號。鎮店之寶「鬼ひも川」擁有驚人的 5 公分寬度，薄透滑溜卻兼具不可思議的 Q 彈嚼勁。以特製的信樂燒狸貓陶碗盛裝，無論是搭配冰鎮芝麻沾醬或是熱騰騰的上州麥豚肉高湯，入口極致滑潤，風味絕倫。",
    address: "東京都中央区日本橋2-10-12",
    tips: [
      "上午 11:00 開門營業，建議 10:30 前抵達排隊爭取第一輪入座",
      "推薦「鬼御膳（花山寬麵 + 天婦羅小天丼）」雙重享受",
      "可購買生麵條伴手禮盒回家烹煮，品質維持極佳",
    ],
    imageSrc: "/src/assets/images/attraction_shinjuku_gyoen_1792382036412.jpg",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=五代目+花山うどん+日本橋店",
  },
  {
    id: "attr-dixans",
    name: "DIXANS 人形町店",
    japaneseName: "ディゾン 人形町",
    category: "精品烘焙・職人咖啡",
    day: 2,
    highlight: "神保町人氣名店進駐人形町！厚達 4 公分的夢幻黑糖黃油厚片吐司與冠軍拉花拿鐵",
    description: "結合法式烘焙甜點與現代木質工業風的質感咖啡館。招牌「黑糖厚片吐司 (Brown Sugar Toast)」將厚切生吐司表面烘烤至琥珀焦香，淋上濃郁沖繩黑糖與發酵黃油，刀叉切下外酥內軟，香氣四溢，配上一杯手沖淺焙單品，是開啟東京美好早晨的儀式感。",
    address: "東京都中央区日本橋富沢町16-5",
    tips: [
      "早晨 08:00 起營業，小網神社參拜後步行前來剛好避開外帶人潮",
      "除厚吐司外，店內特製栗子蒙布朗與布丁亦極受好評",
      "二樓提供寬敞座位區與溫暖木質採光，環境沉靜舒適",
    ],
    imageSrc: "/src/assets/images/attraction_koami_shrine_1792382037606.jpg",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=DIXANS+Ningyocho",
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
  { id: "c-run-shoes", category: "10K 跑者專屬配備", title: "公路慢跑鞋", desc: "合腳且抓地力佳之日常訓練跑鞋", defaultChecked: false },
  { id: "c-run-apparel", category: "10K 跑者專屬配備", title: "防風薄風衣 / 長袖運動排汗衣", desc: "11 月底東京灣晚上海風較大，體感約 10°C", defaultChecked: false },
  { id: "c-run-tights", category: "10K 跑者專屬配備", title: "運動緊身跑褲 / 慢跑短褲", desc: "建議透氣快乾材質", defaultChecked: false },
  { id: "c-run-watch", category: "10K 跑者專屬配備", title: "GPS 運動手錶或手機跑步臂套", desc: "記錄 10K 軌跡與配速（Garmin / Apple Watch / Strava）", defaultChecked: false },
  { id: "c-run-change", category: "10K 跑者專屬配備", title: "跑後更換之乾爽保暖衣物與毛巾", desc: "完跑後立即更換避免海風著涼", defaultChecked: false },
  { id: "c-run-flask", category: "10K 跑者專屬配備", title: "輕量隨身軟水壺 / 能量膠", desc: "隨身小腰包或收納短褲方便攜帶", defaultChecked: false },

  // 劇場看劇必備
  { id: "c-opera-glass", category: "SHOCK 舞台劇觀劇必備", title: "雙筒望遠鏡 (8–10 倍)", desc: "東京花園劇場場地廣大，觀看演員表情神情極佳利器", defaultChecked: false },
  { id: "c-theater-jacket", category: "SHOCK 舞台劇觀劇必備", title: "室內保暖針織披肩 / 輕外套", desc: "劇場空調恆溫，久坐建議備有外套", defaultChecked: false },
  { id: "c-tote-bag", category: "SHOCK 舞台劇觀劇必備", title: "折疊托特提袋 / 環保袋", desc: "盛裝官方購買之紀念場刊與周邊商品", defaultChecked: false },

  // 保暖與 3C 隨身用品
  { id: "c-warm-outer", category: "衣物穿搭與 3C 用品", title: "防風保暖大衣或輕羽絨外套", desc: "東京 11 月下旬早晚溫差大 (7–16°C)，洋蔥式穿搭必備", defaultChecked: false },
  { id: "c-scarf", category: "衣物穿搭與 3C 用品", title: "圍巾或輕便手套", desc: "早晚外出與海邊防風極為實用", defaultChecked: false },
  { id: "c-powerbank", category: "衣物穿搭與 3C 用品", title: "行動電源 (10,000mAh) 與充電線", desc: "注意！行動電源「必須放在隨身行李」，切勿託運", defaultChecked: false },
  { id: "c-esim", category: "衣物穿搭與 3C 用品", title: "日本上網 eSIM 或實體 SIM 卡", desc: "確認漫遊開通、設定好 APN", defaultChecked: false },
  { id: "c-meds", category: "衣物穿搭與 3C 用品", title: "個人常備藥品、護唇膏與眼藥水", desc: "日本秋末空氣乾燥，保濕與常備腸胃藥、止痛藥", defaultChecked: false },
];

export const WEATHER_OVERVIEW = {
  season: "2026 年 11 月底（秋末冬初）",
  daytempRange: "13°C – 16°C",
  nighttempRange: "7°C – 10°C",
  averageHumidity: "55%（乾爽舒適）",
  rainfallProbability: "15%（典型日本秋晴天，降雨機率低）",
  sunrise: "06:28",
  sunset: "16:30（16:30 天色漸暗，夜景極早降臨）",
  wind: "東京灣沿海（有明、台場）海風約 3–4 級，體感比市區低 2°C",
  foliageStatus: "銀杏見頃（最盛期 100%）、紅葉見頃（約 85%–100%）",
  clothingRecommendation: [
    "【日間走動】：薄長袖打底 + 針織衫/帽 T + 舒適休閒長褲。",
    "【早晚與海邊】：防風中長版大衣或輕量羽絨外套。日本室內與電車暖氣極強，外厚內薄最便利。",
    "【10K 夜跑】：防風薄長袖 + 跑步長褲。18:00 台場海邊起跑時氣溫約 11°C，微涼極度適合破個人最佳成績 (PB)！",
  ],
};
