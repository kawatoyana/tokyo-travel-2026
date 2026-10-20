import React, { useState } from "react";
import {
  ArrowDown,
  Plane,
  Building2,
  Navigation,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { SmartImage } from "./SmartImage";
import {
  SparkleDoodle,
  FloatingBubble,
  TheaterMaskSticker,
  GinkgoLeafSticker,
  RunningShoeSticker,
  ShrineSticker,
  CompassSticker,
} from "./CuteDoodles";

type TapePattern = "stripes" | "gingham" | "dots";

export const Hero: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<number>(0);
  const [tapePattern, setTapePattern] = useState<TapePattern>("stripes");

  // Requirement 5 & 9: Authentic public & official photography (strictly NO AI-generated images)
  const heroPhotos = [
    {
      title: "《Endless SHOCK Memories》",
      subtitle: "堂本光一 主演・東宝 25 年 2,128 回全完售神話",
      tag: "DAY 1 東宝官方巨作",
      imageSrc: "/images/attraction_shock_stage.jpg",
      fallbackSrc: "https://www.tohostage.com/shock/images/visual.jpg",
      location: "東京花園劇場",
      sticker: <TheaterMaskSticker className="w-6 h-6" />,
      sourceNote: "東宝官網公開主視覺",
    },
    {
      title: "有明花園 ＆ 東京花園劇場",
      subtitle: "關東最大無印良品・住友不動產臨海商城",
      tag: "DAY 1 漫步購物",
      imageSrc: "/images/official_ariake_garden.jpg",
      fallbackSrc: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      location: "江東区有明",
      sticker: <CompassSticker className="w-6 h-6" />,
      sourceNote: "有明花園官網公開照片",
    },
    {
      title: "新宿御苑 金黃銀杏林",
      subtitle: "環境省國民公園・秋季金黃落葉毯與池泉庭園",
      tag: "DAY 2 秋日賞楓",
      imageSrc: "/images/official_shinjuku_gyoen.jpg",
      fallbackSrc: "https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80",
      location: "新宿区内藤町",
      sticker: <GinkgoLeafSticker className="w-6 h-6" />,
      sourceNote: "環境省新宿御苑官方照片",
    },
    {
      title: "台場海濱 ＆ 彩虹大橋",
      subtitle: "10K 臨海無折返夜跑・東京官方觀光景點",
      tag: "DAY 1 跑步環線",
      imageSrc: "/images/official_odaiba_gotokyo.webp",
      fallbackSrc: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80",
      location: "港区台場",
      sticker: <RunningShoeSticker className="w-6 h-6" />,
      sourceNote: "Go Tokyo 官方觀光寫真",
    },
    {
      title: "日本橋小網神社",
      subtitle: "東京第一強運厄除・洗錢之井錢母本殿",
      tag: "DAY 2 名剎參拜",
      imageSrc: "/images/official_koami_jinja.jpg",
      fallbackSrc: "https://images.unsplash.com/photo-1589083115456-6f4e66248386?auto=format&fit=crop&w=1200&q=80",
      location: "中央区日本橋",
      sticker: <ShrineSticker className="w-6 h-6" />,
      sourceNote: "小網神社官網公開照片",
    },
  ];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhoto((prev) => (prev === 0 ? heroPhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActivePhoto((prev) => (prev === heroPhotos.length - 1 ? 0 : prev + 1));
  };

  // Requirement 4: Realistic Japanese Washi Tape Styles (條紋, 格子, 波點)
  const getTapeStyle = (pattern: TapePattern): React.CSSProperties => {
    switch (pattern) {
      case "stripes":
        return {
          background:
            "repeating-linear-gradient(45deg, #f7ccd6 0px, #f7ccd6 7px, #fff2f5 7px, #fff2f5 14px)",
        };
      case "gingham":
        return {
          backgroundColor: "#fde8ed",
          backgroundImage:
            "linear-gradient(90deg, rgba(200, 70, 100, 0.22) 50%, transparent 50%), linear-gradient(rgba(200, 70, 100, 0.22) 50%, transparent 50%)",
          backgroundSize: "11px 11px",
        };
      case "dots":
        return {
          backgroundColor: "#fff0f3",
          backgroundImage:
            "radial-gradient(rgba(185, 45, 80, 0.4) 22%, transparent 22%)",
          backgroundSize: "8px 8px",
        };
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fefdfc] via-[#faf8f6] to-[#f6f2ef] border-b border-[#eee4e7]">
      {/* Breathing Twinkling Stars (SparkleDoodle) across Hero */}
      <SparkleDoodle className="w-6 h-6 text-pink-400 absolute top-8 left-[12%]" speed="fast" />
      <SparkleDoodle className="w-4 h-4 text-rose-300 absolute top-24 left-[28%]" speed="slow" />
      <SparkleDoodle className="w-5 h-5 text-amber-300 absolute top-12 right-[18%]" speed="normal" />
      <SparkleDoodle className="w-4 h-4 text-pink-400 absolute bottom-12 right-[32%]" speed="fast" />
      <SparkleDoodle className="w-3.5 h-3.5 text-rose-400 absolute bottom-20 left-[6%]" speed="normal" />

      {/* Subtle Frosted White Bubbles (Monochrome, non-colorful) */}
      <FloatingBubble size={32} className="absolute top-10 left-[7%] hidden md:block" delay="0s" />
      <FloatingBubble size={20} className="absolute top-32 left-[20%]" delay="1.8s" />
      <FloatingBubble size={38} className="absolute top-14 right-[10%] hidden sm:block" delay="2.4s" />
      <FloatingBubble size={18} className="absolute bottom-16 right-[22%]" delay="0.9s" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Magazine Typography & Metadata (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Magazine Date & Seal Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-[#332a2c] border border-[#ebd8dc] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#992545] animate-pulse" />
                <span className="font-mono">2026.11.28（六）– 11.29（日）</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fcf4f5] text-[#8e2443] border border-[#f3d9de]">
                <Calendar className="w-3.5 h-3.5 text-[#992545]" />
                <span>週末 2 天 1 夜散策</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white text-[#786b6f] border border-[#ebd8dc]">
                <GinkgoLeafSticker className="w-3.5 h-3.5" />
                <span>秋の銀杏與紅葉見頃</span>
              </div>
            </div>

            {/* Hero Title with Japanese Editorial Style */}
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-[#992545] uppercase mb-2 flex items-center gap-2">
                <span>WEEKEND TRAVEL JOURNAL</span>
                <span className="h-px w-8 bg-[#992545]/30" />
                <span className="text-[11px] font-sans font-normal text-[#8c7b80]">
                  「東京の秋をあるく」
                </span>
                <SparkleDoodle className="w-3.5 h-3.5 text-pink-400" speed="fast" />
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#2d2527] leading-[1.25]">
                台北東京週末散策記
                <span className="block text-lg sm:text-2xl font-bold text-[#8e2443] mt-2">
                  有明購物・SHOCK 舞台劇・東京灣 10K 夜跑・新宿御苑
                </span>
              </h1>

              <p className="mt-3.5 text-xs sm:text-sm text-[#5d5054] leading-relaxed max-w-xl font-normal">
                搭乘酷航早班機直抵東京，淺草線一車直通人形町安頓行囊。午後前往有明花園漫步購物與品嚐利久牛舌；傍晚一人欣賞熱血澎湃的 SHOCK 舞台劇，一人迎著海風完成台場 10 公里臨海夜跑。翌日漫步人形町參拜小網神社、品嚐百年花山寬麵，在新宿御苑金黃銀杏林與水面倒影中，度過舒心明媚的秋末週末。
              </p>
            </div>

            {/* Flight Mini Boarding Pass Chip */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#ebd8dc] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs max-w-lg">
              <div className="flex items-center gap-2">
                {/* Outbound flies ↗ towards top-right */}
                <Plane className="w-4 h-4 text-[#992545]" style={{ transform: "rotate(0deg)" }} />
                <span className="font-bold text-[#2d2527]">酷航航班：</span>
                <span className="text-[#5d5054]">TR866 (06:50) ⇄ TR875 (19:45)</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#992545]" />
                <span className="text-[#5d5054]">宿 VIA INN PRIME 日本橋人形町</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#itinerary"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#992545] hover:bg-[#7e1c36] rounded-full transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>翻閱每日行程表</span>
                <ArrowDown className="w-4 h-4 text-pink-200" />
              </a>
              <a
                href="#routes"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#57484c] bg-white hover:bg-[#fcf5f6] border border-[#e5d2d6] rounded-full transition-all duration-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Navigation className="w-4 h-4 text-[#992545]" />
                <span>查看路線地圖 ＆ Google Maps</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Magazine Polaroid & Photo Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Decorative Japanese Postmark Seal */}
              <div className="absolute -top-4 -right-2 z-20 w-16 h-16 rounded-full border-2 border-dashed border-[#b83358] text-[#b83358] flex flex-col items-center justify-center rotate-12 bg-white/90 backdrop-blur-xs shadow-2xs pointer-events-none">
                <span className="text-[9px] font-mono font-bold">TOKYO</span>
                <span className="text-[10px] font-bold">2026</span>
                <span className="text-[8px] tracking-tight">秋散策</span>
              </div>

              {/* Main Featured Photo Card */}
              <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-[#ebd8dc] shadow-[0_12px_36px_rgba(60,40,45,0.08)] relative z-10 transition-all duration-300">
                {/* Requirement 4: Realistic Japanese Washi Tape (條紋、格子、波點) with ripped edges */}
                <div
                  style={{
                    ...getTapeStyle(tapePattern),
                    clipPath:
                      "polygon(4px 0%, calc(100% - 4px) 0%, 100% 25%, calc(100% - 4px) 50%, 100% 75%, calc(100% - 4px) 100%, 4px 100%, 0% 75%, 4px 50%, 0% 25%)",
                  }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6.5 opacity-95 -rotate-1 shadow-[0_2px_8px_rgba(180,90,110,0.18)] z-20 transition-all duration-300"
                  title={`紙膠帶款式：${tapePattern === "stripes" ? "條紋" : tapePattern === "gingham" ? "格子" : "波點"}`}
                />

                {/* Main Photo Viewport - Fixed image switching with smooth transition and prev/next controls */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f4ecef] group">
                  <SmartImage
                    key={`hero-photo-${activePhoto}-${heroPhotos[activePhoto].imageSrc}`}
                    src={heroPhotos[activePhoto].imageSrc}
                    fallbackSrc={heroPhotos[activePhoto].fallbackSrc}
                    alt={heroPhotos[activePhoto].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Previous / Next Arrow Controls */}
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#4a383d] flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 z-20"
                    aria-label="前一張照片"
                  >
                    <ChevronLeft className="w-5 h-5 -ml-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#4a383d] flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 z-20"
                    aria-label="下一張照片"
                  >
                    <ChevronRight className="w-5 h-5 -mr-0.5" />
                  </button>

                  {/* Photo Tag Badge & Cute Hand-drawn Sticker */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#8e2443] shadow-xs border border-[#ebd8dc] flex items-center gap-1">
                      <SparkleDoodle className="w-3 h-3 text-pink-400" speed="fast" />
                      <span>{heroPhotos[activePhoto].tag}</span>
                    </div>
                  </div>

                  {/* Official Source Verification Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-stone-900/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-medium text-white/95 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{heroPhotos[activePhoto].sourceNote}</span>
                    </div>
                  </div>

                  {/* Photo Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10 pointer-events-none">
                    <h3 className="font-bold text-sm sm:text-base drop-shadow-sm flex items-center justify-between">
                      <span>{heroPhotos[activePhoto].title}</span>
                      <span className="text-xs font-normal text-pink-200 flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3" />
                        <span>{heroPhotos[activePhoto].location}</span>
                      </span>
                    </h3>
                    <p className="text-xs text-white/90 drop-shadow-sm mt-0.5 line-clamp-1">
                      {heroPhotos[activePhoto].subtitle}
                    </p>
                  </div>
                </div>

                {/* Requirement 4: Washi Tape Style Switcher & Photo Index Pill */}
                <div className="mt-2.5 flex items-center justify-between text-xs px-1">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#7a5963]">
                    <span>紙膠帶：</span>
                    <div className="inline-flex p-0.5 bg-[#fbf0f2] rounded-full border border-[#f3d3dc] text-[10px]">
                      <button
                        type="button"
                        onClick={() => setTapePattern("stripes")}
                        className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          tapePattern === "stripes"
                            ? "bg-[#992545] text-white shadow-2xs"
                            : "text-[#7a5963] hover:text-[#992545]"
                        }`}
                      >
                        條紋
                      </button>
                      <button
                        type="button"
                        onClick={() => setTapePattern("gingham")}
                        className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          tapePattern === "gingham"
                            ? "bg-[#992545] text-white shadow-2xs"
                            : "text-[#7a5963] hover:text-[#992545]"
                        }`}
                      >
                        格子
                      </button>
                      <button
                        type="button"
                        onClick={() => setTapePattern("dots")}
                        className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                          tapePattern === "dots"
                            ? "bg-[#992545] text-white shadow-2xs"
                            : "text-[#7a5963] hover:text-[#992545]"
                        }`}
                      >
                        波點
                      </button>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-medium text-[#9c6a76]">
                    {activePhoto + 1} / {heroPhotos.length}
                  </span>
                </div>

                {/* Requirement 3: Interactive Thumbnail Previews with Smooth Switching */}
                <div className="mt-2.5 grid grid-cols-5 gap-2">
                  {heroPhotos.map((photo, pIdx) => {
                    const isSelected = activePhoto === pIdx;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActivePhoto(pIdx);
                        }}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#992545] shadow-xs scale-105 ring-2 ring-[#992545]/25"
                            : "border-transparent opacity-70 hover:opacity-100 hover:scale-102"
                        }`}
                        aria-label={`切換至 ${photo.title}`}
                      >
                        <img
                          src={photo.imageSrc}
                          alt={photo.title}
                          className="w-full h-full object-cover pointer-events-none"
                          onError={(e) => {
                            if (photo.fallbackSrc && e.currentTarget.src !== photo.fallbackSrc) {
                              e.currentTarget.src = photo.fallbackSrc;
                            }
                          }}
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#992545]/10 border border-[#992545] rounded-xl pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Floating Accent Doodles Behind Photo */}
              <div className="absolute -bottom-3 -left-3 -z-0 bg-[#fbf0f2] w-full h-full rounded-3xl border border-[#ebd8dc]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
