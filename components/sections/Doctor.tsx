"use client";

import Image from "next/image";
import { Check, ShieldCheck, MessageCircle, Calendar, Award, Sparkles } from "lucide-react";

export default function Doctor() {
  const credentials = [
    "แพทยศาสตรบัณฑิต (Doctor of Medicine) มหาวิทยาลัยชั้นนำในประเทศไทย",
    "สมาชิก International Society of Hair Restoration Surgery (ISHRS) สมาคมปลูกผมระดับนานาชาติ",
    "ประสบการณ์ตรวจวินิจฉัยและดูแลรักษาผู้มีปัญหาผมร่วง ผมบาง มากกว่า 15 ปี (5,000+ เคส)",
    "ผ่านการรับรองและฝึกอบรมเทคโนโลยีเลเซอร์ฟื้นฟูรากผม LLLT และสเต็มเซลล์เกล็ดเลือด PRP ระดับสากล",
    "ผู้เชี่ยวชาญด้านเวชศาสตร์ชะลอวัยและนวัตกรรมยกกระชับผิวหน้ามาตรฐานระดับสากล",
  ];

  return (
    <section id="doctor" className="py-16 lg:py-24 bg-white border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left: Doctor Photo (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Gold border decorative accents */}
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-[#C5A880] z-20 rounded-tl-xl pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-[#C5A880] z-20 rounded-br-xl pointer-events-none" />

              <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-[#E8E3DA] shadow-lg">
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#161C2C]">
                  <Image
                    src="/images/doctor.jpg"
                    alt="นพ. ปิยวัฒน์ แพทย์เฉพาะทางด้านเส้นผมและความงาม"
                    fill
                    sizes="(max-width: 768px) 100vw, 450px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="pt-4 pb-2 px-2 text-center">
                  <div className="text-base font-medium text-[#12151E]">
                    นพ. ปิยวัฒน์ (หมอปิยวัฒน์)
                  </div>
                  <div className="text-xs text-[#9A7E41] font-medium mt-0.5">
                    แพทย์ผู้ก่อตั้ง Piyawat Clinic · สมาชิก ISHRS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Qualifications & Approach (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] text-[11px] text-[#9A7E41] font-semibold uppercase tracking-wider mb-2">
                <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Medical Director & Specialist</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
                นพ. ปิยวัฒน์
              </h2>
              <p className="text-xs sm:text-sm text-[#6B7280] font-light mt-1">
                แพทย์เฉพาะทางด้านการรักษาผมร่วง ผมบาง และเวชศาสตร์ชะลอวัย (ประสบการณ์ 15+ ปี)
              </p>
            </div>

            {/* Doctor's Philosophy Quote */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border-l-4 border-[#C5A880] border-t border-r border-b border-[#E8E3DA] shadow-xs">
              <p className="text-xs sm:text-sm text-[#374151] leading-relaxed font-light italic">
                "ปัญหาผมร่วงของแต่ละบุคคลมีสาเหตุไม่เหมือนกัน ทั้งจากพันธุกรรม ฮอร์โมน ความเครียด หรือพฤติกรรมการใช้ชีวิต การรักษาที่ได้ผลจริงจึงต้องเริ่มจากการส่องกล้องตรวจดูสภาพรากผมอย่างละเอียด เพื่อวางแผนการรักษาที่ตรงจุดและคุ้มค่าที่สุดสำหรับคนไข้ โดยไม่เน้นการผูกมัดคอร์สเกินความจำเป็น"
              </p>
            </div>

            {/* Credentials List */}
            <div className="space-y-2.5 pt-1">
              {credentials.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#374151] font-light">
                  <div className="w-4 h-4 rounded-full bg-[#FAF8F5] border border-[#C5A880]/50 flex items-center justify-center text-[#9A7E41] flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="leading-relaxed">{c}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#06C755] text-white rounded-xl text-xs font-medium hover:bg-[#05b34c] transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ส่งรูปปรึกษาคุณหมอทาง LINE ฟรี</span>
              </a>

              <a
                href="#booking"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#12151E] text-white rounded-xl text-xs font-medium hover:bg-[#C5A880] hover:text-[#12151E] transition-all shadow-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>นัดตรวจปรึกษาที่คลินิก</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}