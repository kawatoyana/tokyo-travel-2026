import React from "react";
import { Compass, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-stone-800/80">
          {/* Brand & Purpose */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center text-amber-300 border border-stone-600">
                <Compass className="w-4 h-4" />
              </div>
              <span>台北東京 2026 週末旅行指南</span>
            </div>
            <p className="mt-2.5 text-xs text-stone-400 leading-relaxed">
              2026/11/28–11/29 雙人東京 2 天 1 夜行程指南。包含酷航早去晚回班次、有明花園購物、SHOCK 舞台劇、台場海濱 10K 路跑、人形町小網神社參拜與新宿御苑金秋銀杏紅葉。
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs">
            <div>
              <div className="text-stone-200 font-bold mb-2.5">
                行程與導航
              </div>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <a href="#itinerary" className="hover:text-white transition-colors">
                    每日行程時間表
                  </a>
                </li>
                <li>
                  <a href="#attractions" className="hover:text-white transition-colors">
                    精選景點與美饌導覽
                  </a>
                </li>
                <li>
                  <a href="#routes" className="hover:text-white transition-colors">
                    10K 路線地圖 ＆ 離線 PDF
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-stone-200 font-bold mb-2.5">
                住宿與準備
              </div>
              <ul className="space-y-1.5 text-stone-400">
                <li>
                  <a href="#flight-hotel" className="hover:text-white transition-colors">
                    酷航航班 ＆ VIA INN 人形町
                  </a>
                </li>
                <li>
                  <a href="#checklist" className="hover:text-white transition-colors">
                    行前行李準備清單
                  </a>
                </li>
                <li>
                  <a href="#weather" className="hover:text-white transition-colors">
                    東京天氣概要與氣象預報
                  </a>
                </li>
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="max-w-xs">
              <div className="text-stone-200 font-bold mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>日本緊急求助電話</span>
              </div>
              <ul className="space-y-1 text-xs text-stone-400">
                <li>日本觀光廳專線 (中英日)：050-3816-2720</li>
                <li>警匪報案：110 · 火警急救救護車：119</li>
                <li>駐日代表處急難救助：080-1009-7179</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 台北東京旅行指南 · 祝您旅程順利平安！
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-stone-500">Taipei ⇄ Tokyo · 48H Trip</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
