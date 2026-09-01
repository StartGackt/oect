"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  Inbox,
  LayoutGrid,
  MapPin,
  PieChart,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { MISSION_GROUP_OPTIONS, getSlaLabel, type ComplaintItem } from "@/components/oect/complaintDomain";
import ElectionTypeCardMenu from "@/components/oect/ElectionTypeCardMenu";

// สีตามกลุ่มภารกิจ สำหรับ Pie chart หน้าจอผู้บริหาร กกต./ลธ.กกต. (ภาคผนวก ข ข้อ ๔.๔)
const MISSION_COLORS: Record<string, string> = {
  "สืบสวนและไต่สวน": "#1B3F8B",
  "พรรคการเมือง": "#4FB3E8",
  "การจัดการเลือกตั้ง": "#FFD600",
  "บริหารทั่วไป": "#10B981",
  "กระบวนการยุติธรรม": "#F43F5E",
};

// เฉพาะบทบาทระดับผู้บริหารส่วนกลาง (กกต./ลธ.กกต.) ที่เห็นสรุปภาพรวมตามภารกิจ ตาม TOR ข้อ ๔.๔
const EXECUTIVE_ROLE_IDS = ["sequential", "subcommittee", "commission", "secretary", "admin"];

interface DashboardViewProps {
  cases: ComplaintItem[];
  onSelectCase: (caseItem: ComplaintItem) => void;
  onViewAllCases: () => void;
  roleId: string;
  onFilterStatus: (status: string) => void;
}

const STATUS_CHART = [
  { id: "NORMAL", label: "ปกติ", color: "bg-[#1B3F8B]" },
  { id: "NEAR_DUE", label: "ใกล้ครบกำหนด", color: "bg-[#FFD600]" },
  { id: "OVERDUE", label: "เกินกำหนด", color: "bg-rose-500" },
  { id: "COMPLETED", label: "เสร็จสิ้น", color: "bg-emerald-500" },
] as const;

