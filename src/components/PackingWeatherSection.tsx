import React, { useState, useEffect } from "react";
import {
  CHECKLIST_ITEMS,
  METEOROLOGICAL_DATA,
  ChecklistItem,
  HourlyForecast,
} from "../data/tripData";
import {
  CheckSquare,
  Square,
  CloudSun,
  Wind,
  Plus,
  RotateCcw,
  AlertTriangle,
  Leaf,
  Layers,
  Sun,
  Thermometer,
  Droplets,
  ListChecks,
  RefreshCw,
  Radio,
} from "lucide-react";
import {
  LuggageSticker,
  SparkleDoodle,
  GinkgoLeafSticker,
  FloatingBubble,
} from "./CuteDoodles";

export const PackingWeatherSection: React.FC = () => {
  const [weatherDayTab, setWeatherDayTab] = useState<"1128" | "1129">("1128");

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem("tokyo_trip_checklist_2026");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return CHECKLIST_ITEMS.map((item) => ({
      ...item,
      defaultChecked: item.defaultChecked || false,
    }));
  });

  const [categoryFilter, setCategoryFilter] = useState<string>("全部");
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("個人備品");

  // Requirement 7: Real-time Live Meteorological Data (Tokyo Bay / Ariake / Minato)
  const [liveWeather, setLiveWeather] = useState<{
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    updatedAt: string;
  } | null>(null);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState<boolean>(false);

  const getWmoDescription = (code: number) => {
    if (code === 0) return { label: "晴朗無雲", note: "陽光充足，能見度極佳" };
    if (code === 1 || code === 2) return { label: "晴時多雲", note: "舒適微風，適宜散步跑跳" };
    if (code === 3) return { label: "陰天覆蓋", note: "雲層較厚，氣溫稍降注意保暖" };
    if (code >= 45 && code <= 48) return { label: "晨霧薄靄", note: "早晚海灣稍有薄霧" };
    if (code >= 51 && code <= 67) return { label: "細雨/局部小雨", note: "外出備輕量折疊傘" };
    if (code >= 71 && code <= 77) return { label: "飄雪/微雪", note: "高空冷空氣通過" };
    if (code >= 80 && code <= 82) return { label: "短暫陣雨", note: "局部陣發性降水" };
    if (code >= 95) return { label: "雷陣雨", note: "防雷防海面強陣風" };
    return { label: "秋日晴好", note: "秋末東京灣岸氣候舒適" };
  };

  const fetchRealtimeWeather = async () => {
    try {
      setIsRefreshingWeather(true);
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=35.6366&longitude=139.7925&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FTokyo"
      );
      if (!res.ok) throw new Error("Weather API request failed");
      const data = await res.json();
      if (data && data.current) {
        setLiveWeather({
          temperature: Math.round(data.current.temperature_2m * 10) / 10,
          apparentTemperature: Math.round(data.current.apparent_temperature * 10) / 10,
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round((data.current.wind_speed_10m / 3.6) * 10) / 10, // km/h to m/s
          weatherCode: data.current.weather_code,
          updatedAt: new Date().toLocaleTimeString("zh-TW", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
      }
    } catch (err) {
      console.warn("Live weather fetch fallback:", err);
    } finally {
      setIsRefreshingWeather(false);
    }
  };

  useEffect(() => {
    fetchRealtimeWeather();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("tokyo_trip_checklist_2026", JSON.stringify(checklist));
    } catch {
      // ignore
    }
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, defaultChecked: !item.defaultChecked } : item
      )
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const newItem: ChecklistItem = {
      id: "custom-" + Date.now(),
      category: newItemCategory,
      title: newItemTitle.trim(),
      desc: "自訂備品項目",
      defaultChecked: false,
    };
    setChecklist((prev) => [newItem, ...prev]);
    setNewItemTitle("");
  };

  const handleResetChecklist = () => {
    setChecklist(
      CHECKLIST_ITEMS.map((item) => ({
        ...item,
        defaultChecked: false,
      }))
    );
  };

  const handleCheckAll = () => {
    setChecklist(
      checklist.map((item) => ({
        ...item,
        defaultChecked: true,
      }))
    );
  };

  const categories = [
    "全部",
    "重要證件與票券",
    "10K 夜跑運動專用",
    "舞台劇與隨身活動",
    "電子與通訊配件",
    "換洗衣物與盥洗",
  ];

  const filteredItems = checklist.filter((item) => {
    if (categoryFilter === "全部") return true;
    return item.category === categoryFilter;
  });

  const completedCount = checklist.filter((i) => i.defaultChecked).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / (totalCount || 1)) * 100);

  const currentHourly: HourlyForecast[] =
    weatherDayTab === "1128"
      ? METEOROLOGICAL_DATA.hourly1128
      : METEOROLOGICAL_DATA.hourly1129;

  const activeDaily =
    weatherDayTab === "1128"
      ? METEOROLOGICAL_DATA.days[0]
      : METEOROLOGICAL_DATA.days[1];

  return (
    <div className="bg-[#faf8f6] divide-y divide-[#eee4e7] relative overflow-hidden">
      {/* Pure Frosted White Bubbles */}
      <FloatingBubble size={24} className="absolute top-20 right-[5%] hidden md:block" delay="0.5s" />
      <FloatingBubble size={30} className="absolute bottom-28 left-[8%]" delay="2.8s" />

      {/* ============================================================== */}
      {/* 1. CHECKLIST SECTION (ID: checklist)                            */}
      {/* ============================================================== */}
      <section id="checklist" className="py-14 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] mb-2.5">
                <ListChecks className="w-3.5 h-3.5" />
                <span>PACKING CHECKLIST</span>
                <SparkleDoodle className="w-3 h-3 text-[#e0758e]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2527] tracking-tight">
                行前準備清單
              </h2>
              <p className="text-xs sm:text-sm text-[#6e5d62] mt-1.5 max-w-xl leading-relaxed font-normal">
                涵蓋核心證件機票、10K 跑者夜跑裝備、舞台劇觀劇必備與防風保暖衣物，支援進度勾選與自訂備忘。
              </p>
            </div>

            {/* Checklist Progress Badge */}
            <div className="bg-white px-5 py-3.5 rounded-full border border-[#fad4dd] shadow-2xs flex items-center gap-4 shrink-0">
              <div className="w-10 h-10 rounded-full border-3 border-[#f8c1ce] border-t-[#b83358] flex items-center justify-center font-bold text-[#b83358] text-xs font-mono">
                {progressPercent}%
              </div>
              <div>
                <div className="text-[11px] text-[#9c7580] font-medium">整理進度</div>
                <div className="text-xs sm:text-sm font-bold text-[#4a383d]">
                  已完成 {completedCount} / {totalCount} 項
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#fad4dd] p-6 sm:p-8 shadow-[0_8px_30px_rgba(240,160,180,0.08)] space-y-6">
            {/* Category Filter Pills & Bulk Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#fae1e7]">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      categoryFilter === cat
                        ? "bg-[#b83358] text-white shadow-2xs"
                        : "bg-[#fff0f4] text-[#8c606c] hover:text-[#4a383d] hover:bg-[#fde2ea]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={handleCheckAll}
                  className="text-[#8c606c] hover:text-[#b83358] font-medium hover:underline"
                >
                  全部勾選
                </button>
                <span className="text-[#f9d7df]">·</span>
                <button
                  onClick={handleResetChecklist}
                  className="text-[#8c606c] hover:text-[#b83358] font-medium flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置清單</span>
                </button>
              </div>
            </div>

            {/* Checklist Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-3 select-none ${
                    item.defaultChecked
                      ? "bg-[#fff7f8] border-[#f8c1ce] text-[#9c7580]"
                      : "bg-[#fff5f7] border-[#fae0e6] hover:bg-[#fff0f3] text-[#4a383d]"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-[#b83358] focus:outline-hidden"
                  >
                    {item.defaultChecked ? (
                      <CheckSquare className="w-5 h-5 text-[#b83358]" />
                    ) : (
                      <Square className="w-5 h-5 text-[#f8c1ce]" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold ${
                          item.defaultChecked ? "line-through text-[#9c7580]" : "text-[#4a383d]"
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.isImportant && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#fdebf0] text-[#a82a51] rounded-md border border-[#fad2dd]">
                          必備
                        </span>
                      )}
                    </div>
                    {item.desc && (
                      <p
                        className={`text-[11px] mt-0.5 leading-relaxed ${
                          item.defaultChecked ? "text-[#bda4ab]" : "text-[#735860]"
                        }`}
                      >
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Item Form */}
            <form onSubmit={handleAddItem} className="pt-4 border-t border-[#fae1e7] flex gap-2">
              <input
                type="text"
                placeholder="新增個人私房備品項目..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-full text-xs bg-[#fff7f8] border border-[#fae0e6] text-[#4a383d] placeholder-[#bda4ab] focus:outline-hidden focus:border-[#b83358]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#b83358] text-white text-xs font-bold hover:bg-[#992545] transition-all flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>加入</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. WEATHER SECTION (ID: weather)                              */}
      {/* ============================================================== */}
      <section id="weather" className="py-16 sm:py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fde9ee] text-[#b83358] border border-[#faccd7] mb-3">
                <CloudSun className="w-3.5 h-3.5 text-[#b83358]" />
                <span>REAL METEOROLOGICAL FORECAST</span>
                <SparkleDoodle className="w-3 h-3 text-pink-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4a383d] tracking-tight">
                東京灣岸氣象預報
              </h2>
              <p className="text-sm text-[#735860] mt-2 max-w-xl leading-relaxed font-normal">
                針對東京灣（有明・台場）與市中心（日本橋・新宿）呈現真實氣象要素：溫度走向、海灣風速、體感溫標與跑者穿著提案。
              </p>
            </div>

            {/* Day Selector Pills */}
            <div className="inline-flex p-1.5 bg-[#fce8ed] rounded-full border border-[#f7d5df] shrink-0 self-start md:self-auto shadow-2xs">
              <button
                onClick={() => setWeatherDayTab("1128")}
                className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                  weatherDayTab === "1128"
                    ? "bg-white text-[#a82a51] shadow-xs"
                    : "text-[#7d5f66] hover:text-[#4a383d]"
                }`}
              >
                11/28（六）DAY 1
              </button>
              <button
                onClick={() => setWeatherDayTab("1129")}
                className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all ${
                  weatherDayTab === "1129"
                    ? "bg-white text-[#a82a51] shadow-xs"
                    : "text-[#7d5f66] hover:text-[#4a383d]"
                }`}
              >
                11/29（日）DAY 2
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Meteorological Advisory Card */}
            <div className="bg-white rounded-3xl border border-[#fad4dd] p-6 sm:p-7 shadow-[0_8px_30px_rgba(240,160,180,0.08)]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#fae1e7]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#fff0f4] border border-[#fad2dd] flex items-center justify-center text-[#b83358]">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#9c7580] font-mono">
                      {METEOROLOGICAL_DATA.station}
                    </div>
                    <div className="text-base font-bold text-[#4a383d]">
                      {METEOROLOGICAL_DATA.forecastRegion}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#9c7580] font-mono">
                    {liveWeather ? `即時觀測：${liveWeather.updatedAt}` : `發布時間：${METEOROLOGICAL_DATA.publishedAt}`}
                  </span>
                  <button
                    onClick={fetchRealtimeWeather}
                    disabled={isRefreshingWeather}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#8e2443] bg-[#fdf2f4] hover:bg-[#fae4e8] border border-[#f3d9de] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    title="立即重新整理氣象資料"
                  >
                    <RefreshCw className={`w-3 h-3 ${isRefreshingWeather ? "animate-spin" : ""}`} />
                    <span>即時更新</span>
                  </button>
                </div>
              </div>

              {/* Requirement 7: Live Real-Time Weather Banner */}
              {liveWeather && (
                <div className="mt-4 p-4 bg-gradient-to-r from-[#fff3f6] to-[#fff8f9] rounded-2xl border border-[#fad4df] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#b83358] uppercase tracking-wider">
                          LIVE 即時現場氣象（有明・台場）
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fdebf0] text-[#a82a51] border border-[#faccd7]">
                          {getWmoDescription(liveWeather.weatherCode).label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6e5d62] mt-0.5">
                        {getWmoDescription(liveWeather.weatherCode).note} · 隨時與 Open-Meteo 氣象台連線同步
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono">
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-[#fae0e6] shadow-2xs">
                      <span className="text-[10px] text-[#9c7580] block">即時氣溫</span>
                      <span className="font-extrabold text-[#b83358] text-sm">
                        {liveWeather.temperature}°C
                      </span>
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-[#fae0e6] shadow-2xs">
                      <span className="text-[10px] text-[#9c7580] block">體感溫度</span>
                      <span className="font-extrabold text-[#4a383d] text-sm">
                        {liveWeather.apparentTemperature}°C
                      </span>
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-[#fae0e6] shadow-2xs">
                      <span className="text-[10px] text-[#9c7580] block">相對濕度</span>
                      <span className="font-extrabold text-sky-600 text-sm">
                        {liveWeather.humidity}%
                      </span>
                    </div>
                    <div className="px-3 py-1.5 bg-white rounded-xl border border-[#fae0e6] shadow-2xs">
                      <span className="text-[10px] text-[#9c7580] block">海灣風速</span>
                      <span className="font-extrabold text-[#78377e] text-sm">
                        {liveWeather.windSpeed} m/s
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Advisory Headline */}
              <div className="mt-4 flex items-start gap-2.5 text-xs sm:text-sm text-[#992545] bg-[#fff0f4] p-4 rounded-2xl border border-[#fad4df] leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-[#b83358] shrink-0 mt-0.5" />
                <span>{METEOROLOGICAL_DATA.advisoryHeadline}</span>
              </div>

              {/* Day Metrics Row */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3.5">
                <div className="p-3.5 bg-[#fff7f8] rounded-2xl border border-[#fae0e6] text-center">
                  <span className="text-[11px] text-[#9c7580] block font-medium">當日天氣</span>
                  <span className="text-sm font-bold text-[#4a383d] mt-1 block">
                    {activeDaily.condition}
                  </span>
                </div>

                <div className="p-3.5 bg-[#fff7f8] rounded-2xl border border-[#fae0e6] text-center">
                  <span className="text-[11px] text-[#9c7580] block font-medium">最高 / 最低溫</span>
                  <span className="text-sm font-bold text-[#b83358] mt-1 block font-mono">
                    {activeDaily.highTemp}°C / {activeDaily.lowTemp}°C
                  </span>
                </div>

                <div className="p-3.5 bg-[#fff7f8] rounded-2xl border border-[#fae0e6] text-center">
                  <span className="text-[11px] text-[#9c7580] block font-medium">降雨機率</span>
                  <span className="text-sm font-bold text-[#286f4a] mt-1 block font-mono">
                    {activeDaily.pop}%
                  </span>
                </div>

                <div className="p-3.5 bg-[#fff7f8] rounded-2xl border border-[#fae0e6] text-center">
                  <span className="text-[11px] text-[#9c7580] block font-medium">平均風速</span>
                  <span className="text-sm font-bold text-[#4a383d] mt-1 block font-mono">
                    {activeDaily.windSpeed} m/s
                  </span>
                </div>

                <div className="p-3.5 bg-[#fff7f8] rounded-2xl border border-[#fae0e6] text-center">
                  <span className="text-[11px] text-[#9c7580] block font-medium">日出 / 日落</span>
                  <span className="text-sm font-bold text-[#a82a51] mt-1 block font-mono">
                    {activeDaily.sunrise} / {activeDaily.sunset}
                  </span>
                </div>

                <div className="p-3.5 bg-[#fff7f8] rounded-2xl border border-[#fae0e6] text-center">
                  <span className="text-[11px] text-[#9c7580] block font-medium">海風與海況</span>
                  <span className="text-xs font-semibold text-[#735860] mt-1 block truncate">
                    {activeDaily.marineStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Hourly Meteorological Timeline Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm sm:text-base font-bold text-[#4a383d] flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-[#b83358]" />
                  <span>逐 3 小時氣溫、體感溫度與風速走向</span>
                </h3>
                <span className="text-xs text-[#9c7580] font-mono">單位：攝氏度 (°C)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {currentHourly.map((hour, idx) => (
                  <div
                    key={idx}
                    className={`rounded-3xl p-4 text-center border transition-all ${
                      hour.isRunTime
                        ? "bg-[#fff0f4] border-[#fad2dd] shadow-2xs"
                        : "bg-white border-[#fae1e7] hover:bg-[#fff7f8]"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-[#8c606c]">
                      {hour.time}
                    </div>

                    {hour.isRunTime && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold bg-[#b83358] text-white rounded-full">
                        10K 跑步時段
                      </span>
                    )}

                    <div className="text-2xl font-black text-[#4a383d] mt-2 font-mono">
                      {hour.temp}°
                    </div>

                    <div className="text-xs text-[#8c606c] mt-0.5">
                      體感 {hour.feelsLike}°C
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#fae1e7] text-xs">
                      <div className="font-semibold text-[#4a383d]">{hour.condition}</div>
                      <div className="text-[11px] text-[#8c606c] mt-1 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        <span>雨率 {hour.pop}%</span>
                      </div>
                      <div className="text-[11px] text-[#8c606c] mt-0.5 flex items-center justify-center gap-1">
                        <Wind className="w-3 h-3 text-[#b83358]" />
                        <span>{hour.windSpeed}m/s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Runner & Tourist Dressing Guide */}
            <div className="bg-white rounded-3xl border border-[#fad4dd] p-6 sm:p-7 shadow-[0_8px_30px_rgba(240,160,180,0.08)]">
              <h3 className="text-base font-bold text-[#4a383d] flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-[#b83358]" />
                <span>11 月末東京灣岸・穿著建議指引</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7] text-xs">
                  <div className="font-bold text-[#a82a51] mb-1.5 flex items-center gap-1.5">
                    <span>🏃 10K 跑者穿搭指南</span>
                  </div>
                  <p className="text-[#6b4f57] leading-relaxed">
                    傍晚氣溫 11–13°C，台場海岸側風約 4.2m/s。建議「透氣長袖壓縮排汗衣 + 跑步短褲/緊身壓縮長褲」，起跑前套上輕量防風防潑水風衣；待起跑 2 公里身體暖和後拉開拉鍊。備妥魔術頭巾或薄保暖手套，避免海風直吹耳際受寒。
                  </p>
                </div>

                <div className="p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7] text-xs">
                  <div className="font-bold text-[#a82a51] mb-1.5 flex items-center gap-1.5">
                    <span>🎭 看劇與市區散步穿搭</span>
                  </div>
                  <p className="text-[#6b4f57] leading-relaxed">
                    室內劇場、地鐵與商場暖氣充足（室內約 20–22°C），室外早晚偏涼（約 8–10°C）。建議採用「洋蔥式穿法」：發熱衣 + 針織衫/帽 T + 羊毛大衣或輕羽絨外套；方便進出室內時穿脫調節。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
