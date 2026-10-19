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
  Info,
  ChevronRight,
  Ticket,
} from "lucide-react";

export const ItinerarySection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [day1Track, setDay1Track] = useState<"all" | "theater" | "runner">("all");

  const getCategoryIcon = (category: ItineraryItem["category"]) => {
    switch (category) {
      case "flight":
        return <Plane className="w-4 h-4 text-rose-500" />;
      case "transit":
        return <Train className="w-3.5 h-3.5 text-amber-500" />;
      case "hotel":
        return <Building className="w-4 h-4 text-amber-400" />;
      case "dining":
        return <UtensilsCrossed className="w-4 h-4 text-orange-400" />;
      case "shopping":
        return <ShoppingBag className="w-4 h-4 text-rose-400" />;
      case "sightseeing":
        return <Eye className="w-4 h-4 text-amber-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-rose-400" />;
    }
  };

  const getCategoryLabel = (category: ItineraryItem["category"]) => {
    switch (category) {
      case "flight":
        return "航空執飛";
      case "transit":
        return "路線接駁";
      case "hotel":
        return "宿泊入駐";
      case "dining":
        return "劇前美饌";
      case "shopping":
        return "商場巡禮";
      case "sightseeing":
        return "名所祈願";
      default:
        return "舞台活動";
    }
  };

  const currentItems =
    activeDay === 1
      ? DAY1_ITINERARY.filter((item) => {
          if (day1Track === "all") return true;
          if (item.track === "shared") return true;
          return item.track === day1Track;
        })
      : DAY2_ITINERARY;

  return (
    <section id="itinerary" className="py-16 sm:py-20 bg-[#0d0a13] text-neutral-100 border-b border-rose-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Theatrical Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 font-mono">
              <Ticket className="w-3.5 h-3.5" />
              <span>THEATRICAL ITINERARY TIMELINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              <span>每日精確行程時間表</span>
              <span className="text-sm font-medium text-rose-400/90 font-mono">
                {activeDay === 1 ? "ACT I · 有明灣岸 ＆ SHOCK" : "ACT II · 下町祈願 ＆ 金秋御苑"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
              時間緊湊而從容的 48 小時：各大行程重點醒目呈現，交通接駁輕量銜接，動線一目了然。
            </p>
          </div>

          {/* Act / Day Tabs (Segmented Control with SHOCK aesthetic) */}
          <div className="inline-flex p-1 bg-[#181222] border border-rose-900/60 rounded-xl shrink-0 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeDay === 1
                  ? "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-amber-200 border border-amber-500/50 shadow-md shadow-rose-950/80"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              第一幕 ACT I｜11/28（六）有明・SHOCK・10K
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                activeDay === 2
                  ? "bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-amber-200 border border-amber-500/50 shadow-md shadow-rose-950/80"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              第二幕 ACT II｜11/29（日）小網神社・烏龍麵・新宿御苑
            </button>
          </div>
        </div>

        {/* Day 1 Persona Perspective Filter */}
        {activeDay === 1 && (
          <div className="mb-8 p-4 bg-[#140e1d] rounded-xl border border-rose-900/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-rose-200/90">
              <span className="font-bold text-amber-300">傍晚 17:05–21:00 分軌模式：</span>
              <span>一人看劇、一人海風 10K 夜跑</span>
            </div>
            <div className="inline-flex p-1 bg-[#0b0710] border border-rose-950 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setDay1Track("all")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "all"
                    ? "bg-rose-900 text-amber-200 border border-amber-500/40 shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                完整合體行程
              </button>
              <button
                onClick={() => setDay1Track("theater")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "theater"
                    ? "bg-rose-900 text-amber-200 border border-amber-500/40 shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                🎭 看劇者視角 (SHOCK)
              </button>
              <button
                onClick={() => setDay1Track("runner")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "runner"
                    ? "bg-emerald-950 text-emerald-200 border border-emerald-500/40 shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                🏃 跑者視角 (10K 環線)
              </button>
            </div>
          </div>
        )}

        {/* Day Overview Summary Banner */}
        <div className="mb-8 p-4 sm:p-5 bg-gradient-to-r from-rose-950/40 via-[#181122] to-amber-950/30 border border-rose-900/60 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              {activeDay === 1 ? (
                <span>
                  <strong className="text-amber-300">第一幕焦點提示：</strong>搭乘酷航 TR866 降落成田後，搭乘{" "}
                  <strong className="text-white">Sky Access 直通淺草線</strong> 一車到底抵達人形町寄放行李；隨後轉乘百合海鷗號前往有明花園購物、享用「利久牛舌」提早晚餐。18:00 雙軌正式幕啟（SHOCK 舞台劇震撼視角 vs 10K 彩虹大橋無折返夜跑），21:00 於花園劇場入口準時會合返回飯店享受頂樓大浴場。
                </span>
              ) : (
                <span>
                  <strong className="text-amber-300">第二幕焦點提示：</strong>08:15 辦理退房寄放行李，晨間前往{" "}
                  <strong className="text-white">小網神社</strong> 參拜洗錢求強運，再至 <strong>DIXANS</strong> 享用黑糖厚片早餐；甘酒橫丁三原堂採購鹽煎餅後，10:30 前往{" "}
                  <strong className="text-white">五代目花山烏龍麵</strong> 提早排隊品嚐鬼ひも川寬麵。午後前往 <strong>新宿御苑</strong> 沉浸於銀杏大道與水影楓紅，15:10 回飯店取行李搭 Access 特急直達機場搭乘 TR875 返台。
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Items: Main Cards vs Compact Transit Connectors */}
        <div className="space-y-3.5">
          {currentItems.map((item, index) => {
            const isTransit = item.category === "transit";
            const isSplitActivity = item.id === "d1-10";

            // If it's a transit item, render a compact sleek connector row (NOT A GIANT BOX)
            if (isTransit) {
              return (
                <div
                  key={item.id}
                  className="relative pl-6 sm:pl-8 my-2 py-1 flex items-center group"
                >
                  {/* Subtle vertical connecting line */}
                  <div className="absolute left-2.5 sm:left-3.5 top-0 bottom-0 w-0.5 bg-neutral-800 -z-10" />

                  {/* Compact Transit Connector Bar */}
                  <div className="w-full bg-[#140e1e]/90 hover:bg-[#1a1228] border border-amber-900/40 hover:border-amber-700/60 rounded-lg px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 transition-colors shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-amber-950/80 border border-amber-600/40 flex items-center justify-center shrink-0">
                        <Train className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-amber-300 tabular-nums">
                          {item.time}
                        </span>
                        <span className="text-neutral-500" aria-hidden="true">·</span>
                        <span className="font-semibold text-white tracking-wide">
                          {item.title}
                        </span>
                        {item.transitLine && (
                          <span className="hidden lg:inline text-[11px] text-neutral-400">
                            （{item.transitLine}）
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      {item.durationMinutes && (
                        <span className="text-[11px] font-mono text-amber-400/90 font-medium">
                          約 {item.durationMinutes} 分
                        </span>
                      )}
                      {item.mapsQuery && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            item.mapsQuery
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
                        >
                          <span>導航</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Otherwise, render a Major Theatrical Event Card
            return (
              <div
                key={item.id}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Subtle vertical connector track */}
                <div className="absolute left-2.5 sm:left-3.5 top-0 bottom-0 w-0.5 bg-neutral-800 -z-10" />
                {/* Node indicator */}
                <div className="absolute left-1 sm:left-2 top-6 w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-[#0d0a13] ring-2 ring-amber-400/50 shadow-sm" />

                <div className="bg-[#150f20] rounded-xl border border-rose-950/80 hover:border-amber-500/40 p-5 sm:p-6 transition-all shadow-md hover:shadow-rose-950/50">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Time & Sequence */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-rose-400/70 tabular-nums">
                        SCENE {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-200 font-mono tabular-nums bg-[#221733] border border-amber-500/30 px-3 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Category & Track Tag */}
                    <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
                      <span className="flex items-center gap-1 text-rose-200 font-medium">
                        {getCategoryIcon(item.category)}
                        <span>{getCategoryLabel(item.category)}</span>
                      </span>
                      {item.track === "theater" && (
                        <>
                          <span aria-hidden="true" className="text-rose-500">·</span>
                          <span className="text-amber-300 font-semibold">🎭 SHOCK 劇迷動線</span>
                        </>
                      )}
                      {item.track === "runner" && (
                        <>
                          <span aria-hidden="true" className="text-rose-500">·</span>
                          <span className="text-emerald-400 font-semibold">🏃 10K 跑者動線</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main Title & Location */}
                  <div className="mt-3.5">
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                      {item.title}
                    </h3>

                    {/* Location with Google Map link */}
                    <div className="flex items-center gap-1.5 text-xs text-rose-300/80 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>{item.location}</span>
                      {item.mapsQuery && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            item.mapsQuery
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-amber-400 hover:text-amber-300 ml-1.5 font-semibold"
                        >
                          <span>開啟定位</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </div>

                    {/* Special Dual-Track Highlight for D1-10 */}
                    {isSplitActivity && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-rose-900/40">
                        <div className="p-4 bg-gradient-to-br from-rose-950/80 to-[#220d1c] rounded-xl border border-rose-700/60 text-xs">
                          <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-amber-400" />
                            <span>🎭 劇迷大軸：Endless SHOCK 舞台劇</span>
                          </div>
                          <p className="text-rose-100/90 leading-relaxed mt-1">
                            東京花園劇場（8,000人規格劇院），開演時間 18:00。震撼的高空飛越、階梯滾落與百老匯級歌舞，身歷其境體驗傳奇劇目。
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-emerald-950/80 to-[#0e2118] rounded-xl border border-emerald-700/60 text-xs">
                          <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span>🏃 跑者大軸：10K 東京灣海風夜跑</span>
                          </div>
                          <p className="text-emerald-100/90 leading-relaxed mt-1">
                            有明出發 → 夢之大橋 → 台場海濱公園 → 彩虹大橋夜景 → 潮風公園 → 青海南埠頭 → Big Sight → 回到花園劇場。完全平坦、零折返！
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tips Callout */}
                    {item.tips && (
                      <div className="mt-3 text-xs text-amber-200/90 bg-[#1f142b] rounded-lg px-3.5 py-2.5 border border-amber-500/20 flex items-start gap-2">
                        <span className="font-bold text-amber-400 shrink-0">劇場錦囊：</span>
                        <span>{item.tips}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
