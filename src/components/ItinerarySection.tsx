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
        return <Train className="w-4 h-4 text-emerald-600" />;
      case "hotel":
        return <Building className="w-4 h-4 text-purple-600" />;
      case "dining":
        return <UtensilsCrossed className="w-4 h-4 text-amber-600" />;
      case "shopping":
        return <ShoppingBag className="w-4 h-4 text-rose-600" />;
      case "sightseeing":
        return <Eye className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-600" />;
    }
  };

  const getCategoryLabel = (category: ItineraryItem["category"]) => {
    switch (category) {
      case "flight":
        return "航空航班";
      case "transit":
        return "交通轉乘";
      case "hotel":
        return "飯店入住";
      case "dining":
        return "美饌饗宴";
      case "shopping":
        return "商場購物";
      case "sightseeing":
        return "名所參訪";
      default:
        return "活動體驗";
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
    <section id="itinerary" className="py-16 sm:py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Daily Schedule
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              每日精確行程時間表
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              時間緊湊而從容的 48 小時：專注在最經典的下町信仰、灣岸震撼舞台劇、沿海夜跑與盛秋庭園。
            </p>
          </div>

          {/* Day Tabs (Segmented Control) */}
          <div className="inline-flex p-1 bg-neutral-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeDay === 1
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              DAY 1｜11/28（六）有明・SHOCK・10K
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeDay === 2
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              DAY 2｜11/29（日）小網神社・烏龍麵・新宿御苑
            </button>
          </div>
        </div>

        {/* Day 1 Persona Perspective Filter */}
        {activeDay === 1 && (
          <div className="mb-8 p-4 bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-600">
              <span className="font-semibold text-neutral-900">傍晚 17:05–21:00 分軌切換：</span>
              <span>一人看劇、一人海風 10K 夜跑</span>
            </div>
            <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setDay1Track("all")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "all"
                    ? "bg-white text-neutral-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                完整合體行程
              </button>
              <button
                onClick={() => setDay1Track("theater")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "theater"
                    ? "bg-white text-purple-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                🎭 看劇者專屬視角 (SHOCK)
              </button>
              <button
                onClick={() => setDay1Track("runner")}
                className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                  day1Track === "runner"
                    ? "bg-white text-emerald-900 shadow-xs font-semibold"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                🏃 跑者專屬視角 (10K 環線)
              </button>
            </div>
          </div>
        )}

        {/* Day Overview Summary Banner */}
        <div className="mb-8 p-5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              {activeDay === 1 ? (
                <span>
                  <strong>Day 1 重點提示：</strong>酷航 TR866 抵達成田後，搭乘{" "}
                  <strong>Sky Access 直通淺草線</strong> 一車抵達人形町寄放行李；隨後轉乘百合海鷗號前往有明花園購物、享用「利久牛舌」提早晚餐。18:00
                  兩人分流進行 SHOCK 舞台劇與 10K 東京灣無折返環線夜跑，21:00 於劇場入口會合返飯店泡湯。
                </span>
              ) : (
                <span>
                  <strong>Day 2 重點提示：</strong>08:15 退房寄存行李，先至{" "}
                  <strong>小網神社</strong> 晨間參拜洗錢求強運，再至 <strong>DIXANS</strong> 享用黑糖厚片早餐；甘酒橫丁三原堂採購鹽煎餅後，10:30 前往{" "}
                  <strong>五代目花山烏龍麵</strong> 排首輪入座享用鬼ひも川寬麵。午後前往 <strong>新宿御苑</strong> 沉浸於銀杏與楓紅美景，15:10 回飯店取行李搭 Access 特急直達機場搭乘 TR875 返台。
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Items */}
        <div className="space-y-4">
          {currentItems.map((item, index) => {
            const isSplitActivity = item.id === "d1-10";

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-neutral-200/80 p-5 sm:p-6 transition-all hover:border-neutral-300 hover:shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Time & Sequence */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-neutral-400 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-900 font-mono tabular-nums bg-neutral-100 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{item.time}</span>
                    </div>
                  </div>

                  {/* Category & Track Tag */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500 shrink-0">
                    <span className="flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      <span>{getCategoryLabel(item.category)}</span>
                    </span>
                    {item.track === "theater" && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-purple-700 font-medium">看劇者動線</span>
                      </>
                    )}
                    {item.track === "runner" && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">跑者動線</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                    {item.title}
                  </h3>

                  {/* Location with Google Map link */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 mt-1.5">
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
                  <div className="mt-3 text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </div>

                  {/* Special Dual-Track Highlight for D1-10 */}
                  {isSplitActivity && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                      <div className="p-3.5 bg-purple-50/60 rounded-lg border border-purple-200/60 text-xs">
                        <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                          <span>🎭 劇迷軌道：Endless SHOCK 舞台劇</span>
                        </div>
                        <p className="text-purple-950 leading-relaxed">
                          東京花園劇場（8,000人規格劇院），開演時間 18:00。震撼的高空飛越、階梯滾落與百老匯級歌舞，身歷其境體驗傳奇劇目。
                        </p>
                      </div>
                      <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200/60 text-xs">
                        <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                          <span>🏃 跑者軌道：10K 海風環線夜跑</span>
                        </div>
                        <p className="text-emerald-950 leading-relaxed">
                          有明出發 → 夢之大橋 → 台場海濱公園 → 彩虹大橋夜景 → 潮風公園 → 青海南埠頭 → Big Sight → 回到花園劇場。完全平坦、零折返！
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tips Callout */}
                  {item.tips && (
                    <div className="mt-3 text-xs text-neutral-500 bg-neutral-50 rounded-lg px-3 py-2 border border-neutral-200/60 flex items-start gap-2">
                      <span className="font-semibold text-neutral-700 shrink-0">建議提醒：</span>
                      <span>{item.tips}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
