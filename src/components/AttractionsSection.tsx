import React, { useState } from "react";
import { ATTRACTIONS, Attraction } from "../data/tripData";
import {
  MapPin,
  ExternalLink,
  Check,
  Clock,
  Compass,
} from "lucide-react";
import { SmartImage } from "./SmartImage";

export const AttractionsSection: React.FC = () => {
  const [filterDay, setFilterDay] = useState<number | "all">("all");

  const filteredAttractions = ATTRACTIONS.filter((attraction) => {
    if (filterDay === "all") return true;
    return attraction.day === filterDay;
  });

  return (
    <section id="attractions" className="py-16 sm:py-20 bg-[#faf9f6] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-700" />
              <span>Curated Spots & Dining</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              精選景點與美饌導覽
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
              嚴選 8 大精華景點與名物料理，嚴格依照實際行程先後順序排列（第 1 站至第 8 站），附在地實用建議與 Google 地圖導航。
            </p>
          </div>

          {/* Filter Tabs (Interactive Segmented Control) */}
          <div className="inline-flex p-1 bg-stone-200/70 rounded-2xl shrink-0 self-start md:self-auto backdrop-blur-xs">
            <button
              onClick={() => setFilterDay("all")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                filterDay === "all"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              依行程全覽 (1~8 站)
            </button>
            <button
              onClick={() => setFilterDay(1)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                filterDay === 1
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              DAY 1 有明・台場 (1~3 站)
            </button>
            <button
              onClick={() => setFilterDay(2)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                filterDay === 2
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              DAY 2 人形町・新宿 (4~8 站)
            </button>
          </div>
        </div>

        {/* Attractions Grid - Chronological Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map((attraction: Attraction) => {
            return (
              <div
                key={attraction.id}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] group"
              >
                <div>
                  {/* Image Container with SmartImage (Local public image with Unsplash fallback) */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <SmartImage
                      src={attraction.imageSrc}
                      fallbackSrc={attraction.unsplashUrl}
                      alt={attraction.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent pointer-events-none" />

                    {/* Sequential Station Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-stone-900/90 backdrop-blur-md text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-lg shadow-sm">
                      第 {attraction.itineraryOrder} 站
                    </div>

                    {/* Day Tag in Top Right */}
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                      DAY 0{attraction.day}
                    </div>

                    {/* Itinerary Timestamp in Overlay */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span className="truncate">{attraction.itineraryTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-stone-500 font-medium mb-1">
                      <span>{attraction.japaneseName}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                        {attraction.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mt-1">
                      {attraction.name}
                    </h3>

                    {/* Highlight Lead Box */}
                    <p className="mt-3 text-xs font-medium text-amber-950 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
                      {attraction.highlight}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {attraction.description}
                    </p>

                    {/* Address with Google Maps */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-start gap-1.5 text-xs text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{attraction.address}</span>
                    </div>

                    {/* Practical Tips */}
                    <div className="mt-3.5 space-y-2">
                      {attraction.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="leading-snug">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-6 pt-0">
                  <a
                    href={attraction.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200/80 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>開啟 Google Maps 定位導航</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
