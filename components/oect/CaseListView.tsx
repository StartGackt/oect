"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  ArrowUpDown,
  ShieldCheck,
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

interface CaseListViewProps {
  cases: ComplaintItem[];
  onSelectCase: (c: ComplaintItem) => void;
  openNewModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export default function CaseListView({
  cases,
  onSelectCase,
  openNewModal,
  searchQuery,
  setSearchQuery,
}: CaseListViewProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProvince, setSelectedProvince] = useState<string>("ALL");
  const [selectedMission, setSelectedMission] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 15;

  // Filter cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Global search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.caseNumber.toLowerCase().includes(q) ||
          c.province.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.complainants.toLowerCase().includes(q) ||
          c.respondent.toLowerCase().includes(q) ||
          c.allegation.toLowerCase().includes(q) ||
          c.officer.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Status filter
      if (selectedStatus !== "ALL" && c.slaStatus !== selectedStatus) return false;

      // Province filter
      if (selectedProvince !== "ALL" && c.province !== selectedProvince) return false;

      // Mission filter
      if (selectedMission !== "ALL" && c.missionGroup !== selectedMission) return false;

      return true;
    });
  }, [cases, searchQuery, selectedStatus, selectedProvince, selectedMission]);

  // Pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCases.slice(start, start + itemsPerPage);
  }, [filteredCases, currentPage]);

  // Province list
  const provinceList = useMemo(() => {
    const set = new Set(cases.map((c) => c.province));
    return Array.from(set).sort();
  }, [cases]);

  return (
    <div className="space-y-5 pb-14">
      
      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        
        {/* Row 1: Search & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#A0AEC0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาเลขที่เรื่อง, ผู้ร้อง, ผู้ถูกร้อง, ข้อกล่าวหา, จังหวัด..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#1E4E8C] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => alert("ระบบกำลังส่งออกข้อมูลเป็นไฟล์ Excel (.xlsx)")}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#F7FAFC] border border-[#E2E8F0] hover:bg-[#EDF2F7] rounded-xl text-xs text-[#2D3748] font-medium transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>ส่งออก Excel</span>
            </button>

            <button
              onClick={openNewModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#173B6B] hover:bg-[#0B1E36] text-white rounded-xl text-xs font-medium transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ บันทึกเรื่องร้องเรียนใหม่</span>
            </button>
          </div>
        </div>

        {/* Row 2: Filter Pills & Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EDF2F7]">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: "ALL", label: "ทั้งหมด", count: cases.length },
              { id: "NORMAL", label: "🟢 ในเกณฑ์ปกติ", count: cases.filter((c) => c.slaStatus === "NORMAL").length },
              { id: "NEAR_DUE", label: "🟡 ใกล้ครบกำหนด", count: cases.filter((c) => c.slaStatus === "NEAR_DUE").length },
              { id: "OVERDUE", label: "🔴 เกินกำหนด", count: cases.filter((c) => c.slaStatus === "OVERDUE").length },
              { id: "COMPLETED", label: "⚪ เสร็จสิ้น", count: cases.filter((c) => c.slaStatus === "COMPLETED").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedStatus(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? "bg-[#1E4E8C] text-white shadow-2xs"
                    : "bg-[#F7FAFC] text-[#4A5568] hover:bg-[#EDF2F7]"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedStatus === tab.id ? "bg-white/20 text-white" : "bg-[#E2E8F0] text-[#4A5568]"}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">เลือกจังหวัด (ทั้งหมด)</option>
              {provinceList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={selectedMission}
              onChange={(e) => {
                setSelectedMission(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="ALL">กลุ่มภารกิจ (ทั้งหมด)</option>
              <option value="สืบสวนและไต่สวน">สืบสวนและไต่สวน</option>
              <option value="พรรคการเมือง">พรรคการเมือง</option>
              <option value="การจัดการเลือกตั้ง">การจัดการเลือกตั้ง</option>
              <option value="บริหารทั่วไป">บริหารทั่วไป</option>
              <option value="กระบวนการยุติธรรม">กระบวนการยุติธรรม</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Cases Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAFC] text-[#4A5568] border-b border-[#E2E8F0] font-medium">
              <tr>
                <th className="py-3.5 px-4 font-semibold">เลขที่เรื่องร้องเรียน</th>
                <th className="py-3.5 px-3 font-semibold">วันที่รับเรื่อง</th>
                <th className="py-3.5 px-3 font-semibold">พื้นที่ / เขตเลือกตั้ง</th>
                <th className="py-3.5 px-3 font-semibold">ข้อกล่าวหา</th>
                <th className="py-3.5 px-3 font-semibold">ผู้ร้อง / ผู้ถูกร้อง</th>
                <th className="py-3.5 px-3 font-semibold">ขั้นตอน Workflow ปัจจุบัน</th>
                <th className="py-3.5 px-3 font-semibold text-center">สถานะ SLA</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EDF2F7]">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A0AEC0]">
                    ไม่พบข้อมูลเรื่องร้องเรียนที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase(c)}
                    className="hover:bg-[#F7FAFC] transition-colors cursor-pointer group"
                  >
                    {/* Case Number & Type */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#0B1E36] group-hover:text-[#1E4E8C] transition-colors">
                        {c.caseNumber}
                      </div>
                      <div className="text-[10px] text-[#718096] flex items-center gap-1 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-[#EDF2F7] text-[#4A5568]">{c.electionType}</span>
                        <span>·</span>
                        <span>{c.missionGroup}</span>
                      </div>
                    </td>

                    {/* Received Date */}
                    <td className="py-3.5 px-3 text-[#4A5568]">
                      {c.receivedDate}
                    </td>

                    {/* Province / Constituency */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#2D3748]">จ.{c.province}</div>
                      <div className="text-[11px] text-[#718096]">{c.constituency} ({c.district})</div>
                    </td>

                    {/* Allegation */}
                    <td className="py-3.5 px-3 max-w-[200px]">
                      <div className="font-medium text-[#1A202C] truncate" title={c.allegation}>
                        {c.allegation}
                      </div>
                      <div className="text-[10px] text-[#718096] truncate" title={c.details}>
                        {c.details}
                      </div>
                    </td>

                    {/* Complainant & Respondent */}
                    <td className="py-3.5 px-3 max-w-[180px]">
                      <div className="text-[#2D3748] truncate" title={c.complainants}>
                        <strong className="text-[10px] text-[#718096]">ผู้ร้อง:</strong> {c.complainants}
                      </div>
                      <div className="text-[#2D3748] truncate" title={c.respondent}>
                        <strong className="text-[10px] text-[#718096]">ผู้ถูกร้อง:</strong> {c.respondent}
                      </div>
                    </td>

                    {/* Current Stage */}
                    <td className="py-3.5 px-3">
                      <div className="text-[11px] font-medium text-[#1E4E8C] line-clamp-1">
                        {c.currentStage}
                      </div>
                      <div className="text-[10px] text-[#718096]">{c.currentSection}</div>
                    </td>

                    {/* SLA Status Pill */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          c.slaStatus === "OVERDUE"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : c.slaStatus === "NEAR_DUE"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : c.slaStatus === "COMPLETED"
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {c.slaStatus === "OVERDUE" && `เกิน ${Math.abs(c.remainingDays)} วัน`}
                        {c.slaStatus === "NEAR_DUE" && `เหลือ ${c.remainingDays} วัน`}
                        {c.slaStatus === "NORMAL" && `เหลือ ${c.remainingDays} วัน`}
                        {c.slaStatus === "COMPLETED" && "เสร็จสิ้น"}
                      </span>
                    </td>

                    {/* View Button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c);
                        }}
                        className="p-1.5 rounded-lg bg-[#EBF8FF] text-[#1E4E8C] hover:bg-[#1E4E8C] hover:text-white transition-colors"
                        title="เปิดสำนวนอิเล็กทรอนิกส์"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#718096]">
          <div>
            แสดงผล <span className="font-semibold text-[#1A202C]">{(currentPage - 1) * itemsPerPage + 1}</span> ถึง{" "}
            <span className="font-semibold text-[#1A202C]">{Math.min(currentPage * itemsPerPage, filteredCases.length)}</span> จากทั้งหมด{" "}
            <span className="font-semibold text-[#1A202C]">{filteredCases.length}</span> รายการ
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F7FAFC] disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0] font-medium text-[#1A202C]">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F7FAFC] disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
