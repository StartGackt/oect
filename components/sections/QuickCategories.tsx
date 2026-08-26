"use client";

import { ArrowRight } from "lucide-react";

export default function QuickCategories() {
  const categories = [
    {
      icon: "💇‍♂️",
      badge: "Signature",
      title: "รักษาผมร่วง ผมบาง",
      en: "Hair Loss Treatment",
      desc: "ตรวจวิเคราะห์รากผม & แผนเฉพาะบุคคล",
      href: "#services",
    },
    {
      icon: "⚡",
      badge: "US-FDA",
      title: "เลเซอร์ฟื้นฟูรากผม LLLT",
      en: "Low-Level Laser Therapy",
      desc: "กระตุ้นเซลล์รากผม ไม่เจ็บตัว",
      href: "#services",
    },
    {
      icon: "🧬",
      badge: "Growth Factors",
      title: "สเต็มเซลล์เกล็ดเลือด PRP",
      en: "PRP Hair Regeneration",
      desc: "เกล็ดเลือดเข้มข้น ปลอดภัย 100%",
      href: "#services",
    },
    {
      icon: "🌿",
      badge: "Nutrient",
      title: "Scalp Meso & เปปไทด์",
      en: "Scalp Biotin Infusion",
      desc: "เติมวิตามินบำรุงลึกถึงรากผม",
      href: "#services",
    },
    {
      icon: "✨",
      badge: "Lifting",
      title: "HIFU ยกกระชับผิวหน้า",
      en: "Ultra-Sound Skin Lift",
      desc: "ปรับรูปหน้าเรียว ร่องแก้มตื้นขึ้น",
      href: "#services",
    },
    {
      icon: "👨‍⚕️",
      badge: "Free Consult",
      title: "ตรวจสุขภาพหนังศีรษะ",
      en: "Scalp Diagnostics",
      desc: "ส่องกล้องวิเคราะห์กับแพทย์ ฟรี",
      href: "#booking",
    },
  ];

  return (
    <section className="bg-white py-10 border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-4 bg-[#C5A880] rounded-full" />
            <h2 className="text-base sm:text-lg font-medium text-[#12151E]">
              หมวดหมู่บริการทางการแพทย์ (Medical Specialties)
            </h2>
          </div>
          <span className="text-xs text-[#737373] hidden sm:inline font-light">
            เลือกบริการที่ท่านสนใจเพื่อดูรายละเอียด
          </span>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((c, idx) => (
            <a
              key={idx}
              href={c.href}
              className="bg-[#FAF8F5] hover:bg-white hover:border-[#C5A880] hover:shadow-lg border border-[#E8E3DA] rounded-2xl p-4 text-center transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="flex justify-end mb-1">
                <span className="text-[9px] font-semibold text-[#9A7E41] bg-white px-2 py-0.5 rounded-full border border-[#E8E3DA] group-hover:bg-[#12151E] group-hover:text-[#EADCB9] group-hover:border-[#12151E] transition-colors">
                  {c.badge}
                </span>
              </div>

              <div className="text-3xl my-2 group-hover:scale-110 transition-transform">
                {c.icon}
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-medium text-[#12151E] group-hover:text-[#9A7E41] transition-colors leading-tight">
                  {c.title}
                </h3>
                <div className="text-[10px] text-[#737373] font-light mt-1 line-clamp-1">
                  {c.desc}
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
