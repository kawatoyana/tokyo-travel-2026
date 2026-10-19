import React, { useState, useEffect } from "react";
import {
  CHECKLIST_ITEMS,
  METEOROLOGICAL_DATA,
  ChecklistItem,
  DailyForecast,
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
  Footprints,
} from "lucide-react";

export const PackingWeatherSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"weather" | "checklist">("weather");
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

  // Save to localStorage
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
    "10K 跑者裝備",
    "看劇裝備",
    "衣物穿搭與 3C 用品",
  ];

  const filteredItems = checklist.filter((item) => {
    if (categoryFilter === "全部") return true;
    return item.category === categoryFilter;
  });

  const totalCount = checklist.length;
  const completedCount = checklist.filter((item) => item.defaultChecked).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const currentHourly =
    weatherDayTab === "1128"
      ? METEOROLOGICAL_DATA.hourly1128
      : METEOROLOGICAL_DATA.hourly1129;

  return (
    <section id="preparation" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Weather & Readiness
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              氣象預報 ＆ 行前準備清單
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              提供日本氣象廳 (JMA) 規格之東京週末實時天氣預報，以及行李必備品清單。
            </p>
          </div>

          {/* Primary View Switcher */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("weather")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "weather"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>氣象預報報告</span>
            </button>
            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "checklist"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>行李清單 ({completedCount}/{totalCount})</span>
            </button>
          </div>
        </div>

        {activeTab === "weather" ? (
          /* Realistic Meteorological Forecast UI */
          <div className="space-y-8">
            {/* Meteorological Agency Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-mono">
                      {METEOROLOGICAL_DATA.station}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-slate-900">
                      {METEOROLOGICAL_DATA.forecastRegion} 天氣預報
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right text-xs text-slate-500 font-mono">
                  <span>發布時刻：{METEOROLOGICAL_DATA.publishedAt}</span>
                </div>
              </div>

              {/* Official Weather Advisory Alert */}
              <div className="mt-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed font-medium">
                  {METEOROLOGICAL_DATA.advisoryHeadline}
                </div>
              </div>
            </div>

            {/* 2-Day Meteorological Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {METEOROLOGICAL_DATA.days.map((day: DailyForecast, index: number) => (
                <div
                  key={day.date}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-700 tracking-wider">
                        DAY 0{index + 1} · {day.dayOfWeek}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5 font-mono">
                        {day.date}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {day.condition}
                    </span>
                  </div>

                  {/* High / Low Temp Display */}
                  <div className="mt-6 flex items-baseline gap-4">
                    <div className="text-4xl sm:text-5xl font-black font-mono text-slate-900 tabular-nums">
                      {day.highTemp}°
                      <span className="text-lg text-slate-500 font-bold ml-1">C</span>
                    </div>
                    <div className="text-lg font-mono font-semibold text-sky-700 tabular-nums">
                      最低 {day.lowTemp}°C
                    </div>
                    <div className="ml-auto text-xs text-slate-700 font-mono font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                      日溫差 {day.highTemp - day.lowTemp}°C
                    </div>
                  </div>

                  {/* Meteorological Metrics Grid */}
                  <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block">降雨機率 (POP)</span>
                      <span className="font-bold font-mono text-slate-800 mt-0.5 block">
                        {day.pop}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">平均濕度</span>
                      <span className="font-bold font-mono text-slate-800 mt-0.5 block">
                        {day.humidity}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">風速與風向</span>
                      <span className="font-bold font-mono text-slate-800 mt-0.5 block">
                        {day.windDirection} {day.windSpeed}m/s
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">日落時刻</span>
                      <span className="font-bold font-mono text-amber-800 mt-0.5 block">
                        {day.sunset}
                      </span>
                    </div>
                  </div>

                  {/* Marine status note */}
                  <div className="mt-4 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200 flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{day.marineStatus}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Hourly Weather Forecast Table */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    HOURLY FORECAST
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    每 3 小時氣候預報
                  </h3>
                </div>

                {/* Day Switcher for Hourly */}
                <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setWeatherDayTab("1128")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      weatherDayTab === "1128"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    11/28（六）有明灣岸
                  </button>
                  <button
                    onClick={() => setWeatherDayTab("1129")}
                    className={`px-3 py-1.5 rounded-md transition-all ${
                      weatherDayTab === "1129"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    11/29（日）人形町・新宿
                  </button>
                </div>
              </div>

              {/* Hourly Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {currentHourly.map((hour) => {
                  const isHighlighted = hour.isRunTime;

                  return (
                    <div
                      key={hour.time}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                        isHighlighted
                          ? "bg-amber-50/80 border-amber-300 shadow-xs"
                          : "bg-slate-50/80 border-slate-200"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-800 tabular-nums">
                            {hour.time}
                          </span>
                          {isHighlighted && (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                              夜跑時段
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 font-medium mt-1">
                          {hour.condition}
                        </div>

                        {/* Temperature */}
                        <div className="mt-3 text-2xl font-black font-mono text-slate-900 tabular-nums">
                          {hour.temp}°C
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          體感 {hour.feelsLike}°C
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-500 font-mono">
                        <div className="flex justify-between">
                          <span>降雨</span>
                          <span className="text-slate-800">{hour.pop}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>風速</span>
                          <span className="text-slate-800">{hour.windSpeed}m/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span>濕度</span>
                          <span className="text-slate-800">{hour.humidity}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Environmental & Lifestyle Indices */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Onion Layering */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-2">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>洋蔥式服裝穿著建議</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">室內暖氣 vs 戶外秋風</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {METEOROLOGICAL_DATA.indices.clothing}
                </p>
              </div>

              {/* Card 2: Runner Wind & Marine Index */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
                  <Footprints className="w-4 h-4 text-emerald-700" />
                  <span>10K 跑步氣候提示</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">涼爽低溫，適合跑步</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {METEOROLOGICAL_DATA.indices.running}
                </p>
              </div>

              {/* Card 3: Autumn Foliage Status */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-2">
                  <Leaf className="w-4 h-4 text-rose-700" />
                  <span>紅葉・銀杏觀賞狀況</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">新宿御苑年度最佳觀賞期</h4>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {METEOROLOGICAL_DATA.autumnFoliageStatus.spot}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Checklist View */
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    行李與行前整備完成率
                  </span>
                  <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                    {completedCount} / {totalCount} 項目完成 ({progressPercent}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCheckAll}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  全部勾選
                </button>
                <button
                  onClick={handleResetChecklist}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 rounded-lg transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重設</span>
                </button>
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === cat
                      ? "bg-slate-900 text-white font-semibold"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Custom Item Form */}
            <form
              onSubmit={handleAddItem}
              className="bg-white rounded-xl border border-slate-200 p-3.5 flex flex-col sm:flex-row items-center gap-2.5"
            >
              <input
                type="text"
                placeholder="新增自訂備品項目（例如：相機電池、止汗劑、筋膜球...）"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 text-xs sm:text-sm px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 w-full"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 w-full sm:w-auto"
              >
                <option value="重要證件與票券">重要證件與票券</option>
                <option value="10K 跑者裝備">10K 跑者裝備</option>
                <option value="看劇裝備">看劇裝備</option>
                <option value="衣物穿搭與 3C 用品">衣物穿搭與 3C 用品</option>
                <option value="個人備品">個人備品</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>加入清單</span>
              </button>
            </form>

            {/* Checklist Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item) => {
                const isChecked = !!item.defaultChecked;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3 select-none ${
                      isChecked
                        ? "bg-slate-50/60 border-slate-200 opacity-60"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isChecked
                              ? "line-through text-slate-400"
                              : "text-slate-900"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0 font-medium font-mono">
                          {item.category}
                        </span>
                      </div>
                      {item.desc && (
                        <p
                          className={`text-xs mt-1 leading-snug ${
                            isChecked ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
