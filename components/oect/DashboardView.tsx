"use client";

import { useMemo, useState } from "react";
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Filter, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  BarChart3, 
  PieChart, 
  ArrowUpRight,
  ChevronRight,
  Scale,
  Users,
  Vote
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

interface DashboardViewProps {
  cases: ComplaintItem[];
  onSelectCase: (c: ComplaintItem) => void;
  onViewAllCases: () => void;
}

export default function DashboardView({ cases, onSelectCase, onViewAllCases }: DashboardViewProps) {
  const [selectedProvince, setSelectedProvince] = useState<string>("ALL");
  const [selectedMission, setSelectedMission] = useState<string>("ALL");
  const [selectedElectionType, setSelectedElectionType] = useState<string>("ALL");

  // Filtered dataset
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (selectedProvince !== "ALL" && c.province !== selectedProvince) return false;
      if (selectedMission !== "ALL" && c.missionGroup !== selectedMission) return false;
      if (selectedElectionType !== "ALL" && c.electionType !== selectedElectionType) return false;
      return true;
    });
  }, [cases, selectedProvince, selectedMission, selectedElectionType]);

  // KPIs
  const totalCases = filteredCases.length;
  const normalCases = filteredCases.filter((c) => c.slaStatus === "NORMAL").length;
  const nearDueCases = filteredCases.filter((c) => c.slaStatus === "NEAR_DUE").length;
  const overdueCases = filteredCases.filter((c) => c.slaStatus === "OVERDUE").length;
  const completedCases = filteredCases.filter((c) => c.slaStatus === "COMPLETED").length;

  // Provinces List & Top 10
  const provinceStats = useMemo(() => {
    const counts: { [key: string]: number } = {};
    cases.forEach((c) => {
      counts[c.province] = (counts[c.province] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [cases]);

  // Allegation Stats
  const allegationStats = useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredCases.forEach((c) => {
      counts[c.allegation] = (counts[c.allegation] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [filteredCases]);

  // Mission Group Stats
  const missionStats = useMemo(() => {
    const counts: { [key: string]: number } = {};
    filteredCases.forEach((c) => {
      counts[c.missionGroup] = (counts[c.missionGroup] || 0) + 1;
    });
    return Object.entries(counts);
  }, [filteredCases]);

  // Urgent Overdue / Near Due Cases
  const urgentCases = useMemo(() => {
    return filteredCases
      .filter((c) => c.slaStatus === "OVERDUE" || c.slaStatus === "NEAR_DUE")
      .slice(0, 5);
  }, [filteredCases]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-[#1A202C]">
          <Filter className="w-4 h-4 text-[#1E4E8C]" />
          <span>ตัวกรองข้อมูลรายงาน:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Election Type */}
          <select
            value={selectedElectionType}
            onChange={(e) => setSelectedElectionType(e.target.value)}
            className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1E4E8C]"
          >
            <option value="ALL">ประเภทการเลือกตั้ง: ทั้งหมด</option>
            <option value="สส.">สมาชิกสภาผู้แทนราษฎร (สส.)</option>
            <option value="สว.">สมาชิกวุฒิสภา (สว.)</option>
            <option value="อบจ.">องค์การบริหารส่วนจังหวัด (อบจ.)</option>
          </select>

          {/* Mission Group */}
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1E4E8C]"
          >
            <option value="ALL">กลุ่มภารกิจ: ทั้งหมด 5 กลุ่ม</option>
            <option value="สืบสวนและไต่สวน">สืบสวนและไต่สวน</option>
            <option value="พรรคการเมือง">พรรคการเมือง</option>
            <option value="การจัดการเลือกตั้ง">การจัดการเลือกตั้ง</option>
            <option value="บริหารทั่วไป">บริหารทั่วไป</option>
            <option value="กระบวนการยุติธรรม">กระบวนการยุติธรรม</option>
          </select>

          {/* Province */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1E4E8C]"
          >
            <option value="ALL">จังหวัด: ทั่วประเทศ (77 จังหวัด)</option>
            {provinceStats.map(([prov]) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>

          {(selectedProvince !== "ALL" || selectedMission !== "ALL" || selectedElectionType !== "ALL") && (
            <button
              onClick={() => {
                setSelectedProvince("ALL");
                setSelectedMission("ALL");
                setSelectedElectionType("ALL");
              }}
              className="text-xs text-red-600 hover:underline px-2"
            >
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {/* 5 Core KPI Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Cases */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#718096] mb-2">
            <span className="text-xs font-medium">เรื่องร้องเรียนทั้งหมด</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E4E8C] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-[#0B1E36]">{totalCases}</div>
            <div className="text-[10px] text-[#718096] mt-0.5">ในระบบฐานข้อมูล POC</div>
          </div>
        </div>

        {/* Normal SLA */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#718096] mb-2">
            <span className="text-xs font-medium">อยู่ในเกณฑ์เวลาปกติ</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{normalCases}</div>
            <div className="text-[10px] text-emerald-700 mt-0.5">
              {totalCases > 0 ? ((normalCases / totalCases) * 100).toFixed(1) : 0}% ของเรื่องทั้งหมด
            </div>
          </div>
        </div>

        {/* Near Due */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#718096] mb-2">
            <span className="text-xs font-medium">ใกล้ครบกำหนด (&lt; 5 วัน)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">{nearDueCases}</div>
            <div className="text-[10px] text-amber-700 mt-0.5">ต้องเร่งรัดติดตามสำนวน</div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#718096] mb-2">
            <span className="text-xs font-medium">เกินกำหนดเวลา (Overdue)</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-red-600">{overdueCases}</div>
            <div className="text-[10px] text-red-700 mt-0.5">ต้องขออนุมัติขยายเวลา</div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#718096] mb-2">
            <span className="text-xs font-medium">วินิจฉัยแล้วเสร็จ</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{completedCases}</div>
            <div className="text-[10px] text-indigo-700 mt-0.5">จัดทำคำวินิจฉัยเสร็จสิ้น</div>
          </div>
        </div>

      </div>

      {/* Main Analytics Row: 5 Mission Groups & Top Allegations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 5 Mission Groups Summary (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1E4E8C]" />
              <h3 className="text-sm font-semibold text-[#1A202C]">จำแนกตาม 5 กลุ่มภารกิจหลัก</h3>
            </div>
            <span className="text-[11px] text-[#718096]">สัดส่วนงาน</span>
          </div>

          <div className="space-y-3">
            {missionStats.map(([name, count]) => {
              const pct = totalCases > 0 ? (count / totalCases) * 100 : 0;
              return (
                <div key={name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#2D3748]">{name}</span>
                    <span className="text-[#718096] font-light">
                      <strong className="text-[#1A202C]">{count}</strong> เรื่อง ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#EDF2F7] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1E4E8C] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Allegation Category Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#ECC94B]" />
              <h3 className="text-sm font-semibold text-[#1A202C]">ข้อกล่าวหายอดนิยม (Top Allegations)</h3>
            </div>
            <span className="text-[11px] text-[#718096]">ความถี่ข้อหา</span>
          </div>

          <div className="space-y-2.5">
            {allegationStats.map(([name, count], i) => (
              <div
                key={name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs hover:border-[#1E4E8C]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[10px] font-bold text-[#1E4E8C]">
                    0{i + 1}
                  </span>
                  <span className="font-medium text-[#2D3748] line-clamp-1">{name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#1E4E8C] font-semibold border border-[#E2E8F0] text-xs">
                  {count} เรื่อง
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top 10 Provinces Grid & Urgent Cases Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top 10 Provinces Bar (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1E4E8C]" />
              <h3 className="text-sm font-semibold text-[#1A202C]">Top 10 จังหวัดที่มีเรื่องร้องเรียน</h3>
            </div>
            <span className="text-[11px] text-[#718096]">ข้อมูลรายจังหวัด</span>
          </div>

          <div className="space-y-2">
            {provinceStats.map(([prov, count], idx) => (
              <div
                key={prov}
                onClick={() => setSelectedProvince(prov)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                  selectedProvince === prov
                    ? "bg-[#EBF8FF] border border-[#1E4E8C] font-semibold text-[#1E4E8C]"
                    : "hover:bg-[#F7FAFC] text-[#4A5568]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#A0AEC0] w-4">{idx + 1}.</span>
                  <span>จ.{prov}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{count} เรื่อง</span>
                  <ChevronRight className="w-3 h-3 text-[#A0AEC0]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Cases Requiring Action (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-semibold text-[#1A202C]">เรื่องที่ต้องเร่งรัดและติดตาม SLA</h3>
            </div>
            <button
              onClick={onViewAllCases}
              className="text-xs text-[#1E4E8C] font-medium hover:underline flex items-center gap-1"
            >
              <span>ดูเรื่องทั้งหมด</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {urgentCases.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#A0AEC0]">
                ไม่มีเรื่องที่เกินกำหนดเวลาหรือใกล้ครบกำหนดในตัวกรองนี้
              </div>
            ) : (
              urgentCases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c)}
                  className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#1E4E8C] hover:shadow-xs transition-all cursor-pointer bg-[#F7FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0B1E36]">{c.caseNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[#718096]">
                        จ.{c.province} {c.constituency}
                      </span>
                    </div>
                    <div className="text-xs text-[#4A5568] line-clamp-1">{c.allegation}</div>
                    <div className="text-[11px] text-[#718096] flex items-center gap-2">
                      <span>ขั้นตอน: {c.currentStage}</span>
                      <span>·</span>
                      <span>ผู้รับผิดชอบ: {c.officer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        c.slaStatus === "OVERDUE"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {c.slaStatus === "OVERDUE"
                        ? `เกินกำหนด ${Math.abs(c.remainingDays)} วัน`
                        : `เหลืออีก ${c.remainingDays} วัน`}
                    </span>
                    <button className="text-xs text-[#1E4E8C] font-medium underline">
                      เปิดสำนวน
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
