"use client";

import { useState } from "react";
import { BarChart3, Download, Eye, FileClock, FileSpreadsheet, Filter, LockKeyhole, Plus, Search, ShieldCheck, UserCog, Users } from "lucide-react";

type GovernanceTab = "reports" | "audit" | "users";

const AUDIT_ROWS = [
  ["26 ส.ค. 2569 13:42:18", "วรากร กรณีศึกษา", "MP-CMI-2569-002", "บันทึกผลตรวจคำร้องชั้น 1", "10.24.18.42"],
  ["26 ส.ค. 2569 13:38:04", "ผอ.สนง.กกต.จว. เชียงใหม่", "MP-CMI-2569-011", "อนุมัติขยายเวลา 15 วัน", "10.24.7.18"],
  ["26 ส.ค. 2569 13:21:55", "ระบบ Workflow Engine", "MP-SKA-2569-018", "ส่งต่องานไป ผอ.ฝ่าย อัตโนมัติ", "system"],
  ["26 ส.ค. 2569 12:59:07", "เลขาคณะอนุวินิจฉัย", "MP-BKK-2569-026", "เพิ่มเรื่องเข้าวาระ 18/2569", "10.20.4.91"],
  ["26 ส.ค. 2569 12:44:33", "GIT Admin", "WF-ELECTION-12", "เผยแพร่ Workflow version 12", "10.10.1.6"],
];

const USERS = [
  ["วรากร กรณีศึกษา", "พนักงานตรวจคำร้อง ชั้น 1", "สนง.กกต.จว. เชียงใหม่", "ใช้งาน"],
  ["อารีย์ พรหมรักษ์", "ผอ.สนง.กกต.จว.", "สนง.กกต.จว. สงขลา", "ใช้งาน"],
  ["สุภาวดี วงศ์คำ", "คณะกรรมการสืบสวนฯ", "ส่วนกลาง", "ใช้งาน"],
  ["กิตติพงษ์ พัฒนกิจ", "ผอ.ฝ่าย", "สำนักสืบสวนและไต่สวน", "รออนุมัติ"],
];

export default function GovernanceCenterView() {
  const [tab, setTab] = useState<GovernanceTab>("reports");
  const [message, setMessage] = useState<string | null>(null);
  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2200);
  };

  return (
    <div className="space-y-5 pb-14">
      {message && <div className="fixed right-4 top-20 z-50 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl">{message}</div>}
      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => setTab("reports")} className={`rounded-2xl border p-4 text-left transition ${tab === "reports" ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:bg-slate-50"}`}><BarChart3 className="h-5 w-5 text-blue-700" /><div className="mt-3 text-sm font-bold text-slate-950">รายงานและสถิติ</div><div className="mt-1 text-[10px] text-slate-500">วิเคราะห์ตามประเภท สถานะ เขต และช่วงเวลา</div></button>
        <button type="button" onClick={() => setTab("audit")} className={`rounded-2xl border p-4 text-left transition ${tab === "audit" ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:bg-slate-50"}`}><FileClock className="h-5 w-5 text-blue-700" /><div className="mt-3 text-sm font-bold text-slate-950">Audit Log</div><div className="mt-1 text-[10px] text-slate-500">ผู้ดำเนินการ วันเวลา ความเห็น และสถานะ</div></button>
        <button type="button" onClick={() => setTab("users")} className={`rounded-2xl border p-4 text-left transition ${tab === "users" ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 bg-white hover:bg-slate-50"}`}><UserCog className="h-5 w-5 text-blue-700" /><div className="mt-3 text-sm font-bold text-slate-950">ผู้ใช้และสิทธิ์</div><div className="mt-1 text-[10px] text-slate-500">RBAC ตามบทบาท หน่วยงาน และพื้นที่</div></button>
      </div>

      {tab === "reports" && <ReportsPanel onNotify={notify} />}
      {tab === "audit" && <AuditPanel />}
      {tab === "users" && <UsersPanel onNotify={notify} />}
    </div>
  );
}

