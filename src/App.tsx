import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ItinerarySection } from "./components/ItinerarySection";
import { AttractionsSection } from "./components/AttractionsSection";
import { FlightHotelSection } from "./components/FlightHotelSection";
import { RouteMapSection } from "./components/RouteMapSection";
import { PackingWeatherSection } from "./components/PackingWeatherSection";
import { Footer } from "./components/Footer";
import { BottomNav } from "./components/BottomNav";
import { ArrowUp, ArrowLeft } from "lucide-react";

const TAB_TITLES: Record<string, string> = {
  itinerary: "每日行程・2天1夜時間表",
  attractions: "精選景點・舞台劇與美饌",
  "flight-hotel": "航班住宿・酷航與人形町飯店",
  routes: "路線導航・台場 10K 路線地圖",
  checklist: "準備清單・行李與手提打包",
  weather: "天氣概要・東京連線氣象預報",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoHome = () => {
    setActiveTab("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#332a2c] font-sans selection:bg-[#fde2e8] selection:text-[#8e2443] pb-24 sm:pb-28">
      {/* Top Global Header (Fixed across all views) */}
      <Header
        onPrint={handlePrint}
        onGoHome={handleGoHome}
        activeTab={activeTab}
      />

      {/* Breadcrumb Bar when viewing specific tab page */}
      {activeTab !== "home" && (
        <div className="bg-white/80 border-b border-[#eee4e7] backdrop-blur-xs sticky top-[57px] z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center gap-1.5 font-bold text-[#8e2443] hover:text-[#5f132a] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>返回首頁</span>
            </button>
            <span className="font-semibold text-[#5a484e] bg-[#fdf2f4] px-2.5 py-0.5 rounded-full border border-[#f5d9df] text-[11px] truncate max-w-[200px] sm:max-w-none">
              {TAB_TITLES[activeTab] || "行程專欄"}
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Main Content: Tab Isolated SPA Architecture */}
      <main className="transition-opacity duration-300">
        {/* Default View: Home Hero & Features Portal */}
        {activeTab === "home" && <Hero onNavigate={handleSelectTab} />}

        {/* ① 每日行程 (ID: itinerary) */}
        {activeTab === "itinerary" && <ItinerarySection />}

        {/* ② 景點介紹 (ID: attractions) */}
        {activeTab === "attractions" && <AttractionsSection />}

        {/* ③ 航班及住宿資訊 (ID: flight-hotel) */}
        {activeTab === "flight-hotel" && <FlightHotelSection />}

        {/* ④ 每日路線導航圖 (ID: routes) */}
        {activeTab === "routes" && <RouteMapSection />}

        {/* ⑤ 準備清單 (ID: checklist) */}
        {activeTab === "checklist" && (
          <PackingWeatherSection viewMode="checklist" />
        )}

        {/* ⑥ 天氣概要 (ID: weather) */}
        {activeTab === "weather" && (
          <PackingWeatherSection viewMode="weather" />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleSelectTab} />

      {/* Fixed Floating Bottom Navigation Bar (Synchronized with activeTab) */}
      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="返回頂端"
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 p-2.5 sm:p-3 bg-[#fff8fa]/95 text-[#a82a51] border border-[#f5cfd9] rounded-full shadow-[0_4px_18px_rgba(180,70,95,0.18)] hover:bg-[#ffeef3] hover:border-[#ea9fb2] hover:shadow-[0_6px_22px_rgba(180,70,95,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md focus:outline-hidden cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#b83358]" />
        </button>
      )}
    </div>
  );
}
