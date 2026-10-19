import React, { useState } from "react";
import {
  ArrowDown,
  Plane,
  Building2,
  Footprints,
  Sparkles,
  Navigation,
  MapPin,
  Calendar,
  Compass,
} from "lucide-react";
import { SmartImage } from "./SmartImage";
import {
  SparkleDoodle,
  FloatingBubble,
  CameraSticker,
  LuggageSticker,
  GinkgoLeafSticker,
  RunningShoeSticker,
  ShrineSticker,
} from "./CuteDoodles";

export const Hero: React.FC = () => {
  const [activePhoto, setActivePhoto] = useState<number>(0);

  const heroPhotos = [
    {
      title: "東京花園劇場 ＆ 有明",
      subtitle: "SHOCK 舞台劇・臨海商場",
      tag: "DAY 1 舞台與購物",
      imageSrc: "./images/attraction_ariake_theater.jpg",
      fallbackSrc: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      location: "東京都江東区有明",
    },
    {
      title: "新宿御苑 金黃銀杏林",
      subtitle: "秋末金黃落葉毯・中之池紅葉",
      tag: "DAY 2 秋日賞楓",
      imageSrc: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      fallbackSrc: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      location: "東京都新宿区内藤町",
    },
    {
      title: "台場海濱 ＆ 彩虹大橋",
      subtitle: "10K 臨海夜跑・海風夜景",
      tag: "DAY 1 夜跑",
      imageSrc: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
      fallbackSrc: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
      location: "東京都港区台場",
    },
    {
      title: "日本橋小網神社",
      subtitle: "東京強運厄除・洗錢錢母",
      tag: "DAY 2 神社參拜",
      imageSrc: "./images/attraction_koami_shrine.jpg",
      fallbackSrc: "https://images.unsplash.com/photo-1589083115456-6f4e66248386?auto=format&fit=crop&w=800&q=80",
      location: "東京都中央区日本橋",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fefdfc] via-[#faf8f6] to-[#f6f2ef] border-b border-[#eee4e7]">
      {/* Subtle Frosted White Bubbles (Monochrome, no color) */}
      <FloatingBubble size={32} className="absolute top-10 left-[7%] hidden md:block" delay="0s" />
      <FloatingBubble size={20} className="absolute top-32 left-[20%]" delay="1.8s" />
      <FloatingBubble size={38} className="absolute top-14 right-[10%] hidden sm:block" delay="2.4s" />
      <FloatingBubble size={18} className="absolute bottom-16 right-[22%]" delay="0.9s" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20">
        {/* Main Hero Split Grid: Editorial Left + Visual Magazine Collage Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Travel Meta (7 cols) */}
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
                <Plane className="w-4 h-4 text-[#992545]" />
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
                {/* Simulated Washi Tape on Top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#f7d6dd]/80 backdrop-blur-xs border border-white/60 -rotate-1 shadow-2xs z-20" />

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f4ecef]">
                  <SmartImage
                    src={heroPhotos[activePhoto].imageSrc}
                    fallbackSrc={heroPhotos[activePhoto].fallbackSrc}
                    alt={heroPhotos[activePhoto].title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Photo Tag Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#8e2443] shadow-xs border border-[#ebd8dc]">
                    {heroPhotos[activePhoto].tag}
                  </div>

                  {/* Photo Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-sm sm:text-base drop-shadow-sm flex items-center justify-between">
                      <span>{heroPhotos[activePhoto].title}</span>
                      <span className="text-xs font-normal text-pink-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{heroPhotos[activePhoto].location}</span>
                      </span>
                    </h3>
                    <p className="text-xs text-white/90 drop-shadow-sm mt-0.5">
                      {heroPhotos[activePhoto].subtitle}
                    </p>
                  </div>
                </div>

                {/* 4 Interactive Thumbnail Previews */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {heroPhotos.map((photo, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setActivePhoto(pIdx)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        activePhoto === pIdx
                          ? "border-[#992545] shadow-xs scale-102"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <SmartImage
                        src={photo.imageSrc}
                        fallbackSrc={photo.fallbackSrc}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating Accent Doodles Behind Photo */}
              <div className="absolute -bottom-3 -left-3 -z-0 bg-[#fbf0f2] w-full h-full rounded-3xl border border-[#ebd8dc]" />
            </div>
          </div>
        </div>

        {/* Japanese Magazine Style KPI Summary Cards */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebd8dc] shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#786b6f]">酷航航班</span>
              <LuggageSticker className="w-6 h-6" />
            </div>
            <div className="text-sm sm:text-base font-bold text-[#2d2527] font-mono">
              TR866 / TR875
            </div>
            <div className="text-[11px] text-[#786b6f] mt-1">
              早去晚回 · 淺草線直通成田
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebd8dc] shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#786b6f]">下榻飯店</span>
              <Building2 className="w-5 h-5 text-[#992545]" />
            </div>
            <div className="text-sm sm:text-base font-bold text-[#2d2527] truncate">
              VIA INN 人形町
            </div>
            <div className="text-[11px] text-[#786b6f] mt-1">
              頂樓「水天之湯」大浴場
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebd8dc] shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#786b6f]">東京灣夜跑</span>
              <RunningShoeSticker className="w-6 h-6" />
            </div>
            <div className="text-sm sm:text-base font-bold text-[#2d2527] font-mono">
              10.0 公里環線
            </div>
            <div className="text-[11px] text-[#786b6f] mt-1">
              有明 → 台場 → 青海零折返
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ebd8dc] shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#786b6f]">經典名所</span>
              <CameraSticker className="w-6 h-6" />
            </div>
            <div className="text-sm sm:text-base font-bold text-[#2d2527] truncate">
              小網神社 ＆ 新宿御苑
            </div>
            <div className="text-[11px] text-[#786b6f] mt-1">
              洗錢強運・百年寬烏龍麵
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
