"use client";

import Link from "next/link";
import { Phone, MapPin, Clock, MessageCircle, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1D20] text-white pt-14 pb-10 border-t border-[#C5A880]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Clinic License (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2A2B2E] flex items-center justify-center text-white border border-[#C5A880]/40">
                <span style={{ fontFamily: "var(--font-display)" }} className="text-[#C5A880] text-base">
                  P
                </span>
              </div>
              <span
                style={{ fontFamily: "var(--font-display)" }}
                className="text-2xl text-white font-normal"
              >
                Piyawat Clinic
              </span>
            </Link>

            <p className="text-xs text-white/70 font-light leading-relaxed max-w-sm">
              ปิยวัฒน์คลินิกเวชกรรม คลินิกเฉพาะทางดูแลรักษาผมร่วง ผมบาง ปลูกผม และเวชศาสตร์ชะลอวัย โดย นพ. ปิยวัฒน์ และทีมงานผู้เชี่ยวชาญ
            </p>

            <div className="pt-2 text-[11px] text-[#C5A880] space-y-1">
              <div>ใบอนุญาตประกอบกิจการสถานพยาบาลเลขที่ 1010100XXXX</div>
              <div>ควบคุมและดำเนินการโดยแพทย์ผู้มีใบประกอบวิชาชีพเวชกรรม</div>
            </div>
          </div>

          {/* Col 2: Services Directory (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              บริการยอดนิยม
            </h4>
            <ul className="space-y-1.5 text-xs text-white/70 font-light">
              <li>
                <a href="#services" className="hover:text-[#C5A880] transition-colors">
                  • LLLT เลเซอร์ฟื้นฟูรากผม
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C5A880] transition-colors">
                  • PRP สเต็มเซลล์เกล็ดเลือดเข้มข้น
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C5A880] transition-colors">
                  • Scalp Mesotherapy & Biotin Infusion
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C5A880] transition-colors">
                  • ยารักษาผมร่วงเฉพาะบุคคล
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#C5A880] transition-colors">
                  • HIFU Ultra-Lift ยกกระชับผิว
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              เกี่ยวกับคลินิก
            </h4>
            <ul className="space-y-1.5 text-xs text-white/70 font-light">
              <li>
                <a href="#doctor" className="hover:text-[#C5A880] transition-colors">
                  ประวัติแพทย์
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-[#C5A880] transition-colors">
                  ผลการรักษา
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#C5A880] transition-colors">
                  ขั้นตอนการตรวจ
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#C5A880] transition-colors">
                  คำถามที่พบบ่อย
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#C5A880] transition-colors">
                  แผนที่และติดต่อ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info (3 cols) */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              ติดต่อและเวลาทำการ
            </h4>
            <div className="space-y-2 text-xs text-white/70 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A880] flex-shrink-0 mt-0.5" />
                <span>ถนนสุขุมวิท เขตคลองเตย กรุงเทพฯ (BTS พร้อมพงษ์/ทองหล่อ)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>อังคาร - อาทิตย์ 11:00 - 20:00 น.</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A880] flex-shrink-0" />
                <span>โทร: 02-123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#06C755] flex-shrink-0" />
                <span>LINE: @piyawatclinic</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/40 font-light">
          <p>© 2026 Piyawat Clinic. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/70">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-white/70">ข้อกำหนดการใช้งาน</a>
          </div>
        </div>

      </div>
    </footer>
  );
}