"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  FileClock,
  GitBranch,
  KeyRound,
  LockKeyhole,
  LogOut,
  MapPinned,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users,
} from "lucide-react";
import initialCasesData from "@/data/complaintsData.json";
import CaseDetailModal from "@/components/oect/CaseDetailModal";
import CaseListView from "@/components/oect/CaseListView";
import DashboardView from "@/components/oect/DashboardView";
import NewComplaintForm from "@/components/oect/NewComplaintForm";
import { WORKFLOW_STEPS, type ComplaintItem } from "@/components/oect/complaintDomain";

type AdminView = "overview" | "cases" | "users" | "workflow" | "master" | "integrations" | "security";

const NAV_ITEMS = [
  { id: "overview" as const, label: "ภาพรวมระบบ", description: "ข้อมูลคำร้องและ SLA", icon: BarChart3 },
  { id: "cases" as const, label: "รายการเรื่องร้องเรียน", description: "ทะเบียนคำร้องและสำนวน", icon: FileText },
  { id: "users" as const, label: "ผู้ใช้และสิทธิ์", description: "User, Role และหน่วยงาน", icon: UserCog },
  { id: "workflow" as const, label: "Workflow และ SLA", description: "เวอร์ชัน ขั้นตอน และกฎเวลา", icon: GitBranch },
  { id: "master" as const, label: "ข้อมูลพื้นฐาน", description: "จังหวัด เขตเลือกตั้ง และแบบฟอร์ม", icon: MapPinned },
  { id: "integrations" as const, label: "ระบบเชื่อมโยง", description: "DXC, e-Saraban, PRAXTICOL", icon: Database },
  { id: "security" as const, label: "Security และ Audit", description: "นโยบาย Log และ Session", icon: ShieldCheck },
];

const PAGE_META: Record<AdminView, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "System overview", title: "ภาพรวมข้อมูลและการกำกับระบบ", description: "ติดตามข้อมูลคำร้อง สถานะ Workflow และ SLA จากฐานข้อมูลชุดเดียวกับพื้นที่ทำงานเจ้าหน้าที่" },
  cases: { eyebrow: "Complaint registry", title: "รายการเรื่องร้องเรียนทั้งหมด", description: "ค้นหา กรอง ตรวจสอบ และเปิดรายละเอียดคำร้องหรือสำนวนจากทะเบียนกลาง" },
  users: { eyebrow: "Identity & Access Management", title: "ผู้ใช้งาน บทบาท และสิทธิ์เข้าถึง", description: "กำหนดสิทธิ์ตามบทบาท หน่วยงาน จังหวัด และขั้นตอนของ Workflow ด้วยหลัก least privilege" },
  workflow: { eyebrow: "Versioned Workflow Administration", title: "Workflow และกฎ SLA", description: "ออกแบบ ทบทวน และเผยแพร่ขั้นตอนโดยไม่เปลี่ยนกฎกลางสำนวนที่กำลังดำเนินการ" },
  master: { eyebrow: "Master Data Governance", title: "ข้อมูลพื้นฐานและแบบฟอร์มมาตรฐาน", description: "ดูแลจังหวัด อำเภอ ตำบล เขตเลือกตั้ง ประเภทคำร้อง และแบบ สตว.1/สตว.1/1" },
  integrations: { eyebrow: "Government Data Exchange", title: "การเชื่อมโยงระบบภายนอก", description: "กำกับ endpoint, certificate, retry policy และประวัติการเชื่อมต่อของแต่ละระบบ" },
  security: { eyebrow: "Security, Privacy & Audit", title: "นโยบายความปลอดภัยและการตรวจสอบ", description: "กำกับ 2FA, Auto logout, Data masking, Retention และ Audit event ที่แก้ไขย้อนหลังไม่ได้" },
};

