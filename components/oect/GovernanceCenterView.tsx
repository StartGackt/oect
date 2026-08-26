"use client";

import { useMemo, useState } from "react";
import { BarChart3, Eye, FileClock, Search, ShieldCheck, UserCog } from "lucide-react";
import { formatThaiDate, type ComplaintItem } from "@/components/oect/complaintDomain";

type GovernanceTab = "reports" | "audit" | "users";

export default function GovernanceCenterView({ cases }: { cases: ComplaintItem[] }) {
  const [tab, setTab] = useState<GovernanceTab>("reports");
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-5 pb-14">
      <div className="grid gap-3 sm:grid-cols-3">
        <GovernanceTabButton active={tab === "reports"} onClick={() => setTab("reports")} icon={BarChart3} title="รายงานและสถิติ" description="สรุปจากทะเบียนคำร้องปัจจุบัน" />
        <GovernanceTabButton active={tab === "audit"} onClick={() => setTab("audit")} icon={FileClock} title="ประวัติการดำเนินการ" description="เรื่อง ผู้รับผิดชอบ และสถานะล่าสุด" />
        <GovernanceTabButton active={tab === "users"} onClick={() => setTab("users")} icon={UserCog} title="ผู้รับผิดชอบ" description="ภาระงานจากข้อมูลผู้รับผิดชอบจริง" />
      </div>

      {tab === "reports" && <ReportsPanel cases={cases} />}
      {tab === "audit" && <AuditPanel cases={cases} query={query} setQuery={setQuery} />}
      {tab === "users" && <UsersPanel cases={cases} query={query} setQuery={setQuery} />}
    </div>
  );
}

function ReportsPanel({ cases }: { cases: ComplaintItem[] }) {
  const monthlyStats = useMemo(() => {
    const counts = new Map<string, number>();
    cases.forEach((item) => {
      const month = item.receivedDate.slice(0, 7);
      counts.set(month, (counts.get(month) ?? 0) + 1);
    });
    return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b)).slice(-8);
  }, [cases]);
  const maxCount = Math.max(...monthlyStats.map(([, count]) => count), 1);
  const normal = cases.filter((item) => item.slaStatus === "NORMAL").length;
  const near = cases.filter((item) => item.slaStatus === "NEAR_DUE").length;
  const overdue = cases.filter((item) => item.slaStatus === "OVERDUE").length;
  const completed = cases.filter((item) => item.slaStatus === "COMPLETED").length;
  const averageSla = cases.length ? Math.round(cases.reduce((sum, item) => sum + item.slaDays, 0) / cases.length) : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6"><h2 className="text-sm font-bold text-slate-950">รายงานสรุปเรื่องร้องคัดค้านการเลือกตั้ง</h2><p className="mt-1 text-[10px] text-slate-500">คำนวณจากทะเบียนกลาง {cases.length} เรื่อง</p></div>
      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-[#1B3F8B] p-5 text-white"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-[0.14em] text-blue-200">แนวโน้มรับเรื่อง</div><div className="mt-1 text-base font-bold">8 เดือนล่าสุดที่มีข้อมูล</div></div><BarChart3 className="h-5 w-5 text-[#FFD600]" /></div><div className="mt-7 flex h-48 min-w-0 items-end gap-2">{monthlyStats.map(([month, count]) => <div key={month} className="group flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[9px] font-semibold text-white/0 transition group-hover:text-white">{count}</span><span className="block w-full max-w-10 rounded-t-md bg-[#4FB3E8] transition group-hover:bg-[#FFD600]" style={{ height: `${Math.max(8, (count / maxCount) * 100)}%` }} /><span className="text-[8px] text-blue-200">{formatMonth(month)}</span></div>)}</div></div>
        <div className="grid grid-cols-2 gap-3"><ReportMetric label="อยู่ในเกณฑ์" value={normal} tone="blue" /><ReportMetric label="ใกล้ครบกำหนด" value={near} tone="amber" /><ReportMetric label="เกินกำหนด" value={overdue} tone="rose" /><ReportMetric label="เสร็จสิ้น" value={completed} tone="green" /><ReportMetric label="SLA เฉลี่ยต่อขั้น" value={`${averageSla} วัน`} tone="slate" /><ReportMetric label="ผู้รับผิดชอบ" value={new Set(cases.map((item) => item.officer)).size} tone="blue" /></div>
      </div>
    </section>
  );
}

