"use client";

import { useState } from "react";
import { 
  X, 
  Send, 
  Paperclip, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  Printer,
  Plus,
  Trash2,
  CalendarDays,
  ArrowLeft
} from "lucide-react";
import { ALLEGATION_OPTIONS, CURRENT_CITIZEN, ELECTION_TYPE_OPTIONS, getProvinceCode, type ComplaintItem } from "@/components/oect/complaintDomain";

interface NewComplaintFormProps {
  onClose: () => void;
  onAddCase: (newCase: ComplaintItem) => void;
  mode?: "citizen" | "officer";
  presentation?: "modal" | "page";
}

export default function NewComplaintForm({ onClose, onAddCase, mode = "officer", presentation = "modal" }: NewComplaintFormProps) {
  const [complaintKind, setComplaintKind] = useState<string>("คำร้อง");
  const [userStatus, setUserStatus] = useState<string>("ผู้มีสิทธิเลือกตั้งในเขต");
  const [filingPlace, setFilingPlace] = useState<string>(mode === "citizen" ? "ระบบออนไลน์ ECT-CMS" : "สนง.กกต.จว.");
  const [electionType, setElectionType] = useState<string>("สส.");
  const [electionDate, setElectionDate] = useState<string>("2026-02-08");
  const [announcementDate, setAnnouncementDate] = useState<string>("2026-02-15");
  const [province, setProvince] = useState<string>(mode === "citizen" ? CURRENT_CITIZEN.province : "กรุงเทพมหานคร");
  const [district, setDistrict] = useState<string>(mode === "citizen" ? "เมืองเชียงใหม่" : "พระนคร");
  const [constituency, setConstituency] = useState<string>(mode === "citizen" ? CURRENT_CITIZEN.constituency : "เขตเลือกตั้งที่ 1");
  const missionGroup = "สืบสวนและไต่สวน";
  const [complainants, setComplainants] = useState<string[]>([mode === "citizen" ? CURRENT_CITIZEN.name : ""]);
  const [respondents, setRespondents] = useState<string[]>([""]);
  const [selectedAllegations, setSelectedAllegations] = useState<string[]>([ALLEGATION_OPTIONS[0]]);
  const [details, setDetails] = useState<string>("");
  const [officer, setOfficer] = useState<string>("วรากร กรณีศึกษา011");
  const [isDxcVerified, setIsDxcVerified] = useState<boolean>(true);
  const [evidenceFileCount, setEvidenceFileCount] = useState<number>(0);
  // Proxy Delegation State (ข้อ 25)
  const [isDelegated, setIsDelegated] = useState<boolean>(false);
  const [proxyName, setProxyName] = useState<string>("");
  const [proxyIdCard, setProxyIdCard] = useState<string>("");
  const [proxyRelationship, setProxyRelationship] = useState<string>("ทนายความ / ผู้รับมอบอำนาจ");
  const [hasPowerOfAttorneyFile, setHasPowerOfAttorneyFile] = useState<boolean>(false);
  const [checklist, setChecklist] = useState<boolean[]>([true, true, false, false]);

  const [submittedCase, setSubmittedCase] = useState<ComplaintItem | null>(null);
  const [submittedAtText, setSubmittedAtText] = useState<string>("");
  const [dueDateText, setDueDateText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedAt = new Date();
    const newId = Math.floor(Math.random() * 9000) + 1000;
    const electionCode = ELECTION_TYPE_OPTIONS.find((option) => option.value === electionType)?.code ?? "ECT";
    const provinceCode = getProvinceCode(province);
    const generatedCaseNum = `${electionCode}-${provinceCode}-2569-${newId}`;

    const newCaseItem: ComplaintItem = {
      id: newId,
      electionType,
      announcementDate,
      caseNumber: generatedCaseNum,
      electionDate,
      receivedDate: new Date().toISOString().split("T")[0],
      constituency,
      district,
      province,
      officer,
      complainants: complainants.filter(Boolean).join(", ") || CURRENT_CITIZEN.name,
      respondent: respondents.filter(Boolean).join(", ") || "นายธนวัฒน์ ตัวอย่างผู้ถูกร้อง",
      allegation: selectedAllegations.join(", "),
      details: details || "มีการให้ เสนอให้ หรือสัญญาว่าจะให้เงินหรือผลประโยชน์แก่ผู้มีสิทธิเลือกตั้ง",
      missionGroup,
      currentStage: "ตรวจคำร้องและมอบหมายผู้รับผิดชอบ",
      currentSection: "สนง.กกต.จว.",
      stageId: 1,
      slaDays: 3,
      remainingDays: 3,
      slaStatus: "NORMAL",
      isDelegated,
      proxyName: isDelegated ? proxyName : undefined,
      proxyIdCard: isDelegated ? proxyIdCard : undefined,
      proxyRelationship: isDelegated ? proxyRelationship : undefined,
      powerOfAttorneyDoc: isDelegated ? "หนังสือมอบอำนาจ_สตว1_1.pdf" : undefined,
    };

    onAddCase(newCaseItem);
    setSubmittedAtText(submittedAt.toLocaleString("th-TH", { dateStyle: "long", timeStyle: "short" }));
    setDueDateText(new Date(submittedAt.getTime() + 3 * 86400000).toLocaleDateString("th-TH"));
    setSubmittedCase(newCaseItem);
  };

  return (
    <div className={presentation === "page" ? "w-full" : "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs"}>
      <div role={presentation === "modal" ? "dialog" : undefined} aria-modal={presentation === "modal" ? true : undefined} aria-labelledby="new-complaint-title" className={presentation === "page" ? "w-full overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm" : "my-6 w-full max-w-3xl animate-in overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-2xl zoom-in-95 duration-150"}>
        
        {/* Header */}
        {presentation === "page" ? (
          <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-8">
            <div className="text-[10px] font-medium text-slate-400">บริการผู้ร้องเรียน / ยื่นคำร้องใหม่</div>
            <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 transition hover:border-[#4FB3E8] hover:text-[#1B3F8B]"><ArrowLeft className="h-4 w-4" /> กลับ</button>
              <div className="text-center">
                <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#4FB3E8]">Election complaint form</span>
                <h2 id="new-complaint-title" className="mt-1 text-lg font-semibold text-[#1B3F8B] sm:text-xl">ยื่นคำร้องคัดค้านการเลือกตั้ง</h2>
              </div>
              <span className="hidden rounded-full bg-[#FFD600]/15 px-3 py-1.5 text-[10px] font-semibold text-[#1B3F8B] sm:inline-flex">บันทึกร่างอัตโนมัติ</span>
            </div>
          </div>
        ) : (
          <div className="oect-header-gradient flex items-center justify-between p-5 text-white sm:px-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-[#FFD600]">แบบบันทึกรับคำร้องคัดค้านการเลือกตั้ง</span>
              <h2 id="new-complaint-title" className="text-base font-medium text-white sm:text-lg">บันทึกรับคำร้องเรียนใหม่เข้าสู่ระบบ</h2>
            </div>
            <button type="button" onClick={onClose} aria-label="ปิดแบบฟอร์มคำร้อง" className="rounded-xl bg-white/10 p-2 text-white transition-colors hover:bg-white/20"><X className="h-5 w-5" /></button>
          </div>
        )}

        {submittedCase ? (
          /* Submission Success View */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1A202C]">บันทึกรับคำร้องเรียนสำเร็จ</h3>
            <div className="p-4 rounded-2xl bg-[#F7FAFC] border border-[#E2E8F0] max-w-md mx-auto text-left text-xs space-y-1.5">
              <div><strong className="text-[#718096]">เลขที่เรื่องร้องเรียน:</strong> <span className="font-bold text-[#1B3F8B] text-sm">{submittedCase.caseNumber}</span></div>
              <div><strong className="text-[#718096]">ประเภท:</strong> {complaintKind} · {userStatus}</div>
              <div><strong className="text-[#718096]">วัน/เวลาที่ยื่น:</strong> {submittedAtText} น.</div>
              <div><strong className="text-[#718096]">สถานที่ยื่น:</strong> {filingPlace} จ.{submittedCase.province}</div>
              <div><strong className="text-[#718096]">พื้นที่:</strong> จ.{submittedCase.province} {submittedCase.constituency} ({submittedCase.district})</div>
              <div><strong className="text-[#718096]">ข้อกล่าวหา:</strong> {submittedCase.allegation}</div>
              <div><strong className="text-[#718096]">SLA ขั้นตอนแรก:</strong> 3 วัน (ครบกำหนดวันที่ {dueDateText})</div>
            </div>
            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium hover:bg-[#F7FAFC] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#1B3F8B]" />
                <span>พิมพ์ใบรับคำร้อง</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-xs font-medium hover:bg-[#F7FAFC] flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-[#1B3F8B]" />
                <span>ดาวน์โหลดใบรับ</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#1B3F8B] text-white text-xs font-medium hover:bg-[#1B3F8B]"
              >
                เสร็จสิ้นและปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Intake Form */
          <form onSubmit={handleSubmit} className={`space-y-6 ${presentation === "page" ? "p-5 sm:p-8 lg:p-10" : "p-6 sm:p-8"}`}>
            
            {/* Step 1: Election & Area */}
            <div className={presentation === "page" ? "space-y-4 border-b border-slate-200 pb-6" : "space-y-3 rounded-2xl border border-[#EDF2F7] bg-[#F7FAFC] p-4"}>
              <span className="text-xs font-bold text-[#1B3F8B] block">
                {mode === "citizen" ? "1. คุณสมบัติผู้ยื่นและข้อมูลการเลือกตั้ง" : "1. ประเภทคำร้อง คุณสมบัติผู้ยื่น และสถานที่ยื่น"}
              </span>
              <div className={`grid grid-cols-1 gap-3 text-xs ${mode === "citizen" ? "sm:grid-cols-1" : "sm:grid-cols-3"}`}>
                {mode === "officer" && <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">ประเภทเอกสาร <RequiredMark /></label>
                  <select value={complaintKind} onChange={(e) => setComplaintKind(e.target.value)} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none">
                    <option>คำร้อง</option>
                    <option>สำนวน</option>
                  </select>
                </div>}
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">สถานะผู้ยื่นตามข้อ 23(3) <RequiredMark /></label>
                  <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none">
                    <option>ผู้มีสิทธิเลือกตั้งในเขต</option>
                    <option>ผู้สมัครรับเลือกตั้งในเขต</option>
                  </select>
                </div>
                {mode === "officer" && <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">สถานที่ยื่น <RequiredMark /></label>
                  <select value={filingPlace} onChange={(e) => setFilingPlace(e.target.value)} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none">
                    <option>สนง.กกต.จว.</option>
                    <option>สนง.กกต. (กรณีจำเป็น)</option>
                  </select>
                </div>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">ประเภทการเลือกตั้ง <RequiredMark /></label>
                  <select
                    value={electionType}
                    onChange={(e) => setElectionType(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    {ELECTION_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">จังหวัด <RequiredMark /></label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">อำเภอ/เขต <RequiredMark /></label>
                  <input type="text" required value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">เขตเลือกตั้ง <RequiredMark /></label>
                  <input
                    type="text"
                    required
                    value={constituency}
                    onChange={(e) => setConstituency(e.target.value)}
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid gap-3 text-xs sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-medium text-[#4A5568]">วันเลือกตั้ง <RequiredMark /></label>
                  <input type="date" required value={electionDate} onChange={(event) => setElectionDate(event.target.value)} className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="mb-1 block font-medium text-[#4A5568]">วันประกาศผล <RequiredMark /></label>
                  <input type="date" required value={announcementDate} onChange={(event) => setAnnouncementDate(event.target.value)} className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-[10px] leading-5 text-blue-800">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" /> ยื่นได้ตั้งแต่ประกาศกำหนดวันเลือกตั้งจนถึง 30 วันนับแต่ประกาศผล เว้นแต่คำร้องเกี่ยวกับการนับคะแนนซึ่งต้องยื่นระหว่างการนับคะแนนยังไม่แล้วเสร็จ
              </div>
            </div>

            {/* Step 2: Parties */}
            <div className={presentation === "page" ? "space-y-4 border-b border-slate-200 pb-6" : "space-y-3 rounded-2xl border border-[#EDF2F7] bg-[#F7FAFC] p-4"}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B3F8B]">
                  2. ข้อมูลคู่กรณี (ผู้ร้องและผู้ถูกร้อง)
                </span>
                {mode === "officer" ? <button type="button" onClick={() => setIsDxcVerified((current) => !current)} className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${isDxcVerified ? "text-emerald-700 bg-emerald-100" : "text-amber-700 bg-amber-100"}`}>
                  <UserCheck className="w-3 h-3" />
                  <span>{isDxcVerified ? "ยืนยันตัวตนผ่าน ThaID/DXC แล้ว" : "รอยืนยันตัวตน"}</span>
                </button> : <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700"><UserCheck className="h-3 w-3" /> ยืนยันตัวตนแล้ว</span>}
              </div>

              {/* Proxy Selection Radio (ข้อ 25) */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2">
                <label className="block text-xs font-bold text-slate-800">รูปแบบการยื่นคำร้อง (ตามระเบียบ กกต. ข้อ ๒๕)</label>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="delegation_choice"
                      checked={!isDelegated}
                      onChange={() => setIsDelegated(false)}
                      className="text-[#1B3F8B]"
                    />
                    <span className="font-semibold text-slate-700">ยื่นคำร้องด้วยตนเอง</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="delegation_choice"
                      checked={isDelegated}
                      onChange={() => setIsDelegated(true)}
                      className="text-[#1B3F8B]"
                    />
                    <span className="font-semibold text-purple-900">มอบอำนาจให้ผู้อื่นยื่นแทน (แนบแบบ สตว. ๑/๑)</span>
                  </label>
                </div>

                {isDelegated && (
                  <div className="mt-3 grid gap-3 sm:grid-cols-3 rounded-xl bg-purple-50/70 p-3 border border-purple-200">
                    <div>
                      <label className="block text-[10px] font-bold text-purple-900 mb-1">ชื่อผู้รับมอบอำนาจ *</label>
                      <input
                        type="text"
                        required={isDelegated}
                        value={proxyName}
                        onChange={(e) => setProxyName(e.target.value)}
                        placeholder="เช่น นายอนุรักษ์ ตัวแทน"
                        className="w-full rounded-lg border border-purple-200 bg-white p-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-purple-900 mb-1">เลขประจำตัว ปชช. 13 หลัก</label>
                      <input
                        type="text"
                        value={proxyIdCard}
                        onChange={(e) => setProxyIdCard(e.target.value)}
                        placeholder="1-5099-*****"
                        className="w-full rounded-lg border border-purple-200 bg-white p-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-purple-900 mb-1">ความสัมพันธ์ / ฐานะ</label>
                      <input
                        type="text"
                        value={proxyRelationship}
                        onChange={(e) => setProxyRelationship(e.target.value)}
                        placeholder="เช่น ทนายความ / ผู้แทน"
                        className="w-full rounded-lg border border-purple-200 bg-white p-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 text-xs sm:grid-cols-2">
                <PartyFields
                  label="ชื่อผู้ร้องเรียน (ผู้มอบอำนาจ)"
                  helper="เพิ่มผู้ร้องได้มากกว่า 1 ราย"
                  values={complainants}
                  placeholder="เช่น นายศุภชัย ทดสอบ"
                  onChange={setComplainants}
                />
                <PartyFields
                  label="ชื่อผู้ถูกร้องเรียน"
                  helper="เพิ่มผู้ถูกร้องได้มากกว่า 1 ราย"
                  values={respondents}
                  placeholder="เช่น น.ส.สุพิชญา จำลอง"
                  onChange={setRespondents}
                />
              </div>
            </div>

            {/* Step 3: Allegation */}
            <div className={presentation === "page" ? "space-y-4 border-b border-slate-200 pb-6" : "space-y-3 rounded-2xl border border-[#EDF2F7] bg-[#F7FAFC] p-4"}>
              <span className="text-xs font-bold text-[#1B3F8B] block">
                3. ข้อกล่าวหาและพฤติการณ์การกระทำความผิด
              </span>
              <div className={`grid grid-cols-1 gap-3 text-xs ${mode === "officer" ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}>
                <div>
                  <label className="mb-1 block font-medium text-[#4A5568]">ข้อกล่าวหา <RequiredMark /> <span className="font-normal text-slate-400">(เลือกได้มากกว่า 1 รายการ)</span></label>
                  <div className="grid gap-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-2">
                    {ALLEGATION_OPTIONS.map((option) => {
                      const checked = selectedAllegations.includes(option);
                      return (
                        <label key={option} className={`flex cursor-pointer items-start gap-2 rounded-lg p-2 text-[10px] leading-4 ${checked ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setSelectedAllegations((current) => checked ? current.filter((item) => item !== option) : [...current, option])}
                            className="mt-0.5"
                          />
                          {option}
                        </label>
                      );
                    })}
                  </div>
                </div>
                {mode === "officer" && <div>
                  <label className="block text-[#4A5568] mb-1 font-medium">หน่วยงานรับผิดชอบเริ่มต้น</label>
                  <input
                    type="text"
                    value={officer}
                    onChange={(e) => setOfficer(e.target.value)}
                    readOnly
                    className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>}
              </div>

              <div>
                <label className="block text-xs text-[#4A5568] mb-1 font-medium">รายละเอียดพฤติการณ์โดยสังเขป <RequiredMark /></label>
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

            <div className={presentation === "page" ? "space-y-4" : "space-y-4 rounded-2xl border border-[#EDF2F7] bg-[#F7FAFC] p-4"}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#1B3F8B]">4. พยานหลักฐานและ Checklist ตามข้อ 22</span>
                <span className="text-[10px] font-medium text-slate-500">แนบแล้ว {evidenceFileCount} ไฟล์</span>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <Paperclip className="h-6 w-6 text-blue-700" />
                <span className="mt-2 text-xs font-bold text-slate-800">เลือกเอกสาร รูปภาพ หรือวิดีโอหลายไฟล์</span>
                <span className="mt-1 text-[10px] text-slate-500">PDF, JPG, PNG, MP4 · สูงสุด 25 MB ต่อไฟล์</span>
                <input type="file" multiple className="sr-only" onChange={(event) => setEvidenceFileCount(event.target.files?.length ?? 0)} />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  "คำร้องระบุข้อเท็จจริงและพฤติการณ์ชัดเจน",
                  "ระบุผู้ร้อง ผู้ถูกร้อง และเขตเลือกตั้งครบถ้วน",
                  "แนบหรือระบุพยานหลักฐานที่เกี่ยวข้อง",
                  "รับรองว่าข้อมูลเป็นความจริงและยินยอมให้ตรวจสอบ",
                ].map((item, index) => (
                  <label key={item} className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-xs ${checklist[index] ? "border-emerald-200 bg-emerald-50 text-emerald-950" : "border-slate-200 bg-white text-slate-600"}`}>
                    <input type="checkbox" checked={checklist[index]} onChange={() => setChecklist((current) => current.map((value, currentIndex) => currentIndex === index ? !value : value))} className="mt-0.5" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              {!checklist.every(Boolean) && <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> กรุณาตรวจและยืนยัน Checklist ให้ครบก่อนส่งคำร้อง</div>}
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
                disabled={!checklist.every(Boolean) || !isDxcVerified || selectedAllegations.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#1B3F8B] hover:bg-[#1B3F8B] text-white text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{mode === "citizen" ? "ยื่นคำร้อง" : "ยืนยันและส่งคำร้อง"}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

function PartyFields({
  label,
  helper,
  values,
  placeholder,
  onChange,
}: {
  label: string;
  helper: string;
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div><label className="block font-medium text-[#4A5568]">{label} <RequiredMark /></label><span className="text-[9px] text-slate-400">{helper}</span></div>
        <button type="button" onClick={() => onChange([...values, ""])} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[9px] font-bold text-blue-700 hover:bg-blue-100"><Plus className="h-3 w-3" /> เพิ่มรายชื่อ</button>
      </div>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              required={index === 0}
              value={value}
              placeholder={`${placeholder}${index ? ` รายที่ ${index + 1}` : ""}`}
              onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))}
              className="w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
            />
            {values.length > 1 && <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`ลบ${label}รายที่ ${index + 1}`}><Trash2 className="h-4 w-4" /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function RequiredMark() {
  return <span aria-hidden="true" className="ml-0.5 font-bold text-rose-600">*</span>;
}
