import React, { useState } from "react";
import {
  X,
  MapPin,
  ExternalLink,
  Download,
  Footprints,
  Compass,
  Sparkles,
  Droplets,
  Layers,
  ChevronRight,
  Shield,
  Clock,
  Navigation,
  CheckCircle2,
} from "lucide-react";
import { RUNNING_SEGMENTS } from "../data/tripData";
import { downloadRoutePdf } from "../utils/generateRoutePdf";

interface RunningRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunningRouteModal: React.FC<RunningRouteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"map" | "stages" | "google">("map");
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(0);
  const [hoveredKm, setHoveredKm] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadRoutePdf();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloading(false);
    }
  };

  // 10K landmarks on the circuit
  const landmarks = [
    { km: 0, label: "起點：東京花園劇場", desc: "商場連通廣場，熱身與寄物處", x: 740, y: 320, type: "start" },
    { km: 1.5, label: "夢之大橋", desc: "寬 60m 幾何燈柱大道，無車輛干擾", x: 620, y: 350, type: "bridge" },
    { km: 3.2, label: "台場海濱公園", desc: "天然沙灘與木棧道，遠眺彩虹大橋", x: 420, y: 340, type: "view" },
    { km: 4.5, label: "自由女神 ＆ 彩虹大橋", desc: "夜間東京灣第一夜景打卡點", x: 340, y: 430, type: "photo" },
    { km: 6.0, label: "潮風公園", desc: "平坦綠意步道，公廁與飲水台齊全", x: 370, y: 550, type: "water" },
    { km: 7.8, label: "青海南埠頭", desc: "臨海港灣開闊海風，沿線路燈明亮", x: 480, y: 680, type: "port" },
    { km: 9.0, label: "Tokyo Big Sight", desc: "國際展示場倒金字塔前開闊通道", x: 680, y: 520, type: "landmark" },
    { km: 10.0, label: "終點：回到花園劇場", desc: "順時針完整大環線，無折返賽後會合", x: 740, y: 335, type: "finish" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#ebd8dc] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#fff4f6] via-white to-[#faf8f6] border-b border-[#eee4e7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#992545] text-white flex items-center justify-center shadow-xs">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#992545] uppercase tracking-wider font-mono">
                  TOKYO BAY 10K NIGHT RUN
                </span>
                <span className="text-[10px] bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] px-2 py-0.5 rounded-full font-semibold">
                  離線地圖・無折返環線
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#2d2527]">
                東京灣岸 10K 臨海夜跑・互動路線地圖
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6edef] hover:bg-[#ebd8dc] text-[#5d5054] flex items-center justify-center transition-all cursor-pointer"
            aria-label="關閉視窗"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Pill Strip */}
        <div className="bg-[#fff9fa] border-b border-[#fae1e7] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono font-bold text-[#4a383d]">
            <span className="flex items-center gap-1 text-[#992545]">
              <Navigation className="w-3.5 h-3.5" />
              <span>總長度 10.05 KM</span>
            </span>
            <span className="text-[#fad4df] hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-[#286f4a]">
              <Clock className="w-3.5 h-3.5" />
              <span>建議配速 5&apos;45&quot;–6&apos;30&quot;</span>
            </span>
            <span className="text-[#fad4df] hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-[#78377e]">
              <Layers className="w-3.5 h-3.5" />
              <span>爬升 +18M (全程平坦)</span>
            </span>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#fff0f4] text-[#8e2443] border border-[#fad4df] rounded-full text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3 h-3 text-[#992545]" />
            <span>{isDownloading ? "生成中..." : "下載離線 PDF 指南"}</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-[#eee4e7] bg-white flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("map")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "map"
                ? "bg-[#992545] text-white shadow-xs"
                : "bg-[#fbf4f6] text-[#735860] hover:text-[#2d2527]"
            }`}
          >
            🗺️ 10K 繪製路線地圖
          </button>
          <button
            onClick={() => setActiveTab("stages")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "stages"
                ? "bg-[#992545] text-white shadow-xs"
                : "bg-[#fbf4f6] text-[#735860] hover:text-[#2d2527]"
            }`}
          >
            📍 6 大路段指引卡片
          </button>
          <button
            onClick={() => setActiveTab("google")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "google"
                ? "bg-[#992545] text-white shadow-xs"
                : "bg-[#fbf4f6] text-[#735860] hover:text-[#2d2527]"
            }`}
          >
            🧭 Google Maps 即時導航
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 pb-12">
          {activeTab === "map" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#735860]">
                <span>
                  點擊地圖上的站點標記可查看該段跑步注意事項與路面實況：
                </span>
                <span className="font-mono text-[#992545] font-bold hidden sm:inline">
                  順時針無折返環線 (Clockwise Circuit)
                </span>
              </div>

              {/* Vector SVG Map Container with traced route */}
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-[#f2ede7] rounded-3xl overflow-hidden border border-[#ebd8dc] shadow-inner select-none">
                <svg
                  viewBox="0 0 960 760"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="bayWaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#dbeff6" />
                      <stop offset="100%" stopColor="#c5e4ef" />
                    </linearGradient>

                    <linearGradient id="runningRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d93b68" />
                      <stop offset="50%" stopColor="#b83358" />
                      <stop offset="100%" stopColor="#871b38" />
                    </linearGradient>

                    <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#b83358" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Water Body (Tokyo Bay) */}
                  <rect width="960" height="760" fill="url(#bayWaterGrad)" />

                  {/* Subtle water wave lines */}
                  <path d="M 120 180 Q 200 170 280 180 T 440 180" stroke="#b2dbeb" strokeWidth="2" fill="none" opacity="0.6" />
                  <path d="M 160 260 Q 240 250 320 260 T 480 260" stroke="#b2dbeb" strokeWidth="2" fill="none" opacity="0.6" />
                  <path d="M 220 480 Q 300 470 380 480 T 540 480" stroke="#b2dbeb" strokeWidth="2" fill="none" opacity="0.6" />

                  {/* Landmass: Odaiba (Left) */}
                  <path
                    d="M 240 240 L 460 240 Q 480 320 450 440 L 420 540 L 320 580 L 250 500 Q 220 380 240 240 Z"
                    fill="#fcfaf8"
                    stroke="#decbc7"
                    strokeWidth="3"
                  />
                  <text x="310" y="275" fill="#a48c90" fontSize="13" fontWeight="bold" letterSpacing="1">
                    お台場 ODAIBA
                  </text>

                  {/* Landmass: Aomi (Bottom Left) */}
                  <path
                    d="M 320 590 L 440 550 L 580 620 L 560 720 L 360 730 L 300 680 Z"
                    fill="#faf6f3"
                    stroke="#decbc7"
                    strokeWidth="3"
                  />
                  <text x="420" y="660" fill="#a48c90" fontSize="13" fontWeight="bold" letterSpacing="1">
                    青海 AOMI
                  </text>

                  {/* Landmass: Ariake (Right) */}
                  <path
                    d="M 580 180 L 900 180 L 920 620 L 680 640 L 620 520 L 640 380 Q 600 280 580 180 Z"
                    fill="#fcfaf8"
                    stroke="#decbc7"
                    strokeWidth="3"
                  />
                  <text x="750" y="230" fill="#a48c90" fontSize="13" fontWeight="bold" letterSpacing="1">
                    有明 ARIAKE
                  </text>

                  {/* Bridges */}
                  {/* Rainbow Bridge (Top Left towards Shibaura) */}
                  <line x1="260" y1="280" x2="100" y2="140" stroke="#b3c2cb" strokeWidth="8" strokeDasharray="6,4" />
                  <text x="110" y="190" fill="#5a7180" fontSize="11" fontWeight="bold" transform="rotate(40 110 190)">
                    彩虹大橋 Rainbow Bridge
                  </text>

                  {/* Dream Bridge (夢の大橋) */}
                  <line x1="450" y1="350" x2="630" y2="350" stroke="#d5b9be" strokeWidth="12" />
                  <text x="500" y="342" fill="#8e2443" fontSize="11" fontWeight="bold">
                    夢之大橋 (寬60m步道)
                  </text>

                  {/* ============================================================== */}
                  {/* THE 10K RUNNING ROUTE LINE (Traced & Highlighted in Crimson)   */}
                  {/* ============================================================== */}
                  <path
                    d="M 740 320
                       L 630 350
                       L 450 350
                       L 420 340
                       L 340 430
                       L 370 550
                       L 480 680
                       L 550 630
                       L 680 520
                       L 740 335 Z"
                    fill="none"
                    stroke="url(#runningRouteGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#routeGlow)"
                  />

                  {/* Directional Flow Arrows on the line */}
                  <polygon points="540,346 530,342 530,350" fill="#fff" />
                  <polygon points="370,390 366,380 376,384" fill="#fff" />
                  <polygon points="345,490 350,500 340,500" fill="#fff" />
                  <polygon points="420,620 415,628 425,628" fill="#fff" />
                  <polygon points="620,570 626,562 626,572" fill="#fff" />
                  <polygon points="730,410 726,400 736,402" fill="#fff" />

                  {/* Landmark Points & Kilometer Badges */}
                  {landmarks.map((lm, idx) => {
                    const isSelected = selectedStageIdx === idx;
                    const isHovered = hoveredKm === lm.km;

                    return (
                      <g
                        key={idx}
                        className="cursor-pointer transition-transform"
                        onClick={() => setSelectedStageIdx(idx)}
                        onMouseEnter={() => setHoveredKm(lm.km)}
                        onMouseLeave={() => setHoveredKm(null)}
                      >
                        {/* Outer Pulse Ring if selected */}
                        {isSelected && (
                          <circle
                            cx={lm.x}
                            cy={lm.y}
                            r="18"
                            fill="none"
                            stroke="#b83358"
                            strokeWidth="2"
                            strokeDasharray="3,3"
                            opacity="0.8"
                          />
                        )}

                        {/* Node Bubble */}
                        <circle
                          cx={lm.x}
                          cy={lm.y}
                          r={isSelected || isHovered ? "11" : "8"}
                          fill={lm.type === "start" || lm.type === "finish" ? "#b83358" : "#fff"}
                          stroke="#b83358"
                          strokeWidth="3"
                        />

                        {/* Kilometer Tag Box */}
                        <rect
                          x={lm.x - 30}
                          y={lm.y - 32}
                          width="60"
                          height="18"
                          rx="9"
                          fill={isSelected ? "#992545" : "#fff"}
                          stroke="#fad4df"
                          strokeWidth="1.5"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                        />
                        <text
                          x={lm.x}
                          y={lm.y - 20}
                          textAnchor="middle"
                          fill={isSelected ? "#fff" : "#8e2443"}
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          {lm.km === 0 ? "START" : `${lm.km} KM`}
                        </text>

                        {/* Label underneath */}
                        <text
                          x={lm.x}
                          y={lm.y + 24}
                          textAnchor="middle"
                          fill="#332528"
                          fontSize="11"
                          fontWeight="bold"
                          stroke="#fff"
                          strokeWidth="3"
                          paintOrder="stroke"
                        >
                          {lm.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Selected Landmark Highlight Detail Box */}
              <div className="p-4 bg-[#fff6f8] rounded-2xl border border-[#faccd7] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#992545] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                    {landmarks[selectedStageIdx].km}K
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2d2527] flex items-center gap-2">
                      <span>{landmarks[selectedStageIdx].label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#992545] border border-[#f3d9de]">
                        第 {selectedStageIdx + 1} 檢核點
                      </span>
                    </div>
                    <div className="text-xs text-[#6e5d62] mt-0.5">
                      {landmarks[selectedStageIdx].desc}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("stages")}
                  className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fff0f4] text-[#992545] text-xs font-bold border border-[#f3d9de] shadow-2xs shrink-0 cursor-pointer"
                >
                  查看路段指引 ➔
                </button>
              </div>
            </div>
          )}

          {activeTab === "stages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#735860]">
                <span>東京灣 10K 完整 6 大跑步階段詳細路況與安全注意事項：</span>
                <span className="font-mono text-[#992545] font-bold">全程夜間均有路燈</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RUNNING_SEGMENTS.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#fff9fa] rounded-2xl border border-[#fad4df] shadow-2xs hover:border-[#b83358] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#992545] text-white">
                          階段 0{idx + 1} · {seg.distance}
                        </span>
                        <span className="text-[11px] font-mono text-[#8c7b80] font-bold">
                          {seg.surface}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-[#2d2527] mt-1">
                        {seg.title}
                      </h4>

                      <p className="text-xs text-[#5d5054] mt-2 leading-relaxed">
                        {seg.routeDescription}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-[#f7d5df] flex items-center justify-between text-[11px] text-[#735860]">
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        <span>補給：{idx === 2 || idx === 3 ? "潮風公園飲水機" : "自動販賣機"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#286f4a]" />
                        <span>照明：良好安全</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "google" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-[#6e5d62]">
                  可在 Google 地圖中開啟今日 10K 完整 GPS 導航路徑：
                </span>
                <a
                  href="https://www.google.com/maps/dir/Tokyo+Garden+Theater/Dream+Bridge/Odaiba+Marine+Park/Shiokaze+Park/Tokyo+Big+Sight/Tokyo+Garden+Theater"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#992545] hover:bg-[#7e1c36] transition-all shrink-0 self-start sm:self-auto shadow-2xs"
                >
                  <span>開啟 Google 地圖導航</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-[#ebd8dc] bg-[#f2ede9]">
                <iframe
                  title="Google Maps Tokyo Bay Running Route"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=Odaiba+Marine+Park+Tokyo&t=&z=14&ie=UTF8&iwloc=&output=embed"
                />
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#fae0e6] text-xs text-[#5d5054] space-y-1.5">
                <div className="font-bold text-[#2d2527]">即時導航說明：</div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#992545] shrink-0 mt-0.5" />
                  <span>起點與終點皆為「東京花園劇場」，無折返直線環繞，跑步時無需停下等待紅綠燈。</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#992545] shrink-0 mt-0.5" />
                  <span>沿線經台場海濱公園與潮風公園，夜間海面波光粼粼，彩虹大橋點燈極美。</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#faf8f6] border-t border-[#eee4e7] flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="text-[11px] text-[#8c7b80] hidden sm:block">
            跑步建議裝備：防風薄外套、魔術頭巾、手機運動臂套、輕量跑鞋
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#992545] text-white font-bold hover:bg-[#7e1c36] transition-all cursor-pointer shadow-xs ml-auto"
          >
            關閉路線指南
          </button>
        </div>
      </div>
    </div>
  );
};