export default function AdminConsolePage() {
  const [cases, setCases] = useState<ComplaintItem[]>(initialCasesData as ComplaintItem[]);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [selectedCase, setSelectedCase] = useState<ComplaintItem | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [caseStatusFilter, setCaseStatusFilter] = useState("ALL");
  const [message, setMessage] = useState<string | null>(null);
  const meta = PAGE_META[activeView];

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 2400);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {message && <div className="fixed right-4 top-20 z-50 flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-xs font-bold text-emerald-800 shadow-xl"><CheckCircle2 className="h-4 w-4" /> {message}</div>}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex min-w-0 items-center gap-3"><span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-amber-300 bg-white"><Image src="/oect-logo.png" alt="ตราสัญลักษณ์สำนักงานคณะกรรมการการเลือกตั้ง" fill sizes="40px" className="object-contain p-1" priority /></span><span><span className="block text-sm font-bold">ECT-CMS</span><span className="block text-[10px] text-slate-500">System Administration Center</span></span></Link>
          <div className="flex items-center gap-2"><Link href="/user?role=intake" className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:inline-flex"><SlidersHorizontal className="h-4 w-4" /> ระบบงานเจ้าหน้าที่</Link><button type="button" aria-label="การแจ้งเตือนผู้ดูแลระบบ" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" /></button><span className="hidden items-center gap-2 border-l border-slate-200 pl-3 md:flex"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1B3F8B] text-xs font-bold text-white">GA</span><span><span className="block text-xs font-bold">GIT Admin</span><span className="block text-[10px] text-slate-500">Super Admin · 2FA</span></span></span><Link href="/login" aria-label="ออกจากระบบ" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"><LogOut className="h-4 w-4" /></Link></div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-[1680px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:sticky lg:top-16 lg:flex lg:h-[calc(100vh-64px)] lg:flex-col lg:overflow-y-auto">
          <div className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">การกำกับระบบ</div>
          <AdminNavigation activeView={activeView} onSelect={setActiveView} />
          <div className="mt-auto rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-900"><ShieldCheck className="h-4 w-4" /> Security baseline ผ่าน</div><div className="mt-2 text-[10px] leading-5 text-emerald-700">2FA 100% · Session policy v4 · ไม่มี Critical finding</div></div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:hidden"><AdminNavigation activeView={activeView} onSelect={setActiveView} horizontal /></div>
          <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-400"><span>ผู้ดูแลระบบ</span><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-[#1B3F8B]">{meta.title}</span></div>
          <section className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" /> {meta.eyebrow}</div><h1 className="mt-2 text-xl font-bold tracking-tight text-[#1B3F8B] sm:text-2xl">{meta.title}</h1><p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">{meta.description}</p></div><button type="button" onClick={() => activeView === "overview" || activeView === "cases" ? setIsNewComplaintOpen(true) : notify(activeView === "users" ? "เปิดแบบฟอร์มเพิ่มผู้ใช้งานแล้ว" : "สร้างรายการฉบับร่างใหม่แล้ว")} className="btn-primary w-fit"><Plus className="h-4 w-4" /> {activeView === "overview" || activeView === "cases" ? "บันทึกเรื่องใหม่" : activeView === "users" ? "เพิ่มผู้ใช้งาน" : "สร้างรายการใหม่"}</button></div>
          </section>

          {activeView === "overview" && <DashboardView cases={cases} roleId="admin" onSelectCase={setSelectedCase} onViewAllCases={() => { setCaseStatusFilter("ALL"); setActiveView("cases"); }} onFilterStatus={(status) => { setCaseStatusFilter(status); setActiveView("cases"); }} />}
          {activeView === "cases" && <CaseListView cases={cases} onSelectCase={setSelectedCase} openNewModal={() => setIsNewComplaintOpen(true)} statusFilter={caseStatusFilter} setStatusFilter={setCaseStatusFilter} />}
          {activeView === "users" && <UsersPanel cases={cases} onNotify={notify} />}
          {activeView === "workflow" && <WorkflowPanel onNotify={notify} />}
          {activeView === "master" && <MasterDataPanel cases={cases} />}
          {activeView === "integrations" && <IntegrationsPanel onNotify={notify} />}
          {activeView === "security" && <SecurityPanel />}
        </main>
      </div>
      {selectedCase && <CaseDetailModal caseItem={selectedCase} onClose={() => setSelectedCase(null)} />}
      {isNewComplaintOpen && <NewComplaintForm mode="officer" onClose={() => setIsNewComplaintOpen(false)} onAddCase={(newCase) => setCases((currentCases) => [newCase, ...currentCases])} />}
    </div>
  );
}

