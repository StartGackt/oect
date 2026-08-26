"use client";

import { useState } from "react";
import { Microscope, Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function InteractiveTrichoscopy() {
  const [activeView, setActiveView] = useState<"healthy" | "thinning" | "treated">("thinning");

  const views = {
    healthy: {
      title: "1. หนังศีรษะและรากผมปกติ (Healthy Scalp)",
      subtitle: "ความหนาแน่น 120-150 เส้น / ตร.ซม.",
      status: "ปกติ / สมบูรณ์",
      color: "#06C755",
      points: [
        "แต่ละรูขุมขนมีเส้นผม 2-4 เส้น (Follicular Unit)",
        "ขนาดเส้นผ่านศูนย์กลางผมสม่ำเสมอ แข็งแรง",
        "หนังศีรษะสะอาด ไม่มีไขมันอุดตันหรือรอยแดง",
      ],
      densityNum: "135 เส้น/ตร.ซม.",
      hairsPerPore: "2.8 เส้น/รู",
      caliber: "80 ไมครอน (หนาแน่น)",
    },
    thinning: {
      title: "2. ระยะผมร่วงผมบางฝ่อตัว (Follicle Miniaturization)",
      subtitle: "ความหนาแน่นลดลงเหลือ 50-70 เส้น / ตร.ซม.",
      status: "ต้องการการรักษาเร่งด่วน",
      color: "#E6A100",
      points: [
        "รูขุมขนเหลือเส้นผมเพียง 1 เส้น หรือไม่มีเลย (Single hair per pore)",
        "เส้นผมเล็กลีบ (Miniaturization) จากฮอร์โมน DHT",
        "มีการสะสมของน้ำมัน Sebum และสารอักเสบที่โคนผม",
      ],
      densityNum: "60 เส้น/ตร.ซม.",
      hairsPerPore: "1.1 เส้น/รู",
      caliber: "35 ไมครอน (ลีบแบน)",
    },
    treated: {
      title: "3. หลังรักษาด้วย LLLT + PRP (Post-Treatment Regeneration)",
      subtitle: "ความหนาแน่นฟื้นฟูเป็น 110-130 เส้น / ตร.ซม.",
      status: "ฟื้นฟูสมบูรณ์ (+90%)",
      color: "#BFA15F",
      points: [
        "เซลล์รากผมถูกปลุกให้ตื่นตัว แตกกิ่งเส้นผมใหม่ 2-3 เส้นต่อรูขุมขน",
        "ขนาดเส้นผมหนาขึ้นกว่าเดิม 2.5 เท่า มีเม็ดสีดกดำ",
        "ระบบไหลเวียนเลือดหล่อเลี้ยงรากผมได้เต็มที่",
      ],
      densityNum: "125 เส้น/ตร.ซม.",
      hairsPerPore: "2.6 เส้น/รู",
      caliber: "75 ไมครอน (หนาแข็งแรง)",
    },
  };

  const current = views[activeView];

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-[#ECE8E1]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFBF9] border border-[#ECE8E1] text-[11px] text-[#71717A] tracking-wider uppercase mb-3">
            <Microscope className="w-3.5 h-3.5 text-[#BFA15F]" />
            <span>AI Trichoscopy Microscope Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#18181B] tracking-tight">
            จำลองการส่องกล้องวิเคราะห์รากผมความละเอียดสูง
          </h2>
          <p className="mt-3 text-[#52525B] text-sm font-light">
            คลิกเลือกสถานะด้านล่างเพื่อดูความแตกต่างของโครงสร้างรากผมระดับเซลล์ที่คุณหมอตรวจด้วยกล้อง
          </p>
        </div>

        {/* Interactive Simulator Box */}
        <div className="bg-[#FCFBF9] rounded-3xl border border-[#ECE8E1] p-6 sm:p-10 shadow-xs">
          
          {/* Mode Switcher Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            <button
              onClick={() => setActiveView("healthy")}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeView === "healthy"
                  ? "bg-white border-[#06C755] shadow-xs ring-1 ring-[#06C755]/20"
                  : "bg-white/60 border-[#ECE8E1] hover:bg-white"
              }`}
            >
              <div className="text-xs font-semibold text-[#06C755] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#06C755]" />
                1. รากผมปกติแข็งแรง
              </div>
              <div className="text-[11px] text-[#71717A] font-light">Healthy Follicle Unit</div>
            </button>

            <button
              onClick={() => setActiveView("thinning")}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeView === "thinning"
                  ? "bg-white border-[#E6A100] shadow-xs ring-1 ring-[#E6A100]/20"
                  : "bg-white/60 border-[#ECE8E1] hover:bg-white"
              }`}
            >
              <div className="text-xs font-semibold text-[#E6A100] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E6A100] animate-pulse" />
                2. รากผมฝ่อตัว (ก่อนรักษา)
              </div>
              <div className="text-[11px] text-[#71717A] font-light">Miniaturized Follicles</div>
            </button>

            <button
              onClick={() => setActiveView("treated")}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeView === "treated"
                  ? "bg-white border-[#BFA15F] shadow-xs ring-1 ring-[#BFA15F]/30"
                  : "bg-white/60 border-[#ECE8E1] hover:bg-white"
              }`}
            >
              <div className="text-xs font-semibold text-[#9A7E41] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#BFA15F]" />
                3. หลังฟื้นฟู LLLT + PRP
              </div>
              <div className="text-[11px] text-[#71717A] font-light">Regenerated Scalp</div>
            </button>
          </div>

          {/* Microscope Display & Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Simulated Microscope Lens (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#18181B] p-2 shadow-xl border-4 border-[#ECE8E1]">
                {/* Lens Crosshair & Grid Overlay */}
                <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617]">
                  
                  {/* Circular Grid Rings */}
                  <div className="absolute inset-4 rounded-full border border-dashed border-white/20 pointer-events-none" />
                  <div className="absolute inset-14 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-white/20 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-white/20 pointer-events-none" />

                  {/* Dynamic Graphic Simulation */}
                  <div className="text-center p-6 space-y-2 z-10">
                    <div className="text-4xl">
                      {activeView === "healthy" ? "🔬✨" : activeView === "thinning" ? "⚠️🔍" : "🌱🩺"}
                    </div>
                    <div className="text-xs font-medium text-white tracking-wide">
                      {activeView === "healthy"
                        ? "Trichoscopy 60X (Normal)"
                        : activeView === "thinning"
                        ? "Trichoscopy 60X (Thinning)"
                        : "Trichoscopy 60X (Regenerated)"}
                    </div>
                    <div className="text-[10px] text-white/60 font-light">
                      {current.densityNum}
                    </div>
                  </div>

                  {/* Lens Reflection */}
                  <div className="absolute -top-12 -left-12 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* Digital HUD Tag */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#18181B] text-white text-[10px] font-medium border border-white/20 whitespace-nowrap shadow-md">
                  HD Trichoscope 60x Magnification
                </div>
              </div>
            </div>

            {/* Analysis & Real-time Diagnostic Data (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white border border-[#ECE8E1] text-[#18181B]">
                    สถานะ: {current.status}
                  </span>
                  <span className="text-xs text-[#71717A]">{current.subtitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-normal text-[#18181B] tracking-tight">
                  {current.title}
                </h3>
              </div>

              {/* Digital Metrics 3 boxes */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white p-4 rounded-2xl border border-[#ECE8E1] text-center">
                <div>
                  <div className="text-[10px] text-[#A1A1AA] uppercase">ความหนาแน่น</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#18181B] mt-0.5">{current.densityNum}</div>
                </div>
                <div className="border-x border-[#F4F4F5]">
                  <div className="text-[10px] text-[#A1A1AA] uppercase">จำนวนผมต่อรู</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#18181B] mt-0.5">{current.hairsPerPore}</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#A1A1AA] uppercase">ขนาดเส้นผม</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#BFA15F] mt-0.5">{current.caliber}</div>
                </div>
              </div>

              {/* Clinical Insights Checklist */}
              <div className="space-y-2 pt-1">
                {current.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#3F3F46] font-light">
                    <CheckCircle2 className="w-4 h-4 text-[#BFA15F] flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* Doctor Free Trichoscopy CTA */}
              <div className="pt-2">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 text-xs text-[#18181B] font-medium hover:text-[#BFA15F] transition-colors"
                >
                  <span>นัดหมายตรวจสภาพรากผมจริงกับคุณหมอ ฟรี →</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
