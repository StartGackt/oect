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
  Plus
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

  // 4 Smart Action Cards (Style from Screenshot)
  const actionCards = [
    {
      id: "overdue",
      title: "ตรวจสอบเรื่องเร่งด่วน & เกิน SLA",
      desc: `มี ${overdueCount} เรื่องที่เกินกำหนด และ ${nearDueCount} เรื่องใกล้ครบกำหนดเวลาตามระเบียบ`,
      icon: ShieldAlert,
      iconColor: "text-red-500",
      bgColor: "bg-red-50 hover:bg-red-100/60 border-red-200/80",
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
      bgColor: "bg-blue-50 hover:bg-blue-100/60 border-blue-200/80",
      action: openNewModal,
    },
    {
      id: "workflow",
      title: "ดูขั้นตอนดำเนินงาน 11 ขั้นตอน",
      desc: "แผนผัง Workflow กฎหมาย กกต. ฉบับที่ ๓ ตั้งแต่ยื่นคำร้องจนถึง กกต. วินิจฉัยชี้ขาด",
      icon: Scale,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100/60 border-purple-200/80",
      action: onOpenWorkflow,
    },
    {
      id: "stats",
      title: "วิเคราะห์สถิติ & สรุปภาพรวม",
      desc: "รายงาน Top 10 จังหวัด, กราฟสัดส่วนข้อกล่าวหา และสถิติ 5 กลุ่มภารกิจหลัก",
      icon: BarChart3,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50 hover:bg-amber-100/60 border-amber-200/80",
      action: () => {
        setActiveFilter("ALL");
        setSearchPrompt("");
      },
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 sm:py-10 px-4 sm:px-6">
      
      {/* 1. Hero Greeting Section (Exact Style: Hello, [Name] / What would you like to do?) */}
      <div className="space-y-2 text-left sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>ระบบบริหารจัดการเรื่องร้องเรียน สนง.กกต. (ECT-CMS)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B1E36] tracking-tight">
          สวัสดีครับ, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#173B6B] via-[#1E4E8C] to-[#2B6CB0]">{currentRole.name.split(" ")[0]}</span>
        </h1>

        <p className="text-base sm:text-xl text-[#718096] font-light">
          วันนี้ต้องการให้ระบบช่วยจัดการเรื่องร้องเรียน หรือติดตามสำนวนใดบ้างครับ?
        </p>
      </div>

      {/* 2. 4 Quick Action Cards (Clean Cards Style from Screenshot) */}
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
                <h3 className="text-sm font-bold text-[#1A202C] leading-snug group-hover:text-[#1E4E8C] transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-[#64748B] font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-4 flex justify-end">
                <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-[#E2E8F0] flex items-center justify-center transition-transform group-hover:scale-110">
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Smart Command & Search Box (Clean Prompt Bar at Center) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-md p-3 sm:p-4 space-y-3">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่คำร้อง (เช่น MP-CMI-2569-001), ชื่อผู้ร้อง, ผู้ถูกร้อง, ข้อกล่าวหา, หรือพิมพ์คำสั่ง..."
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            className="w-full pl-10 pr-12 py-3 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-[#1E4E8C] focus:bg-white transition-all text-[#1A202C]"
          />
          {searchPrompt && (
            <button
              onClick={() => setSearchPrompt("")}
              className="absolute right-3.5 text-xs text-[#94A3B8] hover:text-[#1A202C]"
            >
              ล้าง
            </button>
          )}
        </div>

        {/* Quick Search Badges & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-[#94A3B8] font-medium mr-1">แท็กด่วน:</span>
            {[
              { label: "ทั้งหมด (300)", filter: "ALL" },
              { label: `🔴 เกิน SLA (${overdueCount})`, filter: "OVERDUE" },
              { label: `🟡 ใกล้ครบกำหนด (${nearDueCount})`, filter: "NEAR_DUE" },
              { label: "🔍 งานสืบสวนและไต่สวน", filter: "สืบสวน" },
              { label: "⚪ เสร็จสิ้น", filter: "COMPLETED" },
            ].map((tag) => (
              <button
                key={tag.filter}
                onClick={() => {
                  setActiveFilter(tag.filter);
                  setSearchPrompt("");
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === tag.filter
                    ? "bg-[#173B6B] text-white shadow-2xs"
                    : "bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-[#94A3B8] hidden sm:inline">
            แสดงผล <strong className="text-[#1A202C]">{filteredCases.length}</strong> รายการ
          </div>
        </div>
      </div>

      {/* 4. Streamlined Clean Case Cards Grid (Easy to Read, Clean & Intuitive) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#173B6B] rounded-full" />
            <h2 className="text-sm sm:text-base font-semibold text-[#1A202C]">
              รายการเรื่องร้องเรียนที่พบ ({filteredCases.length} เรื่อง)
            </h2>
          </div>

          {activeFilter !== "ALL" && (
            <button
              onClick={() => setActiveFilter("ALL")}
              className="text-xs text-[#1E4E8C] font-medium hover:underline"
            >
              แสดงทั้งหมด
            </button>
          )}
        </div>

        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center text-[#94A3B8] text-xs space-y-2">
            <Search className="w-6 h-6 mx-auto text-[#CBD5E1]" />
            <p>ไม่พบรายการที่ตรงกับคำค้นหา "{searchPrompt}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCases.slice(0, 12).map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#1E4E8C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  {/* Top Meta Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#173B6B] group-hover:underline">
                        {c.caseNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] text-[10px] font-medium border border-[#E2E8F0]">
                        {c.electionType} · {c.province}
                      </span>
                    </div>

                    {/* SLA Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.slaStatus === "OVERDUE"
                          ? "bg-red-100 text-red-700 border border-red-200"
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
                  <h3 className="text-xs sm:text-sm font-semibold text-[#1A202C] line-clamp-1 mb-1">
                    {c.allegation}
                  </h3>

                  {/* Details */}
                  <p className="text-xs text-[#64748B] font-light line-clamp-2 leading-relaxed mb-3">
                    {c.details}
                  </p>

                  {/* Parties & Officer */}
                  <div className="text-[11px] text-[#475569] space-y-0.5 pt-2 border-t border-[#F1F5F9]">
                    <div className="truncate">
                      <span className="text-[#94A3B8]">ผู้ร้อง:</span> {c.complainants}
                    </div>
                    <div className="truncate">
                      <span className="text-[#94A3B8]">ผู้ถูกร้อง:</span> {c.respondent}
                    </div>
                  </div>
                </div>

                {/* Bottom Step Indicator */}
                <div className="pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[#1E4E8C] font-medium truncate max-w-[200px]">
                    📍 {c.currentStage}
                  </div>
                  <span className="text-[#1E4E8C] font-semibold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>ดูสำนวน</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredCases.length > 12 && (
          <div className="text-center pt-2">
            <span className="text-xs text-[#94A3B8]">
              แสดง 12 จากทั้งหมด {filteredCases.length} รายการ (พิมพ์ในช่องค้นหาเพื่อเจาะจงสำนวน)
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
