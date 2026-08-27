"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, FileSpreadsheet, Plus, Search } from "lucide-react";
import { MISSION_GROUP_OPTIONS, formatThaiDate, getCaseKind, getSlaLabel, getStatusLabel, getWorkflowStep, type ComplaintItem } from "@/components/oect/complaintDomain";
import ElectionTypeCardMenu from "@/components/oect/ElectionTypeCardMenu";

interface CaseListViewProps {
  cases: ComplaintItem[];
  onSelectCase: (caseItem: ComplaintItem) => void;
  openNewModal: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  statusFilter?: string;
  setStatusFilter?: (status: string) => void;
}

const STATUS_TABS = [
  { id: "ALL", label: "ทั้งหมด" },
  { id: "NEW", label: "ข้อมูลเข้าใหม่" },
  { id: "NORMAL", label: "ปกติ" },
  { id: "NEAR_DUE", label: "ใกล้ครบกำหนด" },
  { id: "OVERDUE", label: "เกินกำหนด" },
  { id: "COMPLETED", label: "เสร็จสิ้น" },
];

export default function CaseListView({
  cases,
  onSelectCase,
  openNewModal,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  statusFilter: externalStatusFilter,
  setStatusFilter: externalSetStatusFilter,
}: CaseListViewProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [internalStatusFilter, setInternalStatusFilter] = useState("ALL");
  const [selectedProvince, setSelectedProvince] = useState("ALL");
  const [selectedMission, setSelectedMission] = useState("ALL");
  const [selectedElectionType, setSelectedElectionType] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery ?? setInternalSearchQuery;
  const selectedStatus = externalStatusFilter ?? internalStatusFilter;
  const setSelectedStatus = externalSetStatusFilter ?? setInternalStatusFilter;

  const filteredCases = useMemo(() => cases.filter((caseItem) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const searchTarget = [
        caseItem.caseNumber,
        caseItem.province,
        caseItem.district,
        caseItem.complainants,
        caseItem.respondent,
        caseItem.allegation,
        caseItem.officer,
      ].join(" ").toLowerCase();
      if (!searchTarget.includes(query)) return false;
    }
    if (selectedStatus === "NEW" && caseItem.stageId !== 1) return false;
    if (selectedStatus !== "ALL" && selectedStatus !== "NEW" && caseItem.slaStatus !== selectedStatus) return false;
    if (selectedProvince !== "ALL" && caseItem.province !== selectedProvince) return false;
    if (selectedMission !== "ALL" && caseItem.missionGroup !== selectedMission) return false;
    if (selectedElectionType !== "ALL" && caseItem.electionType !== selectedElectionType) return false;
    return true;
  }), [cases, searchQuery, selectedElectionType, selectedMission, selectedProvince, selectedStatus]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const effectivePage = Math.min(currentPage, totalPages);
  const pageStart = (effectivePage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(pageStart, pageStart + itemsPerPage);
  const provinceList = useMemo(() => Array.from(new Set(cases.map((caseItem) => caseItem.province))).sort(), [cases]);

  const statusCount = (status: string) => {
    if (status === "ALL") return cases.length;
    if (status === "NEW") return cases.filter((caseItem) => caseItem.stageId === 1).length;
    return cases.filter((caseItem) => caseItem.slaStatus === status).length;
  };

  return (
    <div className="space-y-5 pb-14">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <label className="relative w-full max-w-lg">
            <span className="sr-only">ค้นหาเรื่องร้องเรียน</span>
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="ค้นหาเลขที่เรื่อง ผู้ร้อง ผู้ถูกร้อง ข้อกล่าวหา หรือจังหวัด"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button type="button" onClick={() => alert("เตรียมส่งออกข้อมูลตามตัวกรองเป็นไฟล์ Excel (.xlsx)")} className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"><FileSpreadsheet className="h-4 w-4 text-emerald-600" /> ส่งออก Excel</button>
            <button type="button" onClick={openNewModal} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1B3F8B] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1B3F8B]"><Plus className="h-4 w-4" /> บันทึกเรื่องใหม่</button>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedStatus(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${selectedStatus === tab.id ? "bg-blue-800 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
              >
                {tab.label}<span className={`rounded-full px-1.5 py-0.5 text-[9px] ${selectedStatus === tab.id ? "bg-white/20" : "bg-slate-200"}`}>{statusCount(tab.id)}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <select value={selectedProvince} onChange={(event) => { setSelectedProvince(event.target.value); setCurrentPage(1); }} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs outline-none">
              <option value="ALL">ทุกจังหวัด</option>
              {provinceList.map((province) => <option key={province} value={province}>{province}</option>)}
            </select>
            <select value={selectedMission} onChange={(event) => { setSelectedMission(event.target.value); setCurrentPage(1); }} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs outline-none">
              <option value="ALL">ทุกกลุ่มภารกิจ</option>
              {MISSION_GROUP_OPTIONS.map((mission) => <option key={mission} value={mission}>{mission}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <ElectionTypeCardMenu cases={cases} value={selectedElectionType} onChange={(value) => { setSelectedElectionType(value); setCurrentPage(1); }} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-950">รายการเรื่องร้องเรียน</h2>
            <p className="mt-1 text-[10px] text-slate-500">ข้อมูลหลักจากชุด POC เดียวกับ Dashboard, SLA และรายละเอียดสำนวน</p>
          </div>
          <div className="text-[10px] text-slate-500">พบ <strong className="text-slate-900">{filteredCases.length}</strong> จาก {cases.length} เรื่อง</div>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {paginatedCases.length === 0 ? <div className="py-14 text-center text-xs text-slate-400">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</div> : paginatedCases.map((caseItem) => (
            <button key={caseItem.id} type="button" onClick={() => onSelectCase(caseItem)} className="w-full p-4 text-left transition hover:bg-blue-50/40">
              <div className="flex items-start justify-between gap-3"><div><div className="font-bold text-[#1B3F8B]">{caseItem.caseNumber}</div><div className="mt-1 text-[10px] text-slate-500">{getCaseKind(caseItem)} · {caseItem.electionType} · รับเมื่อ {formatThaiDate(caseItem.receivedDate)}</div></div><SlaBadge caseItem={caseItem} /></div>
              <div className="mt-3 text-xs font-semibold text-slate-800">{caseItem.allegation}</div>
              <div className="mt-2 line-clamp-1 text-[10px] text-slate-500">ผู้ร้อง: {caseItem.complainants}</div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px]"><span className="text-slate-500">{caseItem.province} · {caseItem.currentStage}</span><span className="font-bold text-[#1B3F8B]">ดูรายละเอียด</span></div>
            </button>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1720px] text-left text-xs">
            <thead className="sticky top-0 bg-slate-50 text-[10px] font-bold text-slate-600">
              <tr>
                <th className="whitespace-nowrap border-b border-slate-200 px-3 py-3.5">ลำดับ</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">เลขที่เรื่องร้องเรียน</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">วันที่รับเรื่อง</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">ประเภทการเลือกตั้ง</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">เขตเลือกตั้ง</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">อำเภอ</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">จังหวัด</th>
                <th className="border-b border-slate-200 px-4 py-3.5">ชื่อผู้ร้อง</th>
                <th className="border-b border-slate-200 px-4 py-3.5">ชื่อผู้ถูกร้อง</th>
                <th className="border-b border-slate-200 px-4 py-3.5">ข้อกล่าวหา</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">สถานะปัจจุบัน</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">สถานะ Timeline ล่าสุด</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">ระยะเวลาดำเนินงาน Timeline ล่าสุด</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">เหลืออีกกี่วัน</th>
                <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3.5">ผู้รับผิดชอบ</th>
                <th className="border-b border-slate-200 px-4 py-3.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr><td colSpan={16} className="py-14 text-center text-slate-400">ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา</td></tr>
              ) : paginatedCases.map((caseItem, index) => (
                <tr key={caseItem.id} onClick={() => onSelectCase(caseItem)} className="cursor-pointer align-top transition hover:bg-blue-50/40">
                  <td className="px-3 py-4 text-slate-400">{pageStart + index + 1}</td>
                  <td className="px-4 py-4"><div className="font-bold text-[#1B3F8B]">{caseItem.caseNumber}</div><div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500"><span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold">{getCaseKind(caseItem)}</span></div></td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatThaiDate(caseItem.receivedDate)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.electionType}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.constituency}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.district}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700">{caseItem.province}</td>
                  <td className="max-w-44 px-4 py-4"><div className="line-clamp-2 leading-5 text-slate-700">{caseItem.complainants}</div></td>
                  <td className="max-w-44 px-4 py-4"><div className="line-clamp-2 leading-5 text-slate-700">{caseItem.respondent}</div></td>
                  <td className="max-w-64 px-4 py-4"><div className="line-clamp-2 leading-5 text-slate-700">{caseItem.allegation}</div></td>
                  <td className="whitespace-nowrap px-4 py-4"><StatusBadge caseItem={caseItem} /></td>
                  <td className="max-w-56 px-4 py-4 text-slate-700">{caseItem.currentStage}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-500">{getWorkflowStep(caseItem.stageId).slaLabel}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">{getSlaLabel(caseItem)}</td>
                  <td className="max-w-40 px-4 py-4"><div className="text-slate-700">{caseItem.officer}</div><div className="mt-1 text-[9px] text-slate-400">{caseItem.currentSection}</div></td>
                  <td className="px-4 py-4 text-center"><button type="button" onClick={(event) => { event.stopPropagation(); onSelectCase(caseItem); }} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-[#1B3F8B] transition hover:border-[#1B3F8B] hover:bg-blue-50" aria-label={`เปิดเรื่อง ${caseItem.caseNumber}`}><Eye className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 p-4 text-xs text-slate-500 sm:flex-row">
          <div>แสดง <strong className="text-slate-900">{filteredCases.length ? pageStart + 1 : 0}</strong> ถึง <strong className="text-slate-900">{Math.min(pageStart + itemsPerPage, filteredCases.length)}</strong> จาก <strong className="text-slate-900">{filteredCases.length}</strong> รายการ</div>
          <div className="flex items-center gap-1.5"><button type="button" onClick={() => setCurrentPage((page) => Math.max(1, Math.min(page, totalPages) - 1))} disabled={effectivePage === 1} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-800">หน้า {effectivePage} / {totalPages}</span><button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={effectivePage === totalPages} className="rounded-lg border border-slate-200 p-1.5 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div>
        </div>
      </section>
    </div>
  );
}

function SlaBadge({ caseItem }: { caseItem: ComplaintItem }) {
  const config = caseItem.slaStatus === "OVERDUE"
    ? { className: "bg-rose-100 text-rose-700" }
    : caseItem.slaStatus === "NEAR_DUE"
      ? { className: "bg-amber-100 text-amber-800" }
      : caseItem.slaStatus === "COMPLETED"
        ? { className: "bg-slate-100 text-slate-700" }
        : { className: "bg-emerald-100 text-emerald-800" };

  return <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-bold ${config.className}`}>{getSlaLabel(caseItem)}</span>;
}

function StatusBadge({ caseItem }: { caseItem: ComplaintItem }) {
  const config = caseItem.slaStatus === "OVERDUE"
    ? { className: "bg-rose-100 text-rose-700" }
    : caseItem.slaStatus === "NEAR_DUE"
      ? { className: "bg-amber-100 text-amber-800" }
      : caseItem.slaStatus === "COMPLETED"
        ? { className: "bg-slate-100 text-slate-700" }
        : { className: "bg-emerald-100 text-emerald-800" };

  return <span className={`inline-flex rounded-full px-2 py-1 text-[9px] font-bold ${config.className}`}>{getStatusLabel(caseItem.slaStatus)}</span>;
}
