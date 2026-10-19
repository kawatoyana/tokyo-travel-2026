import React from "react";
import { Compass, PhoneCall, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 py-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-neutral-800/80">
          {/* Brand & Purpose */}
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Compass className="w-5 h-5 text-amber-500" />
              <span>台北東京 2026 秋末漫遊與東京灣 10K</span>
            </div>
            <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
              2026/11/28–11/29 雙人週末專屬旅行手冊。整合 Endless SHOCK 舞台劇時程、台場海濱 10K 零折返跑步航線、日本橋下町美食散策與新宿御苑賞楓導航。
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs">
            <div>
              <div className="text-white font-semibold mb-2.5">行程索引</div>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a href="#itinerary" className="hover:text-white transition-colors">
                    Day 1 有明・SHOCK・10K
                  </a>
                </li>
                <li>
                  <a href="#itinerary" className="hover:text-white transition-colors">
                    Day 2 日本橋・新宿御苑
                  </a>
                </li>
                <li>
                  <a href="#routes" className="hover:text-white transition-colors">
                    10K 東京灣航跡圖
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-2.5">旅行資訊</div>
              <ul className="space-y-1.5 text-neutral-400">
                <li>
                  <a href="#flights-hotel" className="hover:text-white transition-colors">
                    酷航 TR866 / TR875
                  </a>
                </li>
                <li>
                  <a href="#flights-hotel" className="hover:text-white transition-colors">
                    VIA INN PRIME 人形町
                  </a>
                </li>
                <li>
                  <a href="#attractions" className="hover:text-white transition-colors">
                    小網神社 ＆ 花山烏龍麵
                  </a>
                </li>
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="max-w-xs">
              <div className="text-white font-semibold mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © 2026 台北東京秋末旅行指南 · 旅程愉快，祝跑出佳績、平安順利！
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">Taipei ⇄ Tokyo · 48H Expedition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
