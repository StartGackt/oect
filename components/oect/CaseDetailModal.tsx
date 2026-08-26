"use client";

import { useState } from "react";
import { 
  X, 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Download, 
  Printer, 
  Eye, 
  EyeOff, 
  Layers, 
  Paperclip,
  Share2
} from "lucide-react";

interface ComplaintItem {
  id: number;
  electionType: string;
  announcementDate: string;
  caseNumber: string;
  electionDate: string;
  receivedDate: string;
  constituency: string;
  district: string;
  province: string;
  officer: string;
  complainants: string;
  respondent: string;
  allegation: string;
  details: string;
  missionGroup: string;
  currentStage: string;
  currentSection: string;
  stageId: number;
  slaDays: number;
  remainingDays: number;
  slaStatus: string;
}

interface CaseDetailModalProps {
  caseItem: ComplaintItem;
  onClose: () => void;
}

export default function CaseDetailModal({ caseItem, onClose }: CaseDetailModalProps) {
  const [maskData, setMaskData] = useState<boolean>(true);
  const [officerNote, setOfficerNote] = useState<string>("");
  const [actionSuccess, setActionSuccess] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<"info" | "timeline" | "action">("info");

  // Masking helper
  const maskName = (text: string) => {
    if (!maskData) return text;
    return text.replace(/(\S{3})\S+(\S{2})/g, "$1***$2");
  };

  const workflowSteps = [
    { id: 1, title: "1. ตรวจคำร้องและมอบหมายผู้รับผิดชอบ", dept: "สนง.กกต.จว.", sla: "3 วัน" },
    { id: 2, title: "2. ผอ.กกต.จว. พิจารณาสั่งรับ/ไม่รับ", dept: "สนง.กกต.จว.", sla: "3 วัน" },
    { id: 3, title: "3. สืบสวน/ไต่สวน (กรณีสั่งรับ)", dept: "สนง.กกต.จว.", sla: "90 วัน (20+15+15)" },
    { id: 4, title: "4. ผอ.กกต.จว. สรุปความเห็น & ส่งสำนวน", dept: "สนง.กกต.จว.", sla: "-" },
    { id: 5, title: "5. ตรวจสำนวนส่วนกลาง (4 ลำดับชั้น)", dept: "สนง.กกต. ส่วนกลาง", sla: "60 วัน" },
    { id: 6, title: "6. ลธ.กกต. มีความเห็น", dept: "สนง.กกต. ส่วนกลาง", sla: "9 วัน (รวม 69 วัน)" },
    { id: 7, title: "7. คณะอนุวินิจฉัย มีความเห็น", dept: "สนง.กกต. ส่วนกลาง", sla: "90 วัน" },
    { id: 8, title: "8. กกต. พิจารณาวินิจฉัยชี้ขาด", dept: "สนง.กกต. ส่วนกลาง", sla: "90 วัน" },
    { id: 9, title: "9. จัดทำคำวินิจฉัย กกต.", dept: "สนง.กกต. ส่วนกลาง", sla: "60 วัน" },
    { id: 10, title: "10. แจ้งคู่กรณี & ปิดสำนวน", dept: "สนง.กกต. ส่วนกลาง", sla: "15 วัน" },
  ];

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess(true);
    setTimeout(() => {
      setActionSuccess(false);
      alert("บันทึกคำสั่งและอัปเดตสถานะสำนวนเรียบร้อยแล้ว");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-6 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="oect-header-gradient text-white p-5 sm:px-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ECC94B] text-[#0B1E36] font-bold text-xs">
                {caseItem.caseNumber}
              </span>
              <span className="text-xs text-white/80">
                ประเภท: {caseItem.electionType} · กลุ่ม: {caseItem.missionGroup}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-medium text-white">
              สำนวนอิเล็กทรอนิกส์ (e-Dossier Case File)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMaskData(!maskData)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                maskData ? "bg-white/20 text-[#ECC94B]" : "bg-red-500/80 text-white"
              }`}
              title="เปิด/ปิดการปกปิดข้อมูลส่วนบุคคลตาม พ.ร.บ. PDPA"
            >
              {maskData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{maskData ? "PDPA Masked" : "Unmasked"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="bg-[#F7FAFC] border-b border-[#E2E8F0] px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab("info")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === "info" ? "bg-white text-[#173B6B] shadow-2xs" : "text-[#718096] hover:text-[#1A202C]"
              }`}
            >
              📄 ข้อมูลสำนวน & พยานหลักฐาน
            </button>
            <button
              onClick={() => setActiveSubTab("timeline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === "timeline" ? "bg-white text-[#173B6B] shadow-2xs" : "text-[#718096] hover:text-[#1A202C]"
              }`}
            >
              ⏱️ ลำดับขั้นตอน Workflow & SLA
            </button>
            <button
              onClick={() => setActiveSubTab("action")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSubTab === "action" ? "bg-[#173B6B] text-white shadow-2xs" : "text-[#718096] hover:text-[#1A202C]"
              }`}
            >
              ✍️ บันทึกคำสั่ง / ความเห็น
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-[#718096]">สถานะ SLA:</span>
            <span
              className={`px-2 py-0.5 rounded-full font-semibold ${
                caseItem.slaStatus === "OVERDUE"
                  ? "bg-red-100 text-red-700"
                  : caseItem.slaStatus === "NEAR_DUE"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {caseItem.slaStatus === "OVERDUE" ? `เกิน ${Math.abs(caseItem.remainingDays)} วัน` : `เหลือ ${caseItem.remainingDays} วัน`}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: INFO & EVIDENCE */}
          {activeSubTab === "info" && (
            <div className="space-y-6">
              
              {/* Top Key Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7FAFC] p-4 rounded-2xl border border-[#EDF2F7]">
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">วันที่รับคำร้อง</span>
                  <div className="text-xs font-semibold text-[#1A202C]">{caseItem.receivedDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">วันเลือกตั้ง</span>
                  <div className="text-xs font-semibold text-[#1A202C]">{caseItem.electionDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">วันประกาศผล</span>
                  <div className="text-xs font-semibold text-[#1A202C]">{caseItem.announcementDate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#718096] uppercase font-medium">พื้นที่ / เขตเลือกตั้ง</span>
                  <div className="text-xs font-semibold text-[#173B6B]">จ.{caseItem.province} {caseItem.constituency}</div>
                </div>
              </div>

              {/* Parties: Complainants & Respondents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Complainants */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#173B6B] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>ผู้ร้องเรียน (Complainants)</span>
                    </span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      ผู้มีสิทธิเลือกตั้งในเขต (ข้อ 23)
                    </span>
                  </div>
                  <div className="text-xs text-[#2D3748] font-medium leading-relaxed bg-[#F7FAFC] p-3 rounded-xl border border-[#EDF2F7]">
                    {maskName(caseItem.complainants)}
                  </div>
                  <div className="text-[10px] text-[#718096]">
                    ✓ ตรวจสอบสถานะการมีสิทธิเลือกตั้งผ่าน DOPA Linkage Center แล้ว
                  </div>
                </div>

                {/* Respondents */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>ผู้ถูกร้องเรียน (Respondents)</span>
                    </span>
                    <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-medium">
                      ผู้สมัครรับเลือกตั้ง
                    </span>
                  </div>
                  <div className="text-xs text-[#2D3748] font-medium leading-relaxed bg-[#F7FAFC] p-3 rounded-xl border border-[#EDF2F7]">
                    {maskName(caseItem.respondent)}
                  </div>
                  <div className="text-[10px] text-[#718096]">
                    ✓ ตรวจสอบสถานะผู้สมัครผ่านระบบ PRAXTICOL แล้ว
                  </div>
                </div>

              </div>

              {/* Allegation & Details */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1A202C]">
                    ข้อกล่าวหา: <strong className="text-red-600 font-bold">{caseItem.allegation}</strong>
                  </span>
                  <span className="text-[10px] text-[#718096]">พนักงานผู้รับผิดชอบ: {caseItem.officer}</span>
                </div>
                <div className="text-xs text-[#4A5568] leading-relaxed bg-[#F7FAFC] p-4 rounded-xl border border-[#EDF2F7]">
                  {caseItem.details}
                </div>
              </div>

              {/* Evidence & Attachments */}
              <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-2xs space-y-3">
                <div className="text-xs font-semibold text-[#1A202C] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[#173B6B]" />
                  <span>พยานหลักฐานและเอกสารประกอบสำนวน</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="truncate">คำร้องแบบ_สสว1.pdf</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#718096] hover:text-[#1A202C] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span className="truncate">ภาพถ่ายหลักฐาน_01.jpg</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#718096] hover:text-[#1A202C] cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="truncate">บันทึกถ้อยคำพยาน.pdf</span>
                    </div>
                    <Download className="w-3.5 h-3.5 text-[#718096] hover:text-[#1A202C] cursor-pointer" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: TIMELINE & WORKFLOW PROGRESS */}
          {activeSubTab === "timeline" && (
            <div className="space-y-4">
              <div className="text-xs text-[#718096] mb-3">
                แสดงสถานะความคืบหน้าของสำนวนตามระเบียบ กกต. ว่าด้วยการสืบสวน การไต่สวน และการวินิจฉัยชี้ขาด พ.ศ. ๒๕๖๑
              </div>

              <div className="space-y-3">
                {workflowSteps.map((step) => {
                  const isCurrent = step.id === caseItem.stageId;
                  const isPast = step.id < caseItem.stageId;
                  return (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? "bg-[#EBF8FF] border-[#1E4E8C] shadow-xs"
                          : isPast
                          ? "bg-[#F7FAFC] border-[#E2E8F0] opacity-80"
                          : "bg-white border-[#EDF2F7] opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? "bg-[#1E4E8C] text-white animate-pulse"
                              : isPast
                              ? "bg-emerald-500 text-white"
                              : "bg-[#E2E8F0] text-[#718096]"
                          }`}
                        >
                          {isPast ? "✓" : step.id}
                        </div>
                        <div>
                          <div className={`text-xs font-medium ${isCurrent ? "text-[#1E4E8C] font-semibold" : "text-[#2D3748]"}`}>
                            {step.title}
                          </div>
                          <div className="text-[10px] text-[#718096]">{step.dept}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-[#4A5568] bg-white px-2.5 py-0.5 rounded-full border border-[#E2E8F0]">
                          SLA: {step.sla}
                        </span>
                        {isCurrent && (
                          <div className="text-[10px] text-[#1E4E8C] font-medium mt-0.5">
                            📍 กำลังดำเนินการในขั้นตอนนี้
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OFFICIAL ACTION FORM */}
          {activeSubTab === "action" && (
            <form onSubmit={handleSaveAction} className="space-y-4">
              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E2E8F0]">
                <span className="text-xs font-semibold text-[#1A202C] block mb-1">
                  การสั่งการและบันทึกความเห็นทางกฎหมาย (Official Ruling / Action)
                </span>
                <p className="text-[11px] text-[#718096]">
                  สำหรับ ผอ.กกต.จว. หรือ คณะกรรมการสืบสวนและไต่สวน หรือ กกต. ส่วนกลาง
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D3748] mb-1.5">
                  เลือกประเภทคำสั่งการ / การเปลี่ยนสถานะ
                </label>
                <select className="w-full text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#1E4E8C]">
                  <option>สั่งรับคำร้อง (เสนอตั้ง คกก.สืบสวนและไต่สวน)</option>
                  <option>สั่งไม่รับคำร้อง / ยกคำร้อง (เสนอ กกต. ส่วนกลาง)</option>
                  <option>ขออนุมัติขยายระยะเวลาสืบสวน (15 วัน)</option>
                  <option>ส่งสำนวนการสืบสวนให้ สนง.กกต. ส่วนกลาง</option>
                  <option>เสนอความเห็นต่อคณะอนุวินิจฉัย</option>
                  <option>บันทึกมติที่ประชุม กกต. วินิจฉัยชี้ขาด</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D3748] mb-1.5">
                  บันทึกความเห็น / เหตุผลประกอบคำสั่ง
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="ระบุข้อเท็จจริง ข้อกฎหมาย และเหตุผลแห่งการสั่งการ..."
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  className="w-full text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl p-3 focus:outline-none focus:border-[#1E4E8C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-[#718096] hover:text-[#1A202C]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#173B6B] hover:bg-[#0B1E36] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>บันทึกคำสั่งและลงนามอิเล็กทรอนิกส์</span>
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#F7FAFC] border-t border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between text-xs text-[#718096]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ระบบบันทึก Audit Trail การเข้าดูสำนวนตามมาตรฐาน OWASP และ PDPA</span>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 text-[#173B6B] font-medium hover:underline"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์สำนวน</span>
          </button>
        </div>

      </div>
    </div>
  );
}
