"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Phone, ArrowRight, ShieldCheck, Clock, Calendar, Sparkles } from "lucide-react";

export default function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("hair-loss");
  const [preferredTime, setPreferredTime] = useState("afternoon");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <section id="booking" className="py-16 lg:py-24 bg-white border-b border-[#E8E3DA]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E3DA] p-8 sm:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3DA] text-[11px] text-[#9A7E41] tracking-wider uppercase mb-3 shadow-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Appointment & Consultation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
              นัดหมายตรวจสภาพเส้นผมกับแพทย์
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
              กรอกข้อมูลเพื่อนัดหมายเวลาตรวจ (ไม่มีค่าใช้จ่าย) หรือส่งรูปถ่ายเพื่อปรึกษาคุณหมอทาง LINE Official
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-3 bg-white rounded-3xl p-8 border border-[#E8E3DA] shadow-sm relative z-10">
              <div className="w-14 h-14 rounded-full bg-[#06C755]/10 text-[#06C755] flex items-center justify-center mx-auto border border-[#06C755]/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-medium text-[#12151E]">
                ได้รับข้อมูลการนัดหมายเรียบร้อยแล้ว
              </h3>
              <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto font-light leading-relaxed">
                เจ้าหน้าที่คลินิกจะติดต่อกลับทางเบอร์ <span className="font-semibold text-[#12151E]">{phone}</span> เพื่อยืนยันวันและเวลาที่สะดวกภายใน 30 นาที (เวลาทำการ 11:00 - 20:00 น.)
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#9A7E41] underline pt-3 block mx-auto hover:text-[#12151E]"
              >
                ส่งข้อมูลนัดหมายใหม่
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 bg-white p-7 sm:p-9 rounded-3xl border border-[#E8E3DA] shadow-md relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#374151] mb-1 font-medium">
                    ชื่อ - นามสกุล *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณสมชาย ใจดี"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#12151E] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#374151] mb-1 font-medium">
                    เบอร์โทรศัพท์ติดต่อ *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 081-234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#12151E] focus:outline-none focus:border-[#C5A880] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#374151] mb-1 font-medium">
                  ปัญหาหรือโปรแกรมที่ต้องการปรึกษา
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#12151E] focus:outline-none focus:border-[#C5A880] transition-colors"
                >
                  <option value="hair-loss">รักษาผมร่วง ผมบาง (Hair Loss Program)</option>
                  <option value="lllt">เลเซอร์ฟื้นฟูรากผม LLLT</option>
                  <option value="prp">สเต็มเซลล์เกล็ดเลือดเข้มข้น PRP</option>
                  <option value="meso">วิตามินบำรุงหนังศีรษะ Scalp Meso</option>
                  <option value="skin">ดูแลผิวพรรณ / HIFU ยกกระชับ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#374151] mb-1 font-medium">
                  ช่วงเวลาที่สะดวกรับสายหรือเข้าตรวจ
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#E8E3DA] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#12151E] focus:outline-none focus:border-[#C5A880] transition-colors"
                >
                  <option value="morning">ช่วงเช้า (11:00 - 13:00 น.)</option>
                  <option value="afternoon">ช่วงบ่าย (13:00 - 17:00 น.)</option>
                  <option value="evening">ช่วงเย็น (17:00 - 20:00 น.)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl gold-gradient-btn text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 mt-3 shadow-md"
              >
                <span>ส่งคำขอนัดหมายตรวจแพทย์ (ฟรี)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B7280] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>ข้อมูลของท่านถูกเก็บเป็นความลับทางการแพทย์ 100%</span>
              </div>
            </form>
          )}

          {/* Direct LINE Connect Bar */}
          <div className="mt-8 pt-6 border-t border-[#E8E3DA] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#06C755] text-white hover:bg-[#05b34c] transition-all font-medium shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ส่งรูปประเมินอาการทาง LINE: @piyawatclinic</span>
            </a>

            <a
              href="tel:021234567"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-[#E8E3DA] text-[#374151] hover:bg-[#FAF8F5] transition-all shadow-2xs"
            >
              <Phone className="w-4 h-4 text-[#9A7E41]" />
              <span>โทรติดต่อคลินิก: 02-123-4567</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}