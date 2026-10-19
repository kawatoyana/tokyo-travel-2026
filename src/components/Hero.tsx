import React from "react";
import { ArrowDown, Plane, Building2, Footprints, Sparkles, Ticket } from "lucide-react";
import heroImg from "../assets/images/hero_tokyo_autumn_1792382036175.jpg";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#0a070e] text-white">
      {/* Background Image with Theatrical Vignette & Stage Spotlights */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="東京秋末金黃銀杏與都市天際線"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
        />
        {/* Theatrical Curtain & Spotlight Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a070e] via-[#0a070e]/80 to-[#180914]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(245,158,11,0.18),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pt-24 lg:pb-20">
        {/* Theatrical Kicker / Motto */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold tracking-widest uppercase mb-4">
          <span className="text-amber-400 font-mono flex items-center gap-1.5">
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            <span>SHOW MUST GO ON</span>
          </span>
          <span className="text-rose-500" aria-hidden="true">·</span>
          <span className="text-rose-200">2026/11/28（六）– 11/29（日）</span>
          <span className="text-rose-500" aria-hidden="true">·</span>
          <span className="text-amber-300/90">48H 極致週末劇院遠征</span>
        </div>

        {/* Hero Title with Theatrical Grandeur */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
          台北東京秋末漫遊
          <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-100 drop-shadow-sm">
            Endless SHOCK 舞台劇 ＆ 東京灣 10K
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-5 text-base sm:text-lg text-rose-100/80 max-w-2xl leading-relaxed">
          雙人同行專屬東京劇院週末企劃：一人沉醉於東京花園劇場《SHOCK》的萬丈狂瀾與高空飛越，一人馳騁於台場彩虹大橋的 10 公里海風夜跑；次日一同漫步日本橋下町小網神社、品嚐百年花山寬烏龍麵，午後沉浸於新宿御苑金黃銀杏與楓紅水影。
        </p>

        {/* Action Buttons with Theatrical Styling */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#itinerary"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-neutral-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-200 hover:to-amber-300 rounded-lg transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
          >
            <span>瀏覽第一幕・每日時間表</span>
            <ArrowDown className="w-4 h-4 text-neutral-900" />
          </a>
          <a
            href="#routes"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-rose-200 bg-rose-950/60 hover:bg-rose-900/70 border border-rose-800/80 rounded-lg transition-all shadow-md shadow-rose-950/40 whitespace-nowrap"
          >
            <Footprints className="w-4 h-4 text-amber-400" />
            <span>查看 10K 夜跑航跡圖</span>
          </a>
        </div>

        {/* Theatrical Ticket-Style KPI Strip */}
        <div className="mt-14 pt-8 border-t border-rose-900/40 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-900/50 flex items-start gap-3">
            <Plane className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-medium text-rose-300/80">酷航早去晚回</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                TR866 06:50 / TR875 19:45
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1">淺草線直通免搬行李</div>
            </div>
          </div>

          <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-900/50 flex items-start gap-3">
            <Building2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-medium text-rose-300/80">核心下町宿泊</div>
              <div className="text-sm font-bold text-white mt-0.5">
                VIA INN PRIME 人形町
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1">水天之湯頂樓大浴場</div>
            </div>
          </div>

          <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-900/50 flex items-start gap-3">
            <Footprints className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-medium text-rose-300/80">東京灣 10K 夜跑</div>
              <div className="text-sm font-bold text-white mt-0.5 font-mono">
                10.0 KM 零折返環線
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1">有明 → 台場 → 青海</div>
            </div>
          </div>

          <div className="p-3.5 bg-rose-950/30 rounded-xl border border-rose-900/50 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-[11px] font-medium text-rose-300/80">秋日雙重盛宴</div>
              <div className="text-sm font-bold text-white mt-0.5">
                SHOCK 劇院 ＆ 新宿御苑
              </div>
              <div className="text-[11px] text-amber-300/80 mt-1">金黃銀杏 ＆ 楓紅見頃</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
