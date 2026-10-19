import React from "react";
import { Sparkles, ShieldCheck, Ticket } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07050a] text-neutral-400 py-12 border-t border-rose-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-rose-950/60">
          {/* Brand & Purpose */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 text-white font-black text-base">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              </div>
              <span className="tracking-wide">台北東京 2026 · Endless SHOCK 舞台劇 ＆ 東京灣 10K</span>
            </div>
            <p className="mt-2 text-xs text-rose-300/70 leading-relaxed">
              2026/11/28–11/29 雙人週末專屬旅行手冊。整合 Endless SHOCK 舞台劇時程、台場海濱 10K 零折返跑步航線、日本橋下町美食散策與新宿御苑賞楓導覽。
            </p>
            <div className="mt-3 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>SHOW MUST GO ON — 經典傳奇謝幕之旅</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs">
            <div>
              <div className="text-white font-bold mb-2.5 tracking-wider font-mono text-amber-300">
                幕次索引
              </div>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a href="#itinerary" className="hover:text-amber-300 transition-colors">
                    第一幕 有明・SHOCK・10K
                  </a>
                </li>
                <li>
                  <a href="#itinerary" className="hover:text-amber-300 transition-colors">
                    第二幕 小網神社・花山烏龍麵
                  </a>
                </li>
                <li>
                  <a href="#routes" className="hover:text-amber-300 transition-colors">
                    10K 東京灣航跡圖
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-bold mb-2.5 tracking-wider font-mono text-amber-300">
                旅行與住宿
              </div>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a href="#flights-hotel" className="hover:text-amber-300 transition-colors">
                    酷航 TR866 / TR875
                  </a>
                </li>
                <li>
                  <a href="#flights-hotel" className="hover:text-amber-300 transition-colors">
                    VIA INN PRIME 人形町
                  </a>
                </li>
                <li>
                  <a href="#attractions" className="hover:text-amber-300 transition-colors">
                    新宿御苑金秋銀杏
                  </a>
                </li>
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="max-w-xs">
              <div className="text-white font-bold mb-2.5 flex items-center gap-1.5 text-amber-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <span>日本緊急求助熱線</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-400">
                <li>日本觀光廳專線 (中英日)：050-3816-2720</li>
                <li>警匪報案：110 · 火警急救救護車：119</li>
                <li>駐日代表處急難救助：080-1009-7179</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © 2026 台北東京秋末旅行指南 · SHOW MUST GO ON
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-amber-400/80">Taipei ⇄ Tokyo · 48H Theatrical Expedition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
