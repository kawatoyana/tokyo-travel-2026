import React, { useState } from "react";
import { ATTRACTIONS, Attraction } from "../data/tripData";
import {
  MapPin,
  ExternalLink,
  Check,
  Clock,
  Compass,
  Store,
} from "lucide-react";
import { SmartImage } from "./SmartImage";
import {
  SparkleDoodle,
  CameraSticker,
  CoffeeCupSticker,
  ShrineSticker,
  GinkgoLeafSticker,
  TheaterMaskSticker,
  RunningShoeSticker,
  UdonBowlSticker,
  ShoppingBagSticker,
  CompassSticker,
  FloatingBubble,
} from "./CuteDoodles";

export const AttractionsSection: React.FC = () => {
  const [filterDay, setFilterDay] = useState<number | "all">("all");

  const filteredAttractions = ATTRACTIONS.filter((attraction) => {
    if (filterDay === "all") return true;
    return attraction.day === filterDay;
  });

  const getAttractionSticker = (id: string) => {
    switch (id) {
      case "attr-shock-musical":
        return <TheaterMaskSticker className="w-6 h-6" />;
      case "attr-odaiba-run":
        return <RunningShoeSticker className="w-6 h-6" />;
      case "attr-hanayama-udon":
      case "attr-rikyu":
        return <UdonBowlSticker className="w-6 h-6" />;
      case "attr-miharado":
        return <ShoppingBagSticker className="w-6 h-6" />;
      case "attr-ariake-theater":
        return <CompassSticker className="w-6 h-6" />;
      case "attr-koami":
        return <ShrineSticker className="w-6 h-6" />;
      case "attr-dixans":
        return <CoffeeCupSticker className="w-6 h-6" />;
      case "attr-shinjuku":
        return <GinkgoLeafSticker className="w-6 h-6" />;
      default:
        return <CameraSticker className="w-6 h-6" />;
    }
  };

  const ariakeStores = [
    {
      name: "無印良品 東京有明 (1F–3F)",
      desc: "關東最大近 1,400 坪旗艦店，全品項生活選物、秤重零食點心與 Café&Meal 良品食堂",
      badge: "旗艦商場",
    },
    {
      name: "AEON STYLE 超市 (1F)",
      desc: "生鮮熟食超市，採買當季日本水果、熟食壽司與伴手禮零食",
      badge: "生鮮熟食",
    },
    {
      name: "KOJIMA × Bic Camera (3F)",
      desc: "大型免稅電器專賣店，美容家電、保溫杯與旅行 3C 配件",
      badge: "免稅電器",
    },
    {
      name: "ABC-MART GRAND STAGE (4F)",
      desc: "日本限定慢跑球鞋、運動服飾與專業跑步補給裝備",
      badge: "運動裝備",
    },
    {
      name: "泉天空之湯 (5F)",
      desc: "天然溫泉大浴場、露天風呂、碳酸泉與賽後休憩設施",
      badge: "天然溫泉",
    },
  ];

  return (
    <section id="attractions" className="py-14 sm:py-20 bg-[#faf8f6] border-b border-[#eee4e7] relative overflow-hidden">
      {/* Pure Frosted White Bubbles */}
      <FloatingBubble size={28} className="absolute top-10 right-[8%] hidden lg:block" delay="1.2s" />
      <FloatingBubble size={18} className="absolute bottom-16 left-[5%]" delay="3s" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] mb-2.5">
              <Compass className="w-3.5 h-3.5 text-[#992545]" />
              <span>SPOTS & DINING JOURNAL</span>
              <SparkleDoodle className="w-3 h-3 text-[#e0758e]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2527] tracking-tight">
              精選景點與美饌導覽
            </h2>
            <p className="text-xs sm:text-sm text-[#6e5d62] mt-1.5 max-w-xl leading-relaxed">
              嚴選 8 大精華景點與名物料理，嚴格依照實際行程先後順序排列，附在地實用建議與 Google 地圖導航。
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 bg-white rounded-full border border-[#ebd8dc] shrink-0 self-start md:self-auto shadow-2xs">
            <button
              onClick={() => setFilterDay("all")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                filterDay === "all"
                  ? "bg-[#992545] text-white shadow-xs"
                  : "text-[#6e5d62] hover:text-[#2d2527]"
              }`}
            >
              依行程全覽
            </button>
            <button
              onClick={() => setFilterDay(1)}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                filterDay === 1
                  ? "bg-[#992545] text-white shadow-xs"
                  : "text-[#6e5d62] hover:text-[#2d2527]"
              }`}
            >
              DAY 1 有明・台場
            </button>
            <button
              onClick={() => setFilterDay(2)}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
                filterDay === 2
                  ? "bg-[#992545] text-white shadow-xs"
                  : "text-[#6e5d62] hover:text-[#2d2527]"
              }`}
            >
              DAY 2 人形町・新宿
            </button>
          </div>
        </div>

        {/* Attractions Grid - commi.me Magazine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map((attraction: Attraction) => {
            return (
              <div
                key={attraction.id}
                className="bg-white rounded-3xl border border-[#ebd8dc] overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(60,40,45,0.08)] group"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] bg-[#fdf0f4] overflow-hidden">
                    <SmartImage
                      src={attraction.imageSrc}
                      fallbackSrc={attraction.unsplashUrl}
                      alt={attraction.name}
                      style={attraction.id.includes("shock") ? { objectPosition: "center 0%" } : undefined}
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                        attraction.id.includes("shock") ? "object-top" : "object-center"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />

                    {/* Category Badge (No station prefix) */}
                    <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#992545] text-xs font-semibold px-3 py-1 rounded-full shadow-2xs border border-[#fad2dd]">
                      {attraction.category}
                    </div>

                    {/* Day Tag & Cute Sticker */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      <div className="bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        DAY {attraction.day}
                      </div>
                      <div className="hidden sm:block">
                        {getAttractionSticker(attraction.id)}
                      </div>
                    </div>

                    {/* Timestamp in Overlay */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white text-xs font-medium flex items-center gap-1.5 drop-shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                      <span className="truncate">{attraction.itineraryTime}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between text-xs text-[#8c606c] font-medium mb-1.5">
                      <span>{attraction.japaneseName}</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#4a383d] mt-1 group-hover:text-[#a82a51] transition-colors">
                      {attraction.name}
                    </h3>

                    {/* Highlight Box */}
                    <p className="mt-3 text-xs font-medium text-[#992545] bg-[#fff0f4] p-3 rounded-2xl border border-[#fad4df] leading-relaxed">
                      {attraction.highlight}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs sm:text-sm text-[#664b52] leading-relaxed font-normal">
                      {attraction.description}
                    </p>

                    {/* Requirement 4: Ariake Garden Must-Visit Store Guide Box */}
                    {attraction.id === "attr-ariake-theater" && (
                      <div className="mt-4 p-3.5 bg-[#fdf2f5] rounded-2xl border border-[#faccd7]">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#b83358] mb-2">
                          <Store className="w-3.5 h-3.5" />
                          <span>有明花園必逛店家指南：</span>
                        </div>
                        <div className="space-y-1.5">
                          {ariakeStores.map((store, sIdx) => (
                            <div key={sIdx} className="text-[11px] text-[#6b4f57] flex items-start gap-1.5">
                              <span className="px-1.5 py-0.2 rounded-md bg-[#fde9ee] text-[#a82a51] font-semibold text-[10px] shrink-0 border border-[#fad0de]">
                                {store.badge}
                              </span>
                              <span className="leading-snug">
                                <strong className="text-[#4a383d]">{store.name}</strong>：{store.desc}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address with Google Maps */}
                    <div className="mt-4 pt-3 border-t border-[#fae1e7] flex items-start gap-1.5 text-xs text-[#8c606c]">
                      <MapPin className="w-3.5 h-3.5 text-[#b83358] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{attraction.address}</span>
                    </div>

                    {/* 旅人筆記 */}
                    <div className="mt-3.5 space-y-1.5">
                      {attraction.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#664b52]">
                          <Check className="w-3.5 h-3.5 text-[#b83358] shrink-0 mt-0.5" />
                          <span className="leading-snug">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Links */}
                <div className="p-6 pt-0 space-y-2">
                  {attraction.officialWebsite && (
                    <a
                      href={attraction.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-[#992545] hover:bg-[#801e38] rounded-full transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                    >
                      <span>
                        {attraction.id === "attr-shock-musical"
                          ? "東宝演劇『Endless SHOCK』公式特設網站"
                          : attraction.id === "attr-ariake-theater"
                          ? "有明花園 ＆ 東京花園劇場 官方網站"
                          : attraction.id === "attr-rikyu"
                          ? "牛たん炭焼 利久 官方菜單指南"
                          : attraction.id === "attr-odaiba-run"
                          ? "Go Tokyo 台場官方觀光指南"
                          : attraction.id === "attr-koami"
                          ? "小網神社 官方參拜指南"
                          : attraction.id === "attr-dixans"
                          ? "DIXANS 人形町 Instagram 官方專頁"
                          : attraction.id === "attr-amazake-miharado"
                          ? "甘酒橫丁老街 官方觀光導覽"
                          : attraction.id === "attr-hanayama"
                          ? "五代目 花山烏龍麵 官方網站"
                          : attraction.id === "attr-shinjuku"
                          ? "環境省 新宿御苑 官方公園導覽"
                          : "造訪景點／店家官方網站"}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-white/90" />
                    </a>
                  )}
                  <a
                    href={attraction.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-[#8b2947] bg-[#fff0f4] hover:bg-[#fde2ea] rounded-full transition-all duration-200 hover:-translate-y-0.5 border border-[#fad4df]"
                  >
                    <span>開啟 Google Maps 定位導航</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#b83358]" />
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
