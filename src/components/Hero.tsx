import React from "react";
import { ArrowDown, Plane, Building2, Footprints, Sparkles, Navigation } from "lucide-react";
import { SmartImage } from "./SmartImage";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f7f5f0] via-[#faf9f6] to-[#f4f2ec] border-b border-stone-200/80">
      {/* Background Decorative Texture with Soft Autumn Photography */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <SmartImage
          src="./images/hero_tokyo_autumn.jpg"
          fallbackSrc="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1920&q=80"
          alt="東京秋末金黃銀杏與都市天際線"
          className="w-full h-full object-cover mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f2ec] via-[#f7f5f0]/80 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Date & Tag Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-900 text-stone-100 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            2026/11/28（六）– 11/29（日）
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-900 border border-amber-200/60">
            週末 2 天 1 夜
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/80 text-stone-700 border border-stone-200/80 backdrop-blur-xs">
            台北 ⇄ 東京
          </span>
        </div>

        {/* Hero Title */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.2]">
            台北東京週末快閃旅行
            <span className="block text-xl sm:text-2xl lg:text-3xl font-semibold text-amber-800 mt-2">
              有明購物・SHOCK 舞台劇・東京灣 10K 跑步・新宿御苑
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
            台北出發東京 2 天 1 夜行程指南：週六搭乘酷航早班機抵達，直通人形町寄放行李，午後前往有明花園購物並享用利久牛舌晚餐；傍晚一人欣賞 SHOCK 舞台劇、一人完成台場 10 公里海濱路跑；週日漫步人形町參拜小網神社、品嚐花山烏龍麵，午後探訪新宿御苑金秋銀杏與紅葉。
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#itinerary"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
          >
            <span>瀏覽每日行程表</span>
            <ArrowDown className="w-4 h-4 text-amber-300" />
          </a>
          <a
            href="#routes"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-200/80 rounded-xl transition-all duration-300 shadow-xs hover:shadow-sm hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Navigation className="w-4 h-4 text-stone-600" />
            <span>查看 10K 路線 ＆ 下載離線 PDF</span>
          </a>
        </div>

        {/* Floating KPI Cards Strip */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Plane className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-500">酷航航班</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 font-mono">
              TR866 / TR875
            </div>
            <div className="text-xs text-stone-500 mt-1">
              早去晚回 · 淺草線直通成田
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-sky-700">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-500">住宿飯店</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 truncate">
              VIA INN 日本橋人形町
            </div>
            <div className="text-xs text-stone-500 mt-1">
              頂樓「水天之湯」大浴場
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Footprints className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-500">東京灣夜跑</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 font-mono">
              10.0 公里環線
            </div>
            <div className="text-xs text-stone-500 mt-1">
              有明 → 台場 → 青海零折返
            </div>
          </div>

          <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-500">經典名所</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-stone-900 truncate">
              小網神社 ＆ 新宿御苑
            </div>
            <div className="text-xs text-stone-500 mt-1">
              強運御守・百年花山寬麵
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
