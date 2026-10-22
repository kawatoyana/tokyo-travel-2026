import React from "react";
import { Compass, ShieldCheck } from "lucide-react";
import { SparkleDoodle } from "./CuteDoodles";

interface FooterProps {
  onNavigate?: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(tabId);
    } else {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-[#2a2025] text-[#b8a6ad] py-14 border-t border-[#3d2f36]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 pb-10 border-b border-[#3d2f36]">
          {/* Brand & Purpose */}
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 text-[#fceeed] font-bold text-base">
              <div className="w-7 h-7 rounded-2xl bg-[#3f3038] border border-[#543e4a] flex items-center justify-center text-pink-300">
                <Compass className="w-4 h-4" />
              </div>
              <span>台北東京 2026 散策記</span>
              <SparkleDoodle className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <p className="mt-2.5 text-xs text-[#9e8b92] leading-relaxed">
              2026/11/28–11/29 雙人東京 2 天 1 夜行程指南。包含酷航早去晚回班次、有明花園購物、SHOCK 舞台劇、台場海濱 10K 路跑、人形町小網神社參拜與新宿御苑金秋銀杏紅葉。
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-8 text-xs">
            <div>
              <div className="text-[#fceeed] font-bold mb-2.5">
                行程導覽
              </div>
              <ul className="space-y-1.5 text-[#9e8b92]">
                <li>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, "itinerary")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    每日行程時間表
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, "attractions")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    精選景點與美饌導覽
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, "routes")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    10K 路線軌跡 ＆ 離線地圖
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-[#fceeed] font-bold mb-2.5">
                住宿與準備
              </div>
              <ul className="space-y-1.5 text-[#9e8b92]">
                <li>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, "flight-hotel")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    酷航航班 ＆ VIA INN 人形町
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, "checklist")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    行前行李準備清單
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={(e) => handleNavClick(e, "weather")}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    東京天氣概要與氣象預報
                  </button>
                </li>
              </ul>
            </div>

            {/* Emergency Contacts */}
            <div className="max-w-xs">
              <div className="text-[#fceeed] font-bold mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-pink-300" />
                <span>日本緊急求助電話</span>
              </div>
              <ul className="space-y-1 text-xs text-[#9e8b92]">
                <li>日本觀光廳專線 (中英日)：050-3816-2720</li>
                <li>警匪報案：110 · 火警急救救護車：119</li>
                <li>駐日代表處急難救助：080-1009-7179</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8c777e]">
          <div>
            © 2026 台北東京旅行指南 · 祝您散策愉快、旅途平安！
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[#8c777e]">Taipei ⇄ Tokyo · 48H Trip</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
