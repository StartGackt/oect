"use client";

import { Calendar, Stethoscope, Sparkles, LineChart, ArrowRight } from "lucide-react";

export default function ProcessStep() {
  const steps = [
    {
      num: "01",
      icon: Calendar,
      title: "นัดหมายล่วงหน้า",
      desc: "จองคิวผ่านระบบออนไลน์หรือแอด LINE เพื่อเลือกวันและเวลาที่สะดวก เพื่อความเป็นส่วนตัวและไม่ต้องรอคิวนาน",
    },
    {
      num: "02",
      icon: Stethoscope,
      title: "ตรวจวิเคราะห์กับแพทย์",
      desc: "คุณหมอส่องกล้องตรวจดูสภาพรูขุมขน ความหนาแน่น และระดับการฝ่อตัวของรากผม พร้อมอธิบายแนวทางรักษาอย่างตรงไปตรงมา",
    },
    {
      num: "03",
      icon: Sparkles,
      title: "เข้ารับการรักษา",
      desc: "ทำหัตถการตามแผนการรักษาเฉพาะบุคคล เช่น ฉายแสงเลเซอร์ LLLT, ทำ PRP สกัดเข้มข้น หรือรับยา ไม่เจ็บ ไม่ต้องพักฟื้น",
    },
    {
      num: "04",
      icon: LineChart,
      title: "ติดตามผลอย่างต่อเนื่อง",
      desc: "บันทึกภาพถ่ายและนัดตรวจติดตามความหนาแน่นของเส้นผมทุก 4–8 สัปดาห์ เพื่อให้มั่นใจในผลลัพธ์การรักษาที่ดีที่สุด",
    },
  ];

  return (
    <section id="process" className="py-16 lg:py-24 bg-white border-b border-[#E8E3DA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E3DA] text-[11px] text-[#9A7E41] tracking-wider uppercase mb-3 shadow-xs font-semibold">
            <span>Patient Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#12151E] tracking-tight">
            ขั้นตอนการเข้ารับบริการที่คลินิก
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B7280] font-light">
            กระบวนการดูแลรักษาที่เป็นระบบ เน้นความเป็นส่วนตัวและผลลัพธ์ทางการแพทย์ที่ชัดเจน
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-7 rounded-3xl border border-[#E8E3DA] hover:border-[#C5A880] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold text-[#9A7E41] bg-white px-2.5 py-1 rounded-full border border-[#E8E3DA]">
                      STEP {s.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#12151E] group-hover:text-[#9A7E41] shadow-xs transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-medium text-[#12151E] mb-2">
                    {s.title}
                  </h3>

                  <p className="text-xs text-[#4B5563] font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8E3DA] text-[11px] text-[#9CA3AF] font-light">
                  Piyawat Standard Step {idx + 1}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
