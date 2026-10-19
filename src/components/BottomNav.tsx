import React, { useState, useEffect } from "react";
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

export const BottomNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("itinerary");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(item.id);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      // Calculate top offset for clean breathing room below sticky header
      const headerOffset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      aria-label="底部主要快速導航"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-6 gap-1 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "text-stone-900 bg-stone-100 font-semibold"
                    : "text-stone-500 hover:text-stone-800 hover:bg-stone-50/80"
                }`}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute top-1 w-1 h-1 rounded-full bg-amber-600" />
                )}

                <div
                  className={`transition-transform duration-200 ${
                    isActive ? "scale-110 -translate-y-0.5 text-stone-900" : "group-hover:scale-105"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-amber-700 stroke-[2.2]" : "text-stone-500 stroke-[1.8]"
                    }`}
                  />
                </div>

                <span className="text-[11px] sm:text-xs mt-1 tracking-tight truncate leading-tight">
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
