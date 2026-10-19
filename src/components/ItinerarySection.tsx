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
} from "lucide-react";

export const ItinerarySection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [day1Track, setDay1Track] = useState<"all" | "theater" | "runner">("all");

  const getCategoryIcon = (category: ItineraryItem["category"]) => {
    switch (category) {
      case "flight":
        return <Plane className="w-4 h-4 text-sky-600" />;
      case "transit":
        return <Train className="w-3.5 h-3.5 text-emerald-600" />;
      case "hotel":
        return <Building className="w-4 h-4 text-indigo-600" />;
      case "dining":
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case "shopping":
        return <ShoppingBag className="w-4 h-4 text-rose-600" />;
      case "sightseeing":
        return <Eye className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const getCategoryLabel = (category: ItineraryItem["category"]) => {
    switch (category) {
      case "flight":
        return "航班";
      case "transit":
        return "交通轉乘";
      case "hotel":
        return "飯店";
      case "dining":
        return "餐飲美食";
      case "shopping":
        return "商場購物";
      case "sightseeing":
        return "景點參訪";
      default:
        return "行程活動";
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
    <section id="itinerary" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Daily Schedule
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              每日行程時間表
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              時間緊湊充實的 48 小時：各大行程重點清晰呈現，交通接駁以輕量連接線簡潔標示。
            </p>
          </div>

          {/* Day Tabs (Segmented Control) */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeDay === 1
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              DAY 1｜11/28（六）有明購物、SHOCK 舞台劇與 10K 跑步
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeDay === 2
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              DAY 2｜11/29（日）人形町早餐、小網神社、烏龍麵、賞楓賞銀杏
            </button>
          </div>
        </div>

        {/* Day 1 Persona Perspective Filter */}
        {activeDay === 1 && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">傍晚 17:05–21:00 動線切換：</span>
              <span>一人看劇、一人 10K 跑步</span>
            </div>
            <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setDay1Track("all")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "all"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                全部行程
              </button>
              <button
                onClick={() => setDay1Track("theater")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "theater"
                    ? "bg-white text-indigo-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                看劇者動線 (SHOCK)
              </button>
              <button
                onClick={() => setDay1Track("runner")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "runner"
                    ? "bg-white text-emerald-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                跑步者動線 (10K 環線)
              </button>
            </div>
          </div>
        )}

        {/* Day Overview Summary Banner */}
        <div className="mb-6 p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {activeDay === 1 ? (
                <span>
                  <strong>Day 1 重點提示：</strong>搭乘酷航 TR866 抵達成田後，搭乘{" "}
                  <strong>Sky Access 直通淺草線</strong> 一車直達人形町寄放行李；隨後轉乘百合海鷗號前往有明花園購物、享用利久牛舌提前晚餐。18:00
                  一人欣賞 SHOCK 舞台劇、一人完成 10 公里台場海濱路跑，21:00 於花園劇場入口會合返回飯店泡湯休息。
                </span>
              ) : (
                <span>
                  <strong>Day 2 重點提示：</strong>08:15 退房寄放行李，晨間前往{" "}
                  <strong>小網神社</strong> 參拜洗錢求強運，再至 <strong>DIXANS</strong> 享用黑糖厚片吐司早餐；甘酒橫丁三原堂採買鹽煎餅後，10:30 前往{" "}
                  <strong>五代目花山烏龍麵</strong> 提早排隊品嚐鬼ひも川寬麵。午後前往 <strong>新宿御苑</strong> 漫步欣賞金色銀杏與楓紅，15:10 回飯店取行李搭 Access 特急直達機場搭乘 TR875 返台。
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Items: Main Cards vs Compact Transit Connectors */}
        <div className="space-y-3">
          {currentItems.map((item, index) => {
            const isTransit = item.category === "transit";
            const isSplitActivity = item.id === "d1-10";

            // If it's a transit item, render a compact sleek connector row (NOT A GIANT BOX)
            if (isTransit) {
              return (
                <div
                  key={item.id}
                  className="relative pl-6 sm:pl-8 my-2 py-0.5 flex items-center group"
                >
                  {/* Vertical connecting line */}
                  <div className="absolute left-2.5 sm:left-3.5 top-0 bottom-0 w-0.5 bg-slate-200 -z-10" />

                  {/* Compact Transit Connector Bar */}
                  <div className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-3 transition-colors shadow-2xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                        <Train className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-mono font-bold text-slate-700 tabular-nums">
                          {item.time}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-800">
                          {item.title}
                        </span>
                        {item.transitLine && (
                          <span className="hidden lg:inline text-[11px] text-slate-500">
                            （{item.transitLine}）
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      {item.durationMinutes && (
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
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
                          className="text-[11px] text-amber-700 hover:text-amber-800 font-medium flex items-center gap-0.5"
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

            // Otherwise, render a Major Event Card
            return (
              <div
                key={item.id}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Vertical connector track */}
                <div className="absolute left-2.5 sm:left-3.5 top-0 bottom-0 w-0.5 bg-slate-200 -z-10" />
                {/* Node indicator */}
                <div className="absolute left-1 sm:left-2 top-6 w-3.5 h-3.5 rounded-full bg-amber-600 border-2 border-white ring-2 ring-amber-100 shadow-xs" />

                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 transition-all hover:border-slate-300 hover:shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Time & Sequence */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-400 tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 font-mono tabular-nums bg-slate-100 px-2.5 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Category & Track Tag */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span>{getCategoryLabel(item.category)}</span>
                      </span>
                      {item.track === "theater" && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-indigo-700 font-medium">看劇者動線</span>
                        </>
                      )}
                      {item.track === "runner" && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-medium">跑步者動線</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="mt-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    {/* Location with Google Map link */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{item.location}</span>
                      {item.mapsQuery && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            item.mapsQuery
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-amber-700 hover:underline ml-1 font-medium"
                        >
                          <span>導航</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Description */}
                    <div className="mt-3 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </div>

                    {/* Special Dual-Track Highlight for D1-10 */}
                    {isSplitActivity && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                        <div className="p-3.5 bg-indigo-50/70 rounded-lg border border-indigo-200/60 text-xs">
                          <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                            <span>🎭 看劇者：SHOCK 舞台劇（東京花園劇場）</span>
                          </div>
                          <p className="text-indigo-950 leading-relaxed">
                            開演時間 18:00，於 8,000 人座席的東京花園劇場欣賞精彩的 Endless SHOCK 舞台劇演出。
                          </p>
                        </div>
                        <div className="p-3.5 bg-emerald-50/70 rounded-lg border border-emerald-200/60 text-xs">
                          <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                            <span>🏃 跑步者：10 公里東京灣海濱路跑</span>
                          </div>
                          <p className="text-emerald-950 leading-relaxed">
                            由劇場出發 → 夢之大橋 → 台場海濱公園 → 彩虹大橋夜景 → 潮風公園 → 青海南埠頭 → Big Sight → 回到花園劇場。完全平坦、零折返！
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tips Callout */}
                    {item.tips && (
                      <div className="mt-3 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200/70 flex items-start gap-2">
                        <span className="font-semibold text-slate-800 shrink-0">行程小撇步：</span>
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
