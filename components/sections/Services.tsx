"use client";

import { useState } from "react";
import { Check, ArrowRight, MessageCircle, Clock, ShieldCheck, Sparkles } from "lucide-react";

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<"hair" | "skin">("hair");

  const hairTreatments = [
    {
      title: "LLLT เลเซอร์บำบัดฟื้นฟูรากผม",
      en: "Low-Level Laser Therapy (US-FDA Certified 650nm)",
      desc: "การใช้คลื่นแสงเลเซอร์พลังงานต่ำความยาวคลื่น 650 นาโนเมตร ส่องกระตุ้นระบบไหลเวียนโลหิตและเพิ่มพลังงาน ATP ในเซลล์รากผม ช่วยปลุกรากผมที่ฝ่อตัวให้กลับมาผลิตเส้นผมใหม่ที่หนาและแข็งแรงขึ้น",
      points: [
        "ชะลอการหลุดร่วงและกระตุ้นการงอกใหม่ของเส้นผมอย่างเป็นธรรมชาติ",
        "ไม่เจ็บตัว ไม่ต้องฉีดยา ไม่ต้องผ่าตัด และไม่ต้องพักฟื้นหลังทำ",
        "เหมาะสำหรับผู้ที่มีปัญหาผมบางระยะเริ่มต้นถึงปานกลางและผมร่วงหลังคลอด",
      ],
      time: "30 นาที / ครั้ง",
      downtime: "ไม่ต้องพักฟื้น",
      highlight: "US-FDA Standard",
    },
    {
      title: "PRP สเต็มเซลล์เกล็ดเลือดเข้มข้น",
      en: "Platelet-Rich Plasma Hair Regeneration Therapy",
      desc: "การนำเลือดของคนไข้มาปั่นสกัดด้วยระบบปิดมาตรฐานทางการแพทย์ เพื่อคัดแยกพลาสมาที่มี Growth Factors และเกล็ดเลือดเข้มข้นสูง นำกลับไปฉีดบำรุงเซลล์รากผมอย่างลึกซึ้ง",
      points: [
        "สารสกัดจากร่างกายตนเอง 100% ปลอดเชื้อ ปลอดภัย ไม่มีสารแปลกปลอม",
        "ฟื้นฟูและซ่อมแซมเซลล์รากผมที่อ่อนแอให้กลับมาทำงานเต็มประสิทธิภาพ",
        "เพิ่มความหนาแน่นและเพิ่มขนาดเส้นผ่านศูนย์กลางของเส้นผมอย่างเห็นได้ชัด",
      ],
      time: "45–60 นาที",
      downtime: "สระผมได้ตามปกติในวันถัดไป",
      highlight: "High Growth Factors",
    },
    {
      title: "Scalp Mesotherapy & เปปไทด์บำรุงรากผม",
      en: "Direct Scalp Nutrient & Biotin Complex Infusion",
      desc: "การส่งผ่านวิตามินรวม เปปไทด์ ไบโอติน และแร่ธาตุอาหารจำเป็นเข้าสู่ชั้นหนังศีรษะโดยตรง เพื่อแก้ปัญหาผมร่วงจากความเครียด มลภาวะ การขาดสารอาหาร หรือการเปลี่ยนแปลงของฮอร์โมน",
      points: [
        "สูตรสารอาหารปรับแต่งตามสภาพปัญหาของแต่ละบุคคลโดยแพทย์",
        "ลดการอักเสบและควบคุมความมันส่วนเกินบนหนังศีรษะ",
        "เสริมสร้างเคราตินให้โครงสร้างเส้นผมแข็งแรง ไม่เปราะขาดง่าย",
      ],
      time: "30 นาที",
      downtime: "ไม่ต้องพักฟื้น",
      highlight: "Custom Nutrient",
    },
    {
      title: "ยารักษาผมร่วงเฉพาะบุคคล (DHT Blocker)",
      en: "Personalized Oral & Topical Therapeutics",
      desc: "การจ่ายยารับประทานและยาทาภายนอก เพื่อยับยั้งฮอร์โมน DHT ซึ่งเป็นสาเหตุหลักของผมบางจากพันธุกรรม วินิจฉัยและปรับขนาดยาอย่างเหมาะสมโดยแพทย์เฉพาะทาง",
      points: [
        "ยับยั้งการฝ่อตัวของรากผมและชะลอการหลุดร่วงอย่างได้ผลตรงจุด",
        "แพทย์ตรวจติดตามผลและตรวจสุขภาพอย่างสม่ำเสมอเพื่อความปลอดภัยสูงสุด",
        "ใช้ควบคู่กับหัตถการเลเซอร์หรือ PRP เพื่อผลลัพธ์ที่รวดเร็วยิ่งขึ้น",
      ],
      time: "ตรวจประเมิน 20 นาที",
      downtime: "ไม่มี",
      highlight: "Medical Grade",
    },
  ];

  const skinTreatments = [
    {
      title: "HIFU ยกกระชับผิวหน้าและกรอบหน้า",
      en: "High-Intensity Focused Ultrasound Ultra-Lift",
      desc: "คลื่นอัลตราซาวด์ความเข้มข้นสูงส่งพลังงานลงลึกถึงชั้นกล้ามเนื้อ SMAS กระตุ้นการสร้างคอลลาเจนใหม่ ยกกระชับแก้มที่หย่อนคล้อย ร่องแก้ม และเหนียงใต้คางโดยไม่ต้องผ่าตัด",
      points: [
        "ยกกระชับปรับรูปหน้าให้เรียวกระชับ กรอบหน้าคมชัด มีมิติ",
        "ไม่มีรอยแผล ไม่ต้องพักฟื้น แต่งหน้าได้ทันทีหลังทำ",
        "ผลลัพธ์คงอยู่นาน 6–12 เดือน ดูแลโดยแพทย์ทุกเคส",
      ],
      time: "45 นาที",
      downtime: "ไม่ต้องพักฟื้น",
      highlight: "SMAS Lifting",
    },
    {
      title: "Laser รักษาฝ้า กระ รอยสิว และปรับผิวกระจ่างใส",
      en: "Q-Switched & Dual Laser Skin Rejuvenation",
      desc: "เลเซอร์ทำลายเม็ดสีเมลานินส่วนเกินอย่างอ่อนโยน ช่วยลดเลือนฝ้า กระ จุดด่างดำ รอยดำจากสิว พร้อมกระชับรูขุมขนและฟื้นฟูผิวให้เรียบเนียนสม่ำเสมอ",
      points: [
        "แก้ปัญหาฝ้าลึก กระแดด และความหมองคล้ำอย่างตรงจุด",
        "กระตุ้นการผลัดเซลล์ผิวและสร้างคอลลาเจนใหม่ใต้ผิว",
        "แพทย์ปรับระดับพลังงานให้เหมาะสมกับสภาพผิวของแต่ละบุคคล",
      ],
      time: "30 นาที",
      downtime: "ผิวอมชมพู 1-2 ชม.",
      highlight: "Clear Skin",
    },
  ];

  const currentList = activeCategory === "hair" ? hairTreatments : skinTreatments;

  return (
    <section id="services" className="py-16 lg:py-24 bg-white border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] text-[11px] text-[#9A7E41] tracking-wider uppercase mb-3 shadow-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Clinical Treatments & Technology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
            บริการการรักษาทางการแพทย์
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
            ทุกหัตถการดูแลโดย นพ. ปิยวัฒน์ และใช้เครื่องมือทางการแพทย์ที่ได้รับการรับรองมาตรฐานระดับสากล
          </p>

          {/* Category Switcher Tabs */}
          <div className="mt-7 inline-flex p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA]">
            <button
              onClick={() => setActiveCategory("hair")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "hair"
                  ? "bg-[#12151E] text-white shadow-md"
                  : "text-[#6B7280] hover:text-[#12151E]"
              }`}
            >
              รักษาผมร่วง ผมบาง (Hair Loss Program)
            </button>
            <button
              onClick={() => setActiveCategory("skin")}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeCategory === "skin"
                  ? "bg-[#12151E] text-white shadow-md"
                  : "text-[#6B7280] hover:text-[#12151E]"
              }`}
            >
              ดูแลผิวพรรณและความงาม (Skin & Aesthetic)
            </button>
          </div>
        </div>

        {/* Treatment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {currentList.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] rounded-3xl p-7 sm:p-8 border border-[#E8E3DA] hover:border-[#C5A880] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#9A7E41] bg-white px-3 py-1 rounded-full border border-[#E8E3DA]">
                    {t.highlight}
                  </span>
                  <span className="text-[11px] text-[#6B7280] bg-white px-2.5 py-1 rounded-full border border-[#E8E3DA] flex items-center gap-1 font-light">
                    <Clock className="w-3 h-3 text-[#9A7E41]" />
                    <span>{t.time}</span>
                  </span>
                </div>

                <h3 className="text-xl font-medium text-[#12151E] tracking-tight mb-1">
                  {t.title}
                </h3>
                <div className="text-[11px] text-[#9CA3AF] font-light mb-4">
                  {t.en}
                </div>

                <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-light mb-5">
                  {t.desc}
                </p>

                <div className="space-y-2.5 pt-4 border-t border-[#E8E3DA]">
                  {t.points.map((p, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-[#374151] font-light">
                      <div className="w-4 h-4 rounded-full bg-white border border-[#C5A880]/50 flex items-center justify-center text-[#9A7E41] flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="leading-relaxed">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E8E3DA] flex items-center justify-between">
                <span className="text-xs text-[#6B7280] font-light">
                  การพักฟื้น: <strong className="font-medium text-[#12151E]">{t.downtime}</strong>
                </span>
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#06C755] text-white rounded-xl text-xs font-medium hover:bg-[#05b34c] transition-all shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>ปรึกษาโปรแกรมนี้</span>
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}