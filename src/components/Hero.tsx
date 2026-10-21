import React, { useState } from "react";
import {
  Plane,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Maximize2,
  X,
} from "lucide-react";
import { SmartImage } from "./SmartImage";
import { OutboundPlaneIcon, InboundPlaneIcon } from "./FlightIcons";
import {
  SparkleDoodle,
  GinkgoLeafSticker,
  RunningShoeSticker,
  ShrineSticker,
  FloatingBubble,
  TheaterMaskSticker,
  CompassSticker,
} from "./CuteDoodles";

export const Hero: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Requirement 2, 3, 4, 9: Authentic public & official photography
  const heroPhotos = [
    {
      title: "《Endless SHOCK Memories -CONTINUE-》",
      subtitle: "堂本光一 主演・東宝 25 年 2,128 回全完售神話",
      tag: "DAY 1 東宝官方巨作",
      imageSrc: "/images/attraction_shock_stage.jpg",
      fallbackSrc: "https://www.tohostage.com/shock/images/visual.jpg",
      location: "東京花園劇場",
      sticker: <TheaterMaskSticker className="w-6 h-6" />,
      sourceNote: "東宝官網公開主視覺",
      isPoster: true,
    },
    {
      title: "有明花園 ＆ 東京花園劇場",
      subtitle: "複合旗艦商場大樓・住友不動產臨海商城",
      tag: "DAY 1 漫步購物",
      imageSrc: "/images/ariake_garden_exterior.jpg",
      fallbackSrc: "https://ariake.shopping-sumitomo-rd.com/",
      location: "江東区有明",
      sticker: <CompassSticker className="w-6 h-6" />,
      sourceNote: "有明花園商場建築寫真",
      isPoster: false,
    },
    {
      title: "新宿御苑 金黃銀杏大道",
      subtitle: "秋季金色落葉毯・典雅日式池泉迴遊庭園",
      tag: "DAY 2 秋日賞楓",
      imageSrc: "/images/test_shinjuku_ginkgo.jpg",
      fallbackSrc: "https://policies.env.go.jp/national-garden/shinjukugyoen/index.html",
      location: "新宿区内藤町",
      sticker: <GinkgoLeafSticker className="w-6 h-6" />,
      sourceNote: "環境省新宿御苑官方照片",
      isPoster: false,
    },
    {
      title: "台場海濱 ＆ 彩虹大橋",
      subtitle: "10K 臨海無折返夜跑・東京官方觀光景點",
      tag: "DAY 1 跑步環線",
      imageSrc: "/images/official_odaiba_gotokyo.webp",
      fallbackSrc: "https://www.gotokyo.org/tc/destinations/southern-tokyo/odaiba/index.html",
      location: "港区台場",
      sticker: <RunningShoeSticker className="w-6 h-6" />,
      sourceNote: "Go Tokyo 官方觀光寫真",
      isPoster: false,
    },
    {
      title: "日本橋小網神社",
      subtitle: "東京第一強運厄除・洗錢之井錢母本殿",
      tag: "DAY 2 名剎參拜",
      imageSrc: "/images/official_koami_jinja.jpg",
      fallbackSrc: "https://www.koamijinja.or.jp/",
      location: "中央区日本橋",
      sticker: <ShrineSticker className="w-6 h-6" />,
      sourceNote: "小網神社官網公開照片",
      isPoster: false,
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

  // Requirement 8: Realistic Japanese Washi Tape with fine micro-sawtooth cuts & diagonal sakura pink stripes
  const washiTapeStyle: React.CSSProperties = {
    background:
      "repeating-linear-gradient(45deg, rgba(244, 160, 182, 0.7) 0px, rgba(244, 160, 182, 0.7) 5px, rgba(255, 246, 248, 0.95) 5px, rgba(255, 246, 248, 0.95) 10px)",
    clipPath:
      "polygon(1.5px 0%, calc(100% - 1.5px) 0%, 100% 4%, calc(100% - 1.5px) 8%, 100% 12%, calc(100% - 1.5px) 16%, 100% 20%, calc(100% - 1.5px) 24%, 100% 28%, calc(100% - 1.5px) 32%, 100% 36%, calc(100% - 1.5px) 40%, 100% 44%, calc(100% - 1.5px) 48%, 100% 52%, calc(100% - 1.5px) 56%, 100% 60%, calc(100% - 1.5px) 64%, 100% 68%, calc(100% - 1.5px) 72%, 100% 76%, calc(100% - 1.5px) 80%, 100% 84%, calc(100% - 1.5px) 88%, 100% 92%, calc(100% - 1.5px) 96%, 100% 100%, 1.5px 100%, 0% 96%, 1.5px 92%, 0% 88%, 1.5px 84%, 0% 80%, 1.5px 76%, 0% 72%, 1.5px 68%, 0% 64%, 1.5px 60%, 0% 56%, 1.5px 52%, 0% 48%, 1.5px 44%, 0% 40%, 1.5px 36%, 0% 32%, 1.5px 28%, 0% 24%, 1.5px 20%, 0% 16%, 1.5px 12%, 0% 8%, 1.5px 4%, 0% 0%)",
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fefdfc] via-[#faf8f6] to-[#f6f2ef] border-b border-[#eee4e7]">
      {/* Breathing Twinkling Stars (SparkleDoodle) across Hero */}
      <SparkleDoodle className="w-6 h-6 text-pink-400 absolute top-8 left-[12%]" speed="fast" />
      <SparkleDoodle className="w-4 h-4 text-rose-300 absolute top-24 left-[28%]" speed="slow" />
      <SparkleDoodle className="w-5 h-5 text-amber-300 absolute top-12 right-[18%]" speed="normal" />
      <SparkleDoodle className="w-4 h-4 text-pink-400 absolute bottom-12 right-[32%]" speed="fast" />
      <SparkleDoodle className="w-3.5 h-3.5 text-rose-400 absolute bottom-20 left-[6%]" speed="normal" />

      {/* Subtle Frosted White Bubbles */}
      <FloatingBubble size={32} className="absolute top-10 left-[7%] hidden md:block" delay="0s" />
      <FloatingBubble size={20} className="absolute top-32 left-[20%]" delay="1.8s" />
      <FloatingBubble size={38} className="absolute top-14 right-[10%] hidden sm:block" delay="2.4s" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Editorial Travel Intro (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Tag Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#992545] text-white shadow-2xs">
                <span>2026.11.28–11.29</span>
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

            {/* Hero Title with Japanese Editorial Style (Requirement 10 (2): No awkward line break for 東京の秋をあるく) */}
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-[#992545] uppercase mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="shrink-0">WEEKEND TRAVEL JOURNAL</span>
                <span className="hidden sm:inline-block h-px w-6 bg-[#992545]/30" />
                <span className="text-[11px] font-sans font-normal text-[#8c7b80] whitespace-nowrap">
                  「東京の秋をあるく」
                </span>
                <SparkleDoodle className="w-3.5 h-3.5 text-pink-400 shrink-0" speed="fast" />
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

            {/* Flight Mini Boarding Pass Chip (Requirement 11: Correct plane angles ↗ and ↘) */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#ebd8dc] shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs max-w-lg">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 text-[#2d2527] font-semibold">
                  <OutboundPlaneIcon className="w-3.5 h-3.5 text-[#992545]" />
                  <span>TR866 06:50 ↗</span>
                </div>
                <span className="text-[#c8b4ba]">|</span>
                <div className="flex items-center gap-1 text-[#2d2527] font-semibold">
                  <InboundPlaneIcon className="w-3.5 h-3.5 text-[#992545]" />
                  <span>TR875 19:45 ↘</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[#5d5054]">
                <Building2 className="w-3.5 h-3.5 text-[#992545]" />
                <span>宿 VIA INN PRIME 日本橋人形町</span>
              </div>
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
                {/* Requirement 8: Realistic Washi Tape (細鋸齒、斜紋櫻粉) */}
                <div
                  style={washiTapeStyle}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 opacity-95 -rotate-1 shadow-[0_2px_8px_rgba(180,90,110,0.18)] z-20 pointer-events-none"
                  title="日式斜紋櫻粉紙膠帶"
                />

                {/* Main Photo Viewport - Requirement 9: SHOCK poster shifted downwards to show character & title */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f4ecef] group">
                  <SmartImage
                    key={`hero-photo-${activePhoto}-${heroPhotos[activePhoto].imageSrc}`}
                    src={heroPhotos[activePhoto].imageSrc}
                    fallbackSrc={heroPhotos[activePhoto].fallbackSrc}
                    alt={heroPhotos[activePhoto].title}
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 ${
                      heroPhotos[activePhoto].isPoster ? "object-[center_18%]" : "object-center"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Previous / Next Arrow Controls */}
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#4a383d] flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 z-20"
                    aria-label="前一張照片"
                  >
                    <ChevronLeft className="w-5 h-5 -ml-0.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-[#4a383d] flex items-center justify-center shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 z-20"
                    aria-label="下一張照片"
                  >
                    <ChevronRight className="w-5 h-5 -mr-0.5" />
                  </button>

                  {/* Photo Tag Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#8e2443] shadow-xs border border-[#ebd8dc] flex items-center gap-1">
                      <SparkleDoodle className="w-3 h-3 text-pink-400" speed="fast" />
                      <span>{heroPhotos[activePhoto].tag}</span>
                    </div>
                  </div>

                  {/* Lightbox Zoom & Source Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-1 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-all"
                      title="放大檢視高清大圖"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Floating Caption on Main Photo */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 text-white z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-pink-200">
                        {heroPhotos[activePhoto].location}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white drop-shadow-sm mt-0.5 leading-snug">
                      {heroPhotos[activePhoto].title}
                    </h3>
                    <p className="text-xs text-white/90 line-clamp-1 drop-shadow-xs mt-0.5">
                      {heroPhotos[activePhoto].subtitle}
                    </p>
                  </div>
                </div>

                {/* Subtitle / Counter Row */}
                <div className="mt-3 flex items-center justify-between text-xs px-1 text-[#8c7b80]">
                  <span className="text-[11px]">點擊下方縮圖即時切換照片</span>
                  <span className="text-[11px] font-mono font-medium text-[#9c6a76]">
                    {activePhoto + 1} / {heroPhotos.length}
                  </span>
                </div>

                {/* Interactive Thumbnail Previews with Smooth Switching */}
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
                          className={`w-full h-full object-cover pointer-events-none ${
                            photo.isPoster ? "object-[center_30%]" : "object-center"
                          }`}
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

      {/* Lightbox Modal for Full View */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative max-w-3xl max-h-[90vh] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-stone-900/90 border-b border-stone-800 text-white">
              <div>
                <h4 className="text-sm sm:text-base font-bold">
                  {heroPhotos[activePhoto].title}
                </h4>
                <p className="text-xs text-stone-400">
                  {heroPhotos[activePhoto].subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center transition-all cursor-pointer"
                aria-label="關閉預覽"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 sm:p-4 overflow-auto flex items-center justify-center max-h-[75vh]">
              <img
                src={heroPhotos[activePhoto].imageSrc}
                alt={heroPhotos[activePhoto].title}
                className="max-h-[70vh] w-auto rounded-xl object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
