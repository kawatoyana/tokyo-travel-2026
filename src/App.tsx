import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ItinerarySection } from "./components/ItinerarySection";
import { RouteMapSection } from "./components/RouteMapSection";
import { AttractionsSection } from "./components/AttractionsSection";
import { FlightHotelSection } from "./components/FlightHotelSection";
import { PackingWeatherSection } from "./components/PackingWeatherSection";
import { Footer } from "./components/Footer";
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
    <div className="min-h-screen bg-[#0a070e] text-neutral-100 font-sans selection:bg-rose-900 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Header onPrint={handlePrint} />

      {/* Hero Visual Section */}
      <Hero />

      {/* Main Content Sections */}
      <main>
        {/* Daily Detailed Schedule (Major Event Cards & Compact Transit Connectors) */}
        <ItinerarySection />

        {/* Chronological Attractions & Dining Guide (Strictly Sorted 1 to 8) */}
        <AttractionsSection />

        {/* Flight & Hotel Logistics */}
        <FlightHotelSection />

        {/* 10K Running Route & Walking Navigation */}
        <RouteMapSection />

        {/* Meteorological Forecast & Packing Checklist */}
        <PackingWeatherSection />
      </main>

      {/* Theatrical Footer */}
      <Footer />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="回到頂部"
          className="fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-r from-rose-900 to-rose-800 text-amber-200 border border-amber-500/50 rounded-full shadow-lg shadow-rose-950/80 hover:from-rose-800 hover:to-rose-700 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
