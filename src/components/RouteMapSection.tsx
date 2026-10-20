import React, { useState } from "react";
import { RUNNING_SEGMENTS } from "../data/tripData";
import { downloadRoutePdf } from "../utils/generateRoutePdf";
import {
  MapPin,
  Navigation,
  Footprints,
  ExternalLink,
  CheckCircle2,
  Route,
  Download,
  FileText,
  Loader2,
  Play,
  Pause,
  Sparkles,
  Calendar,
  Compass,
  Train,
  Clock,
  Car,
} from "lucide-react";
import {
  RunningShoeSticker,
  SparkleDoodle,
  GinkgoLeafSticker,
  ShrineSticker,
  FloatingBubble,
} from "./CuteDoodles";

interface DailyStop {
  id: string;
  time: string;
  title: string;
  category: string;
  address: string;
  mapQuery: string;
  transitTips: string;
  highlights: string[];
  googleMapsUrl: string;
}

export const RouteMapSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [day1ViewMode, setDay1ViewMode] = useState<"google_map" | "running_sim">("google_map");

  // Selected stop in Day 1 and Day 2 Google Maps view
  const [selectedDay1StopIdx, setSelectedDay1StopIdx] = useState<number>(3); // Default to Ariake Garden
  const [selectedDay2StopIdx, setSelectedDay2StopIdx] = useState<number>(1); // Default to Koami Shrine

  // Running simulation state
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(18);
  const [focusSegment, setFocusSegment] = useState<"all" | "ariake_to_odaiba">("all");

  // PDF download state
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      setPdfSuccessMessage(null);
      await downloadRoutePdf();
      setPdfSuccessMessage("已為您下載「tokyo_bay_10k_running_guide.pdf」！跑步時可離線查閱。");
      setTimeout(() => setPdfSuccessMessage(null), 6000);
    } catch (err) {
      console.error("PDF download failed", err);
      setPdfSuccessMessage("PDF 生成中，請稍候重試或使用瀏覽器列印。");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Day 1 All Actual Google Map Stops
  const day1Stops: DailyStop[] = [
    {
      id: "d1-s1",
      time: "10:55–12:15",
      title: "成田國際機場 第一航廈 (NRT T1)",
      category: "入境機場",
      address: "千葉県成田市古込1-1 成田国際空港 第1ターミナル",
      mapQuery: "Narita International Airport Terminal 1",
      transitTips: "搭乘「京成成田 Sky Access 特急」直通都營淺草線班次，無需換車一車直達人形町站（約 75 分）。",
      highlights: ["入境審查與領取行李", "開通日本 eSIM 網路", "儲值 Suica / PASMO 交通卡"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Narita+Airport+Terminal+1",
    },
    {
      id: "d1-s2",
      time: "13:30–13:50",
      title: "VIA INN PRIME 日本橋人形町",
      category: "飯店寄物",
      address: "東京都中央区日本橋人形町2-24-3",
      mapQuery: "VIA INN PRIME 日本橋人形町",
      transitTips: "人形町站出站步行 3 分鐘抵達飯店；於 1F 自動寄物櫃免費寄放行李後輕裝出發。",
      highlights: ["全客房席夢思名床與加濕空氣清淨機", "自助智能行李寄物機", "都營淺草線直通樞紐"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=VIA+INN+PRIME+Nihonbashi+Ningyocho",
    },
    {
      id: "d1-s3",
      time: "13:50–14:40",
      title: "新橋站 ➔ 百合海鷗號 有明站",
      category: "高架鐵道",
      address: "東京都港区新橋2丁目 / 東京都江東区有明3丁目",
      mapQuery: "有明駅 百合かもめ",
      transitTips: "由人形町搭淺草線 7 分鐘至新橋，轉乘百合海鷗號高架電車（約 25 分鐘）跨越彩虹大橋抵達有明站。",
      highlights: ["百合海鷗號高架無人駕駛電車", "眺望東京灣與彩虹大橋絕景", "有明站天橋直通商場"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ariake+Station+Yurikamome",
    },
    {
      id: "d1-s4",
      time: "14:40–16:20",
      title: "有明花園 ＆ 東京花園劇場",
      category: "商場購物",
      address: "東京都江東区有明2-1-8",
      mapQuery: "有明ガーデン",
      transitTips: "有明站出站步行 4 分鐘即抵。劇場入場動線位於商場 2F 連通道旁，標示清晰好找。",
      highlights: ["無印良品全關東最大近 1,400 坪旗艦店", "AEON STYLE 大型生鮮超市", "8,000 人座席東京花園劇場 (SHOCK 演出地)"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ariake+Garden",
    },
    {
      id: "d1-s5",
      time: "16:20–17:05",
      title: "牛たん炭焼 利久 有明花園店",
      category: "炭烤美饌",
      address: "東京都江東区有明2-1-8 有明ガーデン 5F",
      mapQuery: "牛たん炭焼 利久 有明ガーデン店",
      transitTips: "位於有明花園 5F 美食街餐廳區，建議 16:20 提前入座避開尖峰人潮。",
      highlights: ["仙台炭烤厚切牛舌極定食", "香酥多汁牛舌佐麥飯、山藥泥與牛尾湯", "為看劇與 10K 夜跑補足充足體力"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=牛たん炭焼+利久+有明ガーデン店",
    },
    {
      id: "d1-s6",
      time: "18:00–19:20",
      title: "東京灣岸 10K 跑步路線 (有明 ➔ 台場 ➔ 青海 ➔ 有明)",
      category: "10K 夜跑",
      address: "東京都港区台場1丁目 お台場海浜公園 周邊",
      mapQuery: "お台場海浜公園",
      transitTips: "由東京花園劇場出發，橫越夢之大橋，順時針環跑台場海濱、彩虹大橋海岸、潮風公園、青海南埠頭回劇場，全平坦零折返。",
      highlights: ["夢之大橋幾何燈柱大道", "台場海濱公園遠眺彩虹大橋夜景", "DiverCity 獨角獸鋼彈巨像", "Tokyo Big Sight 倒金字塔地標"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Odaiba+Marine+Park",
    },
    {
      id: "d1-s7",
      time: "21:00 後",
      title: "返回飯店：有明 ➔ 新橋 ➔ 人形町",
      category: "夜間返程",
      address: "東京都中央区日本橋人形町2-24-3",
      mapQuery: "VIA INN PRIME 日本橋人形町",
      transitTips: "自有明花園步行 4 分鐘至「有明站」，搭百合海鷗號至「新橋站」（25 分），轉乘都營淺草線至「人形町站」（7 分），A3 出口步行 3 分鐘回飯店。",
      highlights: ["21:00 劇場大廳順利會合", "平穩電車返程免塞車", "回飯店安頓入住與客房充分休息"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=VIA+INN+PRIME+Nihonbashi+Ningyocho",
    },
  ];

  // Day 2 All Actual Google Map Stops
  const day2Stops: DailyStop[] = [
    {
      id: "d2-s1",
      time: "07:45–08:15",
      title: "VIA INN PRIME 日本橋人形町 (起點)",
      category: "退房寄物",
      address: "東京都中央区日本橋人形町2-24-3",
      mapQuery: "VIA INN PRIME 日本橋人形町",
      transitTips: "08:15 前辦理退房，隨身攜帶貴重物品與零錢，大件行李免費寄存於飯店行李櫃。",
      highlights: ["退房後免費寄放行李至返程", "步行 400m 直達小網神社", "早晨人形町下町老街清幽宜人"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=VIA+INN+PRIME+Nihonbashi+Ningyocho",
    },
    {
      id: "d2-s2",
      time: "08:30–09:15",
      title: "小網神社 (Koami Shrine)",
      category: "名剎參拜",
      address: "東京都中央区日本橋小網町16-23",
      mapQuery: "小網神社",
      transitTips: "自飯店步行約 400 公尺（約 5 分鐘）。建議 09:00 開門前抵達以避開排隊人潮。",
      highlights: ["東京第一強運厄除、金運向上代表神社", "「洗錢之井」清洗日幣硬幣作為招財錢母", "請領人氣強運厄除龍御守與生肖福籤"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=小網神社",
    },
    {
      id: "d2-s3",
      time: "09:30–10:00",
      title: "DIXANS 人形町店 (DIXANS Ningyocho)",
      category: "職人早餐",
      address: "東京都中央区日本橋富沢町16-5",
      mapQuery: "DIXANS 人形町",
      transitTips: "從小網神社步行約 300 公尺（約 4 分鐘），坐落於寧靜的紅磚巷弄中。",
      highlights: ["炭烤厚切黑糖黃油吐司外酥內軟拉絲", "經典天鵝與鬱金香拿鐵拉花熱咖啡", "日系文青工業復古空間"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=DIXANS+人形町",
    },
    {
      id: "d2-s4",
      time: "10:00–10:30",
      title: "甘酒橫丁 ＆ 三原堂本店",
      category: "老街散步",
      address: "東京都中央区日本橋人形町1-14-10 (三原堂本店)",
      mapQuery: "三原堂本店 人形町",
      transitTips: "沿人形町通與甘酒橫丁漫步，三原堂本店位於人形町站前大十字路口旁。",
      highlights: ["人形町江戶下町懷舊傳統商店街", "明治十年創立百年名店「三原堂」", "招牌「鹽煎餅」選用伯方鹽與優質梗米，鹹香酥脆伴手禮"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=三原堂本店+人形町",
    },
    {
      id: "d2-s5",
      time: "10:30–11:45",
      title: "五代目花山烏龍麵 日本橋店",
      category: "百年排隊寬麵",
      address: "東京都中央区日本橋2-10-1",
      mapQuery: "五代目 花山うどん 日本橋店",
      transitTips: "自甘酒橫丁步行約 700 公尺（約 9 分鐘）。10:30 前往排隊，順利在 11:00 第一輪開門入座。",
      highlights: ["寬達 5 公分群馬縣名物「鬼ひも川」寬烏龍麵", "可愛信樂燒狸貓陶碗盛裝", "推薦「鬼御膳」搭配酥脆海老天婦羅小丼飯"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=五代目+花山うどん+日本橋店",
    },
    {
      id: "d2-s6",
      time: "11:45–12:20",
      title: "地鐵直達：日本橋 ➔ 赤坂見附 ➔ 新宿御苑前",
      category: "極致無縫轉乘",
      address: "東京都新宿区新宿1丁目 新宿御苑前駅",
      mapQuery: "新宿御苑前駅",
      transitTips: "花山烏龍麵步行 2 分至日本橋站搭銀座線至赤坂見附站，同月台走 5 步轉丸之內線直達新宿御苑前站 1 號出口。",
      highlights: ["銀座線與丸之內線平面同月台 0 階梯轉乘", "全程僅約 20 分鐘車程", "出站步行 3 分鐘直抵新宿御苑新宿門"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=新宿御苑前駅",
    },
    {
      id: "d2-s7",
      time: "12:20–14:20",
      title: "新宿御苑 (Shinjuku Gyoen National Garden)",
      category: "秋日賞楓勝地",
      address: "東京都新宿区内藤町11",
      mapQuery: "新宿御苑",
      transitTips: "新宿門進 ➔ 銀杏林金色大道 ➔ 中之池日本庭園 ➔ 大木戶門出園。",
      highlights: ["巨木百株金黃銀杏林，腳下鋪滿金黃落葉地毯", "中之池朱紅楓香與雞爪槭倒映水面", "東京秋末最浪漫的皇家園林景致"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=新宿御苑",
    },
    {
      id: "d2-s8",
      time: "14:20–17:30",
      title: "回飯店取行李 ➔ 成田機場 T1 出境",
      category: "機場直通返台",
      address: "千葉県成田市古込1-1 成田空港 第1ターミナル",
      mapQuery: "成田空港第1ターミナル",
      transitTips: "新宿御苑前站搭丸之內線轉淺草線回飯店取行李，人形町站 15:30 搭直通 Access 特急（約 70 分）直抵成田 T1。",
      highlights: ["淺草線一車直達機場無須搬行李換車", "17:30 前完成酷航 TR875 報到托運手續", "出境後免稅店採買日本甜點伴手禮"],
      googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=成田空港第1ターミナル",
    },
  ];

  const currentStops = activeDay === 1 ? day1Stops : day2Stops;
  const currentStop =
    activeDay === 1
      ? day1Stops[selectedDay1StopIdx] || day1Stops[0]
      : day2Stops[selectedDay2StopIdx] || day2Stops[0];

  // Full 10K Loop Path
  const full10kPathD =
    "M 740,190 L 570,220 L 420,230 L 340,190 L 260,130 L 230,210 L 210,310 L 240,390 L 310,460 L 430,440 L 620,360 L 710,280 Z";

  const ariakeToOdaibaPathD =
    "M 740,190 L 570,220 L 420,230 L 340,190 L 260,130";

  const currentSimPathD = focusSegment === "ariake_to_odaiba" ? ariakeToOdaibaPathD : full10kPathD;

  const routeWaypoints = [
    { id: 0, name: "起點：東京花園劇場", km: "0.0K", x: 740, y: 190, stage: 0 },
    { id: 1, name: "夢之大橋 (Dream Bridge)", km: "1.2K", x: 570, y: 220, stage: 0 },
    { id: 2, name: "DiverCity (獨角獸鋼彈)", km: "2.0K", x: 420, y: 230, stage: 0 },
    { id: 3, name: "台場海濱公園入口", km: "2.5K", x: 340, y: 190, stage: 1 },
    { id: 4, name: "彩虹大橋展望步道 (第三台場)", km: "3.5K", x: 260, y: 130, stage: 1 },
    { id: 5, name: "自由女神像海濱台", km: "4.5K", x: 230, y: 210, stage: 2 },
    { id: 6, name: "潮風公園 (海之廣場)", km: "5.5K", x: 210, y: 310, stage: 2 },
    { id: 7, name: "船之科學館周邊", km: "6.5K", x: 240, y: 390, stage: 3 },
    { id: 8, name: "青海南埠頭公園", km: "7.2K", x: 310, y: 460, stage: 3 },
    { id: 9, name: "Telecom Center (電信中心)", km: "8.2K", x: 430, y: 440, stage: 4 },
    { id: 10, name: "東京 Big Sight (國際展示場)", km: "9.1K", x: 620, y: 360, stage: 4 },
    { id: 11, name: "有明外圍綠意步道", km: "9.6K", x: 710, y: 280, stage: 4 },
    { id: 12, name: "終點：東京花園劇場 (10K)", km: "10.0K", x: 740, y: 190, stage: 4 },
  ];

  const selectedSegment = RUNNING_SEGMENTS[selectedSegmentIdx];

  // Multi-stop directions URL for Day 1
  const day1FullRouteUrl =
    "https://www.google.com/maps/dir/Narita+Airport+Terminal+1/VIA+INN+PRIME+Nihonbashi+Ningyocho/Ariake+Station/Ariake+Garden/Odaiba+Marine+Park/VIA+INN+PRIME+Nihonbashi+Ningyocho";

  // Multi-stop directions URL for Day 2
  const day2FullRouteUrl =
    "https://www.google.com/maps/dir/VIA+INN+PRIME+Nihonbashi+Ningyocho/Koami+Shrine/DIXANS+Ningyocho/Hanayama+Udon+Nihonbashi/Shinjuku+Gyoen+National+Garden/VIA+INN+PRIME+Nihonbashi+Ningyocho/Narita+Airport+Terminal+1";

  return (
    <section id="routes" className="py-14 sm:py-20 bg-[#faf8f6] border-b border-[#eee4e7] relative overflow-hidden">
      {/* Pure Frosted White Bubbles */}
      <FloatingBubble size={30} className="absolute top-10 right-[8%] hidden md:block" delay="1s" />
      <FloatingBubble size={18} className="absolute bottom-20 left-[5%] hidden md:block" delay="2.5s" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] mb-2.5">
              <Route className="w-3.5 h-3.5 text-[#992545]" />
              <span>NAVIGATION & MAPS JOURNAL</span>
              <SparkleDoodle className="w-3 h-3 text-[#e0758e]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2527] tracking-tight">
              每日路線導航圖 ＆ 實景 Google Maps
            </h2>
            <p className="text-xs sm:text-sm text-[#6e5d62] mt-1.5 max-w-2xl leading-relaxed font-normal">
              每日所有行程景點均配備即時 Google Maps 定位導航；Day 1 特別支援 10K 海岸跑線 SVG 虛擬動態模擬軌跡與離線 PDF 下載。
            </p>
          </div>

          {/* Action Row: Day Selector Tabs */}
          <div className="inline-flex p-1 bg-white rounded-full border border-[#ebd8dc] shadow-2xs self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                activeDay === 1
                  ? "bg-[#992545] text-white shadow-xs"
                  : "text-[#6e5d62] hover:text-[#2d2527]"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>DAY 1｜有明・SHOCK・10K 夜跑</span>
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                activeDay === 2
                  ? "bg-[#992545] text-white shadow-xs"
                  : "text-[#6e5d62] hover:text-[#2d2527]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>DAY 2｜人形町・小網神社・新宿賞楓</span>
            </button>
          </div>
        </div>

        {/* Sub-header Controls for Day 1 */}
        {activeDay === 1 && (
          <div className="mb-6 p-4 bg-white rounded-2xl border border-[#ebd8dc] shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#8e2443] px-2.5 py-1 rounded-full bg-[#fdf2f4] border border-[#f3d9de]">
                DAY 1 地圖檢視模式
              </span>
              <div className="inline-flex p-0.5 bg-[#f6edef] rounded-full text-xs font-medium border border-[#ebd8dc]">
                <button
                  onClick={() => setDay1ViewMode("google_map")}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                    day1ViewMode === "google_map"
                      ? "bg-white text-[#992545] font-bold shadow-2xs"
                      : "text-[#6e5d62] hover:text-[#2d2527]"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>各景點 Google Maps 實景導航</span>
                </button>
                <button
                  onClick={() => setDay1ViewMode("running_sim")}
                  className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                    day1ViewMode === "running_sim"
                      ? "bg-white text-[#992545] font-bold shadow-2xs"
                      : "text-[#6e5d62] hover:text-[#2d2527]"
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5 text-[#992545]" />
                  <span>10K 跑步動態模擬軌跡</span>
                </button>
              </div>
            </div>

            {/* Offline PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#8e2443] bg-[#fdf2f4] hover:bg-[#fae4e8] border border-[#f3d9de] rounded-full transition-all"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>下載 10K 路線離線 PDF</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* PDF Download Toast Notification */}
        {pdfSuccessMessage && (
          <div className="mb-6 p-4 bg-[#fdf2f4] border border-[#f3d9de] rounded-2xl flex items-center justify-between text-xs sm:text-sm text-[#8e2443]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#992545] shrink-0" />
              <span>{pdfSuccessMessage}</span>
            </div>
            <button
              onClick={() => setPdfSuccessMessage(null)}
              className="text-xs text-[#992545] hover:underline font-bold ml-4"
            >
              好，我知道了
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* CASE A: DAY 1 - RUNNING SIMULATION VIEW                        */}
        {/* ============================================================== */}
        {activeDay === 1 && day1ViewMode === "running_sim" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Interactive Map with SVG Animated Runner Path (7 cols) */}
              <div className="lg:col-span-7 bg-[#231e22] text-white rounded-3xl p-5 sm:p-6 border border-[#3d3238] shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <RunningShoeSticker className="w-6 h-6" />
                    <span className="text-sm font-bold tracking-wide text-pink-100">
                      東京灣 10K 虛擬跑步動態軌跡模擬
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setFocusSegment(focusSegment === "all" ? "ariake_to_odaiba" : "all")
                      }
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all ${
                        focusSegment === "ariake_to_odaiba"
                          ? "bg-[#e11d48] text-white border-pink-400 font-bold"
                          : "bg-white/10 text-stone-300 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      {focusSegment === "ariake_to_odaiba" ? "★ 有明➔台場段" : "高亮 有明➔台場"}
                    </button>
                    <span className="text-xs text-pink-200/70 font-mono hidden sm:inline">
                      10.0 KM 全環線
                    </span>
                  </div>
                </div>

                {/* SVG Visual Route Map with Animated Runner Dot */}
                <div className="relative w-full aspect-[16/10] bg-[#171418] rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center">
                  <svg
                    viewBox="0 0 900 520"
                    className="w-full h-full select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <pattern id="gridDay1" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2d252b" strokeWidth="0.5" />
                      </pattern>
                      <linearGradient id="bayWaterDay1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1b2333" />
                        <stop offset="100%" stopColor="#121824" />
                      </linearGradient>
                      <linearGradient id="runnerGlowDay1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>

                    {/* Water Area (Tokyo Bay) */}
                    <path
                      d="M 50,50 L 300,50 Q 200,180 180,300 Q 160,400 120,480 L 50,480 Z"
                      fill="url(#bayWaterDay1)"
                      opacity="0.85"
                    />
                    <text x="100" y="240" fill="#67e8f9" opacity="0.45" fontSize="14" fontWeight="600">
                      東京灣 (Tokyo Bay)
                    </text>

                    {/* Landmark: Rainbow Bridge Indicator */}
                    <path
                      d="M 80,120 Q 170,125 260,130"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray="6 4"
                      fill="none"
                    />
                    <text x="90" y="105" fill="#fbbf24" fontSize="12" fontWeight="600">
                      彩虹大橋 Rainbow Bridge
                    </text>

                    {/* Base Grid */}
                    <rect width="900" height="520" fill="url(#gridDay1)" />

                    {/* Background Track Line */}
                    <path
                      d={full10kPathD}
                      fill="none"
                      stroke="#3a2f38"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Virtual Runner Track Path */}
                    <path
                      id="virtualRunnerTrackSim"
                      d={currentSimPathD}
                      fill="none"
                      stroke="url(#runnerGlowDay1)"
                      strokeWidth="6"
                      strokeDasharray="12 8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-track-pulse"
                      opacity="0.9"
                    />

                    {/* Animated Runner Dot Moving Slowly Along Track */}
                    {isSimulating && (
                      <g>
                        <circle r="16" fill="#f43f5e" opacity="0.3">
                          <animateMotion
                            dur={`${simSpeed}s`}
                            repeatCount="indefinite"
                            rotate="auto"
                          >
                            <mpath href="#virtualRunnerTrackSim" />
                          </animateMotion>
                        </circle>
                        <circle r="10" fill="#fb7185" opacity="0.7">
                          <animateMotion
                            dur={`${simSpeed}s`}
                            repeatCount="indefinite"
                            rotate="auto"
                          >
                            <mpath href="#virtualRunnerTrackSim" />
                          </animateMotion>
                        </circle>
                        <circle r="6" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5">
                          <animateMotion
                            dur={`${simSpeed}s`}
                            repeatCount="indefinite"
                            rotate="auto"
                          >
                            <mpath href="#virtualRunnerTrackSim" />
                          </animateMotion>
                        </circle>
                        <g>
                          <animateMotion
                            dur={`${simSpeed}s`}
                            repeatCount="indefinite"
                            rotate="auto"
                          >
                            <mpath href="#virtualRunnerTrackSim" />
                          </animateMotion>
                          <rect
                            x="-38"
                            y="-36"
                            width="76"
                            height="22"
                            rx="11"
                            fill="#881337"
                            stroke="#f43f5e"
                            strokeWidth="1.2"
                            opacity="0.95"
                          />
                          <text
                            x="0"
                            y="-22"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            🏃 跑者前進中
                          </text>
                        </g>
                      </g>
                    )}

                    {/* Waypoint Nodes */}
                    {routeWaypoints.map((wp) => {
                      const isStartEnd = wp.id === 0 || wp.id === 12;
                      const isCurrentStage = wp.stage === selectedSegmentIdx;

                      return (
                        <g
                          key={wp.id}
                          className="cursor-pointer"
                          onClick={() => setSelectedSegmentIdx(wp.stage)}
                        >
                          <circle
                            cx={wp.x}
                            cy={wp.y}
                            r={isStartEnd ? 8 : isCurrentStage ? 7 : 5}
                            fill={isStartEnd ? "#f43f5e" : isCurrentStage ? "#fb7185" : "#94a3b8"}
                            stroke="#171418"
                            strokeWidth="2"
                          />
                          {(isStartEnd ||
                            isCurrentStage ||
                            wp.id === 2 ||
                            wp.id === 4 ||
                            wp.id === 7 ||
                            wp.id === 10) && (
                            <text
                              x={wp.x}
                              y={wp.y - 12}
                              textAnchor="middle"
                              fill={isStartEnd ? "#fecdd3" : isCurrentStage ? "#fda4af" : "#e2e8f0"}
                              fontSize="11"
                              fontWeight={isCurrentStage ? "700" : "500"}
                            >
                              {wp.name} ({wp.km})
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Simulation Control Bar */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsSimulating(!isSimulating)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-pink-200 font-medium transition-all"
                    >
                      {isSimulating ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>暫停模擬</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-pink-300" />
                          <span>播放模擬</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                      <span className="text-[10px] text-stone-400 px-1.5">速度：</span>
                      <button
                        onClick={() => setSimSpeed(26)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          simSpeed === 26 ? "bg-[#e11d48] text-white" : "text-stone-300 hover:text-white"
                        }`}
                      >
                        慢速
                      </button>
                      <button
                        onClick={() => setSimSpeed(18)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          simSpeed === 18 ? "bg-[#e11d48] text-white" : "text-stone-300 hover:text-white"
                        }`}
                      >
                        標準
                      </button>
                      <button
                        onClick={() => setSimSpeed(10)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          simSpeed === 10 ? "bg-[#e11d48] text-white" : "text-stone-300 hover:text-white"
                        }`}
                      >
                        快速
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] text-pink-200/80">
                    點擊下方路段可即時切換五大航段解說
                  </span>
                </div>
              </div>

              {/* Right Column: Stage Details Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Stage Selector */}
                <div className="grid grid-cols-5 gap-1 bg-white p-1.5 rounded-2xl border border-[#ebd8dc]">
                  {RUNNING_SEGMENTS.map((seg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSegmentIdx(idx)}
                      className={`py-2 px-1 text-center rounded-xl transition-all ${
                        selectedSegmentIdx === idx
                          ? "bg-[#992545] text-white font-bold shadow-xs"
                          : "text-[#6e5d62] hover:text-[#2d2527]"
                      }`}
                    >
                      <div className="text-[10px] opacity-80 font-medium">區段</div>
                      <div className="text-xs font-semibold">{seg.distance.split(" ")[2]}</div>
                    </button>
                  ))}
                </div>

                {/* Detailed Stage Card */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ebd8dc] shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de]">
                      {selectedSegment.distance}
                    </span>
                    <span className="text-xs text-[#8c7b80] font-medium">
                      5 大路段拆解
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#2d2527] mt-1.5">
                    {selectedSegment.title}
                  </h3>

                  <div className="mt-2.5 flex items-center gap-2 text-xs text-[#5d5054] font-medium">
                    <span className="px-2 py-0.5 rounded-full bg-[#fcf4f5] text-[#8e2443] font-semibold">起點</span>
                    <span className="truncate">{selectedSegment.from}</span>
                    <span className="text-[#992545]">➔</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#fcf4f5] text-[#8e2443] font-semibold">終點</span>
                    <span className="truncate">{selectedSegment.to}</span>
                  </div>

                  <p className="mt-3 text-xs sm:text-[13px] text-[#5d5054] leading-relaxed bg-[#fbf8f6] p-3 rounded-2xl border border-[#eee4e7]">
                    {selectedSegment.routeDescription}
                  </p>

                  <div className="mt-3.5 space-y-1.5">
                    <div className="text-xs font-bold text-[#2d2527]">沿途景觀亮點：</div>
                    {selectedSegment.sceneryHighlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#5d5054]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#992545] shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#eee4e7] grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#8c7b80] block">坡度起伏</span>
                      <span className="font-semibold text-[#2d2527]">{selectedSegment.elevation}</span>
                    </div>
                    <div>
                      <span className="text-[#8c7b80] block">地面材質</span>
                      <span className="font-semibold text-[#2d2527]">{selectedSegment.surface}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* CASE B: REAL GOOGLE MAPS INTERACTIVE VIEW (DAY 1 or DAY 2)      */
          /* ============================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Real Embedded Google Map (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebd8dc] shadow-2xs">
                {/* Header above map */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#fdf2f4] border border-[#f3d9de] flex items-center justify-center text-[#992545]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2d2527] block">
                        {currentStop.title}
                      </span>
                      <span className="text-[11px] text-[#786b6f]">
                        {currentStop.address}
                      </span>
                    </div>
                  </div>

                  <a
                    href={currentStop.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#992545] hover:bg-[#7e1c36] transition-all shrink-0 self-start sm:self-auto shadow-2xs"
                  >
                    <span>在 Google 地圖導航</span>
                    <ExternalLink className="w-3 h-3 text-pink-200" />
                  </a>
                </div>

                {/* Real Interactive Google Maps Iframe */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden border border-[#eee4e7] bg-[#f2ede9]">
                  <iframe
                    title={`Google Map - ${currentStop.title}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      currentStop.mapQuery
                    )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  />
                </div>

                {/* Bottom Route Summary Bar */}
                <div className="mt-3.5 pt-3 border-t border-[#eee4e7] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#5d5054]">
                    <Train className="w-3.5 h-3.5 text-[#992545]" />
                    <span className="font-medium">{currentStop.transitTips}</span>
                  </div>

                  <a
                    href={activeDay === 1 ? day1FullRouteUrl : day2FullRouteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#8e2443] hover:underline flex items-center gap-1"
                  >
                    <span>規劃今日完整多站路線</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Stop Detail Card for Current Point */}
              <div className="bg-white rounded-3xl p-5 border border-[#ebd8dc] shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de]">
                    {currentStop.category} · {currentStop.time}
                  </span>
                  <span className="text-xs font-mono text-[#8c7b80]">
                    實景定位點
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2d2527]">
                  {currentStop.title}
                </h3>

                <div className="mt-3 space-y-1.5">
                  <div className="text-xs font-bold text-[#2d2527]">此站重點與實用指引：</div>
                  {currentStop.highlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-[#5d5054]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#992545] shrink-0 mt-0.5" />
                      <span className="leading-snug">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Stop List for Current Day (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#8e2443] uppercase tracking-wider">
                  {activeDay === 1 ? "DAY 1 全日導航站點" : "DAY 2 全日導航站點"}
                </span>
                <span className="text-xs text-[#8c7b80]">
                  點擊切換左側地圖
                </span>
              </div>

              <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                {currentStops.map((stop, sIdx) => {
                  const isSelected =
                    activeDay === 1
                      ? selectedDay1StopIdx === sIdx
                      : selectedDay2StopIdx === sIdx;

                  return (
                    <div
                      key={stop.id}
                      onClick={() => {
                        if (activeDay === 1) setSelectedDay1StopIdx(sIdx);
                        else setSelectedDay2StopIdx(sIdx);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left flex items-start gap-3 select-none ${
                        isSelected
                          ? "bg-white border-[#992545] shadow-xs ring-2 ring-[#f6d2da]"
                          : "bg-white/80 border-[#ebd8dc] hover:bg-white text-[#5d5054]"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono ${
                          isSelected
                            ? "bg-[#992545] text-white"
                            : "bg-[#f4ecef] text-[#6e5d62]"
                        }`}
                      >
                        {sIdx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? "text-[#992545]" : "text-[#2d2527]"
                            }`}
                          >
                            {stop.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#8c7b80] shrink-0">
                            {stop.time.split("–")[0]}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#786b6f] truncate mt-0.5">
                          {stop.address}
                        </div>

                        <div className="mt-1 text-[11px] text-[#8e2443] font-medium flex items-center gap-1">
                          <span className="px-1.5 py-0.2 rounded-md bg-[#fdf2f4] border border-[#f3d9de] text-[10px]">
                            {stop.category}
                          </span>
                          <span className="truncate">{stop.transitTips}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Multi-point Full Navigation Link */}
              <a
                href={activeDay === 1 ? day1FullRouteUrl : day2FullRouteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-[#8e2443] bg-white hover:bg-[#fcf4f5] rounded-full transition-all border border-[#ebd8dc] shadow-2xs hover:-translate-y-0.5"
              >
                <Compass className="w-4 h-4 text-[#992545]" />
                <span>開啟 {activeDay === 1 ? "DAY 1" : "DAY 2"} 完整 Google Maps 串聯導航</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#992545]" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
