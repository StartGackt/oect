"use client";

import { useState } from "react";
import Image from "next/image";
import { TrendingUp, ShieldCheck, ArrowRight, Calendar, Sparkles } from "lucide-react";

export default function ResultsShowcase() {
  const [activeTab, setActiveTab] = useState<"hair" | "skin">("hair");

  return (
    <section id="results" className="py-16 lg:py-24 bg-white border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] text-[11px] text-[#737373] tracking-wider uppercase mb-3 shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Piyawat Clinic Verified Case Records</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#12151E] tracking-tight">
            ผลลัพธ์การรักษาจริงของคลินิก
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#4B5563] font-light">
            ภาพถ่ายจริงจากเคสการรักษาของคุณหมอปิยวัฒน์ ไม่มีการตกแต่งภาพ เพื่อความโปร่งใสและมาตรฐานทางการแพทย์
          </p>

          {/* Tab Switcher */}
          <div className="mt-7 inline-flex p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA]">
            <button
              onClick={() => setActiveTab("hair")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "hair"
                  ? "bg-[#12151E] text-white shadow-md"
                  : "text-[#737373] hover:text-[#12151E]"
              }`}
            >
              เคสรักษาผมร่วง ผมบาง (Hair Cases)
            </button>
            <button
              onClick={() => setActiveTab("skin")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "skin"
                  ? "bg-[#12151E] text-white shadow-md"
                  : "text-[#737373] hover:text-[#12151E]"
              }`}
            >
              เคสฟื้นฟูผิวพรรณ (Skin & Anti-Aging)
            </button>
          </div>
        </div>

        {/* Case Card */}
        {activeTab === "hair" ? (
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E3DA] p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left: Real Clinical Photo (7 cols) */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden border border-[#E8E3DA] shadow-md bg-white">
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src="/images/Slide3.jpg"
                      alt="เคสรักษาผมบางกลางกระหม่อม Piyawat Clinic"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain bg-white"
                    />
                  </div>

                  <div className="bg-white p-3.5 border-t border-[#E8E3DA] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-[#F3F4F6] text-[#12151E] font-semibold text-[11px]">
                        ซ้าย: ก่อนรักษา (Before)
                      </span>
                      <span className="text-[#9CA3AF]">→</span>
                      <span className="px-2.5 py-0.5 rounded bg-[#FAF8F5] text-[#9A7E41] font-semibold text-[11px] border border-[#C5A880]/40">
                        ขวา: หลังรักษา 12 สัปดาห์ (After)
                      </span>
                    </div>
                    <span className="text-[10px] text-[#9CA3AF] hidden sm:inline">Piyawat Clinic Clinical Record</span>
                  </div>
                </div>
              </div>

              {/* Right: Case Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-[#9A7E41] text-xs font-semibold border border-[#E8E3DA]">
                  เคสรักษาผมบางกลางกระหม่อม (Vertex Thinning)
                </span>

                <h3 className="text-xl sm:text-2xl font-normal text-[#12151E] tracking-tight">
                  ฟื้นฟูรากผมโดยไม่ต้องผ่าตัดปลูกผม
                </h3>

                <div className="space-y-2.5 text-xs text-[#4B5563]">
                  <div className="bg-white p-3.5 rounded-xl border border-[#E8E3DA]">
                    <span className="text-[#9CA3AF] block text-[10px] uppercase font-medium">โปรแกรมการรักษา</span>
                    <span className="font-medium text-[#12151E]">LLLT Laser Helmet + PRP Growth Factor Infusion</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E8E3DA]">
                    <span className="text-[#9CA3AF] block text-[10px] uppercase font-medium">ระยะเวลาการรักษา</span>
                    <span className="font-medium text-[#12151E]">3 เดือน (12 สัปดาห์) ต่อเนื่อง</span>
                  </div>
                </div>

                {/* Density highlight box */}
                <div className="p-4 rounded-2xl bg-[#12151E] text-white flex items-center justify-between border border-[#C5A880]/30 shadow-md">
                  <div>
                    <div className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">
                      ความหนาแน่นของเส้นผม
                    </div>
                    <div
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-3xl font-light text-[#EADCB9] mt-0.5"
                    >
                      +52% Density
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-white/80 font-light">
                    เส้นผมหนาขึ้น ดกดำขึ้น <br /> ปกคลุมหนังศีรษะมิดชิด
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 text-xs text-[#12151E] font-medium hover:text-[#9A7E41] transition-colors"
                  >
                    <span>นัดตรวจประเมินเคสของคุณกับแพทย์ →</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E3DA] p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left: Real Anti-Aging Photo (7 cols) */}
              <div className="lg:col-span-7">
                <div className="relative rounded-2xl overflow-hidden border border-[#E8E3DA] shadow-md bg-white">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src="/images/Reverse-Aging-for-web-edited.jpg"
                      alt="โปรแกรมย้อนวัยผิวพรรณ Reverse Aging Piyawat Clinic"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover"
                    />
                  </div>

                  <div className="bg-white p-3.5 border-t border-[#E8E3DA] flex items-center justify-between text-xs">
                    <span className="text-xs font-medium text-[#12151E]">
                      3-Stage Anti-Aging & Rejuvenation Evolution
                    </span>
                    <span className="text-[10px] text-[#9CA3AF]">Piyawat Aesthetic Standard</span>
                  </div>
                </div>
              </div>

              {/* Right: Details (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-[#9A7E41] text-xs font-semibold border border-[#E8E3DA]">
                  โปรแกรมฟื้นฟูโครงสร้างผิวและริ้วรอย (Reverse Aging)
                </span>

                <h3 className="text-xl sm:text-2xl font-normal text-[#12151E] tracking-tight">
                  ย้อนวัยผิวพรรณ ยกกระชับ คืนความอ่อนเยาว์
                </h3>

                <div className="space-y-2.5 text-xs text-[#4B5563]">
                  <div className="bg-white p-3.5 rounded-xl border border-[#E8E3DA]">
                    <span className="text-[#9CA3AF] block text-[10px] uppercase font-medium">เทคโนโลยีที่ใช้</span>
                    <span className="font-medium text-[#12151E]">HIFU Ultra-Sound Lift + Laser Rejuvenation + Vitamin Infusion</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#E8E3DA]">
                    <span className="text-[#9CA3AF] block text-[10px] uppercase font-medium">ผลลัพธ์ที่สังเกตได้</span>
                    <span className="font-medium text-[#12151E]">ริ้วรอยร่องแก้มตื้นขึ้น รูขุมขนกระชับ ผิวเรียบเนียนกระจ่างใส</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#12151E] text-white flex items-center justify-between border border-[#C5A880]/30 shadow-md">
                  <div>
                    <div className="text-[10px] text-[#C5A880] uppercase tracking-wider font-semibold">
                      ระดับความพึงพอใจ
                    </div>
                    <div
                      style={{ fontFamily: "var(--font-display)" }}
                      className="text-3xl font-light text-[#EADCB9] mt-0.5"
                    >
                      96% Satisfaction
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-white/80 font-light">
                    ไม่บวม ไม่ช้ำ <br /> ไม่ต้องพักฟื้นหลังทำ
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1.5 text-xs text-[#12151E] font-medium hover:text-[#9A7E41] transition-colors"
                  >
                    <span>ปรึกษาโปรแกรมดูแลผิวพรรณกับแพทย์ →</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-[#9CA3AF] font-light">
          * ผลลัพธ์ของการรักษาขึ้นอยู่กับสภาพร่างกาย สาเหตุ และการตอบสนองของแต่ละบุคคล
        </div>

      </div>
    </section>
  );
}
