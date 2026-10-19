import React from "react";
import { Compass } from "lucide-react";

interface HeaderProps {
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Compass className="w-5 h-5 text-amber-700 shrink-0" />
          <span>台北東京 2026</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
          <a
            href="#itinerary"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            每日行程
          </a>
          <a
            href="#attractions"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            景點導覽
          </a>
          <a
            href="#flights-hotel"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            航班住宿
          </a>
          <a
            href="#routes"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            10K 與導航圖
          </a>
          <a
            href="#preparation"
            className="hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            清單與天氣
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
            className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            列印 / 存為 PDF
          </button>
        </div>
      </div>
    </header>
  );
};
