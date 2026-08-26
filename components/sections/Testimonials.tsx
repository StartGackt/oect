"use client";

import { Star, CheckCircle2 } from "lucide-react";

const reviews = [
  {
    name: "คุณอนุชา ว.",
    role: "ผู้รับบริการรักษาผมบาง",
    treatment: "โปรแกรม LLLT Laser + PRP 6 ครั้ง",
    comment:
      "ผมร่วงหนักมากช่วงทำงานหนักจนเห็นหนังศีรษะชัด มาปรึกษาคุณหมอปิยวัฒน์ตรวจละเอียดมาก อธิบายตรงไปตรงมา ไม่ยัดเยียดคอร์ส หลังทำ 2 เดือนผมหยุดร่วงและเริ่มมีลูกผมใหม่ขึ้นชัดเจนครับ",
  },
  {
    name: "คุณพิมลดา ก.",
    role: "ผู้รับบริการฟื้นฟูรากผม",
    treatment: "Scalp Meso & Hair Care",
    comment:
      "ประทับใจความสะอาดและความเป็นส่วนตัวของคลินิกมากค่ะ คุณหมอและพนักงานดูแลดีมาก ผมที่เคยบางหลังคลอดตอนนี้กลับมาหนาและมีวอลลุ่มขึ้นเยอะมากค่ะ แนะนำเลย",
  },
  {
    name: "Mr. Kenji S.",
    role: "Expat Patient in Bangkok",
    treatment: "Hair Restoration Program",
    comment:
      "Very clean and professional clinic. Dr. Piyawat gave me clear medical advice and the laser treatment was very comfortable. Noticeable improvement in hair density after 3 months!",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-[#9A7E41] font-medium tracking-wider uppercase block mb-1">
            Patient Testimonials
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-[#12151E] tracking-tight">
            เสียงตอบรับจากผู้รับบริการจริง
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
            ความประทับใจและความไว้วางใจจากคนไข้ที่เข้ารับการรักษาที่ Piyawat Clinic
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-[#E8E3DA] hover:border-[#C5A880] transition-all duration-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex text-[#E6A100] mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#E6A100]" />
                  ))}
                </div>

                <div className="text-[11px] text-[#9A7E41] font-medium mb-3">
                  {r.treatment}
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] font-light leading-relaxed mb-6">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#F3F4F6] flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#12151E]">{r.name}</div>
                  <div className="text-[11px] text-[#9CA3AF] font-light">{r.role}</div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#06C755] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
