"use client";

import { MapPin, Clock, Train, Phone, Navigation, Car, Sparkles } from "lucide-react";

export default function ClinicLocation() {
  return (
    <section id="location" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3DA] text-[11px] text-[#9A7E41] tracking-wider uppercase mb-3 shadow-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Clinic Location & Map</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
            สถานที่ตั้งและการเดินทาง
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
            คลินิกตั้งอยู่บนถนนสุขุมวิท ใจกลางกรุงเทพฯ เดินทางสะดวกทั้งรถไฟฟ้า BTS และรถยนต์ส่วนตัว
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-7 rounded-3xl border border-[#E8E3DA] shadow-xs space-y-3 hover:border-[#C5A880] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center text-[#9A7E41]">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-base font-medium text-[#12151E]">ที่อยู่คลินิก</div>
            <p className="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed">
              อาคารปิยวัฒน์ เมดิคอล เซ็นเตอร์ ชั้น 3 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#E8E3DA] shadow-xs space-y-3 hover:border-[#C5A880] transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center text-[#9A7E41]">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-base font-medium text-[#12151E]">วันและเวลาทำการ</div>
            <p className="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed">
              วันอังคาร – วันอาทิตย์ : 11:00 – 20:00 น. <br />
              <span className="text-[#9A7E41] font-medium">(หยุดทำการทุกวันจันทร์)</span>
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#E8E3DA] shadow-xs space-y-3 flex flex-col justify-between hover:border-[#C5A880] transition-colors">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center text-[#9A7E41] mb-3">
                <Train className="w-5 h-5" />
              </div>
              <div className="text-base font-medium text-[#12151E]">การเดินทาง & ที่จอดรถ</div>
              <p className="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed mt-1">
                BTS พร้อมพงษ์ / ทองหล่อ (ทางออก 2) มีที่จอดรถ VIP รองรับผู้รับบริการทุกท่าน
              </p>
            </div>
            
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#12151E] font-medium hover:text-[#9A7E41] transition-colors pt-3"
            >
              <Navigation className="w-4 h-4 text-[#9A7E41]" />
              <span>เปิด Google Maps นำทางสู่คลินิก →</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
