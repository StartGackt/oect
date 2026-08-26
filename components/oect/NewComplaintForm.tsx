"use client";

import { useState } from "react";
import { 
  X, 
  Check, 
  Send, 
  Paperclip, 
  UserCheck, 
  FileText, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  Printer,
  Plus
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

interface NewComplaintFormProps {
  onClose: () => void;
  onAddCase: (newCase: ComplaintItem) => void;
}

export default function NewComplaintForm({ onClose, onAddCase }: NewComplaintFormProps) {
  const [step, setStep] = useState<number>(1);
  const [electionType, setElectionType] = useState<string>("สส.");
  const [province, setProvince] = useState<string>("กรุงเทพมหานคร");
  const [district, setDistrict] = useState<string>("พระนคร");
  const [constituency, setConstituency] = useState<string>("เขตเลือกตั้งที่ 1");
  const [missionGroup, setMissionGroup] = useState<string>("สืบสวนและไต่สวน");
  const [complainants, setComplainants] = useState<string>("");
  const [respondent, setRespondent] = useState<string>("");
  const [allegation, setAllegation] = useState<string>("ซื้อเสียง/ให้ประโยชน์");
  const [details, setDetails] = useState<string>("");
  const [officer, setOfficer] = useState<string>("วรากร กรณีศึกษา011");
  const [isDxcVerified, setIsDxcVerified] = useState<boolean>(true);
  const [submittedCase, setSubmittedCase] = useState<ComplaintItem | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.floor(Math.random() * 9000) + 1000;
    const generatedCaseNum = `MP-${province.substring(0, 3).toUpperCase()}-2569-${newId}`;

    const newCaseItem: ComplaintItem = {
      id: newId,
      electionType,
      announcementDate: "2569-02-15",
      caseNumber: generatedCaseNum,
      electionDate: "2569-02-08",
      receivedDate: new Date().toISOString().split("T")[0],
      constituency,
      district,
      province,
      officer,
      complainants: complainants || "นายสมชาย ตัวอย่างผู้ร้อง",
      respondent: respondent || "นายธนวัฒน์ ตัวอย่างผู้ถูกร้อง",
      allegation,
      details: details || "มีการให้ เสนอให้ หรือสัญญาว่าจะให้เงินหรือผลประโยชน์แก่ผู้มีสิทธิเลือกตั้ง",
      missionGroup,
      currentStage: "ตรวจคำร้องและมอบหมายผู้รับผิดชอบ",
      currentSection: "สนง.กกต.จว.",
      stageId: 1,
      slaDays: 3,
      remainingDays: 3,
      slaStatus: "NORMAL",
    };

    onAddCase(newCaseItem);
    setSubmittedCase(newCaseItem);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="oect-header-gradient text-white p-5 sm:px-8 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-[#ECC94B] font-semibold">แบบคำร้องคัดค้านการเลือกตั้ง (แบบ สสว.1)</span>
            <h2 className="text-base sm:text-lg font-medium text-white">
              บันทึกรับคำร้องเรียนใหม่เข้าสู่ระบบ
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedCase ? (
          /* Submission Success View */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1A202C]">บันทึกรับคำร้องเรียนสำเร็จ</h3>
            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] max-w-md mx-auto text-left text-xs space-y-1.5">
              <div><strong className="text-[#718096]">เลขที่เรื่องร้องเรียน:</strong> <span className="font-bold text-[#1E4E8C] text-sm">{submittedCase.caseNumber}</span></div>
              <div><strong className="text-[#718096]">พื้นที่:</strong> จ.{submittedCase.province} {submittedCase.constituency} ({submittedCase.district})</div>
              <div><strong className="text-[#718096]">ข้อกล่าวหา:</strong> {submittedCase.allegation}</div>
              <div><strong className="text-[#718096]">SLA ขั้นตอนแรก:</strong> 3 วัน (ครบกำหนดวันที่ {new Date(Date.now() + 3*86400000).toLocaleDateString('th-TH')})</div>
            </div>
            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium hover:bg-[#F7FAFC] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#1E4E8C]" />
                <span>พิมพ์ใบรับคำร้อง (สสว.1)</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#173B6B] text-white text-xs font-medium hover:bg-[#0B1E36]"
              >
                เสร็จสิ้นและปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Intake Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            
            {/* Step 1: Election & Area */}
            <div className="space-y-3 bg-[#F7FAFC] p-4 rounded-2xl border border-[#EDF2F7]">
              <span className="text-xs font-bold text-[#1E4E8C] block">
                1. ข้อมูลการเลือกตั้งและพื้นที่เกิดเหตุ
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">ประเภทการเลือกตั้ง *</label>
                  <select
                    value={electionType}
                    onChange={(e) => setElectionType(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="สส.">สมาชิกสภาผู้แทนราษฎร (สส.)</option>
                    <option value="สว.">สมาชิกวุฒิสภา (สว.)</option>
                    <option value="อบจ.">องค์การบริหารส่วนจังหวัด (อบจ.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">จังหวัด *</label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">เขตเลือกตั้ง *</label>
                  <input
                    type="text"
                    required
                    value={constituency}
                    onChange={(e) => setConstituency(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Parties */}
            <div className="space-y-3 bg-[#F7FAFC] p-4 rounded-2xl border border-[#EDF2F7]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E4E8C]">
                  2. ข้อมูลคู่กรณี (ผู้ร้องและผู้ถูกร้อง)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>เชื่อมโยง DXC ทะเบียนราษฎรแล้ว</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">ชื่อผู้ร้องเรียน (ผู้มีสิทธิเลือกตั้งในเขต) *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น นายศุภชัย ทดสอบ (ผู้มีสิทธิเลือกตั้ง)"
                    value={complainants}
                    onChange={(e) => setComplainants(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">ชื่อผู้ถูกร้องเรียน (ผู้สมัคร/พรรคการเมือง) *</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น น.ส.สุพิชญา จำลอง (ผู้สมัคร สส. เขต 1)"
                    value={respondent}
                    onChange={(e) => setRespondent(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Allegation */}
            <div className="space-y-3 bg-[#F7FAFC] p-4 rounded-2xl border border-[#EDF2F7]">
              <span className="text-xs font-bold text-[#1E4E8C] block">
                3. ข้อกล่าวหาและพฤติการณ์การกระทำความผิด
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">หมวดหมู่ข้อกล่าวหา *</label>
                  <select
                    value={allegation}
                    onChange={(e) => setAllegation(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="ซื้อเสียง/ให้ประโยชน์">ซื้อเสียง/ให้เงินหรือทรัพย์สิน</option>
                    <option value="จัดเลี้ยง">จัดเลี้ยงหรือมหรสพเพื่อจูงใจ</option>
                    <option value="ใส่ร้าย/ข้อมูลทำให้เข้าใจผิด">ใส่ร้ายด้วยความเท็จ/ข้อมูลบิดเบือน</option>
                    <option value="เจ้าหน้าที่ปฏิบัติหน้าที่มิชอบ">เจ้าหน้าที่รัฐใช้ตำแหน่งหน้าที่มิชอบ</option>
                    <option value="ทำลายป้าย/ข่มขู่">ทำลายป้ายหาเสียง/ข่มขู่คุกคาม</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">พนักงานผู้รับผิดชอบ *</label>
                  <input
                    type="text"
                    required
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#4A5568] mb-1 font-medium">รายละเอียดพฤติการณ์โดยสังเขป *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="ระบุวัน เวลา สถานที่ และพฤติการณ์การกระทำความผิดที่สังเกตพบ..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-[#718096] hover:text-[#1A202C]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#173B6B] hover:bg-[#0B1E36] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>บันทึกคำร้องและออกเลขรับอัตโนมัติ</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
