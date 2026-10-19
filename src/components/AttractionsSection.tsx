import React, { useState } from "react";
import { ATTRACTIONS, Attraction } from "../data/tripData";
import {
  MapPin,
  ExternalLink,
  Sparkles,
  Check,
  Clock,
  Ticket,
} from "lucide-react";

export const AttractionsSection: React.FC = () => {
  const [filterDay, setFilterDay] = useState<number | "all">("all");

  const filteredAttractions = ATTRACTIONS.filter((attraction) => {
    if (filterDay === "all") return true;
    return attraction.day === filterDay;
  });

  return (
    <section id="attractions" className="py-16 sm:py-20 bg-[#0a070e] text-neutral-100 border-b border-rose-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 font-mono">
              <Ticket className="w-3.5 h-3.5" />
              <span>CHRONOLOGICAL DESTINATIONS & FEAST</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              精選景點與美饌導覽
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
              嚴格依照行程時間先後順序排列（第 1 站至第 8 站）：灣岸劇院舞台、炭烤牛舌、海風 10K 夜跑、下町強運小網神社、黑糖吐司早餐、百年鹽煎餅、寬烏龍麵與新宿御苑金秋銀杏。
            </p>
          </div>

          {/* Filter Tabs (Interactive Segmented Control in SHOCK style) */}
          <div className="inline-flex p-1 bg-[#160f22] border border-rose-900/60 rounded-xl shrink-0 self-start md:self-auto shadow-inner">
            <button
              onClick={() => setFilterDay("all")}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                filterDay === "all"
                  ? "bg-rose-900 text-amber-200 border border-amber-500/50 shadow-md shadow-rose-950/80"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              依行程全覽 (1~8 站)
            </button>
            <button
              onClick={() => setFilterDay(1)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                filterDay === 1
                  ? "bg-rose-900 text-amber-200 border border-amber-500/50 shadow-md shadow-rose-950/80"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              DAY 1 有明・台場 (1~3 站)
            </button>
            <button
              onClick={() => setFilterDay(2)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                filterDay === 2
                  ? "bg-rose-900 text-amber-200 border border-amber-500/50 shadow-md shadow-rose-950/80"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              DAY 2 日本橋・新宿 (4~8 站)
            </button>
          </div>
        </div>

        {/* Attractions Grid - Chronological Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredAttractions.map((attraction: Attraction) => {
            return (
              <div
                key={attraction.id}
                className="bg-[#140e1e] rounded-2xl border border-rose-950/80 hover:border-amber-500/50 overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-rose-950/60 group"
              >
                <div>
                  {/* Image Container with Fallback */}
                  <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
                    <img
                      src={attraction.imageSrc}
                      alt={attraction.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140e1e] via-[#140e1e]/40 to-transparent pointer-events-none" />

                    {/* Order & Sequence Badge */}
                    <div className="absolute top-3 left-3 bg-[#0a070e]/90 backdrop-blur-md border border-amber-500/60 text-amber-300 text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-md">
                      STEP 0{attraction.itineraryOrder}
                    </div>

                    {/* Day tag in top right */}
                    <div className="absolute top-3 right-3 bg-rose-950/90 backdrop-blur-md border border-rose-700/60 text-rose-200 text-xs font-semibold px-2.5 py-1 rounded-md">
                      DAY 0{attraction.day}
                    </div>

                    {/* Itinerary Timestamp in Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 text-amber-200 text-xs font-semibold flex items-center gap-1.5 drop-shadow">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{attraction.itineraryTime}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    <div className="text-xs text-rose-300/70 font-medium">
                      {attraction.japaneseName}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-200 transition-colors">
                      {attraction.name}
                    </h3>

                    {/* Highlight Lead Prose */}
                    <p className="mt-2.5 text-xs font-medium text-amber-200 bg-gradient-to-r from-rose-950/70 to-amber-950/40 p-2.5 rounded-lg border border-amber-500/30 leading-relaxed">
                      {attraction.highlight}
                    </p>

                    {/* Long Description */}
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {attraction.description}
                    </p>

                    {/* Address with Google Maps */}
                    <div className="mt-4 pt-3 border-t border-rose-950 flex items-start gap-1.5 text-xs text-neutral-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{attraction.address}</span>
                    </div>

                    {/* Practical Tips */}
                    <div className="mt-3 space-y-1.5">
                      {attraction.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-rose-100/80">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold text-amber-200 bg-[#211432] hover:bg-rose-900/60 border border-amber-500/30 rounded-lg transition-colors"
                  >
                    <span>開啟 Google Maps 定位</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
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
