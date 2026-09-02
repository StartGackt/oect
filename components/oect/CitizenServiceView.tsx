"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileCheck2,
  FilePlus2,
  FileText,
  MapPin,
  Paperclip,
  Search,
  Settings2,
  ShieldCheck,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { WORKFLOW_STEPS, formatThaiDate, getPublicStatus, getSlaLabel, type CitizenAccount, type ComplaintItem } from "@/components/oect/complaintDomain";
import { useAuditLogStore } from "@/components/oect/rbacDomain";

interface CitizenServiceViewProps {
  cases: ComplaintItem[];
  currentCitizen: CitizenAccount;
  activeTab: CitizenTab;
  onTabChange: (tab: CitizenTab) => void;
  onOpenNewComplaint: () => void;
  onSelectCase: (caseItem: ComplaintItem) => void;
  onUpdateCase?: (updated: ComplaintItem) => void;
}

export type CitizenTab = "overview" | "new" | "tracking" | "correction" | "result" | "history" | "profile" | "search_election";

const TAB_META: Record<CitizenTab, { title: string; description: string }> = {
  overview: { title: "ภาพรวมคำร้องของฉัน", description: "ตรวจสอบสถานะล่าสุดและรายการที่ต้องดำเนินการ" },
  new: { title: "ยื่นคำร้องใหม่", description: "กรอกข้อมูลคำร้องและแนบเอกสารหลักฐาน" },
  tracking: { title: "ติดตามสถานะคำร้อง", description: "ดูลำดับขั้นตอนและกรอบเวลาดำเนินการ" },
  correction: { title: "แก้ไขและเพิ่มเติมคำร้อง (ข้อ ๒๖(๒))", description: "ส่งข้อมูลหรือเอกสารเพิ่มเติมภายในกำหนด" },
  result: { title: "ผลการพิจารณา", description: "ตรวจสอบผลและดาวน์โหลดเอกสารที่เปิดเผยได้" },
  history: { title: "ประวัติคำร้องของฉัน", description: "ค้นหาและตรวจสอบคำร้องที่เคยยื่นทั้งหมด" },
  profile: { title: "ข้อมูลส่วนตัว", description: "ตรวจสอบข้อมูลบัญชีและช่องทางการแจ้งเตือน" },
  search_election: { title: "ค้นหาข้อมูลการเลือกตั้ง", description: "ค้นหาข้อมูลผู้สมัคร ผลการเลือกตั้ง และสถิติที่เกี่ยวข้อง" },
};

const MOCK_ELECTION_RESULTS = [
  { id: "1", date: "2023-05-14", province: "กรุงเทพมหานคร", electionType: "สส", electionName: "การเลือกตั้งสมาชิกสภาผู้แทนราษฎร ปี 2566", status: "ประกาศผลแล้ว", voterCount: "2,543,120" },
  { id: "2", date: "2023-05-14", province: "เชียงใหม่", electionType: "สส", electionName: "การเลือกตั้งสมาชิกสภาผู้แทนราษฎร ปี 2566", status: "ประกาศผลแล้ว", voterCount: "1,234,567" },
  { id: "3", date: "2024-03-24", province: "ขอนแก่น", electionType: "สว", electionName: "การเลือกตั้งสมาชิกวุฒิสภา ปี 2567", status: "อยู่ระหว่างพิจารณาคำร้อง", voterCount: "1,100,450" },
  { id: "4", date: "2023-11-20", province: "ภูเก็ต", electionType: "เทศบาล", electionName: "การเลือกตั้งนายกเทศมนตรีและสมาชิกสภาเทศบาลเมืองภูเก็ต", status: "ประกาศผลแล้ว", voterCount: "145,230" },
];

