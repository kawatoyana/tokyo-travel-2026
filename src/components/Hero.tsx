import React from "react";
import { ArrowDown, Plane, Building2, Footprints, Sparkles } from "lucide-react";
import heroImg from "../assets/images/hero_tokyo_autumn_1792382036175.jpg";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Image with soft contrast overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="東京秋末金黃銀杏與都市天際線"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-900/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 lg:pt-20 lg:pb-16">
        {/* Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-amber-300 uppercase mb-3">
          <span>2026/11/28（六）– 11/29（日）</span>
          <span aria-hidden="true">·</span>
          <span>2 天 1 夜週末行程</span>
          <span aria-hidden="true">·</span>
          <span>台北 ⇄ 東京</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
          台北東京週末快閃之旅
          <span className="block text-amber-200 mt-1">
            有明購物・SHOCK 舞台劇・東京灣 10K 跑步・新宿御苑
          </span>
        </h1>

        {/* Natural, Realistic Travel Description */}
        <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
          台北出發東京 2 天 1 夜行程指南：週六搭乘酷航早班機抵達，前往有明花園購物、享用利久牛舌，傍晚一人欣賞 SHOCK 舞台劇、一人完成台場 10 公里海濱路跑；週日漫步人形町參拜小網神社、品嚐花山烏龍麵，午後探訪新宿御苑金秋銀杏與紅葉。
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#itinerary"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <span>查看每日行程時間表</span>
            <ArrowDown className="w-4 h-4 text-slate-950" />
          </a>
          <a
            href="#routes"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>查看 10K 跑步路線圖</span>
          </a>
        </div>

        {/* KPI Strip Below Hero */}
        <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-slate-300 font-medium">酷航航班</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                TR866 / TR875
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">早去晚回・淺草線直通</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-slate-300 font-medium">下榻飯店</div>
              <div className="text-sm font-bold text-white mt-0.5">
                VIA INN PRIME 人形町
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">頂樓「水天之湯」大浴場</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Footprints className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-slate-300 font-medium">東京灣海濱路跑</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                10.0 公里環線
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">有明 → 台場 → 青海</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-slate-300 font-medium">重點景點</div>
              <div className="text-sm font-bold text-white mt-0.5">
                小網神社 ＆ 新宿御苑
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">強運御守・黃金銀杏大道</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
