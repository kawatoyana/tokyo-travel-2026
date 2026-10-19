import React from "react";
import { Compass, Printer } from "lucide-react";

interface HeaderProps {
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <span>台北東京 2026</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#itinerary"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            每日行程
          </a>
          <a
            href="#attractions"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            景點與美食
          </a>
          <a
            href="#flights-hotel"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            航班住宿
          </a>
          <a
            href="#routes"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            10K 路線地圖
          </a>
          <a
            href="#preparation"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            天氣預報與清單
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onPrint) {
                onPrint();
              } else {
                window.print();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>列印行程 / PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
