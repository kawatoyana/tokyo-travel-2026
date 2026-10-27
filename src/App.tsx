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
import { ArrowUp } from "lucide-react";

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
