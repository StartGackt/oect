"use client";

import { useState } from "react";
import { 
  GitFork, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  Layers, 
  Building, 
  Scale, 
  Users, 
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

export default function WorkflowVisualizer() {
  const [selectedView, setSelectedView] = useState<"page1" | "page2">("page1");

  return (
    <div className="space-y-6 pb-14">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#173B6B] rounded-full" />
            <h2 className="text-base sm:text-lg font-semibold text-[#1A202C]">
              กระบวนการดำเนินงานตามกฎหมาย (Workflow & Legal SLA Engine)
            </h2>
          </div>
          <p className="text-xs text-[#718096] mt-0.5">
            อ้างอิงตามระเบียบคณะกรรมการการเลือกตั้ง ว่าด้วยการสืบสวน การไต่สวน และการวินิจฉัยชี้ขาด พ.ศ. ๒๕๖๑ (ฉบับที่ ๓)
          </p>
        </div>

        {/* View Switcher: Page 1 vs Page 2 */}
        <div className="inline-flex p-1 rounded-xl bg-[#F7FAFC] border border-[#E2E8F0] self-start sm:self-auto">
          <button
            onClick={() => setSelectedView("page1")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              selectedView === "page1"
                ? "bg-[#173B6B] text-white shadow-xs"
                : "text-[#718096] hover:text-[#1A202C]"
            }`}
          >
            📌 หน้า 1: ขั้นตอน สนง.กกต.จว. (ระดับจังหวัด)
          </button>
          <button
            onClick={() => setSelectedView("page2")}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              selectedView === "page2"
                ? "bg-[#173B6B] text-white shadow-xs"
                : "text-[#718096] hover:text-[#1A202C]"
            }`}
          >
            🏛️ หน้า 2: ขั้นตอน สนง.กกต. ส่วนกลาง & กกต.
          </button>
        </div>
      </div>

      {/* PAGE 1: PROVINCIAL WORKFLOW */}
      {selectedView === "page1" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          {/* Rules Summary Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-[10px] text-[#718096] uppercase font-bold">ผู้มีสิทธิยื่นคำร้อง (ข้อ 23(1))</span>
              <div className="text-xs font-medium text-[#1A202C] mt-1">ผู้มีสิทธิเลือกตั้งในเขต / ผู้สมัครรับเลือกตั้งในเขต</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-[10px] text-[#718096] uppercase font-bold">ระยะเวลาการยื่น (ข้อ 24)</span>
              <div className="text-xs font-medium text-[#1A202C] mt-1">ตั้งแต่ประกาศกำหนดวันเลือกตั้ง ถึง 30 วันนับแต่ประกาศผล</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs">
              <span className="text-[10px] text-[#718096] uppercase font-bold">สถานที่ยื่น (ข้อ 25)</span>
              <div className="text-xs font-medium text-[#1A202C] mt-1">สนง.กกต.จว. (หรือ กปน./จนท. หากเกี่ยวกับการนับคะแนน)</div>
            </div>
          </div>

          {/* Provincial Flow Diagram Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EDF2F7]">
              <h3 className="text-sm font-semibold text-[#1A202C] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#1E4E8C]" />
                <span>แผนผังขั้นตอนการดำเนินงาน สนง.กกต.จว.</span>
              </h3>
              <span className="text-xs text-[#718096]">SLA สูงสุดระดับจังหวัด: 90 วัน</span>
            </div>

            {/* Step 1: Intake & Check */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1E4E8C]">1. ขั้นตรวจคำร้อง (กรณีครบถ้วน)</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">3 วัน</span>
                </div>
                <p className="text-xs text-[#4A5568] font-light">
                  พนักงานตรวจสอบรายการตามข้อ 22 ครบถ้วน เสนอ ผอ.กกต.จว. สั่งรับคำร้อง (ข้อ 26 ว.1(1))
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700">2. ขั้นตรวจคำร้อง (กรณีไม่ครบถ้วน)</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">3 วัน</span>
                </div>
                <p className="text-xs text-[#4A5568] font-light">
                  แจ้งผู้ร้องแก้ไขเพิ่มเติม หรือ บันทึกถ้อยคำ หรือ ตรวจสอบข้อเท็จจริงเพิ่มเติมตามข้อ 26 ว.3
                </p>
              </div>

            </div>

            {/* Decision Branch: ผอ.กกต.จว. สั่งรับ / ไม่รับ */}
            <div className="p-5 rounded-2xl bg-[#EBF8FF] border border-[#BEE3F8] space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-xs text-[#1E4E8C]">
                  คำสั่ง ผอ.กกต.จว. (กรอบเวลาพิจารณา 3 วัน)
                </div>
                <span className="text-[11px] text-[#2B6CB0]">ข้อ 26 ว.2 และ ข้อ 28</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Branch A: สั่งรับ */}
                <div className="bg-white p-4 rounded-xl border border-[#BEE3F8] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>คำสั่งรับคำร้อง (ข้อ 26 ว.2)</span>
                  </div>
                  <ul className="text-xs text-[#4A5568] space-y-1 font-light list-disc list-inside">
                    <li>รายงาน กกต. (แบบ สสว.1, สสว.1/1) ภายใน 3 วัน</li>
                    <li>ตั้งคณะกรรมการสืบสวนและไต่สวน (สว./ตส.)</li>
                    <li><strong>ระยะเวลาสืบสวน: 20 วัน</strong></li>
                    <li>ขยายระยะเวลาได้ <strong>15 + 15 วัน</strong> รวมไม่เกิน 90 วัน</li>
                  </ul>
                </div>

                {/* Branch B: ยกคำร้อง / สั่งไม่รับ */}
                <div className="bg-white p-4 rounded-xl border border-red-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>ยกคำร้อง / สั่งไม่รับ (ข้อ 28)</span>
                  </div>
                  <ul className="text-xs text-[#4A5568] space-y-1 font-light list-disc list-inside">
                    <li>จัดส่งสำนวนคำร้องไปยัง สนง.กกต. ส่วนกลาง</li>
                    <li>เข้าสู่กระบวนการตรวจคำร้องส่วนกลาง (30 วัน)</li>
                    <li>เสนอ กกต. วินิจฉัยชี้ขาดการไม่รับคำร้อง</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* PAGE 2: CENTRAL WORKFLOW & RULING */}
      {selectedView === "page2" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-xs space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EDF2F7]">
              <h3 className="text-sm font-semibold text-[#1A202C] flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#1E4E8C]" />
                <span>แผนผังขั้นตอนการดำเนินงาน สนง.กกต. ส่วนกลาง และ กกต.</span>
              </h3>
              <span className="text-xs text-[#718096]">SLA ตรวจสำนวน & วินิจฉัยชี้ขาด</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: กรณีคำร้อง (สั่งไม่รับจากจังหวัด) */}
              <div className="space-y-3 p-5 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0]">
                <div className="font-semibold text-xs text-[#1E4E8C] flex items-center justify-between border-b pb-2">
                  <span>กรณีคำร้อง (สั่งไม่รับจากจังหวัด)</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">รวม 30 วัน</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>1. พนักงานวิเคราะห์คำร้อง</span>
                    <span className="font-semibold text-[#1E4E8C]">20 วัน</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>2. ผอ.ฝ่าย มีความเห็น</span>
                    <span className="font-semibold text-[#1E4E8C]">2 วัน</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>3. รอง ผอ.สำนัก มีความเห็น</span>
                    <span className="font-semibold text-[#1E4E8C]">2 วัน</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>4. ผอ.สำนัก มีความเห็น</span>
                    <span className="font-semibold text-[#1E4E8C]">1 วัน</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex justify-between font-medium">
                    <span>5. ลธ.กกต. มีความเห็น</span>
                    <span className="font-bold text-blue-900">5 วัน</span>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center text-amber-900 font-semibold">
                    เสนอ กกต. พิจารณาวินิจฉัย (สั่งรับ หรือ สั่งไม่รับ / ยกคำร้อง)
                  </div>
                </div>
              </div>

              {/* Right Column: กรณีสำนวน (สืบสวนเสร็จสิ้น) */}
              <div className="space-y-3 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E3DA]">
                <div className="font-semibold text-xs text-[#9A7E41] flex items-center justify-between border-b pb-2">
                  <span>กรณีสำนวน (สืบสวนเสร็จสิ้น)</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">รวม 60 + 9 วัน</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>1. พนักงานวิเคราะห์สำนวน</span>
                    <span className="font-semibold text-[#9A7E41]">30 วัน</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>2. ผอ.ฝ่าย + รอง ผอ. + ผอ.สำนัก (คนละ 7 วัน)</span>
                    <span className="font-semibold text-[#9A7E41]">21 วัน</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#EDF2F7] flex justify-between">
                    <span>3. ลธ.กกต. มีความเห็น</span>
                    <span className="font-semibold text-[#9A7E41]">9 วัน (รวม 69 วัน)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 flex justify-between font-medium">
                    <span>4. คณะอนุวินิจฉัย มีความเห็น</span>
                    <span className="font-bold text-indigo-900">90 วัน (ข้อ 79)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0B1E36] text-white text-center font-semibold">
                    5. กกต. วินิจฉัยชี้ขาด (90 วัน) & จัดทำคำวินิจฉัย (60 วัน)
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
