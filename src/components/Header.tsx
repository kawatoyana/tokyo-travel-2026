import React from "react";
import { Compass, Printer } from "lucide-react";
import { SparkleDoodle } from "./CuteDoodles";

interface HeaderProps {
  onPrint?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#eee4e7] transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Magazine Masthead - Guaranteed No Awkward Wrap on Mobile */}
        <a
          href="#"
          className="group flex items-center gap-2 sm:gap-2.5 text-[#332a2c] transition-opacity hover:opacity-90 shrink-0 min-w-0"
        >
          <div className="w-8 h-8 rounded-2xl bg-[#fdf2f4] border border-[#f5d9df] flex items-center justify-center text-[#992545] shadow-2xs transition-transform duration-300 group-hover:rotate-6 shrink-0">
            <Compass className="w-4 h-4 text-[#992545] stroke-[2.2]" />
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2 shrink-0">
            {/* Title: whitespace-nowrap prevents '台北東 / 京' wrap bug on mobile */}
            <span className="font-extrabold tracking-tight text-[#2d2527] text-base sm:text-lg whitespace-nowrap">
              台北東京
            </span>
            <span className="text-[11px] sm:text-xs text-[#786b6f] font-medium tracking-wider whitespace-nowrap">
              2026 散策手帖
            </span>
            <SparkleDoodle className="w-3.5 h-3.5 text-[#e0758e] hidden md:inline-block" />
          </div>
        </a>

        {/* Right Info: Responsive Date Badge & Discreet Print Icon */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile compact date pill */}
          <span className="inline-block sm:hidden text-[11px] font-mono font-medium text-[#6e5d62] bg-[#fbf3f5] px-2 py-0.5 rounded-full border border-[#f2dde2] whitespace-nowrap">
            11.28–29
          </span>

          {/* Desktop full date pill */}
          <span className="hidden sm:inline-block text-xs font-mono font-medium text-[#6e5d62] bg-[#fbf3f5] px-3 py-1 rounded-full border border-[#f2dde2] whitespace-nowrap">
            11.28 Sat — 11.29 Sun
          </span>

          {/* Discreet Print / PDF icon */}
          <button
            onClick={() => {
              if (onPrint) onPrint();
              else window.print();
            }}
            title="列印或另存行程 PDF"
            className="p-1.5 text-[#8c7b80] hover:text-[#992545] hover:bg-[#fbf3f5] rounded-full transition-all shrink-0"
            aria-label="列印或另存行程"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