function AdminNavigation({ activeView, onSelect, horizontal = false }: { activeView: AdminView; onSelect: (view: AdminView) => void; horizontal?: boolean }) {
  return <nav className={horizontal ? "flex min-w-max gap-1" : "space-y-1.5"} aria-label="เมนูผู้ดูแลระบบ">{NAV_ITEMS.map((item) => { const Icon = item.icon; const active = item.id === activeView; return <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={`${horizontal ? "min-w-40" : "w-full"} flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-[#1B3F8B] text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-[#1B3F8B]"}`}><Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-white" : "text-slate-400"}`} /><span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.label}</span>{active && !horizontal && <ChevronRight className="h-4 w-4 text-white/70" />}</button>; })}</nav>;
}

function UsersPanel({ cases, onNotify }: { cases: ComplaintItem[]; onNotify: (text: string) => void }) {
  const officerNames = Array.from(new Set(cases.map((item) => item.officer)));
  const users = officerNames.slice(0, 8).map((name) => {
    const assignedCases = cases.filter((item) => item.officer === name);
    const sample = assignedCases[0];
    return { name, role: getRoleForStage(sample.stageId), office: sample.currentSection === "สนง.กกต.จว." ? `สนง.กกต.จว. ${sample.province}` : sample.currentSection, caseCount: assignedCases.length };
  });
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-sm font-bold"><Users className="h-4 w-4 text-blue-700" /> เจ้าหน้าที่ในชุดข้อมูล {officerNames.length} บัญชี</h2><p className="mt-1 text-[10px] text-slate-500">เชื่อมโยงจากผู้รับผิดชอบในทะเบียนเรื่องร้องเรียน {cases.length} เรื่อง</p></div><label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input placeholder="ค้นหาชื่อ บทบาท หรือหน่วยงาน" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-blue-500 sm:w-72" /></label></div><div className="divide-y divide-slate-100">{users.map(({ name, role, office, caseCount }) => <div key={name} className="grid gap-3 p-4 sm:grid-cols-[1.1fr_1.2fr_1.2fr_auto] sm:items-center"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-800">{name.charAt(0)}</span><div><div className="text-xs font-bold">{name}</div><div className="mt-0.5 text-[9px] text-slate-400">Verified · OTP enabled</div></div></div><div className="text-[11px] text-slate-600">{role}</div><div className="text-[11px] text-slate-500">{office}<div className="mt-1 text-[9px] text-slate-400">รับผิดชอบ {caseCount} เรื่อง</div></div><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-700">ใช้งาน</span><button type="button" onClick={() => onNotify(`เปิดสิทธิ์ของ ${name}`)} aria-label={`จัดการสิทธิ์ ${name}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-700"><KeyRound className="h-4 w-4" /></button></div></div>)}</div><div className="border-t border-slate-100 bg-slate-50 p-4 text-[10px] text-slate-500"><LockKeyhole className="mr-1 inline h-3.5 w-3.5 text-emerald-600" /> บทบาทวินิจฉัย อนุมัติขยายเวลา และเผยแพร่ Workflow ต้องผ่าน dual approval</div></section>;
}

function getRoleForStage(stageId: number) {
  if (stageId <= 1) return "พนักงานตรวจคำร้อง";
  if (stageId === 2 || stageId === 4) return "ผอ.สนง.กกต.จว.";
  if (stageId === 3) return "คณะกรรมการสืบสวนและไต่สวน";
  if (stageId <= 6) return "ผู้ตรวจสำนวนส่วนกลาง";
  if (stageId === 7) return "เลขาคณะอนุวินิจฉัย";
  if (stageId === 8) return "กกต.";
  return "ลธ.กกต. / งานแจ้งผล";
}

function WorkflowPanel({ onNotify }: { onNotify: (text: string) => void }) {
  const versions = [["ร้องคัดค้านการเลือกตั้ง สส.", "v12", "เผยแพร่", "26 ส.ค. 2569"], ["ร้องคัดค้านการเลือกตั้งท้องถิ่น", "v8", "เผยแพร่", "18 ส.ค. 2569"], ["สำนวนตรวจส่วนกลาง", "v5-draft", "ฉบับร่าง", "วันนี้ 11:20"]];
  return <div className="space-y-5"><div className="grid gap-3 sm:grid-cols-4"><AdminMetric label="Workflow เผยแพร่" value="2" /><AdminMetric label="ขั้นตอนกระบวนงาน" value={String(WORKFLOW_STEPS.length)} /><AdminMetric label="กฎ SLA ที่กำหนด" value={String(WORKFLOW_STEPS.filter((step) => step.slaDays !== null).length)} /><AdminMetric label="รออนุมัติ" value="1" /></div><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold">Workflow versions</h2><div className="mt-4 space-y-3">{versions.map(([name, version, status, updated]) => <div key={name} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center"><div><div className="text-xs font-bold">{name}</div><div className="mt-1 text-[10px] text-slate-500">ปรับปรุง {updated}</div></div><span className="font-kanit text-[10px] font-bold text-blue-700">{version}</span><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${status === "เผยแพร่" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{status}</span><button type="button" onClick={() => onNotify(`เปิด ${name} ใน Workflow designer`)} className="btn-secondary">เปิด Designer</button></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold">SLA อ้างอิงจาก Workflow กลาง</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><RuleCard title="ตรวจคำร้อง" value="3 วัน" escalation="แจ้งเตือนเมื่อเหลือ 1 วัน" /><RuleCard title="สืบสวนและไต่สวน" value="20 / 90 วัน" escalation="ขยาย 15 + 15 วัน" /><RuleCard title="จัดทำคำวินิจฉัย" value="60 วัน" escalation="แจ้งเตือนที่ 45 วัน" /></div></section></div>;
}

function MasterDataPanel({ cases }: { cases: ComplaintItem[] }) { const provinces = new Set(cases.map((item) => item.province)).size; const districts = new Set(cases.map((item) => `${item.province}:${item.district}`)).size; const electionTypes = new Set(cases.map((item) => item.electionType)).size; const allegations = new Set(cases.map((item) => item.allegation)).size; return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><MasterCard title="จังหวัดและอำเภอในชุดข้อมูล" count={`${provinces} จังหวัด · ${districts} อำเภอ`} status="POC 300 เรื่อง" /><MasterCard title="เขตเลือกตั้ง" count={`${new Set(cases.map((item) => item.constituency)).size} รูปแบบเขตในชุดข้อมูล`} status="PRAXTICOL" /><MasterCard title="ประเภทการเลือกตั้ง" count={`${electionTypes} ประเภทที่มีข้อมูล`} status="ใช้งาน" /><MasterCard title="ข้อกล่าวหา" count={`${allegations} รายการในชุดข้อมูล`} status="ใช้งาน" /><MasterCard title="แบบฟอร์มมาตรฐาน" count="สตว.1 · สตว.1/1" status="ตาม Workflow" /><MasterCard title="ปฏิทินวันทำการ" count="ปี 2569" status="ประกาศแล้ว" /></div>; }

function IntegrationsPanel({ onNotify }: { onNotify: (text: string) => void }) { const items = [["DXC / Linkage Center", "ตรวจสอบตัวตนและทะเบียนราษฎร", "128 ms"], ["e-Saraban", "รับ-ส่งหนังสือและเลขสารบรรณ", "214 ms"], ["PRAXTICOL", "เขตเลือกตั้ง ผู้สมัคร และผลการเลือกตั้ง", "176 ms"]]; return <div className="grid gap-4 lg:grid-cols-3">{items.map(([name, description, latency]) => <article key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Database className="h-5 w-5" /></span><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Online</span></div><h2 className="mt-4 text-sm font-bold">{name}</h2><p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{description}</p><div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[10px] text-slate-500"><span>Response time</span><span className="font-kanit font-bold text-slate-800">{latency}</span></div><button type="button" onClick={() => onNotify(`ตรวจสอบ ${name} สำเร็จ`)} className="btn-secondary mt-4 w-full"><RefreshCw className="h-4 w-4" /> ตรวจสอบการเชื่อมต่อ</button></article>)}</div>; }

function SecurityPanel() { return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-5 w-5 text-emerald-600" /> Security controls</h2><div className="mt-5 grid gap-3 sm:grid-cols-2"><SecurityControl title="Authentication" value="Password + OTP / ThaID" /><SecurityControl title="Session" value="Auto logout 15 นาที" /><SecurityControl title="Data encryption" value="TLS 1.3 / AES-256" /><SecurityControl title="Data masking" value="เปิดใช้ทุกบทบาท" /><SecurityControl title="Audit retention" value="รออนุมัติจาก DPO" /><SecurityControl title="OWASP Top 10" value="ไม่พบ Critical finding" /></div></section><aside className="rounded-2xl bg-[#1B3F8B] p-5 text-white shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Audit health</h2><FileClock className="h-5 w-5 text-blue-300" /></div><div className="mt-6 text-4xl font-bold text-emerald-400">100%</div><p className="mt-2 text-xs leading-5 text-slate-400">เหตุการณ์เปลี่ยนสถานะใน 24 ชั่วโมงมี actor, role, timestamp และ correlation ID ครบถ้วน</p><div className="mt-5 space-y-3"><HealthRow label="Events วันนี้" value="18,426" /><HealthRow label="Failed writes" value="0" /><HealthRow label="Integrity check" value="ผ่าน 13:00" /></div></aside></div>; }

function AdminMetric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="text-[10px] font-bold uppercase text-slate-400">{label}</div><div className="mt-2 text-2xl font-bold text-blue-800">{value}</div></div>; }
function RuleCard({ title, value, escalation }: { title: string; value: string; escalation: string }) { return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="text-xs font-bold">{title}</div><div className="mt-2 text-xl font-bold text-blue-800">{value}</div><div className="mt-1 text-[10px] text-slate-500">{escalation}</div></div>; }
function MasterCard({ title, count, status }: { title: string; count: string; status: string }) { return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Settings2 className="h-5 w-5" /></span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold text-slate-600">{status}</span></div><h2 className="mt-4 text-sm font-bold">{title}</h2><p className="mt-2 text-xs text-slate-500">{count}</p><button type="button" className="mt-4 text-[11px] font-bold text-blue-700">จัดการข้อมูล <ChevronRight className="inline h-4 w-4" /></button></article>; }
function SecurityControl({ title, value }: { title: string; value: string }) { return <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"><div><div className="text-xs font-bold">{title}</div><div className="mt-1 text-[10px] text-slate-500">{value}</div></div><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /></div>; }
function HealthRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-xs"><span className="text-slate-400">{label}</span><span className="font-bold text-white">{value}</span></div>; }
