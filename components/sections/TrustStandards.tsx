"use client";

import { ShieldCheck, Award, Microscope, HeartHandshake, Sparkles, Building2 } from "lucide-react";

export default function TrustStandards() {
  const standards = [
    {
      icon: ShieldCheck,
      title: "มาตรฐานความปลอดภัย US-FDA",
      desc: "เครื่องมือเลเซอร์และอุปกรณ์ทางการแพทย์ทุกชิ้นผ่านการรับรองมาตรฐานองค์การอาหารและยาระดับสากล",
    },
    {
      icon: Microscope,
      title: "ตรวจวิเคราะห์ระดับเซลล์",
      desc: "ส่องกล้องตรวจสภาพรากผมอย่างละเอียดทุกมุมมอง เพื่อวินิจฉัยสาเหตุแท้จริงก่อนวางแผนการรักษา",
    },
    {
      icon: Award,
      title: "แพทย์สมาชิกสมาคม ISHRS",
      desc: "นพ. ปิยวัฒน์ เป็นสมาชิกสมาคมศัลยกรรมและฟื้นฟูเส้นผมนานาชาติ มีประสบการณ์มากกว่า 15 ปี",
    },
    {
      icon: Building2,
      title: "ห้องตรวจส่วนตัว ปลอดเชื้อ",
      desc: "ระบบห้องตรวจและห้องทำหัตถการสะอาด ปลอดเชื้อตามมาตรฐานกระทรวงสาธารณสุข เพื่อความเป็นส่วนตัวสูงสุด",
    },
  ];

  return (
    <section className="bg-white py-14 border-b border-[#E8E4DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs text-[#9E7B3B] font-medium tracking-wider uppercase block mb-1">
            Clinic Standards & Quality
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-[#1C1D20] tracking-tight">
            มาตรฐานทางการแพทย์และความปลอดภัยที่ Piyawat Clinic
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#737373] font-light">
            เรามุ่งมั่นให้บริการด้วยมาตรฐานการรักษาระดับสากล โปร่งใส และคำนึงถึงความปลอดภัยของคนไข้เป็นอันดับหนึ่ง
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E4DE] text-left flex flex-col justify-between hover:border-[#9E7B3B] transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#9E7B3B] mb-4 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-medium text-[#1C1D20] mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#595959] font-light leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
