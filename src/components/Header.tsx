import React from "react";
import { Sparkles, Printer } from "lucide-react";

interface HeaderProps {
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0d0914]/95 backdrop-blur-md border-b border-rose-950/80 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Zone 1: Theatrical Brand Wordmark */}
        <a
          href="#"
          className="group text-lg font-black tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center shadow-md shadow-rose-950/60 ring-1 ring-amber-400/40">
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-extrabold tracking-wider text-rose-100 group-hover:text-amber-200 transition-colors">
              台北東京 2026
            </span>
            <span className="text-[10px] tracking-widest text-amber-400/90 font-mono font-bold mt-0.5">
              SHOCK & 10K EXPEDITION
            </span>
          </div>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide text-rose-200/80">
          <a
            href="#itinerary"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            幕起・行程時間表
          </a>
          <a
            href="#attractions"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            名所・美食盛宴
          </a>
          <a
            href="#flights-hotel"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            航班住宿
          </a>
          <a
            href="#routes"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            10K 航跡與導航
          </a>
          <a
            href="#preparation"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            實況氣象與清單
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
            className="px-4 py-2 text-xs font-bold text-amber-200 bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 hover:from-rose-800 hover:to-rose-700 border border-amber-500/50 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-md shadow-rose-950/80 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span>列印劇場手冊</span>
          </button>
        </div>
      </div>
    </header>
  );
};
