import React, { useState } from "react";
import { RUNNING_SEGMENTS } from "../data/tripData";
import {
  MapPin,
  Navigation,
  Compass,
  Footprints,
  ExternalLink,
  Info,
  CheckCircle2,
  Route,
} from "lucide-react";

export const RouteMapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"day1_run" | "day2_walk">("day1_run");
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number>(0);

  const selectedSegment = RUNNING_SEGMENTS[selectedSegmentIdx];

  // Coordinates for interactive SVG route visualization of Tokyo Bay 10K Loop
  // Box represents: West (Odaiba/Tokyo Bay) ~ East (Ariake Garden), North (Rainbow Bridge/Marine Park) ~ South (Telecom Center / Aomi)
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

  return (
    <section id="routes" className="py-16 sm:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Interactive Route & Navigation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              每日路線導航圖 ＆ 10K 跑步解析
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              Day 1 東京灣岸 10 公里零折返環狀路線完整拆解，以及 Day 2 人形町散步與新宿御苑賞楓導覽。
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-neutral-100 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("day1_run")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "day1_run"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Footprints className="w-4 h-4 text-emerald-600" />
              <span>Day 1｜東京灣岸 10K 夜跑環線</span>
            </button>
            <button
              onClick={() => setActiveTab("day2_walk")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "day2_walk"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Navigation className="w-4 h-4 text-amber-600" />
              <span>Day 2｜日本橋老街 ＆ 新宿御苑</span>
            </button>
          </div>
        </div>

        {activeTab === "day1_run" ? (
          <div className="space-y-8">
            {/* 10K Running Route Interactive SVG & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Visual Map (7 cols) */}
              <div className="lg:col-span-7 bg-neutral-900 text-white rounded-2xl p-4 sm:p-6 border border-neutral-800 shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold tracking-wide">
                      東京灣 10K 環狀航跡示意圖
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    有明 → 台場 → 潮風 → 青海 → 有明
                  </span>
                </div>

                {/* SVG Visual Route Map */}
                <div className="relative w-full aspect-[16/10] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
                  <svg
                    viewBox="0 0 900 520"
                    className="w-full h-full select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background grid & bay water area */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="0.5" />
                      </pattern>
                      <linearGradient id="bayWater" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#0c1e33" />
                        <stop offset="100%" stopColor="#071321" />
                      </linearGradient>
                    </defs>

                    {/* Water Area (Tokyo Bay) */}
                    <path
                      d="M 50,50 L 300,50 Q 200,180 180,300 Q 160,400 120,480 L 50,480 Z"
                      fill="url(#bayWater)"
                      opacity="0.8"
                    />
                    <text x="100" y="240" fill="#38bdf8" opacity="0.4" fontSize="14" fontWeight="600">
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
                    <text x="90" y="105" fill="#f59e0b" fontSize="12" fontWeight="600">
                      彩虹大橋 Rainbow Bridge
                    </text>

                    {/* Base Grid */}
                    <rect width="900" height="520" fill="url(#grid)" />

                    {/* Route Background Stroke */}
                    <path
                      d="M 740,190 L 570,220 L 420,230 L 340,190 L 260,130 L 230,210 L 210,310 L 240,390 L 310,460 L 430,440 L 620,360 L 710,280 Z"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Highlighted Segments */}
                    {/* Stage 0: 0-2.5k */}
                    <path
                      d="M 740,190 L 570,220 L 420,230 L 340,190"
                      fill="none"
                      stroke={selectedSegmentIdx === 0 ? "#10b981" : "#059669"}
                      strokeWidth={selectedSegmentIdx === 0 ? 8 : 4}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Stage 1: 2.5-4.5k */}
                    <path
                      d="M 340,190 L 260,130 L 230,210"
                      fill="none"
                      stroke={selectedSegmentIdx === 1 ? "#10b981" : "#0284c7"}
                      strokeWidth={selectedSegmentIdx === 1 ? 8 : 4}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Stage 2: 4.5-6.5k */}
                    <path
                      d="M 230,210 L 210,310 L 240,390"
                      fill="none"
                      stroke={selectedSegmentIdx === 2 ? "#10b981" : "#6366f1"}
                      strokeWidth={selectedSegmentIdx === 2 ? 8 : 4}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Stage 3: 6.5-8.2k */}
                    <path
                      d="M 240,390 L 310,460 L 430,440"
                      fill="none"
                      stroke={selectedSegmentIdx === 3 ? "#10b981" : "#f59e0b"}
                      strokeWidth={selectedSegmentIdx === 3 ? 8 : 4}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Stage 4: 8.2-10k */}
                    <path
                      d="M 430,440 L 620,360 L 710,280 L 740,190"
                      fill="none"
                      stroke={selectedSegmentIdx === 4 ? "#10b981" : "#ec4899"}
                      strokeWidth={selectedSegmentIdx === 4 ? 8 : 4}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />

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
                            fill={isStartEnd ? "#ef4444" : isCurrentStage ? "#10b981" : "#94a3b8"}
                            stroke="#0f172a"
                            strokeWidth="2"
                          />
                          {/* Label on key points */}
                          {(isStartEnd || isCurrentStage || wp.id === 2 || wp.id === 4 || wp.id === 7 || wp.id === 10) && (
                            <text
                              x={wp.x}
                              y={wp.y - 12}
                              textAnchor="middle"
                              fill="#f8fafc"
                              fontSize="11"
                              fontWeight="600"
                              className="pointer-events-none drop-shadow"
                            >
                              {wp.name} ({wp.km})
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Map Control Help & Google Map Link */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-neutral-400" />
                    <span>點擊右側分段切換高亮路線。全段皆為平坦專用人行步道。</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/dir/Tokyo+Garden+Theater/DiverCity+Tokyo+Plaza/Odaiba+Marine+Park/Shiokaze+Park/Telecom+Center+Station/Tokyo+Big+Sight/Tokyo+Garden+Theater"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    <span>在 Google 地圖開啟 10K 路線</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Right Column: 5 Stage Selectors & Selected Stage Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    分段解析（五階段零折返）
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    總長度 10.0 KM
                  </span>
                </div>

                {/* Stage Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  {RUNNING_SEGMENTS.map((seg, idx) => {
                    const isSelected = selectedSegmentIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedSegmentIdx(idx)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-emerald-50/70 border-emerald-400 shadow-xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {seg.distance}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">
                            階段 0{idx + 1}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-neutral-900 mt-2">
                          {seg.title}
                        </div>
                        <div className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                          <span>{seg.from}</span>
                          <span className="text-neutral-300">→</span>
                          <span>{seg.to}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Spec of Selected Segment */}
                <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    目前選取路段詳情
                  </div>
                  <h4 className="text-base font-bold text-neutral-900 mt-1">
                    {selectedSegment.distance}：{selectedSegment.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-700 mt-2 leading-relaxed">
                    {selectedSegment.routeDescription}
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-200 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-400 block">坡度與海拔</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedSegment.elevation}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block">路面狀況</span>
                      <span className="font-semibold text-neutral-800">
                        {selectedSegment.surface}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs text-neutral-400 block mb-1">沿途景致看點</span>
                    <ul className="space-y-1">
                      {selectedSegment.sceneryHighlights.map((hl, i) => (
                        <li key={i} className="text-xs text-neutral-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Runner Logistics Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-white rounded-xl border border-neutral-200">
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>起終點置物與更衣</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  有明花園商場 2F 與 5F 均設有自動投幣寄物櫃；商場內洗手間乾淨寬敞可供跑前更衣；完跑後亦可至 5F「泉天空之湯」自費沐浴泡湯。
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200">
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <Compass className="w-4 h-4 text-emerald-600" />
                  <span>補給與洗手間配置</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  台場海濱公園（約 3K）、潮風公園（約 5.5K）、青海南埠頭（約 7K）皆設有免費乾淨公廁與自動販賣機，無需背負過多補給品。
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-neutral-200">
                <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                  <Navigation className="w-4 h-4 text-emerald-600" />
                  <span>會合時間估算</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  18:00 起跑，以平均 5:45/km 配速估算約 58 分鐘完賽；預留 20 分鐘擦乾更衣，約 19:20 回到有明花園逛街休息，21:00 準時於劇場外會合。
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Day 2 Walking Route & Navigation */
          <div className="space-y-6">
            <div className="p-5 bg-amber-50/60 border border-amber-200 rounded-xl">
              <div className="text-sm font-bold text-amber-950 flex items-center gap-2">
                <span>Day 2 動線：日本橋人形町晨間漫步圈 ＋ 新宿御苑賞楓線</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed">
                全日在市中心移動，利用都營淺草線、日比谷線與新宿線進行無縫接駁。清晨徒步人形町下町安靜舒適，午後沉浸在新宿御苑廣達 58 公頃的秋色庭園中。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Ningyocho Walking Loop */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    晨間徒步迴圈（約 1.8 公里）
                  </span>
                  <a
                    href="https://www.google.com/maps/dir/VIA+INN+PRIME+Nihonbashi+Ningyocho/Koami+Shrine/DIXANS+Ningyocho/Amazake+Yokocho/Hanayama+Udon+Nihonbashi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Google 步行導航</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="mt-4 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        VIA INN PRIME 人形町飯店（起點）
                      </div>
                      <div className="text-xs text-neutral-500">08:15 出發，步行約 400 公尺</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        小網神社（08:30–09:15 參拜、洗錢）
                      </div>
                      <div className="text-xs text-neutral-500">日本橋強運厄除、洗錢弁天神泉，祈求整年好運</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        DIXANS 人形町店（09:30–10:00 早餐）
                      </div>
                      <div className="text-xs text-neutral-500">步行 300 公尺，享用招牌黑糖厚片吐司佐職人拿鐵</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      4
                    </span>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        甘酒橫丁 ＆ 三原堂本店（10:00–10:30）
                      </div>
                      <div className="text-xs text-neutral-500">老街散步、採購百年傳承名物「鹽煎餅」</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      5
                    </span>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        五代目花山烏龍麵 日本橋店（10:30 排隊、11:00 用餐）
                      </div>
                      <div className="text-xs text-neutral-500">漫步 700 公尺抵達，品嚐群馬 5 公分「鬼ひも川」寬烏龍麵</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Transit to Shinjuku Gyoen & Airport return */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                      新宿御苑賞楓 ＆ 機場接駁線
                    </span>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Shinjuku+Gyoen+National+Garden"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>新宿御苑地圖</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="p-3 bg-neutral-50 rounded-lg text-xs">
                      <div className="font-bold text-neutral-900 mb-1">
                        午間地鐵轉乘（約 30 分鐘）：
                      </div>
                      <p className="text-neutral-600">
                        於人形町站搭乘都營淺草線至「東銀座」轉日比谷線或由日本橋搭銀座線至赤坂見附轉丸之內線抵達「新宿御苑前站」或「新宿三丁目站」，由新宿門入園。
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-lg text-xs">
                      <div className="font-bold text-neutral-900 mb-1">
                        新宿御苑秋日精華散步動線（約 2 小時）：
                      </div>
                      <p className="text-neutral-600">
                        新宿門入園 → 巨木銀杏林（金黃地毯）→ 舊御休所 → 中之池 → 日本傳統庭園（池泉楓紅倒影）→ 大木戶門或新宿門離開。
                      </p>
                    </div>

                    <div className="p-3 bg-neutral-50 rounded-lg text-xs">
                      <div className="font-bold text-neutral-900 mb-1">
                        回飯店取行李 ＆ 直通機場（約 70 分鐘）：
                      </div>
                      <p className="text-neutral-600">
                        15:10 回到 VIA INN PRIME 人形町提領寄存行李，15:30 於人形町站搭乘「都營淺草線直通京成 Access 特急」，一車直達無換車抵達成田機場 T1。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                  回程建議於 17:30 前抵達成田第一航廈酷航櫃檯完成報到手續。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
