"use client";

import { useState } from "react";
import { 
  Search, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from "lucide-react";
import type { ComplaintItem } from "@/components/oect/complaintDomain";

interface CitizenTrackingViewProps {
  cases: ComplaintItem[];
  onSelectCase: (c: ComplaintItem) => void;
}

export default function CitizenTrackingView({ cases, onSelectCase }: CitizenTrackingViewProps) {
  const [trackQuery, setTrackQuery] = useState<string>("MP-CMI-2569-001");
  const [searchedCase, setSearchedCase] = useState<ComplaintItem | null>(cases[0] || null);
  const [notFound, setNotFound] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const found = cases.find(
      (c) =>
        c.caseNumber.toLowerCase() === trackQuery.trim().toLowerCase() ||
        c.complainants.includes(trackQuery.trim())
    );
    if (found) {
      setSearchedCase(found);
      setNotFound(false);
    } else {
      setSearchedCase(null);
      setNotFound(true);
    }
  };

  const trackingSteps = [
    { step: 1, label: "ยื่นคำร้องและตรวจรับเรื่อง", desc: "สนง.กกต.จว. ตรวจสอบความถูกต้องของคำร้อง" },
    { step: 2, label: "ผอ.กกต.จว. พิจารณาสั่งการ", desc: "มีคำสั่งรับคำร้องและมอบหมายพนักงานสืบสวน" },
    { step: 3, label: "สืบสวนและไต่สวนพยานหลักฐาน", desc: "รวบรวมพยานหลักฐาน บันทึกถ้อยคำพยาน" },
    { step: 4, label: "ส่งสำนวนเข้า สนง.กกต. ส่วนกลาง", desc: "ตรวจวิเคราะห์สำนวนและเสนอคณะอนุวินิจฉัย" },
    { step: 5, label: "กกต. พิจารณาวินิจฉัยชี้ขาด", desc: "ที่ประชุม กกต. มีมติและจัดทำคำวินิจฉัยอย่างเป็นทางการ" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-14">
      
      {/* Search Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#4FB3E8]/10 text-[#1B3F8B] flex items-center justify-center mx-auto border border-[#4FB3E8]/40">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A202C]">
            ระบบติดตามสถานะเรื่องร้องเรียนสำหรับประชาชน
          </h2>
          <p className="text-xs text-[#718096] max-w-md mx-auto mt-1">
            กรอกเลขที่เรื่องร้องเรียน (เช่น MP-CMI-2569-001) หรือชื่อผู้ร้อง เพื่อตรวจสอบขั้นตอนการดำเนินงานตามกระบวนการยุติธรรม
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2 pt-2">
          <input
            type="text"
            required
            placeholder="กรอกเลขที่คำร้อง เช่น MP-CMI-2569-001"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#1B3F8B] focus:bg-white"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1B3F8B] hover:bg-[#1B3F8B] text-white text-xs font-medium rounded-xl transition-colors shadow-xs"
          >
            ค้นหา
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-[#718096]">
          <span>ตัวอย่างค้นหาด่วน:</span>
          {["MP-CMI-2569-001", "MP-CMI-2569-002", "MP-KKN-2569-003"].map((sample) => (
            <button
              key={sample}
              onClick={() => {
                setTrackQuery(sample);
                const found = cases.find((c) => c.caseNumber === sample);
                if (found) {
                  setSearchedCase(found);
                  setNotFound(false);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-[#F7FAFC] hover:bg-[#4FB3E8]/10 text-[#1B3F8B] border border-[#E2E8F0] font-medium"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {notFound && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center space-y-2">
          <AlertCircle className="w-6 h-6 text-red-500 mx-auto" />
          <div className="text-sm font-semibold text-red-800">ไม่พบข้อมูลตามคำค้นหา “{trackQuery}”</div>
          <p className="text-xs text-red-600">โปรดตรวจสอบเลขที่เรื่องร้องเรียนอีกครั้ง หรือติดต่อ สนง.กกต.จว. ประจำพื้นที่</p>
        </div>
      )}

      {searchedCase && (
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-xs p-6 sm:p-8 space-y-6 animate-in fade-in-50 duration-150">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EDF2F7] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1B3F8B]">{searchedCase.caseNumber}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-100">
                  {searchedCase.electionType}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#1A202C] mt-1">
                {searchedCase.allegation}
              </h3>
              <div className="text-xs text-[#718096] mt-0.5">
                พื้นที่: จ.{searchedCase.province} {searchedCase.constituency} ({searchedCase.district})
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] text-[#718096] block">สถานะปัจจุบัน</span>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs mt-0.5">
                {searchedCase.currentStage}
              </span>
            </div>
          </div>

          {/* Step Progress Tracker */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-[#1A202C]">ไทม์ไลน์ความคืบหน้ากระบวนการ:</div>
            
            <div className="space-y-3">
              {trackingSteps.map((s) => {
                const isPassed = searchedCase.stageId >= s.step;
                const isCurrent = Math.min(5, Math.ceil(searchedCase.stageId / 2)) === s.step;
                return (
                  <div
                    key={s.step}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? "bg-[#4FB3E8]/10 border-[#1B3F8B] shadow-xs"
                        : isPassed
                        ? "bg-[#F7FAFC] border-[#E2E8F0]"
                        : "bg-white border-[#EDF2F7] opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCurrent
                            ? "bg-[#1B3F8B] text-white"
                            : isPassed
                            ? "bg-emerald-500 text-white"
                            : "bg-[#E2E8F0] text-[#718096]"
                        }`}
                      >
                        {isPassed && !isCurrent ? "✓" : s.step}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-[#1A202C]">{s.label}</div>
                        <div className="text-[11px] text-[#718096] font-light">{s.desc}</div>
                      </div>
                    </div>

                    {isCurrent && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                        📍 อยู่ระหว่างขั้นตอนนี้
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Privacy Notice */}
          <div className="bg-[#FFD600]/10 p-4 rounded-2xl border border-[#FFD600]/35 flex items-center justify-between text-xs text-[#718096]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>ข้อมูลถูกควบคุมตามระเบียบ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
            </div>
            <button
              onClick={() => onSelectCase(searchedCase)}
              className="text-[#1B3F8B] font-medium hover:underline flex items-center gap-1"
            >
              <span>ดูข้อมูลเต็ม</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
