import React from "react";
import {
  Calendar,
  Compass,
  Building2,
  Route,
  ListChecks,
  CloudSun,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: "itinerary", label: "每日行程", shortLabel: "行程", icon: Calendar },
  { id: "attractions", label: "景點介紹", shortLabel: "景點", icon: Compass },
  { id: "flight-hotel", label: "航班住宿", shortLabel: "住行", icon: Building2 },
  { id: "routes", label: "路線導航", shortLabel: "路線", icon: Route },
  { id: "checklist", label: "準備清單", shortLabel: "清單", icon: ListChecks },
  { id: "weather", label: "天氣概要", shortLabel: "天氣", icon: CloudSun },
];

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      aria-label="懸浮快速導覽"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.25rem)] max-w-lg sm:max-w-xl"
    >
      <div className="bg-white/95 backdrop-blur-xl border border-[#ebd8dc] shadow-[0_12px_35px_-8px_rgba(50,30,35,0.14)] rounded-full p-1.5 transition-all">
        <div className="grid grid-cols-6 gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all duration-300 group cursor-pointer ${
                  isActive
                    ? "bg-white text-[#992545] shadow-xs font-bold"
                    : "text-[#7d5f66] hover:text-[#4a383d] hover:bg-white/60"
                }`}
              >
                {/* Active Red Dot Indicator - Exactly synchronized with activeTab */}
                {isActive && (
                  <span className="absolute -top-1 w-2 h-2 rounded-full bg-[#b83358] shadow-[0_0_8px_rgba(184,51,88,0.85)] animate-pulse" />
                )}

                <div
                  className={`transition-transform duration-300 ${
                    isActive ? "scale-110 -translate-y-0.5 text-[#b83358]" : "group-hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${
                      isActive ? "text-[#b83358] stroke-[2.4]" : "text-[#8c606c] stroke-[1.8]"
                    }`}
                  />
                </div>

                <span className="text-[10px] sm:text-xs mt-0.5 tracking-tight truncate leading-tight font-medium">
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="inline sm:hidden">{item.shortLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
