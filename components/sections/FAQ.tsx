"use client";

import { useState } from "react";
import { Plus, Minus, MessageCircle, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "การรักษาผมร่วง ผมบาง ต้องใช้เวลานานเท่าใดจึงจะเริ่มเห็นผล?",
      a: "โดยทั่วไป วงจรการเติบโตของเส้นผมจะเริ่มสังเกตเห็นการลดลงของการหลุดร่วงใน 3–4 สัปดาห์แรก และในสัปดาห์ที่ 8–12 (ประมาณ 2-3 เดือน) จะเริ่มเห็นเส้นผมใหม่หรือไรผมที่งอกขึ้นมาและมีขนาดเส้นที่หนาขึ้น ทั้งนี้ขึ้นอยู่กับสภาพรากผมเดิมและวินัยในการดูแลรักษา",
    },
    {
      q: "การรักษาด้วยเลเซอร์ LLLT หรือ PRP เจ็บไหม และต้องพักฟื้นหรือไม่?",
      a: "การฉายแสงเลเซอร์ LLLT ไม่มีความรู้สึกเจ็บเลย ให้ความรู้สึกอุ่นสบาย ไม่ต้องพักฟื้น ส่วน PRP จะมีการทายาชาเฉพาะที่ก่อนทำ จึงรู้สึกเจ็บเพียงเล็กน้อย และเป็นสารสกัดจากเกล็ดเลือดของคนไข้เอง จึงไม่มีความเสี่ยงต่อการแพ้หรือผลข้างเคียง",
    },
    {
      q: "เข้ามาตรวจส่องกล้องสภาพผมและปรึกษาคุณหมอ มีค่าใช้จ่ายหรือไม่?",
      a: "ทางคลินิกมีบริการตรวจวิเคราะห์สภาพหนังศีรษะและรากผมเบื้องต้นโดยไม่มีค่าใช้จ่าย เพื่อให้คนไข้เข้าใจถึงสาเหตุที่แท้จริงและตัดสินใจเลือกแนวทางการรักษาตามความเหมาะสม โดยไม่มีการบังคับซื้อคอร์ส",
    },
    {
      q: "สามารถส่งรูปถ่ายให้คุณหมอประเมินอาการเบื้องต้นทาง LINE ได้หรือไม่?",
      a: "สามารถทำได้ครับ คนไข้สามารถถ่ายรูปบริเวณที่กังวล (ด้านหน้า กลางศีรษะ หรือรอยแสก) ส่งเข้ามาทาง LINE: @piyawatclinic เพื่อให้คุณหมอและทีมงานช่วยประเมินและให้คำแนะนำเบื้องต้นได้ทันที",
    },
    {
      q: "คลินิกตั้งอยู่ที่ไหน และมีการเดินทางอย่างไร?",
      a: "คลินิกตั้งอยู่บนถนนสุขุมวิท (ใกล้ BTS สถานีพร้อมพงษ์ / ทองหล่อ) เดินทางสะดวก มีที่จอดรถ VIP รองรับผู้รับบริการทุกท่าน",
    },
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E3DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3DA] text-[11px] text-[#9A7E41] tracking-wider uppercase mb-3 shadow-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
            คำถามที่พบบ่อย
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
            ข้อสงสัยที่คนไข้มักสอบถามเกี่ยวกับการรักษาผมร่วงและการเข้ารับบริการ
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E3DA] divide-y divide-[#E8E3DA] shadow-xs overflow-hidden">
          {faqs.map((f, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="p-6 sm:p-7">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-sm sm:text-base font-medium text-[#12151E] group-hover:text-[#9A7E41] transition-colors pr-4 leading-snug">
                    {f.q}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] flex items-center justify-center text-[#12151E] flex-shrink-0 transition-colors group-hover:border-[#C5A880]">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-[#9A7E41]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* LINE Prompt Banner */}
        <div className="mt-8 bg-white p-6 rounded-3xl border border-[#E8E3DA] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="text-left">
            <div className="text-sm font-medium text-[#12151E]">ต้องการสอบถามเรื่องอื่นเพิ่มเติม?</div>
            <div className="text-xs text-[#6B7280] font-light mt-0.5">ส่งคำถามและปรึกษากับคุณหมอทาง LINE ได้ตลอดเวลา</div>
          </div>
          <a
            href="https://line.me"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#06C755] text-white rounded-xl text-xs font-medium hover:bg-[#05b34c] transition-all shadow-xs flex-shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>แอด LINE: @piyawatclinic</span>
          </a>
        </div>

      </div>
    </section>
  );
}