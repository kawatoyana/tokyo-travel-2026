import React, { useState } from "react";
import { RUNNING_SEGMENTS } from "../data/tripData";
import { downloadRoutePdf } from "../utils/generateRoutePdf";
import {
  MapPin,
  Navigation,
  Footprints,
  ExternalLink,
  Info,
  CheckCircle2,
  Route,
  Download,
  FileText,
  Clock,
  Sparkles,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export const RouteMapSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"day1_run" | "day2_walk">("day1_run");
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number>(0);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  const selectedSegment = RUNNING_SEGMENTS[selectedSegmentIdx];

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      setPdfSuccessMessage(null);
      await downloadRoutePdf();
      setPdfSuccessMessage("已成功下載「tokyo_bay_10k_running_guide.pdf」！可供跑步時離線查閱。");
      setTimeout(() => setPdfSuccessMessage(null), 6000);
    } catch (err) {
      console.error("PDF download failed", err);
      setPdfSuccessMessage("PDF 生成中，請稍候重試或直接使用瀏覽器列印。");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

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
    <section id="routes" className="py-16 sm:py-20 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 mb-2">
              <Route className="w-3.5 h-3.5 text-emerald-700" />
              <span>Interactive Navigation & Maps</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              每日路線導航圖 ＆ 10K 跑步解析
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
              Day 1 東京灣岸 10 公里零折返環狀路線五階段拆解，提供即時互動航跡圖與離線 PDF 指南；以及 Day 2 人形町散步與新宿御苑賞楓導覽。
            </p>
          </div>

          {/* Action Row: Mode Switcher & OFFLINE PDF BUTTON */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>正在生成離線 PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>下載 10K 路線離線 PDF</span>
                </>
              )}
            </button>

            {/* Mode Switcher */}
            <div className="inline-flex p-1 bg-stone-100 rounded-2xl shrink-0">
              <button
                onClick={() => setActiveTab("day1_run")}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  activeTab === "day1_run"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Day 1｜10K 夜跑環線</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("day2_walk")}
                className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  activeTab === "day2_walk"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-600" />
                  <span>Day 2｜日本橋與新宿</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* PDF Download Toast Notification */}
        {pdfSuccessMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-emerald-900 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pdfSuccessMessage}</span>
            </div>
            <button
              onClick={() => setPdfSuccessMessage(null)}
              className="text-xs text-emerald-700 hover:underline font-semibold ml-4"
            >
              關閉
            </button>
          </div>
        )}

        {activeTab === "day1_run" ? (
          <div className="space-y-8">
            {/* 10K Running Route Interactive SVG & Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Visual Map (7 cols) */}
              <div className="lg:col-span-7 bg-stone-900 text-white rounded-3xl p-5 sm:p-6 border border-stone-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold tracking-wide">
                      東京灣 10K 環狀航跡示意圖
                    </span>
                  </div>
                  <span className="text-xs text-stone-300 font-mono">
                    有明 → 台場 → 潮風 → 青海 → 有明
                  </span>
                </div>

                {/* SVG Visual Route Map */}
                <div className="relative w-full aspect-[16/10] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center">
                  <svg
                    viewBox="0 0 900 520"
                    className="w-full h-full select-none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
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
                          {(isStartEnd || isCurrentStage || wp.id === 2 || wp.id === 4 || wp.id === 7 || wp.id === 10) && (
                            <text
                              x={wp.x}
                              y={wp.y - 12}
                              textAnchor="middle"
                              fill={isStartEnd ? "#fca5a5" : isCurrentStage ? "#6ee7b7" : "#e2e8f0"}
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

                <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
                  <span>點選航跡分段或地標圓點可切換右側解析</span>
                  <span className="text-emerald-400 font-medium">綠色粗線代表當前檢視區段</span>
                </div>
              </div>

              {/* Right Column: Stage Details Card (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Stage Selector Buttons */}
                <div className="grid grid-cols-5 gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200">
                  {RUNNING_SEGMENTS.map((seg, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSegmentIdx(idx)}
                      className={`py-2 px-1 text-center rounded-xl transition-all ${
                        selectedSegmentIdx === idx
                          ? "bg-white text-stone-900 font-bold shadow-xs border border-stone-200/80"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      <div className="text-[10px] text-stone-400 font-mono">段 0{idx + 1}</div>
                      <div className="text-xs font-semibold">{seg.distance.split(" ")[2]}</div>
                    </button>
                  ))}
                </div>

                {/* Detailed Stage Card */}
                <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {selectedSegment.distance}
                    </span>
                    <span className="text-xs text-stone-400">
                      階段 0{selectedSegmentIdx + 1} / 05
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 mt-2">
                    {selectedSegment.title}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">起點</span>
                    <span className="truncate">{selectedSegment.from}</span>
                    <span>→</span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">終點</span>
                    <span className="truncate">{selectedSegment.to}</span>
                  </div>

                  {/* Route prose */}
                  <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/60">
                    {selectedSegment.routeDescription}
                  </p>

                  {/* Highlights list */}
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-bold text-stone-800">沿途景觀亮點：</div>
                    {selectedSegment.sceneryHighlights.map((hl, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 block">坡度起伏</span>
                      <span className="font-semibold text-stone-800">{selectedSegment.elevation}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">地面材質</span>
                      <span className="font-semibold text-stone-800">{selectedSegment.surface}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action: Open in Google Maps */}
                <a
                  href="https://www.google.com/maps/dir/Tokyo+Garden+Theater/Odaiba+Marine+Park/Shiokaze+Park/Telecom+Center+Building/Tokyo+Big+Sight/Tokyo+Garden+Theater"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4 text-emerald-700" />
                  <span>在 Google 地圖中開啟 10K 路線導航</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>

            {/* Offline Running Sheet Quick Card */}
            <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      10K 跑步路線圖離線 PDF 文件
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl leading-relaxed">
                      包含全平坦無折返 5 大航段路面指引、公廁與補給水龍頭位置、彩虹大橋觀景點標記，以及日本當地緊急救護聯絡專線。下載後存於手機相簿或檔案庫，無需網路隨時開啟查閱。
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold text-stone-950 bg-emerald-400 hover:bg-emerald-300 disabled:bg-emerald-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap shrink-0"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                      <span>匯出中...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-stone-950" />
                      <span>立即下載離線 PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Day 2 Walking Route Guide */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>上午散策路線 ｜ 人形町・日本橋</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                下町神社參拜、咖啡與百年排隊烏龍麵
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                由 VIA INN 人形町輕裝出發，全路段以步行串聯，步調愜意：
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900">飯店 → 小網神社 (400m)</span>
                    <p className="text-stone-500 mt-0.5">清晨漫步寧靜巷弄，08:30 參拜洗錢求強運。</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900">小網神社 → DIXANS 人形町 (300m)</span>
                    <p className="text-stone-500 mt-0.5">享用黑糖厚片吐司早餐與精緻拉花咖啡。</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900">甘酒橫丁 ＆ 三原堂本店 (200m)</span>
                    <p className="text-stone-500 mt-0.5">漫步傳統老街，採買招牌鹽煎餅伴手禮。</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-stone-900">步行至五代目花山烏龍麵 (700m)</span>
                    <p className="text-stone-500 mt-0.5">10:30 前往提早排隊候位，享用 5 公分鬼ひも川寬烏龍麵。</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-rose-700" />
                <span>午後秋景動線 ｜ 新宿御苑</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                金黃銀杏林地毯 ＆ 日式池泉楓紅散策
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                自花山烏龍麵搭地鐵約 30 分鐘抵達新宿御苑前站，建議拍照路線：
              </p>

              <div className="mt-5 space-y-3">
                <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200/60 text-xs">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <span>入口：新宿門進入（自動售票機 500 日圓）</span>
                  </div>
                  <p className="text-rose-900/80 mt-1 leading-relaxed">
                    入園後直行前往大坪草坪西側的百年銀杏巨木群，11 月底金黃落葉鋪滿草地，陽光灑落如金黃地毯。
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/60 text-xs">
                  <div className="font-bold text-amber-950">
                    景點：中之池 ＆ 舊御涼亭（台灣閣）
                  </div>
                  <p className="text-amber-900/80 mt-1 leading-relaxed">
                    池畔雞爪槭與水杉呈現紅、橙、黃漸層倒影，閩南風格的傳統木造涼亭倒映在水面，是經典攝影點。
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs">
                  <div className="font-bold text-stone-900">
                    出口：大木戶門出園 → 新宿御苑前站搭車
                  </div>
                  <p className="text-stone-600 mt-1 leading-relaxed">
                    14:20 前準備出園，搭乘丸之內線經赤坂見附轉淺草線返回人形町，15:10 抵達飯店取行李時間充裕。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
