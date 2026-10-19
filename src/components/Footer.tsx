import React from "react";
import { Compass, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Purpose */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center text-white">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span>台北東京 2026 週末快閃之旅</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              2026/11/28–11/29 雙人東京 2 天 1 夜行程指南。包含酷航早去晚回、有明花園購物、SHOCK 舞台劇、台場海濱 10K 路跑、人形町小網神社與新宿御苑賞楓。
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs">
            <div>
              <div className="text-white font-semibold mb-2.5">
                行程導覽
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <a href="#itinerary" className="hover:text-white transition-colors">
                    Day 1 有明・SHOCK・10K 路跑
                  </a>
                </li>
                <li>
                  <a href="#itinerary" className="hover:text-white transition-colors">
                    Day 2 人形町小網神社・新宿御苑
                  </a>
                </li>
                <li>
                  <a href="#routes" className="hover:text-white transition-colors">
                    10K 東京灣跑步航跡圖
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-white font-semibold mb-2.5">
                航班與住宿
              </div>
              <ul className="space-y-1.5 text-slate-400">
                <li>
                  <a href="#flights-hotel" className="hover:text-white transition-colors">
                    酷航 TR866 / TR875
                  </a>
                </li>
                <li>
                  <a href="#flights-hotel" className="hover:text-white transition-colors">
                    VIA INN PRIME 日本橋人形町
                  </a>
                </li>
                <li>
                  <a href="#attractions" className="hover:text-white transition-colors">
                    精選景點與美饌導覽
                  </a>
                </li>
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="max-w-xs">
              <div className="text-white font-semibold mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>日本緊急求助電話</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                <li>日本觀光廳專線 (中英日)：050-3816-2720</li>
                <li>警匪報案：110 · 火警急救救護車：119</li>
                <li>駐日代表處急難救助：080-1009-7179</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 台北東京旅行指南 · 祝旅程平安順利！
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono">Taipei ⇄ Tokyo · 48H Trip</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
