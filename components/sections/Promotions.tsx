"use client";

import { Tag, Sparkles, Check, ArrowRight, MessageCircle, Clock } from "lucide-react";

export default function Promotions() {
  const promotions = [
    {
      badge: "แพ็กเกจยอดนิยม",
      isPopular: true,
      title: "โปรแกรม LLLT Laser ฟื้นฟูรากผม 10 ครั้ง",
      en: "Low-Level Laser Hair Restoration (10 Sessions)",
      price: "พิเศษเพียง 9,900.-",
      normalPrice: "ปกติ 15,000.-",
      save: "ประหยัด 34%",
      features: [
        "ฉายแสงเลเซอร์กระตุ้นรากผม LLLT 10 ครั้ง",
        "แถมฟรี ตรวจวิเคราะห์รากผมด้วยกล้อง Trichoscopy ทุกเดือน",
        "แถมฟรี วิตามินบำรุงรากผมสูตรเฉพาะบุคคล 1 เดือน",
        "ติดตามผลและปรับแผนการรักษาโดยแพทย์ทุกครั้ง",
      ],
      suitable: "เหมาะสำหรับผมร่วงระยะเริ่มต้น - ปานกลาง",
    },
    {
      badge: "ฟื้นฟูเร่งด่วน",
      isPopular: false,
      title: "โปรแกรม PRP สเต็มเซลล์เกล็ดเลือดเข้มข้น 3 ครั้ง",
      en: "Platelet-Rich Plasma Hair Regeneration (3 Sessions)",
      price: "พิเศษเพียง 12,900.-",
      normalPrice: "ปกติ 18,000.-",
      save: "ประหยัด 28%",
      features: [
        "ปั่นสกัด Growth Factors เข้มข้นสูงด้วยระบบปิด 3 ครั้ง",
        "แถมฟรี เลเซอร์ LLLT กระตุ้นหลังทำ PRP ทุกครั้ง",
        "ยาชาและอุปกรณ์ปลอดเชื้อมาตรฐานโรงพยาบาล",
        "กระตุ้นสเต็มเซลล์รากผมลึกถึงระดับเซลล์",
      ],
      suitable: "เหมาะสำหรับผมบางกรรมพันธุ์และรอยแสกกว้าง",
    },
    {
      badge: "ยกกระชับหน้าเรียว",
      isPopular: false,
      title: "โปรแกรม HIFU Ultra-Lift ยกกระชับกรอบหน้า",
      en: "Full Face & Neck High-Intensity Focused Ultrasound",
      price: "พิเศษเพียง 6,990.-",
      normalPrice: "ปกติ 12,000.-",
      save: "ประหยัด 42%",
      features: [
        "ยกกระชับแก้ม ร่องแก้ม และเหนียงใต้คางแบบไม่จำกัดช็อต",
        "เห็นผลทันที 20% และกระชับขึ้นต่อเนื่อง 1-2 เดือน",
        "ไม่เจ็บตัว ไม่บวมช้ำ แต่งหน้าได้ทันทีหลังทำ",
        "ดูแลและยิงพลังงานโดยแพทย์ผู้เชี่ยวชาญทุกเคส",
      ],
      suitable: "เหมาะสำหรับผู้ที่ต้องการปรับรูปหน้าและลดความหย่อนคล้อย",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E3DA] text-[11px] text-[#9A7E41] tracking-wider uppercase mb-3 shadow-xs font-semibold">
            <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Exclusive Monthly Offers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
            โปรโมชั่นและแพ็กเกจการรักษาพิเศษ
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
            สิทธิ์พิเศษเมื่อลงทะเบียนนัดหมายออนไลน์หรือจองคิวผ่าน LINE Official ประจำเดือนนี้
          </p>
        </div>

        {/* Promotion Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {promotions.map((p, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                p.isPopular
                  ? "bg-white border-2 border-[#C5A880] shadow-xl ring-2 ring-[#C5A880]/20"
                  : "bg-white border border-[#E8E3DA] shadow-xs hover:border-[#C5A880]/60 hover:shadow-md"
              }`}
            >
              <div>
                {/* Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${
                      p.isPopular
                        ? "bg-[#12151E] text-[#EADCB9]"
                        : "bg-[#FAF8F5] text-[#9A7E41] border border-[#E8E3DA]"
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="text-xs font-bold text-[#06C755] bg-[#06C755]/10 px-2.5 py-0.5 rounded-full">
                    {p.save}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-medium text-[#12151E] tracking-tight leading-snug mb-1">
                  {p.title}
                </h3>
                <div className="text-[11px] text-[#9CA3AF] font-light mb-5">
                  {p.en}
                </div>

                {/* Price Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA] mb-6">
                  <div className="text-xs text-[#9CA3AF] line-through font-light">
                    {p.normalPrice}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-[#12151E] mt-0.5">
                    {p.price}
                  </div>
                  <div className="text-[10px] text-[#9A7E41] font-medium mt-1">
                    ✓ รวมค่าตรวจและอุปกรณ์ปลอดเชื้อทั้งหมด
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 pt-1">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#374151] font-light">
                      <div className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#C5A880]/40 flex items-center justify-center text-[#9A7E41] flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#F3F4F6] space-y-3">
                <div className="text-[11px] text-[#6B7280] font-light text-center">
                  💡 {p.suitable}
                </div>

                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all ${
                    p.isPopular
                      ? "gold-gradient-btn"
                      : "bg-[#12151E] text-white hover:bg-[#C5A880] hover:text-[#12151E]"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>รับสิทธิ์โปรโมชั่นนี้ผ่าน LINE</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="mt-8 text-center text-xs text-[#9CA3AF] font-light">
          * โปรโมชั่นพิเศษสำหรับการจองคิวนัดหมายล่วงหน้าเท่านั้น คลินิกขอสงวนสิทธิ์ในการเปลี่ยนแปลงเงื่อนไขโดยมิต้องแจ้งให้ทราบล่วงหน้า
        </div>

      </div>
    </section>
  );
}
