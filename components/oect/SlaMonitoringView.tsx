"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BellRing, CheckCircle2, Clock3, Filter, Search, ShieldAlert } from "lucide-react";
import { getSlaLabel, type ComplaintItem } from "@/components/oect/complaintDomain";

export default function SlaMonitoringView({ cases, onSelectCase }: { cases: ComplaintItem[]; onSelectCase: (caseItem: ComplaintItem) => void }) {
  const [status, setStatus] = useState("ALL");
  const [query, setQuery] = useState("");
  const filteredCases = useMemo(() => cases.filter((item) => {
    if (status !== "ALL" && item.slaStatus !== status) return false;
    if (query.trim()) {
      const target = `${item.caseNumber} ${item.province} ${item.officer} ${item.currentStage}`.toLowerCase();
      if (!target.includes(query.toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => a.remainingDays - b.remainingDays), [cases, query, status]);

  const counts = {
    overdue: cases.filter((item) => item.slaStatus === "OVERDUE").length,
    near: cases.filter((item) => item.slaStatus === "NEAR_DUE").length,
    normal: cases.filter((item) => item.slaStatus === "NORMAL").length,
    completed: cases.filter((item) => item.slaStatus === "COMPLETED").length,
  };

  return (
    <div className="space-y-5 pb-14">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SlaCard label="เกินกำหนด" value={counts.overdue} helper="ต้องรายงานและเร่งรัด" icon={ShieldAlert} tone="rose" />
        <SlaCard label="ใกล้ครบกำหนด" value={counts.near} helper="เหลือน้อยกว่า 5 วัน" icon={AlertTriangle} tone="amber" />
        <SlaCard label="อยู่ในกำหนด" value={counts.normal} helper="ติดตามตามรอบปกติ" icon={Clock3} tone="green" />
        <SlaCard label="เสร็จสิ้น" value={counts.completed} helper="ปิดตัวจับเวลาแล้ว" icon={CheckCircle2} tone="blue" />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><BellRing className="h-4 w-4 text-blue-700" /> SLA Monitoring ทุกคำร้อง/สำนวน</h2>
            <p className="mt-1 text-[11px] text-slate-500">คำนวณจาก Workflow version และเวลาทำการของแต่ละขั้นตอน</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาเลขเรื่อง ผู้รับผิดชอบ..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500 sm:w-64" />
            </label>
            <label className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs outline-none focus:border-blue-500">
                <option value="ALL">ทุกสถานะ SLA</option>
                <option value="OVERDUE">เกินกำหนด</option>
                <option value="NEAR_DUE">ใกล้ครบกำหนด</option>
                <option value="NORMAL">ปกติ</option>
                <option value="COMPLETED">เสร็จสิ้น</option>
              </select>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">เลขที่คำร้อง</th><th className="px-4 py-3">ขั้นตอน/หน่วยงาน</th><th className="px-4 py-3">ผู้รับผิดชอบ</th><th className="px-4 py-3">กรอบเวลา</th><th className="px-4 py-3">เวลาคงเหลือ</th><th className="px-4 py-3">ความคืบหน้า</th><th className="px-4 py-3 text-right">การดำเนินการ</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.slice(0, 18).map((caseItem) => {
                const overdue = caseItem.slaStatus === "OVERDUE";
                const near = caseItem.slaStatus === "NEAR_DUE";
                const completed = caseItem.slaStatus === "COMPLETED";
                const elapsed = completed ? 100 : Math.max(0, Math.min(100, Math.round(((caseItem.slaDays - Math.max(caseItem.remainingDays, 0)) / Math.max(caseItem.slaDays, 1)) * 100)));
                return (
                  <tr key={caseItem.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3.5"><div className="font-bold text-slate-900">{caseItem.caseNumber}</div><div className="mt-1 text-[10px] text-slate-400">จ.{caseItem.province} · {caseItem.allegation}</div></td>
                    <td className="px-4 py-3.5"><div className="max-w-56 font-medium text-slate-800">{caseItem.currentStage}</div><div className="mt-1 text-[10px] text-slate-400">{caseItem.currentSection}</div></td>
                    <td className="px-4 py-3.5 text-slate-600">{caseItem.officer}</td>
                    <td className="px-4 py-3.5"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">{caseItem.slaDays} วัน</span></td>
                    <td className="px-4 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${overdue ? "bg-rose-100 text-rose-700" : near ? "bg-amber-100 text-amber-700" : completed ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>{getSlaLabel(caseItem)}</span></td>
                    <td className="px-4 py-3.5"><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${overdue ? "bg-rose-600" : near ? "bg-amber-500" : completed ? "bg-blue-600" : "bg-emerald-500"}`} style={{ width: `${elapsed}%` }} /></div><span className="text-[10px] text-slate-500">{elapsed}%</span></div></td>
                    <td className="px-4 py-3.5 text-right"><button type="button" onClick={() => onSelectCase(caseItem)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-white">เปิดสำนวน</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SlaCard({ label, value, helper, icon: Icon, tone }: { label: string; value: number; helper: string; icon: typeof Clock3; tone: "rose" | "amber" | "green" | "blue" }) {
  const tones = { rose: "border-rose-200 bg-rose-50 text-rose-700", amber: "border-amber-200 bg-amber-50 text-amber-700", green: "border-emerald-200 bg-emerald-50 text-emerald-700", blue: "border-blue-200 bg-blue-50 text-blue-700" };
  return <div className={`rounded-2xl border p-4 ${tones[tone]}`}><div className="flex items-center justify-between"><span className="text-xs font-bold">{label}</span><Icon className="h-5 w-5" /></div><div className="mt-4 text-3xl font-bold">{value}</div><div className="mt-1 text-[10px] opacity-75">{helper}</div></div>;
}
