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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900 pb-20 sm:pb-24">
      {/* Top Bar Navigation */}
      <Header onPrint={handlePrint} />

      {/* Hero Visual Section */}
      <Hero />

      {/* Main Content Sections */}
      <main>
        {/* ① 每日行程 (ID: itinerary) */}
        <ItinerarySection />

        {/* ② 景點介紹 (ID: attractions) */}
        <AttractionsSection />

        {/* ③ 航班及住宿資訊 (ID: flight-hotel) */}
        <FlightHotelSection />

        {/* ④ 每日路線導航圖 (ID: routes) */}
        <RouteMapSection />

        {/* ⑤ 準備清單 (ID: checklist) ＆ ⑥ 天氣概要 (ID: weather) */}
        <PackingWeatherSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav />

      {/* Scroll to Top Floating Button (positioned above bottom nav) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="回到頂部"
          className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 p-2.5 sm:p-3 bg-stone-900/90 text-white backdrop-blur-md rounded-full shadow-lg hover:bg-stone-800 transition-all hover:-translate-y-0.5 focus:outline-hidden"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
        </button>
      )}
    </div>
  );
}
