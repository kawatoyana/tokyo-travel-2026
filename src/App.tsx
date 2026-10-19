import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ItinerarySection } from "./components/ItinerarySection";
import { AttractionsSection } from "./components/AttractionsSection";
import { FlightHotelSection } from "./components/FlightHotelSection";
import { RouteMapSection } from "./components/RouteMapSection";
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Bar Navigation */}
      <Header onPrint={handlePrint} />

      {/* Hero Visual Section */}
      <Hero />

      {/* Main Content Sections */}
      <main>
        {/* Daily Detailed Schedule */}
        <ItinerarySection />

        {/* Chronological Attractions & Dining Guide (Strictly Sorted 1 to 8 with real photos) */}
        <AttractionsSection />

        {/* Flight & Hotel Logistics */}
        <FlightHotelSection />

        {/* 10K Running Route & Walking Navigation */}
        <RouteMapSection />

        {/* Meteorological Forecast & Packing Checklist */}
        <PackingWeatherSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="回到頂部"
          className="fixed bottom-6 right-6 z-40 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
