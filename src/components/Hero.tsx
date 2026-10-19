import React from "react";
import { ArrowDown, Plane, Building2, Footprints, Sparkles } from "lucide-react";
import heroImg from "../assets/images/hero_tokyo_autumn_1792382036175.jpg";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="東京秋末金黃銀杏與都市天際線"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-20">
        {/* Unboxed Metadata Header */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase mb-4">
          <span>2026/11/28（六）– 11/29（日）</span>
          <span aria-hidden="true">·</span>
          <span>極致 2 天 1 夜</span>
          <span aria-hidden="true">·</span>
          <span>台北 ⇄ 東京成田</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          台北東京秋末漫遊
          <span className="block text-amber-200 mt-1">
            SHOCK 舞台劇 ＆ 東京灣 10K 夜跑
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-5 text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
          雙人同行專屬東京週末企劃：一人沉醉於東京花園劇場的《SHOCK》舞台劇狂瀾，一人馳騁於台場彩虹大橋的 10 公里海風夜跑；次日一同探訪日本橋下町小網神社、品嚐百年花山寬烏龍麵，最後漫步新宿御苑金黃銀杏與楓紅水影。
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#itinerary"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <span>瀏覽每日時間表</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#routes"
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>查看 10K 跑步路線圖</span>
          </a>
        </div>

        {/* Full-width KPI Strip Below Hero Split */}
        <div className="mt-14 pt-8 border-t border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Plane className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-neutral-400">酷航早去晚回</div>
              <div className="text-sm font-semibold text-white mt-0.5 tabular-nums">
                TR866 06:50 / TR875 19:45
              </div>
              <div className="text-xs text-neutral-400 mt-1">淺草線直通免轉車</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-neutral-400">核心下町住宿</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                VIA INN PRIME 人形町
              </div>
              <div className="text-xs text-neutral-400 mt-1">頂樓「水天之湯」大浴場</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Footprints className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-neutral-400">海風夜跑路線</div>
              <div className="text-sm font-semibold text-white mt-0.5 tabular-nums">
                10.0 公里無折返環線
              </div>
              <div className="text-xs text-neutral-400 mt-1">有明 → 台場 → 青海</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs text-neutral-400">秋季極致亮點</div>
              <div className="text-sm font-semibold text-white mt-0.5">
                新宿御苑 ＆ 小網神社
              </div>
              <div className="text-xs text-neutral-400 mt-1">黃金銀杏與強運洗錢弁天</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
