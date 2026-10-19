import React, { useState, useEffect } from "react";
import { CHECKLIST_ITEMS, WEATHER_OVERVIEW, ChecklistItem } from "../data/tripData";
import {
  CheckSquare,
  Square,
  Thermometer,
  CloudSun,
  Sunset,
  Sunrise,
  Wind,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Leaf,
  Layers,
} from "lucide-react";

export const PackingWeatherSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"checklist" | "weather">("checklist");
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
      checked: item.defaultChecked || false,
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
    "10K 跑者專屬配備",
    "SHOCK 舞台劇觀劇必備",
    "衣物穿搭與 3C 用品",
  ];

  const filteredItems = checklist.filter((item) => {
    if (categoryFilter === "全部") return true;
    return item.category === categoryFilter;
  });

  const totalCount = checklist.length;
  const completedCount = checklist.filter((item) => item.defaultChecked).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section id="preparation" className="py-16 sm:py-20 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Trip Readiness & Forecast
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mt-1">
              準備清單 ＆ 天氣概要
            </h2>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              出發前一鍵核對核心證件、跑者防寒配備、劇院觀劇用品，並掌握 11 月底東京秋末氣候與洋蔥式穿搭。
            </p>
          </div>

          {/* Primary View Switcher */}
          <div className="inline-flex p-1 bg-neutral-200/80 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("checklist")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "checklist"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>行前準備清單 ({completedCount}/{totalCount})</span>
            </button>
            <button
              onClick={() => setActiveTab("weather")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === "weather"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>東京秋末氣候與穿搭</span>
            </button>
          </div>
        </div>

        {activeTab === "checklist" ? (
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    行李與行前整備完成率
                  </span>
                  <span className="text-sm font-bold font-mono text-neutral-900 tabular-nums">
                    {completedCount} / {totalCount} 項目完成 ({progressPercent}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-neutral-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleCheckAll}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  全部勾選
                </button>
                <button
                  onClick={handleResetChecklist}
                  className="px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors flex items-center gap-1"
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
                      ? "bg-neutral-900 text-white font-semibold"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Custom Item Form */}
            <form
              onSubmit={handleAddItem}
              className="bg-white rounded-xl border border-neutral-200 p-3.5 flex flex-col sm:flex-row items-center gap-2.5"
            >
              <input
                type="text"
                placeholder="新增自訂清單項目（例如：相機電池、止汗劑、筋膜球...）"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1 text-xs sm:text-sm px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 w-full"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-700 w-full sm:w-auto"
              >
                <option value="重要證件與票券">重要證件與票券</option>
                <option value="10K 跑者專屬配備">10K 跑者專屬配備</option>
                <option value="SHOCK 舞台劇觀劇必備">SHOCK 舞台劇觀劇必備</option>
                <option value="衣物穿搭與 3C 用品">衣物穿搭與 3C 用品</option>
                <option value="個人備品">個人備品</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
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
                        ? "bg-white/60 border-neutral-200 opacity-60"
                        : "bg-white border-neutral-200 hover:border-neutral-300 shadow-xs"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-sm font-bold ${
                            isChecked
                              ? "line-through text-neutral-400"
                              : "text-neutral-900"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[11px] text-neutral-400 shrink-0 font-medium">
                          {item.category}
                        </span>
                      </div>
                      {item.desc && (
                        <p
                          className={`text-xs mt-1 leading-snug ${
                            isChecked ? "text-neutral-400" : "text-neutral-500"
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
        ) : (
          /* Weather Overview Tab */
          <div className="space-y-8">
            {/* Weather Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <Thermometer className="w-4 h-4 text-amber-600" />
                  <span>氣溫範圍 (11/28–29)</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1">
                  {WEATHER_OVERVIEW.nighttempRange} ~ {WEATHER_OVERVIEW.daytempRange}
                </div>
                <div className="text-xs text-neutral-500 mt-1">早晚顯著溫差</div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <Sunrise className="w-4 h-4 text-amber-500" />
                  <span>日出時刻</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1">
                  {WEATHER_OVERVIEW.sunrise}
                </div>
                <div className="text-xs text-neutral-500 mt-1">小網神社晨拜晨光柔和</div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <Sunset className="w-4 h-4 text-rose-500" />
                  <span>日落時刻</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1">
                  {WEATHER_OVERVIEW.sunset}
                </div>
                <div className="text-xs text-neutral-500 mt-1">18:00 起跑已是絕美夜景</div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <Wind className="w-4 h-4 text-sky-600" />
                  <span>東京灣海風</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-neutral-900 mt-1">
                  3–4 級海風
                </div>
                <div className="text-xs text-neutral-500 mt-1">體感比市區低約 2°C</div>
              </div>
            </div>

            {/* Detailed Weather Advisory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Clothing Guide */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                  <Layers className="w-4 h-4" />
                  <span>穿搭守則 · 洋蔥式著裝</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mt-1">
                  日本室內電車極暖 vs 戶外秋風
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  東京 11 月下旬電車與商場暖氣設定在 22–24°C，戶外約 10–14°C，嚴禁穿著單件厚重高領毛衣，務必採用「易脫外層 + 輕便中層」策略。
                </p>

                <div className="mt-5 space-y-3">
                  {WEATHER_OVERVIEW.clothingRecommendation.map((rec, i) => (
                    <div key={i} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-700 leading-relaxed">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Autumn Foliage & Running Weather */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                    <Leaf className="w-4 h-4" />
                    <span>秋季盛況與跑者天候</span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1">
                    銀杏最盛期 ＆ 跑者破風氣溫
                  </h3>

                  <div className="mt-4 space-y-3.5 text-xs text-neutral-600 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block">新宿御苑銀杏黃金大道：</strong>
                        11 月底正值「見頃（最盛觀賞期）」，巨型銀杏樹呈現飽和金黃，地表鋪滿金黃葉毯，攝影採光以 12:30–14:00 順光最佳。
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block">10K 夜跑黃金體感：</strong>
                        晚間 18:00 台場海岸氣溫約 11°C，空氣濕度 50–55%，屬於馬拉松競賽級的絕佳低溫，不易大量出汗，熱身 10 分鐘即可順暢進入配速巡航。
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-neutral-900 block">劇場室內空調：</strong>
                        東京花園劇場內部空氣流通佳，建議劇迷攜帶披肩或針織外套，久坐 2 小時體感較為舒適。
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-400">
                  秋末降雨機率僅 15%，若遇陣雨，有明花園與台場商場地下街多有完整連通道。
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