function ReportsPanel({ onNotify }: { onNotify: (text: string) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><h2 className="text-sm font-bold text-slate-950">รายงานสรุปเรื่องร้องคัดค้านการเลือกตั้ง</h2><p className="mt-1 text-[11px] text-slate-500">ข้อมูล ณ วันที่ 26 สิงหาคม 2569 · ทั่วประเทศ</p></div><div className="flex gap-2"><button type="button" onClick={() => onNotify("เตรียมไฟล์ Excel เรียบร้อยแล้ว")} className="btn-secondary"><FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Excel</button><button type="button" onClick={() => onNotify("เตรียมไฟล์ PDF เรียบร้อยแล้ว")} className="btn-secondary"><Download className="h-4 w-4 text-rose-600" /> PDF</button></div></div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-2xl bg-[#1B3F8B] p-5 text-white"><div className="flex items-center justify-between"><div><div className="text-[10px] uppercase tracking-wider text-slate-400">จำนวนคำร้องรายเดือน</div><div className="mt-1 text-lg font-bold">ปีงบประมาณ 2569</div></div><BarChart3 className="h-5 w-5 text-blue-300" /></div><div className="mt-8 flex h-44 items-end gap-2">{[34, 52, 48, 72, 66, 88, 94, 78, 112, 101, 126, 118].map((height, index) => <div key={index} className="group flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md bg-gradient-to-t from-blue-700 to-blue-400 transition group-hover:from-amber-600 group-hover:to-amber-300" style={{ height: `${height}px` }} /><span className="text-[8px] text-slate-500">{index + 1}</span></div>)}</div></div>
        <div className="grid grid-cols-2 gap-3"><ReportMetric label="รอตรวจคำร้อง" value="42" tone="blue" /><ReportMetric label="รอสั่งรับ" value="18" tone="amber" /><ReportMetric label="อยู่ระหว่างสืบสวน" value="96" tone="violet" /><ReportMetric label="รอวินิจฉัย" value="27" tone="rose" /><ReportMetric label="วินิจฉัยแล้ว" value="64" tone="green" /><ReportMetric label="ค่าเฉลี่ยระยะเวลา" value="48 วัน" tone="slate" /></div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><FilterCard label="ประเภท" value="ทุกประเภทคำร้อง" /><FilterCard label="พื้นที่" value="ทั่วประเทศ · 77 จังหวัด" /><FilterCard label="ช่วงเวลา" value="ต.ค. 2568 – ก.ย. 2569" /></div>
    </section>
  );
}

function AuditPanel() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><LockKeyhole className="h-4 w-4 text-blue-700" /> ประวัติการดำเนินการที่แก้ไขย้อนหลังไม่ได้</h2><p className="mt-1 text-[10px] text-slate-500">แสดง correlation ID และ IP เฉพาะผู้มีสิทธิ์ Audit</p></div><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input placeholder="ค้นหาเลขเรื่องหรือผู้ดำเนินการ" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none sm:w-72" /></label></div>
      <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase text-slate-500"><tr><th className="px-4 py-3">วันเวลา</th><th className="px-4 py-3">ผู้ดำเนินการ</th><th className="px-4 py-3">Object</th><th className="px-4 py-3">เหตุการณ์</th><th className="px-4 py-3">Source</th><th className="px-4 py-3"></th></tr></thead><tbody className="divide-y divide-slate-100">{AUDIT_ROWS.map((row) => <tr key={`${row[0]}-${row[2]}`} className="hover:bg-slate-50"><td className="px-4 py-3.5 font-kanit text-[10px] text-slate-500">{row[0]}</td><td className="px-4 py-3.5 font-semibold text-slate-800">{row[1]}</td><td className="px-4 py-3.5 font-kanit text-[10px] text-blue-700">{row[2]}</td><td className="px-4 py-3.5 text-slate-600">{row[3]}</td><td className="px-4 py-3.5 font-kanit text-[10px] text-slate-400">{row[4]}</td><td className="px-4 py-3.5 text-right"><button type="button" aria-label="ดูรายละเอียด Audit event" className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-blue-700"><Eye className="h-4 w-4" /></button></td></tr>)}</tbody></table></div>
    </section>
  );
}

function UsersPanel({ onNotify }: { onNotify: (text: string) => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-sm font-bold text-slate-950"><Users className="h-4 w-4 text-blue-700" /> ผู้ใช้งานและสิทธิ์ตามบทบาท</h2><p className="mt-1 text-[10px] text-slate-500">ใช้หลัก least privilege และจำกัดข้อมูลตามหน่วยงาน/จังหวัด</p></div><button type="button" onClick={() => onNotify("เปิดแบบฟอร์มเพิ่มผู้ใช้งานใหม่แล้ว")} className="btn-primary"><Plus className="h-4 w-4" /> เพิ่มผู้ใช้งาน</button></div><div className="divide-y divide-slate-100">{USERS.map(([name, role, office, status]) => <div key={name} className="grid gap-3 p-4 sm:grid-cols-[1.1fr_1.2fr_1.2fr_auto] sm:items-center"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">{name.charAt(0)}</span><span className="text-xs font-bold text-slate-900">{name}</span></div><div className="text-[11px] text-slate-600">{role}</div><div className="text-[11px] text-slate-500">{office}</div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${status === "ใช้งาน" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{status}</span></div>)}</div><div className="border-t border-slate-100 bg-slate-50 p-4 text-[10px] leading-5 text-slate-500"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-600" /> การเพิ่มบทบาทที่มีสิทธิ์วินิจฉัย อนุมัติขยายเวลา หรือเผยแพร่ Workflow ต้องใช้ dual approval</div></section>
  );
}

function ReportMetric({ label, value, tone }: { label: string; value: string; tone: "blue" | "amber" | "violet" | "rose" | "green" | "slate" }) { const tones = { blue: "bg-blue-50 text-blue-800", amber: "bg-amber-50 text-amber-800", violet: "bg-blue-50 text-blue-800", rose: "bg-rose-50 text-rose-800", green: "bg-emerald-50 text-emerald-800", slate: "bg-slate-100 text-slate-800" }; return <div className={`rounded-xl p-4 ${tones[tone]}`}><div className="text-[10px] font-bold uppercase opacity-70">{label}</div><div className="mt-2 text-xl font-bold">{value}</div></div>; }
function FilterCard({ label, value }: { label: string; value: string }) { return <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-slate-400"><Filter className="h-3 w-3" /> {label}</div><div className="mt-1 text-xs font-semibold text-slate-700">{value}</div></div>; }
