import React, { useState, useEffect } from "react";
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
  QrCode,
  RefreshCw,
} from "lucide-react";
import {
  LuggageSticker,
  TrainSticker,
  SparkleDoodle,
  FloatingBubble,
} from "./CuteDoodles";
import { VjwGuideModal } from "./VjwGuideModal";
import { OutboundPlaneIcon, InboundPlaneIcon } from "./FlightIcons";
import {
  fetchTaoyuanFlightCounter,
  DEFAULT_TPE_SCOOT_COUNTER,
  FlightCounterInfo,
} from "../services/taoyuanAirportService";

export const FlightHotelSection: React.FC = () => {
  const [isVjwOpen, setIsVjwOpen] = useState<boolean>(false);
  const [tpeCounter, setTpeCounter] = useState<FlightCounterInfo>(DEFAULT_TPE_SCOOT_COUNTER);
  const [isRefreshingTpe, setIsRefreshingTpe] = useState<boolean>(false);

  const loadTpeCounter = async () => {
    try {
      setIsRefreshingTpe(true);
      const data = await fetchTaoyuanFlightCounter();
      setTpeCounter(data);
    } catch (err) {
      console.warn("TPE counter refresh error:", err);
    } finally {
      setIsRefreshingTpe(false);
    }
  };

  useEffect(() => {
    loadTpeCounter();
  }, []);
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
                    <OutboundPlaneIcon className="w-4 h-4" />
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
                    <OutboundPlaneIcon className="w-4 h-4 text-[#b83358] shrink-0" />
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

              {/* Requirement 5: Official Taoyuan Airport Real-Time Check-in Counter */}
              <div className="mt-5 p-4 bg-gradient-to-br from-[#fff2f5] via-white to-[#fff8fa] rounded-2xl border border-[#faccd7] shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#fae1e7]">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </div>
                    <span className="text-[11px] font-bold text-[#8e2443] uppercase tracking-wider font-mono">
                      桃園國際機場官方 FIDS 連線
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fdebf0] text-[#a82a51] font-bold border border-[#fad2dd]">
                      {tpeCounter.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] text-[#9c7580] font-mono">
                      {tpeCounter.updatedAt}
                    </span>
                    <button
                      type="button"
                      onClick={loadTpeCounter}
                      disabled={isRefreshingTpe}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white hover:bg-[#fff0f4] text-[#8e2443] border border-[#f3d9de] text-[11px] font-semibold cursor-pointer shadow-2xs transition-all disabled:opacity-50"
                      title="向桃園機場官方系統重新整理最新櫃台"
                    >
                      <RefreshCw className={`w-3 h-3 ${isRefreshingTpe ? "animate-spin text-[#b83358]" : ""}`} />
                      <span>更新櫃台</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-[#fae0e6] shadow-2xs">
                    <span className="text-[10px] text-[#9c7580] block font-medium">機場報到櫃台 (Check-in)</span>
                    <span className="text-sm sm:text-base font-extrabold text-[#b83358] font-mono mt-0.5 block">
                      {tpeCounter.counter}
                    </span>
                    <span className="text-[10px] text-[#735860] block mt-0.5">{tpeCounter.terminal}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-[#fae0e6] shadow-2xs">
                    <span className="text-[10px] text-[#9c7580] block font-medium">櫃台開放時間</span>
                    <span className="text-xs sm:text-sm font-bold text-[#4a383d] font-mono mt-0.5 block">
                      04:20–05:50
                    </span>
                    <span className="text-[10px] text-[#a82a51] block mt-0.5">起飛前 60 分鐘關櫃</span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#786b6f]">
                  <span>預估登機門：{tpeCounter.gate}</span>
                  <a
                    href="https://www.taoyuan-airport.com/flight_departures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#8e2443] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>桃機官網航顯</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Transit Tip */}
              <div className="mt-5 p-4 bg-[#fff7f8] rounded-2xl border border-[#fae1e7] text-xs text-[#6b4f57] space-y-1.5">
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
                    <InboundPlaneIcon className="w-4 h-4" />
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
                    <InboundPlaneIcon className="w-4 h-4 text-[#b83358] shrink-0" />
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

        {/* Requirement 13: Interactive Visit Japan Web (VJW) Setup Guide Card */}
        <div className="mb-12 bg-gradient-to-r from-[#fff2f5] via-[#fff9fa] to-white rounded-3xl border border-[#faccd7] p-5 sm:p-7 shadow-[0_6px_25px_rgba(240,160,180,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#992545] text-white flex items-center justify-center shrink-0 shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#992545] uppercase tracking-wider">
                  VISIT JAPAN WEB ASSISTANT
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  通關必備
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#2d2527] mt-1">
                Visit Japan Web 入境預填複製助手 ＆ 離線 QR Code 保險箱
              </h3>
              <p className="text-xs text-[#6e5d62] mt-1 max-w-xl leading-relaxed">
                包含酷航 TR866 航班與人形町飯店日文/英文地址一鍵複製、7 大入境手續進度清單，並可上傳與離線保存通關 QR Code。
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVjwOpen(true)}
            className="w-full md:w-auto px-6 py-3 rounded-full bg-[#992545] hover:bg-[#7e1c36] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:-translate-y-0.5"
          >
            <QrCode className="w-4 h-4 text-pink-200" />
            <span>開啟 VJW 設定指南</span>
          </button>
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

      {/* VJW Interactive Assistant Modal */}
      <VjwGuideModal isOpen={isVjwOpen} onClose={() => setIsVjwOpen(false)} />
    </section>
  );
};
