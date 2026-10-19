import React from "react";
import { Compass, Printer } from "lucide-react";
import { SparkleDoodle } from "./CuteDoodles";

interface HeaderProps {
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eee4e7] transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Magazine Masthead */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-[#332a2c] transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] flex items-center justify-center text-[#992545] shadow-2xs transition-transform duration-300 group-hover:rotate-6">
            <Compass className="w-4 h-4 text-[#992545] stroke-[2.2]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-tight text-[#2d2527] text-base sm:text-lg">
              台北東京
            </span>
            <span className="text-xs text-[#786b6f] font-medium tracking-wider">
              2026 散策手帖
            </span>
            <SparkleDoodle className="w-3.5 h-3.5 text-[#e0758e] hidden sm:inline-block" />
          </div>
        </a>

        {/* Right Info: Subtle Date & Discreet Print Icon */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-[#6e5d62] bg-[#fbf3f5] px-3 py-1 rounded-full border border-[#f2dde2]">
            11.28 Sat — 11.29 Sun
          </span>

          {/* Discreet Print / PDF icon */}
          <button
            onClick={() => {
              if (onPrint) onPrint();
              else window.print();
            }}
            title="列印或另存行程 PDF"
            className="p-1.5 text-[#8c7b80] hover:text-[#992545] hover:bg-[#fbf3f5] rounded-full transition-all"
            aria-label="列印或另存行程"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
