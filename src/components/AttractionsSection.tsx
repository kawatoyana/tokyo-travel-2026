import React, { useState } from "react";
import { ATTRACTIONS, Attraction } from "../data/tripData";
import {
  MapPin,
  ExternalLink,
  Check,
  Clock,
} from "lucide-react";

export const AttractionsSection: React.FC = () => {
  const [filterDay, setFilterDay] = useState<number | "all">("all");

  const filteredAttractions = ATTRACTIONS.filter((attraction) => {
    if (filterDay === "all") return true;
    return attraction.day === filterDay;
  });

  return (
    <section id="attractions" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-700">
              Curated Spots & Dining
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              精選景點與美饌導覽
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              依照實際行程先後順序排序（第 1 站至第 8 站），搭配現場實拍照片、實用建議與 Google 地圖導航。
            </p>
          </div>

          {/* Filter Tabs (Interactive Segmented Control) */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setFilterDay("all")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                filterDay === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              依行程全覽 (1~8 站)
            </button>
            <button
              onClick={() => setFilterDay(1)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                filterDay === 1
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              DAY 1 有明・台場 (1~3 站)
            </button>
            <button
              onClick={() => setFilterDay(2)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                filterDay === 2
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              DAY 2 人形町・日本橋・新宿 (4~8 站)
            </button>
          </div>
        </div>

        {/* Attractions Grid - Chronological Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredAttractions.map((attraction: Attraction) => {
            return (
              <div
                key={attraction.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-sm group"
              >
                <div>
                  {/* Image Container with Fallback */}
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img
                      src={attraction.imageSrc}
                      alt={attraction.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                    {/* Sequential Station Badge */}
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-amber-300 text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-xs">
                      第 {attraction.itineraryOrder} 站
                    </div>

                    {/* Day Tag in Top Right */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                      DAY 0{attraction.day}
                    </div>

                    {/* Itinerary Timestamp in Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow">
                      <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{attraction.itineraryTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <div className="text-xs text-slate-500 font-medium">
                      {attraction.japaneseName}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {attraction.name}
                    </h3>

                    {/* Highlight Lead Prose */}
                    <p className="mt-2 text-xs font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60 leading-relaxed">
                      {attraction.highlight}
                    </p>

                    {/* Long Description */}
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {attraction.description}
                    </p>

                    {/* Address with Google Maps */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{attraction.address}</span>
                    </div>

                    {/* Practical Tips */}
                    <div className="mt-3 space-y-1.5">
                      {attraction.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                          <span className="leading-snug">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="p-5 pt-0">
                  <a
                    href={attraction.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <span>開啟 Google Maps 定位</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
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
