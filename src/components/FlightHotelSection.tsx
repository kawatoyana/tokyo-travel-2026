import React from "react";
import { FLIGHTS, HOTEL } from "../data/tripData";
import {
  Plane,
  Building2,
  Clock,
  ArrowRight,
  Sparkles,
  Bath,
  Luggage,
  Train,
  ExternalLink,
} from "lucide-react";
import {
  LuggageSticker,
  TrainSticker,
  SparkleDoodle,
  FloatingBubble,
} from "./CuteDoodles";

export const FlightHotelSection: React.FC = () => {
  return (
    <section id="flight-hotel" className="py-14 sm:py-20 bg-white border-b border-[#eee4e7] relative overflow-hidden">
      {/* Pure Frosted White Bubbles */}
      <FloatingBubble size={28} className="absolute top-14 left-[6%] hidden md:block" delay="2.2s" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] mb-2.5">
            <Plane className="w-3.5 h-3.5 text-[#992545]" />
            <span>FLIGHTS & HOTEL JOURNAL</span>
            <SparkleDoodle className="w-3 h-3 text-[#e0758e]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2527] tracking-tight">
            航班及住宿資訊
          </h2>
          <p className="text-xs sm:text-sm text-[#6e5d62] mt-1.5 max-w-xl leading-relaxed font-normal">
            酷航早去晚回班次安排、淺草線 Access 特急免換乘直達秘訣，與日本橋人形町住宿規格。
          </p>
        </div>

        {/* Flight Cards Grid - Boarding Pass Magazine Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Outbound Card: TR866 */}
          <div className="bg-white rounded-3xl border border-[#fad4dd] p-6 sm:p-7 flex flex-col justify-between shadow-[0_6px_25px_rgba(240,160,180,0.08)] hover:shadow-[0_12px_32px_rgba(240,160,180,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#fae1e7]">
                <div className="flex items-center gap-2.5">
                  {/* Requirement 1: Outbound plane flies ↗ (朝右上角航行) */}
                  <div className="w-8 h-8 rounded-2xl bg-[#fdebf0] border border-[#faccd7] flex items-center justify-center text-[#b83358]">
                    <Plane className="w-4 h-4 rotate-0" style={{ transform: "rotate(0deg)" }} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#4a383d]">
                      去程航班 · {FLIGHTS.outbound.airline}
                    </span>
                    <div className="text-[11px] text-[#8c606c]">{FLIGHTS.outbound.date}</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-[#fff0f4] text-[#a82a51] rounded-full border border-[#fad2dd]">
                  {FLIGHTS.outbound.flightNumber}
                </span>
              </div>

              {/* Flight Route Diagram */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#4a383d]">
                    {FLIGHTS.outbound.originCode}
                  </div>
                  <div className="text-xs font-medium text-[#735860] mt-0.5">
                    {FLIGHTS.outbound.origin}
                  </div>
                  <div className="text-[11px] text-[#9c7580] mt-0.5">
                    {FLIGHTS.outbound.originTerminal}
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold text-[#b83358] mt-2">
                    {FLIGHTS.outbound.departureTime}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-[11px] font-mono text-[#9c7580] mb-1">
                    {FLIGHTS.outbound.duration}
                  </span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-0.5 flex-1 bg-[#f9d7df]" />
                    {/* Requirement 1: Outbound plane flies ↗ (朝右上角航行) */}
                    <Plane className="w-4 h-4 text-[#b83358] rotate-0 shrink-0" style={{ transform: "rotate(0deg)" }} />
                    <div className="h-0.5 flex-1 bg-[#f9d7df]" />
                  </div>
                  <span className="text-[10px] text-[#286f4a] mt-1 font-semibold px-2 py-0.5 bg-[#f3f9f6] rounded-full border border-[#d7ecdf]">
                    直飛班機
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#4a383d]">
                    {FLIGHTS.outbound.destinationCode}
                  </div>
                  <div className="text-xs font-medium text-[#735860] mt-0.5">
                    {FLIGHTS.outbound.destination}
                  </div>
                  <div className="text-[11px] text-[#9c7580] mt-0.5">
                    {FLIGHTS.outbound.destinationTerminal}
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold text-[#b83358] mt-2">
                    {FLIGHTS.outbound.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Transit Tip */}
              <div className="mt-6 p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7] text-xs text-[#6b4f57] space-y-1.5">
                <div className="font-bold text-[#a82a51] flex items-center gap-1.5">
                  <TrainSticker className="w-5 h-5" />
                  <span>成田直達人形町密技：</span>
                </div>
                <p className="leading-relaxed">
                  成田機場第 1 航廈搭乘 <strong>京成成田 Sky Access 特急</strong>（直通都營地下鐵淺草線班次），一車到底免換車，約 70 分鐘舒適直達人形町站，省時又免搬行李！
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#fae1e7] flex items-center justify-between text-xs text-[#8c606c]">
              <span>報到航廈：桃園國際機場 T1</span>
              <span>行李：手提 10kg + 托運</span>
            </div>
          </div>

          {/* Inbound Card: TR875 */}
          <div className="bg-white rounded-3xl border border-[#fad4dd] p-6 sm:p-7 flex flex-col justify-between shadow-[0_6px_25px_rgba(240,160,180,0.08)] hover:shadow-[0_12px_32px_rgba(240,160,180,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#fae1e7]">
                <div className="flex items-center gap-2.5">
                  {/* Requirement 2: Return flight icon flies ↘ (朝右下角俯衝) */}
                  <div className="w-8 h-8 rounded-2xl bg-[#fdebf0] border border-[#faccd7] flex items-center justify-center text-[#b83358]">
                    <Plane className="w-4 h-4 rotate-90" style={{ transform: "rotate(90deg)", transformOrigin: "center" }} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#4a383d]">
                      回程航班 · {FLIGHTS.inbound.airline}
                    </span>
                    <div className="text-[11px] text-[#8c606c]">{FLIGHTS.inbound.date}</div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-[#fff0f4] text-[#a82a51] rounded-full border border-[#fad2dd]">
                  {FLIGHTS.inbound.flightNumber}
                </span>
              </div>

              {/* Flight Route Diagram */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#4a383d]">
                    {FLIGHTS.inbound.originCode}
                  </div>
                  <div className="text-xs font-medium text-[#735860] mt-0.5">
                    {FLIGHTS.inbound.origin}
                  </div>
                  <div className="text-[11px] text-[#9c7580] mt-0.5">
                    {FLIGHTS.inbound.originTerminal}
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold text-[#b83358] mt-2">
                    {FLIGHTS.inbound.departureTime}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-[11px] font-mono text-[#9c7580] mb-1">
                    {FLIGHTS.inbound.duration}
                  </span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-0.5 flex-1 bg-[#f9d7df]" />
                    {/* Requirement 2: Return flight middle plane flies ↘ (朝右下角俯衝) */}
                    <Plane className="w-4 h-4 text-[#b83358] rotate-90 shrink-0" style={{ transform: "rotate(90deg)", transformOrigin: "center" }} />
                    <div className="h-0.5 flex-1 bg-[#f9d7df]" />
                  </div>
                  <span className="text-[10px] text-[#286f4a] mt-1 font-semibold px-2 py-0.5 bg-[#f3f9f6] rounded-full border border-[#d7ecdf]">
                    直飛班機
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-[#4a383d]">
                    {FLIGHTS.inbound.destinationCode}
                  </div>
                  <div className="text-xs font-medium text-[#735860] mt-0.5">
                    {FLIGHTS.inbound.destination}
                  </div>
                  <div className="text-[11px] text-[#9c7580] mt-0.5">
                    {FLIGHTS.inbound.destinationTerminal}
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold text-[#b83358] mt-2">
                    {FLIGHTS.inbound.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Transit Tip */}
              <div className="mt-6 p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7] text-xs text-[#6b4f57] space-y-1.5">
                <div className="font-bold text-[#a82a51] flex items-center gap-1.5">
                  <LuggageSticker className="w-5 h-5" />
                  <span>返程機場報到建議：</span>
                </div>
                <p className="leading-relaxed">
                  人形町站 15:30 搭乘直通班次前往成田機場 T1，約 17:00 抵達。酷航櫃檯提前 3 小時開放辦理托運與出境，預留充裕時間在免稅店採買伴手禮。
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#fae1e7] flex items-center justify-between text-xs text-[#8c606c]">
              <span>報到航廈：成田國際機場 T1</span>
              <span>降落時間：22:55（台灣時間）</span>
            </div>
          </div>
        </div>

        {/* Hotel Details Card - commi.me Magazine Editorial Style */}
        <div className="bg-white rounded-3xl border border-[#fad4dd] p-6 sm:p-8 shadow-[0_8px_30px_rgba(240,160,180,0.08)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#fae1e7]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#fdebf0] text-[#a82a51] border border-[#fad2dd]">
                  下榻飯店 · 2026/11/28–11/29（1 泊）
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#f3f9f6] text-[#286f4a] border border-[#d7ecdf]">
                  都營淺草線直通
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#4a383d]">
                {HOTEL.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#8c606c] mt-1 font-mono">
                {HOTEL.japaneseName}
              </p>
            </div>

            <a
              href={HOTEL.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#8b2947] bg-[#fff0f4] hover:bg-[#fde2ea] rounded-full transition-all border border-[#fad4dd] shrink-0 self-start lg:self-auto hover:-translate-y-0.5"
            >
              <span>開啟飯店 Google Maps 定位</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#b83358]" />
            </a>
          </div>

          {/* Hotel Highlights Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7]">
              <div className="flex items-center gap-2 text-[#4a383d] font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-[#a82a51]" />
                <span>全室席夢思名床舒眠</span>
              </div>
              <p className="text-xs text-[#6b4f57] leading-relaxed font-normal">
                {HOTEL.features.comfort}
              </p>
            </div>

            <div className="p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7]">
              <div className="flex items-center gap-2 text-[#4a383d] font-bold text-sm mb-2">
                <Train className="w-4 h-4 text-[#286f4a]" />
                <span>黃金地鐵樞紐</span>
              </div>
              <p className="text-xs text-[#6b4f57] leading-relaxed font-normal">
                {HOTEL.features.subway}
              </p>
            </div>

            <div className="p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7]">
              <div className="flex items-center gap-2 text-[#4a383d] font-bold text-sm mb-2">
                <Luggage className="w-4 h-4 text-[#b83358]" />
                <span>免費行李寄存</span>
              </div>
              <p className="text-xs text-[#6b4f57] leading-relaxed font-normal">
                {HOTEL.features.luggage}
              </p>
            </div>
          </div>

          {/* Check-in info strip */}
          <div className="mt-6 pt-5 border-t border-[#fae1e7] flex flex-wrap items-center justify-between gap-4 text-xs text-[#735860]">
            <div className="flex items-center gap-4">
              <span><strong>入住時間：</strong>{HOTEL.checkIn}</span>
              <span><strong>退房時間：</strong>{HOTEL.checkOut}</span>
            </div>
            <div className="text-[#8c606c]">
              地址：{HOTEL.address}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
