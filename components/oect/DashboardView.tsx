"use client";

import { useMemo, useState } from "react";
import { 
  FileText, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  MapPin, 
  Layers, 
  ShieldAlert, 
  BarChart3, 
  ArrowUpRight,
  ChevronRight,
  Inbox
} from "lucide-react";
import { ELECTION_TYPE_OPTIONS, MISSION_GROUP_OPTIONS, type ComplaintItem } from "@/components/oect/complaintDomain";

interface DashboardViewProps {
  cases: ComplaintItem[];
  onSelectCase: (c: ComplaintItem) => void;
  onViewAllCases: () => void;
  roleId: string;
  onFilterStatus: (status: string) => void;
}

export default function DashboardView({ cases, onSelectCase, onViewAllCases, roleId, onFilterStatus }: DashboardViewProps) {
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
  const newCases = filteredCases.filter((c) => c.stageId === 1).length;
  const normalCases = filteredCases.filter((c) => c.slaStatus === "NORMAL").length;
  const nearDueCases = filteredCases.filter((c) => c.slaStatus === "NEAR_DUE").length;
  const overdueCases = filteredCases.filter((c) => c.slaStatus === "OVERDUE").length;
  const completedCases = filteredCases.filter((c) => c.slaStatus === "COMPLETED").length;
  const showIncomingCard = roleId === "intake" || roleId === "review-1";

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
          <Filter className="w-4 h-4 text-[#1B3F8B]" />
          <span>ตัวกรองข้อมูลรายงาน:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Election Type */}
          <select
            value={selectedElectionType}
            onChange={(e) => setSelectedElectionType(e.target.value)}
            className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1B3F8B]"
          >
            <option value="ALL">ประเภทการเลือกตั้ง: ทั้งหมด</option>
            {ELECTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Mission Group */}
          <select
            value={selectedMission}
            onChange={(e) => setSelectedMission(e.target.value)}
            className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1B3F8B]"
          >
            <option value="ALL">กลุ่มภารกิจ: ทั้งหมด 5 กลุ่ม</option>
            {MISSION_GROUP_OPTIONS.map((mission) => <option key={mission} value={mission}>{mission}</option>)}
          </select>

          {/* Province */}
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="text-xs bg-[#F7FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#1B3F8B]"
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

      {/* Role-aware KPI cards: 6 cards for intake staff, 5 cards for executives */}
      <div className={`grid grid-cols-2 gap-3.5 sm:grid-cols-3 ${showIncomingCard ? "lg:grid-cols-6" : "lg:grid-cols-5"}`}>
        <StatusCard label="เรื่องร้องเรียนทั้งหมด" value={totalCases} helper="ในระบบฐานข้อมูล POC" icon={FileText} tone="blue" onClick={() => onFilterStatus("ALL")} />
        {showIncomingCard && <StatusCard label="ข้อมูลเข้าใหม่" value={newCases} helper="รอตรวจและมอบหมายภายใน 3 วัน" icon={Inbox} tone="sky" onClick={() => onFilterStatus("NEW")} />}
        <StatusCard label="อยู่ในเกณฑ์เวลาปกติ" value={normalCases} helper={`${totalCases > 0 ? ((normalCases / totalCases) * 100).toFixed(1) : 0}% ของเรื่องทั้งหมด`} icon={Clock} tone="green" onClick={() => onFilterStatus("NORMAL")} />
        <StatusCard label="ใกล้ครบกำหนด" value={nearDueCases} helper="เหลือไม่เกิน 5 วัน" icon={AlertCircle} tone="amber" onClick={() => onFilterStatus("NEAR_DUE")} />
        <StatusCard label="เกินกำหนดเวลา" value={overdueCases} helper="ต้องรายงานเหตุผลและเร่งรัด" icon={ShieldAlert} tone="rose" onClick={() => onFilterStatus("OVERDUE")} />
        <StatusCard label="วินิจฉัยแล้วเสร็จ" value={completedCases} helper="ปิดตัวจับเวลาแล้ว" icon={CheckCircle2} tone="indigo" onClick={() => onFilterStatus("COMPLETED")} />
      </div>

      {/* Main Analytics Row: 5 Mission Groups & Top Allegations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 5 Mission Groups Summary (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1B3F8B]" />
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
                      className="bg-[#1B3F8B] h-full rounded-full transition-all duration-500"
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
              <BarChart3 className="w-4 h-4 text-[#FFD600]" />
              <h3 className="text-sm font-semibold text-[#1A202C]">ข้อกล่าวหายอดนิยม (Top Allegations)</h3>
            </div>
            <span className="text-[11px] text-[#718096]">ความถี่ข้อหา</span>
          </div>

          <div className="space-y-2.5">
            {allegationStats.map(([name, count], i) => (
              <div
                key={name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7FAFC] border border-[#EDF2F7] text-xs hover:border-[#1B3F8B]/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[10px] font-bold text-[#1B3F8B]">
                    0{i + 1}
                  </span>
                  <span className="font-medium text-[#2D3748] line-clamp-1">{name}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[#1B3F8B] font-semibold border border-[#E2E8F0] text-xs">
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
              <MapPin className="w-4 h-4 text-[#1B3F8B]" />
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
                    ? "bg-[#4FB3E8]/10 border border-[#1B3F8B] font-semibold text-[#1B3F8B]"
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
              className="text-xs text-[#1B3F8B] font-medium hover:underline flex items-center gap-1"
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
                  className="p-3.5 rounded-xl border border-[#E2E8F0] hover:border-[#1B3F8B] hover:shadow-xs transition-all cursor-pointer bg-[#F7FAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#1B3F8B]">{c.caseNumber}</span>
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
                    <button className="text-xs text-[#1B3F8B] font-medium underline">
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

function StatusCard({
  label,
  value,
  helper,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string;
  value: number;
  helper: string;
  icon: typeof FileText;
  tone: "blue" | "sky" | "green" | "amber" | "rose" | "indigo";
  onClick: () => void;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    sky: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    indigo: "bg-blue-50 text-blue-700",
  };

  return (
    <button type="button" onClick={onClick} className="flex min-h-32 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100">
      <div className="flex w-full items-start justify-between gap-3 text-slate-500">
        <span className="text-xs font-medium leading-5">{label}</span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-950 sm:text-3xl">{value}</div>
        <div className="mt-0.5 text-[10px] leading-4 text-slate-500">{helper}</div>
      </div>
    </button>
  );
}
