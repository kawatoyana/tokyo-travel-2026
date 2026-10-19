import React from "react";
import { Compass, Printer, Sparkles } from "lucide-react";

interface HeaderProps {
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-stone-900 transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-stone-900 to-stone-700 flex items-center justify-center text-amber-300 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold tracking-tight text-base sm:text-lg">
              <span>台北東京 2026</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-800 rounded-full border border-amber-200/60">
                11/28–11/29
              </span>
            </div>
            <div className="text-[10px] text-stone-500 tracking-wider font-light hidden sm:block">
              TOKYO WEEKEND ITINERARY
            </div>
          </div>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#itinerary"
            className="hover:text-stone-900 transition-colors py-1 hover:border-b-2 hover:border-amber-600"
          >
            每日行程
          </a>
          <a
            href="#attractions"
            className="hover:text-stone-900 transition-colors py-1 hover:border-b-2 hover:border-amber-600"
          >
            景點介紹
          </a>
          <a
            href="#flight-hotel"
            className="hover:text-stone-900 transition-colors py-1 hover:border-b-2 hover:border-amber-600"
          >
            航班住宿
          </a>
          <a
            href="#routes"
            className="hover:text-stone-900 transition-colors py-1 hover:border-b-2 hover:border-amber-600"
          >
            路線導航
          </a>
          <a
            href="#checklist"
            className="hover:text-stone-900 transition-colors py-1 hover:border-b-2 hover:border-amber-600"
          >
            準備清單
          </a>
          <a
            href="#weather"
            className="hover:text-stone-900 transition-colors py-1 hover:border-b-2 hover:border-amber-600"
          >
            天氣概要
          </a>
        </nav>

        {/* Zone 3: Print / Offline Action */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (onPrint) {
                onPrint();
              } else {
                window.print();
              }
            }}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>列印 / 存為 PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
