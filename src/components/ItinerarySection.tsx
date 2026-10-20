import React, { useState } from "react";
import {
  DAY1_ITINERARY,
  DAY2_ITINERARY,
  ItineraryItem,
} from "../data/tripData";
import {
  Clock,
  MapPin,
  ExternalLink,
  Plane,
  Train,
  Building,
  UtensilsCrossed,
  Sparkles,
  ShoppingBag,
  Eye,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Store,
  Layers,
  Sparkle,
} from "lucide-react";
import {
  SparkleDoodle,
  ShoppingBagSticker,
  FloatingBubble,
} from "./CuteDoodles";

export const ItinerarySection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [viewMode, setViewMode] = useState<"tab" | "all">("tab"); // "tab" or "all" (Continuous 48H mode)
  const [day1Track, setDay1Track] = useState<"all" | "theater" | "runner">("all");

  const getCategoryBadge = (category: ItineraryItem["category"], itemId?: string) => {
    switch (category) {
      case "flight": {
        const isReturn = itemId?.includes("d2");
        return {
          label: isReturn ? "返台航班" : "啟程出發",
          icon: (
            <Plane
              className={`w-3.5 h-3.5 ${
                isReturn ? "rotate-90" : "rotate-0"
              }`}
            />
          ),
          style: "bg-[#fdebf1] text-[#a82a51] border-[#fad0de]",
        };
      }
      case "transit":
        return {
          label: "交通接駁",
          icon: <Train className="w-3.5 h-3.5" />,
          style: "bg-[#f3f9f6] text-[#286f4a] border-[#d7ecdf]",
        };
      case "hotel":
        return {
          label: "住宿放鬆",
          icon: <Building className="w-3.5 h-3.5" />,
          style: "bg-[#fbf2fa] text-[#78377e] border-[#f4daf0]",
        };
      case "dining":
        return {
          label: "美饌饗宴",
          icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
          style: "bg-[#fff1ed] text-[#b8451c] border-[#fcd9cc]",
        };
      case "shopping":
        return {
          label: "商場購物",
          icon: <ShoppingBag className="w-3.5 h-3.5" />,
          style: "bg-[#fdf0f4] text-[#b83358] border-[#fad4df]",
        };
      case "sightseeing":
        return {
          label: "名勝巡禮",
          icon: <Eye className="w-3.5 h-3.5" />,
          style: "bg-[#fcf0f8] text-[#9c2f78] border-[#f8d4ee]",
        };
      default:
        return {
          label: "散策活動",
          icon: <Sparkles className="w-3.5 h-3.5" />,
          style: "bg-[#fdf3f6] text-[#854556] border-[#fae0e7]",
        };
    }
  };

  const filterDay1 = (items: ItineraryItem[]) =>
    items.filter((item) => {
      if (day1Track === "all") return true;
      if (item.track === "shared") return true;
      return item.track === day1Track;
    });

  const scrollToTimelineStart = () => {
    const el = document.getElementById("timeline-cards-anchor");
    if (el) {
      const headerOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const switchToDay = (day: 1 | 2) => {
    setActiveDay(day);
    setViewMode("tab");
    setTimeout(scrollToTimelineStart, 50);
  };

  // Requirement 7: Simple clear arrow steps without long sentences
  const day1FlowSteps = [
    "桃機 TR866",
    "成田 T1",
    "Access特急直達",
    "人形町寄行李",
    "百合海鷗號",
    "有明花園購物",
    "利久牛舌晚餐",
    "分流(看劇/10K夜跑)",
    "21:00 劇場會合",
    "回飯店入住休息",
  ];

  const day2FlowSteps = [
    "退房寄行李",
    "小網神社參拜洗錢",
    "DIXANS 黑糖厚片早餐",
    "甘酒橫丁散步",
    "三原堂買鹽煎餅",
    "排隊花山寬烏龍麵",
    "地鐵直達新宿御苑",
    "賞金黃銀杏與紅葉",
    "15:10 回飯店取行李",
    "淺草線直通成田",
    "TR875 返台",
  ];

  // Store guide data for Ariake Garden (Requirement 4)
  const ariakeStores = [
    {
      name: "無印良品 東京有明 (1F–3F)",
      desc: "關東最大近 1,400 坪旗艦店，全品項生活良品、秤重零食點心與 Café&Meal 良品食堂",
      tag: "必逛旗艦",
      color: "bg-[#fdf0f3] text-[#a82a51] border-[#faccd7]",
    },
    {
      name: "AEON STYLE 大型超市 (1F)",
      desc: "生鮮熟食超市，採買當季日本草莓/蜜柑、熟食炸物壽司與伴手禮零食",
      tag: "生鮮伴手禮",
      color: "bg-[#f3f9f6] text-[#286f4a] border-[#d7ecdf]",
    },
    {
      name: "KOJIMA × Bic Camera (3F)",
      desc: "大型免稅電器專賣店，熱門美容吹風機、保溫杯與旅行 3C 配件",
      tag: "免稅電器",
      color: "bg-[#f2f7fc] text-[#1e588f] border-[#d4e4f5]",
    },
    {
      name: "ABC-MART GRAND STAGE (4F)",
      desc: "日本限定慢跑球鞋、運動服飾與專業跑步補給裝備",
      tag: "運動潮流",
      color: "bg-[#fff7ee] text-[#a05a10] border-[#fae2c5]",
    },
    {
      name: "泉天空之湯 (5F)",
      desc: "24 小時天然溫泉大浴場、露天風呂、碳酸泉與賽後休憩設施",
      tag: "天然溫泉",
      color: "bg-[#fbf4fc] text-[#743585] border-[#f3ddf7]",
    },
  ];

  const renderTimelineItem = (item: ItineraryItem) => {
    const badge = getCategoryBadge(item.category, item.id);
    const isTransit = item.category === "transit";
    const isShopping = item.id === "d1-7";
    const isReturningToHotel = item.id === "d1-13";
    const isAirportDirect = item.id === "d1-3" || item.id === "d2-14";
    const isShinjukuTransit = item.id === "d2-10" || item.id === "d2-12";

    if (isTransit) {
      return (
        <div key={item.id} className="relative pl-7 sm:pl-10 my-4 sm:my-5">
          {/* Subtle line dot */}
          <div className="absolute left-[7px] sm:left-[11px] top-3.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#b83358] shadow-2xs z-10" />

          {/* Compact Transit Card with Clear Vehicle & Line Details */}
          <div className="p-4 sm:p-4.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-[#fae1e7] shadow-2xs hover:border-[#f7c0ce] transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fdebf0] text-[#a82a51] border border-[#fad2dd]">
                  <Train className="w-3 h-3 text-[#a82a51]" />
                  <span>{item.time}</span>
                </span>
                <span className="font-bold text-xs sm:text-sm text-[#4a383d]">
                  {item.title}
                </span>
              </div>
              {item.durationMinutes && (
                <span className="text-[11px] font-medium text-[#995c6b] px-2 py-0.5 rounded-full bg-[#fff0f4]">
                  約 {item.durationMinutes} 分鐘
                </span>
              )}
            </div>

            {/* Detailed Transit Route / Line Indicator */}
            {item.transitLine && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#fff0f4] text-[#8e2946] text-xs font-semibold border border-[#fad4df]">
                <ChevronRight className="w-3.5 h-3.5 text-[#b83358]" />
                <span>{item.transitLine}</span>
              </div>
            )}

            <p className="mt-2 text-xs sm:text-[13px] text-[#6b4f57] leading-relaxed">
              {item.description}
            </p>

            {item.tips && (
              <div className="mt-2 text-[11px] sm:text-xs text-[#8e4558] bg-[#fdf2f5] px-3 py-1.5 rounded-xl border border-[#f9d7df] flex items-center gap-1.5">
                <Sparkle className="w-3 h-3 text-pink-500 shrink-0" />
                <span>搭乘提醒：{item.tips}</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Standard Activity Card (Requirement 8: No 01, 02 prefixes)
    return (
      <div key={item.id} className="relative pl-7 sm:pl-10 my-6 sm:my-8 group">
        {/* Timeline Node */}
        <div className="absolute left-[7px] sm:left-[11px] top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-[#b83358] border-2 border-white shadow-xs group-hover:scale-125 transition-transform z-10" />

        {/* Magazine Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#fad5de] shadow-[0_4px_20px_rgba(240,160,180,0.08)] hover:shadow-[0_8px_30px_rgba(240,160,180,0.14)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Pill */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs ${badge.style}`}
              >
                {badge.icon}
                <span>{badge.label}</span>
              </span>

              {/* Time Pill */}
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#fdebf0] text-[#a82a51] border border-[#fad2dd]">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.time}</span>
              </span>
            </div>

            {/* Location Pill */}
            {item.location && (
              <span className="inline-flex items-center gap-1 text-xs text-[#8c606c] font-medium max-w-xs truncate">
                <MapPin className="w-3.5 h-3.5 text-[#b83358] shrink-0" />
                <span className="truncate">{item.location}</span>
              </span>
            )}
          </div>

          {/* Activity Title (Requirement 8: No 01, 02 numeric prefix) */}
          <h3 className="text-base sm:text-lg font-bold text-[#4a383d] group-hover:text-[#a82a51] transition-colors flex items-center justify-between gap-3">
            <span>{item.title}</span>
            {item.mapsQuery && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  item.mapsQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="在 Google 地圖中開啟"
                className="shrink-0 text-[#9c6a76] hover:text-[#a82a51] p-1.5 rounded-full hover:bg-[#fff0f4] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </h3>

          {/* Activity Description */}
          <p className="mt-2 text-xs sm:text-sm text-[#664b52] leading-relaxed whitespace-pre-line">
            {item.description}
          </p>

          {/* Requirement 4: Ariake Garden Must-Visit Store Guide */}
          {isShopping && (
            <div className="mt-4 pt-4 border-t border-[#fae1e7]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#b83358] mb-3">
                <Store className="w-4 h-4" />
                <span>有明花園商場・必逛店家指南：</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ariakeStores.map((store, sIdx) => (
                  <div
                    key={sIdx}
                    className={`p-3 rounded-2xl border text-xs ${store.color} shadow-2xs hover:scale-[1.01] transition-transform`}
                  >
                    <div className="flex items-center justify-between gap-2 font-bold mb-1">
                      <span>{store.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 font-bold border border-current shrink-0">
                        {store.tag}
                      </span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed font-normal">
                      {store.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dual Perspective Box for SHOCK vs 10K */}
          {item.id === "d1-10" && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#fae1e7]">
              <div className="p-4 bg-[#fbf2fa] rounded-2xl border border-[#f4daf0] text-xs">
                <div className="font-bold text-[#78377e] mb-1.5 flex items-center justify-between gap-1.5">
                  <span>🎭 看劇者視角：堂本光一 主演《Endless SHOCK Memories》</span>
                  <a
                    href="https://www.tohostage.com/shock/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#78377e] hover:underline font-bold shrink-0"
                  >
                    <span>東宝官網</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[#69466e] leading-relaxed">
                  開演時間 18:00（17:05 開放入場），於東京花園劇場欣賞由堂本光一親自主演・構成・演出的經典神作《Endless SHOCK Memories -CONTINUE-》，見證無安全繩客席紅綢高空飛越與 25 年殿堂傳奇！
                </p>
              </div>
              <div className="p-4 bg-[#f3f9f6] rounded-2xl border border-[#d7ecdf] text-xs">
                <div className="font-bold text-[#286f4a] mb-1.5 flex items-center gap-1.5">
                  <span>🏃 跑步者視角：10K 東京灣海濱路跑</span>
                </div>
                <p className="text-[#3b664f] leading-relaxed">
                  由劇場出發 ➔ 夢之大橋 ➔ 台場海濱公園 ➔ 彩虹大橋夜景 ➔ 潮風公園 ➔ 青海南埠頭 ➔ Big Sight ➔ 回到花園劇場。
                </p>
              </div>
            </div>
          )}

          {/* 旅人筆記 */}
          {item.tips && (
            <div className="mt-3.5 text-xs text-[#73535c] bg-[#fff5f7] rounded-2xl px-4 py-2.5 border border-[#fad2dd] flex items-start gap-2.5">
              <span className="font-bold text-[#b83358] shrink-0 inline-flex items-center gap-1">
                <SparkleDoodle className="w-3 h-3 text-pink-500" />
                <span>旅人筆記</span>
              </span>
              <span className="leading-relaxed">{item.tips}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="itinerary" className="py-14 sm:py-20 bg-white border-b border-[#eee4e7] relative overflow-hidden">
      {/* Pure Frosted White Bubbles */}
      <FloatingBubble size={30} className="absolute top-10 left-[6%] hidden md:block" delay="0.5s" />
      <FloatingBubble size={20} className="absolute bottom-20 right-[5%] hidden md:block" delay="2s" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] mb-2.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>TIMELINE & SCHEDULE</span>
              <SparkleDoodle className="w-3 h-3 text-[#e0758e]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2527] tracking-tight">
              每日行程時間表
            </h2>
            <p className="text-xs sm:text-sm text-[#6e5d62] mt-1.5 max-w-xl leading-relaxed">
              節奏明媚的東京 48 小時散策手帖：各個景點活動寬裕展開，交通以輕盈的連接軸線簡約串聯。
            </p>
          </div>

          {/* Day Tabs & View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Tab or Full 48H */}
            <button
              onClick={() => setViewMode(viewMode === "tab" ? "all" : "tab")}
              className={`px-3.5 py-2 text-xs font-semibold rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
                viewMode === "all"
                  ? "bg-[#b83358] text-white border-[#b83358] shadow-xs"
                  : "bg-white text-[#833a52] border-[#faccd7] hover:bg-[#fff0f4]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{viewMode === "all" ? "切回分日標籤" : "連續全覽 (48H)"}</span>
            </button>

            {/* Day Switcher Pills (when in Tab mode) */}
            {viewMode === "tab" && (
              <div className="inline-flex p-1.5 bg-[#fce8ed] rounded-full border border-[#f7d5df] shrink-0 shadow-2xs">
                <button
                  onClick={() => switchToDay(1)}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                    activeDay === 1
                      ? "bg-white text-[#a82a51] shadow-xs"
                      : "text-[#7d5f66] hover:text-[#4a383d]"
                  }`}
                >
                  DAY 1｜11/28（六）有明・SHOCK・10K
                </button>
                <button
                  onClick={() => switchToDay(2)}
                  className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                    activeDay === 2
                      ? "bg-white text-[#a82a51] shadow-xs"
                      : "text-[#7d5f66] hover:text-[#4a383d]"
                  }`}
                >
                  DAY 2｜11/29（日）人形町・小網神社・新宿
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Anchor point for auto-scrolling when user switches days at bottom */}
        <div id="timeline-cards-anchor" />

        {/* Day 1 Persona Perspective Filter (Shown when Day 1 is active or in All view) */}
        {(activeDay === 1 || viewMode === "all") && (
          <div className="mb-8 p-5 bg-white/95 rounded-3xl border border-[#fae0e6] shadow-[0_4px_16px_rgba(240,160,180,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-[#735860]">
              <span className="font-bold text-[#a82a51] px-3 py-1 rounded-full bg-[#fdebf0] border border-[#fad2dd]">
                傍晚動線切換
              </span>
              <span>17:05–21:00 一人看劇、一人 10K 跑步</span>
            </div>
            <div className="inline-flex p-1 bg-[#fbf0f3] rounded-full text-xs font-medium border border-[#fad6e1]">
              <button
                onClick={() => setDay1Track("all")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  day1Track === "all"
                    ? "bg-white text-[#a82a51] font-bold shadow-2xs"
                    : "text-[#735860] hover:text-[#4a383d]"
                }`}
              >
                全部行程
              </button>
              <button
                onClick={() => setDay1Track("theater")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  day1Track === "theater"
                    ? "bg-white text-[#78377e] font-bold shadow-2xs"
                    : "text-[#735860] hover:text-[#4a383d]"
                }`}
              >
                看劇動線 (SHOCK)
              </button>
              <button
                onClick={() => setDay1Track("runner")}
                className={`px-3.5 py-1.5 rounded-full transition-all ${
                  day1Track === "runner"
                    ? "bg-white text-[#286f4a] font-bold shadow-2xs"
                    : "text-[#735860] hover:text-[#4a383d]"
                }`}
              >
                跑步動線 (10K 環線)
              </button>
            </div>
          </div>
        )}

        {/* Requirement 7: 散策重點 (Simple clear flow with arrows ➔, no long paragraphs) */}
        <div className="mb-10 p-5 sm:p-6 bg-[#fff2f5] border border-[#fad2dd] rounded-3xl shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#b83358]">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>
                {viewMode === "all"
                  ? "48 小時散策重點動線總覽"
                  : `DAY ${activeDay} 散策重點動線`}
              </span>
            </div>
            <span className="text-[11px] text-[#995c6b] hidden sm:inline">
              精準時程 ➔ 順遊串聯
            </span>
          </div>

          {viewMode === "all" ? (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-[#a82a51] mr-2">DAY 1：</span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                  {day1FlowSteps.map((step, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#4a383d] border border-[#f6d1db] shadow-2xs whitespace-nowrap">
                        {step}
                      </span>
                      {idx < arr.length - 1 && (
                        <span className="text-[#db527c] font-bold text-xs px-0.5">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-[#fad4df]">
                <span className="text-xs font-bold text-[#a82a51] mr-2">DAY 2：</span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                  {day2FlowSteps.map((step, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#4a383d] border border-[#f6d1db] shadow-2xs whitespace-nowrap">
                        {step}
                      </span>
                      {idx < arr.length - 1 && (
                        <span className="text-[#db527c] font-bold text-xs px-0.5">➔</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(activeDay === 1 ? day1FlowSteps : day2FlowSteps).map((step, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-[#4a383d] border border-[#f6d1db] shadow-2xs whitespace-nowrap">
                    {step}
                  </span>
                  {idx < arr.length - 1 && (
                    <span className="text-[#db527c] font-bold text-xs px-0.5">➔</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Timeline Items List */}
        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[7px] sm:left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#f8c1ce] via-[#f7d5df] to-[#f8c1ce]" />

          {viewMode === "all" ? (
            <>
              {/* Day 1 Section Marker */}
              <div className="relative pl-7 sm:pl-10 my-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#b83358] text-white text-xs font-bold shadow-xs">
                  <span>DAY 1｜11/28（六）有明購物・SHOCK 舞台劇・10K 夜跑</span>
                </div>
              </div>
              {filterDay1(DAY1_ITINERARY).map(renderTimelineItem)}

              {/* Day 2 Section Marker */}
              <div className="relative pl-7 sm:pl-10 my-10 pt-4 border-t-2 border-dashed border-[#fad4df]">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a82a51] text-white text-xs font-bold shadow-xs">
                  <span>DAY 2｜11/29（日）人形町老街・小網神社・烏龍麵・新宿賞楓</span>
                </div>
              </div>
              {DAY2_ITINERARY.map(renderTimelineItem)}
            </>
          ) : (
            activeDay === 1
              ? filterDay1(DAY1_ITINERARY).map(renderTimelineItem)
              : DAY2_ITINERARY.map(renderTimelineItem)
          )}
        </div>

        {/* Requirement 6: Smooth Day Switcher at the bottom so user never has to scroll up manually */}
        {viewMode === "tab" && (
          <div className="mt-12 p-6 sm:p-7 bg-white/95 rounded-3xl border border-[#fad4dd] shadow-[0_6px_25px_rgba(240,160,180,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold text-[#b83358] tracking-wider uppercase block">
                {activeDay === 1 ? "NEXT STEP ➔ DAY 2" : "PREVIOUS STEP ⬅ DAY 1"}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-[#4a383d] mt-0.5">
                {activeDay === 1
                  ? "已閱畢 DAY 1！直接翻閱 DAY 2 人形町與新宿賞楓行程"
                  : "已閱畢 DAY 2！隨時翻回 DAY 1 有明與夜跑行程"}
              </h4>
            </div>

            {activeDay === 1 ? (
              <button
                onClick={() => switchToDay(2)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-[#b83358] hover:bg-[#992545] rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group shrink-0"
              >
                <span>直接切換至 DAY 2 行程</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={() => switchToDay(1)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#a82a51] bg-[#fff0f4] hover:bg-[#fde2ea] border border-[#faccd7] rounded-full transition-all duration-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group shrink-0"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>翻回 DAY 1 行程</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