export default function CitizenServiceView({ cases, currentCitizen, activeTab, onTabChange, onOpenNewComplaint, onSelectCase, onUpdateCase }: CitizenServiceViewProps) {
  const [search, setSearch] = useState("");
  const [electionSearch, setElectionSearch] = useState({ startDate: "", endDate: "", province: "", electionType: "" });
  const [electionResults, setElectionResults] = useState<typeof MOCK_ELECTION_RESULTS | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [editedDetails, setEditedDetails] = useState("");
  const [correctionSubmittedSuccess, setCorrectionSubmittedSuccess] = useState(false);
  const [, appendAuditLog] = useAuditLogStore();
  const myCases = useMemo(() => cases.filter((item) => item.complainants.includes(currentCitizen.name)), [cases, currentCitizen]);
  const currentCase = myCases.find((item) => item.slaStatus !== "COMPLETED") ?? myCases[0];
  const correctionCase = myCases.find((item) => item.correctionRequested) ?? myCases.find((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE");
  const completedCase = myCases.find((item) => item.slaStatus === "COMPLETED");
  const processingCount = myCases.filter((item) => item.slaStatus !== "COMPLETED").length;
  const completedCount = myCases.filter((item) => item.slaStatus === "COMPLETED").length;
  const pageMeta = TAB_META[activeTab];
  const filteredHistoryCases = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return myCases;

    return myCases.filter((item) => [
      item.caseNumber,
      item.allegation,
      item.electionType,
      item.constituency,
      item.district,
      item.province,
      item.respondent,
      getPublicStatus(item),
    ].join(" ").toLowerCase().includes(query));
  }, [myCases, search]);

  useEffect(() => {
    setEditedDetails(correctionCase?.details ?? "");
    setUploadedFileName(null);
    setCorrectionSubmittedSuccess(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [correctionCase?.id]);

  const handleSendCorrection = () => {
    if (!correctionCase) return;
    const finalDoc = uploadedFileName ?? "evidence_additional_docs.pdf";
    const updated: ComplaintItem = {
      ...correctionCase,
      details: editedDetails.trim() || correctionCase.details,
      correctionSubmitted: true,
      correctionSubmittedDate: new Date().toLocaleDateString("th-TH"),
      correctionDoc: finalDoc,
    };
    if (onUpdateCase) {
      onUpdateCase(updated);
    }
    appendAuditLog({
      userId: currentCitizen.id,
      userName: currentCitizen.name,
      userRole: "citizen",
      userRoleLabel: "ผู้ร้องเรียน",
      action: "CASE_CORRECTION_SUBMITTED",
      actionLabel: "ส่งข้อมูล/เอกสารเพิ่มเติมตามข้อ 26(2)",
      caseNumber: correctionCase.caseNumber,
      province: correctionCase.province,
      ipAddress: "-",
      status: "SUCCESS",
      details: `ผู้ร้องแก้ไข/เพิ่มเติมรายละเอียดพฤติการณ์ และแนบเอกสาร ${finalDoc}`,
    });
    setCorrectionSubmittedSuccess(true);
  };

  const handleSearchElection = () => {
    if (!electionSearch.province && !electionSearch.electionType && !electionSearch.startDate && !electionSearch.endDate) {
      setElectionResults(MOCK_ELECTION_RESULTS);
      return;
    }

    const typeNames: Record<string, string> = {
      "สส": "สมาชิกสภาผู้แทนราษฎร",
      "สว": "สมาชิกวุฒิสภา",
      "อบจ": "นายกองค์การบริหารส่วนจังหวัด",
      "อบต": "นายกองค์การบริหารส่วนตำบล",
      "เทศบาล": "นายกเทศมนตรี",
      "กทม": "ผู้ว่าราชการกรุงเทพมหานคร",
      "พัทยา": "นายกเมืองพัทยา",
      "ประชามติ": "การออกเสียงประชามติ"
    };

    const prov = electionSearch.province || "กรุงเทพมหานคร";
    const type = electionSearch.electionType || "สส";
    const typeLabel = typeNames[type] || "สมาชิกสภาผู้แทนราษฎร";
    const date = electionSearch.startDate || "2024-05-14";
    const yearTh = parseInt(date.split("-")[0]) + 543;
    
    const generatedResult = {
      id: "gen-1",
      date: date,
      province: prov,
      electionType: type,
      electionName: type === "ประชามติ" ? `การออกเสียงประชามติ ปี ${yearTh}` : `การเลือกตั้ง${typeLabel} ปี ${yearTh} (จ.${prov})`,
      status: "ประกาศผลแล้ว",
      voterCount: (Math.floor(Math.random() * 900000) + 100000).toLocaleString()
    };
    
    setElectionResults([generatedResult]);
  };

  return (
    <div className="space-y-6 pb-14">
      <nav className="flex items-center gap-2 text-[11px] text-slate-400" aria-label="เส้นทางหน้า">
        <button type="button" onClick={() => onTabChange("overview")} className="transition hover:text-[#1B3F8B]">หน้าหลัก</button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>บริการผู้ร้องเรียน</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-[#1B3F8B]">{pageMeta.title}</span>
      </nav>

      <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-[#1B3F8B]" /> บริการผู้ร้องเรียน</div>
            <h1 className="mt-2 text-xl font-bold text-[#1B3F8B] sm:text-2xl">{pageMeta.title}</h1>
            <p className="mt-1 text-xs leading-5 text-slate-500">{pageMeta.description}</p>
          </div>
          <button type="button" onClick={onOpenNewComplaint} className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#1B3F8B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-900"><FilePlus2 className="h-4 w-4 text-[#FFD600]" /> ยื่นคำร้องใหม่</button>
        </div>
      </section>

      {activeTab === "overview" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <CitizenMetric label="คำร้องทั้งหมด" value={String(myCases.length)} helper="ยื่นด้วยบัญชีนี้" tone="blue" />
              <CitizenMetric label="กำลังดำเนินการ" value={String(processingCount)} helper="ติดตามสถานะได้" tone="amber" />
              <CitizenMetric label="แล้วเสร็จ" value={String(completedCount)} helper="ดาวน์โหลดผลได้" tone="green" />
            </div>
            {currentCase ? <CurrentCaseCard caseItem={currentCase} onTrack={() => onTabChange("tracking")} /> : <EmptyState title="ยังไม่มีคำร้องในบัญชีนี้" description="เมื่อยื่นคำร้องสำเร็จ รายการและเลขอ้างอิงจะแสดงที่นี่" />}
          </section>
          <aside className="space-y-4">
            {correctionCase ? <button type="button" onClick={() => onTabChange("correction")} className="w-full rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left shadow-sm transition hover:border-amber-300">
              <div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><UploadCloud className="h-5 w-5" /></span><span className="rounded-full bg-rose-600 px-2.5 py-1 text-[9px] font-bold text-white">ต้องดำเนินการ</span></div>
              <h3 className="mt-4 text-sm font-bold text-amber-950">{correctionCase.caseNumber} ต้องตรวจสอบข้อมูล</h3>
              <p className="mt-2 text-xs leading-5 text-amber-800">กรุณาดำเนินการภายในกรอบเวลา {getSlaLabel(correctionCase)}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-amber-900">เปิดรายการแก้ไข <ChevronRight className="h-4 w-4" /></span>
            </button> : <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span><div><h3 className="text-xs font-bold text-slate-900">ไม่มีรายการที่ต้องแก้ไข</h3><p className="mt-1 text-[10px] text-slate-500">ข้อมูลคำร้องปัจจุบันครบถ้วน</p></div></div></div>}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900"><Bell className="h-4 w-4 text-blue-700" /> การแจ้งเตือนล่าสุด</h3>
              <div className="mt-4 space-y-4 text-[11px] text-slate-600">{currentCase ? <Notification text={`${currentCase.caseNumber} อยู่ในขั้น ${getPublicStatus(currentCase)}`} time="อัปเดตล่าสุดวันนี้" /> : <Notification text="ยังไม่มีการแจ้งเตือน" time="-" />}</div>
            </div>
          </aside>
        </div>
      )}

      {activeTab === "tracking" && currentCase && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] font-bold uppercase tracking-wider text-blue-700">เลขที่อ้างอิง</div><h2 className="mt-1 text-xl font-bold text-slate-950">{currentCase.caseNumber}</h2><p className="mt-1 text-xs text-slate-500">{currentCase.allegation} · จ.{currentCase.province}</p></div><span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-800 ring-1 ring-blue-200">{getPublicStatus(currentCase)}</span></div>
          <div className="mt-6 space-y-0">
            {WORKFLOW_STEPS.map((step, index) => {
              const isDone = step.id < currentCase.stageId || currentCase.slaStatus === "COMPLETED";
              const isCurrent = step.id === currentCase.stageId && currentCase.slaStatus !== "COMPLETED";
              return <div key={step.id} className="grid grid-cols-[40px_1fr_auto] gap-3"><div className="flex flex-col items-center"><span className={`flex h-8 w-8 items-center justify-center rounded-full ${isDone ? "bg-emerald-600 text-white" : isCurrent ? "bg-blue-700 text-white ring-4 ring-blue-100" : "bg-slate-100 text-slate-400"}`}>{isDone ? <Check className="h-4 w-4" /> : step.id}</span>{index < WORKFLOW_STEPS.length - 1 && <span className={`h-16 w-0.5 ${isDone ? "bg-emerald-300" : "bg-slate-200"}`} />}</div><div className="pb-7"><div className={`text-xs font-bold ${isCurrent ? "text-blue-900" : "text-slate-800"}`}>{step.publicTitle}</div><p className="mt-1 text-[11px] leading-5 text-slate-500">{isCurrent ? "อยู่ระหว่างดำเนินการในขั้นตอนนี้" : step.section}</p></div><span className="mt-0.5 h-fit rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">{isCurrent ? getSlaLabel(currentCase) : step.slaLabel}</span></div>;
            })}
          </div>
          <div className="rounded-xl bg-slate-50 p-4 text-[11px] leading-5 text-slate-500"><strong className="text-slate-700">หมายเหตุความเป็นส่วนตัว:</strong> ผู้ร้องจะเห็นเฉพาะสถานะภาพรวม วันครบกำหนด และผลที่เปิดเผยได้ โดยไม่แสดงความเห็นภายในหรือข้อมูลการทำงานของเจ้าหน้าที่แต่ละลำดับชั้น</div>
        </section>
      )}

      {activeTab === "correction" && (
        correctionCase ? <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">แจ้งตามข้อ 26(2)</span><h2 className="mt-3 text-lg font-bold text-slate-950">รายการที่ต้องแก้ไข/เพิ่มเติม</h2><p className="mt-1 text-xs text-slate-500">คำร้อง {correctionCase.caseNumber}</p></div><div className="rounded-xl bg-rose-50 px-4 py-3 text-center text-rose-700 ring-1 ring-rose-200"><div className="text-lg font-bold">{getSlaLabel(correctionCase)}</div><div className="text-[9px] font-bold uppercase">กรอบเวลาปัจจุบัน</div></div></div>
            <div className="mt-6 space-y-3">
              <CorrectionItem done title="สำเนาบัตรประชาชน" detail="ตรวจสอบผ่าน DXC แล้ว" />

              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${uploadedFileName ? "bg-emerald-600 text-white" : "bg-white text-amber-700 ring-1 ring-amber-300"}`}>{uploadedFileName ? <Check className="h-4 w-4" /> : <Paperclip className="h-3.5 w-3.5" />}</span>
                <label className="flex-1">
                  <span className="block text-xs font-bold text-slate-900">หลักฐานการอยู่อาศัยในเขตเลือกตั้ง</span>
                  <span className="mt-1 block text-[10px] leading-5 text-slate-600">{uploadedFileName ?? "กรุณาแนบเอกสารที่ออกไม่เกิน 90 วัน (PDF/JPG)"}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="mt-2 block w-full text-[10px] text-slate-500"
                    onChange={(event) => setUploadedFileName(event.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>

              <div className="rounded-xl border border-amber-200 bg-white p-3">
                <label className="mb-1.5 block text-xs font-bold text-slate-900" htmlFor="correction-details">แก้ไข/เพิ่มเติมรายละเอียดพฤติการณ์</label>
                <textarea
                  id="correction-details"
                  rows={4}
                  value={editedDetails}
                  onChange={(event) => setEditedDetails(event.target.value)}
                  placeholder="ระบุแหล่งที่มาของไฟล์วิดีโอหลักฐาน หรือข้อเท็จจริงเพิ่มเติม..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            {correctionSubmittedSuccess ? (
              <div className="mt-5 rounded-xl bg-emerald-100 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2">
                <Check className="h-4 w-4" /> ส่งข้อมูลและเอกสารเพิ่มเติมให้ สนง.กกต.จว. เรียบร้อยแล้ว เจ้าหน้าที่จะทำการตรวจสอบในขั้นตอนถัดไป
              </div>
            ) : (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleSendCorrection}
                  disabled={!uploadedFileName}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <UploadCloud className="h-4 w-4" /> ส่งข้อมูลเพิ่มเติม
                </button>
              </div>
            )}
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-[#1B3F8B] p-5 text-white shadow-sm"><h3 className="text-sm font-bold">ต้องการบันทึกถ้อยคำ?</h3><p className="mt-2 text-xs leading-6 text-slate-400">สามารถนัดหมายเจ้าหน้าที่ สนง.กกต.จว. เพื่อบันทึกถ้อยคำประกอบคำร้องแทนการอัปโหลดได้</p><button type="button" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 text-xs font-bold hover:bg-white/15"><CalendarDays className="h-4 w-4 text-amber-300" /> นัดหมายเจ้าหน้าที่</button></aside>
        </section> : <EmptyState title="ไม่มีคำร้องที่ต้องแก้ไขหรือเพิ่มเติม" description="ระบบจะแจ้งเตือนและแสดงรายการในหน้านี้เมื่อเจ้าหน้าที่ขอข้อมูลเพิ่มเติม" />
      )}

      {activeTab === "result" && (
        completedCase ? <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><FileCheck2 className="h-6 w-6" /></span><div><div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">{completedCase.caseNumber}</div><h2 className="mt-1 text-lg font-bold text-slate-950">ดำเนินการเรื่องร้องเรียนแล้วเสร็จ</h2><p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">ผลการพิจารณาและเอกสารที่เปิดเผยได้จะแสดงสำหรับผู้ร้องโดยไม่เปิดเผยความเห็นภายในของเจ้าหน้าที่</p></div></div><span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200">เสร็จสิ้น</span></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><DocumentDownload title="หนังสือแจ้งผลการสั่งรับคำร้อง" meta="PDF · 1.2 MB" /><DocumentDownload title="ใบรับคำร้องอิเล็กทรอนิกส์" meta="PDF · 420 KB" /></div>
        </section> : <EmptyState title="ยังไม่มีผลการพิจารณาที่เผยแพร่" description="เมื่อเรื่องดำเนินการแล้วเสร็จ หนังสือแจ้งผลและเอกสารที่ดาวน์โหลดได้จะแสดงที่นี่" />
      )}

      {activeTab === "history" && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-950">ประวัติคำร้องทั้งหมดของฉัน</h2>
              <p className="mt-1 text-[10px] text-slate-500">ข้อมูลคำร้องที่ยื่นด้วยบัญชีนี้ และสถานะที่เปิดเผยแก่ผู้ร้อง</p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              <label className="relative">
                <span className="sr-only">ค้นหาประวัติคำร้อง</span>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหาเลขคำร้องหรือประเภท" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:w-64" />
              </label>
              <div className="text-[10px] text-slate-500">พบ <strong className="text-slate-900">{filteredHistoryCases.length}</strong> จาก {myCases.length} เรื่อง</div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {filteredHistoryCases.length === 0 ? <div className="py-14 text-center text-xs text-slate-400">ไม่พบข้อมูลที่ตรงกับคำค้นหา</div> : filteredHistoryCases.map((caseItem) => (
              <button key={caseItem.id} type="button" onClick={() => onSelectCase(caseItem)} className="w-full p-4 text-left transition hover:bg-blue-50/40">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="font-bold text-[#1B3F8B]">{caseItem.caseNumber}</div><div className="mt-1 text-[10px] text-slate-500">{caseItem.electionType} · ยื่นเมื่อ {formatThaiDate(caseItem.receivedDate)}</div></div>
                  <CitizenHistoryStatus caseItem={caseItem} />
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-800">{caseItem.allegation}</div>
                <div className="mt-2 line-clamp-1 text-[10px] text-slate-500">ผู้ถูกร้อง: {caseItem.respondent}</div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px]"><span className="text-slate-500">{caseItem.province} · {caseItem.currentStage}</span><span className="font-bold text-[#1B3F8B]">ดูรายละเอียด</span></div>
              </button>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1380px] text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 text-[10px] font-bold text-slate-600">
                <tr>
                  <th className="whitespace-nowrap border-b border-slate-200 px-3 py-3.5">ลำดับ</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">เลขที่เรื่องร้องเรียน</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">วันที่ยื่นคำร้อง</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">ประเภทการเลือกตั้ง</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">เขตเลือกตั้ง</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">อำเภอ</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">จังหวัด</th>
                  <th className="border-b border-slate-200 px-4 py-3.5">ชื่อผู้ถูกร้อง</th>
                  <th className="border-b border-slate-200 px-4 py-3.5">ข้อกล่าวหา</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">สถานะปัจจุบัน</th>
                  <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">สถานะ Timeline ล่าสุด</th>
                  <th className="border-b border-slate-200 px-4 py-3.5 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistoryCases.length === 0 ? <tr><td colSpan={12} className="py-14 text-center text-slate-400">ไม่พบข้อมูลที่ตรงกับคำค้นหา</td></tr> : filteredHistoryCases.map((caseItem, index) => (
                  <tr key={caseItem.id} onClick={() => onSelectCase(caseItem)} className="cursor-pointer align-top transition hover:bg-blue-50/40">
                    <td className="px-3 py-4 text-slate-400">{index + 1}</td>
                    <td className="px-4 py-4"><div className="font-bold text-[#1B3F8B]">{caseItem.caseNumber}</div><div className="mt-1 text-[10px] text-slate-500">คำร้องของฉัน</div></td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatThaiDate(caseItem.receivedDate)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.electionType}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.constituency}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.district}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.province}</td>
                    <td className="max-w-44 px-4 py-4"><div className="line-clamp-2 leading-5 text-slate-700">{caseItem.respondent}</div></td>
                    <td className="max-w-64 px-4 py-4"><div className="line-clamp-2 leading-5 text-slate-700">{caseItem.allegation}</div></td>
                    <td className="whitespace-nowrap px-4 py-4"><CitizenHistoryStatus caseItem={caseItem} /></td>
                    <td className="max-w-56 px-4 py-4 text-slate-700">{caseItem.currentStage}</td>
                    <td className="px-4 py-4 text-center"><button type="button" onClick={(event) => { event.stopPropagation(); onSelectCase(caseItem); }} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-[#1B3F8B] transition hover:border-[#1B3F8B] hover:bg-blue-50" aria-label={`เปิดคำร้อง ${caseItem.caseNumber}`}><Eye className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "profile" && (
        <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><UserRound className="h-5 w-5 text-blue-700" /> ข้อมูลส่วนตัวและสิทธิ์การยื่น</h2><div className="mt-5 grid gap-4 sm:grid-cols-2"><ProfileField label="ชื่อ-นามสกุล" value={currentCitizen.name} /><ProfileField label="เลขประจำตัวประชาชน" value={currentCitizen.citizenIdMasked} /><ProfileField label="สถานะผู้ใช้" value="ผู้มีสิทธิเลือกตั้งในเขต" /><ProfileField label="เขตเลือกตั้ง" value={`${currentCitizen.province} ${currentCitizen.constituency}`} /><ProfileField label="เบอร์โทรศัพท์" value={currentCitizen.phoneMasked} /><ProfileField label="อีเมล" value={currentCitizen.emailMasked} /></div></div>
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="flex items-center gap-2 text-xs font-bold text-slate-900"><Settings2 className="h-4 w-4 text-blue-700" /> ช่องทางแจ้งเตือน</h3><div className="mt-4 space-y-3"><Toggle label="แจ้งเตือนผ่านแอป" enabled /><Toggle label="อีเมล" enabled /><Toggle label="SMS" enabled={false} /></div><div className="mt-5 rounded-xl bg-blue-50 p-3 text-[10px] leading-5 text-blue-800">ยืนยันตัวตนผ่าน {currentCitizen.verifiedVia} หากต้องการแก้ไขข้อมูลหลัก กรุณาติดต่อหน่วยงานต้นทาง</div></aside>
        </section>
      )}

      {activeTab === "search_election" && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Search className="h-5 w-5 text-[#1B3F8B]" /> ค้นหาข้อมูลการเลือกตั้ง
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_1fr_1fr_auto] md:items-end">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-700 uppercase tracking-wide">ตั้งแต่ (วัน/เดือน/ปี)</label>
                <input type="date" value={electionSearch.startDate} onChange={e => setElectionSearch({ ...electionSearch, startDate: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-700 uppercase tracking-wide">ถึง (วัน/เดือน/ปี)</label>
                <input type="date" value={electionSearch.endDate} onChange={e => setElectionSearch({ ...electionSearch, endDate: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-700 uppercase tracking-wide">จังหวัด</label>
                <select value={electionSearch.province} onChange={e => setElectionSearch({ ...electionSearch, province: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="">ทั้งหมด</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="ขอนแก่น">ขอนแก่น</option>
                  <option value="ภูเก็ต">ภูเก็ต</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-700 uppercase tracking-wide">ประเภทเลือกตั้ง</label>
                <select value={electionSearch.electionType} onChange={e => setElectionSearch({ ...electionSearch, electionType: e.target.value })} className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="">ทั้งหมด</option>
                  <option value="สส">ส.ส.</option>
                  <option value="สว">ส.ว.</option>
                  <option value="อบจ">อบจ.</option>
                  <option value="อบต">อบต.</option>
                  <option value="เทศบาล">เทศบาล</option>
                  <option value="กทม">กทม.</option>
                  <option value="พัทยา">เมืองพัทยา</option>
                  <option value="ประชามติ">ประชามติ</option>
                </select>
              </div>
              <button type="button" onClick={handleSearchElection} className="flex h-10 w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-[#1B3F8B] px-6 text-xs font-semibold text-white transition hover:bg-blue-900">
                ค้นหา
              </button>
            </div>
          </div>

          {electionResults !== null && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">ผลการค้นหา ({electionResults.length} รายการ)</h3>
              {electionResults.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-400"><Search className="h-5 w-5" /></span>
                  <p className="mt-3 text-xs text-slate-500">ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {electionResults.map((result) => (
                    <div key={result.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/50 grid sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="font-bold text-[#1B3F8B] text-sm mb-1">{result.electionName}</div>
                        <div className="text-slate-500 mt-2">เลือกตั้งประเภท {result.electionType} จ.{result.province}</div>
                        <div className="text-slate-500">จำนวนผู้มาใช้สิทธิ: {result.voterCount} คน</div>
                      </div>
                      <div className="sm:text-right">
                        <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${result.status === "ประกาศผลแล้ว" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                          {result.status}
                        </span>
                        <div className="text-slate-500 mt-2">วันที่จัดการเลือกตั้ง: {result.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function CitizenHistoryStatus({ caseItem }: { caseItem: ComplaintItem }) {
  const className = caseItem.slaStatus === "OVERDUE"
    ? "bg-rose-100 text-rose-700"
    : caseItem.slaStatus === "NEAR_DUE"
      ? "bg-amber-100 text-amber-800"
      : caseItem.slaStatus === "COMPLETED"
        ? "bg-slate-100 text-slate-700"
        : "bg-emerald-100 text-emerald-800";

  return <span className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${className}`}>{getPublicStatus(caseItem)}</span>;
}

function CurrentCaseCard({ caseItem, onTrack }: { caseItem: ComplaintItem; onTrack: () => void }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-800 ring-1 ring-blue-200">{getPublicStatus(caseItem)}</span><h3 className="mt-3 text-lg font-bold text-slate-950">{caseItem.caseNumber}</h3><p className="mt-1 text-xs text-slate-500">{caseItem.allegation} · จ.{caseItem.province}</p></div><div className="rounded-xl bg-amber-50 px-4 py-3 text-center text-amber-800"><div className="text-lg font-bold">{getSlaLabel(caseItem)}</div><div className="text-[9px] font-bold uppercase">กรอบเวลาปัจจุบัน</div></div></div><div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3"><div><div className="text-[9px] font-bold uppercase text-slate-400">ขั้นตอน</div><div className="mt-1 text-xs font-bold text-slate-800">{getPublicStatus(caseItem)}</div></div><div><div className="text-[9px] font-bold uppercase text-slate-400">วันที่ยื่น</div><div className="mt-1 text-xs font-bold text-slate-800">{formatThaiDate(caseItem.receivedDate)}</div></div><div><div className="text-[9px] font-bold uppercase text-slate-400">สถานที่ยื่น</div><div className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-800"><MapPin className="h-3.5 w-3.5" /> สนง.กกต.จว.</div></div></div><button type="button" onClick={onTrack} className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-700">ดู Timeline แบบละเอียด <ChevronRight className="h-4 w-4" /></button></article>;
}

function CitizenMetric({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: "blue" | "amber" | "green" }) { const tones = { blue: "bg-[#1B3F8B]", amber: "bg-[#FFD600]", green: "bg-emerald-500" }; return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500"><span className={`h-2 w-2 rounded-full ${tones[tone]}`} />{label}</div><div className="mt-2 text-2xl font-bold text-slate-900">{value}</div><div className="mt-1 text-[10px] text-slate-400">{helper}</div></div>; }
function Notification({ text, time }: { text: string; time: string }) { return <div className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" /><div><div className="leading-5">{text}</div><div className="mt-1 text-[9px] text-slate-400">{time}</div></div></div>; }
function EmptyState({ title, description }: { title: string; description: string }) { return <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400"><FileText className="h-5 w-5" /></span><h2 className="mt-4 text-sm font-bold text-slate-800">{title}</h2><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">{description}</p></section>; }
function CorrectionItem({ title, detail, done = false }: { title: string; detail: string; done?: boolean }) { return <div className={`flex items-start gap-3 rounded-xl border p-3 ${done ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-600 text-white" : "bg-white text-amber-700 ring-1 ring-amber-300"}`}>{done ? <Check className="h-4 w-4" /> : <Paperclip className="h-3.5 w-3.5" />}</span><div><div className="text-xs font-bold text-slate-900">{title}</div><div className="mt-1 text-[10px] leading-5 text-slate-600">{detail}</div></div></div>; }
function DocumentDownload({ title, meta }: { title: string; meta: string }) { return <button type="button" className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><FileText className="h-4 w-4" /></span><div><div className="text-xs font-bold text-slate-900">{title}</div><div className="mt-1 text-[10px] text-slate-400">{meta}</div></div></div><Download className="h-4 w-4 text-blue-700" /></button>; }
function ProfileField({ label, value }: { label: string; value: string }) { return <div><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-800">{value}</div></div>; }
function Toggle({ label, enabled }: { label: string; enabled: boolean }) { return <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><span className="text-xs font-semibold text-slate-700">{label}</span><span className={`flex h-6 w-11 items-center rounded-full p-1 ${enabled ? "justify-end bg-blue-700" : "justify-start bg-slate-300"}`}><span className="h-4 w-4 rounded-full bg-white shadow-sm" /></span></div>; }
