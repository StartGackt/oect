"use client";

import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";

export default function Articles() {
  const articles = [
    {
      title: "ผมร่วงจากกรรมพันธุ์ (DHT) คืออะไร และรักษาให้หายขาดได้ไหม?",
      category: "ความรู้เรื่องเส้นผม",
      date: "สิงหาคม 2026",
      readTime: "3 นาที",
      excerpt:
        "ทำความเข้าใจกลไกของฮอร์โมน Dihydrotestosterone (DHT) ที่ส่งผลให้รากผมฝ่อตัว และแนวทางการรักษาทางการแพทย์ที่ช่วยชะลอและฟื้นฟูเส้นผมได้อย่างตรงจุด",
    },
    {
      title: "เลเซอร์ปลูกผม LLLT ทางเลือกฟื้นฟูรากผมโดยไม่ต้องผ่าตัด",
      category: "นวัตกรรมการรักษา",
      date: "สิงหาคม 2026",
      readTime: "4 นาที",
      excerpt:
        "เจาะลึกการทำงานของแสงเลเซอร์พลังงานต่ำ 650nm ในการกระตุ้นระบบไหลเวียนเลือดและสร้างพลังงาน ATP ให้เซลล์รากผมกลับมาสร้างเส้นผมใหม่",
    },
    {
      title: "PRP ปลูกผม สเต็มเซลล์เกล็ดเลือดเข้มข้น เหมาะกับใครบ้าง?",
      category: "เวชศาสตร์ฟื้นฟู",
      date: "สิงหาคม 2026",
      readTime: "3 นาที",
      excerpt:
        "ข้อควรรู้ก่อนตัดสินใจทำ PRP การเตรียมตัว วิธีการสกัด Growth Factors จากเลือดตนเอง และผลลัพธ์ในการเพิ่มความหนาแน่นของเส้นผม",
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-[#E8E4DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs text-[#9E7B3B] font-medium tracking-wider uppercase block mb-1">
              Medical Articles & Insights
            </span>
            <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1D20] tracking-tight">
              สาระน่ารู้ด้านการดูแลเส้นผมและผิวพรรณ
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#737373] font-light">
              บทความให้ความรู้ทางการแพทย์โดยทีมแพทย์ผู้เชี่ยวชาญ Piyawat Clinic
            </p>
          </div>

          <a
            href="#booking"
            className="inline-flex items-center gap-1 text-xs text-[#9E7B3B] font-medium hover:underline self-start sm:self-auto"
          >
            <span>ปรึกษาปัญหากับแพทย์โดยตรง →</span>
          </a>
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((a, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] rounded-2xl p-6 border border-[#E8E4DE] hover:border-[#9E7B3B] transition-all duration-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#737373] mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#9E7B3B] font-medium border border-[#E8E4DE]">
                    {a.category}
                  </span>
                  <span className="flex items-center gap-1 font-light">
                    <Clock className="w-3 h-3 text-[#A6A6A6]" />
                    {a.readTime}
                  </span>
                </div>

                <h3 className="text-base font-medium text-[#1C1D20] mb-2.5 leading-snug hover:text-[#9E7B3B] transition-colors">
                  {a.title}
                </h3>

                <p className="text-xs text-[#595959] font-light leading-relaxed mb-6">
                  {a.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E4DE] flex items-center justify-between">
                <span className="text-[11px] text-[#A6A6A6]">{a.date}</span>
                <span className="text-xs font-medium text-[#1C1D20] flex items-center gap-1">
                  <span>อ่านต่อ</span>
                  <ArrowRight className="w-3 h-3 text-[#9E7B3B]" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