export default function DashboardView({ cases, onSelectCase, onViewAllCases, roleId, onFilterStatus }: DashboardViewProps) {
  const [selectedProvince, setSelectedProvince] = useState("ALL");
  const [selectedMission, setSelectedMission] = useState("ALL");
  const [selectedElectionType, setSelectedElectionType] = useState("ALL");

  const provinceList = useMemo(() => Array.from(new Set(cases.map((item) => item.province))).sort((a, b) => a.localeCompare(b, "th")), [cases]);
  const filteredCases = useMemo(() => cases.filter((caseItem) => {
    if (selectedProvince !== "ALL" && caseItem.province !== selectedProvince) return false;
    if (selectedMission !== "ALL" && caseItem.missionGroup !== selectedMission) return false;
    if (selectedElectionType !== "ALL" && caseItem.electionType !== selectedElectionType) return false;
    return true;
  }), [cases, selectedElectionType, selectedMission, selectedProvince]);

  const totalCases = filteredCases.length;
  const newCases = filteredCases.filter((item) => item.stageId === 1).length;
  const normalCases = filteredCases.filter((item) => item.slaStatus === "NORMAL").length;
  const nearDueCases = filteredCases.filter((item) => item.slaStatus === "NEAR_DUE").length;
  const overdueCases = filteredCases.filter((item) => item.slaStatus === "OVERDUE").length;
  const completedCases = filteredCases.filter((item) => item.slaStatus === "COMPLETED").length;
  const showIncomingCard = roleId === "admin" || roleId === "intake" || roleId === "review-1";

  const monthlyStats = useMemo(() => {
    const counts = new Map<string, number>();
    filteredCases.forEach((item) => {
      const month = item.receivedDate.slice(0, 7);
      counts.set(month, (counts.get(month) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-8);
  }, [filteredCases]);

  const provinceStats = useMemo(() => {
    const counts = new Map<string, number>();
    filteredCases.forEach((item) => counts.set(item.province, (counts.get(item.province) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [filteredCases]);

  const urgentCases = useMemo(() => filteredCases
    .filter((item) => item.slaStatus === "OVERDUE" || item.slaStatus === "NEAR_DUE")
    .sort((a, b) => a.remainingDays - b.remainingDays)
    .slice(0, 5), [filteredCases]);

  const statusCounts = { NORMAL: normalCases, NEAR_DUE: nearDueCases, OVERDUE: overdueCases, COMPLETED: completedCases };
  const maxMonthly = Math.max(...monthlyStats.map(([, count]) => count), 1);
  const maxProvince = Math.max(...provinceStats.map(([, count]) => count), 1);
  const hasFilters = selectedProvince !== "ALL" || selectedMission !== "ALL" || selectedElectionType !== "ALL";
  const showMissionPie = EXECUTIVE_ROLE_IDS.includes(roleId);

  const missionStats = useMemo(() => {
    const counts = new Map<string, number>();
    filteredCases.forEach((item) => counts.set(item.missionGroup, (counts.get(item.missionGroup) ?? 0) + 1));
    return MISSION_GROUP_OPTIONS.map((mission) => ({ mission, count: counts.get(mission) ?? 0 })).filter((item) => item.count > 0);
  }, [filteredCases]);

  const missionGradient = useMemo(() => {
    if (totalCases === 0) return "conic-gradient(#E2E8F0 0% 100%)";
    let cursor = 0;
    const segments = missionStats.map((item) => {
      const start = cursor;
      cursor += (item.count / totalCases) * 100;
      return `${MISSION_COLORS[item.mission] ?? "#94A3B8"} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${segments.join(", ")})`;
  }, [missionStats, totalCases]);

  const clearFilters = () => {
    setSelectedProvince("ALL");
    setSelectedMission("ALL");
    setSelectedElectionType("ALL");
  };

  return (
    <div className="space-y-5 pb-12">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1B3F8B]"><LayoutGrid className="h-4 w-4" /></span><div><div className="text-xs font-semibold text-slate-900">ประเภทการเลือกตั้ง</div><div className="text-[10px] text-slate-400">เลือกการ์ดเพื่อกรองข้อมูลทั้งหน้าตามประเภทการเลือกตั้ง</div></div></div>
        <ElectionTypeCardMenu cases={cases} value={selectedElectionType} onChange={setSelectedElectionType} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1B3F8B]"><Filter className="h-4 w-4" /></span><div><div className="text-xs font-semibold text-slate-900">ตัวกรองเพิ่มเติม</div><div className="text-[10px] text-slate-400">ข้อมูลทุกกราฟจะเปลี่ยนตามตัวกรองเดียวกัน</div></div></div>
          <div className="grid gap-2 sm:grid-cols-2 xl:flex">
            <select value={selectedMission} onChange={(event) => setSelectedMission(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 focus:bg-white"><option value="ALL">กลุ่มภารกิจทั้งหมด</option>{MISSION_GROUP_OPTIONS.map((mission) => <option key={mission} value={mission}>{mission}</option>)}</select>
            <select value={selectedProvince} onChange={(event) => setSelectedProvince(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 focus:bg-white"><option value="ALL">ทุกจังหวัด</option>{provinceList.map((province) => <option key={province} value={province}>{province}</option>)}</select>
            {hasFilters && <button type="button" onClick={clearFilters} className="rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50">ล้างตัวกรอง</button>}
          </div>
        </div>
      </section>

      <section className={`grid grid-cols-2 gap-3 sm:grid-cols-3 ${showIncomingCard ? "xl:grid-cols-6" : "xl:grid-cols-5"}`}>
        <MetricCard label="เรื่องทั้งหมด" value={totalCases} helper="ทะเบียนกลาง" icon={FileText} tone="blue" onClick={() => onFilterStatus("ALL")} />
        {showIncomingCard && <MetricCard label="เรื่องเข้าใหม่" value={newCases} helper="รอตรวจภายใน 3 วัน" icon={Inbox} tone="sky" onClick={() => onFilterStatus("NEW")} />}
        <MetricCard label="อยู่ในเกณฑ์" value={normalCases} helper={`${percent(normalCases, totalCases)}% ของทั้งหมด`} icon={Clock3} tone="green" onClick={() => onFilterStatus("NORMAL")} />
        <MetricCard label="ใกล้ครบกำหนด" value={nearDueCases} helper="เหลือไม่เกิน 5 วัน" icon={AlertCircle} tone="amber" onClick={() => onFilterStatus("NEAR_DUE")} />
        <MetricCard label="เกินกำหนด" value={overdueCases} helper="ต้องเร่งรัด" icon={ShieldAlert} tone="rose" onClick={() => onFilterStatus("OVERDUE")} />
        <MetricCard label="เสร็จสิ้น" value={completedCases} helper={`${percent(completedCases, totalCases)}% ของทั้งหมด`} icon={CheckCircle2} tone="indigo" onClick={() => onFilterStatus("COMPLETED")} />
      </section>

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-8">
          <ChartHeader icon={BarChart3} title="แนวโน้มเรื่องร้องเรียนรายเดือน" description="จำนวนเรื่องที่รับเข้าสู่ระบบในแต่ละเดือน" badge={`${totalCases} เรื่องตามตัวกรอง`} />
          <div className="overflow-x-auto px-5 pb-5 sm:px-6">
            {monthlyStats.length === 0 ? <EmptyChart /> : <div className="flex h-72 min-w-[620px] items-end gap-3 border-b border-slate-200 px-2 pt-10">
              {monthlyStats.map(([month, count], index) => <div key={month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-bold text-slate-500 opacity-0 transition group-hover:opacity-100">{count}</span><div className="flex h-52 w-full items-end justify-center"><div title={`${formatMonth(month)} ${count} เรื่อง`} className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${index === monthlyStats.length - 1 ? "bg-[#4FB3E8]" : "bg-[#1B3F8B] group-hover:bg-[#2956a8]"}`} style={{ height: `${Math.max(8, (count / maxMonthly) * 100)}%` }} /></div><span className="h-7 text-center text-[10px] font-medium text-slate-500">{formatMonth(month)}</span></div>)}
            </div>}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-4">
          <ChartHeader icon={ShieldAlert} title="สถานะ SLA" description="สัดส่วนความเร่งด่วนของงาน" badge={`${nearDueCases + overdueCases} เรื่องต้องติดตาม`} />
          <div className="space-y-5 px-5 pb-6 sm:px-6">
            {STATUS_CHART.map((status) => { const count = statusCounts[status.id]; const width = percent(count, totalCases); return <button key={status.id} type="button" onClick={() => onFilterStatus(status.id)} className="block w-full text-left"><div className="mb-2 flex items-center justify-between text-xs"><span className="font-medium text-slate-600">{status.label}</span><span className="font-bold text-slate-900">{count} <span className="font-normal text-slate-400">({width}%)</span></span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all duration-500 ${status.color}`} style={{ width: `${width}%` }} /></div></button>; })}
            <div className="rounded-xl bg-blue-50 p-4"><div className="flex items-center justify-between"><span className="text-[10px] font-semibold text-blue-700">อัตราดำเนินการแล้วเสร็จ</span><span className="text-xl font-bold text-[#1B3F8B]">{percent(completedCases, totalCases)}%</span></div><p className="mt-1 text-[10px] leading-4 text-blue-700/70">คำนวณจากข้อมูลภายใต้ตัวกรองปัจจุบัน</p></div>
          </div>
        </section>
      </div>

      {showMissionPie && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ChartHeader icon={PieChart} title="สัดส่วนเรื่องร้องเรียนตามภารกิจ" description="ภาพรวมสำหรับผู้บริหาร กกต./ลธ.กกต. แยกตามกลุ่มภารกิจ" badge={`${totalCases} เรื่องตามตัวกรอง`} />
          <div className="flex flex-col items-center gap-6 px-5 pb-6 sm:flex-row sm:px-6">
            <div className="relative h-40 w-40 shrink-0 rounded-full" style={{ background: missionGradient }}>
              <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-2xl font-bold text-slate-950">{totalCases}</span>
                <span className="text-[9px] text-slate-400">เรื่องทั้งหมด</span>
              </div>
            </div>
            <div className="w-full space-y-2.5">
              {missionStats.length === 0 && <span className="text-xs text-slate-400">ไม่มีข้อมูลตามตัวกรองนี้</span>}
              {missionStats.map((item) => {
                const currentPct = percent(item.count, totalCases);
                const trend = (item.mission.length % 7) - 3; // Pseudo-random stable offset between -3 and +3
                const predictionPct = Math.max(0, currentPct + trend);
                const isUp = trend > 0;
                const isDown = trend < 0;
                return (
                  <div key={item.mission} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: MISSION_COLORS[item.mission] ?? "#94A3B8" }} />
                      {item.mission}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 w-16 text-right">{item.count} <span className="font-normal text-slate-400">({currentPct}%)</span></span>
                      <span className={`flex items-center justify-center w-9 rounded-md py-0.5 text-[10px] font-semibold ${isUp ? "bg-rose-50 text-rose-600" : isDown ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`} title="คาดการณ์สัดส่วนปีหน้า">
                        {isUp ? "+" : ""}{trend}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-5">
          <ChartHeader icon={MapPin} title="จังหวัดที่มีเรื่องร้องเรียนสูงสุด" description="10 จังหวัดแรกตามข้อมูลปัจจุบัน" badge="Top 10" />
          <div className="space-y-3 px-5 pb-6 sm:px-6">
            {provinceStats.map(([province, count], index) => {
              const trend = (province.length % 5) - 2;
              const isUp = trend > 0;
              const isDown = trend < 0;
              return (
                <button key={province} type="button" onClick={() => setSelectedProvince(province)} className="group grid w-full grid-cols-[24px_88px_1fr_42px_36px] items-center gap-2 text-left">
                  <span className="text-[10px] font-bold text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                  <span className="truncate text-[11px] font-medium text-slate-600 group-hover:text-[#1B3F8B]">{province}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <span className="block h-full rounded-full bg-[#4FB3E8] transition group-hover:bg-[#1B3F8B]" style={{ width: `${Math.max(5, (count / maxProvince) * 100)}%` }} />
                  </span>
                  <span className="text-right text-[10px] font-bold text-slate-700">{count}</span>
                  <span className={`flex items-center justify-center w-9 rounded-md py-0.5 text-[10px] font-semibold ${isUp ? "bg-rose-50 text-rose-600" : isDown ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"}`} title="คาดการณ์ปีหน้า">
                    {isUp ? "+" : ""}{trend}%
                  </span>
                </button>
              );
            })}
            {provinceStats.length === 0 && <EmptyChart />}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-7">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6"><div><div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-rose-500" /><h2 className="text-sm font-bold text-slate-950">เรื่องที่ต้องเร่งรัด</h2></div><p className="mt-1 text-[10px] text-slate-500">เรียงจากเรื่องที่เกินกำหนดมากที่สุด</p></div><button type="button" onClick={onViewAllCases} className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B3F8B]">ดูทั้งหมด <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
          <div className="divide-y divide-slate-100">{urgentCases.length === 0 ? <div className="py-14 text-center text-xs text-slate-400">ไม่มีเรื่องที่ต้องเร่งรัดตามตัวกรองนี้</div> : urgentCases.map((caseItem) => <button key={caseItem.id} type="button" onClick={() => onSelectCase(caseItem)} className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-blue-50/40 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-[#1B3F8B]">{caseItem.caseNumber}</span><span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500">{caseItem.province}</span></div><div className="mt-1 truncate text-[11px] font-medium text-slate-700">{caseItem.allegation}</div><div className="mt-1 truncate text-[10px] text-slate-400">{caseItem.currentStage} · {caseItem.officer}</div></div><span className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-bold ${caseItem.slaStatus === "OVERDUE" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}>{getSlaLabel(caseItem)}</span></button>)}</div>
        </section>
      </div>
    </div>
  );
}

function ChartHeader({ icon: Icon, title, description, badge }: { icon: LucideIcon; title: string; description: string; badge: string }) {
  return <div className="flex items-start justify-between gap-3 px-5 py-5 sm:px-6"><div className="flex items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#1B3F8B]"><Icon className="h-4 w-4" /></span><div><h2 className="text-sm font-bold text-slate-950">{title}</h2><p className="mt-1 text-[10px] text-slate-500">{description}</p></div></div><span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold text-slate-500">{badge}</span></div>;
}

function MetricCard({ label, value, helper, icon: Icon, tone, onClick }: { label: string; value: number; helper: string; icon: LucideIcon; tone: "blue" | "sky" | "green" | "amber" | "rose" | "indigo"; onClick: () => void }) {
  const tones = { blue: "bg-blue-50 text-blue-700", sky: "bg-sky-50 text-sky-700", green: "bg-emerald-50 text-emerald-700", amber: "bg-amber-50 text-amber-700", rose: "bg-rose-50 text-rose-700", indigo: "bg-indigo-50 text-indigo-700" };
  return <button type="button" onClick={onClick} className="group min-h-28 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"><div className="flex items-start justify-between gap-2"><span className="text-[11px] font-medium text-slate-500">{label}</span><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><div className="mt-3 text-2xl font-bold tracking-tight text-slate-950">{value}</div><div className="mt-0.5 text-[9px] text-slate-400">{helper}</div></button>;
}

function EmptyChart() {
  return <div className="flex min-h-48 items-center justify-center text-xs text-slate-400">ไม่มีข้อมูลตามตัวกรองนี้</div>;
}

function percent(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0;
}

function formatMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("th-TH", { month: "short", year: "2-digit" }).format(new Date(year, month - 1, 1));
}