function AuditPanel({ cases, query, setQuery }: { cases: ComplaintItem[]; query: string; setQuery: (value: string) => void }) {
  const rows = useMemo(() => [...cases]
    .filter((item) => `${item.caseNumber} ${item.officer} ${item.currentStage}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => b.receivedDate.localeCompare(a.receivedDate))
    .slice(0, 15), [cases, query]);

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><PanelHeader icon={FileClock} title="ประวัติสถานะล่าสุดจากทะเบียนกลาง" description="ใช้ข้อมูลเรื่อง ผู้รับผิดชอบ ขั้นตอน และหน่วยงานจากชุดเดียวกับหน้า List" query={query} setQuery={setQuery} /><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-xs"><thead className="bg-slate-50 text-[10px] text-slate-500"><tr><th className="px-4 py-3">วันที่รับเรื่อง</th><th className="px-4 py-3">ผู้รับผิดชอบ</th><th className="px-4 py-3">เลขที่เรื่อง</th><th className="px-4 py-3">สถานะล่าสุด</th><th className="px-4 py-3">หน่วยงาน</th><th className="px-4 py-3">Correlation</th><th className="px-4 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{rows.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-4 py-3.5 text-[10px] text-slate-500">{formatThaiDate(item.receivedDate)}</td><td className="px-4 py-3.5 font-semibold text-slate-800">{item.officer}</td><td className="px-4 py-3.5 font-kanit text-[10px] text-blue-700">{item.caseNumber}</td><td className="px-4 py-3.5 text-slate-600">{item.currentStage}</td><td className="px-4 py-3.5 text-[10px] text-slate-500">{item.currentSection}</td><td className="px-4 py-3.5 font-kanit text-[9px] text-slate-400">ECT-{String(item.id).padStart(6, "0")}</td><td className="px-4 py-3.5 text-right"><Eye className="inline h-4 w-4 text-slate-300" /></td></tr>)}</tbody></table></div></section>;
}

function UsersPanel({ cases, query, setQuery }: { cases: ComplaintItem[]; query: string; setQuery: (value: string) => void }) {
  const users = useMemo(() => Array.from(new Set(cases.map((item) => item.officer))).map((name) => {
    const assigned = cases.filter((item) => item.officer === name);
    const urgent = assigned.filter((item) => item.slaStatus === "NEAR_DUE" || item.slaStatus === "OVERDUE").length;
    return { name, assigned: assigned.length, urgent, section: assigned[0]?.currentSection ?? "-" };
  }).filter((item) => `${item.name} ${item.section}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => b.assigned - a.assigned).slice(0, 20), [cases, query]);

  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><PanelHeader icon={UserCog} title="ผู้รับผิดชอบในทะเบียนคำร้อง" description="จำนวนงานและงานเร่งรัดคำนวณจากข้อมูลคำร้องจริง" query={query} setQuery={setQuery} /><div className="divide-y divide-slate-100">{users.map((user) => <div key={user.name} className="grid gap-3 p-4 sm:grid-cols-[1.2fr_1fr_auto_auto] sm:items-center"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">{user.name.charAt(0)}</span><span className="text-xs font-bold text-slate-900">{user.name}</span></div><span className="text-[11px] text-slate-500">{user.section}</span><span className="text-[10px] font-semibold text-slate-600">{user.assigned} เรื่อง</span><span className={`w-fit rounded-full px-2.5 py-1 text-[9px] font-bold ${user.urgent ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{user.urgent ? `${user.urgent} เร่งรัด` : "ปกติ"}</span></div>)}</div><div className="border-t border-slate-100 bg-slate-50 p-4 text-[10px] leading-5 text-slate-500"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-600" /> แสดงเฉพาะผู้รับผิดชอบที่ปรากฏในทะเบียนกลางปัจจุบัน</div></section>;
}

function GovernanceTabButton({ active, onClick, icon: Icon, title, description }: { active: boolean; onClick: () => void; icon: typeof BarChart3; title: string; description: string }) {
  return <button type="button" onClick={onClick} className={`rounded-2xl border p-4 text-left transition ${active ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:bg-slate-50"}`}><Icon className="h-5 w-5 text-blue-700" /><div className="mt-3 text-sm font-bold text-slate-950">{title}</div><div className="mt-1 text-[10px] text-slate-500">{description}</div></button>;
}

function PanelHeader({ icon: Icon, title, description, query, setQuery }: { icon: typeof FileClock; title: string; description: string; query: string; setQuery: (value: string) => void }) {
  return <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><Icon className="h-4 w-4 text-blue-700" /> {title}</h2><p className="mt-1 text-[10px] text-slate-500">{description}</p></div><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาเลขเรื่องหรือผู้รับผิดชอบ" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500 sm:w-72" /></label></div>;
}

function ReportMetric({ label, value, tone }: { label: string; value: string | number; tone: "blue" | "amber" | "rose" | "green" | "slate" }) {
  const tones = { blue: "bg-blue-50 text-blue-800", amber: "bg-amber-50 text-amber-800", rose: "bg-rose-50 text-rose-800", green: "bg-emerald-50 text-emerald-800", slate: "bg-slate-100 text-slate-800" };
  return <div className={`rounded-xl p-4 ${tones[tone]}`}><div className="text-[9px] font-bold uppercase opacity-70">{label}</div><div className="mt-2 text-xl font-bold">{value}</div></div>;
}

function formatMonth(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("th-TH", { month: "short" }).format(new Date(year, month - 1, 1));
}
