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
  Sunset,
  Sunrise,
  Footprints,
  Calendar,
  Thermometer,
  Droplets,
  ListChecks,
} from "lucide-react";

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

  const activeDaily =
    weatherDayTab === "1128"
      ? METEOROLOGICAL_DATA.days[0]
      : METEOROLOGICAL_DATA.days[1];

  return (
    <div className="bg-[#faf9f6] divide-y divide-stone-200/80">
      {/* ============================================================== */}
      {/* 1. CHECKLIST SECTION (ID: checklist)                            */}
      {/* ============================================================== */}
      <section id="checklist" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 mb-2">
                <ListChecks className="w-3.5 h-3.5 text-emerald-700" />
                <span>Packing Checklist</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                行前準備清單
              </h2>
              <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
                涵蓋核心證件機票、10K 跑者夜跑裝備、舞台劇觀劇必備與防風保暖衣物，支援進度勾選與自訂備忘。
              </p>
            </div>

            {/* Checklist Progress Summary Badge */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 flex items-center justify-center font-bold text-stone-900 text-xs font-mono">
                {progressPercent}%
              </div>
              <div>
                <div className="text-xs text-stone-500 font-medium">整理進度</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">
                  已完成 {completedCount} / {totalCount} 項
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
            {/* Category Filter Pills & Bulk Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      categoryFilter === cat
                        ? "bg-stone-900 text-white shadow-xs"
                        : "bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={handleCheckAll}
                  className="text-stone-600 hover:text-stone-900 font-medium hover:underline"
                >
                  全部勾選
                </button>
                <span className="text-stone-300">·</span>
                <button
                  onClick={handleResetChecklist}
                  className="text-stone-600 hover:text-rose-600 font-medium flex items-center gap-1"
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
                      ? "bg-emerald-50/50 border-emerald-200/70 text-stone-500"
                      : "bg-stone-50/50 border-stone-200/70 hover:bg-stone-100/60 text-stone-900"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-emerald-600 focus:outline-hidden"
                  >
                    {item.defaultChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-stone-300" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          item.defaultChecked ? "line-through text-stone-400" : "text-stone-900"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-500">
                        {item.category}
                      </span>
                    </div>
                    {item.desc && (
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Item Adder */}
            <form
              onSubmit={handleAddItem}
              className="mt-6 pt-5 border-t border-stone-100 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                placeholder="新增個人備品（例如：拍立得底片、護唇膏、止痛藥）"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-hidden focus:border-stone-400"
              >
                <option value="個人備品">個人備品</option>
                <option value="重要證件與票券">重要證件與票券</option>
                <option value="10K 跑者裝備">10K 跑者裝備</option>
                <option value="看劇裝備">看劇裝備</option>
                <option value="衣物穿搭與 3C 用品">衣物穿搭與 3C 用品</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>加入清單</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. REALISTIC WEATHER SECTION (ID: weather)                      */}
      {/* ============================================================== */}
      <section id="weather" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 mb-2">
                <CloudSun className="w-3.5 h-3.5 text-amber-700" />
                <span>Realistic Meteorological Advisory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                東京天氣概要 ＆ 氣象預報
              </h2>
              <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
                日本氣象廳 (JMA) 規格預報：11/28–11/29 東京氣溫介於 7–16°C，秋高氣爽但日夜溫差顯著，傍晚海風偏涼。
              </p>
            </div>

            {/* Day Selector */}
            <div className="inline-flex p-1 bg-stone-100 rounded-2xl shrink-0 self-start md:self-auto">
              <button
                onClick={() => setWeatherDayTab("1128")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  weatherDayTab === "1128"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                11/28（六）DAY 1 預報
              </button>
              <button
                onClick={() => setWeatherDayTab("1129")}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                  weatherDayTab === "1129"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                11/29（日）DAY 2 預報
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Meteorological Advisory Header Banner */}
            <div className="bg-[#faf9f6] rounded-3xl border border-stone-200/80 p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-500 font-mono">
                      {METEOROLOGICAL_DATA.station}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-stone-900">
                      {METEOROLOGICAL_DATA.forecastRegion}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-stone-500 font-mono">
                  發布時間：{METEOROLOGICAL_DATA.publishedAt}
                </div>
              </div>

              {/* Advisory Headline */}
              <div className="mt-4 flex items-start gap-2.5 text-xs sm:text-sm text-amber-900 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>{METEOROLOGICAL_DATA.advisoryHeadline}</span>
              </div>

              {/* Day Metrics Row */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-3 bg-white rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[11px] text-stone-400 block font-medium">當日天氣</span>
                  <span className="text-sm font-bold text-stone-900 mt-1 block">
                    {activeDaily.condition}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[11px] text-stone-400 block font-medium">最高 / 最低溫</span>
                  <span className="text-sm font-bold text-stone-900 mt-1 block font-mono">
                    {activeDaily.highTemp}°C / {activeDaily.lowTemp}°C
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[11px] text-stone-400 block font-medium">降雨機率</span>
                  <span className="text-sm font-bold text-sky-700 mt-1 block font-mono">
                    {activeDaily.pop}%
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[11px] text-stone-400 block font-medium">平均風速</span>
                  <span className="text-sm font-bold text-stone-900 mt-1 block font-mono">
                    {activeDaily.windSpeed} m/s ({activeDaily.windDirection})
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[11px] text-stone-400 block font-medium">日出 / 日落</span>
                  <span className="text-sm font-bold text-amber-700 mt-1 block font-mono">
                    {activeDaily.sunrise} / {activeDaily.sunset}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-stone-200/70 text-center">
                  <span className="text-[11px] text-stone-400 block font-medium">海風與海況</span>
                  <span className="text-xs font-semibold text-stone-800 mt-1 block">
                    {activeDaily.marineStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Hourly Meteorological Timeline Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-amber-700" />
                  <span>逐 3 小時精確氣溫、體感溫度與風速走向</span>
                </h3>
                <span className="text-xs text-stone-400 font-mono">單位：攝氏度 (°C)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {currentHourly.map((hour, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-4 text-center border transition-all ${
                      hour.isRunTime
                        ? "bg-emerald-50/80 border-emerald-300 shadow-sm ring-2 ring-emerald-200/50"
                        : "bg-[#faf9f6] border-stone-200/80 hover:bg-stone-50"
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-stone-600">
                      {hour.time}
                    </div>

                    {hour.isRunTime && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                        10K 跑步時段
                      </span>
                    )}

                    <div className="text-2xl font-black text-stone-900 mt-2 font-mono">
                      {hour.temp}°
                    </div>

                    <div className="text-xs text-stone-500 mt-0.5">
                      體感 {hour.feelsLike}°C
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-200/60 text-xs">
                      <div className="font-semibold text-stone-800">{hour.condition}</div>
                      <div className="text-[11px] text-stone-400 mt-1 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        <span>雨率 {hour.pop}%</span>
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5 flex items-center justify-center gap-1">
                        <Wind className="w-3 h-3 text-stone-400" />
                        <span>{hour.windSpeed}m/s {hour.windDirection}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Advice Grid: Autumn Foliage & Layering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Autumn Foliage Status */}
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                  <Leaf className="w-4 h-4 text-amber-700" />
                  <span>秋季紅葉與銀杏見頃情報</span>
                </div>
                <h4 className="text-base font-bold text-stone-900">
                  新宿御苑 11 月下旬處於「見頃最盛期」
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {METEOROLOGICAL_DATA.autumnFoliageStatus.spot}
                </p>

                <div className="mt-4 pt-4 border-t border-amber-200/60 grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/80 p-3 rounded-2xl border border-amber-200/60">
                    <span className="text-amber-800 font-bold block">金黃銀杏狀態</span>
                    <span className="text-stone-800 font-semibold mt-1 block">
                      {METEOROLOGICAL_DATA.autumnFoliageStatus.ginkgo}
                    </span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-amber-200/60">
                    <span className="text-rose-800 font-bold block">雞爪槭楓紅狀態</span>
                    <span className="text-stone-800 font-semibold mt-1 block">
                      {METEOROLOGICAL_DATA.autumnFoliageStatus.momiji}
                    </span>
                  </div>
                </div>
              </div>

              {/* Layering & Outfit Advice */}
              <div className="p-6 bg-gradient-to-br from-stone-50 to-stone-100/70 rounded-3xl border border-stone-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  <Layers className="w-4 h-4 text-stone-600" />
                  <span>衣著穿搭指引 ｜ 洋蔥式原則</span>
                </div>
                <h4 className="text-base font-bold text-stone-900">
                  早晚 7°C 寒涼、日間 16°C 舒適、室內暖氣充沛
                </h4>
                <div className="mt-3 space-y-2 text-xs text-stone-600 leading-relaxed">
                  <p>
                    <strong>外層：</strong>防風大衣或輕羽絨外套。晚間在台場臨海跑步、或夜間自劇場步行返回時抗風必備。
                  </p>
                  <p>
                    <strong>中層：</strong>針織開襟衫或輕衛衣，方便進入地鐵車廂與商場時脫下。
                  </p>
                  <p>
                    <strong>跑者專屬：</strong>18:00 起跑體感約 9°C，建議運動長褲與防風薄風衣，跑後立即換乾淨衣物。
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
