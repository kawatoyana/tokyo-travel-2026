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
  ShieldAlert,
} from "lucide-react";

export const FlightHotelSection: React.FC = () => {
  return (
    <section id="flight-hotel" className="py-16 sm:py-20 bg-[#f7f6f2] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 mb-2">
            <Plane className="w-3.5 h-3.5 text-amber-700" />
            <span>Flights & Accommodation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            航班及住宿資訊
          </h2>
          <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
            酷航早去晚回班次安排、淺草線 Access 特急免換乘直達秘訣，與日本橋人形町大浴場飯店規格。
          </p>
        </div>

        {/* Flight Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Outbound Card: TR866 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-bold text-slate-900">
                    去程航班 · {FLIGHTS.outbound.airline}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md">
                  {FLIGHTS.outbound.flightNumber}
                </span>
              </div>

              {/* Flight Route Diagram */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">
                    {FLIGHTS.outbound.originCode}
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    {FLIGHTS.outbound.origin}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {FLIGHTS.outbound.originTerminal}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-2">
                    {FLIGHTS.outbound.departureTime}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-xs font-mono text-slate-500 mb-1">
                    {FLIGHTS.outbound.duration}
                  </span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-0.5 flex-1 bg-slate-200" />
                    <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">直飛直達</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">
                    {FLIGHTS.outbound.destinationCode}
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    {FLIGHTS.outbound.destination}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {FLIGHTS.outbound.destinationTerminal}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-2">
                    {FLIGHTS.outbound.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Date & Aircraft Specs */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">出發日期</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {FLIGHTS.outbound.date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">執飛機型</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {FLIGHTS.outbound.aircraft}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {FLIGHTS.outbound.notes}
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>建議 04:50 抵達桃機 T1 報到，登機門於起飛前 20 分鐘關閉。</span>
            </div>
          </div>

          {/* Inbound Card: TR875 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-amber-700" />
                  <span className="text-sm font-bold text-slate-900">
                    回程航班 · {FLIGHTS.inbound.airline}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md">
                  {FLIGHTS.inbound.flightNumber}
                </span>
              </div>

              {/* Flight Route Diagram */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">
                    {FLIGHTS.inbound.originCode}
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    {FLIGHTS.inbound.origin}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {FLIGHTS.inbound.originTerminal}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-2">
                    {FLIGHTS.inbound.departureTime}
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center px-2">
                  <span className="text-xs font-mono text-slate-500 mb-1">
                    {FLIGHTS.inbound.duration}
                  </span>
                  <div className="w-full flex items-center gap-1">
                    <div className="h-0.5 flex-1 bg-slate-200" />
                    <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1">直飛返台</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">
                    {FLIGHTS.inbound.destinationCode}
                  </div>
                  <div className="text-xs font-medium text-slate-600 mt-0.5">
                    {FLIGHTS.inbound.destination}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {FLIGHTS.inbound.destinationTerminal}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-amber-800 mt-2">
                    {FLIGHTS.inbound.arrivalTime}
                  </div>
                </div>
              </div>

              {/* Date & Aircraft Specs */}
              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">回程日期</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {FLIGHTS.inbound.date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">執飛機型</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {FLIGHTS.inbound.aircraft}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                {FLIGHTS.inbound.notes}
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>最晚 17:30 抵達成田 T1 報到，預留充裕時間出境與採買伴手禮。</span>
            </div>
          </div>
        </div>

        {/* Hotel Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Hotel Identity, Address & Highlights */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
                <Building2 className="w-4 h-4" />
                <span>Accommodation & Onsen</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                {HOTEL.name}
              </h3>
              <div className="text-xs text-slate-500 mt-1">
                {HOTEL.japaneseName}
              </div>

              <div className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                位於東京中央區日本橋老街核心地段。最大優勢為「都營淺草線」直達成田機場免換車，步行 3 分鐘即可抵達小網神社與甘酒橫丁。頂樓配備「水天之湯」微細氣泡溫泉大浴場，是跑步與觀劇後修復身心的極佳享受。
              </div>

              {/* Key Amenities */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <Bath className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">水天之湯大浴場</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {HOTEL.features.bathhouse}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <Luggage className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">智慧行李免費寄存</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {HOTEL.features.luggage}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <Train className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">機場直達極速通勤</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {HOTEL.features.subway}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-slate-900">便利商店與下町老街</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {HOTEL.features.convenience}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Check-in / Out, Transit Spec & Google Maps button */}
            <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                入住與交通資訊
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block">飯店地址</span>
                  <span className="font-medium text-slate-800">{HOTEL.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block">入住時間 (Check-in)</span>
                    <span className="font-semibold text-slate-800">{HOTEL.checkIn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">退房時間 (Check-out)</span>
                    <span className="font-semibold text-slate-800">{HOTEL.checkOut}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block">最近地鐵站出口</span>
                  <span className="text-slate-600 leading-relaxed block mt-0.5">
                    {HOTEL.access}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={HOTEL.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
                >
                  <span>開啟飯店 Google 地圖導航</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Airport Access Notice Banner */}
        <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>搭車乘車關鍵提示：</strong>在人形町站搭乘「都營淺草線」時，請看準月台跑馬燈標示「
            <strong>成田空港行（Access 特急／快速特急）</strong>」的直通班次，無需在青砥或高砂換車，一車到底直抵成田機場第一航廈地下月台。
          </div>
        </div>
      </div>
    </section>
  );
};
