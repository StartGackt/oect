"use client";

import Image from "next/image";
import { Check, MessageCircle, ArrowRight, ShieldCheck, Star, Sparkles, Award, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0E131F] text-white py-14 lg:py-24 border-b border-[#C5A880]/30">
      {/* Background Ambient Glow Lights */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#9A7E41]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Gold Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C5A880]/40 text-xs shadow-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#06C755] animate-pulse" />
              <span className="text-[#EADCB9] font-medium tracking-wide">
                คลินิกเฉพาะทางรักษาผมร่วง ผมบาง กรุงเทพฯ · สุขุมวิท
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.18] tracking-tight">
                รักษาผมร่วง ผมบาง <br />
                <span className="text-gold-shine font-semibold">
                  คืนความมั่นใจ
                </span>{" "}
                โดยแพทย์เฉพาะทาง
              </h1>
              <p
                style={{ fontFamily: "var(--font-sans-display)" }}
                className="text-base sm:text-lg text-white/60 font-light tracking-wide pt-1"
              >
                Piyawat Hair Restoration & Aesthetic Clinic Bangkok
              </p>
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light max-w-xl">
              ตรวจวินิจฉัยโครงสร้างรากผมระดับเซลล์ด้วยกล้องกำลังขยายสูง 
              วางแผนการรักษาเฉพาะบุคคลโดย <strong>นพ. ปิยวัฒน์</strong> แพทย์เฉพาะทางประสบการณ์กว่า 15 ปี 
              ด้วยนวัตกรรมเลเซอร์ LLLT, PRP สเต็มเซลล์เกล็ดเลือดเข้มข้น และยารักษามาตรฐานสากล ไม่เจ็บ ไม่ต้องพักฟื้น ไม่ผูกมัดคอร์ส
            </p>

            {/* Key Advantages Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "ตรวจวิเคราะห์รากผมฟรี ไม่มีค่าใช้จ่าย",
                "เลเซอร์ LLLT มาตรฐานสากล US-FDA",
                "สเต็มเซลล์เกล็ดเลือด PRP เข้มข้น ปลอดภัย",
                "ดูแลและปรับแผนการรักษาโดยแพทย์ทุกเคส",
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-white/90 font-light">
                  <div className="w-4 h-4 rounded-full bg-[#C5A880]/20 border border-[#C5A880] flex items-center justify-center text-[#EADCB9] flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Dual Action CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl gold-gradient-btn text-xs sm:text-sm tracking-wide shadow-lg"
              >
                <Calendar className="w-4 h-4" />
                <span>นัดหมายตรวจสภาพผม ฟรี (ไม่มีค่าใช้จ่าย)</span>
              </a>

              <a
                href="https://line.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#06C755] text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-[#05b34c] transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>ส่งรูปปรึกษาแพทย์ทาง LINE</span>
              </a>
            </div>

            {/* Social Proof & Rating */}
            <div className="pt-6 border-t border-white/15 flex flex-wrap items-center gap-5 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <div className="flex text-[#E6A100]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E6A100]" />
                  ))}
                </div>
                <span className="font-semibold text-white text-sm">4.9 / 5.0</span>
                <span>จาก 500+ รีวิวคนไข้จริงบน Google</span>
              </div>
              <span className="text-white/20 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 text-white/80">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>มาตรฐานสถานพยาบาลเวชกรรมถูกต้อง</span>
              </div>
            </div>

          </div>

          {/* Right Column: Grand Doctor Presentation (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Luxury Frame Accents */}
              <div className="absolute -top-3 -left-3 w-14 h-14 border-t-2 border-l-2 border-[#C5A880] z-20 pointer-events-none rounded-tl-xl" />
              <div className="absolute -bottom-3 -right-3 w-14 h-14 border-b-2 border-r-2 border-[#C5A880] z-20 pointer-events-none rounded-br-xl" />

              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl bg-[#161C2C] border border-[#C5A880]/40">
                <Image
                  src="/images/doctor2.jpg"
                  alt="นพ. ปิยวัฒน์ คลินิกรักษาผมร่วง ผมบาง กรุงเทพ"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-top hover:scale-102 transition-transform duration-700"
                  priority
                />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0E131F]/90 backdrop-blur-md border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        นพ. ปิยวัฒน์ (หมอปิยวัฒน์)
                      </h2>
                      <p className="text-[11px] text-[#EADCB9] font-light">
                        Hair Restoration & Aesthetic Specialist
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#C5A880] text-[#0E131F] text-[10px] font-bold tracking-wider uppercase">
                      15+ Years
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Top Right */}
              <div className="absolute -top-4 -right-4 bg-white text-[#12151E] px-3.5 py-2 rounded-xl shadow-xl border border-[#E8E3DA] flex items-center gap-2 z-30">
                <Award className="w-4 h-4 text-[#C5A880]" />
                <span className="text-[11px] font-bold">ISHRS Certified Member</span>
              </div>

              {/* Floating Badge 2: Bottom Left */}
              <div className="absolute -bottom-4 -left-4 bg-[#12151E] text-white px-3.5 py-2 rounded-xl shadow-xl border border-[#C5A880]/40 flex items-center gap-2 z-30">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
                <span className="text-[11px] font-medium text-[#EADCB9]">5,000+ เคสความไว้วางใจ</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}