"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2, Activity, User, HelpCircle, Shield } from "lucide-react";

export default function HairAssessmentQuiz() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [pattern, setPattern] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const malePatterns = [
    { id: "m-hairline", title: "แนวผมร่นหน้าผากตัว M", desc: "ผมด้านหน้าเถิกลึกเข้าไปเป็นรูปตัว M", stage: "Norwood Scale 2-3" },
    { id: "m-crown", title: "ผมบางกลางกระหม่อม / ไข่ดาว", desc: "ผมบางเริ่มเห็นหนังศีรษะบริเวณขวัญหรือกลางศีรษะ", stage: "Norwood Scale 3-4" },
    { id: "m-diffuse", title: "ผมบางทั่วทั้งศีรษะ", desc: "เส้นผมเล็กลง ลีบแบน และหลุดร่วงง่ายทั่วศีรษะ", stage: "Diffuse Thinning" },
    { id: "m-patch", title: "ผมร่วงเป็นหย่อมวงกลม", desc: "ผมร่วงหลุดเป็นวงขนาดเท่าเหรียญ เกิดขึ้นเฉียบพลัน", stage: "Alopecia Areata" },
  ];

  const femalePatterns = [
    { id: "f-parting", title: "รอยแสกผมกว้างขึ้นเรื่อยๆ", desc: "แสกผมขยายกว้างจนมองเห็นหนังศีรษะชัดเจน", stage: "Ludwig Scale 1-2" },
    { id: "f-crown", title: "ผมบางช่วงกลางศีรษะ", desc: "ความหนาแน่นของเส้นผมลดลง ผมลีบแบนจัดทรงยาก", stage: "Ludwig Scale 2" },
    { id: "f-postpartum", title: "ผมร่วงหลังคลอด / ฮอร์โมน", desc: "ผมร่วงผิดปกติเป็นจำนวนมากหลังคลอดหรือวัยทอง", stage: "Telogen Effluvium" },
    { id: "f-temples", title: "ผมบางบริเวณขมับทั้งสองข้าง", desc: "แนวไรผมด้านข้างและขมับเริ่มบางลง", stage: "Temporal Thinning" },
  ];

  const durations = [
    { id: "d1", label: "น้อยกว่า 6 เดือน", desc: "เพิ่งเริ่มสังเกตเห็นการหลุดร่วงผิดปกติ (ระยะฟื้นตัวเร็วที่สุด)" },
    { id: "d2", label: "6 เดือน – 1 ปี", desc: "เริ่มเห็นความบางชัดเจน เส้นผมเริ่มเล็กลง" },
    { id: "d3", label: "1 – 3 ปี", desc: "รากผมเริ่มฝ่อตัว รูขุมขนเริ่มปิดบางส่วน" },
    { id: "d4", label: "มากกว่า 3 ปี", desc: "ผมบางเรื้อรัง ต้องกระตุ้นฟื้นฟูเซลล์รากผมอย่างเข้มข้น" },
  ];

  const currentPatterns = gender === "female" ? femalePatterns : malePatterns;

  const resetQuiz = () => {
    setStep(1);
    setGender(null);
    setPattern(null);
    setDuration(null);
  };

  const getAssessmentResult = () => {
    if (gender === "male") {
      if (pattern === "m-patch") {
        return {
          title: "ภาวะผมร่วงเป็นหย่อม (Alopecia Areata)",
          scale: "ระดับการฟื้นฟู: สูงมาก (High Response)",
          recommendation: "Targeted PRP Growth Factors ร่วมกับยาทาลดการอักเสบ",
          recoveryChance: "92%",
          timeline: "4 - 8 สัปดาห์",
          description: "เกิดจากความผิดปกติของภูมิคุ้มกันหรือความเครียด รากผมยังไม่ตาย สามารถกระตุ้นให้เส้นผมงอกใหม่กลับมาได้เกือบ 100%",
        };
      }
      return {
        title: "ภาวะผมบางกรรมพันธุ์และฮอร์โมน DHT ในเพศชาย",
        scale: "ระดับความรุนแรง: ระยะที่ 2-3 (ฟื้นฟูได้ดีโดยไม่ต้องผ่าตัด)",
        recommendation: "โปรแกรม LLLT Laser Biostimulation + PRP สเต็มเซลล์เกล็ดเลือด",
        recoveryChance: "88%",
        timeline: "8 - 12 สัปดาห์",
        description: "รากผมยังเปิดอยู่แต่เริ่มฝ่อตัว การใช้แสงเลเซอร์พลังงานต่ำร่วมกับ Growth Factors จะช่วยเพิ่มขนาดเส้นผมและหยุดยั้งการหลุดร่วงได้ตรงจุด",
      };
    } else {
      if (pattern === "f-postpartum") {
        return {
          title: "ภาวะผมร่วงหลังคลอดและการเปลี่ยนแปลงฮอร์โมน",
          scale: "ระดับการฟื้นฟู: รวดเร็ว (Fast Recovery)",
          recommendation: "Scalp Meso Peptides + Biotin Complex + LLLT Laser",
          recoveryChance: "95%",
          timeline: "4 - 6 สัปดาห์",
          description: "วงจรผมหลุดร่วงชั่วคราว การเติมสารอาหารตรงสู่หนังศีรษะจะช่วยเร่งการเกิดใหม่ของเส้นผมให้กลับมาหนานุ่มอย่างรวดเร็ว",
        };
      }
      return {
        title: "ภาวะผมบางแบบกระจายตัวในผู้หญิง (Female Pattern Thinning)",
        scale: "ระดับความรุนแรง: Ludwig Scale Stage 1-2",
        recommendation: "Scalp Meso Infusion ร่วมกับ LLLT Laser กระตุ้นรากผม",
        recoveryChance: "90%",
        timeline: "8 - 12 สัปดาห์",
        description: "เหมาะกับการฟื้นฟูด้วยการกระตุ้นการไหลเวียนเลือดและบำรุงเคราติน ช่วยให้รอยแสกแคบลงและเส้นผมมีวอลลุ่มขึ้น",
      };
    }
  };

  return (
    <section id="assessment" className="py-20 lg:py-28 bg-[#FCFBF9] border-b border-[#ECE8E1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#ECE8E1] text-[11px] text-[#71717A] tracking-wider uppercase mb-3 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-[#BFA15F]" />
            <span>Interactive Clinical Assessment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-normal text-[#18181B] tracking-tight">
            ประเมินระดับผมบางเบื้องต้นด้วยตนเอง
          </h2>
          <p className="mt-3 text-[#52525B] text-sm font-light">
            ตอบคำถาม 3 ข้อเพื่อรับการวิเคราะห์สาเหตุและแนวทางการรักษาที่เหมาะสมเฉพาะคุณ
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="bg-white rounded-3xl border border-[#ECE8E1] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          
          {/* Top Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-[#71717A] mb-2 font-light">
              <span>ขั้นตอนที่ {step} จาก 3</span>
              <span>{step === 1 ? "เลือกเพศ" : step === 2 ? "ลักษณะอาการ" : step === 3 ? "ระยะเวลาที่เป็น" : "ผลการประเมิน"}</span>
            </div>
            <div className="w-full h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#BFA15F] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: Select Gender */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-normal text-[#18181B] text-center">
                1. เลือกเพศของคุณ
              </h3>
              <p className="text-xs text-[#71717A] text-center font-light">
                เนื่องจากรูปแบบของผมร่วงในเพศชายและเพศหญิงมีลักษณะและสาเหตุฮอร์โมนที่แตกต่างกัน
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-4">
                <button
                  onClick={() => {
                    setGender("male");
                    setStep(2);
                  }}
                  className="p-6 rounded-2xl border-2 border-[#ECE8E1] hover:border-[#BFA15F] hover:bg-[#FAF9F7] transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F4F4F5] group-hover:bg-[#18181B] group-hover:text-[#BFA15F] text-[#18181B] flex items-center justify-center mx-auto mb-3 transition-colors text-lg font-medium">
                    👨
                  </div>
                  <div className="font-medium text-base text-[#18181B]">เพศชาย (Male)</div>
                  <div className="text-xs text-[#71717A] font-light mt-1">แนวผมร่น, กลางกระหม่อม, ผมบางกรรมพันธุ์</div>
                </button>

                <button
                  onClick={() => {
                    setGender("female");
                    setStep(2);
                  }}
                  className="p-6 rounded-2xl border-2 border-[#ECE8E1] hover:border-[#BFA15F] hover:bg-[#FAF9F7] transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F4F4F5] group-hover:bg-[#18181B] group-hover:text-[#BFA15F] text-[#18181B] flex items-center justify-center mx-auto mb-3 transition-colors text-lg font-medium">
                    👩
                  </div>
                  <div className="font-medium text-base text-[#18181B]">เพศหญิง (Female)</div>
                  <div className="text-xs text-[#71717A] font-light mt-1">รอยแสกกว้าง, ผมบางทั่วศีรษะ, ผมร่วงหลังคลอด</div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Pattern */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-normal text-[#18181B] text-center">
                2. ลักษณะผมร่วงหรือบริเวณที่คุณกังวลที่สุด
              </h3>
              <p className="text-xs text-[#71717A] text-center font-light">
                คลิกเลือก 1 ข้อที่ตรงกับอาการของคุณในปัจจุบัน
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentPatterns.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPattern(p.id);
                      setStep(3);
                    }}
                    className="p-4 rounded-xl border border-[#ECE8E1] hover:border-[#BFA15F] hover:bg-[#FAF9F7] text-left transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-[#18181B] group-hover:text-[#9A7E41]">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA] bg-[#F4F4F5] px-2 py-0.5 rounded">
                          {p.stage}
                        </span>
                      </div>
                      <p className="text-xs text-[#52525B] font-light">
                        {p.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#F4F4F5]">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-[#71717A] hover:text-[#18181B]"
                >
                  ← ย้อนกลับ
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Duration */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-xl font-normal text-[#18181B] text-center">
                3. คุณเริ่มมีอาการผมร่วงหรือผมบางมานานเท่าใดแล้ว?
              </h3>
              <p className="text-xs text-[#71717A] text-center font-light">
                ระยะเวลาส่งผลต่อสภาพของเซลล์รากผมและทางเลือกในการรักษา
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {durations.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDuration(d.id);
                      setStep(4);
                    }}
                    className="p-4 rounded-xl border border-[#ECE8E1] hover:border-[#BFA15F] hover:bg-[#FAF9F7] text-left transition-all group"
                  >
                    <div className="font-medium text-sm text-[#18181B] mb-1 group-hover:text-[#9A7E41]">
                      {d.label}
                    </div>
                    <p className="text-xs text-[#52525B] font-light">
                      {d.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-[#F4F4F5]">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-[#71717A] hover:text-[#18181B]"
                >
                  ← ย้อนกลับ
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Result Card */}
          {step === 4 && (() => {
            const res = getAssessmentResult();
            return (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#FAF9F7] text-[#9A7E41] text-xs font-medium border border-[#BFA15F]/30 mb-2">
                    {res.scale}
                  </span>
                  <h3 className="text-2xl font-normal text-[#18181B] tracking-tight">
                    {res.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#52525B] font-light max-w-lg mx-auto mt-2">
                    {res.description}
                  </p>
                </div>

                {/* Recommendation Box */}
                <div className="bg-[#FAF9F7] rounded-2xl p-6 border border-[#ECE8E1] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider block">
                        โปรแกรมการรักษาที่แนะนำ
                      </span>
                      <div className="text-sm font-semibold text-[#18181B] mt-1">
                        {res.recommendation}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider block">
                        โอกาสฟื้นฟูความหนาแน่น
                      </span>
                      <div className="text-sm font-semibold text-[#06C755] mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{res.recoveryChance} (ระยะเวลาเห็นผล {res.timeline})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to action for Free AI Trichoscopy */}
                <div className="p-5 rounded-2xl bg-[#18181B] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <div className="text-sm font-medium">ตรวจยืนยันรากผมด้วยกล้อง AI Trichoscope ฟรี</div>
                    <div className="text-xs text-white/70 font-light mt-0.5">
                      ส่องดูรูขุมขนจริงกับคุณหมอปิยวัฒน์เพื่อวางแผนการรักษาที่ตรงจุดที่สุด
                    </div>
                  </div>
                  <a
                    href="#booking"
                    className="px-5 py-2.5 bg-[#BFA15F] text-[#18181B] rounded-full text-xs font-semibold hover:bg-white transition-colors flex-shrink-0"
                  >
                    จองคิวตรวจฟรีทันที
                  </a>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-1.5 text-xs text-[#71717A] hover:text-[#18181B]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ทำแบบประเมินใหม่อีกครั้ง</span>
                  </button>
                </div>
              </div>
            );
          })()}

        </div>

      </div>
    </section>
  );
}
