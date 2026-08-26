"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  FileText, 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  Send, 
  ArrowRight, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  MapPin,
  Scale,
  PlusCircle,
  Download,
  Filter,
  User,
  Eye,
  BookOpen,
  Zap,
  Mic,
  Plus,
  Flame,
  Calendar
} from "lucide-react";
import { UserRole } from "./Header";

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

interface SmartHubViewProps {
  cases: ComplaintItem[];
  currentRole: UserRole;
  onSelectCase: (c: ComplaintItem) => void;
  openNewModal: () => void;
  onOpenWorkflow: () => void;
}

export default function SmartHubView({
  cases,
  currentRole,
  onSelectCase,
  openNewModal,
  onOpenWorkflow,
}: SmartHubViewProps) {
  const [searchPrompt, setSearchPrompt] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedProvince, setSelectedProvince] = useState<string>("ALL");

  // Filtered dataset
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Prompt search
      if (searchPrompt.trim()) {
        const q = searchPrompt.toLowerCase();
        const match =
          c.caseNumber.toLowerCase().includes(q) ||
          c.province.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.complainants.toLowerCase().includes(q) ||
          c.respondent.toLowerCase().includes(q) ||
          c.allegation.toLowerCase().includes(q) ||
          c.officer.toLowerCase().includes(q) ||
          c.currentStage.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Quick filter
      if (activeFilter === "OVERDUE" && c.slaStatus !== "OVERDUE") return false;
      if (activeFilter === "NEAR_DUE" && c.slaStatus !== "NEAR_DUE") return false;
      if (activeFilter === "COMPLETED" && c.slaStatus !== "COMPLETED") return false;
      if (activeFilter === "สืบสวน" && c.missionGroup !== "สืบสวนและไต่สวน") return false;

      // Province filter
      if (selectedProvince !== "ALL" && c.province !== selectedProvince) return false;

      return true;
    });
  }, [cases, searchPrompt, activeFilter, selectedProvince]);

  // Statistics
  const overdueCount = cases.filter((c) => c.slaStatus === "OVERDUE").length;
  const nearDueCount = cases.filter((c) => c.slaStatus === "NEAR_DUE").length;
  const completedCount = cases.filter((c) => c.slaStatus === "COMPLETED").length;
  const normalCount = cases.filter((c) => c.slaStatus === "NORMAL").length;

  // 4 Smart Action Cards
  const actionCards = [
    {
      id: "overdue",
      title: "ตรวจสอบเรื่องเร่งด่วน & เกิน SLA",
      desc: `มี ${overdueCount} เรื่องที่เกินกำหนด และ ${nearDueCount} เรื่องใกล้ครบกำหนดเวลาตามระเบียบ`,
      icon: ShieldAlert,
      iconColor: "text-rose-500",
      bgColor: "bg-rose-50/70 hover:bg-rose-100/80 border-rose-200/80",
      action: () => {
        setActiveFilter("OVERDUE");
        setSearchPrompt("");
      },
    },
    {
      id: "new_intake",
      title: "บันทึกรับคำร้องใหม่ (แบบ สสว.1)",
      desc: "ออกเลขรับอัตโนมัติ ตรวจสอบสิทธิผู้ร้องในเขตเลือกตั้ง และมอบหมายผู้รับผิดชอบ",
      icon: PlusCircle,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/70 hover:bg-blue-100/80 border-blue-200/80",
      action: openNewModal,
    },
    {
      id: "workflow",
      title: "ดูขั้นตอนดำเนินงาน 10 ขั้นตอน",
      desc: "แผนผัง Workflow กฎหมาย กกต. ตั้งแต่ยื่นคำร้องจนถึง กกต. วินิจฉัยชี้ขาด",
      icon: Scale,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/70 hover:bg-purple-100/80 border-purple-200/80",
      action: onOpenWorkflow,
    },
    {
      id: "stats",
      title: "วิเคราะห์สถิติ & สรุปภาพรวม",
      desc: "รายงาน Top 10 จังหวัด, กราฟสัดส่วนข้อกล่าวหา และสถิติ 5 กลุ่มภารกิจหลัก",
      icon: BarChart3,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50/70 hover:bg-amber-100/80 border-amber-200/80",
      action: () => {
        setActiveFilter("ALL");
        setSearchPrompt("");
      },
    },
  ];

  return (
    <div className="space-y-8 py-2">
      
      {/* 1. Hero Greeting Section */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/40 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>ศูนย์ปฏิบัติการเรื่องร้องเรียนอัจฉริยะ (ECT Smart Hub)</span>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>ฐานข้อมูลสำนวนปี 2569</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#0B1E36] tracking-tight">
            สวัสดีครับ, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#173B6B] via-[#1E4E8C] to-[#2B6CB0]">{currentRole.name.split(" ")[0]}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-light">
            วันนี้ต้องการให้ระบบช่วยจัดการเรื่องร้องเรียน ติดตามสำนวนเร่งด่วน หรือออกเลขรับคำร้องใหม่ครับ?
          </p>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/60">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase">สำนวนทั้งหมด</div>
              <div className="text-lg font-bold text-slate-900">{cases.length}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
              คดี
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase">กรอบเวลาปกติ</div>
              <div className="text-lg font-bold text-emerald-700">{normalCount}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-amber-600 uppercase">ใกล้ครบกำหนด</div>
              <div className="text-lg font-bold text-amber-700">{nearDueCount}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-rose-600 uppercase">เกินกำหนด SLA</div>
              <div className="text-lg font-bold text-rose-700">{overdueCount}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={card.action}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md hover:-translate-y-0.5 ${card.bgColor}`}
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#1E4E8C] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 space-y-3.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-4" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่คำร้อง (เช่น MP-CMI-2569-001), ผู้ร้อง, ผู้ถูกร้อง, ข้อกล่าวหา, จังหวัด หรือพิมพ์คำสำคัญ..."
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            className="w-full pl-11 pr-14 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#173B6B] focus:bg-white transition-all text-slate-900"
          />
          {searchPrompt && (
            <button
              onClick={() => setSearchPrompt("")}
              className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-0.5 rounded"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* Quick Search Badges & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-slate-400 font-bold mr-1">แท็กด่วน:</span>
            {[
              { label: `ทั้งหมด (${cases.length})`, filter: "ALL" },
              { label: `🔴 เกิน SLA (${overdueCount})`, filter: "OVERDUE" },
              { label: `🟡 ใกล้ครบกำหนด (${nearDueCount})`, filter: "NEAR_DUE" },
              { label: "🔍 งานสืบสวนและไต่สวน", filter: "สืบสวน" },
              { label: `⚪ เสร็จสิ้น (${completedCount})`, filter: "COMPLETED" },
            ].map((tag) => (
              <button
                key={tag.filter}
                onClick={() => {
                  setActiveFilter(tag.filter);
                  setSearchPrompt("");
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeFilter === tag.filter
                    ? "bg-[#173B6B] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            แสดงผล <strong className="text-slate-900">{filteredCases.length}</strong> จาก {cases.length} รายการ
          </div>
        </div>
      </div>

      {/* 4. Cases Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#173B6B] rounded-full" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              รายการสำนวนเรื่องร้องเรียน ({filteredCases.length} เรื่อง)
            </h2>
          </div>

          {activeFilter !== "ALL" && (
            <button
              onClick={() => setActiveFilter("ALL")}
              className="text-xs text-[#1E4E8C] font-semibold hover:underline"
            >
              แสดงทั้งหมด
            </button>
          )}
        </div>

        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-2">
            <Search className="w-6 h-6 mx-auto text-slate-300" />
            <p>ไม่พบรายการที่ตรงกับคำค้นหา &ldquo;{searchPrompt}&rdquo;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCases.slice(0, 10).map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-[#173B6B] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                <div>
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#173B6B] group-hover:underline">
                        {c.caseNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                        {c.electionType} · {c.province}
                      </span>
                    </div>

                    {/* SLA Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.slaStatus === "OVERDUE"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : c.slaStatus === "NEAR_DUE"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : c.slaStatus === "COMPLETED"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {c.slaStatus === "OVERDUE" && `เกิน SLA ${Math.abs(c.remainingDays)} วัน`}
                      {c.slaStatus === "NEAR_DUE" && `เหลืออีก ${c.remainingDays} วัน`}
                      {c.slaStatus === "NORMAL" && `เหลือ ${c.remainingDays} วัน`}
                      {c.slaStatus === "COMPLETED" && "เสร็จสิ้น"}
                    </span>
                  </div>

                  {/* Allegation Title */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                    {c.allegation}
                  </h3>

                  {/* Details */}
                  <p className="text-xs text-slate-600 font-light line-clamp-2 leading-relaxed mb-3">
                    {c.details}
                  </p>

                  {/* Parties & Officer */}
                  <div className="text-[11px] text-slate-600 space-y-0.5 pt-2 border-t border-slate-100">
                    <div className="truncate">
                      <span className="text-slate-400 font-medium">ผู้ร้อง:</span> {c.complainants}
                    </div>
                    <div className="truncate">
                      <span className="text-slate-400 font-medium">ผู้ถูกร้อง:</span> {c.respondent}
                    </div>
                  </div>
                </div>

                {/* Bottom Step Indicator */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[#1E4E8C] font-semibold truncate max-w-[220px]">
                    📍 {c.currentStage}
                  </div>
                  <span className="text-[#173B6B] font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>ดูสำนวน</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCases.length > 10 && (
          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">
              แสดง 10 จากทั้งหมด {filteredCases.length} รายการ (ใช้ช่องค้นหาด้านบนเพื่อเจาะจงสำนวน)
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
